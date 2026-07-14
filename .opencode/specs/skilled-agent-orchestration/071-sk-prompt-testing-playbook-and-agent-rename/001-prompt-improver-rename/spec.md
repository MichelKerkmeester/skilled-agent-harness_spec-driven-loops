---
title: "Feature Specification: Phase 001 — Rename @improve-prompt agent to @prompt-improver"
description: "Rename the @improve-prompt agent to @prompt-improver across all 4 runtimes (.opencode, .claude, .codex, .gemini) plus 31 active-scope reference files via direct sed. Aligns agent naming with the noun-form family (@code, @review, @debug, @context). No behavior change — pure semantic rename."
trigger_phrases:
  - "085 phase 001"
  - "improve-prompt to prompt-improver agent rename"
  - "noun-form agent name"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/071-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename"
    last_updated_at: "2026-05-06T15:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 001 rename complete + post deep-review fixes"
    next_safe_action: "Phase 002 complete; final memory save"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-085-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 001 — Rename @improve-prompt agent to @prompt-improver

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `085-sk-prompt-testing-playbook-and-agent-rename` |
| **Phase** | 001 of 002 |
| **Handoff Criteria** | All 4 agent files renamed + frontmatter rotated; ~31 reference files updated; `rg -l '@improve-prompt' .opencode .claude .codex .gemini` (active scope) returns 0; ls of new path succeeds; advisor probes still resolve |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `@improve-prompt` agent name is verb-object phrasing — an outlier in the noun-form agent family (`@code`, `@review`, `@debug`, `@context`, `@deep-research`, `@deep-review`). This creates inconsistency in naming and makes the agent harder to reason about as an entity (an agent IS a thing, not an action). Renaming to `@prompt-improver` aligns with convention and matches the doer-of-action pattern (improver = noun for agent-that-improves).

### Purpose
Rename the agent across all 4 runtime mirrors plus all active reference surfaces. Pure semantic rename — no behavior change, no dispatcher contract change, no skill change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Physical agent file renames (4 runtimes):**
- `.opencode/agents/improve-prompt.md` → `.opencode/agents/prompt-improver.md`
- `.claude/agents/improve-prompt.md` → `.claude/agents/prompt-improver.md`
- `.codex/agents/improve-prompt.toml` → `.codex/agents/prompt-improver.toml`
- `.gemini/agents/improve-prompt.md` → `.gemini/agents/prompt-improver.md`

**Frontmatter rotation in renamed agent files:**
- `name: improve-prompt` → `name: prompt-improver`
- Description field updates (mentions of agent name)
- Body self-references

**Reference rotation across active scope (~31 files):**
- Dispatcher command body: `.opencode/commands/prompt.md`, `.opencode/commands/README.txt`
- 5 cli-* `prompt_quality_card.md` mirrors + their parent SKILL.md routing tables (cli-claude-code, cli-codex, cli-gemini, cli-opencode — and any cli-copilot residuals)
- Cli-* manual_testing_playbook scenario files referencing the agent
- `sk-prompt/SKILL.md` Section 7 (agent contract) + `sk-prompt/assets/cli_prompt_quality_card.md` + `sk-prompt/graph-metadata.json`
- `sk-doc/assets/agent_template.md` (template reference)
- `sk-code/manual_testing_playbook/04--skill-advisor-integration/001-advisor-probe-battery.md`
- `system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` (if aliased)
- Root: `README.md`, `AGENTS.md`, `.opencode/install_guides/SET-UP - AGENTS.md`, `.opencode/install_guides/README.md`
- Active changelogs: `.opencode/changelog/agent-orchestration/v2.4.0.0.md`, `system-spec-kit/changelog/v3.4.0.0.md`
- Agent runtime READMEs: `.opencode/agents/README.txt`, `.claude/agents/README.txt`, `.codex/agents/README.txt`, `.gemini/agents/README.txt`
- `.codex/config.toml`
- `.opencode/specs/descriptions.json` (auto-regenerates on memory save)

### Out of Scope

- Renaming the dispatcher command `/prompt` or its file `.opencode/commands/prompt.md` — only body's agent ref changes
- Renaming sibling agent `@improve-agent`
- Frozen continuity scope (z_archive, z_future, completed packets, .git, barter/, .claude/CLAUDE.md global)
- Behavior changes — pure semantic rename

### Files to Change

| File | Action | Refs | Type |
|------|--------|------|------|
| `.opencode/agents/improve-prompt.md` | Rename → `prompt-improver.md` + body | self | physical |
| `.claude/agents/improve-prompt.md` | Rename → `prompt-improver.md` + body | self | physical |
| `.codex/agents/improve-prompt.toml` | Rename → `prompt-improver.toml` + body | self | physical |
| `.gemini/agents/improve-prompt.md` | Rename → `prompt-improver.md` + body | self | physical |
| ~27 reference files | sed rotation | varies | string |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase scope is mechanical rename. Acceptance criteria captured in HANDOFF CRITERIA + checklist.md.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 4 runtime agent files renamed via `git mv` (or fallback `mv` per packet 082 sandbox precedent)
- Frontmatter `name:` field rotated in all 4 renamed files
- `rg -l '@improve-prompt|improve-prompt' .opencode .claude .codex .gemini *.md *.json` (active scope) returns 0 hits
- `ls .opencode/agents/prompt-improver.md` succeeds; `ls .opencode/agents/improve-prompt.md` returns "No such file"
- Advisor probes still resolve correctly (`improve my prompt` → `sk-prompt` skill, agent dispatched is `prompt-improver`)
- Strict validate on phase folder PASSES (0 errors, 0 warnings)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Race against parallel orchestration sessions** — mitigated via direct sed (per memory rule "CLI dispatch unreliability under heavy parallelism")
- **Cocoindex-indexed entries** may point at old agent file name — re-index deferred to memory save
- **`.opencode/specs/descriptions.json`** auto-regenerates on memory save; manual rotation only as bridge
- **Depends on**: 082 (skill rename) shipped — `sk-prompt` exists and is the dispatch target
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at start. Phase 001 audit will surface any during exhaustive grep step.
<!-- /ANCHOR:questions -->

---

## IMPLEMENTATION APPROACH

Direct sed + manual git mv per packet 082's pattern (which renamed sk-improve-prompt → sk-prompt across 58 files via the same approach). 4 git mv commands, then sed -i 's/@improve-prompt/@prompt-improver/g' across the 27 reference files, then frontmatter `name:` field updates in the 4 renamed agent files. Final validation gate: scoped grep returns 0 active-scope hits.

## HANDOFF CRITERIA

Phase 001 → Phase 002 handoff:
- 4 agent files renamed and exist at new paths
- 0 active-scope `@improve-prompt` or `improve-prompt` (as agent name) hits via final grep
- Strict validate of `001-prompt-improver-rename/` exits 0
- Phase 002 (testing playbook) can now reference `@prompt-improver` throughout

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Sibling phase: `../002-sk-prompt-testing-playbook/spec.md`
- Precedent: `082-sk-improve-prompt-rename/` (skill rename, same sed pattern)
- Memory rule: "CLI dispatch unreliability under heavy parallelism" (mandates direct sed for mechanical work)
