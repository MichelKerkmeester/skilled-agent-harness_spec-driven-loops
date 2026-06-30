---
title: "Changelog: mcp-open-design generation-flow correction [145-mcp-open-design/007-mcp-open-design-generation-flow-correction]"
description: "Chronological changelog for the live-verified mcp-open-design generation-flow correction."
trigger_phrases:
  - "phase changelog"
  - "generation flow"
  - "multi-turn correction"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/002-mcp-open-design/007-mcp-open-design-generation-flow-correction` (Level 2)
> Parent packet: `.opencode/specs/design/002-mcp-open-design`

### Summary

This phase corrected `mcp-open-design` to match how Open Design actually generates designs. Version `1.0.0` described generation as a one-shot `start_run` that returned finished files. A live test proved that wrong, so every affected doc now describes the multi-turn flow and separates `od artifacts create` from visible design generation.

### Added

- Grepped and located every one-shot generation claim and every `od artifacts create` mention.
- Added README run narrative, troubleshooting rows and FAQ.
- Added `changelog/v1.1.0.0.md`.
- Updated `graph-metadata.json`.
- Completed a voice sweep with no em dashes and no prose semicolons in new prose.
- Documented generation as multi-turn everywhere, with `od ui respond` as the build trigger.
- Separated `od artifacts create` from visible design creation everywhere it appears.
- Recorded `CHK-013` as confirmed.

### Changed

- Read the whole skill: `SKILL.md`, three references, feature catalog, manual testing playbook, README and changelog.
- Confirmed Level 2 template anchors and the continuity fingerprint algorithm.
- Captured baseline `package_skill.py --check` as PASS with no warnings.
- Updated `SKILL.md` with multi-turn Run Direction, artifacts callout, four-surface and HTTP note, ALWAYS rule 8, NEVER rule 5 and version `1.1.0`.
- Updated `references/od_cli_reference.md` with `od run` verbs, a multi-turn section, HTTP API surface and resolved `command[0]` uncertainty.
- Updated `references/mcp_wiring.md` with install-info as canonical and `command[0]` as the Helper binary.

### Fixed

- Corrected `references/tool_surface.md` for `start_run`, multi-turn generation flow and artifacts separation.
- Recorded `CHK-002` as verified.
- Recorded `CHK-FIX-001` through `CHK-FIX-004`, covering the class-wide one-shot error, producer inventory, consumer inventory and adversarial scope.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS: skill valid with no word-count warning. |
| One-shot regression grep | PASS: no doc claims a single run produces a finished visible design, and every `start_run` mention is qualified. |
| Artifacts-create separation | PASS: each run-direction doc disclaims `artifacts create` as a design path. |
| Voice sweep | PASS: no em dashes and no new prose semicolons. |
| `validate.sh --strict` | PASS: this packet returned 0 errors. |
| P0 `CHK-FIX-004` | PASS: adversarial tests scoped, N/A for docs-only correction with no security, path or parser surface. |
| P1 `CHK-FIX-005` | PASS: matrix axes listed, N/A for prose correction with no test matrix. |
| P1 `CHK-FIX-006` | PASS: hostile env variant, N/A because no process-wide state code changed. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `SKILL.md` | Updated | Multi-turn Run Direction, artifacts callout, four-surface note, ALWAYS rule 8, NEVER rule 5 and version `1.1.0`. |
| `references/tool_surface.md` | Updated | Corrected `start_run`, multi-turn generation flow and artifacts separation. |
| `references/od_cli_reference.md` | Updated | `od run` verbs, multi-turn section, HTTP API surface and resolved `command[0]` item. |
| `references/mcp_wiring.md` | Updated | Install-info canonical, `command[0]` as the Helper binary and confirmed shape. |
| `feature_catalog/feature_catalog.md`, `04--runs/headless-runs.md` | Updated | Run feature moved to multi-turn. |
| `manual_testing_playbook/manual_testing_playbook.md`, `03--gated-runs/gated-verb-confirm.md` | Updated | `RUN-001` moved to the multi-turn flow with the discovery-form answer. |
| `README.md` | Updated | Run narrative, troubleshooting rows and FAQ. |
| `changelog/v1.1.0.0.md` | Created | Generation-flow correction changelog. |
| `graph-metadata.json` | Updated | Topics, source docs, causal summary and changelog entry. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `this file` | Created | Packet control docs. |

### Follow-Ups

- This was a documentation correction, not a binary change.
- The live test is the evidence for the multi-turn flow, HTTP surface and port rotation. It was not independently re-run in this phase.
- The full headless `od --no-open` path remains inferred.
- Per-verb auth requirements for user-invoked generation or media calls remain partly open.
