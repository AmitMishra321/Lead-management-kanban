// Agent and priority configurations
export const AGENTS = ["John Smith", "Priya Sharma", "Ahmed Khan", "Maria Rodriguez"]

export const PRIORITY_COLORS = {
  High: "bg-red-500/20 text-red-700 ring-red-500",
  Medium: "bg-yellow-500/20 text-yellow-700 ring-yellow-500",
  Low: "bg-green-500/20 text-green-700 ring-green-500",
}

export const INITIAL_STAGES = [
  { id: "new-lead", name: "New Lead", order: 1 },
  { id: "contacted", name: "Contacted", order: 2 },
  { id: "qualified", name: "Qualified", order: 3 },
  { id: "won", name: "Won", order: 4 },
  { id: "lost", name: "Lost", order: 5 },
]

export const STORAGE_KEYS = {
  LEADS: "kanban_leads",
  STAGES: "kanban_stages",
}
