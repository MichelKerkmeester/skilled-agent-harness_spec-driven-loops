# DEEP REVIEW LEAF AGENT — Iteration 10 (Final Sweep + Synthesis Prep)

You are dispatched as the @deep-review LEAF agent for packet 009-causal-graph-channel-routing.
This pass is dimension-deep on **FINAL-SWEEP** (Final Sweep + Synthesis Prep).

## FOCUS — ITERATION 10: Final Sweep + Synthesis Prep

Final pass:
1. Dedup findings across iterations — any two findings that are the same root cause?
2. P2 -> P1 upgrade scan: any P2 that, viewed together with other P2s, escalates to P1?
3. Severity sanity-check on every P0/P1: would a 3rd-party reviewer agree?
4. Final verdict: PASS / CONDITIONAL / FAIL with rationale.
5. List release-blocking items (if any).
6. List recommended follow-up packets (if any).
7. Generate a synthesis-ready summary table: ID | severity | file:line | claim | recommended action | follow-up packet (if any).

Cover any gaps from prior iterations. This is the LAST chance to surface new findings.

## TASKS

1. Read scope files; map paths relevant to this dimension.
2. Cross-check each path against its tests where applicable.
3. Catalogue NEW final-sweep findings only (do not re-report prior findings). For each: P0/P1/P2, file:line evidence, scope proof, recommendation.
4. Append iteration JSONL record (type=iteration) to deep-review-state.jsonl.
5. Write delta file at deltas/iter-010.jsonl with iteration record + one record per new finding.
6. Write iteration narrative at iterations/iteration-010.md.

## CLAIM ADJUDICATION

For every NEW P0/P1, include in the iteration markdown:
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

## PRIOR FINDINGS (from iters 1-9)

- **P1-001** [P1] Intent classified redundantly — up to 3x per routeQuery invocation — query-router.ts:145,191,304.
- **P1-002** [P1] Resource-map playbook path wrong — 210 should be 272 — resource-map.md:55.
- **P1-003** [P1] Resource-map changelog entry missing on disk — resource-map.md:73.
- **P2-001** [P2] ChannelName type duplicated from query-router.ts — routing-telemetry.ts:14.
- **P2-002** [P2] recordInvocation uses Array.shift() not true ring buffer — routing-telemetry.ts:33-35.
- **P2-003** [P2] shouldPreserveGraph does not self-gate on feature flag — query-router.ts:183.
- **P2-004** [P2] No isolated try/catch around getRoutingTelemetrySnapshot in memory_health — memory-crud-health.ts:626.
- **P2-008** [P2] Entity-density error path lacks retry backoff for persistent build failures — entity-density.ts:105-116.
- **P2-009** [P2] routingReasons mislabels intent-triggered BM25 preservation as authority-artifact — query-router.ts:144-317.
- **P2-010** [P2] Entity-density cache refresh has no concurrency guard — entity-density.ts:95-116.
- **P2-011** [P2] invalidateEntityDensityCache exported with no access control — entity-density.ts:150-154.
- **P2-012** [P2] buildRoutingQueryPlan accepts unbounded routingReasons strings for disk persistence — query-plan.ts:74,258.
- **P2-013** [P2] safeGetDb error swallowing loses observability — query-router.ts:207-213.
- **P2-014** [P2] Playbook expected rate 0.6 contradicts actual classifier behavior (0.4) — 272-routing-telemetry-and-graph-channel-invocation.md:55.
- **P2-015** [P2] routing-telemetry-stress.vitest.ts not listed in resource-map.md — resource-map.md (missing entry).
- **P2-016** [P2] Feature catalog traceability table line numbers stale (4/8 off by 20+ lines) — 12-graph-channel-preservation.md:59-67.
- **P2-017** [P2] Missing JSDoc on exported getSnapshot function — routing-telemetry.ts:50.
- **P2-018** [P2] Missing JSDoc on exported shouldPreserveBm25 function — query-router.ts:144.
- **P2-019** [P2] Missing JSDoc on exported isGraphChannelPreservationEnabled — query-router.ts:160.
- **P2-020** [P2] Module header stale — omits channel preservation overrides — query-router.ts:1-6.
- **P2-021** [P2] parseTriggerPhrases has asymmetric and undocumented fallback behavior — entity-density.ts:46-58.
- **P2-022** [P2] Duplicate env-flag constant in same test file — query-router.vitest.ts:33,415.
- **P2-023** [P2] Duplicated setEnv/restoreEnv helpers across test files — query-router.vitest.ts:37-57,routing-telemetry-stress.vitest.ts:23-35.
- **P1-C-001** [P1] invalidateEntityDensityCache never wired to memory_save/memory_bulk_delete — entity-density cache stale for 60s — entity-density.ts:146-154.
- **P2-C-001** [P2] entity-density error path discards valid cached state — entity-density.ts:109-114.
- **P2-C-002** [P2] no test for entity-density rebuild failure after successful cache population — entity-density.vitest.ts.
- **S7-001** [P2] Entity-density cache has no explicit upper-bound size guard — entity-density.ts:32,69-92.
- **P2-TR-001** [P2] Implementation-summary internal test-count inconsistency (27 vs 15 vs 25) — implementation-summary.md:87,124.
- **P2-TR-002** [P2] Resource-map omits scratch/live-smoke-results.md and scratch/stress-test-results.md — resource-map.md:59-74.
- **P2-TR-003** [P2] Stale line reference for shouldPreserveGraph (167-189 vs actual 183-205) — scratch/live-smoke-results.md:80.
- **P2-TR-004** [P2] Feature catalog validation table omits routing-telemetry-stress.vitest.ts — feature_catalog/12-graph-channel-preservation.md:50-53.
- **P2-TR-005** [P2] Resource-map summary count mismatch (Skills=8 but 9 entries; total=18 but 19) — resource-map.md:29.
- **P2-TR-006** [P2] Spec Q2 (rate band) only partially answered in implementation-summary — implementation-summary.md:35,spec.md:229-230.
- **P2-TR-007** [P2] CHK-052 evidence enumeration omits routing-telemetry-stress.vitest.ts — checklist.md:142.
- **ADV-001** [P2] SPECKIT_GRAPH_CHANNEL_PRESERVATION env flag treats 0/no/off/empty as enabled — query-router.ts:160-163.
- **ADV-002** [P2] withFeatureFlag helper defined but never called in query-router.vitest.ts — query-router.vitest.ts:60-72.
- **ADV-003** [P2] entity-density error-path comment contradicts code; cache discarded on transient error — entity-density.ts:109-114.

Do NOT re-report these as new. Reference by ID if you confirm/upgrade/downgrade. Look for NEW findings beyond these.

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 10 of 10
Dimension: final-sweep (Dedup, severity escalation review, P2->P1 upgrade scan, finalize verdict)
Prior Findings: P0=0 P1=4 P2=33
Dimension Coverage: [correctness,security,traceability,maintainability] (4/4)
Traceability: core=PASS (iter 1) overlay=PARTIAL (iter 1)
Resource Map Coverage: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/applied/T-*.md is absent; resource-map.md present and 100% on-disk per iter 1.
Coverage Age: 9
Last 2 ratios: 1.00 -> 0.09
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true (0 P0, 4 P1, 33 P2)

Review Iteration: 10 of 10
Mode: review
Dimension: final-sweep
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing
Review Scope Files: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/checklist.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/implementation-summary.md, .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
Prior Findings: P0=0 P1=4 P2=33

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
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-010.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-010.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-010.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-010.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-010.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/iterations/iteration-010.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/review/deltas/iter-010.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
