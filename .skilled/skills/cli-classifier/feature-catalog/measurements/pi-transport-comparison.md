---
title: "Pi transport comparison"
description: "Compares Pi's classifier runtime against the jev CLI on the advisor's recorded choice calls, with a zero-call default and live arms behind an explicit switch."
trigger_phrases:
  - "pi transport comparison"
  - "score-pi-transport"
  - "Pi classifier transport"
  - "jev CLI comparison"
version: 1.0.0.0
---

# Pi transport comparison (score-pi-transport.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Compares Pi's classifier runtime against the jev CLI on the advisor's recorded choice calls, with a zero-call default and live arms behind an explicit switch.

The comparison answers one question before a routing change depends on it: can Pi's own classifier runtime answer the advisor's choice question as well as the jev CLI, and at what latency and cost. The default run answers nothing about quality. It prints what is installed and how large a replay would be, then stops, so the census can be read on any machine without spending anything.

---

## 2. HOW IT WORKS

### Zero-Call Default

A bare `node score-pi-transport.mjs` prints the census block and exits 0. The block names Pi's package path and version, one `pi classifier <provider>: known=<n> available=<n>` line per provider with a total line under it, the jev path, version and provider, the jev authentication state, the two llama.cpp executables, the recorded calls file with its row and call counts, and the replay size. No classifier call is made, no file is written, and a bare `--out` is refused in this mode.

### Replay And Live Arms

`--pi` arms the Pi side and `--cli` arms the CLI side. Each needs `--out <dir>`, because every call is recorded there as `calls.jsonl`, and each spends money, so both wait on the operator's yes. A bad invocation exits 2 with one stderr line and nothing on stdout, and a recorded calls file that is missing, empty or unparseable exits 1 with one `stop:` line naming the path. No live run has happened yet, so no comparison number and no verdict line exists.

The Pi arm rebuilds each row's question from the advisor's own option list, sends it to the runtime's `classify` with a fixed timeout, and records one `calls.jsonl` line per call. A row counts as measured only when every one of its three option orders returned a full probability map, so a partial or timed-out answer never enters a mean as a zero. The `--cli` arm re-asks the CLI through `jev choice` with the same option arguments. A gate that fails prints one skip line and exits 0 without writing anything.

### Bounds And Verdict

The keep rule runs three ordered checks over the run's own numbers. Coverage under 90 percent stops the comparison, agreement under 95 percent keeps the CLI, and Pi's p95 latency above 1.5 times the CLI's keeps the CLI. Only when all three bounds hold does the transport adopt. A completed run prints one `verdict pi-transport:` line and writes `report.json` beside `calls.jsonl`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Script | The census, the replay plan, both gated arms, the metrics and the verdict |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Shared | The CLI's own option arguments, rotations, top-key tie rule and probability reader |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Shared | The recorded call writer, the shared jev gate and the bounded child spawner |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | Node test | A stub `jev` first on `PATH` and an injected classifier runtime, with no socket opened |

---

## 4. SOURCE METADATA

- Group: Measurements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `measurements/pi-transport-comparison.md`

Related references:
- [feature-catalog.md](../feature-catalog.md) - The hub catalog root
- [injection-screen-measurement.md](injection-screen-measurement.md) - The sibling offline measurement in this category
