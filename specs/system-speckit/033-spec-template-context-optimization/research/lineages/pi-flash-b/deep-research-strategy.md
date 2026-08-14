---
title: Deep Research Strategy - pi-flash-b lineage (033 spec templates & context reducer)
description: Fan-out lineage testing Reducer Engineering + $1.2M Agent Engineering harness against system-speckit templates, documentation logic, and memory system.
trigger_phrases:
  - "spec templates context reducer"
  - "reducer engineering speckit"
  - "agent engineering harness"
  - "token reduction speckit"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - pi-flash-b lineage

## 2. TOPIC
Test the two context/*.md concepts (Reducer Engineering; the $1.2M Agent Engineering harness) against system-speckit templates (templates/manifest/*.tmpl), documentation logic (Gate 3 classifier, Levels 1-3+, validate.sh, the doc workflow), and the context/memory system (memory_context/memory_search). Find concrete in-repo optimizations for (a) context/token reduction, (b) AI plan adherence, (c) general optimization. For EVERY recommendation classify {already-exists / genuine-gap / not-applicable} with file:line evidence. Do NOT reinvent existing system-deep-loop reducers or findings-registry. Tag each finding to an axis and target surface. Produce a ranked implementable shortlist plus a refutation list. Report-only, implement nothing.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: Where do system-speckit templates carry reducible token weight (preamble, guidance, filler), and which Reducer-Engineering techniques (dedupe, drop-malformed, group) map to concrete template cuts?
- [ ] Q2: Which Agent-Engineering harness patterns (Default-FAIL, fresh-context evaluator, progress/handoff memory, feature-at-a-time) already exist in the doc workflow / deep-loop, and which are genuine gaps for plan adherence?
- [ ] Q3: What does the context/memory system (memory_context/memory_search, generate-context.js) already reduce, and what token-reduction gaps remain vs. the Reducer-Engineering playbook?
- [ ] Q4: What is the ranked implementable shortlist and the refutation list (concepts that do NOT transfer)?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No implementation or file edits outside this lineage dir (READ-ONLY investigation elsewhere).
- No redesign of the deep-loop state machine or reducer ownership; existing reduce-state.cjs / findings-registry are reference baselines, not targets.
- No external web research; in-repo evidence only.
- No changes to the packet spec/plan/tasks of 033 itself.

## 5. STOP CONDITIONS
- maxIterations=2 reached (stopPolicy: max-iterations) — convergence before that is telemetry only.
- Containment violation: any write outside lineage dir → halt immediately.

---

<!-- ANCHOR:answered-questions -->
- q1 (partial): templates carry reducible weight via cross-variant core duplication; dedupe maps to ungated-core restructure; renderer already supports it

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
- Measured exact-line duplication across gated template variants with a script (spec.md.tmpl L2/L3/L3+ = 72/60/53% dup of L1 core; plan.md.tmpl = 73/58/49%): quantifiable, file:line-evidenced (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
- None material; the naive 'scaffolds inherit all variants' hypothesis was ruled out by reading renderInlineGates (iteration 1)

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
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
Iteration 2: memory/context system (memory_context/memory_search, generate-context.js, mcp-server) under Reducer Engineering; Agent-Engineering harness patterns (Default-FAIL, fresh evaluator, handoff/progress memory, feature-at-a-time) vs. doc workflow + deep-loop baselines; build ranked shortlist + refutation list

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Concepts under test (from packet context/)
- **Reducer Engineering** (context/Reducer Engineering.md): deterministic reducer between fan-out workers and synthesis model. Drop malformed → group by normalized claim → keep highest-confidence → surface agreement/contradiction. Reported: 41,200→5,300 tokens (87% cut), 86% cost, 78% latency; 23 contradictions surfaced. Playbook: measure raw input size first; dedupe/drop/group are code problems; agreement/disagreement is data.
- **$1.2M Agent Engineering harness** (context/The $1.2M Agent Engineering skill*.md): initializer breaks task into features; coding agent implements ONE feature at a time with tests+commit+progress file; external memory (progress notes, git, test results) survives context windows; Default-FAIL (every success criterion starts false, must show evidence); evaluator = separate agent, fresh context, read-only, pass/fail with reason; agent writes own handoff notes; complexity matches task (Agentless counterargument); AGENTS.md conventions.

### Bounded Context Snapshot (target surfaces, READ-ONLY)
- Templates: `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` (13 files, ~150KB total; spec.md.tmpl 21KB, plan.md.tmpl 29KB, research.md.tmpl 22KB, checklist.md.tmpl 17KB, implementation-summary.md.tmpl 17KB are heaviest).
- Documentation logic: `shared/gate-3-classifier.ts`, SKILL.md levels table, `scripts/spec/validate.sh`.
- Memory system: `mcp-server/` (context-server.ts, cli.ts), `scripts/dist/memory/generate-context.js`, `scripts/memory/`.
- Deep-loop baselines (do NOT reinvent): `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `findings-registry.json` contract.
- Packet: `specs/system-speckit/033-spec-templates-and-context-reducer/` (context/, spec.md, plan.md).

## 13. RESEARCH BOUNDARIES
- Max iterations: 2 (stopPolicy max-iterations; convergence = telemetry only)
- Convergence threshold: 0.05 (telemetry only)
- Per-iteration budget: 12 tool calls, 12 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage)
- Write containment: ONLY `specs/system-speckit/033-spec-templates-and-context-reducer/research/lineages/pi-flash-b/` — every write, iteration file, state, research.md goes there
- Current generation: 1
- Started: 2026-08-12T09:00:00Z
