---
title: "Feature Specification: review-leaf-protocol"
description: "Two review lineages were rejected because the leaf retyped its artifact directory's track segment, one because it reached the iteration cap without recording a stop reason, and three runtime determinism tests failed on a nested vitest path the workspace hoist removed. The leaf prompt, the agent contract and the tests now say and do what the runner checks."
trigger_phrases:
  - "review leaf protocol"
  - "lineage path verbatim"
  - "stop reason max iterations"
  - "hostile locale child vitest"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: review-leaf-protocol

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The fan-out runner fails a lineage closed when it writes outside its directory or ends a max-iterations run without a recorded stop reason. Six nesting review passes showed the leaf breaking both rules from ignorance rather than defiance: it rebuilt the artifact path from the packet name and changed one character of the track, and one cursor leaf reached the cap without writing `stopReason`. Separately, three runtime determinism tests spawned a child vitest from a sibling package path that the workspace hoist removed, so their null exit read as a locale failure.

**Purpose:** the prompt and the agent contract state the two duties the runner enforces, and the determinism tests spawn the runtime's own vitest.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `runtime/scripts/fanout-run.cjs`: the lineage prompt tells the leaf to copy the directory path verbatim and, under `max-iterations`, to record `stopReason: maxIterationsReached`.
- `.opencode/agents/deep-review.md` and its runtime mirrors: the same two duties in the Write Safety rules; compiled review contract regenerated.
- `tests/unit/{event-envelope,replay-fingerprint,stream-fold-gauges}.vitest.ts`: spawn `runtime/node_modules/.bin/vitest`.
- A runner unit test asserting both prompt sentences.

### Out of Scope
- Relaxing the runner's containment or stop-policy checks; they are the fail-closed contract.
- The research leaf contract, which did not show the defect.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | The lineage prompt names the verbatim-path duty on every dispatch and the stop-reason duty when the stop policy is max-iterations | P1 |
| REQ-002 | The agent contract states both duties and every runtime mirror and the compiled contract match it | P1 |
| REQ-003 | The three determinism tests pass on this host | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Runner unit suite green including the new prompt test; agent mirror check and contract drift check OK.
- The three determinism files pass, 132 of 132.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A model still retypes the path despite the instruction | The runner's containment check remains fail-closed; the instruction lowers the rate, it does not replace the gate |
<!-- /ANCHOR:risks -->
