---
title: "Implementation Plan: Recursive Validation Remediation"
description: "Plan and completion record for repairing command-tree parity, reconciling updated-validator drift, and proving the 015 program at strict exit 0"
trigger_phrases:
  - "recursive validation remediation plan"
  - "strict validator remediation"
  - "program exit zero proof"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/021-recursive-validation-remediation"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded global parity repair and full-program metadata remediation"
    next_safe_action: "Retain three strict validator receipts and phase-chain metadata"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Recursive Validation Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON spec metadata with Bash and Node validation tooling |
| **Framework** | system-spec-kit strict spec-folder validator |
| **Storage** | Packet documents plus `description.json` and `graph-metadata.json` |
| **Testing** | `validate.sh` with `--no-recursive --strict` on three scoped folders |

### Overview

Document the completed remediation in four bounded stages: capture the two root causes and selected full-program scope, author the Level-2 packet and conformance metadata, close the predecessor and parent phase links, then run the three authoritative strict proofs. The implementation surface is documentation and metadata; the runtime-mirror symlink repair is recorded as the already-committed global prerequisite.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The failed plan-named recursive strict gate and both root causes are recorded `validate.sh`
- [x] Full-program exit-0 remediation is the recorded operator scope `21/21 PASSED`
- [x] The allowed file boundary is explicit in `spec.md` `graph-metadata.json`

### Definition of Done

- [x] All seven Level-2 packet artifacts exist with consistent completion metadata `spec.md`
- [x] Predecessor, successor, parent, and child ordering are reconciled `020-root-router-document-standard`
- [x] Three strict no-recursive validator proofs report zero errors and warnings `validate.sh`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Metadata-only remediation with a final validator proof. The global hook parity repair is a prerequisite recorded in the packet; no runtime decision path is redesigned here.

### Key Components

- **Global parity repair**: `sync-runtime-mirrors.cjs` regenerated the four missing hook symlinks from runtime hook configuration.
- **Document conformance**: five packet Markdown files carry the required continuity block and completed P0/P1 evidence.
- **Generated metadata**: `description.json` declares Level 2; graph metadata carries parent, children, status, and final source hashes.
- **Phase chain**: the new packet follows `020-root-router-document-standard`, and the program graph appends it last.

### Data Flow

Runtime hook configuration -> mirror synchronization -> command-tree parity; packet Markdown -> fingerprint refresh -> strict folder validation; child graph append -> program phase-chain validation.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Capture the exit-2 symptom, the four missing symlinks, and the 7-error/77-warning drift `validate.sh`
- [x] Record the operator's full-program exit-0 scope choice `21/21 PASSED`
- [x] Preserve the no-runtime-logic and no-memory-database boundaries `graph-metadata.json`

### Phase 2: Core Documentation

- [x] Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` `spec.md`
- [x] Add Level-2 `description.json` and graph metadata with the required shape `description.json`
- [x] Include continuity blocks and real evidence markers in every authored Markdown document `spec-doc-structure.ts`

### Phase 3: Phase-Chain Reconciliation

- [x] Link this packet to predecessor `020-root-router-document-standard` and parent `../spec.md` `spec.md`
- [x] Add this packet as 020's successor and refresh 020 source hashes `graph-metadata.json`
- [x] Append this packet after 020 in the program parent's child list `children_ids`

### Phase 4: Verification

- [x] Run strict no-recursive validation for this packet `Errors: 0 Warnings: 0`
- [x] Run strict no-recursive validation for 020 `Errors: 0 Warnings: 0`
- [x] Run strict no-recursive validation for the 015 program `21/21 PASSED`
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Pass Signal |
|-----------|-------|------|-------------|
| Packet validation | New Level-2 packet | `validate.sh ... --no-recursive --strict` | `EXIT=0`, Errors 0, Warnings 0 |
| Predecessor validation | 020 after successor link | `validate.sh ... --no-recursive --strict` | `EXIT=0`, Errors 0, Warnings 0 |
| Program validation | 015 parent and 21 children | `validate.sh ... --no-recursive --strict` | `EXIT=0`, Errors 0, Warnings 0 |
| Fingerprint integrity | 021 and 020 graph metadata | `graph-metadata-parser.js` and `generated-metadata-drift.js` | Source hashes match final docs |
| Scope integrity | Worktree changes | `git status` and scoped diff inspection | No task-created residue outside allowed paths |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sync-runtime-mirrors.cjs` | Repository tool | Applied | Strict command-tree parity remains blocked |
| Updated spec validator | Repository tool | Applied | Drift findings cannot be reconciled |
| `020-root-router-document-standard` | Predecessor packet | Complete | New successor link would be missing |
| `015-router-unification-program` graph metadata | Parent metadata | Updated | Program child ordering would be incomplete |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scoped metadata edit is found to be inaccurate or the final strict proof regresses.
- **Procedure**: Revert only this packet's authored documents and the explicitly permitted 020 and parent graph edits; retain the prior committed hook-sync repair and re-run the three validator commands.
- **Data reversal**: No data migration or SQLite write is part of this packet.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Capture) -> Phase 2 (Author) -> Phase 3 (Link and hash) -> Phase 4 (Strict proof)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Capture | None | Author |
| Author | Capture | Link and hash |
| Link and hash | Author | Strict proof |
| Strict proof | Link and hash | None |
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Capture | Low | Root-cause and scope record |
| Author | Low | Seven packet artifacts |
| Link and hash | Low | Three graph-chain edits and two fingerprint refreshes |
| Strict proof | Low | Three validator receipts |
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Final packet and predecessor fingerprints are refreshed `source_fingerprint`
- [x] Parent child ordering appends this packet after 020 `children_ids`
- [x] Runtime and frozen logic boundaries remain unchanged `scope locked`

### Rollback Procedure

1. Revert only the scoped Markdown and JSON metadata changes.
2. Restore the prior 020 successor state if the new link is withdrawn.
3. Re-run strict validation to distinguish a metadata regression from a global parity failure.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: Git revert of the scoped packet and phase-chain metadata edits
<!-- /ANCHOR:l2-rollback -->
