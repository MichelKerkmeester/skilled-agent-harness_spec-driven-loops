---
title: "Measurement Protocol: source tag hardening"
description: "Sample sizes, seed, ground-truth rules, planted classes and pass thresholds for measuring the SOURCE_TAGS rule, fixed before any sample was drawn."
trigger_phrases:
  - "source tag measurement protocol"
  - "planted tag recall"
  - "source tag accuracy protocol"
importance_tier: "normal"
contextType: "planning"
---
# Measurement Protocol: source tag hardening

Fixed at 2026-10-04T12:22Z (file time), before any result file in `scratch/` existed. A change to anything below starts protocol version 2 and a new run.

**Disclosure.** The 20-packet warning counts per class, and a 10-row look at the gone class, were seen before this protocol was written. No accuracy sample had been drawn, so no accuracy figure was known when the thresholds were set. The past-end sample size of all rows rests on that earlier count of 44.

**Seed:** 20261004. **Version:** 1. **Packets:** the 20 listed in `../005-source-resolver/scratch/p005-packets.txt`, with `SPECKIT_SOURCE_TAG_CUTOFF=2000-01-01`.

## 1. The two fixes

- **Whole-tag paths.** Inside `[SOURCE: ...]`, a path runs from the tag start or a comma to its `:line` suffix, so `[SOURCE: REPO RULES.md:88]` cites `REPO RULES.md`.
- **Ignored folders.** A tag whose path falls under a gitignored folder gets one result whether or not the file is present: it is counted as ignored, reported in its own count, and never warns.

## 2. Accuracy sample

Drawn after both fixes from one run over the 20 packets, with the seed above.

| Class | Sample size |
|---|---|
| Moved | 50 |
| Gone | 50 |
| Past end | all, since the baseline had 44 |
| Guessed | 50 |

## 3. Ground truth per class

The same rules as the census protocol (`../009-census-hardening/measurement-protocol.md`, section 3), applied to the tag's resolved path with the packet folder as an extra base. Guessed rows are labeled by Luna 6 max fast and DeepSeek V4.1 Flash max, and the operator labels the disputed rows under the same cap.

## 4. Thresholds

Accuracy with a Wilson 95% interval: moved at least 95%, past end at least 95%, gone at least 90%. Guessed is reported without a threshold.

## 5. Planted recall

A fixture lineage holds 10 tags per class, each with a known answer:

- moved: an old path that the redirect table maps to a tracked file;
- gone: a path that never existed;
- past end: a tracked file cited past its last line;
- guessed: a basename that matches exactly one tracked file under a different folder;
- valid controls: 10 tags that resolve in range, including 5 that cite `REPO RULES.md`;
- ignored: 10 tags under a gitignored folder, 5 with the file present and 5 absent.

**Thresholds.** Recall of 100% for moved, gone, past end and guessed. No warning on any control or ignored tag.

## 6. Two checkouts

The helper runs over the 20 packets in this worktree and in the main checkout, read-only, on packet files that are byte-identical in both. Target: identical warnings. Any difference is listed with its cause, and a difference caused by anything other than the two fixes counts as a failure.

## 7. Guard

With the default cutoff, the 20 packets keep their rule sets and results. Run time per packet is the median of three runs before and after the fixes, and it may grow by at most 20%.
