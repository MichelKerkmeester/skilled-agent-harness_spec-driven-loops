---
title: "Feature Specification: agents surface migration (032 component phase 014)"
description: "The 032 program needs a bounded documentation map for the agents surface. This parent groups one verify-only child per agent definition and a final rollup gate so every runtime agent directory is checked against the kebab-case filesystem policy."
trigger_phrases:
  - "agents surface migration"
  - "agents kebab-case phase"
  - "agent filename verification"
  - "014 agents gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored agents parent spec"
    next_safe_action: "Execute the selected agent verification phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Agents Surface Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Parent Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration |
| **Child phases** | 14 verify-only leaves plus one rollup gate |
| **Handoff Criteria** | Every child checklist has path-level evidence and the rollup proves the agents naming surface is clean |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The agents surface is represented in three runtime directories, and each agent definition must be accounted for before the repository-wide kebab-case program can close its naming inventory. A child phase per definition makes a zero-candidate result reviewable; the final gate checks that no in-scope snake_case filesystem name was missed.

This parent defines the agents-surface documentation map. Its children are largely independent verify-only inventories, followed by one rollup gate that aggregates their evidence.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only naming inventories for the 13 agent definitions under .opencode/agents, .claude/agents, and .codex/agents.
- One L2 child spec, plan, tasks file, and SOL checklist for each definition.
- A final L2 rollup gate covering all sibling evidence and the whole agents naming surface.
- The program boundary: kebab-case is canonical for in-scope filesystem names; Python scripts, Python import-package directories, and tool-mandated names remain exempt.

### Out of Scope
- Executing any rename, reference rewrite, content edit, or runtime behavior change.
- Any component-migration subtree outside 014-agents.
- Changes to Python identifiers, JSON/YAML/TOML keys, frontmatter fields, generated or lockfile output, vendored trees, or frozen history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 014-agents/001-ai-council-verify through 013-review-verify | Create/Replace | Per-definition L2 verification documents |
| 014-agents/014-agents-gate | Create/Replace | L2 subtree rollup gate documents |
| .opencode/agents, .claude/agents, .codex/agents | Inspect only | Runtime naming surface; no migration in this documentation pass |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-ai-council-verify | AI Council definition candidate audit | Planned |
| 002 | 002-code-verify | Code definition candidate audit | Planned |
| 003 | 003-context-verify | Context definition candidate audit | Planned |
| 004 | 004-debug-verify | Debug definition candidate audit | Planned |
| 005 | 005-deep-alignment-verify | Deep Alignment definition candidate audit | Planned |
| 006 | 006-deep-improvement-verify | Deep Improvement definition candidate audit | Planned |
| 007 | 007-deep-research-verify | Deep Research definition candidate audit | Planned |
| 008 | 008-deep-review-verify | Deep Review definition candidate audit | Planned |
| 009 | 009-design-verify | Design definition candidate audit | Planned |
| 010 | 010-markdown-verify | Markdown definition candidate audit | Planned |
| 011 | 011-orchestrate-verify | Orchestrate definition candidate audit | Planned |
| 012 | 012-prompt-improver-verify | Prompt Improver definition candidate audit | Planned |
| 013 | 013-review-verify | Review definition candidate audit | Planned |
| 014 | 014-agents-gate | Aggregate sibling evidence and enforce the whole agents naming gate | Planned |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking; the runtime path inventory is fixed for this subtree and each leaf must confirm it against the pinned baseline before the rollup gate.
<!-- /ANCHOR:questions -->
