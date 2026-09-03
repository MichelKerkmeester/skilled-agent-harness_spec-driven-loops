---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 4.0.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the spec-kit `/doctor` command surface.

## Scope

12 scenarios covering the routes that survive the memory decommission:

- `/doctor deep-loop` — 3 scenarios (DOC-331 to DOC-333): lazy-init, empty-graph refusal, convergence gold-battery
- `/doctor:update` — 6 scenarios (DOC-338 to DOC-342, DOC-344): G5 failure injection, G6 concurrent dispatch flock, G7 SIGINT mid-rebuild, G8 migration manifest gap, G9 cross-subsystem dashboard, default tier-aware flow
- Version migration — 3 scenarios (DOC-345 to DOC-347): end-to-end 3.3.0.0 to 3.4.1.0, cleanup-legacy with per-file prompts, no-op run

The `/doctor memory` and `/doctor causal-graph` scenarios were removed with the memory server they diagnosed; their former IDs (DOC-323 to DOC-330) are retired and must not be reused. `/doctor:mcp` infra scenarios are not built.

The live `/doctor <target>` route manifest also includes `/doctor embeddings`, `/doctor skill-advisor`, `/doctor skill-budget`, `/doctor parent-skill`, and `/doctor fable-mode`.

After the 013 Phase 5 hard cutover, `/doctor:<name>` invocations were consolidated into `/doctor <target>` argv-positional dispatch. `/doctor:update` and `/doctor:mcp <install|debug>` remain standalone companion commands.

## Harness

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, or `version-migration-<short-name>.md` for the version-migration group, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Execute each scenario directly per the root playbook's execution policy: run the real commands, inspect real files and record a `PASS`, `FAIL`, or `SKIP` verdict; a scenario the harness cannot run deterministically is a `SKIP` whose blocker names that limitation. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the full execution and evidence-capture policy.

## See Also

- Router source: `.opencode/commands/doctor/speckit.md`
- Route manifest: `.opencode/commands/doctor/_routes.yaml`
- CI assertion: `.opencode/commands/doctor/scripts/route-validate.sh`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
