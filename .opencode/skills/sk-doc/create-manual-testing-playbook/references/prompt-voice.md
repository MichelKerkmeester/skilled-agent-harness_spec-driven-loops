---
title: Manual Testing Playbook Prompt Voice - Natural-Human vs RCAF
description: The full decision for the canonical Prompt field voice in playbook scenarios - natural-human by default, RCAF only for AI orchestrators - with the decision table and voice guidelines.
trigger_phrases:
  - "playbook prompt voice"
  - "natural human vs rcaf"
  - "rcaf wrapper when to use"
  - "scenario prompt voice guidelines"
  - "real user request baseline"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Manual Testing Playbook Prompt Voice - Natural-Human vs RCAF

The full decision for which voice the canonical `Prompt:` field uses in a scenario. `SKILL.md` § Scenario Design Rules carries the summary; this file is the exhaustive detail - the decision table, both sets of voice guidelines, and the default split.

---

## 1. OVERVIEW

The canonical `Prompt:` field defaults to **natural-human voice** - how a real user would phrase the request to an AI in conversation. The RCAF (Role-Context-Action-Format) wrapper is the exception, reserved for when the actor IS an AI orchestrator.

**Core Principle**: When in doubt, prefer natural-human. RCAF is the exception, natural is the default.

RCAF wrapper shape:

```text
As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.
```

---

## 2. DECISION TABLE

| Use **natural-human** when… | Use **RCAF** when… |
|---|---|
| A human asks the AI directly in conversation ("Review this PR", "Commit my staged changes", "Why is this test flaky?", "Help me start OAuth"). | The actor IS an AI orchestrator delegating to another tool/AI/agent (cross-CLI delegation, multi-agent dispatch, agent handback). |
| Code review on a PR, commit/git workflows, bug fixes, code questions, preference questions. | Safety-refusal scenarios where role context determines behavior (e.g., "git safety reviewer" decides whether to refuse a `--no-verify`). |
| The scenario could plausibly originate from a Slack DM or a terminal prompt. | Internal validation contracts where the orchestrator IS the operator (e.g., "validation operator validates context retrieval"). |
| Default for ~70% of scenarios. | Default for ~30% of scenarios - most often in cli-* and orchestration-heavy playbooks. |

---

## 3. VOICE GUIDELINES

**Natural-human prompts**:

- Imperative or interrogative ("Review this PR for security issues", "Why is this test flaky?", "Help me start an OAuth feature").
- Compact enough for a 9-column table cell (single sentence, ideally ≤25 words).
- Specific to the test scenario - not "do a code review" but "Review this auth diff and flag any P0 blockers".
- Match the voice of the existing `Real user request:` field, but more compact.

**RCAF prompts when retained**:

- Keep the canonical structure: `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.`
- The Role must be an AI orchestrator role (e.g., "external-AI conductor", "git safety reviewer", "validation operator"), NOT a generic human role like "developer" or "engineer".

The `Real user request:` field is always natural-human regardless of which voice the canonical `Prompt:` field uses; it serves as the voice reference baseline.

---

## 4. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - § Scenario Design Rules carries the summary rule and the prompt-synchronization gate
- [README.md](README.md) - Reference map for all overflow detail
- [common-pitfalls.md](common-pitfalls.md) - Includes the unsynced-prompt-fields defect
- [manual-testing-playbook-snippet-template.md](../assets/manual-testing-playbook-snippet-template.md) - Per-feature scaffold carrying the `Prompt:` and `Real user request:` fields
