---
title: "Handover: 036/006/010 docs-drift-and-p2-batch (COMPLETE — deferred item re-landed)"
trigger_phrases: []
---
# Handover: 036/006/010 docs-drift-and-p2-batch (COMPLETE — deferred item re-landed)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** Complete. The docs-drift + P2 batch landed against `bf4f280ce7`. The one reverted item (T014) was re-landed on 2026-08-18; the packet has no open deferred ends.

**Handover Time:** 2026-08-18 · **From:** orchestrator

---

## 1. What closed

### T014 / CHK-021 / CHK-033 / CHK-FIX-006 [P1] — shared strict validator adopted in the research + review mode gates
- **State:** `[x]` DONE. Both `deep-research-rollback-gate/mode-gate.ts` and `deep-review-rollback-gate/mode-gate.ts` now consume `hasExactKeys` and `validateRows` from `../mode-contracts/index.js`; both local `hasExactKeys` copies are deleted. No local reimplementation remains.

### Why the first attempt regressed, and what actually fixed it
The original adoption flipped the **entire** rollback-window row predicate from `filter` to reject. That predicate was doing three jobs at once: structural row validity, success selection, and (review gate only) authentication membership. Rejecting on the whole predicate meant a legal `incomplete` / `abstained` row, or a well-formed row absent from `authenticatedExecutions`, hard-rejected the evidence set instead of being excluded from the count — which is precisely what the evidence-counting tests assert.

The re-land splits the concerns:
- **Structural validity → reject** via the shared `validateRows`: token execution id, positive safe-integer authority epoch, sha256 certificate digest, and `authorityState` / `result` being declared union members.
- **Selection → filter** (semantics unchanged): `new_authoritative_reversible` + `trusted-completion` + authenticated-membership (review gate only).

## 2. Evidence
- **Red-before (negative control):** the naive whole-predicate adoption reproduced **3** failures (the 2 named in the previous handover plus `does not adopt the authenticated parity handoff exit status as authority`, added by the 2026-08-16 substrate-identity hardening). Captured in `scratch/t014-red-before.txt`.
- **Green-after:** `deep-review-rollback-gate.vitest.ts` **86/86**; `deep-research-rollback-gate.vitest.ts` **81/81**; `tsc --noEmit` exit 0.
- **Four added negative tests** (two per gate) prove the new rejection behaviour is real: each fails against the unfixed lib and passes after. Full receipts in `scratch/t014-verification-evidence.md`.

## 3. Landing state
Committed on branch `worktrees/015-036-mode-gate-strict-validator` (worktree `.worktrees/015-036-mode-gate-strict-validator`, base `11d87179e5`). **Not merged into `skilled/v4.0.0.0`** — the main checkout carries unrelated in-flight sibling-lane state (048→049 rename, 039/040 deletions, sk-vision edits), so the merge is left to the operator once those lanes settle.

## 4. Guardrail (still applies)
The point is a **single** shared validator. If future work tempts a local copy in either gate, stop — that reintroduces the drift this item removed.
