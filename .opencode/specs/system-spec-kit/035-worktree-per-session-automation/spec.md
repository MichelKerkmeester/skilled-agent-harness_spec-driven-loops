---
title: "Feature Specification: Worktree-per-AI-session automation"
description: "Auto-create a git worktree + own branch + isolated DBs for each top-level AI session (any runtime), while orchestrated child sessions share their parent's worktree. Launch wrapper + guard hook + hybrid DB isolation + auto-reaper. DESIGN ONLY this packet; code deferred to a quiet tree."
trigger_phrases:
  - "worktree per session automation"
  - "isolate ai sessions git worktree"
  - "launch wrapper child detection guard hook"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/035-worktree-per-session-automation"
    last_updated_at: "2026-05-30T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured the approved worktree-automation design as a packet"
    next_safe_action: "On a quiet tree: run Step-0 DB-relocation boot test, then build the wrapper"
    blockers:
      - "Build deferred to a quiet tree (multi-session contention on main is the very problem)"
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/shared/config.ts"
      - ".opencode/scripts/session-cleanup.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003501"
      session_id: "035-worktree-spec"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Mechanism: launch wrapper (creates+enters worktree before CLI start) + SessionStart guard hook (detect-and-warn). A hook alone cannot relocate an already-started process."
      - "DB isolation: hybrid — symlink node_modules/dist from main, but each worktree gets its own DBs via SPECKIT_CODE_GRAPH_DB_DIR + SPEC_KIT_DB_DIR."
      - "Runtimes: all five (claude, codex, opencode, devin, gemini)."
      - "Cleanup: auto-reaper extending .opencode/scripts/session-cleanup.sh."
      - "Step-0 gate (partial): shared/config.ts getDbDir() reads SPEC_KIT_DB_DIR||SPECKIT_DB_DIR and .db-updated derives from it; SPECKIT_CODE_GRAPH_DB_DIR is honored by mk-code-index-launcher. STILL to verify by boot test: the memory DB file + -wal + .unclean-shutdown marker all relocate under the override."
---
# Feature Specification: Worktree-per-AI-session automation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Designed — code deferred to a quiet tree |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Handoff Criteria** | Step-0 DB-relocation boot test green; a top-level session launched via the wrapper lands in its own worktree + branch + isolated DBs; an orchestrated child shares its parent's worktree; the reaper prunes merged/empty worktrees + orphaned daemons; verified per-runtime. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Multiple AI sessions (Claude Code, OpenCode, Codex, Devin, Gemini) all operate in the **same working tree on `main`**, with **shared, gitignored MCP databases** guarded only by single-writer leases. Measured live: HEAD moved under an active session twice in ~12 minutes; ~20 orphaned code-graph daemons accumulated; the working tree carried 1,500+ daemon-churned files to filter on every commit. This cross-session contention caused real damage in practice — misreading concurrent commits as corruption, double-reverting a good fix, and a tug-of-war over a packet's docs.

### Purpose
When a **top-level (human-launched)** AI session starts, it should run in its **own git worktree + own branch + own DBs**, automatically, for any runtime. An **orchestrated child** (subagent / dispatched task / deep-loop iteration) must **NOT** create a worktree — it shares its parent's. Plus an auto-reaper so worktrees and daemons don't accumulate.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (to build, next session)
- A shared launcher `worktree-session.sh`: child-detection guard → worktree allocate → symlink deps → per-worktree DB env → `exec` the runtime CLI.
- Per-runtime entry points (wrapper aliases / plugin note) for claude, codex, opencode, devin, gemini.
- Child-detection: explicit `AI_SESSION_CHILD=1` injected at dispatch sites + a `git rev-parse --git-common-dir` structural backstop.
- SessionStart guard hooks (detect-and-warn) extending the existing per-runtime hook chains.
- Auto-reaper extending `.opencode/scripts/session-cleanup.sh` (prune merged/empty worktrees + kill orphaned daemons, session-scoped).

### Out of Scope
- **Code this packet** — design only; build deferred to a quiet tree (this session's contention is the very thing the feature fixes).
- Changing sk-git's in-session ask-first rule — the wrapper is a user-opted-in launch config, distinct from in-session AI worktree decisions.

### Files to Change (when built)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/bin/worktree-session.sh | Create | Core launcher (allocate + symlink + DB env + exec) |
| .opencode/skills/system-spec-kit/shared/config.ts + mk-spec-memory-launcher.cjs | Verify/Modify | Confirm memory DB + WAL + marker relocate under SPEC_KIT_DB_DIR (Step-0) |
| cli-codex / cli-opencode / cli-devin dispatch recipes | Modify | Inject AI_SESSION_CHILD=1 into child env |
| .claude/settings.local.json (+ .codex/.gemini/.devin hooks, .opencode/plugins/) | Modify | Add guard-hook step to existing SessionStart chains |
| .opencode/scripts/session-cleanup.sh | Modify | Extend reaper: prune worktrees + orphaned daemons |
| .gitignore | Modify | Ignore .worktrees/ (currently NOT ignored) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Step-0 DB-relocation proven | Boot a daemon with SPEC_KIT_DB_DIR + SPECKIT_CODE_GRAPH_DB_DIR set to /tmp dirs; confirm the sqlite file, `-wal`, and `.unclean-shutdown` marker all land there, not in the shared `mcp_server/database/` |
| REQ-002 | Top-level isolation | Wrapper-launched session lands in a fresh `.worktrees/<runtime>-*` on a new branch; a commit there does not move main's HEAD |
| REQ-003 | Child suppression | With AI_SESSION_CHILD=1 (or inside a worktree per git-common-dir), the wrapper exec's in place — no new worktree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All five runtimes | wrapper + child-marker + guard verified per runtime |
| REQ-005 | Auto-reaper safety | Reaper prunes merged/empty worktrees + orphaned daemons but never touches a sibling's live worktree |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two concurrent wrapper-launched sessions get two distinct worktrees + DB dirs + daemons; editing/committing in one shows zero dirty files in the other.
- **SC-002**: An orchestrated child shares its parent's worktree (no nesting); the reaper keeps worktree + daemon counts bounded.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Memory-DB override may not relocate WAL/marker | Per-worktree isolation incomplete | Step-0 boot test is a hard P0 gate before building |
| Risk | Symlinking deps contradicts current sk-git guidance | Confusion | Document the deliberate per-session override in sk-git |
| Risk | No universal native child signal across runtimes | Accidental nesting OR missed isolation | We set AI_SESSION_CHILD=1 at dispatch sites; structural git-common-dir backstop; default to top-level (isolate) on unknowns |
| Risk | Building on a contended tree | Repeat of this session's collisions | Build on a quiet tree; dogfood by building the wrapper in its own worktree |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking — scope, mechanism, DB strategy, runtimes, and cleanup were decided with the user; the only gate is the Step-0 boot test, which is the first build task.

<!-- /ANCHOR:questions -->
