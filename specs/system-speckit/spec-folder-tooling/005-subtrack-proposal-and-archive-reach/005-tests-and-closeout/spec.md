---
title: "Feature Specification: Phase 5: tests-and-closeout"
description: "Phases 001 to 004 add two tools and three opt-in behaviors that no vitest suite covers yet. This phase writes five suites on the existing temp-repo pattern, runs the real-tree checks from the approved plan and closes the packet."
trigger_phrases:
  - "tests and closeout"
  - "phase 5 tests and closeout"
  - "relocate and suggest-subtracks vitest suites"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: tests-and-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-archive-search-and-json |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for the parent and all five children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: New test files under `.skilled/skills/system-spec-kit/runtime/cli/tests/`, the six verification steps of the approved plan and the packet closeout. No production behavior changes here. A defect a test exposes is fixed in the phase that owns the code.

**Dependencies**:
- Phases 001 to 004 complete
- `fixtures/subtrack-tree.mjs` (`buildSubtrackTree` at line 68) and the temp-repo pattern at the top of `archive-track.vitest.ts`

**Deliverables**:
- Five vitest suites: relocate, suggest-subtracks, archive numbering, include-archive search and recursive archive validation
- A baseline and a final `npm test` run with the delta reported
- The real-tree checks from the approved plan
- A filled `implementation-summary.md` in each child and a passing strict recursive validation
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The behavior that phases 001 to 004 add has no automated coverage. Neither `relocate.vitest.ts` nor `suggest-subtracks.vitest.ts` exists, and `create-root-numbering.vitest.ts` has no archive case before phase 003. A relocation engine that rewrites many stores across `specs/` cannot be trusted on a manual check alone.

### Purpose
Each new behavior has a suite that fails when the behavior breaks, the full test run shows no regression against a captured baseline, and the packet closes with evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts .skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts
ls: .skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts: No such file or directory
ls: .skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts: No such file or directory
$ grep -c "z_archive" .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write `relocate.vitest.ts` covering move, renumber, re-parent, refusals, idempotence and inbound references.
- Write `suggest-subtracks.vitest.ts` covering the cluster map, the threshold and the present-time fit.
- Write suites for archive numbering, include-archive search and recursive archive validation.
- Run `npm test` against the baseline and report the delta.
- Run the real-tree checks from the approved plan and close the packet per the completion rule.

### Out of Scope
- New production behavior - phases 001 to 004 own it.
- A test per branch of the new tools - a test is added when it fails for one real reason no other test catches.
- Fixing the known `ai-systems` drift that `sweep-track-roots.mjs` reports in the main working tree - the parent spec excludes it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Create | Move, renumber, re-parent, refusals, idempotence, inbound references. Built with 11 cases, 12 since the empty-map case of commit `36b3a68ab7` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts` | Create | Cluster map, threshold, present-time fit. Built with 5 cases, 6 since the empty-track case of commit `36b3a68ab7` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-numbering.vitest.ts` | Create | Numbering beside an archive at specs root, track and subtrack depth. Built with 4 cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts` | Create | Default vector frozen, archive mode, `archived` label, JSON lane. Built with 6 cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-archive-recursive.vitest.ts` | Create | `--recursive --include-archive` at track, subtrack and phase depth. Built with 5 cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs` | Unchanged | Planned as a change only if a suite needed an archived packet in the built tree. None did |
| `00N-*/implementation-summary.md` in this packet | Modify | Filled at closeout, one per child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `tests/relocate.vitest.ts` passes and holds at least one case each for move, renumber, re-parent, a preflight refusal, a second run that writes nothing and an inbound reference rewrite |
| REQ-002 | `tests/suggest-subtracks.vitest.ts` passes and holds at least one case each for the whole-track map, the threshold and the present-time fit |
| REQ-003 | `tests/archive-numbering.vitest.ts` passes and proves that `create.sh` allocates a number above an archived one at specs root, track and subtrack depth |
| REQ-004 | `tests/rg-include-archive.vitest.ts` passes and proves that the default argument vector is unchanged and that `--include-archive` returns a hit labeled `archived` |
| REQ-005 | `tests/validate-archive-recursive.vitest.ts` passes and proves that `validate.sh --recursive --include-archive` reaches an archived packet at track, subtrack and phase depth and that the default run does not |
| REQ-006 | `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0, and its fail count is not above the baseline captured before the first edit of the packet. The delta is reported |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `relocate.mjs --map <sample>` passes as a dry run on the real tree, applies in a throwaway copy and reports nothing to do on the second run |
| REQ-008 | `suggest-subtracks.mjs` on a real flat track with more than eight packets emits a map that passes the `relocate.mjs` preflight |
| REQ-009 | `sweep-track-roots.mjs` exits 0 apart from the known `ai-systems` drift, and `generate-trigger-index.mjs --check` is clean |
| REQ-010 | `/speckit:search` with and without the archive mode behaves as specified on a phrase that lives only in `specs/sk-doc/z_archive/` |
| REQ-011 | `validate.sh <packet> --strict --recursive` prints `RESULT: PASSED` for the parent and all five children, with each child's `implementation-summary.md` filled |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/relocate.vitest.ts tests/suggest-subtracks.vitest.ts tests/archive-numbering.vitest.ts tests/rg-include-archive.vitest.ts tests/validate-archive-recursive.vitest.ts` exits 0.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` six times.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 004 complete | No behavior to test | This phase starts only after phase 004 hands off |
| Risk | A suite passes while asserting nothing | High: a green run that proves nothing | Watch each new case fail once, by breaking the behavior or the expectation, before accepting the pass |
| Risk | A suite runs `git mv` in the real repository | High: real packets move | Every suite builds its own temp repository, as `archive-track.vitest.ts` does |
| Risk | No baseline exists when the packet closes | Med: "no regressions" cannot be shown | Phase 001 task T003 captures it before the first edit. This phase reads that file |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The suites run in temp repositories and set no time limit beyond the vitest default.

### Security
- **NFR-S01**: No suite reads or writes outside its temp directory.

### Reliability
- **NFR-R01**: Each suite passes when run alone and when run in the full `npm test` order.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: one case each for an empty map and a track with no packets. Commit `36b3a68ab7` added "treats an empty map as nothing to do" to `relocate.vitest.ts` and "prints no map for a track that holds no packets" to `suggest-subtracks.vitest.ts`. Both pass, and CHK-022 in `tasks.md` is closed.
- Maximum input: N/A. The suites use small built trees and do not load-test.
- Failure path: each preflight refusal asserts exit 2 and an unchanged tree.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Five new test files and the closeout docs |
| Risk | 8/25 | Tests only, all in temp repositories |
| Research | 4/20 | The fixture and the temp-repo pattern exist |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The approved plan lists the suites by subject and does not name the files. This spec names them `relocate`, `suggest-subtracks`, `archive-numbering`, `rg-include-archive` and `validate-archive-recursive`, each with the `.vitest.ts` suffix.
- Phase 003 adds one archive case to `create-root-numbering.vitest.ts`. The archive numbering suite here covers the specs root and subtrack depths that case does not. Decision needed only if the operator prefers one file.
- Decided by the operator: REQ-008 names a real flat track with more than eight packets. None exists, and the largest, `cli-classifier`, holds 6. The check passed on a 10-packet fixture track `demo` in a throwaway clone, as in phase 002. The operator answered "Accept the fixture (Recommended)", recorded as Q003 and ADR-001 in `decision-record.md`, and `acceptance-criteria.md` AC-008 is `Superseded` by ADR-001.
- Answered: the trigger index was regenerated and committed as `f1cfed3d20`, and `generate-trigger-index.mjs --check` then exited 0 with 0 untrusted docs. REQ-009 is met and AC-009 is `Met`.
- Answered: in `relocate.vitest.ts` the temp repository runs the real `relocate.mjs`, `refresh-track-roots.mjs` and `lib/track-roots.mjs`. The other follow-up tools are stubs there, so the full chain is covered only by the clone run of REQ-007.
- Answered: REQ-010 was checked by running `rg-wrapper.mjs` directly. It is the wrapper `/speckit:search` documents. The slash command itself was not run.
- Observation, left alone: the build worker noted that the "deeper than one sub-track" message in `checkDestinationShape` of `relocate.mjs` looks unreachable, because an earlier check refuses first. No case fails on it.
<!-- /ANCHOR:questions -->

---
