---
title: "Feature Specification: Phase 10: validate-and-retrieval-exit-honesty"
description: "Several spec-kit checkers report a result their exit code or pass marker contradicts: a typo lookup exits 0, a findings-only goal corpus exits 0, a skipped rule prints a pass, the post-edit placeholder check fails where validate warns, a rule that could not run still yields RESULT: PASSED, and the dist alignment check never checks freshness."
trigger_phrases:
  - "validate and retrieval exit honesty"
  - "phase 10 validate and retrieval exit honesty"
  - "checker exit code honesty"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: validate-and-retrieval-exit-honesty

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
| **Phase** | 10 of 17 |
| **Predecessor** | 009-gate3-and-continuity-root |
| **Successor** | 011-spec-kit-doc-drift |
| **Handoff Criteria** | Every probe in Measured Behavior exits as its printed result says, and the spec-kit suites hold their baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V31, V32, V35, V36, V37, V40, V41 and the P2 rows V30 and V34 from `../research/research.md`. V30 needs no code change (see `decision-record.md`); its release-note text is phase 011's.

**Dependencies**:
- Phase 009 (same spec-kit runtime and `validate.sh`).

**Deliverables**:
- Lookup, goal checker, placeholder check, validate rules and dist alignment check whose exit codes and markers match what they found.
- A trigger corpus that no longer goes stale on every research iteration write.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator or a gate reads these checkers' exit codes and pass markers, and several of them say "fine" when they found nothing, could not run, or found findings. A misspelled Gate 1 lookup returns 20 rows scored 0 with exit 0, `check-goal.cjs --all` exits 0 on findings, `validate.sh` prints a pass for a contamination check it skipped and `RESULT: PASSED` when SOURCE_TAGS could not run, the post-edit placeholder script fails a Draft packet that validate only warns on, and a stale dist passes the alignment check.

### Purpose
Every spec-kit checker this phase touches exits and marks exactly what it found.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "valdiate the specc folder"
exit=0 rows 20 scores [ 0 ]

$ node sk-doc/sk-create-goal/scripts/check-goal.cjs --help
[check-goal] ERROR unknown option: --help

$ bash runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/004-v4-release-line-research/001-spec-kit-core --strict
+ CROSS_ANCHOR_CONTAMINATION: No routing payload supplied; contamination check skipped
RESULT: PASSED

$ bash runtime/cli/spec/check-placeholders.sh specs/.../010-validate-and-retrieval-exit-honesty ; echo $?
FAIL — 65 placeholder pattern(s) found in ...
1
$ bash runtime/cli/spec/validate.sh specs/.../010-validate-and-retrieval-exit-honesty
! PLACEHOLDER_FILLED: 65 unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft
RESULT: PASSED
```
V32, V36, V40 and V41 are reproduced by the worker's tests against fixtures, because the live repository has no findings-only goal corpus, no unreadable redirect table and no stale dist to point at.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exit the trigger lookup with 1 when no row scores above 0, in both modes (V31).
- Exit `check-goal.cjs --all` with 1 on a findings-only corpus, accept `--help`, and default the root to the caller's repository (V32, V34).
- Report CROSS_ANCHOR_CONTAMINATION as skipped, not passed, when validate.sh supplies no routing payload (V35).
- Keep `specs/**/research/**` out of the trigger corpus except each packet's `research/research.md` (V36).
- Make the post-edit `check-placeholders.sh` use the PLACEHOLDER_FILLED rule's verdict (V37).
- Fail a `--strict` run when SOURCE_TAGS could not run (V40).
- Fail the dist alignment check when a dist entry is older than its source build record (V41).

### Out of Scope
- Regenerating the committed trigger index - a generated artifact; rebuilt after merge (operator item in `decision-record.md`).
- V30 phase-parent anchor exemption - documented behaviour; its note text is phase 011.
- Wiring a save-time routing producer into validate.sh - no caller needs it; the standalone `--contamination-json` path stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | No-hit exit when nothing scores |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Exclude research artifacts except `research.md` |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Modify | Corpus exit, `--help`, root default |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, `spec-doc-structure.ts` | Modify | Skipped status for contamination; strict failure when a rule could not run |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh` | Modify | Mark the cannot-run case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh` | Modify | Delegate to the rule |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts` | Modify | Freshness check |
| Tests beside each | Modify/Create | One case per changed exit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `validate.sh --strict` never prints `RESULT: PASSED` when SOURCE_TAGS reported it could not run. |
| REQ-002 | `validate.sh` never prints the pass marker `+` for CROSS_ANCHOR_CONTAMINATION when no routing payload was supplied. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The lookup exits 1 when no result scores above 0, with or without `--scoring-only`, and exits 0 when any scores above 0. |
| REQ-004 | `check-goal.cjs --all` exits 1 when the corpus has findings and no errors; `--help` exits 0 with usage. |
| REQ-005 | `spec/check-placeholders.sh` exits 0 where PLACEHOLDER_FILLED warns and 1 where it fails. |
| REQ-006 | The trigger corpus excludes files under `specs/**/research/**` other than `research/research.md`. |
| REQ-007 | `check-source-dist-alignment.ts` exits non-zero when a recorded dist build is older than its sources. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each Measured Behavior probe exits or marks as its own output says.
- **SC-002**: The spec-kit cli vitest project and validation shell suites keep every test that passed at baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 009's `validate.sh` edit | Merge conflict in one file | 010 starts after 009's commit |
| Risk | A caller treats lookup exit 1 as an error | Med | AGENTS.md already defines exit 1 with no rows as a clean no-hit; grep callers for exit handling |
| Risk | Strict failure on SOURCE_TAGS breaks packets outside git | Low | Only the cannot-run path changes, and only under `--strict` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no checker gains a new pass over the repository except the freshness read of an existing build record.

### Security
- **NFR-S01**: N/A: no input crosses a trust boundary.

### Reliability
- **NFR-R01**: A check that cannot run is never reported as passed.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty lookup prompt keeps its current usage error.
- Maximum input: a corpus with both errors and findings still exits 2.
- Failure path: SOURCE_TAGS helper exit 2 is a warning without `--strict` and an error with it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Eight source files across retrieval, validation, evals and sk-doc |
| Risk | 14/25 | validate.sh is every packet's closure gate |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Design choices are recorded in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
