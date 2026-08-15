---
title: "Checklist: Deep Review - Rollback & Mode Gate"
description: "Checklist for the Deep Review rollback switch and independent mode gate: verify fail-closed authority control, bounded rollback, full lifecycle shadow parity, sealed artifacts, certificate closure, and a non-authoritative phase-014 handoff."
trigger_phrases:
  - "Deep Review rollback and mode gate checklist"
  - "deep-review rollback readiness checklist"
  - "deep-review mode gate verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T12:22:55Z"
    last_updated_by: "codex"
    recent_action: "Reverified the rollback gate at HEAD; 83 of 84 focused assertions passed"
    next_safe_action: "Verify parity exit-status independence"
    blockers:
      - "Focused rollback-gate suite timed out in the parity exit-status independence probe"
    key_files: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Review mode gate. Every item is checked against a pinned BASE,
phase-012 shared-contract digest, write-set fence, mode-contract digest, fixture manifest, event and reducer versions, artifact
seal manifest, parity receipt, run certificate, receipt root, replay fingerprint, rollback-window record, and candidate SHA. The
report records commands, exit codes, fixture counts, stream and projection fingerprints, gate decisions, rollback reasons, and
unexpected tracked mutation. A mode-gate PASS certifies `MIGRATED_SHADOW_READY` only; it never authorizes authority cutover.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] BASE, the parent 036 invariant, `manifest/phase-tree.json`, phase-012 shared review-loop digest, write-set fence, and phase-006 authorization digest are pinned in the candidate report [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-002 [P0] LANDED additive-dark siblings `001` through `003` and planned evidence siblings `004` through `006` are inventory-bound with their ownership boundaries; no sibling responsibility becomes authority or is redefined here [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-003 [P0] The legacy Deep Review lifecycle is inventoried for scope, each dimension pass, candidate/evidence/adjudication, convergence, blocked stop, synthesis, report, resume, and continuity handoff [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-004 [P1] The authority-control schema, rollback trigger matrix, healthy anchor, dual window bounds, expiry rule, and phase-014 handoff fields are frozen before fixture execution [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every caller-input digest and validator is exception-guarded; circular, non-finite, forbidden-prototype, non-plain, wrong-shape, missing, stale, unauthorized, or digest-mismatched evidence returns a typed denial and `legacy_authoritative` [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-006 [P0] The closed rollback-request schema authenticates every field, rejects unknown or inert fields, snapshots validated values, and permits `ledger -> legacy` only through the real gateway with a re-verified certificate anchor [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-007 [P1] The rollback window has both a deadline and logical-operation or attempt bound; expiry and renewal cannot silently widen the window [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-008 [P0] Deep Review consumes the phase-012 shared review-loop and deep-alignment fence without a local scope, lineage, convergence, report, or write-set fork [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-009 [P0] The phase emits no authority flip, self-clearing rollback, window close, legacy-writer removal, or canonical state mutation [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Scope and every per-dimension pass produce matching legacy and ledger event order, logical identities, causal links, payload digests, and projection fingerprints [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-011 [P0] Candidate, evidence, adjudication, P0/P1/P2, and finding-lineage fixtures preserve orthogonal impact, confidence, evidence strength, reachability, exploitability, and lifecycle fields [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-012 [P0] Convergence, nine legal-stop gates, blocked-stop, graph-convergence, synthesis, and `review-report.md` fixtures match without terminal-only parity shortcuts [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-013 [P0] Resume and continuity-handoff fixtures match reuse, re-execute, reconcile, compensate, or block decisions and preserve the root lease and event tail [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [ ] CHK-014 [P0] The required phase-009 receipt verifies integrity and binding, but its `exitStatus` is never adopted; readiness is independently re-derived through the real `TransitionAuthorizationGateway` and deterministic ledger replay without re-running the parity harness [OPEN: the exact fresh test timed out at 30s; focused suite exit 1, 83/84]
- [x] CHK-015 [P0] Every target, scope, pass, observation, candidate, adjudication, convergence, synthesis, report, and resume reference resolves through the real substrate with expected kind, epoch/lifecycle/freshness/state, visibility/redaction, and authority-liveness checks [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-016 [P0] Missing, changed, truncated, substituted, wrong-kind, unsupported, or descriptor-drifted artifacts release no bytes and produce a typed gate failure [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-017 [P0] The run certificate binds the pinned event range, declared outcome, unresolved or blocked findings, report handoff, replay fingerprint, receipt-set root, and rollback anchor; the request anchor equals the independently re-verified certificate anchor [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-018 [P0] Every required transition receipt closes with authorization, causal links, input/output digests, append position, effect state, and explicit unknown handling [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-019 [P0] Independent verification reproduces the certificate and receipt result without live model, tool, network, or mutable workspace access [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-020 [P0] Parity drift, replay mismatch, seal or receipt gap, unknown effect, contract drift, integrity alarm, health quarantine, or a predecessor token not strictly below the coordinator's durable high-water mark and new rollback token each produce typed rollback or block evidence [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-021 [P0] Rollback fixtures at before dispatch, after effect start, after provider acceptance, after receipt append, after projection refresh, and before report commit introduce no duplicate finding, effect, report, or authority transition [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-022 [P0] Deadline expiry and logical-operation exhaustion close the rollback window safely; stale-window renewal and invalid checkpoint cases fail closed [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-023 [P0] The Deep Review gate remains blocked when deep-alignment, a generic dashboard, a final report, or a convergence score is green but Deep Review evidence is absent [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The gate matrix covers the complete `scope -> per-dimension passes -> P0/P1/P2 findings -> convergence -> review-report` lifecycle plus resume and continuity handoff [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-025 [P1] The mode-gate certificate records `PASS`, `BLOCKED`, or `INDETERMINATE`, the `MIGRATED_SHADOW_READY` handoff, all evidence digests, rollback result, and non-authoritative posture [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] No process-local flag, environment fallback, mode-owned lineage, or failing review run can authorize, clear, or select its own rollback or cutover [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-027 [P1] Raw failed tails, sealed references, parity differences, unknown effects, gate refusals, and restoration receipts remain append-only and content-bound [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-028 [P1] The phase docs identify the shared phase-012 contract, LANDED additive-dark predecessors, six sibling ownership boundaries, rollback switch, dual bounds, gate evidence, phase-014 handoff, and the provenance limits cited from the golden 007 decision record [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [x] CHK-029 [P2] Every tolerated volatility exception and every approved non-PASS disposition has a durable owner, reason, expiry, and invalidation condition [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Candidate gate output, parity reports, seals, certificates, rollback fixtures, and receipts remain isolated from canonical Deep Review runtime state [Evidence: HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7`; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769`; fresh focused run: 83 assertions passed; code probes `mode-gate.ts:62-844`, `rollback-switch.ts:183-396`]
- [ ] CHK-031 [P1] The final diff is limited to the authorized three-leaf closeout scope and the verifier records no unexpected runtime mutation [OPEN: `git diff --name-only` also reports unrelated tracked deletions at `.claude/commands` and `.cursor/hooks/completion-evidence-response.mjs`; the closeout did not touch or restore them]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, the full Deep Review lifecycle has green shadow parity, every required
artifact and receipt is verified, the run and mode-gate certificates close, rollback is proven within both bounds, invalid control
states fail closed, and the handoff emits only `MIGRATED_SHADOW_READY` with legacy authority unchanged. A generic mode result,
deep-alignment result, final report, or numeric convergence score cannot satisfy this checklist.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 mode-gate contract, attaches the parity, seal, certificate, receipt, and rollback
evidence to the candidate report, and proves the isolated run made no canonical-state or authority mutation.
<!-- /ANCHOR:sign-off -->
