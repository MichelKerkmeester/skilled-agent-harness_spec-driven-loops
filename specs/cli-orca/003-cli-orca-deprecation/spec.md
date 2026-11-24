---
title: "Feature Specification: Deprecate and remove the cli-orca skill"
description: "Remove the cli-orca skill, its changelog folder, its runtime mirrors and every live reference to it, because the skill saw little use and cost steady routing and mirror upkeep."
trigger_phrases:
  - "cli orca deprecation phase parent spec"
  - "deprecate cli-orca"
  - "remove cli-orca skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation"
    last_updated_at: "2026-11-24T00:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full removal including .skilled/changelog/cli-orca; specs/ and released changelogs stay as history"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Deprecate and remove the cli-orca skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/534-deprecate-cli-orca` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-orca/003-cli-orca-deprecation |
| **Predecessor** | `002-consolidate-official-orca-skills` (the last build of the skill this packet removes) |
| **Successor** | None |
| **Handoff Criteria** | No live file outside `specs/` and released changelogs names the cli-orca skill, and every touched test suite matches its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-orca` is a standalone skill that routes Orca app work: worktrees, terminals, the embedded browser, automations and handoffs. It ships 59 tracked files under `.skilled/skills/cli-orca/`, 12 of them changelog entries that `.skilled/changelog/cli-orca` links to, two tracked runtime mirror links, three advisor graph edges from other skills and about 20 live files that mention it. The operator reports the skill saw little use, while every routing, mirror and documentation change still has to carry it.

### Purpose
Remove cli-orca from Skilled completely: delete the skill, its changelog folder and its mirrors, take it out of every registry, test and document, and regenerate the derived indexes so nothing routes to or advertises it. The operator chose full removal with no stubs; git history is the backup.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A classified reference inventory and a test baseline before any change
- Runtime code and tests that name cli-orca: the advisor scorer and its tests, the skill-root metadata contract test and the sk-doc README fixtures
- Docs and registries: the root README, the skills index, three advisor graph edges, the mcp-tooling boundary text and the metadata contract reference
- Deletion of the skill, its changelog folder and its `.vibe` and `.dsh` mirror links
- Regeneration of the advisor skill graph and the trigger index, then a zero-reference proof

### Out of Scope
- `specs/` history, including `specs/cli-orca/001` and `002`, which record what was built
- Released changelog entries in `.skilled/changelog/skilled/` and in other skills' `changelog/` folders, which record past releases
- The Orca desktop app and `~/.orca/` on the operator's machine
- Mentions of Orca that are not the skill: the `openorca` model family, captured process lists, transcript fixtures and question-screen captures

### Files to Change
Per-phase detail lives in each child's plan.md. The classified list is `001-inventory-and-baseline/scratch/removal-manifest.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/**`, `.skilled/skills/sk-doc/**/tests/**` | Modify/Regenerate | 002 | Runtime code, tests and test fixtures |
| `README.md`, `.skilled/skills/README.txt`, three `graph-metadata.json`, mcp-tooling docs | Modify | 003 | Live references |
| `.skilled/skills/cli-orca/`, `.skilled/changelog/cli-orca/`, `.vibe/skills/cli-orca`, `.dsh/skills/cli-orca` | Delete | 003 | The skill and its mirrors |
| `skill-graph.json`, `trigger-index.json` | Regenerate | 004 | Derived indexes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-inventory-and-baseline/ | Classify every reference and record the test baseline | Complete |
| 2 | 002-runtime-code-and-tests/ | Remove cli-orca from runtime code, tests and test fixtures | Complete |
| 3 | 003-docs-registries-and-skill-removal/ | Remove cli-orca from docs and registries, then delete the skill and its mirrors | Complete |
| 4 | 004-regeneration-and-zero-reference-proof/ | Regenerate derived indexes and prove zero live references | Complete |

### Implementers

Edits in phases 2 and 3 go to cli-opencode running `llmgateway/deepseek-v4.1-flash-1017`, at `#high` for doc edits and `#max` for code and tests, one file group per dispatch. This session verifies each return by diff and reruns before sending the next.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-inventory-and-baseline | 002-runtime-code-and-tests | Manifest classifies every hit; baseline logs and exit codes recorded | `scratch/removal-manifest.md`, `scratch/baseline-exits.txt` |
| 002-runtime-code-and-tests | 003-docs-registries-and-skill-removal | Touched suites match baseline | Rerun of each baseline command |
| 003-docs-registries-and-skill-removal | 004-regeneration-and-zero-reference-proof | Skill tree and mirrors gone; manifest edit rows done | `git status` and per-file `rg` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. On 2026-11-24 the operator chose full removal, including `.skilled/changelog/cli-orca/`, with the packet at `specs/cli-orca/003-cli-orca-deprecation` and the work in a worktree.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
