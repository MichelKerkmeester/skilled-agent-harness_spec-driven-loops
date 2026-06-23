---
title: "Session bootstrap reader-ready context"
description: "session_bootstrap returns bounded startup context, graph readiness or degraded-mode guidance, and a recommended next action so non-hook runtimes do not need to spelunk for setup data."
trigger_phrases:
  - "session bootstrap"
  - "session_bootstrap"
  - "get reader-ready startup context"
  - "graph readiness on startup"
  - "recommended next action for session"
version: 3.6.0.3
---

# Session bootstrap reader-ready context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`session_bootstrap` is the orchestration surface that makes a non-hook runtime reader-ready in a single tool call. It returns a bounded profile of the active workspace, a graph-readiness status, and a `recommendedNextAction` string that names the follow-on path (`session_resume`, `code_graph_scan`, or direct spec-folder recovery).

The handler fails open. When the graph database is stale, missing, or otherwise degraded, the response still names a recovery action rather than throwing. This keeps the caller out of error-handling code paths during startup and lets operators reach productive context inside one tool invocation.

---

## 2. HOW IT WORKS

`mcp_server/handlers/session-bootstrap.ts` orchestrates the response. It assembles a workspace-scoped profile from the shared payload producer, queries graph readiness, and consults the recommended-next-action resolver to surface the right follow-on for the current state.

- `profile`: bounded summary of workspace identity, recent spec folder activity, and runtime markers
- `graph`: readiness flag plus degraded-mode messaging when relevant
- `recommendedNextAction`: named follow-on tool or workflow

The context server wires the handler into the MCP tool surface so callers can reach it with one schema-validated request. Output stays bounded so it can fit inside a startup hook payload without truncation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-bootstrap.ts` | Handler | Assembles bounded context, graph status, and recommended next action |
| `mcp_server/context-server.ts` | Server | Registers `session_bootstrap` on the MCP tool surface |
| `mcp_server/lib/context/shared-payload.ts` | Library | Produces the bounded workspace profile used by the handler |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/session-bootstrap.vitest.ts` | Automated test | Happy-path response, degraded graph messaging, next-action recommendation |

---

## 4. SOURCE METADATA
- Group: Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--discovery/session-bootstrap-reader-ready-context.md`
Related references:
- [detect-changes-preflight.md](detect-changes-preflight.md) — detect_changes preflight (Code Graph)
- [session-resume-continuity-ladder.md](session-resume-continuity-ladder.md) — Session resume continuity ladder
