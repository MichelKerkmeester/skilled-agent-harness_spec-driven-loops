# Focus

Confirm whether `.opencode/commands/goal_opencode.md` is still the live command filename, not `goal.md`, and identify current references to the old/wrong filename.

# Actions Taken

- Read the current deep-research strategy, config, and state log before research actions, per the deep-research state-first rule.
- Ran fresh command-file discovery for `.opencode/commands/*goal*` and direct `goal.md` existence checks.
- Searched markdown and JSON-like docs for `.opencode/commands/goal.md`, `commands/goal.md`, `goal.md`, and `goal_opencode.md` references.
- Direct-read the live command markdown and the current non-archive docs that looked like either stale references or relevant counterevidence.
- Ran one exclusion-filtered sweep over non-archive markdown to distinguish current-doc drift from archived review/research history.

# Findings

## F-iter002-001: Live command filename remains `goal_opencode.md`

`Glob .opencode/commands/*goal*` returned only `.opencode/commands/goal_opencode.md`, and `Glob **/goal.md` returned no files. The live command file itself is `.opencode/commands/goal_opencode.md`; its frontmatter declares the command description and allowed plugin tools at lines 1-5, and its heading/body still present the user-facing command as `# /goal` / `/goal` at lines 7 and 15. [SOURCE: `.opencode/commands/goal_opencode.md:1`] [SOURCE: `.opencode/commands/goal_opencode.md:7`] [SOURCE: `.opencode/commands/goal_opencode.md:15`]

## F-iter002-002: Phase 009 handover still points next-session readers at the absent `goal.md`

Current non-archive phase 009 handover says the cold-read order ends with `.opencode/commands/goal.md`, but that file does not exist and the live command file is `goal_opencode.md`. This is a current stale handover reference, not historical rename narration. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:95`]

## F-iter002-003: Phase 003 changelog still reports `goal.md` as created

The current phase 003 changelog says `Create .opencode/commands/goal.md` and lists `.opencode/commands/goal.md` as the created file, while the current phase 003 spec/tasks/implementation-summary have already been updated to `goal_opencode.md`. This leaves the changelog inconsistent with both disk and the phase's current canonical docs. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:26`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:56`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:72`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/tasks.md:18`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/implementation-summary.md:57`]

## Ruled Out: Phase 003 current spec/tasks/summary are not stale on filename

Direct reads show the phase 003 spec deliverables and in-scope file table use `.opencode/commands/goal_opencode.md`; tasks key files and T004 also use `goal_opencode.md`; implementation summary lines 57 and 67 use `goal_opencode.md`. These should not be re-flagged despite older review/archive hits for phase 003. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:72`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:98`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:113`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/tasks.md:18`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/tasks.md:65`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/implementation-summary.md:57`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/implementation-summary.md:67`]

## Ruled Out: Phase 011 and constitutional mentions are mostly historical rename narrative

The exclusion-filtered sweep still finds `goal.md` in phase 011 and in `goal-prompting-runtime-specific.md`, but direct reads show they describe the rename history and explicitly conclude the final/current filename is `goal_opencode.md`. Do not treat those as stale current-file claims without a narrower contradiction. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md:56`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md:60`] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md:117`] [SOURCE: `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:26`] [SOURCE: `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:49`]

# Questions Answered

- Is `.opencode/commands/goal_opencode.md` still the live command filename? Yes. Fresh file discovery found only `.opencode/commands/goal_opencode.md` under `.opencode/commands/*goal*`, and no `goal.md` exists.
- Does anything current still reference the old/wrong `goal.md` filename? Yes. Confirmed current non-archive misses are phase 009 handover line 95 and phase 003 changelog lines 26 and 56.
- Are phase 003's main current spec/tasks/implementation-summary files still stale on this filename? No. They now reference `goal_opencode.md`.

# Questions Remaining

- Do other skills' own `SKILL.md`, `references/`, or `assets/` mention `mk-goal.js`, `/goal`, `mk_goal`, or the goal plugin, and are those mentions still accurate post-remediation?
- Do repo-level or skill-level `README.md` files describe the goal plugin/command and miss the new env vars, `store_health`, `mutation`, cleanup behavior, or final command filename?
- Is `ENV_REFERENCE.md` complete for the three new `MK_GOAL_STATE_*` env vars?
- Does any doc still claim `usage_limited` is unimplemented/dead or that goal-state never gets cleaned up?
- Are already-updated docs still internally accurate against current `mk-goal.js` source?

# Next Focus

Sweep other skills' own `SKILL.md`, `references/`, and `assets/` for `mk-goal.js`, `/goal`, `mk_goal`, `goal_opencode`, `opencode_goal`, and `active_goal`, starting with `cli-opencode`, `cli-claude-code`, `sk-code`, `sk-prompt-models`, `system-skill-advisor`, and `deep-loop-workflows`.
