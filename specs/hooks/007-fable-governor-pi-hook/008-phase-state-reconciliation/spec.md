---
title: "Phase State and Metadata Reconciliation"
description: "Reconciled phase status, completion metadata, graph state, checklist evidence, parent handoffs, and resume routing without promoting unfinished work."
status: complete
completion_pct: 100
trigger_phrases:
  - "phase state reconciliation"
  - "spec metadata reconciliation"
  - "stale completion frontmatter"
  - "graph status repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/008-phase-state-reconciliation"
    last_updated_at: "2026-08-05T00:23:03Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed phases 001-009 state reconciliation and refreshed packet metadata"
    next_safe_action: "Preserve the uncommitted-state freshness caveat; no further in-scope implementation remains"
    blockers: []
    key_files:
      - "../spec.md"
      - "../graph-metadata.json"
      - "../007-dispatch-validation-evidence/evidence/full-corpus-baseline.md"
      - "../009-injection-contract-directive-sync/implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-008-reconcile"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phases 001-009 have evidence-supported Complete status; the package-root corpus remains exit 1."
      - "The parent resume pointer identifies Phase 009 as the most recently reconciled child."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase State and Metadata Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-dispatch-validation-evidence |
| **Successor** | 009-injection-contract-directive-sync |
| **Handoff Criteria** | Every phase status is internally consistent, generated metadata reflects all nine children, completion claims have evidence, and parent handoffs are unique and current. Phase 009's scoped contract synchronization remains Complete and untouched by this state repair. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet's phase implementation summaries contain contradictory state: some frontmatter says planned or not started while the body says implemented, completion percentages remain at zero after claimed work, graph metadata still reports draft/planned state, and completion criteria remain unchecked. The parent map also contains duplicate historical rows and does not yet describe the four remediation children. These inconsistencies make resume routing and completion review unreliable even when the source diff contains partial fixes.

### Purpose
Make status a truthful, generated, cross-document state: planned work remains planned, implemented work has command-backed evidence, incomplete criteria remain open, graph metadata and description metadata match the current packet, and parent handoffs describe one ordered nine-phase map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Status and completion reconciliation for phases 001-009, including spec metadata, implementation-summary continuity, checklist/task evidence rows, and graph-derived status.
- Parent phase-map and handoff uniqueness for the existing five historical phases plus remediation phases 006-009.
- Metadata refresh using the repository's description and graph generators for the parent and every changed child.
- A final packet sweep proving that planning-only phases do not claim source implementation complete.

### Out of Scope
- Implementing or testing dispatch enforcement; Phase 006 owns that source seam.
- Producing the full-corpus failure ledger or correcting test-strength language; Phase 007 owns evidence claims.
- Synchronizing the injection contract wording; Phase 009 owns durable contract docs.
- Rewriting historical phase scope or deleting completed-phase records.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/implementation-summary.md` through `005-agents-md-pi-row/implementation-summary.md` | Modify | Reconcile status, completion, verification, and next-action fields with observed evidence. |
| `006-dispatch-authorization-hardening/implementation-summary.md` through `009-injection-contract-directive-sync/implementation-summary.md` | Modify | Align each remediation summary with its evidence-supported state; preserve Phase 006/007/009 implementation evidence and source/test boundaries. |
| `001-research/checklist.md` through `009-injection-contract-directive-sync/checklist.md` | Modify | Put completion evidence under the owning checklist/task artifact and leave unsupported rows open. |
| `spec.md` | Modify | Maintain one nine-row Phase Documentation Map and unique handoff criteria. |
| `description.json` and `graph-metadata.json` in the parent and changed children | Generate | Refresh identity, child list, derived status, source docs, and resume pointer. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Status must agree across each phase's spec.md, implementation-summary frontmatter/body, checklist/task state, and graph-derived metadata. | A packet-wide status table shows one normalized state per phase; no phase says Complete while its required criteria remain unchecked or its summary says implementation pending. |
| REQ-002 | Completion percentages and frontmatter must reflect actual work, not stale planned/not-started text or an unearned completion value. | Phases 001-009 are marked Complete/100% only where their task, checklist, or named command evidence supports it; the package-root corpus remains an explicit exit-1 deferral. |
| REQ-003 | Parent map and handoff metadata must list every direct child exactly once and preserve historical phases. | `spec.md` has one row each for 001-009, no duplicate rows, and every adjacent handoff has a criterion and objective command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Graph and description metadata must be regenerated for every changed folder. | The generator commands exit 0 for parent and each changed child; `children_ids`, status, identity, source docs, and freshness match on-disk docs. |
| REQ-005 | Completion criteria and evidence rows must be placed in their owning checklist/tasks artifact. | A scan finds no completed row that relies only on an implementation-summary prose assertion; open or deferred rows name an owner and revisit trigger. |
| REQ-006 | No remediation phase may be described as source implementation complete without command-backed evidence. | Phases 006-009 retain their scoped implementation/evidence boundaries; Phase 009 is Complete because its contract greps, bridge test, and strict validation have recorded receipts, while the package-root corpus is not called green. |
| REQ-007 | Resume routing must identify the most recently reconciled child without contradicting packet state. | Parent `graph-metadata.json` has a current `derived.last_active_child_id` of Phase 009 and timestamp, and the parent status is Complete because all required phases have closed; the uncommitted-state caveat is reported separately. |
| REQ-008 | The state reconciliation is reversible and does not delete historical phase records. | A diff review identifies only status/evidence/handoff/metadata edits; rollback restores the prior metadata and wording files without removing phase folders. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a phase whose summary body claims implementation while its frontmatter says planned, **when** reconciliation runs, **then** the state is changed to the evidence-supported status and the unsupported claim is corrected or backed by a named command.
- **SC-002**: **Given** a child with incomplete criteria, **when** metadata is regenerated, **then** its graph status remains non-complete and its summary does not claim completion.
- **SC-003**: **Given** the parent map and nine direct children, **when** the map is scanned, **then** each phase appears exactly once and each handoff has a criterion plus verification command.
- **SC-004**: **Given** refreshed descriptions and graph metadata, **when** strict validation runs recursively, **then** child IDs, status, identity, source docs, and freshness pass; an uncommitted-packet completion-freshness warning is reported separately rather than called green.
- **SC-005**: **Given** the most recently reconciled remediation child, **when** the parent graph metadata is read, **then** `last_active_child_id` points to Phase 009 and the parent status matches the all-complete child rollup.
- **SC-006**: **Given** historical completed-phase records, **when** state reconciliation runs, **then** records are retained and only unsupported state/evidence wording is corrected.

**Objective verification commands:**

```bash
root=.opencode/specs/hooks/007-fable-governor-pi-hook
for folder in "$root" "$root"/[0-9][0-9][0-9]-*/; do
  node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js "$folder" .opencode/specs --level 2
 done
for folder in "$root"/[0-9][0-9][0-9]-*/ "$root"; do
  node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js "$folder"
done
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$root" --strict
```
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marking a historical phase incomplete could obscure real work; marking it complete could preserve a false claim. | High | Let Phase 007 evidence and checklist rows decide; preserve history in prose while normalizing current status. |
| Risk | A metadata generator can refresh child IDs while leaving stale handoff wording. | Medium | Scan parent map and adjacent predecessor/successor fields after generation, then recursively strict-validate. |
| Risk | Current source fixes may bias status toward completion. | High | Treat source diff as partial implementation evidence only; require named tests and actual boundary evidence. |
| Dependency | Phases 006 and 007 evidence | High | Use the recorded focused receipts and preserve the package-root corpus exit 1 as a deferral. |
| Dependency | Description and graph generators | Medium | Run the exact repository scripts and inspect output/exit status; stop on any drift. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Metadata refresh is scoped to this packet and does not walk unrelated repository folders.
- **NFR-P02**: Reconciliation does not alter source/test files or invoke external dispatches.

### Security
- **NFR-S01**: No completion status is elevated based on model/reviewer text without local command evidence.
- **NFR-S02**: Generator paths stay under `.opencode/specs`; no history, branch, or production data is rewritten.

### Reliability
- **NFR-R01**: Re-running generators is idempotent apart from expected timestamps and memory sequence fields.
- **NFR-R02**: A stale or missing resume pointer falls back to child status listing rather than guessing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Child exists on disk but is absent from `children_ids`: regenerate parent graph metadata and verify the full nine-child set.
- A summary says Complete while checklist rows are open: retain planned/review state until evidence is reconciled.
- A generated description level differs between parent and child: use `phase` for the parent and the child's declared Level 2 for remediation children.

### Error Scenarios
- Generator exits nonzero or reports drift: stop, inspect the exact output, and do not claim final state.
- Historical command evidence cannot be reproduced: preserve the historical claim as provisional, mark current status accordingly, and create an explicit deferral owner.
- Duplicate or missing handoff row: repair the parent map without deleting any historical phase row.

### State Transitions
- Incomplete remediation child: non-complete status and pending criteria remain honest.
- Review-ready historical child: status changes only after Phase 007 supplies evidence and checklist rows.
- Completed packet: parent pointer identifies the most recently reconciled child; any uncommitted-state freshness warning remains separately visible.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Nine child states, parent map, summaries, checklists, tasks, and generated metadata. |
| Risk | 20/25 | False completion and stale resume routing can hide unfinished security work. |
| Research | 13/20 | Historical evidence must be reconciled with current local artifacts. |
| **Total** | **51/70** | Level 2; packet-state and evidence reconciliation. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- All nine phase children have evidence-supported Complete status; Phase 009's contract work remains source/test-read-only to this packet repair.
- The package-root advisor corpus remains a nonzero maintenance deferral owned by Phase 007's recorded baseline.
- Historical implementation summaries retain their original evidence while their state fields now match the supported status.
<!-- /ANCHOR:questions -->

---

## REMEDIATION TRACEABILITY

| Finding | Requirement(s) | Acceptance scenario(s) | Task(s) | Rollback boundary | Objective verification |
|---------|----------------|------------------------|---------|-------------------|------------------------|
| P2 stale phase frontmatter, 0%/draft graph state, unchecked criteria, misplaced evidence | REQ-001, REQ-002, REQ-004, REQ-005, REQ-006, REQ-007 | SC-001, SC-002, SC-004, SC-005 | T001-T009 | Revert only status/evidence/metadata files; retain all phase folders and historical prose that remains supported. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook --strict` |
| P2 test/evidence state handoff | REQ-003, REQ-005, REQ-008 | SC-003, SC-006 | T004, T007, T010 | Restore the previous parent map and generated metadata from the scoped diff; do not delete historical rows. | `rg -n "^\| (1|2|3|4|5|6|7|8|9) \|" .opencode/specs/hooks/007-fable-governor-pi-hook/spec.md` |

## RELATED DOCUMENTS

- Parent packet: [../spec.md](../spec.md)
- Evidence predecessor: [../007-dispatch-validation-evidence/spec.md](../007-dispatch-validation-evidence/spec.md)
- Contract successor: [../009-injection-contract-directive-sync/spec.md](../009-injection-contract-directive-sync/spec.md)
