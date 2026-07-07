---
title: "Tasks: Phase 2: update-and-mirror"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "068/002 tasks"
  - "update-and-mirror tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/002-update-and-mirror"
    last_updated_at: "2026-05-05T08:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored tasks.md for Phase 2"
    next_safe_action: "Execute substring sweep + mirror replication, then mark tasks complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-authoring"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: update-and-mirror

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
## Phase 1: Setup (pre-flight)

- [ ] T001 Verify on `main` branch (`git branch --show-current`)
- [ ] T002 Pre-flight `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty
- [ ] T003 Pre-flight `diff -rq .opencode/commands/create/ .codex/prompts/create/` returns empty
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### B.1 — sk-doc internal substring sweep (11 files)
- [ ] T004 Apply 4 fixed-string substitutions to `.opencode/skills/sk-doc/SKILL.md`
- [ ] T005 Apply 4 substitutions to 6 `.opencode/skills/sk-doc/references/global/*.md` files
- [ ] T006 Apply 4 substitutions to 3 `.opencode/skills/sk-doc/references/specific/*.md` files
- [ ] T007 Apply 4 substitutions to `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md`

### B.2 — /create:* command canonical substring sweep (11 files)
- [ ] T008 Apply 4 substitutions to 4 `.opencode/commands/create/{agent,changelog,feature-catalog,testing-playbook}.md`
- [ ] T009 Apply 4 substitutions to `.opencode/commands/create/README.txt`
- [ ] T010 Apply 4 substitutions to 6 `.opencode/commands/create/assets/create_*_{auto,confirm}.yaml`

### B.3 — @create + install guide substring sweep (2 files)
- [ ] T011 Apply 4 substitutions to `.opencode/agents/create.md`
- [ ] T012 Apply 4 substitutions to `.opencode/install_guides/SET-UP - Opencode Agents.md`

### Mirror replication (`.claude/.codex/`)
- [ ] T013 `rsync -a --delete .opencode/commands/create/ .claude/commands/create/`
- [ ] T014 `rsync -a --delete .opencode/commands/create/ .codex/prompts/create/`
- [ ] T015 Verify byte-identity: `diff -rq .opencode/commands/create/ .claude/commands/create/` empty
- [ ] T016 Verify byte-identity: `diff -rq .opencode/commands/create/ .codex/prompts/create/` empty

### .gemini TOML regeneration (4 files)
- [ ] T017 Regenerate `.gemini/commands/create/agent.toml` (re-escape from updated `.opencode/commands/create/agent.md`)
- [ ] T018 Regenerate `.gemini/commands/create/changelog.toml`
- [ ] T019 Regenerate `.gemini/commands/create/feature-catalog.toml`
- [ ] T020 Regenerate `.gemini/commands/create/testing-playbook.toml`
- [ ] T021 `tomllib.loads()` parse-check on all 4 `.gemini/*.toml` (each exits 0)

### @create runtime mirrors (4 files)
- [ ] T022 `cp .opencode/agents/create.md .claude/agents/create.md`
- [ ] T023 `cp .opencode/agents/create.md .gemini/agents/create.md`
- [ ] T024 Regenerate `.codex/agents/create.toml` (preserve sandbox + Path Convention; rebuild body)
- [ ] T025 `tomllib.loads()` parse-check on `.codex/agents/create.toml` exits 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T026 Residual `rg --no-config --no-ignore-vcs` returns ZERO hits in active scope
- [ ] T027 Sample 3 random updated files; visually confirm path-strings reflect NEW layout
- [ ] T028 Stay on main: `git branch --show-current` returns `main`
- [ ] T029 Commit with prescribed message: `feat(sk-doc): update path references to assets/ root layout + mirror across 4 runtimes (068/002)`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T029 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] One commit on main; mirror parity verified across 4 runtimes
- [ ] Phase 3 (003-verify-and-ship) unblocked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md` (post-execution)
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../001-relocate/implementation-summary.md` (commit ccd73ef55)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
