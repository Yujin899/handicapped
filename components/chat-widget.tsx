"use client"

import * as React from "react"
import { MessageCircle, X, Send, Loader2, ChevronRight, RotateCcw, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { mockClinics } from "@/lib/mock-data"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = { id: string; role: "user" | "assistant"; content: string; displayContent?: string }
type QuickReply = { labelEn: string; labelAr: string; value: string }

// ─── Quick-reply sets ─────────────────────────────────────────────────────────

const QUICK_REPLIES: Record<string, QuickReply[]> = {
  greeting: [
    { labelEn: "🔍 Find a clinic", labelAr: "🔍 ابحث عن عيادة", value: "I need help finding a clinic" },
    { labelEn: "♿ Accessibility info", labelAr: "♿ معلومات إمكانية الوصول", value: "What accessibility features do you cover?" },
    { labelEn: "📋 How does it work?", labelAr: "📋 كيف يعمل الموقع؟", value: "How does AccessClinic work?" },
  ],
  specialty: [
    { labelEn: "🦷 Dentistry", labelAr: "🦷 طب الأسنان", value: "I need a dentist" },
    { labelEn: "👁️ Eye care", labelAr: "👁️ رعاية العيون", value: "I need an eye clinic" },
    { labelEn: "🦴 Orthopedics", labelAr: "🦴 جراحة العظام", value: "I need an orthopedics clinic" },
    { labelEn: "🧠 Mental health", labelAr: "🧠 الصحة النفسية", value: "I need a mental health clinic" },
    { labelEn: "❤️ Cardiology", labelAr: "❤️ طب القلب", value: "I need a cardiology clinic" },
    { labelEn: "🧒 Pediatrics", labelAr: "🧒 طب الأطفال", value: "I need a pediatrics clinic" },
    { labelEn: "💪 Physiotherapy", labelAr: "💪 العلاج الطبيعي", value: "I need a physiotherapy clinic" },
    { labelEn: "🏥 General / Other", labelAr: "🏥 عام / أخرى", value: "I need a general clinic" },
  ],
  accessibility: [
    { labelEn: "♿ Wheelchair access", labelAr: "♿ مداخل كراسي متحركة", value: "I need wheelchair accessibility" },
    { labelEn: "🦻 Hearing support", labelAr: "🦻 دعم السمع", value: "I need hearing support (sign language / hearing loops)" },
    { labelEn: "🤫 Quiet environment", labelAr: "🤫 بيئة هادئة", value: "I need a quiet, sensory-friendly environment" },
    { labelEn: "👁️‍🗨️ Visual support", labelAr: "👁️‍🗨️ دعم بصري", value: "I need visual assistance support" },
    { labelEn: "✅ All of the above", labelAr: "✅ كل ما سبق", value: "I need full accessibility: wheelchair, hearing, quiet, and visual support" },
  ],
  location: [
    { labelEn: "📍 Cairo", labelAr: "📍 القاهرة", value: "I am in Cairo" },
    { labelEn: "📍 Giza", labelAr: "📍 الجيزة", value: "I am in Giza" },
    { labelEn: "📍 Alexandria", labelAr: "📍 الإسكندرية", value: "I am in Alexandria" },
    { labelEn: "📍 Anywhere in Egypt", labelAr: "📍 في أي مكان بمصر", value: "Location doesn't matter, show me the best options anywhere in Egypt" },
  ],
  followUp: [
    { labelEn: "🔍 Search differently", labelAr: "🔍 بحث مختلف", value: "Let me try a different search" },
    { labelEn: "📅 How to book?", labelAr: "📅 كيف أحجز؟", value: "How do I book an appointment?" },
    { labelEn: "❓ More questions", labelAr: "❓ أسئلة أخرى", value: "I have other questions" },
  ],
}

// Smart stage detector
function detectStage(messages: Message[]): string {
  if (messages.length <= 1) return "greeting"

  const lastAssistant = [...messages].reverse().find(m => m.role === "assistant")?.content?.toLowerCase() || ""
  const lastUser = [...messages].reverse().find(m => m.role === "user")?.content?.toLowerCase() || ""

  if (lastAssistant.includes("/clinics/")) return "followUp"
  if (lastAssistant.includes("location") || lastAssistant.includes("city") || lastAssistant.includes("المدينة")) return "location"
  if (lastAssistant.includes("accessibility") || lastAssistant.includes("wheelchair") || lastAssistant.includes("إمكانية")) return "accessibility"
  if (lastAssistant.includes("specialty") || lastAssistant.includes("type of clinic") || lastAssistant.includes("تخصص")) return "specialty"
  if ((lastUser.includes("find") || lastUser.includes("clinic") || lastUser.includes("need") || lastUser.includes("ابحث")) && messages.length <= 3) return "specialty"

  return "followUp"
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function parseMessageText(text: string) {
  // Split text by [CLINIC_CARD:id] tags
  const parts = text.split(/(\[CLINIC_CARD:[^\]]+\])/g)
  return parts
}

function ClinicCardInline({ id, isArabic, locale, onBookNow }: { id: string, isArabic: boolean, locale: string, onBookNow?: () => void }) {
  const clinic = mockClinics.find(c => c.id === id)
  if (!clinic) return null

  return (
    <div className="my-3 flex flex-col gap-2 rounded-xl border border-primary/20 bg-background p-3 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-primary">{isArabic ? clinic.nameAr : clinic.name}</h4>
          <p className="text-xs text-muted-foreground">{isArabic ? clinic.specialtyAr : clinic.specialty}</p>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-yellow-400/10 px-1.5 py-0.5 text-xs font-bold text-yellow-600">
          ⭐ {clinic.rating}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {clinic.accessibility?.wheelchair && <span className="text-[10px] bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded">♿ {isArabic ? "كرسي متحرك" : "Wheelchair"}</span>}
        {clinic.accessibility?.hearing && <span className="text-[10px] bg-purple-500/10 text-purple-700 px-1.5 py-0.5 rounded">🦻 {isArabic ? "سمع" : "Hearing"}</span>}
        {clinic.accessibility?.quiet && <span className="text-[10px] bg-green-500/10 text-green-700 px-1.5 py-0.5 rounded">🤫 {isArabic ? "هادئ" : "Quiet"}</span>}
        {clinic.accessibility?.visual && <span className="text-[10px] bg-orange-500/10 text-orange-700 px-1.5 py-0.5 rounded">👁️ {isArabic ? "بصري" : "Visual"}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1">📍 {isArabic ? clinic.locationAr : clinic.location}</span>
        <Link 
          href={`/${locale}/clinics/${clinic.id}`}
          onClick={onBookNow}
          className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          {isArabic ? "احجز الآن" : "Book Now"}
        </Link>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatWidget({ locale }: { locale: string }) {
  const { currentUser, profile } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)
  const [freeTextMode, setFreeTextMode] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const isArabic = locale === "ar"

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input on free-text mode
  React.useEffect(() => {
    if (freeTextMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [freeTextMode])

  const stage = detectStage(messages)
  const quickReplies = QUICK_REPLIES[stage] ?? QUICK_REPLIES.followUp

  // ── Core send function ──────────────────────────────────────────────────────
  const sendMessage = React.useCallback(async (text: string, displayText?: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setError(null)
    const userMsg: Message = { id: uid(), role: "user", content: trimmed, displayContent: displayText }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsLoading(true)

    // Placeholder for the assistant reply
    const assistantId = uid()
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          locale,
          userPreferences: profile?.accessibilityPreferences || [],
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`
        try {
          const errBody = await res.json()
          errMsg = errBody.error || errMsg
        } catch { /* ignore parse error */ }
        console.error("[chat] Server error:", errMsg)
        throw new Error(errMsg)
      }
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk

        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m)
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      console.error("Chat error:", err)
      setError(isArabic ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى." : "Connection error. Please try again.")
      // Remove the empty assistant placeholder on error
      setMessages(prev => prev.filter(m => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, isArabic])

  const handleQuickReply = (qr: QuickReply) => {
    sendMessage(qr.value, isArabic ? qr.labelAr : qr.labelEn)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput("")
    setFreeTextMode(false)
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setMessages([])
    setInput("")
    setError(null)
    setFreeTextMode(false)
    setIsLoading(false)
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 sm:bottom-6 z-50 flex flex-col items-end transition-all duration-300 ease-in-out",
        isArabic ? "left-4 sm:left-6" : "right-4 sm:right-6"
      )}
      style={{ 
        transform: `translateY(calc(-1 * var(--chat-widget-offset, 0px)))` 
      } as React.CSSProperties}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className={cn(
              "mb-4 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[440px]",
              isArabic ? "origin-bottom-left" : "origin-bottom-right"
            )}
          >
            <div className="flex h-[min(600px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-background">

              {/* ── Header ── */}
              <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary-foreground/30 shadow-lg">
                    <Image src="/mosaed.png" alt="Mosaed" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">
                      {isArabic ? "مساعد" : "Mosaed"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-primary-foreground/70 font-medium">
                      {isArabic ? "مساعدك لإيجاد العيادة المناسبة" : "Your Accessibility Guide"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    title={isArabic ? "محادثة جديدة" : "New conversation"}
                    className="rounded-lg p-1.5 opacity-70 transition hover:bg-primary-foreground/10 hover:opacity-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1.5 opacity-70 transition hover:bg-primary-foreground/10 hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20"
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* Welcome message */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border shadow">
                      <Image src="/mosaed.png" alt="Mosaed" fill className="object-cover" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-white border border-border/60 px-4 py-3 shadow-sm text-sm text-foreground leading-relaxed">
                      {isArabic
                        ? "👋 أهلاً! أنا مساعد، دليلك لإيجاد العيادة الطبية الأنسب لك. كيف يمكنني مساعدتك اليوم؟"
                        : "👋 Hello! I'm Mosaed, your guide to finding the right accessible clinic in Egypt. How can I help you today?"}
                    </div>
                  </motion.div>
                )}

                {messages.map((m) => {
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-end gap-2.5",
                        m.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {m.role === "assistant" && (
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border shadow mb-1">
                          <Image src="/mosaed.png" alt="Mosaed" fill className="object-cover" />
                        </div>
                      )}
                      {m.role === "user" && (
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border shadow mb-1">
                          <Image src={profile?.photoURL || currentUser?.photoURL || "/profile.png"} alt="User" fill className="object-cover" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-white border border-border/60 text-foreground rounded-bl-none shadow-sm"
                        )}
                      >
                        {m.role === "user" ? (m.displayContent || m.content) : (
                          m.content ? parseMessageText(m.content).map((part, i) => {
                            if (part.startsWith("[CLINIC_CARD:") && part.endsWith("]")) {
                              const id = part.slice(13, -1)
                              return <ClinicCardInline key={i} id={id} isArabic={isArabic} locale={locale} onBookNow={() => setIsOpen(false)} />
                            }
                            return <React.Fragment key={i}>{part}</React.Fragment>
                          }) : (
                            <span className="flex gap-1 items-center py-0.5">
                              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
                            </span>
                          )
                        )}
                      </div>
                    </motion.div>
                  )
                })}

                {/* Error */}
                {error && (
                  <div className="text-center text-xs text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                    ⚠️ {error}
                  </div>
                )}
              </div>

              {/* ── Quick Replies ── */}
              {!isLoading && (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 border-t border-border/60 bg-background/80 px-3 pt-2.5 pb-2"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                    {isArabic ? "اختر خياراً أو اكتب سؤالك" : "Choose an option or type below"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplies.map((qr) => (
                      <button
                        key={qr.value}
                        onClick={() => handleQuickReply(qr)}
                        disabled={isLoading}
                        className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-50"
                      >
                        {isArabic ? qr.labelAr : qr.labelEn}
                        <ChevronRight className={cn("h-3 w-3 shrink-0 opacity-60", isArabic && "rotate-180")} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Text Input ── */}
              <div
                className="shrink-0 border-t border-border/60 bg-background p-3"
                dir={isArabic ? "rtl" : "ltr"}
              >
                {freeTextMode ? (
                  <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={isArabic ? "اكتب رسالتك..." : "Type your message..."}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="flex-1 h-9 rounded-lg border border-primary/30 bg-muted/40 px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-xl"
                      disabled={isLoading || !input.trim()}
                    >
                      {isLoading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Send className={cn("h-4 w-4", isArabic && "rotate-180")} />
                      }
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setFreeTextMode(false); setInput("") }}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setFreeTextMode(true)}
                    disabled={isLoading}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-primary/30 bg-muted/30 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/60 hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" />
                    <span>{isArabic ? "اكتب سؤالاً مخصصاً..." : "Type a custom message..."}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Toggle ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors",
          isOpen ? "bg-destructive text-white" : "bg-primary text-primary-foreground"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Online indicator */}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
        )}
      </motion.button>
    </div>
  )
}
