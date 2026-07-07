/* ============================================================
   SAIS VISA VAULT — DEEP ASSESSMENT ENGINE
   ------------------------------------------------------------
   This is NOT a 9-question quiz. Each visa route has its OWN
   full question set — every requirement that actually decides
   the application, asked one by one, like a real pre-check.

   HOW IT'S STRUCTURED
   assessments[countryCode][categoryId] = {
     intro, official (apply link block), questions[]
   }
   Each question:
     id       unique key
     q        the question text
     help     one-line plain-English context (optional)
     type     "single" | "multi"
     options  [{ val, label, score, gap? , critical? }]
              score  = points added (max per Q defined by best option)
              gap    = what to show on the report if this answer is weak
              critical = true → answer caps/kills readiness (e.g. no passport)
     weightNote (optional) internal reminder, not shown

   SCORING
   - Sum of chosen option scores / sum of max-per-question * 100
   - Any `critical:true` answer caps the final score (see engine)
   - Gaps collected from every non-best answer, ordered by severity

   MAINTENANCE
   - Only build assessments for routes marked "verified" in data.js.
   - When embassy rules change, update BOTH files. Keep the
     lastVerified date here too.
   ============================================================ */

window.VISA_ASSESSMENTS = {

  /* =====================================================================
     SCHENGEN
     ===================================================================== */
  schengen: {

    tourism: {
      lastVerified: "2026-07-07",
      intro: "Schengen Type C (short-stay) — tourism. Kenyan applicants only. This checks every factor a consulate actually weighs. Answer honestly; the score is for YOU.",
      official: {
        formUrl: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
        formLabel: "EU official Schengen visa page (start here to find the right consulate)",
        vac: { name: "VFS Global / TLScontact Nairobi (biometrics)", url: "https://visa.vfsglobal.com/" },
        verifyRegister: null,
        scamLinkWarning: "There is NO 'Schengen ETIAS' for Kenyans and no single 'Schengen website' that issues visas. You apply to a specific member state's consulate via its official VAC. Sites selling a 'Schengen e-visa' to Kenyan passport holders are fake."
      },
      questions: [
        { id:"passport", q:"Your passport — what's its status?", help:"Must be the EAC biometric e-passport, valid 3+ months beyond return, issued within 10 years, 2 blank facing pages.",
          type:"single", options:[
            { val:"good", label:"EAC biometric e-passport, 3+ months validity beyond return, 2+ blank pages", score:15 },
            { val:"old", label:"Valid but issued over 10 years ago OR not the EAC biometric type", score:3, critical:true, gap:"Only the EAC biometric e-passport is accepted for Schengen. Renew before doing anything else." },
            { val:"tight", label:"Valid but under 3 months beyond my return date, or nearly full", score:4, gap:"Renew now — under 3 months' validity beyond departure is an automatic inadmissibility." },
            { val:"none", label:"Expired / I don't have one yet", score:0, critical:true, gap:"No valid passport = no application. Start at eCitizen; this gates everything." }
          ]},
        { id:"destination", q:"Do you know which Schengen country you'll spend the most nights in?", help:"You MUST apply to the consulate of your main destination — or first entry if nights are equal.",
          type:"single", options:[
            { val:"clear", label:"Yes — one clear main destination", score:8 },
            { val:"multi", label:"Multiple countries, roughly equal — I'll apply where I enter first", score:6 },
            { val:"unsure", label:"Not sure yet", score:2, gap:"Decide your main destination before applying. Applying to the 'easy' consulate that doesn't match your itinerary is a common auto-refusal." }
          ]},
        { id:"purpose", q:"How firm is your trip plan?", help:"Consulates want a coherent, specific itinerary — not 'I want to see Europe'.",
          type:"single", options:[
            { val:"firm", label:"Specific dates, cities, day-by-day plan", score:8 },
            { val:"rough", label:"Rough idea, not day-by-day", score:4, gap:"Tighten your itinerary. A vague purpose reads as a red flag." },
            { val:"none", label:"No real plan yet", score:0, gap:"Build a specific itinerary first — it underpins the whole application." }
          ]},
        { id:"flights", q:"Round-trip flight booking?", help:"Real PNR reservation strongly preferred. Don't buy the ticket until the visa's approved, but a dummy PDF gets flagged.",
          type:"single", options:[
            { val:"pnr", label:"Yes — a proper reservation with a real PNR", score:7 },
            { val:"dummy", label:"Only a dummy PDF itinerary", score:2, gap:"Several consulates now flag dummy PDFs. Use a real reservation (many agents hold a PNR without full payment)." },
            { val:"none", label:"Nothing yet", score:0, gap:"You'll need a return flight reservation matching your application dates." }
          ]},
        { id:"accommodation", q:"Accommodation for every night of the trip?", help:"Refundable Booking.com reservations are accepted by every consulate.",
          type:"single", options:[
            { val:"all", label:"Yes — confirmed for every night", score:7 },
            { val:"partial", label:"Some nights only", score:3, gap:"Cover every night. Gaps in accommodation raise questions about your real plans." },
            { val:"none", label:"None booked", score:0, gap:"Book confirmed (refundable) accommodation for the full stay." }
          ]},
        { id:"insurance", q:"Travel medical insurance?", help:"Minimum €30,000 cover, valid across ALL Schengen states, for the full trip.",
          type:"single", options:[
            { val:"yes", label:"Yes — €30,000+, all Schengen states, full dates", score:8 },
            { val:"low", label:"I have some cover but under €30,000 or not all states", score:2, gap:"Cover under €30,000 or missing states = refusal. Fix the policy before applying." },
            { val:"no", label:"Not yet", score:0, gap:"Mandatory. €30,000 minimum, all Schengen states. Cheap (~€0.80/day) — don't skip it." }
          ]},
        { id:"funds", q:"Bank statements — last 3–6 months?", help:"Stamped, showing consistent activity and enough to cover the trip. Income story matters more than a one-off balance.",
          type:"single", options:[
            { val:"strong", label:"Consistent income + healthy balance that clearly covers the trip", score:15 },
            { val:"balance", label:"Good balance but irregular / recent lump sum", score:5, gap:"A sudden lump sum with no income history reads as 'funds parking'. Build 3+ months of consistent activity." },
            { val:"thin", label:"Thin balance", score:2, gap:"Strengthen finances before applying — insufficient funds is a top refusal reason." },
            { val:"none", label:"Statements would be a problem", score:0, critical:true, gap:"Financial evidence is non-negotiable. This needs real work before you apply." }
          ]},
        { id:"employment", q:"Your work / ties to Kenya?", help:"The core of the 'will you return?' test.",
          type:"single", options:[
            { val:"employed", label:"Employed — can get an employer letter with approved leave", score:12 },
            { val:"business", label:"Registered business owner (CR12, permits, contracts)", score:12 },
            { val:"selfinf", label:"Self-employed but informal / unregistered", score:4, gap:"Informal work weakens your 'ties'. Register your business or add strong alternative ties (property, family)." },
            { val:"student", label:"Student — enrollment letter available", score:8, gap:"Add proof of enrollment + a parental sponsor letter to strengthen ties." },
            { val:"none", label:"Unemployed / between jobs", score:1, gap:"Weak ties (no job) is the single biggest first-timer risk. Lean hard on property, family, or a sponsor." }
          ]},
        { id:"ties", q:"Beyond a job, what keeps you tied to Kenya?", help:"Property, dependents, ongoing commitments — anything proving you'll come back.",
          type:"multi", options:[
            { val:"property", label:"Property / land ownership", score:4 },
            { val:"family", label:"Spouse / children / dependents in Kenya", score:4 },
            { val:"business", label:"Ongoing business or contracts", score:3 },
            { val:"none", label:"None of these really", score:0, gap:"Thin ties overall. Every extra proof of return helps — gather what you can." }
          ]},
        { id:"history", q:"Your travel history (last 5 years)?", help:"Prior visas to 'good' countries signal you travel and return.",
          type:"single", options:[
            { val:"strong", label:"Held UK / US / Schengen / Canada / Gulf visas", score:8 },
            { val:"regional", label:"Africa / visa-free travel only", score:4, gap:"Limited international history — compensate with strong finances and ties." },
            { val:"none", label:"First international trip", score:1, gap:"First-timers face extra scrutiny. Consider a 'stepping-stone' trip first, and make ties airtight." }
          ]},
        { id:"refusals", q:"Any prior visa refusals or overstays?", help:"Be honest — this affects strategy, and lying is worse than the refusal.",
          type:"single", options:[
            { val:"clean", label:"No refusals, no overstays", score:6 },
            { val:"refused", label:"A previous refusal (any country)", score:2, gap:"Disclose it and address the refusal reason directly in your cover letter. Hiding it is fatal." },
            { val:"overstay", label:"A past overstay / immigration issue", score:0, critical:true, gap:"Overstays are recorded and can trigger auto-refusal. Get proper guidance before applying anywhere." }
          ]},
        { id:"coverletter", q:"Do you have a cover letter drafted?", help:"Explains your trip, ties, and why you'll return. Underrated and often decisive.",
          type:"single", options:[
            { val:"yes", label:"Yes — clear, specific, ties addressed", score:4 },
            { val:"no", label:"Not yet", score:1, gap:"Draft a tight cover letter. It's your one chance to tell the story your documents can't." }
          ]},
        { id:"timeline", q:"When will you submit relative to travel?", help:"Book VAC appointments early — slots vanish in peak season (May–Sept).",
          type:"single", options:[
            { val:"early", label:"10–12 weeks ahead (peak) / 6–8 weeks (off-peak)", score:5 },
            { val:"ok", label:"4–6 weeks ahead", score:3, gap:"Cutting it close in peak season. Book your VAC slot immediately." },
            { val:"late", label:"Under 4 weeks", score:0, gap:"High risk — processing can hit 45 days. Move now or shift your travel dates." }
          ]}
      ]
    },

    business: {
      lastVerified: "2026-07-07",
      intro: "Schengen Type C — business (meetings, expos, trade fairs). Everything from the tourism check applies, plus the business-specific proof that decides it.",
      official: {
        formUrl: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
        formLabel: "EU official Schengen visa page",
        vac: { name: "VFS Global / TLScontact Nairobi", url: "https://visa.vfsglobal.com/" },
        verifyRegister: null,
        scamLinkWarning: "For trade fairs, the invitation must come from the ORGANISER, not a broker. A brokered/fake invitation is a fast refusal AND a flag on your record. SAIS Events secures genuine organiser invitations."
      },
      questions: [
        { id:"passport", q:"Passport status?", help:"EAC biometric e-passport, 3+ months beyond return, 2 blank pages.",
          type:"single", options:[
            { val:"good", label:"EAC biometric, valid, blank pages", score:12 },
            { val:"issue", label:"Expiring soon / wrong type / full", score:2, critical:true, gap:"Fix the passport first — it gates everything." },
            { val:"none", label:"Don't have a valid one", score:0, critical:true, gap:"No passport, no application." }
          ]},
        { id:"invitation", q:"Invitation / registration from the host company or expo organiser?", help:"This is the make-or-break business document.",
          type:"single", options:[
            { val:"organiser", label:"Yes — official letter direct from the organiser/host company", score:18 },
            { val:"process", label:"Being processed", score:8, gap:"Chase it — the application stalls without it. Confirm it comes from the organiser, not a middleman." },
            { val:"broker", label:"I was offered one by an agent/broker", score:2, critical:true, gap:"Brokered invitations are a refusal trap. Get it from the actual organiser only." },
            { val:"none", label:"None", score:0, critical:true, gap:"No genuine invitation = no business visa. This is the first thing to secure." }
          ]},
        { id:"employerletter", q:"Employer or own-business letter covering the trip?", help:"Must state your role, terms, purpose, and WHO funds the travel.",
          type:"single", options:[
            { val:"full", label:"Yes — role, terms, purpose, and who pays, all stated", score:12 },
            { val:"partial", label:"Have a letter but missing the 'who funds' clause", score:5, gap:"Add who covers costs — consulates specifically look for this." },
            { val:"none", label:"None yet", score:0, gap:"Get an employer letter (or, if self-employed, company docs) covering the business purpose." }
          ]},
        { id:"proofactivity", q:"Proof your business is real and matches the trip's purpose?", help:"Contracts, correspondence, prior dealings with the host.",
          type:"single", options:[
            { val:"strong", label:"Contracts / correspondence / clear link to the host", score:10 },
            { val:"some", label:"Some evidence", score:5, gap:"Add more proof the business purpose is genuine and connected to your actual work." },
            { val:"none", label:"Nothing documented", score:1, gap:"A business purpose that doesn't match your company's real activity gets refused." }
          ]},
        { id:"registration", q:"Is your business registered?", help:"Self-employed applicants need the company registration certificate + business statements.",
          type:"single", options:[
            { val:"reg2", label:"Registered, trading 2+ years", score:8 },
            { val:"reg", label:"Registered, under 2 years", score:5, gap:"Young company is fine — back it with contracts, invoices, KRA PIN." },
            { val:"employed", label:"I'm employed, attending for my employer", score:8 },
            { val:"informal", label:"Informal / unregistered", score:2, gap:"Register the business — it materially strengthens a business-visa file." }
          ]},
        { id:"funds", q:"Financial evidence (personal or business)?", help:"Statements, last 3 months, covering the trip.",
          type:"single", options:[
            { val:"strong", label:"Consistent activity, covers the trip comfortably", score:10 },
            { val:"thin", label:"Thin or irregular", score:3, gap:"Strengthen statements — irregular balances hurt." },
            { val:"none", label:"Would be a problem", score:0, critical:true, gap:"Financial proof is required — resolve before applying." }
          ]},
        { id:"insurance", q:"Travel medical insurance (€30,000, all Schengen states)?",
          type:"single", options:[
            { val:"yes", label:"Yes, compliant", score:6 },
            { val:"no", label:"Not yet / non-compliant", score:0, gap:"€30,000 minimum across all Schengen states. Mandatory." }
          ]},
        { id:"refusals", q:"Prior refusals or overstays?",
          type:"single", options:[
            { val:"clean", label:"Clean record", score:6 },
            { val:"refused", label:"A prior refusal", score:2, gap:"Disclose and address it in your cover letter." },
            { val:"overstay", label:"An overstay/immigration issue", score:0, critical:true, gap:"Get guidance before applying — overstays can auto-refuse." }
          ]},
        { id:"timeline", q:"Timeline before the event?",
          type:"single", options:[
            { val:"early", label:"8+ weeks ahead", score:5 },
            { val:"ok", label:"4–8 weeks", score:3, gap:"Book your VAC slot now." },
            { val:"late", label:"Under 4 weeks", score:0, gap:"High risk for a fixed event date — expedite everything." }
          ]}
      ]
    }
  },

  /* =====================================================================
     UK
     ===================================================================== */
  uk: {
    tourism: {
      lastVerified: "2026-07-07",
      intro: "UK Standard Visitor visa — tourism / family. Kenyans have no visa-free or ETA route; this is the full pre-check the Entry Clearance Officer effectively runs on you.",
      official: {
        formUrl: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
        formLabel: "GOV.UK — the ONLY official Standard Visitor application",
        vac: { name: "VFS Global Kenya (Nairobi / Mombasa biometrics)", url: "https://www.vfsglobal.com/en/individuals/index.html" },
        verifyRegister: { name: "Check a UK immigration adviser is regulated (IAA/OISC)", url: "https://www.gov.uk/find-an-immigration-adviser" },
        scamLinkWarning: "The UK ETA does NOT apply to Kenyan passport holders — ignore anyone selling you one. The GOV.UK form is the only official route; 'visa-fees' lookalikes and iVisa-style sites are optional paid middlemen, not the government."
      },
      questions: [
        { id:"passport", q:"Passport status?", help:"Valid for your stay (6 months recommended).",
          type:"single", options:[
            { val:"good", label:"Valid 6+ months, good condition", score:12 },
            { val:"tight", label:"Valid but expiring within 6 months", score:5, gap:"Renew — tight validity invites questions." },
            { val:"none", label:"Expired / none", score:0, critical:true, gap:"No valid passport, no application." }
          ]},
        { id:"purpose", q:"What's the visit for, and how specific is the plan?",
          type:"single", options:[
            { val:"specific", label:"Clear purpose + itinerary (tourism or named family visit)", score:8 },
            { val:"vague", label:"Just 'I want to visit the UK / London'", score:2, gap:"'I want to visit London' is too vague — the #1 soft refusal trigger. Get specific." }
          ]},
        { id:"funds", q:"Bank statements — last 6 months?", help:"From a recognised bank. M-Pesa can support but NEVER replace official statements.",
          type:"single", options:[
            { val:"strong", label:"6 months, consistent income explains my balance", score:15 },
            { val:"lump", label:"Healthy balance but a big recent deposit", score:4, gap:"'Funds parking' — a large unexplained deposit right before applying — is a known refusal trigger. Officers want an income story." },
            { val:"mpesaonly", label:"Mostly M-Pesa records, thin bank statements", score:3, gap:"M-Pesa alone won't cut it. You need 6 months of recognised-bank statements." },
            { val:"thin", label:"Thin / irregular", score:1, gap:"Weak finances is a top refusal reason. Build history before applying." }
          ]},
        { id:"employment", q:"Employment or business standing?",
          type:"single", options:[
            { val:"employed", label:"Employed — letter confirming job, salary, approved leave", score:12 },
            { val:"business", label:"Business owner — CR12, permits, contracts", score:12 },
            { val:"selfinf", label:"Self-employed, informal", score:4, gap:"Informal income weakens ties — add property/family proof." },
            { val:"student", label:"Student", score:7, gap:"Add enrollment proof + sponsor evidence." },
            { val:"none", label:"Unemployed", score:1, gap:"Young + single + unemployed = high risk. Strong alternative ties are essential." }
          ]},
        { id:"ties", q:"What proves you'll return to Kenya?", type:"multi", options:[
            { val:"property", label:"Property / land", score:4 },
            { val:"family", label:"Spouse / children / dependents", score:4 },
            { val:"business", label:"Ongoing business / contracts", score:3 },
            { val:"none", label:"Nothing strong", score:0, gap:"Weak ties overall — the ECO's core worry. Gather every proof of return you can." }
          ]},
        { id:"invitation", q:"If visiting family/friends — invitation + host details?",
          type:"single", options:[
            { val:"na", label:"Not applicable — pure tourism", score:5 },
            { val:"full", label:"Yes — invitation, host's status + finances if sponsoring", score:5 },
            { val:"partial", label:"A host but no formal letter/details", score:2, gap:"Get a proper invitation letter with the host's immigration status and finances." }
          ]},
        { id:"history", q:"Travel history (last 5 years)?",
          type:"single", options:[
            { val:"strong", label:"UK / Schengen / US / Canada / Gulf visas held", score:8 },
            { val:"regional", label:"Africa / visa-free only", score:4, gap:"Limited history — lean on finances and ties." },
            { val:"none", label:"First trip abroad", score:1, gap:"First-timers are scrutinised harder. Make everything else airtight." }
          ]},
        { id:"refusals", q:"Prior UK or other refusals / overstays?",
          type:"single", options:[
            { val:"clean", label:"Clean", score:6 },
            { val:"refused", label:"A prior refusal", score:2, gap:"Address the previous refusal reason head-on. Non-disclosure is fatal." },
            { val:"overstay", label:"An overstay", score:0, critical:true, gap:"UK takes overstays seriously — get proper advice first." }
          ]},
        { id:"timeline", q:"When are you applying vs travel?",
          type:"single", options:[
            { val:"early", label:"6+ weeks ahead", score:4 },
            { val:"ok", label:"3–4 weeks (standard processing)", score:3 },
            { val:"late", label:"Under 3 weeks", score:1, gap:"Standard is ~3 weeks from biometrics. Consider priority (£500) or move dates." }
          ]}
      ]
    },

    work: {
      lastVerified: "2026-07-07",
      intro: "UK Skilled Worker visa. This route is legitimate but sponsor-gated — and the #1 scam zone. This check tells you if you're actually eligible before anyone takes your money.",
      official: {
        formUrl: "https://www.gov.uk/skilled-worker-visa",
        formLabel: "GOV.UK — Skilled Worker visa (official)",
        vac: { name: "VFS Global Kenya (biometrics)", url: "https://www.vfsglobal.com/en/individuals/index.html" },
        verifyRegister: { name: "Check your UK employer is a licensed sponsor", url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers" },
        scamLinkWarning: "The biggest UK work scam: fake or 'bought' Certificates of Sponsorship. A CoS must come from a genuinely licensed employer for a real job. If someone SELLS you a CoS or a 'guaranteed UK job visa' for cash, it's fraud — and it bans you. Verify the employer on the official licensed-sponsor register above."
      },
      questions: [
        { id:"cos", q:"Do you have a Certificate of Sponsorship (CoS)?", help:"From a UK employer that's on the official licensed-sponsor register.",
          type:"single", options:[
            { val:"licensed", label:"Yes — from an employer I verified on the licensed-sponsor register", score:22 },
            { val:"offer", label:"I have a job offer but no CoS issued yet", score:10, gap:"No CoS yet = can't apply. Confirm the employer is licensed before proceeding." },
            { val:"unverified", label:"Someone offered me a CoS / job but I haven't verified them", score:2, critical:true, gap:"STOP. Verify the employer on the official register. Bought/fake CoS is fraud and a ban." },
            { val:"none", label:"None", score:0, critical:true, gap:"The Skilled Worker route requires a genuine CoS from a licensed sponsor. That's step one." }
          ]},
        { id:"salary", q:"Does the job meet the salary threshold?", help:"Generally £38,700/year (2026) or the going rate for the role — whichever is higher. Lower for shortage/new-entrant roles.",
          type:"single", options:[
            { val:"above", label:"Yes — at or above threshold / going rate", score:16 },
            { val:"shortage", label:"Below £38,700 but it's a shortage/new-entrant role with a lower threshold", score:12, gap:"Confirm the specific lower threshold for your occupation code." },
            { val:"below", label:"Below the threshold", score:2, critical:true, gap:"Under-threshold salary = ineligible. No workaround." },
            { val:"unsure", label:"Not sure", score:4, gap:"Check the going rate for your occupation code on GOV.UK before anything else." }
          ]},
        { id:"english", q:"English at CEFR B1?", help:"IELTS for UKVI, PTE Academic, or a degree taught in English (Kenya may qualify for degree-based exemption).",
          type:"single", options:[
            { val:"yes", label:"Yes — test passed or degree-based exemption", score:10 },
            { val:"planned", label:"Not yet, but I can get it", score:5, gap:"Book the approved test early — it gates the application." },
            { val:"no", label:"No", score:0, gap:"B1 English is mandatory. Sort this before applying." }
          ]},
        { id:"maintenance", q:"Maintenance funds?", help:"£1,270 held for 28 consecutive days — unless your sponsor certifies maintenance on the CoS.",
          type:"single", options:[
            { val:"held", label:"Yes — £1,270+ held 28 days, or sponsor certifies", score:8 },
            { val:"no", label:"No", score:2, gap:"Hold £1,270 for 28 straight days (or get sponsor certification) before applying." }
          ]},
        { id:"police", q:"DCI police clearance (if required for your role)?", help:"Needed for healthcare, education, social work.",
          type:"single", options:[
            { val:"na", label:"Not required for my role", score:5 },
            { val:"have", label:"Required — I have it", score:5 },
            { val:"need", label:"Required — I don't have it yet", score:1, gap:"Get your DCI certificate early; it can take time." }
          ]},
        { id:"quals", q:"Qualifications genuine and verifiable?",
          type:"single", options:[
            { val:"yes", label:"Yes — real, documented", score:6 },
            { val:"unsure", label:"I'd be relying on documents I can't fully verify", score:0, critical:true, gap:"Fake qualifications = fraud and ban. Only apply with genuine, verifiable credentials." }
          ]}
      ]
    },

    business: {
      lastVerified: "2026-07-07",
      intro: "UK Standard Visitor — business (meetings, conferences, expos). Same visa as tourism; no separate 'business visa' needed. This checks the business-specific pieces.",
      official: {
        formUrl: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
        formLabel: "GOV.UK — Standard Visitor (business activities allowed)",
        vac: { name: "VFS Global Kenya (biometrics)", url: "https://www.vfsglobal.com/en/individuals/index.html" },
        verifyRegister: { name: "Check a UK immigration adviser is regulated", url: "https://www.gov.uk/find-an-immigration-adviser" },
        scamLinkWarning: "Business meetings/conferences run on the Standard Visitor visa. Agents sometimes upsell a pricier category you don't need. Don't overpay."
      },
      questions: [
        { id:"passport", q:"Passport valid for the trip?", type:"single", options:[
            { val:"good", label:"Yes, 6+ months", score:10 },
            { val:"tight", label:"Expiring soon", score:4, gap:"Renew before applying." },
            { val:"none", label:"None/expired", score:0, critical:true, gap:"No passport, no application." } ]},
        { id:"invitation", q:"UK-side invitation letter?", help:"Purpose, dates, and who covers costs.",
          type:"single", options:[
            { val:"full", label:"Yes — full invitation from the UK company", score:14 },
            { val:"partial", label:"Contact but no formal letter", score:5, gap:"Get a formal invitation stating purpose, dates, and cost coverage." },
            { val:"none", label:"None", score:1, gap:"A UK-side invitation strongly supports a business visit." } ]},
        { id:"employer", q:"Letter from your Kenyan employer / your business confirming the reason?",
          type:"single", options:[
            { val:"yes", label:"Yes", score:10 },
            { val:"no", label:"Not yet", score:2, gap:"Get a letter confirming your role and the business purpose." } ]},
        { id:"funds", q:"Finances cover the trip (statements)?", type:"single", options:[
            { val:"strong", label:"Yes, consistent", score:12 },
            { val:"thin", label:"Thin/irregular", score:3, gap:"Strengthen 6-month statements." },
            { val:"none", label:"Problem", score:0, critical:true, gap:"Financial proof required." } ]},
        { id:"ties", q:"Ties to Kenya (proof of return)?", type:"multi", options:[
            { val:"job", label:"Employment / business", score:5 },
            { val:"property", label:"Property", score:3 },
            { val:"family", label:"Dependents", score:3 },
            { val:"none", label:"Weak", score:0, gap:"Strengthen ties — the genuine-visitor test still applies to business trips." } ]},
        { id:"work", q:"Are you clear you can't do paid work on this visa?", type:"single", options:[
            { val:"yes", label:"Yes — meetings/conference only, no paid work", score:5 },
            { val:"unsure", label:"I was planning to do some paid work", score:0, critical:true, gap:"Paid work isn't allowed on a visitor visa. That's a different route entirely." } ]}
      ]
    }
  },

  /* =====================================================================
     USA
     ===================================================================== */
  usa: {
    tourism: {
      lastVerified: "2026-07-07",
      intro: "US B1/B2 visitor visa. The Nairobi refusal rate is high and it all hinges on ONE thing: proving non-immigrant intent (that you'll return). This runs that test on you before your interview.",
      official: {
        formUrl: "https://ceac.state.gov/genniv/",
        formLabel: "DS-160 — official US visa form (ceac.state.gov)",
        vac: { name: "US Embassy Nairobi + appointment system", url: "https://ke.usembassy.gov/visas/" },
        verifyRegister: null,
        scamLinkWarning: "Nobody can 'guarantee' a US visa or 'buy' an interview outcome — the consular officer decides alone. Anyone promising approval for a fee is scamming you. The DS-160 is free to complete on the official site; the only real fee is the $185 MRV."
      },
      questions: [
        { id:"passport", q:"Passport valid 6+ months beyond your intended stay?", type:"single", options:[
            { val:"good", label:"Yes", score:8 },
            { val:"tight", label:"Under 6 months", score:3, gap:"Renew — 6 months beyond stay is expected." },
            { val:"none", label:"None/expired", score:0, critical:true, gap:"No passport, no DS-160." } ]},
        { id:"ties", q:"Your ties to Kenya — the #1 factor. What's strongest?", help:"Property, business, family, stable long-term employment.",
          type:"single", options:[
            { val:"multiple", label:"Several strong ties (job + property + family)", score:20 },
            { val:"employed", label:"Stable long-term employment", score:14 },
            { val:"business", label:"Established registered business", score:14 },
            { val:"some", label:"Some ties but nothing strong", score:5, gap:"Weak ties = the top refusal cause. Build and document every anchor to Kenya." },
            { val:"none", label:"Young, single, no property/business", score:1, critical:true, gap:"This profile is very high-risk for B1/B2. Consider building ties + a stepping-stone visa first." } ]},
        { id:"finances", q:"Can you show consistent income + savings?", help:"KES 800,000+ is a commonly cited reasonable benchmark — but the story matters more than the number.",
          type:"single", options:[
            { val:"strong", label:"Consistent income + solid savings", score:12 },
            { val:"savings", label:"Savings but irregular income", score:5, gap:"Irregular income weakens the picture — document the source of funds." },
            { val:"thin", label:"Thin finances", score:1, gap:"Strengthen finances; you must show you can fund the trip and have reason to return." } ]},
        { id:"ds160", q:"DS-160 readiness?", help:"Every answer must be consistent — inconsistencies cause refusals.",
          type:"single", options:[
            { val:"ready", label:"I'll complete it carefully and consistently", score:6 },
            { val:"unsure", label:"I find it confusing", score:2, gap:"Take your time on the DS-160 — contradictions between it and your interview sink applications." } ]},
        { id:"tax", q:"KRA tax compliance + filed returns?", type:"single", options:[
            { val:"yes", label:"Yes — compliant, returns filed", score:8 },
            { val:"no", label:"No / not up to date", score:2, gap:"A KRA compliance certificate shows you're a documented, law-abiding economic actor. Sort it." } ]},
        { id:"history", q:"Travel history?", help:"Prior UK/Schengen/Canada/Gulf stamps strongly help (the 'stepping-stone' strategy).",
          type:"single", options:[
            { val:"strong", label:"Prior travel to UK / Schengen / Canada / Gulf", score:10 },
            { val:"some", label:"Some regional travel", score:5, gap:"Consider getting a UK or Schengen visa first — it dramatically improves US odds." },
            { val:"none", label:"No international travel", score:1, gap:"First-time + high-risk profile is the hardest combo. Stepping-stone strategy strongly advised." } ]},
        { id:"usfamily", q:"Do you have close relatives in the US?", help:"Not disqualifying, but it raises immigrant-intent concerns. Lying about it is the worst move.",
          type:"single", options:[
            { val:"none", label:"No close US relatives", score:6 },
            { val:"yes_disclose", label:"Yes — and I'll disclose it with strong ties to Kenya", score:4, gap:"Disclose honestly and over-prove your Kenya ties to offset immigrant-intent concerns." },
            { val:"yes_hide", label:"Yes — I'd rather not mention it", score:0, critical:true, gap:"NEVER hide US family. Discovery = permanent damage. Disclose and counter with strong ties." } ]},
        { id:"purpose", q:"Clear, specific trip purpose + itinerary?", type:"single", options:[
            { val:"clear", label:"Yes — specific dates and plans", score:6 },
            { val:"vague", label:"Vague", score:2, gap:"Vague purpose invites suspicion. Nail down dates and plans." } ]},
        { id:"interview", q:"Ready for a short, direct interview?", help:"Often under 5 minutes. Honest, concise answers beat rehearsed speeches.",
          type:"single", options:[
            { val:"yes", label:"Yes — I'll answer honestly and concisely", score:4 },
            { val:"nervous", label:"Worried I'll ramble or freeze", score:1, gap:"Practice concise, truthful answers. Evasive or over-rehearsed responses hurt." } ]}
      ]
    },

    business: {
      lastVerified: "2026-07-07",
      intro: "US B1 business (same B1/B2 stamp). Everything in the B1/B2 intent test applies — plus the business specifics. This is not a separate, easier visa.",
      official: {
        formUrl: "https://ceac.state.gov/genniv/",
        formLabel: "DS-160 — official US visa form",
        vac: { name: "US Embassy Nairobi", url: "https://ke.usembassy.gov/visas/" },
        verifyRegister: null,
        scamLinkWarning: "B1 is the same stamp as B2 — there's no separate paid 'business visa' to buy. And no one can guarantee the outcome."
      },
      questions: [
        { id:"ties", q:"Ties to Kenya (the core intent test)?", type:"single", options:[
            { val:"strong", label:"Strong (job/business/property/family)", score:18 },
            { val:"some", label:"Some", score:6, gap:"Strengthen and document your ties — intent is everything." },
            { val:"weak", label:"Weak", score:1, critical:true, gap:"Weak ties dominate the decision. High-risk without them." } ]},
        { id:"invitation", q:"Invitation from the US company/host?", help:"Meeting, conference, negotiation.",
          type:"single", options:[
            { val:"yes", label:"Yes — clear invitation with purpose/dates", score:12 },
            { val:"no", label:"None", score:2, gap:"Get a US-side invitation stating the business purpose." } ]},
        { id:"employer", q:"Letter from your Kenyan employer/business confirming the purpose?",
          type:"single", options:[
            { val:"yes", label:"Yes", score:10 },
            { val:"no", label:"No", score:2, gap:"Document who you are and why you're travelling for business." } ]},
        { id:"finances", q:"Finances + who funds the trip is clear?", type:"single", options:[
            { val:"clear", label:"Clear and sufficient", score:10 },
            { val:"unclear", label:"Unclear", score:3, gap:"Make funding and finances unambiguous." } ]},
        { id:"nowork", q:"Clear you can't do paid US work on B1?", type:"single", options:[
            { val:"yes", label:"Yes — business activities only", score:6 },
            { val:"unsure", label:"I intended to work for pay", score:0, critical:true, gap:"Paid work isn't allowed on B1. That's a different, employer-sponsored route." } ]},
        { id:"ds160", q:"DS-160 consistent + interview-ready?", type:"single", options:[
            { val:"yes", label:"Yes", score:6 },
            { val:"no", label:"Not confident", score:2, gap:"Consistency between DS-160 and interview is decisive." } ]}
      ]
    }
  },

  /* =====================================================================
     CANADA (TRV) — status "verify", included as a solid starter set
     ===================================================================== */
  canada: {
    tourism: {
      lastVerified: "2026-07-07",
      intro: "Canada Visitor Visa (TRV). Applied online via IRCC, biometrics at VFS Nairobi. Same non-immigrant-intent logic as the US, plus Canada-specific scam traps.",
      official: {
        formUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
        formLabel: "IRCC — official visit-Canada page (apply online here)",
        vac: { name: "VFS Global Kenya (biometrics)", url: "https://visa.vfsglobal.com/" },
        verifyRegister: { name: "Check an immigration consultant is CICC-registered", url: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant" },
        scamLinkWarning: "Canada scams hit Kenyans hard: fake job offers, bogus 'consultants' who aren't CICC-registered, and fake study-permit mills. Only a CICC-registered consultant or a lawyer can legally represent you for a fee — verify on the register above. IRCC NEVER asks for gift-card payments."
      },
      questions: [
        { id:"passport", q:"Passport valid for the trip?", type:"single", options:[
            { val:"good", label:"Yes", score:10 },
            { val:"tight", label:"Expiring soon", score:4, gap:"Renew before applying." },
            { val:"none", label:"None/expired", score:0, critical:true, gap:"No passport, no application." } ]},
        { id:"ties", q:"Ties to Kenya (proof you'll return)?", type:"single", options:[
            { val:"strong", label:"Strong — job/business/property/family", score:18 },
            { val:"some", label:"Some", score:6, gap:"Document every anchor to Kenya — same return logic as the US." },
            { val:"weak", label:"Weak", score:1, critical:true, gap:"Weak ties is the top TRV refusal reason." } ]},
        { id:"funds", q:"Proof of funds to support the trip?", type:"single", options:[
            { val:"strong", label:"Clear, sufficient, documented", score:14 },
            { val:"thin", label:"Thin/unexplained", score:4, gap:"Unexplained or insufficient funds is a common refusal. Show the source." } ]},
        { id:"purpose", q:"Purpose + itinerary clear?", type:"single", options:[
            { val:"clear", label:"Yes", score:8 },
            { val:"vague", label:"Vague", score:2, gap:"Give IRCC a specific, believable plan." } ]},
        { id:"invitation", q:"Invitation from a Canadian host (if visiting)?", type:"single", options:[
            { val:"na", label:"Not applicable — tourism", score:6 },
            { val:"yes", label:"Yes — with host details", score:6 },
            { val:"weak", label:"A host but no letter", score:2, gap:"Add a proper invitation letter with host status/finances." } ]},
        { id:"history", q:"Travel history?", type:"single", options:[
            { val:"strong", label:"Prior UK/US/Schengen/Gulf travel", score:8 },
            { val:"some", label:"Regional only", score:4, gap:"Limited history — lean on funds and ties." },
            { val:"none", label:"First trip", score:1, gap:"First-timers are scrutinised — strengthen everything." } ]},
        { id:"consultant", q:"If using a paid representative, are they CICC-registered?", type:"single", options:[
            { val:"self", label:"I'm applying myself", score:6 },
            { val:"registered", label:"Yes — verified on the CICC register", score:6 },
            { val:"unverified", label:"Someone's helping but I haven't checked", score:0, critical:true, gap:"Verify them on the CICC register NOW. Unregistered 'consultants' are a major Canada scam." } ]}
      ]
    }
  }

};
