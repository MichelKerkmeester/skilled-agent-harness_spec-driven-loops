---
title: "Prompt-Quality Card Sync And Prompt-Improver Eligibility"
description: "The packet's prompt-quality card is held in sync with the canonical card by a repository guard, and the prompt-improver agents carry the `cli-hermes` model-eligibility row across three runtimes."
trigger_phrases:
  - "prompt-quality card sync and prompt-improver eligibility"
  - "check-prompt-quality-card-sync"
  - "cli-hermes prompt card"
  - "prompt-improver hermes eligibility row"
version: 1.0.0.0
---

# Prompt-Quality Card Sync And Prompt-Improver Eligibility

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The packet's prompt-quality card is held in sync with the canonical card by a repository guard, and the prompt-improver agents carry the `cli-hermes` model-eligibility row across three runtimes.

A dispatch is only as good as the prompt it carries, and both halves of that contract live outside the packet: the card it delegates to, and the agent that composes prompts for it.

---

## 2. HOW IT WORKS

The packet ships a thin delegator card rather than a copy of the canonical one, so the quality rules cannot drift per executor. The sync guard walks the delegator cards, the `cli-hermes` card among them, and walks the CLI skills, `cli-external-orchestration/cli-hermes` among them, so a card that stopped delegating or a skill that lost its card is reported rather than discovered during a dispatch.

The prompt-improver agent definition carries a model-eligibility table, and its `cli-hermes` row names the two gateway model ids and states that the roster is closed at them, which keeps an improver from proposing a model the lineage builder would reject. The row is mirrored in the Claude and Codex copies of the same agent, so an improver reached from any of the three runtimes sees the same eligibility.

Persona handling is a packet rule rather than a Hermes capability. Hermes has no flag that loads an agent file, its profiles are separate homes, and its sub-agents receive a goal and context only, so the resolved persona is inlined at the top of the dispatch prompt alongside the child-dispatch preamble. The canonical card owns that rule; the packet points at it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-hermes/assets/prompt-quality-card.md` | Handler | The packet's thin delegator to the canonical prompt card. |
| `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Shared | The canonical card, including the persona-injection rule the packet inlines. |
| `.opencode/agents/prompt-improver.md` | Shared | The model-eligibility table carrying the `cli-hermes` row. |
| `.claude/agents/prompt-improver.md` | Shared | The Claude copy of the same eligibility row. |
| `.codex/agents/prompt-improver.toml` | Shared | The Codex copy of the same eligibility row. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/assets/prompt-templates.md` | Handler | Write, read-only review, generation and fan-out prompt scaffolds. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Test harness | Checks the delegator cards and the CLI skills, including the Hermes entries. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md` | Reference | Persona inlining and the delegation surface the prompt contract assumes. |

---

## 4. SOURCE METADATA

- Group: Prompt contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `prompt-contract/prompt-card-and-improver-eligibility.md`

Related references:
- [../fanout-dispatch/closed-model-roster.md](../fanout-dispatch/closed-model-roster.md) - the roster the eligibility row mirrors.
- [../runtime-surface/hermes-runtime-folder.md](../runtime-surface/hermes-runtime-folder.md) - the generated prompt stubs these rules are composed under.
