---
title: "Tasks: Closing the Review Advisories and the Codex Hook Cleanup"
description: "Task Format: T### [P?] Description (file path). One task per finding, each closed by a verifier PASS the orchestrator confirmed."
trigger_phrases:
  - "review advisories tasks"
  - "codex hook cleanup tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Closing the Review Advisories and the Codex Hook Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm each advisory in code with file and line, and record the result in scope (`spec.md` §3)
- [x] T002 Record the suite baselines at `05231a01ea`: advisor 959 passed and 6 skipped, deep-loop 2701 passed and 8 skipped, spec-kit hook subset 236 passed and 7 skipped, Pi dispatch 50, plugin 31, pi-cache-optimizer 116
- [x] T003 Back up `~/.codex/hooks.json` and `~/.codex/config.toml` before any write (`evidence/c1/installer-and-trust-run.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 C1: run the removal-only installer against `~/.codex/hooks.json`, 18 repository copies removed (`evidence/c1/installer-run.json`)
- [x] T005 C1: restore trust for the nodeterm, orca and GitKraken SessionStart hooks with the hashes Codex reports (`evidence/c1/config-trust-diff.txt`)
- [x] T006 [P] F003: take outcome event runtimes from `ADVISOR_RUNTIME_VALUES` (`runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-validate.ts`, `runtime/skill-advisor-cli-manifest.ts`). Verified: the new runtime test fails against base
- [x] T007 F001: delete `shouldTrySkillAdvisorCliFallback` (`hooks/lib/skill-advisor-cli-fallback.ts`). Verified: the hunk holds only removed lines, no reference remains outside spec history and the hook tests pass 125 of 125
- [x] T008 R2-P2-001: add `--json -` to the CLI and send the fallback payload over stdin (`runtime/skill-advisor-cli.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`). Verified: 147 tests pass, both new tests fail against base, and the source CLI answers stdin `[1]` with exit 64
- [x] T009 [P] N2: send the plugin request over stdin (`.opencode/plugins/system-skill-advisor.js`). Verified: plugin tests 35 of 35, the new argv test fails against base
- [x] T010 [P] N4: read the compiled-route prompt from stdin and skip an older front door (`.skilled/bin/compiled-route.cjs`, `runtime/handlers/advisor-recommend.ts`). Verified: front-door tests 30 of 30, argv and stdin routes identical, both new tests fail against base
- [x] T011 [P] F004: create the metrics directory at `0o700` and each log at `0o600` (`runtime/lib/metrics.ts`). Verified: a fresh directory is `0o700` and each log `0o600`, and all three tests fail against base
- [x] T012 [P] F002, R2-P2-002: clamp the operator hook budget to the shim's kill deadline (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`)
- [x] T013 [P] R1-P2-002: correct the Pi dedup comment and name the older build that still produces a headless brief (`hooks/pi/prompt-advisor.ts`)
- [x] T014 [P] R1-P1-001, R3-P2-001: correct the `edit_lines` comment and pin the `line_hashes` opt-in (`.pi/extensions/pi-cache-optimizer/index.ts`)
- [x] T015 N3: refuse a non-empty `line_hashes` list that does not cover the range (`.pi/extensions/pi-cache-optimizer/index.ts`)
- [x] T016 F005, N1: honor `stop_policy` in review confirm and both research workflows (`.skilled/commands/deep/assets/`). Verified: review confirm matches review auto, research `3a` sits beside step 3, and the parity tests fail on each pre-fix file
- [x] T017 R3-P2-002, R1-P2-003: move the close-out into `synthesis-closeout.cjs` and fold review lineage logs (`system-deep-loop/runtime/scripts/`, `.skilled/commands/deep/assets/`). Verified: 11 fixture pairs give the old program's event and exit code, 115 tests pass and the lineage test fails against base
- [x] T018 Describe the stdin transports in the hook reference, the CLI and recommend feature entries and `.skilled/bin/README.md`. Verified: every claim traced to code, the plugin smoke command returns `status: "ok"` and each of the seven docs keeps 0 validator issues. One overbroad sentence was corrected and passed a second review
- [x] T025 [P] N5: send at most the 10,000 prompt characters `advisor_recommend` accepts from the hook producer, the CLI fallback and the plugin (`runtime/lib/skill-advisor-brief.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `.opencode/plugins/system-skill-advisor.js`). Verified: 243 tests pass, both new tests fail against base and the pre-fix CLI exits 64 on a 10,001-character prompt
- [x] T026 N2 follow-up: clamp the plugin request by its escaped size, send nothing when the budget holds no prompt character and drop the uncalled `clampPrompt` (`.opencode/plugins/system-skill-advisor.js`). Verified: 1,000 random prompts and budgets with no failure, three new tests fail against the pre-change plugin, and ordinary requests are byte-identical
- [x] T027 F004 follow-up: retry a failed `chmod` on the next write instead of remembering it as done (`runtime/lib/metrics.ts`). Verified: the retry test fails only against the pre-fix file
- [x] T028 N6: restore the quality-guard body of the research confirm convergence step and hold each confirm algorithm to its auto twin (`.skilled/commands/deep/assets/deep-research-confirm.yaml`). Verified: the parity census never listed the gap, and the new parity test fails only on the pre-fix confirm file
- [x] T029 N7: send at most 10,000 UTF-16 code units from the Python CLI's native call (`runtime/scripts/skill_advisor.py`, `runtime/tests/python/test_skill_advisor.py`). Verified: the Python suite passes 59 of 59, the new test fails against base and against a plain character slice, and both live long prompts route natively
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Regenerate the compiled `deep/review` and `deep/research` contracts. Regenerated after the last workflow edit, and `render-command-contract.vitest.ts` passes 32 of 32
- [x] T020 Rebuild the advisor and spec-kit dists. `dist-freshness.cjs` reports every watched dist fresh, and the advisor dist carries each daemon-side fix
- [x] T021 Rerun every suite and compare against the T002 baselines. Every suite exits 0 and none lost a test (Verification in `implementation-summary.md`)
- [x] T022 Live `codex exec`: 9 SessionStart, 5 UserPromptSubmit and 6 Stop hooks complete, one advisor record per prompt. Rerun at the final state with the same counts, and `--check` prints OK (`evidence/final-state/live-codex-hook-counts.txt`)
- [x] T023 Live stdin check: `--json -` through the bin shim returns the same recommendation as `--json '<object>'`, and no advisor child carries the prompt in argv. Both forms return the same three skills, and 142 process-table polls found the prompt in no argv (`evidence/final-state/live-checks.txt`)
- [x] T024 `validate.sh --strict --recursive` prints `RESULT: PASSED` for the parent packet. All 11 folders pass with 0 errors and 0 warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every behavior change has a test that fails against `05231a01ea`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
