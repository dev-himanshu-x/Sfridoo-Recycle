"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
  type NodeProps,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ------------------------------------------------------------------ */
/*  Custom Node                                                        */
/* ------------------------------------------------------------------ */

function FlowNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    subtitle: string;
    details: string[];
    highlight?: boolean;
    activeHighlight?: boolean;
  };

  return (
    <div
      className={d.activeHighlight ? "marching-border" : ""}
      style={{
        background: "#fff",
        border: d.activeHighlight ? "none" : "1.5px solid #e0e0e0",
        borderRadius: 14,
        padding: "20px 24px",
        minWidth: 220,
        maxWidth: 260,
        fontFamily: "'Poppins', sans-serif",
        transition: "box-shadow 0.4s ease, transform 0.4s ease",
        boxShadow: d.activeHighlight
          ? "0 8px 30px rgba(28, 31, 42, 0.12)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: d.activeHighlight ? "scale(1.03)" : "scale(1)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: "#1C1F2A", width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: "#1C1F2A", width: 8, height: 8 }} />

      <div style={{ fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 3 }}>
        {d.label}
      </div>
      <div style={{ fontSize: 11.5, color: "#888", marginBottom: 10 }}>
        {d.subtitle}
      </div>
      {d.details.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize: 11,
            color: "#666",
            paddingTop: 4,
            borderTop: i === 0 ? "1px solid #eee" : "none",
            marginTop: i === 0 ? 4 : 2,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Outcome Node  (Success / Error)                                    */
/* ------------------------------------------------------------------ */

function OutcomeNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    subtitle: string;
    details: string[];
    activeHighlight?: boolean;
  };

  return (
    <div
      className={d.activeHighlight ? "marching-border" : ""}
      style={{
        background: "#fff",
        border: d.activeHighlight ? "none" : "1.5px solid #e0e0e0",
        borderRadius: 14,
        padding: "20px 24px",
        minWidth: 220,
        maxWidth: 280,
        fontFamily: "'Poppins', sans-serif",
        transition: "box-shadow 0.4s ease, transform 0.4s ease",
        boxShadow: d.activeHighlight
          ? "0 8px 30px rgba(28, 31, 42, 0.12)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: d.activeHighlight ? "scale(1.03)" : "scale(1)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: "#1C1F2A", width: 8, height: 8 }} />

      <div style={{ fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 3 }}>
        {d.label}
      </div>
      <div style={{ fontSize: 11.5, color: "#888", marginBottom: 10 }}>
        {d.subtitle}
      </div>
      {d.details.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize: 11,
            color: "#666",
            paddingTop: 4,
            borderTop: i === 0 ? "1px solid #eee" : "none",
            marginTop: i === 0 ? 4 : 2,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Node types map                                                     */
/* ------------------------------------------------------------------ */

const nodeTypes = {
  flowNode: FlowNode,
  outcomeNode: OutcomeNode,
};

/* ------------------------------------------------------------------ */
/*  Initial nodes & edges                                              */
/* ------------------------------------------------------------------ */

const NODE_IDS = ["1", "2", "3", "4", "5"];

const baseNodes: Node[] = [
  {
    id: "1",
    type: "flowNode",
    position: { x: 0, y: 120 },
    data: {
      label: "Upload Waste",
      subtitle: "Initialize listing",
      details: [
        "Upload photos & waste details",
        "AI auto-classifies material type",
        "Status: Submitted",
      ],
    },
  },
  {
    id: "2",
    type: "flowNode",
    position: { x: 340, y: 120 },
    data: {
      label: "AI Analysis",
      subtitle: "Process & appraise",
      details: [
        "Identify recyclable components",
        "Estimate market value instantly",
        "Processing: Real-time",
      ],
    },
  },
  {
    id: "3",
    type: "flowNode",
    position: { x: 680, y: 100 },
    data: {
      label: "Match & Route",
      subtitle: "Route to optimal buyer",
      details: [
        "Search B2B buyer network",
        "Rank matches by proximity & price",
        "Logic: AI-powered routing",
      ],
    },
  },
  {
    id: "4",
    type: "outcomeNode",
    position: { x: 1040, y: 0 },
    data: {
      label: "Deal Closed",
      subtitle: "Successful transaction",
      details: [
        "Buyer accepts waste listing",
        "Schedule pickup & logistics",
        "Result: Waste recycled ✓",
      ],
    },
  },
  {
    id: "5",
    type: "outcomeNode",
    position: { x: 1040, y: 240 },
    data: {
      label: "Re-route",
      subtitle: "Find alternative buyer",
      details: [
        "Expand search radius",
        "Adjust pricing recommendation",
        "Action: Auto re-list",
      ],
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#1C1F2A", strokeWidth: 1.5 },
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: { stroke: "#1C1F2A", strokeWidth: 1.5 },
    animated: true,
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    type: "smoothstep",
    style: { stroke: "#1C1F2A", strokeWidth: 1.5 },
    animated: true,
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    type: "smoothstep",
    style: { stroke: "#999", strokeWidth: 1.5, strokeDasharray: "6 3" },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WasteFlowDiagram() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Cycle the highlight through nodes: 1 → 2 → 3 → 4 → 5 → 1 …
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % NODE_IDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const nodesWithHighlight = baseNodes.map((node, i) => ({
    ...node,
    data: {
      ...node.data,
      activeHighlight: i === activeIdx,
    },
  }));

  const [nodes, , onNodesChange] = useNodesState(nodesWithHighlight);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync with the cycling highlight
  useEffect(() => {
    onNodesChange(
      nodesWithHighlight.map((n) => ({
        id: n.id,
        type: "replace" as const,
        item: n,
      }))
    );
  }, [activeIdx]);

  return (
    <div
      style={{
        width: "100%",
        height: 560,
        borderRadius: 0,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0 }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e5e5" />
      </ReactFlow>
    </div>
  );
}
