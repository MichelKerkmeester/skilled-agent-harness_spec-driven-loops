# Deep Review Report

Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`

Target type: `spec-folder`

Session: `fanout-luna-max-fast-review-3-1788621363532-a1faj6`

Executor: `cli-cursor model=gpt-5.6-luna-max-fast`

Execution mode: `AUTONOMOUS` detached fan-out lineage

Stop policy: `max-iterations`, 10 iterations; convergence was telemetry-only
until the configured maximum.

## Executive Summary

The review fails the required quality gates. All 10 configured iterations
completed across correctness, security, traceability, and maintainability.
There are 0 active P0, 11 active P1, and 4 active P2 findings. The severity
contract would normally classify an active-P1-only run as CONDITIONAL, but the
required `spec_code` and `checklist_evidence` gates remain partial because the
packet's completion claims contradict observed consumers. The final verdict is
therefore FAIL.

The most recent passes added two live consumer findings: the deployed Claude
stop-hook artifact still probes retired autosave paths while its TypeScript
source uses the moved continuity path (F014), and four active Speckit workflow
assets still instruct the retired `scripts/spec/create.sh` path (F015).

No target source, packet, workflow, package, lockfile, or branch files were
modified. All lineage writes are under this artifact directory.

## Planning Trigger

The packet declares itself complete and says retired-path scans are clean, but
its planning documents still describe the move as a Level-2 planning phase and
the current tree contains live stale consumers. The next action is a bounded
remediation plan: reconcile packet truth, repair all active path consumers,
refresh generated artifacts, and rerun the authoritative verification gates
before any completion claim.

## Active Finding Registry

| ID | Severity | Active claim | Direct evidence | Required disposition |
|---|---|---|---|---|
| F001 | P1 | Packet scope, status, and completion evidence describe incompatible planning and shipped realities. | `spec.md:23-50,62-80`; `acceptance-criteria.md:45-63`; `implementation-summary.md` | Reconcile canonical packet state and evidence before closeout. |
| F002 | P1 | Moved CLI documentation still teaches retired `scripts/` and `memory/` topology. | `runtime/cli/README.md:59-62,121,246`; `runtime/cli/spec-folder/README.md` | Rewrite persistent moved-tree documentation to `runtime/cli` and `continuity`. |
| F003 | P1 | Completion evidence still invokes the removed pre-move level-script path. | `plan.md:115`; `tasks.md:50`; `acceptance-criteria.md:62` | Update the command and replay its evidence from the current path. |
| F004 | P1 | CLI runbook resolves its Vitest config one directory too deep. | `runtime/cli/references/spec-root-alias-retirement-runbook.md:62-66` | Correct the runbook path and verify from its documented working directory. |
| F005 | P2 | Root Vitest documentation and the CLI TypeScript resolver disagree about the authoritative config path. | `vitest.config.ts`; `runtime/cli/tests/task-enrichment.vitest.ts` | Align the comment, resolver, and executable project configuration. |
| F006 | P2 | Stress configuration retains a retired `scripts/tests` exclusion. | `runtime/vitest.stress.config.ts:16-23` | Remove or replace the retired exclusion and add a discovery assertion. |
| F007 | P1 | Nested changelog output override reaches the write sink without the same containment contract as the default path. | `runtime/cli/spec-folder/nested-changelog.ts:628-660,721-725` | Enforce approved-root containment for explicit output paths. |
| F008 | P1 | Review-scope manifest contains three non-existent moved paths. | `scratch/review-scope.txt`; current `runtime/cli` tree and registry | Refresh the manifest against the current tree and resolution-based inventory. |
| F009 | P2 | Execution path map preserves the retired `@spec-kit/scripts` package identity. | `scratch/path-map.json:116-126`; `runtime/cli/package.json` | Reconcile package identity guidance with the shipped workspace contract. |
| F010 | P2 | Script registry dependency metadata retains retired `scripts/` paths. | `runtime/cli/scripts-registry.json:73,156`; `registry-loader.sh` | Rewrite dependency metadata and validate every dependency target. |
| F011 | P1 | CLI test README commands resolve test paths from the wrong working directory. | `runtime/cli/tests/README.md` test commands | Make the documented cwd and Vitest paths agree. |
| F012 | P1 | CLI Vitest runs before the build that supplies its imported `dist` modules. | `runtime/cli/package.json` test scripts; `runtime/cli/tests/validation-engine-coherence.vitest.ts:1-10` | Build the required dist before the dependent test lane or make the dependency explicit. |
| F013 | P1 | Source-dist alignment checker omits the moved `runtime/cli/dist` tree. | `runtime/cli/evals/check-source-dist-alignment.ts` `DIST_TARGETS` | Include the CLI dist target and add a regression test for omissions. |
| F014 | P1 | Deployed Claude stop hook retains retired autosave candidates. | `.opencode/hooks/session-lifecycle/claude/session-stop.js:57-60`; source `.ts:73-76` | Rebuild or regenerate the deployed hook artifact and verify its current candidates. |
| F015 | P1 | Active Speckit plan/complete workflow assets still instruct the retired create path. | `.opencode/commands/speckit/assets/speckit-plan-auto.yaml:535`; corresponding confirm/complete assets | Replace every active `scripts/spec/create.sh` instruction with the current executable path. |

## Remediation Workstreams

1. **Packet truth and closeout evidence:** resolve F001 and F003, then
   regenerate any packet metadata that fingerprints the corrected documents.
2. **Runtime consumer migration:** resolve F002, F004, F010, F014, and F015
   across documentation, registries, workflow assets, and deployed hook
   output.
3. **Verification and generated artifacts:** resolve F005, F006, F011, F012,
   and F013 by aligning configs, test commands, build order, and dist
   freshness coverage.
4. **Traceability and security:** resolve F007–F009 with root-containment
   checks, a regenerated scope manifest, and a current package/path map.

The P1 workstreams must be completed before the packet can receive a pass
verdict. No remediation was implemented by this review.

## Spec Seed

The remediation packet should require:

- one truthful packet lifecycle state and one canonical `runtime/cli`
  workspace contract;
- current continuity, registry, workflow, hook, test, and dist paths;
- explicit existence and source-dist checks for every maintained index;
- root containment for all explicit output overrides;
- acceptance evidence that is replayable from the current checkout;
- generated metadata refresh only after canonical documents and implementation
  state agree.

## Plan Seed

1. Inventory F001–F015 against the current source and generated artifacts.
2. Repair packet claims and every active moved-path consumer.
3. Repair output containment, test discovery/build ordering, and dist target
   coverage.
4. Rebuild generated runtime artifacts and verify source-to-dist alignment.
5. Reconcile the scope manifest and execution path map.
6. Run focused checks, then the whole authoritative verification gate.
7. Update acceptance evidence and only then close the packet.

Rollback is the inverse of the same bounded path-map, generated-output, and
documentation changes before dependent release. No rollback was performed.

## Traceability Status

| Protocol | Result | Reason |
|---|---|---|
| `spec_code` | FAIL | F001 and F003 show that normative packet claims do not match current consumers. |
| `checklist_evidence` | FAIL | Acceptance claims of clean retired-path scans conflict with F014 and F015. |
| `feature_catalog_code` | N/A | Target is a spec folder; no feature catalog is required by this run. |
| `playbook_capability` | N/A | Target is a spec folder; no playbook package is in scope. |

## Deferred Items

- P2 findings F005, F006, F009, and F010 remain active and require the
  remediation plan; none was waived.
- Repository build, install, test, validation, and metadata-generation
  commands were not run because the user restricted the write surface to this
  lineage and explicitly prohibited those commands.
- Graph-backed coverage was unavailable under the lineage-only restriction;
  no graph write was attempted.
- Historical changelog and archive references were not promoted unless they
  resolved to a current active consumer.
- Continuity persistence outside the lineage was not attempted; the requested
  detached review ends at synthesis.

## Resource Map Coverage Gate

No source `resource-map.md` existed at initialization. The emitted
`resource-map.md` records that absence, the graphless fallback, and the
finding-to-evidence map. There were no applied task reports against which to
classify expected versus missing implementation entries.

## Audit Appendix

- Setup bindings were fixed before writes: target, spec folder, target type,
  all dimensions, autonomous execution, auto lineage mode, max iterations,
  convergence threshold, executor, and direct artifact override.
- Ten iteration files and ten matching delta files exist. Each iteration
  ends with its canonical per-pass verdict.
- The ledger gateway accepted initialization, scope/order/protocol setup,
  dimension-pass events, convergence events, and synthesis start through
  ledger sequence 35 without a rejection.
- Convergence remained telemetry-only through iteration 9. Iteration 10
  recorded `decision: incomplete` with `stopCandidate: true` because the
  max-iterations policy was reached while required findings remained.
- Final counts are 0 P0, 11 P1, and 4 P2 active findings; dimensions are
  covered, but required traceability gates remain failed.
- The review is evidence only. It did not modify target implementation,
  packet documents, workflows, package manifests, lockfiles, branches, or
  commits.

Review verdict: FAIL
