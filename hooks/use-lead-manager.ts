"use client"

import { useCallback } from "react"
import { useLocalStorage } from "@/utils/storage"
import { INITIAL_STAGES, STORAGE_KEYS } from "@/constants/leads"

export const useLeadManager = () => {
  const [leads, setLeads] = useLocalStorage(STORAGE_KEYS.LEADS, [])
  const [stages, setStages] = useLocalStorage(STORAGE_KEYS.STAGES, INITIAL_STAGES)

  const addOrUpdateLead = useCallback((leadData: any) => {
    setLeads((prevLeads: any[]) => {
      if (leadData.id) {
        return prevLeads.map((l: any) => (l.id === leadData.id ? { ...l, ...leadData } : l))
      } else {
        const newId = crypto.randomUUID()
        const leadsInStage = prevLeads.filter((l: any) => l.stageId === leadData.stageId)
        const maxOrder = leadsInStage.length > 0 ? Math.max(...leadsInStage.map((l: any) => l.order || 0)) : 0

        return [
          ...prevLeads,
          {
            ...leadData,
            id: newId,
            order: maxOrder + 1,
            createdAt: Date.now(),
          },
        ]
      }
    })
  }, [])

  const deleteLead = useCallback((leadId: string) => {
    setLeads((prevLeads: any[]) => prevLeads.filter((l: any) => l.id !== leadId))
  }, [])

  const moveLeadOrder = useCallback((leadToMoveId: string, newStageId: string, targetLeadId: string | null = null) => {
    setLeads((prevLeads: any[]) => {
      const leadToMove = prevLeads.find((l: any) => l.id === leadToMoveId)
      if (!leadToMove) return prevLeads

      const otherLeads = prevLeads.filter((l: any) => l.id !== leadToMoveId)
      const targetLeads = otherLeads
        .filter((l: any) => l.stageId === newStageId)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

      let newOrder

      if (!targetLeadId) {
        newOrder = targetLeads.length > 0 ? Math.max(...targetLeads.map((l: any) => l.order || 0)) + 1 : 1
      } else {
        const targetIndex = targetLeads.findIndex((l: any) => l.id === targetLeadId)

        if (targetIndex === -1) {
          newOrder = targetLeads.length > 0 ? Math.max(...targetLeads.map((l: any) => l.order || 0)) + 1 : 1
        } else {
          const targetCard = targetLeads[targetIndex]
          const prevCard = targetLeads[targetIndex - 1]

          if (targetIndex === 0) {
            newOrder = (targetCard.order || 0) / 2
          } else {
            newOrder = ((prevCard.order || 0) + (targetCard.order || 0)) / 2
          }

          if (newOrder === targetCard.order || (prevCard && newOrder <= prevCard.order)) {
            console.warn("Re-indexing stage to prevent order collision.")
            let cleanOrder = 1
            const leadsToReindex = [...targetLeads]
            leadsToReindex.splice(targetIndex, 0, leadToMove)

            const reindexedStage = leadsToReindex.map((lead: any) => {
              const newLead = { ...lead, order: cleanOrder }
              cleanOrder += 1
              return newLead
            })

            const movedLead = reindexedStage.find((l: any) => l.id === leadToMoveId)
            newOrder = movedLead.order

            const nonTargetLeads = prevLeads.filter((l: any) => l.stageId !== newStageId)
            return [...nonTargetLeads, ...reindexedStage]
          }
        }
      }

      return prevLeads.map((l: any) => (l.id === leadToMoveId ? { ...l, stageId: newStageId, order: newOrder } : l))
    })
  }, [])

  const addStage = useCallback((name: string) => {
    setStages((prevStages: any[]) => {
      const newOrder = prevStages.length > 0 ? Math.max(...prevStages.map((s: any) => s.order)) + 1 : 1
      return [...prevStages, { id: name.toLowerCase().replace(/\s/g, "-"), name, order: newOrder }]
    })
  }, [])

  const updateStageName = useCallback((id: string, newName: string) => {
    setStages((prevStages: any[]) => prevStages.map((s: any) => (s.id === id ? { ...s, name: newName } : s)))
  }, [])

  const deleteStage = useCallback((id: string) => {
    setStages((prevStages: any[]) => prevStages.filter((s: any) => s.id !== id))
    setLeads((prevLeads: any[]) => prevLeads.filter((l: any) => l.stageId !== id))
  }, [])

  const moveStage = useCallback((stageId: string, direction: number) => {
    setStages((prevStages: any[]) => {
      const newStages = [...prevStages].sort((a: any, b: any) => a.order - b.order)
      const stageIndex = newStages.findIndex((s: any) => s.id === stageId)
      const targetIndex = stageIndex + direction

      if (stageIndex === -1 || targetIndex < 0 || targetIndex >= newStages.length) return prevStages

      const tempOrder = newStages[stageIndex].order
      newStages[stageIndex].order = newStages[targetIndex].order
      newStages[targetIndex].order = tempOrder

      return newStages
    })
  }, [])

  return {
    leads,
    stages: stages.sort((a: any, b: any) => a.order - b.order),
    addOrUpdateLead,
    deleteLead,
    moveLeadOrder,
    addStage,
    updateStageName,
    deleteStage,
    moveStage,
  }
}
