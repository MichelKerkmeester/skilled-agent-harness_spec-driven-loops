---
title: "Verification Checklist: Lineage and Metadata Repair Runner"
description: "Verification evidence for the graph metadata and lineage repair runner."
trigger_phrases:
  - "lineage metadata repair checklist"
  - "graph metadata repair verification"
  - "memory index scan validation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner"
    last_updated_at: "2026-05-19T20:08:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification evidence"
    next_safe_action: "Stage paths from implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs"
      - "/tmp/scan-post-final4.json"
    session_dedup:
      fingerprint: "sha256:305fa6265d1dc0d6969f1f3865e29ee374bafc1536382df0983084db827e3096"
      session_id: "codex-019-lineage-and-metadata-repair-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lineage and Metadata Repair Runner

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim done until complete |
| **[P1]** | Required | Must complete or document deferral |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` includes REQ-001 through REQ-008.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` describes graph repair, V8 compaction, and lineage repair.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `sqlite3`, Node.js, scan logs, and schema sources were used.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runner syntax passes
  - **Evidence**: `node --check .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` exited 0.
- [x] CHK-011 [P0] Runner is idempotent
  - **Evidence**: Post-repair dry-run reported graph changes 0 and lineage changes 0 for repaired classes.
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: The runner reports validation failures and lineage repair failures in structured JSON.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: Direct-run `.mjs` script matches existing `mcp_server/scripts` maintenance entrypoints.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: Final scan cleared E_LINEAGE, invalid graph schema, invalid tier, and V8 graph metadata failures.
- [x] CHK-021 [P0] Migration dry-run complete
  - **Evidence**: Initial dry-run planned 172 graph files and 337 lineage rows after narrowing over-broad formatting writes.
- [x] CHK-022 [P1] Real migration complete
  - **Evidence**: Real runs wrote `/tmp/repair-graph-metadata-*` backups before mutating files or SQLite state.
- [x] CHK-023 [P1] Residual failures documented
  - **Evidence**: Final scan shows only 3 malformed `description.json` files outside scope.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-024 [P0] Target failure classes cleared
  - **Evidence**: Final scan shows E_LINEAGE 0, invalid graph schema 0, invalid tier 0, and V8 0.
- [x] CHK-025 [P1] Residual failures are outside scope
  - **Evidence**: Final scan shows 3 malformed `description.json` files only.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: Runner uses local filesystem and SQLite paths only.
- [x] CHK-031 [P0] Mutation scope constrained
  - **Evidence**: Runner walks `.opencode/specs` graph metadata and scan-proven lineage ids.
- [x] CHK-032 [P1] Backup safety implemented
  - **Evidence**: Each real run records a `/tmp/repair-graph-metadata-*` backup directory.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and summary synchronized
  - **Evidence**: All docs describe the final 503 to 3 scan result.
- [x] CHK-041 [P1] Commit handoff present
  - **Evidence**: `implementation-summary.md` includes exact staging paths and draft commit message.
- [x] CHK-042 [P2] Parent map updated
  - **Evidence**: `create.sh` injected phase 019 into the parent phase map.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files isolated
  - **Evidence**: Repair backups and scan captures are under `/tmp`.
- [x] CHK-051 [P1] Commit paths listed
  - **Evidence**: `implementation-summary.md` lists exact staging paths.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
