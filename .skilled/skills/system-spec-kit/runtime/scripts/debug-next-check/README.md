---
title: "Debug Next Check: Choice Measurement"
description: "Measures whether a model picks the cheapest next check for a debug hypothesis better than the best constant answer, with zero model calls by default."
trigger_phrases:
  - "debug next check"
  - "score debug next check"
  - "next check choice scorer"
---

# Debug Next Check: Choice Measurement

---

## 1. OVERVIEW

`debug-next-check/` holds one operator-run script. `score-debug-next-check.mjs` measures offline whether a model choice of the cheapest next check for a debug hypothesis beats the best constant answer on operator-labeled rows.

Current state:

- One ESM module with a CLI entry point and exported functions the sibling test suite calls directly.
- The census prints counts, repository paths and lowercase hex digests only. Row text never reaches a line, and the report holds no fixture path and no row text.
- No model call happens unless `--jev` is passed, and the arm runs only behind its own gate.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `score-debug-next-check.mjs` | Argument parsing, the seam search, the mined corpus count, the fixture reader, the constant baselines, the label gate, the backend gate and arm, the keep rule verdict and the report. |

The module is laid out in named zones: imports, constants, git helpers, seam search, mined corpus, repository path guard, fixture reader, constant baselines, payload gate and call log, Jev gate and arm, keep rule and verdict, report, CLI, main.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Fixture | Read from `--fixture`. A path that resolves inside the repository, an unreadable file, or a row that breaks the schema refuses the whole run before any census line prints and before any call starts. |
| Fixture rows | One JSON object per line carrying `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`. `label` is one of `read_code`, `run_test`, `reproduce`, `instrument`. Any other field refuses the row. |
| Seam search | `git grep -l next_check` over tracked files, leaving out the generated retrieval fixtures, this scorer's own paths, and the tracked `specs/` documents. |
| Mined corpus | Counts tracked debug-delegation files outside the template tree and the numbered hypothesis headings under `specs/`. Zero is a result, not an error. |
| Model calls | None by default. `--jev` calls the Jev CLI behind its version and credential gate. |
| Payload | A Jev call carries rows marked `jev_ok` only. Every other row stays home and is logged as `unmeasured_withheld` without its text. |
| Writes | `calls.jsonl` and `report.json` under `--out`, and nothing else. A missing or empty `--out` keeps no log and writes no report. |
| Arm directories | `--jev` refuses to run without `--out`, so no call can start without a record of it. |
| Exit codes | `0` for a printed census or a stopped label gate, `2` for a refused command line or fixture. |

Main flow:

```text
--fixture jsonl
      │
      ▼
parseCliArgs -> readFixture            rows, digest, label counts
      │
      ▼
seamSearch -> minedCorpus              seam hits, mined corpus counts
      │
      ▼
constantAccuracies -> chooseBaseline   best constant and its right count
      │
      ▼
headroom and label gate -> keep rule line
      │
      ▼
payloadSplit -> jevGate -> runJevArm
      │
      ▼
modalPick -> summarizeColumn -> decideVerdict
      │
      ▼
column, verdict and requalify lines -> calls.jsonl, report.json
```

---

## 4. KEEP RULE

The label gate opens an arm only when the fixture holds at least 30 labeled rows and the best constant answer is right on at most nine tenths of them. Anything else prints `stop: fewer than 30 labeled rows` or `no headroom` and leaves every backend unstarted. The keep rule line prints before the first gate, so no verdict is read against a rule fixed after a call.

Every row is asked once per option order, and the option list is rotated between the orders, so a positional preference shows up as disagreeing picks. A row counts as measured only when all three orders submitted a key. A row whose orders name no majority is unstable and counts as a miss.

Each backend column reports the same counts: `K` rows in the column, `M` measured rows, `A` picks that match the label, `B` constant picks that match the label, `W` picks the column won alone, `L` picks the constant won alone, and `F` votes the modal pick lacks. The verdict takes the first failed check in this order: coverage `10*M >= 9*K`, kill when the exact one-sided loss tail sits below 0.05, margin `10*(A-B) >= M`, sign test on `W` against `W + L`, then the flip check `10*F <= 3*M`. Both tails are summed in BigInt, so no float comparison decides a verdict.

A keep holds only for the backend it was measured on. When a new column names another provider, model or commit pair than the `report.json` already in `--out`, the run prints a `requalify` line before the verdict.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node score-debug-next-check.mjs [--fixture <file>] [--jev] [--out <dir>]` | CLI | Runs the census, then the arm its switch asks for. |
| `--fixture` | CLI flag | Labels the rows the census scores. Refused when it resolves inside the repository. |
| `--jev` | CLI flag | Adds the Jev column. It needs `--out`. |
| `main(argv, deps)` | Function | Runs the census end to end and returns the exit code. Its root, writers, environment, timeout and backoff dependencies are replaceable in tests. |
| `parseCliArgs`, `isEntryPoint` | Function | Switch parsing with no positionals, and the symlink-safe entry check. |
| `seamSearch`, `minedCorpus` | Function | The caller seam hits and the corpus counts the repository itself can contribute. |
| `isInsideRepository`, `readFixture`, `sha256Hex` | Function | The device and inode containment guard, the fixture reader with its row schema, and the fixture digest. |
| `constantAccuracies`, `chooseBaseline`, `payloadSplit`, `createCallLog` | Function | The four constant accuracies, the strongest constant with a tie going to `read_code`, the payload split, and the append-only call log. |
| `which`, `jevGate`, `spawnCall`, `stateText`, `rotateOptions`, `parseChoiceAnswer`, `runJevArm` | Function | Executable discovery, the Jev version and credential gate, the bounded child process, the labeled state text, the option rotation, the answer parser, and the arm that runs one auth test then one choice call per accepted row per option order. |
| `binomialTail`, `modalPick`, `decideVerdict`, `formatP`, `summarizeColumn`, `verdictLine`, `buildReport` | Function | The exact tail, the modal pick, the verdict order, the printed probability, the column counts, the verdict line and the report body. |

An arm stops on exit 2, 3 or 130. A stop prints its line and the rows that finished, and leaves the column and the verdict unprinted. A call that hits the timeout bound is recorded as `unmeasured_timeout` and does not stop the arm. Exit 4 gets one retry after the backoff, because a dropped connection is not a judgment.

---

## 6. VALIDATION

Run from `.skilled/skills/system-spec-kit/runtime`:

```bash
npm test -- --run tests/debug-next-check.vitest.ts
```

Expected result: the suite passes. Its fixtures are synthetic and a stub `jev` binary sits first on `PATH`, so the run needs no live backend and no key.

---

## 7. RELATED

- [`Scripts`](../README.md)
- [`Runtime`](../../README.md)
- [`Compaction recall`](../compaction-recall/README.md)
- [`Debug next check tests`](../../tests/debug-next-check.vitest.ts)
