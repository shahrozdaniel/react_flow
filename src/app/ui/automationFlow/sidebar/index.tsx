"use client";
import { motion } from "framer-motion";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {TriggerNodeType} from '@/app/ui/automationFlow/type';
import { useReactFlow } from "@xyflow/react";
import { useReactFlowNode } from '@/lib/hooks/useReactFlowNode';
import { AutomationContext, sidebarContext } from "@/app/ui/automationFlow/context";

import { useContext, useEffect, useState  } from "react";
// import TriggerEvents from "@/app/ui/automationFlow/sidebar/action/triggerEvents";
// import NextActions from "@/app/ui/automationFlow/sidebar/action/nextActions";
import SidebarForm from "@/app/ui/automationFlow/sidebar/form";


const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
}


export default function AutomationSidebar(){
   
    // const { setEdges, addNodes, addEdges, getNodes, getNode,getEdge, getEdges, setNodes, fitView } = useReactFlow();
    // const [showEvents, setShowEvents] = useState(false);
    const [sidebarState, setSidebarState] = useState({
        // showType:'triggers'
        showNodeType : 'triggerNode',
        nodeInnerNextActionType : null
    });

    // console.log('sidebarState', sidebarState);

    
    // useEffect(() => {
    //     console.log('sidebarState', sidebarState);
    // }, [sidebarState]);

    

    
    return(
        // @ts-ignore
        <sidebarContext.Provider value={{sidebarState,setSidebarState:setSidebarState}}>
            <motion.div 
                initial={{ x: "80%" }} 
                animate={{ x: 0 }} 
                exit={{ x: "100%" }}
                transition={{ duration: 0.7,type:"spring" }}
                
                // transform={{ "translateX(0%)"}}
                className="absolute top-0 right-0">
                <div className="w-80 h-screen bg-white p-3 border-l border-slate-200 py-12 overflow-y-auto">
                    <SidebarForm />
                </div>
            </motion.div>
        </sidebarContext.Provider>
    )
}