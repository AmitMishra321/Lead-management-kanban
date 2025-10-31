"use client"

import { LeadProvider } from "@/context/lead-context"
import { KanbanBoard } from "@/components/kanban/kanban-board"

export default function Home() {
  return (
    <LeadProvider>
      <div className="font-sans">
        <KanbanBoard />
      </div>
    </LeadProvider>
  )
}
