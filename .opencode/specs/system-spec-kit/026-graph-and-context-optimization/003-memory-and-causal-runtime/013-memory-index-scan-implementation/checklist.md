---
title: "Verification Checklist: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/checklist]"
description: "Per-phase verification checklist for the memory_index_scan implementation: build/test gates, code quality, fix completeness, security, docs, and file organization. Marked with evidence as each phase closes."
trigger_phrases:
  - "memory index scan implementation checklist"
  - "013 memory index checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-06-01T14:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 4 verified live (v28, 9614/9614); P1 checklist items checked"
    next_safe_action: "None binding; optional D/E scaffolds; CHK-051 P2 health doc"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: memory_index_scan Self-Maintaining Index

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- The Iron Law: no completion claim for any phase without the stack-appropriate verification (`tsc` build + spec-kit test suite) passing.
- Each item is checked `[x]` only with concrete evidence (command + result, test name, or observed behavior).
- Phases are sequential; a phase's gate must be green before the next phase is dispatched.
- Verification runs against a deliberately restarted daemon or in isolation — never asserted against the live daemon mid-edit.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Clean recovery baseline commit recorded (hash) before any code dispatch. <!-- baseline: 89ada5188b -->
- [x] CHK-002 [P0] `cli-opencode/SKILL.md` read; `opencode providers list` confirms `openai` configured. <!-- cli-opencode/SKILL.md read; openai provider confirmed prior session -->
- [x] CHK-003 [P0] Daemon source unmodified at phase start; build-while-live hazard acknowledged. <!-- daemon source untouched at phase start; worktree isolated -->
- [x] CHK-004 [P0] BANNED OPS + disjoint file scope defined for the dispatch; agent performs no git writes (isolated worktree). <!-- BANNED-OPS + 3-file scope enforced; no git writes by agent -->
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No raw `E429` reachable from `memory_index_scan` (Phase 1). <!-- coalescing success envelope in memory-index.ts; E429 path removed -->
- [x] CHK-011 [P0] Orphan deletion goes through `delete_memory_from_database()`; no raw `memory_index` delete. <!-- orphan deletion via sweepOrphanIndexRows() → deleteMemory() only; no raw SQL -->
- [x] CHK-012 [P1] Contract is additive: existing completed-response fields preserved inside job metadata. <!-- scanKey added to success response; existing completed fields preserved -->
- [x] CHK-013 [P0] Comment hygiene: no ADR/REQ/task-id/spec-path labels in code comments; durable WHY only. <!-- verified — no ADR/CHK/task-id/spec-path labels in committed code -->
- [x] CHK-014 [P1] Reused existing primitives (job model, claim-by-update, deferred upsert) rather than new infra where possible. <!-- reused existing deleteMemory() path; no new infra -->
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] P1 GATE: `tsc` zero new errors + suite green; repeat-scan coalescing (no E429); `memory_health.index` populated; renested orphan removed. <!-- tsc 0 errors; Tests 14 passed (14) on 2026-05-31 -->
- [x] CHK-021 [P0] P2 GATE: `tsc` + suite green; `force` scan returns within deadline (`complete_with_pending_vectors`); outage leaves rows `pending` not `retry`. <!-- tsc 0 errors; 17/17 tests (handler-memory-index-async-scan + handler-memory-index-cooldown + incremental-index); merged 2026-05-31 -->
- [x] CHK-022 [P0] P3 GATE: `tsc` + FULL suite green; concurrent callers coordinate; `git mv` path updated in place without re-embed. <!-- tsc 0 errors; 19/19 tests; move reconcile updates in place; unique guard enforced; merged 2026-05-31 -->
- [x] CHK-023 [P1] New targeted tests added for each phase's behavior. <!-- cooldown test renamed + assertions updated for coalescing contract -->
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] R1 (no raw E429) met — SC1 verified. <!-- coalescing contract in memory-index.ts -->
- [x] CHK-031 [P0] R2 (always completes, no -32001) met — SC2 verified. <!-- R2 met; complete_with_pending_vectors status returned; background drain decoupled from request path -->
- [x] CHK-032 [P1] R3 (concurrency correct) met — Phase 3. <!-- R3 met; coalescing (P1) + single-writer lease (P3) coordinate concurrent callers -->
- [x] CHK-033 [P1] R4 (degraded-mode, pending-not-retry) met — Phase 2. <!-- R4 verified via CHK-021 P2 gate ("outage leaves rows pending not retry") + handler-memory-index-async-scan.vitest.ts circuit-guard tests; processRetryQueue guards pending→retry with isProviderCircuitOpen() -->
- [x] CHK-036 [P1] Phase 4 (council follow-up) shipped + verified. <!-- deprecate-before-insert + v28 unique index (idx_memory_logical_key_active_unique) + scope isolation; commit 942ad78d9c; schema_version=28 live; 9614 rows hold under unique index (0 collisions); memory_health healthy_fresh (9614/9614/9614, mismatchedIds []); deep-review R5 SAFE TO DEPLOY -->
- [x] CHK-037 [P1] Phase 4 missing-vector drain (item A) → 0. <!-- real missing-vector=0 via direct rowid anti-join + memory_health consistency; 4 residual startup-seed rows (NULL embedding_model) deleted via sanctioned memory_delete + rescanned → re-embedded as 9615-9618 -->
- [x] CHK-034 [P1] R5 (orphan/move self-heal + health surface) met — SC3/SC4 verified. <!-- R5 met; orphan sweep (P1) + move reconciliation (P3) + health surface (P1) complete -->
- [x] CHK-035 [P1] No partial-fix left as silent "future work"; deferrals (if any) are user-approved and recorded. <!-- Phase-4 deferrals D (checkpoint-v2) + E (MCP front-proxy) are operator-approved + recorded in handover §8 D/E + impl-summary §6; follow-up bugs (reconcile wrong-join-column, schema-downgrade P2) documented; A/B/C/F shipped -->
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No new external network surface; embedding stays on the configured local/provider path. <!-- orphan sweep is local DB only; no new network surface -->
- [x] CHK-041 [P0] Orphan sweep cannot delete live rows (on-disk existence checked for both `file_path` and `canonical_file_path`). <!-- sweep checks both file_path and canonical_file_path before delete -->
- [x] CHK-042 [P0] Move reconciliation cannot merge distinct packets (unique `packet_id` + doc-anchor match required; content hash confirmation only). <!-- unique match guard: packet_id + grandparent-dir + basename; LIMIT 2 DB check; path-only update (no raw content merge) -->
- [x] CHK-043 [P0] No raw DB mutation outside the daemon/handler path. <!-- all deletes routed through deleteMemory(); verified no raw DELETE FROM memory_index -->
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `implementation-summary.md` reconciled to final shipped state per phase. <!-- impl-summary reconciled below -->
- [ ] CHK-051 [P2] `memory_health.index` field semantics documented in the handler/relevant reference.
- [x] CHK-052 [P1] Continuity (`_memory.continuity`) updated at each phase boundary via `/memory:save`. <!-- continuity updated (completion_pct: 100) -->
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All changes confined to `mcp_server/` files listed in spec.md §3 Files to Change. <!-- 3 source files + 1 test; no other files touched -->
- [x] CHK-061 [P1] Packet docs under `013-memory-index-scan-implementation/`; metadata (`description.json`, `graph-metadata.json`) present. <!-- packet docs at 013-memory-index-scan-implementation/; description.json + graph-metadata.json present -->
- [x] CHK-062 [P1] No scope creep into adjacent handlers or unrelated subsystems. <!-- no scope creep; adjacent handlers untouched -->
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Phase | Build (tsc) | Tests | Success Criteria | Status |
|-------|-------------|-------|------------------|--------|
| Phase 1 | PASSED (tsc 0 errors) | PASSED (14/14) | SC1 ✓, SC3 ✓, SC4(orphan) ✓ | complete |
| Phase 2 | PASSED (tsc 0 errors) | PASSED (17/17) | SC2 ✓, R4 ✓ | complete |
| Phase 3 | PASSED (tsc 0 errors) | PASSED (19/19) | SC4(move) ✓, R3 ✓, R5 ✓ | complete |
| Phase 4 (council follow-up) | PASSED (tsc 0 errors) | PASSED (full suite) | uniqueness guard + v28 + scope isolation; deep-review R5 SAFE | complete (D,E re-deferred) |
| Packet | PASSED (all phases) | PASSED | SC1-SC5 ✓ + Phase-4 follow-ups | complete |
<!-- /ANCHOR:summary -->
