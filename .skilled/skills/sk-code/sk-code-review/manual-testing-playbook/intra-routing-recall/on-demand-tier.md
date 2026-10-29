---
id: CR-R12
category: intra-routing-recall
stage: routing
title: 'ON_DEMAND tier loading'
description: "This scenario validates ON_DEMAND tier loading for `CR-R12`. It confirms an ON_DEMAND keyword match loads every RESOURCE_MAP target, so a single-intent prompt resolves to the ten deep-dive paths."
expected_intent: SECURITY
version: 1.0.2.0
---

# CR-R12: ON_DEMAND tier loading

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R12`.

---

## 1. OVERVIEW

This scenario validates ON_DEMAND tier loading for `CR-R12`. It confirms that a prompt which scores one intent and also carries an `ON_DEMAND_KEYWORDS` term loads every `RESOURCE_MAP` target, not only the selected intent's, and that the same prompt without the ON_DEMAND term loads the selected intent alone.

### Why This Matters

`../../ROUTER.md` §3 defines three loading levels: `ALWAYS` is `DEFAULT_RESOURCES`, `CONDITIONAL` is `RESOURCE_MAP[intent]`, and `ON_DEMAND` is every `RESOURCE_MAP` target when an `ON_DEMAND_KEYWORDS` term matches. Only the first two tiers are exercised by the per-intent scenarios, so nothing tested the tier that turns one intent into the full ten-path deep-dive set. That is also the tier `SK_CODE_REVIEW_DEPTH=ultra` biases intent selection toward, so an untested ON_DEMAND tier leaves the `ultra` alias with no observable effect to check. CR-R12 asserts the ten-path set and the eight-path difference against the same prompt without its ON_DEMAND term, so a dropped keyword or a broken tier shows up as a missing path.

This file states the ten paths under `### Expected` rather than in `expected_resources`, because the frontmatter field records the tier a route must load for the intent it names, and the ON_DEMAND tier is a property of the prompt rather than of `SECURITY`. The command below is the check either way.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R12` and confirm the expected signals without contradictory evidence.

- Objective: confirm an ON_DEMAND keyword match loads all ten `RESOURCE_MAP` targets, and that the same prompt without the ON_DEMAND term loads only the selected intent's target.
- Real user request: `Ask for one comprehensive security pass and expect the reviewer to hold every checklist at once.`
- Prompt: `Run a comprehensive security review with all checks and list findings.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `../../ROUTER.md` §3 over the exact prompt and over the same prompt with the ON_DEMAND terms removed, then compare the two resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['SECURITY']`, `scores= {'SECURITY': 5.0}` and all ten `RESOURCE_MAP` targets; the reduced prompt prints the same intent and score with the five `DEFAULT_RESOURCES` only, because `RESOURCE_MAP["SECURITY"]` is already inside them.
- Desired user-visible outcome: one comprehensive request that actually loads the deep-dive set, and a single-intent request that stays narrow, so the operator can tell the two apart from the transcript.
- Pass/fail: PASS if the exact prompt prints all ten `RESOURCE_MAP` targets and the reduced prompt prints five, with the same intent and score on both; FAIL if the exact prompt prints fewer than ten, the reduced prompt also prints ten, or the intent or score differs between the runs.

**Exact prompt**:

```text
Run a comprehensive security review with all checks and list findings.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a comprehensive security review with all checks and list findings.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R12 | ON_DEMAND tier loading | Confirm an ON_DEMAND keyword match loads all ten `RESOURCE_MAP` targets, and that the same prompt without the ON_DEMAND term loads only the selected intent's target. | `Run a comprehensive security review with all checks and list findings.` | bash: run the shipped `../../ROUTER.md` §3 router block over the exact prompt and over the same prompt with the ON_DEMAND terms removed -> compare the two resource lists with the Expected block | The exact prompt prints `intents= ['SECURITY']`, `scores= {'SECURITY': 5.0}` and all ten `RESOURCE_MAP` targets; the reduced prompt prints the same intent and score with the five `DEFAULT_RESOURCES` only | Both router transcripts, with the resource list for each prompt and the count in each list | PASS iff the exact prompt prints ten `RESOURCE_MAP` targets and the reduced prompt prints five, with the same intent and score on both; FAIL if the exact prompt prints fewer than ten, the reduced prompt also prints ten, or the intent or score differs between the runs | 1. Confirm the §3 block was extracted from `ROUTER.md`; 2. Check `ON_DEMAND_KEYWORDS` for the terms the exact prompt relies on; 3. Confirm the reduced prompt really carries no ON_DEMAND term |

### Commands

Run from the repository root. The block is extracted from `ROUTER.md` at run time, so the scenario tests the shipped router and not a copy of it.

```bash
python3 - <<'PY'
import re
from pathlib import Path

skill = Path('.skilled/skills/sk-code/sk-code-review/ROUTER.md')
text = skill.read_text()
block = re.search(r"```python\n(.*?)\n```", text[text.index('## 3. MACHINE ROUTER'):], re.S).group(1)
ns = {'__file__': str(skill), '__name__': 'machine_router', 'load': lambda path: None}
exec(compile(block, 'machine-router', 'exec'), ns)

class Task:
    def __init__(self, text):
        self.text, self.query, self.description, self.keywords = text, '', '', []

for label, prompt in (
    ('ON_DEMAND', 'Run a comprehensive security review with all checks and list findings.'),
    ('CONDITIONAL', 'Run a security review of this change.'),
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(label)
    print(' intents=', route['intents'], 'scores=', scores)
    print(' count=', len(route['resources']), 'resources=', route['resources'])
PY
```

### Expected

The exact prompt scores `SECURITY` from the single keyword `security` at weight `5`, and carries three `ON_DEMAND_KEYWORDS` terms: `comprehensive`, `all checks` and `list findings`. The three-term match loads every `RESOURCE_MAP` target, which is ten distinct paths.

```text
ON_DEMAND
 intents= ['SECURITY'] scores= {'SECURITY': 5.0}
 count= 10 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'assets/solid-checklist.md', 'assets/removal-plan.md', 'assets/test-quality-checklist.md', 'references/pr-state-dedup.md', 'references/quick-reference.md']
```

The reduced prompt keeps the same intent and score and loads the `CONDITIONAL` tier only. `RESOURCE_MAP["SECURITY"]` is `assets/security-checklist.md`, which is already inside `DEFAULT_RESOURCES`, so the list stays at five and grows by no path.

```text
CONDITIONAL
 intents= ['SECURITY'] scores= {'SECURITY': 5.0}
 count= 5 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent and score | `SECURITY`, `5.0` |
| Exact-prompt resource count | `10` |
| Extra paths beyond the baseline | `assets/solid-checklist.md`, `assets/removal-plan.md`, `assets/test-quality-checklist.md`, `references/pr-state-dedup.md`, `references/quick-reference.md` |
| Reduced-prompt resource count | `5` |
| Reduced-prompt intent and score | `SECURITY`, `5.0`, unchanged |

### Evidence

Both router transcripts, the resource count from each, and the `ON_DEMAND_KEYWORDS` and `RESOURCE_MAP` excerpts from `../../ROUTER.md` §3.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['SECURITY']` with `scores= {'SECURITY': 5.0}` and ten resources; the reduced prompt prints the same intent and score with five; the ten-path list holds exactly the ten `RESOURCE_MAP` targets.
- **Fail**: the exact prompt prints fewer than ten, the reduced prompt also prints ten, the intent or score differs between the two runs, or a printed path is not a `RESOURCE_MAP` target.

### Failure Triage

1. Confirm the extraction found the `## 3. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. If the exact prompt prints five, quote `ON_DEMAND_KEYWORDS` and confirm the prompt still carries `comprehensive`, `all checks` or `list findings`. The tier runs only after the low-score check, so a prompt scoring nothing takes the disambiguation branch and never reaches it.
3. If both runs print ten, the reduced prompt still carries an ON_DEMAND term; name the term that survived the edit.
4. If a tenth path is missing, diff the printed list against `RESOURCE_MAP` and name the dropped target.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ROUTER.md](../../ROUTER.md) §3 (`MACHINE ROUTER`) | The three loading levels, `ON_DEMAND_KEYWORDS`, `RESOURCE_MAP` and the router block this scenario executes |
| [SKILL.md](../../SKILL.md) §9.3 (`SK_CODE_REVIEW_DEPTH`) | The `ultra` alias that biases intent selection toward the tier this scenario exercises |
| [solid-checklist.md](../../assets/solid-checklist.md) | A deep-dive path that arrives through the ON_DEMAND tier alone |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R12
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/on-demand-tier.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
