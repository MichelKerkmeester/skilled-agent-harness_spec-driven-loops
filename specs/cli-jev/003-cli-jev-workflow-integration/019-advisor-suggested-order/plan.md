---
title: "Implementation Plan: Phase 19: advisor-suggested-order"
description: "One read-only Node script beside phase 002's tie-break eval reuses 002's census and gates, times the advisor alone inside a child spawned like the prompt shim's, then behind --jev or --deem orders each near-tie cluster by a choice's probability map and judges each column under a keep rule fixed in the spec, latency included."
trigger_phrases:
  - "suggested order plan"
  - "score-suggested-order plan"
  - "advisor child timing plan"
  - "near-tie order keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: advisor-suggested-order

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library, plus phase 002's `score-jev-tiebreak.mjs` exports and the advisor's built `dist` |
| **Framework** | None. The script spawns child Node processes for timing and `jev` and `cli-deem` as binaries |
| **Storage** | None. Reads the committed corpus files and writes only to an operator-named directory |
| **Testing** | Vitest through `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`, which includes `tests/**/*.vitest.ts` |

### Overview
`score-suggested-order.mjs` (proposed) runs 002's census under 002's capture env, scores three zero-call orders, and times the advisor alone in one child per prompt, spawned the way `user-prompt-submit.ts:113-120` spawns it. It prints the power line and the advisor's p95 against 2,200 ms before anything else. Behind `--jev` or `--deem` and that backend's gate, every `choice` runs inside a timed child that first runs the advisor for the row. The row's order is the cluster sorted by mean probability over three option orders. Each column ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under the Keep Rule in `spec.md` section 4. Jev first, then Deem (parent D1). Nothing is served.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The advisor `dist` is built and the H1 ratchet reads 53/70 at the build's starting HEAD
- [ ] The Keep Rule, the 0.05 margin and the 2,200 ms ceiling in `spec.md` are unchanged since 2026-09-29
- [ ] The build has read `hooks/claude/user-prompt-submit.ts` and recorded what `handleClaudeUserPromptSubmit` writes, before the child runs it

### Definition of Done
- [ ] Every REQ in `spec.md` section 4 is met with observed evidence in `tasks.md`
- [ ] The vitest file exits 0 with at least 20 passed tests, and the advisor package's suite fails nothing beyond its baseline recorded before the build
- [ ] `git status --porcelain` is the same before and after each script run
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review of the code leaves no open P0 or P1 finding (parent D5)
- [ ] Every verdict line, or `no headroom`, is in `goal.md`'s log and `implementation-summary.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file offline measurement script, the same shape as `score-jev-tiebreak.mjs`: exported pure functions for the tests and a `main()` that only runs as the entry point. The script also runs itself as the timed child through one internal flag (proposed), so the child and the parent share one file.

### Key Components
- **Census and orders**: 002's `loadCensus`, `reciprocalRank`, `rankMetrics`, `confidenceOrder` and `alwaysSecondOrder`, called unchanged. The power line and `no headroom (movable)` come from 002's counts.
- **Advisor-only timing**: one child per skill-firing prompt, `spawnSync(process.execPath, ...)` with `timeout: 2500` and `killSignal: 'SIGKILL'`, running the built hook's `handleClaudeUserPromptSubmit` under the capture env. It reports p50, p95, max and the count over 2,200 ms, and prints `no headroom (latency)` when the p95 is over 2,200 ms.
- **Gates**: 002's `jevGate` and `deemGate`, unchanged, with their identity and skip lines.
- **Arms**: per eligible row, three option orders. Each call runs inside a timed child: advisor, then one `cli-deem health` for Deem, then the `choice` through 002's `spawnCall`. The parent collects the child's wall ms, advisor ms, call ms, exit code and full probability map.
- **Order builder**: mean probability per key over the three answers, ties in the scorer's order, placed with `reorderSlots`. A `none` mean on top keeps the scorer's order.
- **Verdict**: the Keep Rule's seven steps in order, integer comparisons and an exact binomial p through 002's `binomTail`.

### Data Flow
Corpus rows flow through 002's census into eligible rows with clusters. Each prompt also runs once through the advisor-only child for the timing baseline. The headroom lines decide whether any arm may call. Under a switch, each eligible row gets three timed children, each returning one answer. The answers reduce to one order per row, scored against the best zero-call order on identical rows. Each column prints its own verdict. A failed gate never starts the other backend.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Build Roles

Parent D5 sets who builds. A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. It never uses the Agent tool. The code gets a cross-family review from a model family other than the one that wrote it. P0 and P1 findings get fixed and P2 findings are recorded. Code follows sk-code's OpenCode route and the skill docs go through sk-doc (parent D6). The live `--jev` and `--deem` runs are the orchestrator session's, never an executor's.

### First Slice, in Order

1. Build the advisor `dist`, run the H1 ratchet and record the advisor package's pass and fail counts as the baseline.
2. Write the census and zero-call orders from 002's exports. Check: 53/70 and 002's per-file counts (`eligible=93`, `eligible=18`, `movable=23` in total) print, and stub logs stay empty.
3. Write the advisor-only child and its timing line. Check: one child per prompt, p50, p95, max and `over_2200` print, and `git status --porcelain` is unchanged.
4. Stop here if the zero-call run prints `no headroom`, record the line in `goal.md`'s log and build no arm.
5. Read one real `cli-deem choice` answer and, on the operator's `--jev`, one real `jev choice` answer, and record whether each map holds every submitted key.
6. Add the gates and the Deem arm with its timed child, then the Jev arm. Check: the vitest stub cases pass.
7. Add the order builder and the verdict. Check: the vitest `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (latency)` cases pass.
8. Run `--jev --out <dir>` when the operator passes the flag, then `--deem --out <dir>` against the served instance. Check: one verdict line per column, every `calls.jsonl` line carrying child wall ms and identity fields.
9. Write the system-skill-advisor docs through sk-doc with `SKILL.md`'s `description` and Keywords line unchanged, move the playbook test's 48 pins to 49 and regenerate the leaf manifest pair, the Hermes copy and the trigger index. Rerun the ratchet and read 53/70.
10. Cross-family review, then the parent orchestrator's path-scoped commits.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`. `STUB` is a temporary directory of executable `jev` and `cli-deem` stubs, each appending its arguments to its own log. The vitest file holds the same cases against synthetic corpora.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Default run, zero calls | `PATH="$STUB:$PATH" node $S` | Census lines, `baseline: holdout_top1=53/70`, MRR, right@1 and right@3 for three zero-call orders, `advisor child: p50=... p95=... max=... over_2200=...`, the power line, `margin: 0.05`, the `keep rule:` line, exit 0 and both stub logs empty |
| Movable headroom | vitest, synthetic corpus with 4 movable rows | `no headroom (movable)` and no stub call |
| Latency headroom | vitest, stub advisor child sleeping 2,300 ms | `no headroom (latency)` and no stub call |
| Deem gate skip | stub `health` reports backend `stub`, `node $S --deem --out $D` | `deem arm skipped: stub backend`, the rest byte-identical to the default run, exit 0 |
| Jev gate skip | stub `auth status --provider official` exits 3, `node $S --jev --out $D` | Identity line naming the stub path and `official`, then `jev arm skipped: no credential`, exit 0, and the stub log holds only `--version` and `auth status --provider official` |
| Missing `--out` | `node $S --deem` | Exit 2, empty stdout, no stub call |
| Full map order | vitest, stub answers with full maps | The cluster reorders by mean probability, ties stay in scorer order, and a `none`-first row keeps the scorer's order |
| Partial map | vitest, stub map missing one key | That row is `unmeasured`, never a zero |
| Child kill | vitest, stub `choice` sleeping past 2,500 ms | Row `unmeasured_timeout`, counted at 2,500 ms in T |
| Verdicts | vitest, synthetic columns | `keep`, `kill`, `stop (coverage)`, `stop (margin)` and `stop (latency)` each print with K, M, W, L, F, p, mrr and p95_ms |
| One provider | stub log after a passing stub `--jev` run | Every `auth status`, `auth test` and `choice` line carries the same `--provider` |
| No key | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S` | Exit 1, no match |
| Read-only | `git status --porcelain` before and after each run | Identical |
| Skill docs | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc>` on each changed doc | Exit 0 |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 002 is Complete and its script is imported read-only. Phase 008 is Complete for `cli-deem`. The Deem arm needs the served instance passing `cli-deem health`, started by the operator with `deem-ctl`. The Jev arm needs `jev 0.6.2` and a credential for provider P. The default run needs none of these. No package is installed. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's path-scoped commits: the script, its test, the two folder README rows, the playbook test's pins and the skill docs, then regenerate the leaf manifest pair, the Hermes copy and the trigger index from the reverted docs. Delete the operator-named report directory if it sits inside the repository. No hook, scorer or corpus file changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
