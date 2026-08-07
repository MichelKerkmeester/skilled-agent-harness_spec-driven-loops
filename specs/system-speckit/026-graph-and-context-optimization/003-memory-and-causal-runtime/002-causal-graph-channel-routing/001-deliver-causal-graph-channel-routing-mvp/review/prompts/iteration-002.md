# DEEP REVIEW LEAF AGENT — Iteration 2 (Correctness Pass)

You are dispatched as the @deep-review LEAF agent for packet 009-causal-graph-channel-routing.
Iteration 1 (inventory) is complete. This pass is dimension-deep on **CORRECTNESS**.

## FOCUS — ITERATION 2: CORRECTNESS

Examine logic, invariants, types, branch coverage, error paths in:
- `shouldPreserveGraph()` and intent gate at query-router.ts:183-205
- `routeQuery()` integration at query-router.ts:258-366 (especially the override at 308-335)
- `getEntityDensityScore()` and cache rebuild at entity-density.ts
- `recordInvocation()` / `getSnapshot()` math at routing-telemetry.ts
- Env-flag short-circuit `isGraphChannelPreservationEnabled()` at query-router.ts:160
- Cold-start safety (REQ-006) — null DB, empty causal_edges, missing tables

## CORRECTNESS QUESTIONS TO ANSWER

1. Does `shouldPreserveGraph` return correct results for every intent label?
2. Does the override at line 308-335 mutate channel lists in a consistent order regardless of which preservation override fires?
3. Is the bm25 + graph override interaction commutative?
4. Does `entity-density` cache rebuild lock-step with the 60s TTL? Race conditions on concurrent `getEntityDensityScore` calls during rebuild?
5. Does the telemetry snapshot return correct rates when the window has fewer than WINDOW_SIZE decisions?
6. Does `getEntityDensityScore` correctly score 0 for cold-start (null DB)?
7. Does `routeQuery` short-circuit correctly when complexity-router is disabled?
8. Are there off-by-one errors in any threshold comparison (>=2 tokens, >=3 edges, WINDOW_SIZE)?

## TASKS

1. Read scope files; map every correctness-sensitive code path.
2. Cross-check each path against its test.
3. Note any test gaps (untested branches, missing edge cases).
4. Catalogue NEW correctness findings only (do not re-report iter-1 findings). For each: P0/P1/P2, file:line evidence, scope proof, recommendation.
5. Append iteration JSONL record (type=iteration) to deep-review-state.jsonl.
6. Write delta file at deltas/iter-002.jsonl with iteration record + one record per new finding.
7. Write iteration narrative at iterations/iteration-002.md.

## CLAIM ADJUDICATION

For every NEW P0/P1 you raise, include in the iteration markdown:
- **claim**: one-sentence
- **evidenceRefs**: file:line list
- **counterevidenceSought**: what you looked for that would falsify it
- **alternativeExplanation**: plausible non-finding interpretation
- **finalSeverity**: P0/P1/P2
- **confidence**: 0..1
- **downgradeTrigger**: what would drop it to lower severity

## REPO ROOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---

## PRIOR FINDINGS (from iter 1)

- **P1-001** [P1] Intent classified redundantly — up to 3x per routeQuery invocation. file: query-router.ts:145,191,304.
- **P2-001** [P2] ChannelName type duplicated from query-router.ts. file: routing-telemetry.ts:14.
- **P2-002** [P2] recordInvocation uses Array.shift() not true ring buffer. file: routing-telemetry.ts:33-35.
- **P2-003** [P2] shouldPreserveGraph does not self-gate on feature flag. file: query-router.ts:183.
- **P2-004** [P2] No isolated try/catch around getRoutingTelemetrySnapshot in memory_health. file: memory-crud-health.ts:626.

Do NOT re-report these as new. Reference by ID if you confirm/upgrade/downgrade. Look for NEW correctness findings beyond these.

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: correctness (deep pass — logic errors, off-by-one, broken invariants, return types)
Prior Findings: P0=0 P1=1 P2=4
Dimension Coverage: [] (0/4 canonical dimensions deep-passed; iter 1 was inventory)
Traceability: core=PASS (iter 1) overlay=PARTIAL (iter 1)
Resource Map Coverage: cross-check target_files from .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/applied/T-*.md against .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/resource-map.md — note: applied/ directory is absent; no gaps to classify in this dim.
Coverage Age: 0
Last 2 ratios: N/A -> 1.00 (iter 1 broad sweep introduced 5 new findings)
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true (1 P1, 4 P2 from iter 1)

Review Iteration: 2 of 10
Mode: review
Dimension: correctness
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing
Review Scope Files: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/checklist.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/implementation-summary.md, .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts, .opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/entity-density.vitest.ts
Prior Findings: P0=0 P1=1 P2=4

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-002.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-002.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-002.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-002.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-002.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-002.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
