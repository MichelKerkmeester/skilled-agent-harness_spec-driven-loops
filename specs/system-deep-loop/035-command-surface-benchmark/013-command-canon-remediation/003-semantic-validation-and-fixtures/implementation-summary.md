---
title: "Implementation Summary: semantic validation and fixtures"
description: "Status of the W1/W2/W6 semantic-validation phase: both semantic checks, the reference-coverage fix, and the two mutation fixtures are built and verified; the expectation corpus is re-frozen at 15 trees."
status: complete
trigger_phrases:
  - "semantic validation implementation"
  - "gate obligation status"
  - "mode completeness status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built both checks + coverage fix; re-froze corpus to 15 trees; gates green"
    next_safe_action: "Commit the reconciled packet and sync to origin"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Timeout-bounds stays documentation-only for this phase; it is not enforced as a static mutation fixture."
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
| **Status** | Complete |
| **Completed** | Both semantic checks, the coverage fix, and two mutation fixtures built and verified; corpus re-frozen at 15 trees |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The phase enforces three of the phase-001 contract's behavioral invariants the earlier checks missed, and each is now built and verified:

- **Gate obligation (W1).** A required-input router that owns its own gate (`input.required === true` and `input.gate_owner === 'router'`) must advertise it through `argument-hint`; an absent or empty hint is a P0 `CMD-S3-GATE-OBLIGATION-UNMET`.
- **Mode completeness (W6).** A `mode-pair` router must reference the workflow asset for every advertised core mode (`:auto` → `*_auto.yaml`, `:confirm` → `*_confirm.yaml`); a declared mode with no matching reference is a P1 `CMD-S3-MODE-INCOMPLETE`. create-command Step 10 carries the **Mode completeness** paragraph, written before the check enforced it (T001).
- **Reference coverage (W2).** `validate-command-references.cjs` now derives the family set from the command tree instead of the hard-coded `['create', 'deep', 'design']`, and skips runtime-generated doctor artifacts (locks, logs, `*.sqlite.pre-doctor-update` backups, config-instruction dotfiles) so the coverage widening does not report those transient paths as missing assets.

Both classifiers read the shared `command_contract.json` so the production adapter and the boundary-protected reference oracle stay byte-identical; the adapter does not import the oracle. Each new invariant is guarded by one public mutation fixture — `public-gate-obligation-unmet` and `public-mode-incomplete` — and the expectation corpus is re-frozen at 15 trees (10 public defects, 4 held-out, 1 clean).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Done (`37fafc727e`) | Mode-completeness rule written into Step 10 before enforcement |
| `.opencode/commands/scripts/validate-command-references.cjs` | Done | Family set derived from the tree; hard-coded omission removed; runtime doctor artifacts skipped |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Done | Contract-driven gate-obligation and mode-completeness checks added |
| `002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs` | Done | Independent invariant implementations; `EXPECTED_PUBLIC_DEFECTS` 8 → 10 |
| `002-deterministic-fixtures-oracle/fixtures/mutation-manifest.json` + corpus | Done | Two public mutation fixtures added and materialized |
| `002-deterministic-fixtures-oracle/expectations/*` + consuming manifest | Done | Expectation corpus re-frozen at 15 trees |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the intended order: canonize (Step 10) → coverage fix → oracle classifiers → adapter checks → mutation fixtures → re-freeze and verify. The canon preceded enforcement, and each invariant is proven against an independent mutation detected identically by the adapter and the boundary-protected oracle. The oracle and adapter share no code; they agree only because both read the same real-repo `command_contract.json` and use the same reference-extraction regex, which is what the differential test confirms.
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

| Check | Result |
|-------|--------|
| Gate-obligation check fires on a required-input router missing its gate | PASS — scratch `doctor/mcp.md` without `argument-hint` → one `CMD-S3-GATE-OBLIGATION-UNMET`; clean base `[]` |
| Mode-completeness check flags an incomplete advertised mode | PASS — scratch `deep/alignment.md` without the confirm-workflow reference → one `CMD-S3-MODE-INCOMPLETE`; clean base `[]` |
| Reference coverage reports all six families | PASS — `[create, deep, design, doctor, memory, speckit]`, 69 asset files, doctor misses 0, `--self-test` 3/3 |
| One mutation fixture fails per new invariant; adapter and oracle agree | PASS — differential test `PASS fixtures=15`; oracle `--verify` `PASS all=15` |
| No false positives on the conformant real corpus | PASS — adapter `check .opencode/commands` emits zero new-code findings |
| Step 10 canon precedes enforcement | PASS — Mode completeness paragraph committed `37fafc727e` before the check was built |
| Strict packet validation | PASS — `validate.sh --strict` on this folder, Errors:0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Timeout-bounds is documentation-only for this phase.** The contract's `timeout_bounds` is not enforced as a static mutation fixture; enforcing it would require runtime evidence a static fixture cannot supply, so it stays out of scope here.
2. **Predecessor 002's completion narrative predates this re-freeze.** Re-freezing the expectation corpus for the two new invariants changed the frozen hashes that 002's shipped docs cite; those 002 narrative docs are intentionally left as-shipped and flagged for a separate operator decision, since editing another phase's completion record is out of this phase's scope.
<!-- /ANCHOR:limitations -->
