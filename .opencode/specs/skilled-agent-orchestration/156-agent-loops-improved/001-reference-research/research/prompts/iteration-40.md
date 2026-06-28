DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 6 (synthesis) | Iteration: 40 of 58
Questions: 0/73 checked | Last focus: S5-10
Last 2 ratios: 0.64 -> 0.62 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: [S6-01].

Research Topic: Mine two vendored reference repos (read-only) to produce a ranked, actionable backlog of improvements to OUR loop systems (deep-loop-runtime, deep-loop-workflows, system-spec-kit commands/agents, skill interconnection, UX, automation). Dimensions D1 source-mining / D2 target-mapping / D3 cross-cutting / D4 synthesis. Every finding: reference file:line + exact OUR target file + port-difficulty + quick-win/deep-rewrite tag.

Reference repos (read-only, absolute paths):
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper

Iteration: 40 of 58
Dimension this iteration: D4 (synthesis)
Focus Area: [S6-01] What would it take to port loop-cli's persisted-remaining-delay crash-resume into our loop (state schema, persist point, resume classification in `step_classify_session`), and the migration risk for in-flight sessions? (build on S1-01, S3-11) -> fanout-run.cjs + deep_research_auto.yaml

Remaining Key Questions (context — do NOT answer all; stay on the Focus Area):
- [S1-01] How does loop-cli-main persist `remainingDelayMs` (loop-controller.ts:waitForDelay) and reconstruct a partially-elapsed wait after a crash without restarting the interval? → our deep-loop-runtime/scripts/fanout-run.cjs
- [S1-02] How does loop-cli-main compose abortable chunked sleep (shared/sleep.ts + SLEEP_CHUNK_MS + AbortSignal.any) so a long wait is promptly cancellable and pause-interruptible? → deep-loop-runtime sleep primitive
- [S1-03] How does loop-cli-main's triggerNow() save/restore the schedule around a forced run and guard against double-run? → deep_research_auto.yaml run-now control
- [S1-04] What are the legal transitions in loop-cli-main's running/waiting/paused/idle/stopped state machine and how does resumeResolve gate the wait loop? → deep-loop-runtime lifecycle
- [S1-05] How does loop-cli-main detect interval overrun and account for skipped iterations (skippedCount) under fixed-rate scheduling? → deep-loop-runtime iteration cadence
- [S1-06] How does loop-cli-main slice one append-only log into per-run regions via byte offsets (log-parser.ts, runHistory[].logOffset)? → deep-loop-workflows iteration logging
- [S1-07] How does loop-cli-main chain conditional follow-up tasks (onSuccessTaskId/onFailureTaskId, chainGroupId) and stop infinite chains? → deep-loop-runtime/lib/deep-loop/fallback-router.ts
- [S1-08] How does loop-cli-main's daemon (state.ts) implement serialize-diff persistence (write only when the snapshot changes)? → deep-loop-runtime/lib/deep-loop/atomic-state.ts
- [S1-09] How does loop-cli-main guarantee single-flight via socket-bind-before-init (daemon/server.ts) vs a lockfile? → deep-loop-runtime/lib/deep-loop/loop-lock.ts
- [S1-10] How does loop-cli-main detect a stale daemon by code-signature mismatch and restart it (daemon/manager.ts)? → deep-loop-runtime process management
- [S1-11] What does loop-cli-main's typed discriminated-union IPC contract look like (client/ipc.ts, types.ts) and how does the type tag drive exhaustive handling? → deep-loop-runtime script stdout contracts
- [S1-12] What are the exact rules of loop-cli-main's AGENTS.md WAVE MODEL (push-assignment, depends_on eligibility, disjoint-file-glob conflict-safety, checkpoint-commit, one-retry-then-stop)? → deep-loop-runtime/scripts/fanout-run.cjs
- [S2-01] How does kasper close the loop on "did my change actually help?" via `outcome_score_delta` (`setImprovementDelta`, helped/hurt avg) by comparing post-change scores to the pre-change baseline? -> deep-loop-runtime/scripts/convergence.cjs
- [S2-02] What is kasper's full LLM-judge hardening stack (`evaluate.ts`/`scorer.ts`) — retry → fallback score-card, dual timeout races, format-strip retry, 4-strategy JSON extraction — and in what order do they fire? -> deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts
- [S2-03] How does kasper use an observation threshold (`min_observations_for_update`) so a weakness is only acted on after N confirmations, and where is it enforced? -> deep-loop-runtime convergence gating
- [S2-04] How does kasper apply time-decay half-life weighting (`weight = 0.5 ** (ageDays/decayDays)`) so stale observations fade? -> deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts

Last 3 Iterations Summary: run 37: S5-02 (ratio 0.76); run 38: S5-08 (ratio 0.64); run 39: S5-10 (ratio 0.62)

## STATE FILES

All paths are relative to the repo root.

- State Log: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/iterations/iteration-040.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/deltas/iter-040.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Do NOT edit deep-research-strategy.md (reducer-owned).
- Do not implement fixes; report findings only.
- Dimension D4 (synthesis): stay on the Focus Area. Cite real reference file:line; name the exact OUR target file and one-line why it helps. Do not duplicate prior iterations' findings (see Last 3 Summary); if the focus turns out already-covered, say so and pivot to the nearest unexplored mechanism in the same segment.
- Include a `graphEvents` array in the JSONL record documenting nodes (SOURCE/TARGET/FINDING) and edges discovered.

## OUTPUT CONTRACT (all three REQUIRED)

1. Iteration narrative markdown at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/iterations/iteration-040.md` with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. In Findings give: reference mechanism + file:line; exact OUR target file; port-difficulty (easy/med/hard); quick-win vs deep-rewrite tag.

2. Per-iteration delta file at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/deltas/iter-040.jsonl`. Its FIRST line MUST be the canonical iteration record, EXACT type "iteration":
`{"type":"iteration","iteration":40,"newInfoRatio":<0..1>,"status":"<complete|insight|stuck>","focus":"S6-01","graphEvents":[...]}`
Then one line per finding/observation/graphEvent. Single-line JSON each; do NOT pretty-print; do NOT write an `executor` block.

3. Do NOT append to the shared state log (`.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/001-reference-research/research/deep-research-state.jsonl`). The orchestrator merges your iteration record from the delta file — appending there yourself corrupts the log when iterations run in parallel.

`newInfoRatio` reflects how much genuinely NEW information this iteration produced vs prior iterations (1.0 = all new; near 0 = nothing new). Be honest — low novelty signals the orchestrator to broaden.
