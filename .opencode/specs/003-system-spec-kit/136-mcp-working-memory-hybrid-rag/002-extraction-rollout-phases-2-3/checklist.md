# Verification Checklist: Extraction and Rollout Package

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-checklist | v1.1 -->

---

## Verification Protocol

| Priority | Handling |
|----------|----------|
| P0 | Hard blocker |
| P1 | Required unless explicitly deferred |
| P2 | Optional optimization |

---

## P0 - Blockers

- [x] EXR-CHK-001 Root checks `CHK-140-145` mapped and verifiable in this package.
- [x] EXR-CHK-002 Root checks `CHK-152-154` mapped and verifiable in this package.
- [x] EXR-CHK-003 Root checks `CHK-160-161` mapped and verifiable in this package.
- [x] EXR-CHK-004 Hard dependency from package 001 confirmed before Phase 2 execution.
- [x] EXR-CHK-005 Post-research checklist ownership is handed off to wave packages: Wave 1 (`CHK-217-222`, `CHK-226`), Wave 2 (`CHK-223-225`), Wave 3 (`CHK-227-228`).
- [x] EXR-CHK-006 Historical-to-wave transition explicitly preserves completed Phase 2/3 evidence while appending technical handoff contracts.

## P1 - Required

- [x] EXR-CHK-010 Root checks `CHK-146-151` mapped and verifiable in this package.
- [x] EXR-CHK-011 Root checks `CHK-162-166` mapped and verifiable in this package.
- [x] EXR-CHK-012 Metrics thresholds preserved: precision >= 85%, recall >= 70%, MRR >= 0.95x.
- [x] EXR-CHK-013 Execution status is explicit and synchronized with root completion claims.
- [x] EXR-CHK-014 Root references remain synchronized across `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`.
- [x] EXR-CHK-015 Wave package references are explicit in root docs and package transition notes (`../004-post-research-wave-1-governance-foundations/`, `../005-post-research-wave-2-controlled-delivery/`, `../006-post-research-wave-3-outcome-confirmation/`).
- [x] EXR-CHK-016 Transition contract matrix maps requested technical capabilities to wave ownership without changing frozen C136 backlog mapping.

## P2 - Optional

- [x] EXR-CHK-020 Package-level rollout risk notes kept aligned with root `../plan.md`.
- [x] EXR-CHK-021 Telemetry evidence structure reviewed before implementation starts.
- [x] EXR-CHK-022 Historical evidence sections are preserved while transition notes are appended.
- [x] EXR-CHK-023 Sequencing lock confirmed: Wave 1 (`004`) -> Wave 2 (`005`) -> Wave 3 (`006`).

## Evidence

- Root tasks: `../tasks.md`
- Root verification: `../checklist.md`
- Rollout artifacts: `../scratch/`
- Wave 1 package: `../004-post-research-wave-1-governance-foundations/`
- Wave 2 package: `../005-post-research-wave-2-controlled-delivery/`
- Wave 3 package: `../006-post-research-wave-3-outcome-confirmation/`
