DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 7 of 10
Questions: 0/8 answered | Last focus: Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation?
Last 2 ratios: 0.61 -> 0.52 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: mk-spec-memory MCP unavailable in this dispatch session; relying on strategy.md Known Context and the accumulated registry as the standing prior-context surface.
Next focus: ## 11. NEXT FOCUS
Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation?

Research Topic: Investigate whether related skill documentation (SKILL.md files, references/, assets/) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the /goal OpenCode plugin, following the phases 010-014 remediation completed in this session plus the goal_opencode.md filename correction.

Context: .opencode/plugins/mk-goal.js gained new functions (recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates), new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS), a new store_health status field, a mutation field on /goal set output, hardened sanitizer/redaction, and the command file is now finally named .opencode/commands/goal_opencode.md (NOT goal.md -- confirm this is still the live name at execution time).

Already-updated docs this session (do not re-flag, but DO verify they are still accurate): .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md, .opencode/skills/system-spec-kit/SKILL.md, .opencode/skills/system-spec-kit/references/config/hook_system.md, .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md + feature_catalog/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md + manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md.

Find what's still missed: (1) other skills' own SKILL.md/references/assets that mention mk-goal.js, /goal, mk_goal, or the goal plugin even in passing (e.g. cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows) and whether their mentions are still accurate; (2) any repo-level or skill-level README.md files (root README, .opencode/plugins/README.md if one exists, per-skill README.md files) that describe the goal plugin/command and might be stale on the new env vars, status fields, or command filename; (3) ENV_REFERENCE.md's completeness for the 3 new env vars; (4) any doc that still says 'usage_limited is unimplemented/dead' now that phase 013 wired it, or 'goal-state never gets cleaned up' now that phase 014 added archive/sweep.

ANTI-CONVERGENCE: target exactly 10 iterations; do not converge early unless every related-skill/README avenue is genuinely exhausted. Under convergence pressure before iteration 10, rotate to an unexamined skill directory or doc class (SKILL.md vs references/ vs assets/ vs README.md vs ENV_REFERENCE.md vs feature_catalog vs manual_testing_playbook vs constitutional) instead of stopping.
Iteration: 7 of 10
Focus Area: ## 11. NEXT FOCUS
Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation?
Remaining Key Questions: - [ ] Is `.opencode/commands/goal_opencode.md` still the live command filename (not `goal.md`), and does anything reference the old/wrong name?
- [ ] Do other skills' own SKILL.md/references/assets (cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows, etc.) mention mk-goal.js/`/goal`/mk_goal, and are those mentions still accurate post-remediation?
- [ ] Do any repo-level or skill-level README.md files describe the goal plugin/command, and are they stale on new env vars, `store_health` status field, `mutation` field, or command filename?
- [ ] Is ENV_REFERENCE.md complete for the 3 new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS)?
- [ ] Does any doc still claim `usage_limited` is unimplemented/dead now that phase 013 wired `recordProviderUsageLimit`?
- [ ] Does any doc still claim goal-state never gets cleaned up now that phase 014 added `archiveGoalStateFile`/`pruneArchive`/`sweepOrphanedActiveStates`?
- [ ] Are the already-updated docs (goal_plugin.md, system-spec-kit SKILL.md, hook_system.md, feature_catalog entries, manual_testing_playbook entries, goal-prompting-runtime-specific.md) still internally accurate after cross-checking against the current mk-goal.js source?
- [ ] Are there any stale references to old function names, old status fields, or old behaviors anywhere else in the repo (grep sweep for mk-goal.js, mk_goal, goal_opencode, recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates)?
Carried-Forward Open Questions:
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Do repo-level or skill-level `README.md` files describe the goal plugin/command and miss the new env vars, `store_health`, `mutation`, or filename? (iteration 3)
- Is `ENV_REFERENCE.md` complete for the three cleanup/archive env vars? (iteration 3)
- Does any doc still claim `usage_limited` is unimplemented/dead or that goal-state never gets cleaned up? (iteration 3)
- Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation? (iteration 3)
Last 3 Iterations Summary: run 4: Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? (0.54) | run 5: Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? (0.61) | run 6: Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? (0.52)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-config.json
- State Log: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deltas/iter-007.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-007.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deltas/iter-007.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).

## GRAPH EVENTS VOCABULARY (REQUIRED IF EMITTING graphEvents)

If you include `graphEvents`, every node MUST have a `kind` field from this closed set: `QUESTION`, `FINDING`, `CLAIM`, `SOURCE`. Every edge `relation` MUST be one of: `ANSWERS`, `SUPPORTS`, `CONTRADICTS`, `SUPERSEDES`, `DERIVED_FROM`, `COVERS`, `CITES`. Any other kind/relation value is silently rejected by the coverage-graph upsert. It is fine to omit graphEvents entirely if no clean mapping exists this iteration.

## SCOPE REMINDER

This is iteration 7 of 10 of a DOCUMENTATION-STALENESS AUDIT ONLY (read-mostly; no implementation changes).

BANNED OPERATIONS:
- Do NOT edit, delete, move, or rename any file under .opencode/plugins/, .opencode/commands/, .opencode/agents/, or any application/source code anywhere in the repo.
- Do NOT run destructive shell commands (rm, mv, git reset/checkout/clean, git commit, git push).
- Do NOT edit any SKILL.md, references/, assets/, README.md, or other documentation file directly -- this iteration REPORTS staleness findings as text inside the iteration narrative; it does NOT fix them.
- Do NOT dispatch sub-agents or nested opencode/claude CLI calls.

ALLOWED WRITE PATHS (the only files you may create or modify this iteration):
- .opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-007.md (create)
- .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl (append-only, one JSON line)
- .opencode/specs/deep-loops/032-goal-opencode-plugin/research/deltas/iter-007.jsonl (create)

ANTI-CONVERGENCE: target exactly 10 iterations (minIterations=10); if this topic feels covered, rotate to an unexamined doc class (a skill directory not yet grepped, README.md files, ENV_REFERENCE.md, feature_catalog, manual_testing_playbook, constitutional/) rather than declaring low novelty.
