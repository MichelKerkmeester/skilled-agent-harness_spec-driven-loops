---
title: "Session health tool"
description: "MCP tool (session_health) that reports session readiness with ok/warning/stale status, code graph freshness, priming status, and quality score."
trigger_phrases:
  - "session health tool"
  - "session_health"
  - "session readiness status"
  - "graph freshness quality score"
  - "ok warning stale session status"
---

# Session health tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

MCP tool (session_health) that reports session readiness with ok/warning/stale status, code graph freshness, priming status, and quality score.

The session_health handler computes session status based on three time thresholds: ok (last tool call within 15 minutes), warning (within 60 minutes), stale (beyond 60 minutes or session older than 24 hours). It returns structured details including sessionAgeMs, lastToolCallAgoMs, graphFreshness (fresh/stale/empty/error), specFolder, primingStatus, and a QualityScore with 4 weighted factors (recency, recovery, graphFreshness, continuity). Actionable hints guide the user toward recovery actions. The session_health tool call is excluded from recordToolCall() to prevent idle timer reset — health checks no longer artificially extend session freshness.

---

## 2. HOW IT WORKS

mcp_server/handlers/session-health.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-health.ts` | Handler | Session status computation with time-based thresholds |
| `mcp_server/lib/session/context-metrics.ts` | Lib | QualityScore computation with 4-factor scoring |
| `mcp_server/hooks/memory-surface.ts` | Hook | Provides isSessionPrimed(), getSessionTimestamps(), getCodeGraphStatusSnapshot() |
| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_health |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/session-health-tool.md`
Related references:
- [mcp-auto-priming.md](mcp-auto-priming.md) — MCP auto-priming
- [session-resume-tool.md](session-resume-tool.md) — Session resume tool
