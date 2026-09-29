---
title: "Tasks: Phase 19: advisor-suggested-order"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "suggested order tasks"
  - "score-suggested-order tasks"
  - "advisor child timing tasks"
  - "near-tie order verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: advisor-suggested-order

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

`S` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` and `T` is `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts`, both proposed. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the advisor `dist`, run the H1 ratchet and read 53/70, then record the advisor package's vitest pass and fail counts as the baseline (`.skilled/skills/system-skill-advisor/runtime/`)
- [ ] T002 Read the owner's contracts before writing: `score-jev-tiebreak.mjs` and its exports, `capture-scorer-eval-baseline.mjs:35-46`, `hooks/claude/user-prompt-submit.ts` around `handleClaudeUserPromptSubmit` (`:252`) and the shim `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22-24`, `:106-120`. Record what the hook writes when run under the capture env, and route the code write through sk-code's OpenCode route
- [ ] T003 [P] Build the synthetic corpora for `T`: one with 4 movable rows, one with 6 movable rows and clusters of 2 to 4 keys, and a stub advisor child that sleeps a set time (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Census and zero-call orders from 002's exports under the capture env: per-file counts, holdout top-1, MRR, right@1 and right@3 for the scorer's order, confidence order and always-second on identical rows, the rerank on held-out rows only, and `baseline mismatch: comparison void` on any number but 53/70 (`S`)
- [ ] T005 Advisor-only timing: one child per skill-firing prompt, `process.execPath`, `timeout: 2500`, `SIGKILL`, running `handleClaudeUserPromptSubmit`, and the line `advisor child: p50=<ms> p95=<ms> max=<ms> over_2200=<n>` (`S`)
- [ ] T006 Power line, `no headroom (movable)` below 5 movable rows, `no headroom (latency)` when the advisor-only p95 is over 2,200 ms, `margin: 0.05` and the `keep rule:` line, all before any call (`S`)
- [ ] T007 Stop point: when the real-tree zero-call run prints `no headroom`, record the line in `goal.md`'s log and skip T008 to T012
- [ ] T008 Read one real `cli-deem choice` answer and, only on the operator's `--jev`, one real `jev choice` answer. Record in `goal.md`'s log whether each `probabilities` map holds every submitted key (`goal.md`)
- [ ] T009 Gates through 002's `jevGate` and `deemGate`, the payload and cost lines of REQ-010 and the exit 2 refusal of `--jev` or `--deem` without `--out` before any output (`S`)
- [ ] T010 Timed child for the arms: advisor, then `cli-deem health` for Deem, then one `choice` through 002's `spawnCall`, returning wall, advisor and call ms, exit code and the full map. A kill at 2,500 ms marks the row `unmeasured_timeout` (`S`)
- [ ] T011 Both arms: three left rotations per eligible row, REQ-009's exit handling, `calls.jsonl` with the identity fields, and the order builder with mean probabilities, scorer-order ties, `reorderSlots`, `none` as abstention and a partial map as `unmeasured` (`S`)
- [ ] T012 Verdict per column, the Keep Rule's seven steps in order with integer comparisons, 002's `binomTail` and the verdict line on stdout and in `report.json` (`S`)
- [ ] T013 [P] One row each in the two folder READMEs (`runtime/scripts/routing-accuracy/README.md`, `runtime/tests/parity/README.md`)
- [ ] T014 After the runs, the system-skill-advisor docs through sk-doc: `SKILL.md` version line and pointer with `description` and Keywords unchanged, README, the next changelog file, catalog entry `feature-catalog/scorer-fusion/suggested-order-eval.md` with its index row and playbook scenario `manual-testing-playbook/scorer-fusion/suggested-order-eval.md` with its index row (`.skilled/skills/system-skill-advisor/`)
- [ ] T015 Move the six `48` pins in `runtime/tests/manual-testing-playbook.vitest.ts:45-55` to `49`, then regenerate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`, the Hermes copy with `sync-skills-hermes.cjs` and the trigger index when its `--check` reports stale docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/parity/score-suggested-order.vitest.ts` exits 0 with at least 20 passed tests: the happy path and edge case of each REQ-011 surface, including `no headroom (movable)`, `no headroom (latency)`, a `none`-first row, a partial map, a child killed at 2,500 ms, each gate skip with byte-identical output and the five verdict shapes (`T`)
- [ ] T017 One zero-call run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record the census totals, the three MRRs, the advisor child line and the headroom line in `goal.md`'s log
- [ ] T018 Only when the operator passes `--jev`: one `--jev --out <dir>` run. Record the identity line, the verdict line and p50 and p95 in `goal.md`'s log. The build never waits for the flag (parent D7): with no flag by close, mark this task done as not requested
- [ ] T019 Unless T017 printed `no headroom`: one `--deem --out <dir>` run against the served instance. Record the verdict line with its commit pair and p50 and p95 in `goal.md`'s log
- [ ] T020 `git status --porcelain` is identical before and after T017 to T019, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1. In a passing stub `--jev` run every logged call carries one `--provider` value
- [ ] T021 Rerun the H1 ratchet and the census after the doc edits and read 53/70, then run the advisor package's full vitest suite and compare with T001's baseline
- [ ] T022 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every skill doc T013 and T014 changed (parent D6)
- [ ] T023 A cross-family review of `S` and `T` leaves no open P0 or P1 finding (parent D5), then the parent orchestrator commits with path-scoped commits
- [ ] T024 Copy every verdict line into `implementation-summary.md` and `goal.md`'s log, and run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the zero-call run and every model run the operator asked for ran on the real tree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior verdicts**: See `../002-advisor-jev-tiebreak-arm/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
