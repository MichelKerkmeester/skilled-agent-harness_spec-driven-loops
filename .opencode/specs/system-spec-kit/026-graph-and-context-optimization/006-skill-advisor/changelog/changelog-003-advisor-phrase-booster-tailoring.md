---
title: "Phase 003: Advisor phrase booster tailoring"
description: "Migrated 36 tokenizer-broken multi-word and hyphenated INTENT_BOOSTERS entries to PHRASE_INTENT_BOOSTERS, added 33 new phrase routes. Regression held at 1.0 top-1 and 1.0 P0 pass rate across 52 cases."
trigger_phrases:
  - "phase 003 changelog"
  - "advisor phrase booster"
  - "phrase intent booster migration"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-15

> Spec folder: `026-graph-and-context-optimization/006-skill-advisor/002-advisor-phrase-booster-tailoring` (Level 2)
> Parent packet: `026-graph-and-context-optimization/006-skill-advisor`

### Summary

The skill advisor's multi-word phrase routing now actually works as designed. 24 tokenizer-broken whitespace entries and 12 hyphenated entries that were silently dead in `INTENT_BOOSTERS` (because the tokenizer `\b\w+\b` splits on whitespace and hyphens before dict lookup) have been migrated to `PHRASE_INTENT_BOOSTERS` (which matches substrings against the raw prompt). The headline win: "5-dimension agent scoring" was misrouting to `sk-improve-prompt` at 0.77 via a weak single-token match. After the fix it routes to the correct `sk-improve-agent` at 0.95.

### Added

- 33 new `PHRASE_INTENT_BOOSTERS` entries (6 migrations + 15 new identifiers + 2 hyphenated + 10 follow-up hyphenated).
- 8 new P1 regression fixture cases (suite grew from 44 to 52).
- Inline comment block near `PHRASE_INTENT_BOOSTERS` warning against whitespace and hyphen keys in `INTENT_BOOSTERS`.
- Delta report at `scratch/phrase-boost-delta.md` with per-key disposition.

### Changed

- 36 entries deleted from `INTENT_BOOSTERS` (24 whitespace + 12 hyphenated).
- `INTENT_BOOSTERS` now contains only single-token keys. The tokenizer and the dict are aligned.
- `skill_advisor_regression_cases.jsonl` grew from 44 to 52 cases.

### Fixed

- "5-dimension agent scoring" now routes to `sk-improve-agent` at 0.95 instead of `sk-improve-prompt` at 0.77.
- "proposal-only candidate evaluation" recovered from NONE to `sk-improve-agent` at 0.78.
- 15 new phrase routes close under-covered identifiers across six skills.
- `MULTI_SKILL_BOOSTERS` audited: zero multi-word keys found.

### Verification

- `sed -n '496,726p' skill_advisor.py | grep -cE '^\s*"[^"]+\s+[^"]+":'` returns 0.
- Python AST parse: exit 0.
- Regression harness: 52/52 pass. `overall_pass: true`. Top-1 accuracy: 1.0. P0 pass rate: 1.0.
- All 5 REQ-010 representative queries at 0.95 confidence.
- `scratch/phrase-boost-delta.md` documents per-key disposition and before/after confidences.

### Files Changed

| File | What changed |
|------|--------------|
| `skill-advisor/scripts/skill_advisor.py` | Delete 36 INTENT entries, add 33 PHRASE entries, add inline comment block |
| `skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Append 8 P1 fixture cases |

### Follow-Ups

- Barter repo advisor is out of sync and needs its own migration pass.
- REQ-020 bench latency not re-measured (data-only change, low p95 risk).
