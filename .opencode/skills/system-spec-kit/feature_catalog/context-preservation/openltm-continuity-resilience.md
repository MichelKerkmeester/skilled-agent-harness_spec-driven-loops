---
title: "OpenLTM continuity resilience"
description: "Bounded restore panel, authored PreCompact continuity snapshots, and goal/decision/progress/gotcha facets for markdown-native session continuity."
trigger_phrases:
  - "OpenLTM continuity resilience"
  - "SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT"
  - "bounded restore panel"
  - "authored continuity snapshot"
version: 3.6.0.1
---

# OpenLTM continuity resilience

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

OpenLTM continuity resilience adds markdown-native continuity recovery surfaces without creating memory rows or mutating the index.

The feature includes a bounded startup restore panel, an opt-in authored PreCompact snapshot refresh, and a goal/decision/progress/gotcha facet taxonomy for continuity summaries.

---

## 2. HOW IT WORKS

The resume ladder builds a restore panel from the existing continuity chain: `handover.md`, `_memory.continuity`, and spec-doc fallback sources. The panel reports restored and omitted counts so startup context stays bounded instead of dumping all candidate state.

Session bootstrap adds the restore panel to the startup payload. The thin continuity formatter renders summaries through goal, decision, progress, and gotcha facets. When `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1`, the Claude compact hook can refresh authored continuity in `handover.md` and `_memory.continuity` before compaction; disabled mode leaves packet-local ladder docs unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/resume/resume-ladder.ts` | Shared | Bounded restore panel and restored/omitted counts |
| `mcp_server/handlers/session-bootstrap.ts` | Handler | Startup payload restore-panel section |
| `mcp_server/lib/continuity/thin-continuity-record.ts` | Shared | Goal/decision/progress/gotcha facet formatter |
| `mcp_server/lib/continuity/authored-continuity-snapshot.ts` | Shared | Markdown-only authored snapshot refresh helper |
| `mcp_server/hooks/claude/compact-inject.ts` | Hook | Opt-in snapshot refresh before hook-cache work |
| `mcp_server/ENV_REFERENCE.md` | Reference | Documents authored continuity snapshot flag |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/openltm-continuity-resilience.vitest.ts` | Automated test | Restore panel, snapshot, cache-loss, facets, and disabled-mode invariants |
| `mcp_server/tests/resume-ladder.vitest.ts` | Automated test | Resume ladder regression coverage |
| `mcp_server/tests/session-bootstrap.vitest.ts` | Automated test | Bootstrap payload coverage |
| `mcp_server/tests/thin-continuity-record.vitest.ts` | Automated test | Facet formatter coverage |
| `mcp_server/tests/hook-precompact.vitest.ts` | Automated test | Compact hook behavior coverage |

---

## 4. SOURCE METADATA

- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `context-preservation/openltm-continuity-resilience.md`

Related references:
- [session-start-priming.md](session-start-priming.md) - Startup priming path
- [precompact-hook.md](precompact-hook.md) - PreCompact hook context caching
