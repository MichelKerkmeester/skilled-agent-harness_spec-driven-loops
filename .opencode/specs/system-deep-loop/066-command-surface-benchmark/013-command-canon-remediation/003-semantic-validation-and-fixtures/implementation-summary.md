---
title: "Implementation Summary: semantic validation and fixtures"
description: "Status of the W1/W2/W6 semantic-validation phase: Level-2 doc set materialized; implementation of the gate-obligation and mode-completeness checks, the reference-coverage fix, and the mutation fixtures is in progress."
status: in_progress
trigger_phrases:
  - "semantic validation implementation"
  - "gate obligation status"
  - "mode completeness status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T14:10:00Z"
    last_updated_by: "claude"
    recent_action: "Canonized W6 mode-completeness in Step 10; found doctor runtime-path coverage nuance"
    next_safe_action: "Fix reference-coverage extractor for doctor runtime paths, then add adapter checks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
    completion_pct: 30
    open_questions:
      - "Is timeout-bounds enforceable as a static invariant, or documentation-only?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-semantic-validation-and-fixtures |
| **Status** | In Progress |
| **Completed** | Level-2 doc set materialized; checks and fixtures not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Level-2 doc set is materialized and the W6 canon is written. Task T001 is complete: create-command Step 10 now carries a **Mode completeness** paragraph stating that every advertised mode must have both its workflow asset and an EXECUTION TARGETS row — the "canonize before enforcing" rule for the mode-completeness check. The two adapter checks, the coverage fix, and the mutation fixtures are still owed.

A coverage-expansion probe surfaced a concrete complication for T002: running the reference-resolution check across the doctor family reports eleven `[skill-asset]` misses in `doctor_update.yaml`, all of which are runtime-generated paths (`.flock` / `.lock` / `.log` locks and logs, `*.sqlite.pre-doctor-update` backups, `.doctor-update.config-instructions`). These are not static assets, so the coverage fix must teach the extractor to skip runtime-generated artifacts — not merely widen the hard-coded family list. speckit assets resolve cleanly; memory has no asset YAMLs.

The planned change enforces three of the phase-001 contract's behavioral invariants the current checks miss: a gate-obligation check for required-input routers (W1), a mode-completeness check that a declared `:auto` / `:confirm` mode has both its workflow YAML and an EXECUTION TARGETS row (W6), and closure of the reference-coverage omission where `validate-command-references.cjs` hard-codes `FAMILIES = ['create', 'deep', 'design']` and skips speckit, memory, and doctor (W2). Each new invariant will be guarded by an independent mutation fixture detected by both the production adapter and the boundary-protected reference oracle.

### Files Changed

Planned targets:

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Planned | Write the mode-completeness rule into Step 10 before enforcing it |
| `.opencode/commands/scripts/validate-command-references.cjs` | Planned | Derive the family set from the command tree; remove the hard-coded omission |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Planned | Add contract-driven gate-obligation and mode-completeness checks |
| `reference-oracle.cjs` + fixture mutation manifest | Planned | Independent invariant implementations + one mutation fixture per invariant, re-frozen |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The build order is canonize (Step 10) → coverage fix → adapter checks → oracle counterparts and fixtures → re-freeze and verify, so the canon precedes enforcement and each invariant is proven against an independent mutation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Place the new checks in the adapter as contract-driven dimension checks | Reuse the shared finding shape and keep family behavior sourced from the phase-001 contract, not re-hard-coded |
| Derive the reference-check family set from the command tree | Removes the hard-coded omission structurally rather than by extending a list that can drift again |
| Implement each new invariant independently in the reference oracle | Preserves the differential-testing boundary W2 requires: adapter and oracle must agree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pending implementation. The gates below apply once the work is built.

| Check | Result |
|-------|--------|
| Gate-obligation check fires on a required-input router missing its gate | PENDING |
| Mode-completeness check flags an incomplete advertised mode | PENDING |
| Reference coverage reports all six families | PENDING |
| One mutation fixture fails per new invariant; adapter and oracle agree | PENDING |
| Step 10 canon precedes enforcement | PENDING |
| Strict packet validation | Run `validate.sh --strict` on this folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Only the Level-2 doc set exists.
2. **Timeout-bounds invariant undecided.** Whether the contract's `timeout_bounds` can fail a static mutation fixture or is runtime-only is an open question; it may be deferred as documentation-only.
<!-- /ANCHOR:limitations -->
