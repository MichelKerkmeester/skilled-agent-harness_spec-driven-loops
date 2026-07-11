---
title: Deep Research Strategy - system-deep-loop improvements (dogfood retry)
description: Runtime strategy file tracking the 008-divergent-mode-dogfood research session (retry).
trigger_phrases:
  - "deep research strategy"
  - "system-deep-loop improvements"
  - "divergent mode dogfood retry"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for this deep-research session investigating concrete improvement opportunities across the system-deep-loop skill (runtime, four subskills, deep/* commands, agent definitions).

### Usage
Init: populated by the orchestrator from config + topic. Per iteration: dispatched `deep-research` leaf reads Next Focus, writes iteration evidence; reducer refreshes machine-owned sections.

---

## 2. TOPIC
Identify concrete improvements, refinements, and upgrade opportunities for the system-deep-loop skill: its shared runtime (.opencode/skills/system-deep-loop/runtime/**), all four subskills (deep-research, deep-review, deep-ai-council, deep-improvement), the deep/* commands (.opencode/commands/deep/**), and their agent definitions (.claude/agents/deep-research.md, .claude/agents/deep-review.md, and OpenCode equivalents). Look across correctness, ergonomics, cost/performance, documentation accuracy, and test coverage. Rotate focus across these areas iteration to iteration rather than fixating on one.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What correctness bugs or edge-case gaps exist in the shared runtime (convergence.cjs, executor-audit.ts, divergent-pivot.ts, prompt-pack.ts) and the four subskills?
- [ ] Where does documentation (SKILL.md files, command contracts, agent definitions) drift from actual runtime behavior?
- [ ] What ergonomics friction exists for operators driving these loops (setup, dispatch, convergence, resume, fan-out)?
- [ ] What cost/performance issues exist (redundant dispatches, token waste, inefficient tool-call budgets, timeout tuning)?
- [ ] What test coverage gaps exist across the runtime scripts, subskills, and commands?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Not attempting to implement fixes; research and reporting only. Not auditing unrelated skills outside system-deep-loop's runtime/subskills/commands/agent-definitions surface.

---

## 5. STOP CONDITIONS
Convergence per configured thresholds (divergent mode active — legal STOP triggers a 3-seat Council pivot instead of terminating, except for excluded/hard-boundary reasons). Hard ceiling: 10 iterations.

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

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented? (iteration 1)
- Which operator ergonomics and cost/performance issues dominate actual loop runs? (iteration 1)
- Do the four subskills invoke these runtime surfaces in ways that trigger or mask the identified defects? (iteration 1)
- Where do command contracts and runtime-specific agent definitions diverge from current behavior? (iteration 1)
- Which operator ergonomics and cost/performance issues dominate actual loop runs beyond validator-triggered redispatch? (iteration 2)
- How do the four subskills invoke shared runtime surfaces in ways that trigger or mask the iteration-001 defects? (iteration 2)
- Do deep-review and deep-ai-council prompt packs have equivalent schema, delta, or reducer-ownership drift against their agents? (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Do deep-review and deep-ai-council prompt packs have equivalent schema, delta, or reducer-ownership drift against their agents?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None (fresh session; prior INCIDENT.md docs from the destroyed first attempt exist at `research/INCIDENT.md` and `review/INCIDENT.md` in this packet but are incident reports, not prior research findings on the topic).

### Bounded Context Snapshot
- Source pointers: `.opencode/skills/system-deep-loop/runtime/**`, `.opencode/skills/system-deep-loop/deep-research/**`, `.opencode/skills/system-deep-loop/deep-review/**`, `.opencode/skills/system-deep-loop/deep-ai-council/**`, `.opencode/skills/system-deep-loop/deep-improvement/**`, `.opencode/commands/deep/**`, `.claude/agents/deep-research.md`, `.claude/agents/deep-review.md`, `.opencode/agents/deep-research.md`, `.opencode/agents/deep-review.md`.
- Reuse candidates: existing runtime scripts (convergence.cjs, reduce-state.cjs, upsert.cjs, verify-iteration.cjs, loop-lock.cjs, executor-audit.ts, divergent-pivot.ts).
- Integration points: compiled command contracts, mode-registry.json, prompt-pack templates.
- Constraints and risks: this is a live dogfood run of the exact system being researched; do not modify the target while researching it (containment prompt pack enforces this).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-07-11T06:21:34.834Z
