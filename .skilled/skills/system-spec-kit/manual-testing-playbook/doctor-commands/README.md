---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 2.1.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the doctor command surface.

## Scope

13 scenarios covering the four doctor commands this skill owns:

- `/doctor:speckit`: 3 scenarios (DOC-349 to DOC-351): a healthy index, a stale index and a target another command owns now
- `/doctor:runtime-mirrors`: 2 scenarios (DOC-352 and DOC-353): every mirror in sync, and one drifted mirror
- `/doctor:env`: 3 scenarios (DOC-354 to DOC-356): inspecting switches, saving a preference behind a yes, and secrets and per-invocation switches that are never saved
- `/doctor:update`: 5 scenarios (DOC-357 to DOC-361): `check`, `align`, `apply`, `rollback` and `record-base`

The other doctor commands are tested in the playbook of the skill they check: `/doctor:skill-advisor` in system-skill-advisor (DOC-348 and DOC-362 to DOC-367), `/doctor:deep-loop` in system-deep-loop (DOC-331 to DOC-333 and DOC-368), `/doctor:git` in sk-git (DOC-369 to DOC-374) and `/doctor:mcp` in mcp-code-mode (DOC-375 to DOC-378 and DOC-380). DOC- numbers are shared across those playbooks, so a new doctor scenario takes the next free number in the whole series.

The memory and causal-graph doctor scenarios were removed with the memory server they diagnosed. Their former IDs (DOC-323 to DOC-330) are retired and must not be reused. The standalone rebuild-orchestrator and version-migration scenarios were removed with that command, and their former IDs (DOC-338 to DOC-342 and DOC-344 to DOC-347) are retired as well.

## Harness

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Execute each scenario directly per the root playbook's execution policy: run the real commands, inspect real files and record a `PASS`, `FAIL`, or `SKIP` verdict. A scenario the harness cannot run deterministically is a `SKIP` whose blocker names that limitation. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the full execution and evidence-capture policy.

## See Also

- Router sources: `.skilled/commands/doctor/speckit.md`, `runtime-mirrors.md`, `env.md` and `update.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- CI assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index; each scenario listed here carries its own line
