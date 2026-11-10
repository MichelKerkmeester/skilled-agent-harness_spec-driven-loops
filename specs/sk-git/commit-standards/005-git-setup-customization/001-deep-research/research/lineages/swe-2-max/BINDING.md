---
title: "Detached lineage binding"
trigger_phrases: []
---
# Detached lineage binding

- artifact_dir: `specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/swe-2-max`
- resolveArtifactRoot: skipped; bound directly from `config.fanout_lineage_artifact_dir`
- session_id: `fanout-swe-2-max-1792042581294-btcd4b`
- executor: `cli-devin`, model `swe-2-max`
- stop policy: `max-iterations` (5)
- boundary: no writes outside this directory; no spec, continuity, memory, git, parent, or shared telemetry writes
- executor model: THIS process is the executor for every iteration; per-iteration executor-dispatch steps in the workflow YAML are satisfied inline, no nested CLI/agent dispatch
