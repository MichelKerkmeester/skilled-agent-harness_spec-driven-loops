# Deep Review Strategy: Skill Documentation Drift Remediation

## Topic

Review target: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation`.

## Review Dimensions

- [x] correctness — iteration 001, CONDITIONAL
- [x] security — iteration 002, PASS
- [x] traceability — iteration 003, CONDITIONAL
- [x] maintainability — iteration 004, PASS with advisory
- [x] stabilization — iteration 005, PASS, max-iteration ceiling reached

## Completed Dimensions

| Dimension | Iteration | Verdict | Notes |
|---|---:|---|---|
| Correctness | 001 | CONDITIONAL | Found living cli-opencode routing docs that still publish stale direct `--agent` patterns. |
| Security | 002 | PASS | No P0/security defect found in sampled scanner/plugin/agent surfaces. |
| Traceability | 003 | CONDITIONAL | Packet completion state disagrees across canonical docs and graph metadata. |
| Maintainability | 004 | PASS | One P2 metadata coverage advisory. |
| Stabilization | 005 | PASS | No new findings; stop reason is max-iterations. |

## Running Findings

| Severity | Count | Active IDs |
|---|---:|---|
| P0 | 0 | None |
| P1 | 2 | F001, F002 |
| P2 | 1 | F003 |

## What Worked

- Packet-local continuity first exposed status drift before broader searches.
- Scoped grep for exact stale tokens separated accepted replacements from remaining contradictory living docs.
- Sampling both the authoritative `SKILL.md`/`README.md` and linked references/playbooks caught cross-document drift missed by the implementation summary.

## What Failed

- The packet's own completion docs were not reconciled after implementation, so `spec.md`, `plan.md`, and `graph-metadata.json` still present stale state.
- The previous remediation focused on ai-council direct dispatch, but did not normalize the broader `--agent general` and direct subagent examples still present in cli-opencode reference/playbook surfaces.

## Exhausted Approaches

- Re-checking deep-loop TOML mirror references under `deep-loop-workflows` found no remaining `.opencode/agents/*.toml` hits.
- Re-checking plugin entrypoints found six `.js` files and a matching six-row README table.

## Ruled-Out Directions

- No P0/security escalation: no secret, permission expansion, or unsafe scanner behavior was confirmed in the sampled code/plugin files.
- No early synthesis on convergence: stop policy is `max-iterations`, so convergence was telemetry only.

## Next Focus

Remediate P1 doc drift first: align cli-opencode's living reference/playbook invocations with the current omit-agent/orchestrate contract, then reconcile packet completion metadata.

## Known Context

- `resource-map.md` not present. Skipping coverage gate.
- Phase 014 identified six original drift clusters; this phase claims all six were fixed and verified.
- The phase implementation summary also reports 13 additional `.toml` references and two sandbox script fixes beyond the original key-file set.

## Cross-Reference Status

| Protocol | Class | Status | Notes |
|---|---|---|---|
| spec_code | hard | partial | F001 and F002 show current docs do not fully match stated successful remediation. |
| checklist_evidence | hard | partial | Checklist completion is internally supported, but status surfaces contradict it. |
| feature_catalog_code | advisory | partial | cli-opencode references/playbooks still publish stale direct-agent patterns. |
| playbook_capability | advisory | partial | CO-001/CO-013 style playbook scenarios still rely on `--agent general`. |

## Files Under Review

| File | Coverage | Notes |
|---|---|---|
| `.opencode/specs/.../015-skill-doc-drift-remediation/spec.md` | read | Stale in-progress status and continuity fields. |
| `.opencode/specs/.../015-skill-doc-drift-remediation/plan.md` | read | DoD and phase tasks remain unchecked. |
| `.opencode/specs/.../015-skill-doc-drift-remediation/tasks.md` | read | Claims all tasks complete. |
| `.opencode/specs/.../015-skill-doc-drift-remediation/checklist.md` | read | Claims all checklist items verified. |
| `.opencode/specs/.../015-skill-doc-drift-remediation/implementation-summary.md` | read | Claims complete, includes additional files not in graph metadata. |
| `.opencode/specs/.../015-skill-doc-drift-remediation/graph-metadata.json` | read | Status and key_files stale. |
| `.opencode/skills/cli-opencode/SKILL.md` | read | Current contract says omit `--agent general`. |
| `.opencode/skills/cli-opencode/README.md` | read | Current contract says generic subagents are not direct top-level routes. |
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | read | Stale direct invocations remain. |
| `.opencode/skills/cli-opencode/manual_testing_playbook/**` | sampled | Stale direct invocations remain in living scenarios. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | read | Two-mirror template verified. |
| `.opencode/plugins/README.md` | read | Six entrypoints verified. |

## Review Boundaries

- Max iterations: 5.
- Stop policy: max-iterations.
- Convergence threshold: 0.1.
- Target files are read-only.
- Writes constrained to `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/review/lineages/gpt-fast-high`.

## Non-Goals

- Do not implement remediation fixes.
- Do not edit target docs or code outside this lineage artifact directory.
- Do not dispatch nested sub-agents.

## Stop Conditions

- Stop after iteration 5 per `config.maxIterations`.
- P0 discovery would lock final verdict to FAIL; no P0 was confirmed.
