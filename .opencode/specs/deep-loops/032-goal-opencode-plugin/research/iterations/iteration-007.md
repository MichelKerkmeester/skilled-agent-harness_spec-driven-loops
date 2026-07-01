# Iteration 007 - Related Skill and README Goal-Plugin Staleness Sweep

## Focus

Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation?

## Actions Taken

1. Read the current deep-research state log and strategy before repository research, preserving the configured focus and the iteration-7 append-only state contract.
2. Confirmed the live command-file surface with `Glob`: `.opencode/commands/*goal*.md` returns only `.opencode/commands/goal_opencode.md`; `.opencode/commands/goal.md` is absent.
3. Swept `.opencode/skills/**/*.md` and `README.md` files for `mk-goal.js`, `mk_goal`, `goal_opencode`, `goal plugin`, `usage_limited`, `store_health`, `goal-state`, `goal state`, and `/goal`.
4. Cross-checked likely stale docs against the current plugin source for the new env vars, cleanup/archive functions, `usage_limited`, `store_health`, and `mutation` output.
5. Ran a narrowed stale-claim sweep for `.opencode/commands/goal.md`, explicit `usage_limited` dead/unimplemented claims, and goal-state cleanup claims.

## Findings

### P1 - `ENV_REFERENCE.md` Still Omits the Three Cleanup/Archive Env Vars

`mk-goal.js` defines `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS` at lines 40-42. The ENV_REFERENCE goal-plugin table currently lists only `MK_GOAL_PLUGIN_DISABLED`, `MK_GOAL_AUTONOMY`, `MK_GOAL_DEBUG`, `MK_GOAL_MAX_OBJECTIVE_CHARS`, `MK_GOAL_MAX_GOAL_PROMPT_CHARS`, `MK_GOAL_MAX_INJECTION_CHARS`, and `MK_GOAL_MAX_EVIDENCE_CHARS` at lines 652-658. [SOURCE: .opencode/plugins/mk-goal.js:40] [SOURCE: .opencode/plugins/mk-goal.js:41] [SOURCE: .opencode/plugins/mk-goal.js:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:652] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:658]

This remains a live documentation gap because the cleanup behavior is source-backed: `pruneArchive()` uses the archive-retention env var, `sweepOrphanedActiveStates()` uses sweep interval and active-retention controls, and session deletion archives state through `archiveGoalStateFile()`. [SOURCE: .opencode/plugins/mk-goal.js:825] [SOURCE: .opencode/plugins/mk-goal.js:829] [SOURCE: .opencode/plugins/mk-goal.js:874] [SOURCE: .opencode/plugins/mk-goal.js:876] [SOURCE: .opencode/plugins/mk-goal.js:883] [SOURCE: .opencode/plugins/mk-goal.js:1824] [SOURCE: .opencode/plugins/mk-goal.js:1828]

### P1 - Updated `goal_plugin.md` Still Lacks the New Cleanup Env Vars and New Status Fields

The already-updated operator reference says it names the environment controls and plugin state contract, but its environment table stops at the older seven variables and contains no `MK_GOAL_STATE_*` rows. It also has no mention of archive/sweep cleanup, `store_health`, or the `mutation=` field. [SOURCE: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:16] [SOURCE: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41] [SOURCE: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:45] [SOURCE: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:51]

The source now returns `store_health=no_active_goal` for empty status, `store_health=state_age_ms:<n>` for active status, and inserts `mutation=<created|refreshed|replaced>` into mutation responses. [SOURCE: .opencode/plugins/mk-goal.js:1602] [SOURCE: .opencode/plugins/mk-goal.js:1608] [SOURCE: .opencode/plugins/mk-goal.js:1636] [SOURCE: .opencode/plugins/mk-goal.js:1646] [SOURCE: .opencode/plugins/mk-goal.js:1674]

### P2 - `system-skill-advisor/README.md` Still Says Live OpenCode Tool Invocation Is Under Investigation

The system-skill-advisor README still states that the `/goal` plugin exposes `mk_goal` / `mk_goal_status` with "live OpenCode-run tool invocation still under investigation." [SOURCE: .opencode/skills/system-skill-advisor/README.md:85]

That conflicts with the same skill's feature catalog, which now says a live `opencode serve` run lists `mk_goal` and `mk_goal_status`, and that a live model turn calls `mk_goal` and persists per-session state. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:41]

### P2 - Root `README.md` Still Advertises Bare `/goal <condition>` Without the Runtime-Specific Filename Caveat

The root README documents `/goal <condition>` as the goal surface and points readers to `.opencode/plugins/README.md` for the plugin contract. [SOURCE: README.md:1230] [SOURCE: README.md:1231] [SOURCE: README.md:1233]

The current live command filename is `.opencode/commands/goal_opencode.md`, not `.opencode/commands/goal.md`; the runtime-specific constitutional note says OpenCode's plugin command is currently named `/goal_opencode` and warns not to assume a bare `/goal` reaches the OpenCode plugin. [SOURCE: .opencode/commands/goal_opencode.md:1] [SOURCE: .opencode/commands/goal_opencode.md:7] [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:24] [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:28] [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:55] [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:61]

Note: the command markdown itself still uses `# /goal` and says `/goal` is a state-free router. That may be display prose inside the OpenCode command file, but the filename-sensitive docs need a consistent operator caveat. [SOURCE: .opencode/commands/goal_opencode.md:7] [SOURCE: .opencode/commands/goal_opencode.md:15]

### P3 - `.opencode/plugins/README.md` Is Accurate as an Entrypoint List but Incomplete as the Linked Plugin Contract

The plugins README correctly lists `mk-goal.js` as the local plugin, says it owns per-session state, injects active goals, exposes `mk_goal` / `mk_goal_status`, accounts usage, and keeps autonomous continuation default-off. [SOURCE: .opencode/plugins/README.md:49]

However, because the root README tells operators to see this README "for the plugin contract," this file is now incomplete on the post-remediation details: it does not mention the three cleanup/archive env vars, state archival/sweeping, `store_health`, or mutation output. [SOURCE: README.md:1233] [SOURCE: .opencode/plugins/README.md:49] [SOURCE: .opencode/plugins/mk-goal.js:40] [SOURCE: .opencode/plugins/mk-goal.js:42] [SOURCE: .opencode/plugins/mk-goal.js:825] [SOURCE: .opencode/plugins/mk-goal.js:874] [SOURCE: .opencode/plugins/mk-goal.js:1608] [SOURCE: .opencode/plugins/mk-goal.js:1646]

### P3 - Archived Review README Still Names the Old Command File

`.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md` still lists the command surface as `.opencode/commands/goal.md`. [SOURCE: .opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:11] [SOURCE: .opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:12]

This is archive context rather than live operator guidance, so it is lower severity, but it is still a `README.md` stale filename reference if the audit includes archive READMEs.

### Ruled Out - `plugin_bridges/README.md` Is Accurate

The plugin-bridges README says `mk-goal.js` is intentionally absent from plugin bridges because it is a standalone local OpenCode plugin, and points to the hook reference for the operator contract. That remains accurate after remediation. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:36] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:69]

### Ruled Out - No Live Explicit Claim Found That `usage_limited` Is Dead or Unimplemented

The current source has `recordProviderUsageLimit()` setting `status: 'usage_limited'` and `continuationSuppressedReason: 'usage_limited'`. [SOURCE: .opencode/plugins/mk-goal.js:1354] [SOURCE: .opencode/plugins/mk-goal.js:1362] [SOURCE: .opencode/plugins/mk-goal.js:1364]

The narrowed live-doc sweep did not find a current explicit claim that `usage_limited` is dead or unimplemented. The only old-name command hits inside `.opencode/skills/**/*.md` were historical explanation lines in `goal-prompting-runtime-specific.md`, not a live instruction to use `.opencode/commands/goal.md`. [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:32] [SOURCE: .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:50]

### Ruled Out - No Goal-Specific Live Claim Found That Goal State Never Gets Cleaned Up

The source now archives state on `session.deleted` and sweeps orphaned active states on `session.created`. [SOURCE: .opencode/plugins/mk-goal.js:1758] [SOURCE: .opencode/plugins/mk-goal.js:1761] [SOURCE: .opencode/plugins/mk-goal.js:1824] [SOURCE: .opencode/plugins/mk-goal.js:1828]

The narrowed search surfaced unrelated "never cleaned" prose in other packets but no goal-specific live doc claim that goal state never gets cleaned up.

## Questions Answered

- `.opencode/commands/goal_opencode.md` is still the only live goal command file found; `.opencode/commands/goal.md` is absent.
- Other skill docs with direct goal-plugin mentions are mostly accurate, but `system-skill-advisor/README.md` still has stale live-tool-verification wording.
- `README.md` surfaces do contain stale or incomplete goal-plugin information: the root README lacks the runtime-specific filename caveat; `.opencode/plugins/README.md` is incomplete if treated as the contract; an archived review README names the old command file.
- `ENV_REFERENCE.md` is not complete for the three cleanup/archive env vars.
- No live explicit `usage_limited` dead/unimplemented claim was found in the narrowed sweep.
- No live goal-specific "goal-state never gets cleaned up" claim was found in the narrowed sweep.

## Questions Remaining

- Should the root README document the OpenCode command as `/goal_opencode`, or should it keep `/goal` but include a runtime-specific caveat pointing to the live command filename?
- Should `.opencode/plugins/README.md` remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract?
- Should archive README staleness be fixed in place, annotated as historical, or left untouched because it is review archive context?
- A later iteration should sweep `feature_catalog`, `manual_testing_playbook`, and `constitutional/` as distinct doc classes again for consistency, because this iteration focused primarily on skill docs and README surfaces.

## Next Focus

Rotate to `feature_catalog`, `manual_testing_playbook`, and `constitutional/` surfaces for filename and behavior consistency, with special attention to whether they distinguish the live OpenCode filename (`goal_opencode.md` / `/goal_opencode`) from prose that still says bare `/goal`.
