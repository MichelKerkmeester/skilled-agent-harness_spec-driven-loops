---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Shell variables used below**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. `P` is `specs/zz-bench-authoring/001-recommend-level-quiet-flag`. Every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument parser and the output selector in `recommend-level.sh` and record both line ranges (`$S`). Verify: `rg -n 'JSON_OUTPUT|output_text\(\)' "$S"` prints the selector at line 770 and the renderer definition.
- [ ] T002 Confirm the untouched script parses, so a later failure is attributable to this change (`$S`). Verify: `bash -n "$S"` exits 0 and prints nothing.
- [ ] T003 Capture the current default output for the Level 3 input (`$P/scratch/baseline-level3.txt`). Verify: `bash "$S" --loc 500 --files 15 --auth --api --db --architectural > "$P/scratch/baseline-level3.txt"` then `wc -l < "$P/scratch/baseline-level3.txt"` prints 17.
- [ ] T004 [P] Capture the current default output for the Level 0 input (`$P/scratch/baseline-level0.txt`). Verify: `bash "$S" --loc 50 --files 2 > "$P/scratch/baseline-level0.txt"` then `wc -l < "$P/scratch/baseline-level0.txt"` prints 16.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET_OUTPUT=false` to the globals block, beside `JSON_OUTPUT` (`$S`). Verify: `rg -n 'QUIET_OUTPUT=false' "$S"` prints one line.
- [ ] T006 Add the `--quiet)` arm to the argument parser, setting `QUIET_OUTPUT=true` and shifting one token (`$S`). Verify: `rg -n -- '--quiet\)' "$S"` prints one line in the parser.
- [ ] T007 Add the quiet branch to the output selector, after the `--json` branch, printing `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` (`$S`). Verify: `bash "$S" --quiet --loc 50 --files 2` prints `Recommended Level: 0 (Quick)` and nothing else.
- [ ] T008 Add `--quiet` to the `show_help()` OPTIONS block with a one-line description (`$S`). Verify: `bash "$S" --help | rg -n -- '--quiet'` prints one line.
- [ ] T009 Add `--quiet` to the usage header comment's OPTIONS list (`$S`). Verify: `sed -n '14,30p' "$S" | rg -n -- '--quiet'` prints one line.
- [ ] T010 Confirm `--json` wins when both output flags are passed (`$S`). Verify: `bash "$S" --quiet --json --loc 100 --files 3 | head -1` prints `{`.
- [ ] T018 Implement REQ-011: write the quiet line to stdout and leave fd 2 untouched, so every warning the script emits still reaches stderr under `--quiet` (`$S`). Verify: `bash "$S" --quiet --loc abc --files 2 1>"$P/scratch/quiet-out.txt" 2>"$P/scratch/quiet-err.txt"` leaves `quiet-out.txt` empty and `quiet-err.txt` holding the `ERROR:` line, and `rg -n 'QUIET_OUTPUT' "$S"` shows no `2>` or `exec 2>` redirect on the quiet path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Diff the default output against both captured baselines (`$S`, `$P/scratch/`). Verify: `diff "$P/scratch/baseline-level3.txt" <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural)` prints nothing, and the same holds for the Level 0 input.
- [ ] T012 Count the quiet output for both inputs (`$S`). Verify: `bash "$S" --quiet --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints 1, and the Level 0 input also prints 1.
- [ ] T013 Compare the quiet line against the level line inside the default report for both inputs (`$S`). Verify: the quiet line equals `sed -n '2p'` of the default report in both cases.
- [ ] T014 Check the flag composes with phase options (`$S`). Verify: `bash "$S" --quiet --no-recommend-phases --phase-threshold 40 --loc 500 --files 15 --architectural` prints `Recommended Level: 3 (Full)`.
- [ ] T015 Check the error paths (`$S`). Verify: `bash "$S" --quiet` exits 1 with `ERROR: At least --loc or --files must be provided` on stderr and no stdout, and `bash "$S" --quie --loc 50` exits 1 with `ERROR: Unknown option: --quie`.
- [ ] T016 [P] Run the phase-system regression suite (`$P`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` prints `Result: passed=27 failed=0`.
- [ ] T017 Clean the captured baselines from `scratch/` (`$P/scratch/`). Verify: `ls "$P/scratch/"` lists `.gitkeep` only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: ADR-001 lives in `plan.md` section L3: ARCHITECTURE DECISION RECORD; this packet authors no separate `decision-record.md`.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' "$P/spec.md"` prints 10.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n 'ADR-001' "$P/plan.md"` prints the decision heading.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` and `node --version` both exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses. Verify: `bash -n "$S"` exits 0 with no output.
- [ ] CHK-011 [P0] The new branch quotes both variables it interpolates. Verify: `rg -n 'Recommended Level: \$\{RECOMMENDED_LEVEL\} \(\$\{LEVEL_NAME\}\)' "$S"` prints the quiet branch.
- [ ] CHK-012 [P1] The default path never enters the quiet branch. Verify: `bash "$S" --loc 50 --files 2 | wc -l` prints 16.
- [ ] CHK-013 [P1] The new parser arm mirrors the existing `case`/`shift` shape. Verify: `rg -n -A2 -- '--quiet\)' "$S"` shows `QUIET_OUTPUT=true` then `shift`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row in `acceptance-criteria.md` reads `Met` with evidence.
- [ ] CHK-021 [P0] The output-mode matrix is complete. Verify: all eight rows of output mode times phase mode were run for both inputs.
- [ ] CHK-022 [P1] Edge cases tested. Verify: T015 covers no input, unknown option and flag position.
- [ ] CHK-023 [P1] Error scenarios validated. Verify: the two T015 commands exit 1 with a stderr message and empty stdout.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/` prints one producer line.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Verify: `rg -n 'recommend-level' .skilled/skills/system-spec-kit --glob '*.js' --glob '*.sh'` lists the test file and no other executable consumer.
- [ ] CHK-FIX-004 [P0] Parser changes carry adversarial cases. Verify: flag first, flag last, flag repeated, flag adjacent to another flag, and an unknown option are all exercised in T010 and T015.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `plan.md` names the two axes and the eight required rows.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Verify: `env -i bash "$S" --quiet --loc 50 --files 2` prints the same one line, proving the script reads no inherited variable.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Verify: the verification rows cite the commit that touched `recommend-level.sh`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'password|secret|api_key|token' "$S"` returns no match.
- [ ] CHK-031 [P0] Input validation preserved. Verify: `bash "$S" --quiet --loc abc --files 2` exits 1 with `ERROR: --loc must be a positive integer`.
- [ ] CHK-032 [P1] Auth/authz not applicable. Verify: the script is a local CLI that reads no identity and opens no socket; `rg -n 'curl|ssh|http' "$S"` returns no match.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: all three name `--quiet` and the same `--json` precedence rule.
- [ ] CHK-041 [P1] Code comments adequate. Verify: the header OPTIONS list and `show_help()` both describe the flag, and the new arm adds no narration.
- [ ] CHK-042 [P2] README updated if applicable. Verify: `runtime/cli/spec/README.md` lists scripts, not per-script flags, so no edit is required.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `git status --short` shows no new file outside `$P/scratch/`.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `ls "$P/scratch/"` lists `.gitkeep` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 21 | 0/21 |
| P2 Items | 8 | 0/8 |

**Verification Date**: 2026-10-26 (checklist authored; no item is verified while the packet is Draft)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented. Verify: ADR-001 is present in `plan.md` under L3: ARCHITECTURE DECISION RECORD.
- [ ] CHK-101 [P1] All ADRs have status. Verify: ADR-001 carries `Status: Proposed` or `Status: Accepted`.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Verify: ADR-001 lists two rejected options with a reason each.
- [ ] CHK-103 [P2] Migration path documented if applicable. Verify: N/A - the flag is additive and no caller is forced to change.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time target met. Verify: NFR-P01 holds because the scoring path is untouched; time both modes and confirm they are within noise.
- [ ] CHK-111 [P1] Throughput target met. Verify: N/A - the script is a one-shot CLI with no throughput target.
- [ ] CHK-112 [P2] Load testing completed. Verify: N/A - no service, no concurrency.
- [ ] CHK-113 [P2] Performance benchmarks documented. Verify: the two-mode timing comparison is recorded in the verification row.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed. Verify: CHK-030 and CHK-031 pass.
- [ ] CHK-131 [P1] Dependency licenses compatible. Verify: no dependency is added, so `git diff` shows no manifest change.
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed. Verify: N/A - the change touches no input surface beyond an existing flag parser.
- [ ] CHK-133 [P2] Data handling compliant with requirements. Verify: N/A - the script stores and transmits nothing.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized. Verify: `validate.sh --strict` reports no cross-document contradiction.
- [ ] CHK-141 [P1] API documentation complete if applicable. Verify: `show_help()` is the API surface for this script and it lists `--quiet`.
- [ ] CHK-142 [P2] User-facing documentation updated. Verify: the header comment and `show_help()` are the user-facing text; both name the flag.
- [ ] CHK-143 [P2] Knowledge transfer documented. Verify: ADR-001 records why the branch sits in the selector.
<!-- /ANCHOR:docs-verify -->

---
