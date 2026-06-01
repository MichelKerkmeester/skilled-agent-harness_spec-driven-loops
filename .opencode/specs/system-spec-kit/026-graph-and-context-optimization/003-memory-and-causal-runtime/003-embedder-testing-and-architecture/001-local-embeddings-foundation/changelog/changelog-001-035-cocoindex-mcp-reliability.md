---
title: "CocoIndex MCP Reliability: Diagnostic Mapping and Root Cause Scoping"
description: "Level-2 diagnostic packet mapping the CocoIndex MCP tool path from FastMCP wrapper through daemon IPC to msgspec protocol. Root cause scoped to host MCP JSON-RPC timeout budget. No CocoIndex source code was modified."
trigger_phrases:
  - "cocoindex mcp reliability"
  - "cocoindex timeout -32001"
  - "msgspec decode failure cocoindex"
  - "cocoindex daemon client disconnect"
  - "mcp-coco-index timeout diagnosis"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Repeated-query scenarios against the CocoIndex MCP surface produced two failure modes: `MCP error -32001: Request timed out` and `msgspec` decode errors between the daemon and its client protocol. Packets 037 and 039 address embedding-worker availability separately, but neither explains a client-visible JSON-RPC timeout or binary IPC decode failure in the CocoIndex path.

This diagnostic packet mapped the MCP call path from the `FastMCP` server wrapper through the daemon client, daemon handler, msgspec protocol to the query layer. Local daemon logs at `~/.cocoindex_code/daemon.log` showed 28595 `client disconnected before response could be sent` entries. That pattern points to the host MCP JSON-RPC layer canceling the request before the CocoIndex daemon finishes: no `-32001` emitter was found in the CocoIndex source or the installed Python `mcp` package. The daemon search path has no per-request recv timeout. Because `refresh_index=True` is the default on every MCP search, each call runs an index refresh before the actual query, widening the window for host-side timeout.

No CocoIndex source code was changed. The packet closes with a scoped root cause hypothesis and a concrete instrumentation recommendation for a follow-up fix packet.

### Added

- Level-2 packet docs for phase 035: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json
- Code path map with 13 source citations across server.py, client.py, daemon.py, protocol.py, query.py, cli.py
- Diagnostic findings section recording daemon log evidence, watcher log evidence, sandbox-blocked baseline observation
- Root cause hypothesis document distinguishing host MCP timeout from daemon-side timeout ownership
- Known Limitations section with five scoped limitations plus a Recommended Next Step for follow-up instrumentation

### Changed

None.

### Fixed

None.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Packet scaffold | PASS | 035 folder contains spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json. |
| Source path mapping | PASS | server.py, client.py, daemon.py, protocol.py, query.py, cli.py cited with line references. |
| Launcher identification | PASS | No `.opencode/bin/cocoindex-launcher.cjs` found. Actual MCP entry is `ccc mcp` via cli.py:497-512. |
| Local logs inspected | PASS | `~/.cocoindex_code/daemon.log` and `/tmp/cocoindex*` checked. 28595 client-disconnect entries recorded. |
| Reproduction | PARTIAL | Active load reproduction not run. Baseline status blocked by sandbox. Logs reproduce the client-disconnect symptom. |
| No source code edits | PASS | Diagnostic docs only. No CocoIndex source was modified. |
| Strict validate | PASS | `validate.sh --strict` exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/.../035-cocoindex-mcp-reliability/spec.md` (NEW) | Created | Feature spec covering problem statement, scope, requirements, success criteria for the diagnostic packet. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/plan.md` (NEW) | Created | Execution plan mapping the diagnostic dispatch phases. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/tasks.md` (NEW) | Created | 33 completed task items covering source mapping, log inspection, doc validation. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/checklist.md` (NEW) | Created | Level-2 acceptance checklist with all items verified. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/implementation-summary.md` (NEW) | Created | Code path map, diagnostic findings, root cause hypothesis, key decisions, verification table. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/description.json` (NEW) | Created | Packet metadata for memory search indexing. |
| `.opencode/specs/.../035-cocoindex-mcp-reliability/graph-metadata.json` (NEW) | Created | Graph traversal metadata with completion status and derived fields. |

### Follow-Ups

- Open a follow-up instrumentation packet to add per-request IDs, duration logging around the `server.py` refresh and search executor calls, daemon send/receive byte lengths, msgspec decode exception payload metadata behind `COCOINDEX_CODE_IPC_DEBUG`.
- Confirm the exact host MCP client timeout budget and whether it is configurable at the operator level.
- Evaluate making `refresh_index=false` the runtime default for MCP calls, splitting refresh from search into separate tool calls or adding a bounded progressive response strategy to prevent host-side timeout on long refresh cycles.
- Capture a live msgspec decode stack trace with `COCOINDEX_CODE_IPC_DEBUG` enabled to confirm whether decode failures stem from malformed payloads, schema drift or transport truncation after host cancellation.
