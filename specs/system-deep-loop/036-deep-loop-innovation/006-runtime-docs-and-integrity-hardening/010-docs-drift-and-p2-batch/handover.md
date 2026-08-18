# Handover: 036/006/010 docs-drift-and-p2-batch (batch landed — one reverted item to re-land)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** The docs-drift + P2 batch landed against `bf4f280ce7`. One item was **reverted** rather than shipped with a regression, so it is deferred for a clean re-land.

**Handover Time:** 2026-08-18 · **From:** orchestrator

---

## 1. The deferred end

### T014 / CHK-021 / CHK-FIX-006 [P1] — Adopt 027's shared strict validator in the research + review mode gates
- **State:** `[ ]` DEFERRED (not landed). `mode-gate.ts` in **both** the research and review rollback gates was reverted to original.
- **What:** Lane B should adopt `027`'s shared strict validator (which rejects unknown top-level keys and malformed rollback-window rows) instead of patching the legacy gates locally — the same file `027` touches, not a local reimplementation. Tracks findings F-031-01 / F-031-02.
- **Why deferred:** the naive adoption **broke 2 deep-review rollback-window evidence-counting tests** (83 passing at the time). It was reverted to avoid shipping a regression.

## 2. Resume steps (to re-land T014)
1. Read `027`'s shared strict validator and the 2 failing deep-review rollback-window **evidence-counting** tests; understand why counting semantics diverged under the shared validator.
2. Reproduce the 2 failures first (red) against the shared-validator adoption — this is the negative control.
3. Fix the root cause so the shared validator's rollback-window handling matches the evidence-counting the 2 tests assert (reconcile semantics, don't loosen the tests).
4. Re-apply the adoption to both research and review `mode-gate.ts`, prove the 2 tests go green **and** no other rollback-gate test regresses, then land.
5. Mark T014/CHK-021/CHK-FIX-006 `[x]` with the red-before/green-after digests.

## 3. Guardrail
The whole point is a **single** shared validator (027's), not a second local copy. If the fix tempts a local reimplementation, stop — that reintroduces the drift this item exists to remove.
