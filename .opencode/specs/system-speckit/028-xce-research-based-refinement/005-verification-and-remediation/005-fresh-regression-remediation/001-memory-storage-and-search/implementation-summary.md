---
title: "Implementation Summary: Memory Store/Search/Save Write-Path Remediation"
description: "Remediation of 34 fresh-regression findings in memory store/search/save: 28 fixed, 2 refuted, 2 deferred, 2 partial."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/001-memory-storage-and-search"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "fresh-regression-impl-agent"
    recent_action: "28 fixes, 2 refuted, 2 deferred, 2 partial; 288 tests pass"
    next_safe_action: "Commit; route T013/T014 to a packet; reconcile T031 claim"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Memory Store/Search/Save Write-Path Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — 28 fixed, 2 refuted, 2 deferred, 2 partial |
| **Date** | 2026-06-16 |
| **Findings carried** | 34 |
| **Verification** | 288 touched-area vitest pass / 0 fail (23 files); 3 packages typecheck clean; 0 comment-hygiene violations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Remediation of the 34 memory store/search/save findings from `../../review/fresh-regression-75/deep-review-findings-registry.json` (enumerated in `tasks.md`, indexed in `../fix-coverage.json`). Outcome: **28 fixed, 2 refuted, 2 deferred, 2 partial**.

**Round-2-confirmed bugs (priority, RED→GREEN mutation-verified):**
- T001 — `vector-index-mutations.ts` delete-sweep `invalidateGraphCaches` now bumps the causal-edges generation first (was serving stale causal-boost search results after a memory delete).
- T002 — `spec-folder-mutex.ts` save mutex gains pid-liveness reap (`process.kill(pid,0)`: reap dead, or unknown+stale; never an alive owner) plus a `utimesSync` heartbeat — no longer reaps a live owner.
- T003 — `history.ts` legacy `memory_history` rebuild now runs inside `database.transaction(...)()` (a mid-rebuild crash rolls back instead of stranding the audit log).
- T005 — `pe-gating.ts` (updateExistingMemory) + `save/create-record.ts` append-version paths now carry the retired predecessor's manual `source_kind`/tier onto the successor (was relabelling human rows to `agent`).

**Other fixes (P2 robustness/maintainability):** T006 (catch regex scoped to causal tables), T007 (frontmatter-promoter generation bump), T008 (reap-create ownership re-check), T009 (save-lock reap-branch tests), T011 (Hebbian counters gated on updateEdge), T012 (Hebbian failure re-throws → no false last_run_at), T015/T016/T017 (checkpoint v2 restore: null-embedder refuse, actual restored count, catalog reconcile), T018 (reconsolidation passes explicit spec_folder), T019 (access-tracker retain-on-flush-failure), T020 (canonical-fingerprint uniform non-JSON contract), T021 (incremental-index fingerprint failure = memo miss), T022 (contention-policy async COMMIT rollback), T023 (vector-store clear() purges dim shard), T024 (advisor lexical denominator un-expanded), T025 (advisor trusted-edge clears auto markers), T026 (session-trace dead guard removed), T027 (bm25 numericId free-list), T028 (idempotency prune on indexed created_at), T029 (graph-search LIKE uses shared escaper), T030/T033 (statediff staged-API docs + test), T034 (generate-context absolute-path containment at write sink).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per `plan.md`: each cited file:line was re-opened and confirmed real-vs-refuted before editing; fixes are minimal and mirror the cited sibling pattern (e.g. T001/T007 mirror `causal/sweep.ts`'s bump-first invalidator; T002 ports `generate-context.ts`'s save-lock liveness; T005 mirrors `memory-save.ts`'s carry re-stamp). Regression tests were added/extended for the high-value fixes and the priority bugs were mutation-checked (broke the prod fix, saw the test go RED, restored).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Refuted (no change — would break correct behavior):** T004 — `executeMerge` synthesizes a NEW system-merged row; re-stamping its `source_kind` to `human` would mislabel a system artifact (Round-2 also REFUTED). T032 — `codeHash()` is a correct, deterministic helper actively used by two test suites; deleting it removes a usable utility and the "drift" risk is hypothetical.
- **Deferred to a dedicated packet (blast radius > a P2's value on a default-ON path):** T013 — splitting the exported `runConsolidationCycle` into read/write phases to narrow the BEGIN IMMEDIATE lock (weekly batch job; would stack on the T012 rollback change). T014 — single-handle consolidation; production already shares one connection, and both fixes break test signatures or need a multi-function refactor across `causal-edges.ts`.
- **Partial:** T010 — owner write made atomic via temp-file rename, but full dir+owner atomic publish (rename-a-populated-dir) was rejected because rename-over-empty-dir bypasses the owner-state/age reclaim gate. T031 — module documented as staged/not-yet-wired; wiring it into the sweep and fixing the false impl-summary claim (which lives in sibling sub-phase `004-retention-reducer`) is out of scope.
- Fixes mirror existing correct sibling patterns where available.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Tests:** touched-area vitest = **288 pass / 0 fail across 23 files** (incl. new files `spec-folder-mutex-liveness.vitest.ts`, `history-migration-atomicity.vitest.ts`, and extended `memory-delete-cascade`, `pe-gating-provenance`, `canonical-fingerprint`, `statediff`, `bm25-packed-inmemory`, `generate-context-save-lock`, `memory-idempotency-and-near-duplicate`).
- **Typecheck:** clean for all three touched packages — `mcp_server`, `scripts`, `system-skill-advisor/mcp_server` (`tsc --noEmit`).
- **Comment hygiene:** 0 violations across the 24 modified source files (`check-comment-hygiene.sh` via shebang).
- **Mutation checks (RED→GREEN):** T001 (generation bump), T005 (human carry), T009 (within-window refuse), T028 (created_at prune) each confirmed to fail when the prod fix is reverted.
- **Pre-existing, out-of-scope failures (unchanged by this work, confirmed present at HEAD with changes stashed):** `reconsolidation.vitest.ts` 9 fail (`no such column: source_kind` from untouched `executeMerge`); `causal-edges.vitest.ts` 1 fail (stale `skippedManual` assertion).
- **Spec validation:** `validate.sh --strict` → PASSED (0 errors, 0 warnings).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Orchestrator follow-ups:** T013 + T014 deferred to a dedicated consolidation packet (rationale in Key Decisions). T031's false impl-summary claim lives in sibling sub-phase `002-.../004-retention-reducer/implementation-summary.md` and should be reconciled there (or the helper wired into the retention sweep).
- T010 leaves a tiny mkdir→owner-write visibility window (the mkdir gate must stay authoritative for the owner-state reclaim logic); the owner write itself is now atomic with no partial-write artifact.
- Two refuted findings (T004, T032) were intentionally not changed because the recommended change would mislabel a system artifact / delete a correct, used utility.
- Some fixes guard dormant paths (per the registry's own notes, e.g. T022/T023 have no current production caller); they restore the intended contract for when those paths are exercised.
<!-- /ANCHOR:limitations -->
