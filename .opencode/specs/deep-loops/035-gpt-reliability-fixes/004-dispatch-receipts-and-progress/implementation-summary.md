---
title: "Implementation Summary: Dispatch Receipts and Progress Records"
description: "Phase 004 shipped: dispatch-receipt engine (GAP-23 key-leak blocker closed), receipt validator, per-seat/per-stage progress records, model-route advisory migration, CLI-branch wrapper routing, and council stepwise persistence. Each piece independently Sonnet-verified. Closes F-010, F-011, F-012, F-013, F-015, F-016, F-017, F-031, F-041, F-043 (effort L)."
trigger_phrases:
  - "implementation"
  - "summary"
  - "035 004"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/004-dispatch-receipts-and-progress"
    last_updated_at: "2026-07-03T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped all six tasks; each Sonnet-verified and committed"
    next_safe_action: "Run the live acceptance-cell benchmark re-run on gpt-fast"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-004-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Dispatch Receipts and Progress Records

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-dispatch-receipts-and-progress |
| **Completed** | 2026-07-03 (implementation + per-piece verification) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six tasks, each committed separately behind the phase-001 feature flag:

1. **Dispatch-receipt engine** — a `receipt-crypto` module (`deriveReceiptKey`, `canonicalReceiptJson`, `signReceipt`, `verifyReceipt`) plus INTENT (pre-spawn) and COMPLETION (post-spawn) receipts written by both the sync and async executor dispatchers. The run-master secret lives only in a module-scoped closure — it never reaches an env var, argv, or the filesystem. This closes the GAP-23 key-leak blocker.
2. **Receipt validator** — a validation gate before the state-log append that verifies the receipt MAC and INTENT/COMPLETION agreement, downgrades model-route proofs to advisory once a valid receipt exists (mode is still hard-enforced), and adds distinct `dispatch_receipt_missing` / `_invalid_mac` / `_intent_mismatch` failure classes. A production `deriveReceiptKeyForDispatch()` accessor was added so the validator never sources the secret through a test-only seam.
3. **Progress records** — a `progress-record` emitter plus a reducer allowlist across the deep-review / research / context reducers, at a liveness cadence set to half the watchdog window.
4. **Model-route advisory migration** — the `deep_*_auto.yaml` route field dropped from the required assert set; route proofs become advisory when receipts exist.
5. **CLI-branch wrapper routing** — copilot / claude-code / opencode CLI branches routed through the audited executor wrapper (one regression cell per branch style).
6. **Council stepwise per-seat persistence** — a `persistSeatStepwise` / `parseSeatReport` path independent of the full council-report parser, so a single seat's artifact is durable before the barrier-join and per-seat progress records are emitted on each seat return, with in-CLI watchdog-only bounding documented as a non-default fallback.

Closes F-010, F-011, F-012, F-013, F-015, F-016, F-017, F-031, F-041, F-043.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Orchestrator-hosted loop: GLM-5.2-max implemented each bounded, scope-locked task; an independent Sonnet-5 agent verified every diff before commit (the implementer is not treated as objective about its own work). GAP-23 was implemented by GLM after GPT-5.5-fast reproducibly stalled on the 897-line executor-audit file. Every commit used scoped staging with a verified zero-leak staged set, because a concurrent session held ~115 unrelated dirty files in the shared working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run-master secret in a module-scoped closure only | GAP-23 — a receipt HMAC key that reaches a command string is a leak; keeping it off env/argv/fs is the containment guarantee, proven by an end-to-end test that spawns a real child and dumps its argv + env |
| Production key accessor, not the test seam | A Sonnet-found P1: the validator initially derived the key via `__getRunMasterSecretForTesting`; a production accessor removes the test-only dependency from the shipped path |
| Route proofs advisory, mode still hard-enforced | Once a valid receipt exists it already proves the dispatch identity; the mode is the load-bearing invariant and stays hard-enforced |
| Stepwise persist is a separate parser path | A single seat must not fail on missing whole-report sections; `persistSeatStepwise` never calls the full-report parser |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-piece independent verification | Each of the six commits Sonnet-verified (CONFIRMED); two real defects caught and fixed (test-seam reuse, fixture fork) before commit |
| Receipt containment test | End-to-end test spawns a real child, asserts the secret never appears in its argv or env |
| CLI-branch receipts test | copilot / claude-code / opencode branch styles each produce verifying INTENT + COMPLETION receipts; non-allowlisted env stripped |
| Council persist tests | 16/16 pass (4 new stepwise tests); stash/restore baseline confirms the pre-existing persist-artifacts failure is not caused by this change |
| Comment hygiene | Exit 0 on every touched code file |
| `validate.sh --strict` | See closeout run below |
| Live acceptance cells (RVB-007, RSB-005, RSB-007, ACB-004-high, ACB-005, CXB-004) on gpt-fast | **NOT re-run** — deferred; see Known Limitations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live acceptance-cell re-run pending.** The 033 behavior-benchmark cells that this phase is meant to flip (RVB-007, RSB-005, RSB-007, ACB-004-high, ACB-005, CXB-004) were not re-run against live gpt-fast-med / gpt-fast-high. Implementation is complete and unit/integration-verified; confirming the end-to-end behavior flip requires an expensive live-model benchmark run, tracked as the follow-up below.
2. **Flag-gated.** All changes sit behind the phase-001 feature flag; the live re-run must exercise the flag-on path.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Run the live acceptance-cell benchmark re-run (T002) on gpt-fast-med + gpt-fast-high with the phase-001 flag on; confirm the six cells reach their expected verdict and the baseline leg does not regress. That closes the phase's own acceptance criterion.
<!-- /ANCHOR:followup -->
