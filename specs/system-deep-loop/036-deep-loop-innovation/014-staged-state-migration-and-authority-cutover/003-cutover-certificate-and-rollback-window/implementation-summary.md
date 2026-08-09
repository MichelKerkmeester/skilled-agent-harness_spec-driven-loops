---
title: "Implementation Summary: Cutover Certificate & Rollback Window"
description: "Dark, additive certificate-binding and rollback-window control library for the phase-014 authority cutover; nothing in it is wired into any live authority path yet."
trigger_phrases:
  - "cutover certificate implementation summary"
  - "rollback window implementation summary"
  - "deep-loop 003 cutover certificate build"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-08-09T06:40:00Z"
    last_updated_by: "claude"
    recent_action: "Built cutover-certificate lib + rollback-window + 41 tests; dark/additive, nothing wired"
    next_safe_action: "Verify + land 014/003; then build 014/001 migration + 002 flip; 003 needs no further work"
    blockers: []
    key_files:
      - "lib/cutover-certificate/types.ts"
      - "lib/cutover-certificate/certificate.ts"
      - "lib/cutover-certificate/rollback-window.ts"
      - "lib/cutover-certificate/index.ts"
      - "tests/unit/cutover-certificate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Freeze/fence/reconcile/restore revert mechanics stay owned by the existing per-mode <mode>-rollback-gate/rollback-switch.ts (8x, already built); this child owns only the signal-driven revert decision and the record binding to whichever certificate that switch produced"
      - "Classification evidence binds via manifest-level verifyClassificationManifest, matching the existing mode-gate pattern exactly, not a per-mode WorkflowMode scoping (deep-improvement-common has no WorkflowMode value upstream)"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

# Implementation Summary: Cutover Certificate & Rollback Window

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cutover-certificate-and-rollback-window |
| **Spec Folder Path** | `specs/system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window` |
| **Completed** | 2026-08-09 |
| **Level** | 2 |
| **Branch** | `skilled/0135-014-cutover` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

A new, self-contained runtime module implementing the two coupled control components the spec assigns to this child: the `cutover_certificate` canonical ledger event, and the per-mode monitored rollback window (open, evaluate, monitor, revert-decision, close). Nothing else in the runtime imports this module — it is dark and additive, matching the task's constraint that this child does not itself move any authority.

**Certificate.** `buildCutoverCertificate` binds one mode's already-independently-verified evidence — the phase-013 mode-gate readiness certificate, shadow-parity result, phase-008 rollback-drill certificate, phase-008 mixed-version-replay result, phase-008 classification manifest, phase-007 migration receipts, and the approving `TransitionPolicyRegistry` entry — into one fact set, deny-by-default on any missing, mismatched, stale, or cross-mode-bound input. `verifyCutoverCertificate` independently re-derives the certificate digest and rebinds every fact to a caller's exact expectation. `createCutoverCertificateEventRegistry`/`prepareCutoverCertificateEventWrite`/`appendCutoverCertificateEvent` register the `deep-loop-cutover.ledger.certificate-issued` event type and append it through the existing fenced, gateway-authorized seam (`appendAuthorizedThroughFence` → the module-private `#appendAuthorized` bridge) — no new append path was added, and the module refuses to append any event of a different type.

**Rollback window.** `openRollbackWindow` builds the digest-bound record a real CAS would open (rollback anchor, retained legacy assets, monitor cursor, opening epoch). `evaluateRollbackWindow` implements the phase-004 later-of rule (14 calendar days AND 5 successful authoritative executions), reusing the identity-linked double-count guard already proven correct across the 8 per-mode pre-cutover readiness evaluators, now as one canonical post-cutover evaluator instead of 8 duplicated pre-cutover ones. `evaluateMonitoredSignals` folds health/parity-drift/replay/authorization/receipt/budget/state-reconciliation readings into a deterministic `continue | extend | revert | operator_stop` decision, failing to `operator_stop` on malformed or self-contradictory input rather than guessing. `buildRollbackRevertRecord` binds and validates the non-destructive invariants of a revert this decision authorized — it does not perform the freeze/fence/reconcile/restore mechanics itself; those stay owned by the existing per-mode `rollback-switch.ts`. `closeRollbackWindow` only succeeds once the window is `eligible_to_close` and no signal is unresolved, and signs durable closure evidence through the existing `ReceiptCertificationProvider` interface (no new signing scheme).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/types.ts` | Created | Certificate, evidence-binding, window, signal, revert, and closure types |
| `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/certificate.ts` | Created | Certificate assembly, verification, event-type registration, and fenced append |
| `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/rollback-window.ts` | Created | Window open/evaluate, signal decision, revert record, clean closure |
| `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/index.ts` | Created | Public API surface |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/cutover-certificate.vitest.ts` | Created | 40-case unit suite covering every reject reason code, both minimum-rule branches, all signal-decision outcomes, and one real fenced ledger append |
| `specs/.../003-cutover-certificate-and-rollback-window/t001-disposition.md` | Created | Confirm-first record: what was CONFIRMED-REAL to build vs. already present upstream |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Confirm-first: every requirement was re-graded against live code at origin tip before writing anything, recorded in `t001-disposition.md`. Two REQ-008 findings were partially refuted — the freeze/fence/reconcile/restore mechanics already exist per-mode — so only the decision-and-record layer was built for those, not new mechanics. Every new behavior got a test before it was trusted: the suite grew case-by-case alongside `certificate.ts`/`rollback-window.ts`, each new reject reason code or state transition added and confirmed failing (module absent) before the code that made it pass existed. `tsc --noEmit` and `vitest run tests/unit/cutover-certificate.vitest.ts --no-coverage` were run after every meaningful change, resetting `database/` first each time per the runtime's test-isolation rule. The module is dark: nothing else in the runtime imports it yet, so there is no rollout — the "ship" here is the built, tested contract sibling `002-per-mode-authority-flip` and phase 015 will later wire to.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Revert mechanics not reimplemented | `<mode>-rollback-gate/rollback-switch.ts` already freezes admission, fences the writer, gateway-authorizes, restores `legacy_authoritative` at `epoch+1`, rejects destructive intent, and emits a signed rollback certificate — generically over any `AuthorityState`, including `new_authoritative_reversible`. Rebuilding it would duplicate proven, tested code and blur the ownership boundary the spec's own risk register calls out. |
| One canonical window evaluator, not an 8th per-mode copy | The later-of algorithm was already proven correct 8 times (once per mode) as a pre-cutover readiness helper. This child is the natural single owner of the real post-cutover window, so the algorithm is generalized here once rather than duplicated a 9th time. |
| Classification evidence binds at manifest level, not per `WorkflowMode` | The existing mode-gate pattern (`verifyClassificationManifest(manifest)`) is mode-agnostic and already proven consistent across all 8 modes, including `deep-improvement-common`, which has no corresponding `WorkflowMode` literal upstream. Inventing an 8th `WorkflowMode` value to force per-mode scoping here would contradict the upstream contract, not extend it. |
| `RollbackDrillCertificate`/evidence-source fixtures in tests use minimal, honestly-cast shapes for fields this module does not read | This module verifies bindings (mode, candidateSha, passed, classification digest), not the drill's own ~40-field structural or cryptographic validity — that is phase 008's job, explicitly out of scope per spec.md. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript | `tsc --noEmit -p tsconfig.json` (lib only, tests excluded by tsconfig), rc 0 |
| Cutover certificate + rollback window suite | `tests/unit/cutover-certificate.vitest.ts` via `vitest run <file> --no-coverage`, 41/41 pass, rc 0 |
| Spec-kit validation | `validate.sh <spec-folder> --strict`, see checklist.md for the exact recorded result |

### Test Coverage Summary

41 cases across 8 `describe` blocks: `buildCutoverCertificate` (11 — one issue path plus every `CutoverCertificateRejectionReasonCode` the assembler can reach), `verifyCutoverCertificate` (4), the ledger event write/append path (3, including one real fenced append through a temporary `AppendOnlyLedger` + `TransitionAuthorizationGateway` harness, one defensive wrong-event-type refusal, and one proof that a stale re-append after the head advanced fails closed instead of silently duplicating), `openRollbackWindow` (2), `evaluateRollbackWindow` (7 — open/eligible/extended-by-low-traffic/extended-by-unresolved-signal/identity-fold/malformed-input), `evaluateMonitoredSignals` (6 — continue/extend/revert/contradictory/malformed/empty), `buildRollbackRevertRecord` (4), `closeRollbackWindow` (3, including a real HMAC sign-then-verify round trip).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark by design, not yet consumed** — nothing in the live runtime calls this module. Sibling `002-per-mode-authority-flip` (still Planned, no code) is the intended future consumer of `buildCutoverCertificate`/`appendCutoverCertificateEvent` as its flip precondition, and phase 015 is the intended future consumer of `closeRollbackWindow`'s evidence. Wiring either is explicitly out of this child's scope.
2. **`RollbackDrillCertificate` test fixture is intentionally partial** — it satisfies only the fields `buildCutoverCertificate` actually reads (`mode`, `candidateSha`, `passed`, `classificationDigest`, `certificateDigest`), cast to the real type rather than hand-building all ~40 drill-evidence fields, since re-proving drill structural validity is phase 008's responsibility.
3. **Window/signal/revert/closure records are typed value objects, not separate ledger events in this build** — only the `cutover_certificate` itself is a registered, appendable ledger event type, matching the spec's explicit "The `cutover_certificate` is a canonical LEDGER EVENT" framing; the window lifecycle stays additive-and-typed until a future phase wires it to real production monitoring signals.
4. **Metadata could not be regenerated through the designated script in this worktree** — `system-spec-kit`'s own TypeScript build output (`scripts/dist/`, `mcp-server/lib/templates/level-contract-resolver.js`) and its `tsx` binary are both absent here, confirmed by reproducing the identical failure on the untouched sibling `002-per-mode-authority-flip` and via three independent probes (`validate.sh` rule bridges, `node_modules/.bin/tsx`, `generate-context.js`'s own `require`). This is a pre-existing worktree/toolchain gap outside this child's scope; `description.json`/`graph-metadata.json` were left untouched rather than hand-authored (both already exist from before this build and pass `GRAPH_METADATA_PRESENT`/`DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE`), so `graph-metadata.json`'s derived `status: "planned"` is stale relative to this implementation-summary.md and will read correctly once the script is runnable again.
<!-- /ANCHOR:limitations -->
