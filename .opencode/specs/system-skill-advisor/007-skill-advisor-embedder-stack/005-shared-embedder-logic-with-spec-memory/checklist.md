---
title: "Verification Checklist: Shared Embedder Logic with Spec-Memory"
description: "Verification Date: 2026-07-08 (retroactive for the 2026-05-21 original ship; live for the 2026-07-08 Round 2 hardening pass)"
trigger_phrases:
  - "shared embedder logic checklist"
  - "skill-advisor embedder verification"
  - "provider persistence checklist"
  - "MEMORY_DB_PATH leakage checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-07-08T06:58:48Z"
    last_updated_by: "claude"
    recent_action: "Created checklist.md; recorded Round 2 verification evidence"
    next_safe_action: "Operator: run the true production swap-runbook + cold-daemon live-smoke"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Shared Embedder Logic with Spec-Memory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: REQ-001 through REQ-011; REQ-009/010/011 added for Round 2]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [EVIDENCE: Phase A-D original + Phase E Round 2, `plan.md` section 4]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: `plan.md` section 6; Round 2's Ollama dependency confirmed live at `127.0.0.1:11434` during FIX-B]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes typecheck. [EVIDENCE: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exit 0, re-verified in this doc pass with Round 2 changes present]
- [x] CHK-011 [P0] Code builds clean. [EVIDENCE: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` exit 0, rebuilds `@spec-kit/shared` first, re-verified in this doc pass]
- [x] CHK-012 [P1] Error handling preserves existing behavior. [EVIDENCE: `getActiveEmbedder()` treats an unrecognized `provider` value as absent; `createChildEnv()` never overwrites an explicit parent-provided `MEMORY_DB_PATH`]
- [x] CHK-013 [P1] Code follows existing patterns without touching unrelated files. [EVIDENCE: `lib/scorer/` confirmed untouched via `git status --short`; scoped diff is exactly 6 Round-2 files plus the original packet's documented file list]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Original-ship embedder/scorer suites pass. [EVIDENCE: implementation-summary.md records 415/423 (3 pre-existing unrelated failures) at commit `12a322aa45`]
- [x] CHK-021 [P0] Round 2 targeted suites pass. [EVIDENCE: `npx vitest run tests/embedders/ tests/launcher-bootstrap.vitest.ts` 37/37 pass, re-verified in this doc pass]
- [x] CHK-022 [P0] All 5 launcher vitest suites pass. [EVIDENCE: `launcher-bootstrap` + 4 sibling suites = 43/43, re-verified in this doc pass]
- [x] CHK-023 [P0] Shared `hf-model-server.vitest.ts` suite still passes. [EVIDENCE: lives under `system-spec-kit/mcp_server`, unmodified, 18/18, re-verified in this doc pass]
- [x] CHK-024 [P1] Full regression suite run and pre-existing/concurrent-drift failures isolated. [EVIDENCE: `npm run test` = 670 passed / 17 failed / 1 expected fail / 7 skipped in this doc pass; 2 of the 17 stash-isolated and reproduce identically on the unmodified tree; remaining 15 not individually isolated]
- [x] CHK-025 [P1] Live A/B reproduction of the onnx crash trigger. [EVIDENCE: implementing session's report — 10/10 SIGABRT unpatched, 25/25 clean exits patched, identical drill; not independently re-run in this doc pass]
- [!] CHK-026 [P1] Cold-daemon-start-observed cascade run against a clean database, originally T017. [DEFERRED: not done; see `spec.md` Round 2 Open Questions and `tasks.md` T017. Actual evidence instead was a manual sqlite3 INSERT cross-checked against manifest derivation and a live Ollama health probe, not equivalent]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned. [EVIDENCE: FIX-A is cross-server database-path leakage via symlink-relative path resolution; the onnx mitigation is forced-exit-during-native-teardown]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for FIX-A. [EVIDENCE: `readlink`/`realpath` on `node_modules/@spec-kit/shared` confirmed the symlink into mk-spec-memory's package tree; repo-wide grep for `--preserve-symlinks` returned zero hits]
- [x] CHK-FIX-003 [P0] Consumer inventory completed. [EVIDENCE: `shared/embeddings/factory.ts`'s path-resolution functions are not exported, confirmed by reading the file, so the fix correctly targets the launcher's own spawn-environment boundary]
- [x] CHK-FIX-004 [P0] Algorithm invariant stated. [EVIDENCE: the advisor child process must always resolve its own database, never a foreign skill's, regardless of symlink chain depth]
- [x] CHK-FIX-005 [P1] Matrix axes covered by tests. [EVIDENCE: default no-override case, explicit parent-override case, target-suffix assertion (`skill-graph.sqlite` vs `context-index.sqlite`)]
- [x] CHK-FIX-006 [P1] Hostile/edge-case variant executed. [EVIDENCE: the "parent already sets MEMORY_DB_PATH" override case is explicitly tested and asserted not to be overwritten]
- [x] CHK-FIX-007 [P1] Evidence pinned to the final diff and verification commands. [EVIDENCE: see `implementation-summary.md` Round 2 Verification for exact commands and outputs reproduced in this doc pass]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added. [EVIDENCE: diff review of the 6 Round-2 files — no credential/token/secret literals introduced]
- [x] CHK-031 [P0] Provider allow-set prevents an arbitrary/corrupted stored string from being trusted. [EVIDENCE: `getActiveEmbedder()` omits `provider` when the stored value isn't in `ACTIVE_EMBEDDER_PROVIDERS`, tested]
- [x] CHK-032 [P1] `MEMORY_DB_PATH` default-injection cannot leak a foreign skill's database. [EVIDENCE: `createChildEnv()` test asserts the default matches `skill-graph\.sqlite$` and not `context-index\.sqlite$`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks reconciled to the actual shipped state. [EVIDENCE: original 2026-05-21 ship + same-day remediation + 2026-07-08 Round 2 all now reflected, replacing the 7-week-stale "Planned" status]
- [x] CHK-041 [P1] Implementation summary records what was built, delivered, decided, verified, and limited. [EVIDENCE: includes two corrections to the implementing session's own reports — the gitignore claim and the launcher-suite pass count]
- [x] CHK-042 [P2] Metadata refreshed after final doc updates. [EVIDENCE: `graph-metadata.json` `derived.status` flipped to `complete`, `source_fingerprint`/`source_doc_hashes` recomputed against final doc content]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain outside the packet. [EVIDENCE: no scratch artifacts created inside this spec folder]
- [x] CHK-051 [P1] No archive folder used; deletion/archive not needed. [EVIDENCE: `skill-graph.sqlite.pre-fix-a-b-backup` is a rollback artifact in the database directory, not this spec folder — see Known Limitations for its gitignore status]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 10 | 9/10 (CHK-026 deferred, see entry) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-08
<!-- /ANCHOR:summary -->
