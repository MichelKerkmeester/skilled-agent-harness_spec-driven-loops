# Focus

Iteration 1 confirmed the live OpenCode command filename and built the first candidate list for documentation surfaces that still mention the `/goal` plugin after phases 010-014 and the `goal_opencode.md` filename correction.

# Actions Taken

1. Read the active strategy and state log before research actions. The strategy's next focus explicitly requested a direct command filename check and repo grep sweep for goal-plugin terms [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-strategy.md:137-140`].
2. Checked the command surface with `Glob .opencode/commands/goal*.md`; the only match was `.opencode/commands/goal_opencode.md`.
3. Ran a broad grep sweep for `mk-goal`, `mk_goal`, `/goal `, `goal_opencode`, `recordProviderUsageLimit`, `archiveGoalStateFile`, `pruneArchive`, `sweepOrphanedActiveStates`, `usage_limited`, cleanup wording, `store_health`, and the three new `MK_GOAL_STATE_*` variables.
4. Re-ran a narrowed documentation sweep after the first broad pass overmatched generated state/log files and the generic word `mutation`.
5. Read the newly surfaced README/ENV_REFERENCE candidates plus source anchors in `.opencode/plugins/mk-goal.js`.

# Findings

## F-ITER001-001 - P1 - ENV_REFERENCE misses all three new mk-goal cleanup env vars

`ENV_REFERENCE.md` has no entries for `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, or `MK_GOAL_STATE_SWEEP_INTERVAL_MS`; the only matches from a targeted grep were unrelated `mutation` rows [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:402`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:434`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:689`]. The live plugin defines those exact env names [SOURCE: `.opencode/plugins/mk-goal.js:40`, `.opencode/plugins/mk-goal.js:41`, `.opencode/plugins/mk-goal.js:42`].

Impact: operators reading the central environment reference cannot discover the new archive retention, active-state retention, or sweep interval controls added by cleanup/archive work.

## F-ITER001-002 - P2 - .opencode/plugins/README.md omits the mk-goal cleanup/config contract

`.opencode/plugins/README.md` lists `mk-goal.js` as owning per-session state, lifecycle usage accounting, and default-off autonomous continuation [SOURCE: `.opencode/plugins/README.md:49`], then says the plugin folder's configuration section covers plugin-specific env vars [SOURCE: `.opencode/plugins/README.md:68-75`]. That section documents `mk-skill-advisor` and `mk-code-graph` only, with no `mk-goal` configuration table [SOURCE: `.opencode/plugins/README.md:77-115`]. The live source now exposes cleanup/archive functions and env controls [SOURCE: `.opencode/plugins/mk-goal.js:40-42`, `.opencode/plugins/mk-goal.js:825`, `.opencode/plugins/mk-goal.js:847`, `.opencode/plugins/mk-goal.js:874`].

Impact: the plugin README points readers to a plugin contract but does not document the new goal-state archive/sweep behavior or retention knobs.

## Candidate list excluding already-updated docs

The narrowed docs sweep surfaced these non-excluded files for later inspection:

- `README.md` [SOURCE: `README.md:1230-1233`]
- `.opencode/plugins/README.md` [SOURCE: `.opencode/plugins/README.md:42-50`, `.opencode/plugins/README.md:68-75`]
- `.opencode/skills/system-skill-advisor/README.md` [SOURCE: `.opencode/skills/system-skill-advisor/README.md:42`, `.opencode/skills/system-skill-advisor/README.md:85`]
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` from the narrowed file list
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:700-772`]
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` from the narrowed file list
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md` from the narrowed file list
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/cross-runtime-fallback.md` from the narrowed file list

The sweep also found many `.opencode/specs/deep-loops/032-goal-opencode-plugin/**` phase/review/archive files. Those are important historical traceability surfaces, but they are not the related-skill/README surfaces targeted first by this iteration.

# Questions Answered

- `.opencode/commands/goal_opencode.md` is still the live command filename. Direct glob returned only that file for `.opencode/commands/goal*.md`.
- `ENV_REFERENCE.md` is not complete for the three new mk-goal cleanup env vars.
- There is a current README-level staleness gap in `.opencode/plugins/README.md` around mk-goal cleanup/config behavior.
- This iteration did not find a current related-skill README that still says `usage_limited` is unimplemented/dead or that goal-state never gets cleaned up. The search needs a dedicated next pass over related SKILL.md/references/assets and README candidates before closing those questions.

# Questions Remaining

- Do `system-skill-advisor/README.md`, its top-level manual testing playbook, `system-spec-kit/ARCHITECTURE.md`, `plugin_bridges/README.md`, or `cross-runtime-fallback.md` contain stale `/goal` plugin behavior beyond the candidate lines found here?
- Do other skills' `SKILL.md`, `references/`, or `assets/` mention `/goal`, `mk_goal`, or `mk-goal.js` in passing outside the already-updated docs list?
- Are there non-historical `goal.md` or `opencode_goal.md` references in active skill docs that should now be `goal_opencode.md`?
- Are the already-updated docs still internally accurate against the current `mk-goal.js` source after the latest filename and cleanup changes?

# Next Focus

Iteration 2 should inspect the remaining non-excluded candidate docs directly: `README.md`, `.opencode/plugins/README.md`, `.opencode/skills/system-skill-advisor/README.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/cross-runtime-fallback.md`, and `ENV_REFERENCE.md`. Confirm whether each is stale, merely high-level, or historical-only.
