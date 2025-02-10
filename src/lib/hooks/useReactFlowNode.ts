import { useReactFlow, getOutgoers } from "@xyflow/react";
import { useLayoutedElements } from "@/lib/hooks/useDagreeLayout";
import { AutomationContext } from "@/app/ui/automationFlow/context";
import { useContext, useState } from "react";
import axiosInstance from "../axios";
import { saveDraftedFlow } from "../api";

const Position = { x: 0, y: 0 };

export const useReactFlowNode = () => {
  const { getNodes, setNodes, getEdges, setEdges, deleteElements, fitView } =
    useReactFlow();
  const { getLayoutedElements } = useLayoutedElements();
  const { getNode } = useReactFlow();
  const { setAutomationState, automationState } = useContext(AutomationContext);

  const allNodes = getNodes();
  const allEdges = getEdges();

  const addNewNode = (nodeData: any) => {
    console.log("nodeData", nodeData);
    const clickedNodeId = nodeData.parentNodeId;
    const ID =
      clickedNodeId === "0"
        ? "1"
        : allNodes.length + 1 + "-" + Math.floor(Math.random() * 10);
    const newNode = {
      id: ID,
      type: nodeData.nodeType,
      position: Position,
      data: nodeData,
    };

    console.log("newNode", newNode);
    const newEdge = {
      id: `${clickedNodeId}-${ID}`,
      source: clickedNodeId,
      target: ID,
    };

    // remove the first trigger button
    // let filteredNodes = allNodes;
    if (clickedNodeId === "0") {
      const filteredNodes = allNodes.filter(
        (node: any) => node.id !== clickedNodeId
      );
      setNodes([...filteredNodes, newNode]);
    } else {
      console.log("newEdge", newEdge);
      setNodes([...allNodes, newNode]);
      setEdges([...getEdges(), newEdge]);
    }
    setAutomationState((prev: any) => {
      return {
        ...prev,
        clickedNodeId: ID,
      };
    });

    setTimeout(() => {
      getLayoutedElements();
    }, 50);
    handleDraft();
  };

  const editNode = (nodeData: any, nextActionNode?: string) => {
    allNodes.map((node: any) => {
      if (node.id === automationState.clickedNodeId) {
        node.type = nodeData.nodeType;
        node.data = nodeData;
      }
    });
    setNodes([...allNodes]);
    setTimeout(() => {
      getLayoutedElements();
    }, 50);

    setAutomationState((prev: any) => {
      return {
        ...prev,
        editNode: false,
        editNodeData: null,
        showNodeType: null, //nextActionNode ? nextActionNode : prev.showNodeType,
        nodeInnerNextActionType: null,
        previousSubActionType: null, //nodeData?.actionType,
        isSidebarOpen: false,
      };
    });

    handleDraft();
  };

  const deleteNode = async (nodeId: string) => {
    const allNodes = getNodes();

    const deletedNode = await deleteElements({ nodes: [{ id: nodeId }] });
    if (allNodes.length === 1) {
      // add trigger button back if initial node is deleted
      const triggerButton = {
        id: "0",
        type: "triggerButton",
        position: { x: window.screen.availWidth / 2 - 94, y: 100 },
        data: { label: "5", nodeType: "triggerButton" },
      };
      setNodes([triggerButton]);
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          fitView({ duration: 700, padding: 2, maxZoom: 5 }); //padding:2,maxZoom:5,
        });
      }, 50);
    }
    console.log("@gs112 deletedNode", deletedNode);
    handleDraft();
  };

  const getChildNodes = (node: any) => {
    const allUpdatedNodes = getNodes();
    const allUpdatedEdges = getEdges();
    let childNodes = getOutgoers(node, allUpdatedNodes, allUpdatedEdges);
    if (childNodes.length > 0) {
      childNodes = childNodes.map((node: any) => {
        node["childNodes"] = getChildNodes(node);
        return node;
      });
    }
    return childNodes;
  };

  const handleDraft = () => {
    setTimeout(() => {
      saveAsDraft();
    }, 100);
  };

  const saveAsDraft = () => {
    const allUpdatedNodes = getNodes();
    const allUpdatedEdges = getEdges();
    if (allUpdatedNodes.length === 0 || allUpdatedEdges.length === 0) {
      // alert("Please add some actions to publish flow");
      return;
    }

    // get first node
    const firstNode = getNode("1");
    console.log("firstNode", firstNode);
    const nodesWithChildren: any = firstNode;
    nodesWithChildren["childNodes"] = getChildNodes(firstNode);

    console.log("nodesWithChildren", nodesWithChildren);

    const Flow = {
      flowId: automationState.flowId,
      originalNodes: allUpdatedNodes,
      nodesWithChildren: nodesWithChildren,
      edges: allUpdatedEdges,
    };

    console.log("Flow", Flow);

    saveDraftedFlow(Flow)
      .then((response: any) => {
        console.log("@gs21 saveDraftedFlow response", response);
        if (response.status === 200) {
          console.log("@gs21 Flow saved as draft successfully");
          console.log("@gs21 drafted Response", response.data);
          console.log("@gs21 automationState", automationState);
          if (!automationState.flowId || automationState.flowId === "") {
            setAutomationState((prev: any) => {
              return {
                ...prev,
                flowId: response.data.action_flow_id + "",
              };
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return { addNewNode, editNode, deleteNode };
};
