---
title: "Usage-weighted ranking signal"
description: "Tracks access counts per memory and computes a log-scale ranking boost (0-0.10) that rewards frequently accessed memories without letting popularity dominate relevance, gated by the SPECKIT_USAGE_RANKING flag."
trigger_phrases:
  - "usage-weighted ranking signal"
  - "SPECKIT_USAGE_RANKING"
  - "log-scale ranking boost access count"
  - "usage tracking popularity ranking"
  - "frequently accessed memory ranking reward"
version: 3.6.0.6
---

# Usage-weighted ranking signal

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks access counts per memory and computes a log-scale ranking boost (0-0.10) that rewards frequently accessed memories without letting popularity dominate relevance. Memories that are retrieved and used more often receive a small ranking advantage, reflecting the signal that repeated access indicates ongoing value.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_USAGE_RANKING=false` to disable.

The usage tracking module records access counts each time a spec-doc record is returned in search results. The ranking signal module computes a log-scale boost from the access count, capped at 0.10 to prevent heavily accessed memories from overwhelming relevance-based scoring. The logarithmic scale ensures diminishing returns — the boost grows quickly for the first few accesses and flattens for very popular memories.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/usage-tracking.ts` | Lib | Access count recording and retrieval |
| `mcp_server/lib/graph/usage-ranking-signal.ts` | Lib | Log-scale boost computation (0-0.10 range) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/usage-weighted-ranking.vitest.ts` | Automated test | Usage tracking, log-scale boost computation, and cap enforcement |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `11--scoring-and-calibration/usage-weighted-ranking.md`

- Kill switch: SPECKIT_USAGE_RANKING=false
Related references:
- [rrf-k-experimental.md](rrf-k-experimental.md) — RRF K experimental tuning
