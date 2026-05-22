---
title: "Tasks: CLI Process Memory Leak Deep Research"
description: "Task list for a telemetry-gated 10-iteration deep-research sweep of system-spec-kit memory leaks and process containment risks."
trigger_phrases:
  - "memory leak research tasks"
  - "CLI process cleanup tasks"
  - "deep research 10 iterations"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research"
    last_updated_at: "2026-05-22T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Defined research execution tasks."
    next_safe_action: "Complete preflight checks before iteration dispatch."
    blockers:
      - "Research iterations have not been run."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-cli-process-memory-leak-deep-research"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Process Memory Leak Deep Research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable without launching concurrent CLI dispatches |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold Level 3 packet under `002-spec-memory-stack/020-cli-process-memory-leak-deep-research`.
- [x] T002 Author `spec.md` with target path, executor split, memory telemetry gates, and process cleanup requirements.
- [x] T003 Author `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` from system-spec-kit templates.
- [ ] T004 Verify Claude CLI auth and exact Opus 4.7 model flag before dispatch.
- [ ] T005 Verify Codex CLI auth and `gpt-5.5` xhigh fast route before dispatch.
- [ ] T006 Capture preflight `sysctl vm.swapusage`, `vm_stat`, and process inventory.
- [ ] T007 Initialize or resume local `/spec_kit:deep-research` state under this packet's `research/` directory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Run iteration 001 via `cli-claude-code` Opus route to inventory process-spawn entrypoints.
- [ ] T009 Run iteration 002 via `cli-claude-code` Opus route to audit deep-research state, locks, reducers, and cleanup.
- [ ] T010 Run iteration 003 via `cli-claude-code` Opus route to audit deep-review and AI council dispatch behavior.
- [ ] T011 Run iteration 004 via `cli-claude-code` Opus route to audit self-invocation guards and nested CLI loops.
- [ ] T012 Run iteration 005 via `cli-claude-code` Opus route to audit Apple Silicon swap, wired memory, and daemon classification.
- [ ] T013 Run iteration 006 via `cli-codex` GPT-5.5 xhigh fast route to independently map process owners and cleanup gaps.
- [ ] T014 Run iteration 007 via `cli-codex` GPT-5.5 xhigh fast route to audit MCP server, context server, reducer, and save-workflow handles.
- [ ] T015 Run iteration 008 via `cli-codex` GPT-5.5 xhigh fast route to audit `ccc search`, reranker sidecar, Ollama, embedder, `gtimeout`, and browser/devtools leftovers.
- [ ] T016 Run iteration 009 via `cli-codex` GPT-5.5 xhigh fast route to audit stale locks, pause files, interrupted sessions, and resume behavior.
- [ ] T017 Run iteration 010 via `cli-codex` GPT-5.5 xhigh fast route to synthesize the leak taxonomy and fix backlog.
- [ ] T018 After every iteration, record pre/post memory telemetry and verify dispatcher-owned process cleanup before proceeding.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Confirm all iteration markdown files are non-empty and cite source evidence.
- [ ] T020 Confirm every iteration appended a valid JSONL delta with executor metadata.
- [ ] T021 Confirm cleanup evidence shows no unexpected `claude -p`, `codex exec`, `ccc search`, `gtimeout`, reranker sidecar, stale lock, or detached child process after the run.
- [ ] T022 Produce `research/research.md` with ranked P0/P1/P2 remediation backlog.
- [ ] T023 Refresh `description.json`, `graph-metadata.json`, and parent phase metadata after synthesis.
- [ ] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`.
- [ ] T025 Index the packet with Spec Kit Memory after synthesis.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All deep-research execution tasks are marked `[x]`, or blocked tasks document a STOP_BLOCKED memory-pressure reason.
- [ ] No `[B]` blocked tasks remain without an owner and next action.
- [ ] Research synthesis names every suspected leak class, evidence source, severity, and fix owner.
- [ ] Final telemetry confirms no unexpected dispatcher-owned process remains.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification Checklist**: See `checklist.md`.
- **Decision Record**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
