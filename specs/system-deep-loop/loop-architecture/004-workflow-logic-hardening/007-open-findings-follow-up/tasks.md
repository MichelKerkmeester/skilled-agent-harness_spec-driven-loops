---
title: "Tasks: Phase 7: open-findings-follow-up"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "open findings follow up tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: open-findings-follow-up

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `O` is `.skilled/skills/cli-external-orchestration/cli-opencode`. `H` is this folder. Run every command from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the six measured behaviors before any change (`$H/spec.md`). Verify: `rg -c 'EAGAIN|stale|38 of the 42|v2.3.0|0.816434|0.690073' $H/spec.md` prints 6. Evidence: the measured-behavior block in `spec.md` holds all six.
- [x] T002 Take the phase 006 Final values as the baseline for every gate this phase reruns (`../006-ai-council-mode-deprecation/scratch/gate-baseline.md`). Verify: `rg -c '^\| (corpus-score|advisor-golden-prompts|advisor-parity-ratchets|advisor-drift-and-parity|runtime-vitest|advisor-vitest|speckit-cli-vitest) ' ../006-ai-council-mode-deprecation/scratch/gate-baseline.md` prints 7. Evidence: the Final column of `gate-baseline.md` is the baseline below, with advisor-vitest 1708 passed, runtime-vitest 2904 passed and corpus-score 117/195.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Write a test that runs `convergence.cjs` with a socketpair and with a never-closed pipe on stdin, and watch it fail on the current bootstrap (`$R/tests/integration/bootstrap-stdin.vitest.ts`). Verify: before T004 the test fails, logged in `goal.md`. Evidence: on the old bootstrap 4 of 5 cases failed with `EAGAIN` at `node:fs:1005`, logged in `goal.md`.
- [x] T004 Let the TSX child inherit stdin in the four bootstrapped scripts (`$R/scripts/{convergence,query,status,upsert}.cjs`). Verify: `rg -n 'input: process.stdin.isTTY' $R/scripts` prints nothing, the T003 test passes, and `echo '{}' | node $R/scripts/upsert.cjs` still reads its stdin argument path as before. Evidence: `rg` prints nothing, the test passes 5/5 and its `upsert --events -` control still reads stdin and rejects `not json` with exit 3.
- [x] T005 Make the top-level build run the runtime prepare and finalize steps around the compile (`.skilled/skills/system-spec-kit/package.json`). Verify: after a whitespace edit to a watched source and `npm --prefix .skilled/skills/system-spec-kit run build`, `validate.sh $H --strict` prints no `stale` line. Evidence: a whitespace edit to `generated-metadata-integrity.ts` and one to `runtime/package.json`, each followed by the top-level build, both validate PASSED. A second cause was fixed too: `test-dist-freshness.sh` deleted the real freshness records and now backs them up and restores them.
- [x] T006 Recompute the coverage sentence from the command tree (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `rg -n '38 of the 42' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints nothing and every command the sentence names exists. Evidence: the sentence names `/prompt:improve`, `/local-skilled-alignment` and `/speckit:handoff`, all three exist, and the tree holds 45 commands with 42 covered.
- [x] T007 Verify the documented `opencode run` flags on OpenCode 2.3.0 and update the verified-version lines (`$O/SKILL.md`). Verify: every flag the skill documents for `opencode run` appears in `opencode run --help`, and `rg -n 'Verified against OpenCode 2.3.0|verified against OpenCode 2.3.0' $O/SKILL.md` prints at least 1 line. Evidence: every SKILL.md flag absent from `opencode run --help` on 2.3.0 is labelled OpenCode 1, belongs to another tool, or is the hidden `--dangerously-skip-permissions` that 2.3.0 accepts. The docs now use `opencode auth` and `opencode debug agents`, which replace the missing `providers` and `agent` subcommands. The skill is 1.5.11.0 with a changelog.
- [x] T008 Pin the two prompts in the golden prompt test and watch both fail (`$A/tests/routing-golden-prompts.vitest.ts`). Verify: before T009 the two new cases fail, logged in `goal.md`. Evidence: `golden-deeploop-review-branch` failed with #1 `sk-git` and `golden-council-compare-review` with #1 `sk-code`, 2 failed and 37 passed.
- [x] T009 Change the advisor so both prompts reach their targets (`$A/lib/scorer/`). Verify: the T008 cases pass, and `advisor_recommend` ranks `system-deep-loop` first for "deep review this branch" and `command-speckit-ai-council` first for "what is an ai council and how does it compare to a review". Evidence: two `PHRASE_BOOSTS` entries in `lanes/explicit.ts`. The live CLI ranks `system-deep-loop` first with `/deep:review` at 0.797 over `sk-code` at 0.733, and `command-speckit-ai-council` first with `/speckit:ai-council` at 0.597 over `sk-code` at 0.438. The Python scorer already ranked both right.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Rerun the advisor gates (`$A`). Verify: corpus-score, the scorer-eval ratchet, golden prompts, holdout-independent, local-native divergence, the drift and parity tests and `npm test` each end at or above their T002 value. Evidence: corpus-score identical to baseline (117/195, f1 0.9843, TT 114 FT 3 FF 1), ratchets 22 passed, golden 39 passed (was 37), drift and parity 14 passed, `npm test` 1710 passed (was 1708).
- [x] T011 Rerun the deep-loop runtime suite and typecheck (`$R`). Verify: `npm test` and `npm run typecheck` exit 0 with no new failure against T002. Evidence: `npm test` 2909 passed (was 2904) and typecheck exit 0.
- [x] T012 Rerun the spec-kit dist checks (`$K/tests/test-dist-freshness.sh`). Verify: it exits 0, and the spec-kit CLI suite ends with only the failure it had at T002. Evidence: `test-dist-freshness.sh` 4 passed, exit 0. The CLI suite ends with only `typo-flags` failing in a test. Two files hit a 10 second hook timeout in the full run while the machine load average was near 29, and both pass 10/10 run alone.
- [x] T013 Validate this folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`. Evidence: `validate.sh --strict` printed Errors: 0, Warnings: 0 and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `goal.md` names each finding fixed or not fixed with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



