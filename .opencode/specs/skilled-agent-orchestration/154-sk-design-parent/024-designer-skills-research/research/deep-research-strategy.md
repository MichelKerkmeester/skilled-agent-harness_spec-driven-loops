---
title: Deep Research Strategy - designer-skills-main → sk-design improvements
description: Runtime strategy tracking the deep-research session that studies the external designer-skills-main corpus (9 plugins, ~96 skills) and derives concrete sk-design improvements while distinguishing adoptable craft from out-of-scope lifecycle capabilities.
trigger_phrases:
  - "designer-skills-main sk-design research"
  - "designer skills corpus research"
  - "sk-design improvement research designer-skills"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime strategy for the deep-research session. Tracks progress across iterations.

## 1. OVERVIEW

### Purpose

Persistent brain for the session studying the external `designer-skills-main` corpus (9 plugins, ~96 design skills) and translating it into concrete, actionable improvements for `sk-design` and its five modes plus the shared register, while drawing a clear scope line between genuinely adoptable build/visual craft and design-lifecycle capabilities (ops, research, strategy) that fall outside sk-design's deliberate scope.

### Usage

- **Init:** Topic, Key Questions, Non-Goals, and Stop Conditions populated from config.
- **Per iteration:** The GPT-5.5-xhigh (cli-codex) executor reads Next Focus, works through a slice of the corpus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** Analyst-owned sections stable; machine-owned sections rewritten by the reducer each iteration.

---

## 2. TOPIC
Study the external `designer-skills-main` skill corpus at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/` — 9 plugins (design-ops, design-research, design-systems, designer-toolkit, interaction-design, prototyping-testing, ui-design, ux-strategy, visual-critique) holding ~96 design skills — and determine concrete, actionable improvements for the `sk-design` skill (`.opencode/skills/sk-design`) and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register. Distinguish genuinely adoptable build/visual craft from capabilities outside sk-design's scope.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Across the 9 plugins / ~96 skills, which capabilities and techniques are genuinely net-new or stronger than what sk-design's five modes encode, and which fall OUTSIDE sk-design's build/visual scope (design-ops, research, and strategy are lifecycle stages sk-design does not own)?
- [ ] Q2: For each genuinely adoptable item, which sk-design home is correct — interface, foundations, motion, audit, md-generator, the shared register, or a justified NEW mode — and what is the minimal, surgical edit (file + anchor)?
- [ ] Q3: Where does designer-skills-main conflict with, duplicate, or deliberately exceed sk-design's scope (taste-led build vs full design-ops lifecycle), and what must be ruled out to avoid scope creep or bloat?
- [ ] Q4: What is the prioritized, concrete adoption backlog (per mode, plus any justified new-mode proposal), each item traced to a corpus skill and an sk-design target file, with leverage and effort noted?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing live sk-design content in this phase. This is research only; named improvements route to a future build phase.
- Rewriting or relocating the external corpus. It is read-only input, preserved as written.
- Recommending sk-design absorb the whole design lifecycle (ops, research, strategy). sk-design is taste-led build/visual; out-of-scope capabilities are recorded as such, not adopted.
- Adopting techniques wholesale without checking them against sk-design's existing taste, anti-slop posture, and Brand-vs-Product register.

---

## 5. STOP CONDITIONS
- Max 20 iterations (hard cap).
- All four key questions answered with corpus-traced, target-traced recommendations and a clear in-scope/out-of-scope split.
- newInfoRatio falls below the 0.05 convergence threshold (no materially new adoption candidates surfacing across consecutive iterations).

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
- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references? (iteration 1)
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations? (iteration 1)
- The root README says `interaction-design` has 16 skills, while its plugin README lists 15. The next pass should use filesystem skill inventory as the source of truth before declaring coverage complete. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:73] (iteration 1)
- Does `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material? (iteration 1)
- Which `interaction-design` skills add net-new state or flow structure beyond motion's existing micro-interaction and reduced-motion guidance? (iteration 1)
- For the eventual build phase, should the interface quality reference become the single compact home for flow floors, or should search/forms/navigation each get separate references? My read: keep one compact home unless the content grows beyond a single page. (iteration 2)
- After the eventual build edit, does the expanded flow-floor section remain compact enough, or does it need a split then? (iteration 3)
- Does the rest of `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material? (iteration 3)
- After the eventual build edit, does the expanded interface flow-floor section remain compact enough, or does it need a split then? (iteration 4)
- The `interaction-design` root/plugin README skill-count mismatch still needs filesystem confirmation before declaring that plugin fully covered. (iteration 4)
- Does the expanded interface flow-floor section remain compact enough after the eventual build edit, or does it need a split then? (iteration 5)
- Does the remaining corpus outside `interaction-design` and the read `ui-design` slice contain any high-leverage, build-facing checks not already captured in the backlog? (iteration 5)
- After all remaining plugins are sampled, what is the final priority order across audit, interface, foundations, motion, and explicit ruled-out lifecycle material? (iteration 6)
- Finish the rest of `design-systems` coverage: which remaining skills are pure docs/lifecycle versus small build-facing checks worth keeping? (iteration 6)
- Do `prototyping-testing`, `design-ops`, and `designer-toolkit` contain audit-adjacent material stronger than the now-expanded audit backlog, or are they mostly validation/process wrappers? (iteration 6)
- Does the design-systems corpus add a better token-audit evidence schema than the visual-critique brand/token compliance language? (iteration 10)
- Should the future audit report template include an optional "Visual critique probes assessed" row, or is it enough for findings to cite the relevant sub-probe? My read: keep it out of the template unless users ask for a visual-only audit mode. (iteration 10)
- In the eventual build phase, should typography and color sub-probes be placed directly in `critique_hardening.md`, or should audit keep them as short pointers to `foundations` and `accessibility_performance` to avoid duplicating deeper system guidance? (iteration 10)
- Should direction-neutral naming be added as part of the token-layer edit, or left only as an audit hardening finding? My read: add one naming sentence to shared vocabulary, but do not import localization as a standalone topic. (iteration 11)
- Should the future build put component-level handoff completeness in `design-foundations/SKILL.md` or in the shared sk-code handoff envelope? This iteration targets `design-foundations/SKILL.md` because that was in the requested read scope. (iteration 11)
- Should the icon craft rule live in foundations layout, shared token vocabulary, or parent-level design instructions? Foundations layout is the smallest build-facing target from the files read here. (iteration 11)
- Should the token-audit mini-process live only in `anti_patterns_production.md`, or should `audit_report_template.md` get an optional token-audit evidence row? My read: start in `anti_patterns_production.md`; template changes are only needed if audit reports repeatedly miss token evidence. (iteration 12)
- Should data annotation/context be added to `data_viz.md` despite the rest being covered? My read: yes, as one small verification bullet because the current target has pointing/accent language but not explicit annotation/benchmark context. (iteration 12)
- During implementation, should the expanded UX flow floor remain one compact Section 6 or split after the first actual edit? Prior evidence still favors one compact home unless it stops being pass/fail. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-003.md:55] (iteration 12)
- If future reviewers want deeper certainty on `design-research` or `ux-strategy`, a README-level exclusion is enough for current scope because their declared skills are upstream strategy/research artifacts, not build-facing visual guidance. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-research/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ux-strategy/README.md:4] (iteration 13)
- Q4 implementation should re-check exact target files and line anchors before editing; this iteration intentionally did not edit live `sk-design`. (iteration 13)
- No research blocker remains for final synthesis. The remaining decisions are implementation-phase sizing decisions: whether to batch the audit hardening bundle or split it into separate edits, and whether the expanded interface flow-floor section remains compact after wording is drafted. (iteration 13)
- None blocking; the gesture-a11y refinement is folded into the sweep summary in research.md §13. (iteration 14)
- None blocking. (iteration 15)
- Build-phase check: do the interaction-design/ui-design copy sources already provide the error/empty-state/CTA formula structures? (iteration 17)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Build-phase check: do the interaction-design/ui-design copy sources already provide the error/empty-state/CTA formula structures?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Two sibling phases already studied an external corpus for sk-design: `022-mifb-design-research` (make-interfaces-feel-better → surface micro-craft, converged in 3 iterations) and `023-mifb-design-adoption` (applied that backlog). This corpus is far broader: a 9-plugin marketplace spanning the whole design lifecycle, so the central tension is scope — sk-design is a taste-led build/visual skill with five modes, NOT a design-ops/research/strategy suite. The research must separate genuinely adoptable build/visual craft from lifecycle capabilities that belong outside sk-design.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 14 tool calls, 25 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex, model gpt-5.5, reasoning xhigh, service tier fast
- Current generation: 1
- Started: 2026-06-27T10:19:33Z
