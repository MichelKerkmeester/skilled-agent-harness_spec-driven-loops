---
title: "Implementation Summary: Rollback, Audit Integrity & Non-Hub Policy"
description: "Completion record for rollback and audit safety. Commit a1cdb65d90 delivered activate-hub.cjs --rollback, flip-serving.cjs prior/fence fixes, shared append-only history, the five-candidate non-hub policy and fixtures, and the P2 canary profile. The P1 session-snapshot field/status-probe work was explicitly deferred. No live hub or repository default was flipped, and the frozen scorer trio stayed SHA-256-identical."
trigger_phrases:
  - "rollback audit integrity implementation summary"
  - "non-hub policy delivered summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/010-rollback-audit-and-non-hub-policy"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled delivery evidence to commit a1cdb65d90"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "verification/rollback-audit-drill.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "REQ-007 session-snapshot status-field work remains an explicit P1 deferral"
    answered_questions:
      - "Rollback, ledger, fence direction, non-hub policy, and canary profile landed"
---
# Implementation Summary: Rollback, Audit Integrity & Non-Hub Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — landed in `a1cdb65d90`. `activate-hub.cjs --rollback`, the `flip-serving.cjs` serving-prior/fence-direction fixes, the append-only audit history, and the non-hub ineligibility policy are built; additive to two already-shipped drivers, no live hub's `servingAuthority` flipped, frozen scorer byte-identical (SHA-256 unchanged) |
| **Authored** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Unaffected by design — this child adds/fixes rollback capability on two already-shipped drivers but does not itself flip any hub's `servingAuthority` or `selectedPolicy` |
| **Verification** | `rollback-audit-drill.cjs`: 23/23 PASS; `non-hub-eligibility-fixtures.cjs`: 32/32 PASS; both run against temp/read-only fixtures, not live hubs |
| **Strict validation** | Rerun after final metadata regeneration; result recorded at handoff |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: Implemented** (landed in `a1cdb65d90`). The build below is delivered, additive to two already-shipped drivers; no live hub's serving authority was flipped and the frozen scorer stayed SHA-256-identical.

`--rollback` was added to `activate-hub.cjs`, reusing its existing hash validation as a committed recovery command. `flip-serving.cjs` now refreshes `serving-prior` on every forward flip and records fence `direction`, closing rollback-then-reflip ambiguity. Both drivers append the same `flip-history/V1` ledger without replacing their latest-record files. The non-hub policy names and negatively tests `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, and `mcp-code-mode`, with the seven real hubs as a positive control. A P2 canary profile documents the window, thresholds, rollback trigger, and an honest operator-fill owner placeholder. The P1 `session-snapshot.ts` field rename/status-probe work did not land and is not part of this completion claim.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Rollback | `007-unified-refactor-implementation/010-live-activation/lib/activate-hub.cjs` | New `--rollback` verb reusing `proveRollback()` |
| Serving-flip fixes | `007-unified-refactor-implementation/011-runtime-engine/lib/flip-serving.cjs` | Unconditional `serving-prior` resave; persisted fence `direction` |
| Audit | `flip-history.jsonl` (per hub, new) | Append-only history shared by both drivers |
| Policy | `non-hub-router-eligibility-policy.md` (new, location TBD at build time) | Named non-hub ineligibility policy + negative fixtures |
| Canary | `references/compiled-routing-canary-profile.md` | P2 canary profile, window, thresholds, rollback trigger, and operator-fill owner |
| Verification | `verification/rollback-audit-drill.cjs`, `verification/non-hub-eligibility-fixtures.cjs` | Isolated rollback/audit drill and five-candidate negative fixture suite |
| P1 deferred | `session-snapshot.ts`, `speckit-resume-auto.yaml`, `session-prime.ts` | Field rename and live status-probe sufficiency requirement were not included |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> **Status: Implemented** (landed in `a1cdb65d90`). The phases below describe the delivered sequence.

Commit `a1cdb65d90` modified the two drivers additively, then added the shared ledger references/policies and isolated verification scripts. The rollback drill imports the real driver functions but copies production-shaped inputs into OS temp directories; the non-hub suite reads the real topology and exercises rejection paths without mutating it. The commit changes no live hub manifest/fence file, no default-on cohort, and no frozen scorer. The P1 session-snapshot/status-probe work was left out rather than represented as complete.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Reuse `proveRollback()` rather than write new hash-validation logic | It already exists in `activate-hub.cjs` as a pre-flight check; exposing it as a real command is the minimal, lowest-risk change |
| Fix `flip-serving.cjs`'s `serving-prior` guard as an intended behavior change, not a "regression" | CF-ACT-8 explicitly identifies the first-flip-only guard as the bug; the fix changes behavior only for the previously-broken rollback-then-reflip case |
| Do not edit `009-non-hub-rollout/`, `012-default-on-decision/`, or `013-create-skill-alignment/` | Scope-lock — this child's write authority is limited to its own three-child authoring pass; those packets' own fixes (e.g., 009's Phase Map undercount) are cross-referenced, not performed here |
| Owner field in the canary-profile document is an explicit placeholder | This child has no authority to name a human organizational owner; fabricating one would violate the no-fabrication mandate |
| `flip-history.jsonl` is additive alongside the existing single-record files, not a replacement | Keeps the existing "latest snapshot" consumers working unchanged while adding the missing history dimension |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Binding rollback | Pass — byte-exact prior restore, selected-policy rollback, serving-authority preservation, and fail-closed serving guard |
| Fence direction | Pass — recovery records `direction=rollback` and monotonic epoch advance |
| Append-only history | Pass — first rollback and idempotent no-op append distinct events; shared driver/direction/schema fields verified |
| Rollback-then-reflip | Pass — `serving-prior` refreshes to the immediately prior manifest, not the first historical value |
| Serving rollback | Pass — byte-identical prior restore, rollback fence, and shared history entry |
| Drill result | `node verification/rollback-audit-drill.cjs` → 23 passed, 0 failed |
| Non-hub policy | All five candidates rejected by eligibility and serving driver; all seven real hubs pass the positive control |
| Fixture result | `node verification/non-hub-eligibility-fixtures.cjs` → 32 passed, 0 failed |
| Live fleet/default | Unchanged — commit contains no live activation manifest/fence update and performs no default flip |
| Frozen scorer | Unchanged — no frozen path in the commit; start/end SHA-256 checked separately |
| Strict packet validation | Pending only until final metadata regeneration; final result recorded at handoff |

## Milestone Status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M0 rollback foundation | Done | `activate-hub.cjs --rollback` and isolated byte-exact drill landed |
| M1 driver/audit fixes | Done | Unconditional prior refresh, fence direction, and shared append-only ledger landed |
| M2 policy + canary profile | Done | Five-candidate policy/fixtures and P2 profile landed |
| M3 session status fields | Deferred (P1) | `session-snapshot.ts`/resume/prime changes are absent from the commit |
| M4 verification | Done for delivered scope | 23/23 rollback/audit and 32/32 eligibility fixtures pass |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-007 is explicitly deferred.** The `routingRecommendation` rename, `skillRouterStatus` field, and resume/priming sufficiency-probe work did not land.
2. **The canary owner remains an operator-fill placeholder.** The profile exists, but no human owner, run window, or live authorization is fabricated here.
3. **Verification is fixture-only by design.** The rollback drill uses isolated temp directories; it proves the drivers without exercising a live hub.
4. **No canary or cutover ran.** The repository default remains off; P4/011 stays blocked on siblings 013/014 and a separate operator go-ahead.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Rollback, prior refresh, fence direction, append-only ledger, policy, fixtures, and P2 canary profile landed in `a1cdb65d90`.
- [ ] REQ-007: reconcile session snapshot/status fields only under a separately approved P1 follow-up; this completion record does not include them.
- [ ] Assign the canary owner and execute the profile only after the P4/011 join gate is green and an operator authorizes the run.
- [ ] Keep the repository default off until that cutover decision.

<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The P1 session-snapshot/status-probe slice was deferred; all rollback, audit, non-hub-policy, and canary-profile scope landed. The implemented drill intentionally uses temp fixtures instead of a live hub, which preserves the no-cutover boundary while exercising the real exported driver functions.

<!-- /ANCHOR:deviations -->
