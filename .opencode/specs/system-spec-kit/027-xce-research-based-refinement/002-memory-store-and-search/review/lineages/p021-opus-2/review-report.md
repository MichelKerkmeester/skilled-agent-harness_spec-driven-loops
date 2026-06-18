# Review Report: 021-cooperative-heavy-phases (lineage p021-opus-2)

| Field | Value |
|-------|-------|
| Target | `.../002-memory-store-and-search/021-cooperative-heavy-phases` |
| Target type | spec-folder (Level 1) |
| Executor | cli-claude-code (claude-opus-4-8) |
| Iterations | 1 (fan-out lineage, maxIterations=1) |
| Verdict | **CONDITIONAL** |
| Stop reason | maxIterations reached (1) |

---

## 1. Executive Summary

**Verdict: CONDITIONAL** — `hasAdvisories: true`.

Packet 021 instruments the spec-memory reindex scan with an event-loop lag sampler and per-phase wall-clock, chunks the unbounded `trigger-embedding-backfill` whole-corpus transaction into cancellable 200-row chunks that yield between (not inside) transactions, and refreshes the maintenance marker on entry to each un-yielded tail phase. The core mechanisms are sound and the highest-risk requirement (REQ-002, the unbounded synchronous transaction) is fully and correctly implemented, with the "yield inside a transaction" hazard explicitly avoided and the partial-commit safety argument verified (idempotent upserts + per-memory-id deletes).

One P1 holds the verdict at CONDITIONAL: `runIndexScan` has **two** tail-phase execution paths, and the `timedPhase` wrapper that delivers REQ-001 (per-phase wall-clock) and REQ-003 (per-tail-phase marker refresh) is applied only to the `files.length > 0` path. The `files.length === 0` path — the common incremental-no-change background scan — runs the same four tail phases as bare calls, so the REQ-001/REQ-003 acceptance criteria are not met there and the implementation-summary's "each un-yielded tail phase refreshes the marker on entry" is inaccurate for that path.

- Active findings: **P0=0, P1=1, P2=3**
- Scope: 3 files (the full change surface of commit `372bb0f2cd`)
- Dimensions covered: correctness, security, traceability, maintainability (4/4)
- Security: no findings (no new trust boundary, no external input, hashing unchanged, log lines carry no secrets)

---

## 2. Planning Trigger

CONDITIONAL routes to **`/speckit:plan`** for a small remediation: adjudicate and close F001 (either wrap the empty-files tail phases in `timedPhase`, or record an explicit scope exemption with a sub-TTL proof). The three P2 advisories can ride along or defer to changelog. No release-blocking P0.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Status |
|----|-----|-----|-------|----------|--------|
| F001 | P1 | traceability | REQ-001/REQ-003 unmet on `files.length === 0` path: four tail phases not wrapped in `timedPhase` (no per-phase wall-clock, no per-phase marker refresh) | `memory-index.ts:788-804` (empty path) vs `:1239-1261` (main path) vs `:1507-1512` (onPhase→refresh wiring) vs `spec.md:139` (REQ-003 AC) | active |
| F002 | P2 | maintainability | "byte-identical synchronous foreground path" overstated: orphan-sweep changed from sync to `await timedPhase(...)`, adding a microtask boundary even uninstrumented (responsiveness unaffected) | `spec.md:105` vs `memory-index.ts:1239` | active |
| F003 | P2 | correctness | `result.pendingRemaining` left at 0 on cancel-during-embedding even though DB pending rows exist; a consumer reading the count on a `cancelled` result understates the backlog | `trigger-embedding-backfill.ts:275-279` | active |
| F004 | P2 | maintainability | Duplicated `isCancelled: () => ctx.isCancelled?.() ?? false` thunk at both trigger-backfill call sites | `memory-index.ts:803`, `:1257` | active |

---

## 4. Remediation Workstreams

**Lane A — Close the path divergence (F001, F004).** Wrap the `files.length === 0` tail phases (`memory-index.ts:788-790,802`) in the same `timedPhase` calls used on the main path (`:1239-1261`), and factor the shared `isCancelled` thunk to one local. One change closes both the REQ-001/REQ-003 gap and the DRY nit, and removes the structural risk of the two paths drifting further. Alternatively, if the empty-files path is deliberately exempt, record that decision in `spec.md`/`implementation-summary.md` with the sub-TTL proof.

**Lane B — Doc/result accuracy (F002, F003).** Soften the "byte-identical" claim to "behaviorally equivalent for event-loop responsiveness (one extra microtask at orphan-sweep)"; recompute `result.pendingRemaining` before the cancel-path `return` (or document that counts are undefined on `cancelled`).

---

## 5. Spec Seed

- Amend REQ-001/REQ-003 acceptance criteria OR the implementation to state which scan paths carry per-phase instrumentation and per-phase marker refresh. Today the AC reads unconditionally ("each un-yielded tail phase"), but the code satisfies it only for `files.length > 0`.
- Correct `spec.md:105` In-Scope wording: the foreground path is behaviorally equivalent, not byte-identical, after the orphan-sweep async-wrap.

---

## 6. Plan Seed

1. T-A1: Wrap orphan-sweep / enrichment-repair / near-dup-repair / trigger-backfill on the `files.length === 0` path in `timedPhase` (mirror `memory-index.ts:1239-1261`). (F001, F004)
2. T-A2: If exempting instead, add a one-paragraph scope note proving the empty-path phases are sub-180s-TTL and noting the deploy read uses force-reindex (files>0). (F001)
3. T-B1: Recompute `pendingRemaining` on the embedding-cancel branch, or annotate counts as undefined on `cancelled`. (F003)
4. T-B2: Reword the "byte-identical" In-Scope line. (F002)

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | partial | hard | REQ-002 PASS (chunk/yield/cancel, `trigger-embedding-backfill.ts:247-284`), REQ-004 PASS (no launcher diff, confirmed via `git show --stat`); REQ-001 + REQ-003 PARTIAL (empty-files path, F001) |
| checklist_evidence | core | n/a | hard | Level 1 packet, no `checklist.md`; `implementation-summary.md:88-97` verification table is self-consistent |
| feature_catalog_code | overlay | n/a | advisory | Internal daemon hardening, no catalog claim |

Unresolved gap: REQ-001/REQ-003 coverage on the `files.length === 0` path (F001).

---

## 8. Deferred Items

- F002, F003, F004 (P2 advisories) — non-blocking; bundle with the F001 fix or defer to changelog.
- Live deploy-time single-launcher lag read (SC-002) — deferred by the packet itself; the instrumentation it depends on is shipped (and, per F001, fully present on the force-reindex path the deploy check uses).
- Full vitest re-run not performed in this lineage (daemon-churn caution from the packet's own limitations); test-pass corroborated by test-file inspection + implementation-summary evidence.

---

## 9. Audit Appendix

**Coverage.** 1 iteration, 4/4 dimensions, 3/3 in-scope files. Change surface = commit `372bb0f2cd` (memory-index.ts +66/-, trigger-embedding-backfill.ts +36/-, vitest +69).

**Replay validation.** Single-iteration run; recomputed `newFindingsRatio` 0.30 and P0=0/P1=1/P2=3 match the JSONL iteration record and findings registry. Dimension coverage 4/4 stable. Stop reason `maxIterations reached` matches the synthesis_complete event. Verdict logic: 0 active P0 + 1 active P1 → CONDITIONAL (consistent; VERDICT_LOCK not triggered, no P0).

**Claim adjudication.** F001 adjudicated (`passed:true`): cited evidence re-read at `memory-index.ts:788-804`, `:1239-1261`, `:1507-1512`; counterevidence (lag sampler covers empty path; phases bounded/cooperative; 20s self-refresh) recorded and used to set finalSeverity P1 (not P0), confidence 0.82, with a concrete downgrade trigger. P2 findings require no packet.

**Quality gates.** Evidence gate: PASS (every finding has file:line). Scope gate: PASS (conclusions stay within the 3 changed files + spec docs). Coverage gate: PASS for dimensions (4/4); spec_code core protocol returns `partial` due to F001 — this is the substance of the CONDITIONAL verdict, not a gate-bypass.

**Verdict: CONDITIONAL** (1 active P1, 0 active P0; `hasAdvisories: true`).
