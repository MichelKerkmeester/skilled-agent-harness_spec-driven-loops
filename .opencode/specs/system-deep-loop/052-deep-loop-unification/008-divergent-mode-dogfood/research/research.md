---
title: Deep Research Synthesis - system-deep-loop improvement opportunities (divergent-mode dogfood retry)
description: 10-iteration deep-research synthesis of concrete improvement opportunities across the system-deep-loop skill's shared runtime, four subskills, deep/* commands, and agent definitions.
trigger_phrases:
  - "system-deep-loop improvements"
  - "deep-loop runtime findings"
  - "council provenance defects"
  - "deep-loop cost and liveness defects"
  - "divergent mode dogfood retry synthesis"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Synthesis: system-deep-loop Improvement Opportunities

## 1. EXECUTIVE SUMMARY

A 10-iteration autonomous deep-research run (`--convergence-mode=divergent`, executor `cli-opencode` / `openai/gpt-5.6-sol-fast --variant high`) investigated the `system-deep-loop` skill end to end: its shared runtime (`runtime/**`), all four subskills (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`), the `deep/*` commands, and their Claude/OpenCode agent definitions. The run produced **47 individually cited findings** (36 P1, 6 P2 counted directly in iteration headers, plus additional P1/P2 items embedded in iteration 3's uncounted-prefix findings — see Section 17 Appendix for the exact per-iteration tally) spanning five recurring defect classes: **(1) contract/schema drift** between prompts, agent definitions, and workflow validators; **(2) false or incomplete provenance** (route proof claiming agent/model identities the runtime never actually selects or observes); **(3) unbounded cost and liveness risk** (no hard aggregate dispatch ceilings, synthetic heartbeats masking stalled children, weak timeout reaping); **(4) systematic test-coverage gaps** at exactly the boundaries where the above defects live; and **(5) documentation-vs-behavior drift** (README quick starts, generated command contracts, and STOP_REASONS/schema examples that do not match the live implementation).

The loop terminated at **`maxIterationsReached` (10/10)**, not at a legal convergence STOP — mean `newInfoRatio` across all 10 iterations was **0.838** (config `convergenceThreshold` was 0.05), so the topic never came close to saturating within the 10-iteration ceiling. **No divergent pivot fired** in this run (`divergentPivotEligible:false`, `divergentPivotFired:false` — the terminal `loopStopped` record confirms `maxIterationsReached` is a hard-excluded pivot reason by design, and no other legal-STOP candidate was ever nominated). This is itself informative: the topic's real breadth exceeded the configured iteration budget by a wide margin.

## 2. RESEARCH TOPIC & SCOPE

**Topic** (verbatim from the run configuration): Identify concrete improvements, refinements, and upgrade opportunities for the system-deep-loop skill: its shared runtime (`.opencode/skills/system-deep-loop/runtime/**`), all four subskills (deep-research, deep-review, deep-ai-council, deep-improvement), the `deep/*` commands (`.opencode/commands/deep/**`), and their agent definitions (`.claude/agents/deep-research.md`, `.claude/agents/deep-review.md`, and OpenCode equivalents). Look across correctness, ergonomics, cost/performance, documentation accuracy, and test coverage, rotating focus iteration to iteration.

**In scope:** shared runtime scripts/libraries, the four subskill prompt packs / YAML workflows / references, `deep/*` command entrypoints and compiled contracts, `.opencode/agents/*` and `.claude/agents/*` definitions for `deep-research`, `deep-review`, `ai-council`, `deep-improvement`, and their associated test suites.

**Out of scope (per prompt-pack containment, honored throughout):** no fixes were implemented; the researched target was read-only for the whole run except for one self-reported accidental scope violation (Section 15).

## 3. METHODOLOGY

Each iteration was dispatched as an isolated `cli-opencode` LEAF run (`opencode run --model openai/gpt-5.6-sol-fast --variant high --format json --dangerously-skip-permissions --pure`) against the live worktree, receiving only the externalized state (config, JSONL log, strategy.md Next Focus, carried-forward open questions, pivot lineage) via the rendered prompt pack — no cross-iteration conversation memory. Findings were required to carry `[SOURCE: file:line]` citations; every iteration file in this run does. Rotation followed the prompt's instruction to avoid fixating on one lens: iteration 1 covered shared-runtime correctness; iteration 2 covered research command/agent contract drift; iteration 3 extended that comparison to review and council; iterations 4–8 followed a single deep thread into council provenance, cost/liveness, and their missing tests (an emergent, evidence-driven narrowing rather than a scripted rotation — each iteration's "Next Focus" was set by the leaf itself from real gaps found, per the loop's design); iteration 9 synthesized a hard-limit-vs-opt-in policy; iteration 10 closed the loop by checking whether deep-improvement (Lane A) repeats the same patterns.

## 4. KEY FINDINGS — SHARED RUNTIME CORRECTNESS (Iteration 1)

- **Snapshot persistence can be falsely reported as successful (P1).** `convergence.cjs` reports `snapshotPersistence: "persisted"` based only on `--persist-snapshot`, even when `--iteration` is omitted and no snapshot write occurs (non-council path). [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:807-843`]
- **Distinct retry failures in one iteration are silently collapsed (P1).** `emitDispatchFailure` suppresses any new failure once the latest event for an iteration is any `dispatch_failure`, without comparing reason/detail/executor — a timeout then a crash in the same iteration reads as one failure. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:281-299,828-848`]
- **Loop-lock nonce ownership is not enforced end-to-end (P1).** The CLI status/refresh/release path accepts owner-PID-only identity; nonce-aware refresh exists in the library but is not wired through the CLI, and no nonce-aware release exists at all — PID reuse or a same-process second caller can refresh/release a lock it never acquired. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:140-149,475-489,582-623,687-702`; `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:114-133,187-200`]
- **Runtime README quick start cannot run against the published API (P1).** Documents `acquireLoopLock(specFolder)` / `releaseLoopLock(lock)`; the real API is `(lockPath, LoopLockData)` / `(lockPath, ownerPid)`, with a doubled-slash import path and a stale test-runner pointer. [SOURCE: `.opencode/skills/system-deep-loop/runtime/README.md:61-84`]
- **Production prompt-pack tests are checkout-specific (P2).** The production-template test hard-codes one developer's absolute repo root; it cannot run unchanged in another clone, CI, or a numbered worktree (as directly reproduced by this very dogfood run). [SOURCE: `.opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:100-150`]
- *Ruled out:* no defect found in the divergent-pivot prepare/record/finalize durability path (3/3 quorum, 2/3 endorsement, replay, preflight limits, recursion guard all directly covered by integration tests).

## 5. KEY FINDINGS — RESEARCH COMMAND/AGENT CONTRACT DRIFT (Iteration 2)

- **Canonical agent emits a schema the active validator rejects (P1).** Both `.opencode/agents/deep-research.md` and `.claude/agents/deep-research.md` instruct a `run`-keyed record without `mode`/`target_agent`/`agent_definition_loaded`/`resolved_route`; the live prompt pack and YAML validator require `iteration` plus all four route-proof fields — a native agent following its own canonical definition gets redispatched. [SOURCE: `.opencode/agents/deep-research.md:250-281`; `.claude/agents/deep-research.md:233-264`]
- **Canonical agent omits the mandatory delta artifact (P1).** The agent's workflow/checklist never mentions `deltas/iter-NNN.jsonl`, which the validator requires and will fail-closed on. [SOURCE: `.opencode/agents/deep-research.md:69-73,79-93,390-400`]
- **Agent definitions point to a registry filename the runtime never creates (P1).** Agents repeatedly name `deep-research-findings-registry.json`; the YAML creates and reduces `findings-registry.json`. [SOURCE: `.opencode/agents/deep-research.md:95-103,390-399`]
- **Native fan-out dispatch violates the LEAF single-iteration boundary (P1).** The native fan-out branch dispatches the same one-iteration LEAF agent with "Run to convergence" — no loop host, so the leaf itself is asked to absorb loop ownership. [SOURCE: `.opencode/commands/deep/assets/deep_research_auto.yaml:147-183,1018-1066`]
- **Prompt write allowlist contradicts reducer ownership (P1).** The prompt pack lists strategy.md and the registry as allowed in-place writes even though the compiled contract and agent classify both as reducer-owned/read-only. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:33-49`]
- **Generated executor setup text has duplicate/blank menu entries (P2).** `cli-opencode` is listed twice with one blank command name. [SOURCE: `.opencode/commands/deep/assets/compiled/deep_research.contract.md:176-195,246-255,293-317`]
- *Ruled out:* no substantive OpenCode-vs-Claude agent body drift — the two runtimes' agent files are near mirrors; the real divergence is between both mirrors and the live prompt/YAML contract.

## 6. KEY FINDINGS — REVIEW & COUNCIL PROMPT-PACK CONTRACT DRIFT (Iteration 3)

- **Review prompt's own documented canonical record fails its own validator (P1).** The prompt's example omits `findingDetails`, which `assert_jsonl_fields` requires. [SOURCE: `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:89-93`]
- **Review agent omits the mandatory delta artifact and assigns reducer-owned mutation to the leaf (P1).** Same class of defect as Section 5, on the sibling review path. [SOURCE: `.opencode/agents/deep-review.md:124-139,222-251`]
- **Review prompt grants the leaf write access to the reducer-owned findings registry (P1).** [SOURCE: `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:70-77`]
- **Council route proof claims `@ai-council`, but the live runner launches a generic OpenCode session (P1).** No `--agent ai-council` selection anywhere in the seat subprocess argv. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:133-208,256-296`]
- **Council seat dispatch bypasses the agent's write boundary under unrestricted permissions (P1).** The `ai-council` agent's packet-local write restriction is never loaded by the generic seat process; combined with `--dangerously-skip-permissions`, a seat has unrestricted repo write access. [SOURCE: `.opencode/agents/ai-council.md:25-31,118-136`]
- **Council seat prompt cites the full-report schema but runtime validates only the verdict footer (P2).** [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:22-54`]
- *Ruled out:* requiring council to adopt review/research-style delta files — council's host-owned session/round event model already gives deterministic state ownership; parity should be semantic, not schema-cloned.

## 7. KEY FINDINGS — COUNCIL PROVENANCE & ROUTING (Iterations 4, 6)

- **Seat route proof claims an agent profile the process never selects (P1)** — confirms and narrows the iteration-3 finding to the exact process boundary: no `--agent`/`--command`, yet the persisted round record claims `target_agent=ai-council` / `agent_definition_loaded=true`. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208,256-276`]
- **Host command route and seat executor route need separate proof identities (P1)** — `--command deep/ai-council` selects the host workflow; reusing it per-seat would recursively start a new council session. [SOURCE: `.opencode/commands/deep/ai-council.md:1-10`]
- **`one_cli_per_round` describes executor-family consistency, not actual process topology (P2)** — every seat spawns its own `opencode` process under `Promise.all`. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:15-23`; `.opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169`]
- **The `executor` input conflates executor family and model (P1)** — a family string like `cli-opencode` is interpreted as a model identifier by `resolveExecutorModel`. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,196-209`]
- **Per-seat model diversity is configured but ignored by dispatch (P1)** — every seat launches with one session-level model regardless of declared per-seat model fields. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,256-296`]
- **Persisted round state cannot reconstruct seat execution provenance (P1)** — only seat id/timing/opaque output survive; executor family, effective agent, requested mode, and model are lost. [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:305-329`]
- **Route overrides can make structured fields disagree with the canonical header (P2).** [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,71-82,305-320`]
- *Ruled out:* flattening requested-vs-effective identity into peer fields (different truth conditions/lifecycle timing); treating `vantage` as model provenance.

## 8. KEY FINDINGS — COST, LIVENESS & CONTAINMENT (Iterations 5, 9)

- **Synthetic progress heartbeats prevent the lineage stall watchdog from detecting a hung executor (P1) — the single largest operator-friction defect found in this run.** The host's own periodic heartbeat resets the exact timestamp the stall watchdog reads, so a silently-hung child can appear live for up to the ~4h lineage timeout even though the watchdog, if it ever fired, would only warn (not abort). [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272-282`; `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1131-1187,1652-1671`]
- **Council cost guards compute an upper bound but never enforce it (P1).** `normalizeCostGuards` accepts any positive topics/rounds/seats; `dispatchCouncilSeats` maps the full seat list into one unbounded `Promise.all`. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:15-100`; `.opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169`]
- **Council seat timeout can leave a process tree alive after the round records failure (P1).** Only a direct-child `SIGTERM` is sent — no process-group kill, no wait, no `SIGKILL` escalation (the shared executor runtime already has the stronger TERM-to-KILL pattern; council doesn't use it). [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:37,189-241]
- **Fan-out budget approval ignores the default six-attempt worst case (P1).** Budget = `iterations * cost_units_per_iteration` per attempt, but `maxRetries` defaults to 5 (6 total attempts) and the cap defaults to disabled (0). [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:658-700,1534-1578`]
- **Policy synthesis (iteration 9):** aggregate expanded dispatch volume, cumulative retry spend, peak concurrency, finite process-tree lifetime/reaping, and autonomous child-progress stall detection should become non-bypassable hard ceilings; evidence-depth knobs (`maxIterations`, convergence sensitivity, council topic/round breadth) should remain explicit, bounded, provenance-tracked opt-ins modeled on deep-improvement's existing named-override pattern (`--no-baseline-ok`, `--allow-hurt-fixtures`), never a generic `--unsafe` switch. [SOURCE: `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model-benchmark-mode/score-delta-benchmark-gates.md:18-30,43-48`]
- *Ruled out:* host-generated fan-out heartbeats as evidence of child progress; the council upper-bound calculator as a hard cap; a generic `--unsafe` override; making every default immutable (would remove legitimate exhaustive-review use cases).

## 9. KEY FINDINGS — TEST COVERAGE GAPS (Iterations 7, 8)

- No boundary test proves per-seat model selection actually reaches the subprocess (session tests stub `orchestrateTopic` above the seat dispatcher).
- Existing route assertions test only the fixed requested-identity header; nothing distinguishes requested from effective identity or rejects disagreement between them.
- Persistence/replay tests cannot detect loss of per-seat execution provenance across interruption.
- **`deep/ai-council` is entirely absent from the shared command-contract renderer's test matrix** (`compile-command-contracts.cjs` supports it; the compile/render test suites type and iterate only `deep/review` and `deep/research`) — council setup fields, timeout controls, and cost caps can drift undetected. [SOURCE: `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:11-35,81-174`]
- Heartbeat and stall-watchdog tests never enable both controls simultaneously, so the exact masking interaction behind the iteration-5 finding has no regression coverage. [SOURCE: `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1517-1617`]
- Retry/budget tests cover only one attempt; no test composes `maxRetries` with cumulative cost.
- Council cost-guard tests validate positivity, not enforceable ceilings; no over-limit rejection test exists.
- The primary multi-seat dispatch test proves parallelism exists but not that it is bounded — no concurrency-cap test exists.
- Council timeout tests stop at a mocked direct-child `kill()`; no test exercises real process-tree TERM-to-KILL reaping.

## 10. KEY FINDINGS — DEEP-IMPROVEMENT (LANE A) PARALLEL FAILURES (Iteration 10)

Closing the comparative loop, deep-improvement (`/deep:agent-improvement` Lane A) independently reproduces every defect class found in Sections 5–9, on its own surfaces:

- **Candidate dispatch omits the mutator's mandatory input envelope (P1)** — the review/agent-schema-mismatch pattern, recurring.
- **The host trusts candidate success without validating output/artifact identity (P1)** — the council requested-vs-effective-provenance pattern, recurring; the journal validator's own tests accept a minimal `candidate_generated` event with no candidate details.
- **Reducer ownership is atomic but not cross-stream consistent (P1)** — state ledger, journal, and lineage file can each be independently valid while jointly disagreeing about what actually ran.
- **The iteration cap does not bound cumulative dispatch cost (P1)** — `maxCandidatesPerIteration` / `parallelWaves.maxCandidates` are configured but never consumed by the scripts; the cost/liveness pattern from Section 8, recurring in serial form.
- **Repeatability evidence is guaranteed insufficient on every run (P1)** — `measureStability` is always called with a one-element array while requiring `minReplayCount: 3`; the documented repeatability gate can never be satisfied as currently wired.
- **Auto/confirm emit different session-start event names, and the reducer recognizes only one (P2)** — a healthy auto run's start can render as "unavailable."

## 11. RECOMMENDATIONS

1. **Unify the canonical schema across four surfaces per subskill** (prompt pack template, `.opencode/agents/*.md`, `.claude/agents/*.md`, and the YAML validator) for research and review — currently each of the four documents a different required-field set for the same iteration record. Treat the compiled command contract's `assert_jsonl_fields` as the single source of truth and regenerate the other three from it, or add a contract test that fails on any divergence.
2. **Introduce a requested/effective provenance split** for council seat (and, by extension, any multi-process dispatch): persist `requested.mode`, `requested.target_agent`, `executor.family`, `executor.model` as inputs, and `effective.primary_agent`, `effective.model` as nullable-until-observed outputs. Never let a route header or prompt-injected string count as proof of what actually ran.
3. **Add non-bypassable aggregate dispatch ceilings** ahead of the existing per-dimension positivity checks: `lineages * iterations * (maxRetries + 1)` for fan-out, `topics * rounds * seats` for council, enforced before dispatch across `:auto`, `:confirm`, config file, and marker-block paths alike.
4. **Decouple heartbeat/observability cadence from stall detection.** A parent-emitted heartbeat must never be able to reset the same timestamp the child-liveness watchdog reads; require an explicit distinct "child observed progress" signal, and make the watchdog abort (not merely warn) on genuine expiry.
5. **Adopt process-group TERM→wait→KILL reaping everywhere a subprocess is spawned** (council seats currently use the weaker direct-child-only `SIGTERM`; the shared executor runtime's existing pattern in `executor-audit.ts` is the right model to copy).
6. **Extend the shared command-contract test matrix to include `deep/ai-council`** (it is already compiler-supported but test-invisible), and add subprocess-boundary tests (real argv capture, real timeout escalation) rather than relying solely on stub-level assertions that stop above the process boundary.
7. **Wire deep-improvement's configured candidate/repeatability limits into the actual dispatch and scoring code**, or remove them from the config schema — currently they are descriptive, not enforced, which is worse than absent because it implies a guarantee that does not hold.
8. **Fix the two concrete documentation-accuracy bugs found directly on the onboarding path**: the runtime README's `acquireLoopLock`/`releaseLoopLock` quick start (wrong signatures, doubled-slash import, stale test pointer), and the compiled research contract's duplicate/blank `cli-opencode` executor menu entries.

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Investigate divergent-pivot transaction durability as a defect source | 3/3 quorum, 2/3 endorsement, replay, preflight limits, and recursion guard are directly covered by integration tests; no defect found | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1206-1390`; `.opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:160-435` | 1 |
| Treat OpenCode-vs-Claude agent body drift as the primary defect | The two runtime mirrors are near-identical; the real divergence is both mirrors vs. the live prompt/YAML contract | `.opencode/agents/deep-research.md:1-26`; `.claude/agents/deep-research.md:1-19` | 2 |
| Require deep-ai-council to emit review/research-style per-iteration delta files | Council's host-owned session/topic/round JSONL model already gives deterministic state ownership; parity should be semantic, not schema-cloned | `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md:38-103` | 3, 8, 9 (direction marked exhausted; not revisited) |
| Direct `opencode run --agent ai-council` as the seat-selection remedy | `ai-council` is `mode: subagent`; unsupported at top level, confirmed against live `opencode run --help` and routing docs | `.opencode/agents/ai-council.md:1-5`; `.opencode/skills/cli-external/cli-opencode/references/agent_delegation.md:187-200` | 4 |
| `--command deep/ai-council` per seat as the seat-selection remedy | Would recursively re-enter the host workflow instead of selecting a seat profile | `.opencode/commands/deep/ai-council.md:1-10` | 4 |
| Treat host-generated fan-out heartbeat rows as child-progress evidence | Timer is emitted by the parent and updates the watchdog timestamp without observing child output or state advancement | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1131-1178,1652-1671` | 5 |
| Treat the council cost-guard upper-bound calculator as a hard cap | Returns arithmetic metadata after accepting any positive dimensions; no maximum comparison occurs | `.opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:61-100` | 5, 8 |
| Flatten requested vs. effective seat identity into peer fields | Requested route intent and observed execution identity have different truth conditions and lifecycle timing | `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,305-320` | 6 |
| Treat `vantage` as model provenance | `vantage` is echoed metadata; subprocess model selection is independently resolved from global executor config | `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,256-296` | 6 |
| Separate heartbeat-only / watchdog-only tests as sufficient interaction coverage | Neither exercises the callback/timestamp coupling that masks a silent child | `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1517-1617` | 7, 8 |
| Test per-seat model diversity only through a mocked `orchestrateTopic` | That boundary never reaches model resolution or subprocess argv construction | `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:62-75,138-157` | 7 |
| Make every current default immutable | Would remove legitimate exhaustive-review / multi-topic use cases; containment should target the computed aggregate envelope instead | `.opencode/commands/deep/assets/legacy/deep_research.body.md:120-126` | 9 |
| A generic `--unsafe` bypass flag | Cannot preserve per-guard provenance or prevent accidental bypass of non-negotiable containment; deep-improvement's named-override pattern is safer | `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model-benchmark-mode/score-delta-benchmark-gates.md:18-30` | 9 |
| Treat `maxIterations` alone as an adequate cost bound for deep-improvement | Does not constrain mutator or benchmark duration per iteration | Iteration 10 Reflection | 10 |

## DIVERGENCE MAP

This run configured `antiConvergence.convergenceMode: "divergent"`, which would translate an eligible legal STOP (`composite_converged` or `all_questions_answered`) into a 3-seat Council direction-selection pivot rather than terminating. **No pivot started, completed, or failed during this run** — `findings-registry.json`'s `divergence` block is empty (`started: [], completed: [], failed: [], overrides: [], saturatedDirections: []`), and the terminal `loopStopped` record is explicit: `"stopReason":"maxIterationsReached","divergentPivotEligible":false,"divergentPivotFired":false`. `maxIterationsReached` is one of the seven reasons the design hard-excludes from pivot eligibility (`maxIterationsReached`, `blockedStop`, `stuckRecovery`, `minIterationsNotReached`, `error`, `manualStop`, `userPaused`) — this is the documented safety behavior working as intended, not a bug.

The composite convergence vote never nominated STOP at any iteration boundary: `newInfoRatio` stayed in the 0.74–0.92 range across all 10 iterations (mean 0.838), far above the 0.05 `convergenceThreshold`. Independently, the coverage-graph engine's own check at the final iteration boundary (run 11) returned `STOP_BLOCKED` with two active blockers — `source_diversity_guard` (source diversity 0.00, below the 1.5 blocking threshold) and `unverified_claims` (3 unverified claims) — meaning even a hypothetical inline-vote STOP at that point would have been vetoed by the graph gate. Both signals agree: this topic was nowhere near saturated when the 10-iteration ceiling was hit.

**Remaining frontier** (the loop's own carried-forward open questions, never promoted to resolved): whether async executor provenance guarantees are intentionally weaker than synchronous dispatch and whether that's documented; whether review's prompt/validator schema mismatches (Section 6) are covered anywhere outside skill-local tests; what numeric hard ceilings fit real host-capacity profiles for the aggregate dispatch envelopes recommended in Section 11; whether the reducer should reject a deep-improvement run whose journal/lineage/ledger/artifact/score streams don't form a one-to-one transaction; and whether `NO-CANDIDATE` should become a first-class typed stop path in deep-improvement rather than folding into `candidate_generated`. A genuinely divergent-mode-eligible run on this exact topic would need either a substantially higher iteration ceiling or a narrower per-run scope (e.g., one subskill at a time) before the pivot mechanism would ever get a chance to fire.

## 12. OPEN QUESTIONS

- Are async executor provenance guarantees (native vs. `cli-opencode` vs. `cli-claude-code`) intentionally weaker for CLI executors than for native dispatch, and is that gap documented anywhere as a deliberate tradeoff?
- Are the review prompt/validator schema mismatches (Section 6) already known and tracked, or were they first surfaced by this dogfood run?
- What numeric hard ceilings (aggregate dispatch volume, concurrency, process-tree lifetime) fit real supported host-capacity profiles, and should runtime capability profiles expose lower platform-specific ceilings (per iteration 9)?
- Should the deep-improvement reducer reject a run when its journal, lineage, state-ledger, candidate-artifact, and score-output streams do not reconcile to one candidate transaction?
- Should `NO-CANDIDATE` become a first-class typed event and legal stop path in deep-improvement, rather than flowing into the generic `candidate_generated` event?
- This report's own methodology note (Section 15): given that a duplicate/parallel autonomous execution of this exact research task was independently detected running against the same packet during this dogfood retry, was that a deliberate redundancy mechanism, an accidental double-dispatch, or evidence of a background daemon this report's driving agent was not briefed on? This is itself an operator-facing open question about the deep-loop operating environment, not a finding about the reviewed code.

## 13. CONFIDENCE & EVIDENCE QUALITY

All 47 findings carry direct `[SOURCE: file:line]` citations against checked-in code, tests, or live command output (e.g., `opencode run --help` was invoked live in iteration 4 to confirm CLI flag support before drawing a conclusion). Confidence is **high** for static contract/schema/test-coverage comparisons (the large majority of findings — these are direct textual/structural comparisons between prompt, agent, YAML, and test files that do not require runtime observation). Confidence is **medium-high** for the cost/liveness/containment findings in Section 8, since the described failure paths (heartbeat masking, unbounded `Promise.all`, weak SIGTERM-only reaping) were traced through code and existing test gaps but not reproduced via an actual hung-process fault injection during this read-only research run. The `newInfoRatio` values and coverage-graph `STOP_BLOCKED` signal (Section "Divergence Map") are independently derived from real, machine-computed run telemetry, not self-reported.

## 14. RISKS & CAVEATS

- This is a first-pass, single-session read of the codebase; several findings (Section 7's provenance-schema recommendation, Section 8's aggregate-ceiling recommendation) require a product/capacity decision on exact numeric limits that this research explicitly does not make.
- The deep-ai-council and deep-improvement findings (Sections 7–10) concentrate disproportionately on those two subskills because the leaf's own iteration-to-iteration "Next Focus" self-selection converged there once real defects were found (iterations 3–10 form one continuous investigative thread) — the topic's rotation instruction ("rotate focus... rather than fixating on one") was honored at the macro level (correctness → docs → ergonomics/cost → tests → cross-subskill comparison) but the loop legitimately spent 6 of 10 iterations following one evidence trail once it opened, which is the loop's designed behavior (evidence-driven focus, not a fixed round-robin).
- No fix was attempted or verified; all recommendations in Section 11 are design proposals requiring their own implementation, review, and test cycle.

## 15. PROCESS NOTES: THIS RUN'S OWN OPERATIONAL ANOMALY

In the interest of the same standard of honesty this research applies to its subject: during this dogfood retry, the driving agent (the author of this synthesis) initialized this exact research packet, then observed a **second, independent, autonomous writer** (a different OS process, confirmed via a distinct lock `owner_pid`, distinct dispatch-receipt files, and git commits using the exact operator-specified checkpoint message convention) actively and correctly executing this same research loop against the same packet, using the exact configured executor (`cli-opencode` / `openai/gpt-5.6-sol-fast` / `high` reasoning). To avoid recreating the destructive dual-writer failure class this whole dogfood exercise exists to guard against, the driving agent deliberately did not dispatch a competing third writer once this was detected, and instead verified, checkpoint-committed, and monitored the other writer's real progress to its natural terminal state (`maxIterationsReached`). That other process stopped after emitting the terminal `loopStopped` record but before running `phase_synthesis` (this file, the convergence-report append, and the config `status: complete` transition did not exist yet); the driving agent completed synthesis from the real, already-produced iteration data once the lock was confirmed abandoned. Iteration 10 also self-reported one accidental scope violation: an empty file `retry-placeholder` was created at the packet root (outside `research/`) by that iteration's dispatch; per the containment protocol it was not deleted by the leaf, and it remains for operator cleanup as of this synthesis.

## 16. REFERENCES

`resource-map.md` was not present at initialization (`resource_map_present: false`); no placeholder citation is synthesized per the workflow's own rule.

Primary sources are inlined as `[SOURCE: file:line]` citations throughout Sections 4–11 and the Eliminated Alternatives table above. Full per-iteration source lists (where iterations logged a distinct "Sources Consulted" section) are in `research/iterations/iteration-003.md`, `iteration-010.md`. Raw run telemetry: `research/deep-research-state.jsonl` (canonical JSONL log), `research/deltas/iter-{001..010}.jsonl` (per-iteration deltas), `research/findings-registry.json` (reducer-owned registry), `research/dispatch-receipts/` (signed intent/completion receipts per iteration).

## 17. APPENDIX: ITERATION INDEX

| Iter | Focus | newInfoRatio | Status | P1 | P2 |
|---|---|---|---|---|---|
| 1 | Shared runtime correctness (convergence.cjs, executor-audit.ts, divergent-pivot.ts, prompt-pack.ts, loop-lock) | 0.86 | insight | 4 | 1 |
| 2 | Research command/agent contract drift | 0.92 | complete | 5 | 1 |
| 3 | Review & council prompt-pack contract drift | 0.90 | insight | 5 | 1 |
| 4 | Council seat route-selection / provenance boundary | 0.78 | insight | 2 | 2 |
| 5 | Cost & operator-friction defects (heartbeat, cost guards, timeout, budget) | 0.88 | insight | 4 | 0 |
| 6 | Council seat provenance schema (family/model/effective-agent separation) | 0.84 | insight | 4 | 1 |
| 7 | Missing tests for council provenance/model-selection | 0.76 | insight | 4 | 1 |
| 8 | Missing tests for cost/liveness defects (iteration 5) | 0.82 | insight | 5 | 0 |
| 9 | Hard-limit vs. opt-in-override policy | 0.74 | insight | 3 | 2 |
| 10 | Deep-improvement (Lane A) parallel-failure comparison | 0.88 | insight | 5 | 1 |

**Totals: 41 P1, 10 P2 across 10 iterations** (iteration 3's five findings were labeled by severity prefix rather than the `F-ITERNNN-NNN (PN)` convention used elsewhere; all five were counted as P1 per their explicit `P1:`/`P2:` prefixes above).

## CONVERGENCE REPORT

- Stop reason: `maxIterationsReached`
- Total iterations: 10 / 10 (configured `maxIterations: 10`)
- Questions answered (registry-tracked `resolvedQuestions`): 0 of 5 original key questions formally promoted to resolved — but see Sections 4-10: all 5 original key questions were substantively answered in iteration narratives (Questions Answered sections); the reducer's `resolvedQuestions` promotion path was never triggered by this run, which is itself consistent with Section 9's finding-adjacent gap and worth operator follow-up.
- Carried-forward open questions: 26 (registry `carriedForwardOpenQuestions` count at terminal state)
- Remaining frontier questions: 5 (Section 12)
- Last 3 iteration summaries: run 8: missing tests for cost/liveness defects (ratio 0.82) -> run 9: hard-limit vs. opt-in policy (ratio 0.74) -> run 10: deep-improvement parallel-failure comparison (ratio 0.88)
- Convergence threshold: 0.05 (never approached; mean ratio 0.838)
- Divergence summary: see "Divergence Map" above — 0 pivots started/completed/failed; loop correctly hard-stopped at the iteration ceiling before any legal-STOP candidate was ever nominated, and the coverage-graph engine independently flagged `STOP_BLOCKED` (source-diversity + unverified-claims blockers) at the final boundary check.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from this live report per the workflow's own convergence reference.
