---
title: "Research prompt pack contract"
description: "The research prompt pack lists a conditional allowed write for the run's research/research.md and names the Recommended Next Focus heading the reducer parses."
trigger_phrases:
  - "research prompt pack contract"
  - "research.md allowed write"
  - "Recommended Next Focus heading"
  - "research prompt pack"
version: 1.0.2.0
---

# Research prompt pack contract

## 1. OVERVIEW

The research prompt pack is the rendered per-iteration instruction set for research runs. It matches the research agent definition on two points: a conditional allowed write for the run's `research/research.md`, and the `Recommended Next Focus` heading that the reducer parses to choose the next focus.

---

## 2. HOW IT WORKS

### Conditional research.md Write

The pack's allowed-write list carries the run's `research/research.md` as one conditional entry, worded relative to the `iterations/` directory. The pack renders the entry the same way the agent definition states the rule.

### Recommended Next Focus Heading

The pack names the `Recommended Next Focus` heading, the heading the reducer reads from the latest leaf when it derives the next focus. The heading is part of the contract the reducer depends on.

### Rendering

`runtime/lib/deep-loop/prompt-pack.ts` renders the pack by plain token substitution and throws on a missing variable. The conditional entry is carried in the template text, so the command YAMLs need no new render variable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Template | Carries the conditional allowed-write entry for `research.md`. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | Shared | Renders the pack by token substitution. |
| `.skilled/agents/deep-research.md` | Agent contract | The rule the rendered pack must match. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Vitest | Rendered-pack case for the research write entry and the agent and pack lockstep case. |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | Manual playbook | DLR-060: the conditional research.md write path and the Recommended Next Focus heading. |

---

## 4. SOURCE METADATA

- Group: Prompt rendering
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `prompt-rendering/research-prompt-pack-contract.md`

Related references:
- [prompt-pack.md](prompt-pack.md) - Prompt pack rendering
