---
title: "Generic-Query Deep Routing: Short Low-Signal Queries Escalate for Recall"
description: "A short generic query like Semantic Search or agent improvement no longer takes the smallest retrieval path. The classifier now escalates a short low-signal query from simple to complex with low confidence, the expander carries semantic, retrieval, agent, skill and council synonyms, and the recovery payload offers the expansion variants as concrete suggested queries."
trigger_phrases:
  - "002/016/003 generic query deep routing changelog"
  - "short low-signal query escalation"
  - "query expander synonyms semantic retrieval agent"
  - "recovery suggested queries from expansion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A two or three word generic query carries real intent but little lexical anchor, so it was classified `simple` and routed to the smallest retrieval and budget path, which is the worst path for a query that needs recall help. This phase teaches the classifier to recognize that shape and escalate it. A query of two or three terms with no strong anchor token and a stop-word ratio at or above one half is now escalated from `simple` to `complex` with low confidence, so it earns the wider retrieval path instead of the narrow one. The expander gained semantic, retrieval, agent, skill and council synonym groups so those generic topics expand into the vocabulary the corpus actually uses. And the recovery payload now populates its suggested queries from the expansion variants, so a weak result set comes back with concrete better queries to try rather than a bare disambiguation prompt.

### Added

- Semantic, retrieval, agent, skill and council synonym groups in `query-expander.ts`
- Expansion-derived `suggestedQueries` in the recovery payload

### Changed

- `lib/search/query-classifier.ts` - a short low-signal query (two or three terms, no anchor token, stop-word ratio at or above 0.5) escalates `simple` to `complex` with low confidence
- `lib/search/recovery-payload.ts` - suggested queries are sourced from the expansion variants instead of being left empty

### Fixed

- A generic short query no longer takes the smallest retrieval and budget path
- A weak result set now returns actionable suggested queries rather than only a disambiguation ask

### Verification

| Check | Result |
|-------|--------|
| Phase suite | PASS: `generic-query-deep-routing.vitest.ts` |
| Touched-surface sweep | PASS: 12 files green including `query-classifier`, `query-expander` and `recovery-payload` |
| Live recall lift | DEFERRED: the recall delta for the original generic queries is only measurable after the deferred reindex restores the un-embedded rows |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generic-query-deep-routing.vitest.ts` | Added |

### Follow-Ups

- The synonym groups are seeded for the topics that surfaced in the research. Broader coverage should be driven by real low-recall query logs rather than hand-authored ahead of evidence.
