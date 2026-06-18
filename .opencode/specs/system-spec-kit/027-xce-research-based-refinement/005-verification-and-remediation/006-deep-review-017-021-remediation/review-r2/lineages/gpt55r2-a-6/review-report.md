---
title: Deep Review Report - gpt55r2-a-6
description: Synthesis for one-iteration search/retrieval fanout lineage.
trigger_phrases:
  - "gpt55r2-a-6 review report"
  - "folder boost similarity scale finding"
importance_tier: normal
contextType: review
---

# Deep Review Report - gpt55r2-a-6

## Verdict

Review verdict: CONDITIONAL

One active P1 blocks an unconditional pass for this lineage. No P0 findings were confirmed.

## Scope

- Target: `.opencode/skills/system-spec-kit/mcp_server` search/retrieval surface.
- Scope source: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1-18`.
- Iterations: 1 of 1.
- Executor: `cli-opencode model=openai/gpt-5.5-fast`.
- Code graph readiness: stale, so direct Grep/Read evidence was used.

## Findings Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 0 | none |
| P1 | 1 | open |
| P2 | 0 | none |

## Active Findings

### F001 - P1 - Folder boost demotes scoped hits by capping 0-100 similarity at 1.0

`applyFolderBoostRanking` mutates matching rows with `raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0)` and sorts by `similarity` descending [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-676`]. The surrounding contracts treat raw similarity as 0-100: formatter comments say raw vector cosine similarity is 0-100 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:85-103`], the pipeline resolver normalizes by `/100` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57-75`], and stage 1 emits `sr.similarity * 100` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1326-1334`]. The existing folder boost test uses 0.7 and 0.6 values, so it misses the production-scale failure [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts:96-124`].

Recommended remediation: make folder boost scale-aware and preserve the public similarity contract, or rank with a separate normalized/boosted score field instead of mutating raw `similarity`. Add a regression test using production-scale similarities above 1.

## Confirmed-Clean Surfaces

- `limit` is clamped to 100 and invalid values default to 10 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:904-907`].
- Community fallback rows pass through governed scope filtering before merge [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198`].
- Trigger embedding backfill is default-off, chunks and yields between phrase-sync transactions, limits pending embedding rows, and checks cancellation in both main loops [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:49-55`, SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:266-306`].

## Coverage Gaps

- This was a one-iteration lineage, so security, traceability, and maintainability were not exhaustively covered.
- Code graph was stale; graph-derived structural impact was not used.

## Artifacts

- `iterations/iteration-001.md`
- `deltas/iter-001.jsonl`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-dashboard.md`
- `deep-review-strategy.md`
- `resource-map.md`
