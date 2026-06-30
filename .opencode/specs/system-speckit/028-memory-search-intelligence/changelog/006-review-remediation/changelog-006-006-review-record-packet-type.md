---
title: "Changelog: Review Record Packet Type [006-review-remediation/006-review-record-packet-type]"
description: "Chronological changelog for the review record packet type phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation`

### Summary

This phase added an additive marker-gated review packet type to the feature-spec validator. A spec.md carrying `<!-- SPECKIT_LEVEL: review -->` enters a review path that requires only spec.md and `review/review-report.md` and waives plan, tasks, checklist, implementation-summary and decision-record. The marker is the sole entry into the path, so every existing Level 1, Level 2, Level 3 and phase folder is byte-unaffected. The change spans both validator surfaces and the templates, ships four tests plus two fixtures, and the 009-dark-flag-validation packet was marked a review record and now validates clean at exit 0.

### Added
- Added `templates/manifest/review.spec.md.tmpl`, a lean review spec template that is a subset of the L1 spec anchors covering metadata, problem, scope, review-summary and questions.
- Added `scripts/tests/review-record-validation.vitest.ts` with four tests plus the `068-review-record-valid` and `069-review-record-missing-report` fixtures.
- Added the review level row, the review-record taxonomy and the freeform review-report doc entry to `templates/manifest/spec-kit-docs.json`.

### Changed
- `scripts/spec/validate.sh` teaches `detect_level` the review marker and lists it in the help text.
- `scripts/utils/template-structure.js` adds the review level, the review template path and the review allowed-anchors.
- `mcp_server/lib/templates/level-contract-resolver.ts`, `mcp_server/lib/validation/orchestrator.ts` and `mcp_server/lib/validation/spec-doc-structure.ts` gain review handling and exclude the freeform review-report from the template-source, frontmatter-continuity and sufficiency gates.
- `scripts/rules/check-files.sh` guards its numeric-level comparison so a string level passes through without crashing.
- The 009-dark-flag-validation packet was marked a review record to demonstrate the path.

### Fixed
- The validator had no concept of a review record, so a structurally correct review packet read as a broken feature packet and every lean deep-review packet tripped the full Level 1 doc-set requirement. Each needed a manual stub-doc retrofit to pass, and the deep-loop-generated 009 packet still failed with several errors despite that work. The review path removes the retrofit, a review packet now passes by carrying exactly the two docs it is supposed to carry.

### Verification
- Unit - PASS, the four review-record tests cover the valid pass and the missing-report fail.
- Fixture - PASS, `068-review-record-valid` passes and `069-review-record-missing-report` fails as designed.
- Regression - PASS, the existing fixture suites return identical pass and fail results before and after, the pre-existing failures reproduce on a clean baseline.
- Baseline - PASS, a stashed-change rebuild of the dist to HEAD shows an unrelated phase-parent failure identical with and without the change.
- Demonstration - PASS, the 009 packet marked as a review record validates clean at exit 0.

### Files Changed
- `scripts/spec/validate.sh`: `detect_level` recognizes the review marker, help text lists it.
- `scripts/utils/template-structure.js`: the review level, template path and allowed anchors.
- `templates/manifest/spec-kit-docs.json`: the review level row, taxonomy and freeform report entry.
- `templates/manifest/review.spec.md.tmpl`: created, the lean review spec template.
- `mcp_server/lib/templates/level-contract-resolver.ts`: the production resolver gains review handling.
- `mcp_server/lib/validation/orchestrator.ts`: routes the review path.
- `mcp_server/lib/validation/spec-doc-structure.ts`: excludes the freeform report from three gates.
- `scripts/rules/check-files.sh`: guards the numeric-level comparison against a string level.

### Follow-Ups
- Mark the remaining lean deep-review packets as review records. Only the 009 packet was marked here to demonstrate the path, so other lean review packets still carry their retrofitted docs until marked.
- The 011 and 012 packets stay Level 1 by intent, they document feature work rather than review records.
