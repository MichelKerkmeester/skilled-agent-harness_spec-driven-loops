---
title: "Implementation Plan: Worktree-per-AI-session automation"
description: "Per-component build plan for the worktree launch wrapper + child-detection + guard hooks + hybrid DB isolation + auto-reaper, gated on a Step-0 DB-relocation boot test. Design only this packet."
trigger_phrases:
  - "worktree automation plan"
  - "launch wrapper hybrid db isolation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/005-worktree-per-session-automation"
    last_updated_at: "2026-05-30T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the per-component build plan"
    next_safe_action: "Run the Step-0 boot test on a quiet tree"
    blockers: ["Code deferred to a quiet tree"]
    key_files: [".opencode/bin/worktree-session.sh (to create)"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003502"
      session_id: "035-worktree-plan"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Worktree-per-AI-session automation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash launcher; per-runtime hook configs (JSON / OpenCode plugin); env-based DB routing |
| **Framework** | sk-git worktree conventions; existing per-runtime SessionStart hooks; session-cleanup.sh |
| **Storage** | Per-worktree DBs via SPECKIT_CODE_GRAPH_DB_DIR + SPEC_KIT_DB_DIR; shared node_modules/dist via symlink |
| **Testing** | Boot test (DB relocation), two-concurrent-session test, child-suppression test, reaper test, per-runtime smoke |

### Overview
A single `worktree-session.sh` does the work; per-runtime entry points call it. The hard prerequisite is the Step-0 boot test proving the memory DB fully relocates under the env override. Build on a quiet tree; dogfood by building the wrapper inside its own worktree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Step-0 boot test green (memory DB + WAL + marker relocate under SPEC_KIT_DB_DIR)
- [ ] Quiet tree confirmed (no other active sessions committing to main)
- [ ] `.worktrees/` added to `.gitignore` (currently NOT ignored)

### Definition of Done
- [ ] Top-level isolation + child suppression verified
- [ ] All five runtimes smoke-tested
- [ ] Reaper prunes safely without touching sibling worktrees
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Launch wrapper (the only thing that can relocate CWD before a CLI starts) + detect-and-warn guard hook + env-routed per-worktree DBs + session-scoped reaper.

### Key Components
- **worktree-session.sh**: resolve root → child guard → allocate worktree → symlink deps → export DB env → cd + exec CLI.
- **child-detection**: `AI_SESSION_CHILD=1` (set by us at dispatch) + `git rev-parse --git-common-dir` structural backstop.
- **guard hooks**: extend existing SessionStart chains; warn if top-level on shared main.
- **reaper**: extend session-cleanup.sh.

### Data Flow
Human runs `claude` → wrapper detects top-level → creates `.worktrees/claude-<slug>` on `work/claude/<slug>` → symlinks node_modules+dist → exports per-worktree DB dirs → exec claude in the worktree. Orchestrated child inherits `AI_SESSION_CHILD=1` → wrapper exec's in place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

New automation across launch + hook + cleanup surfaces; the only code-behavior change is the env-routed DB dir (already partially supported).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/config.ts` getDbDir() | Reads SPEC_KIT_DB_DIR\|\|SPECKIT_DB_DIR | Verify it routes the sqlite file + WAL + marker (not just .db-updated) | Step-0 boot test |
| `mk-code-index-launcher.cjs` | Honors SPECKIT_CODE_GRAPH_DB_DIR | Unchanged (confirmed) | Boot test |
| per-runtime SessionStart hooks | Prime session context | Add a guard step | Raw-CLI-on-main warns; worktree silent |
| session-cleanup.sh | Reaps session MCP descendants | Extend: prune worktrees + orphaned daemons | Sibling worktree untouched |
| cli-* dispatch recipes | Spawn child runs | Inject AI_SESSION_CHILD=1 | Child exec's in place |

Required inventories:
- Boot test the DB override before any build.
- Confirm each cli-* dispatch site so the child marker is set everywhere children spawn.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (the gate)
- [ ] Step-0 boot test: SPEC_KIT_DB_DIR + SPECKIT_CODE_GRAPH_DB_DIR → /tmp; confirm sqlite + WAL + .unclean-shutdown relocate
- [ ] Add `.worktrees/` to `.gitignore`; confirm a quiet tree

### Phase 2: Core Implementation
- [ ] worktree-session.sh (allocate + symlink + DB env + exec) with child-detection
- [ ] Per-runtime entry points + AI_SESSION_CHILD=1 at cli-* dispatch sites
- [ ] Guard-hook step in each runtime's SessionStart chain
- [ ] Reaper extension in session-cleanup.sh

### Phase 3: Verification
- [ ] Top-level isolation + child suppression + two-concurrent-session test
- [ ] Per-runtime smoke + reaper safety
- [ ] Document the wrapper + symlink-deps override in sk-git
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Boot | DB relocation | env + daemon boot + path check |
| Integration | top-level isolate / child suppress / 2 concurrent | wrapper runs + git status |
| Safety | reaper | prune merged/empty; assert sibling live worktree untouched |
| Smoke | each of 5 runtimes | one wrapper launch per runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SPEC_KIT_DB_DIR memory relocation | Internal | Partially confirmed | Hybrid isolation incomplete — Step-0 gate |
| SPECKIT_CODE_GRAPH_DB_DIR | Internal | Confirmed | Code-graph isolation |
| Quiet tree | Environment | Pending | Building amid contention repeats this session's errors |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: wrapper misbehaves or a daemon races across worktrees.
- **Procedure**: wrappers are opt-in shell aliases — remove the alias to revert to raw CLI on main. The reaper and hooks are additive; revert their commits independently. No data migration.
<!-- /ANCHOR:rollback -->
