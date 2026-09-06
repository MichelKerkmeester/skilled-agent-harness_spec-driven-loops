# Iteration 007: External Consumers, CI And Hooks

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: scan.

## Files Reviewed
- `.github/workflows/changed-packet-validation.yml:24-38,89-97`
- `.github/workflows/strict-pass-freshness-report.yml:32-68,87-101`
- `.opencode/plugins/system-dist-freshness-guard.js:20-27`
- `.opencode/commands/doctor/_routes.yaml:33-43,63-78`
- `.opencode/bin/worktree-session.sh:78-87`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:61-89`
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:32-47`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/inventory.md:74-95,253-272`

## Findings - New
### P1 Findings
1. **External path correctness is source-evidenced but CI and hook execution are not replayed** -- `.github/workflows/changed-packet-validation.yml:28-38` -- the workflow correctly installs from the workspace root and builds shared/runtime, while the freshness workflow invokes the moved sweep path. The packet claims all external consumers are green, but this lineage cannot execute CI, hook adapters or runtime-mirror checks.
- Finding class: matrix/evidence
- Scope proof: Direct reads of both workflows, plugin import, doctor command path and worktree shared-path list.
- Affected surface hints: ["CI install", "freshness sweep", "plugin load", "runtime mirrors"]
- Claim adjudication: {"type":"claim-adjudication","claim":"External consumers resolve the moved CLI path in deployed workflows and hooks","evidenceRefs":[".github/workflows/changed-packet-validation.yml:28-38",".github/workflows/strict-pass-freshness-report.yml:41-59",".opencode/plugins/system-dist-freshness-guard.js:20-27"],"counterevidenceSought":"Read every directly named path and compared it to current package layout.","alternativeExplanation":"The source paths may all be correct while generated dist, symlinks or environment-specific invocation still fail.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"Authorized replay runs workflow-equivalent install/build and loads each configured hook or mirror check."}

### P2 Findings
1. **Worktree provisioning and CI ownership are distributed without one current-state contract** -- `.opencode/bin/worktree-session.sh:78-87` -- the worktree helper shares `runtime/cli/dist` and `runtime/cli/node_modules`, while CI installs at the workspace root and builds runtime. The packet records both surfaces but does not state which process owns freshness for shared artifacts.
- Finding class: matrix/evidence
- Scope proof: Direct comparison of worktree helper shared paths and workflow install/build steps.
- Affected surface hints: ["worktree provisioning", "CI build ownership", "shared dist"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `changed-packet-validation.yml:28-38` | Workflow paths use current workspace root and runtime build. |
| checklist_evidence | partial | hard | `implementation-summary.md:218-229` | Hook and mirror checks are recorded but not replayed. |
| feature_catalog_code | partial | advisory | `worktree-session.sh:78-87` | Shared artifact ownership is implicit. |
| playbook_capability | partial | advisory | `_routes.yaml:33-43,63-78` | Doctor routes name current retrieval and deep-loop tools. |

## Integration Evidence
- The plugin imports `runtime/cli/lib/dist-freshness.cjs` at `system-dist-freshness-guard.js:20-27`.
- The doctor retrieval route invokes `runtime/cli/retrieval/lookup-trigger-index.mjs` at `_routes.yaml:33-43`.
- Worktree sharing names the moved CLI dist and node_modules at `worktree-session.sh:82-86`.

## Edge Cases
- CI's `npm ci` can mutate workspace-local node_modules, which is outside this lineage's write surface and therefore intentionally not run.
- The workflow's `strict-pass-freshness-report` writes `.strict-pass-freshness/report.json`, which is also out of scope for this detached review.

## Confirmed-Clean Surfaces
- Both workflows use the workspace root rather than a deleted sibling `scripts` workspace at the install step.
- The plugin's import path points at current `runtime/cli` source.

## Ruled Out
- Direct CI references to `system-spec-kit/scripts`: none in the reviewed workflow lines.

## Next Focus
- dimension: maintainability
- focus area: fixtures, generated metadata and migration residue
- reason: external path sources are current; inspect remaining fixture and documentation boundaries
- rotation status: new angle
- blocked/productive carry-forward: external source tracing productive; runtime replay pending
- required evidence: workflow invariance fixtures, generated metadata tests and current package docs
- recovery note: none

Review verdict: CONDITIONAL
