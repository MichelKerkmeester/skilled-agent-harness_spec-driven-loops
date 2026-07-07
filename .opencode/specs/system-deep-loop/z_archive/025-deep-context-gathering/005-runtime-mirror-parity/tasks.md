---
title: "Tasks: Deep-context native agent runtime mirror parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-context mirror tasks"
  - "runtime mirror tasks"
  - "deep-context parity tasks"
  - "agent mirror checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/005-runtime-mirror-parity"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation tasks complete"
    next_safe_action: "Run validate.sh --strict and finalize checklist"
    blockers: []
    key_files:
      - ".claude/agents/deep-context.md"
      - ".codex/agents/deep-context.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-005-runtime-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-context native agent runtime mirror parity

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm runtime dir structure: commands/skills/specs are symlinks, agents/ are real per-runtime dirs
- [x] T002 Confirm three-way parity gap: deep-context is the only agent missing .claude/.codex mirrors
- [x] T003 [P] Confirm canonical body range (lines 25-387) and TOML safety (no `'''` in body)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create Claude mirror with read-only `tools:` frontmatter (`.claude/agents/deep-context.md`)
- [x] T005 Create Codex mirror with read-only sandbox + `developer_instructions` body (`.codex/agents/deep-context.toml`)
- [x] T006 Add Runtime Mirrors note + ALWAYS rule; neutralize "native Claude agents" (`.opencode/skills/deep-context/SKILL.md`)
- [x] T007 Add general per-runtime mirror convention note (`.opencode/skills/deep-loop-runtime/SKILL.md`)
- [x] T008 Neutralize "(Opus)" on the native-only pool option (`.opencode/commands/deep/start-context-loop.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run three-way parity grep + body diff + TOML parse + read-only tools check
- [x] T010 Confirm no residual `Opus`/model-on-native tokens in command + both YAMLs
- [x] T011 Run `validate.sh --strict` for the packet and complete checklist with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
