# Review Dispatch Record: Worktree Default Flip

- **Date:** 2026-09-13
- **Subject:** `runtime/scripts/fanout-run.cjs`, `runtime/lib/deep-loop/executor-config.ts`, and their tests — the worktree-isolation default flip plus the per-attempt isolation tally (ADR-004)
- **Purpose:** Independent adversarial review of the diff before it was committed, while the diagnostic full suite ran.

## Dispatch configuration

| Child | Persona inlined | Kind | Model | Tools |
|-------|-----------------|------|-------|-------|
| A | `.opencode/agents/review.md` (findings-first, P0/P1/P2, Hunter/Skeptic/Referee on P0/P1, 100-point rubric, 70 gate) | read-only review | `llmgateway/deepseek-v4.1-flash`, thinking high | `read,grep,find,ls` — no bash, no write |
| B | `.opencode/agents/context.md` (structured catalog, no recommendations) | read-only sweep | `llmgateway/deepseek-v4.1-flash`, thinking high | `read,grep,find,ls` — no bash, no write |

Both ran through `pi -p --offline --approve` with `--no-extensions --no-skills --no-prompt-templates`, `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0`, stdin from `/dev/null`. The GATE 3 pre-resolution block from `child-dispatch-preamble.md` (v1.4.0.1) headed each prompt. The diff was embedded in the prompt because a bash-free child cannot run `git diff`; the assembled prompt files (`/tmp/dispatch/A.prompt.md`, `B.prompt.md`) are non-durable copies and are not reproduced here.

**Child A's brief:** six questions — which paths can run in the shared checkout while `worktreesEnabled` is true without incrementing `isolation.degraded`; whether any attempt can be double-counted or counted without a dispatch; whether the new `isolation` key breaks any summary consumer; whether the new assertions can pass vacuously and whether the three `--worktrees false` pins weaken coverage; other defects (stale comments, semantic inconsistencies); a rubric pass.

**Child B's brief:** three tables — every repository statement asserting the old worktree default (MOVES / STILL ACCURATE); every consumer of `orchestration-summary.json`; every runner-spawning test file other than `tests/unit/fanout-run.vitest.ts` with fixture kind and assertion style.

## Returns

- **Child A: `status: FAIL`, 73/100** (Correctness 22/30, Security 17/25, Patterns 15/20, Maintainability 12/15, Performance 7/10). Findings: 1 P1 + 5 P2s (stale comments/docs; dead `?? false` fallback; `isolation` on only one of three summary writers; counter semantics wider than their comment; unwrapped `loadWorktreeModules()`).
- **Child B: `status: PASS`.** 28 worktree-default statements classified (13 MOVES), 19 summary consumers with none broken by an additive key (2 writer sites omit it), 10 runner-spawning test files with 2 stress tests flagged as break risks.

## Conductor verification of the returns

Opened and confirmed in the code:

- `worktree-paths.ts:119,125` — `spawnCwd` stays `repoRoot` for `directory-flag`/`read-root` kinds (`native`, `cli-opencode`, `cli-cursor`) while `containmentRoot` is the tree. Child A's mechanism is real.
- `fanout-run.cjs:3553,3564-3571,3575-3582,3775-3792` — baseline snapshot, churn sampler and the post-dispatch check are all rooted at `laneContainmentRoot`, so with a tree the checkout is unscanned. Confirms the P1 consequence.
- ADR-004 risk row and "What improves" bullet overclaimed: "the main checkout is not written by a lane" and "the tally is the instrument the post-flip observation reads … a mispathed write is the failure it is watching for". The tally counts tree provisioning; it cannot observe that failure. Corrected.
- `fanout-run.cjs:3226-3239` (stopped) and `:3101-3108` (empty-tick) writers omitted `isolation`. Corrected.
- `parseFanoutConfig` prefault: a `tsx` probe returned `containment { mode: 'preserve', churnThreshold: 3, worktrees: true }` on empty input, `false` for explicit `{worktrees:false}`, `true` for `{mode:'restore'}` — so `?? false` at `:3019-3021` was unreachable and encoded the old default. Removed.
- `fanout-pool.cjs` re-invokes the worker per retry — the per-attempt count comment is correct; only the "dispatch ran in the shared checkout" phrasing was wider than what is measured. Corrected.

Adjudicated differently than Child B:

- Child B flagged `tests/stress/cli-adapter/fanout.vitest.ts` tests [0]/[11]/[12] as break risks because their fixture uses real git worktrees. The full suite from the flipped state passed **156/156 files (2653 passed, 7 skipped, 0 failed)** with no pin added, so no stress test needed one; the fixture lanes take the documented degrade path where a tree cannot be made.

## Actions taken in response

| Finding | Resolution |
|---------|-----------|
| P1 — tally cannot observe the mispathed-executor failure the ADR named it for | Corrected the claim, not the instrument: ADR-004's risk row, "What improves", "Why this one" and "Open Horizons" now state that the tally reports provisioning per attempt, that isolated runs watch the tree, and that a checkout write by a flag-lever kind is not observed. Watching the checkout for those kinds is recorded as remaining work, not silently dropped. Fixing the instrument is a new feature (second watched root with its own baseline) and stays out of this change. |
| P2 — stale comments/docs | Rewrote `fanout-run.cjs:2675`, `:2678-2682`, `:2684`; corrected `feature-catalog/feature-catalog.md:53`, `manual-testing-playbook/write-containment/shared-checkout-run.md`, `worktree-isolated-run.md`; packet 045 docs reconciled. |
| P2 — dead `?? false` | Removed; the schema default is the single default. |
| P2 — `isolation` on one writer | Added to the stopped and empty-tick summaries; the SIGTERM test pins the stopped payload (`:3130`). |
| P2 — counter comment wider than measured | Comment now states per-attempt semantics and both degrade arms. |
| P2 — unwrapped `loadWorktreeModules()` | Load failure now writes `worktree_setup_failed` to the ledger and degrades every attempt instead of aborting the run; the degraded lanes are re-forced to preserve (`worktreesEnabled` replaces `worktrees !== null` at the forced-preserve condition). |
| Test gaps worth noting | The empty-tick writer and the module-load fallback have no forcing test; `executor-config.vitest.ts` gained the partial-object assertion. Recorded, not smoothed over. |

Child A's note on a conflict between `sk-code-review`'s mandated final status line and the dispatch-mandated `PI_HANDBACK` block: the dispatch shape governed; the mandated status line was omitted by instruction, not by oversight.

## Evidence

- Diff reviewed: 4 files, +91/−15 at dispatch time (`/tmp/dl-postflip.diff`, non-durable).
- Post-fix targeted runs: `executor-config.vitest.ts` 94/94; `fanout-run.vitest.ts -t "worktree"` 8/8; `-t "SIGTERM"` 1/1, all exit 0.
- Diagnostic full suite from the pre-fix flipped state: exit 0, 156/156 files, 2653 passed, 7 skipped, 0 failed (`/tmp/dl-postflip.log`).
- Final full suite from the final state: exit 0, 156 files, 2653 passed, 7 skipped, 0 failed; recorded in `implementation-summary.md` (Verification table).
