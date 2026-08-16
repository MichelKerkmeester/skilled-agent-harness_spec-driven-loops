# Research provenance — F1 — Change the active AI model

This `research/` folder holds the deep-research artifacts for the **001-change-model** feature,
laid out to match the system deep-loop `/deep:research` conventions
(`research.md` + `iterations/iteration-NNN.md` + `deep-research-config.json`).

## How this research was actually run

These 5 iterations were produced by **external-CLI orchestration** (a bounded,
resumable Node orchestrator dispatching independent, cited passes), not by the
`/deep:research` state-machine runtime:

- 5 × DeepSeek v4 Flash (opencode-go gateway)

No early convergence: every planned pass ran to completion, then all passes were
synthesized into one build-ready decision (`research.md`).

## Why some canonical artifacts are absent

The `/deep:research` runtime emits execution-state files as a byproduct of its state
machine. Because this research did not run through that runtime, those files do **not**
exist and are **not fabricated** here (fabricating telemetry would be dishonest):

- `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`
- `observability-events.jsonl`, `orchestration-summary.json`
- `deltas/`, `dispatch-receipts/`, `lineages/`

The honest, verifiable record is: this file, `deep-research-config.json`, the per-pass
`iterations/iteration-NNN.md` (each headed with its source executor), and the
synthesized `research.md`.

## Relationship to the `001-research/` phase

`001-research/` remains as a lean spec-kit phase (`spec.md` + `description.json` +
`graph-metadata.json`) that documents the research phase in the packet's phase graph.
The research **content** lives here, in `research/`.
