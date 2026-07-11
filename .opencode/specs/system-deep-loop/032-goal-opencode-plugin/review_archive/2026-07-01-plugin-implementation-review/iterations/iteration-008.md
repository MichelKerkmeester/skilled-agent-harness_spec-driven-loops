# Dimension

Traceability -- PASS B overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability` for the shipped goal OpenCode plugin surface.

# Files Reviewed

- `.opencode/plugins/mk-goal.js:23` -- plugin id and implementation anchor.
- `.opencode/plugins/mk-goal.js:60` -- supported `mk_goal` actions.
- `.opencode/plugins/mk-goal.js:1350` -- active-goal injection renderer.
- `.opencode/plugins/mk-goal.js:1402` -- status output envelope and prompt metadata.
- `.opencode/plugins/mk-goal.js:1454` -- `mk_goal` action execution.
- `.opencode/plugins/mk-goal.js:1625` -- `mk_goal` / `mk_goal_status` tool schema.
- `.opencode/commands/goal_opencode.md:1` -- current live command file found by fresh `.opencode/commands/*goal*` glob.
- `.opencode/commands/goal_opencode.md:7` -- command heading still says `# /goal`.
- `.opencode/commands/goal_opencode.md:32` -- command contract.
- `.opencode/commands/goal_opencode.md:49` -- command routes through plugin tools only.
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:27` -- feature catalog command path/capability claim.
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:35` -- tool/lifecycle capability claim.
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:39` -- guarded continuation claim.
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:50` -- source file table command path.
- `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md:21` -- user-facing `/goal set` capability claim.
- `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md:35` -- command path/capability claim.
- `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md:48` -- source file table command path.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:27` -- scenario contract command path.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:53` -- manual `/goal` command scenario.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:61` -- `mk_goal_status` / injection preview scenario.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:91` -- source file command path.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:22` -- expected execution process.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:39` -- restart command path.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:40` -- manual `/goal set` command scenario.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:67` -- source file command path.

# Findings By Severity

## P0

None.

## P1

### DR-008-P1-001 [P1] Overlay catalogs and playbooks point operators at a stale command surface

- Claim: The overlay feature catalogs and manual testing playbooks still present `.opencode/commands/goal.md` and `/goal` as the operator command surface, but the current live command file found by a fresh glob is `.opencode/commands/goal_opencode.md`.
- Evidence: The live command surface is `.opencode/commands/goal_opencode.md` and its command markdown starts at `.opencode/commands/goal_opencode.md:1`; the system-skill-advisor feature catalog names `.opencode/commands/goal.md` at `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:27` and `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:50`; the system-spec-kit feature catalog does the same at `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md:35` and `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md:48`; both playbooks tell operators to use `/goal` and inspect `.opencode/commands/goal.md` at `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:27`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:53`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:91`, `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:39`, `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:40`, and `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:67`.
- Counterevidence sought: Fresh glob of `.opencode/commands/*goal*` returned only `.opencode/commands/goal_opencode.md`; precise agent-surface greps for `mk-goal|mk_goal|goal_opencode|opencode_goal|active_goal|/goal` under `.opencode/agents` and `.claude/agents` found no files; plugin tool schemas still expose `mk_goal` and `mk_goal_status` at `.opencode/plugins/mk-goal.js:1625`.
- Alternative explanation: If the OpenCode command runtime treats the markdown heading `# /goal` as an alias independent of filename, the slash command text may still work, but the overlay source-file references still name an absent file and the current review prompt explicitly required using the live renamed command filename.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 or close if runtime evidence proves `/goal` remains a supported alias for `.opencode/commands/goal_opencode.md` and the overlay docs are updated to cite the live command file path.

## P2

None.

# Traceability Checks

- `skill_agent`: Not applicable. Precise search under `.opencode/agents` for `mk-goal|mk_goal|goal_opencode|opencode_goal|active_goal|/goal` returned no files, so no OpenCode agent definition references this plugin surface.
- `agent_cross_runtime`: Not applicable. The same precise search under `.claude/agents` returned no files, so there is no cross-runtime agent definition to keep in sync for this plugin.
- `feature_catalog_code`: Finding. Core capability claims for state, injection, tool names, status output, and continuation gates are supported by `.opencode/plugins/mk-goal.js:23`, `.opencode/plugins/mk-goal.js:1350`, `.opencode/plugins/mk-goal.js:1402`, `.opencode/plugins/mk-goal.js:1454`, and `.opencode/plugins/mk-goal.js:1625`; command-surface path/name claims are stale in both catalogs and are captured by `DR-008-P1-001`.
- `playbook_capability`: Finding. Playbook scenarios use existing tool-backed capabilities (`mk_goal`, `mk_goal_status`, `injection_preview`, `goal_prompt`, continuation modes), but both playbooks instruct operators to use the stale command name/path, captured by `DR-008-P1-001`.

# SCOPE VIOLATIONS

None.

# Verdict

CONDITIONAL. This iteration adds one P1 traceability finding and no P0/P2 findings.

# Next Dimension

Maintainability pass focused on command filename normalization fallout, metadata generation, test/documentation maintainability, and remaining UX/integration gaps while continuing to exclude `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**`.

Review verdict: CONDITIONAL
