"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AGENTS } from "@/constants/leads"

interface LeadFormModalProps {
  lead: any | null
  stages: any[]
  onClose: () => void
  onSubmit: (formData: any) => void
}

export const LeadFormModal = ({ lead, stages, onClose, onSubmit }: LeadFormModalProps) => {
  const [formData, setFormData] = useState({
    id: lead?.id || "",
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    notes: lead?.notes || "",
    agent: lead?.agent || AGENTS[0],
    priority: lead?.priority || "Medium",
    stageId: lead?.stageId || (stages.length > 0 ? stages[0].id : ""),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal title={lead ? "Edit Lead" : "Add New Lead"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Lead Name" name="name" value={formData.name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>
        <Select label="Assigned Agent" name="agent" value={formData.agent} onChange={handleChange}>
          {AGENTS.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Stage" name="stageId" value={formData.stageId} onChange={handleChange} required>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </Select>
          <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange} required>
            {["High", "Medium", "Low"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2 border"
        />
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-md"
          >
            {lead ? "Update Lead" : "Create Lead"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
