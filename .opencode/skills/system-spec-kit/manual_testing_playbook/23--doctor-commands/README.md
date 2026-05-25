# 23 — Doctor Commands

Manual testing scenarios for the spec-kit `/doctor` command surface.

## Scope

25 scenarios (DOC-323 through DOC-347, with gaps at 337 and 343) covering:

- `/doctor memory` — 5 scenarios (323-327): fresh install bootstrap, drift detection, long-pole rebuild, SIGINT cancellation, disk-pressure refusal
- `/doctor causal-graph` — 3 scenarios (328-330): low-coverage drift, confidence threshold enforcement, add-only mutation boundary
- `/doctor deep-loop` — 3 scenarios (331-333): lazy-init, empty-graph refusal, convergence gold-battery
- `/doctor code_graph` — 3 scenarios (334-336): daemon healthy, zombie restart, unreachable refusal
- `/doctor:update` — 7 scenarios (338-344): G5 failure injection, G6 concurrent dispatch flock, G7 SIGINT mid-rebuild, G8 migration manifest gap, G9 cross-subsystem dashboard, default tier-aware flow
- Version migration — 2 scenarios (345-346): end-to-end 3.3.0.0 → 3.4.1.0, cleanup-legacy with per-file prompts
- `/doctor:mcp` infra — 1 scenario (347): MCP server install + verify

After commit `1b8d4d691` (013 Phase 5 hard cutover), `/doctor:<name>` invocations were consolidated into `/doctor <target>` argv-positional dispatch. `/doctor:update` and `/doctor:mcp <install|debug>` remain as standalone companion commands.

## Harness

Each scenario has a Markdown file (`NNN-doctor-<short-name>.md`) describing the expected behavior, plus a sandbox shell wrapper at `../_sandbox/23--doctor-commands/scenarios/DOC-NNN-doctor-<short-name>.sh`. Run all scenarios via:

```bash
bash .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh
```

Per-scenario fixtures are fetched on demand by `_sandbox/.../harness/fetch-fixtures.sh`. Evidence (logs, captured grep terms) accumulates under `_sandbox/.../evidence/DOC-NNN/`.

## See Also

- Router source: `.opencode/commands/doctor/speckit.md`
- Route manifest: `.opencode/commands/doctor/_routes.yaml`
- CI assertion: `.opencode/commands/doctor/scripts/route-validate.sh`
- Root playbook index: `../manual_testing_playbook.md`
