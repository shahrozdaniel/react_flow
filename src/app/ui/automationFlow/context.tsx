import { createContext } from "react";

// type automationFn = (state: any) => void;
export const AutomationContext = createContext({
  automationState: {
    flowId: "",
    showNodeType: "triggerNode", // which type of nodes to show in sidebar
    clickedNodeId: "0", // which node was clicked
    nodeInnerNextActionType: null, // there are actions/sub-actions for every node, so which action should be shown
    editNode: false, // edit a node
    editNodeData: null,
    previousSubActionType: null, // sometime upcomming next nodes are dependent on previous action/subactions
    whatsAppTemplate: [],
    dncList: [],
    contactList: [],
    gatewayID: 0,
    apiUrl: "",
  },
  setAutomationState: (state: any) => {},
});

export const sidebarContext = createContext({
  sidebarState: {
    showNodeType: "triggerNode",
    nodeInnerNextActionType: null,
  },
  setSidebarState: (state: any) => {},
  setSidebarState2: (state: string) => {},
});
