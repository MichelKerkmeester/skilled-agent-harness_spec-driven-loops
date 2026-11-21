# Iteration 007: Traceability on the feature-catalog and playbook overlays

## Dispatcher

- Iteration 7 of 10, mode review, dimension traceability (overlays `feature_catalog_code` and `playbook_capability`).
- The iteration number derived from the state log (6 iteration records, so 7) matches the dispatch.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md:17-54`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:334-342`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:92-94,170-181,444-471,1445-1458,1578-1580,2140-2207`
- `.github/workflows/advisory-checks.yml:1-24,138-159`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:6,31,217-232`
- `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:54,63,75`
- `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md:28,82-83,102-103`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-28`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/lane-fusion.md:3,22-35`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md:22`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-fusion.md:28,62`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md:96-100`
- `.skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs:57,66`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:390-1420`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The lane-residue catalog page and the workflow header say the job runs on every push, but pushes trigger it only on `main` and `skilled/**`** -- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md:19 -- The page says the blocking `lane-residue` job "runs its repo mode on every push and pull request". The lane-residue paragraph the epic added to the workflow header (`.github/workflows/advisory-checks.yml:21-23`) says the same thing: "this file runs on every push and pull request with no path filter". The trigger block at `.github/workflows/advisory-checks.yml:3-6` limits `push` to `branches: [main, 'skilled/**']`. The pull-request and no-path-filter parts are accurate. The push part is not: a push to any other branch name, with no pull request open, never runs the gate. The branch filter was already there before the epic (the merge-base diff shows only the comment line changing), so the drift is in prose the epic wrote, not in the trigger.
   Finding class: doc-code drift (feature catalog and workflow comment vs workflow trigger).
   Scope proof: the catalog page and the workflow comment line were both added in this epic (`git log` on the page shows `3e66f2e0303`; `git diff <merge-base> HEAD` on the workflow shows only `+` at the comment line, with the `branches` line unchanged).
   Affected surface hints: `lane-residue-gate-and-cleanup.md:19`, `.github/workflows/advisory-checks.yml:21-23`. Either name the branch filter, for example "on every pull request and on pushes to `main` and `skilled/**`", or say "every pull request".
   Case: a contributor pushes a branch named `feature/x` with a lane term and opens no pull request, so no lane-residue run happens, although both docs say every push is gated.

## Traceability Checks

- `feature_catalog_code` -- partial. Most claims on the lane-residue page match the code:
  - The exit taxonomy is 0/1/2 (`sweep-lane-residue.mjs:92-94`). Parse errors return `EXIT_ERROR` (`:2186-2188`). In machine mode, a NOT_CHECKED check with nothing found gives 2 (`:1578-1580`).
  - The allowlist loader refuses folder and glob rows (`:467-471`).
  - The trigger index has three sidecar outputs (`:175-180`: diagnostics, manifest, variants, plus the index).
  - `askFirst` lists a question only when the running server lists the model (`:1454-1458`).
  - M8 reruns M1 to M3 in each linked worktree (`:1511-1557`).
  - Both listed tests exist with the stated roles (`lane-residue-gate.test.cjs:57,66`; the vitest `describe` blocks at `:417`, `:708`, `:944`).
  - On the scorer-fusion pages, the four lane weights 0.42/0.28/0.13/0.12 match `lane-registry.ts:9-12`, and `laneWeights` is `DEFAULT_SCORER_WEIGHTS` (`advisor-status.ts:349`).
  The only open item is the push-scope wording (R7-P2-001), so the result is partial.
- `playbook_capability` -- pass:
  - `doctor-update-apply.md:54,63,75` and `doctor-update-apply-conversation.md:28,82-83,102-103` describe the same order as `doctor-update-apply.yaml:6`: rebuild prompt, then lane cleanup.
  - Both describe the same question rule: asked only when the server lists the model, which matches `askFirstOf`.
  - Both describe the same answer path: a no binds `--shared-model keep` (`yaml:228`), and the state log never records the answer (`conversation.md:83` greps that `--shared-model` is absent).
  - Every flag the playbooks and the YAML use (`machine --json`, `apply --json [--shared-model delete|keep]`) is accepted by `parseArgs` and `VALUE_FLAGS` (`sweep-lane-residue.mjs:310-324`).

## Integration Evidence

- Workflow: `.github/workflows/advisory-checks.yml` job `lane-residue` (`:138-159`) runs `node sweep-lane-residue.mjs repo` and fails closed when the script is missing.
- Command workflow: `.skilled/commands/doctor/assets/doctor-update-apply.yaml` `phase_7_lane_cleanup` (`:217-232`).
- Playbooks: `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md` and `doctor-update-apply-conversation.md`.

## Edge Cases

- The model is found in the local store while the server is down. M6 is FOUND, `askFirst` is empty, and the YAML runs apply with no `--shared-model`. Apply keeps the model and the run ends `lane_cleanup=remaining`. The code (`:1962`) and the playbook wording ("asks only when a local model server lists it") agree on this. It is design, not drift.
- The "exit 64" in the packet's known context belongs to the advisor CLI's refused health flags (`004-lane-core/plan.md:342`), not to the residue tool. The residue tool's invocation errors exit 2, as the catalog says.

## Confirmed-Clean Surfaces

- Lane-weight values on every scorer-fusion catalog page and playbook page checked.
- The doctor-update cleanup flag set and the exit-code handling across the YAML and both playbooks.
- The test-file roles listed on the catalog page.
- The catalog index entry at `feature-catalog.md:334-342`.

## Ruled Out

- Catalog lane weights drifting from the registry: ruled out (`lane-registry.ts:9-12`).
- Playbook expecting a shared-model question with the server down: ruled out (`askFirstOf`, `:1454-1458`).
- Catalog exit-2 wording disagreeing with parse-error handling: ruled out (`:2186-2188`).
- The "three sidecar outputs" count: ruled out (`:175-180`).

## Next Focus

- Dimension: correctness (third pass) or cross-reference synthesis.
- Focus area: the `spec_code` and `checklist_evidence` core protocols. They are still `pending` in the cross-reference table, so record one explicit result row each against the children's acceptance criteria at the tip.
- Reason: both overlays now have recorded results. The core protocols need a recorded result row before STOP.
- Rotation status: correctness and security have had two passes each; traceability two; maintainability one.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001, R7-P2-001.
- Required evidence: a file:line reference per core-protocol result.

Review verdict: PASS
