---
title: "Changelog: Phase 1: model-registration [149-kimi-k2-7-code-support/001-model-registration]"
description: "Chronological changelog for registering Kimi K2.7 Code as a first-class small model."
trigger_phrases:
  - "phase changelog"
  - "model registration"
  - "kimi k2.7 support"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/cli-external-orchestration/023-kimi-k2-7-code-support/001-model-registration` (Level 1)
> Parent packet: `.opencode/specs/cli-external-orchestration/023-kimi-k2-7-code-support`

### Summary

Kimi K2.7 Code became a first-class small model rather than a live provider slug that only worked by memory. The registry, prompt-craft profile, model aliases and `cli-opencode` surfaces now point users to `kimi-for-coding/k2p7`, while the older `kimi-k2.6` entry stays historical so existing references do not break. The phase closed by proving the provider is authenticated, the slug is live, the JSON parses, the card-sync guard passes and a real dispatch returns `pong`.

### Added

- Read the Adopting a New Provider checklist in `.opencode/skills/sk-prompt-models/references/pattern-index.md` §4.
- Added the `kimi-k2.7-code` entry and updated the registry description rotation line in `sk-prompt-models/assets/model-profiles.json`.
- Created `sk-prompt-models/references/models/kimi-k2.7-code.md` as the new prompt-craft profile.
- Added a `HISTORICAL` banner to `sk-prompt-models/references/models/kimi-k2.6.md`.
- Updated `references/models/_index.md` tables so `kimi-k2.7-code` is active and `kimi-k2.6` is historical.

### Changed

- Confirmed the `kimi-for-coding` provider is authenticated and the slug is live through `opencode models kimi-for-coding`.
- Captured live facts: context 262144, output 32768 and display name `Kimi K2.7 Code`.
- Retired `kimi-k2.6` in `model-profiles.json` by setting executors and `recommended_frameworks` status to historical, with notes pointing to `kimi-k2.7-code`.
- Updated `sk-prompt-models/SKILL.md` frontmatter, keywords, triggers, `MODEL_ALIASES` and the §3 matrix row.
- Mapped `kimi` to `kimi-k2.7-code`, added `kimi-k2.7`, `kimi-for-coding` and `k2p7`, and kept `kimi-k2.6`.
- Updated routing graph metadata in `sk-prompt-models/graph-metadata.json` and `cli-opencode/graph-metadata.json`.
- Updated `cli-opencode/SKILL.md` with the Kimi For Coding auth-login list entry and the `kimi-for-coding/k2p7` Model Selection paragraph.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Card-sync guard | PASS: `check-prompt-quality-card-sync.sh .` exited 0 with CHECK 1 tables-not-inlined, CHECK 2 tier-3 pointer-only, CHECK 3 registry/profile/_index complete and CHECK 4 discoverability. |
| Live smoke dispatch | PASS: `opencode run --model kimi-for-coding/k2p7 ... "Reply with exactly one word: pong"` returned `pong`, exit 0, cost 0 through the subscription and Token-Plan path. |
| JSON parse | PASS: `node JSON.parse` on all edited JSON files parsed cleanly. |
| Advisor routing probe | PASS: `what prompt framework ... for kimi-k2.7-code via cli-opencode` surfaced `sk-prompt-models` at confidence 0.94 and `cli-opencode` at 0.90. |
| Live model facts | PASS: `opencode models kimi-for-coding` on 2026-06-15 showed slug `kimi-for-coding/k2p7`, context 262144 and output 32768. `--variant high` was accepted, exit 0, with effect benchmark-unverified. |
| Tasks complete | PASS: 16 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-prompt-models/assets/model-profiles.json` | Updated | Added the `kimi-k2.7-code` entry, retired `kimi-k2.6` with status historical and notes pointing to `kimi-k2.7-code`, and updated the registry description rotation line. |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md` | Created | New seven-section prompt-craft profile with RCAF default-unverified and bakeoff pending. |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md` | Updated | Added a `HISTORICAL` banner showing it is superseded by `kimi-k2.7-code`. |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Updated | Moved `kimi-k2.7-code` to the ACTIVE table and `kimi-k2.6` to the Historical table. |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Updated | Updated frontmatter, keywords, activation and keyword triggers, `MODEL_ALIASES` and the §3 dispatch-matrix row. |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Updated | Added `trigger_phrases`, `intent_signals` and enhances context for `kimi-k2.7-code` and `kimi-for-coding`. |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Updated | Added `trigger_phrases` and `key_topics` for `kimi-k2.7-code`, `kimi-for-coding` and `kimi-for-coding/k2p7`. |
| `.opencode/skills/cli-opencode/SKILL.md` | Updated | Added a Kimi For Coding line to the auth-login list and the `kimi-for-coding/k2p7` model to the Model Selection paragraph. |

### Follow-Ups

- Best prompt framework was unverified at phase close. RCAF was recorded as the default at `default-unverified` status, with the empirical winner deferred to phase `002-framework-bakeoff` and fold-in deferred to `003-promote-results`.
- `--variant high` effect was unmeasured. The CLI accepted the variant at exit 0, but whether it improves output quality stayed benchmark-unverified and accepted-unverified until the bakeoff.
- The smoke test was a liveness check, not a quality check. The `pong` dispatch proved the slug dispatches and bills correctly, but said nothing about coding-task quality.
