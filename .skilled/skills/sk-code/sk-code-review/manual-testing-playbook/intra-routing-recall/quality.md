---
id: CR-R02
category: intra-routing-recall
stage: routing
title: 'Quality routing'
description: "This scenario validates QUALITY routing for `CR-R02`. It confirms a correctness/regression-shaped prompt scores the `QUALITY` intent above the disambiguation fallback and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: QUALITY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.1.0.0
---

# CR-R02: Quality routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R02`.

---

## 1. OVERVIEW

This scenario validates QUALITY routing for `CR-R02`. It confirms that a correctness/regression-shaped prompt scores `QUALITY` at `20.0` with no disambiguation flag, and that a prompt with no intent keyword lands on the same intent through the fallback with an empty score map and the flag set.

### Why This Matters

`QUALITY` is the intent the router returns when nothing else matched, so the selected intent alone proves nothing here: a bare prompt and a real quality prompt both read `intents= ['QUALITY']`. What separates them is the score and the `needs_disambiguation` flag, which is why this scenario asserts both and why its disconfirming case cannot be "the intent is not `QUALITY`". `RESOURCE_MAP["QUALITY"]` points at `assets/code-quality-checklist.md`, already inside `DEFAULT_RESOURCES`, so the resource list cannot tell the two apart either. Without the score assertion a dropped `QUALITY` keyword list would be invisible, because every unmapped prompt would still look routed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R02` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt scores `QUALITY` at `20.0` with no disambiguation flag, and the disconfirming prompt reaches `QUALITY` only through the empty-score fallback.
- Real user request: `Review target has correctness and contract-compatibility risk.`
- Prompt: `Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, and compare the printed scores, flags and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['QUALITY']`, `scores= {'QUALITY': 20.0}`, `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}`, `needs_disambiguation= True`; both print the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a review that treats a correctness and contract question as a quality pass rather than an unmatched request, so the reviewer does not stop to ask what was wanted.
- Pass/fail: PASS if the exact prompt scores `QUALITY` at `20.0` with `needs_disambiguation= False` and the disconfirming prompt prints an empty score map with `needs_disambiguation= True`; FAIL if the scores, the flag or the printed paths differ from the Expected block.

**Exact prompt**:

```text
Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R02 | Quality routing | Confirm the exact prompt scores `QUALITY` at `20.0` with no disambiguation flag, and that a prompt with no intent keyword reaches `QUALITY` only through the empty-score fallback. | `Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> compare scores, the `needs_disambiguation` flag and the resource lists with the Expected block | The exact prompt prints `intents= ['QUALITY']`, `scores= {'QUALITY': 20.0}`, `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}`, `needs_disambiguation= True`; both print the five `DEFAULT_RESOURCES` | Both router transcripts, with the score map and flag for each prompt | PASS iff the exact prompt scores `QUALITY` at `20.0` with the flag clear and the disconfirming prompt prints an empty score map with the flag set; FAIL on a different score, a cleared flag on the disconfirming prompt, or a different path list | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `INTENT_SIGNALS["QUALITY"]` against the keywords the exact prompt relies on; 3. Check the fallback threshold, which decides whether the disconfirming prompt takes the empty-score branch |

### Commands

Run from the repository root. The block is extracted from `SKILL.md` at run time, so the scenario tests the shipped router and not a copy of it.

```bash
python3 - <<'PY'
import re
from pathlib import Path

skill = Path('.skilled/skills/sk-code/sk-code-review/SKILL.md')
text = skill.read_text()
block = re.search(r"```python\n(.*?)\n```", text[text.index('## 10. MACHINE ROUTER'):], re.S).group(1)
ns = {'__file__': str(skill), '__name__': 'machine_router', 'load': lambda path: None}
exec(compile(block, 'machine-router', 'exec'), ns)

class Task:
    def __init__(self, text):
        self.text, self.query, self.description, self.keywords = text, '', '', []

for prompt in (
    'Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.',
    'Review this change.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

### Expected

The exact prompt scores `QUALITY` from five keyword hits at weight `4` each: `correctness`, `regression`, `performance`, `contract` and `compatibility`. The prompt's `boundaries` does not match the `boundary` keyword, because the router matches whole words.

```text
'Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.'
 intents= ['QUALITY'] scores= {'QUALITY': 20.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the router returns its low-score fallback. The intent reads the same as the exact prompt, which is why the score map and the flag are the signals here.

```text
'Review this change.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt score | `20.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt score map | `{}` |
| Disconfirming-prompt `needs_disambiguation` | `True` |
| Disconfirming-prompt intent | `QUALITY`, from the fallback rather than from a match |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["QUALITY"]` repeats rather than extends |

### Evidence

Both router transcripts, the score map and flag from each, and the `INTENT_SIGNALS["QUALITY"]` and `RESOURCE_MAP["QUALITY"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `scores= {'QUALITY': 20.0}` with `needs_disambiguation= False`; the disconfirming prompt prints `scores= {}` with `needs_disambiguation= True`; both print the five `DEFAULT_RESOURCES`.
- **Fail**: a different score, the disconfirming prompt printing a non-empty score map or a clear flag, or a resource list that differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score below `20.0` means one of the five matched keywords moved or changed weight. Quote `INTENT_SIGNALS["QUALITY"]` and name the one that stopped matching.
3. If the disconfirming prompt prints the flag as `False`, the fallback threshold moved: the router takes the disambiguation branch only while the summed score stays under its floor.
4. Read the intent on its own with care. `QUALITY` appears in both runs by design, so an intent-only comparison here cannot fail and is not the signal.

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
| [SKILL.md](../../SKILL.md) §10 (`MACHINE ROUTER`) | `INTENT_SIGNALS`, `RESOURCE_MAP`, `DEFAULT_RESOURCES`, the fallback branch and the router block this scenario executes |
| [code-quality-checklist.md](../../assets/code-quality-checklist.md) | The checklist the `QUALITY` intent targets |
| [fix-completeness-checklist.md](../../assets/fix-completeness-checklist.md) | The completeness checklist the route keeps alongside it |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/quality.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
