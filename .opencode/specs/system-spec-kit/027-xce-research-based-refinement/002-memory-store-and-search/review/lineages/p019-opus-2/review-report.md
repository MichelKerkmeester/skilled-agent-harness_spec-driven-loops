# Review Report — 019-maintenance-grace-daemon-survives-reelection

Lineage: `p019-opus-2` (fan-out) · Executor: cli-claude-code model=claude-opus-4-8 · Iterations: 1 (`maxIterations=1`) · Stop reason: maxIterations

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true` · Release readiness: `in-progress`

| Severity | Active |
|----------|--------|
| P0 | 0 |
| P1 | 1 |
| P2 | 3 |

The shipped maintenance-grace mechanism is **correct and fails safe**, and all four requirements (REQ-001..004) are implemented and verified in code: the daemon writes/refreshes/cleans up `.maintenance-active.json` (reference-counted, `unref()`'d timer, phase-boundary refresh, `finally` cleanup), the pure `shouldAdoptDespiteProbe` predicate adopts only a fresh marker naming a live child and otherwise falls through to reap, and both launcher guard sites (dead-socket respawn + stale-reclaim adopt) call it with matching marker-dir resolution. No correctness or security defect was found.

The verdict is CONDITIONAL because of **spec/code traceability drift**, not behavior: the implementation was extracted into a dedicated reference-counted module (`lib/storage/maintenance-marker.ts`) and extended to also protect the embedding queue (`retry-manager.ts`), but the 019 packet docs were not re-synced. The spec's "Files to Change" table points to non-existent `mcp_server/bin/` paths, omits the actual primary module and `retry-manager.ts`, names a `jobId` field that ships as `labels`, and states a 60s TTL that ships as 180s; the implementation-summary's "embedding queue unprotected" limitation is stale. Scope: the 019 spec folder + its shipped sources under `mcp_server/` and `.opencode/bin/`.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for a **documentation-resync fix** on the 019 packet (no code change required). F001 is the required fix (spec_code hard gate is `partial`); F002–F004 are advisory doc/test-fixture accuracy items that can ride the same resync. The shipped behavior is release-ready on its own merits; the gate is the accuracy of the traceability record.

## 3. Active Finding Registry

| ID | Sev | Category | Title | Evidence | Adjudicated |
|----|-----|----------|-------|----------|-------------|
| F001 | P1 | traceability | 019 docs diverge from shipped impl; Files-to-Change table does not resolve to shipped files | `spec.md:112-121` vs `lib/storage/maintenance-marker.ts:22-50`, `.opencode/bin/lib/model-server-supervision.cjs:609-640`, `.opencode/bin/mk-spec-memory-launcher.cjs:329-333`, `retry-manager.ts:1038` | Yes (conf 0.88) |
| F002 | P2 | traceability | impl-summary Known Limitation 4 stale: embedding queue IS marker-protected per tick | `implementation-summary.md:104` vs `retry-manager.ts:1038,1055` | — |
| F003 | P2 | traceability | Spec/plan/tasks TTL (60s) diverges from shipped 180s | `spec.md:103,132`, `plan.md` vs `maintenance-marker.ts:25` | — |
| F004 | P2 | maintainability | Predicate unit-test fixture encodes obsolete `jobId` marker shape, not shipped `labels` | `tests/launcher-maintenance-guard.vitest.ts:5-10,28-33,127-137` vs `maintenance-marker.ts:44-50` | — |

**F001 detail** — The spec (§3 Files-to-Change, §Phase-Context, §Architecture) and `plan.md` describe an *inline* marker writer in `handlers/memory-index.ts` with a `{ childPid, activeUntilMs, jobId, refreshedAtIso }` shape. Shipped: a dedicated reference-counted module `lib/storage/maintenance-marker.ts` (imported by both `memory-index.ts:13` and `retry-manager.ts:15`), marker shape `{ childPid, activeUntilMs, labels, refreshedAtIso }`. The table lists `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` — neither path exists; both ship at `.opencode/bin/...`. The table also omits `lib/providers/retry-manager.ts` (a second `beginMaintenance` call site). Net: every requirement is met, but the spec's file map cannot guide an auditor to the shipped code, so `spec_code` is `partial`.

**F002 detail** — `implementation-summary.md:104` frames embedding-queue marker coverage as the unfinished follow-on ("that queue is busy-but-unprotected"). `retry-manager.ts:1038` already calls `beginMaintenance('embedding-queue')` (released in `finally` at `:1055`), so each background-drain tick is protected. Honest caveat: protection is per `runBackgroundJob` tick and a tick drains only `batchSize`, so a multi-batch drain still has unprotected windows *between* ticks — the limitation's spirit ("not yet re-election-proof end to end") is not fully eliminated, but its literal claim that no protection exists is contradicted by the code.

## 4. Remediation Workstreams

**WS-1 — Doc resync (required, F001; advisory F002–F004 ride along).** Owner: 019 packet maintainer.
- Update `spec.md` Files-to-Change to list `lib/storage/maintenance-marker.ts` and `lib/providers/retry-manager.ts`; correct the `.cjs` paths to `.opencode/bin/...`.
- Update §3/§Architecture prose and the marker-shape description (`jobId` → `labels[]`, reference-counted module, two call sites).
- Update the TTL in spec/plan/tasks to 180s (F003), citing the impl-summary rationale.
- Rewrite implementation-summary Known Limitation 4 to describe per-tick embedding-queue protection + the residual between-tick gap (F002).
- Align `tests/launcher-maintenance-guard.vitest.ts` fixtures to the `labels` shape (F004).

## 5. Spec Seed

> The 019 spec must describe the *shipped* design: a single reference-counted maintenance marker module (`lib/storage/maintenance-marker.ts`) writing `{ childPid, activeUntilMs, labels, refreshedAtIso }` with a 180s TTL and a 20s + phase-boundary refresh, consumed by `beginMaintenance(label)` at two sites — the background index scan (`index_scan`) and the background-embedding queue (`embedding-queue`). The launcher predicate ships at `.opencode/bin/lib/model-server-supervision.cjs`. The Files-to-Change table and architecture prose must resolve to these shipped paths.

## 6. Plan Seed

1. Edit `spec.md` Files-to-Change table + §3/§Architecture + REQ-001 marker shape/TTL to shipped reality (F001/F003).
2. Edit `plan.md` / `tasks.md` TTL and module references (F001/F003).
3. Rewrite `implementation-summary.md` Known Limitation 4 (F002).
4. Update `launcher-maintenance-guard.vitest.ts` fixture to `labels` (F004); re-run the vitest suite.
5. Re-run `validate.sh <spec-folder> --strict`; confirm exit 0.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core/hard | partial | REQ-001..004 implemented + working; file map and descriptive fields drift from shipped code (F001/F002/F003) |
| `checklist_evidence` | core/hard | n/a (skipped) | Level 1 spec folder — no checklist.md required |
| overlay protocols | advisory | n/a | None applicable to this spec-folder target |

Unresolved gap: the hard `spec_code` gate is `partial` until the F001 doc resync lands.

## 8. Deferred Items

- F002, F003, F004 (P2 advisories) — bundle into the WS-1 doc resync; none block release of the shipped code.
- **Operator-only verification**: the implementation-summary's "full force reindex completed in 330s, pid unchanged" is a live deploy-time observation and cannot be re-verified by static review — carried as inferred, to be confirmed at deploy.
- **Residual runtime question (follow-on, not a finding)**: quantify the between-tick unprotected window during a multi-batch embedding drain (F002 caveat); if material, extend marker coverage across the whole drain.

## 9. Audit Appendix

- **Coverage**: 4/4 dimensions in 1 iteration (correctness, security, traceability, maintainability); 8 files read at shipped locations.
- **Replay validation**: recomputed from JSONL — 1 iteration record, `newFindingsRatio=0.50`, dimensionCoverage=4, P0=0/P1=1/P2=3; recorded `synthesis_complete` verdict CONDITIONAL with `stopReason=maxIterations` agrees. PASS.
- **Adversarial replay (F001)**: counterevidence sought — confirmed `mcp_server/bin/` `.cjs` paths return ENOENT and the real files sit at `.opencode/bin/`; confirmed `maintenance-marker.ts` exists and is imported by both call sites; confirmed the predicate ignores the renamed field, so the `jobId`→`labels` rename is a doc/test accuracy issue, not a runtime defect. Severity held at P1 (hard-gate `spec_code` partial).
- **Ruled out (no finding)**: reference-count leak (idempotent `end()` + TTL expiry + alive gate), marker write/read race (`atomicWriteFile` + corrupt→null→reap), refresh timer pinning the loop (`unref()`), marker-dir divergence (shared cwd-relative env resolution), foreign-pid pin (childPid + liveness gate).
- **Verdict logic**: 0 active P0, ≥1 active P1 → CONDITIONAL; P2 advisories present → `hasAdvisories=true`.
- **Convergence**: not reached by composite score; stopped at `maxIterations=1` (single-pass fan-out lineage by design).

---

Review verdict: CONDITIONAL
