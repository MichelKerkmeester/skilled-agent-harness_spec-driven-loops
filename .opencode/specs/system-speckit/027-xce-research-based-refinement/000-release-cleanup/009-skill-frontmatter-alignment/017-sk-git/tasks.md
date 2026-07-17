---
title: "Tasks: Phase 17: sk-git Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-git frontmatter tasks"
  - "git skill doc authoring tasks"
  - "doc contract authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git"
    last_updated_at: "2026-06-11T09:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-017-sk-git"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: sk-git Frontmatter Alignment

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

- [x] T001 Capture frontmatter inventory: all 10 sk-git docs carry title+description only, no detailed block and no stray keys (`.opencode/skills/sk-git/{references,assets}/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Read each doc body and author 5-7 distinctive multi-word trigger phrases per doc (e.g. "numbered worktree branches", "scoped staging discipline", "rename-heavy merge verification")
- [x] T003 Insert trigger_phrases, importance_tier, contextType into all 7 references (`.opencode/skills/sk-git/references/{worktree_workflows,commit_workflows,finish_workflows,shared_patterns,quick_reference,large_reorg_playbook,github_mcp_integration}.md`)
- [x] T004 Insert the same contract fields into all 3 assets (`.opencode/skills/sk-git/assets/{commit_message_template,pr_template,worktree_checklist}.md`)
- [x] T005 Tier judgment: `worktree_workflows.md` to `important` (owns the `wt/{NNNN}-{name}` naming contract); remaining 9 docs stay `normal`; contextType `general` for the two cross-cutting docs (`quick_reference.md`, `shared_patterns.md`), `implementation` elsewhere
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=sk-git docs=10 carrying-detailed-block=10 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "rename-heavy merge verification" ranks sk-git first (0.95) with `!rename-heavy merge verification(signal)` in the reason; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: `git diff -U0` shows insertion-only frontmatter hunks (`@@ -3,0 +4,N @@`) across the 10 files, 86 insertions, 0 deletions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (coverage check + routing smoke without touching the live daemon)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `implementation-summary.md`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Pilot recipe**: `../008-deep-loop-runtime/`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
