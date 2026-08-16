---
title: "Tasks: Phase 3 integration-and-tests"
description: "Task ledger for test completion, install transition, in-session verification, and docs for pi-fast-mode-w-subagent-support."
trigger_phrases:
  - "003-integration-and-tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs"
    next_safe_action: "Execute phase plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 3: integration-and-tests

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

- [ ] T301 Review upstream tests for integration gaps (config scope resolution, indicator fallback) (tests/)
- [ ] T302 Add integration test cases (config scopes, status fallback path) (tests/)
- [ ] T303 Run `npm run typecheck` + `npm test`; capture both exit 0 (evidence → checklist.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T304 Record pre-state: `pi list`, `npm ls` in both scopes, settings packages list (snapshot for rollback)
- [ ] T305 `pi remove npm:pi-gpt-fast-mode --approve`; `--legacy-peer-deps` fallback in `.pi/npm` if the omplike peer conflict recurs
- [ ] T306 `pi install <fork source>` `--approve` (local path default per open question)
- [ ] T307 Verify post-state: `pi list` shows fork only, `npm ls` both scopes, settings packages sorted, no stray files (`git status --short .pi/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T308 `/fast on`: message shown, config persisted, `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` in process env; widget indicator visible with custom statusline footer active
- [ ] T309 Spawn subagent/child pi: env inherited, fast mode applied on a supported model; capture child session output
- [ ] T310 `/fast off` and toggle round-trip; `/fast` unknown arg shows usage
- [ ] T311 PLUGINS.md: add fork entry (alphabetical position), remove pi-gpt-fast-mode entry, versions accurate (.pi/PLUGINS.md)
- [ ] T312 `sync-pi-configs.sh --check` exits 0
- [ ] T313 Commit `.pi/` changes in Public repo; record all evidence in checklist.md; close phase docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Handoff criteria met: installed, pi-gpt-fast-mode removed, in-session + subagent verification recorded, docs + sync + commit done
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
