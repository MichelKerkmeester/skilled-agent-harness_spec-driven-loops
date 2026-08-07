# Focus

Should `.opencode/plugins/README.md` remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract?

# Actions Taken

1. Read the required deep-research state surfaces first: `deep-research-state.jsonl` and `deep-research-strategy.md`.
2. Read `README.md`, `.opencode/plugins/README.md`, and `.opencode/commands/goal_opencode.md` to compare the public command guidance, plugin-contract pointer, entrypoint inventory, and live command router.
3. Grepped the root README, plugin README, skill README surfaces, and `mk-goal.js` for `mk-goal`, `/goal`, `mk_goal`, `goal_opencode`, `MK_GOAL_STATE_*`, `store_health`, `mutation`, and cleanup/archive function names.
4. Read targeted `mk-goal.js` source slices for the new cleanup/archive env vars, archive/sweep behavior, and output fields.
5. Checked `.opencode/commands/*goal*.md` and `.opencode/commands/goal.md` to confirm the live command filename.

# Findings

## P1 - `.opencode/plugins/README.md` should not remain only an entrypoint inventory while the root README delegates the goal plugin contract to it

The root README tells users that autonomous continuation is default-off and gated, then says to "See `.opencode/plugins/README.md` for the plugin contract" [SOURCE: `README.md:1230-1233`]. That makes `.opencode/plugins/README.md` an operator-facing contract surface, not just an internal entrypoint list.

The plugin README currently documents `mk-goal.js` in one entrypoint row only: it says the plugin owns per-session goal state, injects the active goal, exposes `mk_goal` / `mk_goal_status`, accounts usage, and can drive guarded autonomous continuation [SOURCE: `.opencode/plugins/README.md:42-50`]. Its configuration section then says "Both plugins support" a four-tier precedence model [SOURCE: `.opencode/plugins/README.md:68-75`], but the current entrypoint table lists five plugins, including `mk-goal.js` [SOURCE: `.opencode/plugins/README.md:42-50`]. The visible config tables cover `mk-skill-advisor` and `mk-code-graph`, not `mk-goal` [SOURCE: `.opencode/plugins/README.md:77-115`].

The current `mk-goal.js` source has contract-significant goal configuration and behavior that the plugin README does not expose: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS` with defaults of 90 days, 30 days, and 1 hour [SOURCE: `.opencode/plugins/mk-goal.js:30-42`]; archive pruning and active-state sweeping [SOURCE: `.opencode/plugins/mk-goal.js:825-899`]; `store_health` output [SOURCE: `.opencode/plugins/mk-goal.js:1602-1647`]; and `mutation=<created|refreshed|replaced>` for `set` output [SOURCE: `.opencode/plugins/mk-goal.js:1668-1675`].

Answer to the focus question: `.opencode/plugins/README.md` can remain entrypoint-first, but it should be expanded with a compact `mk-goal` contract subsection if the root README keeps pointing to it as "the plugin contract." The alternative is to keep `.opencode/plugins/README.md` as inventory only and change the root README pointer to the dedicated contract doc, but the current root README wording and plugin README contents are mismatched.

## P2 - The live command filename is still `goal_opencode.md`; docs should distinguish user command from physical filename

Filesystem discovery returned `.opencode/commands/goal_opencode.md` and no `.opencode/commands/goal.md` [SOURCE: glob `.opencode/commands/*goal*.md`; SOURCE: glob `.opencode/commands/goal.md`]. The live file heading is still `# /goal`, and its frontmatter allows `mk_goal` / `mk_goal_status` [SOURCE: `.opencode/commands/goal_opencode.md:1-15`].

This means the root README's `/goal <condition>` wording is likely correct as the user-facing invocation, but docs that discuss repository files or command installation should name `.opencode/commands/goal_opencode.md` explicitly to avoid repeating the old `goal.md` drift.

## P2 - Reconfirmed related README drift in `system-skill-advisor/README.md`

`system-skill-advisor/README.md` still says the `/goal` plugin has "live OpenCode-run tool invocation still under investigation" [SOURCE: `.opencode/skills/system-skill-advisor/README.md:85`]. This remains stale relative to the current command router, which delegates directly to `mk_goal` / `mk_goal_status` [SOURCE: `.opencode/commands/goal_opencode.md:47-59`], and to the already-updated goal plugin references that previous iterations identified as verified. This was not the primary focus of iteration 8, but it remains a live README-class finding.

# Questions Answered

- `.opencode/plugins/README.md` should be expanded if it remains the root README's plugin-contract target; otherwise the root README should point to a more complete dedicated contract surface.
- `.opencode/commands/goal_opencode.md` is still the live command file, and `.opencode/commands/goal.md` is absent.
- The user-facing command label remains `/goal` inside the live `goal_opencode.md` router.
- The plugin README currently omits `mk-goal` cleanup/archive env vars, `store_health`, and `mutation` output details even though the root README points to it for the contract.

# Questions Remaining

- Should the implementation follow the "expand plugin README" path, or should root README be changed to point at `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` as the canonical contract?
- Should archive README staleness be annotated as historical or left untouched because it lives under review archive context?
- A later iteration should still sweep `feature_catalog`, `manual_testing_playbook`, and `constitutional/` as distinct doc classes for consistency after this README-focused pass.

# Next Focus

Sweep `feature_catalog`, `manual_testing_playbook`, and `constitutional/` as distinct doc classes for consistency, with special attention to stale `usage_limited`, cleanup/archive, command filename, `store_health`, and `mutation` claims.
