---
title: "Phase 003: Rename deep-agent-improvement to deep-improvement"
description: "Rename the deep-agent-improvement skill to deep-improvement across skill dir, SKILL.md, commands, agent + runtime mirrors, advisor graph, descriptions.json, and cross-references; zero dangling refs; green advisor rebuild."
trigger_phrases:
  - "deep-improvement rename"
  - "122 phase 003"
  - "rename deep-agent-improvement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Narrow rename completed (Opus finished advisor after codex partial); audited clean"
    next_safe_action: "Commit the rename scoped to the surface, then begin Phase 004 Lane C build"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 003 — Rename deep-agent-improvement → deep-improvement

**Parent:** `122-deep-improvement-skill-benchmark-mode`
**Type:** Implementation (rename / refactor)
**Status:** Complete — narrow rename done + Opus-audited clean.

---

## 1. Purpose

Rename the skill `deep-agent-improvement` to `deep-improvement` across every surface so the name reflects its real scope (agents + models + skills). The `-agent-` infix is now misleading.

## 2. Scope (surface list — confirmed/expanded by Phase 001 RQ6)

- `.opencode/skills/deep-agent-improvement/` → `.opencode/skills/deep-improvement/` (dir + `SKILL.md` `name:`/frontmatter/triggers/keywords).
- Commands referencing the skill path: `/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop` (and the new `/deep:start-skill-benchmark-loop`) — update skill-path references. **Command verbs are NOT renamed** unless Phase 001 shows a reason; the agent-improvement command still improves agents.
- Agent file `.opencode/agents/deep-agent-improvement.md` + runtime mirrors `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`.
- Skill-advisor graph (`system-skill-advisor/.../skill-graph.json`), `descriptions.json`, advisor metadata; run advisor rebuild.
- Cross-references: sentinel `sk-prompt-models`, root `CLAUDE.md` / `AGENTS.md` agent-routing entries, any other skills/docs that name `deep-agent-improvement`.
- Internal self-references inside the skill's own references/scripts/README.

## 3. Approach

Use `git mv` for the directory to preserve history; then a tracked find-and-replace across the confirmed surface list; then advisor rebuild + validate. Agent-name decision (`@deep-agent-improvement` → `@deep-improvement`?) recorded explicitly in this phase's `decision-record.md`.

## 4. Success criteria

- Zero dangling `deep-agent-improvement` references where `deep-improvement` is intended (grep-clean, allowing intentional historical mentions in archives).
- Skill-advisor rebuild + `advisor_validate` green; skill resolvable under the new name.
- Lane A (`/deep:start-agent-improvement-loop`) and Lane B (`/deep:start-model-benchmark-loop`) still run.
- `validate.sh --strict` green for this phase.

## 5. Out of scope

Lane C build (Phase 004); doc/README three-lane rewrite beyond what the rename requires (Phase 005).
