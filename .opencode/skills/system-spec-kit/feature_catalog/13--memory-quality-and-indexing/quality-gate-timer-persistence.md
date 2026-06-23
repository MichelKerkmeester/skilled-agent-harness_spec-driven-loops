---
title: "Quality gate timer persistence"
description: "Quality gate timer persistence stores the warn-only countdown timestamp in SQLite so server restarts do not reset the 14-day graduation period."
trigger_phrases:
  - "quality gate timer persistence"
  - "qualityGateActivatedAt persistence"
  - "warn-only countdown timestamp"
  - "14-day graduation period"
  - "persist quality gate timer across restarts"
version: 3.6.0.13
---

# Quality gate timer persistence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Quality gate timer persistence stores the warn-only countdown timestamp in SQLite so server restarts do not reset the 14-day graduation period.

The quality gate has a two-week warm-up period where it warns about problems without blocking saves. Previously, every time the server restarted, the countdown clock reset and the warm-up never finished. This fix saves the clock to the database so restarts do not reset it. Think of it like writing your gym start date on a calendar instead of just remembering it in your head.

---

## 2. HOW IT WORKS

The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/save-quality-gate.vitest.ts` | Automated test | Quality gate tests |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/quality-gate-timer-persistence.md`
Related references:
- [entity-normalization-consolidation.md](entity-normalization-consolidation.md) — Entity normalization consolidation
- [deferred-lexical-only-indexing.md](deferred-lexical-only-indexing.md) — Deferred lexical-only indexing
