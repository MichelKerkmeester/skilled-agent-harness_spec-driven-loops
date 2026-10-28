---
id: CR-R05
category: intra-routing-recall
stage: routing
title: 'SOLID routing'
description: "This scenario validates SOLID routing for `CR-R05`. It confirms an architecture-shaped prompt selects the `SOLID` intent at its own score and adds assets/solid-checklist.md beyond the always-loaded baseline."
expected_intent: SOLID
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/solid-checklist.md
version: 1.1.0.0
---

# CR-R05: SOLID routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R05`.

---

## 1. OVERVIEW

This scenario validates SOLID routing for `CR-R05`. It confirms that an architecture-shaped prompt selects `SOLID` with a positive score, that the route adds `assets/solid-checklist.md` to the five `DEFAULT_RESOURCES`, and that the same prompt without its architecture vocabulary adds nothing.

### Why This Matters

`SOLID` is one of the four intents whose `RESOURCE_MAP` target is outside the always-loaded baseline, so this scenario can fail on a real regression: a dropped map entry removes the sixth path from the route. It also carries the widest keyword list in `INTENT_SIGNALS`, which makes it the intent most likely to be scored by an incidental word rather than by the question being asked. The prompt deliberately contains `module boundaries` and `adapter interfaces`, neither of which matches its singular keyword, so the observed score is evidence about whole-word matching as well as about the intent. CR-R05 asserts the score, the sixth path and a disconfirming run, so a widened keyword list that starts matching ordinary prose fails here.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R05` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `SOLID` at its own score and adds `assets/solid-checklist.md` beyond the baseline, and the disconfirming prompt adds nothing.
- Real user request: `Review target is a module layout the author wants assessed for coupling and boundaries.`
- Prompt: `Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, resolve each printed path under the skill root, and compare with the Expected block.
- Expected signals: the exact prompt prints `intents= ['SOLID']`, `scores= {'SOLID': 30.0}` and six resources ending in `assets/solid-checklist.md`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and only the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a reviewer handed the SOLID checklist for an architecture question, and no architecture route invented for a prompt that only asks for an opinion.
- Pass/fail: PASS if the exact prompt selects `SOLID` with score `30.0` and its resource list is the five `DEFAULT_RESOURCES` plus `assets/solid-checklist.md`, the disconfirming prompt adds nothing, and every printed path exists under the skill root; FAIL if the intent differs, the score differs, the SOLID checklist is absent, or a printed path does not exist.

**Exact prompt**:

```text
Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R05 | SOLID routing | Confirm an architecture-shaped prompt selects `SOLID` at its own score and adds `assets/solid-checklist.md` beyond the baseline, and that a prompt without those words adds nothing. | `Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> bash: test that every printed path exists under the skill root | The exact prompt prints `intents= ['SOLID']`, `scores= {'SOLID': 30.0}` and six resources ending in `assets/solid-checklist.md`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and the five `DEFAULT_RESOURCES` | Both router transcripts plus the path-existence output | PASS iff the exact prompt selects `SOLID` at `30.0`, its resource list is the five `DEFAULT_RESOURCES` plus `assets/solid-checklist.md`, the disconfirming prompt adds nothing, and every printed path exists; FAIL on a different intent or score, a missing SOLID checklist, or a path that does not resolve | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `RESOURCE_MAP["SOLID"]` and re-run the path-existence step; 3. Compare the score against the ten matched keywords before suspecting the map |

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
    'Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.',
    'Review this file and tell me what you think.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/solid-checklist.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `SOLID` from ten keyword hits at weight `3` each: `solid`, `architecture`, `design`, `coupling`, `cohesion`, `module`, `adapter`, `abstraction`, `responsibility` and `dependency`. Two words in the prompt do not match: `boundaries` is not `boundary` and `interfaces` is not `interface`, because the router matches whole words.

```text
'Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.'
 intents= ['SOLID'] scores= {'SOLID': 30.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'assets/solid-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the route is the baseline alone.

```text
'Review this file and tell me what you think.'
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
OK assets/solid-checklist.md
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `SOLID` |
| Exact-prompt score | `30.0` |
| Sixth resource | `assets/solid-checklist.md`, absent from the disconfirming route |
| Disconfirming-prompt score map | `{}` |
| Path-existence output | six `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the six-line path-existence output, and the `INTENT_SIGNALS["SOLID"]` and `RESOURCE_MAP["SOLID"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['SOLID']` with `scores= {'SOLID': 30.0}` and six resources whose last entry is `assets/solid-checklist.md`; the disconfirming prompt prints the five `DEFAULT_RESOURCES` only; every printed path resolves under the skill root.
- **Fail**: another intent or score, the SOLID checklist missing from the six-path list, the disconfirming prompt also carrying it, or a `MISS` line.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. A score in steps of `3` below `30.0` means one of the ten matched keywords moved. Quote `INTENT_SIGNALS["SOLID"]` and name the one the prompt still contains.
3. A score above `30.0` means the keyword list grew a word the prompt now matches twice through near-duplicates, or a plural form started matching. Name the new keyword.
4. A `MISS assets/solid-checklist.md` means the checklist moved; `RESOURCE_MAP["SOLID"]` carries the path and must move with it.
5. If the disconfirming prompt prints the SOLID checklist, a `SOLID` keyword has become a substring of ordinary prose; name the keyword.

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
| [solid-checklist.md](../../assets/solid-checklist.md) | The checklist this route adds |
| [review-core.md](../../references/review-core.md) | The `review.solid` lens rule the checklist items carry |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/solid.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
