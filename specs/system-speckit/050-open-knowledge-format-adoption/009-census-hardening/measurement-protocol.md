---
title: "Measurement Protocol: census hardening"
description: "Sample sizes, seed, ground-truth rules and pass thresholds for measuring the citation census, fixed before any sample was drawn."
trigger_phrases:
  - "census measurement protocol"
  - "citation accuracy protocol"
  - "census timing protocol"
importance_tier: "normal"
contextType: "planning"
---
# Measurement Protocol: census hardening

Fixed at 2026-10-04T12:22Z (file time), before any result file in `scratch/` existed. A change to anything below starts protocol version 2 and a new run.

**Disclosure.** The space-in-path bug and the census totals were seen before this protocol was written. No sample had been drawn, so no accuracy figure was known when the thresholds were set.

**Seed:** 20261004. **Version:** 1. **Corpus:** `--corpus all`.

## 1. Space-in-path fix

**Positive case.** A citation `REPO RULES.md:88` resolves to the tracked file `REPO RULES.md`.

**Negative case.** A citation in prose such as `see the RULES.md:3` stays unresolved when `the RULES.md` is not a tracked file.

**Rule.** A path with spaces resolves only when the whole path is a tracked file. The census delta for the fix is reported line by line.

## 2. Samples

Drawn after the space fix, from one census run, with the seed above.

| Class | Census statuses | Sample size |
|---|---|---|
| Moved | `moved_in_range`, `moved_past_end` | 100 |
| Gone | `unresolved`, `missing` | 100 |
| Past end | `past_end` | 100 |
| Guessed | `basename_only` 50, `ambiguous` 50 | 100 |

A class smaller than its size is checked whole.

## 3. Ground truth per class

- **Moved** is right when git's rename history links the cited path to the new path, the new path is tracked, and the in-range or past-end part matches the new file's line count.
- **Past end** is right when the cited file is tracked at that path and has fewer lines than the cited line.
- **Gone** is right when no tracked file exists at the cited path or any path the resolver tries. Each gone row also gets a cause: deleted (git history shows the path existed), ignored (the path is under a gitignored folder), never existed, or parser miss (a tracked file exists once spaces are kept). A parser miss counts as wrong.
- **Guessed** has no factual answer. Two labelers from different model families, Luna 6 max fast through cli-codex and DeepSeek V4.1 Flash max through cli-opencode, each see the citing line with two lines either side and the candidate paths. Each answers intended, not intended or can't tell. Their agreement is Cohen's kappa over the three answers.

## 4. Operator labels

The operator labels the 20 guessed rows the two labelers dispute most: first rows where one says intended and the other not intended, then rows with one can't tell. With fewer than 20 disputed rows, all of them go to the operator. If kappa falls below 0.6, the cap rises to 40.

## 5. Thresholds

Accuracy is the share of sampled rows that are right, with a Wilson 95% interval.

- Moved: at least 95%.
- Past end: at least 95%.
- Gone: at least 90%.
- Guessed: reported, no threshold, because the census already marks it uncertain.

The gone class is also split by cause over the whole class, using the same factual rules on every gone row.

## 6. Timing and rebuild

**Timing.** The median wall time of three full runs at one commit, before and after replacing per-doc `git show` with one batched read. Target: the after median is at most half the before median. The two outputs must be byte-identical apart from the space-fix delta.

**Rebuild.** The rebuild flag, run at the table's recorded commit, produces a `cite-drift-redirects.json` with the same sha256 as the committed table.

**Guard.** The default run still makes no model call and writes no file, checked by comparing `git status --porcelain --untracked-files=all` before and after.
