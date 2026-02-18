# Verification Checklist: Foundation Package

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

- [ ] FDN-CHK-001 Root checks `CHK-125-129` mapped and verifiable in this package.
- [ ] FDN-CHK-002 Root checks `CHK-130-139` mapped and verifiable in this package.
- [ ] FDN-CHK-003 Root checks `CHK-155-159b` mapped and verifiable in this package.
- [ ] FDN-CHK-004 Hard gate conditions documented: rank correlation >= 0.90 and redaction FP <= 15% before Phase 2.
- [ ] FDN-CHK-005 Handoff artifacts listed and linked (`eval-dataset-1000.json`, `phase1-5-eval-results.md`, `redaction-calibration.md`).

## P1 - Required

- [ ] FDN-CHK-010 `T000a-T028` and `T027a-T027o` mapping to root tasks is current.
- [ ] FDN-CHK-011 Dependency notes to package 002 are explicit and accurate.
- [ ] FDN-CHK-012 Session lifecycle contract coverage present (`T027k-T027n`).
- [ ] FDN-CHK-013 Planning-only status remains explicit (no completed implementation claims).
- [ ] FDN-CHK-014 Root references remain synchronized across `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`.

## P2 - Optional

- [ ] FDN-CHK-020 Package-level risk notes kept aligned with root `../plan.md`.
- [ ] FDN-CHK-021 Package timeline updated if root milestone dates change.

## Evidence

- Root tasks: `../tasks.md`
- Root verification: `../checklist.md`
- Hardening artifacts: `../scratch/`
