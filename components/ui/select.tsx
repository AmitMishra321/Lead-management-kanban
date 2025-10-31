"use client"

import type React from "react"

interface SelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
  required?: boolean
  className?: string
}

export const Select = ({ label, name, value, onChange, children, required = false, className = "" }: SelectProps) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2 border bg-white"
    >
      {children}
    </select>
  </div>
)
