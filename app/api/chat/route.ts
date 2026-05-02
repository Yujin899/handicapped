import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { mockClinics } from "@/lib/mock-data"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, locale, userPreferences = [] } = await req.json()

    const isArabic = locale === "ar"

    // --- HYBRID INTENT ROUTER ---
    // Intercept common FAQs to provide instant, deterministic responses without hitting the AI model.
    const lastMessage = messages[messages.length - 1]?.content?.trim()
    
    if (lastMessage === "How does AccessClinic work?" || lastMessage === "كيف يعمل الموقع؟") {
      const responseText = isArabic 
        ? "أهلاً بك! **AccessClinic** هي أول منصة في مصر لمساعدتك في العثور على عيادات يسهل الوصول إليها.\n\n1️⃣ **ابحث**: اختر التخصص والمدينة.\n2️⃣ **حدد احتياجاتك**: مثل الكراسي المتحركة، دعم السمع، أو بيئة هادئة.\n3️⃣ **تأكد**: جميع العيادات موثقة مسبقاً لضمان إمكانية الوصول.\n\nكيف يمكنني مساعدتك اليوم؟"
        : "Welcome! **AccessClinic** is Egypt's first platform dedicated to finding accessible healthcare.\n\n1️⃣ **Search**: Choose your needed specialty and city.\n2️⃣ **Filter**: Select your accessibility needs (e.g., wheelchair access, hearing support, quiet environment).\n3️⃣ **Trust**: All clinics are pre-verified for accessibility.\n\nHow can I help you today?"
      
      // Return a simulated stream response so the frontend parses it seamlessly
      return new Response(responseText, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
    }

    if (lastMessage === "What accessibility features do you cover?" || lastMessage === "معلومات إمكانية الوصول") {
      const responseText = isArabic
        ? "نحن نغطي حالياً أربع فئات رئيسية:\n\n♿ **الكراسي المتحركة**: منحدرات، مصاعد، ومرافق مجهزة.\n🦻 **دعم السمع**: لغة الإشارة والتنبيهات البصرية.\n🤫 **بيئة هادئة**: غرف انتظار غير مزدحمة وإضاءة مريحة (مثالية للتوحد والقلق).\n👁️ **دعم بصري**: لافتات برايل ومسارات لمسية.\n\nهل تبحث عن عيادة تدعم أي من هذه الميزات؟"
        : "We currently verify four main accessibility categories:\n\n♿ **Wheelchair Access**: Ramps, elevators, and wide corridors.\n🦻 **Hearing Support**: Sign language interpreters and visual alerts.\n🤫 **Quiet Environment**: Sensory-friendly spaces and uncrowded waiting rooms (ideal for autism or severe anxiety).\n👁️ **Visual Support**: Braille signage and tactile paths.\n\nAre you looking for a clinic with any of these features?"
      
      return new Response(responseText, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
    }
    // ----------------------------

    // --- VECTOR SEARCH / RAG SIMULATION ---
    // Instead of injecting the entire database (which breaks token limits), we find the top 5 most relevant clinics
    // based on keywords in the user's recent messages.
    const recentUserText = messages
      .filter((m: any) => m.role === "user")
      .slice(-3)
      .map((m: any) => m.content.toLowerCase())
      .join(" ")

    // Score clinics based on relevance to the user's text
    const scoredClinics = mockClinics.map(clinic => {
      let score = 0
      
      // Specialty matching
      if (clinic.specialty && recentUserText.includes(clinic.specialty.toLowerCase())) score += 10
      if (clinic.specialtyAr && recentUserText.includes(clinic.specialtyAr.toLowerCase())) score += 10
      
      // Location matching
      if (clinic.location && recentUserText.includes(clinic.location.toLowerCase())) score += 5
      if (clinic.locationAr && recentUserText.includes(clinic.locationAr.toLowerCase())) score += 5
      
      // Accessibility matching
      if (clinic.accessibility?.wheelchair && (recentUserText.includes("wheelchair") || recentUserText.includes("كرسي"))) score += 3
      if (clinic.accessibility?.hearing && (recentUserText.includes("hearing") || recentUserText.includes("سمع"))) score += 3
      if (clinic.accessibility?.quiet && (recentUserText.includes("quiet") || recentUserText.includes("هادئ"))) score += 3
      if (clinic.accessibility?.visual && (recentUserText.includes("visual") || recentUserText.includes("بصر"))) score += 3

      // Base score (rating) to act as tie-breaker
      score += ((clinic.rating || 0) / 5)

      return { clinic, score }
    })

    // Sort by score and take the top 5
    scoredClinics.sort((a, b) => b.score - a.score)
    const topClinics = scoredClinics.slice(0, 5).map(s => s.clinic)

    const clinicsContext = topClinics.map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      specialty: c.specialty,
      specialtyAr: c.specialtyAr,
      location: c.location,
      locationAr: c.locationAr,
      rating: c.rating,
      reviews: c.reviews,
      accessibility: {
        wheelchair: c.accessibility?.wheelchair ?? false,
        hearing: c.accessibility?.hearing ?? false,
        quiet: c.accessibility?.quiet ?? false,
        visual: c.accessibility?.visual ?? false,
      },
    }))
    // --------------------------------------

    const today = new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const localeInstruction = isArabic
      ? `IMPORTANT: The user interface is set to Arabic. You MUST respond ENTIRELY in Arabic (Modern Standard Arabic). All text, clinic names, and links must use the Arabic locale URL format: /${locale}/clinics/[id]`
      : `The user interface is set to English. Respond in English. Use the URL format: /${locale}/clinics/[id]`

    let userContext = ""
    if (userPreferences.length > 0) {
      userContext = `\n## USER PREFERENCES\nThe user has saved the following accessibility preferences in their profile: ${userPreferences.join(", ")}. \n**IMPORTANT**: Always filter recommendations to explicitly include clinics that match these saved preferences, unless the user explicitly says otherwise.`
    }

    const systemPrompt = `
You are **Mosaed (مساعد)**, a warm, knowledgeable, and empathetic AI assistant for **AccessClinic** — Egypt's first platform dedicated to helping people with disabilities find verified, accessible healthcare facilities.

Today is ${today}.

## LANGUAGE
${localeInstruction}${userContext}
**CRITICAL SYSTEM RULE**: You must NEVER output Chinese characters, symbols, or ANY language other than the requested language (English or Arabic). If you are uncertain about a translation, keep it in English. Do not attempt to use Asian character sets under any circumstances.

## YOUR CORE MISSION
Help users find the *best-matching* clinic based on:
1. Their **medical specialty** need (e.g., dentistry, cardiology, pediatrics).
2. Their **location** in Egypt (Cairo, Giza, Alexandria, etc.).
3. Their **accessibility requirements** (wheelchair access, hearing support, quiet/sensory-friendly spaces, visual assistance).

## PERSONALITY & TONE
- Be **warm, encouraging, and patient** — many users may be anxious or frustrated.
- Use **simple, clear language** — avoid jargon.
- Show genuine empathy. Acknowledge challenges before jumping to solutions.
- Be **concise** — no walls of text. Use bullet points or short paragraphs.

## CONVERSATION STRATEGY
You are a *guided assistant*, not just a search engine. Follow this smart flow:

1. **Acknowledge** the user's request warmly.
2. **Narrow down** by asking about specialty → then location → then accessibility needs (one topic at a time).
3. **Recommend 1–3 best matches** with a short reason why each is suitable.
4. **Provide a direct link** to each clinic page.
5. After recommending, **offer next steps**: booking, more info, or a fresh search.

## ACCESSIBILITY FEATURE GUIDE
- **Wheelchair (♿)**: Ramps, wide corridors, accessible parking, elevators, accessible bathrooms.
- **Hearing support (🦻)**: Sign language interpretation, hearing loop systems, visual alert systems.
- **Quiet environment (🤫)**: Sensory-friendly spaces, low noise — ideal for autism, anxiety, PTSD, or sensory sensitivities.
- **Visual support (👁️)**: Braille signage, tactile paths, large-print materials, trained staff.

## CLINIC RECOMMENDATIONS FORMAT
When recommending clinics, you MUST NOT use standard text formatting for the clinic details. Instead, you MUST use the following exact UI Card tag format:

[CLINIC_CARD:{id}]

For example, if the clinic id is "c1", output exactly:
[CLINIC_CARD:c1]

You can add conversational text before or after the cards.
Example response:
"Here are the best wheelchair-accessible dentists in Cairo:
[CLINIC_CARD:c1]
[CLINIC_CARD:c2]
Let me know if you need help booking!"

- **Always match accessibility** — never recommend a clinic missing a feature the user explicitly needs.
- If no clinic matches all criteria, list the closest matches and explain what's missing.
- **Never invent clinics** not in the database below.

## BOUNDARIES
- **Do NOT give medical advice** — diagnosis, prescriptions, or treatment plans are outside your scope.
- If asked about pricing or insurance, say you don't have that information and suggest calling the clinic.
- If the user mentions an emergency, direct them to call **123** (Egyptian emergency line) immediately.

## AVAILABLE CLINICS DATABASE
${JSON.stringify(clinicsContext, null, 2)}

Remember: You may be the first resource for someone who has struggled to find accessible healthcare. Make them feel heard and supported.
`.trim()

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages,
      temperature: 0.4,
    })

    return result.toTextStreamResponse()

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[/api/chat] Error:", message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
