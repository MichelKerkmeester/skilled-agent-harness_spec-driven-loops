---
title: "028 -- code_graph_context CALLS edge-confidence differentiation"
description: "Verify the default-off SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION flag replaces the uniform CALLS confidence tier with a real gradient, that AMBIGUOUS is recognized as weak evidence, that the scoping never touches non-CALLS edges, and that flag-off reads normalize a database previously touched by a flag-on scan."
trigger_phrases:
  - "028 edge confidence differentiation scenario"
  - "code graph edge confidence differentiation testing"
importance_tier: "important"
contextType: "verification"
version: 1.3.0.0
id: code-graph-context-edge-confidence-differentiation
category: context_retrieval
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/context-retrieval/code-graph-context-edge-confidence-differentiation.md
---

# 028 -- `code_graph_context` CALLS edge-confidence differentiation

Prompt: Validate that enabling edge_confidence_differentiation gives code_graph_context real CALLS confidence tiers instead of the flat 0.8 default, flags ambiguous resolutions as weak evidence, and restores legacy behavior when turned off.

## 1. OVERVIEW

This scenario validates the default-off `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` flag on `code_graph_context`'s `why_included` trace output. With the flag off, every `CALLS` edge carries the legacy uniform tier (`0.8` / `INFERRED` / `heuristic`). With the flag on, same-file call resolution and cross-file import-target resolution write a resolution-specific gradient instead: a single resolvable candidate gets `0.75`/`INFERRED`, multiple candidates get `0.35`/`AMBIGUOUS` (same-file) or `0.3`/`AMBIGUOUS` (cross-file). The 011 remediation fixed two correctness bugs this scenario also covers: `AMBIGUOUS` now counts as weak evidence everywhere `INFERRED` does, and the CALLS-only scoping never lets a non-`CALLS` edge (`IMPORTS`, `EXTENDS`, etc.) get pulled into the legacy-tier normalization. A database that was ever touched by a flag-on scan must still read back as the legacy tier once the flag is off again -- the stored differentiated value is not trusted while the flag is off.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `code_graph_context`'s `why_included` trace reports the real CALLS confidence gradient only while the flag is on, treats `AMBIGUOUS` as weak evidence, leaves non-CALLS edges untouched, and normalizes back to the legacy tier when the flag is off regardless of what a prior flag-on scan persisted.
- Real user request: `Validate that turning on SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION gives code_graph_context real CALLS confidence tiers instead of the flat 0.8 default, that ambiguous resolutions are flagged as weak evidence, and that turning the flag back off restores the legacy behavior even against an already-differentiated database.`
- Operator prompt: `Validate code_graph_context CALLS edge-confidence differentiation across flag on/off and a mid-session toggle, then report cited pass/fail evidence.`
- Expected execution process: Run a full scan with the flag off, call `code_graph_context` with `includeTrace:true` against an anchor with an unambiguous and an ambiguous same-file call target, repeat with the flag on, then flip the flag back off without a rescan and confirm the trace reads the legacy tier again.
- Expected signals: flag-off trace shows `confidence:0.8`, `evidenceClass:"INFERRED"` on every CALLS edge; flag-on trace shows `0.75/INFERRED` for the unambiguous target and `0.35/AMBIGUOUS` (or `0.3/AMBIGUOUS` for a cross-file import-target case) for the ambiguous target; a non-CALLS edge (e.g. `IMPORTS`) is unaffected by either flag state; flag-off-after-flag-on-scan still reads `0.8/INFERRED` for CALLS edges.
- Desired user-visible outcome: A concise verdict stating whether the gradient, the AMBIGUOUS weak-evidence classification, the CALLS-only scoping and the flag-off normalization all held.
- Pass/fail: PASS if all four behaviors hold as described. FAIL if the flag-off trace ever shows a differentiated value, if AMBIGUOUS is not treated as weak evidence, or if a non-CALLS edge's confidence/evidenceClass changes with the flag.

---

## 3. TEST EXECUTION

### Preconditions

- Disposable workspace copy with at least one symbol that has an unambiguous same-file call target and one that has two or more same-name call candidates in the same file (an ambiguous case).
- Code graph index is `fresh` (verify via `code_graph_status`).

### Commands

1. **Flag off baseline:** with `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` unset, run `code_graph_scan({ incremental:false })`, then:
   ```jsonc
   mcp__mk_code_index__code_graph_context({
     queryMode: "neighborhood",
     subject: "<anchor symbol with an unambiguous and an ambiguous CALLS target>",
     includeTrace: true
   })
   ```
   Expected: every CALLS entry in `why_included` reports `confidence:0.8`, `detectorProvenance:"heuristic"`, `evidenceClass:"INFERRED"`.

2. **Flag on, full rescan:** set `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION=true`, rescan (`code_graph_scan({ incremental:false })`), then repeat the same `code_graph_context` call.
   Expected: the unambiguous CALLS target reports `confidence:0.75`, `evidenceClass:"INFERRED"`; the ambiguous CALLS target reports `confidence:0.35` (same-file) or `0.3` (cross-file import-target), `evidenceClass:"AMBIGUOUS"`. A same-call `IMPORTS` or other non-CALLS edge in the same trace is unaffected -- unchanged confidence/evidenceClass from step 1.

3. **Flag off again, no rescan:** unset `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` (do not rescan, so the database still holds the differentiated values written in step 2), then repeat the `code_graph_context` call.
   Expected: every CALLS entry reports the legacy tier again (`confidence:0.8`, `evidenceClass:"INFERRED"`), proving flag-off reads normalize rather than trust the persisted differentiated value.

### Expected

Flag-off trace is uniform `0.8/INFERRED` for all CALLS edges regardless of what the database currently holds; flag-on trace shows the real gradient (`0.75` unambiguous, `0.35`/`0.3` ambiguous) with `AMBIGUOUS` recognized as weak evidence; non-CALLS edges never change with the flag.

### Evidence

BLOCKED before the three `why_included` trace payloads could be collected. The required precondition/command transport was unavailable: both `code_graph_status` and the required flag-off `code_graph_scan({ incremental:false })` returned exit `75` because the `mk-code-index` daemon IPC socket was absent.

`node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 30000`:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

`env -u SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION node .opencode/bin/code-index.cjs code_graph_scan --json '{"incremental":false}' --format json --timeout-ms 120000`:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

`mk_code_graph_status` plugin bridge output:

```text
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

`node .opencode/bin/mk-code-index-launcher.cjs --help` did not print help; it attempted launcher startup and reported the live owner lease instead:

```text
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] liveOwnerDetected: ownerPid=92774 classification=live-owner
LEASE_HELD_BY:92774 startedAt=2026-06-29T09:35:48.872Z (dead-socket-recheck)
```

Owner lease payload from `.opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json`:

```json
{
  "ownerPid": 92774,
  "ppid": 92771,
  "executablePath": "/Users/michelkerkmeester/.hermes/node/bin/node",
  "startedAtIso": "2026-06-29T09:35:48.872Z",
  "lastHeartbeatIso": "2026-07-03T01:22:31.903Z",
  "ttlMs": 60000,
  "canonicalDbDir": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/database",
  "socketPath": "/tmp/mk-code-index/daemon-ipc.sock"
}
```

PID lease payload from `.opencode/skills/system-code-graph/mcp-server/database/.mk-code-index-launcher.json`:

```json
{
  "pid": 92771,
  "startedAt": "2026-06-29T09:35:48.889Z",
  "socketPath": "/tmp/mk-code-index/daemon-ipc.sock"
}
```

`ps -p 92774 -o pid=,ppid=,stat=,command=`:

```text
92774 92771 S    /Users/michelkerkmeester/.hermes/node/bin/node /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/dist/index.js
```

No flag-off baseline, flag-on, or flag-off-after-flag-on-scan `why_included` payloads were produced because the scenario's required code-graph commands could not run through the available MCP/CLI transport.

### Pass / Fail

- **BLOCKED**: Required `code_graph_status` / `code_graph_scan` execution was unavailable. The CLI returned `backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock` with `exitCode: 75`, while launcher startup reported `LEASE_HELD_BY:92774 ... (dead-socket-recheck)` and the owner process was still live.

### Failure Triage

Inspect `normalizedContextEdgeMetadata` and `formatContextEdge` in `mcp-server/lib/code-graph-context.ts` (CALLS-only scoping, legacy-tier fallback when `isCodeGraphEdgeConfidenceDifferentiationEnabled()` is false). Cross-check the write side in `mcp-server/lib/structural-indexer.ts` (`buildDifferentiatedCallsEdgeMetadata`, same-file gradient) and `mcp-server/lib/cross-file-edge-resolver.ts` (`resolveCrossFileCallEdges`, cross-file gradient and the `0.75/INFERRED` same-name-only downgrade from the prior `0.9/EXTRACTED`). Confirm the enable check in `mcp-server/lib/edge-confidence-flags.ts`.

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Flag gate: `mcp-server/lib/edge-confidence-flags.ts`
- Read-path normalization: `mcp-server/lib/code-graph-context.ts`
- Write-path gradient: `mcp-server/lib/structural-indexer.ts`, `mcp-server/lib/cross-file-edge-resolver.ts`
- Catalog counterpart: `../../feature-catalog/edge-confidence-and-provenance/edge-confidence-differentiation.md`, `../../feature-catalog/edge-confidence-and-provenance/edge-evidence-classification.md`
- Automated test cross-reference: `mcp-server/tests/code-graph-context-handler.vitest.ts` (AMBIGUOUS classification, mid-session toggle, flag-off normalization of a previously-differentiated database, IMPORTS-unaffected checks)
- Decision rationale: `decision-record.md` ADR-001 in `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/011-edge-confidence-review-remediation/`

---

## 5. SOURCE METADATA

- Group: Context Retrieval
- Playbook ID: 028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `context-retrieval/code-graph-context-edge-confidence-differentiation.md`
