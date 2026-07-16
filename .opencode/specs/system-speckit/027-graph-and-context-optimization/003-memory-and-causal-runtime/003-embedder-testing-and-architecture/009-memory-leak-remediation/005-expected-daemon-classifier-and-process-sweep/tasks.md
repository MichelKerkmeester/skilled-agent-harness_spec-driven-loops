---
title: "Tasks: Expected Daemon Classifier and Process Sweep"
description: "File-scoped tasks for the dry-run process sweep and classifier taxonomy."
trigger_phrases:
  - "expected-daemon-classifier-and-process-sweep"
  - "memory leak 5"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep"
    last_updated_at: "2026-05-22T13:13:51Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-005-daemon-classifier-sweep"
    next_safe_action: "start-006-cocoindex-remove-cancel"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0505050505050505050505050505050505050505050505050505050505050505"
      session_id: "009-memory-leak-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 005 has no live termination behavior."
      - "Sidecar, ccc, browser, and external MCP rows preserve by default."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Expected Daemon Classifier and Process Sweep

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

- [x] T001 Read parent arc spec, phase spec, remediation-map items #6 and #15, source research packet 020 daemon/external-tool sections, source research packet 024 `mcp-host-session-process-sweep`, phase 002 harness/tests, and phase 004 `processAlive` semantics.
- [x] T002 Replace generic `plan.md` with the concrete module plan naming `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`.
- [x] T003 Validate the phase folder after the `plan.md` update with `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict`.
- [x] T004 Replace generic `tasks.md` with this file-scoped task list and validate the phase folder again.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Extend `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` with exported `getProcessAncestry(pid, rows)` using the existing parsed `ps` rows.
- [x] T006 Add `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` with `planSweep(inventory, options)` returning `SweepPlan` rows and summary counts.
- [x] T007 Implement sweep eligibility rules in `process-sweep.ts`: refuse self PID, ancestors, expected warm daemons, unknown owners, and EPERM-alive rows; only allow stale PID lock or orphaned project daemon after owner identity is known.
- [x] T008 Extend `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` taxonomy with explicit `external-mcp-stdio`, `browser-session`, and `ccc-daemon` buckets where command evidence supports them.
- [x] T009 Add CLI handling in `process-sweep.ts` for `plan` default dry-run and `fixture` while keeping live termination deferred and non-destructive. Note: phase 014 B6 removed the misleading dry-run `apply --confirmed <token>` alias.
- [x] T010 Add `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` covering current PID, ancestors, EPERM, stale PID locks, sidecars, `ccc` daemons, external MCP stdio, browser sessions, and unknown owners.
- [x] T011 Update existing `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` only if taxonomy assertions require it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run targeted sweep Vitest: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-sweep.vitest.ts --config mcp_server/vitest.config.ts`.
- [x] T013 Run sweep plus existing harness Vitest: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-sweep.vitest.ts scripts/tests/process-memory-harness.vitest.ts --config mcp_server/vitest.config.ts`.
- [x] T014 Run `npm run typecheck --workspace=@spec-kit/scripts` from `.opencode/skills/system-spec-kit`.
- [x] T015 Run `npm run build --workspace=@spec-kit/scripts` from `.opencode/skills/system-spec-kit`.
- [x] T016 Run OpenCode alignment verification for the changed `.opencode/skills/system-spec-kit` scope.
- [x] T017 Fill `implementation-summary.md` with completed metadata, evidence, limitations, and `## Commit Handoff` using absolute paths.
- [x] T018 Update the parent arc `spec.md` phase status and remediation map evidence so SC-002 is satisfied.
- [x] T019 Run strict validation for the phase folder and parent arc.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 evidence shows process sweep defaults to inventory and refuses unsafe destructive actions.
- [x] REQ-002 evidence shows expected daemons and leaked helpers are classified separately without broad process-kill patterns.
- [x] SC-001 fixtures cover ancestors, EPERM, stale PIDs, sidecars, `ccc` daemons, external MCP stdio, browser sessions, and unknown owners.
- [x] SC-002 evidence updates this phase summary and parent arc status/handoff notes.
- [x] No code path sends process termination signals in phase 005.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase 002 harness**: `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
- **Phase 004 lock semantics**: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts`
- **Source packet 020**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- **Source packet 024**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`
<!-- /ANCHOR:cross-refs -->
