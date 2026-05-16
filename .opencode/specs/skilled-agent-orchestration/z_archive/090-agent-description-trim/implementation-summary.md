---
title: "Implementation Summary: Agent Description Trim"
description: "Trimmed 6 agent descriptions across 4 runtime mirrors (24 files). Project total 6,086 → 5,546 chars (+54 headroom under 5,600 ceiling). Acts on the first finding from /doctor:skill-budget."
trigger_phrases:
  - "090 implementation summary"
  - "agent description trim summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/090-agent-description-trim"
    last_updated_at: "2026-05-06T14:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 24 mirrors trimmed; project under ceiling"
    next_safe_action: "Optional: packet 091 to trim 8 over-soft commands"
    blockers: []
    key_files:
      - ".opencode/agents/debug.md"
      - ".opencode/agents/code.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-090"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Agent Description Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 090-agent-description-trim |
| **Completed** | 2026-05-06 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Acted on the first real finding from `/doctor:skill-budget` (shipped in packet 086): trimmed 6 over-soft agent descriptions across all 4 runtime mirrors (`.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`) — 24 files total. Each agent's name token, primary verb, primary domain noun, and dispatch-routing keyword were preserved.

### Files Changed

| Agent | Before | After | Trim text |
|-------|------:|------:|-----------|
| `debug` | 306 | 95 | "User-invoked fresh-perspective debugger: 5-phase root-cause methodology, never auto-dispatched." |
| `multi-ai-council` | 179 | 93 | "Multi-AI council planning architect: diverse AI lenses, multi-round deliberation, plans only." |
| `code` | 178 | 94 | "Application-code implementation specialist via sk-code. LEAF, dispatched only by @orchestrate." |
| `deep-review` | 158 | 85 | "LEAF deep-review iteration agent: one dimension/pass, P0/P1/P2 findings, JSONL state." |
| `prompt-improver` | 145 | 91 | "Prompt-improver specialist: framework selection, CLEAR validation, dispatch-ready packages." |
| `orchestrate` | 134 | 93 | "Senior orchestration agent: task decomposition, delegation, quality eval, delivery synthesis." |

Each trim applied to all 4 runtime mirrors per agent (24 file edits).

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

### Approach

Single-pass scripted edit. `/tmp/trim-agent-descriptions-090.py` (run-time only, not committed) holds a single source-of-truth dictionary `agent_name → trim_text` and a list of 4 runtime mirrors. For each (agent, mirror) pair it locates the description field via regex constrained to the YAML frontmatter block (or top-level TOML key), replaces the value, writes back. No regex on full file; no AST manipulation.

### Sequence

| Step | Action | Result |
|------|--------|--------|
| 1 | Pre-trim audit (`audit_descriptions.py --json`) | TOTAL 6,086, headroom -486, overSoft 14 (incl. 6 agents), hardFails 0 |
| 2 | Designed 6 trim strings (≤110 each, name-token preserved) | Avg 91 chars |
| 3 | Wrote `/tmp/trim-agent-descriptions-090.py` | YAML branch: regex-replace inside frontmatter block; TOML branch: top-level `description = "..."` line |
| 4 | Ran script | 24 files OK, 0 failures |
| 5 | Post-trim audit | TOTAL 5,546 (saved 540), headroom +54 under 5,600, overSoft agents: 0 |

### Format handling

| Mirror | Format | Replacement target |
|--------|--------|---------------------|
| `.opencode/agents/<name>.md` | YAML frontmatter | `^description:\s*.+$` inside `---...---` block |
| `.claude/agents/<name>.md` | YAML frontmatter | same |
| `.gemini/agents/<name>.md` | YAML frontmatter | same |
| `.codex/agents/<name>.toml` | TOML key | `^description\s*=\s*"[^"]*"` (top-level only) |

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Identical trim text across all 4 runtime mirrors per agent | Memory rule: "New agents must mirror to all 4 runtimes". Drift between runtimes is a known failure mode. Script enforces uniformity at write time. |
| Trim target ~95 chars (not 110 max) | Targets in 85-95 range give ~50 chars of additional cushion vs. just "passing the soft target" by 15 chars. Future small additions to agent body don't immediately re-trip the audit. |
| Preserve agent name token in every trim | Lexical-lane scoring boost; routing keyword anchor. REQ-004 enforced this. |
| Keep `:LEAF`, `dispatched only by @orchestrate`, `never auto-dispatched`, etc. | These are the routing-discipline anchors that distinguish each agent's authority/scope. The advisor uses them to disambiguate similar agents. |
| Did NOT trim the 8 over-soft commands surfaced by audit | Out of scope per spec.md. They remain over-soft (avg 115 chars; not failure-class). Optional packet 091 if more headroom is wanted; currently 54 chars is comfortable enough. |
| Did NOT trim sk-prompt (132 chars, soft-target 130) | Already triaged in packet 083 as a 2-char-over edge case; the description front-loads three required routing anchors ("7 frameworks, DEPTH thinking, CLEAR scoring"). |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Evidence |
|-----------|--------|----------|
| Audit pre-trim | Recorded | TOTAL 6,086 / headroom -486 / overSoft 14 (6 agents, 8 commands) |
| Audit post-trim | PASS | TOTAL 5,546 / **headroom +54** / overSoft 8 (only commands remain; agents: 0) |
| Name-token preservation | PASS | All 6 trims contain agent name token; spot-checked via grep on `.opencode/agents/*.md` |
| Strict spec validation | PASS | After impl-summary.md written: 0 errors, 0 warnings, RESULT: PASSED |
| Cross-runtime consistency | PASS | Trim script applied identical text to all 4 mirrors per agent; 24/24 successful, 0 failures |

### Project budget after this packet

- **Before 090**: 6,086 chars (5,977 from 086 baseline + 108 from 086's own additions); -486 chars under 5,600
- **After 090**: 5,546 chars (saved 540); **+54 chars headroom** under 5,600 ceiling
- **Headroom under 8,000 default**: 2,454 chars (very comfortable)

The first real signal-to-action loop for `/doctor:skill-budget` worked end-to-end: the audit detected drift, this packet acted on it, the audit confirms it landed.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **8 over-soft commands remain** (avg 115 chars; mild over-soft, not failure-class): `memory/manage` 116, `memory/search` 112, `improve/prompt` 112, `create/sk-skill` 112, `improve/agent` 122, `doctor/code-graph` 119, `create/changelog` 114, plus `sk-prompt` 132 from packet 083. Optional packet 091 could trim these to land deeper under the ceiling. Current +54 headroom is acceptable.
2. **Trim text is canonical at write time but not enforced post-write.** A later edit to any of the 24 files could drift back over the soft target. Recommend running `/doctor:skill-budget :auto` after any agent-description edit (already documented as a workflow step in `/create:agent`).
3. **No cross-runtime drift checker yet.** Today the trim script produces identical text everywhere, but nothing prevents a manual edit to one mirror without the others. A "agent-description sync" check is a candidate for a follow-on packet (audit script could compare descriptions across mirrors and flag mismatches).
4. **Codex's 1,024-char cap (per the warning observed in packet 086 close)** is well above all current trims, so this packet doesn't need a separate Codex-specific check. Documented for future reference.

<!-- /ANCHOR:limitations -->
