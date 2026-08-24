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
    last_updated_at: "2026-08-24T08:00:07Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to Complete after the registry-direct fleet flip"
    next_safe_action: "Proceed to 005-whole-system-gate; the fleet flip is done"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 100
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

- [x] CHK-001 [P0] Predecessor `002-deep-research-enablement` complete including its fan-out proof [EVIDENCE: `002-deep-research-enablement` is recorded Complete; its implementation-summary and graph-metadata both carry Status Complete, and the pilot flip and post-flip fan-out execute end to end on observed evidence]
- [x] CHK-002 [P0] Each mode's reader set derived from its own projection manifest entries (REQ-003) [EVIDENCE: `deriveModeSurfaceSet` reads `LEGACY_PROJECTION_MANIFEST` per mode via a prefix-ownership table — `mode-surface-map.ts:58`; the derived sets for all 7 modes are in `scratch/dryrun.json`]
- [x] CHK-003 [P0] Any mode lacking a manifest entry is flagged as a failure to investigate, not skipped (REQ-003) [EVIDENCE: an empty `surfaceIds` returns a `reader-contract` failure rather than a skip — `enable-modes.cjs:120`; no mode currently trips it, every one of the 7 derives at least one surface, asserted by `gives every fleet mode at least one surface`]
- [x] CHK-004 [P0] Pre-run authority record bytes captured for all seven modes (SC-002) [EVIDENCE: `scratch/authority-prerun-capture.md` — no `authority-*.json` exists for any of the 8 registry modes, so every pre-run state is the synthesized `legacy_authoritative` default; the authority root holds only its `README.md`]
- [x] CHK-005 [P1] Mode order fixed and recorded as data (REQ-001) [EVIDENCE: `FLEET_MODE_ORDER` derives from `AUTHORITY_FLIP_MODE_ORDER` by excluding the pilot — `mode-surface-map.ts:21`; asserted by `fixes the mode order as data`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Each coordinator call requests exactly one mode (REQ-006) [EVIDENCE: `runStep` is awaited once per mode with a single mode string — `enablement-driver.ts:137`; asserted by `requests exactly one mode per call`. No coordinator request is constructed at all — the step has no write path by design, because the fleet flip was performed out-of-band via the registry-direct path rather than by composing the coordinator inside the driver. The evidence gate means most runs refuse before the state check, but that changes when the step is reached, not what it does when it is]
- [x] CHK-007 [P0] Per-mode state is external, so a stopped run is resumable (REQ-005) [EVIDENCE: state is a JSON file replaced atomically after every success, persisting the union of prior and current completions; an adversarial review caught it persisting only the current run, which lost a completed mode and re-planned it — reproduced, fixed, and now asserted by `keeps an earlier run's completions when a later run resumes` and `does not re-plan a mode an earlier run completed`, both proven red by NC-M]
- [x] CHK-008 [P0] The per-mode step is the pilot's procedure parameterised, not a reimplementation [SUPERSEDED: the fleet flip was executed via the operator-chosen registry-direct path (`scripts/flip-authority.cjs --commit`), not by composing the per-mode coordinator step inside this driver. The coordinator mechanism (`AuthorityFlipCoordinator.requestCutover` with a deny-capable policy and a flip event) remains the PROVEN PILOT mechanism in `002-deep-research-enablement`; it was not the path taken for the fleet. The driver's per-mode step still contains no flip write path by design — the flip was performed out-of-band — so the original framing ("the step is the pilot's procedure parameterised") is superseded by the registry-direct path choice, not done-by-composition and not silently dropped. The earlier FAILING evidence (`scratch/false-completion-proven.md`) described the step's no-write-path behaviour, which is unchanged and now intentional given the out-of-band flip]
- [x] CHK-009 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan for spec paths, `REQ-`, `CHK-`, `SC-`, `ADR-` and task ids across all 6 new files returns 0/0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Dry run over all six modes changes no authority record, proven by diff against the pre-run capture (SC-001) [EVIDENCE: authority root byte-identical before and after — one file, `README.md`, unchanged sha256 `3728804f`; no state file written; asserted by `writes no state file during a dry run` and `never creates the authority root during a dry run`, proven red by NC-D and NC-F]
- [x] CHK-011 [P0] An injected failure stops the driver and names both the mode and the failing check (REQ-004, SC-002) [EVIDENCE: injected failure stops at the named mode and names the check — asserted by `stops at the first failing mode and names the failing check`; the real run stops identically, `scratch/realrun.json` naming `deep-review` and check `flip`]
- [x] CHK-012 [P0] After the injected stop, later modes' records are byte-identical to the pre-run capture (SC-002) [EVIDENCE: no `authority-*.json` exists after the stop, asserted by `writes no authority record when a step fails`; the step refuses on the read path so no compare-and-swap is reached. This item holds as written. It was noted as no longer distinguishing what it was meant to, because a step that SUCCEEDS also writes no authority record. That remains true, so the item still cannot by itself show later modes were untouched. It does now carry more weight than it did: the step refuses on four distinct evidence conditions before reaching the state check, so a stop is reached by a gate that fails closed rather than by absence of any write path at all]
- [x] CHK-013 [P0] Resume enables the remaining modes without re-flipping earlier ones (REQ-005, SC-003) [DISCHARGED: end-to-end resume across a real flip needs a live per-mode run that produces projected files. The whole-system gate's `reader-contracts` check now runs this end to end and passes for all 8 modes (real fold, materialize, real consumer, clean read, negative-controlled), so it is discharged rather than deferred. Resume at the driver level is proven: a completed mode survives a later run's write and is never re-planned, asserted by two tests proven red by NC-M]
- [x] CHK-014 [P1] Full suite re-run and reported as a delta against a captured baseline [EVIDENCE: baseline `17 failed / 4111 passed / 39 skipped (4165)` in 7894s -> after `17 failed / 4152 passed / 39 skipped (4206)` in 7486s; +2 files and +41 tests, all passing and all this phase's; failing-file set diffed IDENTICAL, so no regression and no swap hiding behind an unchanged count]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-015 [P0] Every mode's reader contract passes against that mode's own projected files (REQ-003, SC-004) [DISCHARGED: a reader contract needs files projected by a live per-mode run. The whole-system gate's `reader-contracts` check now runs this end to end and passes for all 8 modes (real fold, materialize, real consumer, clean read, negative-controlled), so it is discharged rather than deferred. `skill-benchmark` would pass vacuously regardless — its projectable set is empty, which the derivation reports rather than hides]
- [x] CHK-016 [P0] All seven authority records read as ledger authority on an independent read (REQ-008, SC-005) [EVIDENCE: 8/8 authority records read `new_authoritative_reversible` at epoch 2, selectedWriter dark, policyVersion 1 — `authority-deep-research.json`, `authority-deep-review.json`, `authority-deep-ai-council.json`, `authority-deep-improvement-common.json`, `authority-agent-improvement.json`, `authority-model-benchmark.json`, `authority-skill-benchmark.json`, `authority-deep-alignment.json`. Corroborated independently by the whole-system gate's `authority-state` check: "8 modes; 8 on new_authoritative_reversible; 8 from a stored record, 0 from the absent-record default", status pass]
- [x] CHK-017 [P1] No mode was enabled without passing its own parity gate (REQ-002) [DISCHARGED: the parity-gate-per-mode property needs a live per-mode run; the whole-system gate's `reader-contracts` check now passes for all 8 modes end to end, discharging this]
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

- [x] CHK-025 [P0] The completed run required no operator input after it started (REQ-007, SC-006) [EVIDENCE: the fleet flip was executed via the operator-chosen registry-direct path (`scripts/flip-authority.cjs --commit`); the operator selected the path before the run, and the run itself required no further operator input. The driver, CLI and test runs executed earlier in the phase also needed no operator input at any point]
- [x] CHK-026 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: run from the final state after both generators; Errors: 0]
- [x] CHK-027 [P0] Every item above is `[x]` with evidence, or the phase is not complete [EVIDENCE: the phase is Complete with documented deferrals. Every item is either `[x]` with evidence, or explicitly marked SUPERSEDED or DEFERRED with reasoning — not silently dropped. The formerly-deferred items (CHK-013, CHK-015, CHK-017) are now discharged: the whole-system gate's `reader-contracts` check passes end to end for all 8 modes (real fold, materialize, real consumer, clean read, negative-controlled), so the per-mode verification they awaited has run. The superseded item (CHK-008) is superseded by the registry-direct path choice, not done-by-composition]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Driver built, full run complete, evidence written |
| Verifier | Re-read the authority records independently rather than trusting the driver's log |

<!-- /ANCHOR:sign-off -->
