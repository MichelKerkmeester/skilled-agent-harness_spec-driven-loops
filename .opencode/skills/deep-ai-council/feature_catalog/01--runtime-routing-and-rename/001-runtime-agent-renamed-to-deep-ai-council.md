---
title: "Runtime agent renamed to deep-ai-council"
description: "Verify active runtime mirrors use deep-ai-council."
trigger_phrases:
  - "runtime agent renamed to deep-ai-council"
  - "deep-ai-council"
  - "rename council agent"
  - "runtime mirror"
  - "dispatch name council"
---

# Runtime agent renamed to deep-ai-council

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify active runtime mirrors use deep-ai-council.

Operators need one current dispatch name across runtimes so council prompts do not split between old and new identities.

Operators use this feature when the real request is: Use the deep AI council to compare two implementation plans.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-001.

Current behavior is grounded in `.opencode/agents/ai-council.md`, which the scenario identifies as the OpenCode runtime mirror. Identity note: the agent files are `ai-council.*` (the `@ai-council` identity) because v1.2.0.0 dropped the `deep-` prefix from the agent, while the skill kept the `deep-ai-council` name. The runtime mirrors route council prompts to the `deep-ai-council` skill under the `@ai-council` agent identity. Validation is anchored by `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`, covering the manual scenario contract.

The user-visible contract is concrete: Verify active runtime mirrors use deep-ai-council. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/agents/ai-council.md` | Runtime Mirror | OpenCode runtime mirror |
| `.claude/agents/ai-council.md` | Runtime Mirror | Claude runtime mirror |
| `.codex/agents/ai-council.toml` | Runtime Mirror | Codex runtime mirror |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Runtime Routing And Rename
- Feature ID: DAC-001
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`
- Playbook scenario: `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`
Related references:
- [002-advisor-routes-council-prompts-to-skill.md](002-advisor-routes-council-prompts-to-skill.md) — Advisor routes council prompts to skill
