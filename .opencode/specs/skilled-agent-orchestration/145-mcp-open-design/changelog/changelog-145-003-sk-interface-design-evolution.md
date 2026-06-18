---
title: "Changelog: sk-interface-design evolution [145-mcp-open-design/003-sk-interface-design-evolution]"
description: "Chronological changelog for the sk-interface-design de-vendor and Open Design integration phase."
trigger_phrases:
  - "phase changelog"
  - "interface design evolution"
  - "de-vendor changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/003-sk-interface-design-evolution` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

This phase de-vendored `sk-interface-design` from the MIT `ui-ux-pro-max` repo to an Apache-2.0-only `v1.1.0`, then wired its Open Design integration. It shipped as commit `b12ffd3d76` with 30 files, mostly removals, and the deliverable lives at `.opencode/skills/sk-interface-design/`. This record documents the completed de-vendor and does not repeat it.

### Added

- Added `changelog/v1.1.0.0.md`.
- Updated `graph-metadata.json`.
- Completed a voice sweep with no em dashes and no prose semicolons in new prose.
- Recorded `CHK-013` and `CHK-050` as confirmed.

### Changed

- Confirmed the de-vendor sequence: data first, MIT notices second.
- Confirmed the Apache base must be kept because `design_principles.md` is verbatim Apache content.
- Confirmed `mcp-open-design` is available for live grounding.
- Deleted the nine MIT CSVs, the data README and the design search scripts first.
- Deleted `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md` after the data.
- Reframed `references/claude_design_parity.md` to live Open Design reads, never cached.

### Fixed

- Recorded `CHK-FIX-001` through `CHK-FIX-006`, covering de-vendor class, removal inventory, consumer inventory, adversarial scope, matrix axes and hostile environment variant.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS: skill valid. |
| Licensing grep | PASS: no MIT-derived data, script or notice residue. |
| Apache base retained | PASS: `LICENSE.txt` and `design_principles.md` kept, skill is Apache-2.0 only. |
| Live-read integration | PASS: parity loop reads Open Design through `mcp-open-design` and caches nothing. |
| Voice sweep | PASS: no em dashes and no new prose semicolons. |
| Shipped | PASS: commit `b12ffd3d76`, 30 files. |
| `validate.sh --strict` | PASS: this packet returned 0 errors. |
| P0 `CHK-FIX-004` | PASS: adversarial tests scoped, N/A for docs and asset removal with no security, path or parser surface. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `assets/data/*.csv (nine files)` | Updated | Removed the MIT-derived data inventory first. |
| `assets/data/README.md` | Updated | Removed the vendored data README. |
| `scripts/design_search.py`, `scripts/design_search_core.py` | Updated | Removed scripts that queried vendored data. |
| `LICENSE-ui-ux-pro-max.txt` | Updated | Removed the MIT notice after the data. |
| `THIRD-PARTY-NOTICES.md` | Updated | Removed the MIT third-party notices after the data. |
| `references/claude_design_parity.md` | Updated | Reframed Open Design live-read integration through the parity loop. |
| `references/design_inventory.md` | Updated | Reframed around live Open Design systems. |
| `SKILL.md` | Updated | Apache-2.0 only, Open Design grounding and version `1.1.0`. |
| `feature_catalog/` | Updated | Open Design live-read grounding replaced the data-search feature. |
| `manual_testing_playbook/` | Updated | Licensing-integrity and grounding scenarios reframed. |
| `changelog/v1.1.0.0.md` | Created | De-vendor and integration changelog. |
| `graph-metadata.json` | Updated | Topics, edges and source docs. |

### Follow-Ups

- The change removed assets and rewrote documentation, not binaries.
- Phase 004 later found stale MIT-attribution wording in the playbook index and a stale data precondition. The shipped license state was correct and only descriptive wording lagged.
- Phase 004 completed the missing reciprocal edge to `mcp-open-design` in this skill's `graph-metadata.json`.
