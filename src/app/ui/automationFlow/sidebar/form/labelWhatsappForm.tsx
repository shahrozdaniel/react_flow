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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";
import { fetchButtonByTemplateId } from "@/lib/api";

const FormSchema = z
  .object({
    label: z.string().min(1, {
      message: "Please enter value in label.",
    }),
    whatsappTemplate: z.string().min(1, {
      message: "Please select WhatsApp Template.",
    }),
    selectedButton: z
      .string()
      .min(1, {
        message: "Please select button.",
      })
      .optional()
      .or(z.literal("")),
    text: z
      .string()
      .min(1, {
        message: "Please enter value in text.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.selectedButton || data.text, {
    message: "Please select button or enter text.",
    path: ["selectedButton", "text"],
  });

export default function LabelWhatsAppForm({ formDetails }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);

  const [whatsAppTemplateButtons, setWhatsAppTemplateButtons] = useState<any[]>(
    []
  );
  const { label, type, description } = formDetails;
  // const [formDetail, setFormDetail] = useState(formDetails);

  const [whatsappTemplateLable, setWhatsappTemplateLable] = useState("");

  // const { sidebarState, setSidebarState } = useContext(sidebarContext);
  const { addNewNode, editNode } = useReactFlowNode();

  let defaultValues = {
    label: "",
    whatsappTemplate: "",
    selectedButton: "",
  };

  const getButtonByTemplate = async (val: any) => {
    console.log("getButtonByTemplate", val);
    const resp = await fetchButtonByTemplateId(val);
    if (resp && resp[0].reply_buttons) {
      setWhatsAppTemplateButtons(resp[0].reply_buttons);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    // for node edit mode

    if (form && automationState.editNode && automationState.editNodeData) {
      const editNodeData = automationState.editNodeData;
      //@ts-ignore
      const formData = editNodeData?.formData;

      // defaultValues = editNodeData.formData;
      getButtonByTemplate(formData.whatsappTemplate);
      setTimeout(() => {
        form.reset({
          label: formData.label,
          whatsappTemplate: formData.whatsappTemplate + "",
          selectedButton: formData.selectedButton,
        });
      }, 1000);

      setWhatsappTemplateLable(formData.whatsappTemplateLabel);
    }
  }, [form, automationState.editNode, automationState.clickedNodeId]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("labelWhatsappForm : ", data);
    // @ts-ignore
    data.whatsappTemplateLabel = whatsappTemplateLable;
    addEventNode(data);
  }

  const addEventNode = (data: any) => {
    // parentNodeId is actually where user clicked and that will be parent for new node

    const nodeData = {
      nodeType: "eventNode",
      actionType: type,
      label: data.label, //whatsappTemplateLable, //
      // @ts-ignore
      parentNodeId: automationState.clickedNodeId,
      formData: data,
    };
    console.log("labelWhatsappForm nodeData : ", nodeData);
    if (automationState.editNode === true) {
      editNode(nodeData);
    } else {
      addNewNode(nodeData);
      setAutomationState((prev: any) => {
        return {
          ...prev,
          isSidebarOpen: true,
          previousSubActionType: type,
          showNodeType: "nextActionNode",
          nodeInnerNextActionType: null,
        };
      });
    }
    // setSidebarState((prev: any) => {
    //     return {
    //       ...prev,
    //       showType: 'nextActions',
    //     };
    //   })
  };

  const handleTemplateChange = (val: any, field: any) => {
    console.log("-----------------------");
    field.onChange(val);
    getButtonByTemplate(val);
    setWhatsAppTemplateButtons([]);
    form.setValue("selectedButton", "");

    // set lebel by template id
    setLableByTemplateId(val);
  };

  const setLableByTemplateId = (val: string) => {
    automationState.whatsAppTemplate.forEach((template: any) => {
      if (template.id === val) {
        setWhatsappTemplateLable(template.name);
      }
    });
  };

  return (
    <Form {...form}>
      <h1 className="text-lg mt-4">{label}</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  flex-col gap-4 mt-8"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label or autoLabel</FormLabel>
              <FormControl>
                <Input placeholder="label" {...field} />
              </FormControl>

              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsappTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Whatsapp Template Name</FormLabel>
              <Select
                onValueChange={(val) => {
                  console.log("changed valllllllllllll", val);
                  handleTemplateChange(val, field);
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {automationState &&
                    automationState.whatsAppTemplate &&
                    automationState.whatsAppTemplate.map(
                      (item: any, index: any) => {
                        return (
                          <SelectItem key={item.id} value={item.id + ""}>
                            {item.name}
                          </SelectItem>
                        );
                      }
                    )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedButton"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Button:</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Button" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {automationState &&
                    automationState.whatsAppTemplate &&
                    whatsAppTemplateButtons.map((key: string) => {
                      return (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter text" {...field} />
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
