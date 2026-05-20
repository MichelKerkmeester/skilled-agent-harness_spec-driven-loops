---
title: "Session health shared payload"
description: "session_health reports shared-payload status, freshness, and degraded-state recovery hints so operators can verify the startup channel without a full bootstrap call."
---

# Session health shared payload

## 1. OVERVIEW

`session_health` is the lightweight health endpoint that lives between the operator and the shared payload producer. It returns the producer's current state, freshness timestamps, and recovery guidance for any degraded condition.

The endpoint is intentionally cheaper than `session_bootstrap`. Operators run it before deeper context recovery to confirm the startup channel is alive, then escalate to `session_bootstrap` only if the health response names a recovery action.

---

## 2. CURRENT REALITY

The handler reads the shared payload producer state, computes a freshness window from the last successful publish, and emits a recovery hint when the payload is stale or missing. The response never throws on a degraded state: it returns a structured payload with `status`, `freshness`, and `recovery` fields so the caller can branch deterministically.

- `status`: ready, degraded, or unavailable
- `freshness`: last publish timestamp and computed age
- `recovery`: named follow-on (`session_bootstrap`, manual spec walk, or no-op when ready)

The endpoint is wired through the MCP tool surface for consistency with the other session-* handlers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-health.ts` | Handler | Reads producer state, computes freshness, emits recovery hints |
| `mcp_server/lib/context/shared-payload.ts` | Library | Exposes producer state and last-publish timestamps |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/session-health.vitest.ts` | Ready-state response, degraded payload messaging, recovery hint emission |

---

## 4. SOURCE METADATA
- Group: Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--discovery/07-session-health-shared-payload.md`
