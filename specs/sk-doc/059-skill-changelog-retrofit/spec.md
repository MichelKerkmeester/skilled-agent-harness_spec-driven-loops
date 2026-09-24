---
title: "Feature Specification: Rewrite every skill changelog to the current sk-create-changelog format"
description: "549 of the skill changelogs predate the compact and expanded narrative format that sk-create-changelog now defines, so the release history reads in several older styles. This packet rewrites them in place with GPT-6 Luna, one phase for the tooling and pilot and one phase per skill, keeping every fact."
trigger_phrases:
  - "skill changelog retrofit"
  - "rewrite skill changelogs"
  - "changelog format migration"
  - "legacy changelog rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit"
    last_updated_at: "2026-09-24T18:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Split the packet into a tooling phase and fifteen per-skill phases"
    next_safe_action: "Hand the pilot to the operator for style approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Rewrite every skill changelog to the current sk-create-changelog format

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-create-changelog defines two narrative formats for a release, compact and expanded, and its canonical exemplar is `.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md`. Of the 574 changelogs under `.skilled/skills/` when this packet started, 549 predate that format. They open with retired machine headers such as `## [**1.2.0.0**] - 2026-03-02`, carry Files Changed tables and test counts, and use change-type sections the contract retires. The release history therefore reads in several older styles at once.

### Purpose
Every skill changelog reads in the current format and still records exactly what shipped in its version, no more and no less.

> **Phase-parent note:** This spec.md and `goal.md` are the only authored documents at the parent level. Planning, tasks, acceptance criteria and results live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 549 skill changelogs that failed the shape checker when this packet started, including system-spec-kit's `v1+/`, `v2+/` and `v3+/` subfolders. Each skill's list is in `scratch/lists/`.
- The checker, the rewrite brief, the fact-check brief and the driver in `scratch/`, built in phase 001.

### Out of Scope
- Spec-folder packet changelogs under `specs/`. The operator excluded them.
- The canonical exemplar, which is the house style itself.
- Skill changelogs that already pass the checker, including those added after this packet started.
- The packet-changelog templates in `.skilled/skills/system-spec-kit/templates/changelog/`, which are templates rather than release entries.
- Changes to sk-create-changelog's own contract. Its rule never to overwrite an existing changelog governs creation. This packet overwrites on purpose, as the operator asked, and records that here rather than amending the rule.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/sk-doc/059-skill-changelog-retrofit/scratch/*` | Create | 001-tooling-and-pilot | Checker, briefs, driver and run records |
| `.skilled/skills/<skill>/**/changelog/**/*.md` (549 listed) | Modify | 001 to 016 | Rewritten in place in the compact or expanded format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-tooling-and-pilot/ | Checker, briefs, driver and the ten-file pilot | In Progress |
| 2 | 002-cli-external-orchestration/ | 112 cli-external-orchestration changelogs, 3 kept in the pilot | Planned |
| 3 | 003-cli-jev/ | 5 cli-jev changelogs | Planned |
| 4 | 004-cli-orca/ | 1 cli-orca changelog | Planned |
| 5 | 005-mcp-code-mode/ | 9 mcp-code-mode changelogs | Planned |
| 6 | 006-mcp-tooling/ | 55 mcp-tooling changelogs | Planned |
| 7 | 007-sk-code/ | 29 sk-code changelogs | Planned |
| 8 | 008-sk-communication/ | 4 sk-communication changelogs | Planned |
| 9 | 009-sk-design/ | 32 sk-design changelogs, 1 kept in the pilot | Planned |
| 10 | 010-sk-doc/ | 56 sk-doc changelogs, 1 kept in the pilot | Planned |
| 11 | 011-sk-git/ | 21 sk-git changelogs, 1 kept in the pilot | Planned |
| 12 | 012-sk-prompt/ | 14 sk-prompt changelogs | Planned |
| 13 | 013-sk-vision/ | 2 sk-vision changelogs | Planned |
| 14 | 014-system-deep-loop/ | 89 system-deep-loop changelogs | Planned |
| 15 | 015-system-skill-advisor/ | 12 system-skill-advisor changelogs | Planned |
| 16 | 016-system-spec-kit/ | 108 system-spec-kit changelogs | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-tooling-and-pilot | 002-cli-external-orchestration | The operator approves the pilot style | `001-tooling-and-pilot/acceptance-criteria.md` AC-008 is Met |
| 002-cli-external-orchestration | 003-cli-jev | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 002-cli-external-orchestration reports `RESULT: PASSED` |
| 003-cli-jev | 004-cli-orca | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 003-cli-jev reports `RESULT: PASSED` |
| 004-cli-orca | 005-mcp-code-mode | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 004-cli-orca reports `RESULT: PASSED` |
| 005-mcp-code-mode | 006-mcp-tooling | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 005-mcp-code-mode reports `RESULT: PASSED` |
| 006-mcp-tooling | 007-sk-code | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 006-mcp-tooling reports `RESULT: PASSED` |
| 007-sk-code | 008-sk-communication | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 007-sk-code reports `RESULT: PASSED` |
| 008-sk-communication | 009-sk-design | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 008-sk-communication reports `RESULT: PASSED` |
| 009-sk-design | 010-sk-doc | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 009-sk-design reports `RESULT: PASSED` |
| 010-sk-doc | 011-sk-git | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 010-sk-doc reports `RESULT: PASSED` |
| 011-sk-git | 012-sk-prompt | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 011-sk-git reports `RESULT: PASSED` |
| 012-sk-prompt | 013-sk-vision | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 012-sk-prompt reports `RESULT: PASSED` |
| 013-sk-vision | 014-system-deep-loop | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 013-sk-vision reports `RESULT: PASSED` |
| 014-system-deep-loop | 015-system-skill-advisor | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 014-system-deep-loop reports `RESULT: PASSED` |
| 015-system-skill-advisor | 016-system-spec-kit | Every listed file is kept or recorded with its reason, and the skill commit is pushed | `validate.sh --strict` on 015-system-skill-advisor reports `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The retry policy for files that fail twice is open in `001-tooling-and-pilot/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Goal**: See `goal.md` for the durable directive and completion criteria
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
