---
title: "Search and Output Intelligence Deep-Research: The Findings Behind Phase 017"
description: "A ten-iteration deep-research pass (Opus 4.8 via claude2, five plus five) over two questions: how to lift search intelligence beyond what phase 015 shipped, and how to make AI output comparable when prompted through a command versus natural conversation. The research produced the code-cited findings and the prioritized recommendations that phase 017 implemented. No production code shipped from this packet."
trigger_phrases:
  - "002/016 search and output intelligence research changelog"
  - "deep research opus 5 plus 5 search output"
  - "search intelligence findings behind 017"
  - "ai output command versus conversation research"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence-research` (Phase Parent, research)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

With the dominant retrieval miscalibration fixed in phase `015`, this packet ran a ten-iteration deep-research pass (Opus 4.8 through the claude2 account, split five plus five across two lineages) to find what remained and to ground every finding in the live daemon and the search code. The first lineage, search-intelligence, asked how to lift retrieval quality beyond what `015` shipped. It surfaced five problems: generic two-word queries still read weak because they return mixed matches, a strong top hit is dragged to weak by a weaker tail, token-budget truncation hides results by trimming five down to one, cross-encoder reranking is removed so there is a ranking-quality headroom question, and the FSRS cold-tier ranking could be tuned. The second lineage, ai-output-command-vs-conversation, asked why the same `/memory:search` result renders differently across models and surfaces. It produced key questions KQ1 through KQ5 and recommendations one through seven, the core finding being that weak models drop the query and that models render non-comparable score fields. This packet is research only. The findings became the seven implementation phases under `017`, and the fifth search problem became the documented FSRS no-change disposition there.

### Added

- `001-search-intelligence/research/research.md` - five iterations on retrieval-quality gaps with code citations
- `002-ai-output-command-vs-conversation/research/lineages/ai-output-opus/research.md` - five iterations on command-versus-conversation output parity, KQ1 through KQ5 and recommendations one through seven

### Verification

| Check | Result |
|-------|--------|
| Findings grounded | CONFIRMED: each finding cites live `memory_search` or `memory_health` evidence and code under `lib/search` |
| Implementation | The findings are implemented in phase `017` (seven phases plus the FSRS no-change disposition) |
| Production code | None shipped from this packet (research only) |

### Files Changed

| File | Action |
|------|--------|
| `…/016-search-and-output-intelligence-research/001-search-intelligence/research/research.md` | Added |
| `…/016-search-and-output-intelligence-research/002-ai-output-command-vs-conversation/research/lineages/ai-output-opus/research.md` | Added |

### Follow-Ups

- The implementation of every actioned finding is tracked under [changelog-002-017-search-and-output-intelligence-implementation-root.md](./changelog-002-017-search-and-output-intelligence-implementation-root.md).
