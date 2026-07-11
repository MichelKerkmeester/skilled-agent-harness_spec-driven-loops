---
title: "Feature Specification: Plugin & hook opportunities from existing skills"
description: "Deep-research packet mapping existing repo skills to candidate OpenCode plugins and Claude hooks worth building."
trigger_phrases:
  - "plugin hook opportunities"
  - "plugins from skills"
  - "hooks from skills"
  - "deep research plugins"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Plugin & hook opportunities from existing skills

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo ships seven OpenCode plugins with paired Claude hooks, but a much larger body of skills (`sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-spec-kit`, `system-skill-advisor`, `system-code-graph`, cli-external hubs, mcp-tooling hubs) exposes capability that is only reachable interactively. Some of that capability would be more valuable surfaced as an always-on plugin (OpenCode `tool.execute.*` / session lifecycle) or Claude hook (PreToolUse / SessionStart / UserPromptSubmit / Stop), the way the current seven already are.

### Purpose
Run a deep-research loop to inventory existing skills and identify which of their behaviors are strong candidates to be promoted into a new plugin or hook — ranked by value, feasibility, and blast radius — so the team gets an evidence-backed backlog instead of ad-hoc guesses.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory of existing skills under `.opencode/skills/` and their surfaced-vs-latent behaviors
- Mapping each candidate behavior to a concrete plugin (OpenCode) or hook (Claude) shape, with the runtime surface it would bind to
- Ranking candidates by value, implementation feasibility, and blast radius, cross-checked across two model families (GLM-5.2, GPT-5.6-sol)
- A prioritized backlog of buildable plugins/hooks with rationale and the existing skill each derives from

### Out of Scope
- Implementing any proposed plugin or hook (research only; no code changes)
- Re-auditing the existing seven plugins/hooks (covered by packet 127/129)
- Third-party MCP servers not backed by an existing repo skill

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/deep-research-state.jsonl | Create | Append-only iteration state log (workflow-owned) |
| research/iterations/iteration-NNN.md | Create | Per-iteration narrative (workflow-owned) |
| research/research.md | Create | Progressive synthesis of candidate plugins/hooks |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill inventory grounded in real files | Each candidate cites the existing skill path it derives from |
| REQ-002 | Every candidate names a concrete runtime surface | Candidate specifies plugin hook (tool.execute.*/session.*) or Claude hook (PreToolUse/SessionStart/etc.) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Candidates ranked by value/feasibility/blast-radius | Ranked backlog with a one-line rationale each |
| REQ-004 | Cross-model corroboration | GLM-5.2 and GPT-5.6-sol passes both weigh in; disagreements surfaced |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked, evidence-cited backlog of candidate plugins/hooks, each traceable to an existing skill and a runtime surface
- **SC-002**: Convergence reached (or max iterations) across the 10 GLM + 5 GPT iterations with a synthesized recommendation set


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode CLI + zai-coding-plan/openai auth | Cannot run executors | Pre-flight confirmed both providers configured |
| Risk | Candidates duplicate existing plugins | Low value output | Require each candidate to differentiate from the current seven |
| Risk | Over-eager surface promotion | Blast-radius creep | Rank by blast radius; flag anything touching kill/write paths |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should candidates be limited to skills that already have a runtime footprint, or include purely interactive skills?
- What is the appetite for hooks that mutate vs. hooks that only observe/advise?

<!-- /ANCHOR:questions -->

---
