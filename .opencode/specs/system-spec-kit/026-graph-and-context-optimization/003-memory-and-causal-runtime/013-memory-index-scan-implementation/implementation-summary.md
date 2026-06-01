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
    last_updated_at: "2026-05-31T19:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Deployed: dist rebuilt, daemon restarted (pid 23371, ollama), 012/013 reindexed, dups repaired"
    next_safe_action: "None (deployed); optional: re-embed 6 residual pre-existing failed index rows"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
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
| **Status** | Shipped & deployed — dist rebuilt, daemon restarted onto new code, 012/013 reindexed |
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation not yet started at authoring time** — this summary is a living document reconciled per phase (Completion Verification Rule).
2. **Full 5-angle scope is multi-phase** — Phase 2/3 (async job machine, move reconciliation) are larger than Phase 1; each is gated and independently revertable.
3. **Build-while-live** — the daemon runs during development; behavioral smoke tests require a deliberate restart, not the live process. On deploy, `dist/` was stale (the launcher auto-builds only when artifacts are missing, never on source staleness), so it was rebuilt before the restart.
4. **Residual failed index rows (pre-existing, not from this packet)** — 6 genuinely-failed-embedding rows remain (4 in `008-playbook-manual-test-run`, 2 in `026 resource-map.md`); they have no success counterpart, so they were excluded from the duplicate-row repair. Re-embed via `memory_embedding_reconcile` or a forced re-index.
5. **`checkpoint_create` fails on the full index** (`Invalid string length`) — pre-existing serializer limit on the ~33k-row state; surfaced when attempting a pre-repair checkpoint.
6. **Scoped re-index required a normalized `specFolder` (FIXED, deployed)** — the earlier "force/incremental won't refresh" note was a `specFolder` path-format error, not a refresh-logic bug: scoped `memory_index_scan` matched only the specs-root-relative form, so `.opencode/specs/…`-prefixed / absolute / leaf args scoped every spec-doc out (handover.md + edits appeared unrefreshable). Fixed via `normalizeSpecFolderScope` (`memory-index-discovery.ts`; 8/8 tests; deployed on daemon pid 47588). A correctly-scoped scan backfills `file_mtime_ms` and indexes handover.md. Remaining indexer follow-ups — dup-on-reindex supersede, hf-local→ollama shard re-embed (~5.4k rows missing an active vector), checkpoint v2, MCP front-proxy/reconnect — are captured in `ai-council/council-report-followups-mcp-stability.md` and the session task list (deferred to a focused session).
<!-- /ANCHOR:limitations -->
