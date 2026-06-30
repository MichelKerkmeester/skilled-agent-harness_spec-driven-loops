---
title: Deep Research Strategy - make-interfaces-feel-better → sk-design improvements
description: Runtime strategy tracking the deep-research session that studies the external make-interfaces-feel-better corpus and derives concrete sk-design improvements.
trigger_phrases:
  - "make-interfaces-feel-better sk-design research"
  - "mifb design research strategy"
  - "sk-design improvement research"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime strategy for the deep-research session. Tracks progress across iterations.

## 1. OVERVIEW

### Purpose

Persistent brain for the session studying the external `make-interfaces-feel-better` skill corpus and translating it into concrete, actionable improvements for `sk-design` and its five modes plus the shared register.

### Usage

- **Init:** Topic, Key Questions, Non-Goals, and Stop Conditions populated from config.
- **Per iteration:** The GPT-5.5-xhigh (cli-codex) executor reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** Analyst-owned sections stable; machine-owned sections rewritten by the reducer each iteration.

---

## 2. TOPIC
Study the external `make-interfaces-feel-better` skill corpus (`SKILL.md`, `animations.md`, `performance.md`, `surfaces.md`, `typography.md`) at `.opencode/specs/design/008-sk-design-parent/external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/` and determine concrete, actionable improvements for the `sk-design` skill (`.opencode/skills/sk-design`) and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What distinctive techniques, principles, and heuristics does make-interfaces-feel-better encode across surfaces, animations, typography, and performance that sk-design's modes do not yet cover or cover more weakly?
- [ ] Q2: For each adoptable technique, which sk-design home is correct — interface, foundations, motion, audit, md-generator, or the shared register — and what is the minimal, surgical edit (file + anchor) to land it?
- [ ] Q3: Where does make-interfaces-feel-better conflict with, duplicate, or contradict existing sk-design guidance, and what must be ruled out to avoid bloat or taste drift?
- [ ] Q4: What is the prioritized, concrete improvement backlog (per mode + shared), each item traced to a corpus file and an sk-design target file, with effort and leverage noted?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing live sk-design content in this phase. This is research only; named improvements route to a future build phase.
- Rewriting or relocating the external corpus. It is read-only input, preserved as written.
- Adopting techniques wholesale without checking them against sk-design's existing taste, anti-slop posture, and Brand-vs-Product register.
- Inventing improvements not grounded in the corpus or the current sk-design source.

---

## 5. STOP CONDITIONS
- Max 3 iterations (hard cap).
- All four key questions answered with corpus-traced, target-traced recommendations.
- newInfoRatio falls below the 0.05 convergence threshold (no materially new improvement candidates surfacing).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- **Q3 needs conflict analysis.** Especially shadow-as-border versus ghost-card anti-patterns, and image outline rules versus existing token/dark-mode guidance. (iteration 1)
- **Q2 needs precise anchors.** Iteration 2 should deep-read the relevant target files and name exact insert locations for each promising technique. (iteration 1)
- **Q4 remains open.** No prioritized implementation backlog yet; this iteration only creates the inventory and first coverage map. (iteration 1)
- The shared-path mismatch may deserve a small future cleanup, but it is outside this research-only iteration and separate from the design-technique backlog. (iteration 2)
- **Q4 remains open.** Iteration 3 should turn this map into a prioritized backlog with leverage and effort. (iteration 2)
- No research questions remain inside this three-iteration loop. (iteration 3)
- Implementation remains intentionally unstarted. The build phase must still edit, verify, and summarize the target files. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Implementation remains intentionally unstarted. The build phase must still edit, verify, and summarize the target files.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior phase `015-per-skill-improvement-research` (sibling) already ran per-mode GPT-5.5-xhigh research and concluded the sk-design design knowledge largely landed in phases 009 and 012; the remaining leverage was plumbing (router precision, the shared-register loading contract, handoff cards, benchmark fixtures). This phase is different: it studies an EXTERNAL corpus (make-interfaces-feel-better) for net-new design technique to fold into sk-design, so it must distinguish genuinely new craft from what sk-design already encodes.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 25 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex, model gpt-5.5, reasoning xhigh, service tier fast
- Current generation: 1
- Started: 2026-06-27T08:17:12Z
