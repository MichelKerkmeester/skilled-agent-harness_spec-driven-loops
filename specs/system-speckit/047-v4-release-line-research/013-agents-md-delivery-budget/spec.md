---
title: "Feature Specification: Phase 13: agents-md-delivery-budget"
description: "The AGENTS.md manifest check fails at HEAD and the Devin 16 KB delivery prefix has five bytes of headroom. Both fixes change the shipped AGENTS.md record or body, which is the operator's to approve, so this phase recorded the evidence and a concrete proposal. The operator approved both on 2026-11-09 and phase 020 applied them."
trigger_phrases:
  - "agents md delivery budget"
  - "phase 13 agents md delivery budget"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: agents-md-delivery-budget

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 17 |
| **Predecessor** | 012-hook-guards-and-audit-log |
| **Successor** | 014-doctor-and-ci-gate-honesty |
| **Handoff Criteria** | The operator runs the manifest write and approves or rejects the AGENTS.md headroom cut |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V48 and V61 and child finding 002 `f-iter009-002`.

**Dependencies**:
- None upstream. Phase 014 adds a CI step for the manifest check, which stays red until V48 is fixed.

**Deliverables**:
- Evidence and a decision for each finding, and a proposal the operator can apply in one sitting.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`agents-md-manifest.cjs --check` fails because the recorded history body `865f058927ed` is no longer released, and its only remedy is `--write`, which records the current unreleased AGENTS.md body as released. Devin injects the first 16,384 bytes of the 27,587-byte AGENTS.md; the last hard-rule anchor the delivery canary tracks ends at byte 16,379, so the next edit above it breaks the canary.

### Purpose
Leave the operator a decision they can apply without re-measuring anything.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check
[agents-md-manifest] FAIL: the manifest's derived key does not match AGENTS.md
[agents-md-manifest]   history: the recorded body 865f058927ed is no longer released
[agents-md-manifest] Run: node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write

$ wc -c AGENTS.md
   27587 AGENTS.md

$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
Delivery prefix (AGENTS.md, end byte <= 16384):
  16379  #### Blast-Radius Management
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record V48's cause and why its remedy is operator-only.
- Measure the Devin delivery prefix and record the headroom proposal for V61 and `f-iter009-002`.

### Out of Scope
- Running `agents-md-manifest.cjs --write` - it records an unreleased body as released; the lead reserved it for the operator.
- Editing the AGENTS.md body - it is the shipped universal template every runtime reads, its release record is the operator-only manifest write, and Devin cannot be run to confirm delivery (quota exhausted).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| This phase folder only | Modify | Evidence, decisions and the operator proposal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `agents-md-manifest.cjs --check` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The delivery canary's last anchor sits at least 512 bytes under 16,384. |
| REQ-003 | The decision record names the operator step for each finding with the exact command or edit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the operator steps, `--check` exits 0 and the canary reports 512 bytes or more of headroom.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator approval | Phase stays Blocked | The proposal is ready to apply |
| Risk | Phase 014's manifest CI step is red until V48 is fixed | Med | 014 records the dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no code change.

### Security
- **NFR-S01**: Every hard rule stays inside the 16,384-byte Devin prefix.

### Reliability
- **NFR-R01**: The manifest never records a body as released without the operator.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A.
- Maximum input: an AGENTS.md edit above the last anchor of more than five bytes breaks the canary today.
- Failure path: `--write` run by a worker would erase the evidence V48 rests on.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two artifacts, operator-applied |
| Risk | 20/25 | Instructions every runtime reads |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- For the operator: apply the headroom cut proposed in `decision-record.md`, then run the manifest write.
<!-- /ANCHOR:questions -->

---
