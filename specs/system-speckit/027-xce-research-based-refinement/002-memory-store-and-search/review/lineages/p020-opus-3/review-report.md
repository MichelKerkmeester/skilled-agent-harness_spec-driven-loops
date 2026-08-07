# Review Report — 020-maintenance-grace-background-embedding (lineage p020-opus-3)

**Executor:** cli-claude-code · claude-opus-4-8 · **Mode:** fan-out lineage, single iteration (maxIterations=1)
**Verdict:** **PASS** (`hasAdvisories: true`) · **Release readiness:** converged
**Stop reason:** maxIterations (1) reached with all 4 dimensions covered and no P0/P1 findings.

---

## 1. Executive Summary

The change extracts the 019 maintenance-active marker writer into a shared, reference-counted module (`maintenance-marker.ts`) and wires both the reindex scan IIFE and the post-scan background-embedding queue into it, closing the 019 gap where a separate launcher re-election interrupted the unprotected deferred-embedding burst.

The implementation is **correct and complete against its spec**. Reference counting is sound and symmetric across end-order; the idle-tick guard is correctly placed; `end()` is idempotent. All four requirements (REQ-001..004) trace to code, and the touched files match the declared scope exactly with no drift.

- **P0:** 0 · **P1:** 0 · **P2:** 2 (advisories)
- **Scope:** 3 source files + 1 test (`maintenance-marker.ts`, `memory-index.ts` scan IIFE, `retry-manager.ts` `runBackgroundJob`, `maintenance-marker.vitest.ts`).
- One P0-candidate (a reference-count leak that could permanently shield a wedged daemon) was actively pursued and **refuted**: `atomicWriteFile` never throws, so `beginMaintenance` cannot throw mid-write and the leak path does not exist.

## 2. Planning Trigger

PASS with P2 advisories only → routes to **changelog / close-out**, not remediation planning. No required fixes block the verdict. The two P2 advisories may be folded into the noted follow-on (cooperative chunk-and-yield embedding phases) at the author's discretion; neither warrants a standalone planning packet.

## 3. Active Finding Registry

| ID | Sev | Dimension | Evidence | Summary |
|----|-----|-----------|----------|---------|
| P2-D1-01 | P2 | Correctness/robustness | `maintenance-marker.ts:44` | `writeMarker()` discards `atomicWriteFile`'s `boolean`. On write failure the count/timer proceed while no marker exists on disk. Impact is **fail-open and self-healing** (launcher may reap — the safe direction; the 20s timer retries). `atomicWriteFile` already `console.warn`s on failure. |
| P2-D4-01 | P2 | Maintainability | `maintenance-marker.vitest.ts:91` | After a non-last `end()`, on-disk `labels` keep the ended holder until the next write event. **By design** (asserted in the unit test); the launcher reads only presence + TTL, never `labels`. Cosmetic metadata. |

## 4. Remediation Workstreams

No required (P0/P1) workstreams. Optional hardening, if desired alongside the noted cooperative-yield follow-on:

- **W-OPT-1 (trivial):** Have `writeMarker()` observe `atomicWriteFile`'s return and `console.warn`/log a marker-specific line on `false`, so a failed mark is attributable to the marker subsystem rather than only the generic transaction-manager warning. Addresses P2-D1-01.
- **W-OPT-2 (optional):** If any future consumer is expected to read marker `labels` as authoritative, re-serialize on `end()`; otherwise leave as-is and keep the by-design note. Addresses P2-D4-01.

## 5. Spec Seed

No spec delta required — implementation matches `spec.md` as written. If W-OPT-1 is taken, a one-line addition to REQ-001's acceptance criteria ("a failed marker write is logged by the marker module") would capture it. Otherwise none.

## 6. Plan Seed

No remediation plan needed for PASS. Deploy-time confirmation (SC-002: a full force reindex plus its post-scan embedding burst survives launcher contention end to end) remains the single outstanding non-code check, already recorded as the handoff criterion.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | EXECUTED | REQ-001..004 ↔ code all confirmed; scope table matches the 4 touched files. |
| checklist_evidence | EXECUTED | `implementation-summary.md` verification rows plausible and self-consistent; build/suite re-run is outside this read-only lineage's TCB; live reindex survival is a deploy-time check (SC-002), not a code deliverable. |
| resource-map-coverage | N/A | `{spec_folder}/resource-map.md` absent at init (`resource_map_present: false`); coverage gate skipped per protocol — no failure. |

Test-soundness cross-check: `core/config.ts:97` (`export let DATABASE_DIR`, reassigned by `resolveDatabasePaths()`) confirms the vitest `SPEC_KIT_DB_DIR` redirect actually retargets the module's writes to a tmp dir — the test does not pollute the live DB dir and its "live ESM binding" comment is accurate.

## 8. Deferred Items

- **P2-D1-01** and **P2-D4-01** — advisories; safe to defer (fail-open / by-design respectively).
- **Live end-to-end reindex survival** — deploy-time verification per SC-002 (out of code scope).
- **Cooperative chunk-and-yield embedding phases** — the author's own noted follow-on (the marker makes the daemon un-reaped but not responsive); out of this phase's scope.

## 9. Audit Appendix

- **Dimensions covered:** 4/4 (correctness, security, traceability, maintainability) in one consolidated iteration (fan-out, maxIterations=1).
- **Tool calls:** ~11 (within TCB).
- **Adversarial replay:** no active P0 → no P0 replay required; the one P0-candidate (ref-count leak) was pursued and refuted by reading `atomicWriteFile` (`transaction-manager.ts:177-200`) — it wraps fs work in try/catch and returns `false` rather than throwing.
- **Convergence:** compositeStopScore 1.0; dimensionsCovered 4/4; newFindingsRatio (iter 1) 0.00; P0 override not triggered.
- **Files read for evidence:** `maintenance-marker.ts`, `memory-index.ts` (scan IIFE), `retry-manager.ts` (`runBackgroundJob`), `maintenance-marker.vitest.ts`, `transaction-manager.ts:177` (`atomicWriteFile`), `config.ts:97` (`DATABASE_DIR`), plus spec/plan/tasks/implementation-summary.
- **Verdict lock:** no confirmed active P0 → verdict legitimately PASS; advisory riskScores (0.15, 0.05) are non-gating context only.
