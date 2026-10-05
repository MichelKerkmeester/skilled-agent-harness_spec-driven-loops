---
title: "Measurement Protocol: contextType hardening"
description: "Sets, sizes, seed and pass thresholds for measuring the shared contextType and importance_tier list and its two warnings, fixed before any data was drawn."
trigger_phrases:
  - "context type measurement protocol"
  - "planted matrix protocol"
  - "off-list rate protocol"
importance_tier: "normal"
contextType: "planning"
---
# Measurement Protocol: contextType hardening

Fixed at 2026-10-04T12:22Z (file time), before any result file in `scratch/` existed. A change to anything below starts protocol version 2 and a new run. Results from different versions are never merged.

**Seed:** 20261004. **Version:** 1.

## 1. The two warnings under test

- **W1**: the spec-kit rule `FRONTMATTER_VALUES` (`runtime/cli/rules/check-frontmatter-values.sh` with its helper).
- **W2**: sk-doc `validate_document.py`, its frontmatter value warning.

## 2. Planted matrix

**Values.** For `contextType`: the 4 canonical values, the 9 aliases, and these 10 off-list values: `architecture`, `debugging`, `audit`, `design`, `notes`, `summary`, `implementation-summary`, `config`, `testing`, `research-notes`. For `importance_tier`: the 6 canonical values, the 5 aliases, and these 10 off-list values: `high-priority`, `low`, `urgent`, `p0`, `minor`, `optional`, `core`, `key`, `primary`, `secondary`.

**Axes.** Quoting: none, double, single. Letter case: lower, Title, UPPER. Position: top-level frontmatter key, a line in the body, a key nested under `_memory:`.

**Rows.** Every value crossed with all three axes: 44 values times 27 combinations, 1,188 rows, one doc per row. The other key in each doc holds a canonical value.

**Expected.** A row should warn exactly when its value is off-list and sits at top level in the frontmatter, in any quoting or case. Every other row should not warn.

**Thresholds.** Recall and precision of 100% for each warning. Any miss is a defect that gets a source fix and a regression test.

## 3. Corpus false alarms

**Set.** Every tracked `.md` file with a frontmatter block under `specs/` (excluding `z_archive/`) and under `.skilled/skills/`.

**Threshold.** No unexplained warning. Each warning is listed with its cause, either a real off-list value or a checker defect.

## 4. Generator off-list rate

**Set.** Every file under `.skilled/commands/create/assets/`, `.skilled/commands/speckit/assets/` and `.skilled/skills/system-spec-kit/templates/` that contains a literal `contextType:` or `importance_tier:` value, found with `rg -n "(contextType|importance_tier):\s*\S"`.

**Measure.** The share of literal seeded values that are off-list. **Threshold.** 0. Each off-list seed is a defect.

## 5. Model writers

**Models.** DeepSeek V4.1 Flash max through cli-opencode, Luna 6 max fast through cli-codex, SWE 2 max through cli-devin.

**Brief.** The same text for every run: "Write the spec.md for a small spec-kit packet about the topic below. Start with a YAML frontmatter block that has title, description, trigger_phrases, importance_tier and contextType. Output only the file." The model gets no template and no value list, so this measures cold behavior.

**Topics.** 10 fixed topics, the same for each model: 1 add a retry to a flaky HTTP client, 2 rename a config key, 3 research two caching libraries, 4 document an incident review, 5 plan a database migration, 6 fix a race in a job queue, 7 write a style guide for commit messages, 8 audit unused dependencies, 9 design a feature flag service, 10 record a decision to drop a legacy API.

**Rows.** 3 models times 10 topics, 30 docs, each stored under `scratch/model-writers/<model>/<n>.md`.

**Measure.** For each model and key, the share of docs whose value is off-list, with a Wilson 95% interval. A failed or missing run counts as missing, never as clean.

**Threshold.** None. This is descriptive: it estimates how often a fresh writer would trip the warning.

## 6. Guard

After any fix, the 191-folder D1 comparison from phase 003 is rerun, and every folder must keep its rule set and result.
