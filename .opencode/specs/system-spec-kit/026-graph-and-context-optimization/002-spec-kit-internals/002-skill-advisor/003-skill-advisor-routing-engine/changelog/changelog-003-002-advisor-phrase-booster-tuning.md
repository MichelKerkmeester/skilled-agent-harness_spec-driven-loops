---
title: "Advisor Phrase-Booster Tailoring"
description: "The skill advisor's multi-word phrase routing was broken because the tokenizer splits on whitespace before dictionary lookup, turning 24 INTENT_BOOSTERS entries into no-ops. Broken entries were migrated to PHRASE_INTENT_BOOSTERS and 15 new phrase routes were added for under-covered identifiers."
trigger_phrases:
  - "advisor phrase booster tailoring"
  - "intent boosters migration"
  - "skill advisor routing optimization"
  - "tokenizer multi-word fix"
  - "5-dimension agent scoring routing"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

The skill advisor's tokenizer split multi-word keys on whitespace before dictionary lookup, making 24 `INTENT_BOOSTERS` entries silent no-ops. All 36 affected entries (including 12 hyphenated-token keys found later) were migrated to `PHRASE_INTENT_BOOSTERS` which matches substrings against the raw prompt. An additional 15 phrase routes were added for under-covered Public identifiers across six skills. The regression fixture holds at 1.0 top-1 accuracy and P0 pass rate with the headline query "5-dimension agent scoring" now routing to `sk-improve-agent` at 0.95 confidence instead of misrouting to `sk-improve-prompt` at 0.77.

### Added
- Phrase-based routing entries for 15 under-covered Public identifiers across six skills: `system-spec-kit`, `sk-code-opencode`, `sk-code-full-stack`, `sk-code-web`, `mcp-code-mode` and `sk-code-review`
- 8 new P1 regression fixture cases validating newly-routed multi-word phrases (suite grew from 44 to 52 cases)
- Inline comment block near `PHRASE_INTENT_BOOSTERS` warning future contributors against whitespace- or hyphen-containing keys in `INTENT_BOOSTERS`

### Changed
- 36 multi-word and hyphenated `INTENT_BOOSTERS` entries removed and migrated to `PHRASE_INTENT_BOOSTERS` so the tokenizer and the dictionary are fully aligned
- The "5-dimension agent scoring" query now routes to `sk-improve-agent` at 0.95 confidence instead of misrouting to `sk-improve-prompt` at 0.77

### Fixed
- Multi-word phrase routing in the skill advisor no longer silently dead because of tokenizer whitespace splitting before dictionary lookup
- Hyphenated token keys (`proposal-only`, `openai-cli`, `claude-code` and 9 others) no longer split and ignored by the tokenizer

### Verification
- REQ-001 — Zero multi-word INTENT keys (whitespace strict): PASS (grep returned 0)
- REQ-003 — Regression harness exit 0 with `--min-top1-accuracy 0.92`: PASS (`overall_pass: true`)
- REQ-004 — P0 pass rate ≥ baseline: PASS (1.0 → 1.0, no regression)
- REQ-005 — Python AST parses: PASS (exit 0)
- REQ-010 — 5 target queries meet confidence thresholds: PASS (all 5 at 0.95, "5-dimension agent scoring" uplift 0.77 to 0.95 with correct-skill correction)
- REQ-011 — 5+ new PHRASE entries for under-covered identifiers: PASS (15 new entries from iteration-003 plus 2 hyphenated adds)
- REQ-012 — 8 new P1 fixture cases: PASS (fixture went 44 to 52)
- Regression fixture pass rate: 52 of 52 (100%)
- Per-key disposition documented in `scratch/phrase-boost-delta.md`
- Cumulative totals: 36 INTENT entries deleted, 33 PHRASE entries added, 8 fixture cases appended

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/skill-advisor/scripts/skill_advisor.py` | Modified | Removed 36 multi-word and hyphenated INTENT entries, added 33 PHRASE entries and an inline comment block |
| `.opencode/skills/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified | Appended 8 new P1 fixture cases (44 to 52 total) |

### Follow-Ups
- Barter repo advisor is out of sync with this Public-canonical migration and needs its own independent pass using the same pattern
- Bench latency (REQ-020) not re-measured after the data-only change. Measure `skill_advisor_bench.py` p95 if a downstream consumer reports perceived slowdown.
- None.
