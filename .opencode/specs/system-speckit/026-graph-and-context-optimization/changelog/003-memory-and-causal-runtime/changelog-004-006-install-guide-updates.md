---
title: "004/006 Install Guide Updates Scaffold"
description: "Planned CocoIndex install guide packet for embedder choice onboarding, swap instructions and README wayfinding."
trigger_phrases:
  - "004/006 install guide updates"
  - "CocoIndex embedder onboarding"
  - "Choosing an embedder section"
  - "COCOINDEX_CODE_DEVICE cpu"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

This phase is a pre-implementation scaffold for new-user CocoIndex embedder choice docs. It plans a "Choosing an embedder" section in the install guide, a short README pointer and a swap runbook covering model env vars, daemon restart behavior and first-use download caveats.

The packet is blocked on the declarative registry phase. No install guide or README edits have shipped yet.

### Added

- Packet scaffold for documenting CocoIndex default embedder rationale and alternatives.
- Planned install-guide section with default guidance, alternatives table, swap runbook and Apple Silicon notes.
- Planned README pointer to route users to the install guide.

### Changed

- None. The install guide and README were not changed by this scaffold.

### Fixed

- None. This packet records planned documentation and does not close a shipped defect yet.

### Verification

| Check | Result |
|---|---|
| Implementation status | No documentation implementation shipped. Packet artifacts report completion at 0 percent. |
| Dependency status | Blocked on the 004/005 declarative registry packet. |
| Planned read-through | New-user embedder selection in under 10 minutes recorded as future verification only. |
| Planned link check | Registry, swap-runbook and decision-record links recorded as future verification only. |
| Strict packet validation | No explicit completed validation result recorded in packet artifacts. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Added | Defined the planned install guide and README documentation scope for embedder choice. |
| `plan.md` | Added | Planned doc inventory, install-guide drafting, README pointer work, cross-reference checks and validation. |
| `tasks.md` | Added | Listed pending setup, authoring and verification tasks for the docs update. |
| `implementation-summary.md` | Added | Captured the pre-implementation placeholder, planned artifacts and dependency on the registry packet. |
| `description.json` | Added | Added packet metadata for discovery. |
| `graph-metadata.json` | Added | Added graph metadata for packet traversal. |

### Follow-Ups

- Wait for the declarative registry packet to land before writing model names or table values.
- Add the "Choosing an embedder" section to `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`.
- Add the README embedder-choice pointer after the install guide section exists.
- Run link-check, read-through and strict packet validation after documentation lands.
