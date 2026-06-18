---
title: "Changelog: Phase 6 optional: Smaller and Heavier Add-ons [142-sk-code-ponytail-based-refinement/006-optional-addons]"
description: "Chronological changelog for the Phase 6 optional add-ons."
trigger_phrases:
  - "phase changelog"
  - "optional addons"
  - "review depth alias"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/006-optional-addons` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement`

### Summary

Phase 6 shipped the two optional add-ons that were worth carrying into the skills now. The implementer anti-stall rule prevents an agent from turning YAGNI judgment into silent scope cutting, while the review-depth alias gives operators a named way to select existing review behavior. Both changes are guidance or routing labels, and both preserve the hard floors.

### Added

- T-002 added the implementer anti-stall rule in `sk-code/SKILL.md` §4 ALWAYS bullet 9.
- The anti-stall rule says to build the simplest correct implementation of the stated requirement and not stall.
- If part of the requirement looks unnecessary, the agent must implement as specified and raise a scope-amendment recommendation in the same response.
- The rule forbids silently cutting scope under SCOPE-LOCK and forbids blocking when a safe minimal version already satisfies the requirement.
- T-003 added the `SK_CODE_REVIEW_DEPTH=lite|full|ultra` depth alias in `sk-code-review/SKILL.md` §9.3.
- The alias names existing tiers only. It uses `env>config>default`, mirrors `SK_CODE_REVIEW_MIN_CHANGED_LINES`, maps `ultra` toward the existing `ON_DEMAND` tier and maps `lite` to the existing M-2 safe-skip.
- Floors are immutable: ALWAYS tier, security minimums and P0, P1 and P2 remain unchanged.
- The two worthwhile add-ons shipped and were verified.
- The two deferred add-ons are documented with rationale and marked operator-optional.

### Changed

- T-001 reconned insertion points in `sk-code` §4 ALWAYS and `sk-code-review` §9 after M-2.
- T-001 also reconned the existing `SK_CODE_REVIEW_MIN_CHANGED_LINES` env idiom and `ON_DEMAND` tier.
- T-006 ran `verify_alignment_drift.py` for `sk-code` and `sk-code-review` and got exit 0.

### Fixed

- T-007 confirmed the diff was pure insertions with correct placement.
- T-007 confirmed no severity or contract drift.
- Scope was limited to the two files.

### Verification

| Check | Result |
|-------|--------|
| Task ledger | PASS: 7 completed task item(s) recorded |
| Alignment drift | PASS: `verify_alignment_drift.py` for `sk-code` and `sk-code-review` exited 0 |
| Diff check | PASS: pure insertions, correct placement and two-file scope |
| Contract check | PASS: severity, floors and output contracts preserved |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-code/SKILL.md` | Updated | Added §4 ALWAYS bullet 9 implementer anti-stall rule |
| `sk-code-review/SKILL.md` | Updated | Added §9.3 `SK_CODE_REVIEW_DEPTH` alias |
| `_No full file-level detail recorded._` | Updated | Baseline did not record full paths |

### Follow-Ups

- The depth alias and anti-stall rule are guidance the agent applies in-loop. Neither is machine-enforced by design.
- Two add-ons are deferred and operator-optional. They remain available on an explicit request.
- Not committed. Changes sat in the working tree on branch `028-mcp-to-cli-tool-transition`.
