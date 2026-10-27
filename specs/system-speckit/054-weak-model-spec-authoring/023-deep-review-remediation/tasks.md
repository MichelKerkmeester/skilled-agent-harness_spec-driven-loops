---
title: "Tasks: Phase 23: deep-review-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: deep-review-remediation

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

`R` is `.skilled/skills/system-spec-kit/runtime`. `T` is `$R/cli/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Merge the two lineages and adjudicate every P1 against the code (`../review/review-report.md`). Verify: `fanout-merge.cjs` printed `"active_p0":0,"active_p1":4`, and the report keeps 2 P1 after adjudication.
- [x] T002 Scaffold this phase and add map and transition rows to the parent (`../spec.md`). Verify: `ls ../023-deep-review-remediation` lists the six docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Close a token-gated fence only on its own marker, in both scanners (`$R/lib/validation/orchestrator.ts`, `$R/cli/rules/check-placeholders.sh`). Verify: before the fix, `placeholder-token-gate.vitest.ts` printed `Tests 8 failed | 56 passed (64)`; after it, the file passes.
- [x] T004 [P] Strip a CRLF carriage return in the awk scanner and match only space or tab around a fence, as TS does. Verify: without the strip line, the CRLF rows print `2 failed`; with it they pass.
- [x] T005 [P] Snapshot only the `.md` and `.json` files the repair writes, by sha256 (`orchestrator.ts`). Verify: `draft-auto-repair.vitest.ts` passes.
- [x] T006 [P] Rewrite the shell rule's header, and remove the dead Draft-token branch in the shell and TS legacy paths. Verify: `rg -n 'CLARIFICATION_MARKER_RE' $R/lib/validation/orchestrator.ts` prints nothing.
- [x] T007 [P] Resolve an existing `--path` target before the containment checks, keep the name as given, and refuse the repository root (`$R/cli/spec/create.sh`). Verify: `create-path-containment.vitest.ts` passes, and its escape case failed before the fix with `expected +0 not to be +0`.
- [x] T008 [P] Record a disposition for each phase 020 audit finding (`../020-alignment-audit-fixes/scratch/audit/findings.json`). Verify: a `node -e` count prints `46 {"fixed":46}`.
- [x] T009 Correct the docs and records: `validation-rules.md`, the three `/speckit:*` docs, phase 010 REQ-001, phase 021's commit state, and the parent goal and spec. Verify: `rg -n 'calls now include' .skilled/commands/speckit` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Review the code diff with a fresh Opus medium reviewer and fix what it confirms. Verify: its P1 (CRLF) and P2s 2 to 8 are fixed with tests.
- [x] T011 Rerun the build and the full spec-kit suite. Verify: `npm run build` exits 0 and `npx vitest run` prints 0 failed files.
- [x] T012 Validate the packet. Verify: `validate.sh specs/system-speckit/054-weak-model-spec-authoring --strict --recursive` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `../review/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md: three lanes that share no file.
- [x] CHK-003 [P1] Dependencies identified: the runtime build, rebuilt before each test run.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` passes on `create.sh` and `check-placeholders.sh`, and `npm run build` exits 0.
- [x] CHK-011 [P0] No new warning: the build prints no TypeScript error after the unused regex was removed.
- [x] CHK-012 [P1] Error handling: a dangling link, a regular file and the repository root each exit non-zero with their own message.
- [x] CHK-013 [P1] Comments carry the reason and no packet, phase or finding id; the reviewer checked this.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met.
- [x] CHK-021 [P0] Manual check: two v2.3-or-later docs in `specs/` carry a token and a fence, both inside packet 054, so the recursive run covers every verdict the fence change can move.
- [x] CHK-022 [P1] Edge cases tested: CRLF, a non-breaking space after a closer, an unclosed fence, four backticks, a closer with text after it.
- [x] CHK-023 [P1] Error scenarios: dangling link, regular file, repository root, outside symlink.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: SOL-002 and SOL-003 `class-of-bug`, the records `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers: both placeholder scanners changed together; `--track` is a separate, deliberate design.
- [x] CHK-FIX-003 [P0] Consumers: the post-edit scan uses the awk helper and is covered by `post-edit-placeholder-scan.vitest.ts`; `create.sh` callers get the same path back.
- [x] CHK-FIX-004 [P0] Path and parser tests cover outside-root, no-op (new folder), the root itself, and delimiter variants.
- [x] CHK-FIX-005 [P1] Matrix: fence shape (9 rows) by stamp (v2.3, v2.2) by status (Draft, Complete).
- [x] CHK-FIX-006 [P1] Hostile environment: the path test sets `TMPDIR` to the repository, so only `/tmp` stays allowed, and the sandbox avoids `/tmp`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the explicit diff range from `558570a83e`, the tip the review read, to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff adds none.
- [x] CHK-031 [P0] Input validation: `--path` is judged by its real target before any write.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same eleven findings.
- [x] CHK-041 [P1] Code comments say why a fence closes only on its own marker and why the name comes from the path as given.
- [x] CHK-042 [P2] README: N/A, no README describes these internals.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stayed in the session scratchpad.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
