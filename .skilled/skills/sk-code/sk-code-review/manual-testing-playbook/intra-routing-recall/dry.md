---
id: CR-R04
category: intra-routing-recall
stage: routing
title: 'DRY routing'
description: "This scenario validates DRY routing for `CR-R04`. It confirms a duplication-shaped prompt selects the `DRY` intent at its own score and resolves the shared code-quality checklist already in the always-loaded baseline."
expected_intent: DRY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.1.0.0
---

# CR-R04: DRY routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R04`.

---

## 1. OVERVIEW

This scenario validates DRY routing for `CR-R04`. It confirms that a duplication-shaped prompt selects `DRY` with a positive score, and that the same prompt with its duplication vocabulary replaced by unrelated words selects no intent at all.

### Why This Matters

`DRY` and `KISS` share one `RESOURCE_MAP` target that is already inside `DEFAULT_RESOURCES`, so a resolved-path check cannot tell a duplication route from the bare baseline. The intent and its score can. `DRY` is also the intent most at risk from a near-synonym reword, because `duplicate`, `duplication`, `copy-paste`, `repeated logic` and `dry` are five separate keywords whose absence is invisible in the resolved paths. CR-R04 asserts the score, the intent and a disconfirming prompt whose words are close to the originals but match no keyword, so the route has to be real rather than incidental.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R04` and confirm the expected signals without contradictory evidence.

- Real user request: `Review target repeats one branch several times and the author wants a duplication pass.`
- Objective: confirm the exact prompt selects `DRY` at its own score and the disconfirming prompt selects no intent.
- Prompt: `Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, and compare the printed intents, scores and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['DRY']`, `scores= {'DRY': 15.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and `needs_disambiguation= True`.
- Desired user-visible outcome: a review that reads a duplication complaint as a DRY pass and reaches the shared-lens rules for it.
- Pass/fail: PASS if the exact prompt selects `DRY` with score `15.0`, the disconfirming prompt selects `QUALITY` only through the low-score fallback, and every printed path is one of the five `DEFAULT_RESOURCES`; FAIL if the intent differs, the score differs, or the disconfirming prompt still selects `DRY`.

**Exact prompt**:

```text
Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R04 | DRY routing | Confirm a duplication-shaped prompt selects `DRY` at its own score, and that the same prompt with unrelated words selects no intent. | `Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> compare intents, scores, `needs_disambiguation` and the resource lists with the Expected block | The exact prompt prints `intents= ['DRY']`, `scores= {'DRY': 15.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and `needs_disambiguation= True` | Both router transcripts, with the intent, score, flag and resource list for each prompt | PASS iff the exact prompt selects `DRY` at `15.0`, the disconfirming prompt reaches `QUALITY` only through the low-score fallback, and every printed path is a `DEFAULT_RESOURCES` entry; FAIL on a different intent, a different score, or a disconfirming prompt that still selects `DRY` | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `INTENT_SIGNALS["DRY"]` against the keywords the exact prompt relies on; 3. Check the disconfirming prompt carries no duplication keyword |

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
    'Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.',
    'Review this change and describe each branch in order.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

### Expected

The exact prompt selects `DRY` from five keyword hits at weight `3` each: `dry`, `duplication`, `duplicate`, `copy-paste` and `repeated logic`.

```text
'Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.'
 intents= ['DRY'] scores= {'DRY': 15.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt keeps the reporting words and drops every duplication word, so no intent matches and the router falls back:

```text
'Review this change and describe each branch in order.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `DRY` |
| Exact-prompt score | `15.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt intent | `QUALITY`, reached only through the fallback |
| Disconfirming-prompt score map | `{}` |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["DRY"]` repeats rather than extends |

### Evidence

Both router transcripts, the score map and flag from each, and the `INTENT_SIGNALS["DRY"]` and `RESOURCE_MAP["DRY"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['DRY']` with `scores= {'DRY': 15.0}` and `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']` with an empty score map and `needs_disambiguation= True`; every printed path is one of the five `DEFAULT_RESOURCES`.
- **Fail**: another intent or score, the disconfirming prompt still selecting `DRY`, or a printed path list that differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score that falls in steps of `3` means one or more keywords stopped matching. Quote `INTENT_SIGNALS["DRY"]` and name each one the prompt still contains.
3. `dry` is a short word and a candidate for a substring collision; if an unrelated prompt in the same session selects `DRY`, check that keyword first.
4. If the disconfirming prompt still prints a score map, one of its words matches a `DRY` keyword; name the word.

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
| [code-quality-checklist.md](../../assets/code-quality-checklist.md) | The checklist the `DRY` intent targets, in its duplication section |
| [review-core.md](../../references/review-core.md) | The `review.dry` and `review.rule-of-three` lens rules the checklist items carry |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/dry.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
