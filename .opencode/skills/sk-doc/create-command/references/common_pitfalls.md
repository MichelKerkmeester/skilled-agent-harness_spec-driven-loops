---
title: Command Creation - Component Choice and Common Pitfalls
description: Choose command vs skill vs agent before drafting, then avoid the recurring command-authoring mistakes - missing gates, over-broad tools, dashboards in routers, and multiline descriptions.
trigger_phrases:
  - "command vs skill vs agent"
  - "command creation pitfalls"
  - "slash command mistakes"
  - "when to make a command"
  - "command allowed-tools mistake"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation - Component Choice and Common Pitfalls

The first pitfall is building a command at all when a skill or agent fits better. Pick the component type, then check the draft against the recurring defects below.

---

## 1. OVERVIEW

This reference guards two failure modes: choosing the wrong component (a command when a skill or agent fits better) and the recurring command-authoring defects — missing gates, over-broad tools, dashboards in routers, and multiline descriptions. Decide the component first, then check the draft against the mistakes table.

---

## 2. PICK THE RIGHT COMPONENT FIRST

Choose the component type before drafting.

| Component | Primary Question | Use It When |
|---|---|---|
| Command | How should a user trigger this workflow? | A slash invocation should gather input and run a repeatable procedure |
| Skill | How should this work be done? | Reusable knowledge, standards, templates, or deep guidance are needed |
| Agent | Who should do this work? | A named persona needs authority, permissions, and operating rules |

**Practical rule**:
- create a command for a user-triggered workflow entry point
- create a skill for reusable knowledge or workflow doctrine
- create an agent for a durable runtime role with permissions

**Healthy pairing**:
- command gathers input and selects mode
- skill supplies detailed standards or patterns
- agent executes specialized work when delegation is appropriate

---

## 3. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Creating a command for reference-only guidance | The slash command becomes a bloated manual instead of an executable workflow | Create or extend a skill/reference instead |
| Omitting `argument-hint` for required input | Users cannot see what the invocation expects | Add a precise hint with `<required>` and `[optional]` parts |
| Using a required hint without a gate | The command may infer missing input from context | Put the blocking gate immediately after frontmatter |
| Treating `:auto` as permission to guess | Autonomous runs can fabricate missing decisions | Fail fast or ask targeted questions when required data is missing |
| Putting dashboards in the router | Routing logic becomes hard to audit and presentation cannot evolve independently | Move visible wording to `_presentation.txt` |
| Changing behavior while splitting presentation | A refactor becomes a hidden semantic change | Move wording without changing routing, modes, gates, or permissions |
| Over-broad `allowed-tools` | The command can use tools outside its contract | Reduce the list to the tools actually required |
| Using bare MCP names in `allowed-tools` | Runtime tool resolution can drift from the configured namespace | Use fully qualified `mcp__<server>__<tool>` IDs |
| Writing a multi-line description | Help output and metadata consumers expect a single-line summary | Keep `description` one line and move detail into the body |
| Adding workflow YAML to every split command | Direct-router command families may not need YAML execution assets | Add `_auto.yaml` and `_confirm.yaml` only when the family routes to workflow assets |
| Embedding rationale or meta-commentary in the router body | Design notes, prose-register/framework labels (e.g. "(COSTAR)"), benchmark timings, maintainer sync chores, or "no gap exists" self-attestations are noise a user sees rendered and drift from the truth | Keep the body behavioral; move rationale to the decision-record/changelog and any render-style rule to the presentation asset |

---

## 4. RELATED RESOURCES

- [README.md](README.md) - command-creation reference map
- [argument_hints_and_modes.md](argument_hints_and_modes.md) - correct hint, mode, and frontmatter patterns
- [router_presentation_split.md](router_presentation_split.md) - the behavior-preserving split these mistakes violate
- [create-agent references](../../create-agent/references/README.md) - sibling packet when the work is really an agent
