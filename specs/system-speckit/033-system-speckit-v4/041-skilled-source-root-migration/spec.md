---
title: "Feature Specification: Skilled Source-Root Migration"
description: "Move the authoring source root for skills, commands, agents, hooks and plugins from .opencode to .skilled, and symlink every CLI runtime — including opencode itself — back into it."
trigger_phrases:
  - "skilled source root"
  - "move opencode to skilled"
  - "source parent migration"
  - "runtime symlink inversion"
  - "dot-skilled migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration"
    last_updated_at: "2026-09-16T08:35:04Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase 001 research landed and verified; figures corrected against the live tree"
    next_safe_action: "Design the cutover in phase 003"
    blockers: []
    key_files:
      - "001-deep-research/spec.md"
      - "002-per-runtime-reference-map/spec.md"
      - "003-migration-design/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-scaffold"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Does .opencode stay as a symlink farm, or can it shrink to only what the opencode runtime itself reads?"
      - "Can each runtime be pointed at a root other than its own directory name?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skilled Source-Root Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Predecessor** | 040-gate-3-option-merge |
| **Successor** | None |
| **Handoff Criteria** | Every runtime resolves its skills, commands, agents, hooks and plugins through `.skilled`, and no gate reads a stale `.opencode` path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/` is the authoring home for every skill, command, agent, hook, plugin and runtime script in this repository, and the six other CLI runtimes reach it through 174 symlinks. That layout encodes a claim that is no longer true: that opencode is the primary runtime. It is now one of seven, and the least used of them. The name misleads every reader who opens the tree, and it couples a shared asset library to one vendor's directory convention — so a runtime that ever stops honouring that convention takes the whole library with it.

### Purpose

Make `.skilled/` the source root that holds the real files, and turn every runtime directory, `.opencode/` included, into a consumer that links into it. The asset library then carries a name that describes what it is rather than which tool read it first.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The authoring content under `.opencode/`: `skills/`, `commands/`, `agents/`, `hooks/`, `plugins/`, `bin/`, `scripts/`, `install-guides/`, `changelog/`, `manual-testing-playbook/`.
- The 174 symlinks that point into `.opencode/` from `.claude/`, `.cursor/`, `.devin/`, `.pi/`, `.codex/`, `.hermes/` and `specs/`, and the 207 internal links inside `.opencode/` that a literal grep does not find.
- Every hardcoded `.opencode` path in first-party code and configuration: 1,223 non-markdown tracked files, led by 405 JSON, 371 TypeScript, 111 CJS, 69 shell, 64 YAML, 44 MJS and 40 Python files, plus the three git hooks under `.opencode/scripts/git-hooks/`.
- The 19 GitHub Actions workflows that reference the path, and the 62 `.gitignore` entries that do.
- Documentation that names the path: roughly 3,000 further tracked markdown files, `AGENTS.md`, `REPO RULES.md`, `README.md`, `CONTRIBUTING.md` and `PUBLIC-RELEASE.md` among them.
- Whatever `.opencode/` must retain for the opencode runtime itself to keep working, including the root `opencode.json` that launches `.opencode/bin/mcp-code-mode-launcher.cjs`.
- References from outside the repository that resolve into it. Four are confirmed live: the global git hooks under `~/.config/git/hooks/`, `~/.codex/hooks.json`, `~/.hermes/config.yaml` and `~/.codex/config.toml`.

### Out of Scope

- `barter/` — its `.opencode` symlinks resolve to a different checkout (`Code_Environment/Barter/ai-speckit/coder/.opencode`), so this migration does not reach them.
- Renaming, splitting or reorganising any skill, command or agent. The move changes where the tree is rooted, nothing about its contents.
- Changing what any runtime does with the assets once it finds them.

### Files to Change

Per-phase detail lives in each child's plan. The surface is measured rather than estimated:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/**` | Move | migration-design | Authoring content relocates to `.skilled/**` |
| `.claude/`, `.cursor/`, `.devin/`, `.pi/`, `.codex/`, `.hermes/` | Modify | migration-design | 174 symlinks retarget from `.opencode` to `.skilled` |
| `.github/workflows/*.yml` | Modify | migration-design | 19 workflows carry the path |
| `.gitignore` | Modify | migration-design | 62 entries carry the path |
| `opencode.json` | Modify | migration-design | Root config launches a script by path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-research/` | Map every surface the move touches, and find the ones that break | complete |
| 2 | `002-per-runtime-reference-map/` | Map every symlink and stale path reference per runtime, and across skills, code and docs | complete |
| 3 | `003-migration-design/` | Turn the findings into a frozen cutover sequence with a rollback | draft |

Phases beyond 003 are deliberately unscaffolded. The execution split depends on what phase 001 finds, and inventing those boundaries now would commit the packet to a shape the evidence has not yet justified.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Every phase works in the dedicated worktree `worktrees/055-skilled-source-root-migration`, never in the main checkout. This is an operator decision (2026-09-16) and holds for the whole packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-per-runtime-reference-map | Findings name every category of reference with a file count, and every blocker carries a `file:line` citation | `research/research.md` exists and each claim resolves |
| 002-per-runtime-reference-map | 003-migration-design | Every runtime has a symlink map and a stale-reference list, and skills, code and root docs are mapped by area | `research/research.md` exists and its counts reconcile with the seed inventory |
| 003-migration-design | execution | Cutover sequence is ordered, each step has an observable check, and the rollback is written before the first step | Design review passes and the rollback is rehearsed |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does `.opencode/` remain as a full symlink farm after the move, or shrink to only the entry points the opencode runtime itself resolves?
- Can each runtime be pointed at a root other than its own directory name? Phase 001 could not establish this from repository files for any of the seven.
- Do opencode's plugin glob and Devin's skill scan follow a symlinked directory? This decides whether `.opencode/` can become a pure consumer.
- **Answered (2026-09-16):** the state-record contract uses `iteration`. The follow-up change lives in the shared deep-loop runtime rather than this packet; `001-deep-research/research/research.md` §10 names the files and lines.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
