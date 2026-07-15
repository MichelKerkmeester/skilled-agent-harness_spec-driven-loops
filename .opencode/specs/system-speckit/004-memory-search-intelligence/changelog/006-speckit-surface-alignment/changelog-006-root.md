---
title: "Changelog: 005 — SpecKit Surface Alignment (Remediation) [006-speckit-surface-alignment/root]"
description: "Chronological changelog for the 005 — SpecKit Surface Alignment (Remediation) spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-11

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment` (Level unknown)

### Summary

Remediate the documentation-vs-implementation drift the surface-alignment audit surfaced across the system-speckit skill ecosystem. The audit's verdict: the code and runtime are largely current with recent specs, but the documentation surfaces (feature catalogs, manual-testing playbooks, READMEs, benchmark indexes) and the validation tooling meant to catch that drift trail behind. This packet turns the ~18 distinct, citation-verified misalignments plus the coverage gaps and process fixes into shippable phase children.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-false-now-doc-corrections` | Complete | The false-now correction pass aligned current reader-facing docs with shipped behavior while preserving historical phase evidence. One source document needed a patch; three cited surfaces were already in the requested corrected state when read in this session. |
| `002-fix-stress-docs` | Complete | The stress-test docs now route readers from the manual release-readiness narrative to the automated MCP server Vitest stress harness. The domain READMEs now list the real files on disk, remove a phantom search-quality entry, and document substrate sandbox cleanup behavior that already ships in the harness. |
| `003-stress-and-skillmd-audit` | Complete | Delivered a split-surface documentation audit. The stress-test lane had real coverage drift, while system-spec-kit SKILL.md and changelog surfaces were confirmed current. The audit made no source changes and handed findings to the later 002-fix-stress-docs remediation phase. |
| `004-recorded-failure-closure` | Complete | This phase closed a failure class where detectors recorded real problems but no follow-up route existed. The exemplar cap contradiction was reconciled, and a reusable closure route now exists through a constitutional rule plus a validation surfacer. |
| `005-manual-test-verification-and-fixes` | Complete | This documentation phase records the completed manual verification-and-fixes arc for the Fable-5-refined 008 surface-alignment features. The code and tests were already committed to origin/028; this phase creates the documentation record only. |
| `006-presentation-layer-fixes` | Implemented, with broad-suite caveat documented in implementation-summary.md | Implemented the planned presentation-layer fixes without changing ranking, retrieval scoring, embeddings, or database schema: |

### Added

- No new additions recorded.

### Changed

- Remediate the documentation-vs-implementation drift the surface-alignment audit surfaced across the system-speckit skill ecosystem. The audit's verdict: the code and runtime are largely current with recent specs, but the documentation surfaces (feature catalogs, manual-testing playbooks, READMEs, benchmark indexes) and the validation tooling meant to catch that drift trail behind. This packet turns the ~18 distinct, citation-verified misalignments plus the coverage gaps and process fixes into shippable phase children.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
