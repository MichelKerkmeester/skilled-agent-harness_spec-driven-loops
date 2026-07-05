# Iteration 010

## Focus

Should iteration 10 sweep the distinct non-README doc classes requested by the strategy again: `feature_catalog`, `manual_testing_playbook`, and `constitutional/`?

## Actions Taken

1. Read required deep-research state first: `deep-research-state.jsonl`, `deep-research-strategy.md`, and the prior iteration narrative.
2. Confirmed the live command filename: `.opencode/commands/*goal*.md` resolves to `.opencode/commands/goal_opencode.md` only.
3. Swept `feature_catalog/`, `manual_testing_playbook/`, and `constitutional/` across `.opencode/skills/` for `mk-goal.js`, `mk_goal`, `goal_opencode`, `/goal`, `usage_limited`, cleanup/archive function names, and goal-state cleanup terms.
4. Rechecked source-backed contract terms in `.opencode/plugins/mk-goal.js` and the central env reference.
5. Ran a final negative sweep for live markdown claims that `usage_limited` is dead/unimplemented or goal state never gets cleaned up.

## Findings

### P2 - Goal-plugin manual playbooks do not validate the new `store_health` and `/goal set` `mutation=` output fields

The final doc-class sweep found the goal-plugin manual playbooks are still correct about the command file and plugin-tool routing, but their pass criteria stop before the new output fields added by the current source. The system-spec-kit playbook asks operators to verify `STATUS=OK`, active status, `goal_prompt` metadata, prompt framework/max chars, and injection preview at `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:34`, and it captures `/goal show` or Node transcripts at lines 50 and 59. The system-skill-advisor playbook asks only that `mk_goal_status` includes `injection_preview=` at `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:61`.

Current source emits the additional status surface: `store_health` is produced by `goalStateLines()` at `.opencode/plugins/mk-goal.js:1602-1646`, and `/goal set` returns `mutation=created|refreshed|replaced` at `.opencode/plugins/mk-goal.js:1674-1675`. The playbooks are not contradicted by source, but they are stale as validation surfaces because a manual validation can pass without checking these newly documented output fields.

### P2 - `ENV_REFERENCE.md` still omits the three cleanup/archive env vars

The central env reference's goal-plugin section still lists only the older variables at `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:648-660`. Source defines the three missing cleanup/archive variables at `.opencode/plugins/mk-goal.js:40-42`: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS`. Source also uses the archive/sweep path at `.opencode/plugins/mk-goal.js:825`, `.opencode/plugins/mk-goal.js:847`, `.opencode/plugins/mk-goal.js:874`, `.opencode/plugins/mk-goal.js:1761`, and `.opencode/plugins/mk-goal.js:1828`.

This was known from earlier iterations and remains open after the final non-README sweep.

### Ruled Out - No additional `feature_catalog/` or `manual_testing_playbook/` goal-plugin entries outside the two updated skills

The path-scoped sweep across all `.opencode/skills/**/feature_catalog/**/*.md` and `.opencode/skills/**/manual_testing_playbook/**/*.md` found goal-plugin entries only under `system-spec-kit` and `system-skill-advisor`, plus the expected cross-runtime fallback entry. The relevant catalog entries point to `.opencode/commands/goal_opencode.md` and `.opencode/plugins/mk-goal.js` accurately, including `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:35`, `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:47-50`, `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:27`, and `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:49-50`.

The system-skill-advisor catalog also correctly states that `usage_limited` is a supported goal state at `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:35`, which aligns with `recordProviderUsageLimit()` in source at `.opencode/plugins/mk-goal.js:1354`.

### Ruled Out - No constitutional goal-plugin references outside `goal-prompting-runtime-specific.md`

The explicit constitutional sweep under `.opencode/skills/system-spec-kit/constitutional/` returned only `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`. That file accurately distinguishes Claude Code's native `/goal` from the OpenCode plugin command currently named `/goal_opencode`, names `.opencode/commands/goal_opencode.md`, and warns not to expect bare `/goal` to reach the OpenCode plugin at lines 24-60.

No other constitutional file in that directory mentioned `mk-goal.js`, `/goal`, `mk_goal`, `goal_opencode`, `usage_limited`, or the cleanup/archive function names.

### Ruled Out - No live markdown claims that `usage_limited` is dead/unimplemented or goal state never gets cleaned up

The final negative sweep did not find a current live markdown claim that `usage_limited` is dead/unimplemented or that goal-state files never get cleaned up. The live goal-specific catalog entry instead says `usage_limited` is supported at `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:35`, and source confirms `recordProviderUsageLimit()` at `.opencode/plugins/mk-goal.js:1354`.

## SESSION SUMMARY OF OPEN ITEMS

1. `ENV_REFERENCE.md` still needs the three cleanup/archive env vars: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS`.
2. `.opencode/plugins/README.md` is too thin for the contract target promised by the root README; either expand it for `mk-goal` or retarget the root README to `references/hooks/goal_plugin.md`.
3. `.opencode/plugins/README.md` still has a wording mismatch around "Both plugins" despite the current plugin entrypoint table listing five entrypoints.
4. Root `README.md` likely needs a runtime-specific caveat: bare `/goal` is the user-facing command concept, but the live OpenCode markdown file is `.opencode/commands/goal_opencode.md` and Claude Code has its own native `/goal`.
5. `system-skill-advisor/README.md` still says live OpenCode-run tool invocation is under investigation, while the updated feature catalog says live `mk_goal` invocation was verified.
6. `references/hooks/goal_plugin.md` was already updated, but earlier research flagged that it still may need explicit cleanup env-var, `store_health`, and `mutation=` contract coverage.
7. The two goal-plugin manual playbooks should add checks for `store_health` and `/goal set` `mutation=` output so manual validation covers the new source-visible status fields.
8. Old-name `.opencode/commands/goal.md` references remain in some phase/archive materials from earlier iterations, especially phase 009 handover, phase 011 tasks, and phase 003 changelog surfaces; follow-up should decide whether to correct, annotate as historical, or leave archives untouched.
9. No follow-up fix is needed for live claims that `usage_limited` is dead/unimplemented or that goal-state never gets cleaned up; the final live-doc sweep ruled those out.

## Questions Answered

- Yes. Iteration 10 swept the requested non-README doc classes: `feature_catalog/`, `manual_testing_playbook/`, and `constitutional/`.
- `.opencode/commands/goal_opencode.md` remains the live command filename discovered by the command glob; `.opencode/commands/goal.md` was not present in the live command filename sweep.
- No additional goal-plugin constitutional docs were found outside `goal-prompting-runtime-specific.md`.
- The goal-plugin feature catalogs are accurate at the high-level command/source/status-state level; the manual playbooks have a validation-coverage gap for new output fields.
- `ENV_REFERENCE.md` is still incomplete for the three cleanup/archive env vars.
- No live markdown claim was found that `usage_limited` is dead/unimplemented or that goal-state files never get cleaned up.

## Questions Remaining

- Should follow-up implementation expand `.opencode/plugins/README.md`, or retarget root `README.md` to `references/hooks/goal_plugin.md` as the detailed contract?
- Should old-name and old-behavior references inside archive/phase materials be fixed in place, annotated as historical, or left untouched?

## Next Focus

This was iteration 10 of 10. The research loop should hand off to synthesis or a separate documentation-fix phase using the open-item list above.
