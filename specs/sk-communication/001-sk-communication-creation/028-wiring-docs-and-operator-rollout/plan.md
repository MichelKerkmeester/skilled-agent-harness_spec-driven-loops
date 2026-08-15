---
title: "Implementation Plan: Phase 028 Wiring Docs and Operator Rollout"
description: "Author the closing operator documentation for the wired projection: an enablement guide, a rollout runbook, and a rollback path, conformed to the sk-doc reference standard and verified through a fresh-operator walkthrough."
trigger_phrases:
  - "wiring-docs-and-operator-rollout"
  - "implementation plan"
  - "operator rollout plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/028-wiring-docs-and-operator-rollout"
    last_updated_at: "2026-08-14T08:58:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed the plan and closed the phase with strict validation."
    next_safe_action: "Hand the parent packet its closing-phase handoff for the parent-packet decision."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-028-wiring-docs-rollout-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The three operator references are authored, every authored operator doc passes the reference validator, and the phase passes strict validation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 028 Wiring Docs and Operator Rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown operator references inside the sk-communication skill |
| **Framework** | sk-doc reference standard with `validate_document.py --type reference` |
| **Storage** | `.opencode/skills/sk-communication/cli-communication-projection/docs/`; no runtime or persisted data change |
| **Testing** | Reference validator on every authored doc plus strict packet validation |

### Overview

Author three operator references that close the wired projection: an enablement guide, a rollout runbook, and a rollback path. The guide documents `COMMUNICATION_PROJECTION_ENABLED`, the git-ignored `enablement.local.json`, and per-runtime setup. The runbook stages enablement behind capability, privacy, and evaluation-gate prerequisites. The rollback path covers flag disable, `OriginalOnlyEmergencyMode`, plugin uninstall, and stopping wrapper use. The result lets a fresh operator enable, verify, and roll back each runtime using only the docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The enablement sources and precedence are explicit. [evidence: `docs/enablement.md` sections 2 and 3 name `COMMUNICATION_PROJECTION_ENABLED`, `enablement.local.json` and the variable-wins rule from `src/config/enablement.ts`]
- [x] The per-runtime launch commands (plugin install and wrapper entrypoints) are inventoried. [evidence: `docs/enablement.md` sections 5 and 6 name the plugin path, the launcher usage and the five wrapper runtimes from `bin/cli-output-wrapper.mjs` and the wrapper registry]
- [x] The evaluation-gate report fields and the capability and privacy prerequisites are inventoried. [evidence: `docs/runbook.md` sections 3, 4 and 5 name the doctor decision fields, the privacy route and canary gates, and the `evaluateReleaseReadiness` fields]

### Definition of Done

- [x] All ten requirements have observed evidence. [evidence: `checklist.md` CHK-020 and `implementation-summary.md` Verification map every REQ to a doc section or a live verification run]
- [x] A fresh operator can enable, verify, and roll back each runtime using only the docs. [evidence: the launcher walkthrough in `implementation-summary.md` Verification covers `--list`, default-off passthrough, enabled fail-open, local-override opt-in and unknown-runtime handling]
- [x] Every authored operator doc passes `validate_document.py --type reference` and strict packet validation passes. [evidence: all three docs report `Total issues: 0`; `validate.sh --strict` reports 0 errors and 0 warnings]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three operator references (enablement, rollout, rollback) authored against the already-wired seams and the sk-doc reference standard, consumed as the operator's only source of truth.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Enablement guide | Document the opt-in sources, precedence, privacy boundary, and per-runtime setup |
| Rollout runbook | Define staged enablement, the capability and privacy prerequisites, and evaluation-gate reading |
| Rollback path | Document flag disable, original-only emergency mode, plugin uninstall, and stopping wrappers |
| Reference validator | Prove every authored doc conforms to the sk-doc reference standard |

### Data Flow

Operator -> enablement guide -> set flag or local override -> launch plugin or wrapper -> verify projected output against the evaluation gate -> rollback path restores original-only behavior on demand.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Enablement gate (Phase 016) | Defaults projection off | Documented, never modified | Guide matches the flag and local-override names |
| OpenCode plugin (Phase 019) | Projects through the native hook | Documented install, never modified | Install steps match the plugin path |
| Wrapper runtimes (Phases 020-025) | Project through the CLI-output wrapper | Documented launch, never modified | Launch steps match the wrapper entrypoints |
| Evaluation gate (Phase 027) | Gates release readiness | Consumed by the runbook, never modified | Reading rule matches the report fields |
| Operator-reference docs | Six existing references | Create enablement, extend runbook and rollback | `validate_document.py --type reference` |
| Phase and packet docs | Record and route planned state | Create Phase 028 | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the enablement sources, precedence, and privacy boundary from Phase 016. [evidence: `src/config/enablement.ts` names both opt-in sources, the variable-wins rule and the git-ignored file; `docs/enablement.md` sections 2 and 3 document them]
- [x] Inventory the per-runtime launch commands: the OpenCode plugin install and each wrapper entrypoint from Phases 019 through 025. [evidence: `.opencode/plugins/mk-communication-projection.js`, `bin/cli-output-wrapper.mjs` and the wrapper registry pin the plugin path, the launcher usage and the five wrapper runtimes; `docs/enablement.md` sections 5 and 6 document them]
- [x] Inventory the capability and privacy prerequisites and the evaluation-gate report fields from Phases 005, 007, and 027. [evidence: `src/doctor/doctor.ts`, `src/release/release-gate.ts` and `src/evaluation/gate.ts` name the fields; `docs/runbook.md` sections 3, 4 and 5 document them]

### Phase 2: Implementation

- [x] Author the enablement guide covering both opt-in sources, precedence, and per-runtime setup. [evidence: `docs/enablement.md`]
- [x] Author the rollout runbook staging enablement behind the prerequisites and the evaluation gate. [evidence: `docs/runbook.md`]
- [x] Author the rollback path covering flag disable, original-only emergency mode, plugin uninstall, and stopping wrappers. [evidence: `docs/rollback.md`]

### Phase 3: Verification

- [x] Run `validate_document.py --type reference` on every authored operator doc. [evidence: all three docs report `Total issues: 0`]
- [x] Have a fresh operator enable, verify, and roll back each runtime using only the docs. [evidence: the launcher walkthrough in `implementation-summary.md` Verification exercises `--list`, default-off passthrough, enabled fail-open, local-override opt-in and unknown-runtime handling]
- [x] Run strict packet validation and backfill graph metadata. [evidence: `validate.sh --strict` reports 0 errors and 0 warnings; `description.json` and `graph-metadata.json` are refreshed]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reference conformance | Every authored operator doc follows the sk-doc reference standard | `validate_document.py --type reference` |
| Fresh-operator trial | A fresh operator enables, verifies, and rolls back each runtime using only the docs | Manual walkthrough captured as evidence |
| Doc-source alignment | Commands and paths match the plugin, wrappers, and gate | Diff against Phases 016 and 019 through 027 receipts |
| Packet integrity | Phase 028 metadata, navigation, and links | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Wiring from Phases 019 through 027 | Internal | Required by plan | The docs cannot describe seams that do not exist |
| Phase 027 evaluation and release gate | Internal | Required by plan | The runbook cannot teach evaluation-gate reading |
| Enablement gate and opt-in sources | Internal | Available from Phase 016 | The guide cannot document precedence |
| Operator-reference set | Internal | Available from Phase 014 | The new docs cannot reuse the reference standard |
| sk-doc reference validator | Tooling | Available | Reference conformance cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc contradicts a wired seam, an enable step produces unexpected output, or a rollback step is ambiguous.
- **Procedure**: correct the affected operator reference to match the wired seam, rerun `validate_document.py --type reference` and the fresh-operator walkthrough, refresh graph metadata, and rerun strict packet validation. No runtime surface is reverted because none is changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Seam and gate inventory -> Doc authoring -> Reference and operator verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Seam and gate inventory | Wiring from Phases 019 through 027 | Doc authoring |
| Doc authoring | Complete inventory | Verification |
| Verification | Authored docs | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Seam and gate inventory | Low | 0.5 day |
| Doc authoring | Medium | 1-2 days |
| Verification and handoff | Low | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the exact plugin path, wrapper entrypoints, and flag names from the wired phases. [evidence: `docs/enablement.md` sections 5 and 6 record the plugin path, the launcher usage and the flag names]
- [x] Capture the existing operator-reference baseline before editing runbook and rollback. [evidence: the pre-edit `runbook.md` and `rollback.md` were read before rewriting and their existing release-runbook and tarball content is superseded by the operator rollout surfaces]
- [x] Confirm no runtime, plugin, or wrapper change is planned. [evidence: `git status` shows only the three operator docs and the 028 phase folder changed]

### Procedure

1. Restore any affected operator reference to its pre-change state.
2. Rerun `validate_document.py --type reference` on every authored doc.
3. Confirm the enable, verify, and rollback steps match the wired seams.
4. Refresh graph metadata and rerun strict validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore the operator references only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->
