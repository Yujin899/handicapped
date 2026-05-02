"use client"

import * as React from "react"
import { Clock, Users, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { Booking, BookingStatus } from "@/lib/types"

interface QueueStatusProps {
  booking: Booking
  locale: string
  allBookings: Booking[]
}

export function QueueStatus({ booking, locale, allBookings }: QueueStatusProps) {
  const isArabic = locale === "ar"
  
  // Calculate position
  const today = new Date().toISOString().split('T')[0]
  const isToday = booking.date === today
  
  if (!isToday || booking.status === "completed" || booking.status === "cancelled") {
    return null
  }

  // Active bookings for this clinic today
  const activeBookings = allBookings
    .filter(b => b.clinicId === booking.clinicId && b.date === today)
    .filter(b => b.status !== "completed" && b.status !== "cancelled")
    .sort((a, b) => {
       // Priority: in-progress > checked-in > confirmed/pending
       const statusOrder: Record<string, number> = { "in-progress": 0, "checked-in": 1, "confirmed": 2, "pending": 3, "completed": 4, "cancelled": 5 }
       const aOrder = statusOrder[a.status || "pending"] ?? 3
       const bOrder = statusOrder[b.status || "pending"] ?? 3
       
       if (aOrder !== bOrder) return aOrder - bOrder
       
       // If both checked in, use check-in time
       if (a.status === "checked-in" && b.status === "checked-in" && a.checkInTime && b.checkInTime) {
         return a.checkInTime.toMillis() - b.checkInTime.toMillis()
       }
       
       // Fallback to booking time
       return a.time.localeCompare(b.time)
    })

  const myIndex = activeBookings.findIndex(b => b.id === booking.id)
  
  if (myIndex === -1) return null

  const patientsAhead = myIndex
  const currentPatient = activeBookings.find(b => b.status === "in-progress")
  const isMyTurn = booking.status === "in-progress"
  const isNext = patientsAhead === 0 && !isMyTurn
  
  const estWaitTime = patientsAhead * 15 // Heuristic: 15 mins per patient

  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
                {isArabic ? "حالة الطابور" : "Queue Status"}
              </p>
              <h4 className="text-base font-bold leading-tight">
                {isMyTurn ? (
                   isArabic ? "دورك الآن!" : "It's your turn!"
                ) : isNext ? (
                   isArabic ? "أنت التالي!" : "You are next!"
                ) : (
                   isArabic ? `يوجد ${patientsAhead} مرضى قبلك` : `${patientsAhead} patients ahead of you`
                )}
              </h4>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant={isMyTurn ? "default" : "outline"} className={isMyTurn ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
              {booking.status || "pending"}
            </Badge>
            {!isMyTurn && patientsAhead > 0 && (
               <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                 <Clock className="size-3" />
                 <span>~{estWaitTime} {isArabic ? "دقيقة" : "min"}</span>
               </div>
            )}
          </div>
        </div>

        {isMyTurn && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mt-3 overflow-hidden rounded-md bg-emerald-500/10 p-2 text-center text-xs font-medium text-emerald-600"
          >
            {isArabic ? "الرجاء التوجه لغرفة الطبيب" : "Please proceed to the doctor's room"}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
