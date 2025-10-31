"use client"

import type React from "react"

import { X } from "lucide-react"

interface ModalProps {
  title: string
  children: React.ReactNode
  onClose: () => void
  className?: string
}

export const Modal = ({ title, children, onClose, className = "" }: ModalProps) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div
      className={`bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto transform transition-all ${className}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
          <X className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
)
