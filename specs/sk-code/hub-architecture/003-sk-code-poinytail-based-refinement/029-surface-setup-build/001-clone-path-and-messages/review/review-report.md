# Deep Review Report: Clone path and messages

Review of commits `17e465512a`, `dae07e6286` and `d6c30ebdf5` on branch `worktrees/133-surface-setup-build` (diff `a98004816d..d6c30ebdf5`): the README sk-code adapting block gains the provision command and `skilled.trustRepoHooks`, the feature catalog in removal step 6, `regenerate-skill-derived.cjs` in removal step 7, and the surface-count files and `leaf-scopes.json` in add step 3; `compiled-route-guard.cjs` prints the refresh command and both manifest paths per stale hub; `root-router-contract.cjs` relabels an unresolvable `@spec-kit/shared` as `SHARED_NOT_BUILT` naming the provision command, and `ci-skill-root-metadata.cjs` prints it with no stack.

## 1. Executive Summary

- **Verdict:** CONDITIONAL at synthesis, from reducer search debt only; PASS once the three debt items were closed by observed runs (section 9)
- **hasAdvisories:** true
- **Active findings at synthesis:** P0 0, P1 0, P2 1
- **Scope:** 8 files (6 in the commits, plus the phase `spec.md` and `goal.md`), four dimensions, five iterations on cli-devin `deepseek-v4-1-flash-max`. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- Iterations 2 to 5 (security, traceability, maintainability and a correctness recheck) found nothing new across 10 to 22 files each. The one advisory asks whether the doctor still names the provision command after the relabel; the doctor's loader and the fresh-clone run answer it.

## 2. Planning Trigger

`/speckit:plan` is not required: the phase goal (C3) has every confirmed finding fixed or rejected inside this phase.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 1 },
  "remediationWorkstreams": ["none: R1-P2-001 rejected with an observed doctor run"],
  "specSeed": ["none"],
  "planSeed": ["none"],
  "findingClasses": ["cross-consumer"],
  "affectedSurfacesSeed": ["parent-skill-check.cjs loadModule and checkRootRouter 12-lib line"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P2-001 | P2 | Only the CI gate catches the relabeled load failure; the spec's doctor edge case has no coverage | correctness | `root-router-contract.cjs:83`, `ci-skill-root-metadata.cjs:63` | Rejected: the finding's own downgrade trigger holds. The doctor's `loadModule` (`parent-skill-check.cjs:360-368`) catches every error and `checkRootRouter` prints `lib.error.message` with no code check (`parent-skill-check.cjs:1730-1731`). In the fresh clone (ledger L-1) the doctor printed `FAIL: 12-lib: failed to load the root-router contract library: @spec-kit/shared/frontmatter/parse-frontmatter.js is not built here; run bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision . from the repository root` |

## 4. Remediation Workstreams

- None required by the review. One orchestrator-raised wording fix landed beside it: removal step 7 had narrowed `verify-doc-claims` to the hub README, while the tool reports dead paths hub-wide (`ae8777eaa8`).

## 5. Spec Seed

- None: `spec.md` already states the doctor edge case the advisory checked.

## 6. Plan Seed

- None.

## 7. Traceability Status

- **spec_code (core): pass.** R1, R2, R4 and R5 each map to changed lines; goal decisions D1 to D5 hold (iterations 1 and 3).
- **checklist_evidence (core): pass after synthesis.** The ledger rows were outside the review scope (SL-015); they are recorded in `implementation-summary.md` from runs on the build commit.
- **skill_agent, agent_cross_runtime (overlay): not applicable.** No skill doc or runtime file changed.
- **feature_catalog_code (overlay): partial.** Step 6 names both catalog files; both exist on disk.
- **playbook_capability (overlay): unchanged.**
- **AC_COVERAGE:** advisory-shortfall at review time, since the acceptance rows were open; closed with the ledger.

## 8. Deferred Items

- A half-provisioned tree (the `@spec-kit/shared` link present, `dist` never built) still prints Node's own error; recorded as a known limitation in `implementation-summary.md`.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`, stop policy `max-iterations`). Saturated directions: none recorded. Iteration 5 rechecked correctness across 22 files after the other three dimensions.

## 9. Search Ledger

`hasSearchDebt: true` at synthesis, three items, each closed afterwards by an observed run:

| Item | Iteration | Bug class | Closed by |
|------|-----------|-----------|-----------|
| SL-010 | 2 | doc_named_command_blast_radius | In the scratch clone, `worktree-naming.sh provision .` left `git status --short` empty (only ignored `node_modules` and build output), and `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` on the pristine hub changed no tracked file |
| SL-013 | 3 | edge_case_unmapped | The R1-P2-001 rejection above: the doctor's code-agnostic loader and the L-1 output |
| SL-015 | 3 | checklist_evidence_gap | Ledger rows L-1 to L-6 and T1 to T4 in `implementation-summary.md`, run by the orchestrator on the build commit |

## 10. Audit Appendix

- Convergence: graph convergence ran before each iteration as telemetry; stop policy `max-iterations` held the loop to five iterations. Dimension coverage reached 4 of 4 by iteration 4.
- Sources: the diff at `../scratch/review-diff.patch`, the six changed files, `spec.md`, `goal.md`, and the neighbours each iteration read (the pre-commit hook, `install-git-hooks.sh`, the doctor loader).
- Ruled out (iteration 4): duplicated command strings; each command has one code literal and the docs restate it.

### Core Protocols

- `spec_code`: pass. `checklist_evidence`: pass after synthesis.

### Overlay Protocols

- `skill_agent`, `agent_cross_runtime`: not applicable. `feature_catalog_code`: partial. `playbook_capability`: unchanged.
