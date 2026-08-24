---
title: "Feature Specification: combo-matrix cli-devin arg conformance"
description: "Re-pin the combo-matrix representative-args expectation for cli-devin to include the --respect-workspace-trust false flag that fanout-run.cjs already emits (packet-046 devin CLI repair), fixing a stale test that failed on every run."
trigger_phrases:
  - "combo-matrix devin respect-workspace-trust"
  - "combo-matrix cli-devin expected args"
  - "devin arg conformance test fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/054-combo-matrix-devin-arg-conformance"
    last_updated_at: "2026-08-24T15:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Aligned cli-devin representative args; guard suite green"
    next_safe_action: "Push to v4"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-054-combo-matrix-devin-arg"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: combo-matrix cli-devin arg conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-24 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fanout-run.cjs` unconditionally appends `--respect-workspace-trust false` to the `cli-devin` dispatch command (the packet-046 devin-CLI repair: non-interactive print mode cannot answer the workspace-trust prompt, so fresh dispatch dirs otherwise fail closed). But `combo-matrix.vitest.ts`'s `expectedRepresentativeArgs` for `cli-devin` was never updated to include those two tokens, so the construction-matrix assertion asserted the wrong argv and **failed on every run** — independent of any feature work. It was surfaced (and proven pre-existing via a stash negative control) while landing packet 053.

### Purpose
Re-pin the `cli-devin` representative-args expectation to match what the builder actually emits, making the deep-loop guard suite green again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `combo-matrix.vitest.ts` — append `'--respect-workspace-trust', 'false'` to the `cli-devin` case of `expectedRepresentativeArgs`.

### Out of Scope
- `fanout-run.cjs` behavior — it is correct; only the test expectation was stale.
- Any other executor's representative args.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | cli-devin expected args: +`--respect-workspace-trust false` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | combo-matrix cli-devin expectation matches the emitted argv | `expectedRepresentativeArgs('cli-devin', …)` ends with `'--respect-workspace-trust', 'false'`; `combo-matrix.vitest.ts` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No regression in the deep-loop guard suite | `executor-config.vitest.ts` + `fanout-run.vitest.ts` still pass |
| REQ-003 | Fix verified by a real test run, not just inspection | `npx vitest run combo-matrix.vitest.ts` executed and observed green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run combo-matrix.vitest.ts` passes (was failing on the cli-devin representative-args assertion).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The builder's devin arg order changes again | Test drifts from code | The expectation mirrors `fanout-run.cjs` exactly; a future arg change updates both |
| Dependency | Packet 046 devin repair (`--respect-workspace-trust false`) | The flag being emitted | Already shipped; this only aligns the test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Root cause is packet `046-cli-devin-current-cli-repair`; surfaced during packet `053-cline-ox-alpha-cli-pi-roster`.
<!-- /ANCHOR:questions -->
