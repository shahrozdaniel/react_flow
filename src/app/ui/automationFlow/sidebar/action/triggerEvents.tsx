
"use client";
import {
  AutomationContext,
  sidebarContext,
} from "@/app/ui/automationFlow/context";
import { use, useEffect, useContext, useState } from "react";
import LabelForm from "@/app/ui/automationFlow/sidebar/form/labelForm";
import LabelWhatsAppForm from "@/app/ui/automationFlow/sidebar/form/labelWhatsappForm";
import EventIcons from "@/app/ui/automationFlow/eventIcons";
import RunNowOrScheduleForm from "@/app/ui/automationFlow/sidebar/form/runOrScheduleForm";

type LabelFormType = {
  label: string;
  type: string;
  description: string;
};

const eventLabelFormList = [
  "incommingText",
  "incommingContact",
  "incommingStatus",
];
const eventLabelWAFormList = ["incomingButton", "incommingTextOrButton"];

const eventMap = {
  runNowOrSchedule: "Run Now Or Schedule Campaign",
  incommingText: "Incomming Text",
  incommingContact: "Incomming Contact",
  incommingStatus: "Incomming Status",
  incomingButton: "Incoming Button",
  incommingTextOrButton: "Incomming Text Or Button",
};

export default function TriggerEvents({ listClass }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [showLabelWAForm, setShowLabelWAForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>();
  const [labelFormDetails, setLabelFormDetails] = useState<LabelFormType>({
    label: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    if(automationState.editNode && automationState.editNodeData){
      const editNodeData =  automationState.editNodeData;
      // console.log("editNodeData >>>>>>>>>>>>>>>> ", editNodeData);
      setLabelFormDetails({
        // @ts-ignore
        label: editNodeData.label,
        // @ts-ignore
        type: editNodeData.actionType,
        description: "", //editNodeData.description,
      });
    }
  },[automationState.editNode, automationState.clickedNodeId])

  const addEventNode = (eventType: string) => {
    // console.log("addEventNode", eventType);
    switch (eventType) {
      case "runNowOrSchedule":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Text to Match comma Seperated",
        });
        updateAutomationState(eventType);
        break;

      case "incommingText":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Text to Match comma Seperated",
        });
        // setShowLabelForm(true);
        // setSelectedEvent(eventType);
        updateAutomationState(eventType);
        break;

      case "incommingContact":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Contact Received",
        });
        // setShowLabelForm(true);
        // setSelectedEvent(eventType);
        updateAutomationState(eventType);
        break;
      case "incommingStatus":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Initiated,Sent,Delivered,Read,Failed",
        });
        // setShowLabelForm(true);
        // setSelectedEvent(eventType);
        updateAutomationState(eventType);
        break;

      case "incomingButton":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Button Name",
        });
        // setShowLabelWAForm(true);
        // setSelectedEvent(eventType);
        updateAutomationState(eventType);
        break;
      case "incommingTextOrButton":
        setLabelFormDetails({
          label: eventMap[eventType],
          type: eventType,
          description: "Text/Button Name",
        });
        // setShowLabelWAForm(true);
        // setSelectedEvent(eventType);
        updateAutomationState(eventType);
        break;

      default:
        break;
    }
  };

  const updateAutomationState = (eventType: any) => {
    setAutomationState((prev: any) => {
      return {
        ...prev,
        nodeInnerNextActionType: eventType,
      };
    });
  };
  return (
    <div className="flex flex-col grow">
      {!automationState.nodeInnerNextActionType && (
        <>
          <h1 className="text-lg my-4 flex flex-start">Events</h1>
          <ul>
            {Object.entries(eventMap).map(([key, value]) => {
              return (
                <li
                  className={listClass}
                  key={key}
                  onClick={() => addEventNode(key)}
                >
                  <EventIcons type={key} /> {value}
                </li>
              );
            })}
          </ul>
        </>
      )}


      {labelFormDetails && labelFormDetails.type && labelFormDetails.type.length>0 && 
      <>
      {eventLabelFormList.includes(
        // @ts-ignore
        automationState?.nodeInnerNextActionType
      ) && <LabelForm formDetails={labelFormDetails} />}
      {eventLabelWAFormList.includes(
        // @ts-ignore
        automationState?.nodeInnerNextActionType
      ) && <LabelWhatsAppForm formDetails={labelFormDetails} />}

      {automationState?.nodeInnerNextActionType === "runNowOrSchedule" && (
        <RunNowOrScheduleForm formDetails={labelFormDetails} />
      )}
      </>}
    </div>
  );
}
