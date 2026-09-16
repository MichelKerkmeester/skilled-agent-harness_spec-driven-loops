---
title: "Research Record: Skilled Source-Root Migration Implications"
description: "Map every surface in the repository that would have to change if .skilled replaced .opencode as the source root for skills, commands, agents, hooks and plugins, and find the ones that cannot simply be retargeted."
trigger_phrases:
  - "skilled migration research"
  - "opencode path inventory"
  - "source root move implications"
  - "runtime symlink retarget research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research"
    last_updated_at: "2026-09-16T08:35:04Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Merge and verify both lanes into research/research.md"
    next_safe_action: "Feed the blocker inventory into 002-per-runtime-reference-map and 003-migration-design"
    blockers: []
    key_files:
      - "research/research.md"
      - "scratch/topic.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which runtimes hard-require their own directory name and cannot be pointed elsewhere?"
    answered_questions:
      - "Which references live outside this repository?"
---
# Research Record: Skilled Source-Root Migration Implications

<!-- SPECKIT_LEVEL: research -->
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Findings** | `research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent packet proposes rooting the shared asset library at `.skilled/` instead of `.opencode/`. Before any file moves, the repository has to say what it would cost. Measured against the live tree, the surface is 174 symlinks into `.opencode` from runtime directories plus 207 internal links, 4,258 tracked files carrying the literal string across 85,769 occurrences, 1,223 of them non-markdown code and configuration, 19 CI workflows and 62 `.gitignore` entries. The brief first stated 200 links and 20 workflows; `research/research.md` §8 records why both were wrong. Counting is the easy half. The decision needs the other half: which of those references are mechanical rewrites, and which are constraints that a rename cannot satisfy — a runtime that only reads its own directory name, a generated artifact whose path is baked into a database, a hook installed outside the repository.

### Purpose

Produce an evidence-cited inventory of every surface the move touches, partitioned into what a scripted rewrite can handle and what cannot be rewritten at all, so phase 003 can design a cutover against facts rather than an estimate. The findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Symlink topology.** The 174 links into `.opencode/` from `.claude/` (56), `.cursor/` (53), `.devin/` (22), `.pi/` (19), `.codex/` (19), `.hermes/` (2) and `specs/` (3), plus the internal links inside `.opencode/` itself — what each points at, whether the link is relative or absolute, and whether the consuming runtime follows a link at that position.
- **Hardcoded paths in first-party code.** The 1,223 non-markdown tracked files: 405 JSON, 371 TypeScript, 111 CJS, 69 shell, 64 YAML, 44 MJS, 40 Python, 29 text, 23 JS, 20 YML, 14 TOML, 10 template and 4 JSONL, plus `.opencode/scripts/git-hooks/{pre-commit,pre-push,prepare-commit-msg}`.
- **Runtime contracts.** Whether each of the seven runtimes can resolve skills, commands, agents, hooks and plugins through a symlinked or relocated directory, and where each one's resolution logic reads the path from.
- **Generated and derived state.** Registries, compiled routing tables, `descriptions.json`, trigger indexes, SQLite databases, `dist/` output and leaf manifests that store absolute or repo-relative `.opencode` paths and would need regeneration rather than rewriting.
- **CI and gates.** The 19 workflows, the pre-commit and pre-push hooks, the validators, and the naming and path guards that would themselves reject the migration commit.
- **References outside the repository.** The research confirmed four live ones; see `research/research.md` §5.
- **The residual `.opencode/`.** What must remain at that path for the opencode runtime to keep working, including the root `opencode.json` entry that launches `.opencode/bin/mcp-code-mode-launcher.cjs`.
- **Migration mechanics.** Whether `git mv` preserves history across a move of this size, what happens to the existing symlinks whose targets traverse the moved directory, and whether the move can land in one commit or must be staged.

### Out of Scope

- `barter/` — its `.opencode` symlinks resolve into a different checkout (`Code_Environment/Barter/ai-speckit/coder/.opencode`), so this repository's move does not reach them. Confirmed by reading the link targets, not assumed.
- Whether the migration should happen. The operator has decided the direction; this phase measures the cost and finds the blockers.
- Any reorganisation of skill, command or agent content. The tree's shape is frozen; only its root moves.
- Designing the cutover sequence. That is phase 003's work, and it depends on these findings.

### Research Method

Two lanes, different model families, so agreement between them is corroboration rather than the same opinion twice:

| Lane | Executor | Model | Iterations |
|------|----------|-------|-----------|
| `luna` | cli-codex | `gpt-5.6-luna`, xhigh reasoning, fast tier | 10 |
| `deepseek` | cli-devin | `deepseek-v4-1-flash-max` | 5 |

Both lanes write only under `research/`. The frozen brief lives in `scratch/topic.txt`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Can each runtime be pointed at a root other than its own directory name? Neither lane could establish this from repository files; it needs each CLI's own loader documentation or source.
- Do opencode's plugin glob and Devin's skill scan follow a symlinked directory? This needs a probe per runtime in a scratch checkout.
- Does git skip or fail on a dangling hook under `core.hooksPath`? This needs a one-line probe in a scratch repository.
<!-- /ANCHOR:questions -->
