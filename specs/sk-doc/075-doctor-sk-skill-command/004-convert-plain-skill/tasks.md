---
title: "Tasks: Phase 4: convert-plain-skill"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert plain skill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: convert-plain-skill

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

`DOC` is `.skilled/commands/doctor`. `FX` is `DOC/scripts/tests/fixtures/sk-skill-convert`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add a plain skill fixture and a dropped-line variant with invented names (`FX/`). Verify: the resolver prints `none` on the plain fixture. Evidence: resolver command printed `none` for `plain/before/SKILL.md`.
- [x] T002 Confirm phase 003 closed (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `node --test` on it exits 0. Evidence: the final conversion suite passed 47/47, including phase 003 cases.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 V1 stage: copy under the frontmatter name with an exclusive create, refuse an existing folder (`DOC/scripts/sk-skill-convert.cjs`). Verify: the outside source is byte-identical after a run. Evidence: end-to-end tree hashes match; the existing-target test preserves its sentinel.
- [x] T004 V3(a) router render with one intent and the harvested `RESOURCE_MAP` in body order (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: the plan prints the map. Evidence: plan and router both list `references/field-notes.md` for PRIMARY.
- [x] T005 V4 `preserve --snapshot <dir>` (`DOC/scripts/sk-skill-convert.cjs`). Verify: the dropped-line fixture exits non-zero and names the lost line. Evidence: pass prints `Preservation PASS`; dropped fixture reports `Read the field notes before choosing a review path`, removes the staged copy, leaves the outside source hash unchanged and keeps the snapshot beside the backup.
- [x] T006 [P] V5 resource-doc frontmatter and kebab rename with link rewrite (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: the plan lists each rename file by file. Evidence: `references/Field Notes.md` is listed, becomes `references/field-notes.md`, and links are rewritten.
- [x] T007 V6 metadata from a temp `init_skill.py` run, copying only absent files, with at least 8 approved phrases (`DOC/scripts/sk-skill-convert.cjs`). Verify: 7 phrases stop the plan with `INTENT_SIGNALS_BELOW_FLOOR`. Evidence: 7 phrases are refused; 8 complete apply; the temp scaffold is removed and existing files survive.
- [x] T008 V7 and V8: root-metadata `--fix`, derived `--write`, then the strict and package validators (`DOC/scripts/sk-skill-convert.cjs`). Verify: a forced V8 failure stops before integration. Evidence: valid apply passes both generators and gates; invalid RULES shape stops at `STRICT_PACKAGE_FAILED` before `validate_skill_package.py` runs.
- [x] T009 `allowed-tools` proposal with no default (`DOC/scripts/sk-skill-convert.cjs`). Verify: the plan proposes `[Read, Grep, Glob]`, plus `Bash` only when `scripts/` exists. Evidence: tests verify both proposals and apply refuses without an explicit `--allowed-tool` value or one `--allowed-tools` list.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the suite (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `node --test` on it exits 0. Evidence: 47 tests passed, 0 failed, after the final change to the failure path. The check suite passes 54 and the integration suite 23.
- [x] T011 Run the gates on the converted plain fixture (`FX/`). Verify: `package_skill.py --check --strict` prints `Result: PASS` and `ci-skill-root-metadata.cjs --skill <fixture>` exits 0. Evidence: a scratch-area run of the shipped converter produced `Result: PASS` (exit 0), `OK [S] brindle-lantern` (exit 0), `Preservation PASS: 7 original body line(s) found.` (exit 0) and `INTENT_SIGNALS_BELOW_FLOOR` on 7 phrases (exit 1).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001–T011 are complete.
- [x] No `[B]` blocked tasks remaining. Evidence: none are marked blocked.
- [x] Manual verification passed. Evidence: the shipped converter ran end to end in a scratch skills root, and both format gates plus `preserve` were spawned there as separate processes.
- [x] Plain fixture passes both gates and `preserve`; dropped-line fixture fails `preserve`. Evidence: end-to-end and preservation cases in the conversion suite.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 2.2 steps V1, V3(a), V4 to V8 and section 4 R4 to R7
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 through REQ-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: ordered V1, V3(a), V4–V8 flow and test strategy.
- [x] CHK-003 [P1] Fixtures in place. Evidence: invented plain source, reshaped after-copy and dropped-line copy under `FX/plain/`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on both scripts. Evidence: both converter files pass syntax checks.
- [x] CHK-011 [P0] Transforms read and write no file. Evidence: transforms are pure text functions; unit tests exercise returned values.
- [x] CHK-012 [P1] A failed run stops at its gate and leaves no half-converted root. Evidence: forced strict-package failure prevents the second validator; a dropped body line stops at V4 with the staged copy removed and the snapshot kept.
- [x] CHK-013 [P1] Scaffold copy never replaces an existing file. Evidence: end-to-end fixture preserves `operator-note.txt` while adding scaffold files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 through AC-007 are Met.
- [x] CHK-021 [P0] Dropped-line fixture fails `preserve`. Evidence: output names the missing field-notes line, and no scaffolder, generator or validator runs after it.
- [x] CHK-022 [P1] Phrase floor tested at 7 and 8. Evidence: 7 is refused; 8 phrases complete the end-to-end apply.
- [x] CHK-023 [P1] Outside source unchanged after a run. Evidence: source tree hashes match before and after apply.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] T012 Refuse a symlinked source tree before staging (`DOC/scripts/sk-skill-convert.cjs`). Verify: `SOURCE_SYMLINK` exits 1 and the outside file is byte-identical. Evidence: the symlink case compares the outside bytes after both the plan and the apply.
- [x] T013 Keep hash lines inside fences and compare line kinds (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: `bodyLinesToPreserve` keeps a fenced `#` comment and the preserve cases fail when prose moves into a fence or a comment. Evidence: the fence case and the line-kind case.
- [x] T014 Rewrite every link form and refuse a stale old name (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`, `DOC/scripts/sk-skill-convert.cjs`, `FX/plain/after/SKILL.md`). Verify: `RESOURCE_LINK_STALE` exits 1 on a staged tree naming an old path, and the committed after-copy names none. Evidence: the link-form unit case, the stale-tree case and the fixture case.
- [x] T015 Compare link targets verbatim, subtract source reference lines and match like line kinds (`DOC/scripts/sk-skill-convert.cjs`, `DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: a repointed link, a dropped line that also sits in a reference, and a prose line moved into a fence each fail `preserve`. Evidence: the three preservation cases.
- [x] T016 Run the plain check through `pythonExecutable(context)` (`DOC/scripts/sk-skill-convert.cjs`, `DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: a wrapper interpreter logs the check call. Evidence: the interpreter case; the suite no longer spawns `/usr/bin/python3`.
- [x] T017 Accept `--description-trim` and `--allowed-tools` on both paths (`DOC/scripts/sk-skill-convert.cjs`, `DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: each field change prints as its own plan line, the backup holds the original text, and the undo restores it. Evidence: the approved-trim and approved-tools cases; without the flags the existing `DESCRIPTION_TOO_LONG` and `ALLOWED_TOOLS_MISSING` refusals stay.
- [x] T018 Plan the integration rows and apply them after the format gate (`DOC/scripts/sk-skill-convert.cjs`). Verify: a temp-repo convert ends with strict PASS, root-metadata exit 0, the Hermes `--check` PASS, `skill-graph-freshness.cjs --strict` exit 0 and a resolving changelog link. Evidence: the end-to-end case asserts all five from one run, and a failed strict gate never reaches the rows.
- [x] T019 Record the real suite counts and re-point the acceptance rows (`tasks.md`, `plan.md`, `implementation-summary.md`, `acceptance-criteria.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: 47 conversion, 54 check and 23 integration tests pass; every Met row cites a line that holds it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: changed source and fixtures reviewed; fixtures use invented names and no credentials.
- [x] CHK-031 [P0] `allowed-tools` never written without operator confirmation. Evidence: apply refuses without approved `--allowed-tool` values and leaves no target.
- [x] CHK-032 [P1] Renames stay inside the staged skill folder. Evidence: plan names staged source/destination; test observes the rename under the temp target.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: each records the same V1, V3(a), V4–V8 scope and results.
- [x] CHK-041 [P1] Comments state why each step exists, not a ticket id. Evidence: added code contains no packet or task labels in comments.
- [x] CHK-042 [P2] Script README entry deferred to phase 007. Evidence: README integration is explicitly out of scope for this phase.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp scaffold output removed after V6. Evidence: test captures the `init_skill.py --path` directory and confirms it is absent after apply.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no phase-local scratch files were created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
