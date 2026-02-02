import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import cn from "classnames";
import { memo } from "react";

import cls from "./PersonNode.module.css";

export type PersonNodeData = {
  name: string;
  photoUrl?: string | null;
  date_of_birth?: string | null;
  date_of_death?: string | null;
  has_mother: boolean;
  has_father: boolean;
  has_children: boolean;
};

export type PersonNodeType = Node<PersonNodeData, "person">;

const PersonNodeComponent = ({ data, selected }: NodeProps<PersonNodeType>) => {
  const {
    name,
    photoUrl,
    date_of_birth,
    date_of_death,
    has_mother,
    has_father,
    has_children,
  } = data;

  const date = [date_of_birth, date_of_death].filter(Boolean).join(" - ");

  return (
    <div className={cn(cls.node, selected && cls.nodeSelected)} title={name}>
      {/* входы */}
      {has_father && (
        <Handle id="in-left" type="target" position={Position.Top} />
      )}
      {has_mother && (
        <Handle id="in-right" type="target" position={Position.Top} />
      )}

      <div className={cls.avatar} aria-hidden="true">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className={cls.avatarImg}
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
      </div>

      <div className={cls.textBlock}>
        <div className={cls.name}>{name}</div>
        {date ? <div className={cls.date}>{date}</div> : null}
      </div>

      {/* выход */}
      {has_children && (
        <Handle type="source" position={Position.Bottom} id="out" />
      )}
    </div>
  );
};

export const PersonNode = memo(PersonNodeComponent);
