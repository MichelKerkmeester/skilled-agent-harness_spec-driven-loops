---
title: "Optimizer Scripts: Deep Loop Replay Tuning"
description: "Offline optimizer scripts for replaying deep-loop corpora and producing advisory tuning reports."
trigger_phrases:
  - "offline optimizer"
  - "deep loop replay"
  - "optimizer manifest"
---

# Optimizer Scripts: Deep Loop Replay Tuning

---

## 1. OVERVIEW

`scripts/optimizer/` contains the offline loop optimizer for deep research and deep review replay data. It builds replay corpora from recorded JSONL traces, replays them deterministically under candidate configs, scores each run against a quality rubric, searches a manifest-bounded config space and produces advisory promotion reports.

Current state:

- The manifest declares which config fields are tunable and which are locked runtime contracts.
- Corpus building reads only approved corpus roots and validates every entry against a fixed schema.
- Replay is deterministic: the same corpus entry plus the same config always produces the same result.
- Search samples manifest-bounded candidates with a seeded RNG and records every candidate in an audit trail.
- Promotion is advisory-only and never mutates production config. Production promotion stays blocked until replay fixtures and behavioral suites exist.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            optimizer                              │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐     ┌──────────────────────┐
│ JSONL loop traces│ ──▶ │ replay-corpus.cjs    │
│ approved roots   │     │ buildCorpus()        │
└──────────────────┘     └──────────┬───────────┘
                                    │ corpus entries
                                    ▼
┌──────────────────┐     ┌──────────────────────┐     ┌────────────────┐
│ search.cjs       │ ──▶ │ replay-runner.cjs    │ ──▶ │ rubric.cjs     │
│ randomSearch()   │     │ replayRun()          │     │ scoreRun()     │
└──────────┬───────┘     └──────────────────────┘     └────────────────┘
           │ best candidate + audit trail
           ▼
┌──────────────────────┐     ┌──────────────────────────┐
│ promote.cjs          │ ──▶ │ audit/promotion-reports/ │
│ evaluateCandidate()  │     │ advisory JSON reports    │
└──────────────────────┘     └──────────────────────────┘

Bounds source: optimizer-manifest.json (tunable + locked fields, governance)
```

---

## 3. DIRECTORY TREE

```text
optimizer/
+-- optimizer-manifest.json  # Tunable fields, locked contract fields and governance policy
+-- replay-corpus.cjs        # Corpus extraction, JSONL parsing and schema checks
+-- replay-runner.cjs        # Deterministic replay execution and convergence evaluation
+-- rubric.cjs               # Per-dimension scoring and weighted composite
+-- search.cjs               # Seeded random search over manifest-bounded config space
+-- promote.cjs              # Advisory promotion gate and report writer
+-- audit/promotion-reports/ # Advisory promotion report output (canonical sink)
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `optimizer-manifest.json` | Declares tunable thresholds with ranges, locked runtime contract fields, deferred prompt-pack entrypoints and the advisory-only governance policy. |
| `replay-corpus.cjs` | Parses JSONL traces, validates entries against `REQUIRED_ENTRY_FIELDS`, extracts graph/wave metrics, and resolves paths under approved corpus roots only. |
| `replay-runner.cjs` | Replays a corpus entry under a config, evaluating convergence and stuck recovery deterministically, and applies a graph-metric bonus when present. |
| `rubric.cjs` | Scores convergence efficiency, recovery success rate, finding accuracy and synthesis quality, then normalizes a weighted composite over available dimensions. |
| `search.cjs` | Derives the search space from the manifest, samples candidates with a seeded mulberry32 RNG, scores them against the corpus and records an audit trail. |
| `promote.cjs` | Checks manifest boundaries and prerequisites, compares candidate scores to baseline, and writes advisory reports into the canonical audit directory only. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Manifest | `optimizer-manifest.json` is the single source of truth for tunable fields, locked contracts and governance. |
| Search space | Candidates must stay inside manifest-declared ranges; locked or undeclared fields are rejected. |
| Determinism | Replay output depends only on the corpus entry and config; timestamps are injectable for reproducible runs. |
| Corpus paths | Corpus inputs must resolve under approved roots and must not traverse symlinks. |
| Promotion | Output is advisory-only and written under `audit/promotion-reports/`; no automatic production config changes. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ recorded deep-loop JSONL traces          │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ buildCorpus (parse + validate entries)   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ randomSearch (sample manifest-bounded)   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ replayRun + scoreRun (deterministic)     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ evaluateCandidate (boundary + baseline)  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ advisory promotion report (human review) │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `buildCorpus` | Function (`replay-corpus.cjs`) | Build and validate a replay corpus from a packet family's JSONL data. |
| `validateCorpusEntry` | Function (`replay-corpus.cjs`) | Check a single corpus entry against the required schema. |
| `replayRun` | Function (`replay-runner.cjs`) | Replay one corpus entry under a config and return deterministic results. |
| `compareResults` | Function (`replay-runner.cjs`) | Compare baseline and candidate replay results for improvements and regressions. |
| `defineRubric` | Function (`rubric.cjs`) | Build a rubric with optional dimension weight overrides. |
| `scoreRun` | Function (`rubric.cjs`) | Score a replay run into per-dimension breakdown plus a weighted composite. |
| `randomSearch` | Function (`search.cjs`) | Search the manifest-bounded config space and record an audit trail. |
| `evaluateCandidate` | Function (`promote.cjs`) | Evaluate a candidate against baseline with manifest and prerequisite checks. |
| `generatePromotionReport` | Function (`promote.cjs`) | Produce an advisory-only promotion report for human review. |
| `savePromotionReport` | Function (`promote.cjs`) | Persist a report under the canonical audit directory. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/scripts/optimizer/README.md
```

Expected result: the README validator exits with code `0`.

---

## 8. RELATED

- [`scripts/`](../README.md)
- [`optimizer-manifest.json`](./optimizer-manifest.json)
- [`replay-corpus.cjs`](./replay-corpus.cjs)
- [`replay-runner.cjs`](./replay-runner.cjs)
- [`rubric.cjs`](./rubric.cjs)
- [`search.cjs`](./search.cjs)
- [`promote.cjs`](./promote.cjs)
