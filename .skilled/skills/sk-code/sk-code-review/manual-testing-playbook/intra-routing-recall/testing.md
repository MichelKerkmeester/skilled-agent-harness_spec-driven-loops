---
id: CR-R07
category: intra-routing-recall
stage: routing
title: 'Testing routing'
description: "This scenario validates TESTING routing for `CR-R07`. It confirms a test-shaped prompt selects the `TESTING` intent at its own score and adds assets/test-quality-checklist.md beyond the always-loaded baseline."
expected_intent: TESTING
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/test-quality-checklist.md
version: 1.1.0.0
---

# CR-R07: Testing routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R07`.

---

## 1. OVERVIEW

This scenario validates TESTING routing for `CR-R07`. It confirms that a test-shaped prompt selects `TESTING` with a positive score, that the route adds `assets/test-quality-checklist.md` to the five `DEFAULT_RESOURCES`, and that a prompt about a suite's structure adds nothing.

### Why This Matters

`TESTING` is one of the four intents whose `RESOURCE_MAP` target is outside the always-loaded baseline, so a dropped map entry removes the sixth path from the route. It is also the intent whose keywords are most often written in the plural in a real request: the exact prompt says `assertions`, `mocks`, `stubs` and `fixtures`, and none of those matches its singular keyword, so the route has to survive on the five words that do. That makes the score a check on whole-word matching as much as on the intent. CR-R07 asserts the score, the sixth path and a disconfirming run that keeps the suite-and-structure words but drops every test keyword.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R07` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `TESTING` at its own score and adds `assets/test-quality-checklist.md` beyond the baseline, and the disconfirming prompt adds nothing.
- Real user request: `Review target is a test suite the author wants assessed for coverage, assertions and brittle cases.`
- Prompt: `Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, resolve each printed path under the skill root, and compare with the Expected block.
- Expected signals: the exact prompt prints `intents= ['TESTING']`, `scores= {'TESTING': 15.0}` and six resources ending in `assets/test-quality-checklist.md`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and only the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a reviewer handed the test-quality checklist for a suite question, and no test route invented for a prompt that asks about naming and structure alone.
- Pass/fail: PASS if the exact prompt selects `TESTING` with score `15.0` and its resource list is the five `DEFAULT_RESOURCES` plus `assets/test-quality-checklist.md`, the disconfirming prompt adds nothing, and every printed path exists under the skill root; FAIL if the intent differs, the score differs, the test-quality checklist is absent, or a printed path does not exist.

**Exact prompt**:

```text
Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R07 | Testing routing | Confirm a test-shaped prompt selects `TESTING` at its own score and adds `assets/test-quality-checklist.md` beyond the baseline, and that a prompt without test words adds nothing. | `Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> bash: test that every printed path exists under the skill root | The exact prompt prints `intents= ['TESTING']`, `scores= {'TESTING': 15.0}` and six resources ending in `assets/test-quality-checklist.md`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and the five `DEFAULT_RESOURCES` | Both router transcripts plus the path-existence output | PASS iff the exact prompt selects `TESTING` at `15.0`, its resource list is the five `DEFAULT_RESOURCES` plus `assets/test-quality-checklist.md`, the disconfirming prompt adds nothing, and every printed path exists; FAIL on a different intent or score, a missing test-quality checklist, or a path that does not resolve | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `RESOURCE_MAP["TESTING"]` and re-run the path-existence step; 3. Compare the score against the five matched keywords before suspecting the map |

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
    'Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.',
    'Review this suite for structure and naming.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/test-quality-checklist.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `TESTING` from five keyword hits at weight `3` each: `test`, `testing`, `coverage`, `test quality` and `brittle`. Four words in the prompt do not match: `assertions`, `mocks`, `stubs` and `fixtures` are plurals of singular keywords, and the router matches whole words.

```text
'Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.'
 intents= ['TESTING'] scores= {'TESTING': 15.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'assets/test-quality-checklist.md']
```

The disconfirming prompt keeps the suite-and-structure words and drops every test keyword, so no intent matches and the router falls back:

```text
'Review this suite for structure and naming.'
 intents= ['QUALITY'] scores= {} needs_disambiguation= True
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The path-existence command prints one `OK` line per path:

```text
OK references/review-core.md
OK references/review-ux-single-pass.md
OK assets/security-checklist.md
OK assets/code-quality-checklist.md
OK assets/fix-completeness-checklist.md
OK assets/test-quality-checklist.md
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `TESTING` |
| Exact-prompt score | `15.0` |
| Sixth resource | `assets/test-quality-checklist.md`, absent from the disconfirming route |
| Disconfirming-prompt score map | `{}` |
| Path-existence output | six `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the six-line path-existence output, and the `INTENT_SIGNALS["TESTING"]` and `RESOURCE_MAP["TESTING"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['TESTING']` with `scores= {'TESTING': 15.0}` and six resources whose last entry is `assets/test-quality-checklist.md`; the disconfirming prompt prints the five `DEFAULT_RESOURCES` only; every printed path resolves under the skill root.
- **Fail**: another intent or score, the test-quality checklist missing from the six-path list, the disconfirming prompt also carrying it, or a `MISS` line.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score in steps of `3` below `15.0` means one of `test`, `testing`, `coverage`, `test quality` or `brittle` stopped matching. Quote `INTENT_SIGNALS["TESTING"]` and name it.
3. A plural in the prompt is not evidence of a defect on its own: `assertions`, `mocks`, `stubs` and `fixtures` deliberately do not match. A review of their singular forms would raise the score, and this scenario fixes the observed one.
4. A `MISS assets/test-quality-checklist.md` means the checklist moved; `RESOURCE_MAP["TESTING"]` carries the path and must move with it.
5. If the disconfirming prompt prints the test-quality checklist, a `TESTING` keyword has become a substring of ordinary prose; name the keyword.

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
| [test-quality-checklist.md](../../assets/test-quality-checklist.md) | The checklist this route adds |
| [review-core.md](../../references/review-core.md) | The `review.test-*` lens rules the checklist items carry |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R07
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/testing.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
