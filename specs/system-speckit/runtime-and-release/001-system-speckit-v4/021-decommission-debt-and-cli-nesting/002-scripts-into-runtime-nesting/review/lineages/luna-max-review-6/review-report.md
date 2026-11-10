# Deep Review Report

Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`

Target type: `spec-folder`

Session: `fanout-luna-max-review-6-1788631907779-g9izs9`

Executor: `cli-opencode model=llmgateway/gpt-5.6-luna`

Execution mode: AUTONOMOUS detached inline lineage

Stop policy: `max-iterations`, 10 iterations. Convergence was telemetry only and did not end the run early.

## Executive Summary
The review is CONDITIONAL. Ten iterations covered correctness, security, traceability and maintainability. No P0 finding was confirmed. Nine active P1 findings and eight active P2 findings remain. Release readiness is `release-blocking` because packet truth and completion attestation are not reconciled, and several recorded verification gates were not replayed in this lineage.

Strongest findings:

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F005 | P1 | Packet scope still describes a planning-only handoff while the implementation summary says the move shipped in this folder. | `spec.md:64-65,80-83`; `implementation-summary.md:55-72` |
| F017 | P1 | Completion metadata claims 100% but stores the zero fingerprint that continuity freshness explicitly skips. | `acceptance-criteria.md:23-28`; `continuity-freshness.ts:352-357` |
| F007 | P1 | Script registry paths have no declared resolution root and include build outputs absent from the source-only checkout. | `runtime/cli/scripts-registry.json:8-22` |
| F013 | P1 | CI and hook paths are source-evidenced but not replayed in this detached lineage. | `changed-packet-validation.yml:28-38`; `system-dist-freshness-guard.js:20-27` |

`hasAdvisories` is `true` because active P2 findings remain. Review writes were confined to this lineage directory.

## Planning Trigger
First reconcile the packet's current-state scope and refresh or explicitly waive its completion fingerprint. Then replay the recorded workspace, build, security, import-policy, CI, hook, mirror and fixture gates in an authorized verification session. The P1 findings require a remediation plan before release readiness can move out of `release-blocking`.

## Active Finding Registry
| ID | Severity | Dimension | Active claim | Direct evidence | Required disposition |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Workspace correctness is source-evidenced but not independently replayed here. | `.opencode/skills/system-spec-kit/package.json:6-26` | Replay workspace install, typecheck, build and test gates. |
| F002 | P2 | maintainability | Runtime tsconfig retains retired scripts topology exclusions. | `runtime/tsconfig.json:42-55` | Remove or justify the entries. |
| F003 | P1 | security | Path containment is source-supported but security replay is unavailable here. | `runtime/cli/utils/path-utils.ts:61-90` | Replay path and symlink boundary tests. |
| F004 | P2 | maintainability | Containment logic is duplicated at two trust seams. | `runtime/cli/spec-folder/generate-description.ts:90-105` | Align or centralize in a scoped follow-up. |
| F005 | P1 | traceability | Packet scope and completion narrative contradict each other. | `spec.md:64-65,80-83` | Reconcile authored current-state scope. |
| F006 | P2 | traceability | Scratch path map preserves superseded package identity and pre-move assumptions. | `scratch/path-map.json:105-126` | Label historical input or update its current-state companion. |
| F007 | P1 | maintainability | Registry resolution root and build-output contract are unclear. | `runtime/cli/scripts-registry.json:8-22` | Define resolution root and source/dist semantics. |
| F008 | P2 | maintainability | Current subordinate READMEs retain retired scripts topology. | `runtime/cli/continuity/README.md:52-83` | Refresh current dependency diagrams. |
| F009 | P2 | maintainability | Public runtime API comments retain old consumer names. | `runtime/api/index.ts:12-44` | Refresh boundary comments. |
| F010 | P1 | correctness | Shipped-path harness is source fail-closed but not independently replayed. | `runtime/cli/tests/test-scripts-modules.js:2939-2946` | Replay clean build, freshness and harness. |
| F011 | P2 | maintainability | Runtime scripts tooling lacks a consistently explained boundary from CLI. | `runtime/cli/lib/dist-freshness.cjs:55-72` | Clarify the remaining runtime/scripts role. |
| F012 | P1 | correctness | Nested import and resolver behavior is source-supported but not replayed. | `runtime/cli/evals/import-policy-rules.ts:22-31` | Replay import, AST and registry suites. |
| F013 | P1 | correctness | External CI and hook path correctness is not replayed. | `.github/workflows/changed-packet-validation.yml:28-38` | Replay workflow-equivalent and hook checks. |
| F014 | P2 | maintainability | Worktree and CI shared-artifact ownership is distributed and implicit. | `.opencode/bin/worktree-session.sh:78-87` | Document ownership and freshness. |
| F015 | P1 | correctness | Fixture and wrapper-boundary correctness is not replayed. | `runtime/cli/tests/workflow-invariance.vitest.ts:48-84` | Replay fixture and stress suites. |
| F016 | P2 | maintainability | Historical fixture vocabulary is not consistently marked. | `runtime/cli/tests/fixtures/README.md:1-3` | Refresh current docs and label history. |
| F017 | P1 | traceability | Completion claim stores the zero fingerprint freshness skips. | `acceptance-criteria.md:23-28` | Stamp non-zero fingerprint or record waiver. |

## Remediation Workstreams
1. Packet truth and attestation: reconcile `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json` and completion fingerprint state.
2. Verification replay: run workspace install, typecheck, build, dist freshness, path security, import policy, CI-equivalent, hook, mirror and fixture gates.
3. Current documentation and registries: update `runtime/cli` subordinate READMEs, `scripts-registry.json`, API comments and fixture README while preserving intentionally historical or external-skill terms.
4. Shared artifact ownership: document how worktree-shared dist and node_modules are provisioned and refreshed relative to CI workspace builds.

## Spec Seed
The packet should state one current reality: the CLI is `runtime/cli`, the package is `@spec-kit/cli`, continuity is under `runtime/cli/continuity`, `runtime/scripts` remains build tooling and execution occurred in this folder by operator direction. Completion requires a non-zero matching fingerprint or a named waiver, current generated metadata and replayable evidence for recorded gates.

## Plan Seed
1. Reconcile packet current-state scope and completion metadata.
2. Refresh the continuity fingerprint through the canonical save path or record an explicit waiver.
3. Define the registry resolution root and distinguish source paths from build outputs.
4. Replay workspace, path-security, import-policy, CI, hook, mirror, fixture and dist harness checks.
5. Refresh current CLI documentation and shared-artifact ownership notes.
6. Record command outputs and exit statuses against each affected acceptance row.

## Traceability Status
| Protocol | Result | Reason |
|---|---|---|
| `spec_code` | FAIL | Packet scope and completion attestation contradict current implementation state. |
| `checklist_evidence` | FAIL | Completion claim has a zero fingerprint skip and several recorded gates were not replayed here. |
| `feature_catalog_code` | PARTIAL | Current generated key files are aligned, but registry resolution semantics are unclear. |
| `playbook_capability` | PARTIAL | Source paths and test contracts are present, but command replay is deferred by lineage boundary. |

## Resource Map Coverage Gate
- The gate was skipped because `resource-map.md` was absent at initialization.
- No pre-existing `target_files` map was available for touched-versus-gap classification.
- The lineage-local `resource-map.md` records reviewed anchors and the skipped status.

## Deferred Items
- P2 advisories F002, F004, F006, F008, F009, F011, F014 and F016 remain active but do not independently change the CONDITIONAL mapping.
- Repository install, build, tests, validation, continuity save, graph mutation and git writes were not run by explicit detached-lineage constraint.
- Compiled CLI dist output was absent in the source-only checkout, so compiled-entry claims remain unverified.

## Audit Appendix
| Item | Result |
|---|---|
| Iterations | 10 of 10 completed |
| Dimensions | correctness, security, traceability, maintainability covered |
| New findings | P1/P2 discovery in iterations 1-9; no new finding in iteration 10 |
| Final active findings | P0=0, P1=9, P2=8 |
| Convergence | Telemetry only under `max-iterations` stop policy |
| Graph | unavailable under lineage-only write boundary |
| Scope | Source and packet files read only; writes confined to lineage directory |
| Command execution | No repository-mutating or external-gate commands run |
| Adversarial replay | Final iteration reread all active P1 anchors and counterevidence |

Review verdict: CONDITIONAL
