---
title: Deep Research Strategy - code-quality and shared sk-code assets
description: Runtime strategy for researching how to improve the sk-code code-quality sub-skill and shared assets/references.
trigger_phrases:
  - "sk-code code-quality research strategy"
  - "code-quality shared assets research"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - code-quality and shared sk-code assets

## 1. OVERVIEW

### Purpose

Track a bounded deep-research session that studies `.opencode/skills/sk-code/code-quality/` and `.opencode/skills/sk-code/shared/` in depth, then synthesizes evidence-grounded upgrade proposals for a later implementation packet.

---

## 2. TOPIC

Improve the sk-code code-quality sub-skill and shared assets/references; make code-quality more useful and better integrated into repo systems including spec-kit, skill-advisor, deep-loops, benchmarks, hooks, and general coding standards; ground findings in the current `.opencode` codebase.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] What does `.opencode/skills/sk-code/code-quality/` currently provide, and where is it useful, redundant, missing, or friction-heavy?
- [ ] What shared `sk-code` assets/references does `code-quality` rely on, and which shared contracts should be improved for all sk-code modes?
- [ ] How should `code-quality` integrate more tightly with system-spec-kit gates, validation, completion checks, and memory/continuity flows?
- [ ] How should `code-quality` integrate with system-skill-advisor metadata, routing vocabulary, benchmarks, and prompt-safe recommendations?
- [ ] How should `code-quality` integrate with deep-loop research/review flows, hooks, behavior benchmarks, and general software-quality standards?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not edit `code-quality`, `sk-code/shared`, hooks, benchmark files, skill-advisor metadata, or any production/runtime code during this research phase.
- Do not re-baseline benchmarks or rewrite manual-testing gold files.
- Do not produce uncited recommendations; every load-bearing claim must trace to `file:line` or an authoritative external source.

---

## 5. STOP CONDITIONS

- Stop at legal convergence after the minimum iteration floor or at ten iterations, whichever comes first.
- Stop if state corruption or executor failures prevent trustworthy iteration artifacts.
- Stop if all questions are answered with cited evidence and additional iterations only restate prior findings.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Baseline the current `code-quality` sub-skill and the `sk-code/shared` resource layout: identify files, contracts, routing metadata, output expectations, and immediate evidence anchors before evaluating integration seams.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

`resource-map.md` not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/sk-code/code-quality/`, `.opencode/skills/sk-code/shared/`, `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/mode-registry.json`, `.opencode/skills/sk-code/hub-router.json`, relevant benchmark and hook surfaces discovered during iterations.
- Reuse candidates: sibling hub patterns under `.opencode/skills/sk-design/` and `.opencode/skills/deep-loop-workflows/`, spec-kit validation/completion contracts, and skill-advisor graph metadata conventions.
- Integration points: system-spec-kit gates and validators, system-skill-advisor graph metadata and benchmarks, deep-loop workflow state/review conventions, hooks/plugins, and repo coding standards.
- Constraints and risks: code graph startup status was stale/unavailable in session context; verify findings against direct file reads. This is research only; implementation edits are out of scope.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Minimum iterations: 3
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` live; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/025-code-quality-and-shared-research/research/inbox.jsonl`
- Canonical pause sentinel: `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/025-code-quality-and-shared-research/research/.deep-research-pause`
- Started: 2026-07-07T07:11:40Z
