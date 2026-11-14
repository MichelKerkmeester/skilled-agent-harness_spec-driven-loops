---
title: "Feature Specification: Phase 1: finding-verification"
description: "The audit left 37 of its 61 findings unchecked. This phase gives every finding a verdict backed by a command, and captures the router and setup baselines the later phases measure against."
trigger_phrases:
  - "finding verification"
  - "phase 1 finding verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: finding-verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-frontend-reach |
| **Handoff Criteria** | `grep -c '| Unverified |' findings-ledger.md` prints 0 and both baseline files exist in `scratch/`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-code audit remediation specification.

**Scope Boundary**: This phase reads and records. It changes no file under `.skilled/`.

**Dependencies**:
- The three raw reports in `scratch/deepseek-sk-code-*.log`
- The probe list in `scratch/probes.txt`

**Deliverables**:
- `findings-ledger.md` with no `Unverified` row
- `scratch/router-baseline.txt`
- `scratch/setup-baseline.txt`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit produced 61 findings. 36 come from three DeepSeek readers and were never checked against the files, and one more, the overlap inside the motion reference, rests on heading and keyword counts alone. A fix phase that acts on an unchecked claim can change a file that was correct, and the person who reviews that fix has no evidence to check it against.

### Purpose
Every audit finding carries a verdict and the command that decided it before any fix phase starts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ grep -c '^FINDING' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/deepseek-sk-code-*.log
specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/deepseek-sk-code-quality.log:14
specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/deepseek-sk-code-review.log:13
specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/deepseek-sk-code-skilled.log:15
exit=0

$ grep -c '| Unverified |' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md
37
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify each of the 36 unverified `SK`, `RV` and `QL` rows against the file it cites, and write the verdict and the deciding command in `findings-ledger.md`.
- Compare the forms, typography, focus and performance sections of `web-motion-and-interaction.md` with the four topic files they overlap, and record the duplicated rule ids in row `F7`.
- Run every prompt in `scratch/probes.txt` through the compiled router and save the raw output as `scratch/router-baseline.txt`.
- Run the setup battery and the drift guards and save the raw output as `scratch/setup-baseline.txt`.

### Out of Scope
- Fixing any finding - phases 002 to 008 own the fixes
- Looking for new findings - the ledger is a closed list, and a new observation goes in the `goal.md` log for the operator

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `findings-ledger.md` | Modify | Fill the verdict and evidence of every `Unverified` row |
| `scratch/router-baseline.txt` | Create | Raw router output for the 22 probes |
| `scratch/setup-baseline.txt` | Create | Raw setup battery and drift guard output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `grep -c '| Unverified |' findings-ledger.md` prints 0. |
| REQ-002 | `grep -c '| TBD |' findings-ledger.md` prints 0, so every verdict names its command or its file and line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | `grep -c '"action"' scratch/router-baseline.txt` prints 22, one decision per probe. |
| REQ-004 | `grep -c '^STATUS=' scratch/setup-baseline.txt` prints 1. |
| REQ-005 | Row `F7` of `findings-ledger.md` lists each duplicated rule id with the file that should own it, or carries the verdict `Refuted`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c '| Unverified |' findings-ledger.md` prints 0.
- **SC-002**: `ls scratch/router-baseline.txt scratch/setup-baseline.txt` lists both files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The raw DeepSeek reports in `scratch/` | A lost report leaves a row without its quoted evidence | The ledger already carries each claim and its cited line, so the row can be checked without the report |
| Risk | A cited line number moved after the audit | Med | Match on the quoted text, and write `Changed` with the current line when it moved |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a row whose cited file no longer exists gets `Changed` and the `ls` output that shows it.
- Maximum input: all 61 rows stay in the one ledger table, with no second file.
- Failure path: a claim no command can decide gets `Judgment` with the reasoning, never a guessed `Confirmed`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 8/25 | One ledger file and two baseline files |
| Risk | 3/25 | Read-only, no source file changes |
| Research | 14/20 | 37 claims to check against the files |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


