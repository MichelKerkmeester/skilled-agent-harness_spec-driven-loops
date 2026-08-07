# DEEP REVIEW LEAF AGENT — Iteration 1 (Inventory Pass)

You are dispatched as the @deep-review LEAF agent for packet 009-causal-graph-channel-routing.
You MUST act as a code-review LEAF agent: read scope files, perform the focus pass, write all three required artifacts to the paths shown in OUTPUT CONTRACT, then STOP. You must NOT modify any reviewed file.

## FOCUS — ITERATION 1 (inventory pass, NOT a dimension-deep pass)

- Read every file in REVIEW SCOPE.
- Build an artifact map: file → purpose → LOC → owner/module → first-impression hotspots (complexity, novelty, surprise).
- Surface any obvious P0/P1 quick-wins (logic errors, broken invariants, missing env-flag guards, SQL injection risks) BEFORE the dimension-ordered passes 2–10 begin. Use sk-code-review/references/review_core.md severity bar.
- Record findings as P0/P1/P2 in the iteration narrative + as separate JSON records in the delta file.
- DO NOT exhaust the 4 dimensions in this pass — leave room for passes 2–5 to go dimension-deep. This pass is broad+shallow.

## TASKS

1. Read all scope files listed below; produce a per-file digest in the iteration narrative.
2. Identify the top 5 hotspots (highest combination of LOC × novelty × risk).
3. Catalogue any P0/P1/P2 findings observed during this broad sweep, each with file:line evidence.
4. Append a single canonical iteration JSONL record to deep-review-state.jsonl with type=iteration.
5. Write the per-iteration delta file at deltas/iter-001.jsonl with the iteration record + one JSON record per finding / classification observed.
6. Write the iteration narrative markdown to iterations/iteration-001.md.

## SEVERITY BAR (sk-code-review)
- **P0 (Blocker):** broken correctness, security exploit, data loss, undefined behaviour shipped to prod, missing spec requirement.
- **P1 (Major):** functional gap, weakened invariant, regression risk, traceability break that prevents release-readiness.
- **P2 (Minor):** maintainability nit, doc gap, weak naming, redundant code — important but non-blocking.

## REPO ROOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (use as the base for all file paths).

---
# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: inventory (initial pass — artifact map + complexity hotspots)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: [] (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: cross-check target_files from .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/applied/T-*.md against .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/resource-map.md and classify only missed coverage as gaps.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: inventory
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing
Review Scope Files: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/tasks.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/checklist.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/implementation-summary.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/resource-map.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/handover.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/changelog.md, .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts, .opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/entity-density.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/routing-telemetry-stress.vitest.ts
Prior Findings: P0=0 P1=0 P2=0

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

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-001.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-001.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
