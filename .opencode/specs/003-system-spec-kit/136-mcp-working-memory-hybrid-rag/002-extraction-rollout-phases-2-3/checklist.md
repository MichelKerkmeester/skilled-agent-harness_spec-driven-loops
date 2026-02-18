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

- [ ] EXR-CHK-001 Root checks `CHK-140-145` mapped and verifiable in this package.
- [ ] EXR-CHK-002 Root checks `CHK-152-154` mapped and verifiable in this package.
- [ ] EXR-CHK-003 Root checks `CHK-160-161` mapped and verifiable in this package.
- [ ] EXR-CHK-004 Hard dependency from package 001 confirmed before Phase 2 execution.

## P1 - Required

- [ ] EXR-CHK-010 Root checks `CHK-146-151` mapped and verifiable in this package.
- [ ] EXR-CHK-011 Root checks `CHK-162-166` mapped and verifiable in this package.
- [ ] EXR-CHK-012 Metrics thresholds preserved: precision >= 85%, recall >= 70%, MRR >= 0.95x.
- [ ] EXR-CHK-013 Planning-only status remains explicit (no completed implementation claims).
- [ ] EXR-CHK-014 Root references remain synchronized across `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`.

## P2 - Optional

- [ ] EXR-CHK-020 Package-level rollout risk notes kept aligned with root `../plan.md`.
- [ ] EXR-CHK-021 Telemetry evidence structure reviewed before implementation starts.

## Evidence

- Root tasks: `../tasks.md`
- Root verification: `../checklist.md`
- Rollout artifacts: `../scratch/`
