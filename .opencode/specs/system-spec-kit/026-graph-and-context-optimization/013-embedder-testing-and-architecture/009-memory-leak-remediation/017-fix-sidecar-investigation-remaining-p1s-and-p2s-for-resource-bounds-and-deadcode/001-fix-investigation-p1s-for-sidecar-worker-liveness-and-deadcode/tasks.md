---
title: "Tasks: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code"
description: "Canonical-anchor task ledger for F5, F14, F19, F26, F30, F94, and F95."
trigger_phrases:
  - "arc 010 003 001 tasks"
  - "sidecar-worker p1 liveness deadcode tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-sidecar-worker-p1-fixes"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030010100030010100030010100030010100030010100030010100030010"
      session_id: "010-003-001-sidecar-worker-p1"
      parent_session_id: null
    completion_pct: 100
---
# Tasks: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Read this packet's `spec.md`, `tasks.md`, and `checklist.md`.
- [x] T001 Read the 010/003 phase-parent `spec.md` for scope discipline.
- [x] T002 Read registry rows and research themes for F5, F14, F19, F26, F30, F94, and F95.
- [x] T003 Read arc 010/002 liveness precedent and canonical sibling anchor template.
- [x] T004 Read full `sidecar-worker.ts` and `sidecar-hardening.vitest.ts` before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Rewrite `plan.md`, `tasks.md`, and `checklist.md` with canonical anchors from arc 010/002/004.
- [x] T011 Fix F19 and F26 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`: inline trivial single-call helper indirection and keep only helpers with intent or test-seam value.
- [x] T012 Fix F5 in `sidecar-worker.ts`: collapse model fallback to env/config/default and warn before defaulting when both explicit sources are empty.
- [x] T013 Fix F30 in `sidecar-worker.ts`: emit worker errors with canonical `{ phase, code, detail }` fields.
- [x] T014 Fix F14 in `sidecar-worker.ts`: structured parent liveness with `pid-1-orphaned`, `kill-0-eperm`, `kill-0-esrch`, `ok`, and `unknown` reasons.
- [x] T015 Fix F94 in `sidecar-worker.ts`: recover parse ids for partial JSON errors and exit 1 with stderr for unparseable input.
- [x] T016 Fix F95 in `sidecar-worker.ts`: evict rejected provider promise while preserving success-cache permanence.
- [x] T017 Add F14, F94, and F95 fixture coverage in `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts`.
- [x] T021 Run `npm run typecheck --workspace=@spec-kit/mcp-server`.
- [x] T022 Fill `checklist.md` with file:line evidence for all seven P1 findings.
- [x] T023 Fill `implementation-summary.md` with completed status, 100 percent completion, verification evidence, and commit handoff.
- [x] T024 Create or append `decision-record.md` with ADRs for F14, F94, and F95.
- [x] T025 Run strict validation for this packet folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] F5, F14, F19, F26, F30, F94, and F95 are closed with evidence.
- [x] Seven new fixture assertions for F14, F94, and F95 pass.
- [x] Targeted vitest, typecheck, and strict validation exit 0.
- [x] `implementation-summary.md` contains `## Commit Handoff` with absolute changed-file paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research**: `../../001-deep-research-drift-and-simplification/research/research.md`
- **Registry**: `../../001-deep-research-drift-and-simplification/research/findings-registry.json`
- **F88 Precedent**: `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] ARCH-001 Preserve worker stdout JSON-line response contract for client compatibility.
- [x] ARCH-002 Keep worker provider success cache permanent and evict only rejection state.
- [x] ARCH-003 Keep changes scoped to the approved files; no sidecar-client, execution-router, launcher, reindex, registry, schema, or index edits.
<!-- /ANCHOR:architecture-tasks -->
