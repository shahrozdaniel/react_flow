import { XYPosition } from '@xyflow/react';
export type NodeType = {
    id: string,
    type: string,
    position: XYPosition,
    data?: {
        label: string
    }
}

export type EdgeType = {
    id: string,
    type: string,
    source: string,
    target: string
}

export type TriggerNodeType =  "EMAIL" | "WHATSAPP";