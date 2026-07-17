---
title: "Changelog: Recall-to-Render Trust Escaper and Substrate-Kind Recall Correctness [001-speckit-memory/005-recall-render-escaper]"
description: "Chronological changelog for the recall-to-render trust escaper and substrate-kind recall correctness phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-recall-render-escaper` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the ungated pieces of the write, recall and prompt trust spine. Recalled memory bodies now render inside an untrusted-content wrapper with tag-escaped content. Capture now flags prompt-injection markers without destroying the stored body. CAS self-edit protection and retention disclosure are recorded as delivered. The system-kind exclusion remains gated because the workspace did not have a safe substrate-only marker or the live database needed to prove constitutional and spec rows stay visible.

### Added

- Added a recall content wrapper that labels recalled body text as third-party data.
- Added non-destructive injection-marker detection at capture time.
- Added additive residual-retention disclosure to the retention sweep result.

### Changed

- Bound recall escaping to the content formatter rather than the generic MCP envelope.
- Installed the marker policy in the shared memory-save preparation path.
- Kept stored content intact while hashing over cleaned content for marker-dominant residue checks.

### Fixed

- Removed the dead CAS downgrade-audit branch while preserving unconditional self-edit protection.
- Normalized `source_kind` through the write-provenance enum and failed closed to `unknown`.

### Verification

- Baseline typecheck: PASS.
- Focused baseline Vitest: PASS, 5 files and 90 tests.
- Final typecheck: PASS.
- Focused final Vitest: PASS, 6 files and 99 tests.
- Alignment and comment-hygiene checks: PASS.
- Strict phase validation: PASS.
- Build and broad schema, health and promoter suites were not run for this phase.

### Files Changed

_Detailed file-level changes live in the phase implementation summary._

### Follow-Ups

- Resolve system-kind exclusion only with a substrate-only marker and live-database validation.
- Keep the aggregate security gate as a sibling phase rather than claiming it here.
