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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";
import { fetchSelectionList } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Checkbox } from "@/components/ui/checkbox";
import { TimePicker } from "@/components/ui/dateAndTime/time-picker";

type frequencyTypes = "daily" | "weekly" | "monthly" | "yearly" | "everyNMin";
type frequencyArrType = { value: frequencyTypes; label: string };
const frequencies: frequencyArrType[] = [
  { value: "everyNMin", label: "Every N Minutes" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// create array of week days with label and values
type daysType =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
type daysArrType = { value: daysType; label: string };
const weekDays = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

export default function LabelForm({ formDetails }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);
  console.log("automationState", automationState);

  // const { sidebarState, setSidebarState } = useContext(sidebarContext);

  const { addNewNode, editNode } = useReactFlowNode();
  const { label, type, description } = formDetails;
  const [selectionList, setSelectionList] = useState([]);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showEveryNMin, setShowEveryNMin] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);

  // create form with following field
  //   1. Campaign Name
  // 2. List Name
  // 3. Selection Name
  // 4. Template Name
  // 5. Schedule Now or Reoccuring
  // 6. Tag for Campaign

  let formSchemaObj = {
    campaignName: z.string().min(1, {
      message: "Please enter Compaign Name.",
    }),
    contactList: z.string().min(1, {
      message: "Please Select Contact List.",
    }),
    selectionList: z.string().min(1, {
      message: "Please Select Selection List.",
    }),
    template: z.string().min(1, {
      message: "Please Select Template Name.",
    }),
    schedule: z.date().optional(),
    // scheduleNow: z.boolean().optional(),
    recurring: z.boolean().optional(),
    startDate: z.date().optional(),
    finishDate: z.date().optional(),
    frequency: z.string().optional(),
    weekly: z.string().optional(),
    weeklyDays: z.array(z.string()).optional(),
    // .refine((value) => value.some((item) => item), {
    //   message: "You have to select at least one item.",
    // }),
    everyNMin: z.string().optional(),
  };

  let defaultValues = {
    campaignName: "",
    contactList: "",
    selectionList: "",
    template: "",
    schedule: "",
    // tag: "",
    weeklyDays: [],
  };
  let a = 1;
  const b = a++;
  //data.recurring===false || (data.recurring===true && data.startDate)
  const FormSchema = z
    .object(formSchemaObj)
    .refine((data) => data.recurring || data.schedule, {
      message: "Please Select Schedule Date.",
      path: ["schedule"],
    })
    .refine((data) => !data.recurring || (data.recurring && data.startDate), {
      message: "Please Select Start Date.",
      path: ["startDate"],
    })
    .refine((data) => !data.recurring || (data.recurring && data.finishDate), {
      message: "Please Select Finish Date.",
      path: ["finishDate"],
    })
    .refine(
      (data) =>
        !data.recurring ||
        (data.recurring &&
          data.finishDate &&
          data.startDate &&
          data.startDate < data.finishDate),
      {
        message: "Finish Date should be greater than Start Date.",
        path: ["finishDate"],
      }
    )
    .refine((data) => !data.recurring || (data.recurring && data.frequency), {
      message: "Please Select Frequency.",
      path: ["frequency"],
    })
    .refine(
      (data) =>
        !data.recurring ||
        data.frequency !== "everyNMin" ||
        (data.recurring && data.everyNMin),
      {
        message: "Please Select Every N Minutes.",
        path: ["everyNMin"],
      }
    )
    .refine(
      (data) =>
        !data.recurring ||
        data.frequency !== "weekly" ||
        (data.recurring && data.weeklyDays && data.weeklyDays.length > 0),
      {
        message: "Please Select Weekly Days.",
        path: ["weeklyDays"],
      }
    );

  // console.log("formSchema", FormSchema);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    //@ts-ignore
    defaultValues: defaultValues,
  });

  // useEffect(() => {
  //   // make async call to fetchSelectionList
  //   fetchSelectionList()
  //     .then((data) => {
  //       console.log("selectionList", data);
  //     })
  //     .catch((e) => {
  //       console.error("error", e.message);
  //     });
  // }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "contactList" && value.contactList) {
        fetchSelectionList(value.contactList)
          .then((data) => {
            console.log("selectionList", data);
            setSelectionList(data);
          })
          .catch((e) => {
            console.error("error", e.message);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    // for node edit mode

    if (automationState.editNode && automationState.editNodeData) {
      const editNodeData = automationState.editNodeData;
      console.log("editNodeData", editNodeData);

      setTimeout(() => {
        // @ts-ignore
        const formData = editNodeData?.formData;
        form.reset(formData);
        setShowRecurring(formData.recurring);
        setShowEveryNMin(formData.frequency === "everyNMin");
        setShowWeekly(formData.frequency === "weekly");
      }, 200);
    }
  }, [automationState.editNode, automationState.clickedNodeId]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("form data :::::: ", data);
    const contactListName = automationState.contactList.find(
      (item: any) => item.id + "" === data.contactList
    );

    const templateName = automationState.whatsAppTemplate.find(
      (item: any) => item.id + "" === data.template
    );

    // console.log("contactListName", contactListName);
    //@ts-ignore
    data["contactListName"] = data.contactList; //contactListName ? contactListName.name : "";
    //@ts-ignore
    data["templateName"] = templateName ? templateName.name : "";
    addEventNode(data);
  }

  const addEventNode = (data: any) => {
    // parentNodeId is actually where user clicked and that will be parent for new node

    const nodeData = {
      nodeType: "eventNode",
      actionType: type,
      label: data.campaignName,
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
          isSidebarOpen: true,
          previousSubActionType: null,
          showNodeType: "triggerNode",
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

  const handleRecurringChange = (val: boolean) => {
    setShowRecurring(val);
  };

  const handleFrequencyChange = (val: string) => {
    form.setValue("frequency", val);
    if (val === "everyNMin") {
      // show everyNMin form
      setShowEveryNMin(true);
      setShowWeekly(false);
    } else if (val === "weekly") {
      // show weekly form
      setShowWeekly(true);
      setShowEveryNMin(false);
    } else {
      setShowEveryNMin(false);
      setShowWeekly(false);
    }
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
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name:</FormLabel>
              <FormControl>
                <Input placeholder="Campaign Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact List:</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Contact List" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {automationState &&
                    automationState.contactList &&
                    automationState.contactList.map((item: any) => {
                      return (
                        <SelectItem key={item.name} value={item.name}>
                          {item.name}
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
          name="selectionList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selection List:</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select List" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectionList &&
                    selectionList.map((item: any, index: any) => {
                      return (
                        <SelectItem key={item.id + ""} value={item.id + ""}>
                          {item.name}
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
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template:</FormLabel>
              <Select
                onValueChange={field.onChange}
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
                          <SelectItem key={item.id + ""} value={item.id + ""}>
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
          name="schedule"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP hh:mm a")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarMonthIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // @ts-ignore
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="space-y-1 flex items-center">
              <FormLabel className="mr-2">Recurring</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(val) => {
                    handleRecurringChange(!!val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none"></div>
            </FormItem>
          )}
        />

        {showRecurring && (
          <>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date & Time:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP hh:mm a")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarMonthIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency:</FormLabel>
                  <Select
                    onValueChange={handleFrequencyChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencies.map((item: frequencyArrType, index: any) => {
                        return (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showEveryNMin && (
              <FormField
                control={form.control}
                name="everyNMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Run Every(Minutes):</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={55}
                        step={5}
                        placeholder="Enter range of 5 to 55"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showWeekly && (
              <FormField
                control={form.control}
                name="weeklyDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Weekly Days:</FormLabel>
                    </div>
                    {weekDays.map((day) => (
                      <FormField
                        key={day.value}
                        control={form.control}
                        name="weeklyDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          // @ts-ignore
                                          ...field.value,
                                          day.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="finishDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Finish Date & Time:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP hh:mm a")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarMonthIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="flex-end mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
