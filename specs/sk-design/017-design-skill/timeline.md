---
title: "Timeline: Rework four external UI-design skills into one standalone sk-design skill"
description: "Chronological record of the build, including the three mid-build scope additions and the fetch obstacles each source presented."
trigger_phrases:
  - "sk-design skill timeline"
  - "four source build chronology"
  - "skill build events"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Rework four external UI-design skills into one standalone sk-design skill

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Tracks how a one-source conversion became a four-source skill, and what each addition cost.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `sk-design` build
**Status:** Complete
**Started:** 2026-08-28
**Last updated:** 2026-08-28
**Owner:** Operator
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

**2026-08-28:** Operator asked for a public Refactoring UI skill repository to be reworked into the repo's skill format with a spec packet. Outcome: Gate 3 answered as a new packet under the `sk-design` track.

**2026-08-28:** Operator corrected an assumption that the new capability would become a mode under a design hub, noting the `sk-design` hub was retired. Outcome: the skill was built as a class-S standalone root, sibling to `sk-design-md-generator`.

**2026-08-28:** The Refactoring UI source was captured and the packet scaffolded at Level 3. Outcome: seven documents plus a skill root scaffolded as `sk-refactoring-ui`.

**2026-08-28:** `SKILL.md`, three references and the token asset were authored from the first source. Outcome: a complete single-source skill, passing its authoring gate.

**2026-08-28:** Operator added a second source, a web interface guideline set. Outcome: a fourth reference covering the interaction layer, plus a new router intent.

**2026-08-28:** Operator added a third source, an animation-principles skill. Its listing page blocked direct fetch, so the underlying repository was located by search and its article plus 28 rule files pulled through the GitHub API. Outcome: a fifth reference covering motion, and the first cross-source duration conflict.

**2026-08-28:** Operator added a fourth source, a design-review skill. Its page also blocked direct fetch and its repository reference did not resolve, so the rendered page was retrieved and its text extracted. Outcome: a sixth reference covering review, plus the discovery of an embedded vendor-footer instruction.

**2026-08-28:** The skill and its packet were renamed from `sk-refactoring-ui` to `sk-design`, since the original name described one of four sources. Outcome: identity fields updated and generated metadata rebuilt.

**2026-08-28:** `SKILL.md` reached 4,803 words against a 5,000-word packaging cap. Outcome: about 70 words of redundant prose trimmed, leaving 4,730 and a recorded constraint for future editors.

**2026-08-28:** The four automated gates were run. Outcome: class gate `checked=14 passed=14 failed=0`, authoring gate exit 0, document validator zero issues across eight files, link sweep zero broken targets.

**2026-08-28:** The advisor routing probe returned timeouts while the daemon reindexed the new root, so it ran through the Python advisor instead. Outcome: three routing gaps found and closed by widening the keyword comment and intent signals.

**2026-08-28:** Operator instructed a second rename, to `sk-design`, and asked for every open note and conflict to be fixed. Outcome: a remediation round on top of a package that had already passed its gates.

**2026-08-28:** The reclaimed name was checked against the live compiled-routing sets before anything moved. Outcome: no collision — six hubs, none of them `sk-design`, no activation directory, no metadata edge — and one stale governance doc found still describing a "fixed 7-hub set" including it.

**2026-08-28:** The seven-step procedure and the hierarchy elaboration were moved into their own references. Outcome: word headroom restored from 270 to roughly 330 even after three references were added.

**2026-08-28:** The Laws of UX, Typography and Visual Design categories were imported and six categories formally declined. Outcome: a fourth cross-source conflict surfaced, on shadow color, and was resolved by surface type.

**2026-08-28:** The cross-skill tension was made reciprocal in `sk-design-md-generator`. Outcome: neither document can now be read alone and misapplied.

**2026-08-28:** Routing was re-probed across all ten intents. Outcome: two more gaps found, both caused by metadata phrases being longer than the prompts users type; shortening them closed both.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All four sources captured:** target 2026-08-28. Status: Done. Evidence: the session scratchpad held the Refactoring UI package, the guideline corpus, the animation article with 28 rule files, and the extracted review-skill text.

**Skill authored:** target 2026-08-28. Status: Done. Evidence: 18 files under `.opencode/skills/sk-design/`, about 2,390 lines.

**Gates green:** target 2026-08-28. Status: Done. Evidence: recorded per check in `tasks.md`.

**Advisor routing confirmed:** target 2026-08-28. Status: Done. Evidence: ten prompts across every intent, top-ranked on seven and second on two, with the extraction boundary intact.

**Notes and conflicts closed:** target 2026-08-28. Status: Done. Evidence: both open questions answered, four cross-source conflicts and one cross-skill tension resolved on both sides, headroom restored.
<!-- /ANCHOR:milestones -->
