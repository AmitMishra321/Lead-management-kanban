"use client"

import React from "react"
import { Pencil, Trash2 } from "lucide-react"
import { PRIORITY_COLORS } from "@/constants/leads"

interface LeadCardProps {
  lead: any
  onEdit: (lead: any) => void
  onDelete: (action: string, id: string, lead: any) => void
  onDragStart: (e: React.DragEvent, lead: any) => void
  onDragOverCard: (e: React.DragEvent, cardId: string) => void
  onDragLeaveCard: (e: React.DragEvent) => void
  onDropCard: (e: React.DragEvent, stageId: string, cardId: string) => void
  isDraggingOverTarget: boolean
}

export const LeadCard = React.memo(
  ({
    lead,
    onEdit,
    onDelete,
    onDragStart,
    onDragOverCard,
    onDragLeaveCard,
    onDropCard,
    isDraggingOverTarget,
  }: LeadCardProps) => {
    const priorityClass =
      PRIORITY_COLORS[lead.priority as keyof typeof PRIORITY_COLORS] || "bg-gray-100 text-gray-700 ring-gray-300"

    return (
      <div
        className={`bg-white p-3 mb-3 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-grab border-l-4 border-l-sky-500 
          ${isDraggingOverTarget ? "border-2 border-dashed border-sky-500 bg-sky-50 ring-2 ring-sky-300" : ""}`}
        draggable
        onDragStart={(e) => onDragStart(e, lead)}
        onDragEnter={(e) => onDragOverCard(e, lead.id)}
        onDragLeave={onDragLeaveCard}
        onDrop={(e) => onDropCard(e, lead.stageId, lead.id)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-base font-semibold text-gray-900 truncate pr-2">{lead.name}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${priorityClass}`}
          >
            {lead.priority}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 mb-2">{lead.agent}</p>
        <p className="text-sm text-gray-600 truncate">{lead.email}</p>
        <p className="text-sm text-gray-600 truncate">{lead.phone}</p>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(lead)}
            className="text-sky-600 hover:text-sky-800 text-sm p-1 rounded-full hover:bg-sky-100 transition-colors"
            title="Edit Lead"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => onDelete("deleteLead", lead.id, lead)}
            className="text-red-600 hover:text-red-800 text-sm p-1 rounded-full hover:bg-red-100 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    )
  },
)

LeadCard.displayName = "LeadCard"
