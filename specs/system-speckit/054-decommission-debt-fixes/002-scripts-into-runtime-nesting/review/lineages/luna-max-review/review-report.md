# Deep Review Report

Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`

Target type: spec-folder

Session: `fanout-luna-max-review-1788599924929-d9wrhj`

Executor: `cli-codex model=gpt-5.6-luna`

Execution mode: AUTONOMOUS inline fan-out lineage

Stop policy: max-iterations, 10 iterations; convergence telemetry was not used for early synthesis.

## Executive Summary

The review fails. The proposed scripts-to-runtime nesting is not currently a coherent, replayable package boundary: the declared `runtime/cli` workspace has no nested package manifest, root package and lockfile consumers still reference the retired scripts package, CI installs the deleted workspace, and several moved tests, registries, and documents retain old topology. One P0 finding blocks release and eight P1 findings require remediation.

The canonical review set is F001-F009: one P0 (F001) and eight P1 findings (F002-F009). The reducer projection reports 11 open rows, including duplicate legacy variants for F001 and F002; those variants are not additional claims and are explicitly deduplicated here.

No implementation or target-packet files were modified. The report is evidence for a subsequent implementation pass, not a claim that the move is complete.

## Planning Trigger

This packet is marked complete in parts of its generated and implementation documentation, but its own planning and handoff documents still describe the move as pending. The contradiction is a planning trigger: re-level and reconcile the packet before implementation, restore a truthful planned state, obtain the required operator approval, then execute the move and verification as one bounded change.

## Active Finding Registry

| ID | Severity | Active claim | Direct evidence | Required disposition |
| --- | --- | --- | --- | --- |
| F001 | P0 | The root workspace declares `runtime/cli`, but `runtime/cli/package.json` is absent; the old scripts manifest is deleted while root scripts and the lockfile still target `@spec-kit/scripts`. | `.opencode/skills/system-spec-kit/package.json:6-10,17-25`; `package-lock.json:11-15,1124-1131`; absence checks for both manifests | Restore the nested package boundary, make root workspace scripts and lockfile agree with it, then re-run install/build/test discovery. |
| F002 | P1 | The execution handoff invokes retired `runtime/cli/dist/memory/generate-context.js` instead of the shipped continuity writer. | `scratch/execute-plan.md:151`; `implementation-summary.md:55-60`; root smoke references | Correct the handoff to `runtime/cli/dist/continuity/generate-context.js` and replay the documented command. |
| F003 | P1 | Root Vitest discovery omits the moved `runtime/cli/tests` root while the old scripts test root is empty; the runtime config also excludes CLI tests. | `.opencode/skills/system-spec-kit/vitest.config.ts:9-13`; `.opencode/skills/system-spec-kit/runtime/vitest.config.ts:14-23`; 146 moved top-level Vitest suites | Add the moved CLI test root to the authoritative test lane or establish an explicit, verified CLI lane and make the root gate cover it. |
| F004 | P1 | Packet metadata and completion documents disagree about level, status, execution state, and causal topology. | `spec.md:23-25,47-50,64-65`; `acceptance-criteria.md:45-48,58-63`; `plan.md:31-32,45-48`; generated description/graph metadata | Reconcile frontmatter, tables, acceptance, plan, generated metadata, and handoff state before declaring completion. |
| F005 | P1 | Persistent READMEs under the moved package retain `scripts/` and `memory/` topology and invalid `npm --prefix .../scripts` build commands. | `runtime/cli/README.md:56-98,115-138,190-197,227-235`; `runtime/cli/spec-folder/README.md:80-127`; `runtime/cli/core/README.md`; `runtime/cli/continuity/README.md`; moved test/types/utils/validation READMEs | Rewrite the moved documentation and commands against the current runtime/cli and continuity topology; remove retired package instructions. |
| F006 | P1 | The active script registry advertises twelve absent `scripts/...` source paths after implementations moved to `runtime/cli`. | `runtime/cli/scripts-registry.json:25-222`; `runtime/cli/registry-loader.sh:13-14`; bounded existence checks | Update all registry entries and add target-existence validation so discovery cannot cite retired files. |
| F007 | P1 | Two in-scope CI workflows still run `npm ci` from the deleted `system-spec-kit/scripts` workspace. | `.github/workflows/changed-packet-validation.yml:28-37`; `.github/workflows/strict-pass-freshness-report.yml:36-45` | Point CI at the canonical package boundary and verify the install/build/test sequence from a clean checkout. |
| F008 | P1 | The maintained spec-root resolver registry retains twelve entries under the retired scripts tree; its test checks shape but not source existence. | `runtime/cli/core/spec-root-registry.ts:29-169`; `runtime/cli/tests/spec-root-registry.vitest.ts:21-36`; bounded absence checks | Rewrite the inventory to moved paths and require every recorded resolver file to exist in the coverage test. |
| F009 | P1 | Moved test harnesses retain retired roots and an extra generated-output segment, producing dependency failures or silent shipped-path skips. | `runtime/cli/tests/test-embeddings-factory.js:13-14`; `test-phase-validation.js:13-20`; `test-scripts-modules.js:16-18,2936-2947`; `runtime/shared/dist` absent while `shared/dist` exists | Rewrite harness roots and generated paths, then make required-artifact absence fail rather than silently skip a path-contract defect. |

## Remediation Workstreams

1. Package boundary: resolve F001 first. Restore the nested CLI manifest, reconcile workspace declarations and lockfile links, and verify nearest-package root calculations in `core/config.ts`.
2. Verification entrypoints: resolve F002, F003, and F009 together. Correct the continuity handoff, include the moved CLI suites in an authoritative lane, and repair moved harness roots and generated-output assertions.
3. Cross-consumer inventory: resolve F006-F008. Update the script catalog, CI install locations, and resolver inventory as one path-map change, with existence checks at each maintained index boundary.
4. Packet truth and operator documentation: resolve F004-F005. Reconcile packet status/level/acceptance/generated metadata, then update persistent moved-package READMEs and commands.

The P0 workstream is a prerequisite for trustworthy verification of the P1 workstreams. No workstream was implemented during this review.

## Spec Seed

The next implementation packet should state that the current source tree is partially relocated and not yet releasable. It should require:

- a reconciled documentation level and truthful planned status until the move is executed;
- a single canonical nested package boundary for `runtime/cli` with a consistent root workspace and lockfile;
- current runtime/cli, continuity, registry, resolver, CI, and test-harness paths;
- explicit existence and test-discovery checks for moved consumers;
- regenerated metadata only after the canonical documents and implementation state agree;
- operator approval before any move or other broad filesystem mutation.

## Plan Seed

1. Inventory the old and new package boundaries and decide the canonical package name.
2. Restore/update the nested manifest, root workspaces, package scripts, and lockfile together.
3. Correct executable handoffs, test discovery, moved harness roots, registry entries, resolver entries, and CI install commands.
4. Rewrite the affected persistent READMEs and remove stale build/topology instructions.
5. Reconcile packet documents and generated metadata with the actual implementation state.
6. Run focused path and discovery checks, then the whole authoritative build/test gate from the final state.
7. Record evidence for each acceptance criterion and only then close the packet.

Rollback is a bounded reversal of the same package/path-map edits before any dependent release: restore the prior manifest, lockfile, workflow, registry, resolver, harness, and documentation revisions as one reviewed change. No rollback operation was performed by this review.

## Traceability Status

| Protocol | Result | Reason |
| --- | --- | --- |
| `spec_code` | FAIL | F001 remains a P0 and packet completion claims conflict with planning/handoff state. |
| `checklist_evidence` | FAIL | F001-F009 remain unresolved and the current evidence cannot prove a replayable moved package. |
| `feature_catalog_code` | PARTIAL | Current runtime paths are represented in many consumers, but registries and documentation retain retired anchors. |
| `playbook_capability` | FAIL | CI, package, registry, resolver, and moved-harness defects prevent trustworthy operator replay. |

The resource map was absent at initialization as required by the setup contract, so no initialization-time resource-map coverage gate was applied. Synthesis emitted the lineage `resource-map.md`; it currently has zero extracted references because the review ledger records inspection claims rather than resource-observation events.

## Deferred Items

- No new security finding was admitted. Shared path-security, canonical-root, write-guard, context-sink, and production stop-hook checks were inspected and remained coherent on their reviewed surfaces.
- The graph database was unavailable under the requested write-surface restriction. Every iteration records `graphDecision: unavailable`; no graph upsert was attempted.
- Repository build, install, and test commands were not run because the user restricted writes and explicitly required the review to produce findings without running tooling that could write outside the lineage. The report therefore makes no green-test claim.
- Reducer duplicate projection rows were not promoted to findings; canonical identity and evidence are recorded in F001-F009.

## Dimension Expansion Map

| Iterations | Primary dimensions | Review angle |
| --- | --- | --- |
| 1, 5, 7, 10 | Correctness | Workspace/package topology, build/test discovery, fixed-depth roots, final adversarial rescan |
| 2 | Security | Canonicalization, containment, hook executable selection, root trust boundaries |
| 3, 6, 7 | Traceability | Packet metadata, CI/registry/resolver inventories, evidence anchors |
| 4, 8, 9 | Maintainability | Moved package documentation, test harness paths, fixture and support residue |

All ten configured iterations completed. Convergence was telemetry only because the stop policy was `max-iterations`; the final decision remains blocked by the active P0/P1 set.

## Search Ledger

- Scope manifest: `scratch/review-scope.txt`.
- Partitions: 10, 42 entries each.
- Total entries: 420; all entries were present, with no absolute or traversal path.
- Iterations: `iteration-001.md` through `iteration-010.md`, each with a matching delta file.
- Final rescan: all 420 entries plus the final partition; no additional live path consumer was admitted.
- Known old-path matches were classified as active F001-F009, intentional migration/fixture data, or F005 documentation residue.

## Audit Appendix

- Setup bindings were emitted before lineage writes: target, spec folder, target type, all review dimensions, autonomous execution, auto lineage mode, max iterations, convergence threshold, and artifact override.
- Route proof is present in every iteration narrative and delta: `Resolved route: mode=review target_agent=deep-review`, `target_agent: deep-review`, and `agent_definition_loaded: true`.
- The append gateway accepted initialization, scope/order/protocol setup, ten dimension-pass events, all candidate/adjudication events, and ten graph-convergence events through ledger sequence 42 with no gateway rejection and no corruption warning.
- The review wrote only lineage artifacts and did not alter target source, target packet documents, workflows, package manifests, lockfiles, branches, or commits.
- The final narrative verdict is intentionally FAIL: one P0 and eight P1 findings remain active.

Review verdict: FAIL
