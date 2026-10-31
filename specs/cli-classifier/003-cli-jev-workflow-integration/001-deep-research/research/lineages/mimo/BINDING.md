---
title: "Detached lineage binding"
trigger_phrases: []
---
# Detached lineage binding

- artifact_dir: `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/mimo`
- resolveArtifactRoot: skipped; bound directly from `config.fanout_lineage_artifact_dir`
- session_id: `fanout-mimo-1790438758756-5mso8j`
- executor: `cli-pi`, model `mimo-v2.6-pro`, reasoning effort high
- loop type: `research`, stop policy: `max-iterations`, cap 10, convergence threshold 0.05 with `convergenceMode: off` (telemetry only)
- lens: `mimo`, UX and measurement (research-angles.md "The three lenses")
- angle per iteration: `mimo-NN` from `context/research-angles.md`; Focus Area is the angle id and title
- boundary: no writes outside this directory; no `validate.sh`, no `generate-context.js`, no test suites, no git writes, no live `jev` calls
- naming note: every `jev` claim in this lineage means the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, unless it explicitly says npm `jevctl` 0.2.3 (vendored research material at `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main`)
