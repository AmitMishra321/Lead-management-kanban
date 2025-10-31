"use client"

import { ArrowLeft } from "lucide-react"

interface DashboardViewProps {
  stats: {
    totalLeads: number
    leadsByStage: Array<{ name: string; count: number }>
    leadsByAgent: Array<{ name: string; count: number }>
  }
  onBack: () => void
}

export const DashboardView = ({ stats, onBack }: DashboardViewProps) => {
  const maxStageCount = Math.max(...stats.leadsByStage.map((s) => s.count), 1)
  const maxAgentCount = Math.max(...stats.leadsByAgent.map((a) => a.count), 1)

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-sky-600 hover:text-sky-800 transition-colors font-medium"
      >
        <ArrowLeft className="h-5 w-5 mr-1" strokeWidth={2} />
        Back to Kanban Board
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Sales Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-sky-500">
          <p className="text-sm font-medium text-gray-500">Total Leads</p>
          <p className="text-4xl font-extrabold text-sky-600 mt-1">{stats.totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Leads Won</p>
          <p className="text-4xl font-extrabold text-green-600 mt-1">
            {stats.leadsByStage.find((s) => s.name === "Won")?.count || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500">Leads Lost</p>
          <p className="text-4xl font-extrabold text-red-600 mt-1">
            {stats.leadsByStage.find((s) => s.name === "Lost")?.count || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Leads by Stage</h3>
          <div className="space-y-4">
            {stats.leadsByStage.map((stage) => (
              <div key={stage.name} className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-700 truncate">{stage.name}</span>
                <div className="flex-grow ml-4">
                  <div className="h-6 rounded-md bg-gray-200">
                    <div
                      className="h-full rounded-md bg-sky-500 transition-all duration-500 ease-out flex items-center justify-end"
                      style={{
                        width: `${(stage.count / maxStageCount) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-bold pr-2">{stage.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Leads by Agent</h3>
          <div className="space-y-4">
            {stats.leadsByAgent.map((agent) => (
              <div key={agent.name} className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-700 truncate">{agent.name}</span>
                <div className="flex-grow ml-4">
                  <div className="h-6 rounded-md bg-gray-200">
                    <div
                      className="h-full rounded-md bg-green-500 transition-all duration-500 ease-out flex items-center justify-end"
                      style={{
                        width: `${(agent.count / maxAgentCount) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-bold pr-2">{agent.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
