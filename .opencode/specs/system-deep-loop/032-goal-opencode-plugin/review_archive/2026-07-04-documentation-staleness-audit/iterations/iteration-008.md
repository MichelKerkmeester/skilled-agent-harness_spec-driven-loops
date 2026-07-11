# Dimension

Maintainability: goal-plugin documentation topology, operator-contract ownership, and code self-documentation for the new state-retention and status-output surfaces.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity definitions and evidence rules loaded before severity call.
- `.opencode/plugins/mk-goal.js:40` - new state-retention env var constants.
- `.opencode/plugins/mk-goal.js:825` - archive pruning helper.
- `.opencode/plugins/mk-goal.js:847` - archive-on-delete/session-delete helper.
- `.opencode/plugins/mk-goal.js:874` - active-state sweep helper.
- `.opencode/plugins/mk-goal.js:1354` - provider usage-limit state helper.
- `.opencode/plugins/mk-goal.js:1598` - centralized tool-output section.
- `.opencode/plugins/mk-goal.js:1602` - `goalStateLines` output renderer.
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41` - hook reference env table.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646` - env reference goal-plugin table.
- `README.md:1230` - root Goal subsection and delegation.
- `.opencode/plugins/README.md:42` - plugin entrypoint list.
- `.opencode/plugins/README.md:69` - plugin README configuration section.
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:33` - catalog tool/lifecycle narrative.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:60` - manual output-validation steps.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:17` - UX-hooks status scenario contract.

# Doc-Structure Maintainability Assessment

The documentation structure is a contributing root cause for the current drift, but the structural problem is advisory rather than another immediate P1 content gap.

The current topology gives future maintainers several plausible places to update after a goal-plugin contract change. `ENV_REFERENCE.md` has a dedicated goal-plugin env section and says detailed operator guidance lives in `references/hooks/goal_plugin.md` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646`-`660`]. That hook reference also owns an environment-variable table [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41`-`52`]. Root `README.md` then delegates the plugin contract to `.opencode/plugins/README.md` [SOURCE: `README.md:1230`-`1233`], but `.opencode/plugins/README.md` only gives `mk-goal.js` one entrypoint row [SOURCE: `.opencode/plugins/README.md:42`-`50`] and its configuration section enumerates `mk-skill-advisor` and `mk-code-graph`, not `mk-goal` [SOURCE: `.opencode/plugins/README.md:69`-`116`].

The hook reference's internal structure makes output-field updates harder than env-var updates. It has a visible `## 4. Environment Variables` table [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41`-`52`], but no equivalent dedicated `Output Fields` or status-envelope schema section. Output behavior is currently scattered across behavior bullets and validation prose: the hook reference says `/goal show` and `mk_goal_status` expose injection preview and prompt metadata [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33`-`40`], the Skill Advisor playbook asks operators to capture `STATUS=OK` envelopes and verify `injection_preview=` [SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:60`-`64`], and the System Spec Kit UX playbook lists expected output fields such as `goal_prompt=`, `prompt_framework=`, and `prompt_max_chars=` [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md:17`-`25`]. This split explains why `store_health=` and `mutation=` could be added in code without an obvious single status-schema doc to update.

This strengthens the root-cause theory behind existing P1-001, P1-002, and P1-003 without restating them. The current missing env vars and root README delegation are already covered there. The new maintainability issue is the topology: env ownership is duplicated, output-field ownership is implicit, and `.opencode/plugins/README.md` is both a generic entrypoint doc and a misleading delegated contract target.

# Code Self-Documentation Assessment

The code is more maintainable than the docs.

The new env-var names are centralized as constants with clear names: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS` [SOURCE: `.opencode/plugins/mk-goal.js:40`-`42`]. The retention defaults are grouped next to other defaults [SOURCE: `.opencode/plugins/mk-goal.js:33`-`35`]. The helper names are direct enough for a maintainer to infer purpose: `pruneArchive`, `archiveGoalStateFile`, `sweepOrphanedActiveStates`, and `recordProviderUsageLimit` [SOURCE: `.opencode/plugins/mk-goal.js:825`, `.opencode/plugins/mk-goal.js:847`, `.opencode/plugins/mk-goal.js:874`, `.opencode/plugins/mk-goal.js:1354`].

The status-output surface is also centralized. A dedicated `TOOL OUTPUT` section starts at `.opencode/plugins/mk-goal.js:1598`, and `goalStateLines` emits `store_health=` for both empty and active states plus `mutation=` for set mutations [SOURCE: `.opencode/plugins/mk-goal.js:1602`-`1647`]. This means a maintainer can infer the output-field contract from code if docs drift, but they still have no canonical doc section to update after changing the renderer.

# Findings By Severity

## P0

None.

## P1

None.

## P2

### I8-P2-1 [P2] Goal-plugin docs lack a single contract owner and canonical output-field schema

- Claim: The documentation topology itself makes future goal-plugin contract changes drift-prone because env vars are documented in multiple places while output fields have no canonical schema section.
- Evidence: `ENV_REFERENCE.md` owns a goal-plugin env table and delegates detailed guidance to `goal_plugin.md` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646`-`660`]. `goal_plugin.md` duplicates an env table [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41`-`52`] but has no dedicated output-field section after its behavior bullets [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33`-`83`]. Root `README.md` delegates the plugin contract to `.opencode/plugins/README.md` [SOURCE: `README.md:1230`-`1233`], while `.opencode/plugins/README.md` only lists `mk-goal.js` as an entrypoint and documents config tables for other plugins [SOURCE: `.opencode/plugins/README.md:42`-`50`, `.opencode/plugins/README.md:69`-`116`].
- Counterevidence sought: A single doc that explicitly says it is the authoritative `mk-goal` env/output-field contract and lists both the state-retention env vars and current `goalStateLines` fields. None was found in the reviewed docs.
- Alternative explanation: This could be a one-off propagation miss by the implementer, not a structural problem. I downgraded from P1 because the current blocking content gaps are already tracked by P1-001, P1-002, and P1-003, and code centralization reduces immediate operator risk.
- Final severity: P2.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to note/no-finding if `goal_plugin.md` gains a dedicated status-output schema and the root/plugin README delegation is corrected to point to it, leaving only ordinary content-currency maintenance.
- Finding class: cross-consumer documentation maintainability.
- Scope proof: Grep/read coverage found the goal-plugin contract spread across `ENV_REFERENCE.md`, `goal_plugin.md`, root `README.md`, `.opencode/plugins/README.md`, feature catalog, and two playbooks; only code has a centralized output renderer.
- Recommendation: Make `goal_plugin.md` the canonical operator contract, add an `Output Fields` table generated from or manually aligned with `goalStateLines`, and have `ENV_REFERENCE.md`, root `README.md`, `.opencode/plugins/README.md`, catalogs, and playbooks link to that section instead of each owning partial contract text.

# Traceability Checks

- Prior findings not re-emitted: P1-001, P1-002, P1-003, P2-001, P2-002, and DR-006-P2-001 were treated as established context, not duplicated.
- P1-001 adjacency: strengthened. Duplicated env tables explain why the three new `MK_GOAL_STATE_*` vars could be missed in both env docs.
- P1-002 adjacency: strengthened. No canonical output-field schema in `goal_plugin.md` explains why `store_health=` and `mutation=` did not have an obvious documentation destination.
- P1-003 adjacency: strengthened. Root README delegates to `.opencode/plugins/README.md`, which is structurally an entrypoint/config overview rather than the goal-plugin contract.
- Code self-documentation: adequate. The status renderer and helper names are clear enough to reconstruct behavior from code, so the root cause is documentation topology, not inscrutable implementation.

# Verdict

New findings: 1 P2. No new P0/P1. This iteration passes under the deep-review verdict mapping because P2-only findings are advisory.

# Next Dimension

Recommended next pass: remediation-planning or closure synthesis should convert this structural finding into a doc-ownership rule before updating the existing P1 doc gaps, so the fix does not repeat the same multi-doc drift pattern.

Review verdict: PASS
