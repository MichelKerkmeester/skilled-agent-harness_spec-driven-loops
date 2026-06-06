---
title: "DAC-002 -- Advisor routes council prompts to skill"
description: "This scenario validates advisor routing for explicit AI Council prompts."
---

# DAC-002 -- Advisor routes council prompts to skill

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-002`.

---

## 1. OVERVIEW

This scenario validates advisor routing for council prompts.

### Why This Matters

The advisor must route explicit council requests to the skill instead of treating them as generic planning questions.

---

## 2. SCENARIO CONTRACT

- Objective: Verify scorer coverage for `deep-ai-council`.
- Real user request: Run an AI council deliberation to compare implementation plans and persist council artifacts.
- Prompt: `As a routing-system validator, run the council advisor regression. Verify deep-ai-council is selected. Return command evidence.`
- Expected execution process: Run the targeted scorer test and capture the filtered vitest result.
- Expected signals: Test output includes the named deep-ai-council case and exits successfully.
- Desired user-visible outcome: The user gets evidence that natural council prompts route to the skill.
- Pass/fail: PASS if targeted vitest exits 0; FAIL if the test misses or selects another skill.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the exact targeted vitest command.
2. Capture exit status and relevant test line.
3. Report the routed skill and confidence if printed.

### Prompt

`As a routing-system validator, run the council advisor regression. Verify deep-ai-council is selected. Return command evidence.`

### Commands

1. `bash: cd .opencode/skills/system-spec-kit/mcp_server && node_modules/.bin/vitest run skill_advisor/tests/scorer/native-scorer.vitest.ts -t "deep-ai-council"`

> Note: vitest must be invoked from `mcp_server/` CWD with the local `node_modules/.bin/vitest` binary. Running `npx vitest` from the workspace root fails with `Cannot find module 'vitest/config'` because the vitest config lives at `mcp_server/vitest.config.ts` and the workspace root has no top-level vitest install.

### Expected

The targeted scorer test exits successfully.

### Evidence

Capture the vitest transcript.

### Pass / Fail

- **Pass**: Test exits 0 and covers `deep-ai-council`.
- **Fail**: Test fails, abstains, or routes elsewhere.

### Failure Triage

Check advisor aliases, explicit scorer lane, and native scorer fixtures.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-002 | Advisor routing | Verify council prompt routing | `As a routing-system validator, run the council advisor regression. Verify deep-ai-council is selected. Return command evidence.` | `bash: cd .opencode/skills/system-spec-kit/mcp_server && node_modules/.bin/vitest run skill_advisor/tests/scorer/native-scorer.vitest.ts -t "deep-ai-council"` | Targeted test passes | Vitest transcript | PASS if exit 0 | Inspect scorer lanes |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Advisor regression |
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill routing metadata |

---

## 5. SOURCE METADATA

- Group: RUNTIME ROUTING AND RENAME
- Playbook ID: DAC-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md`
