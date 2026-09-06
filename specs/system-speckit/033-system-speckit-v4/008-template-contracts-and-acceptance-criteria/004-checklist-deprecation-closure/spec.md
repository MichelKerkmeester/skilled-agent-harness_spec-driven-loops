---
title: "Feature Specification: Checklist Deprecation Closure"
description: "Repoint the acceptance-coverage advisory at the document it counts from, correct the traceability-source precedence the tasks/checklist merge left backwards, and give the rule its first unit suite."
trigger_phrases:
  - "ac coverage evidence source"
  - "traceability precedence"
  - "canonical criteria read"
  - "checklist deprecation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Repointed the coverage advisory at the canonical document and added its first unit suite"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh"
    session_dedup:
      fingerprint: "sha256:25655d3563a9d1b40ea16b9147ebc7f427863b88f93183e632d6bf2f32ac7a74"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The evidence source follows the count: canonical when acceptance-criteria.md exists, legacy otherwise"
      - "A waived or superseded criterion needs no citation; AC_CLOSURE already verifies its decision record"
---

# Feature Specification: Checklist Deprecation Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria |
| **Predecessor** | 003-restore-level-upgrade-and-vocabulary-invariance |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 2 moved acceptance criteria into `acceptance-criteria.md` and repointed the advisory's **total** at that document. It did not repoint the advisory's **evidence** read, which still scanned a separate traceability table. One ratio, two documents: the denominator counted criteria that were there, the numerator counted evidence in a table that no template has produced since the tasks and checklist documents were merged. Every packet carrying an acceptance-criteria document therefore reported `0/N`, and across the whole repository exactly one packet satisfied the rule.

The same merge left the source precedence backwards. `_ac_traceability_file` preferred a standalone `checklist.md` over the merged `tasks.md`, the inverse of what that merge's own summary claims it shipped. 2,262 packets carry both files, so all of them were read from the pre-merge one.

### Purpose

An advisory that measures the document it counts from, so a packet that recorded its evidence is scored as having recorded it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The evidence read: the canonical criteria document when it exists, the legacy traceability table otherwise.
- The traceability-source precedence: merged `tasks.md` first, pre-merge `checklist.md` as fallback.
- Lifecycle activation, so a packet with a canonical document and no legacy table is still measured.
- A unit suite for the rule, which had none.
- The stray `checklist.md` scaffolds in packet 042, and the evidence backfill in the packets the corrected rule now measures.
- Completion metadata for phase 2 of this packet, which claimed a shipped state its own documents contradicted.

### Out of Scope
- Retiring `checklist.md` across the 2,262 packets that carry one. That is a migration, not a rule fix, and every one of those packets validates today.
- Retro-filling phase 2's own 226-line checklist. Its 36 unchecked items are boilerplate for a validation-rule packet; ticking them to make a packet look closed is the failure this advisory exists to catch.
- Removing `checklist.md` from the level contract. It is listed as optional, and an optional entry is what lets the 2,262 legacy packets keep validating.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/rules/check-ac-coverage.sh` | Modify | Canonical evidence read, source precedence, lifecycle activation, remediation wording |
| `scripts/tests/check-ac-coverage.sh` | Create | The rule's first unit suite |
| `specs/.../042-*/00*/acceptance-criteria.md` | Modify | Backfill the citations the corrected rule measures |
| `specs/.../042-*/00*/checklist.md` | Delete | Unfilled scaffolds of a deprecated document |
| `specs/.../033-*/002-*/implementation-summary.md` | Modify | Add the missing Status row |
| `specs/.../033-*/spec.md` | Modify | Phase map records phase 2 as shipped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When `acceptance-criteria.md` exists, evidence is read from that document's Verification column, so the numerator and denominator come from one place |
| REQ-002 | A criterion whose Status is Waived or Superseded counts as covered without a citation, because its decision record carries it and `AC_CLOSURE` verifies that record exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The merged `tasks.md` is preferred over a pre-merge `checklist.md` as the legacy traceability source |
| REQ-004 | A packet with a canonical document but no legacy traceability table is still measured |
| REQ-005 | Columns bind by header name, so an added column cannot shift the Verification read |
| REQ-006 | The rule has a unit suite that fails if the evidence read and the count ever separate again |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four packet-042 phases move from `0/5` to `5/5` without their criteria changing meaning.
- **SC-002**: A packet with only a pre-merge `checklist.md` reports exactly what it reported before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Precedence flip changes the source for 2,262 packets | Med | Both sources are scanned by the same analyzer; the advisory is `info` and blocks nothing |
| Risk | Requiring `file:line` reads as busywork on criteria verified by hand | Low | Prose still parses; it is reported as malformed, never as an error, and a retired criterion is exempt |
| Dependency | `AC_CLOSURE` verifies the decision record behind a waiver | High | Already shipped in phase 2; the exemption here rests on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One awk pass over one document per packet, the same cost profile as the read it replaces.
- **NFR-P02**: Not applicable; the rule is invoked once per validation.

### Security
- **NFR-S01**: The rule reads packet documents and writes nothing.
- **NFR-S02**: Escaped pipes are protected before the row splits, so a cell cannot forge a column boundary.

### Reliability
- **NFR-R01**: A packet with no criteria document takes the legacy path unchanged.
- **NFR-R02**: A malformed citation is reported, never silently dropped; a dropped row would inflate coverage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a criteria table with no rows is a no-op, matching how the closure gate treats the same document.
- Maximum length: no row limit; the read is line-based like its siblings.
- Invalid format: a table with no `AC-ID` header contributes no rows and falls to the legacy path's behavior.

### Error Scenarios
- A Verification cell with prose and no citation: counted as malformed and named, not counted as covered.
- A fenced example row: skipped, so a template sample cannot inflate coverage.
- An added column between `AC-ID` and `Verification`: absorbed, because columns bind by header name.

### State Transitions
- Partial completion: a packet mid-implementation reports its real ratio; the advisory never blocks.
- A criterion retired after being cited: the Status change alone is enough, no citation edit needed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 rule files plus the packet documents the fix measures |
| Risk | 11/25 | No auth, no API; the read changes for every packet that has a criteria document |
| Research | 5/20 | The defect was found by reading the rule against the merge that caused it |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The evidence source follows the count, which is the only arrangement in which the ratio means anything.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Spec**: See `../spec.md`

---
