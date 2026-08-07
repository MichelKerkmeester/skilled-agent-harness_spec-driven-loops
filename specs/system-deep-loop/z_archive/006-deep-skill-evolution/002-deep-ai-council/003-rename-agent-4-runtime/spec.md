---
title: "Feature Specification: 115/003 — agent runtime rename across 4 runtimes"
description: "Parallel-after-001: git mv 4 runtime agent files (.opencode/.claude/.codex/.gemini) deep-ai-council → ai-council + update 4 agent README.txt files + agent frontmatter name + body refs to renamed skill path."
trigger_phrases: ["115 003", "agent runtime rename", "ai-council agent"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/003-rename-agent-4-runtime"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/003 spec.md"
    next_safe_action: "Author 115/003 plan.md"
    blockers: []
    key_files: [".opencode/agents/deep-ai-council.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115003"
      session_id: "115-003-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 115/003 — agent runtime rename

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (parallel-eligible after 001) |
| **Status** | Planned |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 6 |
| **Predecessor** | 001 |
| **Handoff Criteria** | 4 agent files renamed via git mv; frontmatter `name: ai-council`; rg "deep-ai-council" in 4 runtime agent dirs = 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
Phase 3 of 6. Parallel-eligible with 002/004/005 after 001 emits rename-plan.json.

**Scope**: 4 runtime agent files + 4 agent READMEs.

**Deliverables**:
- 4 `git mv` of agent files: deep-ai-council.{md,toml} → ai-council.{md,toml} across .opencode/.claude/.codex/.gemini
- 4 agent README.txt inventory updates
- Each agent body's skill-path reference updates: `.opencode/skills/deep-ai-council/` → `.opencode/skills/sk-ai-council/`
- Each agent frontmatter `name:` field: `deep-ai-council` → `ai-council`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `@deep-ai-council` agent slug uses the `deep-` prefix that conflates with the autonomous-loop family (deep-research, deep-review, deep-agent-improvement). The Council isn't a deep-loop; it's a planning sentinel.

### Purpose
Rename to bare `@ai-council` slug across all 4 runtime mirrors (per [[feedback_new_agent_mirror_all_runtimes]]).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 runtime agent files (.opencode/.claude/.codex/.gemini)
- 4 agent README.txt files (inventory listings)

### Out of Scope
- Skill body (Phase 002 handles)
- Sibling skill graph metadata (Phase 004 handles)
- Root docs / git hook / skills-index README (Phase 005 handles)

### Files to Change
| File | Action |
|------|--------|
| `.opencode/agents/deep-ai-council.md` | git mv → `ai-council.md` + literal substitution |
| `.claude/agents/deep-ai-council.md` | Same |
| `.codex/agents/deep-ai-council.toml` | Same (TOML frontmatter) |
| `.gemini/agents/deep-ai-council.md` | Same |
| `.opencode/agents/README.txt` | Update inventory |
| `.claude/agents/README.txt` | Same |
| `.codex/agents/README.txt` | Same |
| `.gemini/agents/README.txt` | Same |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | 4 agent files renamed via git mv | per-runtime `ls` checks |
| REQ-002 | Agent frontmatter `name: ai-council` in all 4 files | per-runtime grep |
| REQ-003 | Agent body references `.opencode/skills/sk-ai-council/SKILL.md` | per-runtime grep |
| REQ-004 | rg "deep-ai-council" in 4 runtime agent dirs = 0 | rg verification |

### P1
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | 4 agent README.txt files updated | per-runtime rg = 0 |
| REQ-006 | validate.sh --strict on 003 exit 0 | validator |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `git log --follow .opencode/agents/ai-council.md` traces back.
- **SC-002**: All 4 runtime agent files identical-with-rename per [[feedback_new_agent_mirror_all_runtimes]].
- **SC-003**: 003 strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Codex TOML frontmatter syntax differs from MD | Inspect each file's frontmatter style before sed |
| Risk | Agent README.txt is auto-generated | Inspect first; manual edit if hand-maintained |
| Dependency | 001 emits rename-plan.json | Phase 003 blocks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
(see parent spec.md §10)
<!-- /ANCHOR:questions -->
