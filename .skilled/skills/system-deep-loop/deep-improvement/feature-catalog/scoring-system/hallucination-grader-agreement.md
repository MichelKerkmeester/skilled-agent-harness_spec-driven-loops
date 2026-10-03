---
title: "Hallucination grader agreement"
description: "Measures offline how well the deterministic hallucination check and a Jev grader agree with operator labels on benchmark outputs."
trigger_phrases:
  - "hallucination grader agreement"
  - "score-d4-agreement.cjs"
  - "measure d4 grader against labels"
  - "offline hallucination grader test"
version: 1.18.0.0
---

# Hallucination grader agreement (score-d4-agreement.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline how well the deterministic hallucination check and a Jev grader agree with operator labels on benchmark outputs.

The 5-dimension scorer takes D4, the hallucination dimension, from its grader, and the runner's default `noop` grader returns a fixed 1.0. This script tests whether any grader earns that slot before one is wired in. It never changes a benchmark score, and by default it makes no model call and writes no file.

---

## 2. HOW IT WORKS

### Census and Baseline

`score-d4-agreement.cjs --outputs <dir>` lists the `<id>.md` and `<id>.run<k>.md` outputs of a benchmark run and matches each to the fixture whose `id` is `<id>`, in `assets/model-benchmark/benchmark-fixtures/` unless `--fixtures <dir>` names another set. `--labels <file>` reads one JSON line per output, `{"output": "<file name>", "hallucinated": "yes"}` or `"no"`, which only the operator writes. The script prints the output, matched, unmatched and allowlist counts and the labeled count by class.

It then runs the unchanged `deterministic/hallucination-flag.cjs` on each labeled output against its fixture's `allowlist`, counting a score below 1.0 as `yes`. The baseline is that check or the majority class, whichever is right more often.

### Label Gate and Keep Rule

The script prints the question every grader answers, the 0.10 margin, the keep rule and the power note, so a verdict can be rechecked by hand. Below 30 labeled outputs, or below 5 in either class, it prints a `stop:` line and asks no grader a question. When the baseline is already right on more than 90 percent of the labels it prints `no headroom`. Otherwise it prints the planned calls for the Jev arm.

### Jev Arm

`--jev` checks the Jev client's version and credential, then asks each question three times so unstable answers count as flips. It sends the outputs and the fixture task text off the machine, so an untracked output also needs `--accept-payload`.

`--jev` needs `--out <dir>`. It prints the planned calls before the first one, records every call in `calls.jsonl` and writes `report.json`. A failed check or a closed label gate prints a `jev arm skipped:` line instead. A finished arm prints one `verdict jev:` line with `keep`, `kill` or `stop` and its reason. An answer that is not a number from 0 to 1 counts as unmeasured and never as a score.

`--cascade` runs the same gate and arm over the same questions, but routes only the check-flagged outputs to the Jev noul and keeps the deterministic `no` call for the rest, so a cascade arm plans fewer calls. It needs `--out <dir>` like `--jev`, records the same way, and a finished cascade arm prints a `cascade: routed <n> of <N> check-flagged outputs; model calls=<n>` line before its `verdict cascade:` line.

Every finished arm also prints one `class <arm> yes:` and one `class <arm> no:` line, where `<arm>` is `jev` or `cascade`, each carrying the per-class correct-over-total count, the rate and a 95 percent Clopper-Pearson interval.

A rerun that reads a stored `report.json` whose `labelsSha256` differs from the current label file refuses to requalify: it prints `requalify refused: labels SHA changed for <arms>` and exits 2 before it opens any arm.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Script | Runs the census, the deterministic baseline, the label gate and the opt-in Jev arm. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs` | Script | The unchanged deterministic check behind the baseline. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Vitest | Covers the census, labels, baseline, keep rule, the label gate and the Jev arm against a stub `jev` binary. |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` | Manual playbook | Checks the unknown-grader exit, the zero-call census and a stub-backend skip. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring-system/hallucination-grader-agreement.md`

Related references:
- [deterministic-scoring.md](../../feature-catalog/scoring-system/deterministic-scoring.md) - Deterministic scoring
- [opt-in-5dim-scorer.md](../../feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md) - Opt-in 5-dimension scorer
