# Review Report — 020-maintenance-grace-background-embedding

_Lineage: p020-opus-4 · Executor: cli-claude-code (claude-opus-4-8) · 1 iteration (maxIterations cap)_

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 0 |
| Active P2 | 4 |
| Dimensions covered | 4/4 (correctness, security, traceability, maintainability) |
| Core traceability | spec_code = pass; checklist_evidence = n/a (Level 1) |
| Release readiness | converged |

The phase delivers exactly what its spec scopes: the maintenance-active marker writer is
extracted into a shared, reference-counted module (`maintenance-marker.ts`), the scan IIFE
is refactored onto it, and the post-scan background-embedding queue is wired into it after
its empty-queue guard. All four requirements (REQ-001..004) map to shipped behavior with
concrete `file:line` evidence. The load-bearing compatibility claim — "the 019 launcher
reads the marker exactly as before" — is **confirmed by source**: the launcher's
`readMaintenanceMarker` and `shouldAdoptDespiteProbe` consume only `childPid` and
`activeUntilMs`, so dropping `jobId` and adding `labels` is fully read-compatible. No
correctness, security, or traceability blocker was found. Four P2 advisories are recorded
(robustness, one doc gap, two cosmetic/observational); none gate the verdict.

Scope reviewed: `mcp_server/lib/storage/maintenance-marker.ts`,
`mcp_server/handlers/memory-index.ts` (scan IIFE), `mcp_server/lib/providers/retry-manager.ts`
(`runBackgroundJob`), `mcp_server/tests/maintenance-marker.vitest.ts`, and the launcher read
consumer `.opencode/bin/lib/model-server-supervision.cjs`.

Verification note: the marker unit test and daemon build could not be executed in this
fan-out sandbox (command approval blocked `vitest`/`npm`). This review rests on static
analysis plus the documented verification table (implementation-summary.md:84-93, which
records Build PASS, marker test PASS, scan-job/launcher-guard suites PASS, deploy PASS).

---

## 2. Planning Trigger

PASS with active P2 advisories → routes to **changelog**, not remediation planning. The
four P2 items are optional hardening/clarity follow-ups, not release blockers. The only
unverified-by-this-review claim is the live deploy confirmation (SC-002), which is by
design a deploy-time check rather than a code deliverable.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Status |
|----|-----|-----|-------|----------|--------|
| F001 | P2 | maintainability | Refcount incremented before the throwable `writeMarker()` with no rollback → a write fault can strand `activeCount` non-zero and pin the marker | `maintenance-marker.ts:58-66` | active |
| F002 | P2 | maintainability | Embedding queue is refresh-free and relies on the implicit per-`await` event-loop yield; rationale not documented at the call site | `retry-manager.ts:1036-1047` (yield via `processRetryQueue` `:903,:944,:714`) | active |
| F003 | P2 | correctness | On-disk `labels` go stale between writes because `end()` only mutates in-memory state; cosmetic — launcher ignores `labels` | `maintenance-marker.ts:72-83`; test ack `maintenance-marker.vitest.ts:92-104` | active |
| F004 | P2 | correctness | Residual unprotected window between scan `end()` and the first embedding tick when they do not overlap; daemon is idle in that gap so no in-flight work is lost | `memory-index.ts:1540`; `retry-manager.ts:1032-1038` | active |

---

## 4. Remediation Workstreams

All workstreams are **optional** (P2). Verdict is PASS regardless.

- **Lane A — Marker robustness (F001).** Increment `activeCount`/push the label only after
  a successful `writeMarker()`, or wrap the begin path in a try/catch that rolls back the
  count + label on a write fault. Lowest-effort fix; localized to `beginMaintenance`.
- **Lane B — Call-site clarity (F002).** Add a one-line comment at `retry-manager.ts:1038`
  recording that the embedding queue is intentionally refresh-free because it yields per
  `await`, so a future in-process/synchronous embedder must restore explicit refresh.
- **Lane C — Cosmetic/observational (F003, F004).** No code change needed; both are
  documented and benign. Optionally re-serialize on `end()` (F003) if operators ever inspect
  the live `labels` field.

---

## 5. Spec Seed

No spec change required for a PASS. If Lane A/B are picked up, a minimal delta to a
follow-on packet:

- Add an acceptance criterion: "`beginMaintenance` does not leak a reference count when the
  marker write fails (fault-injected `atomicWriteFile` throw leaves `activeCount` at its
  pre-call value)."
- Add a non-functional note: "The background-embedding queue stays marked via the 20s
  interval refresh only while embedding generation yields per item; an in-process synchronous
  embedder requires an explicit `refresh()` in the drain loop."

---

## 6. Plan Seed

If a hardening follow-on is opened (optional):
1. F001 — reorder `beginMaintenance` so the write precedes the count increment, or add
   rollback-on-throw; add a fault-injection unit test asserting no refcount leak.
2. F002 — document the yield-dependency at the queue call site.
3. F003 — (optional) re-serialize the pruned `labels` set on `end()` when holders remain.
Target files: `mcp_server/lib/storage/maintenance-marker.ts`,
`mcp_server/lib/providers/retry-manager.ts`, `mcp_server/tests/maintenance-marker.vitest.ts`.

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| spec_code | core | hard | pass | REQ-001 `maintenance-marker.ts:22-84`; REQ-002 `retry-manager.ts:1024-1061`; REQ-003 `maintenance-marker.ts:36-83`; REQ-004 `retry-manager.ts:1032-1034`; launcher compat `model-server-supervision.cjs:619,632-637` |
| checklist_evidence | core | hard | n/a | Level 1 folder; no `checklist.md`. Verification table at implementation-summary.md:84-93 records Build/test/deploy PASS. |
| feature_catalog_code | overlay | advisory | n/a | No catalog entry in scope |
| playbook_capability | overlay | advisory | n/a | Not applicable to this packet |

Unresolved gaps: none. All four spec requirements trace to code; no normative claim was
left unverified except the deploy-time live reindex (SC-002), which the spec itself defines
as a deploy check rather than a code deliverable.

---

## 8. Deferred Items

- **F003** (stale `labels` between writes) — deferred as cosmetic; launcher never reads the field.
- **F004** (scan/queue non-overlap gap) — deferred as observational; bounded, idle-window, drains on a later pass; consistent with documented "un-reaped, not responsive" behavior.
- **Live verification** — marker unit test + daemon build + live reindex survival not executed in this sandbox; deferred to the deploy-time check (SC-002) and the documented verification table.

---

## 9. Audit Appendix

### Iteration Table
| Run | Focus | Files | newFindingsRatio | P0/P1/P2 | Status |
|-----|-------|-------|------------------|----------|--------|
| 1 | full-breadth (4 dimensions) | 5 | 0.30 | 0/0/4 | complete |

### Convergence Replay
- Stop reason: `maxIterations` reached (config.maxIterations=1). All 4 dimensions covered;
  core `spec_code` executed (pass); no P0/P1 → no P0 override on `newFindingsRatio`.
- Replayed from JSONL: iteration record severity counts (0/0/4) and dimensionCoverage (1.0)
  agree with the `synthesis_complete` event and the findings registry. Replay consistent.
- Quality gates: Evidence (every finding carries file:line) = pass; Scope (all conclusions
  inside declared scope) = pass; Coverage (4/4 dimensions + required core protocol) = pass.

### File Coverage Matrix
| File | Dimensions exercised | Findings |
|------|----------------------|----------|
| maintenance-marker.ts | correctness, security, maintainability | F001, F003 |
| memory-index.ts (scan IIFE) | correctness, traceability | — |
| retry-manager.ts (runBackgroundJob) | correctness, maintainability | F002, F004 |
| maintenance-marker.vitest.ts | correctness (static) | — |
| model-server-supervision.cjs | traceability (read contract) | — |

### Limitations Of This Review
- No live execution (sandbox command-approval blocked `vitest`/`npm run build`). Static
  review only; verification claims taken from the packet's documented evidence table.
- The unchanged 019 launcher adopt/reap guard logic was inspected only for read-contract
  compatibility, not re-reviewed in full (out of scope per the spec).
