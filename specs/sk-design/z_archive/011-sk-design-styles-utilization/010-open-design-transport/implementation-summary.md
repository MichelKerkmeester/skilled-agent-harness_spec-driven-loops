---
title: "Implementation Summary: Open Design transport grounding receipt + return reconciliation"
description: "The Open Design transport grounding-receipt + return-reconciliation layer is built and verified: metadata-only grounding receipts through a recursively closed schema, immutable pre-await proposal snapshots, semantic reconciliation recomputation, artifact-bound evidence, a gated multi-turn continuation, and a structural no-cache invariant. 25/25 tests pass; an adversarial review closed three no-cache/authority P0s. Live read/run is capability-gated; offline validators pass with no daemon."
trigger_phrases:
  - "open design transport summary"
  - "grounding receipt status"
  - "transport reconciliation status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/010-open-design-transport"
    last_updated_at: "2026-07-18T19:45:09Z"
    last_updated_by: "claude"
    recent_action: "Built and verified the transport; 25/25 tests, no-cache + non-authoritative enforced"
    next_safe_action: "Verify the live read/run path against the Open Design daemon when available"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-opendesign-011-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Raw payloads are reduced to hashes/ids inside the transport; no caller ever receives them."
      - "The transport is non-authoritative — a proposal frozen before any await drives reconciliation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Open Design transport grounding receipt + return reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-open-design-transport |
| **Status** | Complete — implemented, reviewed, verified (offline; live path capability-gated) |
| **Level** | 2 |
| **Origin** | Terminal phase (Phase D) of the styles-library utilization packet 011 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Open Design transport grounding-receipt + return-reconciliation layer for `design-mcp-open-design`. It carries styles-library provenance as a **metadata-only** grounding receipt (a recursively closed schema of enums, identifiers, digests — no free-text field can carry a payload), mandatory proposed-vs-returned reconciliation with divergence surfacing, and a capability-gated live read/run path. The transport is strictly **non-authoritative**: mode-owned inputs are deep-frozen before any `await`, the proposal digest is bound into the receipt, and acceptance/mutation stay the mode's decision.

### Files Created

| File | Action | Result |
|------|--------|--------|
| `design-mcp-open-design/grounding-receipt.mjs` | Create | Recursively closed metadata receipt schema + validator (no raw payload fields) |
| `design-mcp-open-design/return-reconciliation.mjs` | Create | Semantic outcome/divergence recomputation, duplicate-ID rejection, artifact-bound evidence |
| `design-mcp-open-design/offline-gate.mjs` | Create | Identity-bound in-process gate required before any live I/O |
| `design-mcp-open-design/live-transport.mjs` | Create | Capability-gated read/run, immutable pre-await snapshot, payload reduction to hashes/ids, multi-turn completion |
| `design-mcp-open-design/fixtures/`, `__tests__/` | Create | Offline fixtures + 25 adversarial contract tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high, fast) implementer to `spec.md`/`plan.md`/`tasks.md` in an isolated worktree, consuming the phase-007 seam. A `gpt-5.6-sol` xhigh-fast adversarial reviewer ran live reproductions and found three P0s: a raw-payload callback escape, raw HTML surviving in a free-text receipt field, and a TOCTOU where mode inputs mutated across an `await` (a rejected proposal reconciled as `aligned`). A scoped fix pass closed all seven findings: raw payloads are reduced to metadata inside the transport and never returned; receipt fields became a recursively closed schema; mode inputs are cloned + deep-frozen before the first await with the proposal digest bound into the receipt; reconciliation recomputes outcome/divergences and rejects any mismatch; duplicate/unbound evidence is rejected; and the multi-turn `awaiting_input → completed` path was wired. Scope stayed locked to `design-mcp-open-design/**`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Metadata-only via a recursively closed schema | Content-sniffing denylists are bypassable; a closed schema of enums/ids/digests makes a raw payload unrepresentable |
| Immutable pre-await proposal snapshot | Freezing mode-owned inputs before any async gap prevents a TOCTOU that would let the transport alter mode judgment |
| Semantic reconciliation recomputation | Shape validation lets a forged `aligned` pass; recomputing outcome/divergences and requiring exact equality prevents it |
| Transport is non-authoritative | Acceptance and mutation approval stay the mode's decision; the transport only surfaces divergence |
| Offline-first, live capability-gated | Offline validators + fixtures pass with no daemon; the live path is gated behind them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run by the implementer and independently re-run by the orchestrator.

| Check | Result |
|-------|--------|
| No-cache invariant | VERIFIED: raw payloads reduced to hashes/ids inside the transport; raw HTML/CSS in every string-bearing receipt field is rejected; no caller/callback receives a raw payload |
| Non-authoritative (TOCTOU) | VERIFIED: mode inputs deep-frozen pre-await; a proposal mutated during `listTools()` cannot change the reconciled outcome |
| Semantic reconciliation | VERIFIED: a forged `aligned` record (divergences relabeled) is rejected; outcome/divergences are recomputed |
| Evidence integrity | VERIFIED: duplicate influence IDs rejected; classification hashes must bind to returned artifacts |
| Multi-turn completion | VERIFIED: `awaiting_input → completed` fixture reaches a completed return + reconciliation |
| Offline-testable | VERIFIED: the suite runs with no live daemon; live path capability-gated/stubbed |
| Test suite | VERIFIED: `node --test` 25/25 pass, 0 skipped |
| Packet validity | VERIFIED: `validate.sh 010-open-design-transport --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live read/run verification is a follow-up.** The offline receipt validators, reconciliation fixtures, no-cache invariant, and multi-turn contract all pass without a daemon; verifying the live path against the actual Open Design MCP daemon (no-cache + multi-turn against the live tool surface) requires the daemon and is gated behind the offline validators.
2. **Metadata-only by design.** Raw corpus and Open-Design payloads are never cached or returned; only hashes, identifiers, digests, and closed metadata cross the boundary.
3. **Non-authoritative by design.** The transport never overrides mode judgment, acceptance, or mutation approval; it only surfaces proposed-vs-returned divergence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

- Verify the capability-gated live read/run path against the Open Design daemon when available (no-cache + multi-turn completion on the live surface).
- Feed reconciliation-divergence learnings back into the paired modes' handoff contracts if patterns emerge.
<!-- /ANCHOR:next-steps -->
