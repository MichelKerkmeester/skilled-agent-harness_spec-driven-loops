---
id: CR-R03
category: intra-routing-recall
stage: routing
title: 'KISS routing'
description: "This scenario validates KISS routing for `CR-R03`. It confirms a simplicity-shaped prompt selects the `KISS` intent at its own score and resolves the shared code-quality checklist already in the always-loaded baseline."
expected_intent: KISS
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.1.0.0
---

# CR-R03: KISS routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R03`.

---

## 1. OVERVIEW

This scenario validates KISS routing for `CR-R03`. It confirms that a simplicity-shaped prompt selects `KISS` with a positive score, and that the same prompt without its simplicity vocabulary selects no intent at all.

### Why This Matters

`RESOURCE_MAP["KISS"]` and `RESOURCE_MAP["DRY"]` both point at `assets/code-quality-checklist.md`, which is already one of the five `DEFAULT_RESOURCES`, so the resolved path list is the same whether the simplicity intent matched or not. The discriminator is the intent and its score. `KISS` also relies on three separate keywords for its weight, so a prompt that loses one of them drops by `3` without changing the intent, and a one-word reword is the most likely way this route rots. CR-R03 asserts the score, the intent and a disconfirming run, so all three have to hold.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R03` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `KISS` at its own score and the disconfirming prompt selects no intent.
- Real user request: `Review target looks over-engineered and the author wants a simplicity pass.`
- Prompt: `Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, and compare the printed intents, scores and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['KISS']`, `scores= {'KISS': 9.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and `needs_disambiguation= True`.
- Desired user-visible outcome: a review that reads an over-engineering complaint as a simplicity pass rather than as an unmatched request.
- Pass/fail: PASS if the exact prompt selects `KISS` with score `9.0`, the disconfirming prompt selects `QUALITY` only through the low-score fallback, and every printed path is one of the five `DEFAULT_RESOURCES`; FAIL if the intent differs, the score differs, or the disconfirming prompt still selects `KISS`.

**Exact prompt**:

```text
Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R03 | KISS routing | Confirm a simplicity-shaped prompt selects `KISS` at its own score, and that the same prompt without its simplicity words selects no intent. | `Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> compare intents, scores, `needs_disambiguation` and the resource lists with the Expected block | The exact prompt prints `intents= ['KISS']`, `scores= {'KISS': 9.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and `needs_disambiguation= True` | Both router transcripts, with the intent, score, flag and resource list for each prompt | PASS iff the exact prompt selects `KISS` at `9.0`, the disconfirming prompt reaches `QUALITY` only through the low-score fallback, and every printed path is a `DEFAULT_RESOURCES` entry; FAIL on a different intent, a different score, or a disconfirming prompt that still selects `KISS` | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `INTENT_SIGNALS["KISS"]` against the keywords the exact prompt relies on; 3. Check the disconfirming prompt carries no simplicity keyword |

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
    'Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.',
    'Review this implementation and tell me what you think.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

### Expected

The exact prompt selects `KISS` from three keyword hits at weight `3` each: `kiss`, `simplicity` and `overengineering`. The prompt's `over-engineered` does not match the `over-engineer` keyword, because the router matches whole words, so the third hit comes from `overengineering` alone.

```text
'Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.'
 intents= ['KISS'] scores= {'KISS': 9.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the router returns its low-score fallback and asks for disambiguation.

```text
'Review this implementation and tell me what you think.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `KISS` |
| Exact-prompt score | `9.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt intent | `QUALITY`, reached only through the fallback |
| Disconfirming-prompt score map | `{}` |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["KISS"]` repeats rather than extends |

### Evidence

Both router transcripts, the score map and flag from each, and the `INTENT_SIGNALS["KISS"]` and `RESOURCE_MAP["KISS"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['KISS']` with `scores= {'KISS': 9.0}` and `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']` with an empty score map and `needs_disambiguation= True`; every printed path is one of the five `DEFAULT_RESOURCES`.
- **Fail**: another intent or score, the disconfirming prompt still selecting `KISS`, or a printed path list that differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score of `6.0` rather than `9.0` is the common drift: one of `kiss`, `simplicity` or `overengineering` stopped matching. Quote `INTENT_SIGNALS["KISS"]` and name which one.
3. The intent can survive a dropped keyword while the score does not, which is why the score is asserted and the intent alone is not enough.
4. If the disconfirming prompt still selects `KISS`, a keyword has become a substring of ordinary prose; name the keyword.

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
| [SKILL.md](../../SKILL.md) §10 (`MACHINE ROUTER`) | `INTENT_SIGNALS`, `RESOURCE_MAP`, `DEFAULT_RESOURCES` and the router block this scenario executes |
| [code-quality-checklist.md](../../assets/code-quality-checklist.md) | The checklist the `KISS` intent targets, in its simplicity section |
| [review-core.md](../../references/review-core.md) | The `review.kiss` lens rule the checklist item carries |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/kiss.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
