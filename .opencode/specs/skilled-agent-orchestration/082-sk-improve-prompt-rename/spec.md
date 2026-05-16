---
title: "Feature Specification: sk-improve-prompt → sk-prompt Skill Rename — Phase Parent"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for renaming sk-improve-prompt → sk-prompt across the entire repo. Simple semantic rename with broad cross-file reference impact (~200 total refs, ~51 active files across .opencode/, .claude/, .codex/, .gemini/, root docs, configs, skill graph, advisor signals)."
trigger_phrases:
  - "082 sk-improve-prompt rename"
  - "sk-improve-prompt to sk-prompt"
  - "rename sk-improve-prompt"
  - "skill rename sk-prompt"
  - "drop improve from skill name"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename"
    last_updated_at: "2026-05-06T13:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Packet 082 PASSED post deep-review × 5 remediations"
    next_safe_action: "Final memory save + close packet"
    blockers: []
    key_files:
      - "spec.md"
      - "resource-map.md"
      - "001-discovery-impact-map/spec.md"
      - "002-skill-folder-rename/spec.md"
      - "003-opencode-internals/spec.md"
      - "004-runtime-mirrors/spec.md"
      - "005-root-and-config/spec.md"
      - "006-advisor-and-validate/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This document is the PARENT spec for the 6-phase sk-improve-prompt → sk-prompt skill rename.
  All planning, tasks, checklists, decisions, and continuity live in the child phase folders 001..006.
  This file declares ROOT PURPOSE, the SUB-PHASE MANIFEST, and WHAT NEEDS DONE — nothing else.
-->

# Feature Specification: sk-improve-prompt → sk-prompt Skill Rename — Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Code-Complete (review pending) |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../` (skilled-agent-orchestration top-level) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | 081-cli-copilot-deprecation-due-to-price-hike |
| **Successor** | (none yet — TBD) |
| **Handoff Criteria** | All 6 phases validate strict; advisor probes confirm `sk-prompt` routes correctly for prompt-improvement intents; final grep returns zero hits for `sk-improve-prompt` outside historical commit/log artifacts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill currently named `sk-improve-prompt` carries a redundant `-improve-` segment that duplicates intent already encoded by its dispatcher command (`/improve:prompt`) and agent (`@improve-prompt`). Sibling skills that surface a single capability use single-word names (`sk-code`, `sk-doc`, `sk-git`). Renaming to `sk-prompt` aligns with that convention while preserving the `sk-` family marker.

This is a SIMPLE semantic rename — no behavior change, no scope reshuffle — but it has BROAD cross-file impact:
- ~200 files reference `sk-improve-prompt` total
- ~51 files in active scope (excluding z_archive, z_future, completed packets, .git)
- Spans: `.opencode/`, `.claude/`, `.codex/`, `.gemini/`, root docs, configs, skill graph, advisor signals (skill_advisor.py 31 refs!), MCP scorer lanes, 5 cli-* prompt_quality_card mirrors

### Purpose
Decompose the rename into 6 sequential phases that minimize risk and surface verification at every step:

- **001-discovery-impact-map** authors a comprehensive inventory of every active file that needs touching, grouped by area, with edge cases flagged (filename embeds, JSON keys, code-graph node IDs, etc.).
- **002-skill-folder-rename** physically renames the skill folder via `git mv` and updates the skill-graph.json keys + signal references; runs advisor_rebuild immediately.
- **003-opencode-internals** updates every reference inside the `.opencode/` tree: dispatcher command body (`/improve:prompt`), scorer lanes (explicit.ts, lexical.ts, fusion.ts), skill_advisor.py (31 refs), 5 cli-* prompt_quality_card.md mirrors, parent SKILL.md routing tables, advisor regression fixtures, observability docs.
- **004-runtime-mirrors** updates `.claude/agents/improve-prompt.md`, `.codex/agents/improve-prompt.toml`, `.gemini/agents/improve-prompt.md` (skill body refs only — agent file/name UNCHANGED).
- **005-root-and-config** updates root-level docs (root README.md, AGENTS.md install guide, .opencode/skills/README.md, observability docs, changelog v3.4.0.0.md).
- **006-advisor-and-validate** rebuilds the skill-graph.sqlite, runs advisor probes confirming `sk-prompt` routes correctly, validates strict on parent + 6 children, and runs a final grep audit returning 0 hits in active scope.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level alongside `resource-map.md` and the canonical lean trio (`description.json`, `graph-metadata.json`). All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders 001..006.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renaming `.opencode/skills/sk-improve-prompt/` → `.opencode/skills/sk-prompt/`
- Updating ALL active references to the old name throughout the repo, including:
  - SKILL.md frontmatter `name:` field, smart router pseudocode, internal self-references
  - Dispatcher command body at `.opencode/commands/improve/prompt.md` (loads the skill by name)
  - Agent body refs across 4 runtimes (.opencode, .claude, .codex, .gemini)
  - MCP server code: scorer lanes (explicit.ts, lexical.ts, fusion.ts), skill_advisor.py (TOKEN_BOOSTS, PHRASE_BOOSTS, aliases — 31 refs)
  - Skill graph: `skill-graph.json` (keys, signals, anti-signals, families, hub_skills, adjacency)
  - 5 cli-* prompt_quality_card.md mirrors (cli-claude-code, cli-codex, cli-gemini, cli-opencode) AND their parent SKILL.md routing tables
  - Advisor regression fixtures: `routing-accuracy/labeled-prompts.jsonl`
  - Sync helper: `check-prompt-quality-card-sync.sh`
  - Observability: smart-router-measurement-results.jsonl / -report.md (forward-facing IDs only)
  - Root docs: root README.md, AGENTS.md install guide, .opencode/skills/README.md
  - Changelog: system-spec-kit/changelog/v3.4.0.0.md (active changelog only)
- Rebuilding `skill-graph.sqlite` via `advisor_rebuild` after JSON key edits
- Verifying advisor probes route the new name correctly

### Out of Scope (at the parent level)
- Behavior changes to the skill — the rename is purely semantic
- Renaming the agent `@improve-prompt` or its file `improve-prompt.md` (4 runtime mirrors) — ONLY the skill it loads changes name
- Renaming the dispatcher command `/improve:prompt` or its file `prompt.md` — ONLY its body's skill ref changes
- Updating committed git log messages — historical commits keep their original wording
- Updating archived spec folders that mention the old name (`z_archive/`, `z_future/`, completed packets {054, 055, 061, 063, 067, 070, 079}) — they're frozen historical context
- Renaming sibling skills that already follow conventions (system-spec-kit, mcp-coco-index, sk-code, sk-doc, sk-git, etc.)
- Editing `.claude/CLAUDE.md` (user global, out of repo scope)

### Files to Change (per-phase blast radius)

| Phase | Folder | Estimated file count | Risk |
|-------|--------|----------------------|------|
| 001 | `001-discovery-impact-map/` | 0 (read-only inventory) | None |
| 002 | `002-skill-folder-rename/` | 1 folder rename + skill-graph.json keys + ~7 internal self-refs | Medium (impacts immediate routing) |
| 003 | `003-opencode-internals/` | ~30 .opencode/ files (scorer, advisor, dispatcher, cli-* mirrors) | High (largest blast radius) |
| 004 | `004-runtime-mirrors/` | ~4 .claude/.codex/.gemini files | Low |
| 005 | `005-root-and-config/` | ~6 root + observability files | Low |
| 006 | `006-advisor-and-validate/` | 0 source mods (verification only) | None |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | [001-discovery-impact-map/](./001-discovery-impact-map/) | Comprehensive grep inventory of all active references to `sk-improve-prompt`; canonical file ledger authoring | Pending |
| 002 | [002-skill-folder-rename/](./002-skill-folder-rename/) | `git mv` skill folder + skill-graph.json key updates + skill internal self-refs + advisor_rebuild | Pending |
| 003 | [003-opencode-internals/](./003-opencode-internals/) | Update dispatcher, scorer lanes, skill_advisor.py, 5 cli-* mirrors + their SKILL.md routing tables | Pending |
| 004 | [004-runtime-mirrors/](./004-runtime-mirrors/) | Update .claude/, .codex/, .gemini/ agent body refs (filenames + agent name unchanged) | Pending |
| 005 | [005-root-and-config/](./005-root-and-config/) | Root docs (README, AGENTS install guide, skill/README) + active changelog + observability docs | Pending |
| 006 | [006-advisor-and-validate/](./006-advisor-and-validate/) | Advisor rebuild, probe verification, strict validate, final grep gate | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` before the next begins
- Phase 001 produces the canonical inventory list that 002–005 work against
- Phase 002 MUST complete before 003-005 (folder rename precedes reference updates so paths exist)
- Phase 003-005 can run sequentially or in parallel cli-codex dispatches (different file subtrees, no overlap)
- Phase 006 is final verification — runs after all preceding phases pass

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Inventory complete; canonical file ledger written; estimated counts accurate | grep counts match resource-map estimates within ±10% |
| 002 | 003 | Skill folder renamed; `skill-graph.json` keys updated; `advisor_rebuild` reports live | `advisor_status` returns generation bumped; `ls .opencode/skills/sk-prompt/` succeeds |
| 003 | 004 | All `.opencode/` references updated; no regressions in advisor lookups | grep `.opencode/` (excluding historical scope) for old name returns 0 |
| 004 | 005 | All runtime mirror refs updated | grep `.claude .codex .gemini` for old name returns 0 |
| 005 | 006 | Root docs + active configs updated | grep root + active changelog for old name returns 0 |
| 006 | (done) | Advisor probes confirm `sk-prompt` routes correctly for prompt-improvement intents; full grep returns 0 hits outside historical artifacts; validate strict passes on parent + 6 children | Final `validate.sh --strict --recursive` PASSED; advisor probe top-1 = `sk-prompt` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Are there code-graph node IDs (in `.cocoindex_code/` or similar embeddings databases) that hold the old skill name? If yes, those need a separate re-index pass — captured in Phase 001's edge-case audit.
- Do historical changelog entries reference the old name? Yes — those stay as-is (they're historical record); only the active changelog `v3.4.0.0.md` may need touching, plus a NEW changelog entry from this rename using `sk-prompt`.
- Are there spec folders under `z_archive/`, `z_future/`, or completed packets that mention the old name? Yes — those are frozen historical context; left untouched per CLAUDE.md frozen-continuity rule and the explicit Don't list in the orchestrator plan-prompt.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-*` through `006-*` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Parent Spec**: See `../` (skilled-agent-orchestration)
- **Resource Map**: See [resource-map.md](./resource-map.md) — three-column ledger of MUST rename / SKIP / needs-decision targets
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Predecessor Template**: `070-sk-deep-rename/` — same shape, broader scope (2 skills, 700-1000+ files); 082 mirrors its phase decomposition
