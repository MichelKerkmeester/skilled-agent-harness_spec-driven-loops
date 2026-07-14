---
title: "Feature Specification: Agent Description Trim"
description: "Trim 6 over-soft agent descriptions across 4 runtime mirrors (24 files) to land project total under the 5,600-char soft ceiling. Surfaced by /doctor:skill-budget at packet 086 close."
trigger_phrases:
  - "agent description trim"
  - "090 agent trim"
  - "skill-budget over ceiling"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/074-agent-description-trim"
    last_updated_at: "2026-05-06T14:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Apply trims via Python script"
    blockers: []
    key_files:
      - ".opencode/agents/debug.md"
      - ".opencode/agents/code.md"
      - ".opencode/agents/deep-review.md"
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/agents/prompt-improver.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-090"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Agent Description Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/doctor:skill-budget` audit shipped in packet 086 surfaced 6 agents whose descriptions exceed the 130-char soft target — none were touched by packet 083's skill+command trim because that packet's scope was deliberately limited. Project description total currently sits at **6,086 chars**, **486 chars over the 5,600 soft ceiling** (still well under Claude Code's 8,000 hard default, so no skills are being dropped today, but headroom is gone). The 6 over-soft agents are: `debug` (306), `multi-ai-council` (179), `code` (178), `deep-review` (158), `prompt-improver` (145), `orchestrate` (134). Each is mirrored across 4 runtime surfaces (`.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`) — 24 files total.

### Purpose
Trim each agent description to ≤110 chars while preserving the agent name token, primary verb, primary domain noun, and any LEAF/dispatch-by routing-keyword anchors. Apply uniformly across all 4 runtime mirrors per the memory rule "New agents must mirror to all 4 runtimes". Land project total under the 5,600 soft ceiling with measurable headroom.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 agents × 4 runtime mirrors = 24 file edits
- YAML frontmatter (`description: <text>`) for `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`
- TOML frontmatter (`description = "<text>"`) for `.codex/agents/`
- Trim targets: ≤110 chars per agent; aim for ~95 average
- Verify post-trim project total is below 5,600 ceiling

### Out of Scope
- Agent body content (workflow, behavior rules, examples) — untouched
- Other frontmatter fields (`mode`, `temperature`, `permission`, `mcpServers`, etc.) — untouched
- Already-short agents (`@context`, `@create`, `@review`, `@improve-agent`, etc.) — already under 130 chars
- Skill or command descriptions — those were 083's domain
- The 8 over-soft commands (`memory/manage`, `deep/start-agent-improvement-loop`, `create/changelog`, etc.) — defer to packet 091 if needed

### Files to Change

| Agent | Surfaces (4 each) |
|-------|-------------------|
| `debug` | `.opencode/agents/debug.md`, `.claude/agents/debug.md`, `.gemini/agents/debug.md`, `.codex/agents/debug.toml` |
| `multi-ai-council` | same 4-tuple |
| `code` | same 4-tuple |
| `deep-review` | same 4-tuple |
| `prompt-improver` | same 4-tuple |
| `orchestrate` | same 4-tuple |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 agents trimmed to ≤110 chars | Each `.opencode/agents/<name>.md` description value (post-quote-strip) is ≤110 chars |
| REQ-002 | All 4 runtime mirrors updated per agent | The same trim text appears in `.opencode/`, `.claude/`, `.gemini/` (YAML) and `.codex/` (TOML) |
| REQ-003 | Project total below 5,600 soft ceiling | `audit_descriptions.py --json` reports `headroomChars >= 0` |
| REQ-004 | All trims preserve agent name token | The agent's literal name token (e.g., `debug`, `orchestrate`, `deep-review`) appears in the trimmed text |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Advisor still ranks each agent on its primary task | Manual probe for at least 2 agents (e.g., `debug` for "investigate this bug", `orchestrate` for "decompose this multi-step task"); top-recommended agent unchanged |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/doctor:skill-budget :auto` reports project total ≤ 5,600 chars with positive headroom.
- **SC-002**: `validate.sh --strict` on this spec folder PASSES.
- **SC-003**: No `OVER-SOFT` agents remain in audit output.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Trim removes a routing-keyword anchor | Advisor stops auto-suggesting the agent | REQ-004 enforces name-token preservation; REQ-005 manual probe |
| Risk | YAML and TOML drift to different texts | Cross-runtime advisor inconsistency | Apply identical trim string to all 4 mirrors per agent (script-driven, not hand-written) |
| Risk | Existing yaml descriptions have minor variation across runtimes | Replacement may need per-file regex | Use regex-based find-replace operating on the description-field VALUE not the surrounding line |
| Dependency | `/doctor:skill-budget` audit (shipped in 086) | Confirms post-trim state | Already shipped |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_(none — trim text choices captured in plan.md)_

<!-- /ANCHOR:questions -->
