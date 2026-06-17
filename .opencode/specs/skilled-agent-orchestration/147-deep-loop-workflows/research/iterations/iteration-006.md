# Deep-Research Iteration 006: Convergence and journal contract

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

I’ll treat this as low-blast, read-only research: first load the relevant memory/advisor context, then read the established context report and the specific runtime/improvement files before making one concrete recommendation.
SKILL ROUTING: advisor was ambiguous across the named deep-loop skills; because the user constrained this to read-only migration research, I’m not starting any workflow loop. I’ll load only the directly relevant runtime/improvement skill context, then inspect the requested files as evidence.
The required context report is now the source of truth; I’ll read it before inspecting the narrower convergence and journal files.
I confirmed the baseline’s key constraint for this angle: runtime already dispatches typed convergence for context/research/review/council, while improvement is called out as the non-graph-based outlier. I’ll now read the journal helper, stop-rule config, convergence script, and coverage-graph signal code directly.
The live files are under `.opencode/skills/...`, so citations will use those canonical paths.
The first pass shows a split: `improvement-journal.cjs` owns a concrete lifecycle/journal validator, while `convergence.cjs` owns graph convergence decisions but not a cross-mode journal. I’m checking the actual plateau/trajectory consumers now so the recommendation is based on shipped logic, not just config names.
The runtime coverage signals are structural graph metrics over node/edge types; improvement’s stop logic appears to be score-trajectory and candidate/mutation-domain state. I’m checking loop-type allow-lists and the exact reducer conditions before deciding whether to port or keep it divergent.
The allow-list confirms the runtime graph DB currently admits only `research`, `review`, and `context`; council is intentionally separate through `lib/council`, and improvement’s `loopType: "improvement"` is local JSON, not the runtime DB schema. I’ll do one final search for any runtime-owned stop/journal taxonomy before writing the recommendation.
A wrinkle emerged outside the runtime: some command YAMLs already refer to a “frozen STOP_REASONS enum” but include `userPaused`, while `improvement-journal.cjs` rejects anything outside its six reasons. I’m reading those snippets because they affect whether hoisting is safe as-is.
**Recommendation**
Hoist the canonical terminal taxonomy into `deep-loop-runtime`, but do not port deep-improvement onto the runtime coverage-graph convergence path. Runtime should own a shared lifecycle/journal contract for terminal reasons and outcomes, while `deep-loop-workflows` keeps each mode’s convergence math, legal-stop gates, reducer shape, and artifacts. Concretely: move the 6 `stopReason` values and 4 `sessionOutcome` values into a runtime journal contract, make event/gate validation mode-extensible, and keep improvement’s plateau/trajectory logic as a mode-local convergence adapter rather than adding `loopType: improvement` to `coverage-graph-db.ts` or `convergence.cjs`.

**Runtime Ownership**
The runtime does not currently own a conflicting terminal journal contract.

Evidence:
- `deep-loop-runtime` owns graph convergence decisions, not terminal outcomes. `script_interface_contract.md` exposes `graph_decision`, `graph_signals_json`, `graph_blockers_json`, `graph_stop_blocked`, and `graph_convergence_score`, with behavior limited to `CONTINUE`, `STOP_BLOCKED`, and `STOP_ALLOWED` `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md:73-81`.
- `convergence.cjs` has three hardcoded non-council weight paths: research, context, and review `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:116-150`.
- Runtime convergence validates only `research`, `review`, `council`, and `context` at the CLI layer `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:305-312`.
- Council is a special runtime branch through `lib/council`, not the shared coverage-graph DB `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:318-333`.
- Runtime decisions are computed as graph authorization values, then output as `graph_decision`; there is no `stopReason` or `sessionOutcome` field in the runtime payload `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:387-438`.

So the runtime contract is “can the graph authorize stop?”, while deep-improvement’s contract is “why did the session end and what happened to the candidate?”. Those are adjacent, not conflicting.

**Hoist The Taxonomy**
Hoist the terminal taxonomy, not the entire improvement-specific event schema.

Evidence:
- Deep-improvement explicitly freezes the six reasons and four outcomes in prose `.opencode/skills/deep-improvement/SKILL.md:464-471`.
- The helper exports and validates exactly those values: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; and `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly` `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:22-41`.
- `session_end` and `session_ended` are already validated for `details.stopReason` and `details.sessionOutcome` `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:104-114`.
- The helper is already a generic append-only JSONL primitive at its core: validate, mkdir, append line, read/replay `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:137-164` and `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:167-229`.
- Reducer consumption is already journal-summary oriented: it reads event counts, terminal stop reason, terminal session outcome, latest legal-stop, and latest blocked-stop `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:281-347`.

But do not hoist `VALID_EVENT_TYPES` and `LEGAL_STOP_GATES` as a closed global schema. They are improvement-shaped:
- Event types include `candidate_generated`, `candidate_scored`, `promotion_attempt`, `mutation_proposed`, and similar improvement-specific events `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:48-68`.
- `LEGAL_STOP_GATES` hardcodes five improvement gates: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate` `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:70-80`.
- The validator currently requires those five gates for every `legal_stop_evaluated` event `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:117-128`.

That five-gate rule cannot be global without flattening modes. Review has its own legal-stop system, context/research combine host saturation with graph authorization, and council has a separate session/topic/round model. The shared runtime contract should close over terminal `stopReason` and `sessionOutcome`, while event types and legal-stop gate schemas remain mode-registered extensions.

**Command-Layer Drift**
There is no runtime conflict, but there is command-layer drift that must be resolved before strict global validation.

Evidence:
- Research command YAML treats `userPaused` as a member of the frozen stop enum `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:554-562` and repeats it during synthesis `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:878-885`.
- Review command YAML does the same `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:659-663` and `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:1116-1120`.
- `improvement-journal.cjs` would reject `userPaused` as a terminal `details.stopReason` because it is not in `STOP_REASONS` `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:104-114`.
- Model-benchmark emits `legal_stop_evaluated` without `gateResults`, which the current helper validator rejects `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:176-181` versus `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:117-128`.

Implementation implication: the hoisted runtime contract needs a mode-aware adapter. Map `userPaused` to canonical `manualStop` for terminal contract purposes, while preserving mode-local event names and existing state-log artifacts where byte-identical parity requires it. Fix `legal_stop_evaluated` by making gate validation schema-driven per mode, not hardcoded to improvement’s five gates.

**Do Not Add `improvement` LoopType**
Deep-improvement should stay convergence-divergent by design for this migration.

Evidence:
- Runtime coverage graph type and schema exclude `improvement`: `LoopType = 'research' | 'review' | 'context'` `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:8-11`.
- Runtime DB schema enforces `loop_type IN ('research', 'review', 'context')` `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:203-207`.
- Runtime valid node kinds and relations are graph-domain schemas for research, review, and context only `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:169-199`.
- `coverage-graph-signals.ts` only models research, review, and context convergence signals `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:31-59`.
- `computeSignals` dispatches only research and context specially, otherwise review `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:674-682`.
- Deep-improvement’s local `LOOP_TYPE = 'improvement'` is in a JSON mutation-coverage helper, not the runtime SQLite coverage graph `.opencode/skills/deep-improvement/scripts/shared/mutation-coverage.cjs:17-23` and `.opencode/skills/deep-improvement/scripts/shared/mutation-coverage.cjs:109-117`.

The plateau/trajectory model only superficially resembles coverage-graph snapshots. Runtime graph convergence is substrate saturation: nodes, edges, relations, blockers, evidence, contradictions, agreement, and graph snapshots. Improvement convergence is candidate-score trajectory: exact repeated dimension scores, tie counters, benchmark aggregate plateaus, infra-failure counters, weak-benchmark counters, drift ambiguity, and promotion gates.

Evidence:
- Improvement config defines `maxConsecutiveTies`, infra failure caps, weak benchmark caps, drift ambiguity, dimension plateau, and `plateauWindow` `.opencode/skills/deep-improvement/assets/agent_improvement/improvement_config.json:61-68`.
- Improvement config separately defines trajectory `minDataPoints` and `stabilityDelta` `.opencode/skills/deep-improvement/assets/agent_improvement/improvement_config.json:79-82`.
- `mutation-coverage.cjs` determines convergence eligibility from the last N dimension-score data points and a stability delta `.opencode/skills/deep-improvement/scripts/shared/mutation-coverage.cjs:319-370`.
- `reduce-state.cjs` stops on trailing ties, infra failures, weak benchmark runs, drift ambiguity, exact dimension plateau, and benchmark aggregate plateau `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:841-945`.
- Deep-improvement prose explicitly warns that the +/-2 trajectory eligibility and exact-repeat plateau stop are different checks and must not be conflated `.opencode/skills/deep-improvement/SKILL.md:422-426`.

Porting this to `coverage-graph-signals.ts` would require inventing candidate/mutation/score node kinds, adding relations, changing the DB CHECK constraint, updating TypeScript `LoopType`, adding a fourth signal union, and proving byte-identical decisions. That is behavior work, not a migration reorg.

**Concrete Change Set**
1. Add a runtime journal contract module such as `.opencode/skills/deep-loop-runtime/lib/deep-loop/journal-contract.cjs` or `.ts`.
2. Add a runtime CLI wrapper such as `.opencode/skills/deep-loop-runtime/scripts/journal.cjs` preserving JSON-only stdout and the current `--emit`, `--journal`, `--details`, `--read` behavior.
3. Move the canonical `STOP_REASONS` and `SESSION_OUTCOMES` there exactly as the six and four current values.
4. Make `LEGAL_STOP_GATES` mode-registered, with improvement’s five gates as the improvement schema only.
5. Make event validation extensible by mode, with shared validation for terminal `session_end` and optional validation for mode-local event types.
6. Update future `.opencode/skills/deep-loop-workflows/...` improvement scripts and command YAMLs to call the runtime journal CLI instead of an improvement-owned helper.
7. Update `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md`, `.opencode/skills/deep-loop-runtime/SKILL.md`, and `.opencode/skills/deep-loop-runtime/README.md` to document the journal contract separately from graph convergence.
8. Do not add `improvement` to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`.
9. Do not add `improvement` to `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.
10. Keep `.opencode/skills/deep-loop-workflows/scripts/shared/mutation-coverage.cjs` mode-local or rename it to reduce confusion, but do not merge it into runtime `lib/coverage-graph`.

**Rejected Alternatives**
- Reject “hoist nothing”: the current deep-improvement terminal taxonomy is already the only validated stop/outcome contract, and other command YAMLs are already trying to reference a frozen enum without a real shared owner.
- Reject “hoist the full helper verbatim”: its legal-stop gates and event vocabulary are improvement-specific and would flatten review, research, context, and council.
- Reject “add `improvement` to runtime `convergence.cjs` now”: it requires a schema migration and a semantic conversion from score trajectory to graph saturation, with no evidence that byte-identical artifacts can survive.
- Reject “map plateau to graph momentum”: runtime momentum is a delta between persisted graph signal snapshots `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:391-397`; improvement plateau is exact or tolerance-banded score repetition over candidate dimensions, not graph topology.

**Risks**
- The word `coverageGraph` in improvement config currently points to `improvement/mutation-coverage.json`, not the runtime SQLite coverage graph `.opencode/skills/deep-improvement/assets/agent_improvement/improvement_config.json:75-78`; this naming can cause a bad migration.
- If the hoisted journal validator is applied to existing research/review state logs without an adapter, `userPaused` will fail or behavior will change.
- If model-benchmark keeps emitting `legal_stop_evaluated` without `gateResults`, a strict hoisted validator will fail current commands.
- If an implementer adds `improvement` to the runtime DB CHECK constraint, the change becomes a database migration and breaks the “structure/docs reorg only” acceptance bar.
- If shared journal emission creates new files for non-improvement modes, artifacts will no longer be byte-identical.

**Dependencies**
- Q-ARCH 1/2 must decide the internal merged tree layout before final path rewrites.
- Q-CMD 5/6 must decide whether the existing 8 commands and YAML workflows stay stable or move behind a common host.
- Q-BACKEND 7 must decide reducer plumbing boundaries, because journal summaries are reducer-consumed.
- Q-IMPROVE 12 must decide Lane C and Lane D mode boundaries, because Lane D has its own external loop and stop taxonomy.
- Q-ADVISOR 13 must preserve per-mode routing after the skill-id collapse, because journal/convergence names will otherwise blur user intent.

**Uncertainty**
I’m uncertain whether paused-run artifacts are in the byte-identical acceptance fixture set. If they are, `userPaused` must remain in legacy mode-local state logs and only normalize through a new shared summary layer. If they are not, command YAMLs can be corrected to use `manualStop` as canonical terminal `stopReason` with `event: userPaused` retained as mode-local context. The resolving evidence is the parity fixture set for packet 123/006 or the planned single-executor artifact comparator.

Read-only status: no files were modified.
