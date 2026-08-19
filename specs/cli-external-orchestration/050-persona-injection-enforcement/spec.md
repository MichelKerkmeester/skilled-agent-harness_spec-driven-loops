---
title: "Feature Specification: Mandatory Agent-Persona Injection for External-CLI Orchestration"
description: "Close the gap where orchestrators dispatch work through external CLI skills (cli-devin, cli-codex, cli-opencode, cli-cursor, cli-pi, cli-claude-code) without attaching the target agent's persona, so dispatched models run persona-less and bypass the agent's tool-scope, verification gates, and output contract."
trigger_phrases:
  - "cli persona injection enforcement"
  - "external cli orchestration agent persona"
  - "inject agent definition into cli dispatch prompt"
  - "cli-devin persona missing dispatch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent and Phase 001; grounded gap analysis in orchestrate.md + 6 mode SKILLs"
    next_safe_action: "Execute Phase 001 analysis/inventory via cli-devin (Gemini 3.7 Flash @ high)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-persona-injection"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Where native --agent loading is verified to work (cli-claude-code, cli-cursor), is native loading sufficient or must the persona ALSO be inlined for reproducibility?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This spec.md is the ONLY authored doc at the parent level. Heavy docs (plan/tasks/checklist/
  decision-record/implementation-summary) live in the child phase folders only. No merge/migration
  narratives here. -->

# Feature Specification: Mandatory Agent-Persona Injection for External-CLI Orchestration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (track: cli-external-orchestration) |
| **Parent Packet** | `cli-external-orchestration` |
| **Predecessor** | `cli-external-orchestration/049-cline-provider-roster` |
| **Successor** | None |
| **Execution model** | cli-devin, Gemini 3.7 Flash @ high thinking (`gemini-3-7-flash-high`); fallback GLM 5.2 high (`glm-5-2`). Per `[runtime_agent_path]/orchestrate.md` (resolve `[runtime_agent_path]` per AGENTS.md §7). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When an orchestrator delegates work through an external CLI skill under `cli-external-orchestration` (cli-devin, cli-codex, cli-opencode, cli-cursor, cli-pi, cli-claude-code), it commonly sends only the task prompt to the dispatched model — without the target agent's persona/identity from the runtime agent directory (`.opencode/agents/*.md`, `.claude/agents/*.md`, etc.). The dispatched model then runs a leaf task as a generic assistant: it ignores the agent's tool-scope, verification gates, output contract, and safety framing, so results drift from what the orchestrator expects and quietly bypass the guardrails baked into the agent definition.

The discipline already exists for **native** in-runtime dispatch — `orchestrate.md` §2 "Agent Loading Protocol (MANDATORY)" requires reading the agent `.md` and including it in the Task prompt, backed by the "Prompt/Agent Consistency Guard." That discipline is **not mirrored on the external-CLI shell-out path**, where each CLI's native agent-loading mechanism (`--agent`, `.codex/agents/*.toml`, `.opencode/agents` subagents) is either unavailable on the non-interactive dispatch path or unverified for it.

### Purpose
Make agent-persona injection a documented, enforced rule across every external-CLI dispatch path: every dispatch composes {correct resolved agent persona + task prompt}. The persona is resolved runtime-aware per AGENTS.md §7 and either loaded through the CLI's native mechanism where that is verified to work on the dispatch path, or inlined into the prompt payload where it is not.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six mode packets under `.opencode/skills/cli-external-orchestration/` (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi) and the hub `SKILL.md` ALWAYS/NEVER rules.
- The `sk-prompt` family (`sk-prompt-improve`, `sk-prompt-models`) where CLI dispatch prompt-craft is authored — specifically the persona-injection step in the prompt-construction contract.
- A single shared persona-injection contract (dispatch-block format + runtime path resolution + native-vs-inline decision rule + explicit exceptions) referenced by all six modes.
- An objective sweep/audit proving no dispatch instruction tells an orchestrator to send a task prompt without the resolved agent persona.

### Out of Scope
- Rewriting hub/mode routing architecture (mode-registry, hub-router, compiled routing) — add enforcement, do not restructure.
- Changing the native in-runtime `orchestrate.md` Agent Loading Protocol (it already enforces injection; it is the reference model, not a target of change).
- The deep-loop `fanout-run.cjs` runtime internals beyond documenting how persona travels in the dispatched payload.
- Any agent `.md` persona content itself (personas are consumed, not edited).

### Files to Change (summary — per-phase detail in each child's plan.md)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-external-orchestration/*/SKILL.md` (6 modes) | Modify | 003 | Add persona-injection ALWAYS rule + mechanics |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | 003 | Hub-level ALWAYS/NEVER rule pointing to the contract |
| persona-injection contract doc (location TBD in 002) | Create | 002 | Shared dispatch-block + resolution + native-vs-inline rule |
| `.opencode/skills/sk-prompt/sk-prompt-models/**` | Modify | 004 | Persona-injection step in cli-prompt-quality-card / prompt-craft |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**` | Modify | 004 | Align dispatch-packaging refs (if any) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Children 002–005 are scaffolded when their predecessor completes, because their detail depends on the preceding phase's output.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| P1 | `001-analysis-inventory/` | Inventory every agent persona + every CLI dispatch/prompt-composition point across the 6 modes, the hub, and sk-prompt; classify native-load-vs-inline per mode; confirm the gap with evidence | In Progress |
| P2 | `002-persona-injection-contract/` | Design the shared persona-injection contract: dispatch-block format, runtime path resolution (AGENTS.md §7), native-vs-inline decision rule, explicit exceptions | Planned |
| P3 | `003-cli-mode-enforcement/` | Apply the contract to all 6 mode SKILLs + hub SKILL ALWAYS/NEVER rules | Planned |
| P4 | `004-sk-prompt-alignment/` | Carry the persona-injection step into sk-prompt prompt-craft references | Planned |
| P5 | `005-verification/` | Objective grep/audit sweep + `validate.sh --strict` across touched packets + regression delta | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume cli-external-orchestration/050-persona-injection-enforcement/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| P1 | P2 | Complete dispatch-point inventory + per-mode native-vs-inline classification exists | Analysis findings doc present; gap confirmed with file:line evidence |
| P2 | P3 | Persona-injection contract accepted (block format + resolution + exceptions) | decision-record.md ADR accepted; contract doc created |
| P3 | P4 | All 6 modes + hub carry the enforcement rule | grep shows the rule in every mode SKILL; per-packet validate passes |
| P4 | P5 | sk-prompt prompt-craft carries the persona step | grep shows the step in prompt-craft refs; per-packet validate passes |
| P5 | Done | Objective sweep finds no persona-less dispatch instruction; all touched packets validate --strict Errors:0 | Sweep output + validate logs recorded |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Where native `--agent` loading is verified on the dispatch path (cli-claude-code `--agent`, cli-cursor auto-import), is native loading sufficient, or must the persona ALSO be inlined for reproducibility across machines that lack the mirror? (Resolve in P2.)
- Should the shared contract live as a new constitutional rule under `system-spec-kit/constitutional/`, a shared reference under `system-spec-kit/references/cli/`, or a hub-root doc? (Resolve in P2.)
- Which exact personas map to which dispatch intents (code→code, review→review, design→design, research→deep-research) for the mapping table? (Resolve in P1 from the agent roster.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md` (track folder).
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
- **Reference model**: `.opencode/agents/orchestrate.md` §2 Agent Loading Protocol (the native-dispatch precedent this packet mirrors onto the CLI path).
