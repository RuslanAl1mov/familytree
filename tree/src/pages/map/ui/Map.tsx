import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";

import { layoutWithElk } from "@/shared/lib/layout-grid-by-measured/layoutWithElk";
import { PersonNode, type PersonNodeType } from "@/shared/node/ui/PersonNode";

import cls from "./Map.module.css";

const nodeTypes: NodeTypes = {
  person: PersonNode,
};

export const initialNodes: PersonNodeType[] = [
  {
    id: "A",
    type: "person",
    data: {
      name: "A (root)",
      date_of_birth: "01.01.1950",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=1",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "B",
    type: "person",
    data: {
      name: "B (child of A)",
      date_of_birth: "01.01.1975",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=2",
      has_mother: false,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "C",
    type: "person",
    data: {
      name: "C (child of A)",
      date_of_birth: "01.01.1978",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=3",
      has_mother: false,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "SB",
    type: "person",
    data: {
      name: "SB (spouse of B)",
      date_of_birth: "01.01.1976",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=4",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "SC",
    type: "person",
    data: {
      name: "SC (spouse of C)",
      date_of_birth: "01.01.1979",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=5",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "D",
    type: "person",
    data: {
      name: "D (child of B+SB)",
      date_of_birth: "01.01.2000",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=6",
      has_mother: true,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "E",
    type: "person",
    data: {
      name: "E (child of B+SB)",
      date_of_birth: "01.01.2002",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=7",
      has_mother: true,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "F",
    type: "person",
    data: {
      name: "F (child of B+SB)",
      date_of_birth: "01.01.2004",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=8",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "G",
    type: "person",
    data: {
      name: "G (child of C+SC)",
      date_of_birth: "01.01.2001",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=9",
      has_mother: true,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "H",
    type: "person",
    data: {
      name: "H (child of C+SC)",
      date_of_birth: "01.01.2003",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=10",
      has_mother: true,
      has_father: true,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "SD",
    type: "person",
    data: {
      name: "SD (spouse of D)",
      date_of_birth: "01.01.2000",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=11",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "SE",
    type: "person",
    data: {
      name: "SE (spouse of E)",
      date_of_birth: "01.01.2002",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=12",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "SG",
    type: "person",
    data: {
      name: "SG (spouse of G)",
      date_of_birth: "01.01.2001",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=13",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "SH",
    type: "person",
    data: {
      name: "SH (spouse of H)",
      date_of_birth: "01.01.2003",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=14",
      has_mother: false,
      has_father: false,
      has_children: true,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "D1",
    type: "person",
    data: {
      name: "D1 (child of D+SD)",
      date_of_birth: "01.01.2025",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=15",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "D2",
    type: "person",
    data: {
      name: "D2 (child of D+SD)",
      date_of_birth: "01.01.2027",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=16",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "E1",
    type: "person",
    data: {
      name: "E1 (child of E+SE)",
      date_of_birth: "01.01.2026",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=17",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "E2",
    type: "person",
    data: {
      name: "E2 (child of E+SE)",
      date_of_birth: "01.01.2028",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=18",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "G1",
    type: "person",
    data: {
      name: "G1 (child of G+SG)",
      date_of_birth: "01.01.2025",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=19",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "G2",
    type: "person",
    data: {
      name: "G2 (child of G+SG)",
      date_of_birth: "01.01.2027",
      date_of_death: null,
      has_mother: true,
      has_father: true,
      has_children: false,
      photoUrl: "https://i.pravatar.cc/128?img=20",
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },

  {
    id: "H1",
    type: "person",
    data: {
      name: "H1 (child of H+SH)",
      date_of_birth: "01.01.2026",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=21",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
  {
    id: "H2",
    type: "person",
    data: {
      name: "H2 (child of H+SH)",
      date_of_birth: "01.01.2028",
      date_of_death: null,
      photoUrl: "https://i.pravatar.cc/128?img=22",
      has_mother: true,
      has_father: true,
      has_children: false,
    },
    draggable: false,
    position: { x: 0, y: 0 },
  },
];

export const initialEdges: Edge[] = [
  // A -> B,C (у нас один родитель, поэтому подключим только in-left)
  {
    id: "A->B",
    source: "A",
    target: "B",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "A->C",
    source: "A",
    target: "C",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // B + SB -> D,E,F
  {
    id: "B->D",
    source: "B",
    target: "D",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SB->D",
    source: "SB",
    target: "D",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "B->E",
    source: "B",
    target: "E",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SB->E",
    source: "SB",
    target: "E",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "B->F",
    source: "B",
    target: "F",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SB->F",
    source: "SB",
    target: "F",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // C + SC -> G,H
  {
    id: "C->G",
    source: "C",
    target: "G",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SC->G",
    source: "SC",
    target: "G",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "C->H",
    source: "C",
    target: "H",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SC->H",
    source: "SC",
    target: "H",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // D + SD -> D1, D2
  {
    id: "D->D1",
    source: "D",
    target: "D1",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SD->D1",
    source: "SD",
    target: "D1",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "D->D2",
    source: "D",
    target: "D2",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SD->D2",
    source: "SD",
    target: "D2",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // E + SE -> E1, E2
  {
    id: "E->E1",
    source: "E",
    target: "E1",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SE->E1",
    source: "SE",
    target: "E1",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "E->E2",
    source: "E",
    target: "E2",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SE->E2",
    source: "SE",
    target: "E2",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // G + SG -> G1, G2
  {
    id: "G->G1",
    source: "G",
    target: "G1",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SG->G1",
    source: "SG",
    target: "G1",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "G->G2",
    source: "G",
    target: "G2",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SG->G2",
    source: "SG",
    target: "G2",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  // H + SH -> H1, H2
  {
    id: "H->H1",
    source: "H",
    target: "H1",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SH->H1",
    source: "SH",
    target: "H1",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },

  {
    id: "H->H2",
    source: "H",
    target: "H2",
    sourceHandle: "out",
    targetHandle: "in-left",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
  {
    id: "SH->H2",
    source: "SH",
    target: "H2",
    sourceHandle: "out",
    targetHandle: "in-right",
    type: "smoothstep",
    animated: false,
    deletable: false,
  },
];

export const Map = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<PersonNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const { fitView } = useReactFlow();

  // Auto Layout
  const laidOutOnce = useRef(false);
  useEffect(() => {
    const ready =
      nodes.length > 0 &&
      nodes.every(
        (n) => (n.measured?.width ?? 0) > 0 && (n.measured?.height ?? 0) > 0,
      );

    if (!ready || laidOutOnce.current) return;

    laidOutOnce.current = true;

    const runLayout = async () => {
      const next = await layoutWithElk(nodes, edges, {
        direction: "DOWN",
        gapX: 80,
        gapY: 120,
      });

      setNodes(next);
      queueMicrotask(() => {
        void fitView({ padding: 0.2 }).catch((err) => {
          console.error("fitView failed", err);
        });
      });
    };

    void runLayout().catch((err) => {
      // можно ещё laidOutOnce.current = false; если хочешь разрешить повтор при ошибке
      console.error("layoutWithElk failed", err);
    });
  }, [nodes, edges, setNodes, fitView]);

  // Node connections handler
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            // необязательно, но полезно:
            type: "smoothstep",
            animated: false,
            deletable: false,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  return (
    <div className={cls.wrapper} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background
          bgColor={"var(--white)"}
          color={"var(--black)"}
          size={1}
          gap={10}
          variant={BackgroundVariant.Dots}
        />
        <MiniMap
          bgColor="#b6b6b6"
          nodeBorderRadius={5}
          nodeColor={"var(--gray)"}
          zoomable
          nodeStrokeColor={"var(--white)"}
          nodeStrokeWidth={4}
          ariaLabel={""}
        />
        <Controls orientation="horizontal" className="controlPanel" />
      </ReactFlow>
    </div>
  );
};
