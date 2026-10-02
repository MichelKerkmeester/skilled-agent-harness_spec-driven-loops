---
title: "Offline judge agreement"
description: "Measures offline whether a Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate."
trigger_phrases:
  - "Offline judge agreement"
  - "judge-agreement.mjs"
  - "masked reply label gate"
  - "reply judge keep rule"
version: 1.4.0.0
---

# Offline judge agreement (judge-agreement.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline whether a Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate.

The script sits beside the reply comparison scripts and changes none of them. Its verdict is evidence about one judge and feeds nothing: `score.mjs`, `compare.mjs` and the release gate never read it.

---

## 2. HOW IT WORKS

The default run takes masked directories and replies directories. It joins each masked reply to its reply file by the SHA-256 of the reply text and prints the masked, distinct, matched and unmatched counts. It runs `score.mjs` unchanged for the mechanical baseline and maps each dimension score to one of three levels: 0 is absent, 1 is fully met and anything between is partly met. A reply file that is empty or missing gets no baseline and is counted on its own line, because `score.mjs` cannot score it. Given an operator labels file, it prints the baseline's agreement with the grades overall and per dimension. Below 20 graded distinct replies it prints `stop: fewer than 20 labeled replies`, and a baseline above 90 percent agreement prints `no headroom`. This run calls no model and writes no file.

`--jev` adds one judge column and needs `--out <dir>`. The Jev arm runs after `jev --version` prints `jev 0.6.2` and `jev auth status` passes, and a masked file that git does not track also needs `--accept-payload`. It asks one `score` per reply and dimension, with the dimension's `judgeGuidance` as the question, three times per cell. A keep rule fixed before any run decides the verdict: coverage, an exact binomial kill test, a 10-point margin, a sign test over replies and a flip bound. The run writes `report.json` and one `calls.jsonl` line per call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | Script | Census, baseline, label gate, the Jev arm and its verdict. |
| `.skilled/skills/sk-communication/benchmark/reply-harness/score.mjs` | Script | Mechanical scorer spawned unchanged for the baseline. |
| `.skilled/skills/sk-communication/benchmark/reply-harness/rubric.json` | Shared | The seven dimension ids and the guidance each judge question carries. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | Node test | Covers the census join, the labels, the label gate, the Jev gate, the payload gate and each verdict on a stub binary. |

---

## 4. SOURCE METADATA

- Group: Evaluation And Observability
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-observability/offline-judge-agreement.md`

Related references:
- [blind-non-inferiority-evaluation.md](blind-non-inferiority-evaluation.md): the package's human non-inferiority gate, which this measurement never feeds
