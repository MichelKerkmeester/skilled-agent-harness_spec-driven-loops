# Review Report — 021-cooperative-heavy-phases (lineage p021-opus-3)

**Target:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases`
**Executor:** cli-claude-code / claude-opus-4-8 · **Iterations:** 1 (fan-out single pass) · **Session:** fanout-p021-opus-3-1781716627766-f4z8n0
**Verdict:** **PASS** (hasAdvisories: true) · **Release-readiness:** converged

---

## 1. Executive Summary

The 021 packet hardens the reindex scan so the daemon stays *responsive* (not merely un-reaped)
through its heavy tail phases. Three changes were reviewed against commit `372bb0f2cd`:
(1) an event-loop lag sampler plus per-phase wall-clock timing, gated to the background path;
(2) the trigger-embedding-backfill whole-corpus transaction chunked into 200-row transactions that
yield between chunks and honor an `isCancelled` signal; (3) a maintenance-marker refresh on entry to
each un-yielded tail phase via `timedPhase`→`onPhase`→`maintenance.refresh()`.

The implementation is correct, transaction-safe, well-tested, and comment-hygiene clean. All four
P0/P1 requirements (REQ-001..004) resolve to shipped code. **No P0 or P1 findings.** Two P2
advisories are recorded (one documentation-accuracy, one cancel-path observation). Verdict is PASS
with advisories.

- Active P0: 0 · Active P1: 0 · Active P2: 2
- Scope: 3 source/test files; observation-only; default-off feature flag unchanged.
- Dimension coverage: 4/4. Core traceability protocols: both pass. Overlays: N/A.

## 2. Planning Trigger

PASS with no P0/P1 → routes to **`/create:changelog`**, not planning. The two P2 advisories are
optional follow-ups (a one-word spec wording fix and an optional cancel-path doc note); neither
requires a remediation plan. The packet's own deploy-time check (SC-002 live single-launcher lag
read) remains the one open operational follow-up, already tracked in the packet as deploy-gated.

## 3. Active Finding Registry

| ID | Sev | Category | Location | Summary |
|----|-----|----------|----------|---------|
| F001 | P2 | docs-vs-code-drift | `mcp_server/handlers/memory-index.ts:1239` | "Byte-identical foreground path" (spec §3 / plan §2) is imprecise: `runGlobalOrphanSweep()` went from a synchronous unawaited call to `await timedPhase('orphan-sweep', …)`, adding one microtask boundary on the foreground path. `runIndexScan` is already async, so this is behaviorally inert for correctness — only the "byte-identical" wording is literally inaccurate. |
| F002 | P2 | correctness (edge case) | `mcp_server/lib/search/trigger-embedding-backfill.ts:247-259` | Cancel *during* phrase-sync commits chunk rows but returns `readyRows/pendingRows/failedRows = 0`, so the caller's `triggerBackfillChangedRows` predicate is false and no statediff/invalidation action is emitted for those writes. Acceptable under the documented "next scan reconciles" design (the rows are `pending` and inert until embedded), but an undocumented asymmetry on the cancel path. |

No findings were downgraded; no P0 adjudication packets were required (none asserted).

## 4. Remediation Workstreams

All optional (P2):

- **Docs accuracy (F001):** soften the "byte-identical foreground path" wording in `spec.md` §3 and `plan.md` §2 to "behaviorally unchanged (one added microtask boundary on the foreground orphan-sweep call)." ~1 line each.
- **Cancel-path note (F002):** add a one-line code comment near `trigger-embedding-backfill.ts:247` noting that cancel-committed chunk rows are intentionally not surfaced via `triggerBackfillChangedRows` and are reconciled by the next scan. Optional.

## 5. Spec Seed

No spec delta required for behavior. Optional editorial: replace the literal "byte-identical"
claim with "behaviorally unchanged" in the 021 spec/plan to keep the normative claim precise.

## 6. Plan Seed

No remediation plan needed (PASS). If the two P2 advisories are actioned, they are a single
trivial docs/comment commit; no new tasks, tests, or build changes.

## 7. Traceability Status

### Core (hard)
- **`spec_code` — PASS.** REQ-001 (lag sampler + per-phase timing, gated): `memory-index.ts:501,513-525,522,1239,1480`. REQ-002 (chunked/cancellable backfill + cache-hit yield): `trigger-embedding-backfill.ts:55,247-259,249,276,282`. REQ-003 (per-tail-phase marker refresh): `timedPhase` wraps 4 phases (`:1239,1248,1257,1262`); consumer fires `maintenance.refresh()` (`:1505-1511`). REQ-004 (launcher no-change): documented investigation; no launcher diff in the commit — accepted as documented, not independently re-derived.
- **`checklist_evidence` — PASS.** Level 1 packet (no `checklist.md` required). tasks.md T001-T012 reconcile to shipped code, tests, and the read-only launcher investigation. `implementation-summary.md` Verification table records typecheck PASS, trigger-backfill unit 6/6, scan-job suite PASS, adoption harness 6/6.

### Overlay (advisory)
- `feature_catalog_code`: N/A — internal daemon hardening, no catalog claims.
- `playbook_capability`: N/A — no playbook scenarios.

### Unresolved gaps
- None. SC-002 (live single-launcher deploy lag read) is deploy-gated by design, with an isolated-clone proxy already recorded (max lag 634ms, `fts==memory_index` 20001==20001, pid unchanged).

## 8. Deferred Items

- **F001, F002** — P2 advisories; defer or action as a trivial docs/comment commit.
- **SC-002 live read** — deploy-time confirmation, not a code deliverable; tracked in the packet.
- **Independent typecheck/test re-run** — build commands require interactive approval in this sandboxed lineage and were not re-run here. SC-001 is corroborated by the up-to-date `dist/` output (which `tsc --build` produced from the new source) plus the packet's recorded exit-0 evidence.

## 9. Audit Appendix

- **Coverage:** 4/4 dimensions in one breadth iteration; 3/3 files read directly; both core traceability protocols executed; resource-map coverage gate skipped (`resource-map.md` absent).
- **Adversarial replay:** no P0 asserted → no P0 replay required. F002 alternative explanation (gate the action on `phrasesSeen`) considered and rejected as an out-of-scope design change. Both P2 findings re-read at cited file:line.
- **Convergence replay:** single iteration, `newFindingsRatio = 0.0`, no P0/P1; stop on maxIterations=1 with full coverage. Recorded `synthesis_complete` event matches: verdict PASS, P0/P1/P2 = 0/0/2, dimensionCoverage 1.0.
- **Confirmed vs inferred:** all code-behavior claims are confirmed by direct read at cited file:line. The launcher "no-change correctness" (REQ-004) is accepted from the packet's documented investigation, not independently re-derived. SC-001 live re-run is inferred from artifact state (`dist/`) rather than executed here.
- **Most-likely-wrong claim:** that the foreground microtask boundary (F001) is fully inert — it is inert for correctness, but if any caller depended on synchronous completion of orphan-sweep within the same tick (none found), that assumption could break.

---

Review verdict: PASS
