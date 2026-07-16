---
title: "Verification Checklist: 004 failed-embedding-cleanup"
description: "Verification Date: 2026-05-14"
trigger_phrases:
  - "failed embedding cleanup checklist"
  - "repair failed embeddings verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup"
    last_updated_at: "2026-05-14T11:12:59Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded verification failures"
    next_safe_action: "Install CMake or repair Metal runtime, then rerun live script"
    blockers:
      - "llama-cpp provider runtime unavailable"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333334"
      session_id: "cli-codex-004-failed-embedding-cleanup"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 004 failed-embedding-cleanup

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: source anchors and acceptance criteria present.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: architecture and data flow sections.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `better-sqlite3` and `sqlite-vec` loaded; embedding runtime unavailable.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Script exists and is executable. Evidence: `chmod +x` applied to `repair-failed-embeddings.mjs`.
- [x] CHK-011 [P0] No source modifications under shared embeddings or retry manager. Evidence: only new script plus packet docs modified.
- [x] CHK-012 [P1] Error handling implemented. Evidence: per-row `ERROR` lines include id, file_path, and message.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: ESM script, bracketed module logs, `better-sqlite3`, `sqlite-vec`, short transactions.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Dry-run preview works. Evidence: `failed_count=214`, first five rows printed, `processed=0`.
- [ ] CHK-021 [P0] Live repair drops failed count. FAIL: live runs ended with `failed=214`.
- [ ] CHK-022 [P1] Idempotent success rerun shows 0 processed. FAIL: no successful repair occurred, so failed rows remain selectable.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: provider failure surfaced as `Embedding provider returned null` for all processed rows.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: runtime dependency blocker.
- [x] CHK-FIX-002 [P0] Producer inventory completed. Evidence: `vec_memories` write pattern read from `vector-index-mutations.ts`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: direct invocation script has no in-code consumers.
- [x] CHK-FIX-004 [P0] Algorithm invariant stated. Evidence: plan says no success status until vector write succeeds.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: Metal failed, CPU fallback attempted, CMake download blocked by network.
- [x] CHK-FIX-007 [P1] Evidence pinned to concrete commands in this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented for CLI args.
- [x] CHK-032 [P1] No bulk delete or memory_index row deletion used.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/summary synchronized around blocked status.
- [x] CHK-041 [P1] Code comments adequate and limited.
- [x] CHK-042 [P2] README not applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created in packet.
- [x] CHK-051 [P1] No scratch cleanup needed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Acceptance Criterion | Result | Evidence |
|---------------------|--------|----------|
| Script exists, has shebang, executable | PASS | Created `repair-failed-embeddings.mjs`, ran `chmod +x` |
| Dry-run preview matches failed count | PASS | Dry-run `failed_count=214`; DB status query `failed=214` |
| Live run drops failed count | FAIL | Live provider failed; ending DB status query `failed=214` |
| Idempotent rerun shows 0 processed | FAIL | No successful repair occurred, rows remain failed |
| Per-row errors include id, file_path, message | PASS | Live output emitted `ERROR id=... file_path=... error="Embedding provider returned null"` |
| Summary includes counts and elapsed time | PASS | See `implementation-summary.md` |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->
