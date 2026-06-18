---
title: "Changelog: catalog and playbook realignment [145-mcp-open-design/012-catalog-playbook-realignment]"
description: "Chronological changelog for the catalog and playbook realignment after mandatory coupling."
trigger_phrases:
  - "phase changelog"
  - "catalog realignment"
  - "playbook gate"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/012-catalog-playbook-realignment` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

Phase 011 made the `sk-interface-design` coupling a hard precondition, but the grounding feature catalog still called it optional and on-demand, and no scenario tested the gate. This phase aligned the catalog and playbook to the actual contract. The gate is now documented as mandatory and has a manual scenario with negative, positive and exemption controls.

### Added

- Added `manual_testing_playbook/05--design-gate/mandatory-design-gate.md`.
- Added a gate-enforcement scenario with negative, positive and exemption controls.

### Changed

- Audited catalog and playbook text against the phase 011 reality.
- Confirmed the grounding feature said optional and no gate scenario existed.
- Rewrote `feature_catalog/03--grounding/design-system-grounding.md` to mandatory hard-precondition framing.
- Kept the split-doc references.
- Updated the playbook index, cross-reference, waves and counts.
- Ran `sk-doc` validators with 0 issues.
- Confirmed by grep that no optional and on-demand or `claude_design_parity` residue remained.
- Strict-validated this phase.
- Reconciled parent map and `children_ids`.
- Marked all tasks complete.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Grounding feature states mandatory | PASS: no optional and on-demand or applied whenever hits remain across both directories. |
| `GATE-001` scenario | PASS: negative, positive and exemption controls present, mirroring `gated-verb-confirm.md` structure. |
| Playbook index | PASS: counts changed from 4 to 5, waves and cross-reference reconciled. |
| Dead `claude_design_parity.md` references | PASS: references now point to `design_parity_transport.md` and `real_ui_loop.md`. |
| `sk-doc` validators | PASS: both indexes and touched files returned 0 issues. |
| `validate.sh --strict` | PASS: this phase returned exit 0. |
| Tasks complete | PASS: 9 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `feature_catalog/03--grounding/design-system-grounding.md` | Updated | Optional framing changed to mandatory framing. |
| `feature_catalog/feature_catalog.md` | Updated | Section 4 changed from applied whenever to hard precondition. |
| `manual_testing_playbook/05--design-gate/mandatory-design-gate.md` | Created | `GATE-001` hard-gate scenario. |
| `manual_testing_playbook/manual_testing_playbook.md` | Updated | Index, counts from 4 to 5, waves and cross-reference. |

### Follow-Ups

- The gate and its test are contract-level. `GATE-001` verifies the documented hard-block as an operator scenario, and enforcement depends on agent adherence to `SKILL.md`, not a runtime interceptor.
- No skill version bump. This phase aligns docs to the `v1.3.0.0` and `v1.4.0.0` behavior, leaving the skill version unchanged.
