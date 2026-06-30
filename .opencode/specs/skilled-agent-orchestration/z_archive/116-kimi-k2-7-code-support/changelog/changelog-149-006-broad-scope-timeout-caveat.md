---
title: "Changelog: Phase 6: broad-scope-timeout-caveat [149-kimi-k2-7-code-support/006-broad-scope-timeout-caveat]"
description: "Chronological changelog for documenting the Kimi K2.7 Code broad-scope timeout caveat."
trigger_phrases:
  - "phase changelog"
  - "timeout caveat"
  - "kimi broad scope"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/006-broad-scope-timeout-caveat` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support`

### Summary

The final phase recorded the operational failure mode that matters when Kimi K2.7 Code is used on broad repository scopes. With `--variant high`, `kimi-for-coding/k2p7` can over-explore through many sequential reads and exceed a 600s timeout before emitting. Because `opencode` flushes only the final assistant message to stdout, the killed run yields 0 bytes and looks like a hang even though the model was working, so the documented mitigation is a hard read cap, a 1200s or longer timeout and optionally omitting `--variant`.

### Added

- Added the §6 `variant_flag` operational caveat to `kimi-k2.7-code.md`.
- Added the §2 average wall-clock observation to `kimi-k2.7-code.md`.
- Added the over-exploration and timeout entry to the `kimi-k2.7-code` weaknesses array in `model_profiles.json`.

### Changed

- Upgraded `kimi-k2.7-code.md` §5 scaffold note to the load-bearing over-exploration, 600s timeout and 0-byte failure mode.
- Added the read-cap and 1200s mitigation to `kimi-k2.7-code.md`.
- Appended the operational caveat to the `kimi-for-coding/k2p7` line in `cli-opencode/SKILL.md`.
- Reconciled the parent phase map phase-6 row and `children_ids` in `graph-metadata.json`.
- Confirmed `model_profiles.json` parses through `node JSON.parse`.
- Confirmed `check-prompt-quality-card-sync.sh` returned `GUARD PASS` with CHECK 1 through CHECK 4, exit 0.
- Strict-validated this phase and reconciled completion metadata.

### Fixed

- Repaired stale `opencode-go/kimi-k2.6` row to `kimi-for-coding/k2p7` in `cli_reference.md`.
- Repaired `kimi-k2.6` to `kimi-k2.7-code` with context 262,144 in `context-budget.md`.
- Added the caveat to `context-budget.md`.
- Fixed the related prose reference in `context-budget.md`.

### Verification

| Check | Result |
|-------|--------|
| Caveat coverage | PASS: caveat and mitigation present in `kimi-k2.7-code.md` §5 and §6, `model_profiles.json` weaknesses and `cli-opencode/SKILL.md`. |
| JSON parse | PASS: `node JSON.parse` validated `model_profiles.json`. |
| Registry, profile and card sync | PASS: `check-prompt-quality-card-sync.sh` returned `GUARD PASS`, CHECK 1 through CHECK 4, exit 0. |
| Stale Kimi 2.6 references | PASS: `cli_reference.md` and `context-budget.md` now cite `kimi-for-coding/k2p7` and `kimi-k2.7-code`. |
| Strict validation | PASS: `validate.sh <this phase> --strict` exited 0. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-prompt-models/references/models/kimi-k2.7-code.md` | Updated | §5 load-bearing read-cap and failure mode, §6 `variant_flag` caveat and §2 wall-clock observation. |
| `sk-prompt-models/assets/model_profiles.json` | Updated | Added Kimi K2.7 Code weakness for over-exploration and timeout. |
| `cli-opencode/SKILL.md` | Updated | Added operational caveat to the `kimi-for-coding/k2p7` line. |
| `cli-opencode/references/cli_reference.md` | Updated | Changed `opencode-go/kimi-k2.6` row to `kimi-for-coding/k2p7`. |
| `cli-opencode/references/context-budget.md` | Updated | Changed `kimi-k2.6` to `kimi-k2.7-code`, recorded 262,144 context, added caveat and fixed prose reference. |
| `149/spec.md, 149/graph-metadata.json` | Updated | Phase-6 map row and `children_ids`. |

### Follow-Ups

- The caveat is an observation, not a benchmark. It rests on two timeouts and one fixed run.
- A controlled A/B test with broad scope, same timeout, with and without `--variant high` would isolate whether `--variant high` specifically drives over-exploration.
- The open question feeds the parent's §4 `--variant` question.
- The manual testing playbook `CO-036` `kimi-k2.6` scenario was not updated. It was deferred to avoid disturbing the playbook's file-count self-check.
- A linter normalized pre-existing 149/154 packet-id drift during this phase. That was a bonus side effect of touching packet metadata, not an authored goal of the phase.
