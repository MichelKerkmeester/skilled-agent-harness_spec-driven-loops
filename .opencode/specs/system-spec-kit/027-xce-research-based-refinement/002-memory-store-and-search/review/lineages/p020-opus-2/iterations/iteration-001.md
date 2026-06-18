# Iteration 001 — All Dimensions (single-pass fan-out)

**Lineage**: p020-opus-2 | **Executor**: cli-claude-code model=claude-opus-4-8
**Target**: `020-maintenance-grace-background-embedding` (spec-folder, Level 1)
**Focus**: correctness + security + traceability + maintainability (one pass, `config.maxIterations=1`)

---

## Scope reviewed

| File | What it does in this phase |
|------|----------------------------|
| `mcp_server/lib/storage/maintenance-marker.ts` | New shared, reference-counted marker module |
| `mcp_server/handlers/memory-index.ts` (≈1496-1543) | Scan IIFE refactored onto `beginMaintenance('index_scan')` |
| `mcp_server/lib/providers/retry-manager.ts` (≈1012-1062) | `runBackgroundJob` wired into `beginMaintenance('embedding-queue')` |
| `mcp_server/tests/maintenance-marker.vitest.ts` | New unit test (5 cases) |
| `bin/lib/model-server-supervision.cjs` (≈609-639) | Launcher marker reader + adopt guard (consumer parity) |
| `bin/mk-spec-memory-launcher.cjs` (≈329, 820-822) | Launcher adopt-guard call sites + dir resolution (consumer parity) |

---

## Correctness

The reference-counted module is sound:

- `beginMaintenance(label)` increments `activeCount`, pushes the label, writes the marker, and lazily arms a single unref'd 20s refresh interval `[SOURCE: maintenance-marker.ts:58-66]`.
- `end()` is idempotent via a per-handle `ended` flag, floors the count with `Math.max(0, …)`, splices its label, and only at count 0 clears the interval and removes the file `[SOURCE: maintenance-marker.ts:72-82]`. Two `end()` calls remove the file once and never throw (covered by the test at `maintenance-marker.vitest.ts:111-121`).
- `refresh()` is guarded by `!ended && activeCount > 0` so a stale handle cannot rewrite the file `[SOURCE: maintenance-marker.ts:69]`.

Idle-tick guard (REQ-004) is correct: `beginMaintenance('embedding-queue')` is placed AFTER the `stats.queue_size === 0` early return, so a tick with no pending rows never creates a handle and never writes a marker `[SOURCE: retry-manager.ts:1032-1038]`. The handle is released on every exit path via `maintenanceHandle?.end()` in the `finally`, a safe no-op when the empty-queue path left it null `[SOURCE: retry-manager.ts:1052-1056]`.

Scan path (REQ preserved): the scan refreshes the marker at each phase boundary via `onPhase → maintenance.refresh()`, which is what keeps a long synchronous tail phase (that cannot fire the interval timer) from letting the TTL lapse, and `end()`s in a `finally` covering complete/cancelled/failed/thrown `[SOURCE: memory-index.ts:1502-1541]`.

**Per-tick marker scope — examined and ruled NOT a defect.** The embedding queue holds the marker only for the duration of a tick that has work, then removes it at `end()`. Between ticks the marker is absent. This is correct: the launcher only adopts-instead-of-reaps when the daemon *fails its liveness probe* (`shouldAdoptDespiteProbe` requires a fresh marker AND `childLiveness === 'alive'`) `[SOURCE: model-server-supervision.cjs:632-638]`. Between ticks the daemon is responsive and passes the probe, so it is never reaped-as-wedged there; the marker is only needed while a tick is actively (and possibly unresponsively) draining. End-to-end survival holds.

## Security

No new trust-boundary or exposure risk. The marker is written via `atomicWriteFile` into `DATABASE_DIR` (a trusted, daemon-owned path) and contains only `childPid`, a TTL, fixed internal label strings (`'index_scan'`, `'embedding-queue'`), and a timestamp — no secrets, no user-controlled input, no injection surface `[SOURCE: maintenance-marker.ts:44-51]`. Labels are compile-time constants, not request data. No P0/P1.

## Traceability (spec_code — core, hard gate: PASS)

| Item | Verdict | Evidence |
|------|---------|----------|
| REQ-001 shared reference-counted module, `{refresh(),end()}`, present while ≥1 holder, removed at 0, idempotent `end()`, 180s TTL / 20s refresh | PASS | `maintenance-marker.ts:25-26, 58-83` |
| REQ-002 embedding queue protected — `beginMaintenance('embedding-queue')` only after empty-queue guard, `end()` in existing `finally` | PASS | `retry-manager.ts:1032-1038, 1052-1056` |
| REQ-003 scan + queue overlap without clobbering (ref counting) | PASS | `maintenance-marker.ts:59,75-81`; test `maintenance-marker.vitest.ts:82-109` |
| REQ-004 idle tick never marks | PASS | `retry-manager.ts:1032-1038` |
| SC-001 marker unit test + scan-job/launcher-guard suites pass | PASS (documented, not re-run) | test file present & contract-complete `maintenance-marker.vitest.ts:68-154`; impl-summary records build+suites PASS. Live re-execution approval-gated in this lineage. |
| SC-002 full live reindex + post-scan embedding burst survives | N/A (deploy-time) | spec §5 marks this the deploy verification, not a code deliverable |

**Consumer-contract parity (verified):** the launcher reader validates only `childPid` (int>0) and `activeUntilMs` (finite) `[SOURCE: model-server-supervision.cjs:615-625]`; both are still written. Marker-dir resolution agrees on both sides — writer uses `DATABASE_DIR` (mirrors `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`) `[SOURCE: core/config.ts:64-103]` and the launcher's `maintenanceMarkerDir()` mirrors the identical precedence `[SOURCE: mk-spec-memory-launcher.cjs:329-337]`. The feature is wired correctly end to end.

`checklist_evidence` (core): SKIPPED — no `checklist.md` (Level 1). Overlay protocols `skill_agent`/`agent_cross_runtime`/`feature_catalog_code`/`playbook_capability`: N/A for this spec-folder target.

## Maintainability

Code reads cleanly with durable WHY comments (TTL margin rationale, idle-tick rationale, finally-release rationale). The test-only reset export is appropriately fenced. Module-global mutable state (`activeCount`/`refreshTimer`/`activeLabels`) is acceptable for a single-process daemon and is documented. No dead code, no unresolved TODOs in scope.

---

## Findings

### F001 — P2 — docs-vs-code-drift — "schema unchanged" claim is overstated
`[SOURCE: spec.md:108 / implementation-summary.md:78]` The spec ("the marker schema … unchanged") and impl-summary ("marker file, schema, TTL, and dir resolution are reused exactly") state the schema is unchanged, but the writer payload actually changed: 019's inline writer emitted `jobId`; the new writer emits `labels: string[]` and drops `jobId` `[SOURCE: maintenance-marker.ts:44-51]`. This is consumer-compatible — the launcher reads only `childPid` + `activeUntilMs` — so behavior is unaffected, but the "schema unchanged" wording is inaccurate. Recommend rewording to "the launcher-read fields (`childPid`, `activeUntilMs`) and the file/TTL/dir are unchanged; the payload's auxiliary fields changed (`jobId` → `labels`)".

### F002 — P2 — correctness — embedding queue has no explicit refresh()
`[SOURCE: retry-manager.ts:1038]` Unlike the scan (which calls `maintenance.refresh()` at each phase boundary), the embedding tick calls `beginMaintenance` once and never refreshes explicitly. Marker freshness during a long batch therefore depends on the 180s TTL plus the 20s interval timer — and that timer only fires if the batch yields to the event loop. For the I/O-bound embedding path (per-item async provider calls) this holds in practice, and the impl-summary's Known Limitations already flags the responsiveness gap and notes per-tick re-marking. Advisory: document the "embedding tick relies on event-loop yields for refresh" assumption, or add a per-item/periodic `refresh()` if any synchronous embedding phase could approach the 180s TTL.

### F003 — P2 — maintainability/observability — on-disk labels go stale until next write
`[SOURCE: maintenance-marker.ts:72-83]` `end()` decrements the in-memory ref count but does not re-serialize the file; the on-disk `labels` array only updates on the next `begin`/`refresh`/timer write. So after one of two holders ends, the on-disk marker can still list the ended holder's label until the next write. The launcher ignores `labels`, so this is purely cosmetic/observability — and the unit test explicitly documents the behavior (`maintenance-marker.vitest.ts:93-104`). Advisory only.

---

## Adversarial self-check

No P0/P1 findings to replay. The one correctness-adjacent concern (per-tick marker gap, F-candidate) was actively refuted by reading the launcher adopt guard: protection is only required while the probe fails, and the daemon is probe-responsive between ticks — so the gap is not a survival hole. Downgraded from a candidate P1 to "not a finding."

## Convergence

`config.maxIterations=1` reached after one all-dimension pass. Dimension coverage 4/4. Core hard gate `spec_code` PASS. No P0 (release not blocking), no P1 (not conditional). Evidence/scope/coverage gates pass. Verdict locks to PASS with `hasAdvisories=true` (3 × P2).

Review verdict: PASS
