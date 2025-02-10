
"use client";

import { AutomationContext,sidebarContext } from "@/app/ui/automationFlow/context";
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

export default function RunNowOrScheduleForm({ formDetails }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);

  // const { sidebarState, setSidebarState } = useContext(sidebarContext);

  const { addNewNode,editNode } = useReactFlowNode();
  const { label, type, description } = formDetails;
  // const [formDetail, setFormDetail] = useState(formDetails);



  let formSchemaObj = {
    label: z.string().min(1, {
      message: "Please enter value in label.",
    }),
  };

  let defaultValues = {
    label: "",
  };

  if (type === "incommingText") {
    // @ts-ignore
    formSchemaObj["text"] = z.string().min(1, {
      message: "Please enter value in text.",
    });
    // @ts-ignore
    defaultValues["text"] = "";
  } else if (type === "incommingStatus") {
    // @ts-ignore
    formSchemaObj["status"] = z.string().min(1, {
      message: "Please select value in status.",
    });
    // @ts-ignore
    defaultValues["status"] = "";
  }

  // const initialFormSchema =()=>{
    
  // }

  // useEffect(() => {
  //   initialFormSchema();
  // }, [type]);

  const FormSchema = z.object(formSchemaObj);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });
  

  useEffect(() => {
    // for node edit mode
    
    if (automationState.editNode && automationState.editNodeData) {
      const editNodeData =  automationState.editNodeData;
      // @ts-ignore
      form.reset(editNodeData.formData);
    }
  },[automationState.editNode, automationState.clickedNodeId]);


  

  

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addEventNode(data);
  }

  const addEventNode = (data: any) => {
    // parentNodeId is actually where user clicked and that will be parent for new node

    const nodeData = {
      nodeType: "eventNode",
      actionType: type,
      label: data.label,
      // @ts-ignore
      parentNodeId: automationState.clickedNodeId,
      formData: data,
    };

    if(automationState.editNode===true){
        editNode(nodeData, "nextActionNode");
    }

    else{
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
    //   return {
    //     ...prev,
    //     showType: 'nextActions',
    //   };  
    // })

  };

  return (
    <Form {...form}>
      <h1 className="text-lg mt-4">{label}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex  flex-col gap-4 mt-8" id={type}>
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label or autoLabel</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "incommingText" && (
          <FormField
            control={form.control}
            // @ts-ignore
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  {type === "incommingText" && (
                    <Input placeholder="" {...field} />
                  )}
                </FormControl>
                <FormDescription>{description}</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "incommingStatus" && (
          <FormField
            control={form.control}
            // @ts-ignore
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={"sent"}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Initiated">Initiated</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Read">Read</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="flex-end mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
