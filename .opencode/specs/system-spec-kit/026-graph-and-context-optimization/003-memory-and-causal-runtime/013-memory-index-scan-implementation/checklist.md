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
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored verification checklist"
    next_safe_action: "Check Phase 1 items as implementation lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    completion_pct: 0
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

- [ ] **[P0]** Clean recovery baseline commit recorded (hash) before any code dispatch.
- [ ] **[P0]** `cli-opencode/SKILL.md` read; `opencode providers list` confirms `openai` configured.
- [ ] **[P0]** Daemon source unmodified at phase start; build-while-live hazard acknowledged.
- [ ] **[P0]** BANNED OPS + disjoint file scope defined for the dispatch; agent performs no git writes (isolated worktree).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **[P0]** No raw `E429` reachable from `memory_index_scan` (Phase 1).
- [ ] **[P0]** Orphan deletion goes through `delete_memory_from_database()`; no raw `memory_index` delete.
- [ ] **[P1]** Contract is additive: existing completed-response fields preserved inside job metadata.
- [ ] **[P0]** Comment hygiene: no ADR/REQ/task-id/spec-path labels in code comments; durable WHY only.
- [ ] **[P1]** Reused existing primitives (job model, claim-by-update, deferred upsert) rather than new infra where possible.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] **[P0]** P1 GATE: `tsc` zero new errors + suite green; repeat-scan coalescing (no E429); `memory_health.index` populated; renested orphan removed.
- [ ] **[P0]** P2 GATE: `tsc` + suite green; `force` scan returns within deadline (`complete_with_pending_vectors`); outage leaves rows `pending` not `retry`.
- [ ] **[P0]** P3 GATE: `tsc` + FULL suite green; concurrent callers coordinate; `git mv` path updated in place without re-embed.
- [ ] **[P1]** New targeted tests added for each phase's behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] **[P0]** R1 (no raw E429) met — SC1 verified.
- [ ] **[P0]** R2 (always completes, no -32001) met — SC2 verified.
- [ ] **[P1]** R3 (concurrency correct) met — Phase 3.
- [ ] **[P1]** R4 (degraded-mode, pending-not-retry) met — Phase 2.
- [ ] **[P1]** R5 (orphan/move self-heal + health surface) met — SC3/SC4 verified.
- [ ] **[P1]** No partial-fix left as silent "future work"; deferrals (if any) are user-approved and recorded.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] **[P1]** No new external network surface; embedding stays on the configured local/provider path.
- [ ] **[P0]** Orphan sweep cannot delete live rows (on-disk existence checked for both `file_path` and `canonical_file_path`).
- [ ] **[P0]** Move reconciliation cannot merge distinct packets (unique `packet_id` + doc-anchor match required; content hash confirmation only).
- [ ] **[P0]** No raw DB mutation outside the daemon/handler path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] **[P1]** `implementation-summary.md` reconciled to final shipped state per phase.
- [ ] **[P2]** `memory_health.index` field semantics documented in the handler/relevant reference.
- [ ] **[P1]** Continuity (`_memory.continuity`) updated at each phase boundary via `/memory:save`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] **[P0]** All changes confined to `mcp_server/` files listed in spec.md §3 Files to Change.
- [ ] **[P1]** Packet docs under `013-memory-index-scan-implementation/`; metadata (`description.json`, `graph-metadata.json`) present.
- [ ] **[P1]** No scope creep into adjacent handlers or unrelated subsystems.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Phase | Build (tsc) | Tests | Success Criteria | Status |
|-------|-------------|-------|------------------|--------|
| Phase 1 | pending | pending | SC1, SC3, SC4(orphan) | not started |
| Phase 2 | pending | pending | SC2 | not started |
| Phase 3 | pending | pending | SC4(move), R3 | not started |
| Packet | pending | pending | SC1-SC5 | not started |
<!-- /ANCHOR:summary -->
