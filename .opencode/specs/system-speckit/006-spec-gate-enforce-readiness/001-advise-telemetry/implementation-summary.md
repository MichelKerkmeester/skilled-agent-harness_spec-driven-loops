---
title: "Implementation Summary: Spec-gate advise & would-deny telemetry [template:level_2/implementation-summary.md]"
description: "Planning stub for the Spec-gate advise/would-deny telemetry phase. Not yet implemented; no completion claims."
trigger_phrases:
  - "spec gate telemetry summary"
  - "advise telemetry planning"
  - "would-deny measurement"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/001-advise-telemetry"
    last_updated_at: "2026-07-11T11:05:56.873Z"
    last_updated_by: "spec-author"
    recent_action: "Created planning stub"
    next_safe_action: "Fill after implementation completes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advise-telemetry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Spec-gate advise & would-deny telemetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> PLANNING STUB — this phase is planned, not yet implemented. No completion claims. This file will be filled in after the work lands.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-advise-telemetry |
| **Status** | Planning — not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. The plan is to add per-event advise/would-deny telemetry to the Spec Mutation Gate so the operator can measure the would-be-deny rate that the enforce flip requires.

### Planned Work

- Add a would-deny signal to `evaluateMutation` (measurement-only; the deny predicate is unchanged) and an exported `formatSpecGateEvent` formatter in `spec-gate-core.mjs`.
- Wire both runtime adapters (`mk-spec-gate.js`, `spec-gate-enforce.mjs`) to write one structured, bounded, rotated telemetry line per mutation event.
- Extend `spec-gate-core.test.mjs` with format, discriminator, disabled, and rotation tests.

### Files Changed

None yet. See spec.md → Files to Change for the planned set.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Delivery will follow the plan: core signal + formatter, then adapter wiring, then verification via `node --test` and `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Return `wouldDeny` additively from `evaluateMutation` | Keeps `decision`/`detail` backward-compatible so existing tests stay green, and lets adapters label would-deny without re-deriving the exempt/open logic. |
| Put the line format in one shared `formatSpecGateEvent` | Both runtimes emit a byte-identical layout, so a single parser reads both logs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation | Not started (planning stub) |
| `node --test spec-gate-core.test.mjs` | Not yet run |
| `validate.sh --strict` on this phase | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning only.** No code exists yet; this stub is a placeholder until the work lands. The enforce flip and the sibling stuck-open fixes (phases 002-005) depend on the number this phase will produce.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
