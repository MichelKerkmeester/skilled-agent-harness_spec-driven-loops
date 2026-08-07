# 019 Review Synthesis

**Phase:** `019-maintenance-grace-daemon-survives-reelection` (027 XCE / 002-memory-store-and-search track)
**Scope:** maintenance-active marker + launcher re-election adopt path. Shipped files verified: `mcp_server/lib/storage/maintenance-marker.ts`, `mcp_server/lib/providers/retry-manager.ts`, `mcp_server/handlers/memory-index.ts`, `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`, plus tests `mcp_server/tests/launcher-maintenance-guard.vitest.ts` and `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`.
**Lineages:** 10 (2 deepseek-v4-pro, 2 mimo-v2.5-pro, 2 kimi-k2.7, 4 opus-4.8). 1 iteration each.
**Raw findings collected:** 27 across all lineages. **0 P0** anywhere. P1-or-escalated: 7 finding-instances (all map to the same doc/spec-drift cluster). All lineages independently concluded the runtime code is correct and every REQ behaviorally met; every raised finding is documentation / traceability drift or low-value hardening, not a code defect.

This synthesis is READ-ONLY: every confirmed/rejected verdict below was checked against the cited source at the cited line.

---

## Verdict

**PASS** (advisory remediation recommended).

Confirmed-findings-only mapping:
- **Confirmed P0: 0** → no FAIL trigger.
- **Confirmed P1: 0** → no CONDITIONAL trigger. (Two lineages — `p019-kimi-2`, `p019-opus-2` — escalated the spec-vs-code drift cluster to P1; on verification it is a doc-accuracy issue with **zero runtime impact** — the launcher predicate reads only `childPid`/`activeUntilMs`, never the drifted fields, and all REQs are behaviorally satisfied with passing tests. Downgraded to P2 per the standard "downgrade-to-resolved if spec updated / no behavioral defect" rule the raising lineages themselves stated.)
- **Confirmed P2 (high-agreement, ≥2 models): 6**
- **Confirmed P2 (singleton / low-value hardening): 3** (1 partially refuted)

The phase ships working, tested code. The PASS is gated only on a doc-reconciliation pass; no code change is required for correctness. All confirmed items are doc-side except three minor code-hardening suggestions (none required).

---

## Confirmed Findings

| Severity | File:line | Agreement (lin / models) | Issue | Verification evidence | Remediation |
|----------|-----------|--------------------------|-------|-----------------------|-------------|
| P2 (high) | `019.../spec.md:114-120`, `plan.md:64-65`, `tasks.md` | 5 lin / 4 models (deepseek-1, mimo-1, mimo-2, kimi-1, kimi-2, opus-1/2/3/4 — all 9 non-deepseek-2) | "Files to Change" cite `mcp_server/bin/lib/model-server-supervision.cjs` + `mcp_server/bin/mk-spec-memory-launcher.cjs`; that dir does not exist. | CONFIRMED. `ls mcp_server/bin` → No such file or directory. Real files: `.opencode/bin/lib/model-server-supervision.cjs` (exports L1428-1430) and `.opencode/bin/mk-spec-memory-launcher.cjs` (re-exports L1845-1847); test requires `../../../../bin/mk-spec-memory-launcher.cjs` (vitest:13). Doc-only; deliverables shipped and correct. | Rewrite the three doc path references to `.opencode/bin/...`. |
| P2 (high) | `019.../spec.md:103,132` (marker shape); `maintenance-marker.ts:48` | 5 lin / 4 models (deepseek-2, mimo-1, mimo-2, kimi-1, kimi-2, opus-1/2/3) | Spec mandates marker field `jobId`; shipped writer emits `labels: string[]`. | CONFIRMED. `maintenance-marker.ts:48` writes `labels: activeLabels`; `dist/lib/storage/maintenance-marker.js:34` = `labels`. No `jobId` key in source or dist. Launcher predicate (`shouldAdoptDespiteProbe`, supervision.cjs:632-640) reads only `childPid`/`activeUntilMs` — **zero runtime impact**. `labels[]` is the deliberate design enabling reference-counted overlapping sources (scan + embedding queue); no spec amendment recorded it. | Amend spec REQ-001 / §3 to the `labels: string[]` shape and note the ref-counted rationale. |
| P2 (high) | `019.../spec.md:103,132,149,159`, `plan.md:55`; `maintenance-marker.ts:25` | 7 lin / 4 models (deepseek-1/2, mimo-1/2, kimi-2, opus-1/2) | Spec/plan say 60s TTL; shipped TTL is 180s. | CONFIRMED. `maintenance-marker.ts:25` `MAINTENANCE_MARKER_TTL_MS = 180_000`. Divergence is justified and already explained in `implementation-summary.md:56` (a 60s TTL lapsed during a ~79s blocking tail phase on the first live run; phase-boundary refresh added). Canonical spec/plan never updated. | Update spec REQ-001 acceptance criteria, SC-002, §6 risk, and plan.md to 180s. |
| P2 (high) | `019.../implementation-summary.md:104`; `retry-manager.ts:1038` | 5 lin / 3 models (deepseek-1, kimi-1, opus-1/2/3) | "Known Limitations" bullet 4 frames the post-scan embedding queue as "busy-but-unprotected / follow-on"; shipped code already protects it. | CONFIRMED (with nuance). `retry-manager.ts:1038` calls `beginMaintenance('embedding-queue')`, released in `finally` at L1055; the marker module is reference-counted (`activeCount`, marker.ts:36/59/75) precisely so scan+embedding overlap holds the marker. **Honest nuance (opus-2):** protection is *per `runBackgroundJob` tick* and a tick drains only `batchSize` (L1032/1041), so multi-batch drains still have between-tick gaps — the *spirit* of the limitation is not fully eliminated, but the doc's blanket "unprotected" claim is contradicted by the code. | Rewrite the limitation to describe per-tick `embedding-queue` protection + the residual between-tick gap. |
| P2 (high) | `019.../spec.md §3`, `plan.md:55,64`; `maintenance-marker.ts:1-92` | 3 lin / 1 model (opus-1, opus-2, opus-3) | Marker writer was extracted into a new shared module `lib/storage/maintenance-marker.ts` not listed in any Files-to-Change table; docs describe it as inline in the `memory-index.ts` scan IIFE. | CONFIRMED. Module exists (92 lines), imported by `memory-index.ts:13/1502` (`beginMaintenance('index_scan')`) and `retry-manager.ts:15/1038`. Spec §3 table lists neither this module nor `retry-manager.ts`. Reasonable architecture (reusable, ref-counted, unit-testable) but untracked → an auditor following the spec cannot locate the primary shipped module. (Single-model agreement but tightly corroborated by the path/schema clusters above.) | Add `lib/storage/maintenance-marker.ts` and `lib/providers/retry-manager.ts` to the Files-to-Change table; update §3/plan prose from "inline IIFE" to "shared ref-counted module". |
| P2 (high) | `tests/launcher-maintenance-guard.vitest.ts:5-10,28-33,127-137`; `stress_test/durability/daemon-reelection-adoption-live.vitest.ts:366,430` | 2 lin / 1 model (opus-2 F004; corroborated inside opus-1 F003, opus-3 F002, mimo-2 P1-001, kimi-1 F001) | Unit-test type + fixtures and the stress harness still encode the obsolete `jobId` marker shape, not shipped `labels`. | CONFIRMED. vitest `MaintenanceMarker` type (L5-10) + `freshMarker()`/valid fixtures use `jobId: 'index-scan-1'`; harness uses `jobId: 'test'` (L366,430). **Test still passes (12/12 — re-run confirmed)** because the predicate/reader consult only `childPid`/`activeUntilMs`. So the fixtures no longer document the real contract, but there is no correctness defect. | Change fixture/type `jobId` → `labels: ['index_scan']` in both test files so they document the real on-disk shape. |
| P2 (singleton) | `maintenance-marker.ts:36-39,58-60,76-77` | 1 lin / 1 model (kimi-1 F003) | `activeLabels` is a plain array with no dedup; overlapping holders with the same label leave duplicate entries on disk until the next refresh. | CONFIRMED, cosmetic. `activeLabels.push(label)` (L60) and `splice(indexOf,...)` (L76-77) — two concurrent `index_scan` jobs would show `["index_scan","index_scan"]`. No behavioral impact (launcher ignores `labels`); only a misleading on-disk diagnostic. | Optional: dedup via a count map or only display unique labels. Low priority. |
| P2 (singleton) | `maintenance-marker.ts:75` | 1 lin / 1 model (mimo-1 F004) | `end()` silently clamps `activeCount = Math.max(0, activeCount - 1)` with no log if `end()` is over-called. | CONFIRMED, cosmetic. Harmless (marker still removed at zero), but a double-`end()` bug would be invisible. | Optional: `console.warn` when the decrement would underflow. Low priority. |
| P2 (singleton, partial) | `maintenance-marker.ts:44-51,63` | 2 lin / 2 models (mimo-2 P2-001, kimi-1 F004) | `writeMarker()` ignores the `boolean` return of `atomicWriteFile`; a persistent write failure leaves the daemon thinking it is protected (becomes reapable after TTL). | CONFIRMED-with-correction. The "unhandled rejection in the `setInterval(writeMarker)` timer" concern is a **FALSE-POSITIVE**: `atomicWriteFile` is internally try/catch'd (transaction-manager.ts:177-205) — it returns `false` and logs `console.warn`, it never throws, so the timer cannot crash the daemon. Residual valid point: a persistent failure is logged by transaction-manager but maintenance-marker.ts adds no dedicated log, and the marker silently ages out → reap. The fail-safe **direction is correct** (a daemon that cannot write its marker should be reapable). Net: very low value. | Optional: log when `atomicWriteFile` returns `false` in `writeMarker()`. Not required. |

---

## Rejected / False-Positive / Already-Resolved

| Raised by | Claim | Verdict | Reason |
|-----------|-------|---------|--------|
| `p019-mimo-2` P1-002 | "Launcher guard implementation files not found in the codebase" — predicate source invisible/un-auditable. | **FALSE-POSITIVE (search-scope artifact)** | The files exist at `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs` (located by 8 other lineages and verified here: supervision predicate at L611-640, launcher guard sites at L820-824 and L1688-1690). mimo-2 globbed only under `mcp_server/bin/` (the stale spec path) and concluded the source was missing. This collapses into the confirmed P2 path-drift finding — the source is fully auditable. |
| `p019-kimi-2` F001, `p019-opus-2` F001, `p019-mimo-1` F001, `p019-mimo-2` P1-001 | Marker schema / spec-code drift escalated to **P1**. | **DOWNGRADED to P2** | Verified zero runtime impact: `shouldAdoptDespiteProbe` (supervision.cjs:632-640) and `readMaintenanceMarker` (L615-626) validate only `childPid` (integer >0) and `activeUntilMs` (finite, unexpired) and `childLiveness === 'alive'`. They never read `jobId`/`labels`. All four P0-blocker/P1 REQs (REQ-001..004) are behaviorally satisfied; unit test 12/12 pass. Per the raising lineages' own "downgrade if no behavioral defect / spec updated" condition, these are P2 doc-accuracy items. |
| `p019-mimo-2` P2-001 (timer crash), `p019-kimi-1` F004 (silent drop) | `writeMarker` write failure crashes / silently strands the daemon. | **PARTIALLY REFUTED** (retained as low-value P2) | `atomicWriteFile` never throws (catches + warns + returns `false`, transaction-manager.ts:196-204), so no timer crash; failures are already logged at the transaction-manager layer; the marker-ages-out→reap path is the correct fail-safe. Only the (optional) marker-layer log is a real gap. |
| `p019-mimo-2` P2-002 | Module-level mutable state (`activeCount`/`refreshTimer`/`activeLabels`) risks flaky parallel tests. | **NOTED, not actionable now** | Real observation but a hypothetical: current tests deliberately exercise the launcher predicate via injected fs/now and never the marker module statics; `__resetMaintenanceMarkerForTest()` (marker.ts:87-91) exists for future direct tests. No defect today. |

---

## Remediation Outline

All confirmed items are documentation reconciliation except three optional minor code-hardening suggestions. Ordered by severity (all P2 — no P0/P1). This seeds a small doc-reconciliation remediation packet; **no code change is required for correctness**.

### Doc reconciliation (required for clean PASS; one packet, ~one editing pass)

1. **Fix stale file paths** — In `019.../spec.md` (§3 Files to Change, ~L114-120), `plan.md` (~L64-65), and `tasks.md`: rewrite `mcp_server/bin/lib/model-server-supervision.cjs` → `.opencode/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` → `.opencode/bin/mk-spec-memory-launcher.cjs`.

2. **Reconcile marker shape** — In `019.../spec.md:103,132`: change documented marker shape `{ childPid, activeUntilMs, jobId, refreshedAtIso }` → `{ childPid, activeUntilMs, labels, refreshedAtIso }` and add one line noting `labels: string[]` exists to support reference-counted overlapping maintenance sources.

3. **Reconcile TTL** — In `019.../spec.md` (REQ-001 L132, SC-002 L149, §6 risk L159, In-Scope L103) and `plan.md:55`: change `60s TTL` → `180s TTL`, citing the live ~79s blocking-tail observation already recorded in `implementation-summary.md:56`.

4. **Correct the embedding-queue limitation** — In `019.../implementation-summary.md:104` (Known Limitations bullet 4): rewrite from "busy-but-unprotected / follow-on" to "the post-scan embedding queue is marker-protected per `runBackgroundJob` tick via `beginMaintenance('embedding-queue')`; the residual gap is between ticks during a multi-batch drain."

5. **Track the extracted module + retry-manager** — In `019.../spec.md` §3 Files-to-Change table and `plan.md`: add rows for `mcp_server/lib/storage/maintenance-marker.ts` (new shared ref-counted writer module) and `mcp_server/lib/providers/retry-manager.ts` (new `beginMaintenance('embedding-queue')` call site); update §3/plan prose from "inline in the scan IIFE" to "shared reference-counted module consumed by memory-index.ts and retry-manager.ts."

6. **Align test fixtures to the real contract** — In `tests/launcher-maintenance-guard.vitest.ts` (type L5-10, fixtures L28-33,127-137) and `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` (L366,430): replace `jobId: '…'` with `labels: ['index_scan']` so fixtures document the shipped on-disk shape. (Tests pass either way; this is contract-documentation hygiene.)

### Optional code hardening (NOT required; low value)

7. **(Optional) Dedup labels** — `maintenance-marker.ts`: keep `activeLabels` unique (count map or `Set` view) so overlapping same-label holders don't show duplicates on disk. Cosmetic.

8. **(Optional) Log over-`end()`** — `maintenance-marker.ts:75`: `console.warn` when the `activeCount` decrement would underflow, to surface a double-`end()` bug. Cosmetic.

9. **(Optional) Log marker write failure** — `maintenance-marker.ts` `writeMarker()`: check the `atomicWriteFile` boolean return and log at the marker layer (transaction-manager already logs; fail-safe direction is correct). Lowest value.
