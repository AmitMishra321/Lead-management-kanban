"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface StageManagementModalProps {
  stages: any[]
  leads: any[]
  onClose: () => void
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onMove: (id: string, direction: number) => void
  onDeleteConfirm: (action: string, id: string) => void
}

export const StageManagementModal = ({
  stages,
  leads,
  onClose,
  onAdd,
  onUpdate,
  onMove,
  onDeleteConfirm,
}: StageManagementModalProps) => {
  const [newStageName, setNewStageName] = useState("")
  const [editStageId, setEditStageId] = useState<string | null>(null)
  const [editStageName, setEditStageName] = useState("")

  const startEdit = (stage: any) => {
    setEditStageId(stage.id)
    setEditStageName(stage.name)
  }

  const handleUpdate = () => {
    if (editStageId && editStageName.trim()) {
      onUpdate(editStageId, editStageName.trim())
      setEditStageId(null)
      setEditStageName("")
    }
  }

  const handleAdd = () => {
    if (newStageName.trim()) {
      onAdd(newStageName.trim())
      setNewStageName("")
    }
  }

  const leadsByStageMap = leads.reduce((acc: any, lead: any) => {
    acc[lead.stageId] = (acc[lead.stageId] || 0) + 1
    return acc
  }, {})

  return (
    <Modal title="Manage Kanban Stages" onClose={onClose}>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Add New Stage</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New Stage Name"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2 border"
            />
            <button
              onClick={handleAdd}
              disabled={!newStageName.trim()}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-2">Existing Stages</h3>
        <ul className="space-y-3">
          {stages.map((stage, index) => (
            <li
              key={stage.id}
              className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
            >
              {editStageId === stage.id ? (
                <div className="flex w-full sm:w-1/2 space-x-2 mb-2 sm:mb-0">
                  <input
                    type="text"
                    value={editStageName}
                    onChange={(e) => setEditStageName(e.target.value)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-1 border"
                  />
                  <button onClick={handleUpdate} className="text-sm text-sky-600 hover:text-sky-800 font-medium">
                    Save
                  </button>
                  <button
                    onClick={() => setEditStageId(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="font-medium text-gray-800 truncate pr-4 w-full sm:w-1/2">
                  {stage.name} ({leadsByStageMap[stage.id] || 0})
                </span>
              )}

              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => onMove(stage.id, -1)}
                  disabled={index === 0}
                  title="Move Left"
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => onMove(stage.id, 1)}
                  disabled={index === stages.length - 1}
                  title="Move Right"
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>

                <button
                  onClick={() => startEdit(stage)}
                  title="Rename Stage"
                  className="p-1 rounded-full text-sky-600 hover:bg-sky-100 transition-colors"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  onClick={() => onDeleteConfirm("deleteStage", stage.id)}
                  title="Delete Stage"
                  disabled={leadsByStageMap[stage.id] > 0}
                  className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
          {stages.length === 0 && <li className="text-gray-500 text-sm italic p-3 text-center">No stages defined.</li>}
        </ul>
        {Object.values(leadsByStageMap).some((count: any) => count > 0) && (
          <p className="text-red-500 text-sm mt-2">Note: Stages with leads cannot be deleted.</p>
        )}
      </div>
    </Modal>
  )
}
