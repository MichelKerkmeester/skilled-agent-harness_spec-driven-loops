---
id: CR-R10
category: intra-routing-recall
stage: routing
title: 'PR_STATE routing'
description: "This scenario validates PR_STATE routing for `CR-R10`. It confirms a pull-request-state prompt selects the `PR_STATE` intent and adds `references/pr-state-dedup.md` to the always-loaded baseline."
expected_intent: PR_STATE
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - references/pr-state-dedup.md
version: 1.0.0.0
---

# CR-R10: PR_STATE routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R10`.

---

## 1. OVERVIEW

This scenario validates PR_STATE routing for `CR-R10`. It confirms that a pull-request-state prompt selects `PR_STATE` and that the route adds `references/pr-state-dedup.md` to the five `DEFAULT_RESOURCES`, which is the dedup reference the M-1 gate is defined in.

### Why This Matters

`PR_STATE` is one of the two intents whose `RESOURCE_MAP` target is not already in the always-loaded baseline, so this scenario can fail on a real regression: a dropped `RESOURCE_MAP["PR_STATE"]` entry removes `references/pr-state-dedup.md` from the route and the printed list loses its sixth path. The disconfirming run then proves the sixth path arrives because of the intent and not because of something else in the prompt. Without this scenario the dedup doctrine loads only by accident, and a reviewer asked to deduplicate a repeated finding on a pull request would be routed nowhere in particular.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R10` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `PR_STATE` and adds `references/pr-state-dedup.md` beyond the baseline, and the disconfirming prompt adds nothing.
- Real user request: `Ask a reviewer not to raise a finding the pull request already has.`
- Prompt: `The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `SKILL.md` §10 over the exact prompt and over the disconfirming prompt, resolve each printed path under the skill root, and compare with the Expected block.
- Expected signals: the exact prompt prints `intents= ['PR_STATE']`, `scores= {'PR_STATE': 15.0}` and six resources ending in `references/pr-state-dedup.md`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and only the five `DEFAULT_RESOURCES`.
- Desired user-visible outcome: a reviewer handed the pull-request dedup doctrine before it starts, and a request for that doctrine that cannot silently degrade to the baseline.
- Pass/fail: PASS if the exact prompt selects `PR_STATE` with score `15.0` and its resource list is the five `DEFAULT_RESOURCES` plus `references/pr-state-dedup.md`, the disconfirming prompt adds nothing, and every printed path exists under the skill root; FAIL if the intent differs, the score differs, the dedup reference is absent, or a printed path does not exist.

**Exact prompt**:

```text
The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R10 | PR_STATE routing | Confirm a pull-request-state prompt selects `PR_STATE` and adds `references/pr-state-dedup.md` beyond the baseline, and that a prompt without those words adds nothing. | `The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.` | bash: run the shipped `SKILL.md` §10 router block over the exact prompt and the disconfirming prompt -> bash: test that every printed path exists under the skill root | The exact prompt prints `intents= ['PR_STATE']`, `scores= {'PR_STATE': 15.0}` and six resources ending in `references/pr-state-dedup.md`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and the five `DEFAULT_RESOURCES` | Both router transcripts plus the path-existence output | PASS iff the exact prompt selects `PR_STATE` at `15.0`, its resource list is the five `DEFAULT_RESOURCES` plus `references/pr-state-dedup.md`, the disconfirming prompt adds nothing, and every printed path exists; FAIL on a different intent or score, a missing dedup reference, or a path that does not resolve | 1. Confirm the §10 block was extracted from `SKILL.md`; 2. Diff `RESOURCE_MAP["PR_STATE"]` and re-run the path-existence step; 3. Check that `references/pr-state-dedup.md` was not renamed |

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
    'The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.',
    'Look at this branch one more time before I merge it.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md references/pr-state-dedup.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `PR_STATE` from five keyword hits at weight `3` each: `pr state`, `repeated finding`, `already flagged`, `prior comment` and `deduplicate`. `dedup` does not match inside `deduplicate`, because the router matches on word boundaries.

```text
'The PR state for this branch: a repeated finding was already flagged in a prior comment, so deduplicate it.'
 intents= ['PR_STATE'] scores= {'PR_STATE': 15.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md', 'references/pr-state-dedup.md']
```

The disconfirming prompt carries no intent keyword, so the route is the baseline alone.

```text
'Look at this branch one more time before I merge it.'
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
OK references/pr-state-dedup.md
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `PR_STATE` |
| Exact-prompt score | `15.0` |
| Sixth resource | `references/pr-state-dedup.md`, absent from the disconfirming route |
| Disconfirming-prompt score map | `{}` |
| Path-existence output | six `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the six-line path-existence output, and the `INTENT_SIGNALS["PR_STATE"]` and `RESOURCE_MAP["PR_STATE"]` excerpts from `SKILL.md` §10.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['PR_STATE']` with `scores= {'PR_STATE': 15.0}` and six resources whose last entry is `references/pr-state-dedup.md`; the disconfirming prompt prints the five `DEFAULT_RESOURCES` only; every printed path resolves under the skill root.
- **Fail**: another intent or score, the dedup reference missing from the six-path list, the disconfirming prompt also carrying the dedup reference, or a `MISS` line.

### Failure Triage

1. Confirm the extraction found the `## 10. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. Re-run the path-existence command. A `MISS references/pr-state-dedup.md` means the reference was renamed or moved; `INTENT_SIGNALS["PR_STATE"]` also names `dedup` and `deduplicate`, so a rename must update the M-1 gate that reference carries.
3. If the intent or the score moved, quote the changed `INTENT_SIGNALS["PR_STATE"]` entry. Weight `3` against seven keywords gives the observed `15.0` for five hits.
4. If the disconfirming prompt still carries the dedup reference, a `PR_STATE` keyword has become a substring of ordinary prose; name the keyword.

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
| [pr-state-dedup.md](../../references/pr-state-dedup.md) | The dedup doctrine and M-1 commands this route adds |
| [SKILL.md](../../SKILL.md) §9.1 (`M-1`) | The gate the added reference defines |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R10
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/pr-state.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
