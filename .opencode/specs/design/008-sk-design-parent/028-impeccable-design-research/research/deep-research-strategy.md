---
title: Deep Research Strategy - impeccable-main → sk-design improvements
description: Runtime strategy tracking the deep-research session that studies the external impeccable design skill (shared design laws, 23 command flows, anti-pattern rule catalog, brand/product register, per-model defect blocks, prose denylist) and derives concrete sk-design improvements, distinguishing genuinely net-new craft from already-covered material and out-of-scope infrastructure.
trigger_phrases:
  - "impeccable sk-design research"
  - "impeccable corpus research"
  - "sk-design improvement research impeccable"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

Runtime strategy for the deep-research session. Tracks progress across iterations.

## 1. OVERVIEW

### Purpose

Persistent brain for the session studying the external `impeccable` design skill and translating it into concrete, actionable improvements for `sk-design` and its five modes plus the shared register. The central discipline: impeccable is the MOST comparable corpus studied so far (a consolidated design skill with a register system, an audit/anti-slop posture, and opinionated numeric design laws), so overlap with what phases 022/023/024–027 already adopted is HIGH. Every candidate is verified against the real, current sk-design file before it enters the backlog.

### Usage

- **Init:** Topic, Key Questions, Non-Goals, and Stop Conditions populated from config.
- **Per iteration:** The GPT-5.5-xhigh (cli-codex) executor reads Next Focus, works through a slice of the corpus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** Analyst-owned sections stable; machine-owned sections rewritten by the reducer each iteration.

---

## 2. TOPIC
Study the external `impeccable` skill corpus at `.opencode/specs/design/008-sk-design-parent/external/impeccable-main/` — focusing on `skill/SKILL.src.md` (shared design laws + command router + per-model `<codex>`/`<gemini>` defect blocks), `skill/reference/*.md` (the 23 command flows + domain references), `cli/engine/detect-antipatterns.mjs` (the anti-pattern rule catalog semantics), the brand/product register references, and `docs/STYLE.md` (the prose denylist) — and determine concrete, actionable improvements for the `sk-design` skill (`.opencode/skills/sk-design`) and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register. Distinguish genuinely net-new build/visual craft from already-covered material and from build/site/test/CLI infrastructure outside sk-design's scope.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Which of impeccable's shared design laws, 23 command flows, anti-pattern rules, per-model defect blocks, and prose denylist are genuinely net-new or MORE SPECIFIC than what sk-design's five modes already encode (after the 022/023 and 024/025–027 adoptions), and which are already-covered or are build/site/test/CLI infrastructure outside sk-design's scope?
- [ ] Q2: For each genuinely net-new item, which sk-design home is correct — interface, foundations, motion, audit, md-generator, the shared register, the hub, or a justified NEW mode — and what is the minimal, surgical edit (file + anchor)?
- [ ] Q3: Which of impeccable's STRUCTURAL ideas (register-as-first-class, the per-model codex/gemini defect catalog, the color-strategy commitment axis, the anti-pattern detector engine, the prose denylist) are worth adopting versus ruling out as scope creep or already-analogous to sk-design's existing register / `/20` audit score / `ai_fingerprint_tells`?
- [ ] Q4: What is the prioritized, concrete adoption backlog (per mode, plus any justified new-mode proposal), each item traced to an impeccable source and an sk-design target file, with leverage and effort noted, and a clear no-new-mode verdict?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing live sk-design content in this phase. Research only; named improvements route to a future build phase.
- Rewriting or relocating the external corpus. It is read-only input, preserved as written.
- Researching the GENERATED provider duplicate trees (`.claude/skills/`, `.cursor/skills/`, `.gemini/skills/`, etc.) — these mirror `skill/`; read the `skill/` source only.
- Researching build/site/test/extension/CLI plumbing (scripts/build.js, site/ Astro, tests/, extension/, functions/) — these are infrastructure, not design methodology.
- Adopting techniques wholesale without checking them against sk-design's existing taste, anti-slop posture, register, and what 022/023/024–027 already encoded.

---

## 5. STOP CONDITIONS
- Max 30 iterations (hard cap).
- All four key questions answered with impeccable-traced, target-traced recommendations and a clear net-new / already-covered / out-of-scope split.
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
- Q1 remains open for `bolder.md`, `quieter.md`, `shape.md`, `distill.md`, `clarify.md`, `craft.md`, `extract.md`, `document.md`, `optimize.md`, `adapt.md`, `live.md`, `onboard.md`, `codex.md`, `hooks.md`, `init.md`, and `overdrive.md`. (iteration 5)
- Q1 also remains open for actual anti-pattern catalog semantics because the scoped detector facade did not expose rule IDs or detector descriptions. (iteration 5)
- Q4 remains open for prioritized adoption order after the remaining command-flow references are read. (iteration 5)
- Q4 remains open for final prioritized adoption order after the remaining command-flow references and detector semantics are read. (iteration 6)
- Q1 remains open for `extract.md`, `document.md`, `optimize.md`, `adapt.md`, `live.md`, `onboard.md`, `hooks.md`, `init.md`, and `overdrive.md`. (iteration 6)
- Q1 remains open for actual anti-pattern catalog semantics because the earlier detector pass only reached the scoped facade and did not expose rule IDs or detector descriptions. (iteration 6)
- Q4 remains open for final prioritized adoption order after the remaining command-flow references are read. (iteration 7)
- Remaining work is synthesis, not more corpus coverage: consolidate the adoption backlog across iterations 1-8, dedupe overlapping candidates, and prepare a future implementation packet if the user approves. (iteration 8)
- No command-flow reference remains unread from the carried-forward list. (iteration 8)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No command-flow reference remains unread from the carried-forward list.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Third corpus study in the sk-design arc. `022-mifb-design-research` + `023-mifb-design-adoption` (make-interfaces-feel-better → surface micro-craft, applied) and `024-designer-skills-research` + `025/026/027` adoption (designer-skills-main → mostly out-of-scope, a small audit/interface/motion/foundations slice applied) already pulled a lot of surface craft into sk-design. impeccable is the MOST comparable corpus: a single consolidated design skill with 23 commands, a brand/product register (sk-design has a register too), a `/20`-style audit + anti-slop posture (sk-design has design-audit + ai_fingerprint_tells), and very specific numeric design laws. So the overlap and false-positive risk is HIGH — the data-viz false positive from the 024 sweep is the cautionary tale. Verify every candidate against the current sk-design file before adopting. Likely genuine yield: specific numeric thresholds for foundations/audit detectors, a per-model (codex/gemini) defect catalog extension to ai_fingerprint_tells, the color-strategy commitment axis, and the prose denylist for copy guidance. Most command flows and the detection-engine plumbing likely rule out as already-analogous or infrastructure.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 30
- Convergence threshold: 0.05
- Per-iteration budget: 16 tool calls, 25 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex, model gpt-5.5, reasoning xhigh, service tier fast
- Current generation: 1
