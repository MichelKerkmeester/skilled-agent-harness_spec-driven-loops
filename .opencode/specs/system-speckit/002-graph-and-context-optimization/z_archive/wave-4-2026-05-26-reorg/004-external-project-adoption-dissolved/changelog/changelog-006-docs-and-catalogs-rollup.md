---
title: "Phase 006: docs-and-catalogs-rollup"
description: "Umbrella docs were synced to the shipped 002-005 capabilities, with feature catalog and manual testing playbook indexes updated."
trigger_phrases:
  - "phase 006 changelog"
  - "docs and catalogs rollup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved` (Level 2)
> Parent packet: `002-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 006 rolled up the capabilities shipped by phases 002-005 into umbrella docs. It updated eight surfaces: root README, system-spec-kit skill docs, MCP server docs, install guide, feature catalog index, manual testing playbook index and the merged phase map. Per-packet catalog and playbook entries had already been written by the implementation phases, so this phase only synced top-level surfaces. Later remediation corrected evidence labeling so estimated DQI checks no longer read as validated scores.

### Added

- Phase 012 smoke-test section in `mcp_server/INSTALL_GUIDE.md`.
- Phase audit sections in the feature catalog and manual testing playbook indexes.
- Derived implementation phase note in `merged-phase-map.md`.
- Umbrella descriptions for Code Graph edge uplift, `detect_changes`, affordance evidence and Memory trust badges.

### Changed

- Root README and system-spec-kit README now describe the new Code Graph, Skill Advisor and Memory surfaces.
- `SKILL.md` Code Graph capability matrix gained the new rows and notes.
- MCP server README now lists the `detect_changes` preflight story and related handler details.
- Documentation version footers and `last_updated` metadata moved to 2026-04-25 where applicable.

### Fixed

- Capability descriptions now map back to actual 002-005 implementation-summary content.
- Per-packet entries are referenced from top-level indexes.
- Review remediation later replaced estimated DQI pass language with operator-pending wording.
- Review remediation later fixed tool-count and install-guide smoke-test drift.

### Verification

- File-on-disk checks validated all five feature catalog entries and all five manual playbook scenarios.
- Wave-3 evidence: `tsc --noEmit` exited 0 and the phase test set reported 9 passed and 1 skipped test file.
- `validate.sh --strict` failed on template-section conformance only, classified as cosmetic.
- DQI scoring stayed operator-pending because structural estimates are not script-backed scores.
- Git history for this directory includes `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `README.md` | Root feature descriptions and version footer. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Capability matrix and key concepts. |
| `.opencode/skills/system-spec-kit/README.md` | Code Graph, Skill Advisor and Memory sections. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Handler and tool reference updates. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Phase smoke tests. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Phase audit index. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Phase scenario index. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md` | Derived implementation phase record. |

### Follow-Ups

- Canonical DQI scoring still needs `validate_document.py` runs for numeric attestation.
- Historical `012` labels remain in older docs as renumbering aliases.
