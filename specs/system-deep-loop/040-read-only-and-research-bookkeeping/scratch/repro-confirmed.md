# Reproduction: confirmed findings re-checked

- Key questions: `003-update/research/deep-research-strategy.md` has five `- [ ]` boxes; the delta iteration records carry no `answeredQuestions` field (keys: type, iteration, runId, sessionId, lineageId, mode, target_agent, agent_definition_loaded, resolved_route, newInfoRatio, status, focus, graphEvents), and the reducer resolves a question only from `answeredQuestions` or an exact focus match.
- Resource map: delta rows carry no `file`, `path`, `source_path(s)`, `citations` or `sources` field (row types: iteration, node, edge, finding, observation, ruled_out), and the extractor reads only those fields, so `resource-map.md` reports 0 references.
- Staging: `step_stage_artifact_dir` runs `git add {state_paths.packet_dir}` (confirm: `{state_paths.artifact_dir}`) before `step_release_lock`, so the lock file, pause and run-now sentinels and `.legacy-projection-watermarks/` are staged with everything else.

Verdict: all hold.
