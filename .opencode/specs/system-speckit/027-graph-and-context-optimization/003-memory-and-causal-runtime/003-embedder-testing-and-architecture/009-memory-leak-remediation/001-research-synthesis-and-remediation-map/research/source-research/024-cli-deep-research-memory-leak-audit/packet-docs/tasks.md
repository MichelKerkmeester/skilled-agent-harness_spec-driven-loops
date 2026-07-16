---
title: "Tasks: 024 CLI Deep Research Memory Leak Audit"
description: "Task plan for fifteen sequential deep-research iterations and synthesis of process/memory leak findings."
trigger_phrases:
  - "024 CLI memory leak tasks"
  - "memory leak deep research tasks"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed fifteen iterations, final synthesis addendum, and recommendation validation."
    next_safe_action: "Open the first remediation packet: remove-project-cancel-safety."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_LEVEL: 3 -->

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

Focus: safety preflight before any long-running CLI executor starts.

- [x] T001 Create Level 3 phase folder and core spec docs (`024-cli-deep-research-memory-leak-audit/`)
- [x] T002 Confirm Claude Code CLI availability and auth for Opus 4.7 / Opus profile (`.opencode/skills/cli-claude-code/SKILL.md`)
- [x] T003 Confirm Codex CLI availability and auth for `gpt-5.5` xhigh fast (`.opencode/skills/cli-codex/SKILL.md`)
- [x] T004 Capture pre-run `sysctl vm.swapusage` and `vm_stat` evidence (`research/logs/`)
- [x] T005 Inventory existing `claude`, `codex`, `ccc search`, `gtimeout`, rerank sidecar, CocoIndex daemon, and MCP helper processes (`research/logs/iteration-007-runtime-measurement.json`)
- [x] T006 Prepare PRE-BOUND SETUP ANSWERS for the Claude Code lane (`research/logs/iteration-002-claude.log` through `iteration-005-claude.log`)
- [x] T007 Prepare PRE-BOUND SETUP ANSWERS for the Codex lane (`research/logs/iteration-006-codex.log` through `iteration-015-codex.log`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Focus: execute the two sequential deep-research lanes with cleanup gates.

- [x] T008 Run iteration 001 with `cli-claude-code` Opus 4.7 / Opus profile (`research/iterations/iteration-001.md`)
- [x] T009 Run iteration 002 with `cli-claude-code` Opus 4.7 / Opus profile (`research/iterations/iteration-002.md`)
- [x] T010 Run iteration 003 with `cli-claude-code` Opus 4.7 / Opus profile (`research/iterations/iteration-003.md`)
- [x] T011 Run iteration 004 with `cli-claude-code` Opus 4.7 / Opus profile (`research/iterations/iteration-004.md`)
- [x] T012 Run iteration 005 with `cli-claude-code` Opus 4.7 / Opus profile (`research/iterations/iteration-005.md`)
- [x] T013 Verify lane A JSONL records and cleanup evidence after every iteration (`research/deep-research-state.jsonl`)
- [x] T014 Document lane A cleanup evidence and unresolved long-lived helper boundaries (`research/research.md`)
- [x] T015 Run iteration 006 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-006.md`)
- [x] T016 Run iteration 007 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-007.md`)
- [x] T017 Run iteration 008 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-008.md`)
- [x] T018 Run iteration 009 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-009.md`)
- [x] T019 Run iteration 010 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-010.md`)
- [x] T020 Verify lane B JSONL records and cleanup evidence after every iteration (`research/deep-research-state.jsonl`)
- [x] T020A Run continuation iteration 011 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-011.md`)
- [x] T020B Run continuation iteration 012 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-012.md`)
- [x] T020C Run continuation iteration 013 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-013.md`)
- [x] T020D Run continuation iteration 014 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-014.md`)
- [x] T020E Run continuation iteration 015 with `cli-codex` `gpt-5.5` xhigh fast (`research/iterations/iteration-015.md`)
- [x] T021 Document lane B cleanup evidence and unresolved long-lived helper boundaries (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Focus: synthesize findings, queue remediation packets, and validate packet docs.

- [x] T022 Produce final research synthesis (`research/research.md`)
- [x] T023 Emit or update research resource map (`research/resource-map.md`)
- [x] T024 Classify all findings by severity and finding class (`research/research.md`)
- [x] T025 Name follow-up remediation packets for every P0/P1 finding (`research/research.md`)
- [x] T026 Update `implementation-summary.md` with research outcome and validation evidence (`implementation-summary.md`)
- [x] T027 Update `checklist.md` with completed evidence (`checklist.md`)
- [x] T028 Run strict spec validation on this phase packet after continuation sync (`checklist.md`). Evidence: `validate.sh ... --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-deferred P0 and P1 tasks are marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remain without an owner and next action.
- [x] Final synthesis exists and names remediation packets.
- [x] Cleanup evidence documents unresolved long-lived helper/process-sweep follow-up; this is not a no-orphan claim.
- [x] Strict spec validation passes after continuation synthesis.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
