---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Ordered tasks for the quiet flag: capture baselines, add the helper and renderer, then prove both output shapes. Every task names a file and a command whose output settles it."
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: command prints expected output`, for example `T003 [P] Confirm the script parses before any edit ($S). Verify: bash -n "$S" exits 0`.

**Shell variables used below**: `S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `P=specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the output functions, the globals block and the parser case for `--json` (`$S`). Verify: `rg -n 'output_text|output_json|--json' "$S"` prints the two renderers and the parser case.
- [ ] T002 Capture three pre-change baselines into `$P/scratch/baseline/` (`$S`). Verify: `wc -l` reads 16 for `--loc 500 --files 15`, 17 for `--loc 500 --files 15 --auth --api --db --architectural` and 12 for `--loc 500 --files 15 --no-recommend-phases`.
- [ ] T003 [P] Confirm the script parses before any edit (`$S`). Verify: `bash -n "$S"` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` to the globals block beside `JSON_OUTPUT` (`$S`). Verify: `rg -n 'QUIET=false' "$S"` prints one line.
- [ ] T005 Add the `--quiet` case to the argument parser with its own `shift` (`$S`). Verify: `rg -n -- '--quiet\)' "$S"` prints one line.
- [ ] T006 Extract `format_level_line()` and call it from `output_text` in place of the inline `echo` (`$S`). Verify: `diff` against the T002 default baseline exits 0.
- [ ] T007 Add `output_quiet()` and dispatch it from section 7, after the `JSON_OUTPUT` branch (`$S`). Verify: `--quiet` prints 1 line and `--quiet --json` prints the same 36-line JSON document as `--json`.
- [ ] T008 List `--quiet` in the header comment block and in the `--help` text (`$S`). Verify: `rg -n -- '--quiet' "$S"` names both sites.
- [ ] T009 Document that `--quiet` governs stdout only, so errors still reach stderr (`$S`). Verify: `--quiet` with no inputs writes nothing to stdout and exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the three quiet invocations and compare each line to the default report's level line (`$S`). Verify: `--quiet` prints exactly `Recommended Level: 0 (Quick)`, `Recommended Level: 2 (Verification)` and `Recommended Level: 3 (Full)`.
- [ ] T011 Run the three default invocations and diff them against the T002 baselines (`$S`). Verify: each `diff` exits 0.
- [ ] T012 Exercise the error paths under `--quiet` (`$S`). Verify: `--quiet` alone and `--loc --quiet` each exit 1 with a stderr message and no stdout.
- [ ] T013 Run the packet validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Both output shapes are proven: one line for `--quiet`, and a byte-identical default report against three baselines
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c 'REQ-00' spec.md` reads 5.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n 'output_quiet' plan.md` names the renderer and its dispatch.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` reports 3.2 or newer.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script still parses. Verify: `bash -n "$S"` exits 0.
- [ ] CHK-011 [P0] The success path writes nothing to stderr. Verify: `bash "$S" --loc 500 --files 15 --quiet 2>&1 >/dev/null` prints nothing.
- [ ] CHK-012 [P1] Error handling is unchanged. Verify: `bash "$S" --quiet` exits 1 and prints `ERROR: At least --loc or --files must be provided` on stderr.
- [ ] CHK-013 [P1] The change follows the script's section layout: globals, helpers, output functions, parser, dispatch. Verify: `rg -n 'output_quiet|format_level_line' "$S"` shows both defined in section 4 and called in sections 4 and 7.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `--quiet` prints one line and exits 0. Verify: `bash "$S" --loc 500 --files 15 --quiet | wc -l` prints `1`.
- [ ] CHK-021 [P0] The default report is byte-identical to the pre-change capture. Verify: `diff` against `scratch/baseline/` exits 0 for all three captures.
- [ ] CHK-022 [P1] Quiet and default agree on the level for three input shapes. Verify: the quiet line equals the second line of the default report in each case.
- [ ] CHK-023 [P1] `--quiet --json` still emits valid JSON. Verify: `bash "$S" --loc 500 --files 15 --json --quiet | node -e 'JSON.parse(require("fs").readFileSync(0,"utf8"))'` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed before the helper is extracted. Verify: `rg -n 'Recommended Level:' "$S"` lists every site that renders the label, and no inline copy remains outside `format_level_line` afterwards.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed script. Verify: `rg -n 'recommend-level' .skilled/skills/system-spec-kit --glob '*.sh' --glob '*.md'` names every caller the flag could affect.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion. Verify: three input shapes crossed with three output modes gives nine rows, of which the six text rows are asserted.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'password|token|secret' "$S"` prints nothing.
- [ ] CHK-031 [P0] Input validation still runs before scoring. Verify: `bash "$S" --loc abc --files 1 --quiet` exits 1 with `ERROR: --loc must be a positive integer`.
- [ ] CHK-032 [P1] N/A - the script has no authentication or authorization surface, so there is nothing to test.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and on `--json` precedence. Verify: `rg -n 'json.*wins|wins.*json' spec.md plan.md` finds the decision in both.
- [ ] CHK-041 [P1] The header comment block and the `--help` text both document `--quiet`. Verify: `rg -n -- '--quiet' "$S"` names both sites.
- [ ] CHK-042 [P2] N/A - no README in the repository lists this script's options; the `--help` text is the user-facing contract.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in scratch/ only. Verify: `git status --short` lists no new file outside `specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/` and the one script.
- [ ] CHK-051 [P1] scratch/ is cleaned before completion. Verify: `ls scratch/baseline` is empty or the folder is removed after the diffs are recorded.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 19 | 0/19 |
| P2 Items | 4 | 0/4 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 are followed by T006 and T007. Verify: `rg -n 'output_quiet|JSON_OUTPUT' "$S"` shows the renderer and the JSON-first dispatch.
- [ ] CHK-101 [P1] Every ADR carries a status. Verify: `rg -n '^\*\*Status\*\*' plan.md` prints `Accepted` for both records.
- [ ] CHK-102 [P1] Alternatives are documented with a rejection rationale. Verify: `rg -n 'Alternatives Rejected' plan.md` prints two sections, each with a reason.
- [ ] CHK-103 [P2] Migration path: N/A - the change migrates no data and no API surface.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds. Verify: `time bash "$S" --loc 500 --files 15 --quiet` is not slower than the same run without `--quiet`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is documented and exercisable. Verify: reverting the one commit removes `--quiet` and the parser then exits 1 with `ERROR: Unknown option: --quiet`.
- [ ] CHK-121 [P1] N/A - the packet ships no service and no deploy step; the script is used from the working tree.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review: the flag adds no input parsing, no file access and no network call. Verify: `rg -n -- '--quiet' "$S"` shows a boolean assignment and a renderer call only.
- [ ] CHK-131 [P1] Dependency licenses: no dependency is added. Verify: `git diff --stat` names one file.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents are synchronized. Verify: `rg -n -- '--quiet' spec.md plan.md tasks.md acceptance-criteria.md` names the same flag in all four.
- [ ] CHK-141 [P1] API documentation: N/A - this is a CLI, and the `--help` text is its contract.
- [ ] CHK-142 [P2] User-facing documentation updated. Verify: `bash "$S" --help` lists `--quiet` in the OPTIONS block.
- [ ] CHK-143 [P2] Knowledge transfer documented. Verify: ADR-001 and ADR-002 in plan.md carry the reasoning a later editor needs.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

N/A - this packet has no named human approver. The dispatch that commissioned it fixed the level and the scope, and that record lives in the packet metadata rather than in a signature row.

<!-- /ANCHOR:sign-off -->
