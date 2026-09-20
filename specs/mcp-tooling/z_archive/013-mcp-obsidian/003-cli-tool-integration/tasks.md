---
title: "Tasks: Phase 3 — CLI tool integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian cli integration tasks"
  - "obsidian-cli install tasks"
  - "mcp-obsidian phase 3 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/003-cli-tool-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 3 CLI-integration tasks"
    next_safe_action: "Confirm Phase 2 CLI decision, then start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-tool-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — CLI tool integration

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

- [ ] T001 Confirm Phase 2's locked CLI decision (chosen CLI + install method) from `../002-tool-selection-and-scaffold/`
- [ ] T002 Inventory `mcp-click-up`'s `clickup-cli/` (`setup.sh` + `requirements.txt`) as the mirror reference
- [ ] T003 [P] Confirm the CLI's install channel (pipx/pip/npm/brew) and auth/vault-path config-store path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp-servers/obsidian-cli/{README.md, setup.sh, requirements.txt|package.json}` per the chosen install method
- [ ] T005 Author `scripts/install.sh` — installs the CLI, PRINTS (never writes) any MCP config snippet, supports `--check-only`
- [ ] T006 Author `scripts/doctor.sh` — read-only diagnostics
- [ ] T007 Author `references/<cli>-commands.md` — CLI command catalog
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `install.sh` and `install.sh --check-only`; confirm the CLI lands on `PATH`
- [ ] T009 Run `doctor.sh`; confirm green (or mark documented-unproven if headless-blocked); confirm no tokens in the repo
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] CLI installs via `install.sh`; `doctor.sh` green (or documented-unproven)
- [ ] `references/<cli>-commands.md` present; CLI registered in NO config file; no tokens committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../005-skill-authoring/` (may run in parallel with `../004-mcp-server-integration/`)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
