---
title: "Feature Specification: Phase 8: quality-packet-fixes"
description: "Phase 001 verifies the 14 findings a DeepSeek reader raised against `sk-code-quality`. This phase fixes each one that held and records why each refuted one stays as it is."
trigger_phrases:
  - "quality packet fixes"
  - "phase 8 quality packet fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: quality-packet-fixes

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
| **Phase** | 8 of 8 |
| **Predecessor** | 007-review-packet-fixes |
| **Successor** | None |
| **Handoff Criteria** | No `QL` row in the ledger has `-` in its last column, and `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-code audit remediation specification.

**Scope Boundary**: This phase edits files inside `sk-code-quality/` only. A row whose verdict is `Refuted` changes no file.

**Dependencies**:
- Phase 001, which sets the verdict of every `QL` row
- Phase 005, which owns the hub-level wording some rows repeat

**Deliverables**:
- A fix for each `Confirmed` or `Changed` `QL` row
- A `no change` reason for each `Refuted` row
- One packet release note
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code-quality` packet decides whether an author's change may be called done, and a reader found 14 places where its documents disagree or repeat one rule in two files. Three are confirmed. The README gates unchecked generated drift as P0 while `SKILL.md` gates it as UNVERIFIED, so two agents reading one packet reach different verdicts on the same change. The runner contract lists `syntax.json` under two exactness classes. The 24-file manual testing playbook is linked from none of the packet's three entry documents, so nobody is sent to it.

### Purpose
Every `QL` row in the ledger is either fixed with a command that proves it or closed as `no change` with its reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ sed -n 87p .skilled/skills/sk-code/sk-code-quality/README.md | cut -c1-150
| **P0** | Correctness, safety, broken contract, forbidden comment metadata, unchecked generated drift or missing checklist evidence | Blocks completi
exit=0

$ sed -n 179p .skilled/skills/sk-code/sk-code-quality/SKILL.md | cut -c1-110
| UNVERIFIED | Unchecked generated drift, missing required checklist evidence, a required check that produced 
exit=0

$ grep -c '^| QL-' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md
14
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix each `QL` row whose verdict is `Confirmed` or `Changed`, one task per row, in the file the row cites.
- Write `no change` and the reason in the ledger for each row whose verdict is `Refuted`.
- Record a per-file decision, split or keep with the reason, for the row that lists files over 400 lines.
- Raise the packet version and write one release note that names the rows fixed.

### Out of Scope
- Splitting or refactoring script sources over 400 lines - the finding is about size, no behaviour is wrong, and a refactor needs its own packet
- New findings noticed while fixing - they go in the `goal.md` log for the operator
- Files outside `sk-code-quality/` - the hub and the other packets have their own phases

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Rows that cite the packet entry document |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Rows that cite the packet README |
| `.skilled/skills/sk-code/sk-code-quality/ROUTER.md` | Modify | Rows that cite the packet router |
| `.skilled/skills/sk-code/sk-code-quality/references/` | Modify | Rows that cite a reference |
| `.skilled/skills/sk-code/sk-code-quality/assets/` | Modify | Rows that cite an asset |
| `.skilled/skills/sk-code/sk-code-quality/changelog/` | Create | One release note |
| `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` | Modify | Fix evidence for every `QL` row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `grep -c '^| QL-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`. |
| REQ-002 | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | `rg -l 'manual-testing-playbook' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md | wc -l` prints 2, when row `QL-06` held. |
| REQ-004 | `rg -c 'A finding on a changed line blocks\.' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1, when row `QL-14` held. |
| REQ-005 | No file outside `sk-code-quality/` and the ledger appears in `git diff --stat` for this phase's commits. |
| REQ-006 | The newest file in `.skilled/skills/sk-code/sk-code-quality/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `QL` ledger row is closed with evidence.
- **SC-002**: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Phase 001 verdicts | An unverified row cannot be fixed safely | Setup task T001 stops the phase while any `QL` row is `Unverified` |
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

- Empty input: when every `QL` row is `Refuted`, the phase changes no packet file and still closes each row with `no change`.
- Maximum input: when all 14 rows hold, each is fixed by its own task and its own commit.
- Failure path: a fix that makes a packet guard fail is reverted, and the row stays open with the guard output in the log.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | Up to 14 small edits in one packet |
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


