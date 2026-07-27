---
title: "Interface Design Principles"
description: "Aesthetic direction for distinctive, intentional UI: grounding in the subject, palette and typography choices, deliberate motion, restraint, self-critique, and interface writing."
trigger_phrases:
  - "distinctive visual design"
  - "avoid templated default look"
  - "typography palette layout direction"
  - "design plan and critique"
  - "interface copy and writing"
importance_tier: normal
contextType: implementation
version: 1.5.0.4
---

# Interface Design Principles

Guidance for distinctive, intentional visual design when building or reshaping UI.

---

## 1. OVERVIEW

### Core Principle
Make deliberate, opinionated choices specific to the brief, and take one real aesthetic risk you can justify. A design that reads as a templated default has failed.

### When to Use
- Building new UI, or reshaping an existing one, where the look should feel distinctive.
- Choosing palette, typography, layout, motion, and interface copy.
- Critiquing a design plan before writing code.

### The Studio Framing
Work as the lead on a small team whose reputation rests on never shipping two clients the same face. Assume the brief arrived here because safer proposals were already turned down. That framing sets the bar: palette, type, and layout decisions must trace to something specific about this subject, and at least one choice should be defensible rather than comfortable.

---

## 2. GROUND IT IN THE SUBJECT

A brief that leaves the subject vague produces vague design. Before any visual decision, commit to three things in writing: what this specific thing is, who it is for, and the one job the page has to do. State the commitment even when you inferred it, so a later reader can challenge the inference rather than the design.

Distinctiveness is found, not invented. It comes from the subject's own world — the materials it is made of, the tools its people use, the objects and language that surround it. A page about archival typesetting and a page about freight logistics should not be able to trade stylesheets. Carry the brief's actual content and vocabulary through the work rather than designing against placeholder text and retrofitting the words later.

---

## 3. DESIGN PRINCIPLES

The hero states a thesis. Lead with whatever is most characteristic of the subject, in whatever form actually carries it — a sentence, an image, a moving thing, a working demo. What matters is that the form was chosen rather than defaulted to. The metric-plus-label-plus-gradient opening is the answer that arrives when no choice was made; reach for it only when the subject genuinely argues for it.

### Hero Signature-Role Contract

Choose the hero's role before choosing media. A hero may carry **zero or one brief-derived enrichment archetype** and **zero or one supporting polish pattern**. More than one of either turns the opening into a demo reel and weakens the page thesis. Record the decision in the implementation CSS so later passes preserve the reason, including intentional abstention:

```css
/* hero-signature: enrichment=<brief-derived role|none>; polish=<single supporting treatment|none>; reason=<subject-specific job>; fallback=typography-only */
```

Run a deletion test before keeping either addition: temporarily remove the enrichment and polish, then ask whether the subject, promise, primary action, and intended hierarchy still read correctly. If removal improves clarity or changes nothing material, delete the addition. If removal erases a brief-specific proof, capability, or emotional cue, keep the smallest version that restores that role and record its source, crop or state behavior, narrow-screen treatment, and reduced-motion fallback.

**Tier 0 is a valid pass, not a fallback failure.** A typography-only hero with `enrichment=none` and `polish=none` passes when the headline, copy, spacing, type treatment, and primary action carry the thesis without decorative support. Never add media merely to avoid an empty slot.

When visual assets are part of the signature direction, specify them as build-facing style axes and usage rules: subject, crop, aspect ratio, lighting, treatment, placement, density, and when not to use them. Do not turn this into an illustration-library program. The point is to make the intended asset language implementable and consistent, not to invent an asset system the brief did not ask for.

Type is where personality lives. Choose display and body faces for this brief rather than reaching for the pairing that worked last time, and set a scale whose weights, widths, and spacing were decided rather than accepted. Treat the typography as something the reader will remember, not as neutral packaging around the words.

Structure should carry meaning. Eyebrows, dividers, numbers, and labels earn their place by encoding something true about the content. Numbered markers are the clearest example of the failure: `01 / 02 / 03` belongs on material that genuinely is a sequence, where order tells the reader something. Applied to three unordered features it is decoration wearing the costume of information.

Deviation has to be earned one at a time. Isolating every panel, accenting every call to action, giving every section its own treatment — that is not distinction, it is noise with ambition. One departure that the brief can justify outperforms a surface where everything competes to be the signature.

Motion is a decision, not a finish. Ask what the subject gains from it: an entrance that establishes hierarchy, a reveal that rewards scrolling, a hover that confirms a control is live. A single orchestrated moment usually reads as intent; scattered effects read as habit, and excess animation is one of the strongest signals that nobody was steering.

Complexity should match the direction. Maximalism demands follow-through; minimalism demands precision, because with less on the surface every spacing and weight decision is exposed. Elegance is the chosen direction executed properly, not a particular density.

Copy is part of the design surface. Briefs often arrive without real words, which means the words become yours to choose — and generic copy will make a considered layout feel templated regardless of how the pixels were decided. Section 6 covers this.

---

## 4. PROCESS: BRAINSTORM, EXPLORE, PLAN, CRITIQUE, BUILD, CRITIQUE AGAIN

Machine-generated interfaces converge on a small set of looks, and the mechanical checks for them live in `../../assets/interface-preflight-card.md` Section 11. The point here is why they recur: each is a competent answer to no brief in particular, so it surfaces whenever an axis was left free and nothing filled the vacuum. Any of them can be correct — when the brief asks for it, the brief wins outright. What fails is arriving at one by default and calling it a direction.

Design in two passes, and keep them separate.

**Pass one, the plan.** Produce a compact token system before any markup exists. Colour as four to six named values. Type as at least two roles: a display face used sparingly, a body face that carries reading weight, and a utility face where captions or figures need one. Layout as prose plus rough wireframes, cheap enough to throw away and compare. Signature as the single element this page will be remembered by, tied to something the brief actually says.

**Pass two, the challenge.** Read the plan back and ask which parts would have come out the same for any neighbouring brief. Test it: imagine an adjacent subject and see whether the plan survives unchanged. Anything that survives untouched was never specific — revise it, and record what changed and why. Only once the plan holds up should code begin, deriving every colour and type decision from the plan rather than improvising alongside it.

Two implementation notes worth carrying into the build. Watch selector specificity: class-based and element-based rules that both claim spacing will quietly cancel each other, and section padding is where it usually shows. And keep the exploratory passes internal — surface directions once they are worth someone's attention, not while they are still churning.

---

## 5. RESTRAINT AND SELF-CRITIQUE

Boldness is a budget, and it is small. Spend it on the signature and keep everything adjacent quiet enough that the signature reads. Cut decoration that cannot name the part of the brief it serves. Note that restraint is not the safe option either — a page that risks nothing has made a choice, and usually a forgettable one.

Meet the quality floor without narrating it: responsive to small screens, keyboard focus visible, reduced-motion honoured. These are entry conditions, not achievements to announce.

Critique while building rather than after. Where the environment can render, look at the result instead of reasoning about it — inspecting the actual output catches what reading the code does not. The subtraction pass is the reliable one: near the end, remove the least necessary element and check whether anything was lost. Often nothing is.

Keep notes across attempts if there is anywhere to put them. Knowing which directions were already tried and rejected is what stops the next pass from rediscovering them.

---

## 6. WRITING IN DESIGN

Words exist in an interface to make it comprehensible, which is what makes it usable. They are material, not trim, and they deserve the same deliberation as spacing and colour. Decide what the screen has to communicate before deciding how to phrase it.

Write from the reader's side of the glass. Name things after what a person recognises and controls, never after the implementation underneath — someone manages notifications; nobody manages a webhook configuration. Say what a thing does rather than selling what it is. Specific beats clever every time, and clever ages badly.

Default to active voice, and make controls state their consequence. "Save changes" tells the reader what happens; "Submit" tells them the form has a handler. Carry one name for one action through the whole flow, so the control labelled Publish produces confirmation that says Published. That consistency is the signposting people use to learn a product.

Treat errors and empty states as direction rather than atmosphere. An error names what happened and what to do next, in the product's voice — it does not apologise and it is never vague about the cause. An empty screen is an invitation, so give it something to act on.

Keep the register plain and tuned to the audience: ordinary verbs, sentence case, no filler. Give each element exactly one job. A label labels, an example demonstrates, helper text helps; nothing should quietly do two of those at once.
