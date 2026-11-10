---
title: "Feature Specification: Phase 4: doctor-symlink-gaps"
description: "The doctor symlink engine's host-relative alias branch skips the ignore bookkeeping every other link gets, with no comment or test saying that is intended, and no doctor doc names that a whole-linked .skilled reads the checkout's specs folder. This phase plans a recorded decision, a test and one doc note."
trigger_phrases:
  - "doctor symlink gaps"
  - "phase 4 doctor symlink gaps"
  - "host-relative link ignore bookkeeping"
  - "whole-linked skilled specs limit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: doctor-symlink-gaps

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-metadata-write-safety |
| **Successor** | 005-docs-and-tests |
| **Handoff Criteria** | The P2-10b decision is recorded in code and pinned by a test, the whole-link limit is named in the doctor docs and in the 044 limitations, and the doctor node tests in `plan.md` section 5 pass against the baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the 044 remediation. The parent, `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos`, added the doctor `project_owned` entry and the in-place `.skilled/` build for a host. The review found two gaps in the symlink engine's host handling that remain after verification (P2-10b and P2-10d in `../review/p2-verification.md`).

**Scope Boundary**: The host-relative alias branch of `planMergeTree` and the doctor docs about the whole-link shape. Nothing else in the engine changes.

**Dependencies**:
- Independent of phases 001 to 003; it touches no track tooling.
- The engine tests `symlink-engine.test.cjs` and `doctor-symlink-contract.test.cjs`.

**Deliverables**:
- A recorded, tested decision for the ignore bookkeeping of a host-relative alias (P2-10b).
- A doctor doc note and a corrected 044 limitation that name what a whole-linked `.skilled` reads (P2-10d).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In `planMergeTree`, the host-relative branch (`symlink-engine.cjs:814-822`) pushes a `link` action and never pushes to `ignoreCandidates`, while the two branches after it do (`:826`, `:834`). A fresh host therefore shows `?? .skilled/specs` in `git status`. It may be intended, because the alias text is relative and portable, but no comment or test says so (P2-10b). Separately, a host whose `.skilled` is one whole link reads the Skilled checkout's `specs/` through `.skilled/specs`, not its own. The engine lines the verifier cites are `symlink-engine.cjs:698-701` and `:920-923`; no doctor doc names the limit, and the 044 `implementation-summary.md` limitation about the whole-link shape omits the `specs/` consequence (P2-10d).

### Purpose
The ignore decision is written where the next reader will look and checked by a test, and an operator who keeps a whole-linked `.skilled` can read that its `specs/` is the checkout's.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Quoted from ../review/p2-verification.md rows P2-10b and P2-10d (reproduced there on 2026-11-07, not rerun while planning this phase).
P2-10b: symlink-engine.cjs:814-822 never pushes to ignoreCandidates, while :826 and :834 do. Reproduced: `?? .skilled/specs`.
P2-10d: a whole-linked .skilled reads the checkout's specs/. No doctor doc names the limit; implementation-summary.md omits the specs consequence.
$ rg -n 'ignoreCandidates' .skilled/commands/doctor/scripts/symlink-engine.cjs     # observed while planning
792 794 826 834 841 890 909 913 927 939 954 960 are the matching lines; none sits in the host-relative branch at 814-822.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the ignore decision for a host-relative alias with a comment at the branch, and pin it with a test (P2-10b), per D-004a.
- Name the whole-link limit in the doctor docs: the `linked-whole` row of the presentation contract and the `--mode` row of `symlink.md` (P2-10d), per D-004b.
- Correct the 044 `implementation-summary.md` limitation about the whole-link shape (P2-10d).

### Out of Scope
- A wrong-content host-relative child that is flagged but never corrected - verified intended in `p2-verification.md` row P2-10a, so no work.
- `project_owned` linking into the checkout on a fresh host - verified deliberate in row P2-10c, so no work.
- Changing how a whole link resolves, or adding an engine warning for it unless D-004b chooses Option B.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modify | A comment at the host-relative branch (`:814-822`), or the `ignoreCandidates` push under D-004a Option A |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modify | One case next to the specs-alias cases at `:462-500` |
| `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt`, `.skilled/commands/doctor/symlink.md` | Modify | One sentence naming the whole-link `specs/` limit |
| `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/implementation-summary.md` | Modify | The Known Limitations item about the `.skilled/` shape; the review cites line 130, and that line holds item 2, so T006 first locates the right item |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P2-10b: the ignore behavior of the host-relative branch (`symlink-engine.cjs:814-822`) is stated in a comment and asserted by a test, in the direction D-004a chooses | A new case in `symlink-engine.test.cjs` plans a host with a `specs/` folder and asserts the plan's ignore entries for `.skilled/specs` (absent under Option B, present under Option A) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | P2-10d: the doctor docs name that a whole-linked `.skilled` reads the checkout's `specs/` | `rg -n 'whole' .skilled/commands/doctor/assets/doctor-symlink-presentation.txt .skilled/commands/doctor/symlink.md` prints the new sentence beside the `linked-whole` and `--mode` rows |
| REQ-003 | P2-10d: the 044 limitation about the `.skilled/` shape states the `specs/` consequence | The limitations item for the whole-link shape names `specs/` and the checkout |
| REQ-004 | Existing doctor behavior is unchanged | `symlink-engine.test.cjs` and `doctor-symlink-contract.test.cjs` pass against the baseline (50/50 at the close of 044) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new engine case passes and a reader of `symlink-engine.cjs:814-822` finds the reason for the chosen ignore behavior in a comment.
- **SC-002**: The two doctor node test files pass with zero failures, against the baseline taken before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Doctor command docs may have mirror checks | Low: a mirror test could fail after a doc edit | T007 runs `doctor-symlink-contract.test.cjs` and the mirror checks after the edit |
| Risk | Choosing Option A for D-004a hides the alias from git in a host that wants to commit it | Low: the host must un-ignore it | The recommendation is Option B, which changes no behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-004a (operator decision): ignore bookkeeping for a host-relative alias.**
  - Option B, intended, document and pin (recommended): the alias text is relative and portable, so the host may want to commit it, unlike the machine-local absolute links that the later branches ignore. The change is a comment and a characterization test. That test passes on the unchanged engine by design, so it cannot be failing-first, and T004 says so.
  - Option A, ignore it like the rest: push the alias to `ignoreCandidates`. That gives a failing-first test and removes the `?? .skilled/specs` line, and a host that wants the alias committed has to un-ignore it.
  - Decided 2026-11-07 by operator: Option B, intended, document and pin (recommended). Status: answered.
- **D-004b (operator decision): the whole-link limit.** Recommended: document it (REQ-002, REQ-003) and change nothing in the engine, because an existing whole-link install is left alone by design. Option B adds a `check` note for a whole-linked `.skilled`, which grows the report contract for a case the docs can cover. Decided 2026-11-07 by operator: document it and change nothing in the engine (recommended). Status: answered.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../review/review-report.md`, `../review/p2-verification.md`
