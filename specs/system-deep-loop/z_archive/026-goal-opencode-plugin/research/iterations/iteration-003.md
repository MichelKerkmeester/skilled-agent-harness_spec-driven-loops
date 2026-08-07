# Iteration 003: Command Filename Re-Verification

## Focus

Is `.opencode/commands/goal_opencode.md` still the live command filename, not `goal.md`, and does anything reference the old/wrong name?

## Actions Taken

1. Read the active deep-research strategy and JSONL state before research, per the deep-research iteration contract.
2. Globbed `.opencode/commands/*goal*.md` and exact-globbed `.opencode/commands/goal.md` to verify the live command file set.
3. Grepped repository markdown and structured text for `goal_opencode.md` and `goal.md` references.
4. Read the live command router and the candidate stale-reference sources that survived the grep sweep.

## Findings

### Confirmed: live command filename remains `goal_opencode.md`

`Glob .opencode/commands/*goal*.md` returned only `.opencode/commands/goal_opencode.md`, and exact glob for `.opencode/commands/goal.md` returned no files. The live command file itself is the `/goal` router: frontmatter allows `mk_goal` and `mk_goal_status` [SOURCE: `.opencode/commands/goal_opencode.md:1`-`.opencode/commands/goal_opencode.md:5`], the heading is `# /goal` [SOURCE: `.opencode/commands/goal_opencode.md:7`], and the purpose says it manages the passive session goal through the `mk-goal` plugin [SOURCE: `.opencode/commands/goal_opencode.md:13`-`.opencode/commands/goal_opencode.md:15`].

### P1: phase 011 tasks still contain current checklist claims for renaming to `goal.md`

`011-command-surface-normalization/tasks.md` frontmatter correctly says the operator amended the final name to `goal_opencode.md` and lists `.opencode/commands/goal_opencode.md` as the key file [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:14`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:18`]. However, the completed task body still says T001 confirmed the pre-rename file before moving it to `.opencode/commands/goal.md` [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:53`] and T004 says to rename the command file to plain `goal.md` unless phase 009 says otherwise [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:65`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:66`]. That is a current packet task-list contradiction, not merely historical narrative, because the tasks are marked complete and the same file's completion criteria still claim the stale-reference grep returned zero hits [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:107`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:110`].

### P2: phase 009 handover cold-read order still points at absent `goal.md`

The phase 009 handover recommends a next-session cold-read order ending with `.opencode/commands/goal.md` [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:91`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:96`]. Because `.opencode/commands/goal.md` is absent and `.opencode/commands/goal_opencode.md` is the only live command file, this remains a stale operational pointer.

### Historical but still old-name-bearing: phase 003 changelog records `goal.md`

The phase 003 changelog says `.opencode/commands/goal.md` was created [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:24`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:30`] and lists `.opencode/commands/goal.md` in its files changed table [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:52`-`.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:57`]. This is less operational than the phase 009/011 docs because it is a changelog, but it is still an old filename reference in a current packet artifact.

### Ruled out: already-updated overlay docs are not currently stale for this filename

The grep sweep showed the already-updated system-spec-kit and system-skill-advisor feature catalog/playbook references now cite `.opencode/commands/goal_opencode.md`, not `.opencode/commands/goal.md` [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:29`; SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:437`; SOURCE: `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:27`; SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:27`]. The constitutional rule still mentions `goal.md`, but in a rename-history narrative that also states the final operator-confirmed name is `goal_opencode.md` [SOURCE: `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:33`-`.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:49`].

## Questions Answered

- `.opencode/commands/goal_opencode.md` is still the only live goal command markdown file discovered under `.opencode/commands/`.
- `.opencode/commands/goal.md` is absent.
- Active stale references remain in phase 009 handover and phase 011 tasks; phase 003 changelog also carries the old filename as a historical record.

## Questions Remaining

- Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation?
- Do repo-level or skill-level `README.md` files describe the goal plugin/command and miss the new env vars, `store_health`, `mutation`, or filename?
- Is `ENV_REFERENCE.md` complete for the three cleanup/archive env vars?
- Does any doc still claim `usage_limited` is unimplemented/dead or that goal-state never gets cleaned up?

## Next Focus

Sweep other skills' own `SKILL.md`, `references/`, and `assets/` for `mk-goal.js`, `/goal`, `mk_goal`, and `goal_opencode.md`, starting with `cli-opencode`, `cli-claude-code`, `sk-code`, `sk-prompt-models`, `system-skill-advisor`, and `deep-loop-workflows`.
