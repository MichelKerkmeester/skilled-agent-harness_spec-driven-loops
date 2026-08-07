# Deep Review Iteration 001

## Dimension

- Dimension: correctness
- Focus: inventory + correctness audit of companion research Finding #1
- Budget profile: adjudicate
- Agent definition loaded: `.opencode/agents/deep-review.md:1-38`
- Review doctrine loaded: `.opencode/skills/sk-code-review/references/review_core.md:28-49`

## Files Reviewed

- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:22-34` - review charter and six companion research findings.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-config.json:34-45` - review target, dimensions, and cross-reference protocols.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl:1` - first-run state baseline.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/research.md:65-68` - companion Finding #1 claim.
- `.opencode/plugins/mk-goal.js:33-42` - cleanup/archive defaults and env-var constants.
- `.opencode/plugins/mk-goal.js:825-899` - `pruneArchive()` and `sweepOrphanedActiveStates()` retention behavior.
- `.opencode/plugins/mk-goal.js:1354-1368` - `recordProviderUsageLimit()` sets `usage_limited`.
- `.opencode/plugins/mk-goal.js:1602-1647` - `store_health` output and mutation insertion site.
- `.opencode/plugins/mk-goal.js:1668-1675` - `/goal set` mutation value calculation.
- `.opencode/plugins/mk-goal.js:1758-1761` - `session.created` sweep wiring.
- `.opencode/plugins/mk-goal.js:1824-1828` - `session.deleted` archive wiring.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` - central goal-plugin env-var table.
- `.opencode/commands/goal_opencode.md:1-83` - live command router.
- `.opencode/commands/*goal*.md` glob result - only `.opencode/commands/goal_opencode.md` matched.
- `.opencode/commands/goal.md` glob result - no file found.

## Doc Inventory

Inventory source: scoped search for `mk-goal.js|mk_goal|goal_opencode|/goal|usage_limited` across `README.md`, `.opencode/plugins/README.md`, `.opencode/commands`, and `.opencode/skills/**/*.md`.

- Root/plugin README docs: `README.md`, `.opencode/plugins/README.md`.
- Command docs: `.opencode/commands/goal_opencode.md`; `.opencode/commands/goal.md` is absent.
- SKILL.md mentions: `.opencode/skills/system-spec-kit/SKILL.md` has goal-plugin routing and reference pointers; `.opencode/skills/sk-prompt/SKILL.md` is a generic word `goal` false-positive, not plugin-specific.
- References: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, `.opencode/skills/system-spec-kit/references/config/hook_system.md`.
- Assets: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` is a generic word `goal` false-positive, not plugin-specific.
- Feature catalog: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`, `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/feature_catalog/context-preservation/cross-runtime-fallback.md`, `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md`, `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md`.
- Manual testing playbook: `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`.
- Constitutional: `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`.
- MCP/server architecture docs: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`.

## Per-Finding Audit

### Finding #1 Verdict: CONFIRMED-P1

Companion research claim: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` omits `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS`.

Verdict: CONFIRMED-P1.

Evidence:

- Source defines the three env-var names: `.opencode/plugins/mk-goal.js:40-42`.
- Source defines their defaults as 90 days, 30 days, and 1 hour: `.opencode/plugins/mk-goal.js:33-35`.
- Source consumes archive retention in `pruneArchive()`: `.opencode/plugins/mk-goal.js:825-837`.
- Source consumes sweep interval and active retention in `sweepOrphanedActiveStates()`: `.opencode/plugins/mk-goal.js:874-883`.
- Central reference goal-plugin table lists only the older controls and stops at `MK_GOAL_MAX_EVIDENCE_CHARS`: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660`.

Claim adjudication:

```json
{"claim":"ENV_REFERENCE.md omits the three MK_GOAL_STATE_* cleanup/archive env vars that mk-goal.js defines and consumes.","evidenceRefs":[".opencode/plugins/mk-goal.js:33-42",".opencode/plugins/mk-goal.js:825-837",".opencode/plugins/mk-goal.js:874-883",".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660"],"counterevidenceSought":"Read the full OPENCODE GOAL PLUGIN env table and searched goal-plugin env-var mentions in scoped skill docs; no ENV_REFERENCE.md rows for the three MK_GOAL_STATE_* variables were found.","alternativeExplanation":"The table links to detailed operator guidance, but ENV_REFERENCE.md describes itself as the environment variable reference and already contains the plugin env table, so omission from the central table is still a contract gap.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade/refute if the same ENV_REFERENCE.md file documents all three variables elsewhere in an authoritative goal-plugin env table, or if mk-goal.js stops reading those variables."}
```

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **P1-001 - Central env reference omits active goal-state cleanup controls** - `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` - The live plugin defines and consumes `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, and `MK_GOAL_STATE_SWEEP_INTERVAL_MS`, but the central goal-plugin env table lists only older controls. This is a required documentation/spec mismatch because operators using the central env reference cannot discover shipped retention/sweep controls.
   - Finding class: cross-consumer
   - Scope proof: Source-side evidence from `.opencode/plugins/mk-goal.js:33-42`, `.opencode/plugins/mk-goal.js:825-837`, and `.opencode/plugins/mk-goal.js:874-883`; central-doc gap confirmed at `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660`.
   - Affected surface hints: `["ENV_REFERENCE.md", "mk-goal cleanup/archive env vars", "operator configuration docs"]`

### P2 Findings

None.

## Traceability Checks

- `spec_code`: partial - verified the companion research Finding #1 against live code and central env docs.
- `checklist_evidence`: not run this iteration - no checklist-specific evidence was requested in iteration 1.
- `skill_agent`: partial - loaded `.opencode/agents/deep-review.md` and confirmed LEAF/read-only iteration contract.
- `agent_cross_runtime`: not run this iteration.
- `feature_catalog_code`: inventory-only - catalog files mentioning the goal plugin were enumerated for later iterations.
- `playbook_capability`: inventory-only - playbook files mentioning the goal plugin were enumerated for later iterations.

## Scope Violations

None.

## Ruled Out

- `.opencode/commands/goal.md` is not a live command file; glob returned no files.
- `.opencode/commands/goal_opencode.md` is the only live `.opencode/commands/*goal*.md` command file found.
- `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` matched generic `goal` wording, not the OpenCode goal plugin.

## Next Dimension

- Iteration 2 should stay in correctness with traceability overlap and audit companion Finding #2 against `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, focusing on the same three env vars plus `store_health` and `mutation=` output coverage.

Review verdict: CONDITIONAL
