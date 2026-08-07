# Review Report — 020-maintenance-grace-background-embedding (lineage p020-opus-2)

**Verdict: PASS** (hasAdvisories: true) · **Release-readiness: converged**
**Executor**: cli-claude-code model=claude-opus-4-8 · **Iterations**: 1 · **Stop reason**: `config.maxIterations=1` reached; no P0/P1; all 4 dimensions covered.

---

## 1. Executive Summary

The phase ships exactly what the spec scopes: a shared, reference-counted maintenance-marker module (`maintenance-marker.ts`) that both the reindex scan and the post-scan background-embedding queue hold through their overlap, so a daemon busy with either is adopted rather than reaped during launcher re-election. All four code requirements (REQ-001…004) resolve to shipped behavior, and the writer↔launcher contract was verified end to end (the launcher reads only `childPid`/`activeUntilMs`, both still written, with matching dir resolution).

- **Active P0: 0 · Active P1: 0 · Active P2: 3**
- Scope: 3 changed source files + 1 new unit test, plus 2 launcher consumer files read for parity.
- `hasAdvisories: true` — three P2 advisories (one doc-accuracy, one design-assumption, one cosmetic observability).
- SC-002 (live reindex+embedding survival) is explicitly the deploy-time check, out of code scope.

## 2. Planning Trigger

PASS with only P2 advisories → routes to **`/create:changelog`**, not remediation planning. The three P2 items are documentation/clarity refinements; none blocks release. If the team wants to absorb F001/F002 wording fixes, they can ride along with the changelog rather than a new spec.

## 3. Active Finding Registry

| ID | Sev | Category | Location | Summary |
|----|-----|----------|----------|---------|
| F001 | P2 | docs-vs-code-drift | `spec.md:108`, `implementation-summary.md:78` | "marker schema unchanged" overstated: writer payload changed `jobId` → `labels` (drops `jobId`). Consumer-compatible (launcher reads only `childPid`/`activeUntilMs`), so behavior is unaffected; wording is inaccurate. |
| F002 | P2 | correctness (design-assumption) | `retry-manager.ts:1038` | Embedding tick calls `beginMaintenance` once with no explicit `refresh()` (unlike the scan's per-phase refresh). Freshness during a batch relies on the 180s TTL + 20s interval timer, which only fires if the batch yields to the event loop. Holds for the I/O-bound embedding path; worth documenting. |
| F003 | P2 | maintainability (observability) | `maintenance-marker.ts:72-83` | `end()` does not re-serialize the on-disk `labels` until the next write, so the file can momentarily list an ended holder. Launcher ignores `labels` → cosmetic. Already documented by the unit test. |

No active P0/P1.

## 4. Remediation Workstreams

All advisory; none required for PASS.

- **WS-1 (docs, ~5 min):** Reword the "schema unchanged" claim in `spec.md` §3 Out of Scope and `implementation-summary.md` Key Decisions to state precisely which fields are preserved (`childPid`, `activeUntilMs`, file, TTL, dir) vs changed (`jobId` → `labels`). Resolves F001.
- **WS-2 (docs or minor code, optional):** Document the embedding-queue refresh assumption (relies on event-loop yields for the 20s timer; no explicit per-item `refresh()`), or add a periodic/per-item `refresh()` if a synchronous embedding phase could approach the 180s TTL. Resolves F002. Overlaps with the already-noted "cooperative chunk-and-yield" follow-on.
- **WS-3 (none):** F003 is cosmetic and already documented in the test; no action recommended.

## 5. Spec Seed

No new spec required. If WS-2 is pursued as code, a minimal Level-1 delta would scope: "embedding-queue marker refresh — add explicit `refresh()` at safe points in the embedding batch so marker freshness does not depend solely on event-loop yields," with acceptance that a synchronous batch phase exceeding the refresh interval still keeps the marker fresh.

## 6. Plan Seed

If the team acts on advisories:
1. Edit `spec.md` and `implementation-summary.md` wording (F001) — pure docs.
2. Decide F002 disposition: document-only (Known Limitations already covers responsiveness) vs add explicit `refresh()` in `processRetryQueue`'s loop.
3. Leave F003 as-is (documented behavior).
Verification: re-run `tests/maintenance-marker.vitest.ts` + scan-job + launcher-guard suites; `validate.sh <spec-folder> --strict` exit 0.

## 7. Traceability Status

| Protocol | Level | Gate | Status | Notes |
|----------|-------|------|--------|-------|
| `spec_code` | core | hard | **PASS** | REQ-001…004 resolve to shipped code; SC-002 deploy-time; one partial claim → F001 |
| `checklist_evidence` | core | hard | **SKIPPED** | No `checklist.md` (Level 1) — nothing to verify |
| `skill_agent` | overlay | advisory | N/A | Target is spec-folder, not skill |
| `agent_cross_runtime` | overlay | advisory | N/A | Target is spec-folder, not agent |
| `feature_catalog_code` | overlay | advisory | N/A | No catalog claims in scope |
| `playbook_capability` | overlay | advisory | N/A | No playbook in scope |

Consumer parity confirmed: writer (`DATABASE_DIR`) and launcher reader (`maintenanceMarkerDir()`) mirror identical `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` precedence; launcher-read fields preserved.

## 8. Deferred Items

- **SC-002 — live end-to-end reindex + post-scan embedding burst survival**: deferred to deploy-time confirmation per spec §5/§7; not a code deliverable. The impl-summary records a live PASS, but this lineage did not (and is not scoped to) re-run it.
- **Cooperative chunk-and-yield for heavy synchronous embedding phases**: noted by the spec as out-of-scope follow-on; overlaps with F002.
- **Pre-existing flake** in `retry-manager.vitest.ts` T49 (cross-file test isolation): noted by impl-summary as present without these changes; not introduced here.

## 9. Audit Appendix

- **Coverage**: 4/4 dimensions in iteration 1 (single-pass fan-out, `config.maxIterations=1`). 6 files read (3 changed + 1 test + 2 launcher consumer files).
- **Replay validation**: JSONL replay of the single iteration record reproduces `newFindingsRatio=0.0`, P0/P1=0, dimension coverage 1.0, and the recorded `synthesis_complete` verdict PASS — consistent.
- **Adversarial replay**: no P0/P1 to replay. One correctness candidate (per-tick marker gap) was refuted against the launcher adopt guard (`shouldAdoptDespiteProbe` requires probe failure; daemon is responsive between ticks) and downgraded to non-finding.
- **Test-execution caveat**: SC-001's "tests pass" is verified by static review of the test contract (`maintenance-marker.vitest.ts`, 5 cases covering write/ref-count/idempotent-end/refresh/multi-holder) plus the impl-summary's recorded build+suite PASS. Live `vitest` re-execution was approval-gated in this autonomous lineage and not re-run.
- **Resource Map Coverage Gate**: omitted — `resource-map.md` not present at init (`resource_map_present=false`).
- **Verdict lock**: 0 confirmed active P0 → not forced to FAIL; 0 active P1 → not CONDITIONAL; PASS with `hasAdvisories=true`.

---

Review verdict: PASS
