---
title: "Wave 3: Planner Reviewer-Focus and Spec-Drift Advisory Hints"
description: "Optional reviewer_focus and spec_drift advisory fields added to the contract and to orchestrator, review and code agents across all three runtime mirrors."
trigger_phrases:
  - "027 006 003 changelog"
  - "reviewer focus drift hint changelog"
  - "spec drift advisory changelog"
  - "update_recommended changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/003-planner-review-focus-and-drift-hint` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption`

### Summary

Wave 3 extended the shared advisory contract with two new optional fields. A planner-provided `reviewer_focus` hint lets `@orchestrate` steer review attention without changing P0/P1/P2 thresholds or replacing evidence-based finding logic. A `spec_drift` block with an `update_recommended` flag lets `@code` record observed divergence from the spec in its return envelope; drift routes to `handover.md` and contradictions still halt via Logic-Sync. A companion `self_assessed_quality` field avoids a name collision with the existing `/memory:save` `quality_score`. Both `/memory:save` and `generate-context.ts` now document the optional JSON keys while remaining open-object and absence-tolerant. All three core agents (`@orchestrate`, `@review`, `@code`) were updated in all three runtime mirrors with matching advisory wording.

### Added

- Optional `reviewer_focus` field in `agent-io-contract.md` for planner-emitted review attention steering
- Optional `spec_drift` and `update_recommended` block in `agent-io-contract.md` for implementation-time divergence notes
- Optional `self_assessed_quality` field (distinct from the existing `quality_score`) in `agent-io-contract.md`
- `reviewer_focus` emit guidance in `@orchestrate` across all three runtime mirrors
- `reviewer_focus` consume guidance in `@review` with explicit note that it steers attention only and never changes thresholds
- Optional `spec_drift` block after the native `RETURN:` body in `@code` across all three runtime mirrors
- Optional `specDrift` and `reviewerFocus` JSON key documentation in `/memory:save` command doc
- Optional JSON key documentation in `generate-context.ts` help text with absence-tolerant open-object parser note

### Changed

- `agent-io-contract.md` extended with the Wave 3 advisory fields on top of the existing Wave 1 and Wave 2 groups
- `@orchestrate`, `@review` and `@code` bodies extended in `.opencode`, `.claude` and `.codex` mirrors with matching advisory wording

### Fixed

- None.

### Verification

- Missing `reviewer_focus` falls back to normal scope derivation from target and files in `@review`: passed
- Supplied `reviewer_focus` steers attention only and never changes P0/P1/P2 thresholds: passed by content review
- Missing `spec_drift` recorded as `none`; contradictions still halt via Logic-Sync: passed
- Optional JSON keys tolerated by `generate-context.ts` structured payload: passed
- TOML parse for all three edited Codex agent files: passed
- Strict spec validation (`validate.sh --strict`): exit 0

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modified | Wave 3 advisory fields: `reviewer_focus`, `spec_drift`, `self_assessed_quality` |
| `.opencode/agents/orchestrate.md` | Modified | Emit optional `reviewer_focus` and surface drift hints during synthesis |
| `.opencode/agents/review.md` | Modified | Consume `reviewer_focus` to prioritize reads; severity threshold unchanged |
| `.opencode/agents/code.md` | Modified | Optional `spec_drift` block appended after native `RETURN:` body |
| `.claude/agents/orchestrate.md` | Modified | Runtime mirror parity |
| `.claude/agents/review.md` | Modified | Runtime mirror parity |
| `.claude/agents/code.md` | Modified | Runtime mirror parity |
| `.codex/agents/orchestrate.toml` | Modified | Runtime mirror parity |
| `.codex/agents/review.toml` | Modified | Runtime mirror parity |
| `.codex/agents/code.toml` | Modified | Runtime mirror parity |
| `.opencode/commands/memory/save.md` | Modified | Documents optional `specDrift` and `reviewerFocus` JSON keys |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modified | Documents optional JSON keys in help text |

### Follow-Ups

- `reviewer_focus` and `spec_drift` are advisory only; no runtime enforcement was added.
- `_memory.continuity` schema is unchanged at Level 1; `ThinContinuityRecord` schema work is deferred.
