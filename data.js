/* ============================================================
   SAIS VISA VAULT — DATA LAYER
   ------------------------------------------------------------
   This is the ONLY file you edit to keep the product alive.
   The whole subscription is "someone watches this and updates it."
   That someone is you. Rules:

   1. Every visa MUST have a `lastVerified` date (YYYY-MM-DD) and a
      `source` (official embassy / govt URL). The UI shows both.
      That visible date is your proof-of-freshness = your marketing.
   2. `scamNote` is the highest-value field. It's what agents hide.
      Write it like you're warning a friend. This is why people pay.
   3. Fees change constantly. When in doubt, mark status:"verify"
      and the card shows a soft "confirm current fee" flag.
   4. NEVER promise outcomes. Requirements ≠ guarantee. Disclaimer
      is baked into the shell — don't undercut it in the copy.

   Statuses: "verified" | "verify" (needs recheck) | "draft" (scaffold only)
   ============================================================ */

window.VISA_DATA = {

  // ---- category taxonomy (order = display order) ----
  categories: [
    { id: "tourism",  label: "Tourism / Visit",  blurb: "Holidays, family visits, short leisure trips." },
    { id: "business", label: "Business",         blurb: "Meetings, expos, conferences, trade delegations." },
    { id: "work",     label: "Work",             blurb: "Employment, work permits, sponsored roles." },
    { id: "study",    label: "Study",            blurb: "University, college, courses, exchange programs." },
    { id: "medical",  label: "Medical",          blurb: "Treatment, procedures, medical escorts." }
  ],

  // ---- corridor grouping for the country grid ----
  regions: [
    { id: "western", label: "Western",       countries: ["uk","usa","canada","schengen","australia"] },
    { id: "gulf",    label: "Gulf & MENA",   countries: ["uae","qatar","saudi","egypt"] },
    { id: "asia",    label: "Asia",          countries: ["china"] }
  ],

  countries: {

    /* =========================================================
       SCHENGEN — SEEDED DEEP (Kenyan applicant, Type C)
       ========================================================= */
    schengen: {
      name: "Schengen (Europe)", flag: "🇪🇺",
      applicantNote: "Kenyan passport holders need a full Schengen Type C visa — NOT ETIAS. ETIAS is only for visa-exempt nationals. Apply to the consulate of your MAIN destination (most nights); if nights are equal, the country of first entry.",
      where: "VFS Global / TLScontact centres in Nairobi (and Mombasa for some). Apply in person — biometrics required.",
      visas: {
        tourism: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
          title: "Schengen Short-Stay Visa (Type C) — Tourism",
          stay: "Up to 90 days within any 180-day period.",
          fee: "€90 adult / €45 child (6–11) / free under 6, plus VFS or TLScontact service charge (varies).",
          processing: "15 calendar days standard; up to 45 (occasionally 60) in peak season or complex cases. Apply 6–8 weeks ahead off-peak, 10–12 weeks for May–Sept travel.",
          docs: [
            "East African Community biometric e-passport, valid 3+ months beyond return, issued within last 10 years, 2 blank facing pages.",
            "Completed, signed harmonised Schengen application form.",
            "Two recent photos, 35×45mm, light background, ICAO spec.",
            "Round-trip flight reservation (real PNR — dummy tickets get flagged).",
            "Confirmed accommodation for every night (refundable Booking.com bookings accepted).",
            "Travel medical insurance, minimum €30,000 cover, valid across all Schengen states.",
            "Bank statements — last 3 months (some consulates 6), stamped, showing consistent activity and enough to cover the trip.",
            "Cover letter explaining trip purpose and itinerary.",
            "Proof of ties to Kenya: employment letter with approved leave, or business registration (CR12) if self-employed.",
            "For minors: parental consent, birth certificate naming both parents, ID copies."
          ],
          scamNote: "Agents love selling Kenyans an 'ETIAS' for €50–90. You cannot use ETIAS — you need the real Type C visa. Anyone offering to 'speed up' the €90 embassy decision is lying: consulates don't sell fast-track through third parties. Book your OWN VFS/TLS appointment — never pay an intermediary to book it for you.",
          killers: ["Thin or lump-sum bank balance with no income story", "Weak ties to Kenya (young, single, unemployed = high risk)", "Dummy flight PDF instead of a real PNR", "Insurance under €30,000 or not covering all Schengen states", "Applying at the 'easy' consulate that doesn't match your itinerary"],
          applyOfficial: {
            formUrl: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
            formLabel: "EU official Schengen visa page — find your consulate",
            vac: { name: "VFS Global / TLScontact Nairobi (biometrics)", url: "https://visa.vfsglobal.com/" },
            verifyRegister: null,
            scamLinkWarning: "There's no single 'Schengen website' that issues visas and no ETIAS for Kenyans. Apply to your main-destination country's consulate via its official VAC. 'Schengen e-visa' sellers are fake."
          }
        },
        business: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://www.gov.pl/web/kenya/c-type-schengen-visa",
          title: "Schengen Short-Stay Visa (Type C) — Business",
          stay: "Up to 90 days within any 180-day period.",
          fee: "€90 adult, plus service charge.",
          processing: "15 calendar days standard; up to 45–60 in complex cases.",
          docs: [
            "All standard tourism documents (passport, form, photos, insurance, finances, flights, accommodation).",
            "Invitation / registration letter from the host company or expo organiser (essential for trade fairs).",
            "Employer letter stating your role, terms, years employed, purpose of trip, and who funds the travel.",
            "Proof of business activity / recent contacts with the inviting company (contracts, correspondence).",
            "For expos & fairs: proof of registration and registration-fee receipt.",
            "Self-employed: company registration certificate + business bank statements (3 months)."
          ],
          scamNote: "For trade fairs (CIIE-style events, but in Europe), the invitation letter is the make-or-break document — and it must come from the organiser, not a broker. SAIS Events secures these directly. Don't pay an agent for a 'guaranteed invitation' — a fake or brokered letter is a fast refusal and a flag on your record.",
          killers: ["No genuine organiser invitation", "Employer letter missing the 'who pays' clause", "Business purpose that doesn't match your company's actual activity"]
        },
        study:   { status: "draft", title: "Long-Stay Study Visa (Type D)", note: "Study over 90 days uses a national long-stay (Type D) visa from the specific country's embassy, not a Schengen C visa. Requirements vary per country. SEED THIS PER-COUNTRY." },
        work:    { status: "draft", title: "National Work Visa (Type D)", note: "Employment requires a national long-stay visa + work/residence permit from the specific member state. Highly country-specific. SEED PER-COUNTRY." },
        medical: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://nairobi.diplo.de/ke-en/service/visa-entry/schengen-visa-1671552",
          title: "Schengen Short-Stay Visa (Type C) — Medical",
          stay: "Up to 90 days (longer treatment needs a national long-stay visa).",
          fee: "€90 adult, plus service charge.",
          processing: "15–45 calendar days.",
          docs: [
            "All standard documents (passport, form, photos, insurance, finances).",
            "Letter from the treating hospital/clinic in the Schengen country confirming appointment and treatment plan.",
            "Proof of payment or a cost estimate from the medical facility.",
            "Proof of funds covering treatment + stay (or an official sponsor letter).",
            "Letter from your Kenyan doctor supporting the referral (helps establish genuineness)."
          ],
          scamNote: "Medical visas need a REAL appointment letter from the foreign facility. 'Medical tourism agents' who promise a visa before you have a confirmed hospital appointment are working backwards — that ordering gets people refused.",
          killers: ["No confirmed appointment from the treating facility", "Funds don't cover the estimated treatment cost", "No plan/proof of return after treatment"]
        }
      }
    },

    /* =========================================================
       UK — SEEDED DEEP (Standard Visitor + notes)
       ========================================================= */
    uk: {
      name: "United Kingdom", flag: "🇬🇧",
      applicantNote: "Kenyans have NO visa-free entry, no visa-on-arrival, no e-visa. The UK ETA (from 25 Feb 2026) is only for visa-exempt nationalities — it does NOT apply to Kenyan passport holders. You must get the full visa before travel.",
      where: "VFS Global, Nairobi (and a Mombasa processing point). Applications start on GOV.UK.",
      visas: {
        tourism: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
          title: "Standard Visitor Visa — Tourism / Family",
          stay: "Up to 6 months. Visa itself can be issued for 6 months, 2, 5 or 10 years (multiple entry).",
          fee: "£115 for 6-month visitor visa (confirm current rate on GOV.UK — it moves). Plus VFS service charge ~KES 5,000–8,000. No Immigration Health Surcharge for visitors.",
          processing: "~3 weeks from biometrics. Priority ~5 working days (~£500 extra); super-priority next working day (~£1,000 extra).",
          docs: [
            "Passport valid for the duration of stay (6 months recommended), bio-data page copy.",
            "Online application form (GOV.UK).",
            "Bank statements — last 6 months from a recognised bank (M-Pesa records can support but NOT replace official statements).",
            "Employment letter confirming job, salary, approved leave — or business ownership docs (CR12, permits, contracts).",
            "Travel itinerary and accommodation details.",
            "Proof of ties to Kenya (property, family, ongoing business/employment).",
            "Invitation letter from UK host if visiting family/friends (with their status + finances if sponsoring)."
          ],
          scamNote: "Two big ones: (1) Agents tell Kenyans to get a UK 'ETA' — you can't, that's for visa-exempt countries only; you need the full Standard Visitor visa. (2) 'Funds parking' — dumping a big lump sum into your account right before applying — is a known refusal trigger, not a hack. Officers want an income story, not a one-off balance. Book your own biometrics slot; don't overpay a 'fixer'.",
          killers: ["Weak ties to Kenya (young + single + unemployed = high risk)", "Large unexplained deposit right before applying", "Vague purpose ('I want to visit London')", "M-Pesa printouts with no bank statement backing"],
          applyOfficial: {
            formUrl: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
            formLabel: "GOV.UK — the ONLY official Standard Visitor application",
            vac: { name: "VFS Global Kenya (Nairobi / Mombasa)", url: "https://www.vfsglobal.com/en/individuals/index.html" },
            verifyRegister: { name: "Check a UK immigration adviser is regulated (IAA/OISC)", url: "https://www.gov.uk/find-an-immigration-adviser" },
            scamLinkWarning: "The UK ETA does NOT apply to Kenyans — ignore anyone selling one. GOV.UK is the only official route; 'visa-fees' lookalikes and iVisa-style sites are optional paid middlemen, not the government."
          }
        },
        business: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
          title: "Standard Visitor Visa — Business",
          stay: "Up to 6 months. No paid work permitted.",
          fee: "£115 (confirm on GOV.UK) + VFS service charge.",
          processing: "~3 weeks from biometrics; priority options available.",
          docs: [
            "All Standard Visitor documents (passport, form, finances, ties).",
            "Invitation letter from the UK company (purpose, dates, who covers costs).",
            "Letter from your Kenyan employer or your own business docs confirming the business reason.",
            "Conference/expo registration if attending an event."
          ],
          scamNote: "The Standard Visitor visa covers business meetings, conferences and expos — you do NOT need a separate 'business visa' for these. Agents sometimes upsell a pricier category you don't need.",
          killers: ["Business purpose inconsistent with your actual role", "No UK-side invitation", "Signs you intend to actually work (paid) on a visitor visa"]
        },
        work: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://www.swiftpassimmigration.com/blog/kenya-uk-visa-guide-2026",
          title: "Skilled Worker Visa",
          stay: "Up to 5 years per grant; leads to ILR (settlement) after 5 years.",
          fee: "Visa fee varies by length + Immigration Health Surcharge (£1,035/year) + you must show maintenance funds (£1,270 for 28 days unless sponsor certifies).",
          processing: "Varies; needs a Certificate of Sponsorship first.",
          docs: [
            "Certificate of Sponsorship (CoS) from a UK-licensed employer.",
            "Job at or above the salary threshold — generally £38,700/year (2026) or the going rate for the role, whichever is higher (lower for shortage/new-entrant roles).",
            "English at CEFR B1 (IELTS for UKVI / PTE / degree taught in English — Kenya may qualify for degree-based exemption).",
            "Maintenance funds (£1,270 held 28 days) unless the employer certifies.",
            "DCI police clearance for certain roles (healthcare, education, social work)."
          ],
          scamNote: "The #1 UK work-visa scam: fake or 'bought' Certificates of Sponsorship. A CoS must come from a genuinely licensed employer for a real job. If someone sells you a CoS or a 'guaranteed UK job visa' for cash, it's fraud — and it bans you. The Skilled Worker route is legitimate and well-trodden; do it properly.",
          killers: ["No genuine CoS from a licensed sponsor", "Salary below threshold", "Fake qualifications or English scores"]
        },
        study:   { status: "draft", title: "Student Visa", note: "Needs a Confirmation of Acceptance for Studies (CAS) from a licensed institution + maintenance funds + English requirement. SEED THIS." },
        medical: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
          title: "Standard Visitor Visa — Medical Treatment",
          stay: "Up to 6 months on the standard visitor route; up to 11 months on the private-medical extension.",
          fee: "£115 standard visitor (confirm on GOV.UK); higher for the 11-month medical variant.",
          processing: "~3 weeks from biometrics.",
          docs: [
            "All Standard Visitor documents.",
            "Letter from a UK doctor/consultant/hospital confirming the treatment, timeline and cost.",
            "Proof you can pay for the treatment and your stay.",
            "Evidence of your medical condition from your Kenyan doctor."
          ],
          scamNote: "You can receive private medical treatment on a Standard Visitor visa — you don't always need a special category. Confirm the treatment letter is from a real UK provider before paying anyone.",
          killers: ["No confirmed UK treatment arrangement", "Can't show funds for treatment + stay"]
        }
      }
    },

    /* =========================================================
       USA — SEEDED DEEP (B1/B2 + notes)
       ========================================================= */
    usa: {
      name: "United States", flag: "🇺🇸",
      applicantNote: "Kenyans apply at the U.S. Embassy Nairobi (United Nations Avenue). Almost all applicants attend an in-person interview. The B1/B2 refusal rate for Kenyan applicants is high (35%+), and everything hinges on proving strong ties + non-immigrant intent. Note: U.S. entry rules and proclamations change frequently — always check the embassy site before applying.",
      where: "U.S. Embassy Nairobi. DS-160 completed online at ceac.state.gov.",
      visas: {
        tourism: {
          status: "verified", lastVerified: "2026-07-07",
          source: "https://ke.usembassy.gov/visas/",
          title: "B1/B2 Visitor Visa (Tourism / Business / Medical)",
          stay: "Typically issued for up to 10 years, multiple entry; each stay up to 6 months (set by CBP at entry). No work or study.",
          fee: "$185 MRV fee (~KES 24,000), non-refundable even if refused.",
          processing: "Interview wait times vary widely (weeks to several months). Start 3+ months ahead in peak season.",
          docs: [
            "Passport valid 6 months beyond intended stay.",
            "DS-160 confirmation page (every answer must be consistent — inconsistencies cause refusals).",
            "MRV fee receipt.",
            "Interview appointment confirmation.",
            "Proof of strong ties to Kenya — the #1 factor: property, business, family, stable employment.",
            "Financial proof: consistent income + savings (KES 800,000+ often cited as a reasonable benchmark).",
            "KRA tax compliance certificate + filed returns.",
            "Travel history — prior UK / Schengen / Canada / Gulf stamps strongly help (the 'stepping-stone' strategy).",
            "Clear itinerary / purpose."
          ],
          scamNote: "Nobody can 'guarantee' a US visa or 'buy' an interview outcome — the decision is the consular officer's alone. Anyone promising approval for a fee is running a scam. Real prep = a clean DS-160, honest answers, and provable ties. The one legit 'hack' is the stepping-stone: build a UK or Schengen travel record first. And NEVER lie about family in the US — that's the worst move you can make.",
          killers: ["Weak ties / can't prove you'll return", "Inconsistent DS-160 answers", "Undisclosed or lied-about US relatives", "No travel history + high-risk profile", "Rehearsed, evasive interview answers"],
          applyOfficial: {
            formUrl: "https://ceac.state.gov/genniv/",
            formLabel: "DS-160 — official US visa form (ceac.state.gov)",
            vac: { name: "US Embassy Nairobi + appointment system", url: "https://ke.usembassy.gov/visas/" },
            verifyRegister: null,
            scamLinkWarning: "The DS-160 is free on the official site and the only real fee is the $185 MRV. No one can buy you an interview outcome — pay for prep, never for a 'guarantee'."
          }
        },
        business: { status: "verified", lastVerified: "2026-07-07", source: "https://ke.usembassy.gov/visas/", title: "B1 Business (part of B1/B2)", stay: "Same as B1/B2.", fee: "$185 MRV.", processing: "Interview-dependent.", docs: ["Everything under B1/B2 tourism.","Invitation from the US company/host (meeting, conference, negotiation).","Letter from your Kenyan employer or business confirming the purpose."], scamNote: "The B1 covers meetings, conferences and contract talks — it's the same stamp as B2. You do not buy a separate 'business visa'.", killers: ["Signs of intent to actually work for pay in the US","Weak ties"] },
        work:    { status: "draft", title: "H-1B / Employment Visas", note: "Employer-sponsored, USCIS petition required. H-1B is lottery-capped (65k + 20k advanced degree). SEED THIS." },
        study:   { status: "draft", title: "F-1 Student Visa", note: "$185 MRV + $350 SEVIS fee. Needs I-20 from a SEVP school. SEED THIS." },
        medical: { status: "verified", lastVerified: "2026-07-07", source: "https://ke.usembassy.gov/visas/", title: "B2 Medical Treatment", stay: "Same as B1/B2.", fee: "$185 MRV.", processing: "Interview-dependent.", docs: ["Everything under B1/B2.","Letter from US physician/facility agreeing to treat you, with cost estimate.","Proof you can pay for treatment + stay.","Kenyan doctor's referral letter."], scamNote: "You need a real US facility that has agreed to treat you before you apply. Agents who reverse that order get clients refused.", killers: ["No confirmed US treatment arrangement","Can't fund the treatment"] }
      }
    },

    /* =========================================================
       CANADA — SEEDED (TRV core + scaffolds)
       ========================================================= */
    canada: {
      name: "Canada", flag: "🇨🇦",
      applicantNote: "Kenyans apply ONLINE through IRCC. Biometrics collected at VFS Global Nairobi. Kenyans are NOT eligible for an eTA for air travel unless they hold specific exemptions — most need a full Temporary Resident Visa (TRV).",
      where: "Online via IRCC portal; biometrics at VFS Global Nairobi.",
      visas: {
        tourism: {
          status: "verify", lastVerified: "2026-07-07",
          source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
          title: "Visitor Visa (Temporary Resident Visa — TRV)",
          stay: "Usually up to 6 months per entry (officer decides at the border).",
          fee: "CAD $100 visitor visa + CAD $85 biometrics (confirm current IRCC rates).",
          processing: "Roughly 4–8 weeks, but varies significantly — check IRCC live processing times.",
          docs: [
            "Passport valid for the trip.",
            "Online IRCC application + biometrics.",
            "Proof of funds (bank statements showing you can support the trip).",
            "Purpose of travel + itinerary.",
            "Proof of ties to Kenya (employment, property, family) — same non-immigrant-intent logic as the US.",
            "Letter of invitation from a Canadian host (if visiting).",
            "Possible medical exam for longer stays."
          ],
          scamNote: "Big Canada scams target Kenyans hard: fake 'job offer' letters, bogus 'immigration consultants' who aren't ICCRC/CICC-registered, and fake study-permit mills. Only a CICC-registered consultant or a lawyer can legally represent you for a fee — check the register. IRCC never emails you asking for gift-card payments. Ever.",
          killers: ["Weak ties to Kenya", "Insufficient or unexplained funds", "Vague purpose", "Using an unregistered 'consultant'"],
          applyOfficial: {
            formUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
            formLabel: "IRCC — official visit-Canada page (apply online)",
            vac: { name: "VFS Global Kenya (biometrics)", url: "https://visa.vfsglobal.com/" },
            verifyRegister: { name: "Check a consultant is CICC-registered", url: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant" },
            scamLinkWarning: "Only a CICC-registered consultant or a lawyer can legally charge to represent you. IRCC never asks for gift-card payments. Verify anyone on the register before paying a cent."
          }
        },
        study:   { status: "draft", title: "Study Permit", note: "Needs a Letter of Acceptance from a Designated Learning Institution (DLI) + proof of funds (incl. GIC) + possibly PAL. HIGH willingness-to-pay category — SEED THIS DEEP." },
        work:    { status: "draft", title: "Work Permit", note: "Usually needs a job offer + often an LMIA. Fertile scam ground (fake LMIAs). SEED THIS." },
        business:{ status: "draft", title: "Business Visitor", note: "Falls largely under the TRV for meetings/conferences. SEED THIS." },
        medical: { status: "draft", title: "Medical Treatment (TRV)", note: "TRV with a confirmed Canadian treatment arrangement. SEED THIS." }
      }
    },

    /* =========================================================
       AUSTRALIA — SCAFFOLD
       ========================================================= */
    australia: {
      name: "Australia", flag: "🇦🇺",
      applicantNote: "Kenyans apply online via ImmiAccount. Most visas are electronic (no sticker). Study and skilled routes have high willingness-to-pay.",
      where: "Online via ImmiAccount.",
      visas: {
        tourism:  { status: "draft", title: "Visitor Visa (subclass 600)", note: "Online, proof of funds + ties + genuine visitor test. SEED THIS." },
        study:    { status: "draft", title: "Student Visa (subclass 500)", note: "CoE from institution + OSHC health cover + GTE statement + funds. HIGH-VALUE. SEED THIS." },
        work:     { status: "draft", title: "Skilled / Work Visas", note: "Points-tested (189/190/491) or employer-sponsored (482). SEED THIS." },
        business: { status: "draft", title: "Business Visitor (subclass 600 Business stream)", note: "SEED THIS." },
        medical:  { status: "draft", title: "Medical Treatment Visa (subclass 602)", note: "SEED THIS." }
      }
    },

    /* =========================================================
       GULF & MENA — SCAFFOLDS (your trade base — seed next)
       ========================================================= */
    uae: {
      name: "United Arab Emirates", flag: "🇦🇪",
      applicantNote: "Most UAE visas are sponsored — by an airline, hotel, or UAE company — and issued electronically. Kenyans do NOT get UAE visa-on-arrival; you need a pre-approved e-visa. This is your trade-delegation home turf — seed it deep.",
      where: "Through a sponsor (airline/hotel/company) or a licensed typing centre; e-visa issued online.",
      visas: {
        tourism:  { status: "draft", title: "Tourist Visa (30/60-day)", note: "Sponsored by airline/hotel/agent. Proof of funds + return ticket + hotel. SEED THIS." },
        business: { status: "draft", title: "Business / Commercial Visa", note: "Sponsored by a UAE company; expo organisers can sponsor. Ties into SAIS Events. SEED THIS DEEP." },
        work:     { status: "draft", title: "Employment Visa + Residence", note: "Employer-sponsored, entry permit → medical → Emirates ID → residence. Heavy scam zone (fake job offers). SEED THIS." },
        study:    { status: "draft", title: "Student Visa", note: "University-sponsored residence visa. SEED THIS." },
        medical:  { status: "draft", title: "Medical / Treatment Visa", note: "Hospital-sponsored. SEED THIS." }
      }
    },
    qatar: {
      name: "Qatar", flag: "🇶🇦",
      applicantNote: "Qatar offers some e-visa and Hayya options; Kenyans typically need a pre-arranged visa. Seed with current Hayya/e-visa rules.",
      where: "Hayya platform / sponsor / Qatar visa service.",
      visas: {
        tourism:  { status: "draft", title: "Tourist / Hayya Visa", note: "SEED THIS." },
        business: { status: "draft", title: "Business Visa", note: "Sponsored by Qatari company. SEED THIS." },
        work:     { status: "draft", title: "Work Visa + QID", note: "Employer-sponsored. Scam-heavy. SEED THIS." },
        study:    { status: "draft", title: "Student Visa", note: "SEED THIS." },
        medical:  { status: "draft", title: "Medical Visa", note: "SEED THIS." }
      }
    },
    saudi: {
      name: "Saudi Arabia", flag: "🇸🇦",
      applicantNote: "Saudi has expanded e-visas and offers Umrah/tourist routes. Work visas are employer-sponsored and tied to Iqama. Seed with current Saudi eVisa + Nusuk rules.",
      where: "Saudi eVisa portal / Enjaz / sponsor.",
      visas: {
        tourism:  { status: "draft", title: "Tourist eVisa", note: "SEED THIS." },
        business: { status: "draft", title: "Business Visit Visa", note: "Sponsored/invited by Saudi entity. SEED THIS." },
        work:     { status: "draft", title: "Work Visa + Iqama", note: "Employer-sponsored, medical + attestation chain. HIGH scam risk for domestic/labour recruitment — flag hard. SEED THIS." },
        study:    { status: "draft", title: "Student Visa", note: "SEED THIS." },
        medical:  { status: "draft", title: "Medical / Umrah routes", note: "SEED THIS." }
      }
    },
    egypt: {
      name: "Egypt", flag: "🇪🇬",
      applicantNote: "Egypt offers an e-visa and (for some) visa-on-arrival, but requirements shift — confirm current rules. Business/expo visas tie into your Food Africa Cairo delegation.",
      where: "Egypt e-visa portal / Egyptian embassy / expo organiser invitation.",
      visas: {
        tourism:  { status: "draft", title: "Tourist e-Visa", note: "SEED THIS." },
        business: { status: "draft", title: "Business Visa (expo/trade)", note: "Organiser invitation for Food Africa etc. Ties into SAIS Events. SEED THIS DEEP." },
        work:     { status: "draft", title: "Work Permit", note: "SEED THIS." },
        study:    { status: "draft", title: "Study Visa", note: "SEED THIS." },
        medical:  { status: "draft", title: "Medical Visa", note: "SEED THIS." }
      }
    },

    /* =========================================================
       CHINA — SCAFFOLD (M visa ties to CIIE delegation)
       ========================================================= */
    china: {
      name: "China", flag: "🇨🇳",
      applicantNote: "Kenyans need a pre-approved visa; the business (M) visa requires an official invitation. This directly ties to your CIIE Shanghai delegation — seed it deep from your existing CIIE knowledge.",
      where: "Chinese Visa Application Service Center (CVASC) Nairobi.",
      visas: {
        tourism:  { status: "draft", title: "Tourist Visa (L)", note: "Itinerary, hotel, flights, funds. SEED THIS." },
        business: { status: "draft", title: "Business Visa (M)", note: "Official invitation letter from Chinese company/expo organiser is MANDATORY. Core to CIIE delegation. SEED THIS DEEP.", },
        work:     { status: "draft", title: "Work Visa (Z)", note: "Work permit notification + employer. SEED THIS." },
        study:    { status: "draft", title: "Student Visa (X)", note: "JW201/202 + admission letter. SEED THIS." },
        medical:  { status: "draft", title: "Medical Visa", note: "SEED THIS." }
      }
    }

  }
};
