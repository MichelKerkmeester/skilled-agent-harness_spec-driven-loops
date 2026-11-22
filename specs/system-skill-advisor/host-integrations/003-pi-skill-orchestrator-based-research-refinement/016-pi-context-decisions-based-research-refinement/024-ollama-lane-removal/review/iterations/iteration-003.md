# Iteration 003: Traceability (acceptance rows, completion state, catalog and playbook)

## Dispatcher
- Iteration 3 of 10, mode review, dimension traceability, lineage new, generation 1. JSONL-derived iteration number (2 prior records + 1) matches the dispatch.
- BINDING: target=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal
- BINDING: maxIterations=10
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal

## Files Reviewed
- `acceptance-criteria.md` rows for 002 (AC-001 to AC-014), 003 (AC-001 to AC-013), 005 (AC-001 to AC-015), 006 (AC-001 to AC-014), 007 (AC-001 to AC-009)
- `goal.md` (parent) sections 3 and 4; `005-shared-embeddings-package/goal.md` log; `005/implementation-summary.md:39`, `:113`; `005/tasks.md:102`, `:195`, `:203`; status rows of every child `spec.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md`
- `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md` (steps 54, 75)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` lines 6, 31, 99, 208-232
- `.github/workflows/advisory-checks.yml` lines 1-30 and 138-159; `.github/workflows/README.md:88`; `008/plan.md:370-377`
- Live re-runs at the tip: residue `repo --json`, `derive-command-bridges.cjs --check`, and the grep verifications of 002 AC-001/005/006/010, 003 AC-003, 005 AC-001/003/008/013, 006 AC-004/005.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Parent goal still reads unstarted: all five completion criteria unchecked and phases 001 to 008 logged as Pending** -- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/goal.md:88` -- Section 3 lists the five criteria as `- [ ]` (lines 88-92) and the section 4 progress table says `Phases 001 to 008 | Pending | Phase map in spec.md` (line 108), while the branch carries every phase commit (for example `1f85a9dd6dd` for 005, `cf702d3fb9e` for 004), the residue check exits 0 at the tip (observed: `live 0`, 47 of 47 allowlist rows matched) and the later log rows record the criterion 3 amendment as done (line 109). The goal is the only source of goal state for the session, so a resumed run reads this packet as not started. The validator passes because it checks shape, not that the checkboxes match the evidence.
   Finding class: completion-metadata drift
   Scope proof: parent `goal.md` sections 3 and 4 only; child goals and spec status rows are covered by the next finding or already read Complete.
   Affected surface hints: parent goal.md completion checklist, goal.md progress table, implementation summary of 008
   Case: a fresh session resumes the packet, reads goal.md, sees five unchecked criteria and phases Pending, and restarts phase work that is already committed.

2. **Phase 005 docs still say Blocked and not committed, though its commit exists and the packages it waited to remove are gone from node_modules** -- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md:78` -- `005/goal.md:78` says `Implemented, not committed`; `005/implementation-summary.md:39` says `Blocked on the operator's npm ci (T053)`; `005/acceptance-criteria.md:67` keeps AC-014 `Unmet`; `005/tasks.md:102` keeps T053 `[ ]`; `005/spec.md:36` status is `Blocked`. At the tip the phase commit `1f85a9dd6dd` exists, and `.skilled/skills/system-skill-advisor/runtime/node_modules/@huggingface` and `.skilled/skills/system-spec-kit/node_modules/@huggingface` are both absent (observed by `ls`), with no `onnx` entry under spec-kit's `node_modules`. Whether the operator ran `npm ci --offline` is UNKNOWN from the packet: no decision-record row or log row records the yes or the run, which is what would confirm it. Either the reinstall happened and AC-014 should be Met with that evidence, or it did not and the parent's "all criteria met" reading must name 005 as the open item. Six children read Complete and 005 alone reads Blocked, so the packet disagrees with itself about its own completion state.
   Finding class: completion-metadata drift
   Scope proof: phase 005's goal, implementation summary, acceptance row AC-014, task T053 and spec status; no other child carries an Unmet row among those walked (002, 003, 006, 007).
   Affected surface hints: 005 goal.md log, 005 implementation-summary.md metadata, 005 acceptance-criteria.md AC-014, 005 tasks.md T053 and CHK-040, parent decision-record.md
   Case: an operator reads 005's implementation summary to learn what is left, sees `Blocked on npm ci`, and either runs an install that was already done or assumes the epic is not mergeable.

3. **The lane-residue gate is documented as running on every push, but the workflow's push trigger only covers `main` and `skilled/**`** -- `.github/workflows/advisory-checks.yml:3` -- The trigger is `push: branches: [main, 'skilled/**']` plus `pull_request` (lines 2-6), yet the job comment says the file "runs on every push and pull request with no path filter" (line 23), the feature catalog says the job "runs its repo mode on every push and pull request" (`.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md:19`), and 008's ADR consequence says "Every push and pull request runs the gate" (`008-cleanup-wiring-and-gating/plan.md:375`). A push to any other branch, such as this `worktrees/497-ollama-lane-removal` branch, runs no gate until a pull request opens. The `SKILLED_CI_FRESHNESS` switch-off is a documented decision (`plan.md:377`, `.github/workflows/README.md:88`) and is not part of this finding. P2 because the pull request path still gates the merge.
   Finding class: doc-to-config claim drift
   Scope proof: the trigger block and the three prose claims named; the job body (fail-closed missing script, repo mode only) matches its docs.
   Affected surface hints: advisory-checks.yml header comment, lane-residue-gate-and-cleanup.md overview, 008 plan.md ADR consequences
   Case: a contributor pushes a lane term to a `worktrees/*` branch without a pull request and expects the documented every-push gate to turn red; no run starts.

## Traceability Checks
- spec_code (partial): re-run at the tip, the load-bearing claims hold: residue repo mode exits 0 with 47/47 rows and no unused row; bridges `--check` prints `"status":"fresh"`, `doctorRoutes 35`, `"changed": []` (002 AC-006, 007 AC-008); the 002 AC-001/005/010 checks, 005 AC-003 (count 0) and AC-013, and 006 AC-005 print what the rows require. Point-in-time rows drifted as later phases intended (see Edge Cases), and the CI trigger claim does not match the workflow (finding 3).
- checklist_evidence (partial): 002, 003, 006 and 007 rows each carry observed output; 005 CHK-040 says spec, plan and tasks are synchronized on "Blocked on T053", which is internally true and stale against the tip (finding 2).
- feature_catalog_code (partial): `lane-residue-gate-and-cleanup.md` names the right four implementation files and three tests, the four modes, `--shared-model delete|keep` (exists at `sweep-lane-residue.mjs` flag list) and the after-rebuild order (`doctor-update-apply.yaml:6`); the every-push claim is wrong (finding 3).
- playbook_capability (pass): `doctor-update-apply.md` step 54 captures the `Lane cleanup` report and answers `no` to the shared model, and step 75 records the `lane_cleanup` state field, matching `doctor-update-apply.yaml:99` and phase 7 at `:217-232`.

## Integration Evidence
- `.github/workflows/advisory-checks.yml` `lane-residue` job: trigger block lines 2-6, switch condition line 140, fail-closed step lines 150-159.
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` action order line 6 (`rebuild.prompt -> lane.cleanup`), `upstream_assets.lane_cleanup` line 31, status vocabulary line 99.
- `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md` lines 54 and 75.

## Edge Cases
- Point-in-time acceptance rows no longer reproduce at the tip, by design of later phases: 003 AC-003 expects `case 'cosine'` once in `advisor-recommend.ts`, now 0 after 004's `cf702d3fb9e`; 005 AC-001 and AC-008 expect the grep to print exactly `sweep-lane-residue.mjs`, now it also prints `sweep-lane-residue.vitest.ts`; 006 AC-004 expects two index files from the `five-lane-fusion` grep, now none after 007's regeneration. Each row says "Given the phase commit", so they are not raised; recorded for synthesis so nobody re-runs them as tip gates.
- Whether `npm ci` ran is UNKNOWN; the absent `@huggingface` folders are consistent with a reinstall or with a `node_modules` that never held them in this worktree.

## Confirmed-Clean Surfaces
- Child spec status rows: 001, 002, 003, 004, 006, 007 and 008 read `Complete`.
- 007 AC-004's allowlist count chain (46 + 4 = 50 at 007) versus 47 at the tip: the later rows were reduced by the alignment passes and 0 are unused.

## Ruled Out
- The `SKILLED_CI_FRESHNESS` gate switch on a "blocking" job: a recorded decision in `008/plan.md:372-377` and the workflow README.
- Missing playbook coverage for the lane cleanup step: covered at steps 54 and 75.

## Next Focus
- Dimension: maintainability
- Focus area: `sweep-lane-residue.mjs` size and structure (about 2200 lines in one module), allowlist reason quality, test fixture realism (the AC-007 socket fixture is a plain file), and stale comments in the edited advisor runtime files.
- Reason: three of four dimensions now have a first pass; maintainability is the last uncovered dimension.
- Rotation status: correctness, security, traceability done (first pass); maintainability remains.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003; skill_agent and agent_cross_runtime overlays not yet run.
- Required evidence: file:line for each maintainability claim; name any comment carrying a packet id.

Review verdict: PASS
