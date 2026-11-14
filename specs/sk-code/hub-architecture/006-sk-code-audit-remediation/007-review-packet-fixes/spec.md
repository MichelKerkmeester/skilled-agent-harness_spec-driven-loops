---
title: "Feature Specification: Phase 7: review-packet-fixes"
description: "Phase 001 verifies the 13 findings a DeepSeek reader raised against `sk-code-review`. This phase fixes each one that held and records why each refuted one stays as it is."
trigger_phrases:
  - "review packet fixes"
  - "phase 7 review packet fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: review-packet-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-skilled-packet-fixes |
| **Successor** | 008-quality-packet-fixes |
| **Handoff Criteria** | No `RV` row in the ledger has `-` in its last column, and `node --test .skilled/skills/sk-code/sk-code-review/scripts/tests` passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-code audit remediation specification.

**Scope Boundary**: This phase edits files inside `sk-code-review/` only. A row whose verdict is `Refuted` changes no file.

**Dependencies**:
- Phase 001, which sets the verdict of every `RV` row
- Phase 005, which owns the hub-level wording some rows repeat

**Deliverables**:
- A fix for each `Confirmed` or `Changed` `RV` row
- A `no change` reason for each `Refuted` row
- One packet release note
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code-review` packet decides how a review is written and when one may be skipped, and a reader found 13 places where it disagrees with itself or repeats a rule in several files. Two are confirmed. `SKILL.md` line 397 maps the `lite` depth to the M-2 skip while line 388 says M-2 does nothing unless a threshold is set, so `lite` reads as a way to skip reviews with no opt-in. `review-core.md` line 257 names a separator its own template does not use, so a reviewer who follows the sentence writes a final line the checker rejects.

### Purpose
Every `RV` row in the ledger is either fixed with a command that proves it or closed as `no change` with its reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ sed -n 388p .skilled/skills/sk-code/sk-code-review/SKILL.md | cut -c1-140
**Gate is ALWAYS opt-in.** Without `SK_CODE_REVIEW_MIN_CHANGED_LINES` set, M-2 has zero effect: all diffs receive full reviews.
exit=0

$ sed -n 397p .skilled/skills/sk-code/sk-code-review/SKILL.md | cut -c1-70
- `lite`: maps to the existing M-2 conservative skip (§8.2). It NEVER 
exit=0

$ grep -c '^| RV-' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md
13
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix each `RV` row whose verdict is `Confirmed` or `Changed`, one task per row, in the file the row cites.
- Write `no change` and the reason in the ledger for each row whose verdict is `Refuted`.
- Record a per-file decision, split or keep with the reason, for the row that lists files over 400 lines.
- Raise the packet version and write one release note that names the rows fixed.

### Out of Scope
- Splitting or refactoring script sources over 400 lines - the finding is about size, no behaviour is wrong, and a refactor needs its own packet
- New findings noticed while fixing - they go in the `goal.md` log for the operator
- Files outside `sk-code-review/` - the hub and the other packets have their own phases

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Rows that cite the packet entry document |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modify | Rows that cite the packet README |
| `.skilled/skills/sk-code/sk-code-review/ROUTER.md` | Modify | Rows that cite the packet router |
| `.skilled/skills/sk-code/sk-code-review/references/` | Modify | Rows that cite a reference |
| `.skilled/skills/sk-code/sk-code-review/assets/` | Modify | Rows that cite an asset |
| `.skilled/skills/sk-code/sk-code-review/changelog/` | Create | One release note |
| `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` | Modify | Fix evidence for every `RV` row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `grep -c '^| RV-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`. |
| REQ-002 | `node --test .skilled/skills/sk-code/sk-code-review/scripts/tests` passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | `rg -c 'lite.*only when' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints 1, when row `RV-02` held. |
| REQ-004 | The review copy canary named in `.skilled/skills/sk-code/sk-code-review/scripts/README.md` still passes after rows `RV-04` to `RV-06`. |
| REQ-005 | No file outside `sk-code-review/` and the ledger appears in `git diff --stat` for this phase's commits. |
| REQ-006 | The newest file in `.skilled/skills/sk-code/sk-code-review/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-review/SKILL.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `RV` ledger row is closed with evidence.
- **SC-002**: `node --test .skilled/skills/sk-code/sk-code-review/scripts/tests` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Phase 001 verdicts | An unverified row cannot be fixed safely | Setup task T001 stops the phase while any `RV` row is `Unverified` |
| Risk | Removing a duplicated statement drops the only copy a guard pins | Med | Run the packet's guards after each removal, and keep the copy the guard names |
| Risk | A wording fix changes what the rule means | Med | Each task changes one statement to match the source the row names, and the verify clause checks the old wording is gone |
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

- Empty input: when every `RV` row is `Refuted`, the phase changes no packet file and still closes each row with `no change`.
- Maximum input: when all 13 rows hold, each is fixed by its own task and its own commit.
- Failure path: a fix that makes a packet guard fail is reverted, and the row stays open with the guard output in the log.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | Up to 13 small edits in one packet |
| Risk | 6/25 | Documentation wording that agents act on |
| Research | 4/20 | Verdicts arrive from phase 001 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


