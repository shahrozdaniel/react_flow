"use client";
import {
  AutomationContext,
  sidebarContext,
} from "@/app/ui/automationFlow/context";
import { useContext, useEffect, useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import SendIcon from "@mui/icons-material/Send";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContactsIcon from "@mui/icons-material/Contacts";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";
import ActionRequiredForm from "@/app/ui/automationFlow/sidebar/form/actionRequiredForm";

const nextActionMap: any = {
  replyBackToSender: "Reply Back to Sender",
  notifyOther: "Notify Other",
  replyAndNotifyBoth: "Reply and Notify Both",
  noReply: "No Reply",
  tag: "Tag",
  addToContact: "Add to Contact",
};

export default function NextActions({ listClass }: any) {
  const { automationState, setAutomationState } = useContext(AutomationContext);

  // const { sidebarState, setSidebarState } = useContext(sidebarContext);
  const { addNewNode } = useReactFlowNode();
  const [nextActionState, setNextActionState] = useState({ label: null });
  // const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (
      automationState.editNode &&
      automationState.editNodeData &&
      automationState.nodeInnerNextActionType
    ) {
      setNextActionState({
        label: nextActionMap[automationState.nodeInnerNextActionType],
      });
    }
  }, [automationState.editNode, automationState.editNodeData]);

  const hanldeClick = (type: string) => {
    console.log(type);

    // if(type !== "replyBackToSender"){
    // @ts-ignore
    // nodeInnerNextActionType
    setAutomationState((prev: any) => {
      return {
        ...prev,
        nodeInnerNextActionType: type,
      };
    });
    setNextActionState({ label: nextActionMap[type] });
    // setShowForm(true)
    // }else{
    //   addNextActionNode(type);
    // }
  };

  const addNextActionNode = (type: string) => {
    // parentNodeId is actually where user clicked and that will be parent for new node
    const nodeData = {
      nodeType: "nextActionNode",
      actionType: type,
      label: "Reply Back", //data.label,
      // @ts-ignore
      parentNodeId: automationState.clickedNodeId,
      formData: {},
    };
    addNewNode(nodeData);
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: false,
        showNodeType: "triggerNode",
      };
    });

    // setSidebarState((prev: any) => {
    //   return {
    //     ...prev,
    //     showType: 'triggers',
    //   };
    // })
  };

  return (
    <div className="flex flex-col grow">
      {/* <h1 className="text-sm my-2 flex flex-start text-muted-foreground">
        Final Next Action
      </h1> */}
      {!automationState.nodeInnerNextActionType ? (
        <ul>
          {automationState.previousSubActionType !== "incommingContact" ? (
            <>
              <li
                className={listClass}
                key="1"
                onClick={() => hanldeClick("replyBackToSender")}
              >
                <ReplyIcon /> Reply Back to Sender
              </li>
              <li
                className={listClass}
                key="2"
                onClick={() => hanldeClick("notifyOther")}
              >
                <ReplyAllIcon /> Notify Other
              </li>
              <li
                className={listClass}
                key="3"
                onClick={() => hanldeClick("replyAndNotifyBoth")}
              >
                <SendIcon /> Reply and Notify Both
              </li>
              <li
                className={listClass}
                key="3"
                onClick={() => hanldeClick("noReply")}
              >
                <SendIcon /> No Reply
              </li>
              {/* <li
            className={listClass}
            key="5"
            onClick={() => hanldeClick("tag")}
          >
            <LocalOfferIcon /> Tag
          </li> */}
            </>
          ) : (
            <>
              <li
                className={listClass}
                key="4"
                onClick={() => hanldeClick("addToContact")}
              >
                <ContactsIcon /> Add to Contact
              </li>
              {/* <li
            className={listClass}
            key="5"
            onClick={() => hanldeClick("tag")}
          >
            <LocalOfferIcon /> Tag
          </li> */}
            </>
          )}
        </ul>
      ) : (
        <ActionRequiredForm nextActionState={nextActionState} />
      )}
    </div>
  );
}
