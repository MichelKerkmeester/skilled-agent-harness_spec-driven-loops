---
title: "Feature Specification: Fanout Lineage Timeout Override"
description: "Add an operator-facing override for fanout-run.cjs's hardcoded 4-hour per-lineage timeout cap, which has no CLI/config escape hatch today."
trigger_phrases:
  - "fanout lineage timeout override"
  - "computeLineageTimeoutMs 4 hour cap"
  - "lineage-timeout-hours flag"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/002-fanout-timeout-override"
    last_updated_at: "2026-07-01T07:15:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh fast, verified by Claude Sonnet 5"
    next_safe_action: "Phase complete; move to child 003-runtime-hygiene-fixes"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fanout Lineage Timeout Override

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 |
| **Predecessor** | 001-fanout-merge-schema-tolerance |
| **Successor** | 003-runtime-hygiene-fixes |
| **Handoff Criteria** | New CLI/config override lets a lineage exceed 4h; default behavior unchanged when the override is absent; full deep-loop-runtime suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fanout-run.cjs:884-888` `computeLineageTimeoutMs(lineage)` computes `Math.min(iters * timeoutSeconds * 2 * 1000, 4 * 60 * 60 * 1000)` — the `Math.min` saturates to a **hardcoded 4-hour ceiling** for any lineage whose `iterations * timeoutSeconds * 2` exceeds it, with **no CLI flag, env var, or config field to raise it**. Both the glm and gpt deep-research lineages independently flagged this as a structural risk (glm rated it CRITICAL) for genuinely slow, high-reasoning-effort, 30+-iteration runs — confirmed at `research/research.md` §4.1 (F-006/G-005). Neither lineage actually hit the wall in the 2026-07-01 run (both finished in ~25-27 minutes at 11-18 iterations), but a forced-depth run targeting 30-35 iterations at `xhigh`/`high` reasoning effort is a realistic candidate to hit it.

### Purpose
Give operators a way to raise (or otherwise configure) the per-lineage wall-clock timeout ceiling for legitimately long, high-effort, forced-depth fan-out runs, without changing the safe default behavior for normal runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--lineage-timeout-hours <N>` CLI flag (or equivalent) to the `fanout-run.cjs` dispatch surface, threaded through to `computeLineageTimeoutMs`.
- When absent, preserve exact current behavior (4-hour cap, `iters * timeoutSeconds * 2` formula) — zero behavior change for existing callers.
- When present, use the operator-supplied hour value as the ceiling instead of the hardcoded `4 * 60 * 60 * 1000`, while keeping the `iters * timeoutSeconds * 2` lower bound logic intact (i.e., still take the `Math.min` of the computed value and the new ceiling, not just replace the whole function).
- Document the new flag in `.opencode/commands/deep/research.md` and `.opencode/commands/deep/review.md` (both consume `fanout-run.cjs`) argument-hint / flag tables.

### Out of Scope
- Changing the per-iteration `timeoutSeconds` default or its own override (`--executor-timeout`, already configurable).
- Any change to what happens when a lineage IS killed by the timeout (that's existing salvage/retry behavior, unrelated to this fix).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | `computeLineageTimeoutMs` accepts an optional ceiling override; CLI arg parsing for `--lineage-timeout-hours` |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | New test(s): default behavior unchanged when flag absent; ceiling raised correctly when flag present |
| `.opencode/commands/deep/research.md`, `.opencode/commands/deep/review.md` | Modify | Document the new flag in argument-hint / flag table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default behavior (no flag) is byte-identical to today | New test: `computeLineageTimeoutMs` with no override still returns `Math.min(iters*timeoutSeconds*2*1000, 4h)` exactly |
| REQ-002 | `--lineage-timeout-hours N` raises the ceiling | New test: with the flag set to e.g. 8, a lineage whose computed value would exceed 4h but not 8h now gets the higher value, not silently capped at 4h |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The new flag is documented on both consumer commands | `research.md`/`review.md` argument-hint or flag table mentions `--lineage-timeout-hours` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New tests fail on pre-fix code (RED) and pass post-fix (GREEN) for both REQ-001 and REQ-002.
- **SC-002**: Full `deep-loop-runtime` Vitest suite passes with the new tests included.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Safety | Removing/raising a timeout ceiling could let a truly hung process run indefinitely | Operator opt-in only (flag absent = current safe default); still a numeric ceiling, not unlimited, unless the operator explicitly sets an extreme value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by `research/research.md` §4.1 (F-006/G-005).
<!-- /ANCHOR:questions -->
