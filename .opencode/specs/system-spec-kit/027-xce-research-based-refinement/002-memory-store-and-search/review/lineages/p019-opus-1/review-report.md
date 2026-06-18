# Review Report — 019-maintenance-grace-daemon-survives-reelection

Lineage `fanout-p019-opus-1` · executor `cli-claude-code` model `claude-opus-4-8` · 1 iteration (maxIterations=1) · observation-only.

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`). Active findings: **0 P0 · 0 P1 · 5 P2**. Release readiness: **converged**.

The maintenance-grace fix is correct and well-built. The daemon advertises a live background scan through a reference-counted `.maintenance-active.json` marker (180s TTL, 20s interval refresh plus per-phase-boundary refresh), and both launcher reap paths — the dead-socket respawn path and the stale-reclaim adopt path — read the marker through a pure, fail-safe predicate and adopt a busy-but-healthy daemon instead of reaping it. All four normative requirements (REQ-001..004) resolve to shipped behavior, the predicate fails safe toward reaping on every non-`alive`/expired/mismatched case, and the unit + isolated-harness tests assert the adopt case and the stale-marker negative control.

Every finding is **documentation/traceability drift** between the packet docs and the (in two places more complete) shipped code. None blocks the verdict. The most consequential, F005, is that the implementation-summary lists the post-scan embedding-queue protection as an *open* follow-on, while the code already implements it.

Scope reviewed: 3 in-scope source files + the extracted marker module + an adjacent protected call site + `core/config.ts` (parity) + 2 test files.

## 2. Planning Trigger

PASS with P2 advisories → the follow-up is **`/create:changelog`** plus a small **doc-reconciliation pass** (not a remediation plan). No code change is required by this review. The doc reconciliation is the only actionable lane and is optional from a behavior standpoint.

## 3. Active Finding Registry

| ID | Sev | Category | Finding | Evidence |
|----|-----|----------|---------|----------|
| F001 | P2 | traceability | spec.md §3 / plan.md / tasks.md name `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`; the real files are repo-root `.opencode/bin/lib/...` and `.opencode/bin/...`. No `mcp_server/bin/` exists. | spec.md:116-120; plan.md:64-65; `.opencode/bin/mk-spec-memory-launcher.cjs` |
| F002 | P2 | traceability | The marker writer was extracted into a new module `lib/storage/maintenance-marker.ts` (`beginMaintenance`/`MaintenanceMarkerHandle`, ref-counted). spec/plan describe it as inline in the scan IIFE and never list the module in "Files to Change". | plan.md:54-55,74; lib/storage/maintenance-marker.ts:1-92; handlers/memory-index.ts:13 |
| F003 | P2 | traceability | Marker schema drift: docs say `{ childPid, activeUntilMs, jobId, refreshedAtIso }`; writer emits `{ childPid, activeUntilMs, labels[], refreshedAtIso }`. Unit-test fixtures still encode `jobId`. Behavior unaffected (predicate reads neither). | spec.md:103; lib/storage/maintenance-marker.ts:44-50; tests/launcher-maintenance-guard.vitest.ts:28-33 |
| F004 | P2 | traceability | REQ-001 acceptance criterion + spec §3 say "60s TTL"; shipped TTL is 180s. Raised after a live run (60s lapsed during a ~79s tail phase) — documented in the summary, but spec.md/REQ-001 not updated. Requirement intent met. | spec.md:103,132; lib/storage/maintenance-marker.ts:25; implementation-summary.md:56 |
| F005 | P2 | traceability | implementation-summary "Known Limitations" frames the post-scan embedding queue as "busy-but-unprotected" and an open follow-on. The code already protects it: `retry-manager.ts:1038` calls `beginMaintenance('embedding-queue')`, and the marker is reference-counted to span scan+embedding. Stale limitation. | implementation-summary.md:104; lib/providers/retry-manager.ts:1022-1061; lib/storage/maintenance-marker.ts:10-14 |

## 4. Remediation Workstreams

**WS-1 — Doc reconciliation (optional, doc-only, no behavior change).**
- Fix the `mcp_server/bin/*` paths to `.opencode/bin/*` in spec.md/plan.md/tasks.md (F001).
- Add `lib/storage/maintenance-marker.ts` (and `lib/providers/retry-manager.ts`) to the packet's affected-surfaces, noting the writer was extracted into a reusable ref-counted module (F002).
- Update the marker schema in spec/plan to `labels[]`, and align the test fixtures' `jobId` field (F003).
- Correct REQ-001's "60s TTL" to 180s with the rationale already captured in the summary (F004).
- Rewrite Known-Limitations bullet 4: the embedding-queue protection shipped; reframe the residual gap as "cooperative-yield for the blocking tail phase" rather than "marker does not cover the queue" (F005).

There is no correctness/security/maintainability remediation workstream — none was found.

## 5. Spec Seed

> Doc-only amendment to 019: reconcile the spec/plan/tasks/summary with the shipped implementation — correct file paths to `.opencode/bin/*`, register the extracted `lib/storage/maintenance-marker.ts` module, change the marker schema field from `jobId` to `labels[]`, update REQ-001's TTL from 60s to 180s, and move the embedding-queue protection from "open follow-on" to "shipped" (retry-manager.ts ref-counted marker), leaving "make the blocking tail phase cooperative" as the true remaining follow-on.

## 6. Plan Seed

1. Edit spec.md §3 Files-to-Change paths (`mcp_server/bin/` → `.opencode/bin/`) and REQ-001 TTL (60s → 180s); mirror in plan.md/tasks.md.
2. Add `lib/storage/maintenance-marker.ts` + `lib/providers/retry-manager.ts` to plan.md "Affected Surfaces" with a one-line note on the ref-counted extraction.
3. Change documented marker schema field `jobId` → `labels[]`; update `launcher-maintenance-guard.vitest.ts` fixtures + the `MaintenanceMarker` type to match (cosmetic; predicate untouched).
4. Rewrite implementation-summary Known-Limitations bullet 4 (embedding queue protected; residual = cooperative-yield for the tail phase).
5. Re-run `validate.sh <spec-folder> --strict` after the doc edits.

## 7. Traceability Status

- **Core `spec_code` (hard)**: partial — all 4 REQs (REQ-001 marker advertised, REQ-002 both guard sites adopt, REQ-003 fail-safe toward reaping, REQ-004 marker-dir parity) resolve to shipped behavior; 5 doc-side drifts (F001–F005) on paths, module registration, schema, a literal TTL value, and a stale limitation. No requirement is contradicted by the code.
- **Core `checklist_evidence` (hard)**: N/A — Level 1 spec folder, no `checklist.md`.
- **Overlay `feature_catalog_code` / `playbook_capability`**: N/A for this packet.

## 8. Deferred Items

- All 5 findings are P2 advisories; deferring them does not affect runtime behavior.
- **Genuine open follow-on (carried from the summary, still valid):** identify and make cooperative the blocking tail phase (~79s observed) so the daemon stays *responsive* through it, not merely *unreaped*; and chunk the unbounded `runTriggerEmbeddingBackfill` / `syncPhraseRows` transaction before `SPECKIT_TRIGGER_EMBEDDING_BACKFILL` is ever enabled. [implementation-summary.md:103]
- **Verification gap:** build/syntax/test were not independently re-run in this review context (node execution gated). The summary's PASS rows (build exit 0, `node --check`, unit + isolated harness, live 330s reindex) are corroborated by static inspection only.

## 9. Audit Appendix

- **Coverage**: 4/4 dimensions in a single iteration. Files read across writer (`memory-index.ts:1486-1554`), marker module (`maintenance-marker.ts:1-92`), predicate (`model-server-supervision.cjs:557-640`), both guard sites (`mk-spec-memory-launcher.cjs:329-333, 800-844, 1660-1709`), embedding-queue marker (`retry-manager.ts:1015-1066`), config parity (`core/config.ts:55-109`), and both test files.
- **Replay validation**: single-iteration run; convergence was the maxIterations=1 bound, not a composite STOP. No P0 → no P0-resolution gate to replay. No adversarial-downgrade events (no P0/P1 raised). Recorded synthesis event (`synthesis_complete`, verdict PASS, 0/0/5) matches the iteration JSONL delta.
- **Convergence evidence**: `newFindingsRatio` 0.0 (advisory-only), no P0 override. dimensionCoverage 1.0. releaseReadinessState `converged` (4 dims covered, stabilization trivially satisfied for a single pass with no P0/P1).
- **Verdict logic**: PASS = no active P0/P1; 5 active P2 → `hasAdvisories: true`. Consistent with the iteration final line `Review verdict: PASS`.
