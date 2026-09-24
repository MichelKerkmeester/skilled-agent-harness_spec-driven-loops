---
title: "Feature Specification: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries"
description: "The agent template prescribes CRITICAL, IMPORTANT and (MANDATORY) labels that current Claude models over-trigger on, and nine agents carry 36 of them per authored tree. This packet rewrites the template and the agents to state the same boundaries plainly."
trigger_phrases:
  - "agent emphasis register"
  - "agent template critical important"
  - "mandatory checklist headings"
  - "agent boilerplate boundary statement"
  - "over-prompted agent labels"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/067-prompting-guide-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The agent template tells every agent to open with a `**CRITICAL**:` and an `**IMPORTANT**:` statement and to head its verification checklists `(MANDATORY)`. Nine of the twelve agents carry 36 of these labels in `.skilled/agents/` and the same 36 in their `.claude/agents/` twins. Anthropic's current prompting guide says this register now makes Claude over-trigger, and sk-prompt's own card (`cli-prompt-quality-card.md:59`) already records that aggressive gate wording underperforms. The template's checklist at `agent-template.md:814` requires the labels, so one agent cannot drop them without falling out of conformance with the other eleven.

### Purpose
Every agent states its main boundary and its secondary constraint in plain words, the boundaries themselves stay exactly as they are, and the template asks for that shape instead of the labels.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Amend `agent-template.md`: the boilerplate lead-ins at `:155`, `:157`, `:552` and `:554`, the verification lead-ins at `:428` and `:669`, the `(MANDATORY)` checklist headings at `:433`, `:438`, `:672` and `:677`, and the checklist item at `:814`.
- Rewrite the 36 labelled sites in the nine affected agents (ai-council, code, debug, deep-improvement, deep-review, markdown, orchestrate, prompt-improver, review) in `.skilled/agents/` and in their hand-kept `.claude/agents/` twins. A rewrite covers the label and any all-caps modal in the same sentence, such as "you MUST".
- Regenerate the `.codex/agents/`, `.pi/agents/` and Hermes `agent-*` mirrors from the canonical tree.
- Add an sk-create-agent changelog entry for the template change.

### Out of Scope
- `HARD BLOCK` wording in the agents - it names the hard-gate class `AGENTS.md` defines, which packet 013 chose to keep.
- `context.md`, `deep-research.md` and `design.md` - they carry none of the three labels.
- The `.cursor/agents/` and `.devin/agents/` trees - they are symlinks onto `.claude/agents/` and follow it.
- `AGENTS.md` and the repo rules - packet `013-prompting-guide-alignment` covered them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | Plain boundary statements replace the labels, the `:814` check names the new shape |
| `.skilled/agents/{ai-council,code,debug,deep-improvement,deep-review,markdown,orchestrate,prompt-improver,review}.md` | Modify | 36 labelled sites rewritten |
| `.claude/agents/` (the same nine files) | Modify | The same rewrites, Claude dialect frontmatter untouched |
| `.codex/agents/*.toml`, `.pi/agents/*.md` | Regenerate | `codex/sync-agents.cjs` and `pi/sync-agents-pi.cjs` |
| `.hermes/skills/agent-*/SKILL.md` | Regenerate | `hermes/sync-skills-hermes.cjs` |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.2.0.md` | Create | Release note for the template change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The template no longer prescribes the three labels | `rg -n '\*\*CRITICAL\*\*\|\*\*IMPORTANT\*\*\|\(MANDATORY\)' agent-template.md` returns nothing, and `:814` reads "Boilerplate has Path Convention and states the agent's main boundary and secondary constraint" |
| REQ-002 | Every rewritten site keeps its boundary | A before/after list covers all 36 sites and shows each never, only, must-not and refusal clause survives. A second reader signs it off |
| REQ-003 | The runtime mirrors stay in step | `check-agent-mirror-sync.cjs --all`, `codex/sync-agents.cjs --check`, `pi/sync-agents-pi.cjs --check` and the Hermes sync check all pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The labels are gone from the nine agents | The REQ-001 search over `.skilled/agents/` and `.claude/agents/` returns nothing |
| REQ-005 | sk-create-agent records the change | `changelog/v1.0.2.0.md` exists, `SKILL.md` carries the matching version and the frontmatter-version gate reports ok |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three label forms drop from 10 template sites and 36 sites per authored agent tree to zero.
- **SC-002**: Every mirror check passes and the before/after review finds no weakened boundary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The mirror generators need the built `@spec-kit` packages | A worktree without them cannot regenerate | Run the main checkout's generators against the worktree, or regenerate on `main` after merge |
| Risk | A rewrite softens a boundary while removing its label | High | Keep every negative clause verbatim and review the before/after list site by site |
| Risk | The `.claude` twin drifts from `.skilled` | Med | Edit both in the same change, `check-agent-mirror-sync.cjs` compares the bodies |
| Risk | An agent that leaned on the caps behaves differently | Low | The labels change emphasis, not instructions. Rerun the mirror-sync vitest and any agent benchmark that covers the nine agents |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `orchestrate.md` uses bare `MANDATORY` seven more times (`:268`, `:290`, `:300`, `:381`, `:510`, `:579`, `:719`). The template does not prescribe these, and `## 4. MANDATORY RULES` is a heading other documents may link to. Do they join this rewrite?
- `mirror-sync-verify.vitest.ts:43` uses a `**CRITICAL**:` line as fixture body text. It tests sync, not the template, so the plan leaves it unless a test turns out to assert on the template wording.
<!-- /ANCHOR:questions -->

---
