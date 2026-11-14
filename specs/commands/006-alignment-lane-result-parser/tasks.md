---
title: "Tasks: Recover the last findings object from alignment lane output"
description: "Ordered failing-first test, private runner change and verification tasks for the alignment lane parser packet."
trigger_phrases:
  - "alignment lane result parser tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Recover the last findings object from alignment lane output

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `R` is `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs`. `T` is `.skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the private folder resolves through the worktree symlink. Verify: `ls -ld .skilled/commands/assets/local-skilled-alignment` prints a symbolic link to the source folder.
- [ ] T002 Confirm the source folder is ignored and the backup exists. Verify: `git -C /Users/michelkerkmeester/MEGA/Development/Skilled check-ignore -v .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` prints `.gitignore:247`.
- [ ] T003 Read the parser, its one caller and the stub. Verify: `rg -n "findFindingsObject|STUB_MODE|writeStubBinary" R T` prints the definition, the call at line 411 and the stub branches.
- [ ] T004 Run the current owning test file to capture its baseline. Verify: `node --test T` exits 0 before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add a `raw` mode to `writeStubBinary` in `T` that writes `process.env.STUB_STDOUT` unchanged to stdout and exits 0. Verify: `rg -n "STUB_STDOUT" T` prints the new branch.
- [ ] T006 Add the prose-brace lane case to `T` with the transcript from `plan.md` and assert `lanes/A.json` is `{"lane":"A","findings":[{"id":"L1"}]}` with no `A.error.txt`. Verify: `node --test T` fails this case today with the reason `no JSON object with findings`.
- [ ] T007 Add the nested-object lane case to `T` and assert `lanes/A.json` keeps `lane` A and its own finding. Verify: `node --test T` fails this case today because the nested `findings` array is written.
- [ ] T008 Add the pretty-printed critic case to `T` using `--critic` and assert `critic.json` is the multi-line finding object. Verify: `node --test T` fails this case today with `no JSON object with findings`.
- [ ] T009 Replace the scan in `findFindingsObject` at `R` with `matchObjectEnd` plus the per-brace candidate loop, then keep the last top-level candidate and prefer a nonempty `lane` when `options.expectLane` is true. Verify: `node --test T` passes the prose-brace and nested-object cases.
- [ ] T010 Pass `{ expectLane: state.id !== 'critic' }` from `finalizeLane` at `R`. Verify: `node --test T` passes the lane preference case and the critic case.
- [ ] T011 Add a no-match assertion to the new stub path and confirm the error reason and stale JSON removal. Verify: the no-match assertion passes with `no JSON object with findings`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the owning test file. Verify: `node --test T` exits 0 and its summary reports 0 failures.
- [ ] T013 Confirm the private source is still ignored after the edit. Verify: `git -C /Users/michelkerkmeester/MEGA/Development/Skilled status --porcelain .skilled/commands/assets/local-skilled-alignment` prints no tracked change.
- [ ] T014 Run strict packet validation. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `node --test T` exits 0 and the strict validator prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` names the private path and the ignore rule. Verify: `rg -n "git-ignored|gitignore:247|symbolic link" spec.md` prints each term.
- [ ] CHK-002 [P0] `plan.md` names the helper, the caller option and the three transcripts. Verify: `rg -n "matchObjectEnd|expectLane|pretty-printed" plan.md` prints each term.
- [ ] CHK-003 [P1] Node and `node:test` are available. Verify: `node --version` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `R` parses as CommonJS. Verify: `node --check R` exits 0.
- [ ] CHK-011 [P0] `T` parses. Verify: `node --check T` exits 0.
- [ ] CHK-012 [P0] The parser has one call site. Verify: `rg -c "findFindingsObject\\(" R` prints 1.
- [ ] CHK-013 [P1] No code comment names a spec path, packet id or REQ id. Verify: `rg -n "006-alignment|REQ-00|T00" R T` prints no line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Prose with a brace and quote no longer hides the lane object. Verify: the prose-brace case passes.
- [ ] CHK-021 [P0] A later nested findings object does not replace the lane object. Verify: the nested-object case passes.
- [ ] CHK-022 [P0] A pretty-printed critic object is recovered. Verify: the critic case passes.
- [ ] CHK-023 [P0] No findings object still produces `no JSON object with findings`. Verify: the no-match assertion passes.
- [ ] CHK-024 [P1] The existing valid lane output still writes the same object. Verify: `writes a findings object for valid lane output` passes.
- [ ] CHK-025 [P1] The existing timeout and watchdog cases still pass. Verify: the owning test file exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Both findings name their class. The lost string state is `algorithmic`, the wrong-object choice is `cross-consumer`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory is complete. Verify: `rg -n "inString|findings =" R` after the change shows the new helper and candidate loop only.
- [ ] CHK-FIX-003 [P0] Consumer inventory covers `finalizeLane`, `lanes/A.json`, `critic.json`, the raw transcript and the owning tests.
- [ ] CHK-FIX-004 [P0] Parser cases cover prose delimiter, nested input, multi-line input, no-match and the existing valid input.
- [ ] CHK-FIX-005 [P1] Matrix axes and rows are listed in `plan.md` under Affected Surfaces.
- [ ] CHK-FIX-006 [P1] No process-wide state beyond the stub `STUB_STDOUT` variable is added.
- [ ] CHK-FIX-007 [P1] Evidence pins the failing behavior to `run-lanes.cjs:326-365` and line 411, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or secret is added. Verify: `rg -n "token|secret|password" R T` prints no new line.
- [ ] CHK-031 [P0] Candidate text is parsed with `JSON.parse` only. Verify: `rg -n "eval\\(|new Function" R` prints no line.
- [ ] CHK-032 [P1] No new network call or file path is introduced. Verify: `rg -n "http|fetch\\(" R` prints no line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` describe the same three cases. Verify: `rg -n "prose|nested|pretty" spec.md plan.md tasks.md` prints matching lines.
- [ ] CHK-041 [P1] The private code status and rollback are stated in the packet. Verify: `rg -n "backup copy|git-ignored" spec.md plan.md` prints both.
- [ ] CHK-042 [P2] No tracked README is changed. Verify: `git status --porcelain .skilled/commands/assets/local-skilled-alignment` prints no tracked change.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The test stays in the private tests folder. Verify: `ls .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` prints the path.
- [ ] CHK-051 [P1] No scratch file remains in the packet. Verify: `find specs/commands/006-alignment-lane-result-parser -name "*.tmp"` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->
