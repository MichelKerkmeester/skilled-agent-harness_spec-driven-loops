---
title: "Feature Specification: Skill Description Budget Trim"
description: "Trim skill+command frontmatter descriptions across .opencode/skill and .opencode/command so the total fits the Claude Code default SLASH_COMMAND_TOOL_CHAR_BUDGET (8,000 chars) without dropping skills."
trigger_phrases:
  - "skill description"
  - "budget"
  - "dropped"
  - "frontmatter"
  - "trim"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/083-skill-description-budget-trim"
    last_updated_at: "2026-05-06T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Apply trims (see tasks.md T004/T005)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-083"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Skill Description Budget Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` (no feature branch — per memory rule "Stay on main") |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code's status line reports `15 skill descriptions dropped`. The harness caps total skill metadata at `SLASH_COMMAND_TOOL_CHAR_BUDGET` (default 8,000 chars). This repo's 16 SKILL.md frontmatters + 23 command frontmatters total ~7,646 chars — combined with bundled Claude Code built-ins (~2,400 chars: `claude-api`, `update-config`, `loop`, `schedule`, etc.) the harness sees ~10,050 chars and drops the longest 15 alphabetically. Dropped skills still work when invoked explicitly (`/skill-name`) but lose model auto-discovery.

### Purpose
Trim project-owned skill and command descriptions to free ≥2,100 chars of budget so all skills are visible at the default budget — without an env-var override, since other skill providers and built-ins assume the default.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Trim `description` field in YAML frontmatter for 16 files in `.opencode/skills/*/SKILL.md`
- Trim `description` field in YAML frontmatter for 23 files in `.opencode/commands/**/*.md`
- Verification audit re-run to confirm new total fits under 8,000 chars with margin
- Caps: ≤130 chars per skill, ≤110 chars per command (uniform target)

### Out of Scope
- SKILL.md body content (instructions, references, scripts) — untouched
- `allowed-tools`, `version`, `argument-hint`, or other frontmatter fields
- Any change to `~/.claude/settings.json` env vars (the `SLASH_COMMAND_TOOL_CHAR_BUDGET=16000` override added earlier this session has been reverted to use defaults)
- Trimming Claude Code built-in skills (those are bundled with the CLI, not project-owned)
- `disable-model-invocation: true` flag adoption — deferred; pure description trim is sufficient

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/*/SKILL.md` (16 files) | Modify | Tighten `description` line to ≤130 chars, drop enumerations and product lists |
| `.opencode/commands/**/*.md` (23 files) | Modify | Tighten `description` line to ≤110 chars |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 16 skill descriptions trimmed | Each `.opencode/skills/*/SKILL.md` description field ≤130 chars; keyword density preserved (skill name, primary verb, primary object) |
| REQ-002 | All 23 command descriptions trimmed | Each `.opencode/commands/**/*.md` description field ≤110 chars |
| REQ-003 | Total project description budget < 5,600 chars | Audit script sum reports < 5,600 (leaves ≥2,400 for Claude Code built-ins under the 8,000 default) |
| REQ-004 | No stack enumerations in skill descriptions | sk-code, mcp-code-mode, etc. drop product lists per memory rule "Stack-agnostic phrasing in agent descriptions" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Skill discoverability preserved | Each trimmed description still contains the skill's primary trigger keywords so the advisor hook still ranks correctly |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After restart, the `15 skill descriptions dropped` warning clears (or shows a much smaller drop count attributable only to other plugins).
- **SC-002**: Audit script confirms project descriptions total < 5,600 chars.
- **SC-003**: Skill advisor still routes correctly (no skill loses its primary keyword).

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-aggressive trim removes routing keyword | Skill advisor stops auto-suggesting the skill | Each trim retains skill name + primary verb + primary domain noun |
| Risk | YAML quoting breaks (description contains special chars) | Frontmatter parser fails | Keep descriptions as plain double-quoted strings, no embedded colons mid-sentence |
| Dependency | `system-spec-kit` validate.sh accepts level 1 packets | Strict validation passes | Mirror Level 1 example structure |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_(none — scope is mechanical metadata edit)_

<!-- /ANCHOR:questions -->
