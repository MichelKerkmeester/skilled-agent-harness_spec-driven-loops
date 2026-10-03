# Proposal

## Verdict: fix

The target's route metadata and executable workflow disagree: the route invokes the command-catalog checker but the YAML does not, and the YAML's two Pi checks are absent from the route's invocation list (.skilled/commands/doctor/_routes.yaml:192-198; .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:33-40, 129-138). The YAML action says five mirror checkers even though it declares seven upstream assets and seven execution steps (.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:6, 33-40, 131-138).

The Codex hooks check exits 1 on this linked worktree before it compares the user-global hooks file, while the check-only branch itself returns before any write (.skilled/bin/install-codex-hooks.mjs:243-275, 317-341; doctor-run.log:45-47). The presentation accepts 12 and 13 but does not show them in the startup menu, and the help block still says 1-11 (.skilled/commands/doctor/assets/doctor-speckit-presentation.txt:12-24, 37-45, 50-70).

## Minimal concrete edits

### Route invocation list

File: .skilled/commands/doctor/_routes.yaml, runtime-mirrors script_invocations at lines 192-198.

Old: the list contains runtime mirrors, Codex agents, Codex prompts, agent roster, command catalog, and Codex hooks installer; it omits both Pi checks.

New: keep the existing entries and add these two invocations after the Codex prompt check:

- node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
- node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check

The workflow already executes both with --check (.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:136-137).

File: .skilled/commands/doctor/_routes.yaml, script_invocations entry at line 198.

Old: node .skilled/bin/install-codex-hooks.mjs --check

New: node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree

This uses the installer's existing worktree option while retaining its read-only --check return path (.skilled/bin/install-codex-hooks.mjs:43-55, 243-275, 334-341).

### Workflow checker inventory and result contract

File: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml, upstream_assets after agent_roster at lines 33-40.

Old: no command_catalog asset.

New:

  command_catalog: ".skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs"

File: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml, action at line 6.

Old: Run the five mirror checkers plus the hook-adapter fallback health check -> aggregate their verdicts -> report per-surface drift

New: Run every upstream_assets checker plus the hook-adapter fallback health checks -> aggregate their verdicts -> report per-surface drift

File: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml, execution.steps after the agent_roster step at lines 131-138.

Old: no command-catalog execution step.

New:

  - "Run upstream_assets.command_catalog. Exit 0 = in sync, 1 = structural or strict prose drift, 2 = checker error."

The command-catalog checker supports this no-argument read-only invocation and returns those structural/error statuses (.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:32-38, 303-357). Its current read-only output says manual index, group-count, or hub-metadata updates are the repair (.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:349-357).

File: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml, Codex hooks execution step at line 135.

Old: Run upstream_assets.codex_hooks_installer with --check ... Exit 0 = in sync, 1 = drift.

New: Run upstream_assets.codex_hooks_installer with --check --allow-worktree. Treat its explicit OK output as in sync, its drift report as drift, and a refusal, checker error, or missing affirmative output as an error.

The installer recognizes --allow-worktree and its --check path returns before writes (.skilled/bin/install-codex-hooks.mjs:43-55, 243-275, 334-341).

File: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml, output at lines 145-152.

Old: only STATUS=OK and STATUS=DRIFT are defined, and no command-catalog repair guidance is listed.

New: define STATUS=ERROR when a checker refuses, cannot complete, or returns without an affirmative in-sync result. Add a command-catalog drift entry that directs the operator to update the stale index row, group count, or hub metadata from command frontmatter. Keep STATUS=DRIFT for completed checks that report drift.

This prevents a checker error or silent disabled-installer return from being described as an in-sync result (.skilled/bin/install-codex-hooks.mjs:317-319; .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:145-164).

### Presentation menu

File: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt, startup menu and help block at lines 12-24 and 50-70.

Old: the menu ends at 11; the help lists only through Fable Mode and says Press 1-11, 0, or X, although accepted answers map 12 to runtime-mirrors and 13 to router-reach.

New: add menu entries for 12) Check runtime mirrors and 13) Check router reachability; add matching symptom rows to the help block; replace Press 1-11, 0, or X with Press 1-13, 0, or X.

The accepted-answer mappings already exist and need no edit (.skilled/commands/doctor/assets/doctor-speckit-presentation.txt:37-40).

## FINDINGS

No runtime mirror or catalog defect was confirmed by the checks that completed: the mirror checker reports 172 mirrors across 8 trees in sync, Codex and Pi agent/prompt checks pass, the roster is 12/12 across all five surfaces, the command catalog reports every listed catalog and metadata set in sync, and all 64 adapter paths exist (doctor-run.log:2-43, 49-55, 158-350).

The user-global Codex hook parity state is unverified, not a confirmed subsystem defect: ~/.codex/hooks.json exists, but the check stopped at the linked-worktree guard before comparing its contents (doctor-run.log:45-47, 475-477).
