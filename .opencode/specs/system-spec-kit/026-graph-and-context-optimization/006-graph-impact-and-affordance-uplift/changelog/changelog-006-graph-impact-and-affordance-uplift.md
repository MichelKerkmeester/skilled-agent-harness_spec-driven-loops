---
title: "Root: Graph Impact and Affordance Uplift"
description: "Parent changelog for the 026/006 packet. It summarizes clean-room governance, Code Graph impact work, Skill Advisor affordance evidence, Memory trust display, docs rollup, remediation and the deep-research review."
trigger_phrases:
  - "root changelog"
  - "graph impact and affordance uplift root"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-04-28

> Spec folder: `026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift` (Level 3)

### Summary

Phase 026/006 shipped the graph-impact and affordance-uplift packet as clean-room adaptation work. The parent scope started from external research, but it treated that input as architecture evidence rather than source material. Eight child phases cleared governance, built Code Graph foundations, improved edge and blast-radius output, added Skill Advisor affordance evidence, showed Memory causal trust, rolled up docs, remediated review findings and captured a 10-iteration research review. Historical docs still mention `010` and `012`, but this changelog records the current packet path.

### Included Phase Changelogs

| Phase | Changelog | Story |
|-------|-----------|-------|
| 001 | [Clean-Room License Audit](./changelog-001-clean-room-license-audit.md) | P0 license posture and fail-closed rule. |
| 002 | [Code Graph Phase Runner and detect_changes](./changelog-002-code-graph-phase-runner-and-detect-changes.md) | Phase runner, diff parser, preflight handler and docs. |
| 003 | [Code Graph Edge Explanation and Impact Uplift](./changelog-003-code-graph-edge-explanation-and-impact-uplift.md) | Edge explanations, `blast_radius` risk fields and fallback shape. |
| 004 | [Skill Advisor Affordance Evidence](./changelog-004-skill-advisor-affordance-evidence.md) | Sanitized affordances through existing scorer lanes. |
| 005 | [Memory Causal Trust Display](./changelog-005-memory-causal-trust-display.md) | Per-result Memory trust badges from existing causal data. |
| 006 | [Docs and Catalogs Rollup](./changelog-006-docs-and-catalogs-rollup.md) | Umbrella docs, feature catalog and playbook indexes. |
| 007 | [Review Remediation](./changelog-007-review-remediation.md) | Review fixes across MCP wiring, schemas, sanitizers, tests and docs. |
| 008 | [Deep Research Review](./changelog-008-deep-research-review.md) | Independent completed-loop audit with 0 P0, 1 P1 and 17 P2. |

### Added

- Clean-room governance record for external-research adaptation.
- Code Graph typed phase runner and `detect_changes` preflight foundation.
- Code Graph edge explanation fields and richer `blast_radius` output.
- Skill Advisor affordance evidence routed through existing scoring lanes.
- Memory causal trust badges attached per result.
- Packet-local changelog index covering the parent and 8 child phases.

### Changed

- The packet identity moved from older `010` and `012` references to current path `026/.../006-graph-impact-and-affordance-uplift`.
- Documentation now treats owner boundaries as part of the shipped contract.
- Verification evidence distinguishes real command output from operator-pending DQI checks.
- Review remediation converted several deferred or internal-only notes into wired public surfaces.

### Fixed

- Review remediation closed the stale `detect_changes` MCP registration story.
- Review remediation fixed schema exposure for `minConfidence`.
- Review remediation hardened diff path handling, hunk parsing, affordance sanitization and trust-badge rendering.
- Deep-research review identified residual closure-integrity issues for downstream packets.

### Verification

- Parent source read: `spec.md`, `resource-map.md` and `graph-metadata.json`.
- Child sources read: 8 `implementation-summary.md` files plus thin-phase specs and review or research artifacts.
- Git history checked with `git log --oneline -- <sub-phase-dir>/` for each child.
- Phase 007 records `tsc --noEmit` exit 0 and phase-specific Vitest totals across Wave-3 evidence.
- Parent strict validation is rerun as part of this changelog job and reported in the final response.

### Files Changed

| File | What changed |
|------|--------------|
| `001-clean-room-license-audit/*` | License audit docs, ADR and review evidence. |
| `002-code-graph-phase-runner-and-detect-changes/*` | Phase runner and `detect_changes` spec docs plus implementation evidence. |
| `003-code-graph-edge-explanation-and-impact-uplift/*` | Edge metadata and impact uplift evidence. |
| `004-skill-advisor-affordance-evidence/*` | Affordance evidence implementation and verification docs. |
| `005-memory-causal-trust-display/*` | Trust-badge implementation and verification docs. |
| `006-docs-and-catalogs-rollup/*` | Umbrella documentation rollup evidence. |
| `007-review-remediation/*` | Review remediation spec docs and closure record. |
| `008-deep-research-review/*` | Research artifacts, root docs and review report. |
| `changelog/*.md` | New packet-local changelog folder and 10 files. |

### Follow-Ups

- Downstream remediation remains tracked by the 008 deep-research review: P1 D1 and selected P2 findings.
- Historical `010` and `012` labels remain in older source docs. This changelog uses the current filesystem identity.
