"use client"

import { Modal } from "./modal"

interface ConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isError?: boolean
  isAlert?: boolean
}

export const ConfirmModal = ({ title, message, onConfirm, onCancel, isError, isAlert }: ConfirmModalProps) => (
  <Modal title={title} onClose={isAlert ? onConfirm : onCancel}>
    <p className={`text-lg mb-6 ${isError ? "text-red-700" : "text-gray-700"}`}>{message}</p>
    <div className="flex justify-end space-x-3">
      {isAlert ? (
        <button
          onClick={onConfirm || (() => {})}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          OK
        </button>
      ) : (
        <>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm || (() => {})}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors shadow-md ${
              isError ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Confirm Delete
          </button>
        </>
      )}
    </div>
  </Modal>
)
