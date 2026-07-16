# Review Report — 020-maintenance-grace-background-embedding (lineage p020-opus-1)

**Verdict: PASS** (hasAdvisories: true)
**Executor:** cli-claude-code model=claude-opus-4-8 | **Iterations:** 1 | **Release readiness:** converged

---

## 1. Executive Summary

Release-readiness review of the `020-maintenance-grace-background-embedding` packet, which extracts the 019 maintenance-marker writer into a shared, **reference-counted** module (`lib/storage/maintenance-marker.ts`), refactors the background scan IIFE onto it, and wires the post-scan background-embedding queue into it after its empty-queue guard. The goal: a daemon stays adopted-not-reaped across a *full* reindex (scan **and** the deferred-embedding burst), closing the gap 019 left where the post-scan embedding queue was busy-but-unprotected.

- **Active findings:** P0: 0 · P1: 0 · P2: 3
- **Scope:** 1 new module (92 lines) + 2 surgical wirings + 1 unit test. Blast radius small; 019 launcher-side guard unchanged.
- **Verdict basis:** No correctness or security defect found; full spec↔code traceability (REQ-001..004, scope, SC-001/SC-002). All three findings are P2 advisories, each either intentional/documented or explicitly scope-acknowledged.
- `hasAdvisories = true`.

## 2. Planning Trigger

PASS with no P0/P1 → routes to `/create:changelog`, not remediation planning. The three P2 advisories do not require a fix in this packet; the strongest (P2-1, P2-3) are forward-looking and already converge with the impl-summary's documented "make heaviest phases cooperative" follow-on. No `/speckit:plan` needed.

## 3. Active Finding Registry

| ID | Sev | Category | File:line | Finding |
|----|-----|----------|-----------|---------|
| F001 | P2 | maintainability | `lib/providers/retry-manager.ts:1038-1041` | Embedding-path TTL freshness depends on async yielding (no explicit `refresh()` in the drain). Correct today because `processRetryQueue` is network-bound async I/O that lets the 20s interval fire; would only fail if a synchronous/CPU-bound embedding backend blocking >180s were added. |
| F002 | P2 | maintainability | `lib/storage/maintenance-marker.ts:72-82` | On-disk `labels` array is stale after a non-final `end()` until the next write event. In-memory ref count is always correct; launcher adopt decision keys on `activeUntilMs`/`childPid`, not `labels`. Intentional and documented in the test. |
| F003 | P2 | correctness | `lib/providers/retry-manager.ts:1052-1060` | Inter-tick marker gap: the handle is ended in the `finally` after each batch, so with the stock 300s interval the marker is absent between batches even with pending rows. A re-election in that idle gap can recycle the daemon, but the successor resumes the queue (no data loss; search stays up). Explicitly scope-acknowledged in plan.md §6. |

No P0/P1 findings. Every finding carries `severity`, `category`, `file:line`, `finding_class`, and `content_hash` (see findings registry).

## 4. Remediation Workstreams

None required for PASS. Optional forward-looking lane (defer to the cooperative-phase follow-on already noted in impl-summary):
- **Cooperative embedding drain:** if/when a synchronous embedding backend is introduced, add phase-boundary `refresh()` calls in the drain loop (mirrors the scan's `onPhase` refresh) and/or chunk-and-yield the heaviest phases. Closes F001 and reduces F003's window.

## 5. Spec Seed

No spec change required. If the cooperative follow-on is taken up, a successor spec (021+) would scope: "make the heaviest synchronous embedding phases cooperative (chunk-and-yield) so the daemon stays *responsive*, not only un-reaped, through the post-scan burst" — which the current spec §3 Out-of-Scope and impl-summary Known Limitations already pre-stage.

## 6. Plan Seed

No plan needed for this packet (PASS → changelog). Follow-on plan starter (only if pursued):
1. Add a phase-boundary `refresh()` in `processRetryQueue`'s per-item/per-chunk loop.
2. Optionally keep the marker held across short inter-tick gaps when `getRetryStats().queue_size > 0` (closes F003), bounded by the 180s TTL.
3. Reuse the existing `maintenance-marker.vitest.ts` harness for new coverage.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core / hard | **pass** | REQ-001..004, scope, SC-001/SC-002 all resolve to shipped behavior (evidence below) |
| `checklist_evidence` | core / hard | n/a | Level 1 folder, no `checklist.md`; tasks.md completion claims cross-checked against code |
| `feature_catalog_code` | overlay / advisory | n/a | no catalog entry in scope |
| `playbook_capability` | overlay / advisory | n/a | no playbook in scope |

Requirement evidence:
- **REQ-001** — `beginMaintenance(label) -> {refresh, end}`, present while ≥1 holder, removed at 0, idempotent `end()`, TTL 180s / 20s refresh: `maintenance-marker.ts:25-26,58-84`.
- **REQ-002** — `runBackgroundJob` marks only after the empty-queue guard, `end()` in existing `finally`: `retry-manager.ts:1032-1038,1052-1055`.
- **REQ-003** — overlap without clobbering via ref counting: `maintenance-marker.ts:74-82`; `tests:82-109`.
- **REQ-004** — idle tick never marks: `retry-manager.ts:1032-1034`.
- **Scope** — scan inline writer replaced by shared module: `memory-index.ts:1502,1540` (no residual marker write).
- **SC-001** — unit test present & well-formed; test's live-binding assumption verified (`DATABASE_DIR` is `export let` reassigned by `resolveDatabasePaths()` — `core/config.ts:97,103`); impl-summary records suites PASS (claimed, not re-run in this read-only review).
- **SC-002** — live reindex + post-scan burst survival recorded PASS as deploy verification (out of code scope).

## 8. Deferred Items

- **F001, F002, F003** — all P2 advisories, deferred (no action required this packet). F001/F003 fold into the cooperative-phase follow-on already documented in impl-summary Known Limitations.
- **SC-001 independent test re-run** — deferred to CI/deploy; this read-only fan-out lineage did not execute vitest (cost/scope). Evidence relied on the test file's structural correctness + the verified live-binding assumption + the impl-summary's recorded PASS.

## 9. Audit Appendix

- **Coverage:** 4/4 dimensions in one full-coverage pass (maxIterations=1 fan-out lineage); 6 files read (3 in-scope source, 1 test, 2 supporting bindings).
- **Adversarial replay:** No P0/P1 raised. Each P2 was actively tested for escalation to P1 and held at P2 (no active defect, no data loss, no behavioral impact) — see iteration-001 §"Adversarial self-check".
- **Convergence:** blocking `newFindingsRatio` = 0.0; dimension coverage 1.0; claim-adjudication gate passed trivially (0 P0/P1). Stop reason: maxIterations reached after full-coverage pass with no blocking findings.
- **Replay validation:** recomputed verdict from JSONL (0 P0 / 0 P1 / 3 P2 → PASS) agrees with the persisted `synthesis_complete` event.
- **Resource Map Coverage Gate:** omitted — `resource-map.md` not present at init (`resource_map_present = false`).

---

**Review verdict: PASS**
