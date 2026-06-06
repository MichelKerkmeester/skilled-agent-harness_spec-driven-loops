---
title: "Session resume tool"
description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, Code Graph availability, and structural bootstrap hints into a detailed recovery payload."
trigger_phrases:
  - "session resume tool"
  - "session_resume"
  - "resume recovery payload"
  - "merged session recovery"
  - "structural bootstrap hints session"
---

# Session resume tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Composite MCP tool (session_resume) that merges memory resume context, code graph status, Code Graph availability, and structural bootstrap hints into a single recovery payload.

The `session_resume` handler performs three recovery steps: (1) a filesystem-first resume ladder via `buildResumeLadder()` that reconstructs session state from `handover.md -> _memory.continuity -> spec docs`, (2) code graph status lookup returning freshness-aware `fresh | stale | empty | error` values plus counts and last scan timestamp, and (3) Code Graph binary availability probing. It also appends the shared structural `ready | stale | missing` contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `codeGraph`, optional `structuralContext`, and `hints` fields. For the canonical first-call recovery step, use `session_bootstrap`; for operator-facing packet recovery, start from `handover.md -> _memory.continuity -> spec docs`; `session_resume` remains the detailed merged surface.

---

## 2. HOW IT WORKS

`session_resume` is the detailed merged recovery surface behind the higher-level `/spec_kit:resume` workflow. The handler still merges the resume ladder, code-graph status, Code Graph availability, and structural bootstrap hints into one response, but The implementation added a transport-bound auth check around any explicit `args.sessionId`.

Commit `debb5d7a8` introduced `mcp_server/lib/context/caller-context.ts` and wrapped the MCP transport with AsyncLocalStorage caller binding. Commit `87636d923` then changed `mcp_server/handlers/session-resume.ts` so a supplied `args.sessionId` is compared against the caller-bound session identity by default. In the normal strict mode, a mismatch is rejected instead of being treated as an informational hint. `MCP_SESSION_RESUME_AUTH_MODE=permissive` is the canary rollout flag that logs the mismatch and allows the request to continue.

The rest of the merged recovery payload is unchanged in shape: `memory` still comes from the `handover.md -> _memory.continuity -> spec docs` ladder, `codeGraph` still reports freshness-aware graph state, `codeGraph` still reports binary availability, and `structuralContext` plus `hints` still explain whether the caller should escalate to `session_bootstrap` or `code_graph_scan`. The current implementation therefore hardened who may resume a session without changing the overall recovery contract that callers consume.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-resume.ts` | Handler | Composite resume merging 3 subsystems |
| `mcp_server/lib/context/caller-context.ts` | Lib | AsyncLocalStorage caller identity used to bind session_resume authorization to the transport caller |
| `mcp_server/context-server.ts` | Transport | Wraps tool execution in the caller-context envelope |
| `mcp_server/lib/resume/resume-ladder.ts` | Lib | Filesystem-first packet recovery ladder (`handover.md -> _memory.continuity -> spec docs`) |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Lib | Code graph status query |
| `mcp_server/lib/session/session-snapshot.ts` | Lib | Shared structural context contract used for recovery hints |
| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/session-resume-auth.vitest.ts` | Automated test | Strict-vs-permissive sessionId auth binding |
| `mcp_server/tests/caller-context.vitest.ts` | Automated test | Transport caller-context propagation |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/session-resume-tool.md`
Related references:
- [session-health-tool.md](session-health-tool.md) — Session health tool
- [query-intent-routing.md](query-intent-routing.md) — Query-intent routing
