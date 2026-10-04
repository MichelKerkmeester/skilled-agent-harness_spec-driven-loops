---
title: "Reviewer verdict fallback"
description: "Measures offline how well a Jev grader resolves the reviewer outputs the deterministic verdict pattern misses, against operator labels."
trigger_phrases:
  - "reviewer verdict fallback"
  - "score-verdict-fallback.cjs"
  - "measure reviewer verdict fallback"
  - "offline reviewer verdict fallback test"
version: 1.19.0.0
---

# Reviewer verdict fallback (score-verdict-fallback.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline how well a Jev grader resolves the reviewer outputs the deterministic verdict pattern misses, against operator labels.

The reviewer scorer takes its verdict from a one-line pattern and falls back to its `llm` grader when the pattern finds none. This script measures whether a Jev answer to one fixed question earns that fallback before one is wired in. It writes nothing outside the operator's `--out` directory, and by default it makes no model call and writes no file.

---

## 2. HOW IT WORKS

### Census and Baseline

`score-verdict-fallback.cjs --profile <path-or-id>` loads the fixture cases of one benchmark profile, `reviewer-regression.json` by default, and counts each recorded reviewer output as a hit when the deterministic verdict pattern reads a verdict from it and a miss when it does not. A case with no recorded output is counted apart and never dispatched. `--outputs <file>` adds the operator's labeled outputs, one JSON object per line with `id`, `output` and a `label` of `pass`, `fail` or `block`, and keeps only the rows the pattern misses. `--reports <dir>`, repeatable, reads each `reviewer-report.json` and counts its per-test verdict methods as `pattern`, `llm-grader` or `none`.

The baseline for the labeled misses is the stronger of two zero-call rules: the majority class of the labels, or a loose rule that reads the last whole word `pass`, `fail` or `block` anywhere in the output, case-insensitively. Every graded column is compared against that baseline on the same rows.

### Label Gate and Keep Rule

The script prints the question every grader answers, `Which verdict does this reviewer output give?`, the three answer options and their digest, the three option orders, the 0.10 margin, the keep rule and the power note, so a printed verdict can be rechecked by hand. Below 12 labeled regex-miss outputs, or with no labeled output in one of the three classes, it prints a `stop:` line and asks no grader a question. When the baseline is already right on more than 90 percent of the labeled misses it prints `no headroom`. Otherwise it prints the planned calls for the Jev arm.

### Jev Arm

`--jev` checks the Jev client's version and credential, then asks the question once per labeled miss and option order through the client. That sends the reviewer outputs off the machine, so an untracked outputs file also needs `--accept-payload`. Each labeled miss is asked in all three option orders, so unstable answers count as flips.

`--jev` needs `--out <dir>`. The arm prints its planned calls before the first one, records every call in `calls.jsonl` and writes `report.json`. A failed check or a closed label gate prints a `jev arm skipped:` line instead and makes no call. A finished arm prints one `verdict jev:` line with `keep`, `kill` or `stop` and its reason. An answer that is not one of the three keys counts as unmeasured and never as a pick.

### Real-Output Capture

`capture-reviewer-outputs.cjs`, beside the scorer, collects the reviewer outputs that real deep-review runs left in this repository, so the regex miss rate on real traffic can be counted and a later labeling pass has rows to read. It walks `specs/`, or each `--root <dir>`, for `review-report*.md` files and for the `iteration-NNN.md` files in the `iterations` folders under a `review/` folder, and leaves out prompt files, research iterations and anything under `node_modules`. A file over `--max-bytes`, 65536 by default, is counted as oversize and not read, because the review files that large are raw CLI transcripts rather than a review. Identical texts collapse to one row that counts its copies.

Each row holds `id`, `sha256`, `kind`, `source`, `copies`, `bytes`, `regexVerdict`, `regexMethod` and `output`, where `regexVerdict` is what the scorer's `extractVerdict` reads from the text, and no row carries a `label`. The rows go to `025-real-outputs.jsonl` in the operator's local labels store, or to `--out <file>`, with file mode 0600, and the run prints one line: `census: rows=<n> regex_misses=<n> regex_hits=<n> (pass <n>, fail <n>, block <n>, abstain <n>) iterations=<n> reports=<n> files=<n> duplicates=<n> oversize=<n> out=<path>`. It makes no model call and spawns no process. The file cannot feed `--outputs` until an operator adds labels, because the scorer refuses a row without one.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Script | Runs the fixture and outputs census, the two baselines, the label gate and the opt-in Jev arm. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/capture-reviewer-outputs.cjs` | Script | Collects real deep-review outputs into an unlabeled, deduplicated JSONL file with the regex verdict per row and a one-line census. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Vitest | Covers the census, the labels, the baselines, the keep rule, the label gate and the Jev arm against a stub `jev` binary. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/capture-reviewer-outputs.vitest.ts` | Vitest | Covers the path rules, the dedup and oversize counts, the unlabeled row shape, the census line, the refusals and that no stub `jev` starts. |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/` | Manual playbook | Scenario `MB-052` checks the census on the fixtures and a stub-backend skip. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `model-benchmark-mode/reviewer-verdict-fallback.md`

Related references:
- [opt-in-5dim-scorer.md](../../feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md) - Opt-in 5-dimension scorer
- [score-delta-benchmark-gates.md](../../feature-catalog/model-benchmark-mode/score-delta-benchmark-gates.md) - Score-delta benchmark gates
