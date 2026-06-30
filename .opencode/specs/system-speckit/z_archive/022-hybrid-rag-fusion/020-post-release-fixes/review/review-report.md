---
title: "Deep Review Report: 020 Pre-Release Remediation"
description: "Canonical 60-iteration release review for 020-post-release-fixes, written to review/ and treating the top-level review-report.md as historical input only."
---

# Deep Review Report: 020 Pre-Release Remediation

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | FAIL |
| **hasAdvisories** | true |
| **P0 (Blockers)** | 0 |
| **P1 (Required)** | 14 |
| **P2 (Advisories)** | 16 |
| **Iterations** | 60 |
| **Stop Reason** | segment_extension_budget_reached |
| **Review Scope** | 012 packet, parent epic, root 022 packet, public README/install surfaces, runtime hotspots, and the full live feature catalog plus backing code |
| **Fresh Baselines (2026-03-27)** | `012` local validate = FAIL, `022 --recursive` = PASS WITH WARNINGS, `mcp_server npm test` = PASS |
| **Segment-2 Delta** | `7` new runtime `P1`, `10` new runtime `P2` |
| **Segment-3 Delta** | `1` new tooling `P1`, `3` new feature-catalog `P2` |
| **Feature-State Summary** | `191 sound_and_supported / 48 sound_but_under-tested / 7 catalog_mismatch / 9 code_unsound` |

Segment 3 did not overturn the earlier runtime story; it made it more concrete. The audit now shows that the release is blocked by three stacked layers: stale packet/public documentation from segment 1, live runtime defects from segment 2, and a newly confirmed tooling contract regression plus a large under-tested feature block from segment 3.

Late wave-1 evidence also sharpened the feature-state ledger without increasing the finding count. The evaluation category carries a duplicate-ordinal traceability defect across its two `15-*` entries, and the discovery slice confirmed that `memory_list` is directionally sound but still not stably verified on its empty-string folder-filter edge case.

The new blocker from segment 3 is not theoretical. A fresh targeted scripts run fails `scripts/tests/memory-learn-command-docs.vitest.ts` because both the feature entry and the regression still depend on `.opencode/commands/memory/README.txt`, while the live workspace only has `.opencode/commands/memory/README.md`.

This `review/` packet remains the canonical audit surface. The top-level `/020-post-release-fixes/review-report.md` is historical evidence only.

## 2. Planning Trigger

`/spec_kit:plan` is required. The active blockers now span runtime behavior, tooling contract integrity, packet truth-sync, and feature-verification confidence.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 14,
    "P2": 16
  },
  "featureStateSummary": {
    "sound_and_supported": 194,
    "sound_but_under-tested": 47,
    "catalog_mismatch": 5,
    "code_unsound": 9
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Runtime/code integrity",
      "focus": [
        "scope-aware save dedup and PE arbitration",
        "constitutional-cache coherence and custom-path DB integrity",
        "session trust boundaries",
        "bulk-delete outage signaling",
        "tool-cache invalidation and shutdown safety"
      ]
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Packet/spec docs truth-sync",
      "focus": [
        "012 validator cleanup",
        "012 release-story reconciliation",
        "001 epic child-name alignment",
        "canonical review boundary"
      ]
    },
    {
      "id": "WS-3",
      "priority": "P1",
      "title": "Public docs and wrapper alignment",
      "focus": [
        "README/install counts and versions",
        "broken CocoIndex installer path",
        "006 and 015 denominator refresh",
        "root phase-link and plan-hygiene drift"
      ]
    },
    {
      "id": "WS-4",
      "priority": "P1",
      "title": "Feature verification and tooling contract repair",
      "focus": [
        "/memory:learn docs-alignment regression",
        "seven catalog mismatch entries",
        "forty-eight under-tested feature entries",
        "retirement of stale 007 correctness assumptions"
      ]
    }
  ]
}
```

## 3. Active Finding Registry

### P1 Findings (required)

| ID | Title | Dimension | Evidence |
|----|-------|-----------|----------|
| `HRF-DR-001` | 012 packet is not locally validator-clean | traceability | `012/implementation-summary.md:47,97,109` plus fresh `validate.sh` failure |
| `HRF-DR-002` | 012 packet tells conflicting release-state stories | correctness, traceability | `012/spec.md:28,30,48`; `012/implementation-summary.md:25,35,97`; historical top-level report |
| `HRF-DR-003` | Parent epic still points at the retired 012 child slug | traceability | `001-hybrid-rag-fusion-epic/spec.md:41,104,116` |
| `HRF-DR-004` | Public docs and install surfaces drift from live repo truth | maintainability, traceability | `.opencode/README.md`; `.opencode/install_guides/README.md`; `004-ux-hooks-automation/README.md` |
| `HRF-DR-005` | 006 feature-catalog wrapper publishes stale denominators | traceability | `006-feature-catalog/spec.md:45-56` |
| `HRF-DR-006` | 015 manual-testing wrapper is materially stale and self-contradictory | traceability | `015/spec.md`; `015/checklist.md`; `015/plan.md` |
| `HRF-DR-010` | TM-04 semantic dedup drops scope | correctness, security | `mcp_server/handlers/memory-save.ts:405-421,805-811`; `mcp_server/handlers/save/dedup.ts:79-119,151-192` |
| `HRF-DR-011` | PE arbitration drops scope | correctness, security | `mcp_server/handlers/memory-save.ts:463-466`; `mcp_server/handlers/save/pe-orchestration.ts:27-50` |
| `HRF-DR-013` | Constitutional-cache warmup can return empty results | correctness | `mcp_server/lib/search/vector-index-store.ts:436-452`; `mcp_server/lib/search/vector-index-queries.ts:214-280` |
| `HRF-DR-014` | Custom-path DB initialization bypasses embedding-dimension integrity validation | correctness | `mcp_server/lib/search/vector-index-store.ts:552-616,717-720` |
| `HRF-DR-016` | Caller-controlled session trust boundary hole | correctness, security | `mcp_server/lib/session/session-manager.ts:307-419`; `mcp_server/handlers/memory-context.ts:667-699` |
| `HRF-DR-018` | Bulk-delete DB outage is misreported as a generic search-style failure | correctness | `mcp_server/handlers/memory-bulk-delete.ts:78-80`; `mcp_server/context-server.ts:410`; `mcp_server/lib/errors/core.ts:261` |
| `HRF-DR-024` | Tool-cache stale in-flight reuse crosses invalidation and shutdown boundaries | correctness, security | `mcp_server/lib/cache/tool-cache.ts:237-257,335-351,398-402` |
| `HRF-DR-027` | Constitutional memory manager command docs-alignment contract is broken by a stale `README.txt` dependency | correctness, traceability, maintainability | `feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:37-45`; `scripts/tests/memory-learn-command-docs.vitest.ts:24-38`; `.opencode/commands/memory/README.md:1-16` |

### P2 Findings (advisories)

| ID | Title | Dimension | Evidence |
|----|-------|-----------|----------|
| `HRF-DR-007` | Root 019/020 phase-link drift remains open as a warning | traceability, maintainability | `019/spec.md:31`; `020/spec.md:24-29` |
| `HRF-DR-008` | Root 022 plan duplicates the effort-estimation section | maintainability | `022/plan.md:147-169` |
| `HRF-DR-009` | Historical top-level 012 report is easy to confuse with the canonical review surface | maintainability, traceability | historical `012/review-report.md:1`; `012/spec.md:48` |
| `HRF-DR-012` | Scoped save behavior lacks direct regression coverage | maintainability | `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`; `handler-memory-save.vitest.ts` |
| `HRF-DR-015` | Folder-scoped constitutional cache invalidation misses suffixed keys | maintainability | `mcp_server/lib/search/vector-index-store.ts:442,503-505` |