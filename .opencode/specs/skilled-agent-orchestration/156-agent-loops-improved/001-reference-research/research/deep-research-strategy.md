# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Persistent brain for the loop-systems-improvement research session. Mines `external/loop-cli-main` + `external/kasper` to produce a ranked, actionable backlog of improvements to our deep-loop systems. Full angle bank: `research/monitor/angle-bank.md`.

---

## 2. TOPIC

Mine loop-cli-main + kasper (read-only) → ranked, actionable backlog of improvements to OUR loop systems (deep-loop-runtime, deep-loop-workflows, system-spec-kit commands/agents, skill interconnection, UX, automation). 50 proper, non-converging iterations. Executor: cli-codex gpt-5.5 xhigh fast.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing the improvements (each backlog item becomes its own follow-up spec).
- Summarizing the references for their own sake — every finding must map to one of OUR files.
- Auditing subsystems unrelated to loop orchestration.

---

## 5. STOP CONDITIONS
- Completion gate is `proper_count >= 50` (orchestrator-tracked), NOT raw iteration_count.
- Do NOT stop on convergence/entropy/novelty signals alone — convergence is a trigger to BROADEN (rotate dimension / open a new angle), never to stop, until 50 proper iterations exist.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- S1-02 remains open: inspect `shared/sleep.ts`, `SLEEP_CHUNK_MS`, and abort composition for a reusable runtime sleep primitive. (iteration 1)
- S1-03 through S1-12 remain open for later Segment S1 iterations. (iteration 1)
- S1-03 remains open: inspect `triggerNow()` save/restore schedule behavior and double-run guards for run-now control. (iteration 2)
- S1-04 through S1-12 remain open for later Segment S1 iterations. (iteration 2)
- S1-04 remains open: inspect legal running/waiting/paused/idle/stopped transitions and how `resumeResolve` gates the wait loop. (iteration 3)
- S1-05 through S1-12 remain open for later Segment S1 iterations. (iteration 3)
- S1-06 through S1-12 remain open for later Segment S1 iterations. (iteration 4)
- S1-05 remains open: fixed-rate overrun detection and `skippedCount`. (iteration 4)
- S1-07 through S1-12 remain open for later Segment S1 iterations. (iteration 5)
- S1-06 remains open: byte-offset log regions via `log-parser.ts` and `runHistory[].logOffset`. (iteration 5)
- S1-07 remains open: conditional follow-up task chaining and infinite-chain prevention. (iteration 6)
- S1-08 through S1-12 remain open for later Segment S1 iterations. (iteration 6)
- Whether our backlog should model chained fallback as executable dispatch or keep it as pure planning metadata until the executor layer can emit per-hop audit events. (iteration 7)
- [S1-08] remains open: how `loop-cli-main` daemon state implements serialize-diff persistence and whether `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` should adopt a write-only-on-change snapshot path. (iteration 7)
- Whether chain validation belongs only in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` or also in the registry-loading path that constructs `ModelRegistry`. (iteration 7)
- Whether no-op suppression should be limited to JSON state snapshots or also exposed for text outputs through `writeTextAtomic`. (iteration 8)
- Whether our shared helper should use caller-provided cache state, an internal path-keyed cache, or both. Caller-provided cache is safer for tests and long-running reducers; internal path-keyed cache is more ergonomic but needs explicit invalidation. (iteration 8)
- Whether post-dispatch validation should add an LLM judge stage as advisory-only first, or make it strict behind an explicit environment flag. (iteration 10)
- Whether the format-strip retry should be ported now or only when a validator actually uses provider-native structured output. (iteration 10)
- Whether judge fallback events should be appended to the same state log or emitted only in the per-iteration delta file. (iteration 10)
- Whether the threshold should be one shared runtime flag or loop-type-specific defaults for research, review, context, and council. (iteration 11)
- Whether "confirmation" should count independent sources, independent executor seats, repeated iterations, or explicit graph `CONFIRMS` edges. Kasper counts sessions; our graph has richer provenance. (iteration 11)
- Whether a force override belongs in `convergence.cjs` CLI flags, workflow YAML, or both. (iteration 11)
- [S2-06] remains next: incremental fuzzy finding-merge in kasper and how it maps onto `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. (iteration 13)
- Our loop still needs a design decision on category labels for rejected research ideas: source area, target file, focus segment, or free-form reason. (iteration 13)
- The current kasper manual rejection UX appears partly removed in current tests/docs, so follow-up synthesis should treat this as a state/filter mechanism rather than a fully live command UX. (iteration 13)
- Our target design should decide whether graph aliasing is query-only metadata, a repair command that rewires edges, or both. (iteration 14)
- The LLM consolidation target probably belongs outside `coverage-graph-query.ts`; this iteration maps the candidate-discovery part there and leaves the model caller for a later D2/D4 pass. (iteration 14)
- [S2-07] remains next: kasper's category-aware weakness taxonomy and how category labels prevent bad merges in the coverage graph signal layer. (iteration 14)
- A D2 mapping pass should identify which deep-loop reducers can safely adopt buffered writes without delaying append-only JSONL state events. (iteration 15)
- [S2-08] The same source file also exposes `mergeExternalState()` read-merge-write behavior at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:958-1028`; that needs a separate pass against our JSONL repair and append semantics. (iteration 15)
- The target design still needs a D2 pass to specify exact JSONL record identity keys for iteration records, graph events, findings, and observations. (iteration 16)
- The loop runtime still needs a separate admission-control pass if the goal is to prevent duplicate in-flight iterations, not only preserve both writers' completed records. (iteration 16)
- If lock metadata grows a `phase`, the migration rules for existing lock files need to stay backward-compatible because stale lock cleanup may read old records. (iteration 17)
- The implementation plan still needs to choose where the timer is owned: `loop-lock.ts` helper, `loop-lock.cjs` long-running wrapper, or executor-audit dispatch wrapper. (iteration 17)
- Which process should own the long-lived guard: the command workflow host, a runtime lock daemon, or a per-packet supervisor? (iteration 18)
- Should deep-research/deep-review YAML keep calling `loop-lock.cjs` directly, or should it call a wrapper that can hold a lease while the rest of the workflow runs? (iteration 18)
- Should the lock schema grow `hostId`, `guardKind`, and `socketPath` now, or wait until a host-held guard exists? (iteration 18)
- Decide whether legacy iteration JSONL records may gain an `_integrity` field, or whether JSONL integrity must stay in a sidecar to preserve current output contracts. (iteration 19)
- Map the exact callers that should consume `verifyIntegrity()`: reducer resume, post-dispatch validation, JSONL repair, and registry/dashboard writes have different failure semantics. (iteration 19)
- Define whether registry tamper warnings should be advisory only or should block synthesis/complete gates. (iteration 19)
- Decide whether the first implementation should wrap only `reduce-state.cjs` or expose a generic `createDeferredAtomicWriter()` for fanout and review reducers too. (iteration 20)
- Measure whether the live workflow ever invokes `reduce-state.cjs` plus dashboard generation as two physical write passes in the same iteration, because that determines the real write-amplification savings. (iteration 20)
- Confirm which fan-out paths write to a truly shared parent graph/state log versus isolated lineage logs; if all salvage writes stay isolated, this backlog item drops from correctness fix to hardening. (iteration 21)
- Define the stable identity table for each JSONL record family before implementation, especially `graphEvents` and generic `event` records. (iteration 21)
- Should `ModelProfile` grow scope/capability fields directly, or should `resolveFallback()` accept a separate route context so model registry data stays small? (iteration 23)
- Which failure kinds deserve separate next-hop policies first: quota exhaustion, timeout, invalid output, model mismatch, or recursion guard failures? (iteration 23)
- Should route trace persistence live in `executor-audit.ts` immediately, or wait until the router API is expanded and unit-tested? (iteration 23)
- S2-10 remains worth a dedicated D1 source-mining pass for the full kasper poll-loop contract, including whether `MAX_EVAL_DURATION_MS` is configurable and how it interacts with `evalMutex`. (iteration 24)
- A follow-up mapping should identify whether `fanout-run.cjs` can pass a child-kill abort hook into `runCappedPool()` without leaking child process handles across retries. (iteration 24)
- The implementation backlog needs to decide the control surface: `lagCeilingAction: "warn" | "abort-requeue"` in fanout config, or a separate `stallRecoveryMs` field so existing warning semantics stay byte-compatible. (iteration 24)
- Exact inbox schema needs a follow-up design pass: minimum viable fields are clear, but dedupe key, trust level, and source taxonomy still need names. (iteration 25)
- Need a reducer regression test that proves comments or metadata near `key-questions` bullets are not the durable provenance path. (iteration 25)
- S4-05 should cover dashboard attribution: injected versus analyst-authored coverage should be visible after promotion. (iteration 25)
- S4-03 should map the exact YAML guard location: `current_iteration < minIterations` should short-circuit STOP candidates before quality-guard override logic. (iteration 26)
- The implementation backlog needs to decide whether legacy missing `minIterations` defaults to `0` for byte-compatible replay or `3` for the new template default. (iteration 26)
- The optimizer manifest needs a design for cross-field constraints before `minIterations` can be safely searched. (iteration 26)
- Whether the audit output should be a dedicated `stop_override` event or extra fields on the existing convergence decision outputs. (iteration 27)
- Whether `all_questions_answered` should also be age-gated. The current quality-guard pattern applies to every STOP except `maxIterationsReached`, so parity suggests yes, but product semantics may want all-questions completion to remain terminal. (iteration 27)
- Decide the single-run label contract. `label: "single"` is clearer for dashboards; `label: "main"` may better match future non-fan-out primary-lineage terminology. (iteration 28)
- Decide the implementation surface: inline YAML `append_to_jsonl` steps versus a small runtime helper that `deep_research_auto.yaml` invokes for `start`, `progress`, and `finish`. (iteration 28)
- Decide whether confirm mode should receive the same telemetry in `.opencode/commands/deep/assets/deep_research_confirm.yaml` during the same backlog item or a follow-up parity patch. (iteration 28)
- The JSONL/state reference should be updated alongside implementation so `questionOriginCounts` and question-origin fields are documented, not implicit. (iteration 29)
- The exact migration default needs a product decision: pre-existing strategy bullets should likely become `origin: "analyst-strategy"` with `injectedAtIteration: null`, but this should be locked in with a reducer regression test. (iteration 29)
- Mirror scope is unresolved: this pass targeted `deep_research_auto.yaml` only, but confirm-mode parity would need a separate check if the same UX should exist under approval-gated research. (iteration 30)
- Decide the product semantics when both sentinels exist. Loop-cli parity means run-now can override/resume pause; stricter safety means pause wins and run-now is rejected with an explicit event. (iteration 30)
- The undo/reset UX for rejected ideas still needs a command-level decision. Kasper supports explicit remove/reset semantics; deep-research currently has no operator action for unrejecting an idea. (iteration 31)
- The exact matching primitive should be chosen during implementation: a cheap normalized fingerprint may be enough for idea titles, while kasper-style fuzzy text similarity is safer for paraphrased research tangents. (iteration 31)
- Decide how much Python alias data should be generated. The safe boundary is structural keys and workflow modes; regex weights should stay in code unless a later pass designs an escaping-safe fixture format. (iteration 32)
- Decide whether the generator is deep-loop-specific first or generic for all parent skills. The scaffolder target argues for generic, but the current worked example is still deep-loop-specific. (iteration 32)
- Choose generated artifact shape: committed generated modules versus a check-mode generator that prints the expected patch. Committed modules fit the current no-runtime-cross-skill-read constraint best. (iteration 32)
- Should SpecKit implement this as a new `/speckit:autopilot` command, a `:autopilot` mode on `/speckit:complete`, or an explicit `--unattended` flag routed through `complete.md`? (iteration 33)
- Where should the branch/commit/merge state live: a new workflow asset under `.opencode/commands/speckit/assets/`, or shared system-spec-kit git orchestration helpers? (iteration 33)
- Should unattended mode be allowed to push `main`, or should it stop after local merge and leave push/PR policy to `sk-git`? (iteration 33)
- Should the canonical running event be named `iteration_started`, or should the existing non-native-only `iteration_start` sentinel be generalized and normalized by the reducer? (iteration 34)
- Should live elapsed time be recomputed only when `reduce-state.cjs` runs, or should `/deep:research` gain a lightweight status command/view that renders directly from JSONL without rewriting the dashboard? (iteration 34)
- How many history points should the sparkline show by default: full session, last 12, or a configurable cap? (iteration 34)
- Update the deep-research protocol docs if the per-iteration hook lands; the current reference still states that `generate-context.js` is the supported save boundary for the workflow. (iteration 35)
- Decide whether the quick-win path indexes the full iteration markdown, the delta JSONL, or a generated digest file. The digest is cleaner, but it is the deeper rewrite. (iteration 35)
- Decide the exact warning event shape for memory-upsert failures so reducers and dashboards can show degraded memory streaming without treating the research iteration as failed. (iteration 35)
- Should the seed be written through a new `upsert.cjs --seed-source` mode or through YAML-built node/edge JSON using the existing `--nodes` / `--edges` contract? (iteration 36)
- Should fallback-seeded nodes count toward `dependencyCompleteness`, or should they be visible but down-weighted until code-graph verification succeeds? (iteration 36)
- What exact `code_graph_query` response shape should the bridge normalize: blast-radius files only, symbol nodes, import edges, or all three? (iteration 36)
- Should dry-run write a durable preview artifact under `research/previews/`, or print only to the command response? Durable artifacts are more auditable; print-only avoids new packet cleanup rules. (iteration 37)
- Should dry-run be supported for `:auto` immediately, or land first in `:confirm` where the approval gates already give the operator a natural preview surface? (iteration 37)
- Decide whether generated projection freshness belongs in advisor status, prompt-cache source signature, or both. (iteration 38)
- Decide whether the public field should be named `mode`, `workflowMode`, or `deepLoopMode`. `workflowMode` is less ambiguous and matches the registry. (iteration 38)
- Decide artifact shape: TypeScript module plus Python module, shared JSON loaded by both, or generated TS with a Python dump generated from the same source. (iteration 38)
- Which loop fixtures become the initial runtime-change corpus: deep-research reducer fixtures, deep-review blocked-stop sessions, deep-context manual playbook scenarios, or all three? (iteration 39)
- What should be the default baseline source: an explicit `--baseline-report`, the previous immutable report snapshot in `report-history/`, or a workflow-owned pre-change benchmark pass? (iteration 39)
- Should `hurt` be a hard zero-regression gate for runtime changes, or should profiles allow a small regression budget when aggregate improvement clears a higher threshold? (iteration 39)
- Confirm-mode parity remains unverified; this iteration mapped only `.opencode/commands/deep/assets/deep_research_auto.yaml`. (iteration 40)
- The auto research workflow currently dispatches back-to-back iterations rather than sleeping between iterations. A product decision is needed on whether persisted delay is for a new cadence/backoff feature, fan-out retry scheduling, or both. (iteration 40)
- How S6-04 anti-convergence floors (`minIterations`, `convergenceMode`) should compose with the proposed profile schema. (iteration 41)
- Exact profile file path is still open. Candidate: `.opencode/skills/deep-loop-runtime/lib/deep-loop/convergence-profiles.cjs` or a JSON schema plus CJS loader. (iteration 41)
- Whether council parity should live in `tests/integration/convergence-script.vitest.ts` or a council-specific test under `.opencode/skills/deep-loop-runtime/tests/council/`. (iteration 41)
- Should the convergence spec be an ADR plus generated config, or a runtime module with parity fixtures first? (iteration 42)
- Should run-now override pause like loop-cli, or should pause remain a hard safety latch with `run_now_rejected_pause`? (iteration 42)
- What conflict-safety substrate is required before push-wave fan-out: git worktrees, disjoint touched-file declarations, code graph impact, or a hybrid? (iteration 42)
- Should integrity mismatch remain warning-first everywhere, or should completion/synthesis gates be allowed to fail closed? (iteration 42)
- Define the stable identity table for JSONL records before implementing set-union: iteration records, findings, observations, graph events, and generic events need different keys. (iteration 43)
- Decide whether JSONL integrity should be a sidecar manifest, periodic checkpoint record, per-record hash, or hash chain. (iteration 43)
- Measure reducer write amplification before prioritizing the deferred writer; the current evidence supports the design, not the performance payoff. (iteration 43)
- The ADR needs a final home. Candidate target: a deep-loop-runtime convergence profile ADR plus schema fixtures under the runtime tests. (iteration 44)
- Legacy default policy remains open: missing `minIterations` on old records could replay as `0` for byte-compatible history or migrate to `3` for safer future defaults. (iteration 44)
- Context currently has no runtime capability matrix in the same shape as research/review. The ADR should decide whether to add one or route context through a shared graph-backed matrix. (iteration 44)
- Should dependency metadata live in `executor-config.ts` as first-class schema, or in a separate fan-out assignment manifest generated by research/review workflows? (iteration 45)
- Should native lineages join the same wave planner, or should the first wave implementation apply only to CLI lineages and keep native fan-out sequential? (iteration 45)
- Should our durable conflict boundary be path-scoped sandboxing, per-lineage git worktrees, or a stricter artifact-only fan-out contract? (iteration 45)
- Which state schema should record `candidate_kept_unmerged`, `promotion_blocked_branch_preserved`, and `rolled_back_local_candidate` so reducers and dashboards can render them without ambiguity? (iteration 46)
- Should Lane A/B use real `git worktree` isolation, a feature branch in the main worktree, or the existing archive directory plus a separate finalizer? (iteration 46)
- How should mirror-sync rollback interact with a preserved branch/worktree when one runtime mirror lands and another fails? (iteration 46)
- If true multi-host exclusion is required, what shared lease backend is acceptable for local-first spec folders? (iteration 47)
- Which process should own the long-lived heartbeat/lease driver: command host, runtime wrapper, or per-packet supervisor? (iteration 47)
- Should the lock schema grow `hostId`, `guardKind`, and `guardStrength` before the socket layer exists, or only with the first real host-local guard? (iteration 47)
- Exact conflict schema still needs design: likely fields are `questionId`, `dedupeKey`, `incomingText`, `existingQuestionId`, `relation`, `decision`, `decidedBy`, `decidedAtIteration`, and `reason`. (iteration 48)
- Need to decide whether the ADR lives as a new decision record under the implementation spec or as a deep-research reference update first. (iteration 48)
- Need a reducer regression fixture with three cases: identical injection dedupes, conflicting injection becomes `needs_decision`, explicit operator rejection suppresses later reducer-generated re-addition. (iteration 48)
- Decide whether the stream path is packet-local (`{artifact_dir}/observability.jsonl`) or spec-level (`{spec_folder}/deep-loop-observability.jsonl`) with per-session filters. (iteration 49)
- Decide whether confirm-mode YAMLs get observability parity in the same backlog item or a follow-up patch. (iteration 49)
- Decide whether fan-out writes both legacy `orchestration-status.log` rows and canonical rows during a compatibility window, or writes canonical rows and derives the legacy summary from them. (iteration 49)
- Decide whether fanout cassette capture is always enabled under `NODE_ENV=test` or gated behind an explicit CLI flag such as `--record-cassette`. (iteration 50)
- Decide whether cassette files should live under `tests/fixtures/record-replay/` or beside each consuming suite. The former is better for shared full-run regression; the latter keeps suite-specific fixtures easier to review. (iteration 50)
- Decide the redaction contract before storing prompts and tool results. Kasper truncates tool results for scoring; OUR replay cassettes should probably store full test fixture data but redact real run data by default. (iteration 50)
- Should the deep-loop self-packaging live inside `.opencode/skills/deep-loop-runtime/benchmark/` or as a generated packet-local packaging under the spec folder? (iteration 51)
- Should `allowed_diff_relpaths` be added as a generic Lane D schema field, or only generated for the deep-loop-runtime profile? (iteration 51)
- Which exact deep-loop runtime docs should be classified as editable technique docs versus frozen harness/scorer docs? Candidate editable areas are `feature_catalog/`, `manual_testing_playbook/`, and selected reference docs; candidate frozen areas are `tests/`, scorer prompts, Lane D templates, command routers, and runtime scripts. (iteration 51)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which exact deep-loop runtime docs should be classified as editable technique docs versus frozen harness/scorer docs? Candidate editable areas are `feature_catalog/`, `manual_testing_playbook/`, and selected reference docs; candidate frozen areas are `tests/`, scorer prompts, Lane D templates, command routers, and runtime scripts.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**Mission.** Improve our loop systems by mining two reference repos. Output = ranked backlog; each item: reference file:line + exact OUR target file + port-difficulty + quick-win/deep-rewrite tag.

**4 dimensions (rotate every iteration; name the dimension each time):**
- D1 SOURCE-MINING — extract one specific mechanism from a reference.
- D2 TARGET-MAPPING — map a mechanism onto a specific named file of ours.
- D3 CROSS-CUTTING — UX, automation, interconnection, observability, loop testing/benchmarking.
- D4 SYNTHESIS — port design, risk/migration, ADR-worthy decisions, quick-win vs deep-rewrite.

**Anti-convergence directive.** Never stop early. On convergence/repetition/stall: broaden scope, rotate dimension, or open a brand-new angle. A parallel monitor injects fresh `- [ ]` angles here between iterations; treat newly appended questions as priority focus candidates.

**Reference summaries.**
- loop-cli-main: TS daemon+CLI cadence runner — pause/resume/stop state machine w/ persisted remaining-delay, abortable chunked sleep, force-trigger, byte-offset log slicing, fixed-rate overrun catch-up, code-signature restart, socket single-flight, typed IPC, confirm-gated UX; plus /ob-autopilot pipeline + AGENTS.md WAVE MODEL.
- kasper: opencode observe→evaluate→improve→measure loop — score-delta, LLM-judge hardening, observation-threshold/decay/rejected-cache convergence, fuzzy finding-merge, atomic state (lock+merge+integrity), stuck-watchdog, provenance-stamped reversible mutation, layered config + sparkline UX, prompt-injection sanitizer.

**Angle bank:** `research/monitor/angle-bank.md` (6 segments S1–S6, 72 angles + 12 wildcards). Sequencing: S1→S6 in order, ~8–10 iters/segment, rotate dimension each iteration, inject next segment at ~70% checked.

---

## 13. RESEARCH BOUNDARIES
- Max iterations (cap): 58 (immutable post-init). Completion gate: proper_count >= 50.
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-06-28T10:17:45Z
