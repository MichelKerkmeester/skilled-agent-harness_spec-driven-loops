---
title: Manual Testing Playbook Creation - Reference Map
description: Route map for the manual-testing-playbook overflow references - prompt voice, conversation scenarios, common pitfalls, and reference implementations. The executable workflow lives in SKILL.md.
trigger_phrases:
  - "manual testing playbook references"
  - "playbook creation reference map"
  - "playbook overflow detail"
  - "testing playbook prompt voice"
  - "testing playbook conversation scenarios"
  - "testing playbook pitfalls"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# Manual Testing Playbook Creation - Reference Map

Route map over the overflow detail for `create-manual-testing-playbook`. The complete executable workflow - activation, package contract, authoring steps, scenario rules, validation, and hard rules - lives in [`../SKILL.md`](../SKILL.md). Open a file below only when the primary workflow points here for exhaustive detail.

---

## 1. OVERVIEW

`SKILL.md` is the primary and complete workflow for authoring manual testing playbook packages. These references hold only the overflow: the exhaustive prompt-voice decision, the pitfall catalog, the shipped reference implementations to model new packages on, and the conversation-scenario format with its runner. Nothing here repeats the workflow; each file carries a single concern.

**Core Principle**: Keep the executable workflow in `SKILL.md`; keep only exhaustive detail, catalogs, and worked examples here.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Prompt voice** - natural-human vs RCAF decision table, voice guidelines, and the ~70/30 default split | [prompt-voice.md](prompt-voice.md) | Choosing or reviewing the `Prompt:` voice for a scenario, or deciding when the RCAF wrapper applies |
| **Conversation scenarios** - closed script schema, turn outcomes, and evidence | [conversation-scenarios.md](conversation-scenarios.md) | Writing or reviewing a multi-turn orchestrator and subject scenario. Decide first whether the scenario should be a conversation with `SKILL.md` §6, Choosing the Scenario Style |
| **Common pitfalls** - the recurring package defects with why-it-breaks and the correct fix | [common-pitfalls.md](common-pitfalls.md) | Reviewing a drafted playbook for defects, or diagnosing a package that splits truth or desyncs prompts |
| **Reference implementations** - shipped playbooks to model new packages on, plus the scaffold templates | [examples.md](examples.md) | Modeling a new playbook package on a proven, canonical layout |

---

## 3. RELATED RESOURCES

### Overflow References
- [prompt-voice.md](prompt-voice.md) - Natural-human vs RCAF voice decision and guidelines
- [common-pitfalls.md](common-pitfalls.md) - Recurring package defects and correct fixes
- [examples.md](examples.md) - Shipped reference playbooks and scaffold templates
- [conversation-scenarios.md](conversation-scenarios.md) - The `json conversation` script format and the shared conversation runner

### Templates
- [manual-testing-playbook-template.md](../assets/manual-testing-playbook-template.md) - Root playbook scaffold
- [manual-testing-playbook-snippet-template.md](../assets/manual-testing-playbook-snippet-template.md) - Per-feature single-prompt scenario scaffold
- [manual-testing-playbook-conversation-snippet-template.md](../assets/manual-testing-playbook-conversation-snippet-template.md) - Per-feature conversation scenario scaffold

### Shared Reference Files
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/validation.md) - Shared validation and DQI workflow
- [frontmatter-versioning.md](../../sk-create-frontmatter/references/frontmatter-versioning.md) - 4-part version expectations
- [quick-reference.md](../../shared/references/quick-reference.md) - Condensed commands and file locations
- [workflows.md](../../sk-create-quality-control/references/workflows.md) - Execution-mode reference

---

*End of Manual Testing Playbook Creation reference map - the executable workflow lives in [`../SKILL.md`](../SKILL.md).*
