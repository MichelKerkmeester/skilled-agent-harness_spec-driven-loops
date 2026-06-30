---
title: "Tasks: Phase 2: skill-folder-rename [template:level_1/tasks.md]"
description: "Completed Phase 002 task ledger for the sk-improve-prompt to sk-prompt folder rename."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-06T11:00:06Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: folder renamed, 9 files updated, advisor rebuilt"
    next_safe_action: "Phase 003 opencode internals"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/README.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-skill-folder-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: skill-folder-rename

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

- [x] T001 Read authoritative parent and phase docs (`spec.md`, `resource-map.md`, `002-skill-folder-rename/spec.md`) - evidence: all listed docs read before edits.
- [x] T002 Verify pre-state (`.opencode/skills/sk-improve-prompt/`) - evidence: `ls .opencode/skills/sk-improve-prompt/` returned `README.md`, `SKILL.md`, `assets`, `changelog`, `graph-metadata.json`, `references`.
- [x] T003 [P] Inspect worktree and scoped existing diffs - evidence: `git status --short`, `git diff --name-only`, and targeted diffs showed pre-existing user work in `graph-metadata.json` and `skill-graph.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rename skill folder to `.opencode/skills/sk-prompt/` - evidence: `git mv` was attempted and blocked by `.git/index.lock`; physical `mv` completed.
- [x] T005 Update eight skill-local self-reference files - evidence: scoped replacement completed in `SKILL.md`, `README.md`, `graph-metadata.json`, `assets/cli_prompt_quality_card.md`, `references/depth_framework.md`, and three changelog files.
- [x] T006 Update `skill-graph.json` prompt skill keys and refs - evidence: `families`, `adjacency`, `signals`, and `skill_advisor.enhances` now use `sk-prompt`.
- [x] T007 Retarget changelog symlink - evidence: `.opencode/changelog/sk-prompt -> ../skill/sk-prompt/changelog`; old symlink path absent.
- [x] T008 Rebuild advisor state - evidence: compiled `handleAdvisorRebuild({ force: true })` returned rebuilt true, final generation `1213 -> 1214`, freshness `stale -> live`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify post-state folder and frontmatter - evidence: `ls .opencode/skills/sk-prompt/SKILL.md` succeeded and `sed -n '1,12p'` showed `name: sk-prompt`.
- [x] T010 Verify old-name absence in scoped files - evidence: `rg -n "sk-improve-prompt" .opencode/skills/sk-prompt .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` returned no matches.
- [x] T011 Verify JSON validity - evidence: `jq . .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` exited 0.
- [x] T012 Verify advisor status - evidence: compiled `handleAdvisorStatus(...)` reported freshness `live`, generation `1214`.
- [x] T013 Update phase documentation - evidence: `implementation-summary.md`, `tasks.md`, and `spec.md` continuity updated for Phase 002 completion.
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
