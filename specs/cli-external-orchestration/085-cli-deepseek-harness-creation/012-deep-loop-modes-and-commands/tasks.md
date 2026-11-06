---
title: "Tasks: Phase 12: deep-loop-modes-and-commands"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop modes and commands tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: deep-loop-modes-and-commands

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

`DL` is `.skilled/skills/system-deep-loop/`. `DA` is `.skilled/commands/deep/assets/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the kind exists in the runtime (`DL/runtime/lib/deep-loop/executor-config.ts`). Verify: `rg -c cli-deepseek-harness` on it prints at least 1. Evidence: `evidence/rerun-checks.txt` (prints 9).
- [ ] T002 Capture the phase 006 unit suite baseline (`DL/runtime/tests/unit/`). Verify: the pre-edit vitest output is saved in `scratch/`. Open: no pre-edit suite transcript was saved. This closeout did not rerun the deep-loop suites per dispatch; see `evidence/checks.txt:21` and `evidence/sandbox-test-disposition.txt:1` and `:4`.
- [x] T003 [P] Check whether `DL/deep-research/SKILL.md` and the confirm YAMLs enumerate executors. Verify: `rg -n 'cli-hermes'` on each prints the lines to mirror, or nothing. Evidence: `evidence/rerun-checks.txt`. Both print nothing. The SKILL does name executors in prose at lines 86 to 97, which is recorded under Known Limitations.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 List the executor in both protocols (`DL/deep-research/references/protocol/loop-protocol.md`, `DL/deep-review/references/protocol/loop-protocol.md`). sk-doc, orchestrating Claude session. Verify: `rg -l cli-deepseek-harness` lists both. Evidence: `evidence/rg-l-nine-files.txt`. The wording is `(experimental)` only, see CHK-041.
- [x] T005 Add the kind to the executor rosters (`DL/deep-review/SKILL.md` plus `DL/deep-research/SKILL.md` if T003 found a roster). sk-doc, orchestrating Claude session. Verify: `rg -l cli-deepseek-harness` lists them. Evidence: `evidence/rg-l-nine-files.txt`. `deep-research/SKILL.md` was not edited because T003 found no `cli-hermes` roster. The deep-review kind sits in its NEVER list.
- [x] T006 Add the shared-builder branch note (`DA/deep-research-auto.yaml`, `DA/deep-review-auto.yaml`). sk-code `sk-code-skilled`, executor cli-codex. Verify: both files parse as YAML and match `cli-deepseek-harness`. Evidence: `evidence/compile-dry-run-compare.txt` (both load as one document each) and `evidence/rg-deepseek-lines.txt`.
- [x] T007 [P] Add the kind to the confirm variants where T003 found an enumeration (`DA/deep-research-confirm.yaml`, `DA/deep-review-confirm.yaml`). sk-code, executor cli-codex. Verify: `rg -c cli-deepseek-harness` matches the `cli-hermes` count. Evidence: `evidence/rerun-checks.txt`. Neither confirm YAML names `cli-hermes` or the kind, so both counts are zero and there was no enumeration to extend.
- [x] T008 [P] Add the executor choice (`DA/deep-research-presentation.txt`, `DA/deep-review-presentation.txt`). sk-code, executor cli-codex. Verify: `rg -n cli-deepseek-harness` prints one choice line per file. Evidence: `evidence/rg-deepseek-lines.txt`, where each presentation file has one `I) cli-deepseek-harness (experimental, explicit choice only)` line.
- [x] T009 Write the council seat decision record in this phase folder, weighing seat diversity against an unproven route. sk-doc, orchestrating Claude session. Verify: the record names the chosen and rejected option. Evidence: `decision-record.md` ADR-001, chosen "no seat", rejected "admit a seat now".
- [x] T010 If T009 admits a seat, update the council skill, `orchestrate-session.cjs`, its vitest, `seat-diversity-patterns.md` and the council YAML (`DL/deep-ai-council/`). Not triggered: ADR-001 admits no seat, so the condition is false (`decision-record.md:79`; `evidence/rerun-checks.txt:31`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Regenerate the compiled contracts (`DL/runtime/scripts/compile-command-contracts.cjs`). Verify: a second run leaves `git diff --exit-code DA/compiled/` at exit 0. Evidence: `evidence/compile-dry-run-compare.txt`. The second compile is byte-identical to the on-disk contracts. `git diff` against HEAD cannot exit 0 before commit, so the byte comparison stands in for it.
- [x] T012 Rerun the phase 006 unit suites (`executor-config`, `fanout-run`, `combo-matrix`, `executor-audit`). Saved evidence records 356/356 passing; the sandbox disposition records two environment-dependent assertions and 242/242 passing across those two files outside the sandbox. This closeout did not rerun them, per dispatch. Evidence: `evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4`.
- [x] T013 Run the Measured Behavior `rg -l` command again. Verify: it lists every Section 3 research and review file. Evidence: `evidence/rg-l-nine-files.txt` (nine files).
- [x] T014 Validate this phase folder. Verify: strict validation prints `RESULT: PASSED` with no warnings (`evidence/closeout-validation.txt:51`, `evidence/closeout-validation.txt:53`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (open: T002; no pre-edit suite transcript was saved).
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (`evidence/rg-deepseek-lines.txt` shows the presentation choice lines)
- [x] The council decision record exists and `compiled/` shows zero diff after regeneration (`evidence/compile-dry-run-compare.txt`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/research.md` Section 12 question Q13 and Section 15
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

A `[B]` task records its blocker and the phase it waits on in the task line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies are present; saved suite evidence records 356/356 passing and documents the sandbox disposition (`evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4`). T002 remains open because no pre-edit transcript was saved.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both auto YAMLs parse after the edit (`evidence/compile-dry-run-compare.txt`)
- [x] CHK-011 [P0] No compiled contract section is edited by hand, shown by zero diff after regeneration (`evidence/compile-dry-run-compare.txt`)
- [x] CHK-012 [P1] The kind is never set as a default executor; both auto YAMLs say "experimental, never a default", and `executor: native` stays the default (`evidence/rerun-checks.txt:11`).
- [x] CHK-013 [P1] New lines copy the shape of the existing `cli-hermes` lines. The `H) cli-hermes` and `I) cli-deepseek-harness` lines in each presentation list share one form (`evidence/rg-deepseek-lines.txt`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] Saved suite evidence records 356/356 passing; the sandbox disposition explains the two nested-sandbox assertions and records 242/242 passing in those files outside the sandbox (`evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4`). No suites were rerun in this closeout.
- [ ] CHK-022 [P1] The council suite passes when a seat is admitted. Open: ADR-001 admits no seat, so the conditional test was not run (`decision-record.md:79`).
- [x] CHK-023 [P1] A second regeneration run reproduces both contracts byte for byte (`evidence/compile-dry-run-compare.txt:1`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n -i 'api_?key' DA` finds no key value (`evidence/rerun-checks.txt:16`).
- [x] CHK-031 [P0] The kind is not offered as a default before phase 013 proves a route (`evidence/rg-deepseek-lines.txt:1`, `evidence/rg-deepseek-lines.txt:4`).
- [ ] CHK-032 [P1] N/A for auth. Open: the phase adds no authentication surface, so no auth check was run.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks describe the same phase scope and proof (`spec.md`, `plan.md`, `tasks.md`).
- [ ] CHK-041 [P1] Protocol and SKILL rosters match the presentation lists. Open: protocol and deep-review wording is weaker than the presentation lists, and the deep-research SKILL's stale seven count is out of scope (`evidence/rerun-checks.txt:9`, `evidence/rerun-checks.txt:13`).
- [x] CHK-042 [P2] The compiled README needs no change; it lists contracts, not executors (`evidence/rerun-checks.txt:15`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline logs live in `scratch/` only. Open: the check outputs are under `evidence/`, as the dispatch requested.
- [x] CHK-051 [P1] `scratch/` is clean; it contains only `.gitkeep` (`scratch/.gitkeep`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 6/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. Strict validation passed with 0 warnings (`evidence/closeout-validation.txt:51`, `:53`). The deep-loop suites were not rerun in this closeout. Open P1 items: CHK-022, CHK-032, CHK-041 and CHK-050.
<!-- /ANCHOR:summary -->

---
