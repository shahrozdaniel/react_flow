"use client";

import {
  AutomationContext,
  sidebarContext,
} from "@/app/ui/automationFlow/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";
import ActionRequiredSubForm from "./actionRequiredSubForm";

// replyBackToSender
// notifyOther
// replyAndNotifyBoth
// tag
// addToContact

export default function ActionRequiredForm({ nextActionState }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);
  // const { sidebarState, setSidebarState } = useContext(sidebarContext);
  const { addNewNode, editNode } = useReactFlowNode();
  const [shouldshowActionType, setShouldShowActionType] = useState(false);
  const [shouldshowActionTypeOther, setShouldShowActionTypeOther] =
    useState(false);
  const [shouldShowNotifierNumber, setShouldShowNotifierNumber] =
    useState(false);
  const [showNextOptions, setShowNextOptions] = useState<string | null>(null);
  const [showNextOptionOthers, setShowNextOptionOthers] = useState<
    string | null
  >(null);

  // console.log('formDetails', formDetails);
  const { label } = nextActionState;
  const { nodeInnerNextActionType: type } = automationState;
  // console.log('description', description);

  const formSchemaObj: any = {
    tag: z
      .string()
      .min(2, {
        message: "Please enter tag.",
      })
      .optional()
      .or(z.literal("")),
    taggingContactList: z
      .string()
      .min(2, {
        message: "Please select contact list.",
      })
      .optional()
      .or(z.literal("")),
  };

  const actionTypeOptions = {
    whatsAppTemplate: "Whatsapp Template",
    whatsAppMessage: "Whatsapp Message",
    addToDNC: "Add to DNC",
    addToContact: "Add to Contact",
  };

  const actionTypeOtherOptions = [
    { id: "whatsAppTemplate", label: "Whatsapp Template" },
  ];
  // const showWhenReplyBack = ["actionType"];
  // const showWhenNotifyOther = ["notifierNumber", "actionTypeOther"];

  if (type === "replyBackToSender" || type === "replyAndNotifyBoth") {
    formSchemaObj["actionType"] = z.string().min(4, {
      message: "Please select action type.",
    });
    formSchemaObj["actionValue"] = z.string().min(2, {
      message: "Please select value ...",
    });
  }
  if (type === "notifyOther" || type === "replyAndNotifyBoth") {
    // @ts-ignore
    formSchemaObj["notifierNumber"] = z.string().length(10, {
      message: "Please enter valid number.",
    });
    formSchemaObj["actionTypeOther"] = z.string().min(4, {
      message: "Please select action type (Others).",
    });
    formSchemaObj["actionValueOther"] = z.string().min(2, {
      message: "Please select value ...",
    });
  } else if (type === "addToContact") {
    // @ts-ignore
    formSchemaObj["contactList"] = z.string().min(1, {
      message: "Please select contact list.",
    });
  } else if (type === "tag") {
    // @ts-ignore
    formSchemaObj["contactList"] = z.string().min(1, {
      message: "Please select contact list.",
    });
    // @ts-ignore
    formSchemaObj["campaign"] = z
      .string()
      .min(1, {})
      .optional()
      .or(z.literal(""));
  }

  // console.log("formSchemaObj :::: ", formSchemaObj);
  const FormSchema = z
    .object(formSchemaObj)
    .refine(
      (data) =>
        !(
          data.tag &&
          data.tag.length > 1 &&
          (!data.taggingContactList || data.taggingContactList === "")
        ),
      {
        message: "Please select contact list to tag.",
        path: ["taggingContactList"], // Pointing out which field is invalid
      }
    );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      notifierNumber: "",
      contactList: "",
      campaign: "",
    },
  });

  useEffect(() => {
    console.log("type :::: ", type);
    // if (type === "replyBackToSender" || type === "replyAndNotifyBoth") {
    //   setShouldShowActionType(true);
    // }
    // if (type === "notifyOther" || type === "replyAndNotifyBoth") {
    //   setShouldShowNotifierNumber(true);
    //   setShouldShowActionTypeOther(true);
    // }

    if (type === "replyAndNotifyBoth") {
      setShouldShowNotifierNumber(true);
      setShouldShowActionTypeOther(true);
      setShouldShowActionType(true);
    } else if (type === "notifyOther") {
      setShouldShowNotifierNumber(true);
      setShouldShowActionTypeOther(true);
      setShouldShowActionType(false);
    } else if (type === "replyBackToSender") {
      setShouldShowActionType(true);
      setShouldShowNotifierNumber(false);
      setShouldShowActionTypeOther(false);
    }
  }, [type]);

  useEffect(() => {
    if (
      automationState.editNode &&
      automationState.editNodeData &&
      automationState.nodeInnerNextActionType
    ) {
      const { editNodeData } = automationState;
      console.log("editNodeData :::: ", editNodeData);
      // @ts-ignore
      const formData = editNodeData?.formData;

      form.reset(formData);
      if (formData?.actionType) {
        setShowNextOptions(formData?.actionType);
      }
      if (formData?.actionTypeOther) {
        setShowNextOptionOthers(formData?.actionTypeOther);
      }
    }
  }, [automationState.editNode, automationState.editNodeData]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("form data :::::: ", data);
    addEventNode(data);
  }

  const addEventNode = (data: any) => {
    // parentNodeId is actually where user clicked and that will be parent for new node
    const nodeData = {
      nodeType: "nextActionNode",
      actionType: type,
      label: label,
      // @ts-ignore
      parentNodeId: automationState.clickedNodeId,
      formData: data,
    };

    if (automationState.editNode === true) {
      editNode(nodeData);
    } else {
      addNewNode(nodeData);
      setAutomationState((prev: any) => {
        return {
          ...prev,
          isSidebarOpen: false,
          showNodeType: "nextActionNode",
          nodeInnerNextActionType: null,
        };
      });
    }
  };

  const handleActionTypeChange = (val: string, field: any) => {
    // const val = e.target.value;
    setShowNextOptions(val);
    field.onChange(val);
  };

  const handleActionTypeOtherChange = (val: string, field: any) => {
    // const val = e.target.value;
    setShowNextOptionOthers(val);
    field.onChange(val);
  };

  console.log("form state : ", form.formState);
  return (
    <Form {...form}>
      <h1 className="text-lg mt-4">{label}</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  flex-col gap-4 mt-8"
      >
        {shouldShowNotifierNumber && (
          <FormField
            control={form.control}
            name="notifierNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notifier Number</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {shouldshowActionType && (
          <>
            <FormField
              control={form.control}
              name="actionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Action Type</FormLabel>
                  <Select
                    onValueChange={(val) => handleActionTypeChange(val, field)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Action Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(actionTypeOptions).map((key: string) => (
                        <SelectItem key={key} value={key}>
                          {
                            //@ts-ignore
                            actionTypeOptions[key]
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {showNextOptions && (
              <ActionRequiredSubForm
                form={form}
                type={showNextOptions}
                selectedType="actionType"
              />
            )}
          </>
        )}

        {shouldshowActionTypeOther && (
          <>
            <FormField
              control={form.control}
              name="actionTypeOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Action Type (Others)</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      handleActionTypeOtherChange(val, field)
                    }
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Action Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionTypeOtherOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {showNextOptionOthers && (
              <ActionRequiredSubForm
                form={form}
                type={showNextOptionOthers}
                label={label}
                selectedType="actionTypeOther"
              />
            )}
          </>
        )}

        {/* || type === "tag" */}
        {type === "addToContact" && (
          <FormField
            control={form.control}
            name="contactList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Contact List</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contact List" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {automationState.contactList?.map((item: any) => (
                      <SelectItem key={item?.id} value={item?.name}>
                        {item?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === "tag" && (
          <FormField
            control={form.control}
            name="contactList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Campaign</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campaign" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="list1">list 1</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* don't show devider for noReply */}
        {type !== "noReply" && (
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-blue-400 opacity-50"></div>
            <span className="flex-shrink mx-4 text-gray-500">Tagging</span>
            <div className="flex-grow border-t border-blue-400 opacity-50"></div>
          </div>
        )}
        <FormField
          control={form.control}
          name="taggingContactList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagging Contact List</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Contact List" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {automationState.contactList?.map((item: any) => (
                    <SelectItem key={item?.id} value={item?.name}>
                      {item?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Tag</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="flex-end mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
