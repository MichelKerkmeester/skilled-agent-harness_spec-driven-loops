---
title: "Skill Advisor Multi-Word Phrase Routing Fix"
description: "Multi-word booster keys that the tokenizer silently ignored are now active phrase routes. The 5-dimension agent scoring query, previously misrouted, now reaches the correct skill at 0.95 confidence."
trigger_phrases:
  - "advisor phrase booster"
  - "phrase intent booster migration"
  - "skill advisor routing fix"
  - "tokenizer multi-word bug"
  - "gate 2 routing optimization"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

The skill advisor ship quality routing engine had 36 multi-word keys in its INTENT_BOOSTERS dictionary that the tokenizer silently split into single tokens before lookup, making every one of them a dead entry. These entries were migrated to PHRASE_INTENT_BOOSTERS which matches substrings against the raw prompt. The headline fix: "5-dimension agent scoring" was misrouting to sk-improve-prompt at 0.77 confidence and now routes correctly to sk-improve-agent at 0.95.

### Added

- Phrase routes for 15 under-covered multi-word identifiers across the system spec kit, sk-code-web, sk-code-full-stack, sk-code-opencode, mcp-code-mode and sk-code-review skills.
- Two hyphenated-token phrase entries ("5-dimension" and "5-dimension agent scoring") to fix a tokenizer blind spot where hyphens split the same way whitespace does.
- An inline comment block near PHRASE_INTENT_BOOSTERS warning contributors never to place whitespace or hyphen keys inside INTENT_BOOSTERS.

### Changed

- All 36 dead multi-word entries (24 whitespace, 12 hyphenated) removed from INTENT_BOOSTERS, leaving only single-token keys that the tokenizer can match during lookup.
- PHRASE_INTENT_BOOSTERS expanded with 33 new entries across six skills, closing coverage gaps for multi-word routing queries.
- The regression fixture grew from 44 to 52 cases with 8 new P1 phrase-routing test scenarios.

### Fixed

- A routing bug where 36 multi-word keys in INTENT_BOOSTERS were silently dead because the tokenizer splits on whitespace and hyphens before dictionary lookup, making every affected booster entry a no-op with no warning.
- The "5-dimension agent scoring" query misrouted to sk-improve-prompt at 0.77 confidence through a weak single-token match on "scoring". It now routes correctly to sk-improve-agent at 0.95.

### Verification

- Zero multi-word INTENT keys remaining in whitespace scope (grep confirmed 0 matches). PASS
- Per-key migration disposition documented with full before-and-after table. PASS
- Regression harness exited 0 with minimum top-1 accuracy of 0.92. PASS
- P0 fixture pass rate held at 1.0 with no regression. PASS
- Python AST parsed cleanly with exit 0. PASS
- All 5 REQ-010 target queries met or exceeded 0.95 confidence, including the headline uplift from 0.77 to 0.95 on the 5-dimension agent scoring query. PASS
- 8 new P1 fixture cases appended, growing the suite from 44 to 52 cases. PASS
- Regression fixture passed 52 out of 52 cases (100 percent). PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/skill-advisor/scripts/skill_advisor.py` | Modified | Deleted 36 INTENT entries, added 33 PHRASE entries and an inline comment block near PHRASE_INTENT_BOOSTERS |
| `.opencode/skills/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified | Appended 8 P1 phrase-routing fixture cases (44 to 52 total) |

### Follow-Ups

- Benchmark harness p95 latency measurement was deferred. The change is data-only with no scoring logic modifications so latency impact is unlikely to exceed 5 percent. Re-measure only if a downstream user reports perceived slowdown.
- The Barter repository skill advisor is out of sync with these Public-canonical changes. Barter has independent drift that needs a separate migration pass applying the same pattern.
