---
title: "Metrics: fable-5 behavioral efficiency reader"
description: "Runtime-agnostic reader for deep-loop behavioral signals (opener rate, unsolicited caveats, evidence-backed completion claims) and its stored baseline."
---

# Metrics

---

## 1. OVERVIEW

`scripts/metrics/` reads deep-loop state (the per-lineage opencode JSON event stream and iteration markdown) to score fable-5 behavioral efficiency. It exists because the only prior behavioral metric only reads Claude Code project logs, so it could not see OpenCode or Codex runs. It is read-only by default. It writes only when `--baseline` is passed and even then only to the named snapshot file.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `fable-metrics.cjs` | Parses tool-use and assistant-text messages from a lineage's JSON stream or iteration markdown, then scores median words per message, self-opener rate, unsolicited-caveat rate and evidence-backed completion ratio. Exports `discoverLineages`, `measureLineage` and `aggregate`. |
| `fable-baseline.json` | A stored snapshot of prior lineage measurements (labels, sample sizes and the same metric fields `fable-metrics.cjs` computes), written by a prior `--baseline` run. |

## 3. CONSUMERS

- `.opencode/commands/doctor/scripts/fable-mode-check.cjs` requires `fable-metrics.cjs` directly for `/doctor` fable-mode reporting.
- `.opencode/commands/doctor/assets/doctor-fable-mode.yaml` documents the fable-mode doctor route.

## 4. RELATED

- [`fable-mode-check.cjs`](../../../../commands/doctor/scripts/fable-mode-check.cjs): the `/doctor` entrypoint that calls this module.
