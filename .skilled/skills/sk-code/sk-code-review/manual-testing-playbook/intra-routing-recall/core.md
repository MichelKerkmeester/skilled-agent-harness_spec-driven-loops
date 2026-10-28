---
id: CR-R08
category: intra-routing-recall
stage: routing
title: 'CORE routing'
description: "This scenario validates CORE routing for `CR-R08`. It confirms a doctrine-shaped prompt selects the `CORE` intent at its own score and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: CORE
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.0.0
---

# CR-R08: CORE routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R08`.

---

## 1. OVERVIEW

This scenario validates CORE routing for `CR-R08`. It confirms that a doctrine-shaped prompt selects `CORE` with a positive score, and that the same prompt with the doctrine words removed selects no intent at all.

### Why This Matters

`CORE` is the only intent whose `RESOURCE_MAP` target list is already inside `DEFAULT_RESOURCES`: `references/review-core.md` and `references/review-ux-single-pass.md` load on every invocation. A path-existence check therefore cannot detect a regression in `INTENT_SIGNALS["CORE"]` or in the `RESOURCE_MAP["CORE"]` entry, because both the correct route and the always-loaded baseline print the same five paths. The discriminating evidence is the selected intent and its score, plus the disconfirming run, where the prompt without its doctrine vocabulary falls through to the `QUALITY` default with `needs_disambiguation` set. CR-R08 asserts that pair, so a dropped keyword, a changed weight or a dropped map entry fails the scenario.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R08` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `CORE` at its own score and the disconfirming prompt selects no intent.
- Real user request: `Ask for the review doctrine and the single-pass flow before starting on a branch.`
- Prompt: `Walk me through the review doctrine and the single-pass interactive review before I start on this branch.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, and compare the printed intents, scores and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['CORE']`, `scores= {'CORE': 6.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and `needs_disambiguation= True`.
- Desired user-visible outcome: a reviewer routed to the shared review doctrine, and no silent fall-through where the doctrine intent merely looks satisfied by the always-loaded baseline.
- Pass/fail: PASS if the exact prompt selects `CORE` with score `6.0`, the disconfirming prompt selects `QUALITY` only through the low-score fallback, and every printed path is one of the five `DEFAULT_RESOURCES`; FAIL if the intent differs, the score differs, or the disconfirming prompt still selects `CORE`.

**Exact prompt**:

```text
Walk me through the review doctrine and the single-pass interactive review before I start on this branch.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Walk me through the review doctrine and the single-pass interactive review before I start on this branch.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R08 | CORE routing | Confirm a doctrine-shaped prompt selects `CORE` at its own score, and that the same prompt without its doctrine words selects no intent. | `Walk me through the review doctrine and the single-pass interactive review before I start on this branch.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> compare intents, scores, `needs_disambiguation` and the resource lists with the Expected block | The exact prompt prints `intents= ['CORE']`, `scores= {'CORE': 6.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and `needs_disambiguation= True` | Both router transcripts, with the intent, score, flag and resource list for each prompt | PASS iff the exact prompt selects `CORE` at `6.0`, the disconfirming prompt reaches `QUALITY` only through the low-score fallback, and every printed path is a `DEFAULT_RESOURCES` entry; FAIL on a different intent, a different score, or a disconfirming prompt that still selects `CORE` | 1. Confirm the §10 block was extracted from `SKILL.md` and not rewritten by hand; 2. Diff `INTENT_SIGNALS["CORE"]` against the keywords the exact prompt relies on; 3. Check the disconfirming prompt really carries no `CORE` keyword |

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
    'Walk me through the review doctrine and the single-pass interactive review before I start on this branch.',
    'Walk me through what happens before I start on this branch.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

### Expected

The exact prompt selects `CORE` from three keyword hits at weight `2` each: `review doctrine`, `single-pass` and `interactive review`.

```text
'Walk me through the review doctrine and the single-pass interactive review before I start on this branch.'
 intents= ['CORE'] scores= {'CORE': 6.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the router returns its low-score fallback and asks for disambiguation.

```text
'Walk me through what happens before I start on this branch.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `CORE` |
| Exact-prompt score | `6.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt intent | `QUALITY`, reached only through the fallback |
| Disconfirming-prompt score map | `{}` |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["CORE"]` repeats rather than extends |

### Evidence

Both router transcripts, the extracted-block provenance line, and the `INTENT_SIGNALS["CORE"]` and `RESOURCE_MAP["CORE"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['CORE']` with `scores= {'CORE': 6.0}` and `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']` with an empty score map and `needs_disambiguation= True`; every printed path is one of the five `DEFAULT_RESOURCES`.
- **Fail**: the exact prompt selects another intent or another score, the disconfirming prompt still selects `CORE`, or the printed path list differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. Compare the exact prompt word by word with `INTENT_SIGNALS["CORE"]` in `SKILL.md` §10. A reworded prompt that drops `review doctrine`, `single-pass` or `interactive review` lowers the score and is a prompt-equality failure.
3. If the score moved but the intent did not, quote the changed weight in `INTENT_SIGNALS["CORE"]`; a weight edit inside the ambiguity delta also changes which intents `select_intents` keeps.
4. If the disconfirming prompt selects `CORE`, the keyword list has grown a substring that matches ordinary prose; name the keyword.

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
| [review-core.md](../../references/review-core.md) | The shared review doctrine the `CORE` intent targets |
| [review-ux-single-pass.md](../../references/review-ux-single-pass.md) | The single-pass interactive flow the `CORE` intent also targets |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R08
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/core.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
