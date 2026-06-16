---
title: "Spec-Folder Control-Metadata Reconciliation"
description: "Eight spec-folder control-metadata drift findings reconciled: description.json omitted-children parity for three parents, two stale phase-parent pointers advanced, a dangling context-index pointer corrected, a backlog NDCG entry upgraded and a stale research-config status set to completed. Strict validation green with zero regressions."
trigger_phrases:
  - "005/005/005 spec-folder metadata reconciliation changelog"
  - "description.json omitted children parity"
  - "phase parent stale pointer fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase reconciled all eight spec-folder control-metadata findings. Each was confirmed real against the live tree before editing (none refuted). description.json omissions were patched surgically with no subtree regeneration, and phase-parent pointers were corrected to the genuinely latest-active child while preserving each file's existing id convention.

### Added

- Missing live children added to childTopology: `000-spec-tree-consolidation` (000-release-cleanup), `004-skill-advisor-suite-repair` (003-advisor-and-codegraph) and `009-code-graph-code-only-indexing` (004-shared-infrastructure), each restoring description-to-graph parity.

### Changed

- The frozen phase pointer for `001-peck-teachings-adoption` advanced to its latest-active child `007-acceptance-coverage-gate`, and the stale 027-root pointer advanced to `003-advisor-and-codegraph`.
- `context-index.md` "027 to 028 Split" section marked as a historical record, with the dangling present-tense pointer to a nonexistent track rewritten to past tense with the real fate.
- The NDCG-cutoff backlog entry upgraded to a v2 disposition with proof and reason, and a stale research-config `status: running` set to `completed`.

### Fixed

- description-to-graph parity restored for the three parents (10/10, 4/4, 9/9) and both corrected pointers now resolve to existing child directories.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict --recursive` on touched parents | 000-release-cleanup 11/11, 003-advisor-and-codegraph 5/5, 004-shared-infrastructure 10/10, 001-peck-teachings-adoption 8/8 (all exit 0) |
| `validate.sh --strict` on 027 root, 001-finding-remediation, 002-tri-system | PASSED |
| Baseline to delta | All seven touched folders Errors 0 Warnings 0 before and after (zero regressions) |
| description-to-graph parity | Equal for all three parents; both pointers resolve to real children |
| JSON validity | All seven edited JSON files re-parse cleanly |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `000-release-cleanup/description.json` | Modified | Add omitted child; parity 10/10 |
| `003-advisor-and-codegraph/description.json` | Modified | Add omitted child; parity 4/4 |
| `004-shared-infrastructure/description.json` | Modified | Add omitted child; parity 9/9 |
| `001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json` | Modified | Advance frozen pointer to latest-active child |
| `graph-metadata.json` (027 root) | Modified | Advance stale pointer to latest-saved child |
| `context-index.md` | Modified | Historical record marking plus dangling pointer rewrite |
| `001-finding-remediation/backlog/p1-backlog.json` + `002-tri-system-deep-research/research/deep-research-config.json` | Modified | NDCG v2 disposition; status to completed |

### Follow-Ups

- T005 fixed only the stale pointer value. The generator-side ancestor-walk recommendation is production code outside this sub-phase scope, so the root pointer can drift again on a non-walking batch save.
- The `ln_id` versus `last_active_child_id` field-name inconsistency between the newer schema and these live files was left as-is (edits preserved the field the live validator uses).
