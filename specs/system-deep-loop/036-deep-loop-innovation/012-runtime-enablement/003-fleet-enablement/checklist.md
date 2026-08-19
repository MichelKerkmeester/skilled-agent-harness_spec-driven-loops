---
title: "Checklist: Fleet Enablement"
description: "Blocking verification contract for the serial fleet driver: dry run, injected-failure containment, resume without re-flip, per-mode reader contracts, and final fleet authority state."
trigger_phrases:
  - "fleet enablement checklist"
  - "fleet driver verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-19T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the driver, CLI and both suites; 12 guards proven by negative control"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "No mode can reach cutover_ready, so no mode can be enabled"
      - "deep-improvement-common has no working name on the append CLI"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 65
    open_questions: []
    answered_questions: []
---
# Checklist: Fleet Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Assertions are made against authority-record bytes and command exit statuses, never against the driver's own log — the
log is part of what is under test. Every mode is verified on its own evidence; a green on one mode never stands in for
another.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `002-deep-research-enablement` complete including its fan-out proof [BLOCKED: predecessor `002-deep-research-enablement` closed 18 of 26 items; its remaining 8 and its fan-out proof are blocked on the same missing flip transitions that block this phase]
- [x] CHK-002 [P0] Each mode's reader set derived from its own projection manifest entries (REQ-003) [EVIDENCE: `deriveModeSurfaceSet` reads `LEGACY_PROJECTION_MANIFEST` per mode via a prefix-ownership table — `mode-surface-map.ts:58`; the derived sets for all 7 modes are in `scratch/dryrun.json`]
- [x] CHK-003 [P0] Any mode lacking a manifest entry is flagged as a failure to investigate, not skipped (REQ-003) [EVIDENCE: an empty `surfaceIds` returns a `reader-contract` failure rather than a skip — `enable-modes.cjs:120`; no mode currently trips it, every one of the 7 derives at least one surface, asserted by `gives every fleet mode at least one surface`]
- [x] CHK-004 [P0] Pre-run authority record bytes captured for all seven modes (SC-002) [EVIDENCE: `scratch/authority-prerun-capture.md` — no `authority-*.json` exists for any of the 8 registry modes, so every pre-run state is the synthesized `legacy_authoritative` default; the authority root holds only its `README.md`]
- [x] CHK-005 [P1] Mode order fixed and recorded as data (REQ-001) [EVIDENCE: `FLEET_MODE_ORDER` derives from `AUTHORITY_FLIP_MODE_ORDER` by excluding the pilot — `mode-surface-map.ts:21`; asserted by `fixes the mode order as data`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Each coordinator call requests exactly one mode (REQ-006) [EVIDENCE: `runStep` is awaited once per mode with a single mode string — `enablement-driver.ts:137`; asserted by `requests exactly one mode per call`. No coordinator request is constructed at all, since the step refuses before the write path]
- [x] CHK-007 [P0] Per-mode state is external, so a stopped run is resumable (REQ-005) [EVIDENCE: state is a JSON file replaced atomically after every success, persisting the union of prior and current completions; an adversarial review caught it persisting only the current run, which lost a completed mode and re-planned it — reproduced, fixed, and now asserted by `keeps an earlier run's completions when a later run resumes` and `does not re-plan a mode an earlier run completed`, both proven red by NC-M]
- [ ] CHK-008 [P1] The per-mode step is the pilot's procedure parameterised, not a reimplementation [PARTIAL: the step performs the checks the runtime can actually perform and refuses the flip with the on-disk state named. It cannot be the pilot's full procedure because the pilot's own flip is blocked — no mode, including the pilot, can reach `cutover_ready`]
- [x] CHK-009 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan for spec paths, `REQ-`, `CHK-`, `SC-`, `ADR-` and task ids across all 6 new files returns 0/0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Dry run over all six modes changes no authority record, proven by diff against the pre-run capture (SC-001) [EVIDENCE: authority root byte-identical before and after — one file, `README.md`, unchanged sha256 `3728804f`; no state file written; asserted by `writes no state file during a dry run` and `never creates the authority root during a dry run`, proven red by NC-D and NC-F]
- [x] CHK-011 [P0] An injected failure stops the driver and names both the mode and the failing check (REQ-004, SC-002) [EVIDENCE: injected failure stops at the named mode and names the check — asserted by `stops at the first failing mode and names the failing check`; the real run stops identically, `scratch/realrun.json` naming `deep-review` and check `flip`]
- [x] CHK-012 [P0] After the injected stop, later modes' records are byte-identical to the pre-run capture (SC-002) [EVIDENCE: no `authority-*.json` exists after the stop, asserted by `writes no authority record when a step fails`; the step refuses on the read path so no compare-and-swap is reached]
- [ ] CHK-013 [P0] Resume enables the remaining modes without re-flipping earlier ones (REQ-005, SC-003) [PARTIAL: resume is proven at the driver across runs — a completed mode survives a later run's write and is never re-planned, asserted by two tests proven red by NC-M, after the review found the opposite behaviour shipping. End-to-end resume across a real flip is untestable while no mode can be enabled]
- [ ] CHK-014 [P1] Full suite re-run and reported as a delta against a captured baseline
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P0] Every mode's reader contract passes against that mode's own projected files (REQ-003, SC-004) [BLOCKED: a reader contract needs files projected by an enabled mode; no mode is enabled, so running one would pass vacuously. `skill-benchmark` would pass vacuously regardless — its projectable set is empty, which the derivation reports rather than hides]
- [ ] CHK-016 [P0] All seven authority records read as ledger authority on an independent read (REQ-008, SC-005) [BLOCKED: all 8 records read `legacy_authoritative`, confirmed independently in `scratch/authority-prerun-capture.md`. Ledger authority requires the flip]
- [ ] CHK-017 [P1] No mode was enabled without passing its own parity gate (REQ-002) [BLOCKED: no mode was enabled, so the property is untested rather than satisfied]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-018 [P0] A multi-mode request was never constructed (REQ-006) [EVIDENCE: the driver's only call site passes one mode string — `enablement-driver.ts:137`; asserted by `requests exactly one mode per call`]
- [x] CHK-019 [P0] `research` was not re-flipped by the driver [EVIDENCE: `FLEET_MODE_ORDER` excludes `deep-research` — `mode-surface-map.ts:21`; asserted by `excludes the already-enabled pilot mode` and proven red by NC-K]
- [x] CHK-020 [P1] Injected failures and their fixtures were fully removed after the test [EVIDENCE: both control scripts restore from a backup and delete it; post-run scan finds 0 perturbation markers and no `.ncbak` file; the CLI suite re-runs 15/15 from the restored tree]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-021 [P1] `implementation-summary.md` records the dry run, the injected-failure containment, and the resume [EVIDENCE: sections 5 and 6 record the dry run's byte-identical authority root, the stop at `deep-review` with six modes untouched, resume proven at the driver, and the two argument-shape defects with their before-and-after]
- [x] CHK-022 [P2] The recorded mode order and its reasoning are legible to someone re-running the driver later [EVIDENCE: the order's derivation and the reason for excluding the pilot are stated at `mode-surface-map.ts:1-15`, and the shared-prefix coupling between the two improvement modes is surfaced as `sharedWith` rather than left implicit]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P2] The driver lives under `runtime/scripts/` alongside the existing operational scripts [EVIDENCE: `runtime/scripts/enable-modes.cjs`, alongside `append-mode-event.cjs`, reusing its tsx bootstrap and JSON-line output conventions]
- [x] CHK-024 [P2] Evidence files live in this folder's `scratch/` [EVIDENCE: `scratch/` holds the pre-run capture, the dry-run plan, the real-run stop and its state file, both control scripts, and `negative-controls.md`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-025 [P0] The completed run required no operator input after it started (REQ-007, SC-006) [BLOCKED: no run completed. The runs that did execute needed no operator input at any point]
- [ ] CHK-026 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-027 [P0] Every item above is `[x]` with evidence, or the phase is not complete [BLOCKED: 8 items remain open — 1 predecessor, 5 blocked on the missing flip transitions, 2 partial]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Driver built, full run complete, evidence written |
| Verifier | Re-read the authority records independently rather than trusting the driver's log |

<!-- /ANCHOR:sign-off -->
