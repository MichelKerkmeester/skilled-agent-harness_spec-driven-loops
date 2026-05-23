---
title: "Tasks: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers"
description: "Canonical-anchor task ledger for F18, F20, F25, F57, F62, F73, and F91."
trigger_phrases:
  - "arc 010 003 003 tasks"
  - "sidecar-client p1 constructor helpers tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-sidecar-client-p1-fixes"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
---
# Tasks: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers

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

- [x] T000 Scaffold Level 2 packet docs with canonical anchors and scratch `.gitkeep`.
- [x] T001 Run strict validation on scaffold; exit 0.
- [x] T002 Read this packet's `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- [x] T003 Read the 010/003 phase-parent `spec.md` for scope discipline.
- [x] T004 Read registry rows for F18, F20, F25, F57, F62, F73, and F91.
- [x] T005 Read F37 and F79 precedents plus canonical sibling anchor template.
- [x] T006 Read full `sidecar-client.ts`, `execution-router.ts`, and `sidecar-hardening.vitest.ts` before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Fix F18 in `sidecar-client.ts`: keep `SidecarClientOptions` production-only and overload constructor for `SidecarClientTestOptions`.
- [x] T011 Add F18 negative compile fixture in `sidecar-client.testables.ts`.
- [x] T012 Fix F20: export canonical `EmbedOptions` from `sidecar-client.ts` and import it in `execution-router.ts`.
- [x] T013 Fix F25: inline trivial single-call helpers and keep only meaningful validation/default/env/termination seams.
- [x] T014 Fix F57: consolidate SIGTERM/SIGKILL grace sequencing into one helper with `gracePeriodMs`.
- [x] T015 Fix F62: replace response assertion with discriminator narrowing and structured unknown-type error.
- [x] T016 Fix F73: delete `SidecarClient.ready()` and update tests to use real embed paths.
- [x] T017 Fix F91: flatten `embed()` validation through `validateEmbedInput()`.
- [x] T018 Add F57 and F62 runtime fixture coverage in `sidecar-hardening.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts`.
- [x] T021 Run `npm run typecheck --workspace=@spec-kit/mcp-server`.
- [x] T022 Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders`.
- [x] T023 Fill `checklist.md` with file:line evidence for all seven P1 findings.
- [x] T024 Fill `decision-record.md` with ADRs for constructor split, termination helper, and response narrowing.
- [x] T025 Fill `implementation-summary.md` with completed status, verification evidence, and commit handoff.
- [x] T026 Run strict validation for this packet folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] F18, F20, F25, F57, F62, F73, and F91 are closed with evidence.
- [x] F18, F57, and F62 fixtures pass.
- [x] Full embedders vitest, typecheck, alignment drift check, and strict validation exit 0.
- [x] `implementation-summary.md` contains `## Commit Handoff` with absolute changed-file paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research Registry**: `../../001-deep-research-drift-and-simplification/research/findings-registry.json`
- **F37 Precedent**: `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/decision-record.md`
- **F79 Precedent**: `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] ARCH-001 Preserve sidecar stdout JSON-line request/response contract.
- [x] ARCH-002 Keep sidecar client usable as execution-router adapter without exposing `ready()`.
- [x] ARCH-003 Keep changes scoped to approved files; no sidecar-worker, launcher, reindex, barrel, registry, or schema edits.
<!-- /ANCHOR:architecture-tasks -->
