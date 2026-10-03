# Injection screen

The offline measurement of whether a classifier spots text that tries to give an AI agent orders, with its two label files and its tests.

## 1. OVERVIEW

`score-injection-screen.mjs` measures whether `noul` spots text written to direct an AI agent, against flag-nothing and a lexical screen. It scores public vendored Markdown sections with operator-planted sentences and reports the corpus snapshot and scoring inputs.

The default run makes no model call and writes no file. The script holds and reads no credential.

---

## 2. DIRECTORY TREE

```text
injection-screen/
+-- score-injection-screen.mjs    # Scoring CLI
+-- labels.jsonl                  # 90 rows for labeling
+-- planted.jsonl                 # 30 planted slots
+-- tests/
|   `-- score-injection-screen.test.mjs
`-- README.md
```

---

## 3. KEY FILES

| File | Role |
|---|---|
| `score-injection-screen.mjs` | Measures the `noul` classifier against flag-nothing and a fixed lexical screen. The default run makes no model call and writes no file. |
| `labels.jsonl` | 90 rows: 60 natural sections (`NATURAL_ROWS`) and 30 planted rows (`PLANTED_ROWS`). The operator labels each natural section `clean` or `instructs`. |
| `planted.jsonl` | 30 slots, `p01` to `p30`, each with `"sentence": null` until the operator writes a planted sentence. |
| `tests/score-injection-screen.test.mjs` | Runs with `node --test` against fixture repositories in the OS temp directory and a stub `jev` binary. No test reaches a real backend. |

---

## 4. ENTRYPOINTS

```bash
node score-injection-screen.mjs [--jev] [--reworded-arm] [--out <dir>]
node score-injection-screen.mjs --draw --seed <n>

# Exit codes
# 0 = report printed (a skipped or stopped arm included) or rows drawn
# 2 = bad invocation or unreadable input, refused before any call
```

`--labels <file>` and `--planted <file>` replace the two files beside the script.

`--jev` runs the hosted Jev arm only after `jev --version` and `jev auth status --provider <p>` pass. Each row gets two calls with the primary question. A third call verifies a disagreement, and a differently worded review question runs only when the primary mean falls between the 0.25 review line and the 0.60 flag line. The arm prints one line of the form `verdict jev: keep|kill|stop (...) K= M= ...`.

The primary question is the original wording that measured best. `--reworded-arm` adds a second opt-in pass that asks the reworded question under the same two-call protocol and prints its own `verdict jev-reworded:` column; the reworded column never changes the primary `jev` verdict.

---

## 5. LABEL GATE

The gate reads `labels.jsonl` before any model call. Each natural section needs the operator label `clean` or `instructs`. Every row records its source commit and section hash. Scoring refuses rows that mix commits, point to an unavailable commit or no longer match their section hash. Below 90 labeled rows the script prints `stop: fewer than 90 labeled rows` (`GATE_STOP_LINE`) and makes no model call.

---

## 6. REPORT

`report.json` records the current run commit and the scored corpus commit with a SHA-256 snapshot digest. It also carries SHA-256 hashes of `labels.jsonl` and `planted.jsonl`, the primary, reworded and review question hashes, both comparator Brier scores and the selected comparator score. When `--reworded-arm` runs, the report adds a `jev-reworded` column beside the primary `jev` column. The Jev column reports natural and planted recall separately, close label calls and the hybrid floor that preserves lexical matches.

The lexical screen includes agent-directed phrases, reporting redirection and the existing instruction patterns. The hybrid floor combines those lexical matches with the primary Jev flag. The keep-rule calculation still compares the primary Jev result with the selected baseline.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
```

The tests run against fixture repositories in the OS temp directory and a stub `jev` binary. No test reaches a real backend. A passing run reports:

```text
ℹ tests 48
ℹ pass 48
ℹ fail 0
```

---

## 8. RELATED

- [`../README.md`](../README.md): the cli-classifier benchmark folder.
- [`../../feature-catalog/measurements/injection-screen-measurement.md`](../../feature-catalog/measurements/injection-screen-measurement.md): the feature catalog measurement.
- [`../../manual-testing-playbook/measurements/injection-screen-measurement.md`](../../manual-testing-playbook/measurements/injection-screen-measurement.md): the manual testing playbook measurement.
