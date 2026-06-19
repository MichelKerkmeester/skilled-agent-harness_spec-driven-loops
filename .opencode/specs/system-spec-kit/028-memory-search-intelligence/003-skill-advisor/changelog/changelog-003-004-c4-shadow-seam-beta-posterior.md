---
title: "Changelog: Skill Advisor Shadow Seam and Beta Posterior"
description: "Chronological changelog for the Skill Advisor shadow seam and Beta posterior planning phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

This phase is a Level 3 planning closeout, not a code delivery. It defines the missing reliability-learning path for the Skill Advisor: an out-of-process promoter for existing shadow proposals, a shared Beta posterior primitive, a conservative attestation gate and a reversible shadow-only promotion path. All candidates remain pending. The live advisor has no per-lane Beta math today, so the plan records a net-new build rather than a graduation.

### Added

- Added the Level 3 planning packet for the shadow promoter and reliability-weighted learning path.
- Added decision records for shadow-only delivery, shared posterior ownership and live-promotion gates.
- Added the candidate map that keeps every reliability candidate pending until its substrate and benchmark gates are met.

### Changed

- Reframed the phase from a shipped implementation into a gated build plan.
- Grounded the plan in the existing shadow feedback pipeline and its missing out-of-process consumer.
- Recorded that the shared posterior must be one primitive with thin adapters, not a fork per subsystem.

### Fixed

- Removed the implication that any advisor reliability candidate had already shipped.
- Corrected the boundary between existing shadow proposal capture and the missing promoter that would consume it.
- Marked live lane-weight movement as a hard no-go until benchmark evidence exists.

### Verification

| Check | Result |
|-------|--------|
| Level 3 doc set | PASS, spec, plan, tasks, checklist, decision record and summary present |
| Source citations | PASS, local scorer and lane-registry references read directly |
| Shipped-record check | PASS, no advisor reliability candidate recorded as shipped |
| Strict validation | PASS for the sub-phase |
| Implementation tests | PENDING, no code shipped in this planning phase |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Created | Candidate scope, gates and risks |
| `plan.md` | Created | Shadow promoter and Beta-posterior build path |
| `tasks.md` | Created | Pending implementation and verification work |
| `checklist.md` | Created | Planning checks and later implementation gates |
| `decision-record.md` | Created | Shadow-only and shared-primitive decisions |
| `implementation-summary.md` | Created | Planning closeout |

### Follow-Ups

- Build the out-of-process promoter that consumes shadow proposals.
- Coordinate the shared Beta posterior module with the sibling subsystem before any adapter lands.
- Capture a real baseline before quoting any benefit or live-promotion claim.
