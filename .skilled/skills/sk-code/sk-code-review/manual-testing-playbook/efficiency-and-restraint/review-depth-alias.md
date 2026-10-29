---
title: "CR-023 -- Review-depth alias"
description: "This scenario validates the review-depth alias for `CR-023`. It focuses on the reviewing agent honoring SK_CODE_REVIEW_DEPTH=lite|full|ultra as resolved env over default, with ultra resolving the ON_DEMAND deep-dive set and lite never relaxing a floor or skipping a sensitive path."
version: 1.6.1.0
---

# CR-023 -- Review-depth alias

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-023`.

---

## 1. OVERVIEW

This scenario validates the review-depth alias for `CR-023`. It focuses on the reviewing agent honoring `SK_CODE_REVIEW_DEPTH=lite|full|ultra`, resolved env over default, with no config tier in between, and on the two things the alias may never do: relax a floor or skip a sensitive path.

### Why This Matters

Callers who wanted a consistently deep, or consistently light, review previously had to repeat `comprehensive` or `full review` on every run. The §9.3 `SK_CODE_REVIEW_DEPTH` alias names and persists routing that already existed: `full` (the unset default) is normal ALWAYS plus CONDITIONAL plus ON_DEMAND routing, `ultra` biases intent selection toward the ON_DEMAND deep-dive reference set, and `lite` maps to the M-2 conservative skip. It is an alias the reviewing agent honors in-loop, resolved env over default, and it adds no tier and relaxes no floor. Two consequences are worth a scenario of their own. `lite` maps onto M-2, and M-2 is opt-in, so setting `lite` without `SK_CODE_REVIEW_MIN_CHANGED_LINES` must still review every diff in full. And `lite` can never skip a sensitive path, exactly as M-2 cannot. CR-023 asserts the resolution order, ultra's observable effect, and both of those floor properties.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-023` and confirm the expected signals without contradictory evidence.

- Objective: confirm `SK_CODE_REVIEW_DEPTH` resolves env over default with no config tier, ultra resolves the ON_DEMAND deep-dive set, and lite neither suppresses a review on its own nor skips a sensitive path.
- Real user request: `Reviewer wants a consistently deep, then consistently light, review without repeating depth wording each run.`
- Prompt: `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.`
- Expected execution process: run the router over the review prompt both with and without an ON_DEMAND term to show the reference set ultra biases toward, grep the quality config for a depth key, then run the three exported-depth reviews and compare each transcript with the Expected block.
- Expected signals: the ON_DEMAND run resolves ten paths and the plain run resolves five; the depth key appears in no quality config; the `ultra` transcript loads the deep-dive references; the `lite` run without the M-2 threshold still reviews in full; the `lite` run on a sensitive-path diff still reviews in full.
- Desired user-visible outcome: a session whose review depth matches the requested alias without ever dropping a baseline minimum or skipping a sensitive change.
- Pass/fail: PASS if the alias resolves from the environment alone, ultra's transcript shows the deep-dive set, and lite neither suppresses a review without the M-2 threshold nor skips a sensitive path; FAIL if a depth value relaxes a baseline minimum, a review is suppressed on a sensitive diff, or a config key is read as a resolution tier.

**Exact prompt**:

```text
Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-023 | Review-depth alias | Confirm `SK_CODE_REVIEW_DEPTH` resolves env over default with no config tier, ultra resolves the ON_DEMAND deep-dive set, and lite neither suppresses a review on its own nor skips a sensitive path. | `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.` | bash: run the `ROUTER.md` §3 router over the prompt with and without an ON_DEMAND term to show the set ultra biases toward -> bash: grep the quality config for a depth key -> bash: export SK_CODE_REVIEW_DEPTH=ultra -> agent: @review the diff -> bash: export SK_CODE_REVIEW_DEPTH=lite with no M-2 threshold -> agent: @review the diff -> bash: export SK_CODE_REVIEW_DEPTH=lite and the M-2 threshold -> agent: @review a sensitive-path diff | The ON_DEMAND run resolves ten paths and the plain run five; the depth key appears in no quality config; the ultra transcript loads the deep-dive references; the lite run without the threshold reviews in full; the lite sensitive-path run reviews in full | The two router transcripts, the config grep, and the three review transcripts with their loaded-reference lists | PASS iff the alias resolves from the environment alone, ultra's transcript shows the deep-dive set, and lite neither suppresses a review without the M-2 threshold nor skips a sensitive path; FAIL if a depth value relaxes a baseline minimum, a review is suppressed on a sensitive diff, or a config key is read as a resolution tier | 1. Check that the export preceded the dispatch in the same shell; 2. Confirm the M-2 threshold state before reading a lite result; 3. Check the sensitive-path classification before calling a skip a defect |

### Exact Commands

Step 1 shows the reference set that `ultra` biases toward. It is the `ON_DEMAND` tier, and the prompt pair isolates the tier from the intent: an ON_DEMAND term is the only difference between the two runs.

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

for label, prompt in (
    ('ON_DEMAND', 'Run a comprehensive security review with all checks and list findings.'),
    ('CONDITIONAL', 'Run a security review of this change.'),
):
    route = ns['route_review_resources'](Task(prompt))
    print(label, 'count=', len(route['resources']))
    for path in route['resources']:
        print(' ', path)
PY
```

Step 2 confirms that the depth alias has no config tier to resolve through. The quality config schema is the only config layer the mode reads, and it carries no depth key.

```bash
rg -n "reviewDepth|review_depth|SK_CODE_REVIEW_DEPTH" .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/shared || echo "no config key"
```

Steps 3 to 5 run the three depth reviews. Each export is its own step, and the dispatch that follows runs in that exported shell.

Step 3:

```bash
export SK_CODE_REVIEW_DEPTH=ultra
```

```text
agent: @review the diff
```

Step 4 sets `lite` with no M-2 threshold. M-2 is opt-in, so the alias names a skip that the gate will not perform.

```bash
export SK_CODE_REVIEW_DEPTH=lite
unset SK_CODE_REVIEW_MIN_CHANGED_LINES
```

```text
agent: @review the diff
```

Step 5 keeps `lite` and enables M-2, then reviews a diff that touches auth or config. The sensitive-path rule applies before the line count.

```bash
export SK_CODE_REVIEW_DEPTH=lite
export SK_CODE_REVIEW_MIN_CHANGED_LINES=50
```

```text
agent: @review a sensitive-path (auth or config) diff
```

### Expected

Step 1 prints the two counts and the two path lists. The ON_DEMAND tier adds five paths beyond the baseline, and those five are what `ultra` biases intent selection toward:

```text
ON_DEMAND count= 10
  references/review-core.md
  references/review-ux-single-pass.md
  assets/security-checklist.md
  assets/code-quality-checklist.md
  assets/fix-completeness-checklist.md
  assets/solid-checklist.md
  assets/removal-plan.md
  assets/test-quality-checklist.md
  references/pr-state-dedup.md
  references/quick-reference.md
CONDITIONAL count= 5
  references/review-core.md
  references/review-ux-single-pass.md
  assets/security-checklist.md
  assets/code-quality-checklist.md
  assets/fix-completeness-checklist.md
```

Step 2 prints no hit from either folder and the fallback line, which is the evidence that no config tier exists:

```text
no config key
```

Step 3 produces a transcript whose loaded references include the deep-dive set, so the `ultra` session behaves like a request that carried `comprehensive` and `all checks`.

Step 4 produces a full review. `lite` maps onto M-2, and M-2 has zero effect without `SK_CODE_REVIEW_MIN_CHANGED_LINES`, so the transcript carries findings and a normal status line rather than a skip line.

Step 5 produces a full review as well, because a sensitive path is never skipped regardless of line count or depth alias.

| Signal | Expected value |
| --- | --- |
| Step 1 ON_DEMAND count | `10` |
| Step 1 CONDITIONAL count | `5` |
| Step 2 depth key in quality or shared config | none |
| Step 3 `ultra` loaded references | the deep-dive set, the same ten paths step 1 printed |
| Step 4 `lite` without the M-2 threshold | a full review with findings, no skip line |
| Step 5 `lite` on a sensitive-path diff with the threshold set | a full review with findings, no skip line |
| Floor outcome | no depth value drops a security or correctness minimum |

### Evidence

The two router transcripts from step 1, the step 2 grep, and the three review transcripts with their loaded-reference lists, findings and final status lines.

### Pass / Fail

- **Pass**: step 1 prints ten paths for the ON_DEMAND prompt and five for the plain one, step 2 prints no config key, the `ultra` transcript carries the deep-dive references, both `lite` runs return a full review, and no transcript drops a baseline minimum.
- **Fail**: a config key is read as a resolution tier, `lite` suppresses a review without the M-2 threshold, `lite` skips a sensitive-path diff, or any depth value relaxes the security/correctness floor.

### Failure Triage

1. Confirm each export preceded its dispatch in the same shell. A depth exported in a different shell than the one that dispatches the review has no effect, and the run then looks like the default.
2. Check the M-2 threshold state before reading a `lite` result. With the threshold set to `0` or unset, M-2 is inert and a full review is the correct outcome; a skip there is the defect.
3. Check the sensitive-path classification before calling a skip a defect. A path that matches none of the six never-skip classes in `SKILL.md` §9.2 may legitimately be skipped once the threshold is enabled.
4. If a config key turns up in step 2, the resolution order is wrong in the code, not only in this document: `SKILL.md` §9.3 states env over default and names no third tier.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Section 9.3 `SK_CODE_REVIEW_DEPTH`, section 9.2 `SK_CODE_REVIEW_MIN_CHANGED_LINES` and the never-skip classes |
| `../../ROUTER.md` | Section 3 machine router and its loading levels |
| `../../references/quick-reference.md` | The deep-dive index `ultra` biases toward |
| `../../../sk-code-quality/references/quality-config.md` | The only config layer the mode reads, which carries no depth key |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `efficiency-and-restraint/review-depth-alias.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
