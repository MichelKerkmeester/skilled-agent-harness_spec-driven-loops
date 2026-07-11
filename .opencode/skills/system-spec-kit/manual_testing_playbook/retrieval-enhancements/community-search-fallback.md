---
title: "148 -- Community-level search fallback"
description: "Validates searchCommunities() word-overlap scoring against community summaries and the fallback surfacing when primary channels return weak results."
audited_post_018: true
version: 3.6.0.5
---

# 148 -- Community-level search fallback

## 1. OVERVIEW

This scenario validates the community-level fallback layer. It exercises word-overlap scoring against community summaries, the surfacing path when vector and BM25 channels return weak results, and the `SPECKIT_COMMUNITY_SEARCH_FALLBACK` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify community search returns topic-level matches via word-overlap scoring and that it surfaces as fallback when primary channels are weak.
- Real user request: `Please validate community-level fallback: prove searchCommunities matches queries against summaries using word overlap and surfaces when primary retrieval is weak, with SPECKIT_COMMUNITY_SEARCH_FALLBACK=false reverting behavior.`
- Prompt: `Validate community-level search fallback and confirm word-overlap matches against community summaries surface when primary channels are weak.`
- Expected execution process: Pick a query that returns weak primary results, run the search, inspect the fallback section for community matches, toggle the flag.
- Expected signals: community summaries are scored by word overlap with the query; matches surface as fallback when primary results are weak or empty; results carry a provenance marker indicating community origin; `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` removes the fallback surfacing.
- Desired user-visible outcome: Pass/fail verdict with cited fallback evidence.
- Pass/fail: PASS when community matches surface with word-overlap scoring and the kill-switch reverts behavior. FAIL when no fallback surfaces despite weak primary results, scores look random, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate community-level search fallback and confirm word-overlap matches against community summaries surface when primary channels are weak.
```

### Commands

1. Confirm at least one community summary exists in the database (`community_summaries` table or equivalent). Pick a query `<Q>` that shares 2+ content words with a known community summary but does not have strong primary-channel hits.
2. `memory_search({ query: "<Q>", limit: 10, includeTrace: true })` and capture the response. Inspect the fallback section.
3. Assert the response surfaces at least one community match. Inspect the trace for word-overlap scoring against the matched community.
4. Compare the scored community to a deliberately unrelated community summary. Assert the related one ranks higher.
5. Set `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` in MCP env, restart, repeat step 2. Assert no community matches surface even when primary channels stay weak.
6. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/community-search.vitest.ts`.

### Expected

- Community match surfaces in the fallback section with provenance marker.
- Word-overlap scoring ranks related summaries above unrelated ones.
- Flag-off run suppresses community matches.
- Vitest exits 0.

### Evidence

- Community summary precondition command:

```text
$ sqlite3 -readonly "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite" "SELECT name FROM sqlite_master WHERE type='table' AND name='community_summaries'; SELECT community_id, member_count, substr(summary,1,500) AS summary, member_ids FROM community_summaries LIMIT 10;"
community_summaries
1|19|Community 1 groups 19 causally linked memories across 3 spec folders. Key memories include "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments", "Implementation Summary: cli-copilot Total Deprecation", and "Implementation Summary: P1 + P2 Stress-Test Remediation". It is most closely associated with system-spec-kit, skilled-agent-orchestration/z_archive/081-cli-copilot-deprecation-due-to-price-hike, and system-spec-kit/026-graph-and-context-optimization/000-release-and-program-clea|[5,1380,1386,2328,2431,2436,2448,2456,2461,2700,3281,3313,3867,3920,5196,5216,5226,5236,7150]
2|132|Community 2 groups 132 causally linked memories across 3 spec folders. Key memories include "GATE ENFORCEMENT - Edge Cases & Cross-Reference", "Implementation Plan: Scope-Change Guard", and "Implementation Plan: Code Graph + Advisor + Hooks Polish". It is most closely associated with system-spec-kit, system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/006-scope-change-scan-guard, and system-spec-kit/026-graph-and-context-optimization/004-code|[7,15,22,30,878,882,890,897,905,912,918,923,928,933,938,942,949,954,959,964,971,979,984,990,995,1002,1010,1020,1044,1055,1061,1068,1075,1080,1107,1126,1131,1152,1170,1175,1180,1182,1196,1198,1202,1204,1210,1219,1224,1230,1241,1437,1797,1798,1880,1890,1900,1911,4015,4026,4035,4043,4071,4082,4328,4348,4525,4760,4827,4931,4972,5673,5715,6314,6458,6834,6841,7085,7132,10696,10780,10783,10786,10791,10796,10800,10803,10807,10809,10815,10832,10854,10882,10885,10895,10897,10939,10944,10963,10978,10981,10985,10990,10994,10997,11000,11003,11006,11107,11111,11116,11120,11124,11128,11132,11136,11142,11148,11161,11172,11175,11178,11182,11187,11190,11194,11199,11202,11206,11211,11216,11268]
3|25|Community 3 groups 25 causally linked memories across 3 spec folders. Key memories include "TOOL ROUTING - Search & Retrieval Decision Tree", "Verification Checklist: Code Graph RPC Classifier Surface", and "Implementation Summary: Code Graph RPC Classifier Surface". It is most closely associated with system-spec-kit, system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface, a|[8,2530,2532,2535,2536,2984,3680,3686,4765,4766,5701,5773,5835,5889,5902,5908,6043,6267,8514,8516,8553,8557,8570,8594,8611]
4|33|Community 4 groups 33 causally linked memories across 3 spec folders. Key memories include "MEMORY — Spec-Kit System Only", "Feature Specification: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/spec]", and "Feature Specification: Merge sk-code-web + sk-code-full-stack into sk-code". It is most closely associated with system-spec-kit, skilled-agent-orchestration/z_archive/047-cli-opencode-creation, and skilled-agent-orchestration/z_archive/054-sk-code-merger.|[10,1280,1792,1796,1800,1825,1826,1829,1830,1831,1838,1842,1845,1849,1850,1854,1856,1857,1861,1884,2918,6620,6910,6995,7133,8355,8534,8562,11104,11141,11184,11196,11208]
5|39|Community 5 groups 39 causally linked memories across 3 spec folders. Key memories include "Session Handover: Orphan MCP Leak Prevention", "Implementation Summary: Phase 001 — Skill-benchmark deep research", and "Implementation Summary: Phase 002 — Implementation deep research". It is most closely associated with system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention, skille|[11,21,23,26,27,1015,1023,1027,1030,1035,1345,1420,1669,1749,1808,1920,3048,3079,3766,3863,4261,4266,4305,5441,5457,6398,6468,6632,6715,10779,10785,10790,10795,10799,10802,10829,10881,10884,10887]
6|3|Community 6 groups 3 causally linked memories across 3 spec folders. Key memories include "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship", "Tasks: Text Link Button Disabled State", and "Tasks: Link Card Button & Mobile Animation Fixes". It is most closely associated with system-spec-kit, anobel.com/001-button-text-link-disabled-state, and anobel.com/002-link-card-button-and-mobile-animation.|[12,20,25]
7|12|Community 7 groups 12 causally linked memories across 3 spec folders. Key memories include "Feature Specification: mk-code-index reconnecting session proxy", "Description: Feature Specification: Text Link Button Disabled State", and "Feature Specification: Text Link Button Disabled State". It is most closely associated with system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy, anobel.com/001-button-text-link-disabled-state, and anobel.co|[16,17,19,24,891,903,953,10781,10784,10787,10788,10801]
8|3|Community 8 groups 3 causally linked memories across 3 spec folders. Key memories include "Tasks: SpecKit [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/003-speckit-skill-refinement/tasks]", "Tasks: Post-Merge [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/037-post-merge-refinement-2/tasks]", and "Tasks: Slider JS Refactor & Variant Split". It is most closely associated with system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/003-speckit-skill-refinement, s|[32,6610,6794]
9|18|Community 9 groups 18 causally linked memories across 3 spec folders. Key memories include "Implementation Summary: Daemon-lifecycle healing (F1/F2/F3)", "Implementation Summary [template:level_2/implementation-summary.md]", and "Implementation Summary: Daemon-lifecycle healing (F1/F2/F3)". It is most closely associated with system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing, system-spec-kit/026-graph-and|[876,6255,10894,10925,10970,10975,10976,10977,10980,10984,10989,10993,10996,10999,11147,11152,11166,11169]
10|15|Community 10 groups 15 causally linked memories across 3 spec folders. Key memories include "Feature Specification: Orphan-sweep Stop-hook activation", "Feature Specification: archived context workflow adoption (root-cause fix)", and "Feature Specification: Portable cross-machine hook paths and Barter framework sync". It is most closely associated with system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation, skilled-agent-orchestration/137-|[879,10804,10808,10852,10883,10886,10889,10893,10896,10906,10928,10982,10986,10991,10995]
```

- Default-on `memory_search` command for `<Q>` = `orphan sweep stop hook portable barter paths`:

```text
$ node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"orphan sweep stop hook portable barter paths","limit":10,"includeTrace":true,"includeConstitutional":false,"bypassCache":true,"retrievalLevel":"auto"}' --format json --timeout-ms 15000
(node:83221) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 6 memories",
  "data": {
    "searchType": "hybrid",
    "count": 6,
    "requestQuality": {
      "label": "weak"
    },
    "pipelineMetadata": {
      "stage2": {
        "graphContribution": {
          "killSwitchActive": false,
          "causalBoosted": 0,
          "coActivationBoosted": 0,
          "communityInjected": 0,
          "graphSignalsBoosted": 0,
          "totalGraphInjected": 0,
          "rolloutState": "bounded_runtime"
        },
        "communityBoostApplied": true,
        "graphSignalsApplied": true
      }
    },
    "graphContribution": {
      "killSwitchActive": false,
      "causalBoosted": 0,
      "coActivationBoosted": 0,
      "communityInjected": 0,
      "graphSignalsBoosted": 0,
      "totalGraphInjected": 0,
      "rolloutState": "bounded_runtime"
    },
    "retrievalTrace": {
      "traceId": "tr_mr3ker81_l98fqu",
      "query": "orphan sweep stop hook portable barter paths",
      "totalDurationMs": 2152,
      "finalResultCount": 5
    },
    "searchDecisionEnvelope": {
      "queryPlan": {
        "fallbackPolicy": {
          "mode": "none",
          "reason": "No fallback applied"
        }
      }
    },
    "results": [
      {
        "id": 31970,
        "title": "Feature Specification: Orphan-sweep Stop-hook activation",
        "score": 0.4888629990012991,
        "trace": {
          "graphContribution": {
            "sources": [],
            "totalDelta": 0,
            "injected": false,
            "raw": 0,
            "normalized": 0,
            "appliedBonus": 0,
            "capApplied": false,
            "rolloutState": "bounded_runtime"
          }
        }
      }
    ]
  },
  "meta": {
    "tool": "memory_search",
    "cacheHit": false,
    "tokenBudgetTruncated": true,
    "originalResultCount": 6,
    "returnedResultCount": 6
  }
}
```

- Community summary row dump and word-overlap scoring comparison for matched community 10 and unrelated community 6:

```text
$ sqlite3 -readonly "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite" "WITH terms(term) AS (VALUES ('orphan'),('sweep'),('stop'),('hook'),('portable'),('barter'),('paths')), scored AS (SELECT c.community_id, c.member_count, c.summary, c.member_ids, ROUND(SUM(CASE WHEN instr(lower(c.summary), term) > 0 THEN 1 ELSE 0 END) * 1.0 / (SELECT COUNT(*) FROM terms), 6) AS match_score FROM community_summaries c CROSS JOIN terms GROUP BY c.community_id) SELECT community_id, member_count, match_score, summary, member_ids FROM scored WHERE community_id IN (10,6) ORDER BY match_score DESC, member_count DESC;"
10|15|1.0|Community 10 groups 15 causally linked memories across 3 spec folders. Key memories include "Feature Specification: Orphan-sweep Stop-hook activation", "Feature Specification: archived context workflow adoption (root-cause fix)", and "Feature Specification: Portable cross-machine hook paths and Barter framework sync". It is most closely associated with system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation, skilled-agent-orchestration/137-context-workflow-adoption, and skilled-agent-orchestration/138-portable-cross-machine.|[879,10804,10808,10852,10883,10886,10889,10893,10896,10906,10928,10982,10986,10991,10995]
6|3|0.0|Community 6 groups 3 causally linked memories across 3 spec folders. Key memories include "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship", "Tasks: Text Link Button Disabled State", and "Tasks: Link Card Button & Mobile Animation Fixes". It is most closely associated with system-spec-kit, anobel.com/001-button-text-link-disabled-state, and anobel.com/002-link-card-button-and-mobile-animation.|[12,20,25]
```

- Flag-off `memory_search` repeat attempts:

```text
$ SPECKIT_COMMUNITY_SEARCH_FALLBACK=false node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"orphan sweep stop hook portable barter paths","limit":10,"includeTrace":true,"includeConstitutional":false,"bypassCache":true,"retrievalLevel":"auto"}' --format json --timeout-ms 15000
(node:93209) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "socket closed before response",
  "exitCode": 75
}

$ SPECKIT_COMMUNITY_SEARCH_FALLBACK=false node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"orphan sweep stop hook portable barter paths","limit":10,"includeTrace":true,"includeConstitutional":false,"bypassCache":true,"retrievalLevel":"auto"}' --format json --timeout-ms 15000
(node:93548) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "tools/call timed out",
  "exitCode": 75
}
```

- Targeted Vitest summary:

```text
$ npm exec -- vitest run tests/community-search.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  15:56:10
   Duration  1.32s (transform 942ms, setup 25ms, import 1.14s, tests 11ms, environment 0ms)
```

### Pass / Fail

- **FAIL**: default-on `memory_search` returned weak results but did not surface a community fallback (`communityInjected: 0`, `fallbackPolicy.mode: "none"`, result trace `graphContribution.sources: []` / `injected: false`). Direct summary scoring ranked the related community above the unrelated one (`1.0` vs `0.0`), and Vitest exited 0, but the scenario's required fallback surfacing did not occur; flag-off repeat attempts also failed with retryable IPC errors (`socket closed before response`, then `tools/call timed out`, both `exitCode: 75`).

### Failure Triage

Inspect `mcp_server/lib/search/community-search.ts:searchCommunities` for the word-overlap scorer. Verify the fallback invocation site reads weak-result thresholds correctly. Confirm `SPECKIT_COMMUNITY_SEARCH_FALLBACK` is read at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval-enhancements/community-search-fallback.md](../../feature_catalog/retrieval-enhancements/community-search-fallback.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 148
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval-enhancements/community-search-fallback.md`
