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
    last_updated_at: "2026-07-16T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-2 doc set for semantic-validation phase"
    next_safe_action: "Canonize W6 mode-completeness in Step 10, then build the checks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
    completion_pct: 20
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

The Level-2 doc set is materialized. The implementation is not yet written.

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
