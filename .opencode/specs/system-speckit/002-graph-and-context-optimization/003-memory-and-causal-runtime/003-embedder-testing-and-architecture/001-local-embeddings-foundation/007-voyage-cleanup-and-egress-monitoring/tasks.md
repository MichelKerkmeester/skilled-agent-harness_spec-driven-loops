---
title: "Tasks: Phase 7 — Voyage Cleanup + Egress Monitoring"
description: "Task list for deleting stale Voyage + legacy sqlite, adding the factory.ts egress guard, and shipping the tcpdump verification script."
trigger_phrases:
  - "007 tasks voyage cleanup"
  - "factory egress guard tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring"
    last_updated_at: "2026-05-12T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks closed through Phase 2; verify pending"
    next_safe_action: "Strict validate"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140070c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-007-voyage-cleanup-2026-05-12"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 — Voyage Cleanup + Egress Monitoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm no active open file handles on the Voyage sqlite (`lsof` returns nothing)
- [x] T002 Confirm hf-local sqlite is the only active context-index DB
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete `context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` (~322MB reclaim)
- [x] T004 Delete legacy `context-index.sqlite` (~141MB reclaim)
- [x] T005 Add `voyageDriftWarned` module flag in `factory.ts`
- [x] T006 Add `warnIfVoyageDriftDetected(effectiveProvider)` helper that warns at most once if `VOYAGE_API_KEY` is set and provider is `hf-local`
- [x] T007 Call the helper from `getProviderInfoForResolution()` after metadata resolution
- [x] T008 `npx tsc --noEmit --composite false -p tsconfig.json` clean
- [x] T009 `npx tsc --build` regenerates `dist/embeddings/factory.{js,d.ts}`
- [x] T010 Verify dist contains `warnIfVoyageDriftDetected` (grep returns ≥1)
- [x] T011 Create `scratch/tcpdump-verify.sh` with 24h capture command and `chmod +x`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `memory_health()` post-delete reports `vectorSearchAvailable: true`, `memoryCount: 2112` (no regression)
- [x] T013 463MB total reclaim recorded in implementation-summary
- [ ] T014 Strict validate exits 0
- [ ] T015 [B] User runs tcpdump-verify.sh for 24h post-merge → 0 packets to api.voyageai.com (not a session task)
- [ ] T016 Update parent `graph-metadata.json` (`derived.last_active_child_id` rotation when active)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks `[x]`
- [x] Phase 3 except deferred-by-design T015
- [ ] Strict validate exits 0
- [ ] No `[B]` blocked tasks beyond the 24h user-action item
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Capture script**: See `scratch/tcpdump-verify.sh`
- **Predecessor**: `../004-vec-store-rebuild/implementation-summary.md` (hf-local sqlite is the live store)
- **Successor**: `../008-finalize-and-commit/` (final bundled commit on main)
<!-- /ANCHOR:cross-refs -->
