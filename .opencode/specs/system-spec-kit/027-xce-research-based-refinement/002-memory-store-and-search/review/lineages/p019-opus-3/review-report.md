# Review Report — 019-maintenance-grace-daemon-survives-reelection (lineage p019-opus-3)

Executor: cli-claude-code (claude-opus-4-8) · Mode: review · Iterations: 1 · Lineage: p019-opus-3

---

## 1. Executive Summary

**Verdict: PASS** (hasAdvisories: true — 4 × P2)

Phase 019 adds a daemon-written `.maintenance-active.json` marker and launcher adopt/refuse-respawn
guards so a busy-but-healthy daemon (mid background scan) is adopted rather than reaped+respawned when
a competing launcher's liveness probe times out during a CPU block. The implementation is **correct and
secure**: the pure adopt predicate fails safe toward reaping on every degenerate input, both launcher
guard sites are wired and evaluated before any respawn lock so a bail unwinds nothing, the reference-
counted marker module is race-free under Node's single-threaded loop, and marker-dir resolution parity
between daemon and launcher (REQ-004) is confirmed both statically and by the isolated harness. All four
spec requirements (REQ-001..004) resolve to shipped behavior.

No P0 or P1 findings. Four P2 advisories, all documentation/traceability drift: the impl-summary's
"embedding queue unprotected" limitation is contradicted by shipped code (the queue *is* protected), the
documented marker schema (`jobId`) does not match the shipped field (`labels`), the spec's
Files-to-Change table has wrong paths and omits two changed files, and the plan describes an inline
writer that shipped as a shared module.

- Active P0: 0 · Active P1: 0 · Active P2: 4
- Scope: spec folder `019-maintenance-grace-daemon-survives-reelection` (3 TS sources, 2 CJS sources, 1 config, 2 tests)
- Convergence: maxIterations(1) reached; all 4 dimensions covered single-pass; no P0/P1.

---

## 2. Planning Trigger

**PASS → `/create:changelog`.** No active P0/P1, so the code is release-ready and routes to changelog
rather than remediation planning. The four P2 advisories are documentation reconciliation that can be
folded into the changelog/closeout edit; they do not gate the release. (Note: the live end-to-end
reindex remains the deploy-time confirmation per spec §3 — outside code review scope.)

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P2 | traceability | impl-summary "embedding queue unprotected" contradicted by shipped code | `retry-manager.ts:1038` + `maintenance-marker.ts:9-14,58-83` vs `implementation-summary.md:104` | 1/1 | active |
| F002 | P2 | traceability | Marker schema drift: docs/tests say `jobId`, writer emits `labels` | `maintenance-marker.ts:44-50`, `dist/lib/storage/maintenance-marker.js:34` vs `spec.md:103`, `impl-summary.md:56`, `launcher-maintenance-guard.vitest.ts:8,32` | 1/1 | active |
| F003 | P2 | traceability | spec Files-to-Change paths inaccurate + incomplete | `spec.md:114-120` vs actual `.opencode/bin/...`; omits `maintenance-marker.ts` + `retry-manager.ts` | 1/1 | active |
| F004 | P2 | maintainability | Architecture drift: plan describes inline writer, shipped as shared module | `plan.md:55` vs `maintenance-marker.ts` (consumed by memory-index.ts:1502 + retry-manager.ts:1038) | 1/1 | active |

---

## 4. Remediation Workstreams

**Lane A — Documentation reconciliation (advisory, single edit pass).** All four findings are doc edits
to the same packet; group them.
- F001: Update `implementation-summary.md` Known Limitations to state the background-embedding queue is
  now covered by the reference-counted marker (or, if unintended, record the scope addition in spec §3).
- F002: Replace `jobId` with `labels` in spec.md:103, plan.md:55, impl-summary.md:56, and the two test
  fixtures (`launcher-maintenance-guard.vitest.ts`, `daemon-reelection-adoption-live.vitest.ts`).
- F003: Correct spec §3 Files-to-Change paths to `.opencode/bin/...` and add the two omitted files
  (`lib/storage/maintenance-marker.ts`, `lib/providers/retry-manager.ts`).
- F004: Add a one-line plan note that the writer ships as the shared `maintenance-marker.ts` module.

No code lane — correctness and security require no changes.

---

## 5. Spec Seed

Minimal spec deltas (documentation only):
- spec §3 Files-to-Change: fix root (`mcp_server/bin/` → `.opencode/bin/`), add `lib/storage/maintenance-marker.ts` and `lib/providers/retry-manager.ts`. (F003)
- spec §3 In-Scope: marker fields are `{ childPid, activeUntilMs, labels, refreshedAtIso }`; TTL 180s (the 60s figure is superseded — see impl-summary.md:56). (F002)
- spec §3 Out-of-Scope / Scope Boundary: reconcile the embedding-queue coverage statement — the shipped marker is reference-counted and covers the embedding queue (`retry-manager.ts:1038`). (F001)

---

## 6. Plan Seed

Action-ready follow-up tasks (all advisory, no code):
1. Edit `implementation-summary.md:104` limitation #4 to reflect embedding-queue coverage. (F001)
2. Global `jobId` → `labels` rename across spec.md, plan.md, impl-summary.md, and both test fixtures. (F002)
3. Rewrite spec §3 Files-to-Change table with correct paths + 2 added files. (F003)
4. Add plan.md §3 note: writer extracted to `lib/storage/maintenance-marker.ts` (reference-counted, testable). (F004)

---

## 7. Traceability Status

### Core (hard)
- **spec_code — partial.** All four acceptance criteria resolve to correct shipped behavior:
  - REQ-001 (advertise live scan, 20s refresh, TTL, removed on exit): PASS — `maintenance-marker.ts:61,63,78-81`, `memory-index.ts:1502,1510`.
  - REQ-002 (adopt at both guard sites): PASS — `mk-spec-memory-launcher.cjs:820-825, 1688-1694`.
  - REQ-003 (fail-safe toward reaping): PASS — `model-server-supervision.cjs:632-640`, all 7 branches unit-tested.
  - REQ-004 (identical marker-dir precedence): PASS — `config.ts:67-89` vs `launcher:329-333`; harness-confirmed.
  - Partial only on descriptive metadata (F001-F003). No normative requirement contradicted → hard gate not failed.
- **checklist_evidence — N/A.** Level 1 folder, no checklist.md.

### Overlay (advisory)
- **feature_catalog_code — N/A.** No catalog entry for this daemon-internal fix.

---

## 8. Deferred Items

- All four findings (F001-F004) are advisory P2 documentation drift; deferrable to the changelog/closeout
  edit. None blocks release.
- Live end-to-end reindex completion across the post-scan embedding burst remains the deploy-time check
  (spec §3, impl-summary.md:104). Out of scope for this code review; note that F001 indicates the
  embedding-queue protection that limitation calls "follow-on" is already shipped.

---

## 9. Audit Appendix

### Iteration table
| Run | Focus | Dimensions | Files | newFindingsRatio | P0/P1/P2 | Status |
|-----|-------|-----------|-------|------------------|----------|--------|
| 1 | full single-pass | 4 | 8 + 1 dist + 4 docs | 0.40 | 0/0/4 | complete |

### Convergence replay
Recomputed from JSONL: 1 iteration record, newFindingsRatio 0.40, P0 override not triggered (0 new P0),
dimension coverage 4/4, stop reason = maxIterations(1). Replayed verdict PASS matches the recorded
`synthesis_complete` event. Replay consistent.

### File coverage matrix
maintenance-marker.ts (writer, full) · memory-index.ts (scan IIFE) · retry-manager.ts (embedding job) ·
config.ts (DB-dir resolution) · model-server-supervision.cjs (predicate, full) ·
mk-spec-memory-launcher.cjs (both guards) · launcher-maintenance-guard.vitest.ts (predicate+reader) ·
daemon-reelection-adoption-live.vitest.ts (adopt + stale negative control).

### Dimension breakdown
- Correctness: PASS — predicate + guards correct; refcount module race-free.
- Security: PASS — advisory read-only marker, fail-safe JSON parse, DB-dir boundary-constrained.
- Traceability: PARTIAL — F001-F003 doc drift; all REQs resolve.
- Maintainability: PASS w/ advisory — F004 arch drift; code otherwise self-documenting.

### Verification notes
`node --check` was not independently re-run (read-only sandbox permission-blocked). Corroborating build
evidence: shipped `dist/lib/storage/maintenance-marker.js` matches the TS source; the unit test `require`s
the launcher `.cjs` without load error; impl-summary.md:88-93 records build exit 0 + node --check OK +
unit/harness PASS + a live 330s reindex that survived contention.

---

Review verdict: PASS
