---
title: "Changelog: ENV Documentation Audit [006-review-remediation/005-env-documentation-audit]"
description: "Chronological changelog for the env documentation audit phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/005-env-documentation-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation`

### Summary

This phase ran a ten-iteration opus deep review of the whole ENV-documentation surface as one body and remediated what it found. It entered a POOR verdict because the reference was actively misleading rather than merely incomplete. The code reads 412 distinct flags against 289 documented, and the raw 144 gap triaged to zero P0, thirteen P1 and sixteen P2. The remediation rebuilt the stale dist, added the missing rows, corrected the wrong defaults, reconciled the cross-doc contradictions and fixed the structure, verifying every finding against source and correcting three review errors in the process. No production default was flipped.

### Added
- Added fifteen genuinely user-facing flag rows to ENV_REFERENCE.md, including the bitemporal reads, the reverse-dependency force-parse and its degree cap of 15, the advisor RRF fusion spine, the self-recommendation guard and the workspace allowlist whose own rejection error referenced an undocumented variable.

### Changed
- Corrected five wrong defaults against source, the spurious duplicate `codeGraph:900` in FLOORS_JSON, the missing `SUPERSEDES:1.0` weight in EDGE_WEIGHTS_JSON, RECENCY_DECAY_DAYS from 30 to the code default of 90, four retry knobs from 300000 to the shipped-config 5000 and DOC_TRIGGERS from off to the configs on.
- Reconciled three cross-doc contradictions between ENV_REFERENCE.md and the sibling environment_variables.md on the recency decay, the graph weight cap and the disputed defaults.
- Fixed two stale entries and two structural issues so the section sequence runs gapless 1 through 17 with the interleaved section moved to the appendix.

### Fixed
- The highest-blast-radius defect was a stale build. A flag-rename commit dropped version suffixes from the source flag names but never rebuilt the shipped dist, so twelve graduated features' documented disable knobs were inert at runtime and only the undocumented `_V1` keys worked. The remediation rebuilt the dist so zero `_V1` names remain and the documented disable knobs work by their documented name.
- Corrected three review errors against source rather than propagating them, the flag misnamed `SPECKIT_ADVISOR_METRICS_ENABLED` where the real flag is `SPECKIT_METRICS_ENABLED`, a hallucinated README line-144 assertion that does not exist and a VRULE reader the review called fail-open where source shows it fails closed.

### Verification
- Deep read - PASS, ten opus passes loop-until-dry, POOR entry verdict with zero P0, thirteen P1 and sixteen P2.
- Cross-check - PASS, the corrected defaults and the added flag names match source.
- Build - PASS, the rebuilt dist carries the de-suffixed names and zero `_V1` names remain.
- Structure - PASS, the section sequence is gapless 1 through 17.
- README integrity - PASS, the README is unchanged and the hallucinated line-144 claim was not acted on.

### Files Changed
- `ENV_REFERENCE.md`: the canonical flag reference, fifteen rows added, five defaults corrected, two stale entries fixed and the structure made gapless, added lines HVR-clean.
- The dist: rebuilt so the documented disable knobs honor their de-suffixed public names at runtime, gitignored so external users always build fresh.
- `review/review-report.md`: the deep-review record, read-only, documented not edited.
- `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`: created, the Level 1 spec-folder documentation.

### Follow-Ups
- A separate house-style pass should clean the eleven pre-existing em-dashes and the prose semicolons in ENV_REFERENCE.md, which are debt outside this change's scope.
- The 144-flag raw gap is intentionally not fully documented, flags that are internal-only or not user-facing remain undocumented by design.
