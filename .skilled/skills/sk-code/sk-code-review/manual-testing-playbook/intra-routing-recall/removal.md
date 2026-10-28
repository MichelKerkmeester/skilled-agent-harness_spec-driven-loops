---
id: CR-R06
category: intra-routing-recall
stage: routing
title: 'Removal routing'
description: "This scenario validates REMOVAL routing for `CR-R06`. It confirms a removal-shaped prompt selects the `REMOVAL` intent at its own score and adds assets/removal-plan.md beyond the always-loaded baseline."
expected_intent: REMOVAL
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/removal-plan.md
version: 1.1.0.0
---

# CR-R06: Removal routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R06`.

---

## 1. OVERVIEW

This scenario validates REMOVAL routing for `CR-R06`. It confirms that a removal-shaped prompt selects `REMOVAL` with a positive score, that the route adds `assets/removal-plan.md` to the five `DEFAULT_RESOURCES`, and that a prompt without removal vocabulary adds nothing.

### Why This Matters

`REMOVAL` is one of the four intents whose `RESOURCE_MAP` target is outside the always-loaded baseline, so a dropped map entry removes the sixth path from the route and this scenario sees it. The removal plan is also the only asset that turns a finding into a deletion with a safe-now or deferred classification, so a review that reaches the removal lens without it recommends deletion with no plan beside it. CR-R06 asserts the score, the sixth path and a disconfirming run, so the route has to arrive on purpose rather than by a word that happens to appear in a cleanup request.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R06` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `REMOVAL` at its own score and adds `assets/removal-plan.md` beyond the baseline, and the disconfirming prompt adds nothing.
- Real user request: `Review target is a cleanup that deprecates an obsolete path and the author wants a removal plan.`
- Prompt: `Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, resolve each printed path under the skill root, and compare with the Expected block.
- Expected signals: the exact prompt prints `intents= ['REMOVAL']`, `scores= {'REMOVAL': 12.0}` and six resources ending in `assets/removal-plan.md`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and only the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a reviewer handed the removal plan for a cleanup question, and no removal route invented for a prompt that only asks for an opinion.
- Pass/fail: PASS if the exact prompt selects `REMOVAL` with score `12.0` and its resource list is the five `DEFAULT_RESOURCES` plus `assets/removal-plan.md`, the disconfirming prompt adds nothing, and every printed path exists under the skill root; FAIL if the intent differs, the score differs, the removal plan is absent, or a printed path does not exist.

**Exact prompt**:

```text
Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R06 | Removal routing | Confirm a removal-shaped prompt selects `REMOVAL` at its own score and adds `assets/removal-plan.md` beyond the baseline, and that a prompt without removal words adds nothing. | `Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> bash: test that every printed path exists under the skill root | The exact prompt prints `intents= ['REMOVAL']`, `scores= {'REMOVAL': 12.0}` and six resources ending in `assets/removal-plan.md`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and the five `DEFAULT_RESOURCES` | Both router transcripts plus the path-existence output | PASS iff the exact prompt selects `REMOVAL` at `12.0`, its resource list is the five `DEFAULT_RESOURCES` plus `assets/removal-plan.md`, the disconfirming prompt adds nothing, and every printed path exists; FAIL on a different intent or score, a missing removal plan, or a path that does not resolve | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `RESOURCE_MAP["REMOVAL"]` and re-run the path-existence step; 3. Compare the score against the four matched keywords before suspecting the map |

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
    'Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.',
    'Review this plan and tell me what you think.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/removal-plan.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `REMOVAL` from four keyword hits at weight `3` each: `remove`, `dead code`, `cleanup` and `deprecate`.

```text
'Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.'
 intents= ['REMOVAL'] scores= {'REMOVAL': 12.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'assets/removal-plan.md']
```

The disconfirming prompt keeps the planning words and drops every removal word, so no intent matches and the router falls back:

```text
'Review this plan and tell me what you think.'
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
OK assets/removal-plan.md
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `REMOVAL` |
| Exact-prompt score | `12.0` |
| Sixth resource | `assets/removal-plan.md`, absent from the disconfirming route |
| Disconfirming-prompt score map | `{}` |
| Path-existence output | six `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the six-line path-existence output, and the `INTENT_SIGNALS["REMOVAL"]` and `RESOURCE_MAP["REMOVAL"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['REMOVAL']` with `scores= {'REMOVAL': 12.0}` and six resources whose last entry is `assets/removal-plan.md`; the disconfirming prompt prints the five `DEFAULT_RESOURCES` only; every printed path resolves under the skill root.
- **Fail**: another intent or score, the removal plan missing from the six-path list, the disconfirming prompt also carrying it, or a `MISS` line.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score in steps of `3` below `12.0` means one of `remove`, `dead code`, `cleanup` or `deprecate` stopped matching. Quote `INTENT_SIGNALS["REMOVAL"]` and name it.
3. `removal` and `removed` do not match the `remove` keyword, because the router matches whole words. A prompt that only says `removal` scores lower, and that is expected rather than a defect.
4. A `MISS assets/removal-plan.md` means the asset moved; `RESOURCE_MAP["REMOVAL"]` and the unrequested-code removal scenario both name it.
5. If the disconfirming prompt prints the removal plan, a `REMOVAL` keyword has become a substring of ordinary prose; name the keyword.

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
| [removal-plan.md](../../assets/removal-plan.md) | The plan this route adds |
| [unrequested-code-removal.md](../efficiency-and-restraint/unrequested-code-removal.md) | The scenario that exercises the needed-ness prompt this route serves |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/removal.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
