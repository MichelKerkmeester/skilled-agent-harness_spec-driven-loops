---
title: "DAC-001 -- Runtime agent renamed to deep-ai-council"
description: "This scenario validates runtime agent rename coverage for DAC-001."
version: 2.3.0.6
---

# DAC-001 -- Runtime agent renamed to deep-ai-council

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-001`.

---

## 1. OVERVIEW

This scenario validates that runtime mirrors expose `ai-council` as the active identity.

### Why This Matters

Operators need one current dispatch name across runtimes so council prompts do not split between old and new identities.

---

## 2. SCENARIO CONTRACT

- Objective: Verify active runtime mirrors use `ai-council`.
- Real user request: Use the deep AI council to compare two implementation plans.
- Prompt: `Use the deep AI council to compare two implementation plans and show which runtime agent name is active.`
- Expected execution process: Grep runtime mirror folders for `ai-council`, then grep for `multi-ai-council` and confirm no active primary identity remains.
- Expected signals: New name appears in all four runtime mirrors; old name is absent as an active agent name.
- Desired user-visible outcome: The user sees that `@ai-council` is the current runtime name.
- Pass/fail: PASS if all runtime mirrors expose `ai-council`; FAIL if an active mirror still names `multi-ai-council`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the new-name grep first.
2. Run the old-name grep second.
3. Capture both outputs and explain whether old-name hits are historical wording or active identity.

### Prompt

`Use the deep AI council to compare two implementation plans and show which runtime agent name is active.`

### Commands

1. `bash: rg -n "ai-council" .opencode/agents/ .claude/agents/ .opencode/agents/`
2. `bash: rg -n "multi-ai-council" .opencode/agents/ .claude/agents/ .opencode/agents/`

### Expected

`ai-council` appears in the repo-managed mirrors. `multi-ai-council` does not appear as an active mirror name.

### Evidence

Capture grep output with file paths and line numbers.

### Pass / Fail

- **Pass**: Mirror identities route to `ai-council`.
- **Fail**: Any runtime mirror still exposes `multi-ai-council` as the active identity.

### Failure Triage

Check the mirror frontmatter/name first, then OpenCode TOML name, then any converted mirror header.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-001 | Runtime rename | Verify active runtime identity | `Use the deep AI council to compare two implementation plans and show which runtime agent name is active.` | `bash: rg -n "ai-council" .opencode/agents/ .claude/agents/ .opencode/agents/ -> bash: rg -n "multi-ai-council" .opencode/agents/ .claude/agents/ .opencode/agents/` | New identity appears; old identity is not active | Grep transcript | PASS if mirrors use `ai-council` | Inspect mirror name fields |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/agents/ai-council.md` | OpenCode runtime mirror |
| `.claude/agents/ai-council.md` | Claude runtime mirror |

---

## 5. SOURCE METADATA

- Group: RUNTIME ROUTING AND RENAME
- Playbook ID: DAC-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md`
