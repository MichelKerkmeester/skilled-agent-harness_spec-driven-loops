---
title: "Code Graph Phase 005: Code Graph and Skill Advisor Refinement"
description: "10 PRs shipped across 5 fix-up batches (B1-B5) plus an F35 confidence calibration bench. Addressed 35 findings from a 20-iteration deep-research investigation and a 7-iteration deep-review cycle. Daemon availability, shim fixes, and advisor calibration all landed."
trigger_phrases:
  - "phase 005 changelog"
  - "code graph advisor refinement"
  - "F35 calibration"
  - "daemon availability"
  - "advisor shim fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `027-graph-and-context-optimization/004-code-graph`

### Summary

The skill advisor and its code-graph integration had accumulated technical debt across multiple earlier packets. The advisor could return stale recommendations when the skill graph was not rebuilt after skill changes. The daemon that feeds live advisor queries was unreliable. The shim that bridges code-graph results into the advisor pipeline had edge cases that dropped results silently. Confidence scores were not calibrated against actual outcomes.

A 20-iteration deep-research investigation (sub-phase 005-research-015) produced 35 findings across the advisor and code-graph surfaces. A 7-iteration deep-review cycle (sub-phase 005-review-015) validated the fixes against the findings.

Ten PRs shipped across 5 fix-up batches (B1 through B5) plus one calibration bench (F35):

- **B1: Daemon availability.** The advisor daemon was unreliable when the skill graph was stale or missing. Fix: lazy-initialization with a built-in rebuild path on first query after skill changes.
- **B2: Shim edge-case completeness.** The code-graph-to-advisor shim dropped results when the graph returned partial or blocked responses. Fix: shim now handles `BlockedResult`, `partialOutput`, and `deadlineMs` cases with typed fallbacks.
- **B3: Confidence calibration.** The advisor confidence scores were not calibrated against ground-truth outcomes. Fix: the F35 bench measured actual precision/recall on 35 test prompts and tuned the scoring thresholds.
- **B4: Cross-packet contract alignment.** Advisor response fields changed in the prior skill-advisor self-contained package migration but the code-graph integration was not updated. Fix: aligned the integration on the new contract shape.
- **B5: Playbook and documentation updates.** The operator playbooks and READMEs referenced pre-005 surface names and response shapes. Fix: updated all user-facing docs to match the post-005 contracts.
- **B6: Daemon-availability + shim + playbook final pass.** A final audit caught 3 residual issues in the daemon startup path, the shim error-handling path, and the manual testing playbook. All three were fixed in a single batch.

All 35 findings were closed. The advisor's daemon now starts reliably. The shim handles all code-graph response states. Confidence scores are calibrated.

### Added

- Advisor daemon lazy-initialization with automatic rebuild on stale skill graph
- F35 confidence calibration bench with 35 test prompts and precision/recall measurement
- Shim typed-fallback path for `BlockedResult`, `partialOutput`, and `deadlineMs` code-graph response states
- Updated operator playbooks for post-005 contract shapes

### Changed

- Advisor daemon startup path: from eager-init-with-block to lazy-init-with-rebuild
- Code-graph-to-advisor shim: from optimistic-unwrap to typed-fallback on every response state
- Advisor confidence thresholds: recalibrated from F35 bench results
- All user-facing docs updated to match post-005 contract vocabulary

### Fixed

- Advisor daemon failed to start when skill graph was missing or stale. Now rebuilds on first query.
- Shim silently dropped code-graph results when the graph returned partial or blocked responses. Now produces typed fallbacks.
- Advisor confidence scores were uncalibrated. F35 bench produced tuned thresholds.
- Operator playbooks referenced pre-005 surface names. Now match current contracts.

### Verification

- F35 calibration bench: 35 prompts measured, precision and recall within target thresholds.
- Advisor vitest suite: all tests pass (no regressions).
- Code-graph vitest suite: all tests pass (no cross-packet regressions).
- Manual daemon-startup test: advisor daemon starts reliably from cold, warm, and stale-graph states.
- Strict packet validation (`validate.sh --strict`): passed.

### Files Changed

| File | What changed |
|------|--------------|
| `skill_advisor/daemon.ts` | Lazy-initialization with auto-rebuild |
| `skill_advisor/shim.ts` | Typed-fallback for all code-graph response states |
| `skill_advisor/confidence.ts` | F35-calibrated thresholds |
| `skill_advisor/contract.ts` | Cross-packet contract alignment |
| `applied/B1.md` through `applied/B6.md` (NEW) | Fix-up batch records |
| `applied/F35-calibration.md` (NEW) | Confidence calibration record |
| `research/015-*/` (NEW) | 20-iteration deep-research artifacts |
| `review/015-*/` (NEW) | 7-iteration deep-review artifacts |

### Follow-Ups

- **Auto-promotion semantics test.** The retained-memory auto-promotion semantics test was excluded from the inventory in PR-3. A follow-up should add coverage for auto-promotion from normal to important tier.
