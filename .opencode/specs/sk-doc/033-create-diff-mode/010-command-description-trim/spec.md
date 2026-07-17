---
title: "Feature Specification: Command Description Trim"
description: "Trim the last 8 over-soft frontmatter descriptions (1 skill + 7 commands) to clear the audit and bank ~158 chars of additional headroom under the 5,600-char project soft ceiling."
trigger_phrases:
  - "091 command trim"
  - "command description trim"
  - "skill-budget cleanup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/010-command-description-trim"
    last_updated_at: "2026-05-06T14:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Apply trims"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/doctor/code-graph.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-091"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Command Description Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After packets 083 (skills+commands first pass), 086 (audit tooling shipped), and 090 (agent trims), 8 items remain `OVER-SOFT` in the audit: `sk-prompt` (132/130) and 7 commands clustered at 112-122 chars (target 110). Each is mild over-soft (≤22 chars over) — not failure-class. Project total is currently 5,546 chars with +54 headroom under the 5,600 ceiling. Acceptable, but tight; one more reasonable additions and we cross over again.

### Purpose
Pull the cluster cleanly under the soft target with ~10-25 chars margin per item. Ships ~158 chars of project headroom in one mechanical pass. Closes out the trim arc started in packet 083.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 1 skill: `.opencode/skills/sk-prompt/SKILL.md`
- 7 commands: `create/changelog`, `create/sk-skill`, `doctor/code-graph`, `deep/start-agent-improvement-loop`, `prompt`, `memory/manage`, `memory/search`
- Edit `description:` field only; preserve all other frontmatter

### Out of Scope
- All other skills/commands/agents (already under target after 083/090)
- Body content of any file — untouched
- Changing soft-target constants (still 130/110)

### Files to Change

| File | Current | Target | Trim text |
|------|--------:|-------:|-----------|
| `.opencode/skills/sk-prompt/SKILL.md` | 132 | 100 | `Prompt engineering specialist: structured AI prompts via 7 frameworks, DEPTH thinking, CLEAR scoring.` |
| `.opencode/commands/create/changelog.md` | 114 | 97 | `Create global or packet-local changelog. Topology-aware, optional GitHub release. :auto/:confirm.` |
| `.opencode/commands/create/sk-skill.md` | 112 | 96 | `Create or update OpenCode skills via one unified command with operation routing. :auto/:confirm.` |
| `.opencode/commands/doctor/code-graph.md` | 119 | 101 | `Diagnose and fix code-graph index health (stale, missed, bloat). :auto/:confirm/:apply/:apply-confirm.` |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | 122 | 99 | `Evaluate and improve any agent: 5 dimensions, proposals, scoring, guarded promotion. :auto/:confirm.` |
| `.opencode/commands/prompt.md` | 112 | 97 | `Create or improve AI prompts via sk-prompt: frameworks, DEPTH thinking, CLEAR; optional dispatch.` |
| `.opencode/commands/memory/manage.md` | 116 | 97 | `Manage indexed-continuity DB: stats, scan, cleanup, retention, validate, checkpoint, ingest, CCC.` |
| `.opencode/commands/memory/search.md` | 112 | 94 | `Unified continuity retrieval: spec-doc search, baselines, causal graph, ablations, dashboards.` |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 items at or below their soft target | sk-prompt ≤130, 7 commands ≤110 |
| REQ-002 | All trims preserve primary keywords | Each trim retains the skill/command name token, primary verb, primary domain noun |
| REQ-003 | Project total below 5,400 chars | Stretch target — leaves ~200 chars headroom under 5,600 ceiling |
| REQ-004 | No `OVER-SOFT` items remain in audit | `audit_descriptions.py --json | jq '.overSoft | length'` == 0 |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Audit reports `overSoft: 0`, `hardFails: 0`, headroom ≥ 200.
- **SC-002**: `validate.sh --strict` PASSES.
- **SC-003**: Mode suffixes (`:auto`, `:confirm`, `:apply`) preserved in command trims (advisor trigger tokens).

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Trim removes a routing keyword | Advisor stops auto-suggesting | Each trim retains skill/command name, primary verb, mode suffixes |
| Risk | sk-prompt loses one of "frameworks/DEPTH/CLEAR" anchors | Lexical-lane scoring drops | Keep all three in the trim; designed for it |
| Dependency | `audit_descriptions.py` (packet 086) | Confirms post-trim state | Already shipped |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_(none — trims captured in scope table)_

<!-- /ANCHOR:questions -->
