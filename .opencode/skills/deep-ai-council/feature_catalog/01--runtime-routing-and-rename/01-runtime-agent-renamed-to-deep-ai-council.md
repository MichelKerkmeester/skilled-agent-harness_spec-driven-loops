---
title: "Runtime agent renamed to deep-ai-council"
description: "Verify active runtime mirrors use deep-ai-council."
---

# Runtime agent renamed to deep-ai-council

## 1. OVERVIEW

Verify active runtime mirrors use deep-ai-council.

Operators need one current dispatch name across runtimes so council prompts do not split between old and new identities.

Operators use this feature when the real request is: Use the deep AI council to compare two implementation plans.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-001.

Current behavior is grounded in `.opencode/agents/deep-ai-council.md`, which the scenario identifies as opencode runtime mirror. Validation is anchored by `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify active runtime mirrors use deep-ai-council. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/agents/deep-ai-council.md` | Runtime Mirror | OpenCode runtime mirror |
| `.claude/agents/deep-ai-council.md` | Runtime Mirror | Claude runtime mirror |
| `.codex/agents/deep-ai-council.toml` | Runtime Mirror | Codex runtime mirror |
| `.gemini/agents/deep-ai-council.md` | Runtime Mirror | Gemini runtime mirror |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Runtime Routing And Rename
- Feature ID: DAC-001
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md`
- Playbook scenario: `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`
