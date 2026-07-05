---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Mine two vendored reference repos (read-only) to produce a ranked, actionable backlog of improvements to OUR loop systems. References, absolute paths: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-deep-loop-improved/external/loop-cli-main and /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-deep-loop-improved/external/kasper. Targets to improve (cite exact files): deep-loop-runtime, deep-loop-workflows, system-spec-kit commands and agents, skill interconnection, UX, and loop/automation. Investigate along 4 rotating dimensions per iteration: D1 source-mining one specific mechanism from a reference; D2 mapping a mechanism onto a named file of ours; D3 cross-cutting (UX, automation, interconnection, observability, loop testing); D4 synthesis (port design, risk/migration, ADR-worthy decisions, quick-win vs deep-rewrite). Every finding must carry reference file:line evidence, the exact OUR target file, a port-difficulty estimate, and a quick-win vs deep-rewrite tag. ANTI-CONVERGENCE is a hard requirement: never stop early; on any convergence, repetition, or stall, broaden scope, rotate dimension, or open a brand-new angle; the target is 50 proper iterations, each adding genuine novelty. Executor: cli-codex, model gpt-5.5, reasoning xhigh, service tier fast.
- Started: 2026-06-28T10:17:45Z
- Status: INITIALIZED
- Iteration: 51 of 58
- Session ID: dr-156-001-20260628-121745
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | S1-01 | - | 0.88 | 0 | complete |
| undefined | S1-02 | - | 0.76 | 0 | complete |
| undefined | S1-03 | - | 0.82 | 0 | complete |
| undefined | S1-04 | - | 0.79 | 0 | complete |
| undefined | S1-05 | - | 0.74 | 0 | complete |
| undefined | S1-06 | - | 0.78 | 0 | complete |
| undefined | S1-07 | - | 0.76 | 0 | complete |
| undefined | S1-08 | - | 0.64 | 0 | complete |
| undefined | S2-01 | - | 0.82 | 0 | complete |
| undefined | S2-02 | - | 0.86 | 0 | complete |
| undefined | S2-03 | - | 0.84 | 0 | complete |
| undefined | S2-04 | - | 0.81 | 0 | complete |
| undefined | S2-05 | - | 0.79 | 0 | complete |
| undefined | S2-06 | - | 0.76 | 0 | complete |
| undefined | S2-07 | - | 0.78 | 0 | complete |
| undefined | S2-08 | - | 0.77 | 0 | complete |
| undefined | S3-01 | - | 0.74 | 0 | complete |
| undefined | S3-02 | - | 0.68 | 0 | complete |
| undefined | S3-03 | - | 0.62 | 0 | complete |
| undefined | S3-04 | - | 0.52 | 0 | complete |
| undefined | S3-05 | - | 0.46 | 0 | complete |
| undefined | S3-06 | - | 0.57 | 0 | insight |
| undefined | S3-09 | - | 0.58 | 0 | complete |
| undefined | S3-10 | - | 0.62 | 5 | complete |
| undefined | S4-01 | - | 0.64 | 0 | complete |
| undefined | S4-02 | - | 0.66 | 0 | complete |
| undefined | S4-03 | - | 0.58 | 0 | complete |
| undefined | S4-04 | - | 0.62 | 0 | complete |
| undefined | S4-05 | - | 0.36 | 0 | complete |
| undefined | S4-07 | - | 0.43 | 0 | complete |
| undefined | S4-06 | - | 0.47 | 0 | complete |
| undefined | S4-08 | - | 0.58 | 0 | complete |
| undefined | S4-09 | - | 0.69 | 0 | complete |
| undefined | S5-01 | - | 0.73 | 0 | complete |
| undefined | S5-06 | - | 0.74 | 0 | complete |
| undefined | S5-07 | - | 0.71 | 0 | complete |
| undefined | S5-02 | - | 0.76 | 0 | insight |
| undefined | S5-08 | - | 0.64 | 0 | complete |
| undefined | S5-10 | - | 0.62 | 0 | complete |
| undefined | S6-01 | - | 0.55 | 0 | complete |
| undefined | S6-03 | - | 0.54 | 0 | complete |
| undefined | S6-07 | - | 0.48 | 0 | complete |
| undefined | S6-02 | - | 0.34 | 0 | insight |
| undefined | S6-04 | - | 0.42 | 0 | complete |
| undefined | S6-05 | - | 0.45 | 0 | complete |
| undefined | S6-06 | - | 0.50 | 0 | insight |
| undefined | S6-08 | - | 0.37 | 0 | complete |
| undefined | S6-09 | - | 0.43 | 0 | insight |
| undefined | S6-10 | - | 0.57 | 0 | insight |
| undefined | W-06 | - | 0.62 | 0 | complete |
| undefined | W-10 | - | 0.66 | 0 | insight |

- iterationsCompleted: 51
- keyFindings: 476
- openQuestions: 75
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/75
- [ ] [S1-01] How does loop-cli-main persist `remainingDelayMs` (loop-controller.ts:waitForDelay) and reconstruct a partially-elapsed wait after a crash without restarting the interval? → our deep-loop-runtime/scripts/fanout-run.cjs
- [ ] [S1-02] How does loop-cli-main compose abortable chunked sleep (shared/sleep.ts + SLEEP_CHUNK_MS + AbortSignal.any) so a long wait is promptly cancellable and pause-interruptible? → deep-loop-runtime sleep primitive
- [ ] [S1-03] How does loop-cli-main's triggerNow() save/restore the schedule around a forced run and guard against double-run? → deep_research_auto.yaml run-now control
- [ ] [S1-04] What are the legal transitions in loop-cli-main's running/waiting/paused/idle/stopped state machine and how does resumeResolve gate the wait loop? → deep-loop-runtime lifecycle
- [ ] [S1-05] How does loop-cli-main detect interval overrun and account for skipped iterations (skippedCount) under fixed-rate scheduling? → deep-loop-runtime iteration cadence
- [ ] [S1-06] How does loop-cli-main slice one append-only log into per-run regions via byte offsets (log-parser.ts, runHistory[].logOffset)? → deep-loop-workflows iteration logging
- [ ] [S1-07] How does loop-cli-main chain conditional follow-up tasks (onSuccessTaskId/onFailureTaskId, chainGroupId) and stop infinite chains? → deep-loop-runtime/lib/deep-loop/fallback-router.ts
- [ ] [S1-08] How does loop-cli-main's daemon (state.ts) implement serialize-diff persistence (write only when the snapshot changes)? → deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S1-09] How does loop-cli-main guarantee single-flight via socket-bind-before-init (daemon/server.ts) vs a lockfile? → deep-loop-runtime/lib/deep-loop/loop-lock.ts
- [ ] [S1-10] How does loop-cli-main detect a stale daemon by code-signature mismatch and restart it (daemon/manager.ts)? → deep-loop-runtime process management
- [ ] [S1-11] What does loop-cli-main's typed discriminated-union IPC contract look like (client/ipc.ts, types.ts) and how does the type tag drive exhaustive handling? → deep-loop-runtime script stdout contracts
- [ ] [S1-12] What are the exact rules of loop-cli-main's AGENTS.md WAVE MODEL (push-assignment, depends_on eligibility, disjoint-file-glob conflict-safety, checkpoint-commit, one-retry-then-stop)? → deep-loop-runtime/scripts/fanout-run.cjs
- [ ] [S2-01] How does kasper close the loop on "did my change actually help?" via `outcome_score_delta` (`setImprovementDelta`, helped/hurt avg) by comparing post-change scores to the pre-change baseline? -> deep-loop-runtime/scripts/convergence.cjs
- [ ] [S2-02] What is kasper's full LLM-judge hardening stack (`evaluate.ts`/`scorer.ts`) — retry → fallback score-card, dual timeout races, format-strip retry, 4-strategy JSON extraction — and in what order do they fire? -> deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts
- [ ] [S2-03] How does kasper use an observation threshold (`min_observations_for_update`) so a weakness is only acted on after N confirmations, and where is it enforced? -> deep-loop-runtime convergence gating
- [ ] [S2-04] How does kasper apply time-decay half-life weighting (`weight = 0.5 ** (ageDays/decayDays)`) so stale observations fade? -> deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
- [ ] [S2-05] How does kasper's rejected-pattern cache (`rejected_patterns`, `MAX_REJECTED_PATTERNS`, mergeable check) permanently suppress re-proposing a rejected idea? -> deep-loop-workflows protocol (ideas/exhausted)
- [ ] [S2-06] How does kasper do incremental fuzzy finding-merge — cheap similarity (`weaknessSimilarity`/`weaknessCache`) first, then LLM consolidation only on leftover duplicates? -> deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts
- [ ] [S2-07] How does kasper's `KasperStateStore` implement debounced flush (`markDirty` → 2s) with version dirty-again detection (`capturedVersion !== version` ⇒ re-flush)? -> deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S2-08] How does kasper reconcile concurrent writers with read-merge-write (`mergeExternalState` set-union) so two processes don't clobber each other? -> deep-loop-runtime/lib/deep-loop/jsonl-repair.ts
- [ ] [S2-09] How does kasper detect out-of-band edits via a SHA-256 integrity hash (`computeIntegrityHash` over state-minus-`_integrity`)? -> deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S2-10] How does kasper guard its poll loop against reentrancy (`evaluationRunning`) and force-clear a hung evaluation after a max duration (stuck-watchdog via `evaluationStartedAt`)? -> deep-loop-runtime/scripts/fanout-pool.cjs + YAML stuck handling
- [ ] [S2-11] How does kasper make artifact mutations reversible/idempotent — provenance fences, versioned backups (`BACKUP_MAX_VERSIONS`), rollback path in the success message? -> deep-loop-workflows/deep-research/scripts/reduce-state.cjs
- [ ] [S2-12] What does kasper's prompt-injection sanitizer (`sanitizeImprovementText`, `isValidGuidanceText`, `strict_sanitize`) reject before text is written into a prompt/AGENTS.md? -> deep-loop-runtime/lib/deep-loop/permissions-gate.ts
- [ ] [S3-01] Our `loop-lock.ts` carries `lastHeartbeatIso`/`ttlMs` but who calls `refreshLoopLock` during a long iteration — should we adopt loop-cli's pause-aware heartbeat cadence so a live-but-slow loop is never judged stale (`isStaleLoopLock` 2×TTL)? (build on S1-04) -> loop-lock.ts
- [ ] [S3-02] Given the YAML notes our macOS lock is advisory, should `loop-lock.ts` add loop-cli's socket-bind-before-init as a hard single-flight guard, and what breaks on multi-host? (build on S1-09) -> loop-lock.ts
- [ ] [S3-03] Should `atomic-state.ts` adopt kasper's SHA-256 `_integrity` stamp so JSONL/registry tampering between iterations is detected on resume? (build on S2-09) -> atomic-state.ts
- [ ] [S3-04] Would kasper's debounced-flush + version dirty-again model reduce write amplification when the reducer rewrites strategy/registry/dashboard 3× per iteration, without dropping the last write? (build on S2-07) -> atomic-state.ts
- [ ] [S3-05] For concurrent fan-out lineages sharing graph state, should `jsonl-repair.ts` gain kasper-style read-merge-write set-union so a salvaged lineage merges rather than overwrites? (build on S2-08) -> jsonl-repair.ts
- [ ] [S3-06] Our convergence measures novelty but never improvement-effect — should `convergence.cjs` add a kasper-style score-delta signal comparing this iteration's composite score to the prior snapshot to detect "looping without getting better"? (build on S2-01) -> convergence.cjs
- [ ] [S3-07] Should `computeGraphNoveltyDelta` weight graph evidence by age (kasper time-decay) so old FINDING/SOURCE nodes stop counting as covered, preventing premature convergence? (build on S2-04) -> coverage-graph-signals.ts
- [ ] [S3-08] Could a graph-level rejected-pattern cache feed `buildNoveltyCorroboration` so ruled-out approaches can't be re-counted as novel coverage? (build on S2-05) -> convergence.cjs (novelty corroboration)
- [ ] [S3-09] Should `fallback-router.ts` adopt kasper's scope-aware reroute and loop-cli's success/failure chaining so a failed executor routes to a typed next executor rather than a flat retry? (build on S1-07, S2) -> fallback-router.ts
- [ ] [S3-10] Our stall detector (`lag_ceiling_exceeded`) only warns — should it adopt kasper's stuck-watchdog force-clear to abort+requeue a hung lineage past the ceiling? (build on S2-10) -> fanout-pool.cjs
- [ ] [S3-11] Should fan-out lineages persist loop-cli's `remainingDelayMs`-style mid-flight checkpoint so a killed `fanout-run.cjs` resumes in-progress lineages instead of re-spawning all N? (build on S1-01) -> fanout-run.cjs
- [ ] [S3-12] How would kasper's observation-threshold change `bayesian-scorer.ts` so single-source claims can't push convergence, complementing the sourceDiversity guard? (build on S2-03) -> bayesian-scorer.ts
- [ ] [S4-01] Should we add a dedicated injection inbox (`research/inbox.jsonl` or a new `<!-- ANCHOR:injected-questions -->` block) given `reduce-state.cjs:800` rewrites the key-questions anchor every iteration — and how do injected items get promoted without losing provenance? -> deep_research_strategy.md + reduce-state.cjs
- [ ] [S4-02] What contract would a `minIterations` + `convergenceMode:"off"` config field need (alongside max/convergence/stuck), and how does the `_optimizerManaged` tunable registry treat it? -> deep_research_config.json
- [ ] [S4-03] Where should a `current_iteration < minIterations` guard short-circuit STOP to CONTINUE, mirroring the quality-guard override path? -> deep_research_auto.yaml (step_graph_convergence)
- [ ] [S4-04] How do we add a single-loop telemetry heartbeat that mirrors `fanout-pool.cjs`'s status ledger so a lone run emits the same observable JSONL events as a fan-out? (build on S1-08) -> deep_research_auto.yaml (iteration loop)
- [ ] [S4-05] Should `reduce-state.cjs` stamp injected vs analyst-authored questions with kasper-style begin/end provenance + `injectedAtIteration` so the dashboard attributes coverage to the angle bank? (build on S2-11) -> reduce-state.cjs
- [ ] [S4-06] How should the ideas backlog adopt kasper's observation-threshold + rejected-cache so a deferred idea auto-promotes after N corroborations and a ruled-out idea is never re-promoted? (build on S2-03, S2-05) -> research-ideas backlog
- [ ] [S4-07] Could we add a loop-cli-style force-trigger "run now" sentinel (`research/.deep-research-run-now`) alongside the pause sentinel? (build on S1-03) -> deep_research_auto.yaml (step_check_pause_sentinel)
- [ ] [S4-08] How can the advisorRouting projection be kept from drifting from `mode-registry.json` — should the drift-guard become a generator (registry → maps) the way loop-cli centralizes i18n/constants? -> mode-registry.json + skill-advisor drift-guard
- [ ] [S4-09] What from loop-cli's `/ob-autopilot` propose→apply→archive→merge pipeline (clean-failure-with-branch-preserved) should speckit implement/complete adopt for unattended runs? -> speckit {plan,implement,complete}.md
- [ ] [S4-10] Should the deep agents adopt loop-cli's runtime engineer-discovery (inspect `agents/` at spawn) to harden three-way `.opencode`/`.claude`/`.codex` parity so a missing mirror is detected at dispatch? -> agents/deep-research.md (+ mirrors)
- [ ] [S4-11] Could `step_fanout_spawn` adopt loop-cli WAVE `depends_on` eligibility + disjoint-glob conflict-safety so dependent research lineages run in dependency order vs a flat concurrency-capped pool? (build on S1-12) -> deep_research_auto.yaml (step_fanout_spawn)
- [ ] [S4-12] Should the iteration prompt gate on kasper-style turn-completeness before `post-dispatch-validate` runs, to avoid scoring truncated outputs as low-novelty? -> prompt_pack_iteration.md.tmpl
- [ ] [S4-13] How would kasper's layered config (defaults→file→session) with zod-clamp + hot-reload improve `runtime-capabilities.cjs` so overrides are bounds-checked and re-read mid-run? -> runtime-capabilities.cjs
- [ ] [S5-01] Should the dashboard adopt kasper's ASCII sparkline trend (`renderSparkline`) and in-progress banner (`summarizeValidationInProgress`) so newInfoRatio/score history + "iteration N running for Ts" render in-terminal? -> deep_research_dashboard.md
- [ ] [S5-02] What would a loop-wide dry-run mode look like (kasper `--dry-run`) that renders planned iterations/prompts/convergence checks without dispatching executors? -> deep_research_confirm.yaml
- [ ] [S5-03] Could our approval gates adopt loop-cli's confirm-gated-action + optimistic-refresh + toast UX (show dashboard delta + one-key Continue/Adjust/Stop)? -> confirm-mode gates
- [ ] [S5-04] Should per-iteration executor stdout be captured into one append log sliced by byte offset (loop-cli `logOffset`) so salvage/operators read any iteration's raw output without the write-once `.md` dependency? (build on S1-06) -> iteration artifacts
- [ ] [S5-05] How would loop-cli's fixed-rate cadence + overnight daemon enable a scheduled unattended 50-iteration run with skipped-iteration accounting, and which `/schedule`/hook surface owns it? (build on S1-05) -> automation/scheduling
- [ ] [S5-06] Where should a per-iteration `memory_save`/`memory_context` upsert hook fire so findings stream into Spec Kit Memory continuously instead of only at final SAVE (`generate-context.js`)? -> memory↔deep-loop
- [ ] [S5-07] How can a bridge seed the coverage-graph from `code_graph_query`/impact at init so review/context loops start with real FILE/DEPENDENCY nodes instead of an empty graph returning CONTINUE? -> code-graph↔deep-loop
- [ ] [S5-08] Should `advisor_recommend` resolve deep-loop modes through a generated artifact derived from `mode-registry.json`, and what is the runtime-coupling cost? (build on S4-08) -> advisor↔mode-registry
- [ ] [S5-09] Could `skill_graph_propagate_enhances` surface deep-loop-runtime as an explicit enhancer edge for the consumer loops so the advisor co-surfaces the shared runtime? -> skill_graph enhances
- [ ] [S5-10] How would kasper's score-delta become a loop-quality benchmark to measure whether a runtime change actually improves outcomes across fixtures, not just passes unit tests? (build on S2-01) -> deep:skill-benchmark / model-benchmark
- [ ] [S5-11] Should runtime tests adopt loop-cli's HOME-env/temp-dir isolation so `loop-lock.ts`/`atomic-state.ts`/`fanout-pool.cjs` tests never touch real `database/`/`~` and run hermetically in parallel? -> deep-loop-runtime tests
- [ ] [S5-12] How can `convergence.cjs`'s `trace`/`momentum`/`blockers` be streamed as live telemetry events so an operator watches which signal gates STOP in real time? -> convergence observability
- [ ] [S6-01] What would it take to port loop-cli's persisted-remaining-delay crash-resume into our loop (state schema, persist point, resume classification in `step_classify_session`), and the migration risk for in-flight sessions? (build on S1-01, S3-11) -> fanout-run.cjs + deep_research_auto.yaml
- [ ] [S6-02] Is kasper's full atomic-state stack (debounce + version guard + read-merge-write + integrity hash) a quick-win drop-in or a deep rewrite given our append-only JSONL contract — which layers port cleanly? (build on S2-07/08/09, S3-03/04/05) -> atomic-state.ts
- [ ] [S6-03] Should we author an ADR to unify convergence math now split across three files into one declarative threshold/weight spec with a shared parity test? -> convergence.cjs + lib/council/convergence.cjs + coverage-graph-signals.ts
- [ ] [S6-04] What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer can't tune past the floor? (build on S4-02) -> all four loop configs + runtime-capabilities.json
- [ ] [S6-05] Risks of replacing our flat concurrency-capped pull-pool with loop-cli's push-assignment WAVE MODEL for research/review fan-out, and where conflict-safety breaks without git worktrees? (build on S1-12, S4-11) -> fanout-pool.cjs (assignment model)
- [ ] [S6-06] How should loop-cli's "clean failure with branch preserved beats merging unverified code" reshape the promote/rollback gate, and does it conflict with kasper's auto-apply + backup-rollback? (build on S1 ob-autopilot, S2-11) -> deep-improvement promotion gate
- [ ] [S6-07] Which mined mechanisms are <1-day quick-wins (sparkline dashboard, integrity hash, HOME-env isolation, run-now sentinel) vs architectural rewrites (push-wave fan-out, unified convergence spec, crash-resume), and what is the dependency order? -> full angle-bank prioritization
- [ ] [S6-08] Keep advisory file-locking (hardened heartbeat) or adopt hard single-flight (socket-bind) given the macOS advisory limitation — cross-platform/host decision + blast radius? (build on S3-01, S3-02) -> loop-lock.ts (decision)
- [ ] [S6-09] Who owns conflict resolution when an injected inbox question and the reducer's machine-owned key-questions rewrite disagree — inbox-wins vs reducer-wins vs merge ADR? (build on S4-01) -> strategy anchor ownership (decision)
- [ ] [S6-10] What single telemetry/event schema would unify `fanout-pool.cjs`'s ledger, a new single-loop heartbeat, and council `round-state-jsonl.cjs` into one stream consumed by one dashboard? (build on S4-04, S5-12) -> unified observability schema
- [ ] [S6-11] What migration introduces kasper-style layered config (defaults→file→session, zod-clamp, hot-reload) across `deep_research_config.json`, `runtime_capabilities.json`, `optimizer-manifest.json` without breaking the `_optimizerManaged` locked/tunable contract? (build on S4-13) -> layered config migration
- [ ] [S6-12] Should kasper's LLM-judge hardening become a shared runtime primitive used by `post-dispatch-validate.ts` and any future LLM-judged loop, and what is the extraction boundary? (build on S2-02) -> post-dispatch-validate.ts + bayesian-scorer.ts
- [ ] [W-06] Could we build a record-replay harness capturing each iteration's dispatch inputs/outputs (loop-cli fixture style) so a full run is deterministically replayable for convergence-change regression? -> deep-loop-runtime tests (record-replay)
- [ ] [W-10] What would a meta-loop look like that points `deep:ai-system-improvement` at the deep-loop runtime's own technique docs, and what guardrails prevent it degrading the harness it runs on? -> deep:ai-system-improvement on deep-loop itself

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 75
- [ ] [S1-01] How does loop-cli-main persist `remainingDelayMs` (loop-controller.ts:waitForDelay) and reconstruct a partially-elapsed wait after a crash without restarting the interval? → our deep-loop-runtime/scripts/fanout-run.cjs
- [ ] [S1-02] How does loop-cli-main compose abortable chunked sleep (shared/sleep.ts + SLEEP_CHUNK_MS + AbortSignal.any) so a long wait is promptly cancellable and pause-interruptible? → deep-loop-runtime sleep primitive
- [ ] [S1-03] How does loop-cli-main's triggerNow() save/restore the schedule around a forced run and guard against double-run? → deep_research_auto.yaml run-now control
- [ ] [S1-04] What are the legal transitions in loop-cli-main's running/waiting/paused/idle/stopped state machine and how does resumeResolve gate the wait loop? → deep-loop-runtime lifecycle
- [ ] [S1-05] How does loop-cli-main detect interval overrun and account for skipped iterations (skippedCount) under fixed-rate scheduling? → deep-loop-runtime iteration cadence
- [ ] [S1-06] How does loop-cli-main slice one append-only log into per-run regions via byte offsets (log-parser.ts, runHistory[].logOffset)? → deep-loop-workflows iteration logging
- [ ] [S1-07] How does loop-cli-main chain conditional follow-up tasks (onSuccessTaskId/onFailureTaskId, chainGroupId) and stop infinite chains? → deep-loop-runtime/lib/deep-loop/fallback-router.ts
- [ ] [S1-08] How does loop-cli-main's daemon (state.ts) implement serialize-diff persistence (write only when the snapshot changes)? → deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S1-09] How does loop-cli-main guarantee single-flight via socket-bind-before-init (daemon/server.ts) vs a lockfile? → deep-loop-runtime/lib/deep-loop/loop-lock.ts
- [ ] [S1-10] How does loop-cli-main detect a stale daemon by code-signature mismatch and restart it (daemon/manager.ts)? → deep-loop-runtime process management
- [ ] [S1-11] What does loop-cli-main's typed discriminated-union IPC contract look like (client/ipc.ts, types.ts) and how does the type tag drive exhaustive handling? → deep-loop-runtime script stdout contracts
- [ ] [S1-12] What are the exact rules of loop-cli-main's AGENTS.md WAVE MODEL (push-assignment, depends_on eligibility, disjoint-file-glob conflict-safety, checkpoint-commit, one-retry-then-stop)? → deep-loop-runtime/scripts/fanout-run.cjs
- [ ] [S2-01] How does kasper close the loop on "did my change actually help?" via `outcome_score_delta` (`setImprovementDelta`, helped/hurt avg) by comparing post-change scores to the pre-change baseline? -> deep-loop-runtime/scripts/convergence.cjs
- [ ] [S2-02] What is kasper's full LLM-judge hardening stack (`evaluate.ts`/`scorer.ts`) — retry → fallback score-card, dual timeout races, format-strip retry, 4-strategy JSON extraction — and in what order do they fire? -> deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts
- [ ] [S2-03] How does kasper use an observation threshold (`min_observations_for_update`) so a weakness is only acted on after N confirmations, and where is it enforced? -> deep-loop-runtime convergence gating
- [ ] [S2-04] How does kasper apply time-decay half-life weighting (`weight = 0.5 ** (ageDays/decayDays)`) so stale observations fade? -> deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
- [ ] [S2-05] How does kasper's rejected-pattern cache (`rejected_patterns`, `MAX_REJECTED_PATTERNS`, mergeable check) permanently suppress re-proposing a rejected idea? -> deep-loop-workflows protocol (ideas/exhausted)
- [ ] [S2-06] How does kasper do incremental fuzzy finding-merge — cheap similarity (`weaknessSimilarity`/`weaknessCache`) first, then LLM consolidation only on leftover duplicates? -> deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts
- [ ] [S2-07] How does kasper's `KasperStateStore` implement debounced flush (`markDirty` → 2s) with version dirty-again detection (`capturedVersion !== version` ⇒ re-flush)? -> deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S2-08] How does kasper reconcile concurrent writers with read-merge-write (`mergeExternalState` set-union) so two processes don't clobber each other? -> deep-loop-runtime/lib/deep-loop/jsonl-repair.ts
- [ ] [S2-09] How does kasper detect out-of-band edits via a SHA-256 integrity hash (`computeIntegrityHash` over state-minus-`_integrity`)? -> deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [ ] [S2-10] How does kasper guard its poll loop against reentrancy (`evaluationRunning`) and force-clear a hung evaluation after a max duration (stuck-watchdog via `evaluationStartedAt`)? -> deep-loop-runtime/scripts/fanout-pool.cjs + YAML stuck handling
- [ ] [S2-11] How does kasper make artifact mutations reversible/idempotent — provenance fences, versioned backups (`BACKUP_MAX_VERSIONS`), rollback path in the success message? -> deep-loop-workflows/deep-research/scripts/reduce-state.cjs
- [ ] [S2-12] What does kasper's prompt-injection sanitizer (`sanitizeImprovementText`, `isValidGuidanceText`, `strict_sanitize`) reject before text is written into a prompt/AGENTS.md? -> deep-loop-runtime/lib/deep-loop/permissions-gate.ts
- [ ] [S3-01] Our `loop-lock.ts` carries `lastHeartbeatIso`/`ttlMs` but who calls `refreshLoopLock` during a long iteration — should we adopt loop-cli's pause-aware heartbeat cadence so a live-but-slow loop is never judged stale (`isStaleLoopLock` 2×TTL)? (build on S1-04) -> loop-lock.ts
- [ ] [S3-02] Given the YAML notes our macOS lock is advisory, should `loop-lock.ts` add loop-cli's socket-bind-before-init as a hard single-flight guard, and what breaks on multi-host? (build on S1-09) -> loop-lock.ts
- [ ] [S3-03] Should `atomic-state.ts` adopt kasper's SHA-256 `_integrity` stamp so JSONL/registry tampering between iterations is detected on resume? (build on S2-09) -> atomic-state.ts
- [ ] [S3-04] Would kasper's debounced-flush + version dirty-again model reduce write amplification when the reducer rewrites strategy/registry/dashboard 3× per iteration, without dropping the last write? (build on S2-07) -> atomic-state.ts
- [ ] [S3-05] For concurrent fan-out lineages sharing graph state, should `jsonl-repair.ts` gain kasper-style read-merge-write set-union so a salvaged lineage merges rather than overwrites? (build on S2-08) -> jsonl-repair.ts
- [ ] [S3-06] Our convergence measures novelty but never improvement-effect — should `convergence.cjs` add a kasper-style score-delta signal comparing this iteration's composite score to the prior snapshot to detect "looping without getting better"? (build on S2-01) -> convergence.cjs
- [ ] [S3-07] Should `computeGraphNoveltyDelta` weight graph evidence by age (kasper time-decay) so old FINDING/SOURCE nodes stop counting as covered, preventing premature convergence? (build on S2-04) -> coverage-graph-signals.ts
- [ ] [S3-08] Could a graph-level rejected-pattern cache feed `buildNoveltyCorroboration` so ruled-out approaches can't be re-counted as novel coverage? (build on S2-05) -> convergence.cjs (novelty corroboration)
- [ ] [S3-09] Should `fallback-router.ts` adopt kasper's scope-aware reroute and loop-cli's success/failure chaining so a failed executor routes to a typed next executor rather than a flat retry? (build on S1-07, S2) -> fallback-router.ts
- [ ] [S3-10] Our stall detector (`lag_ceiling_exceeded`) only warns — should it adopt kasper's stuck-watchdog force-clear to abort+requeue a hung lineage past the ceiling? (build on S2-10) -> fanout-pool.cjs
- [ ] [S3-11] Should fan-out lineages persist loop-cli's `remainingDelayMs`-style mid-flight checkpoint so a killed `fanout-run.cjs` resumes in-progress lineages instead of re-spawning all N? (build on S1-01) -> fanout-run.cjs
- [ ] [S3-12] How would kasper's observation-threshold change `bayesian-scorer.ts` so single-source claims can't push convergence, complementing the sourceDiversity guard? (build on S2-03) -> bayesian-scorer.ts
- [ ] [S4-01] Should we add a dedicated injection inbox (`research/inbox.jsonl` or a new `<!-- ANCHOR:injected-questions -->` block) given `reduce-state.cjs:800` rewrites the key-questions anchor every iteration — and how do injected items get promoted without losing provenance? -> deep_research_strategy.md + reduce-state.cjs
- [ ] [S4-02] What contract would a `minIterations` + `convergenceMode:"off"` config field need (alongside max/convergence/stuck), and how does the `_optimizerManaged` tunable registry treat it? -> deep_research_config.json
- [ ] [S4-03] Where should a `current_iteration < minIterations` guard short-circuit STOP to CONTINUE, mirroring the quality-guard override path? -> deep_research_auto.yaml (step_graph_convergence)
- [ ] [S4-04] How do we add a single-loop telemetry heartbeat that mirrors `fanout-pool.cjs`'s status ledger so a lone run emits the same observable JSONL events as a fan-out? (build on S1-08) -> deep_research_auto.yaml (iteration loop)
- [ ] [S4-05] Should `reduce-state.cjs` stamp injected vs analyst-authored questions with kasper-style begin/end provenance + `injectedAtIteration` so the dashboard attributes coverage to the angle bank? (build on S2-11) -> reduce-state.cjs
- [ ] [S4-06] How should the ideas backlog adopt kasper's observation-threshold + rejected-cache so a deferred idea auto-promotes after N corroborations and a ruled-out idea is never re-promoted? (build on S2-03, S2-05) -> research-ideas backlog
- [ ] [S4-07] Could we add a loop-cli-style force-trigger "run now" sentinel (`research/.deep-research-run-now`) alongside the pause sentinel? (build on S1-03) -> deep_research_auto.yaml (step_check_pause_sentinel)
- [ ] [S4-08] How can the advisorRouting projection be kept from drifting from `mode-registry.json` — should the drift-guard become a generator (registry → maps) the way loop-cli centralizes i18n/constants? -> mode-registry.json + skill-advisor drift-guard
- [ ] [S4-09] What from loop-cli's `/ob-autopilot` propose→apply→archive→merge pipeline (clean-failure-with-branch-preserved) should speckit implement/complete adopt for unattended runs? -> speckit {plan,implement,complete}.md
- [ ] [S4-10] Should the deep agents adopt loop-cli's runtime engineer-discovery (inspect `agents/` at spawn) to harden three-way `.opencode`/`.claude`/`.codex` parity so a missing mirror is detected at dispatch? -> agents/deep-research.md (+ mirrors)
- [ ] [S4-11] Could `step_fanout_spawn` adopt loop-cli WAVE `depends_on` eligibility + disjoint-glob conflict-safety so dependent research lineages run in dependency order vs a flat concurrency-capped pool? (build on S1-12) -> deep_research_auto.yaml (step_fanout_spawn)
- [ ] [S4-12] Should the iteration prompt gate on kasper-style turn-completeness before `post-dispatch-validate` runs, to avoid scoring truncated outputs as low-novelty? -> prompt_pack_iteration.md.tmpl
- [ ] [S4-13] How would kasper's layered config (defaults→file→session) with zod-clamp + hot-reload improve `runtime-capabilities.cjs` so overrides are bounds-checked and re-read mid-run? -> runtime-capabilities.cjs
- [ ] [S5-01] Should the dashboard adopt kasper's ASCII sparkline trend (`renderSparkline`) and in-progress banner (`summarizeValidationInProgress`) so newInfoRatio/score history + "iteration N running for Ts" render in-terminal? -> deep_research_dashboard.md
- [ ] [S5-02] What would a loop-wide dry-run mode look like (kasper `--dry-run`) that renders planned iterations/prompts/convergence checks without dispatching executors? -> deep_research_confirm.yaml
- [ ] [S5-03] Could our approval gates adopt loop-cli's confirm-gated-action + optimistic-refresh + toast UX (show dashboard delta + one-key Continue/Adjust/Stop)? -> confirm-mode gates
- [ ] [S5-04] Should per-iteration executor stdout be captured into one append log sliced by byte offset (loop-cli `logOffset`) so salvage/operators read any iteration's raw output without the write-once `.md` dependency? (build on S1-06) -> iteration artifacts
- [ ] [S5-05] How would loop-cli's fixed-rate cadence + overnight daemon enable a scheduled unattended 50-iteration run with skipped-iteration accounting, and which `/schedule`/hook surface owns it? (build on S1-05) -> automation/scheduling
- [ ] [S5-06] Where should a per-iteration `memory_save`/`memory_context` upsert hook fire so findings stream into Spec Kit Memory continuously instead of only at final SAVE (`generate-context.js`)? -> memory↔deep-loop
- [ ] [S5-07] How can a bridge seed the coverage-graph from `code_graph_query`/impact at init so review/context loops start with real FILE/DEPENDENCY nodes instead of an empty graph returning CONTINUE? -> code-graph↔deep-loop
- [ ] [S5-08] Should `advisor_recommend` resolve deep-loop modes through a generated artifact derived from `mode-registry.json`, and what is the runtime-coupling cost? (build on S4-08) -> advisor↔mode-registry
- [ ] [S5-09] Could `skill_graph_propagate_enhances` surface deep-loop-runtime as an explicit enhancer edge for the consumer loops so the advisor co-surfaces the shared runtime? -> skill_graph enhances
- [ ] [S5-10] How would kasper's score-delta become a loop-quality benchmark to measure whether a runtime change actually improves outcomes across fixtures, not just passes unit tests? (build on S2-01) -> deep:skill-benchmark / model-benchmark
- [ ] [S5-11] Should runtime tests adopt loop-cli's HOME-env/temp-dir isolation so `loop-lock.ts`/`atomic-state.ts`/`fanout-pool.cjs` tests never touch real `database/`/`~` and run hermetically in parallel? -> deep-loop-runtime tests
- [ ] [S5-12] How can `convergence.cjs`'s `trace`/`momentum`/`blockers` be streamed as live telemetry events so an operator watches which signal gates STOP in real time? -> convergence observability
- [ ] [S6-01] What would it take to port loop-cli's persisted-remaining-delay crash-resume into our loop (state schema, persist point, resume classification in `step_classify_session`), and the migration risk for in-flight sessions? (build on S1-01, S3-11) -> fanout-run.cjs + deep_research_auto.yaml
- [ ] [S6-02] Is kasper's full atomic-state stack (debounce + version guard + read-merge-write + integrity hash) a quick-win drop-in or a deep rewrite given our append-only JSONL contract — which layers port cleanly? (build on S2-07/08/09, S3-03/04/05) -> atomic-state.ts
- [ ] [S6-03] Should we author an ADR to unify convergence math now split across three files into one declarative threshold/weight spec with a shared parity test? -> convergence.cjs + lib/council/convergence.cjs + coverage-graph-signals.ts
- [ ] [S6-04] What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer can't tune past the floor? (build on S4-02) -> all four loop configs + runtime-capabilities.json
- [ ] [S6-05] Risks of replacing our flat concurrency-capped pull-pool with loop-cli's push-assignment WAVE MODEL for research/review fan-out, and where conflict-safety breaks without git worktrees? (build on S1-12, S4-11) -> fanout-pool.cjs (assignment model)
- [ ] [S6-06] How should loop-cli's "clean failure with branch preserved beats merging unverified code" reshape the promote/rollback gate, and does it conflict with kasper's auto-apply + backup-rollback? (build on S1 ob-autopilot, S2-11) -> deep-improvement promotion gate
- [ ] [S6-07] Which mined mechanisms are <1-day quick-wins (sparkline dashboard, integrity hash, HOME-env isolation, run-now sentinel) vs architectural rewrites (push-wave fan-out, unified convergence spec, crash-resume), and what is the dependency order? -> full angle-bank prioritization
- [ ] [S6-08] Keep advisory file-locking (hardened heartbeat) or adopt hard single-flight (socket-bind) given the macOS advisory limitation — cross-platform/host decision + blast radius? (build on S3-01, S3-02) -> loop-lock.ts (decision)
- [ ] [S6-09] Who owns conflict resolution when an injected inbox question and the reducer's machine-owned key-questions rewrite disagree — inbox-wins vs reducer-wins vs merge ADR? (build on S4-01) -> strategy anchor ownership (decision)
- [ ] [S6-10] What single telemetry/event schema would unify `fanout-pool.cjs`'s ledger, a new single-loop heartbeat, and council `round-state-jsonl.cjs` into one stream consumed by one dashboard? (build on S4-04, S5-12) -> unified observability schema
- [ ] [S6-11] What migration introduces kasper-style layered config (defaults→file→session, zod-clamp, hot-reload) across `deep_research_config.json`, `runtime_capabilities.json`, `optimizer-manifest.json` without breaking the `_optimizerManaged` locked/tunable contract? (build on S4-13) -> layered config migration
- [ ] [S6-12] Should kasper's LLM-judge hardening become a shared runtime primitive used by `post-dispatch-validate.ts` and any future LLM-judged loop, and what is the extraction boundary? (build on S2-02) -> post-dispatch-validate.ts + bayesian-scorer.ts
- [ ] [W-06] Could we build a record-replay harness capturing each iteration's dispatch inputs/outputs (loop-cli fixture style) so a full run is deterministically replayable for convergence-change regression? -> deep-loop-runtime tests (record-replay)
- [ ] [W-10] What would a meta-loop look like that points `deep:ai-system-improvement` at the deep-loop runtime's own technique docs, and what guardrails prevent it degrading the harness it runs on? -> deep:ai-system-improvement on deep-loop itself

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.57 -> 0.62 -> 0.66
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.66
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Which exact deep-loop runtime docs should be classified as editable technique docs versus frozen harness/scorer docs? Candidate editable areas are `feature_catalog/`, `manual_testing_playbook/`, and selected reference docs; candidate frozen areas are `tests/`, scorer prompts, Lane D templates, command routers, and runtime scripts.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
