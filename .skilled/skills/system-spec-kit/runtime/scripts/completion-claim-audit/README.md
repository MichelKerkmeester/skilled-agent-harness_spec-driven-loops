---
title: "Completion claim audit"
description: "Census of the completion-claim detector over labeled turns, zero-call by default, with gated local and hosted model arms."
trigger_phrases:
  - "completion claim audit"
  - "score completion claims"
  - "completion claim detector"
---

# Completion claim audit

---

## 1. OVERVIEW

`completion-claim-audit/` holds `score-completion-claims.mjs`, the operator-run census that scores the completion-claim detector against labeled turns. The detector and its claim-word pattern come from `../../lib/hooks/completion-evidence-sentinel.cjs`, the same module the Stop hooks load, so the census cannot drift from the hook.

A default run makes no model call. It reads a JSONL rows file, runs the detector over the trailing slice of every turn, and prints its counts with the regex baseline. Only row ids, counts and SHA-256 hashes reach the output. When any other string reaches the output object, the run prints `stop: census void (free text in output)` and writes nothing.

Two model arms sit behind switch flags, and both need the label gate to reach `planned`. A gate that stops prints its own `stop:` or skip line and leaves the census as printed.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `score-completion-claims.mjs` | The census and scoring harness. The default run reads `--rows` with optional `--labels` and calls no model. `--deem` and `--jev` each add a backend column behind their own gate, `--out` records the run, and `--accept-payload` lets the Jev arm send row text. |

---

## 3. USAGE

Run from `.skilled/skills/system-spec-kit/runtime`.

```bash
node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> [--labels <file>] [--deem] [--jev] [--out <dir>] [--accept-payload]
```

| Switch | Behavior |
|---|---|
| `--rows <file>` | Required. One JSON object per line with a non-empty string `id` and a string `raw_text`. Blank lines are skipped. |
| `--labels <file>` | One JSON object per line with an `id` and a `claim` of `yes` or `no`. A label for an id outside the rows file refuses the run. |
| `--deem` | Adds the local Deem column. Needs `--out`. The health check accepts the pinned model `deem-0.8-v1` and runs before the label gate and before any call. |
| `--jev` | Adds the hosted Jev column. Needs `--out` and `--accept-payload`. The gate checks the pinned `jev 0.6.2` version and the credential. |
| `--out <dir>` | Report directory. Refused when it resolves inside the repository. It holds `report.json` for the run and `calls.jsonl`, one record per model call. |
| `--accept-payload` | Confirms the operator's row text may leave the machine. Without it the Jev arm prints `jev arm skipped: payload not accepted`. |

A default run prints the row and fire counts, one word line, the label counts, the regex accuracy with its false fires and missed claims, the margin, keep rule and power lines, and one gate line. The exit status is 0 when the census printed and 2 for a refused command line, unreadable input or a report directory inside the repository.

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-spec-kit/runtime && npm test -- --run tests/completion-claim-audit.vitest.ts
```

Expected result: the suite passes and the runner exits 0. The suite drives the script with synthetic fixtures from `tests/completion-claim-audit-fixtures/` and stub `jev` and `cli-deem` binaries first on `PATH`, so no backend is called.

---

## 5. RELATED

- [`Scripts`](../README.md)
- [`Runtime tests`](../../tests/README.md)
