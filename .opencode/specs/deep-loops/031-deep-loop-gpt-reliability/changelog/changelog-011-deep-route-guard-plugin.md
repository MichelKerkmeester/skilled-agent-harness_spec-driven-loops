---
title: "Changelog: Deep-Route-Guard Enforcement Plugin [031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin]"
description: "Chronological changelog for the Deep-Route-Guard Enforcement Plugin phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

### Summary

Built `.opencode/plugins/deep-route-guard.js` (same day, renamed to `mk-deep-loop-guard.js`), a `tool.execute.before` hook that flags/blocks Task dispatches whose declared mode disagrees with `mode-registry.json`, live-verified against the real installed `opencode` binary for hook firing, warn vs. throw-reject behavior, fail-open safety, and non-deep passthrough.

### Added

- `.opencode/plugins/mk-deep-loop-guard.js` — new enforcement plugin (configurable warn or hard-reject mode), originally created as `deep-route-guard.js` and renamed the same day for `mk-*` plugin-naming parity.
- `.opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs` (original path) — new hermetic test suite.
- Feature-catalog entry F050 and manual-testing-playbook entry DLR-052 — new catalog docs.

### Changed

- Log prefix and env var renamed (`DEEP_ROUTE_GUARD_REJECT` → `MK_DEEP_LOOP_GUARD_REJECT`) as part of the same-day rename.
- Directory-resolution switched to the `ctx?.directory` pattern; JSDoc added; one 207-char line refactored.

### Fixed

- Previously-unenforced routing-identity mismatch — phases 008-010 fixed identity but nothing enforced it at actual dispatch time.

### Verification

- Live smoke against real `opencode` v1.17.11: hook fires + default warn logs — PASS.
- `REJECT=1` throw path genuinely blocks the dispatch (`task` tool status `"error"`) — PASS.
- Fail-open with the registry temporarily removed — PASS (dispatch not blocked).
- Non-deep `subagent_type` passthrough — PASS.
- Re-verified identically post-rename.
- Hermetic test exits 0, "all assertions passed".
- Comment hygiene — PASS, 0 violations.
- Alignment-drift — PASS, 0 findings across 12 files.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 8/8, P1 6/6, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-deep-loop-guard.js` | Created | Route-mismatch detection/enforcement hook |
| `.opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs` | Created | Hermetic test coverage |
| `feature_catalog/03--validation/mk-deep-loop-guard.md` | Created | F050 catalog entry |
| `manual_testing_playbook/03--validation/mk-deep-loop-guard.md` | Created | DLR-052 playbook entry |
| `feature_catalog.md` | Modified | Index counts updated (49→50 features) |
| `manual_testing_playbook.md` | Modified | Index counts updated (51→52 scenarios) |

### Follow-Ups

- Detection depends on the Deep Route header's `mode=X` text actually appearing in the prompt — silent if the header is omitted entirely (catches disagreement, not absence).
- Cannot create hard runtime identity (remains FIX-5/host territory, resolved by phase 013's gate).
- Does not catch a schema-valid, route-matched artifact that is semantically wrong-mode internally.
- Mismatch regex is a simple text match, not a structured parse (low but non-zero false-positive risk).
- **Note (2026-07-01, later)**: this plugin's mode-mismatch check was hardened with prompt-text identity resolution and a second loop-repeat check in phase 017; the shared `.opencode/plugins/__tests__/` directory was subsequently renamed to `.opencode/plugins/tests/` by a concurrent cross-packet session (commit `8bfbffc433`) — the test file now lives at `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`.
