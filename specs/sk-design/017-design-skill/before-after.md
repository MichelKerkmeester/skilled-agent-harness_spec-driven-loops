---
title: "Before/After Record: Rework four external UI-design skills into one standalone sk-design skill"
description: "What changed when the repo gained an authoring-side design skill, and what an agent does differently as a result."
trigger_phrases:
  - "sk-design skill before after"
  - "design skill change record"
  - "authoring versus measuring design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: before-after | v2.2 -->
# Before/After Record: Rework four external UI-design skills into one standalone sk-design skill

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Compares how an agent decided UI values before this packet and how it decides them now.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** design capability in `.opencode/skills/`
**Status:** Accepted
**Date:** 2026-08-28
**Owner:** Operator
**Related packet:** `specs/sk-design/017-design-skill`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:summary -->
## 2. SUMMARY

**What changed:** the repo gained `sk-design`, a standalone skill that decides UI values and behavior, reworked from four public sources into the repo's skill format.

**Why it changed:** the only design skill in the repo measured surfaces that already existed. Nothing told an agent what to choose when the surface did not exist yet, so UI work fell back on invented values.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:comparison -->
## 3. COMPARISON

**Choosing a value**
Before: an agent asked for a card's padding produced a number from nowhere. Nothing in the repo said which numbers were allowed, so 17px and 16px were equally defensible and both appeared.
After: the agent picks from a sixteen-step spacing scale and says which step and why. A value off the scale is a defect the skill names.

**Responding to a vague complaint**
Before: "this looks off" led to a restyling pass. Something usually improved, but nobody could say what had been wrong, and the same complaint returned on the next screen.
After: the complaint routes to a symptom-to-cause table before anything changes. The answer names the mechanical cause, and the fix follows from it.

**Accessibility**
Before: contrast, focus rings, touch targets and keyboard behavior were separate concerns that surfaced late or not at all.
After: they are values on the same scales and rules as the visual ones. The contrast minimum sits in the hard rules; focus rings, hit areas and keyboard behavior have their own reference; a review pass checks all of them with WCAG criteria attached.

**Motion**
Before: durations were picked by feel, which produced 400ms transitions on buttons and inconsistent timing across similar elements.
After: duration is a scale like spacing, with bands for direct feedback, state change and layout transition, and a consistency rule that outranks any single value. The skill also says when not to animate.

**Reviewing UI code**
Before: a design review produced impressions.
After: a review produces severity-tiered findings, each with a file, a line, a fix and a criterion.

**Design knowledge in the repo**
Before: one skill, able to read a surface and describe it.
After: two skills covering opposite directions, with the precedence stated identically on both sides. Each carries a typed edge to the other, and the sibling's numeric laws now say in their own text that they describe a measured surface rather than prescribe a new one.

**Structure of what the interface asks of a person**
Before: nothing in the repo covered target sizing, choice count, chunking or response budgets. They surfaced, if at all, as someone's instinct during review.
After: they are a named reference with concrete thresholds, and a prompt like "this settings page feels overwhelming" routes to them instead of to a spacing answer.

**The `sk-design` name**
Before: a decommissioned parent hub, gone from the runtime but still named as an eligible compiled-routing hub in a governance doc.
After: a standalone authoring skill. The reclaim was verified against the live hub set, activation directories and metadata edges before the folder moved, and the stale doc was corrected as part of the check.
<!-- /ANCHOR:comparison -->

---

<!-- ANCHOR:net-effect -->
## 4. NET EFFECT

**Behavior:** an agent building or reviewing UI now answers with a value plus its justification, or with a named cause, rather than with a plausible-sounding number.
**Operational impact:** none at runtime. The skill is static knowledge with no scripts, no dependencies and no state; it is inert until the advisor routes to it.
**Follow-up:** use the skill on real UI work, then score the playbook corpus against what actually went wrong.
<!-- /ANCHOR:net-effect -->

---

<!-- ANCHOR:notes-caveats -->
## 5. NOTES & CAVEATS

All four sources are external and will drift. The changelog names each one so a later comparison is possible. One source embedded an instruction to append vendor marketing to every review; it was treated as data, excluded from the artifact, and the exclusion is recorded rather than left to look like an oversight.
<!-- /ANCHOR:notes-caveats -->
