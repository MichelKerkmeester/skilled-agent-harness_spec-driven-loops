---
title: "Changelog: mandatory interface-design coupling [145-mcp-open-design/011-mandatory-interface-design-coupling]"
description: "Chronological changelog for the mandatory sk-interface-design coupling phase."
trigger_phrases:
  - "phase changelog"
  - "mandatory coupling"
  - "design gate"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/011-mandatory-interface-design-coupling` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

This phase made the Open Design pairing absolute. `mcp-open-design` already referenced `sk-interface-design`, but only conditionally when a read or run fed a design decision. The phase made `sk-interface-design` a hard precondition for any design work, while pure transport such as wiring and bare inventory stays exempt.

### Added

- None.

### Changed

- Added a top MANDATORY banner before Section 1 in `SKILL.md`, including the WIRE and inventory exemption.
- Added the phase-detection hard gate in Section 2.
- Made resource rows mandatory.
- Added the router precondition that blocks a design step without `sk-interface-design`.
- Added the mandatory `sk-interface-design` pre-step before `start_run` and form answers.
- Rewrote ALWAYS rule 5 as a hard precondition.
- Added the NEVER rule forbidding UI output without `sk-interface-design`.
- Updated success criteria and integration wording.
- Bumped frontmatter version to `1.3.0.0`.
- Added README mandate banner and strengthened grounding, related-skills and FAQ wording.
- Updated parent map row and `children_ids`.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| MANDATORY banner | PASS: present before Section 1 via `grep MANDATORY PAIRING` in `SKILL.md`. |
| Routing hard gate | PASS: `grep HARD GATE` and `design_gate` found in `SKILL.md`. |
| ALWAYS and NEVER rules | PASS: hard precondition and NEVER #6 present via `grep NEVER produce or shape UI`. |
| Pure-transport exemption | PASS: exemption stated in banner, gate and rules. |
| README mandate and version | PASS: README callout, version `1.3.0.0` and `changelog/v1.3.0.0.md` present. |
| `validate.sh --strict` | PASS: this phase returned exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp-open-design/SKILL.md` | Updated | Banner, routing gate, mandatory resource rows, router precondition, Run pre-step, ALWAYS and NEVER rules, success-criteria gate, integration wording and version bump. |
| `mcp-open-design/README.md` | Updated | Mandate banner plus grounding, related-skills and FAQ reworded to hard precondition. |
| `mcp-open-design/changelog/v1.3.0.0.md` | Created | Changelog for the mandatory-coupling upgrade. |
| `150/spec.md`, `150/graph-metadata.json` | Updated | Phase-11 map row and `children_ids`. |

### Follow-Ups

- The planned banner, hard gate, mandatory resource rows, router precondition, Run pre-step, ALWAYS and NEVER rewrite, success criteria, integration wording, version bump and README mandate all landed.
