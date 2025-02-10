"use client";
import React, { createContext, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  CoordinateExtent,
  Position,
  XYPosition,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  Controls,
  useStore,
} from "@xyflow/react";

import { NodeType, EdgeType } from "@/app/ui/automationFlow/type";
import { TriggerButton } from "@/app/ui/automationFlow/nodes/triggerButton";
import { TriggerNode } from "@/app/ui/automationFlow/nodes/triggerNode";
import { EventNode } from "@/app/ui/automationFlow/nodes/eventNode";
import { NextActionNode } from "@/app/ui/automationFlow/nodes/nextActionNode";
import { AutomationContext } from "@/app/ui/automationFlow/context";
import AutomationSidebar from "@/app/ui/automationFlow/sidebar";
import { useLayoutedElements } from "@/lib/hooks/useDagreeLayout";

import {
  fetchContactList,
  fetchDNCList,
  fetchPublishedFlowById,
  fetchWhatsAppTemplates,
} from "@/lib/api";

import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

const nodeTypes = {
  triggerButton: TriggerButton,
  triggerNode: TriggerNode,
  eventNode: EventNode,
  nextActionNode: NextActionNode,
};

const initialEdges: EdgeType[] = [];

const defaultValue = {
  isSidebarOpen: false,
  clickedNodeId: null,
  forceUpdateTree: 0,
  showNodeType: "triggers",
  nodeInnerNextActionType: null,
  whatsAppTemplate: [],
  dncList: [],
  contactList: [],
  flowId: "",
  gatewayID: 0,
  apiUrl: "",
};

const AutomationFlow = ({ gatewayID, actionFlowID, apiUrl }: any) => {
  console.log("@gs11 gatewayID", gatewayID);
  const [automationState, setAutomationState] = React.useState(defaultValue);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoadingFlow, setIsLoadingFlow] = React.useState(false);
  // const [flowId, setFlowId] = React.useState(actionFlowID);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { getLayoutedElements } = useLayoutedElements();

  const { getNode, getNodes } = useReactFlow();

  useEffect(() => {
    const initialNodes = [
      {
        id: "0",
        type: "triggerButton",
        position: { x: window.screen.availWidth / 2 - 94, y: 100 },
        data: { label: "5", nodeType: "triggerButton" },
      },
    ];

    //@ts-ignore
    setNodes(initialNodes);

    // set watsapp template

    const setWhatsAppTemplate = async () => {
      const response = await fetchWhatsAppTemplates();
      const whatsAppTemplate = response.map((item: any) => {
        return {
          id: item.whatsapp_template_id,
          name: item.template_name,
        };
      });

      const DNCList = await fetchDNCList();
      const contactList = await fetchContactList();
      if (response.length > 0) {
        setAutomationState((prev: any) => {
          return {
            ...prev,
            whatsAppTemplate: whatsAppTemplate,
            dncList: DNCList,
            contactList: contactList,
          };
        });
      }
    };
    setWhatsAppTemplate();

    // setTimeout(() => {
    //   setNodes(a.originalNodes);
    //   setEdges(a.edges);

    //   setTimeout(() => {
    //     getLayoutedElements();
    //   }, 100);
    // }, 1000);
  }, []);

  useEffect(() => {
    let flowId = 0;
    if (actionFlowID && actionFlowID > 0) {
      console.log("@gs11 actionFlowID", actionFlowID);
      flowId = actionFlowID;
      // now get the saved data and set to nodes and edges
      fetchPublishedFlow(flowId);
    }

    setAutomationState((prev: any) => {
      return {
        ...prev,
        flowId: flowId,
        gatewayID: gatewayID,
        apiUrl: apiUrl,
      };
    });

    console.log("@gs111 actionFlowID", actionFlowID);
  }, [actionFlowID, gatewayID, apiUrl]);

  useEffect(() => {
    console.log("automationState", automationState);
  }, [automationState]);

  const handlePublishFlow = () => {
    if (nodes.length === 0 || edges.length === 0) {
      toast.error("Please add some actions to publish flow");
      return;
    }
    setIsSaving(true);
    let allNodes: any[] = getNodes();

    // allNodes=allNodes.map((node: any) => {
    //   // delete node.position;
    //   delete node.measured;
    //   return node;
    // })

    // get first node
    const firstNode = getNode("1");
    console.log("firstNode", firstNode);
    const nodesWithChildren: any = firstNode;
    nodesWithChildren["childNodes"] = getChildNodes(firstNode);

    console.log("nodesWithChildren", nodesWithChildren);

    const Flow = {
      flowId: automationState.flowId,
      originalNodes: allNodes,
      nodesWithChildren: nodesWithChildren,
      edges: edges,
    };

    axiosInstance
      .post(`whatsapp/getResponse/${gatewayID}/published`, Flow)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          if (response.data.action_flow_id !== automationState.flowId) {
            setAutomationState((prev: any) => {
              return {
                ...prev,
                flowId: response.data.action_flow_id + "",
              };
            });
          }
          toast.success("Flow published successfully");
        } else {
          toast.error("Error publishing flow");
        }
        setIsSaving(false);
      })
      .catch((error) => {
        toast.error("Error publishing flow");
        setIsSaving(false);
      });

    console.log("Flow", Flow);
  };

  const fetchPublishedFlow = (flowId: number) => {
    setIsLoadingFlow(true);
    fetchPublishedFlowById(flowId)
      .then((response: any) => {
        console.log("response", response);
        if (response && response.data && response.data.payload) {
          // if (response.payload.length > 0) {
          setNodes(response.data.payload.originalNodes);
          setEdges(response.data.payload.edges);
          setTimeout(() => {
            getLayoutedElements(true);
          }, 100);
          // }
          toast.success("Flow fetched successfully");
        } else {
          toast.error("Error fetching flow");
        }
      })
      .catch((error) => {
        toast.error("Error fetching savedflow");
      })
      .finally(() => {
        setIsLoadingFlow(false);
      });
  };

  const getChildNodes = (node: any) => {
    let childNodes = getOutgoers(node, nodes, edges);
    if (childNodes.length > 0) {
      childNodes = childNodes.map((node: any) => {
        node["childNodes"] = getChildNodes(node);
        return node;
      });
    }
    return childNodes;
  };

  // const fetchWhatsAppTemplates = async () => {
  //   const response = await axiosInstance.post("whatsapp/fetch-queue-template", {
  //     queueID: 5,
  //   });
  //   if (
  //     response.status === 200 &&
  //     response.data.status_code === 200 &&
  //     response.data.data.length > 0
  //   ) {
  //     setAutomationState((prev: any) => {
  //       return {
  //         ...prev,
  //         whatsAppTemplate: response.data.data,
  //       };
  //     });
  //   }
  // };

  // useEffect(() => {
  //   console.log('nodes.length', nodes.length);
  //   console.log('nodes', nodes);
  //   console.log('edges', edges);
  //   getLayoutedElements();
  // }, [nodes.length]);

  return (
    <AutomationContext.Provider
      value={{
        // @ts-ignore
        automationState: automationState,
        setAutomationState: setAutomationState,
      }}
    >
      <div className="w-screen min-w-screen h-screen min-h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          //fitView
          attributionPosition="top-right"
          onNodesChange={onNodesChange}
          // onNodesDelete={onNodesDelete}
          onEdgesChange={onEdgesChange}
          // edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          className="relative"
        >
          {/*@ts-ignore*/}
          <Background variant={"dots"} gap={12} size={1} />
          <Controls />
        </ReactFlow>
        {automationState && automationState.isSidebarOpen && (
          <AutomationSidebar />
        )}

        <div>
          <Button
            onClick={handlePublishFlow}
            className="bg-blue-600 hover:bg-blue-700 absolute top-4 right-12"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Publishing
              </>
            ) : (
              "Publish Now"
            )}
          </Button>
        </div>
      </div>
    </AutomationContext.Provider>
  );
};

function AutomationFlowWithProvider(props: any) {
  return (
    <ReactFlowProvider>
      <AutomationFlow {...props} />
    </ReactFlowProvider>
  );
}

export default AutomationFlowWithProvider;
