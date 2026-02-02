import type { Edge, Node, XYPosition } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

type Direction = "DOWN" | "UP" | "LEFT" | "RIGHT";
type Measured = { width?: number; height?: number };

type MeasuredNode<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TType extends string = string,
> = Node<TData, TType> & {
  measured?: Measured;
};

type LayoutOptions = {
  direction?: Direction;
  gapX?: number;
  gapY?: number;
};

type ElkPort = { id: string; properties?: Record<string, string> };
type ElkChild = {
  id: string;
  width: number;
  height: number;
  ports?: ElkPort[];
  x?: number;
  y?: number;
};
type ElkEdge = { id: string; sources: string[]; targets: string[] };
type ElkGraph = {
  id: string;
  layoutOptions: Record<string, string>;
  children: ElkChild[];
  edges: ElkEdge[];
};
type ElkLayoutResult = { children?: Array<Pick<ElkChild, "id" | "x" | "y">> };

export async function layoutWithElk<T extends MeasuredNode>(
  nodes: T[],
  edges: Edge[],
  { direction = "DOWN", gapX = 80, gapY = 120 }: LayoutOptions = {},
): Promise<T[]> {
  const portId = (nodeId: string, handleId: string) => `${nodeId}::${handleId}`;

  const elkGraph: ElkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": direction,
      "elk.spacing.nodeNode": String(gapX),
      "elk.layered.spacing.nodeNodeBetweenLayers": String(gapY),
      "elk.portConstraints": "FIXED_SIDE",
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.edgeRouting": "SPLINES",
      "elk.spacing.edgeNode": "10",
      "elk.layered.spacing.edgeEdgeBetweenLayers": "10",
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? 180,
      height: n.measured?.height ?? 100,
      ports: [
        {
          id: portId(n.id, "in-left"),
          properties: { "elk.port.side": "NORTH" },
        },
        {
          id: portId(n.id, "in-right"),
          properties: { "elk.port.side": "NORTH" },
        },
        { id: portId(n.id, "out"), properties: { "elk.port.side": "SOUTH" } },
      ],
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [portId(e.source, e.sourceHandle ?? "out")],
      targets: [portId(e.target, e.targetHandle ?? "in-left")],
    })),
  };

  const res = (await elk.layout(elkGraph)) as unknown as ElkLayoutResult;

  const pos = new Map<string, XYPosition>(
    (res.children ?? []).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]),
  );

  return nodes.map((n) => ({
    ...n,
    position: pos.get(n.id) ?? n.position,
  }));
}
