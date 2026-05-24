---
title: "Implementation Summary: Skill Description Budget Trim"
description: "Trimmed 16 skill + 20 command frontmatter descriptions to fit Claude Code's default 8,000-char skill-metadata budget. Total project descriptions reduced from 7,646 → 4,423 chars."
trigger_phrases:
  - "implementation summary"
  - "skill description"
  - "budget"
  - "trim"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/083-skill-description-budget-trim"
    last_updated_at: "2026-05-06T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Trimmed 36 frontmatter descriptions; total project description budget 7,646 → 4,423 chars"
    next_safe_action: "Restart Claude Code session to confirm dropped count is 0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/mcp-code-mode/SKILL.md"
      - ".opencode/commands/doctor/code-graph.md"
      - ".opencode/commands/create/changelog.md"
      - ".opencode/commands/memory/manage.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill Description Budget Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 083-skill-description-budget-trim |
| **Completed** | 2026-05-06 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Trimmed YAML-frontmatter `description:` fields across 36 of 39 project skill/command files (3 commands were already short and untouched). Reverted the interim `SLASH_COMMAND_TOOL_CHAR_BUDGET=16000` env-var override added earlier in the session so the default 8,000-char budget governs again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.claude/settings.json` | Modified | Removed `SLASH_COMMAND_TOOL_CHAR_BUDGET` (revert to default 8000) |
| `.opencode/skills/sk-code/SKILL.md` | Modified | 545 → 125 chars (dropped enumerated stack list) |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Modified | 300 → 125 chars |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | 262 → 124 chars |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | 256 → 121 chars |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | 253 → 126 chars |
| `.opencode/skills/cli-gemini/SKILL.md` | Modified | 250 → 121 chars |
| `.opencode/skills/sk-prompt/SKILL.md` | Modified | 240 → 132 chars |
| `.opencode/skills/cli-codex/SKILL.md` | Modified | 230 → 115 chars |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modified | 225 → 124 chars |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | 219 → 127 chars |
| `.opencode/skills/mcp-chrome-devtools/SKILL.md` | Modified | 209 → 120 chars |
| `.opencode/skills/deep-review/SKILL.md` | Modified | 179 → 128 chars |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modified | 176 → 120 chars |
| `.opencode/skills/sk-code-review/SKILL.md` | Modified | 174 → 120 chars |
| `.opencode/skills/sk-git/SKILL.md` | Modified | 162 → 122 chars |
| `.opencode/skills/deep-research/SKILL.md` | Modified | 145 → 122 chars |
| `.opencode/commands/memory/search.md` | Modified | 146 → 112 chars |
| `.opencode/commands/memory/manage.md` | Modified | 211 → 116 chars |
| `.opencode/commands/doctor/code-graph.md` | Modified | 248 → 119 chars |
| `.opencode/commands/doctor/mcp_install.md` | Modified | 165 → 110 chars |
| `.opencode/commands/doctor/skill-advisor.md` | Modified | 167 → 109 chars |
| `.opencode/commands/doctor/mcp_debug.md` | Modified | 151 → 99 chars |
| `.opencode/commands/speckit/complete.md` | Modified | 111 → 94 chars |
| `.opencode/commands/speckit/implement.md` | Modified | 122 → 101 chars |
| `.opencode/commands/speckit/deep-review.md` | Modified | 112 → 100 chars |
| `.opencode/commands/speckit/resume.md` | Modified | 106 → 90 chars |
| `.opencode/commands/speckit/deep-research.md` | Modified | 117 → 105 chars |
| `.opencode/commands/speckit/plan.md` | Modified | 121 → 89 chars |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modified | 183 → 122 chars |
| `.opencode/commands/prompt.md` | Modified | 163 → 112 chars |
| `.opencode/commands/create/agent.md` | Modified | 127 → 104 chars |
| `.opencode/commands/create/changelog.md` | Modified | 241 → 114 chars |
| `.opencode/commands/create/sk-skill.md` | Modified | 128 → 112 chars |
| `.opencode/commands/create/feature-catalog.md` | Modified | 137 → 89 chars |
| `.opencode/commands/create/testing-playbook.md` | Modified | 145 → 97 chars |
| `.opencode/commands/create/folder_readme.md` | Modified | 140 → 102 chars |

3 commands untouched (already ≤110 chars): `memory/learn`, `memory/save`, `agent_router`.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

### Approach

Single-pass scripted edit. Two Python scripts (`/tmp/trim-skill-descriptions.py`, `/tmp/trim-command-descriptions.py`) hold explicit `(file_path, old_description, new_description)` triples. Each script:

1. Reads the file as a string.
2. Asserts the exact `description: <old>` line is present and unique.
3. Replaces it with `description: <new>`.
4. Writes back.

No regex, no AST manipulation — pure string replace, deterministic and easy to audit.

### Sequence

| Step | Action | Result |
|------|--------|--------|
| 1 | Audit baseline (`awk` over frontmatters) | 7,646 chars combined; 16 skills + 23 commands |
| 2 | Define per-file trim pairs | Skills target ≤130, commands target ≤110 |
| 3 | Apply 16 skill rewrites | All ≤132 chars (sk-prompt at 132, intentional) |
| 4 | Apply 20 command rewrites | All ≤122 chars (deep/start-agent-improvement-loop at 122) |
| 5 | Re-audit | 4,423 chars combined → 1,177 headroom under 5,600 target |
| 6 | Revert env var override | `~/.claude/settings.json` no longer pins `SLASH_COMMAND_TOOL_CHAR_BUDGET` |
| 7 | Live harness reminder check | All 49 skills visible with new descriptions |

### Trim style guide (applied uniformly)

- **Drop** product enumerations (ClickUp/Notion/Figma/Chrome lists)
- **Drop** stack lists (HTML/CSS/JS/Motion.dev/GSAP/...)
- **Drop** marketing prose ("Mandatory for ...", "Provides ... efficient ...")
- **Drop** parenthetical jargon (e.g., "(gold battery, staleness model, exclude-rule confidence tiers)")
- **Keep** skill name token, primary verb, primary domain noun
- **Keep** mode suffixes (`:auto`/`:confirm`/`:apply`) — these are advisor trigger tokens
- **Keep** numeric specifics ("5-dim scoring", "9 steps", "4 MCP servers") that signal what the skill actually does

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use default budget, not env-var override | Other plugins and Claude Code built-ins assume the 8,000 default; raising it locally hides the underlying bloat |
| Drop stack enumerations from sk-code | Aligns with memory rule "Stack-agnostic phrasing in agent descriptions"; sk-code's smart router detects surfaces at dispatch time |
| Drop product lists from mcp-code-mode | Listed products (ClickUp/Notion/Figma/Chrome) churn; "ALL external MCP tool calls" covers them all |
| Keep `:auto/:confirm` mode suffixes in command descriptions | These are the literal trigger tokens users type; required for advisor routing |
| Defer `disable-model-invocation: true` adoption | Pure description trim was sufficient; no need to silence skills entirely |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Audit | Pass | Combined total 4,423 chars (target ≤5,600); 1,177-char headroom |
| Smoke | Pass | Harness session-start reminder shows all 49 visible skills with trimmed descriptions |
| Routing | Pass | Skill advisor still ranks each trimmed skill on its primary keyword (verified live: `sk-code` 0.82, `cli-claude-code` 0.86 in this session) |
| Strict validate | Pending | `validate.sh --strict` first run had template/anchor warnings; rewrites of plan.md/tasks.md/implementation-summary.md added missing `SPECKIT_TEMPLATE_SOURCE` headers and anchors |

### Budget math

- **Before**: 16 skills × avg 251 + 23 commands × avg 157 = **7,646 chars** project descriptions
- **After**: 16 skills × avg 126 + 23 commands × avg 104 = **4,423 chars** project descriptions
- **Saved**: 3,223 chars (42% reduction)
- **Combined with built-ins (~2,400 chars)**: ~6,823 chars total → ~1,177 chars headroom under 8,000 default

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sk-prompt` ended at 132 chars** (target was ≤130) — kept the explicit "7 frameworks, DEPTH thinking, CLEAR scoring" triple because all three are routing-keyword anchors. 2 chars over target is well within budget headroom.
2. **No automated test for advisor regression** — verified the live advisor still ranks correctly in this session, but a regression suite would catch future drift. Out of scope for this Level 1 packet.
3. **Claude Code built-in budget consumption is unknown** — built-ins (`claude-api`, `update-config`, `loop`, etc.) come bundled with the CLI and we have no visibility into their exact char count beyond what session reminders display. Estimated ~2,400 from observation.
4. **Restart required** — the `SLASH_COMMAND_TOOL_CHAR_BUDGET` env-var revert and the new default-budget regime won't take effect until Claude Code is restarted. The "15 dropped" status-line warning will persist until then.

<!-- /ANCHOR:limitations -->
