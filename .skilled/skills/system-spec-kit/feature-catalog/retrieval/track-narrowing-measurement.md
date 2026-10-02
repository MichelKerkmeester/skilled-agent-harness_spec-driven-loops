---
title: "Track narrowing measurement"
description: "Measures offline whether one classifier choice that names a packet's spec track beats ripgrep and the trigger-index lookup, under a keep rule fixed before any model call."
trigger_phrases:
  - "track narrowing measurement"
  - "score-track-narrowing.mjs"
  - "spec track classifier baseline"
  - "track narrowing keep rule"
version: 2.2.0.0
---

# Track narrowing measurement (score-track-narrowing.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline whether one classifier choice that names a packet's spec track beats ripgrep and the trigger-index lookup, under a keep rule fixed before any model call.

The question behind it is whether a model could narrow a search to one track before ripgrep runs. The script answers that question without touching the live search: it changes no lookup, index, recipe or hook, and only an operator runs it.

---

## 2. HOW IT WORKS

### Test Set And Baselines

Each question is the description in a packet's own `description.json`, and its answer is the packet's track, the first folder under `specs/`. A description that is a placeholder, too short to judge or names a track or a hub is dropped, and each track keeps at most 20 rows. On those rows the script scores two baselines that make no model call and skip the question's own packet: the track of the first scoring trigger-index lookup row, and the track whose files cover the most question words under the ripgrep path-only recipe. The better of the two is the baseline a model has to beat.

### Default Run

With no switch the script makes no model call and writes no file. It prints the index's `manifestHash`, the test-set counts per track, both baselines, the keep rule, and either a `headroom:` line with the planned call count or a `no headroom:` line when the baseline is right on more than 90 percent of the rows. A last line reports the Latin paraphrase probes from `semantic-probes.json` for every method. The probes never decide a verdict.

### Model Columns

`--jev` asks one Jev provider the `choice` question over the tracks plus `none`, in three option orders for every row. The arm runs only behind its own check: the pinned Jev version and its credential status. A run with the switch needs `--out <dir>`, where it writes `calls.jsonl` with one record per call and `report.json`. The keep rule asks, in order, for coverage of nine rows in ten, a margin of one measured row in ten over the baseline, a one-sided sign test below 0.05 and at most one call in ten that differs from its row's most common pick. Each verdict line names the model it measured, and a later run into the same directory prints a requalify line when that model changed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Script | Builds the test set, scores both baselines, runs the model arms and prints each verdict |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Shared | The lookup the first baseline reads |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Shared | The path-only ripgrep recipe the second baseline runs |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` | Shared | The paraphrase probes the last line reports |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Vitest | The test-set filter, both baselines, the keep rule, and the Jev gate and arm on stub binaries |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/track-narrowing-measurement.md` | Manual playbook | Runs the zero-call default and the Jev gate skip |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/track-narrowing-measurement.md`

Related references:
- [session-recovery-spec-kit-resume.md](session-recovery-spec-kit-resume.md) - resume, which reads the same ripgrep recipes when a packet is thin
