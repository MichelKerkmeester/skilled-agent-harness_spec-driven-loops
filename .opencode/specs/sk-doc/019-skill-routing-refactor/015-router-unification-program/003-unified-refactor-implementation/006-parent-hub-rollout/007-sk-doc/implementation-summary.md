---
title: "Implementation Summary: sk-doc Compiled Router Rollout"
description: "Compiled 12-mode sk-doc policy, real-scorer proof, document parity, authority fencing, and byte-exact shadow rollback."
trigger_phrases: ["sk-doc implementation summary", "sk-doc real green result", "sk-doc policy evidence"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc"
    last_updated_at: "2026-07-19T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Recorded REAL-GREEN rollout"
    next_safe_action: "Retain shadow-only candidate"
    blockers: []
    key_files: ["implementation-summary.md", "harness/validate-canary.cjs"]
    session_dedup:
      fingerprint: "sha256:d530613e29c72ef98ccb95c388f5d0150ca85840d965d5fce9a45dcbc4788a52"
      session_id: "sk-doc-rollout-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-doc Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-doc |
| **Completed** | 2026-07-19 |
| **Level** | 2 |
| **Status** | In Progress — implementation REAL-GREEN; no-commit freshness unresolved |
| **Effective policy** | `e80319ebe7c49d7d6bbc23b292596a0c1755f2ff026438c1b3d7fe4947c01f6c` |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

A deterministic compiled contract now represents the authored `sk-doc` hub. Twelve workflow modes
compile to injective actor destinations and eleven packet resources; the shared skill packet does
not collapse its two public routes. The child contains five libraries, two harnesses, an 18-case
fixture, five compiled artifacts, five activation artifacts, and Level-2 documentation.
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The compiler hashes raw authored bytes, verifies parsed identity and router closure, then calls the
shared compiler. The router applies exact commands before weighted vocabulary, uses authored delta
and tie-break, fires only an exact `whenAll` bundle, and follows null default to defer.

Typed decisions pass the frozen parser. Routes use the shared projector; negatives project empty.
Both live evaluations and persisted acceptance-bound route-gold use the real read-only scorer. The
generated card reproduces machine decisions without claiming committed effects. The fenced drill
pins the candidate generation and restores the retained prior bytes exactly at epoch two.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Derive every mode from the registry | Prevent invented or omitted routes. |
| Keep mode in compound identity | Shared packet does not collapse public destinations. |
| Bundle only exact matched sets | Authored composition cannot become an arbitrary union. |
| Sort bundles through tie-break | Authored order wins over prompt order. |
| Preserve null default | Zero evidence cannot manufacture a destination. |
| Keep advisor non-authoritative | Availability or drift cannot rewrite local policy. |
| Keep legacy authority | Prove candidate and rollback without a live flip. |
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Deterministic compile | Pass | Consecutive artifacts byte-identical; policy `e80319eb…c01f6c` |
| Frozen schemas | Pass | Policy, advisor, card, and typed rows validate |
| Archetype | Pass | 12 modes, 11 packets, delta 1, null default, exact ordered bundle |
| Route-gold | REAL-GREEN | 18/18 live and 18/18 persisted rows pass; writeback false |
| Falsifier | Pass | Corrupted positive resource fails scorer |
| Negative algebra | Pass | Non-routes target-free and authority-withheld; forbidden rejects |
| Document/advisor | Pass | 20 document variants; advisor drift/absence cannot rewrite |
| Execution | Pass | Legal path PREPARE→VERIFY→COMMIT |
| Hard blocks | Pass | Nine activation blocks driven |
| Rollback | Pass | Prior/restored hash `5485c5a4…a8c23`; epoch 2 |
| Inputs | Pass | Authored and scorer digests unchanged |
| Syntax | Pass | All seven `.cjs` checks exit zero |
| Strict packet | Blocked | Zero errors; dirty-path freshness remains because commit is forbidden |

Protected scorer SHA-256:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

1. This is an 18-case canary, not a calibrated natural-language corpus.
2. The candidate is not live serving authority; it intentionally remains shadow-only.
3. Document replay is unattested and cannot commit effects.
4. No network, package install, live external operation, commit, or push was performed.
<!-- /ANCHOR:limitations -->
