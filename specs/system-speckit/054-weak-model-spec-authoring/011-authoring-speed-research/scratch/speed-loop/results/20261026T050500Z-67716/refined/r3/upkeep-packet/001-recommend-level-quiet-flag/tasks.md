---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "quiet flag implementation tasks"
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Set these two variables before running any `Verify:` command:

```bash
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the pre-change stdout of three invocations into `$P/scratch/baseline/` (`$S`). Verify: `ls "$P"/scratch/baseline | wc -l` prints 3.
- [ ] T002 Read the argument loop, `output_text`, `output_json` and the output dispatch, and note the three insertion points (`$S`). Verify: `grep -c 'Recommended Level:' "$S"` prints 1.
- [ ] T003 [P] Confirm no caller passes `--quiet` today (`.skilled/commands`, `.skilled/skills`). Verify: `grep -rn 'recommend-level\.sh.*--quiet' .skilled/commands .skilled/skills --include=*.yaml --include=*.sh --include=*.json | wc -l` prints 0.
- [ ] T004 [P] Confirm the current script is lint-clean (`$S`). Verify: `shellcheck "$S"` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET_OUTPUT=false` beside `JSON_OUTPUT` (`$S`). Verify: `grep -c '^QUIET_OUTPUT=false$' "$S"` prints 1.
- [ ] T006 Add the `--quiet)` arm to the argument loop (`$S`). Verify: `bash "$S" --quiet --loc 50 --files 2` exits 0.
- [ ] T007 Add `output_quiet()` that prints only the `Recommended Level:` line (`$S`). Verify: `grep -c '^output_quiet()' "$S"` prints 1.
- [ ] T008 Dispatch JSON first, then quiet, then text (`$S`). Verify: `bash "$S" --quiet --loc 50 --files 2 | wc -l` prints 1.
- [ ] T009 Document `--quiet` and its `--json` precedence in `show_help` and the header OPTIONS block (`$S`). Verify: `bash "$S" --help | grep -c -- '--quiet'` prints 1.
- [ ] T016 Keep the quiet path from redirecting or closing stderr so a warning still reaches it, leaving stdout as the only trimmed stream (REQ-006) (`$S`). Verify: `grep -Ec -e '2>/dev/null' -e '&>-' "$S"` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Compare the quiet line with the default report's level line (`$P/scratch/`). Verify: `diff <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural | grep '^Recommended Level:') <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural --quiet)` prints nothing.
- [ ] T011 Re-capture the three default invocations into `$P/scratch/after/` and diff them against the baseline (`$P/scratch/`). Verify: `diff -r "$P"/scratch/baseline "$P"/scratch/after` prints nothing.
- [ ] T012 Verify `--json` precedence in both flag orders (`$S`). Verify: `bash "$S" --quiet --json --loc 50 --files 2 | jq -e .recommended_level` prints a number.
- [ ] T013 Verify error paths keep their exit code and message (`$S`). Verify: `bash "$S" --quiet` exits 1 and prints `At least --loc or --files` on stderr.
- [ ] T014 Run the static checks (`$S`). Verify: `bash -n "$S"` and `shellcheck "$S"` both exit 0.
- [ ] T015 Clean the scratch outputs and record the observed results in `implementation-summary.md` (`$P`). Verify: `ls "$P"/scratch` lists only `.gitkeep`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `plan.md` (ADR-001)
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

A row marked `N/A` is verified as not applicable and is ticked when that reason is true. A real row is ticked only after its `Verify:` command printed the stated output.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md`. Verify: `grep -c '^| REQ-' "$P/spec.md"` prints 5.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`. Verify: `grep -c '^### Step ' "$P/plan.md"` prints 4.
- [ ] CHK-003 [P1] Dependencies available. Verify: `bash --version | head -1` prints 3.2 or later.
- [ ] CHK-004 [P1] Pre-change baseline captured. Verify: `ls "$P"/scratch/baseline | wc -l` prints 3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Syntax check passes. Verify: `bash -n "$S"` exits 0.
- [ ] CHK-011 [P0] Lint check passes. Verify: `shellcheck "$S"` exits 0.
- [ ] CHK-012 [P1] Error paths unchanged: an invalid invocation without `--quiet` keeps its exit code and message. Verify: `bash "$S" --loc abc` exits 1 with `must be a positive integer`.
- [ ] CHK-013 [P1] The branch matches the file's shape: one global, one case arm, one output function. Verify: `grep -c 'QUIET_OUTPUT' "$S"` prints 3.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row in `acceptance-criteria.md` is `Met`.
- [ ] CHK-021 [P0] Quiet output is one line for the three representative invocations. Verify: `bash "$S" --quiet --loc 50 --files 2 | wc -l` prints 1.
- [ ] CHK-022 [P1] `--json` precedence verified in both flag orders. Verify: `bash "$S" --json --quiet --loc 50 --files 2 | jq -e .recommended_level` prints a number.
- [ ] CHK-023 [P1] Repeated and reordered `--quiet` verified. Verify: `bash "$S" --loc 50 --quiet --files 2 --quiet | wc -l` prints 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A: no finding drives this packet, so finding classes and adversarial tables do not apply.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: every producer of the level label is named. Verify: `grep -c 'Recommended Level:' "$S"` prints 1 and the quiet branch reuses that literal.
- [ ] CHK-FIX-003 [P0] Consumer inventory: every caller of the script is named. Verify: `grep -rln 'recommend-level\.sh' .skilled/commands | wc -l` prints 3, and all three files appear in the surface table in `plan.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets added. Verify: `git diff -- "$S"` adds no credential, token or key literal.
- [ ] CHK-031 [P0] Input validation unchanged. Verify: `bash "$S" --quiet --loc abc --files 2` exits 1 with `must be a positive integer`.
- [x] CHK-032 [P1] N/A: the script has no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on `--quiet` and on the `--json` precedence. Verify: `grep -l -- '--quiet' "$P"/spec.md "$P"/plan.md "$P"/tasks.md "$P"/acceptance-criteria.md | wc -l` prints 4.
- [ ] CHK-041 [P1] The script header and `--help` describe the flag. Verify: `bash "$S" --help | grep -c -- '--quiet'` prints 1.
- [x] CHK-042 [P2] N/A: no README documents this script's individual flags; `--help` is the flag contract.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp outputs live in `scratch/` only. Verify: `git status --porcelain --untracked-files=all "$S" "$P"` lists only the script and files under the packet.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion. Verify: `ls "$P"/scratch` lists only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 2/14 |
| P1 Items | 20 | 6/20 |
| P2 Items | 8 | 6/8 |

The two verified P0 rows, the six verified P1 rows and the six verified P2 rows are the `N/A` rows, whose reason is stated inline. Every other row is open because the feature is planned, not implemented.

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is recorded in `plan.md`. Verify: `grep -c '^### ADR-001:' "$P/plan.md"` prints 1.
- [ ] CHK-101 [P1] ADR-001 carries a status. Verify: `grep -c '^\*\*Status\*\*: Accepted' "$P/plan.md"` prints 1.
- [ ] CHK-102 [P1] Alternatives carry rejection reasons. Verify: `sed -n '/Alternatives Rejected/,/^---/p' "$P/plan.md" | grep -c '^\- '` prints 2.
- [x] CHK-103 [P2] N/A: the change is additive, so no migration path exists.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] N/A: the packet makes no performance claim; the flag adds one branch and one line of output.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented. Verify: `grep -c 'Procedure\*\*: Revert the single commit' "$P/plan.md"` prints 1.
- [x] CHK-121 [P0] N/A: `--quiet` is opt-in per invocation; there is no runtime flag to configure.
- [x] CHK-122 [P1] N/A: no service is deployed, so there is nothing to monitor.
- [x] CHK-123 [P1] N/A: no runbook is needed; the script is invoked directly.
- [x] CHK-124 [P2] N/A: no deployment step exists.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] N/A: no security surface changes; the script reads no credential.
- [ ] CHK-131 [P1] No dependency license change. Verify: `git diff --stat -- "$S"` shows one file and no manifest.
- [x] CHK-132 [P2] N/A: no web surface, so OWASP does not apply.
- [x] CHK-133 [P2] N/A: the change handles no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents are synchronized. Verify: `grep -c -- '--quiet' "$P"/spec.md "$P"/plan.md "$P"/tasks.md "$P"/acceptance-criteria.md` prints a non-zero count for each file.
- [x] CHK-141 [P1] N/A: the script exposes no API documentation surface.
- [ ] CHK-142 [P2] User-facing documentation updated. Verify: `bash "$S" --help | grep -c -- '--quiet'` prints 1.
- [x] CHK-143 [P2] N/A: no knowledge transfer is needed beyond this packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Pending | |
| Operator | Product Owner | [ ] Pending | |
| Operator | QA Lead | [ ] Pending | |
<!-- /ANCHOR:sign-off -->
