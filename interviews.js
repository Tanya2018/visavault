/* ============================================================
   SAIS VISA VAULT — INTERVIEW SIMULATOR QUESTION BANKS
   ------------------------------------------------------------
   Real questions a consular officer / ECO actually asks, per route.
   Each question carries a `probe` = what the officer is REALLY
   testing, and `redFlags` = answers that sink you. These feed the
   AI scorer (Sonnet) as the rubric so scoring is route-accurate,
   not generic.

   interviews[countryCode][categoryId] = {
     context   : one-liner shown before the sim starts
     officerStyle: how this embassy interviews (tone the AI adopts)
     questions : [{ id, q, probe, redFlags[] }]
   }

   Only build for routes that have verified criteria + assessment.
   ============================================================ */

window.VISA_INTERVIEWS = {

  usa: {
    tourism: {
      context: "US B1/B2 interviews are SHORT — often under 90 seconds, standing at a window. The officer has usually decided within the first two answers. Everything tests one thing: will you come back to Kenya? Answer tight, honest, specific.",
      officerStyle: "A US consular officer at Nairobi: brisk, direct, slightly skeptical, no small talk. Presumes immigrant intent until you disprove it (that's literally the law — INA 214(b)). Rewards specificity and confidence; punishes vagueness, rambling, and rehearsed speeches.",
      questions: [
        { id:"purpose", q:"Why do you want to travel to the United States?",
          probe:"Is the trip real, specific, and temporary? Vague = suspicious.",
          redFlags:["vague purpose ('to tour', 'to see America')","no dates or plan","purpose that sounds like a cover for staying"] },
        { id:"who_pays", q:"Who is paying for your trip?",
          probe:"Can you actually afford this, and is the funding legitimate and yours?",
          redFlags:["someone in the US paying (raises immigrant-intent)","can't explain the source of funds","numbers that don't match your income"] },
        { id:"ties_work", q:"What do you do for work, and how long have you been there?",
          probe:"Do you have a stable reason to return? This is the core of the whole interview.",
          redFlags:["unemployed with no clear income","just started a job","answer that suggests nothing anchors you to Kenya"] },
        { id:"ties_family", q:"Do you have any family in the United States?",
          probe:"Honesty test + immigrant-intent. Lying here is fatal; hiding it is worse than having them.",
          redFlags:["hesitation or evasiveness","denying family that exists","admitting close family without offsetting Kenya ties"] },
        { id:"return", q:"What will make you come back to Kenya?",
          probe:"THE question. Officer wants your return to feel inevitable, not hopeful.",
          redFlags:["'I'll definitely come back' with no reasons","weak or generic ties","anything that sounds like you're keeping options open"] },
        { id:"been_before", q:"Have you traveled outside Kenya before? Where?",
          probe:"Track record of travelling and returning = trust. First-timers get more scrutiny.",
          redFlags:["prior overstay","evasive about past travel","no travel history + weak ties combined"] }
      ]
    },
    business: {
      context: "US B1 business interview. Same intent test as tourism, but the officer also wants your business purpose to be real and your company genuine. Keep it crisp.",
      officerStyle: "A US consular officer at Nairobi: brisk, direct. Tests both immigrant intent AND whether your business reason is legitimate and matches your actual work.",
      questions: [
        { id:"purpose", q:"What's the business purpose of your trip?",
          probe:"Real, specific business activity — meeting, conference, negotiation — not disguised work.",
          redFlags:["vague ('business meetings')","no named company or event","sounds like paid work (not allowed on B1)"] },
        { id:"company", q:"Tell me about your company. What does it do?",
          probe:"Is the business real and are you genuinely part of it?",
          redFlags:["can't describe your own business clearly","company doesn't match the trip purpose"] },
        { id:"who_invited", q:"Who invited you, and what's your relationship with them?",
          probe:"Legit US-side counterpart vs a fabricated invitation.",
          redFlags:["no clear host","invitation from a broker","relationship you can't explain"] },
        { id:"who_pays", q:"Who covers the cost of this trip?",
          probe:"Funding is clear and legitimate.",
          redFlags:["unclear funding","US party fully funding with no business logic"] },
        { id:"return", q:"What keeps you in Kenya after the trip?",
          probe:"Intent test — your business and life here pull you back.",
          redFlags:["weak ties","business that could 'run from anywhere'"] }
      ]
    }
  },

  uk: {
    tourism: {
      context: "The UK doesn't interview most visitor applicants in person — the decision is made on your documents + the online form by an Entry Clearance Officer. This sim drills the same questions the ECO effectively asks through your paperwork, so your cover letter and form answers land right.",
      officerStyle: "A UK Entry Clearance Officer assessing a paper application: methodical, evidence-driven, applying the 'genuine visitor' test. Weighs whether your stated plans, finances and ties add up to someone who'll leave at the end of the visit.",
      questions: [
        { id:"purpose", q:"What exactly will you do during your visit, and for how long?",
          probe:"A specific, credible plan vs a vague 'holiday'.",
          redFlags:["'I want to visit the UK/London' with no detail","stay length that doesn't match funds or leave","plan inconsistent with your booking"] },
        { id:"funds", q:"How are you funding this trip, and where did the money come from?",
          probe:"Genuine, explained funds — not a lump sum parked to look good.",
          redFlags:["large recent deposit with no income story","funds that don't match your job","relying only on M-Pesa with no bank statements"] },
        { id:"ties", q:"What commitments are you leaving behind in Kenya?",
          probe:"The genuine-visitor test: job, business, family, property pulling you home.",
          redFlags:["no job/business","young + single + unemployed with no other ties","nothing that compels return"] },
        { id:"return", q:"Why should the officer believe you'll leave the UK at the end?",
          probe:"Concrete reasons to return, stated plainly.",
          redFlags:["'I promise I'll return' with no evidence","hints you'd like to stay/work"] },
        { id:"history", q:"Have you travelled abroad before, and did you comply with the visa terms?",
          probe:"Track record of returning; any overstay is a serious flag.",
          redFlags:["prior overstay or refusal not addressed","no travel history + weak ties"] }
      ]
    }
  },

  schengen: {
    tourism: {
      context: "Some Schengen consulates in Nairobi do a short interview at the VAC or embassy; others decide on documents. Either way, these are the questions your file must answer. Consistency between what you say and your documents is everything.",
      officerStyle: "A Schengen consular officer: procedural, checklist-driven, focused on genuineness of purpose, sufficient means, and intent to return. Cross-checks your answers against your itinerary, insurance and finances.",
      questions: [
        { id:"where", q:"Which countries will you visit, and where will you spend the most time?",
          probe:"Confirms you applied at the correct (main-destination) consulate.",
          redFlags:["main destination doesn't match the consulate you applied to","itinerary that looks gamed to pick an 'easy' embassy"] },
        { id:"purpose", q:"What's the purpose of your trip and your rough itinerary?",
          probe:"Specific, coherent plan.",
          redFlags:["vague purpose","no itinerary","plan inconsistent with bookings"] },
        { id:"funds", q:"How will you cover your costs during the trip?",
          probe:"Sufficient, genuine means for the whole stay.",
          redFlags:["thin balance","lump-sum funds parking","funds not matching income"] },
        { id:"ties", q:"What do you do in Kenya, and what brings you back?",
          probe:"Employment/business + ties = intent to return.",
          redFlags:["weak ties","informal/unregistered work with nothing else"] },
        { id:"insurance", q:"Do you have travel medical insurance, and what does it cover?",
          probe:"Awareness of the €30,000 / all-states requirement.",
          redFlags:["no insurance","under €30,000","doesn't cover all Schengen states"] }
      ]
    }
  },

  canada: {
    tourism: {
      context: "Canada visitor visas (TRV) are usually decided on your online application by an IRCC officer — no interview for most. This sim drills the questions your application must answer convincingly, especially dual intent and funds.",
      officerStyle: "An IRCC visa officer assessing a TRV application on paper: looks for purpose, sufficient funds, and that you'll leave at the end of an authorized stay. Skeptical of unexplained funds and weak ties.",
      questions: [
        { id:"purpose", q:"Why are you visiting Canada, and what's your plan?",
          probe:"Specific, believable purpose and itinerary.",
          redFlags:["vague purpose","no plan","reason that hints at intent to stay"] },
        { id:"funds", q:"How are you funding the trip, and can you show the source?",
          probe:"Sufficient, traceable funds.",
          redFlags:["unexplained or insufficient funds","sudden deposits"] },
        { id:"ties", q:"What ties you to Kenya — job, family, property?",
          probe:"Reasons you'll return.",
          redFlags:["weak ties","nothing compelling return"] },
        { id:"rep", q:"Is anyone helping you apply, and are they authorized?",
          probe:"Guards against unregistered 'consultant' scams (a big Canada trap).",
          redFlags:["using an unregistered representative","paid a 'consultant' not on the CICC register"] }
      ]
    }
  }

};
