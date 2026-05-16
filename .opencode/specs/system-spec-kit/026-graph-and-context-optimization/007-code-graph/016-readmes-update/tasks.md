---
title: "Tasks: System Code Graph README Update"
description: "Task list for the README-only system-code-graph documentation update packet."
trigger_phrases:
  - "013 readmes update tasks"
  - "system code graph readme tasks"
  - "sk-doc readme tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/016-readmes-update"
    last_updated_at: "2026-05-14T17:49:15Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-013"
    recent_action: "Completed README validation, strict packet validation and git staging attempt"
    next_safe_action: "Stage and commit scoped files when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/database/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/utils/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tests/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-013-readmes-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Code Graph README Update

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

- [x] T001 Confirm branch remains `main`.
- [x] T002 Run pre-check for existing `013-*` packet.
- [x] T003 [P] Read sk-doc README template guidance.
- [x] T004 [P] Read system-spec-kit Level 1 template guidance.
- [x] T005 [P] Check packet 010 status for MCP rename terminology.
- [x] T006 Scaffold 013 Level 1 packet at the user-provided path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Inventory all README files under `.opencode/skills/system-code-graph/`.
- [x] T008 Classify authored READMEs by template variant.
- [x] T009 Rewrite root skill README using `skill_readme_template.md`.
- [x] T010 Rewrite blank database README using `readme_code_template.md`.
- [x] T011 Refresh handlers README using `readme_code_template.md`.
- [x] T012 Refresh library README using `readme_code_template.md`.
- [x] T013 Refresh utils README using `readme_code_template.md`.
- [x] T014 Refresh stress test README using `readme_code_template.md`.
- [x] T015 Refresh tests README using `readme_code_template.md`.
- [x] T016 Refresh tools README using `readme_code_template.md`.
- [x] T017 Leave third-party node_modules dependency READMEs untouched.
- [x] T018 Update 013 packet docs with scope, plan and task evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run sk-doc README validator on every edited README.
- [x] T020 Run local README link resolution check.
- [x] T021 Run `git diff --check` and fix trailing whitespace findings.
- [x] T022 Run strict 013 packet validation.
- [B] T023 Stage only the 013 packet and edited authored README files - blocked by `.git/index.lock` sandbox denial.
- [x] T024 Attempt requested git delivery and report sandbox block.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] README and packet validation passed.
- [x] Commit SHA recorded or uncommitted sandbox block reported.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
