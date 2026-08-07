---
title: "Tasks: Phase 5 — Skill authoring for mcp-obsidian"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian skill tasks"
  - "mcp-obsidian skill md tasks"
  - "obsidian routing contract tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/005-skill-authoring"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 5 skill-authoring tasks"
    next_safe_action: "Read sk-create-skill templates, then author SKILL.md router"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: skill-authoring

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

- [ ] T001 Read `sk-create-skill` templates (`skill-md-template.md`, `skill-readme-template.md`) + `mcp-click-up` SKILL.md/README/INSTALL-GUIDE as the structural mirror
- [ ] T002 [P] Confirm Phase 3 `references/<cli>-commands.md` + Phase 4 `references/mcp-tools.md` exist for RESOURCE_MAP targets
- [ ] T003 Draft the Obsidian note/frontmatter domain-format contract + INTENT_SIGNALS/RESOURCE_MAP entries
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `SKILL.md`: frontmatter (no `parent:` key; `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`; `version`); `<!-- keywords: ... -->` comment; domain-format contract; §1–§8 incl. §2 router (INTENT_SIGNALS/RESOURCE_MAP + Resource Loading Levels) and §3 CLI-vs-MCP table + inline `.utcp_config.json` block
- [ ] T005 Author `README.md` (9 sections: AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS)
- [ ] T006 Author `INSTALL-GUIDE.md` at the mode root (§0 AI-FIRST INSTALL GUIDE prompt block + sections 1–7)
- [ ] T007 Author `changelog/v1.0.0.0.md` + the `references/` index; cross-link with NO dangling refs (do NOT create `references/INSTALL-GUIDE.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Grep every SKILL.md §8 reference + RESOURCE_MAP path resolves on disk; confirm no `parent:` key and correct `allowed-tools`
- [ ] T009 Confirm INSTALL-GUIDE.md lives at the mode root and is referenced there (clickup staleness trap avoided)
- [ ] T010 `validate.sh` the package docs; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] SKILL.md §2 router arbitrates CLI vs MCP; every RESOURCE_MAP path resolves
- [ ] No dangling references anywhere; `validate.sh` on the package docs passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessors**: `../003-cli-tool-integration/` + `../004-mcp-server-integration/`
- **Next phase**: `../006-feature-catalog-and-playbook/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
