---
title: "Tasks: Phase 1: skill-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: skill-readmes

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

`$S` is the scratchpad folder `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/337e2d66-377c-4a62-99f7-86910ae24591/scratchpad`. `$R` is `.skilled/skills/*/README.md`. Every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the per-file baseline (`$S/baseline-001.tsv`). Verify: `bash $S/baseline.sh $R` prints 14 lines, `hard=` summing to 20 across the 13 tracked files.
- [x] T002 Record the link baseline (`$S/links-001-before.txt`). Verify: `python3 $S/readme_links.py . $R` prints `0 problems`.
- [x] T003 Confirm the content tests pass before any edit (`test_readme_verdict_parity.py`). Verify: it prints `PARITY PASS`, the registry count vitest prints `1 passed` and `check-documentation-drift.cjs` exits 0.
  - Before numbers for the wider gates, taken on `831a368561a` before any edit. `run-script-tests.sh` exits 1 with 55 files passing and 2 failing, and both failures were on main before this phase. `test_readme_manifest.py` fails because `.pi/types` gained a README without a manifest refresh. `install-guide-contract.test.cjs` fails because `sk-doc/hub-router.json:252` carries "install guide" again.
  - `parent-skill-check.cjs .skilled/skills/<hub>` exits 0 with 0 FAIL and 0 WARN for all seven hubs: cli-classifier 50 PASS, cli-external-orchestration 55, mcp-tooling 57, sk-code 55, sk-doc 62, system-deep-loop 53 and sk-design 51.
  - `check-markdown-links.cjs` exits 0 with `7802 files, 14949 links checked, 0 broken`.
  - `check_readme_references.py` exits 0 on the sk-git README (`references=75 unresolved=0`) and the spec-kit README (`references=327 unresolved=0`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Batch A: rewrite the spec-kit README (`.skilled/skills/system-spec-kit/README.md`). Verify: `bash $S/baseline.sh` on it prints `✅ VALID` and `hard=0`, and `rg -c '42-rule registry'` on it prints at least 1. Evidence: `✅ VALID issues=0 hard=0`, ceiling 99, and the registry phrase is present (registry vitest `1 passed`).
- [x] T005 [P] Batch B: rewrite the sk-git and skill advisor READMEs (`.skilled/skills/sk-git/README.md`, `.skilled/skills/system-skill-advisor/README.md`). Verify: `bash $S/baseline.sh` on both prints `✅ VALID` and `hard=0`. Evidence: both print `✅ VALID issues=0 hard=0`.
- [x] T006 [P] Batch C: rewrite the sk-doc, sk-prompt and sk-code READMEs (`.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-prompt/README.md`, `.skilled/skills/sk-code/README.md`). Verify: `bash $S/baseline.sh` on the three prints `✅ VALID` and `hard=0`. Evidence: all three print `✅ VALID issues=0 hard=0`.
- [x] T007 [P] Batch D: rewrite the code mode, MCP tooling, CLI orchestration and classifier READMEs (`.skilled/skills/mcp-code-mode/README.md` and three more). Verify: `bash $S/baseline.sh` on the four prints `✅ VALID` and `hard=0`. Evidence: all four print `✅ VALID issues=0 hard=0`.
- [x] T008 [P] Batch E: rewrite the doctor, deep-loop and Orca READMEs and write the sk-design one (`.skilled/skills/sk-design/README.md` and three more). Verify: `bash $S/baseline.sh` on the four prints `✅ VALID` and `hard=0`, and the drift check exits 0. Evidence: all four print `✅ VALID issues=0 hard=0`, and the drift check exits 0.
- [x] T009 Review each batch with an agent that did not write it (`implementation-summary.md`). Verify: every finding is recorded as applied or rejected with a reason, one line per README. Evidence: the Fact checks row in `implementation-summary.md` lists claims checked and findings applied or rejected per README.
- [x] T010 Rebuild the verdict entries for the changed READMEs (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `git diff --stat` on it touches only skill README entries, and the parity test prints `PARITY PASS`. Evidence: the rebuild adds `sk-design` and `.pi/types`, and the parity test prints `PARITY PASS` over 1246 READMEs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the full baseline on all 14 files (`$S/baseline-001-after.tsv`). Verify: every line prints `✅ VALID` and `hard=0`, and no ceiling is lower than its baseline. Evidence: 14 of 14 lines print `✅ VALID issues=0 hard=0 emojiH=0`, ceilings 97 to 100, none below baseline.
- [x] T012 Rerun the link check (`$S/links-001-after.txt`). Verify: `python3 $S/readme_links.py . $R` prints `0 problems`. Evidence: `217 outbound and 1 inbound anchored links across 14 files, 0 problems`.
- [x] T013 Rerun the three content tests (`test_readme_verdict_parity.py`). Verify: `PARITY PASS`, `1 passed` for the registry count vitest and exit 0 for the drift check. Evidence: `PARITY PASS`, registry vitest `1 passed`, drift exit 0, `run-script-tests.sh` exit 0, `check-markdown-links.cjs` 0 broken.
  - Rerun the wider gates after `git add` of the changed READMEs, because the parity and manifest tests list READMEs with `git ls-files`. Rebuild the manifest with `test_readme_manifest.py --write` first and check its diff adds only `.skilled/skills/sk-design` and the already missing `.pi/types`.
  - Verify: `run-script-tests.sh` fails on nothing but `install-guide-contract.test.cjs`, every hub check still exits 0 with 0 FAIL and 0 WARN, `check-markdown-links.cjs` prints `0 broken` and `check_readme_references.py` prints `unresolved=0` for the sk-git and spec-kit READMEs.
- [x] T014 Record before and after numbers and close the packet docs (`implementation-summary.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`. Evidence: the Verification section holds the before and after numbers.
- [ ] T015 Commit, merge origin/main and push under sk-git (`git log -1`). Verify: `git rev-parse HEAD origin/main` prints the same hash twice.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every reviewer finding is applied or rejected with a reason
- [ ] The phase commit is on origin/main
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

A blocked task is marked `[B]` with the failing command and its output beside it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The baseline, link check and three content tests ran before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` prints `VALID` for all 14 READMEs (14 of 14 `✅ VALID`)
- [x] CHK-011 [P0] `hvr_scan.py` reports `hard blockers: 0` for all 14 READMEs (14 of 14 `hard=0`)
- [x] CHK-012 [P1] No heading carries an emoji: the emoji count column prints 0 for all 14 (`emojiH=0` on all 14)
- [x] CHK-013 [P1] Each README follows the template's section model, checked per file (AC-001 structure check)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see `acceptance-criteria.md`)
- [x] CHK-021 [P0] The parity test, the registry count test and the drift check pass (`PARITY PASS`, `1 passed`, drift exit 0)
- [x] CHK-022 [P1] `readme_links.py` prints `0 problems` (`0 problems`)
- [x] CHK-023 [P1] Every reviewer finding is applied or rejected with a reason (Fact checks row in `implementation-summary.md`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No README shows a secret, token or private path: `rg -n -i 'token|secret|api[_-]key' $R` hits only prose about those features (13 hits, all prose about token features)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 14 files (all three name `.skilled/skills/*/README.md`)
- [x] CHK-041 [P1] `implementation-summary.md` records the before and after numbers (Verification section)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the scratchpad, never in the repository (check scripts live in the session scratchpad)
- [ ] CHK-051 [P1] `git status --short` after the commit shows only the operator's three files
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 8/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
