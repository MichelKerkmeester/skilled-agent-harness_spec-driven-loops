---
title: "Changelog: Content-Addressed derived_id for Derived Causal Artifacts (C4-B) [001-speckit-memory/009-derived-id-provenance]"
description: "Chronological changelog for the Content-Addressed derived_id for Derived Causal Artifacts (C4-B) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Nothing is built yet. This is the planning re-plan for candidate C4-B (content-addressed derived_id for derived causal artifacts). The candidate is PENDING behind a schema-migration gate; this file is a placeholder that will be replaced with the real delivery narrative once the build lands. It exists now only because a Level-3 packet requires it.

### Added

- CHK-132 No new external dependency introduced.

### Changed

- Two-primitive content-id module exists and exposes hashCanonicalJson (lib/content-id.ts) [Done — shipped in 030 commit 18c8582e33; hashContentBody + hashCanonicalJson confirmed present at lib/content-id.ts:14,19].
- CHK-001 C4-B scope is documented and faithful to research.
- CHK-002 The shipped content-id-module dependency is confirmed.
- CHK-003 The legacy anchor-inclusive UNIQUE is confirmed (drives the anchor-inclusion requirement).
- CHK-050 plan.md covers helper, migration, write-path, and verification.
- CHK-051 tasks.md has the shipped dependency pre-checked and impl tasks pending.

### Fixed

- CHK-110 No benchmark is claimed; correctness-only framing is explicit.

### Verification

- Planning docs strict validation - PASS target — validate.sh --strict on this packet (planning stage)
- Implementation (helper, migration, write-path) - NOT RUN — pending build
- Identity stability + rule_version distinctness tests - NOT RUN — pending (T008/T009)
- Real-DB-copy migration / backfill-no-reject test - NOT RUN — pending (T010)
- Memory MCP typecheck + build + focused suite - NOT RUN — pending (T011)
- Tasks complete - 1 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-004 Canonical-field order, kind-tag, source definition, and legacy rule_version sentinel are decided.
- CHK-010 Memory MCP typecheck passes after the change.
- CHK-011 Memory MCP build passes after the change.
- CHK-012 No new hash primitive introduced; the derived-id helper reuses hashCanonicalJson.
- CHK-020 derived_id is content-addressed and cross-process reproducible.
- CHK-021 Anchors are part of the derived_id input.
