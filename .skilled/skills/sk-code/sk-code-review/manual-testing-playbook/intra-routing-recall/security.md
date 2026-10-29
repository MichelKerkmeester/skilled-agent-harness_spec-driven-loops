---
id: CR-R01
category: intra-routing-recall
stage: routing
title: 'Security routing'
description: "This scenario validates SECURITY routing for `CR-R01`. It confirms an auth/injection-shaped prompt selects the `SECURITY` intent at its own score and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: SECURITY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.1.2.0
---

# CR-R01: Security routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R01`.

---

## 1. OVERVIEW

This scenario validates SECURITY routing for `CR-R01`. It confirms that an auth/injection-shaped prompt selects `SECURITY` with a positive score, and that the same prompt without its security vocabulary selects no intent at all.

### Why This Matters

`SECURITY` carries the highest `INTENT_SIGNALS` weight (5) in `../../ROUTER.md` because a missed auth or injection defect defeats every other review dimension. `RESOURCE_MAP["SECURITY"]` points at `assets/security-checklist.md`, which is already one of the five `DEFAULT_RESOURCES`, so a path-existence check alone cannot tell a correct route from the always-loaded baseline. The discriminating evidence is the selected intent and its score, plus the disconfirming run where the prompt falls through to the `QUALITY` default with `needs_disambiguation` set. CR-R01 asserts that pair, so a dropped keyword, a changed weight or a dropped map entry fails the scenario instead of passing behind the baseline.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-R01` and confirm the expected signals without contradictory evidence.

- Objective: confirm the exact prompt selects `SECURITY` at its own score and the disconfirming prompt selects no intent.
- Real user request: `Review target is an auth handler that needs a security-focused pass.`
- Prompt: `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.`
- Expected execution process: run the shipped `MACHINE ROUTER` block from `../../ROUTER.md` §3 over the exact prompt and over the disconfirming prompt, and compare the printed intents, scores and resource lists with the Expected block.
- Expected signals: the exact prompt prints `intents= ['SECURITY']`, `scores= {'SECURITY': 25.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, an empty score map and `needs_disambiguation= True`.
- Desired user-visible outcome: a review that keeps the security checklist active and does not relax auth/injection findings because a narrower intent matched.
- Pass/fail: PASS if the exact prompt selects `SECURITY` with score `25.0`, the disconfirming prompt selects `QUALITY` only through the low-score fallback, and every printed path is one of the five `DEFAULT_RESOURCES`; FAIL if the intent differs, the score differs, or the disconfirming prompt still selects `SECURITY`.

**Exact prompt**:

```text
Review this auth handler for injection, vulnerability, race, and secret-handling security issues.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-R01 | Security routing | Confirm an auth/injection-shaped prompt selects `SECURITY` at its own score, and that the same prompt without its security words selects no intent. | `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.` | bash: run the shipped `../../ROUTER.md` §3 router block over the exact prompt and the disconfirming prompt -> compare intents, scores, `needs_disambiguation` and the resource lists with the Expected block | The exact prompt prints `intents= ['SECURITY']`, `scores= {'SECURITY': 25.0}`, `needs_disambiguation= False` and the five `DEFAULT_RESOURCES`; the disconfirming prompt prints `intents= ['QUALITY']`, `scores= {}` and `needs_disambiguation= True` | Both router transcripts, with the intent, score, flag and resource list for each prompt | PASS iff the exact prompt selects `SECURITY` at `25.0`, the disconfirming prompt reaches `QUALITY` only through the low-score fallback, and every printed path is a `DEFAULT_RESOURCES` entry; FAIL on a different intent, a different score, or a disconfirming prompt that still selects `SECURITY` | 1. Confirm the §3 block was extracted from `ROUTER.md` and not rewritten by hand; 2. Diff `INTENT_SIGNALS["SECURITY"]` against the keywords the exact prompt relies on; 3. Check the disconfirming prompt carries no security keyword |

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
    'Review this auth handler for injection, vulnerability, race, and secret-handling security issues.',
    'Review this handler for problems.',
):
    route = ns['route_review_resources'](Task(prompt))
    scores = {key: value for key, value in route.get('scores', {}).items() if value}
    print(repr(prompt))
    print(' intents=', route['intents'], 'scores=', scores, 'needs_disambiguation=', route.get('needs_disambiguation', False))
    print(' resources=', route['resources'])
PY
```

```bash
for path in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md; do
  test -f ".skilled/skills/sk-code/sk-code-review/$path" && echo "OK $path" || echo "MISS $path"
done
```

### Expected

The exact prompt selects `SECURITY` from five keyword hits at weight `5` each: `security`, `auth`, `injection`, `vulnerability` and `race`.

```text
'Review this auth handler for injection, vulnerability, race, and secret-handling security issues.'
 intents= ['SECURITY'] scores= {'SECURITY': 25.0} needs_disambiguation= False
 resources= ['references/review-core.md', 'references/review-ux-single-pass.md', 'assets/security-checklist.md', 'assets/code-quality-checklist.md', 'assets/fix-completeness-checklist.md']
```

The disconfirming prompt carries no intent keyword, so the router returns its low-score fallback and asks for disambiguation.

```text
'Review this handler for problems.'
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
```

| Signal | Expected value |
| --- | --- |
| Exact-prompt intent | `SECURITY` |
| Exact-prompt score | `25.0` |
| Exact-prompt `needs_disambiguation` | `False` |
| Disconfirming-prompt intent | `QUALITY`, reached only through the fallback |
| Disconfirming-prompt score map | `{}` |
| Printed resources | the five `DEFAULT_RESOURCES`, which `RESOURCE_MAP["SECURITY"]` repeats rather than extends |
| Path-existence output | five `OK` lines, no `MISS` |

### Evidence

Both router transcripts, the five-line path-existence output, and the `INTENT_SIGNALS["SECURITY"]` and `RESOURCE_MAP["SECURITY"]` excerpts from `../../ROUTER.md` §3.

### Pass / Fail

- **Pass**: the exact prompt prints `intents= ['SECURITY']` with `scores= {'SECURITY': 25.0}` and `needs_disambiguation= False`; the disconfirming prompt prints `intents= ['QUALITY']` with an empty score map and `needs_disambiguation= True`; every printed path is one of the five `DEFAULT_RESOURCES` and exists under the skill root.
- **Fail**: the exact prompt selects another intent or another score, the disconfirming prompt still selects `SECURITY`, a printed path does not resolve, or the printed path list differs from `DEFAULT_RESOURCES`.

### Failure Triage

1. Confirm the extraction found the `## 3. MACHINE ROUTER` section and the `python` fence inside it; an empty block raises before any routing output and is a scenario-setup failure, not a routing failure.
2. Compare the exact prompt word by word with `INTENT_SIGNALS["SECURITY"]` in `../../ROUTER.md` §3. A reworded prompt that drops one of the five matched keywords lowers the score by `5` and is a prompt-equality failure.
3. A `MISS` line means the resource itself regressed rather than the routing, because every path in this scenario's set is also a `DEFAULT_RESOURCES` entry.
4. If the disconfirming prompt still selects `SECURITY`, a keyword has become a substring of ordinary prose; name the keyword.

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
| [security-checklist.md](../../assets/security-checklist.md) | The checklist the `SECURITY` intent targets |
| [review-core.md](../../references/review-core.md) | The security minimums the intent's findings are graded against |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/security.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
