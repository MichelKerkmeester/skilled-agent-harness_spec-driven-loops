# Focus

Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation?

# Actions Taken

1. Read the iteration state packet first: `deep-research-strategy.md`, `deep-research-state.jsonl`, and `deep-research-config.json`.
2. Confirmed the live command filename with command globs: `.opencode/commands/*goal*.md` resolves to `.opencode/commands/goal_opencode.md`, and `.opencode/commands/goal.md` is absent.
3. Ran a goal-specific markdown sweep across `.opencode/skills`, `.agents/skills`, and repo `README.md` files for `mk-goal.js`, `mk_goal`, `goal_opencode`, `/goal`, `goal plugin`, `usage_limited`, `goal-state`, the cleanup/archive functions, `store_health`, and `MK_GOAL_STATE_*`.
4. Re-read the relevant hits instead of relying on grep output: `system-skill-advisor/README.md`, `system-spec-kit/mcp_server/ENV_REFERENCE.md`, `system-spec-kit/mcp_server/plugin_bridges/README.md`, root `README.md`, `.opencode/plugins/README.md`, and the source-of-truth sections of `.opencode/plugins/mk-goal.js`.

# Findings

1. The live command file is still `.opencode/commands/goal_opencode.md`, and `.opencode/commands/goal.md` is absent. This keeps the old-name doc references found in earlier iterations valid as stale findings, but this iteration did not find a new current related-skill `SKILL.md` naming `.opencode/commands/goal.md`. [SOURCE: glob `.opencode/commands/*goal*.md`; SOURCE: glob `.opencode/commands/goal.md`]

2. `ENV_REFERENCE.md` remains incomplete for the three cleanup/archive env vars. The env reference lists `MK_GOAL_PLUGIN_DISABLED`, `MK_GOAL_AUTONOMY`, `MK_GOAL_DEBUG`, `MK_GOAL_MAX_OBJECTIVE_CHARS`, `MK_GOAL_MAX_GOAL_PROMPT_CHARS`, `MK_GOAL_MAX_INJECTION_CHARS`, and `MK_GOAL_MAX_EVIDENCE_CHARS`, then ends the goal-plugin section without `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, or `MK_GOAL_STATE_SWEEP_INTERVAL_MS`. The plugin source defines all three constants and uses them for archive retention, active-state retention, and sweep interval. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660] [SOURCE: .opencode/plugins/mk-goal.js:40-42] [SOURCE: .opencode/plugins/mk-goal.js:847-860] [SOURCE: .opencode/plugins/mk-goal.js:874-894]

3. `system-skill-advisor/README.md` still has stale live-tool wording. It says live OpenCode-run tool invocation is "still under investigation", while the already-updated feature catalog says a live `opencode serve` run listed `mk_goal`/`mk_goal_status` and a live model turn called `mk_goal` and persisted state. [SOURCE: .opencode/skills/system-skill-advisor/README.md:85] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:41]

4. `system-spec-kit/mcp_server/plugin_bridges/README.md` appears accurate, not stale. It explicitly says `mk-goal.js` is intentionally absent from `plugin_bridges/` because it is a standalone local OpenCode plugin, not a daemon bridge, and points to the hook reference as the operator contract. This matches the current architecture. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:31-36] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:62-69] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:85-90]

5. The source confirms `usage_limited` is now live, not dead. `recordProviderUsageLimit()` mutates a matching active goal to `status: 'usage_limited'`, sets `continuationSuppressed: true`, and records `continuationSuppressedReason: 'usage_limited'`. The current related-skill hits that mention `usage_limited` describe it as a supported status, not as unimplemented. [SOURCE: .opencode/plugins/mk-goal.js:61-68] [SOURCE: .opencode/plugins/mk-goal.js:1354-1368] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:35]

6. The source confirms new `store_health` and `mutation` output fields are live. `goalStateLines()` emits `store_health=no_active_goal` for empty state, `store_health=state_age_ms:<n>` for present state, and inserts `mutation=<created|refreshed|replaced>` on `/goal set`. Docs that claim status output shape but omit these fields are incomplete rather than necessarily contradictory. [SOURCE: .opencode/plugins/mk-goal.js:1602-1647] [SOURCE: .opencode/plugins/mk-goal.js:1668-1675]

7. The requested example skill families `cli-opencode`, `sk-code`, `sk-prompt-models`, and `deep-loop-workflows` did not yield goal-plugin-specific current references in the narrowed sweep. The broad sweep produced unrelated hits for generic words such as `goal` and `mutation`; after narrowing to plugin terms, the actual current related-skill surfaces were `system-spec-kit`, `system-skill-advisor`, and plugin bridge README files. [SOURCE: grep sweep over `.opencode/skills` and `.agents/skills` for goal-specific terms]

# Questions Answered

- Is `.opencode/commands/goal_opencode.md` still the live command filename? Yes; it is the only matching command file found, and `.opencode/commands/goal.md` is absent.
- Is `ENV_REFERENCE.md` complete for the three cleanup/archive env vars? No.
- Does any current related-skill doc still claim `usage_limited` is unimplemented/dead? No current related-skill hit found in this iteration did so; archive/spec drift may still exist separately.
- Does `plugin_bridges/README.md` incorrectly classify `mk-goal.js` as a bridge? No; it correctly states the opposite.

# Questions Remaining

- Which already-updated operator docs should explicitly mention `store_health` and `mutation` now that these fields are in live tool output?
- Should root `README.md` and `.opencode/plugins/README.md` be classified as incomplete on cleanup/archive env vars and output fields, or kept as high-level summaries that defer details to the hook reference?
- Are there stale current-doc claims outside markdown, such as command comments, generated catalogs, or JSON metadata, for old `/goal` filename or cleanup behavior?

# Next Focus

Rotate to output-shape documentation: check already-updated operator references, manual playbooks, feature catalogs, and README summaries for whether they should mention the live `store_health` and `/goal set` `mutation` fields, while continuing to separate true contradictions from acceptable high-level summaries.
