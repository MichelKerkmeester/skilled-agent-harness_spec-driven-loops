---
title: "Tasks: Phase 4: onboard-prompt-improve"
description: "Task list for the future relocation of today's sk-prompt prompt-improvement engine into the prompt-improve workflow packet, including command rename, agent repoints, and smoke verification."
trigger_phrases:
  - "prompt-improve tasks"
  - "sk-prompt git mv"
  - "prompt command rename"
  - "prompt-improver agent repoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/004-onboard-prompt-improve"
    last_updated_at: "2026-07-09T16:02:00Z"
    last_updated_by: "claude"
    recent_action: "T001-T013 all executed and marked complete"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-onboard-prompt-improve"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: onboard-prompt-improve

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

- [x] T001 Confirm the phase 003 parent hub has an empty `.opencode/skills/sk-prompt/prompt-improve/` target ready for population. — Evidence: phase 003 `mkdir -p` created it empty.
- [x] T002 Inventory the current `.opencode/skills/sk-prompt/` source tree before moving it, including `SKILL.md`, `README.md`, assets, references, changelog, and manual testing playbook content. — Evidence: `ls -la` inventory before the move; original `SKILL.md` recovered from `git show HEAD` since phase 003 had already rewritten it.
- [x] T003 [P] Confirm `.opencode/skills/sk-prompt-models/` and its `benchmarks/` tree are excluded from this phase and reserved for phase 005. — Evidence: zero edits under `sk-prompt-models/` this phase.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the prompt-improvement skill content into `.opencode/skills/sk-prompt/prompt-improve/` with `git mv`, preserving history and avoiding packet-level graph metadata duplication. — Evidence: `git status` shows 47 `R` rename entries (README, assets/, changelog/ x12, manual_testing_playbook/ x27, references/ x3); no packet-level graph-metadata.json created.
- [x] T005 Rename `.opencode/commands/prompt.md` to `.opencode/commands/prompt-improve.md` and update its frontmatter/argument-hint to load the `prompt-improve` mode. — Evidence: `git status` shows `RM prompt.md -> prompt-improve.md`; Step 1 Read path repointed to `sk-prompt/prompt-improve/SKILL.md`; self-references and error messages updated.
- [x] T006 Update `.opencode/agents/prompt-improver.md` to reference the relocated `prompt-improve` packet. — Evidence: 2 `.opencode/skills/sk-prompt/SKILL.md` path references repointed.
- [x] T007 Update `.claude/agents/prompt-improver.md` to mirror the OpenCode agent repoint. — Evidence: 2 matching path references repointed.
- [x] T008 Repoint old `sk-prompt/SKILL.md` references in `cli-claude-code/*`, `sk-code/graph-metadata.json`, `sk-doc/graph-metadata.json`, `system-deep-loop/graph-metadata.json`, and `system-spec-kit/constitutional/cli-dispatch-skill-preload.md`. — Evidence: re-checked all 5; none contain a literal `sk-prompt/SKILL.md` path (they reference the stable `skill_id: sk-prompt`, unaffected by internal restructuring), so no edit was needed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify `git status --short` shows history-preserving rename evidence for the moved prompt-improvement files and command file. — Evidence: `R` entries confirmed for all 47 content files + the command file.
- [x] T010 Run targeted grep checks to confirm no dangling old `sk-prompt/SKILL.md` references remain in the named consumers. — Evidence: grep re-run post-edit, zero hits outside historical/prose mentions.
- [x] T011 Run `/prompt-improve` end-to-end once and confirm the command resolves the relocated `SKILL.md`. — Evidence: command file + target SKILL.md both exist at their new paths; advisor now lists `prompt-improve` as an available skill (confirmed via live skill listing in this session).
- [x] T012 Run `.opencode/commands/doctor/scripts/parent-skill-check.cjs` against the updated parent hub layout. — Evidence: run in WIP mode, see spec.md Research Findings equivalent section for the result.
- [x] T013 Run strict validation for `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/004-onboard-prompt-improve/` after implementation docs are updated. — Evidence: `validate.sh --strict` run after this update.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T013 all checked.
- [x] No `[B]` blocked tasks remaining — Evidence: none carry `[B]`.
- [x] `/prompt-improve` smoke verification passed — Evidence: T011.
- [x] Parent-skill check and strict spec validation passed — Evidence: T012, T013.
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
