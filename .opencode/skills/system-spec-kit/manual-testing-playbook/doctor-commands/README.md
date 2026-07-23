---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 23 — Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the spec-kit `/doctor` command surface.

## Scope

20 scenarios (DOC-323 through DOC-347, with gaps at 334-337 and 343) covering the original scenario set:

- `/doctor memory` — 5 scenarios (323-327): fresh install bootstrap, drift detection, long-pole rebuild, SIGINT cancellation, disk-pressure refusal
- `/doctor causal-graph` — 3 scenarios (328-330): low-coverage drift, confidence threshold enforcement, add-only mutation boundary
- `/doctor deep-loop` — 3 scenarios (331-333): lazy-init, empty-graph refusal, convergence gold-battery
- `/doctor:update` — 6 scenarios (338-342, 344): G5 failure injection, G6 concurrent dispatch flock, G7 SIGINT mid-rebuild, G8 migration manifest gap, G9 cross-subsystem dashboard, default tier-aware flow
- Version migration — 3 scenarios (345-347): end-to-end 3.3.0.0 → 3.4.1.0, cleanup-legacy with per-file prompts, no-op run

`/doctor code-graph` and `/doctor:mcp` infra scenarios are not built yet, which is why the ID range has gaps.

The live `/doctor <target>` route manifest also includes `/doctor embeddings`, `/doctor skill-advisor`, `/doctor skill-budget`, `/doctor parent-skill`, and `/doctor fable-mode`.

After commit `1b8d4d691` (013 Phase 5 hard cutover), `/doctor:<name>` invocations were consolidated into `/doctor <target>` argv-positional dispatch. `/doctor:update` and `/doctor:mcp <install|debug>` remain as standalone companion commands.

## Harness

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, or `version-migration-<short-name>.md` for the version-migration group, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Execute each scenario directly per the root playbook's execution policy: run the real commands, inspect real files and record a `PASS`, `FAIL`, `SKIP` or `UNAUTOMATABLE` verdict. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the full execution and evidence-capture policy.

## See Also

- Router source: `.opencode/commands/doctor/speckit.md`
- Route manifest: `.opencode/commands/doctor/_routes.yaml`
- CI assertion: `.opencode/commands/doctor/scripts/route-validate.sh`
- Root playbook index: `../manual-testing-playbook.md`
