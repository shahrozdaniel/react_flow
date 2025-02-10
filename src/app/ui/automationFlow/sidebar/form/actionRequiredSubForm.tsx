"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  AutomationContext
} from "@/app/ui/automationFlow/context";
import { fetchContactList, fetchDNCList } from "@/lib/api";

const actionTypeOptionsToNextActionLabel:any = {
  "whatsAppTemplate": "Select Whatsapp Template",
  "whatsAppMessage": "Enter Message",
  "addToDNC": "Select DNC",
  "addToContact": "Select Contact",
};


const ActionRequiredSubForm = ({ form, type, selectedType }: any) => {
  const { automationState, setAutomationState } = useContext(AutomationContext);
  const [selectData, setSelectData] = useState([]);
  const [label,setLabel]=useState("")
  useEffect(() => {
    console.log("type", type);
    const label = actionTypeOptionsToNextActionLabel[type];
    setLabel(label)
    if (type === "whatsAppTemplate") {
      setSelectData(automationState.whatsAppTemplate);
    } else if (type === "addToDNC") {
      setSelectData(automationState.dncList);
    } else if (type === "addToContact") {
      setSelectData(automationState.contactList);
    }
  }, [type]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      
      {type === "whatsAppMessage" ? (
        
        <FormField
            control={form.control}
            name={selectedType === "actionType" ? "actionValue" : "actionValueOther"}//"whatsAppMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Messages</FormLabel>
                <FormControl>
                  <Input type="Type Here ..." placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      ) : (
        <FormField
          control={form.control}
          name={selectedType === "actionType" ? "actionValue" : "actionValueOther"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectData?.map((item: any) => (
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
    </div>
  );
};
export default ActionRequiredSubForm;
