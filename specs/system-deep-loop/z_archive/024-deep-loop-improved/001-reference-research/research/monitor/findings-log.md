iter 1 | ratio 0.88 | findings 1 | .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs | med/quick-win | loop-cli-main persists a partially elapsed wait by storing nextRunAt and remainingDelayMs in LoopController metadata, persisting on waiting events, th
iter 2 | ratio 0.76 | findings 3 | .opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts | easy/quick-win | loop-cli-main's shared sleep helper clears its timeout on abort, removes its abort listener on normal completion, rejects with signal.reason, and pair
iter 3 | ratio 0.82 | findings 5 | .opencode/commands/deep/assets/deep_research_auto.yaml | med/quick-win | Model run-now intent separately from cadence state and clear it at dispatch start.
iter 4 | ratio 0.79 | findings 4 | ? | easy/quick-win | 
iter 5 | ratio 0.74 | findings 4 | ? | med/quick-win | Add fixed-rate overrun math using run-start slot accounting.
iter 6 | ratio 0.78 | findings 4 | ? | med/quick-win | Add optional logOffset/logSize/logPath metadata to deep-research iteration records or companion events so tooling can jump to the exact raw transcript
iter 7 | ratio 0.76 | findings 4 | ? | med/deep-rewrite | Outcome-routed fallback chain contract: model success/failure next targets explicitly before making executor fallback multi-hop.
iter 8 | ratio 0.64 | findings 4 | .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts | easy/quick-win | loop-cli-main suppresses redundant daemon writes with an in-memory lastSerialized map: persist builds LoopMeta, JSON.stringify compares against the ca
iter 9 | ratio 0.82 | findings 4 | ? | med/quick-win | Capture pre-change convergence score on each runtime improvement record.
iter 10 | ratio 0.86 | findings 5 | ? | med/quick-win | Retry wraps the whole judge attempt; non-fallback cards return immediately, fallback cards retry until the last attempt, and final errors become a neu
iter 11 | ratio 0.84 | findings 4 | ? | easy/quick-win | Kasper makes minimum observations a validated config value with default 2; port as a convergence confirmation threshold.
iter 12 | ratio 0.81 | findings 4 | ? | med/quick-win | Kasper's reusable mechanism computes a fractional observation weight as 0.5 ** (ageDays / decayDays) and accumulates weakness/strength frequencies wit
iter 13 | ratio 0.79 | findings 4 | .opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md | med/quick-win | Kasper persists rejected patterns as durable bounded state: the schema includes rejected_patterns, default state initializes it, load normalizes the a
iter 14 | ratio 0.76 | findings 4 | .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts | med/quick-win | Kasper uses a deterministic similarity helper before any model call: exact match, substring score, exact word-overlap, and longer-word fuzzy overlap w
iter 15 | ratio 0.78 | findings 3 | .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts | med/quick-win | Kasper coalesces repeated mutations behind dirty/version/timer state; our atomic helper writes every call immediately, so a buffered wrapper would red
iter 16 | ratio 0.77 | findings 4 | ? | med/quick-win | 
iter 17 | ratio 0.74 | findings 4 | ? | med/quick-win | Add lifecycle-driven lock heartbeat helper around refreshLoopLock.
iter 18 | ratio 0.68 | findings 4 | .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts | med/quick-win | loop-cli-main binds local IPC before state initialization, so a losing same-host starter fails before loop state loads. OUR lock layer should expose t
iter 19 | ratio 0.62 | findings 4 | .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts | easy/quick-win | 
iter 20 | ratio 0.52 | findings 4 | ? | med/quick-win | Add a reusable deferred atomic output sink for clustered reducer writes.
iter 21 | ratio 0.46 | findings 4 | ? | med/quick-win | Add a lock-held read-merge-append primitive to jsonl-repair.ts so repair/append paths preserve concurrent records before writing.
iter 22 | ratio 0.57 | findings 4 | ? | easy/quick-win | Add explicit scoreDelta comparing current score to prior snapshot score.
iter 23 | ratio 0.58 | findings 4 | .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts | med/quick-win | Add scope-compatible route resolution so fallback selection can reject or label executor scope widening.
iter 24 | ratio 0.62 | findings 5 | ? | med/deep-rewrite | Kasper clears a hung evaluation latch after its max duration; our analogous lag ceiling currently emits only a warning.
iter 25 | ratio 0.64 | findings 4 | ? | med/quick-win | Model injected questions as append-only records with identity, origin, source, injectedAtIteration, promotedAtIteration, and promotedQuestionId instea
iter 26 | ratio 0.66 | findings 4 | ? | med/quick-win | Define minIterations as a bounded integer lower stop guard, defaulting to 3 and requiring minIterations <= maxIterations.
iter 27 | ratio 0.58 | findings 3 | ? | easy/quick-win | 
iter 28 | ratio 0.62 | med/quick-win | Add single-executor started and completed/failed ledger rows around deep_research_auto.yaml step_dispatch_iter | .opencode/commands/deep/assets/deep_research_auto.yaml
iter 29 | ratio 0.36 | med/quick-win | Extend reducer question records with origin, source, and injectedAtIteration so angle-bank questions remain at | ?
iter 30 | ratio 0.43 | easy/quick-win | Add packet-local `run_now_sentinel` beside `pause_sentinel` in `state_paths`. | .opencode/commands/deep/assets/deep_research_auto.yaml
iter 31 | ratio 0.47 | easy/quick-win | Add min-observation state to deferred ideas before promotion. | ?
iter 32 | ratio 0.58 | med/quick-win | Replace equality-only registry drift guard with a generator freshness check for TS/Python advisor projection f | ?
iter 33 | ratio 0.69 | hard/deep-rewrite | Add a distinct unattended lifecycle envelope to SpecKit complete. | ?
iter 34 | ratio 0.73 | easy/quick-win |  | ?
iter 35 | ratio 0.74 | med/quick-win | Fire the per-iteration memory upsert after post_dispatch_validate, step_reduce_state, and step_graph_upsert; k | ?
iter 36 | ratio 0.71 | med/quick-win | Add a context init graph-seed step immediately after step_seed_frontier so frontier_slices_json becomes real S | ?
iter 37 | ratio 0.76 | easy/quick-win | Thread dry-run as a first-class command/tool input, not a separate workflow mode. | .opencode/commands/deep/research.md:109-116; .opencode/commands/deep/assets/deep_research_confirm.yaml:28-33
iter 38 | ratio 0.64 | med/quick-win | Use a checked-in generated projection artifact on the advisor hot path, while keeping mode-registry.json reads | ?
iter 39 | ratio 0.62 | med/quick-win | Add before/after fixture-matrix outcome delta to model benchmark reports. | ?
iter 40 | ratio 0.55 | med/quick-win | loop-cli exposes nextRunAt and remainingDelayMs in durable loop state; OUR deep-research config/session schema | .opencode/commands/deep/assets/deep_research_auto.yaml
iter 41 | ratio 0.54 | med/quick-win | Author an ADR for a declarative convergence profile contract before migrating code. | ?
iter 42 | ratio 0.48 | easy/quick-win | Make deep-loop-runtime tests hermetic before state, lock, crash-resume, or fan-out rewrites. | .opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts
iter 43 | ratio 0.34 | hard/deep-rewrite | Kasper's full state store is a deep rewrite, not a drop-in for atomic-state.ts. | ?
iter 44 | ratio 0.42 | med/deep-rewrite |  | ?
iter 45 | ratio 0.45 | hard/deep-rewrite | Do not add waves until fan-out config has dependency and write-domain metadata. | .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts
iter 46 | ratio 0.5 | hard/deep-rewrite | Split deep-improvement promotion into candidate accepted versus canonical shipped. | .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs
iter 47 | ratio 0.37 | easy/quick-win | loop-cli-main's portable liveness mechanism is lifecycle persistence, not the socket itself. OUR file lock is  | .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts
iter 48 | ratio 0.43 | hard/deep-rewrite | Adopt a merge ADR: reducer owns conflict resolution, inbox and strategy are inputs/projections, and no raw wri | ?
iter 49 | ratio 0.57 | med/quick-win | Add a canonical deep-loop observability envelope helper around producer-native payloads. | ?
iter 50 | ratio 0.62 | easy/quick-win | Add reusable record/replay helpers beside spawnCjs so runtime tests can capture normalized argv, stdin, stdout | ?
