# Dimension

correctness + traceability

# Files Reviewed

- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl:1-3` - prior state and iteration history.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:9-55` - current open findings, confirming only `P1-001` was already registered.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:28-34` - companion finding list and explicit Finding #2 scope.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:115-147` - iteration 3 focus and traceability status.
- `.opencode/skills/sk-code-review/references/review_core.md:28-48` - severity and evidence doctrine loaded before final severity call.
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:1-83` - full hook reference read.
- `.opencode/plugins/mk-goal.js:33-42` - cleanup/sweep defaults and env var names.
- `.opencode/plugins/mk-goal.js:1602-1647` - `store_health` and conditional `mutation=` output emission.
- `.opencode/plugins/mk-goal.js:1668-1675` - `/goal set` mutation value source.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` - sibling env reference table.

# Finding #2 Audit

Verdict: CONFIRMED-P1

Claim: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` was already updated for the `goal_opencode.md` filename, but still omits three live cleanup/sweep env vars plus `store_health` and `/goal set` `mutation=` output-field coverage.

Evidence: The hook reference correctly names the command as `.opencode/commands/goal_opencode.md` at `goal_plugin.md:29`, so it reflects the earlier filename update. Its full environment table spans only `goal_plugin.md:43-52` and lists `MK_GOAL_PLUGIN_DISABLED`, `MK_GOAL_AUTONOMY`, `MK_GOAL_DEBUG`, `MK_GOAL_MAX_OBJECTIVE_CHARS`, `MK_GOAL_MAX_GOAL_PROMPT_CHARS`, `MK_GOAL_MAX_INJECTION_CHARS`, and `MK_GOAL_MAX_EVIDENCE_CHARS`. It does not list `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, or `MK_GOAL_STATE_SWEEP_INTERVAL_MS`.

Evidence: The live plugin defines default retention/sweep controls at `mk-goal.js:33-35` and binds them to `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS` at `mk-goal.js:40-42`.

Evidence: The hook reference's status/output description at `goal_plugin.md:39` says `/goal show` and `mk_goal_status` expose the exact injection preview plus prompt metadata, but the file has no output-field table or mention of the live `store_health` field. The plugin emits `store_health=no_active_goal` when no goal is active at `mk-goal.js:1605-1609`, emits `store_health=state_age_ms:<value>` for active goals at `mk-goal.js:1614-1637`, and conditionally inserts `mutation=<value>` at `mk-goal.js:1646`.

Evidence: `/goal set` supplies the `mutation` value as `created`, `refreshed`, or `replaced` based on prior state at `mk-goal.js:1668-1675`, but `goal_plugin.md:33-40` has no corresponding operator contract for this output.

Counterevidence sought: I read the entire `goal_plugin.md` file from frontmatter through related references (`goal_plugin.md:1-83`), not just the environment table. No later section documents the three state-retention env vars, `store_health`, or `mutation=`.

Alternative explanation: The hook reference may have been updated only for the command filename and not intended as a complete operator output contract. That explanation does not clear the finding because `goal_plugin.md:16` explicitly says the reference names command boundary, environment controls, and validation surfaces, and `goal_plugin.md:63-76` tells operators to run checks after changing goal-plugin behavior or docs that describe it.

Final severity: P1. This is a required traceability/spec mismatch in an operator contract for live plugin behavior, not a P2 wording polish issue. It is not P0 because the live plugin behavior itself appears intact and the missing documentation does not create direct data loss or security exposure.

Confidence: 0.96

Downgrade trigger: Downgrade to P2 only if the project explicitly reclassifies `goal_plugin.md` as a minimal quick-start document and moves authoritative env/output-field coverage to another operator contract that is linked from this file.

Already-updated pattern: This is the important pattern the operator flagged. The file was already touched successfully for `goal.md` to `goal_opencode.md` (`goal_plugin.md:29`), but the same supposedly updated operator reference still misses live env/output behavior. Treat other "already updated" docs as requiring source re-verification rather than trust.

# Sibling-Doc Consistency Check

- `ENV_REFERENCE.md:650-658` and `goal_plugin.md:43-52` are consistent only in the negative sense: both omit the three `MK_GOAL_STATE_*` env vars that `mk-goal.js:40-42` defines.
- Because neither sibling doc contains rows for `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, or `MK_GOAL_STATE_SWEEP_INTERVAL_MS`, there are no documented sibling naming/default rows to compare against the code defaults of 90 days, 30 days, and 1 hour at `mk-goal.js:33-35`.
- This consistency check does not re-emit prior `P1-001`; it confirms Finding #2 and notes that the already-open central reference gap and this hook-reference gap share the same source-of-truth mismatch.

# Findings by Severity

- P0: 0
- P1: 1 new - `P1-002`, `goal_plugin.md` omits live `MK_GOAL_STATE_*`, `store_health`, and `mutation=` operator coverage.
- P2: 0

# Traceability Checks

- `spec_code`: fail - live plugin definitions and output fields at `mk-goal.js:33-42`, `mk-goal.js:1602-1647`, and `mk-goal.js:1668-1675` are not reflected in the operator hook contract at `goal_plugin.md:33-52`.
- `checklist_evidence`: not_applicable - this iteration audited source-vs-doc traceability and no checklist-specific acceptance item was requested.
- `skill_agent`: pass - deep-review workflow and review-core severity doctrine were loaded before the finding call.
- `agent_cross_runtime`: not_run - no cross-runtime comparison was required for this finding.
- `feature_catalog_code`: not_run - this iteration scoped to the hook reference and sibling env reference.
- `playbook_capability`: not_run - playbook output-field validation remains a later finding focus.

# Next Dimension

Maintainability should audit whether the delegated plugin-contract docs are structurally sufficient, especially `.opencode/plugins/README.md` and the root README delegation, then return to playbook output-field coverage if the loop continues through the planned 10 iterations.

Review verdict: CONDITIONAL
