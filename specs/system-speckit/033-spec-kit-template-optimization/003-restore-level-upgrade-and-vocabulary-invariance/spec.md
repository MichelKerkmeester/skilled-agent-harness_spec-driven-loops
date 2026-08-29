---
title: "Feature Specification: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance"
description: "Two defects surfaced by this packet's review: upgrade-level.sh referenced template fragments the restructure deleted, and a vocabulary invariance failed on real artifact names and loose prose."
trigger_phrases:
  - "restore level upgrade"
  - "upgrade-level fragments"
  - "vocabulary invariance"
  - "template addendum derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored the level-upgrade path and cleared the vocabulary invariance"
    next_safe_action: "None; both defects are fixed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-003-restore-level-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance

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
| **Parent Packet** | system-speckit/033-spec-kit-template-optimization |
| **Predecessor** | 002-acceptance-criteria-template |
| **Successor** | 004-checklist-deprecation-closure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two defects surfaced during this packet's review, both pre-dating it. `upgrade-level.sh` resolved per-level addendum fragments under `templates/addendum/`, a directory the template restructure deleted, so every Level 1 to Level 2 upgrade failed on a missing file and rolled back — the documented escalation path for a packet whose scope grew was inoperable. Separately, a vocabulary invariance that guards public surfaces against private template taxonomy was failing on nine lines across five documents, mixing genuine artifact names with ordinary English.

### Purpose
The upgrade chain works end to end again without reintroducing fragment files, and the vocabulary scan passes while still catching real leaks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/spec/upgrade-level.sh` addendum resolution and new-file creation.
- `scripts/tests/workflow-invariance.vitest.ts` allowlist entries.
- The four documentation lines that used reserved words as ordinary English.

### Out of Scope
- Restoring the deleted fragment files - the gated templates already carry the same content, and two sources would drift.
- The acceptance-criteria feature itself - that is phases 001 and 002; this phase only adds the closure document to what an upgrade creates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/spec/upgrade-level.sh` | Modify | Derive level addenda from the gated templates; create the closure document on upgrade |
| `scripts/tests/workflow-invariance.vitest.ts` | Modify | Allow genuine identifiers by token |
| `feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md` | Modify | Drop a reserved word from a heading |
| `feature-catalog/tooling-and-scripts/derived-packet-repair.md` | Modify | Drop a reserved word from prose |
| `manual-testing-playbook/tooling-and-scripts/canonical-first-spec-root-resolution.md` | Modify | Drop a reserved word from two lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The upgrade chain completes from Level 1 through Level 3+ without a missing-file failure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | An upgrade to Level 2 creates the document the closure gate requires |
| REQ-005 | Genuine artifact names stay exempt by token rather than by whole document |
| REQ-002 | The vocabulary invariance passes while still reporting a planted leak |
| REQ-003 | A level bump never injects a section the document already carries |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Level 1 packet upgrades to Level 3+ with no duplicated section headings.
- **SC-002**: An upgrade to Level 2 produces the document the closure gate requires.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gated templates and the inline renderer | No source for the derived addenda | None needed; both already ship |
| Risk | A derived addendum injects a section the document already has | Med | Sections are matched on heading text with the number stripped, and duplicates are filtered |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The derivation renders two templates per document per step, which is negligible against the existing file rewriting.
- **NFR-P02**: Not applicable; the upgrade is a one-shot operator command.

### Security
- **NFR-S01**: Rendering is read-only; the upgrade continues to back up before writing.
- **NFR-S02**: Not applicable; nothing here handles data at rest.

### Reliability
- **NFR-R01**: A derivation that yields nothing degrades to a warning rather than aborting the whole upgrade.
- **NFR-R02**: A failed step restores from the backup the upgrade takes first.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a level pair that adds nothing yields an empty fragment and is skipped with a warning.
- Maximum length: no limit; the derivation is line-based.
- Invalid format: a document with no recognisable headings yields an empty derived fragment and the step warns.

### Error Scenarios
- Renderer failure: the step warns and leaves the document untouched.
- Not applicable; nothing here touches the network.
- Concurrent access: the upgrade backs up before writing and restores that backup if any step fails.

### State Transitions
- Partial completion: a failed step rolls the whole upgrade back rather than leaving a half-upgraded packet.
- Not applicable; the upgrade is a single synchronous command.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 5 files across the upgrade script, one test and three documents |
| Risk | 8/25 | No auth, no API, no breaking change; the upgrade already backed up before writing |
| Research | 4/20 | Both defects were already diagnosed by review |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


