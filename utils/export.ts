export const exportLeadsToCSV = (leads: any[], stages: any[]) => {
  if (leads.length === 0) {
    console.warn("No leads to export.")
    return
  }

  const stageMap = stages.reduce((acc: any, stage: any) => {
    acc[stage.id] = stage.name
    return acc
  }, {})

  const headers = ["ID", "Name", "Email", "Phone", "Stage", "Agent", "Priority", "Notes"]
  const csvRows = leads.map((lead: any) =>
    [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      stageMap[lead.stageId] || "N/A",
      lead.agent,
      lead.priority,
      `"${lead.notes.replace(/"/g, '""')}"`,
    ].join(","),
  )

  const csvContent = [headers.join(","), ...csvRows].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "lead_kanban_export.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
