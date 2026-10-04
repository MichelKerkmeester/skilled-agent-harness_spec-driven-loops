---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 2.0.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the doctor command surface.

## Scope

4 scenarios covering the routes that survive the memory decommission:

- `/doctor:deep-loop`: 3 scenarios (DOC-331 to DOC-333): lazy-init availability, empty-graph refusal, convergence gold-battery
- `/doctor:skill-advisor rebuild`: 1 scenario (DOC-348): dry run, backed-up rebuild, restore on failure

The memory and causal-graph doctor scenarios were removed with the memory server they diagnosed. Their former IDs (DOC-323 to DOC-330) are retired and must not be reused. The standalone rebuild-orchestrator and version-migration scenarios were removed with that command, and their former IDs (DOC-338 to DOC-342 and DOC-344 to DOC-347) are retired as well. MCP infrastructure scenarios are not built.

The doctor routers split by owner. `/doctor:speckit` takes no target and diagnoses spec-kit retrieval. `/doctor:skill-advisor <target>` owns six targets: `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`. `/doctor:deep-loop` and `/doctor:runtime-mirrors` take no target. `/doctor:update`, `/doctor:mcp` and `/doctor:env` are standalone companions.

## Harness

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Execute each scenario directly per the root playbook's execution policy: run the real commands, inspect real files and record a `PASS`, `FAIL`, or `SKIP` verdict. A scenario the harness cannot run deterministically is a `SKIP` whose blocker names that limitation. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the full execution and evidence-capture policy.

## See Also

- Router source: `.skilled/commands/doctor/deep-loop.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- CI assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index; each scenario listed here carries its own line
