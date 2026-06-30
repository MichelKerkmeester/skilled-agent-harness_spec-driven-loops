DEEP-REVIEW

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 20
Dimension: correctness (deep revisit + cross-phase integration)
Prior Findings: P0=0 P1=5 P2=3
Dimension Coverage: correctness, security, traceability, maintainability (4/4)
Traceability: core=covered overlay=covered
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last 2 ratios: 0.4 -> 0.14
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true
All 4 dimensions covered; ratio is falling (convergence near). This pass: hunt for anything the per-dimension passes MISSED — cross-phase integration seams between the embed path (001-004), the daemon shutdown/WAL (009/010/012), and the single-writer/lease systems (002/005/013). Escalate or confirm-clean; report NEW findings only.
Prior findings (do NOT re-report; extend/escalate only): P1 provider-override-ignored; P1 reindex-cancel-no-worker-stop; P2 direct-startup-socket-unlink; P1 tcp-embed-unauthenticated; P1 workflow-lock-fail-open; P1 daemon-child-ledger-vs-implsummary-conflict; P2 005-idle-eviction-file-matrix-mismatch; P2 env-knobs-absent-from-ENV_REFERENCE.

Review Iteration: 5 of 20
Mode: review
Dimension: correctness (deep revisit: embed-path <-> daemon-shutdown <-> single-writer/lease cross-phase seams; concurrency, ordering, resource lifecycle)
Review Target: embedding-stack hardening program: 031 phases 001-005 + 026/007 daemon children 009/010/012/013 (committed code)
Review Scope Files: shared/embeddings/{auto-select,providers/hf-local,factory,registry}.ts, shared/types.ts, bin/hf-model-server.cjs, bin/lib/{model-server-supervision,launcher-ipc-bridge}.cjs, bin/mk-skill-advisor-launcher.cjs, mcp_server/handlers/embedder-status.ts, mcp_server/lib/embedders/{execution-router,reindex}.ts, mcp_server/lib/search/vector-index-store.ts, mcp_server/lib/cache/embedding-cache.ts, mcp_server/lib/governance/memory-retention-sweep.ts, mcp_server/context-server.ts, scripts/core/{daemon-detect,workflow}.ts
Prior Findings: P0=0 P1=5 P2=3

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

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/iterations/iteration-005.md`, this iteration's narrative markdown
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deltas/iter-005.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/iterations/iteration-005.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/iterations/iteration-005.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

### v2 Search Depth Output (when scopeClass is standard or complex)

For standard or complex review scope, set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to the v1 fields above:

- `reviewDepthApplicability`: `{scopeClass,enforcement,reason,evidenceRefs}` where `scopeClass` is `trivial`, `standard`, or `complex`; `enforcement` is `strict`, `warn`, or `skip`.
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`. Name how targets were chosen, what high-risk targets were omitted, and whether graph/semantic search was available, unavailable, or partial.
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` where `graphCoverageMode` is `graph`, `graphless_fallback`, or `unavailable_blocked`.
- `searchLedger[]`: ledger rows with required `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, and `rationale`; include `hypothesis` or `invariant` (at least one); include `searchActions[]` with `{method,queryOrPath,result,evidenceRefs}`.
- Each ledger row needs exactly one disposition link: `linkedFindingId` for `finding` (must match an id in `findingDetails[]`), `ruledOutReason` for `ruled_out`, `deferredReason` for `deferred`, `blockedReason` for `blocked`, or `notApplicableReason` for `not_applicable`.

Trivial-scope exemption: when `scopeClass` is `trivial` and `enforcement` is `skip`, `searchLedger` may be `[]`, but `reviewDepthApplicability.evidenceRefs` MUST cite proof that the target is trivial.

Compact v2 example:

```json
{"reviewDepthSchemaVersion":2,"reviewDepthApplicability":{"scopeClass":"standard","enforcement":"strict","reason":"non-trivial target","evidenceRefs":["path/to/file.ts:42"]},"targetSelection":{"selectedTargets":["path/to/file.ts"],"selectionReason":"state transition producer","discoveryMethods":["direct_read","exact_search"],"omittedHighRiskTargets":[],"graphStatus":"unavailable","semanticSearchStatus":"partial","evidenceRefs":["path/to/file.ts:42"]},"searchCoverage":{"requiredBugClasses":["state_transition"],"covered":[],"ruledOut":["state_transition"],"deferred":[],"blocked":[],"graphCoverageMode":"graphless_fallback"},"searchLedger":[{"id":"SL-001","dimension":"correctness","targetRefs":["path/to/file.ts"],"bugClass":"state_transition","hypothesis":"state transition can skip validation","searchActions":[{"method":"direct_read","queryOrPath":"path/to/file.ts","result":"guard present on all branches","evidenceRefs":["path/to/file.ts:42"]}],"disposition":"ruled_out","rationale":"all branches call the guard","ruledOutReason":"verified by direct read"}]}
```

Legacy unversioned records remain valid during rollout. Phase D validator behavior should warn on legacy shallow records and strictly enforce this shape only for explicit v2 records.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/deltas/iter-005.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
