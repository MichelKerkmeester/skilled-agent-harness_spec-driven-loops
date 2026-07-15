# Angle Bank — 50-iteration deep-research run (loop-cli-main + kasper → our loop systems)

72 primary angles across 6 segments + 10 wildcard reserve. Each `Q` is paste-ready for injection as `- [ ] <Q>` into the `<!-- ANCHOR:key-questions -->` block of `deep-research-strategy.md`.

Dimensions: **D1** source-mining · **D2** target-mapping · **D3** cross-cutting · **D4** synthesis.

---

## SEGMENT S1 — Mine loop-cli-main (D1, ground-truth extraction)

- **S1-01** · D1 · → `deep-loop-runtime/scripts/fanout-run.cjs` — Q: What exactly does loop-cli-main persist as `remainingDelayMs` in `src/core/loop-controller.ts:waitForDelay`, and how does it reconstruct a partially-elapsed wait after a crash without restarting the full interval?
- **S1-02** · D1 · → deep-loop-runtime sleep primitive — Q: How does loop-cli-main compose abortable chunked sleep (`src/shared/sleep.ts` + `SLEEP_CHUNK_MS` + `AbortSignal.any([loop, run])`) so a long wait is both promptly cancellable and pause-interruptible?
- **S1-03** · D1 · → `deep_research_auto.yaml` — Q: How does loop-cli-main's `triggerNow()` force-run path save `_savedRemainingMs`, run immediately, then restore the schedule, and what guards prevent a double-run while one is in flight?
- **S1-04** · D1 · → deep-loop-runtime lifecycle — Q: What are the exact legal transitions in loop-cli-main's running/waiting/paused/idle/stopped state machine (`loop-controller.ts` pause/resume/stopLoop/playLoop), and how does the `resumeResolve` promise gate the wait loop?
- **S1-05** · D1 · → deep-loop-runtime iteration cadence — Q: How does loop-cli-main detect interval overrun (`overrunMs`, `runStartedAtMs + interval`) and account for skipped iterations (`skippedCount += missed`) under fixed-rate scheduling?
- **S1-06** · D1 · → deep-loop-workflows iteration logging — Q: How does loop-cli-main slice a single append-only log into per-run regions using byte offsets (`currentRunStartOffset`, `runHistory[].logOffset`, `src/core/log-parser.ts`)?
- **S1-07** · D1 · → `deep-loop-runtime/lib/deep-loop/fallback-router.ts` — Q: How does loop-cli-main chain conditional follow-up tasks via `onSuccessTaskId`/`onFailureTaskId` and `chainGroupId`, and what stops an infinite chain?
- **S1-08** · D1 · → `deep-loop-runtime/lib/deep-loop/atomic-state.ts` — Q: How does loop-cli-main's daemon (`src/daemon/state.ts`) implement serialize-diff persistence (write/re-render only when the serialized snapshot changes), and how is the diff computed cheaply?
- **S1-09** · D1 · → `deep-loop-runtime/lib/deep-loop/loop-lock.ts` — Q: How does loop-cli-main guarantee single-flight via socket-bind-before-init in `src/daemon/server.ts`, and how does that compare to a lockfile approach?
- **S1-10** · D1 · → deep-loop-runtime process management — Q: How does loop-cli-main detect a stale daemon by code-signature mismatch and restart it (`src/daemon/manager.ts`), and what signature does it hash?
- **S1-11** · D1 · → deep-loop-runtime script stdout contracts — Q: What does loop-cli-main's typed discriminated-union IPC contract look like (`src/client/ipc.ts`, `src/types.ts`), and how does the `type` tag drive exhaustive handling?
- **S1-12** · D1 · → `deep-loop-runtime/scripts/fanout-run.cjs` — Q: What are the precise rules of loop-cli-main's AGENTS.md WAVE MODEL — push-assignment (no claim step), `depends_on` eligibility, disjoint-file-glob conflict-safety, checkpoint-commit-per-group, one-retry-then-stop?

## SEGMENT S2 — Mine kasper (D1, ground-truth extraction)

- **S2-01** · D1 · → `deep-loop-runtime/scripts/convergence.cjs` — Q: How does kasper close the loop on "did my change actually help?" via `outcome_score_delta` (`setImprovementDelta`, helped/hurt avg) by comparing post-change scores to the pre-change baseline?
- **S2-02** · D1 · → `deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` — Q: What is kasper's full LLM-judge hardening stack (`evaluate.ts`/`scorer.ts`) — retry → fallback score-card, dual timeout races, format-strip retry, 4-strategy JSON extraction — and in what order do they fire?
- **S2-03** · D1 · → deep-loop-runtime convergence gating — Q: How does kasper use an observation threshold (`min_observations_for_update`) so a weakness is only acted on after N confirmations, and where is it enforced?
- **S2-04** · D1 · → `deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` — Q: How does kasper apply time-decay half-life weighting (`weight = 0.5 ** (ageDays/decayDays)`) so stale observations fade?
- **S2-05** · D1 · → deep-loop-workflows protocol (ideas/exhausted) — Q: How does kasper's rejected-pattern cache (`rejected_patterns`, `MAX_REJECTED_PATTERNS`, mergeable check) permanently suppress re-proposing a rejected idea?
- **S2-06** · D1 · → `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` — Q: How does kasper do incremental fuzzy finding-merge — cheap similarity (`weaknessSimilarity`/`weaknessCache`) first, then LLM consolidation only on leftover duplicates?
- **S2-07** · D1 · → `deep-loop-runtime/lib/deep-loop/atomic-state.ts` — Q: How does kasper's `KasperStateStore` implement debounced flush (`markDirty` → 2s) with version dirty-again detection (`capturedVersion !== version` ⇒ re-flush)?
- **S2-08** · D1 · → `deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` — Q: How does kasper reconcile concurrent writers with read-merge-write (`mergeExternalState` set-union) so two processes don't clobber each other?
- **S2-09** · D1 · → `deep-loop-runtime/lib/deep-loop/atomic-state.ts` — Q: How does kasper detect out-of-band edits via a SHA-256 integrity hash (`computeIntegrityHash` over state-minus-`_integrity`)?
- **S2-10** · D1 · → `deep-loop-runtime/scripts/fanout-pool.cjs` + YAML stuck handling — Q: How does kasper guard its poll loop against reentrancy (`evaluationRunning`) and force-clear a hung evaluation after a max duration (stuck-watchdog via `evaluationStartedAt`)?
- **S2-11** · D1 · → `deep-loop-workflows/deep-research/scripts/reduce-state.cjs` — Q: How does kasper make artifact mutations reversible/idempotent — provenance fences, versioned backups (`BACKUP_MAX_VERSIONS`), rollback path in the success message?
- **S2-12** · D1 · → `deep-loop-runtime/lib/deep-loop/permissions-gate.ts` — Q: What does kasper's prompt-injection sanitizer (`sanitizeImprovementText`, `isValidGuidanceText`, `strict_sanitize`) reject before text is written into a prompt/AGENTS.md?

## SEGMENT S3 — Map → deep-loop-runtime (D2)

- **S3-01** · D2 · → `loop-lock.ts` — Q: Our `loop-lock.ts` carries `lastHeartbeatIso`/`ttlMs` but who calls `refreshLoopLock` during a long iteration — should we adopt loop-cli's pause-aware heartbeat cadence so a live-but-slow loop is never judged stale (`isStaleLoopLock` 2×TTL)? (build on S1-04)
- **S3-02** · D2 · → `loop-lock.ts` — Q: Given the YAML notes our macOS lock is advisory, should `loop-lock.ts` add loop-cli's socket-bind-before-init as a hard single-flight guard, and what breaks on multi-host? (build on S1-09)
- **S3-03** · D2 · → `atomic-state.ts` — Q: Should `atomic-state.ts` adopt kasper's SHA-256 `_integrity` stamp so JSONL/registry tampering between iterations is detected on resume? (build on S2-09)
- **S3-04** · D2 · → `atomic-state.ts` — Q: Would kasper's debounced-flush + version dirty-again model reduce write amplification when the reducer rewrites strategy/registry/dashboard 3× per iteration, without dropping the last write? (build on S2-07)
- **S3-05** · D2 · → `jsonl-repair.ts` — Q: For concurrent fan-out lineages sharing graph state, should `jsonl-repair.ts` gain kasper-style read-merge-write set-union so a salvaged lineage merges rather than overwrites? (build on S2-08)
- **S3-06** · D2 · → `convergence.cjs` — Q: Our convergence measures novelty but never improvement-effect — should `convergence.cjs` add a kasper-style score-delta signal comparing this iteration's composite score to the prior snapshot to detect "looping without getting better"? (build on S2-01)
- **S3-07** · D2 · → `coverage-graph-signals.ts` — Q: Should `computeGraphNoveltyDelta` weight graph evidence by age (kasper time-decay) so old FINDING/SOURCE nodes stop counting as covered, preventing premature convergence? (build on S2-04)
- **S3-08** · D2 · → `convergence.cjs` (novelty corroboration) — Q: Could a graph-level rejected-pattern cache feed `buildNoveltyCorroboration` so ruled-out approaches can't be re-counted as novel coverage? (build on S2-05)
- **S3-09** · D2 · → `fallback-router.ts` — Q: Should `fallback-router.ts` adopt kasper's scope-aware reroute and loop-cli's success/failure chaining so a failed executor routes to a typed next executor rather than a flat retry? (build on S1-07, S2)
- **S3-10** · D2 · → `fanout-pool.cjs` — Q: Our stall detector (`lag_ceiling_exceeded`) only warns — should it adopt kasper's stuck-watchdog force-clear to abort+requeue a hung lineage past the ceiling? (build on S2-10)
- **S3-11** · D2 · → `fanout-run.cjs` — Q: Should fan-out lineages persist loop-cli's `remainingDelayMs`-style mid-flight checkpoint so a killed `fanout-run.cjs` resumes in-progress lineages instead of re-spawning all N? (build on S1-01)
- **S3-12** · D2 · → `bayesian-scorer.ts` — Q: How would kasper's observation-threshold change `bayesian-scorer.ts` so single-source claims can't push convergence, complementing the sourceDiversity guard? (build on S2-03)

## SEGMENT S4 — Map → deep-loop-workflows + speckit (D2)

- **S4-01** · D2 · → `deep_research_strategy.md` + `reduce-state.cjs` — Q: Should we add a dedicated injection inbox (`research/inbox.jsonl` or a new `<!-- ANCHOR:injected-questions -->` block) given `reduce-state.cjs:800` rewrites the key-questions anchor every iteration — and how do injected items get promoted without losing provenance?
- **S4-02** · D2 · → `deep_research_config.json` — Q: What contract would a `minIterations` + `convergenceMode:"off"` config field need (alongside max/convergence/stuck), and how does the `_optimizerManaged` tunable registry treat it?
- **S4-03** · D2 · → `deep_research_auto.yaml` (step_graph_convergence) — Q: Where should a `current_iteration < minIterations` guard short-circuit STOP to CONTINUE, mirroring the quality-guard override path?
- **S4-04** · D2 · → `deep_research_auto.yaml` (iteration loop) — Q: How do we add a single-loop telemetry heartbeat that mirrors `fanout-pool.cjs`'s status ledger so a lone run emits the same observable JSONL events as a fan-out? (build on S1-08)
- **S4-05** · D2 · → `reduce-state.cjs` — Q: Should `reduce-state.cjs` stamp injected vs analyst-authored questions with kasper-style begin/end provenance + `injectedAtIteration` so the dashboard attributes coverage to the angle bank? (build on S2-11)
- **S4-06** · D2 · → research-ideas backlog — Q: How should the ideas backlog adopt kasper's observation-threshold + rejected-cache so a deferred idea auto-promotes after N corroborations and a ruled-out idea is never re-promoted? (build on S2-03, S2-05)
- **S4-07** · D2 · → `deep_research_auto.yaml` (step_check_pause_sentinel) — Q: Could we add a loop-cli-style force-trigger "run now" sentinel (`research/.deep-research-run-now`) alongside the pause sentinel? (build on S1-03)
- **S4-08** · D2 · → `mode-registry.json` + skill-advisor drift-guard — Q: How can the advisorRouting projection be kept from drifting from `mode-registry.json` — should the drift-guard become a generator (registry → maps) the way loop-cli centralizes i18n/constants?
- **S4-09** · D2 · → speckit `{plan,implement,complete}.md` — Q: What from loop-cli's `/ob-autopilot` propose→apply→archive→merge pipeline (clean-failure-with-branch-preserved) should speckit implement/complete adopt for unattended runs?
- **S4-10** · D2 · → `agents/deep-research.md` (+ mirrors) — Q: Should the deep agents adopt loop-cli's runtime engineer-discovery (inspect `agents/` at spawn) to harden three-way `.opencode`/`.claude`/`.codex` parity so a missing mirror is detected at dispatch?
- **S4-11** · D2 · → `deep_research_auto.yaml` (step_fanout_spawn) — Q: Could `step_fanout_spawn` adopt loop-cli WAVE `depends_on` eligibility + disjoint-glob conflict-safety so dependent research lineages run in dependency order vs a flat concurrency-capped pool? (build on S1-12)
- **S4-12** · D2 · → `prompt_pack_iteration.md.tmpl` — Q: Should the iteration prompt gate on kasper-style turn-completeness before `post-dispatch-validate` runs, to avoid scoring truncated outputs as low-novelty?
- **S4-13** · D2 · → `runtime-capabilities.cjs` — Q: How would kasper's layered config (defaults→file→session) with zod-clamp + hot-reload improve `runtime-capabilities.cjs` so overrides are bounds-checked and re-read mid-run?

## SEGMENT S5 — Cross-cutting (D3: UX · automation · interconnection · observability · testing)

- **S5-01** · D3 · → `deep_research_dashboard.md` — Q: Should the dashboard adopt kasper's ASCII sparkline trend (`renderSparkline`) and in-progress banner (`summarizeValidationInProgress`) so newInfoRatio/score history + "iteration N running for Ts" render in-terminal?
- **S5-02** · D3 · → `deep_research_confirm.yaml` — Q: What would a loop-wide dry-run mode look like (kasper `--dry-run`) that renders planned iterations/prompts/convergence checks without dispatching executors?
- **S5-03** · D3 · → confirm-mode gates — Q: Could our approval gates adopt loop-cli's confirm-gated-action + optimistic-refresh + toast UX (show dashboard delta + one-key Continue/Adjust/Stop)?
- **S5-04** · D3 · → iteration artifacts — Q: Should per-iteration executor stdout be captured into one append log sliced by byte offset (loop-cli `logOffset`) so salvage/operators read any iteration's raw output without the write-once `.md` dependency? (build on S1-06)
- **S5-05** · D3 · → automation/scheduling — Q: How would loop-cli's fixed-rate cadence + overnight daemon enable a scheduled unattended 50-iteration run with skipped-iteration accounting, and which `/schedule`/hook surface owns it? (build on S1-05)
- **S5-06** · D3 · → memory↔deep-loop — Q: Where should a per-iteration `memory_save`/`memory_context` upsert hook fire so findings stream into Spec Kit Memory continuously instead of only at final SAVE (`generate-context.js`)?
- **S5-07** · D3 · → code-graph↔deep-loop — Q: How can a bridge seed the coverage-graph from `code_graph_query`/impact at init so review/context loops start with real FILE/DEPENDENCY nodes instead of an empty graph returning CONTINUE?
- **S5-08** · D3 · → advisor↔mode-registry — Q: Should `advisor_recommend` resolve deep-loop modes through a generated artifact derived from `mode-registry.json`, and what is the runtime-coupling cost? (build on S4-08)
- **S5-09** · D3 · → skill_graph enhances — Q: Could `skill_graph_propagate_enhances` surface deep-loop-runtime as an explicit enhancer edge for the consumer loops so the advisor co-surfaces the shared runtime?
- **S5-10** · D3 · → deep:skill-benchmark / model-benchmark — Q: How would kasper's score-delta become a loop-quality benchmark to measure whether a runtime change actually improves outcomes across fixtures, not just passes unit tests? (build on S2-01)
- **S5-11** · D3 · → deep-loop-runtime tests — Q: Should runtime tests adopt loop-cli's HOME-env/temp-dir isolation so `loop-lock.ts`/`atomic-state.ts`/`fanout-pool.cjs` tests never touch real `database/`/`~` and run hermetically in parallel?
- **S5-12** · D3 · → convergence observability — Q: How can `convergence.cjs`'s `trace`/`momentum`/`blockers` be streamed as live telemetry events so an operator watches which signal gates STOP in real time?

## SEGMENT S6 — Synthesis (D4: port designs · risk/migration · ADRs · quick-wins)

- **S6-01** · D4 · → `fanout-run.cjs` + `deep_research_auto.yaml` — Q: What would it take to port loop-cli's persisted-remaining-delay crash-resume into our loop (state schema, persist point, resume classification in `step_classify_session`), and the migration risk for in-flight sessions? (build on S1-01, S3-11)
- **S6-02** · D4 · → `atomic-state.ts` — Q: Is kasper's full atomic-state stack (debounce + version guard + read-merge-write + integrity hash) a quick-win drop-in or a deep rewrite given our append-only JSONL contract — which layers port cleanly? (build on S2-07/08/09, S3-03/04/05)
- **S6-03** · D4 · → `convergence.cjs` + `lib/council/convergence.cjs` + `coverage-graph-signals.ts` — Q: Should we author an ADR to unify convergence math now split across three files into one declarative threshold/weight spec with a shared parity test?
- **S6-04** · D4 · → all four loop configs + `runtime-capabilities.json` — Q: What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer can't tune past the floor? (build on S4-02)
- **S6-05** · D4 · → `fanout-pool.cjs` (assignment model) — Q: Risks of replacing our flat concurrency-capped pull-pool with loop-cli's push-assignment WAVE MODEL for research/review fan-out, and where conflict-safety breaks without git worktrees? (build on S1-12, S4-11)
- **S6-06** · D4 · → deep-improvement promotion gate — Q: How should loop-cli's "clean failure with branch preserved beats merging unverified code" reshape the promote/rollback gate, and does it conflict with kasper's auto-apply + backup-rollback? (build on S1 ob-autopilot, S2-11)
- **S6-07** · D4 · → full angle-bank prioritization — Q: Which mined mechanisms are <1-day quick-wins (sparkline dashboard, integrity hash, HOME-env isolation, run-now sentinel) vs architectural rewrites (push-wave fan-out, unified convergence spec, crash-resume), and what is the dependency order?
- **S6-08** · D4 · → `loop-lock.ts` (decision) — Q: Keep advisory file-locking (hardened heartbeat) or adopt hard single-flight (socket-bind) given the macOS advisory limitation — cross-platform/host decision + blast radius? (build on S3-01, S3-02)
- **S6-09** · D4 · → strategy anchor ownership (decision) — Q: Who owns conflict resolution when an injected inbox question and the reducer's machine-owned key-questions rewrite disagree — inbox-wins vs reducer-wins vs merge ADR? (build on S4-01)
- **S6-10** · D4 · → unified observability schema — Q: What single telemetry/event schema would unify `fanout-pool.cjs`'s ledger, a new single-loop heartbeat, and council `round-state-jsonl.cjs` into one stream consumed by one dashboard? (build on S4-04, S5-12)
- **S6-11** · D4 · → layered config migration — Q: What migration introduces kasper-style layered config (defaults→file→session, zod-clamp, hot-reload) across `deep_research_config.json`, `runtime_capabilities.json`, `optimizer-manifest.json` without breaking the `_optimizerManaged` locked/tunable contract? (build on S4-13)
- **S6-12** · D4 · → `post-dispatch-validate.ts` + `bayesian-scorer.ts` — Q: Should kasper's LLM-judge hardening become a shared runtime primitive used by `post-dispatch-validate.ts` and any future LLM-judged loop, and what is the extraction boundary? (build on S2-02)

---

## Broaden-reserve — 10 wildcard high-novelty angles (inject on convergence/stuck)

- **W-01** · D3 · → `fanout-run.cjs` ← council multi-seat dispatch — Q: Could the council's parallel multi-seat dispatcher power a research wave (currently sequential/reference-only) so independent key-questions run concurrently with median-pruning?
- **W-02** · D4 · → `lib/council/cost-guards.cjs` (generalize) — Q: What would a per-iteration cost/budget governor look like (generalizing council saturation/max-rounds) tied to `executor-config.timeoutSeconds` so a 50-iteration run has a hard spend ceiling?
- **W-03** · D3 · → `permissions-gate.ts` — Q: Since the angle inbox is operator/agent-authored, should injected questions themselves pass kasper's prompt-injection sanitizer before entering the strategy file — securing the loop's own input supply chain?
- **W-04** · D3 · → `deep_research_auto.yaml` human-in-the-loop — Q: What mid-run steering protocol (loop-cli pause → operator edits key-questions → resume) lets a human reprioritize between iterations without restarting or corrupting reducer state?
- **W-06** · D3 · → deep-loop-runtime tests (record-replay) — Q: Could we build a record-replay harness capturing each iteration's dispatch inputs/outputs (loop-cli fixture style) so a full run is deterministically replayable for convergence-change regression?
- **W-07** · D4 · → `coverage-graph-db.ts` — Q: What schema-versioning + migration strategy does the coverage-graph need so a backward-incompatible node/edge change is safe under concurrent fan-out lineages?
- **W-08** · D3 · → cli-codex/claude-code/opencode dispatch parity — Q: Should a fan-out lineage matrix dispatch the same iteration across codex/claude/opencode to measure cross-AI agreement as a convergence signal (extending context-loop `agreementRate` to research)?
- **W-09** · D4 · → `lifecycle-taxonomy.cjs` — Q: Can we unify the three failure vocabularies — `lifecycle-taxonomy.cjs`, fan-out `failure_classes`, kasper weakness categories — into one taxonomy so recovery routing is consistent?
- **W-11** · D3 · → deep-loop-workflows onboarding/UX — Q: How does loop-cli's README + demo.gif + single-command onboarding inform a deep-loop quick-start so a first-time operator launches a research loop without reading `loop_protocol.md`?
- **W-12** · D3 · → `deep_research_auto.yaml` Step 4b (checkpoint commit, reference-only) — Q: Should the reference-only per-iteration checkpoint-commit become live (targeted `git add` of research artifacts + non-blocking commit) so `git log -- research/` is the rollback ledger?

---

## Sequencing rules (anti-convergence)

- Run **S1→S6 strictly in order** (~8–10 iters/segment; ~48–58 total). Never interleave mining (S1/S2) with synthesis (S5/S6) — the loop can't synthesize a port before the mechanism is grounded.
- Inject the next segment only when the current segment's key-questions are **~70% checked** (matches `questionCoverage` 0.7).
- **Rotate the dimension every iteration** within a segment — two same-mechanism angles in a row is the main convergence risk.
- S3/S4 mapping angles must **cite the S1/S2 id** they build on (forces *apply*, not re-derive — re-derivation reads as low novelty to `computeGraphNoveltyDelta`).
- Dimension weighting by segment: S1/S2 ≈80% D1; S3/S4 ≈75% D2 with D4 spillover; S5 D3-dominant; S6 D4-only.
- When the monitor flags flat-novelty/stuck **twice within a segment**, pull a wildcard (W-xx) before forcing more same-segment angles.
- Reserve the **last 2–4 iterations for S6 decision artifacts** (ADRs, quick-win triage) — highest-leverage, must run after all mechanisms + mappings exist.
