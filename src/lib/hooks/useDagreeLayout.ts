"use client";
import ELK from "elkjs/lib/elk.bundled.js";
import dagre from "@dagrejs/dagre";
import React, { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";

const nodeWidth = 420;
const nodeHeight = 100;
const startPosition = 40;
const position = { x: 0, y: 0 };

export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const getLayoutedElements = useCallback((forceFitView = false) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "TB" });

    const nodes = getNodes();
    const edges = getEdges();

    nodes.forEach((node: any) => {
      //const width = node?.data?.node_type === 'trigger' ? nodeWidth : 0;
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(
      //@ts-ignore
      (edge: {
        source: dagre.Edge;
        target: string | { [key: string]: any } | undefined;
      }) => {
        dagreGraph.setEdge(edge.source, edge.target);
      }
    );

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node: any) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: "top",
        sourcePosition: "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };

      return newNode;
    });

    setNodes(newNodes);
    setTimeout(() => {
      if (nodes.length < 7 || forceFitView === true) {
        console.log("nodes less than 7");
        window.requestAnimationFrame(() => {
          fitView({ duration: 500 }); //padding:2,maxZoom:5,
        });
      }
    }, 100);
  }, []);

  return { getLayoutedElements };
};
