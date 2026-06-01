---
title: "Implementation Summary: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/implementation-summary]"
description: "Living implementation summary for the 3-phase memory_index_scan self-maintaining index. Authored at packet creation (docs complete, code not yet started); reconciled to shipped state as each phase lands."
trigger_phrases:
  - "memory index scan implementation summary"
  - "013 memory index implementation status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-06-01T14:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 4 shipped (942ad78d9c, v28); clean rebuild 9614/9614, 0 missing-vector"
    next_safe_action: "None binding; optional D/E scaffolds and reconcile join-bug fix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-memory-index-scan-implementation |
| **Status** | Shipped & deployed. **Phases 1-3** (2026-05-31): coalescing + async drain + move reconciliation. **Phase 4** (council follow-up, 2026-06-01): active-row uniqueness guard (deprecate-before-insert + v28 partial unique index) + multi-tenant scope isolation — commit `942ad78d9c`; clean index rebuild → 9614 rows / 9614 vectors / 0 missing (`healthy_fresh`). Checkpoint-v2 (D) + MCP front-proxy (E) re-deferred — see `handover.md` §8. |
| **Level** | 2 |
| **Created** | 2026-05-31 |
| **Research Source** | `../012-memory-index-scan-ux-hardening/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status at authoring time: nothing in production yet — this packet's Level-3 docs are complete; the code is implemented phase-by-phase and this section is reconciled as each phase lands.**

Planned deliverable (full 5-angle self-maintaining index, research.md §6), in three gated phases:
- **Phase 1** — coalescing caller contract (no raw `E429`) + `memory_health.index` freshness block + bounded global orphan sweep.
- **Phase 2** — phased async execution (walk → commit-lexical → async vector drain) + async-mode indexing + outage-safe drain (removes the `-32001` class).
- **Phase 3** — job-layer single-writer concurrency + move reconciliation (`packet_id` identity) + auto-reindex triggers.

### Phase status
| Phase | Shipped? | Evidence |
|-------|----------|----------|
| Phase 1 | Yes | tsc 0 errors; 14/14 tests; merged 2026-05-31 |
| Phase 2 | Yes | tsc 0 errors; 17/17 tests; merged 2026-05-31 |
| Phase 3 | Yes | tsc 0 errors; 19/19 tests; merged 2026-05-31 |
| Phase 4 (council follow-up) | Code: Yes / D,E: re-deferred | deprecate-before-insert + v28 unique index + scope isolation (commit `942ad78d9c`); clean rebuild 0 collisions; 5-round deep-review R5 = SAFE TO DEPLOY; checkpoint-v2 (D) + MCP-proxy (E) re-deferred |

**Phase 4 — Active-Row Uniqueness Guard + Multi-Tenant Scope Isolation (2026-06-01).** The deferred council follow-ups (see Known Limitations §6) were taken up in a focused session:
- **Dup-on-reindex** is closed by **deprecate-before-insert** (retire the predecessor to `tier='deprecated'` — excluded from the active index — before inserting the new active row; constitutional rows are never declassified) backed by the **v28 partial unique index** `idx_memory_logical_key_active_unique` over `(spec_folder, COALESCE(NULLIF(canonical_file_path,''),file_path), COALESCE(NULLIF(TRIM(anchor_id),''),'_'), tenant/user/agent/session)` `WHERE importance_tier NOT IN ('constitutional','deprecated')`. The legacy table-level `UNIQUE(spec_folder,file_path,anchor_id)` was removed. Deprecate-before-insert was chosen over delete-before-insert specifically to preserve `memory_lineage`/causal/drift history.
- **Multi-tenant scope isolation:** tenant/user/agent/session scope threaded through `indexMemory`/append/projection/lookup; the BM25 search lane excludes `deprecated` rows. Production is single-tenant (all rows null-scope), so the multi-tenant edges are dormant-correct.
- **Re-embed** (originally the ~5.4k hf-local→ollama gap) was resolved by a full operator-authorized **clean index rebuild** rather than an incremental drain: rebuild reported **0 logical-key collisions** (confirming the guard on real data) and drained to completion.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Docs authored by claude-opus-4-8 from the 012 research synthesis using the canonical `manifest/*.md.tmpl` template structure (strict-validate target). Implementation is delivered via cli-opencode `openai/gpt-5.5 --variant high` (fast tier), one phase per dispatch, against a clean recovery baseline commit, with RM-8 safeguards (BANNED OPS, disjoint scope, no agent git writes, SIGKILL between dispatches). Each phase is verified by `tsc` + the spec-kit test suite before the next is dispatched. The live daemon (7 procs) is not restarted mid-phase; restart is a discrete step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why | ADR |
|----------|-----|-----|
| Coalescing async job contract, not sync + caller-visible cooldown | Kills the E429 foot-gun with least code; reuses the embedder-job model | ADR-001 |
| Lexical-first async-mode indexing, defer vectors | Eliminates the `-32001` timeout class; lexical search always available | ADR-002 |
| Move identity = `packet_id` + doc role/anchor, content hash confirmation only | Self-heals renests without re-embedding; avoids false-positive merges | ADR-003 |
| Implement in 3 sequential gated phases, not one dispatch | Highest-blast-radius daemon code; RM-8 precedent; verifiable slices | plan.md §4 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Level-3 docs authored (spec/plan/tasks/checklist/decision-record/impl-summary) | DONE |
| `validate.sh <folder> --strict` | PASSED — Errors 0, Warnings 0 |
| Phase 1 `tsc` + tests | PASSED (tsc 0 errors; 14/14 on 2026-05-31) |
| Phase 2 `tsc` + tests | PASSED (tsc 0 errors; 17/17 on 2026-05-31) |
| Phase 3 `tsc` + tests | PASSED (tsc 0 errors; 19/19 on 2026-05-31) |
| SC1-SC5 (spec.md §5) | PASSED — all 3 phases shipped |
| Daemon rebuild + restart (new code live) | DONE — pid 23371; `index.orphanFiles` numeric + `sweepOrphanIndexRows` live + `scanKey` present |
| Embedder after restart | ollama `nomic-embed-text-v1.5`, healthy (auto-cascade re-selected on restart) |
| 012/013 reindex + dup repair | DONE — 012 fresh; 013 = 6 clean success rows; `failedVectors` 36→6 |
| **Phase 4** code committed | DONE — `942ad78d9c` (24 files, +763/-117); deprecate-before-insert + v28 index + scope isolation |
| **Phase 4** v28 schema live | VERIFIED — `schema_version`=28 (applied 2026-06-01 14:22); `idx_memory_logical_key_active_unique` present; legacy table UNIQUE absent |
| **Phase 4** active-row uniqueness on live data | VERIFIED — 9614 active rows hold under the unique index (0 logical-key collisions) |
| **Phase 4** index/vector consistency | VERIFIED — `memory_health` `healthy_fresh`: rowsTotal=ftsRowsTotal=vecRowsTotal=9614, `mismatchedIds: []`, pending/retry/failed vectors = 0 |
| **Phase 4** missing-vector drain (item A) | DONE — real missing-vector = 0 (direct `rowid` anti-join + health consistency); 4 residual startup-seed rows re-embedded |
| **Phase 4** provider-failures (item B) | DONE — 5 rows (50257-50261) re-indexed under ollama |
| **Phase 4** post-impl deep-review (item F) | PASSED — 5 rounds (cli-codex gpt-5.5); R5 = SAFE TO DEPLOY; P0 none, P1 none |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation not yet started at authoring time** — this summary is a living document reconciled per phase (Completion Verification Rule).
2. **Full 5-angle scope is multi-phase** — Phase 2/3 (async job machine, move reconciliation) are larger than Phase 1; each is gated and independently revertable.
3. **Build-while-live** — the daemon runs during development; behavioral smoke tests require a deliberate restart, not the live process. On deploy, `dist/` was stale (the launcher auto-builds only when artifacts are missing, never on source staleness), so it was rebuilt before the restart.
4. **Residual failed index rows (pre-existing, not from this packet)** — 6 genuinely-failed-embedding rows remain (4 in `008-playbook-manual-test-run`, 2 in `026 resource-map.md`); they have no success counterpart, so they were excluded from the duplicate-row repair. Re-embed via `memory_embedding_reconcile` or a forced re-index.
5. **`checkpoint_create` fails on the full index** (`Invalid string length`) — pre-existing serializer limit on the ~33k-row state; surfaced when attempting a pre-repair checkpoint.
6. **Scoped re-index required a normalized `specFolder` (FIXED, deployed)** — the earlier "force/incremental won't refresh" note was a `specFolder` path-format error, not a refresh-logic bug: scoped `memory_index_scan` matched only the specs-root-relative form, so `.opencode/specs/…`-prefixed / absolute / leaf args scoped every spec-doc out (handover.md + edits appeared unrefreshable). Fixed via `normalizeSpecFolderScope` (`memory-index-discovery.ts`; 8/8 tests; deployed on daemon pid 47588). A correctly-scoped scan backfills `file_mtime_ms` and indexes handover.md. Remaining indexer follow-ups (captured in `ai-council/council-report-followups-mcp-stability.md`) were resolved in the **Phase-4 focused session (2026-06-01)** — see "Phase 4" under What Was Built: dup-on-reindex (deprecate-before-insert + v28 unique index) and the hf-local→ollama re-embed (clean rebuild → 9614/9614, 0 missing) shipped; **checkpoint v2 (item D)** and **MCP front-proxy/reconnect (item E)** are re-deferred (scaffold-only, non-binding, larger surface needing their own deep-review cycle). Two follow-up bugs were found and documented for a later packet: (a) `memory_embedding_reconcile` `coverage.successMissingActiveVector` **over-reports** — it joins the active shard on the always-NULL `vec_memories_rowids.id` column instead of `rowid`, so it counts every row as missing (it reported 9614; the authoritative coverage is 0 via `memory_health` consistency + a direct `rowid` anti-join); (b) `lib/storage/schema-downgrade.ts` still recreates the legacy `UNIQUE(spec_folder,file_path,anchor_id)` on downgrade (P2, downgrade-only path).
<!-- /ANCHOR:limitations -->
