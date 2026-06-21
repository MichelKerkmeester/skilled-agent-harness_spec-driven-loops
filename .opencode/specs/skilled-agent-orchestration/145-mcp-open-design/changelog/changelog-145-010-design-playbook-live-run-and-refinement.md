---
title: "Changelog: live-run and refine the design playbooks [145-mcp-open-design/010-design-playbook-live-run-and-refinement]"
description: "Chronological changelog for the live design-playbook run and refinement phase."
trigger_phrases:
  - "phase changelog"
  - "playbook live run"
  - "design playbook refinement"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/010-design-playbook-live-run-and-refinement` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

This phase ran both design skills' manual testing playbooks end to end for the first time. All 13 scenarios received live verdicts: 12 PASS, 1 PARTIAL and 0 SKIP. Kimi K2.7 and DeepSeek v4 Pro, both driven by `sk-design-interface`, passed every model-judgment scenario.

### Added

- Recorded `CHK-012`, confirming new script or doc content degrades gracefully and follows existing patterns.

### Changed

- Enumerated both playbooks and classified the 13 scenarios.
- Preflighted app and daemon state, Kimi and DeepSeek slugs and `.utcp_config.json` backup.
- Ran `ID-007` provenance, `ID-005` and `ID-006` routing and `ID-001`, `ID-002` and `ID-003` model-judgment through Kimi and DeepSeek.
- Ran `WIRE-001` by installing `open-design` into `.utcp_config.json` through Code Mode.
- Ran `READ-001`, `ID-004` and `ID-008` through bundled Open Design systems.
- Ran `RUN-001` gated `od` generation, `ID-009` fidelity and simulated `FAIL-001`.

### Fixed

- Applied `sk-design-interface` refinements for `ID-003` fixture, `ID-004` and `ID-008` system source, `ID-007` tokens and `ID-009` runId.
- Fixed the 154 contrast cross-finding and committed it under 154.
- Recorded `CHK-FIX-001` through `CHK-FIX-004`, covering traceability to live-run gaps, same-class consistency, consumer self-checks and no security, path or parser fix.

### Verification

| Check | Result |
|-------|--------|
| All 13 scenarios | PASS: all ran live with verdicts, 12 PASS, 1 PARTIAL and 0 SKIP. |
| Two models on five judgment and routing scenarios | PASS: Kimi and DeepSeek both ran. |
| `package_skill --check` | PASS: `mcp-open-design` and `sk-design-interface` both passed. |
| Self-check counts and prompt equality | PASS: counts preserved and prompt equality held. |
| House voice on edited files | PASS: no em dashes. |
| 154 contrast fix | PASS: re-graded, cited ratios now clear AA. |
| `WIRE-001` live `tools/list` | PARTIAL: needs a fresh Code Mode session. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp-open-design/manual_testing_playbook/{manual_testing_playbook.md, 02--reading/read-design-system.md, 03--gated-runs/gated-verb-confirm.md}` | Updated | Socket precondition, READ token wall, RUN model-pinning and form answer. |
| `mcp-open-design/references/mcp_wiring.md` | Updated | Code Mode UTCP wiring path. |
| `sk-design-interface/manual_testing_playbook/{03,04,06,07}--/.md` | Updated | Fixture, system source, de-vendor tokens and runId source. |

### Follow-Ups

- Packet docs were authored, `validate.sh --strict` ran and all tasks were marked complete.
- `WIRE-001` remains PARTIAL. The `open-design` manual is installed and valid in `.utcp_config.json`, but Code Mode loads MCP stdio manuals at startup so live `tools/list` confirmation needs a fresh Code Mode session.
- The five model-judgment and routing scenarios ran as one battery per model for efficiency, with each task labeled independent.
- Other 154 designs were not graded. `ID-003` graded `mimo/01-meridian`, then the 154 contrast fix swept all six designs.
- The optional variation-diversity scenario `ID-010` was deferred because it would change the `sk-id` self-check count.
