---
title: "Completion Claim Audit: Detector Scoring"
description: "Scores the completion-claim detector against operator-labeled turns, with zero model calls by default."
trigger_phrases:
  - "completion claim audit"
  - "score completion claims"
  - "completion claim detector"
---

# Completion Claim Audit: Detector Scoring

---

## 1. OVERVIEW

`completion-claim-audit/` holds one operator-run script. `score-completion-claims.mjs` scores the completion-claim detector against turns an operator has labeled `yes` or `no`, counts how the detector fires, and works out whether a model judge would beat the plain pattern by enough to be worth its cost.

Current state:

- One ESM module with a CLI entry point and exported functions the sibling test suite calls directly.
- The detector and its pattern are loaded from the completion-evidence sentinel module, never a second copy, so the census and the Stop hooks cannot drift apart.
- No model call happens unless `--jev` is passed, and the arm runs only behind its own check.
- Only ids, counts and hashes leave the run. A string the output guard cannot account for voids the run before anything prints or writes.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `score-completion-claims.mjs` | Argument parsing, row and label parsing, the census, the regex error counts, the label gate, the backend gate and arm, the output guard and the report. |

The module is laid out in named zones: imports, constants, rows, census, labels, gate, output guard, output directory, verdict, jev gate, jev arm, main.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Model calls | None by default. `--jev` runs the Jev CLI, only behind its own gate. |
| Network | The Jev arm only, and only when `--accept-payload` is passed. |
| Reads | The `--rows` and `--labels` files, and a `report.json` already present in `--out` for the commit and model comparison. |
| Writes | `calls.jsonl` and `report.json` under `--out`. A report directory that resolves inside the repository is refused. |
| Output content | Fixed labels, this run's row ids and lowercase hex digests. Any other string voids the run. |
| Exit codes | `0` for a printed or voided census, `2` for a refused command line or unreadable input. |

Main flow:

```text
--rows jsonl
      │
      ▼
parseRows -> runCensus                     row count, fire count, words, fired ids
      │
      ▼
parseLabels -> classCounts -> regexErrors  labeled rows, classes, B, false fires, missed claims
      │
      ▼
gateLine                                   stop, no headroom, or planned calls
      │
      ▼
jevGate -> runJevArm
      │
      ▼
summarizeColumn -> decideVerdict           column counts, verdict, both tails
      │
      ▼
hasFreeText guard -> stdout lines, calls.jsonl, report.json
```

---

## 4. KEEP RULE

The label gate opens an arm only when the labels hold at least 30 rows, at least 5 in each class, and enough headroom for a 10-point gain over the regex baseline. Anything else prints `stop` or `no headroom` and leaves every backend unstarted.

Each backend column reports the same counts: `K` labeled rows, `M` measured rows, `A` judge calls that match the label, `B` regex calls that match the label, `W` judge-only wins, `L` judge-only losses, and `F` rerun flips on the Jev backend alone. The verdict takes the first failed check in this order: coverage `10*M >= 9*K`, kill when the exact one-sided loss tail sits below 0.05, margin `10*(A-B) >= M`, sign test on `W` against `W + L`, then the flip check for the Jev backend. Both tails are summed in BigInt, so no float comparison decides a verdict.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node score-completion-claims.mjs --rows <file> [--labels <file>] [--jev] [--out <dir>] [--accept-payload]` | CLI | Runs the census, then the arm its switch asks for. |
| `--jev` | CLI flag | Adds the Jev column. It needs `--out` and `--accept-payload`. |
| `--labels` | CLI flag | Scores the regex against the operator's labels and opens the gate. |
| `main(argv, deps)` | Function | Runs the census end to end and returns the exit code. Its writer, environment, timeout and backoff dependencies are replaceable in tests. |
| `parseRows`, `detectTail`, `runCensus` | Function | Row parsing, the trailing slice the detector reads, and the fire counts by claim word. |
| `parseLabels`, `sha256Hex`, `classCounts`, `regexErrors` | Function | Label parsing, the label set hash, the class counts and the regex error counts by word. |
| `gateLine`, `stringLeaves`, `hasFreeText` | Function | The label gate line, the nested strings of an output object, and the free-text guard. |
| `binomialTail`, `summarizeColumn`, `decideVerdict`, `verdictLine`, `formatP`, `nearestRank` | Function | The exact tail, the column counts, the verdict, and the verdict and latency lines. |
| `which`, `jevGate`, `runJevArm`, `spawnCall`, `createCallLog`, `readStoredReport` | Function | The binary discovery, the Jev version and credential gate, the three-pass arm, the bounded child process, the call log and an earlier run's report. |

Rows report `unmeasured` wherever a backend gave no usable score, and a stopped arm prints its line with the rows that finished and no column or verdict.

---

## 6. VALIDATION

Run from `.skilled/skills/system-spec-kit/runtime`:

```bash
npm test -- --run tests/completion-claim-audit.vitest.ts
```

Expected result: the suite passes. Its fixtures are synthetic and a stub `jev` binary sits first on `PATH`, so the run needs no live backend and no key.

---

## 7. RELATED

- [`Scripts`](../README.md)
- [`Runtime`](../../README.md)
- [`Compaction recall`](../compaction-recall/README.md)
- [`Completion claim audit tests`](../../tests/completion-claim-audit.vitest.ts)
