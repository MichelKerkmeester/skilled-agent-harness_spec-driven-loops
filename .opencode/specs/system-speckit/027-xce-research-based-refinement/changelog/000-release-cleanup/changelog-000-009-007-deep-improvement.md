---
title: "Changelog: Phase 7: deep-improvement Frontmatter Alignment [009-skill-frontmatter-alignment/007-deep-improvement]"
description: "Chronological changelog for the Phase 7: deep-improvement Frontmatter Alignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/007-deep-improvement` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

All 27 deep-improvement reference and asset docs (23 references + 4 non-README assets) now carry exactly the canonical frontmatter contract. This is the largest phase of the campaign so far and the first to exercise every drift state at once: enum fixes, partial-block completion, net-new phrase authoring, and a doc with no frontmatter at all.

### Added

- Promoted four additional docs to `important` tier so formal contracts and evaluation conventions are weighted higher in the advisor's derived lane: `evaluator_contract.md`, `promotion_rules.md`, `non_dev_ai_system/loop_contract.md`, and `shared/heldout_and_gold_sets.md`.
- Demoted `skill_benchmark/operator_guide.md` and `skill_benchmark/scenario_authoring.md` from `important` to `normal`; these are how-to guides, not contracts.

### Changed

- Normalized all 27 deep-improvement reference and asset docs to the canonical five-field frontmatter contract, spanning four distinct drift states: five docs with an out-of-enum `contextType`, 12 partial blocks missing tier and contextType, eight title-only docs, and one doc with no YAML fence at all.
- Rebuilt weak trigger phrase sets on four docs: single-token phrases and a stale finding ID in `profiling_audit_log.md`, hyphenated tokens in `mixed_executor_methodology.md`, and command-name tokens in `integration_scanning.md` and `skill_benchmark/operator_guide.md`.
- Authored full phrase sets for eight title-only docs (three `agent_improvement` asset templates, five `non_dev_ai_system` references) and the complete frontmatter block for `shared/heldout_and_gold_sets.md`, which previously had no fence.
- Applied all 27 patches in one assertion-guarded Python pass with per-file title guards, leaving body bytes untouched.
- Passed the coverage-mode contract checker (`check-skill-doc-frontmatter.sh --coverage`) with 27 of 27 docs carrying the detailed block and zero violations.

### Fixed

- Corrected `contextType: reference` to `implementation` on six fully-detailed docs that used a value outside the canonical enum: `candidate_proposal_format.md`, `score_dimensions.md`, `promotion_gate_contract.md`, `skill_benchmark/operator_guide.md`, `skill_benchmark/scenario_authoring.md`, and `skill_benchmark/scoring_contract.md`.

### Verification

- check-skill-doc-frontmatter.sh --skill deep-improvement --coverage - PASS — docs=27, carrying-detailed-block=27, violations=0
- Python local-mode smoke ("legal-stop gate bundles", flag on) - PASS — deep-improvement at 0.77, passes_threshold true, reason Matched: !legal-stop gate bundles(signal)
- Diff hygiene - PASS — spot-checked git diff shows only frontmatter hunks from this phase; pre-existing body hunks from another session untouched
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-improvement/references/agent_improvement/*.md (6)` | Modified | Enum fix x2 (important kept); tier+contextType added x4; phrase repair x2 |
| `.opencode/skills/deep-improvement/references/model_benchmark/*.md (3)` | Modified | Tier+contextType added; evaluator_contract.md to important; phrase rebuild for mixed_executor_methodology |
| `.opencode/skills/deep-improvement/references/non_dev_ai_system/*.md (5)` | Modified | Full phrase sets + tier + contextType authored; loop_contract.md to important |
| `.opencode/skills/deep-improvement/references/shared/*.md (6)` | Modified | Tier+contextType added; full block authored for heldout_and_gold_sets.md; promotion_rules.md to important |
| `.opencode/skills/deep-improvement/references/skill_benchmark/*.md (3)` | Modified | Enum fix; 2 guides demoted to normal; command-token phrase replaced |
| `.opencode/skills/deep-improvement/assets/*/.md (4 non-README)` | Modified | Full blocks for 3 templates (planning/implementation); reviewer-schema completed |

### Follow-Ups

- Live-daemon `matchedDocs` verification is deferred to a later campaign-level session cycle; the running advisor daemon predates the launcher allowlist fix and cannot observe doc triggers until restarted.
- Several deep-improvement skill files carry unrelated uncommitted body changes from another active session. Rollback must revert frontmatter hunks per file rather than checking out whole files.
