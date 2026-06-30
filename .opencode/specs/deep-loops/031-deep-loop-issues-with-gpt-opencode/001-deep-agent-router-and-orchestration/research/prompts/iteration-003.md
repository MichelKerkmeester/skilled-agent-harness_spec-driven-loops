DEEP-RESEARCH

# Deep-Research Iteration 3 — FIX-5 Criterion (KQ8) + Claude Flexibility (KQ9) + Verification (KQ10)

## STATE

Segment: 1 | Iteration: 3 of 8
Questions: 7/10 answered (KQ1-7 done) | Last focus: KQ4/KQ5 latency + prompt-structure
Last 2 ratios: 0.95 -> 0.75 | Stuck count: 0
Resource map: not present; skipping coverage gate.
Next focus: KQ8 (FIX-5 decision criterion) + KQ9 (Claude flexibility preservation) + KQ10 (verification strategy). Completing these reaches 10/10 KQs and the minIterations floor (3).

Research Topic: Deep-agent router & orchestration hardening for GPT-backed OpenCode
Iteration: 3 of 8
Remaining Key Questions: KQ8, KQ9, KQ10.

## PRIOR RESULTS (build on, do not re-derive)

Iteration 1 (KQ1,2,3,6,7): subagent_type normalized to "general", identity prompt-injected; DEEP = both agent file + mode-registry; orchestrate.md can harden routing/packaging but not hard runtime identity; ai-council stays directly invocable (mode: all); OpenCode+Claude mirrors exist, .codex absent.
Iteration 2 (KQ4,5): GPT-slow mechanism = role-resolution overhead (prompt ~1.6k tok vs agent instructions ~8.4k tok; CLI dispatch passes `$(cat prompt)` with no agent flag — orchestrate.md:159-174, deep_research_auto.yaml:853-856,916-925). Pre-route edits proposed: add resolved-route header to prompt template, CLI dispatch, orchestrator task format.
Read iterations/iteration-001.md and iteration-002.md for full citations.

## STATE FILES

- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-003.md
- Write delta to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Cite file:line for load-bearing claims. Mark CONFIRMED vs INFERRED.
- Do NOT write/modify research.md (orchestrator-owned). Only iteration-003.md + state-log append + delta file.

## FOCUS FOR THIS ITERATION

**KQ8 — FIX-5 decision criterion.** The structural-prevention "ceiling" is FIX-5 (native->CLI subprocess executor, process isolation). This research attempts the agent-layer fix first (smaller blast radius). Under what conditions does the agent-layer fix prove insufficient and FIX-5 becomes mandatory? Give a CLEAR DECISION CRITERION — concrete, testable triggers (e.g., "if GPT still mis-routes on first dispatch after the agent-layer + pre-routing edits land, measured by <probe>, then FIX-5 is mandatory"). Build on KQ2 (subagent_type can't be specialized at agent layer) and KQ4 (role-resolution overhead is the cost driver). Condition the criterion on the evidence-base gap: the mis-route taxonomy is operator-asserted, so the criterion must be observable against real dispatch behavior, not against the missing prior synthesis.

**KQ9 — Claude flexibility preservation.** What specific behaviors make Claude "flexible" with deep skills today that we must NOT constrain away? Identify the ADAPTIVE behaviors (e.g., choosing tools dynamically, re-reading context, recovering from ambiguity) so the GPT-adherence refinements target mis-invocation signals (modes A/B/C), not legitimate flexibility. Read orchestrate.md, the deep agent files, and any skill SKILL.md sections describing adaptive behavior. Distinguish "flexibility Claude uses well" from "ambiguity GPT mis-handles" — the edits should narrow the latter without touching the former.

**KQ10 — Verification strategy.** How do we measure "GPT invokes the correct deep agent on the first dispatch"? Is there dispatch provenance we can observe today (e.g., JSONL state-log records, the orchestration-status ledger, observability-events.jsonl, the post_dispatch_validate records), or do we need a probe? What's the MINIMAL before/after test that proves the fix without building new benchmark tooling? Look at what the deep-loop-runtime already emits (deep-research-state.jsonl iteration records, observability-events.jsonl, the executor provenance fields) and propose the smallest measurement that distinguishes correct-first-dispatch from mis-route. research-prompt NON-GOALS: do not build new benchmark tooling; measure with what exists.

## FILES TO INVESTIGATE

- `.opencode/agents/orchestrate.md` — adaptive dispatch behavior, LEAF/single-hop rules, the ILLEGAL NESTING section.
- `.opencode/agents/deep-research.md`, `deep-review.md`, `deep-context.md`, `ai-council.md` — the role/identity contract + any adaptive language.
- `.opencode/commands/deep/assets/deep_research_auto.yaml` — observability: orchestration-status.log, observability-events.jsonl, post_dispatch_validate, executor provenance fields (search for "provenance", "executor", "audit").
- `.opencode/skills/deep-loop-runtime/SKILL.md` and `scripts/` — what telemetry/provenance the runtime emits (observability-events.cjs, executor-audit.ts).
- Prior iteration files for accumulated evidence.

## OUTPUT CONTRACT

1. Iteration narrative iterations/iteration-003.md (Focus, Actions Taken, Findings w/ file:line + confirmed/inferred, Questions Answered [KQ8, KQ9, KQ10], Questions Remaining [should be none], Next Focus [recommend: synthesize]).
2. Canonical `{"type":"iteration","iteration":3,...}` APPENDED to deep-research-state.jsonl (single-line, newline-terminated, type exactly "iteration"). newInfoRatio should reflect net-new evidence beyond iterations 1-2 (likely lower, e.g. 0.4-0.6, since this is decision-criterion/analytical work building on established structure). Include status, focus, findingsCount, keyQuestions, answeredQuestions, durationMs, timestamp "2026-06-30T...Z", sessionId "031-001-res-1782823402", generation 1.
3. Delta file deltas/iter-003.jsonl (iteration record + per-finding records).

All three REQUIRED.
