---
title: "Implementation Summary: Fleet Legacy-Read Cleanup"
description: "Fleet cleanup readiness now binds to the exact committed activation-manifest bytes and honestly blocks while the fleet remains legacy-authoritative and shadow-only."
trigger_phrases:
  - "fleet cleanup committed readiness"
  - "cleanup blocked shadow rollout"
  - "activation manifest evidence binding"
importance_tier: "critical"
contextType: "implementation"
status: "blocked-shadow"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Readiness-binding defect fixed; real cleanup remains blocked |
| Current readiness | `PREFLIGHT_BLOCKED` / `not-rolled-out` |
| Committed selectors | Four manifests at `servingAuthority:"legacy"`, `shadowOnly:true`, generation `0` |
| Committed manifest SHA-256 | `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` for each current byte-identical selector |
| Real cleanup token | Not minted |
| Live mutation | None |
| Runtime dependencies | Node built-ins plus frozen local libraries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`assertFleetReady(policySnapshots)` no longer accepts activation manifests from
its caller. It reads the fixed committed selectors for `mcp-code-mode`,
`sk-code`, `system-deep-loop`, and `mcp-tooling`, validates their exact
shape, hashes the raw file bytes, and compares the selected generation and
policy hash to the compiled snapshot pins. Legacy authority, `shadowOnly:true`,
generation zero, or a missing selected-policy hash throws
`PREFLIGHT_BLOCKED` with reason `not-rolled-out`.

A real token, when the committed selectors eventually qualify, includes the
committed evidence hash and the snapshot hash. Token use re-reads the same
files and rejects byte drift with `PREFLIGHT_EVIDENCE_DRIFT`.

The synthetic rolled-out fixtures remain as
`hypotheticalRolledOutManifests`. They mint a distinct
`HYPOTHETICAL_ONLY` capability scoped to a newly created temporary simulation
root. Using it outside that root throws `PREFLIGHT_HYPOTHETICAL_ONLY` before
any target byte changes.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The library owns the four evidence locations; the harness cannot substitute a
fixture path. `readCommittedActivationEvidence()` reads and hashes the exact
on-disk bytes. `readinessFromEvidence()` applies the common shape and tuple
checks, while only the committed reader can populate the real-token map.

The harness first runs the committed candidate gates, then invokes the real
preflight. It records all four selectors as legacy/shadow-only and returns the
honest top-level result `status:"PREFLIGHT_BLOCKED"`. The hypothetical control
is nested under `hypotheticalPositiveControl`, explicitly labeled “If the
fleet were fully rolled out…”, and never appears as current fleet state.

No real deletion sequence, card promotion, live registry change, or activation
manifest write occurs. Modeled file-swap controls operate only in OS temporary
directories.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- The committed activation selectors are the authority boundary. Candidate
  receipts can describe a possible rollout, but they cannot replace the bytes
  that currently select serving authority. This follows synthesis §9: legacy
  remains authoritative until atomic activation advances Stages 4–6.
- The token binds raw manifest hashes, not only parsed fields. Re-reading those
  hashes at token use closes the gap between approval and deletion.
- The positive control uses a separate capability class and an isolated
  temporary root. It demonstrates the counterfactual without granting real
  cleanup authority.
- The compiled policy remains the semantic source described by synthesis §3
  Idea 1, but compiled semantics do not imply activated serving authority.
- Cleanup remains blocked not only by the four legacy/shadow selectors; the
  current `system-deep-loop` candidate gate also reports
  `shadow-partial` route-gold with seven resource mismatches.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

`node harness/validate-cleanup.cjs` exits 0 and reports:

- top-level `status:"PREFLIGHT_BLOCKED"`;
- `currentFleet.authorized:false`, `blockReason:"not-rolled-out"`;
- four exact committed evidence entries, each hash `5485c5a4...`, legacy,
  shadow-only, generation zero, and null selected policy hash;
- a guard-removal mutant that accepts caller fixtures when the committed-reader
  binding is removed, proving the binding is load-bearing;
- a clearly labeled `HYPOTHETICAL_READY_ONLY` control with
  `authorization:"HYPOTHETICAL_ONLY"`;
- mismatched manifest pin, mismatched snapshot, legacy hypothetical, missing
  token, out-of-root use, and stale CAS all rejected without target mutation;
- `system-deep-loop` candidate evidence remains `canaryGreen:false` and
  `routeGoldGreen:false`;
- zero external dependencies, zero skill-name branches, zero comment-hygiene
  findings in the static harness scan, and unchanged protected scorer hashes.

Both CommonJS files pass `node --check`; the fixture passes
`python3 -m json.tool`. Strict packet validation ran and exited 2. In-scope
summary/checklist conformance was repaired; the remaining failures are missing
spec-kit runtime/build artifacts (`level-contract-resolver.js` and `tsx`) plus
pre-existing spec/plan/tasks anchor/template drift that this task did not
authorize changing beyond status, checkboxes, and evidence.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- Stage 7 cleanup has not run. The real committed fleet remains
  legacy-authoritative and shadow-only.
- The phase-local final manifest and policy card are hypothetical terminal
  artifacts; they are not evidence of current rollout or deletion.
- `system-deep-loop` currently has seven shadow-partial route rows whose
  observed resources are empty. This phase reports that upstream state and does
  not modify it.
- The positive control proves only what would be authorized after genuine
  rollout evidence exists. Its capability cannot operate outside its temporary
  simulation root.
- Routing rollback still cannot undo an external effect after destination
  COMMIT; post-COMMIT recovery remains destination-owned under synthesis §9.
<!-- /ANCHOR:limitations -->
