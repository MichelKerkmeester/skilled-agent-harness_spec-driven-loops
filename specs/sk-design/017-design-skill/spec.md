---
title: "Design Skill Program"
description: "Root packet for the sk-design authoring skill and the surfaces that route to it, phased by delivery."
trigger_phrases:
  - "sk-design program"
  - "design skill packet"
  - "design authoring skill"
  - "design agent alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
# Design Skill Program

Root packet for `sk-design`, the skill that decides UI values and behavior, and for the surfaces that route work to it.

---

## 1. PURPOSE

The repository could measure a design but not decide one. `sk-design-md-generator` extracts a live surface's real CSS into a measured Style Reference; nothing told an agent which spacing value, shade, shadow or duration to pick when the surface did not exist yet.

This program owns the authoring half of that pair: the `sk-design` skill itself, and every surface that has to know when to route to it rather than to the measuring skill.

---

## 2. SCOPE

In scope for this root:

- The `sk-design` skill package and its knowledge corpus.
- The boundary with `sk-design-md-generator`, stated reciprocally so neither skill can be read alone and misapplied.
- The agent, command and routing surfaces that dispatch design work.

Out of scope:

- Extraction mechanics, which `sk-design-md-generator` owns.
- Design work on a specific product surface. This program builds the capability, not its applications.

---

## 3. CURRENT STATE

`sk-design` ships as a standalone skill with nine references, a token asset and a twelve-scenario operator playbook. Its boundary with `sk-design-md-generator` is stated on both sides, with one precedence rule: a measurement outranks a default for the surface it covers.

The `design` agent routes between the two: it decides values through `sk-design` and measures a surface through `sk-design-md-generator`, on the artifact the request asks for.

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-skill-build/ | Build the `sk-design` skill from four public sources, reconcile the boundary with `sk-design-md-generator` on both sides, and bring three manual-testing playbooks to the operator-scenario contract | Complete |
| 2 | 002-agent-alignment/ | Rewrite the `design` agent so it routes authoring work to `sk-design` and measurement to `sk-design-md-generator` | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-skill-build | 002-agent-alignment | `sk-design` exists as a routable skill with a stated boundary against its sibling | The skill package gate passes and the advisor returns `sk-design` for design prompts |
<!-- /ANCHOR:phase-map -->
