---
id: CR-R11
category: intra-routing-recall
stage: routing
title: 'SETUP routing'
description: "This scenario validates SETUP routing for `CR-R11`. It confirms a setup-shaped prompt selects the `SETUP` intent and adds `references/quick-reference.md` to the always-loaded baseline."
expected_intent: SETUP
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - references/quick-reference.md
version: 1.0.2.0
---

# CR-R11: SETUP routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R11`.

---

## 1. OVERVIEW

This scenario validates SETUP routing for `CR-R11`. It confirms that a setup-shaped prompt selects `SETUP` and that the route adds `references/quick-reference.md` to the five `DEFAULT_RESOURCES`, which is the index `SKILL.md` §8 tells a reader to start from.

### Why This Matters

`SETUP` is one of the two intents whose `RESOURCE_MAP` target is outside the always-loaded baseline, so a dropped `RESOURCE_MAP["SETUP"]` entry is visible here as a missing sixth path. The intent carries the lowest weight in `INTENT_SIGNALS`, so it is also the intent most easily lost to a reweighting, and the exact score is the evidence that catches that. The disconfirming run proves the sixth path arrives because of the setup vocabulary and nothing else. Without this scenario an operator asking how to review receives the baseline with no index telling them where to start.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R11` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `SETUP` and adds `references/quick-reference.md` beyond the baseline, and the disconfirming prompt adds nothing.
- Real user request: `Ask where to start reading before running a review.`
- Prompt: `Show me the review quick reference and the review workflow for a small change.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `../../ROUTER.md` §3 over the exact prompt and over the disconfirming prompt, resolve each printed path under the skill root, and compare with the Expected block.
- Expected signals: the exact prompt prints `intents= ['SETUP']`, `scores= {'SETUP': 4.0}` and six resources ending in `references/quick-reference.md`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and only the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a reviewer handed the mode's own index before it starts, and a request for that index that cannot silently degrade to the baseline.
- Pass/fail: PASS if the exact prompt selects `SETUP` with score `4.0` and its resource list is the five `DEFAULT_RESOURCES` plus `references/quick-reference.md`, the disconfirming prompt adds nothing, and every printed path exists under the skill root; FAIL if the intent differs, the score differs, the index reference is absent, or a printed path does not exist.

**Exact prompt**:

```text
Show me the review quick reference and the review workflow for a small change.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me the review quick reference and the review workflow for a small change.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R11 | SETUP routing | Confirm a setup-shaped prompt selects `SETUP` and adds `references/quick-reference.md` beyond the baseline, and that a prompt without those words adds nothing. | `Show me the review quick reference and the review workflow for a small change.` | bash: run the shipped `../../ROUTER.md` §3 router block over the exact prompt and the disconfirming prompt -> bash: test that every printed path exists under the skill root | The exact prompt prints `intents= ['SETUP']`, `scores= {'SETUP': 4.0}` and six resources ending in `references/quick-reference.md`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and the five `DEFAULT_RESOURCES` | Both router transcripts plus the path-existence output | PASS iff the exact prompt selects `SETUP` at `4.0`, its resource list is the five `DEFAULT_RESOURCES` plus `references/quick-reference.md`, the disconfirming prompt adds nothing, and every printed path exists; FAIL on a different intent or score, a missing index reference, or a path that does not resolve | 1. Confirm the §3 block was extracted from `ROUTER.md`; 2. Diff `RESOURCE_MAP["SETUP"]` and re-run the path-existence step; 3. Check whether a reweighting of the `SETUP` weight pushed the score off `4.0` |

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
    'Show me the review quick reference and the review workflow for a small change.',
    'Show me something useful for a small change.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md references/quick-reference.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `SETUP` from two keyword hits at weight `2` each: `review quick reference` and `review workflow`.

```text
'Show me the review quick reference and the review workflow for a small change.'
 intents= ['SETUP'] scores= {'SETUP': 4.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'references/quick-reference.md']
```

The disconfirming prompt carries no intent keyword, so the route is the baseline alone.

```text
'Show me something useful for a small change.'
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
OK references/quick-reference.md
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `SETUP` |
| Exact-prompt score | `4.0` |
| Sixth resource | `references/quick-reference.md`, absent from the disconfirming route |
| Disconfirming-prompt score map | `{}` |
| Path-existence output | six `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the six-line path-existence output, and the `INTENT_SIGNALS["SETUP"]` and `RESOURCE_MAP["SETUP"]` excerpts from `../../ROUTER.md` §3.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['SETUP']` with `scores= {'SETUP': 4.0}` and six resources whose last entry is `references/quick-reference.md`; the disconfirming prompt prints the five `DEFAULT_RESOURCES` only; every printed path resolves under the skill root.
- **Fail**: another intent or score, the index reference missing from the six-path list, the disconfirming prompt also carrying the index reference, or a `MISS` line.

### Failure Triage

1. Confirm the extraction found the `## 3. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. Re-run the path-existence command. A `MISS references/quick-reference.md` means the index was renamed or moved, and `SKILL.md` §8 still points a reader at it.
3. If the score moved, quote the changed `INTENT_SIGNALS["SETUP"]` weight. Two hits at weight `2` give `4.0`; the sum is above the `0.5` fallback line, so a weight of `0` would turn the run into the disambiguation branch rather than a different score.
4. If the disconfirming prompt still carries the index reference, a `SETUP` keyword has become a substring of ordinary prose; name the keyword.

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
| [quick-reference.md](../../references/quick-reference.md) | The index this route adds |
| [SKILL.md](../../SKILL.md) §8 (`RELATED RESOURCES`) | The instruction that starts a reader at the added index |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R11
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/setup.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
