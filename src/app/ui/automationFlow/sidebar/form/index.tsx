"use client";
import { useContext, useState } from "react";
import { AutomationContext,sidebarContext } from "@/app/ui/automationFlow/context";
import TriggerEvents from "@/app/ui/automationFlow/sidebar/action/triggerEvents";
import NextActions from "@/app/ui/automationFlow/sidebar/action/nextActions";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {TriggerNodeType} from '@/app/ui/automationFlow/type';
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";

const EMAIL="EMAIL";
const WHATSAPP="WHATSAPP";
const listClass = 'p-4 flex cursor-pointer mb-3 gap-2 border border-slate-200 rounded-md hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:duration-500 hover:shadow-md';
const SidebarForm = () => {

    const {automationState,setAutomationState} = useContext(AutomationContext);
    // const { sidebarState, setSidebarState } = useContext(sidebarContext);

    const {addNewNode,editNode} = useReactFlowNode();

    const addTriggerNode = (nodeType:TriggerNodeType) => {
        const nodeData = {
            nodeType: "triggerNode",
            actionType: nodeType,
            label: nodeType===EMAIL ? "Email" : "Whatsapp",
            // @ts-ignore
            parentNodeId: automationState.clickedNodeId,
        }

        if(automationState.editNode===true){
            editNode(nodeData);
        }
        else{
            setAutomationState((prev:any) => {
                return {...prev,showNodeType:'eventNode'}
            })
            // setShowEvents(true);
            // console.log(nodeType);
            // console.log("addTriggerNode")
            // parentNodeId is actually where user clicked and that will be parent for new node
            
            addNewNode(nodeData)
        }
    }

    return (
        <>
        {automationState.showNodeType === 'triggerNode' &&
            <div className="flex flex-col grow">
                <h1 className="text-lg my-4 flex flex-start">Triggers</h1>
                <ul>
                    <li className={listClass} onClick={() => addTriggerNode(EMAIL)}><MarkEmailUnreadIcon /> Email</li>
                    <li className={listClass} onClick={() => addTriggerNode(WHATSAPP)}><WhatsAppIcon /> Whatsapp</li>
                </ul>
            </div>
            }
            {automationState.showNodeType === 'eventNode' &&
            <TriggerEvents listClass={listClass}/>
            }

            {automationState.showNodeType === 'nextActionNode' &&
            <NextActions listClass={listClass}/>
            }
        </>
    )
}

export default SidebarForm;