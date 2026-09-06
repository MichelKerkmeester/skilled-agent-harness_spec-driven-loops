# Deep Review Report

Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`

Target type: `spec-folder`

Session: `fanout-luna-max-review-5-1788624802460-meehmn`

Executor: `cli-opencode model=llmgateway/gpt-5.6-luna`

Execution mode: AUTONOMOUS detached inline lineage

Stop policy: `max-iterations`, 10 iterations. Convergence was telemetry only and did not end the run early.

## Executive Summary
The review is CONDITIONAL. Ten iterations covered correctness, security, traceability and maintainability. No P0 finding was confirmed. Ten active P1 findings and eight active P2 findings remain. The release-readiness state is `release-blocking` until the P1 evidence and packet-truth issues are reconciled.

The strongest findings are:

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F005 | P1 | Packet scope still describes a planning-only handoff while the implementation summary says the move shipped in this folder. | `spec.md:64-83`; `implementation-summary.md:55-72` |
| F007 | P1 | Current CLI READMEs retain `scripts/` topology and retired `memory/` links. | `runtime/cli/spec/README.md:17-18`; `runtime/cli/tests/README.md:18-39` |
| F009 | P1 | The legacy shipped-path harness skips when a required compiled module is absent. | `runtime/cli/tests/test-scripts-modules.js:2939-2944` |
| F017 | P1 | Generated graph metadata still names the retired `scripts/@spec-kit/scripts` package identity. | `graph-metadata.json:211-230` |
| F018 | P1 | Completion metadata coexists with scaffold placeholder markers in `spec.md`. | `spec.md:224-236`; `acceptance-criteria.md:27` |

`hasAdvisories` is `true` because active P2 findings remain. No target implementation or packet file was modified by this review.

## Planning Trigger
The packet cannot be treated as a clean closeout. First reconcile the packet's current-state narrative and generated metadata. Then replay the recorded install, typecheck, build, test, mirror and validation gates in an authorized verification session. The P1 findings require a remediation plan before release readiness can move out of `release-blocking`.

## Active Finding Registry
| ID | Severity | Dimension | Active claim | Direct evidence | Required disposition |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Workspace correctness is source-evidenced but not replayed in this lineage. | `.opencode/skills/system-spec-kit/package.json:6-26` | Run workspace install and build gates. |
| F002 | P2 | maintainability | Runtime tsconfig retains retired `scripts` include/exclude topology. | `.opencode/skills/system-spec-kit/runtime/tsconfig.json:40-51` | Remove or justify the residue. |
| F003 | P1 | security | Path containment is source-evidenced but security command replay was unavailable. | `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts:61-92` | Replay path-boundary tests. |
| F004 | P2 | maintainability | Path containment logic is duplicated across CLI consumers. | `runtime/cli/spec-folder/generate-description.ts:90-105` | Align or centralize in a scoped follow-up. |
| F005 | P1 | traceability | Packet scope and completion state contradict each other. | `spec.md:64-83`; `implementation-summary.md:55-72` | Reconcile authored packet state. |
| F006 | P2 | traceability | Inventory package-name guidance is historical but not clearly bounded. | `scratch/inventory.md:274-298` | Mark historical inputs or update the handoff. |
| F007 | P1 | maintainability | Maintained CLI READMEs retain retired topology. | `runtime/cli/spec/README.md:17-18` | Rewrite current subordinate docs. |
| F008 | P2 | maintainability | Registry metadata mixes current paths with stale dependency vocabulary. | `runtime/cli/scripts-registry.json:19-23` | Reconcile registry descriptions and dependencies. |
| F009 | P1 | correctness | Shipped-path harness skips missing dist output. | `runtime/cli/tests/test-scripts-modules.js:2939-2944` | Fail closed or explicitly detect unprovisioned environments. |
| F010 | P2 | maintainability | Embeddings harness comments retain scripts naming. | `runtime/cli/tests/test-embeddings-factory.cjs:13-16` | Refresh naming on next edit. |
| F011 | P1 | correctness | Nested import policy and handler-root logic are not replayed here. | `runtime/cli/evals/import-policy-rules.ts:22-31` | Replay AST and policy tests. |
| F012 | P2 | maintainability | Public runtime API comments retain scripts topology. | `runtime/api/index.ts:4-8` | Refresh boundary comments. |
| F013 | P1 | correctness | External consumer paths are source-evidenced but not replayed here. | `.github/workflows/changed-packet-validation.yml:28-37` | Replay CI and consumer checks. |
| F014 | P2 | maintainability | Worktree artifact ownership is distributed across shell and CI surfaces. | `.opencode/bin/worktree-session.sh:80-87` | Document the ownership boundary. |
| F015 | P1 | correctness | Legacy fixture classification is source-evidenced but test replay was unavailable. | `runtime/cli/tests/workflow-invariance.vitest.ts:74-84` | Replay fixture and wrapper suites. |
| F016 | P2 | maintainability | Historical scripts fixture vocabulary lacks shared maintenance guidance. | `runtime/cli/tests/workflow-invariance.vitest.ts:74-84` | Document fixture versus live path data. |
| F017 | P1 | traceability | Generated graph metadata retains retired package identity. | `graph-metadata.json:211-230` | Regenerate or reconcile metadata. |
| F018 | P1 | correctness | Completion claims coexist with scaffold placeholders. | `spec.md:224-236` | Resolve or explicitly exempt markers. |

## Remediation Workstreams
1. Packet truth and metadata: reconcile `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json` and `graph-metadata.json`.
2. Verification replay: run the recorded workspace, typecheck, build, test, mirror, hook and strict-validation gates from a session authorized to execute them.
3. Documentation and registry cleanup: update current `runtime/cli` READMEs, registry metadata and public API comments without rewriting intentional historical fixture values.
4. Test confidence: make required shipped-path assertions fail closed or prove that an environment is explicitly unprovisioned before skipping.

## Spec Seed
The packet should state one current reality: the CLI is `runtime/cli`, the package is `@spec-kit/cli`, continuity is under `runtime/cli/continuity`, and `runtime/scripts` remains build tooling. Completion requires generated metadata to match that reality, no unresolved scaffold placeholders, and replayable evidence for the recorded gates.

## Plan Seed
1. Reconcile authored and generated packet state.
2. Re-run the package root install, typecheck, build, CLI test and strict validation commands from `scratch/execute-plan.md`.
3. Update current subordinate READMEs, registry dependency metadata and API boundary comments.
4. Re-run source/dist, import-policy, handler-cycle, mirror and fixture suites.
5. Record command output and exit status against each acceptance row.

## Traceability Status
| Protocol | Result | Reason |
|---|---|---|
| `spec_code` | FAIL | Packet scope and generated metadata contradict current implementation identity. |
| `checklist_evidence` | FAIL | Completion claims do not reconcile scaffold markers and unreplayed gates. |
| `feature_catalog_code` | PARTIAL | Current paths are represented, but subordinate docs and generated summary drift. |
| `playbook_capability` | PARTIAL | Operator commands are current in several surfaces, but replay was unavailable and docs mix historical topology. |

## Deferred Items
- P2 advisories F002, F004, F006, F008, F010, F012, F014 and F016 remain active but do not independently change the CONDITIONAL mapping.
- Repository validation, install, build and tests were not run in this detached lineage by explicit user constraint.
- Continuity save was not run because it would write outside the lineage directory.
- No graph upsert or external tooling was run.

## Audit Appendix
| Item | Result |
|---|---|
| Iterations | 10 of 10 completed |
| Dimensions | correctness, security, traceability, maintainability covered |
| New findings | P1/P2 discovery across iterations 1-9; no new finding in iteration 10 |
| Final active findings | P0=0, P1=10, P2=8 |
| Convergence | Telemetry only under `max-iterations` stop policy |
| Graph | unavailable |
| Scope | Source and packet files read only; writes confined to lineage directory |
| Command execution | Not run outside lineage by explicit constraint |
| Adversarial replay | Final iteration re-read all cited packet and metadata anchors |

Review verdict: CONDITIONAL
