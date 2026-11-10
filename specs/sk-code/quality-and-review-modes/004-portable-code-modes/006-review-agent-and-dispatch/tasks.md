---
title: "Tasks: Review agent and dispatch"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review agent and dispatch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Review agent and dispatch

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

`R` is `.skilled/skills/sk-code/sk-code-review`. `C` is `bash R/scripts/tests/check-rule-copies.test.sh`. `D` is `node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs`. The `HEAD` tree is `git archive HEAD` of the files a suite reads, unpacked into the session scratchpad, with the new tests and fixtures copied in.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the canary suite and the mirror gates. Verify: `C` printed 89 `PASS`, `All rule-canary test cases passed`; `check-agent-mirror-sync.cjs` printed `11 agent(s) checked`, `all mirrors in sync`, `OK`, exit 0; both generators `--check` printed `PASS: 11 agents are in sync.`
- [x] T002 Baseline the speckit contract tests. Verify: `speckit-goal-offer-contract.test.cjs` `pass 5`; `test-phase-command-workflows.js` `passed=148 failed=0`; `gate-3-menu-parity.test.mjs` `pass 17`; `yaml-intake-event-payloads.vitest.ts` 7 passed; `speckit-autopilot-contract.vitest.ts` 4 passed; `boolean-expr.test.ts` `All BooleanExpr test cases passed.`
- [x] T003 Find where CI runs the canary. Verify: `.github/workflows/rule-canary-sync.yml` runs `node "$CANARY"` with no flag, and `sk-code-script-tests.yml` runs the suite.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read the `Recommendation:` line in both checkers (`R/scripts/check-review-final-line.js`, `check-review-findings.js`, four fixtures). Verify: `C` cases `shape_final_line_recommendation_contradicts_status`, `shape_findings_recommendation_contradicts_findings`, `final_line_recommendation_legacy_block` and `findings_recommendation_p2_only` fail on the `HEAD` checkers and pass after.
- [x] T005 Validate the `Rule sources:` line when present (`R/scripts/check-review-final-line.js`). Verify: `C` cases `shape_final_line_rule_sources_malformed`, `final_line_rule_sources_group_missing` and `final_line_rule_sources_twice` fail on `HEAD` and pass after; `final_line_rule_sources_none` and `shape_final_line_rule_sources` pass both ways.
- [x] T006 Add `--mode-only` (`R/scripts/check-rule-copies.js`, its suite). Verify: the foreign-repository cases fail on the `HEAD` canary with `unknown option: --mode-only`, exit 2, and pass after; `node R/scripts/check-rule-copies.js --mode-only` from a scratch repository prints `OK: mode rule invariants present (7 exact-string file(s) ...)` and the `SKIPPED:` line, exit 0.
- [x] T007 Reword the marker floor and its pin, and make the integration sentence true (`R/SKILL.md` lines 69, 588 and 628, `R/README.md` line 61, the canary pin). Verify: canary `OK`, `6 extension floor(s)`.
- [x] T008 State the marker in both speckit review entries for a step that dispatches `@review`, with a comment that the entry dispatches nothing, and give their gate a severity verdict (`.skilled/commands/speckit/assets/speckit-implement.yaml`, `speckit-complete.yaml`). No dispatch is added, because `agent_availability` is not instructions. Verify: `D` cases one and two pass; PyYAML loads both files and reads `marker CODE-REVIEW`.
- [x] T009 Add the marker rule and the Quality Gate reading to `@orchestrate` (`.skilled/agents/orchestrate.md`). Verify: `D` cases three and four pass.
- [x] T010 Rewrite `@review` (`.skilled/agents/review.md`). Verify: `D` case five passes; `grep -n "threshold: 70\|< 10 cyclomatic\|No merge commits\|<500 lines\|Security issues are P0 by default\|Quality Gate Protocol\|APPROVE/REQUEST CHANGES/BLOCK" .skilled/agents/review.md` prints nothing.
- [x] T011 Give `@review` and `@deep-review` loaded-skill paths (`.skilled/agents/review.md`, `deep-review.md`). Verify: every remaining `.skilled/skills/` path in both files sits inside an "in this repository:" example.
- [x] T012 Regenerate the mirrors (`.claude` by its path rule, `.codex` and `.pi` by their generators, Hermes by its sync). Verify: `check-agent-mirror-sync.cjs --all` exit 0; both generators `--check` `PASS`; `agent-roster-mirror-check.cjs` `STATUS=OK`; `sync-skills-hermes.cjs --check` `PASS: 67 Hermes skill copies in sync`.
- [x] T013 Recompile the deep-review command contract (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
- [x] T014 Write the changelogs and step the carriers (sk-code-review v1.9.6.0, deep-review v1.11.9.0, system-spec-kit v2.12.14.0 above origin/main's v2.12.13.0, sk-code v3.9.12.0 for the shared export). Verify: `validate_document.py --json` `"total_issues": 0` for all four; `parent-skill-check.cjs` `OK`; the voice scan reports 0 hard blockers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Read the `Rule sources:` id grammar from the shared linter (`shared/scripts/check-rule-overrides.cjs` exports `RULE_ID`, `R/scripts/check-review-final-line.js` imports it, the foreign install copies the linter). Verify: `C` case `final_line_rule_sources_uppercase_id` fails on `HEAD` and passes after; shared suites `pass 18`; quality runner `tests 137 pass 137 fail 0`.
- [x] T021 Read a `Recommendation:` as a verdict only when its whole value is one status token or a legacy token followed by the end of the line or a comma, anywhere in the report. Verify: `C` cases `shape_*_recommendation_prose` pass and `shape_*_focused_file_recommendation` fail on `HEAD` and pass after.
- [x] T022 Apply the severity rules to the final status line in the findings checker. Verify: `C` cases `shape_findings_status_commented_open_p1` and `shape_findings_status_requested_changes_p2_only` fail on `HEAD` and pass after; the three `overall-contradicts-status*.md` fixtures now also fail the findings checker, which the suite never runs on them.
- [x] T023 Reword the `@review` P0 hint to the exploitability-plus-reach wording and regenerate its mirrors. Verify: the sentence appears once in each of the `.skilled`, `.claude`, `.codex`, `.pi` and Hermes copies; mirror gates pass.
- [x] T015 Rerun the canary suite from the final state and against the `HEAD` checkers. Verify: changed tree 125 `PASS`, exit 0; `HEAD` checkers 97 `PASS`, 28 `FAIL`, exit 1, every failure a new case.
- [x] T016 Rerun the dispatch contract test both ways. Verify: changed tree `pass 5`, `fail 0`; `HEAD` agents and YAMLs `pass 0`, `fail 5`, exit 1.
- [x] T017 Rerun the speckit, deep-loop and bin suites that read the touched files. Verify: the T002 counts unchanged; `deep-review-contract-parity.vitest.ts` with the intake suite 19 passed; deep-loop `check-contract-drift`, `compile-command-contracts`, `speckit-autopilot-contract`, marker-scan and fanout prompt suites 39 passed; `opencode-config-shape`, `opencode-compat-layout` and `typo-flags` `pass 36`, `fail 0`; `typo-flags.test.sh` `All typo-flag test cases passed`.
- [x] T018 Run the quality gate. Verify: `quality-gate.cjs --files` on the five code files and `--worktree` both print `NO_BLOCKER_FOUND` with every summary count 0, exit 0.
- [x] T019 Validate every changed doc. Verify: `validate_document.py --json` `"total_issues": 0` on the review SKILL.md, README.md, scripts/README.md, review-core.md and both stepped SKILL.md files; the three agent files report only the existing `## 0.` numbering warning; `frontmatter-version.mjs gate` exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The canary suite passes 125 of 125 and the dispatch contract test 5 of 5
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-009 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: child 005's resolver step and `Rule sources:` format are in this worktree's base commit, T001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` on the five code files prints `NO_BLOCKER_FOUND`, exit 0.
- [x] CHK-011 [P0] No new warnings in the test output.
- [x] CHK-012 [P1] Error handling: an unknown option still exits 2 with the usage line, which now names `--mode-only`, and a missing installed file under `--mode-only` reports `MISSING:` and exits 1.
- [x] CHK-013 [P1] Code follows the files' section headers and comment style, with no ephemeral labels in comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each new case fails before and passes after. Evidence: T015 and T016.
- [x] CHK-022 [P1] Edge cases: a template `Recommendation:` line and a prose Recommendation sub-line are not verdicts, a skip status is never compared with the findings, and `Rule sources: none` passes.
- [x] CHK-023 [P1] The foreign-repository cases build their repository under the suite's own temporary folder and remove it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, the agent, its dispatcher, the speckit review entries and the checkers that read its report.
- [x] CHK-FIX-002 [P0] Same-class producers: `@orchestrate` carries the dispatch rule, and both speckit review entries carry the same `dispatch_prompt` block, checked byte for byte by `D`.
- [x] CHK-FIX-003 [P0] Consumers: the deep-loop guards still match `^(DEEP-REVIEW|CODE-REVIEW)$` and `^(DEEP-RESEARCH|CODE-REVIEW)$`, and the marker-scan suites pass.
- [x] CHK-FIX-004 [P0] The verdict rule lives once, in `review.md` section 5, and the YAMLs state the same rule in their `verdict` line.
- [x] CHK-FIX-005 [P1] Matrix: the agent's PR shape, an older `BLOCK` token, a P2-only report and a template line through both checkers.
- [x] CHK-FIX-006 [P1] Process-wide state: none.
- [x] CHK-FIX-007 [P1] Evidence is against base `6615ae8dc7` plus the uncommitted diff in worktree `250-review-agent-and-dispatch`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate's secrets check ran clean.
- [x] CHK-031 [P0] A secret in the diff or history stays a floor finding whatever PR convention a repository declares. Evidence: `review.md` section 6.
- [x] CHK-032 [P1] No private skill is named in any tracked file this child wrote.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files.
- [x] CHK-041 [P1] Test and checker comments state why each case and rule exists.
- [x] CHK-042 [P2] Changelog entries written for sk-code-review, deep-review and system-spec-kit.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary output, the `HEAD` trees and the scratch repository lived in the session scratchpad.
- [x] CHK-051 [P1] No file was added under `scratch/` of this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
