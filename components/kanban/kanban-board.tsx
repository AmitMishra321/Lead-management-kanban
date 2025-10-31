"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Plus, Download, Settings } from "lucide-react"
import { useLeadContext } from "@/context/lead-context"
import { LeadCard } from "@/components/leads/lead-card"
import { LeadFormModal } from "@/components/leads/lead-form-modal"
import { StageManagementModal } from "@/components/leads/stage-management-modal"
import { DashboardView } from "@/components/leads/dashboard-view"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { Select } from "@/components/ui/select"
import { exportLeadsToCSV } from "@/utils/export"
import { AGENTS } from "@/constants/leads"

export const KanbanBoard = () => {
  const {
    leads,
    stages,
    addOrUpdateLead,
    deleteLead: deleteLeadAction,
    moveLeadOrder,
    addStage,
    updateStageName,
    deleteStage: deleteStageAction,
    moveStage,
  } = useLeadContext()

  const [confirmState, setConfirmState] = useState<any>(null)
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [filterText, setFilterText] = useState("")
  const [filterAgent, setFilterAgent] = useState("")

  // Drag and Drop state
  const [draggedLead, setDraggedLead] = useState<any>(null)
  const [draggedOverCardId, setDraggedOverCardId] = useState<string | null>(null)
  const [showStageManagement, setShowStageManagement] = useState(false)

  const handleConfirmAction = (actionType: string, id: string, lead: any = null) => {
    let message = ""
    let title = ""
    let confirmAction = () => {}
    let isError = false
    let isAlert = false

    if (actionType === "deleteLead") {
      title = "Confirm Deletion"
      message = `Are you sure you want to delete lead: ${lead.name}?`
      confirmAction = () => deleteLeadAction(id)
    } else if (actionType === "deleteStage") {
      title = "Confirm Stage Deletion"
      const leadsInStage = leads.filter((l: any) => l.stageId === id).length
      if (leadsInStage > 0) {
        title = "Cannot Delete Stage"
        message = "This stage contains leads and cannot be deleted."
        isError = true
        isAlert = true
      } else {
        message = "Are you sure you want to delete this stage? This action cannot be undone."
        confirmAction = () => deleteStageAction(id)
      }
    }

    setConfirmState({
      title,
      message,
      onConfirm: confirmAction,
      onCancel: () => setConfirmState(null),
      isError,
      isAlert,
    })
  }

  const handleDragOverCard = (e: React.DragEvent, cardId: string) => {
    e.preventDefault()
    setDraggedOverCardId(cardId)
  }

  const handleDragLeaveCard = (e: React.DragEvent) => {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement) === false) {
      setDraggedOverCardId(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, lead: any) => {
    setDraggedLead(lead)
    e.dataTransfer!.setData("leadId", lead.id)
    e.dataTransfer!.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = "move"
  }

  const handleDrop = useCallback(
    (e: React.DragEvent, newStageId: string, targetLeadId: string | null = null) => {
      e.preventDefault()
      const leadId = e.dataTransfer!.getData("leadId")

      if (!leadId || !draggedLead) return
      setDraggedOverCardId(null)

      if (leadId === targetLeadId) {
        setDraggedLead(null)
        return
      }

      moveLeadOrder(leadId, newStageId, targetLeadId)
      setDraggedLead(null)
    },
    [draggedLead, moveLeadOrder],
  )

  const filteredLeads = useMemo(() => {
    return leads.filter((lead: any) => {
      const matchesText =
        lead.name.toLowerCase().includes(filterText.toLowerCase()) ||
        lead.email.toLowerCase().includes(filterText.toLowerCase()) ||
        lead.phone.toLowerCase().includes(filterText.toLowerCase()) ||
        lead.notes.toLowerCase().includes(filterText.toLowerCase())

      const matchesAgent = filterAgent ? lead.agent === filterAgent : true

      return matchesText && matchesAgent
    })
  }, [leads, filterText, filterAgent])

  const dashboardStats = useMemo(() => {
    const leadsByStage = stages.map((stage: any) => ({
      name: stage.name,
      count: leads.filter((lead: any) => lead.stageId === stage.id).length,
    }))

    const leadsByAgent = AGENTS.map((agent) => ({
      name: agent,
      count: leads.filter((lead: any) => lead.agent === agent).length,
    }))

    const totalLeads = leads.length

    return { leadsByStage, leadsByAgent, totalLeads }
  }, [leads, stages])

  if (showDashboard) {
    return <DashboardView stats={dashboardStats} onBack={() => setShowDashboard(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-sky-700">Lead Management Kanban Board </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-3">
            <div className="flex space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search leads..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
              <Select
                label="Agent"
                name="filterAgent"
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="">All Agents</option>
                {AGENTS.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="flex items-center px-3 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-md"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add Lead
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 4h4.89l-2.451-2.45M21 17a2 2 0 00-2-2h-2m-2-4v6m-4-6h.01"
                  />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => exportLeadsToCSV(leads, stages)}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                Export CSV
              </button>
              <button
                onClick={() => setShowStageManagement(true)}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
                Manage Stages
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Kanban Board */}
      <main className="flex-grow p-4 overflow-x-auto">
        <div className="flex h-full space-x-4 pb-4">
          {stages.map((stage: any) => {
            const leadsInStage = filteredLeads
              .filter((lead: any) => lead.stageId === stage.id)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

            const isDraggingOverColumn = draggedLead && draggedLead.stageId !== stage.id
            const isOriginalColumn = draggedLead && draggedLead.stageId === stage.id

            return (
              <div
                key={stage.id}
                className={`flex-shrink-0 w-80 bg-gray-200 rounded-xl p-3 shadow-inner ${
                  isDraggingOverColumn ? "ring-4 ring-sky-500 ring-offset-2" : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id, null)}
              >
                <div className="flex justify-between items-center mb-3 border-b border-gray-300 pb-2">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{stage.name}</h2>
                  <span className="bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {leadsInStage.length}
                  </span>
                </div>

                <div className="min-h-[50px]">
                  {leadsInStage.map((lead: any) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onEdit={(l) => {
                        setEditingLead(l)
                        setShowAddLeadModal(true)
                      }}
                      onDelete={handleConfirmAction}
                      onDragStart={handleDragStart}
                      onDragOverCard={handleDragOverCard}
                      onDragLeaveCard={handleDragLeaveCard}
                      onDropCard={handleDrop}
                      isDraggingOverTarget={draggedOverCardId === lead.id && draggedLead?.id !== lead.id}
                    />
                  ))}
                  {leadsInStage.length === 0 && (
                    <p className="text-gray-500 text-sm italic p-2 text-center">
                      {isDraggingOverColumn || isOriginalColumn ? "Drop lead here" : "No leads in this stage."}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          <div
            className="flex-shrink-0 w-80 p-3 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer h-min"
            onClick={() => setShowStageManagement(true)}
          >
            <span className="text-gray-600 font-medium">Click to Manage Stages (+)</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      {(showAddLeadModal || editingLead) && (
        <LeadFormModal
          lead={editingLead}
          stages={stages}
          onClose={() => {
            setShowAddLeadModal(false)
            setEditingLead(null)
          }}
          onSubmit={addOrUpdateLead}
        />
      )}

      {showStageManagement && (
        <StageManagementModal
          stages={stages}
          leads={leads}
          onClose={() => setShowStageManagement(false)}
          onAdd={addStage}
          onUpdate={updateStageName}
          onMove={moveStage}
          onDeleteConfirm={handleConfirmAction}
        />
      )}

      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
          isError={confirmState.isError}
          isAlert={confirmState.isAlert}
        />
      )}
    </div>
  )
}
