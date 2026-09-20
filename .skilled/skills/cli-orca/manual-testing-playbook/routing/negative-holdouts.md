---
title: "ORCA-002 -- Negative holdouts stay out of the Orca route"
description: "This scenario validates that OpenOrca model traffic and generic git worktree requests never route to cli-orca."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-002 -- Negative holdouts stay out of the Orca route

This file is the canonical operator contract for the negative holdouts that must never route into `cli-orca`.

---

## 1. OVERVIEW

This scenario verifies that the Orca routing vocabulary excludes what it must: an OpenOrca model label produces no `cli-orca` recommendation at all, and a generic git worktree request routes to `sk-git` instead.

### Why This Matters

The bare token `orca` also matches the OpenOrca model family and the GNOME Orca screen reader, so it is never a routing signal on its own. Generic git worktrees belong to `sk-git`. If either holdout routes into `cli-orca`, a model-label question or a plain git request would be answered with Orca runtime commands that do not apply.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that OpenOrca model traffic and generic git worktree requests never produce a `cli-orca` recommendation.
- Real user request: `Show the OpenOrca model label for the current request.` followed by `create a git worktree for the release branch`
- Prompt 1: `Show the OpenOrca model label for the current request.`
- Prompt 2: `create a git worktree for the release branch`
- Expected execution process: Run the advisor entry point twice from the repository root, once per holdout prompt, and inspect each JSON recommendations array.
- Expected signals: The first run returns no `cli-orca` recommendation at all. The second run recommends `sk-git` and never `cli-orca`.
- Desired user-visible outcome: A concise verdict that states both holdouts stayed out of the Orca route and names where the generic worktree request landed.
- Pass/fail: PASS if both holdout runs exclude `cli-orca` and the generic worktree run recommends `sk-git`. FAIL if `cli-orca` appears in either recommendations list. SKIP only when the advisor runtime cannot run at all, and record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. From the repository root, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Show the OpenOrca model label for the current request." --format json`.
2. Record the exit status and the recommendations array for the first holdout.
3. From the repository root, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "create a git worktree for the release branch" --format json`.
4. Record the exit status and the recommendations array for the second holdout.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-002 | Negative holdouts stay out of the Orca route | Prove the vocabulary excludes OpenOrca model traffic and routes generic worktree requests to sk-git. | `Show the OpenOrca model label for the current request.` then `create a git worktree for the release branch` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Show the OpenOrca model label for the current request." --format json` -> 2. Capture exit status and recommendations -> 3. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "create a git worktree for the release branch" --format json` -> 4. Capture exit status and recommendations. | First run: no `cli-orca` recommendation at all. Second run: `sk-git` is recommended and `cli-orca` never appears. | Command transcripts, exit statuses and both ordered recommendations arrays. | PASS if both holdout runs exclude `cli-orca` and the generic worktree run recommends `sk-git`. FAIL if `cli-orca` appears in either list. SKIP only when the advisor runtime cannot run at all. | 1. Run the entry point with `--help` to confirm the subcommand. 2. Check the advisor freshness state in the JSON. 3. Compare each prompt with the when-not-to-use table in the [root playbook](../manual-testing-playbook.md). 4. Rerun after restoring the advisor runtime. |

### Evidence Review

Do not treat an empty first list alone as success without recording it. The generic worktree run must actively recommend `sk-git`, because an empty result there would mean routing broke in the other direction. A `cli-orca` entry in either list is a FAIL regardless of rank.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Orca-qualified vocabulary catalog entry](../../feature-catalog/routing/orca-qualified-vocabulary.md) | The routing vocabulary these holdouts bound. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-orca router contract](../../SKILL.md) | The when-not-to-use table and the bare-token rule these holdouts enforce. |
| [Advisor entry point](../../../system-skill-advisor/runtime/scripts/skill_advisor.py) | The advisor surface the entry point wraps. |

---

## 5. SOURCE METADATA

- Group: Routing
- Playbook ID: ORCA-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/negative-holdouts.md`
- Catalog entry: `routing/orca-qualified-vocabulary.md`
- Prompt equality requirement: both SCENARIO CONTRACT prompts equal the 9-column table Exact Prompt cell in order and the root summary prompts.
