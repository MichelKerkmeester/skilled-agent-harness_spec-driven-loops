---
id: CR-R09
category: intra-routing-recall
stage: routing
title: 'COMPLETENESS routing'
description: "This scenario validates COMPLETENESS routing for `CR-R09`. It confirms a fix-completeness prompt selects the `COMPLETENESS` intent at its own score and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: COMPLETENESS
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.2.0
---

# CR-R09: COMPLETENESS routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R09`.

---

## 1. OVERVIEW

This scenario validates COMPLETENESS routing for `CR-R09`. It confirms that a fix-completeness prompt selects `COMPLETENESS` with a positive score, and that the same prompt without the completeness vocabulary selects no intent at all.

### Why This Matters

`COMPLETENESS` points at `assets/fix-completeness-checklist.md`, which is already one of the five `DEFAULT_RESOURCES`. A path-existence check therefore passes whether or not `INTENT_SIGNALS["COMPLETENESS"]` and `RESOURCE_MAP["COMPLETENESS"]` still work, because the always-loaded baseline prints the same list. The discriminating evidence is the selected intent and its score, plus the disconfirming run where the prompt falls through to the `QUALITY` default. CR-R09 asserts that pair, so a dropped keyword, a changed weight or a dropped map entry fails the scenario and the intent cannot hide behind the baseline.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R09` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `COMPLETENESS` at its own score and the disconfirming prompt selects no intent.
- Real user request: `Ask whether a patch really fixes every call site or only the reported one.`
- Prompt: `Check fix completeness here: is this an incomplete fix that leaves leftover call sites?`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `../../ROUTER.md` §3 over the exact prompt and over the disconfirming prompt, and compare the printed intents, scores and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['COMPLETENESS']`, `scores= {'COMPLETENESS': 9.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and `needs_disambiguation= True`.
- Desired user-visible outcome: a reviewer routed to the fix-completeness checklist, and no silent fall-through where that checklist merely arrives with the baseline.
- Pass/fail: PASS if the exact prompt selects `COMPLETENESS` with score `9.0`, the disconfirming prompt selects `QUALITY` only through the low-score fallback, and every printed path is one of the five `DEFAULT_RESOURCES`; FAIL if the intent differs, the score differs, or the disconfirming prompt still selects `COMPLETENESS`.

**Exact prompt**:

```text
Check fix completeness here: is this an incomplete fix that leaves leftover call sites?
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check fix completeness here: is this an incomplete fix that leaves leftover call sites?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R09 | COMPLETENESS routing | Confirm a fix-completeness prompt selects `COMPLETENESS` at its own score, and that the same prompt without its completeness words selects no intent. | `Check fix completeness here: is this an incomplete fix that leaves leftover call sites?` | bash: run the shipped `../../ROUTER.md` §3 router block over the exact prompt and the disconfirming prompt -> compare intents, scores, `needs_disambiguation` and the resource lists with the Expected block | The exact prompt prints `intents= ['COMPLETENESS']`, `scores= {'COMPLETENESS': 9.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and `needs_disambiguation= True` | Both router transcripts, with the intent, score, flag and resource list for each prompt | PASS iff the exact prompt selects `COMPLETENESS` at `9.0`, the disconfirming prompt reaches `QUALITY` only through the low-score fallback, and every printed path is a `DEFAULT_RESOURCES` entry; FAIL on a different intent, a different score, or a disconfirming prompt that still selects `COMPLETENESS` | 1. Confirm the §3 block was extracted from `ROUTER.md` and not rewritten by hand; 2. Diff `INTENT_SIGNALS["COMPLETENESS"]` against the keywords the exact prompt relies on; 3. Check the disconfirming prompt carries no completeness keyword |

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

for prompt in (
    'Check fix completeness here: is this an incomplete fix that leaves leftover call sites?',
    'Check this change here before I merge it.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

### Expected

The exact prompt selects `COMPLETENESS` from three keyword hits at weight `3` each: `fix completeness`, `incomplete fix` and `leftover`.

```text
'Check fix completeness here: is this an incomplete fix that leaves leftover call sites?'
 intents= ['COMPLETENESS'] scores= {'COMPLETENESS': 9.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the router returns its low-score fallback and asks for disambiguation.

```text
'Check this change here before I merge it.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `COMPLETENESS` |
| Exact-prompt score | `9.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt intent | `QUALITY`, reached only through the fallback |
| Disconfirming-prompt score map | `{}` |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["COMPLETENESS"]` repeats rather than extends |

### Evidence

Both router transcripts, the extracted-block provenance line, and the `INTENT_SIGNALS["COMPLETENESS"]` and `RESOURCE_MAP["COMPLETENESS"]` excerpts from `../../ROUTER.md` §3.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['COMPLETENESS']` with `scores= {'COMPLETENESS': 9.0}` and `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']` with an empty score map and `needs_disambiguation= True`; every printed path is one of the five `DEFAULT_RESOURCES`.
- **Fail**: the exact prompt selects another intent or another score, the disconfirming prompt still selects `COMPLETENESS`, or the printed path list differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 3. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. Compare the exact prompt word by word with `INTENT_SIGNALS["COMPLETENESS"]` in `../../ROUTER.md` §3. A reworded prompt that drops `fix completeness`, `incomplete fix` or `leftover` lowers the score and is a prompt-equality failure.
3. If the score moved but the intent did not, quote the changed weight in `INTENT_SIGNALS["COMPLETENESS"]`; the `COMPLETENESS` weight is `3` and sits inside the ambiguity delta, so a weight edit can also pull a second intent into `select_intents`.
4. If the disconfirming prompt selects `COMPLETENESS`, the keyword list has grown a substring that matches ordinary prose; name the keyword.

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
| [ROUTER.md](../../ROUTER.md) §3 (`MACHINE ROUTER`) | `INTENT_SIGNALS`, `RESOURCE_MAP`, `DEFAULT_RESOURCES` and the router block this scenario executes |
| [fix-completeness-checklist.md](../../assets/fix-completeness-checklist.md) | The checklist the `COMPLETENESS` intent targets |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R09
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/completeness.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
