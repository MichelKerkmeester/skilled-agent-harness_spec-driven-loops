# Iteration 009

## Focus

Should `.opencode/plugins/README.md` remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract?

## Actions Taken

1. Read required deep-research state first: `deep-research-state.jsonl`, `deep-research-strategy.md`, and the deep-research quick reference.
2. Confirmed the live command filename with command globs: `.opencode/commands/goal_opencode.md` exists and `.opencode/commands/goal.md` does not.
3. Compared root README goal guidance, `.opencode/plugins/README.md`, `ENV_REFERENCE.md`, and current `.opencode/plugins/mk-goal.js` source for contract coverage.
4. Checked README-level cross-links to `.opencode/plugins/README.md` and goal-plugin contract docs.
5. Ran a narrow README-only negative sweep for `usage_limited`, `recordProviderUsageLimit`, and goal-state cleanup/never-cleaned claims.

## Findings

### P1 - `.opencode/plugins/README.md` is currently too thin to be the contract target the root README promises

The root README explicitly sends operators to `.opencode/plugins/README.md` for the goal plugin contract: `README.md:1231-1233` documents `/goal`, says it is backed by `mk-goal`, and says "See `.opencode/plugins/README.md` for the plugin contract." That makes the plugin README a contract surface, not just an inventory.

The plugin README currently gives `mk-goal.js` one inventory row at `.opencode/plugins/README.md:42-50`, then moves into a configuration section that says "Both plugins" at `.opencode/plugins/README.md:68-75` even though the current entrypoint table lists five entrypoints at `.opencode/plugins/README.md:46-50`. Its config subsections cover `mk-skill-advisor` and `mk-code-graph` only (`.opencode/plugins/README.md:77-124`) and it ends without a `mk-goal` contract/config section (`.opencode/plugins/README.md:125-149`).

Current source shows contract details that the plugin README omits: the three cleanup/archive env vars are defined at `.opencode/plugins/mk-goal.js:33-42`; archive pruning and active-state sweeping are implemented at `.opencode/plugins/mk-goal.js:825-898`; `usage_limited` is now recorded at `.opencode/plugins/mk-goal.js:1354-1368`; `store_health` is emitted at `.opencode/plugins/mk-goal.js:1602-1647`; and `/goal set` emits `mutation=created|refreshed|replaced` at `.opencode/plugins/mk-goal.js:1668-1675`.

Answer: `.opencode/plugins/README.md` should not remain only an entrypoint inventory while the root README calls it the plugin contract. Either expand it with a `mk-goal` contract/config/status-output section, or retarget the root README to the real detailed contract doc. Leaving both unchanged makes the root README delegation stale/incomplete.

### P2 - Contract ownership is split between README surfaces

The root README points to `.opencode/plugins/README.md` for the plugin contract (`README.md:1233`), but the spec-kit plugin bridge README says the goal plugin operator contract lives in `../../references/hooks/goal_plugin.md` at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:36` and repeats that at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:90`.

That split matters because `.opencode/plugins/README.md` does not currently include the detailed `mk-goal` env/status/mutation contract, while the bridge README sends readers elsewhere. The docs should converge on one contract target or clearly divide responsibilities: plugin inventory in `.opencode/plugins/README.md`, detailed goal operator contract in `goal_plugin.md`.

### P2 - `ENV_REFERENCE.md` still omits the three cleanup/archive env vars

`ENV_REFERENCE.md:648-660` documents only the older goal-plugin env vars and then points to `references/hooks/goal_plugin.md`. It still lacks `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS`, all defined in source at `.opencode/plugins/mk-goal.js:33-42` and used by archive/sweep code at `.opencode/plugins/mk-goal.js:825-898`.

This was known from earlier iterations, but it remains relevant to the README contract decision because root README readers sent through `.opencode/plugins/README.md` will also not find these env vars in the central env reference.

### Ruled Out - README surfaces do not currently contain live `usage_limited` dead/unimplemented or goal-state-never-cleaned claims

README-only sweeps for `usage_limited`, `recordProviderUsageLimit`, `unimplemented`, and plugin cleanup language did not find current README claims that `usage_limited` is dead/unimplemented or that goal state never gets cleaned up. The visible `dead` matches were unrelated generic prose, and goal-state cleanup negative claims were absent from README files.

## Questions Answered

- `.opencode/commands/goal_opencode.md` is still the live command filename; `.opencode/commands/goal.md` is absent. The live file still presents the command heading as `# /goal` and describes a state-free `/goal` router at `.opencode/commands/goal_opencode.md:1-15`.
- `.opencode/plugins/README.md` should not remain only an inventory if the root README continues to call it the plugin contract. The current docs need either plugin README expansion or root README retargeting to `goal_plugin.md`.
- README surfaces did not reveal live claims that `usage_limited` is unimplemented/dead or that goal state never gets cleaned up.

## Questions Remaining

- Should the follow-up fix expand `.opencode/plugins/README.md`, or should the root README be changed to point at `goal_plugin.md` as the detailed contract while `.opencode/plugins/README.md` stays an inventory?
- Should `.opencode/plugins/README.md:70` be corrected from "Both plugins" to wording that matches the five current entrypoints even if the `mk-goal` contract is documented elsewhere?
- Should iteration 10 sweep the distinct non-README doc classes requested by the strategy again: `feature_catalog`, `manual_testing_playbook`, and `constitutional/`?

## Next Focus

For iteration 10, rotate away from README contract routing and sweep the remaining distinct doc classes (`feature_catalog`, `manual_testing_playbook`, and `constitutional/`) plus any targeted old-behavior terms not already exhausted, so the 10-iteration floor closes with non-README coverage.
