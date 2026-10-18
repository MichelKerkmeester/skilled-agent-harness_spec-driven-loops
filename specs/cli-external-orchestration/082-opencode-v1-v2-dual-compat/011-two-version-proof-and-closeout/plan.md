---
title: "Implementation Plan: Phase 11: two-version-proof-and-closeout"
description: "Run the whole-tree proof in one session, record the scoped claim only after the proof passes, then reconcile every status and validate the packet recursively."
trigger_phrases:
  - "two version proof and closeout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: two-version-proof-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js test runners, a shell-run doctor battery and Markdown for the claim |
| **Framework** | OpenCode 1.19.3 (`opencode`) and OpenCode 2.0.32 (`opencode2`), both installed on this machine |
| **Storage** | None |
| **Testing** | `node --test` for the plugin and guard suites, `npm test` for the deep-loop runtime, the phase 008 doctor battery on each version and recursive strict validation |

### Overview
This phase runs the closeout proof in one session. It runs every suite against the baseline, runs the doctor battery on both versions and runs recursive strict validation. Only after the proof passes does it record the scoped claim. It then reconciles every status and validates the packet again.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001 to 010 are closed, each with its own strict validation passing
- [ ] `../001-unknowns-and-baseline/baseline.json` exists and holds a count for every suite
- [ ] `opencode --version` and `opencode2 --version` each report a parseable version

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, with evidence
- [ ] `proof.md` records each suite count, each battery result and the recursive validation result
- [ ] Recursive strict validation prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Proof, then claim, then reconcile. The evidence comes first, the claim is written only against passing evidence and the statuses are reconciled last.

### Key Components
- **Proof record (`proof.md`)**: Each suite count against its baseline, each battery result for each version and the recursive validation result.
- **Suite runner (orchestrator)**: The `node --test` and `npm test` runs named in the baseline.
- **Doctor battery (orchestrator)**: The phase 008 battery, run against each pinned binary.
- **Claim writer (DeepSeek through cli-devin)**: Writes the D8 wording into the cli-opencode docs, with the markdown persona inlined.
- **Claim reviewer (Luna through cli-codex)**: Returns findings on the claim text and writes nothing.
- **Reconciler (orchestrator)**: Updates the parent phase map and the child status lines, and fills the acceptance evidence.

### Data Flow
The baseline feeds the comparison. The suite runs and the battery runs write their counts into `proof.md`. A passing proof unlocks the claim. Luna reviews the claim, the orchestrator validates it and then the reconciler reads every child and the parent. Recursive validation confirms the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase fixes no code. A failing suite or battery goes back to the phase that owns the code, and this phase stops at the failure.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered Steps and Dispatch Plan

The orchestrator runs every suite, battery and validator itself, because the claim depends on those results. Only the claim text goes to a dispatch. Steps 9 and 10 are the cross-family pair, because DeepSeek writes the claim and Luna reviews it.

1. **Baseline and record (orchestrator).** Read `../001-unknowns-and-baseline/baseline.json`. Create `proof.md` with a row for each suite and its baseline count. Rollback: delete `proof.md` if the phase is abandoned.
2. **Versions (orchestrator).** Run `opencode --version` and `opencode2 --version`. Record both outputs in `proof.md`. Read only, so no rollback applies.
3. **Plugin suites (orchestrator).** Run each plugin test file named in the baseline with `node --test`. Record each pass count. Read only, so no rollback applies.
4. **Guard suites (orchestrator).** Run `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`. Record each pass count. Read only, so no rollback applies.
5. **cli-opencode and deep-loop suites (orchestrator).** Run the cli-opencode suite named in the baseline. Run `npm test` in `.skilled/skills/system-deep-loop/runtime/`. Record each pass count. Read only, so no rollback applies.
6. **Battery on 1.19.3 (orchestrator).** Run `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` against the 1.19.3 binary, and repeat until the count is stable. Record the exit status and output. Read only, and no install changes (D4).
7. **Battery on 2.0.32 (orchestrator).** Run the same battery against `opencode2`. Never restart or stop the v2 background service (D4). Record the exit status and output. Read only, so no rollback applies.
8. **Stop gate (orchestrator).** Compare every count with the baseline and record the delta. If a count falls below its baseline, or either battery fails, route the failure to its owning phase and stop here. Read only, so no rollback applies.
9. **Write the claim (DeepSeek through cli-devin, persona inlined).** Write the D8 wording with the date from steps 6 and 7 into `cli-opencode/SKILL.md`. Add the same wording to the README and references wherever they name a version. Rollback: copy the pre-claim copy from `scratch/pre-claim/` back over each file, then rerun step 11.
10. **Review the claim (Luna through cli-codex).** Findings only. Luna checks the wording against D8 and reports any word that claims more than the two pinned versions. Read only, so no rollback applies.
11. **Validate the claim (orchestrator).** Run `validate_document.py` on `cli-opencode/SKILL.md` with the skill type, and `validate_skill_package.py` on the cli-opencode folder. Read only, so no rollback applies.
12. **Reconcile (orchestrator).** Save copies of the parent `spec.md`, the parent `goal.md` and each child's status lines into `scratch/pre-reconcile/`. Then update the phase map statuses and add the closeout entry to the parent log. Rollback: copy the saved files back from `scratch/pre-reconcile/`.
13. **Fill evidence (orchestrator).** Fill the Evidence cell of each acceptance row in phases 001 to 010 with the observed output and exit status. Save each file to `scratch/pre-reconcile/` first. Rollback: copy the saved file back.
14. **Recursive strict validation (orchestrator).** Run `validate.sh` on the parent folder with `--recursive --strict`, and require the line `RESULT: PASSED`. Record it in `proof.md`. Read only, so no rollback applies.
15. **Final state (orchestrator).** Run `git status --short`, confirm that only the files named in the spec changed and clear `scratch/` except `.gitkeep`. Rollback: use the saved copies from steps 12 and 13.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Plugin suites and guard suites | `node --test` on each named test file |
| Integration | Deep-loop runtime and cli-opencode suites | `npm test` in the runtime folder, and the cli-opencode suite from the baseline |
| Version proof | Doctor battery on each pinned version | `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` against `opencode` 1.19.3 and `opencode2` 2.0.32 |
| Packet | Recursive strict validation | `validate.sh` on the parent folder with `--recursive --strict` |
| Manual | Not applicable | No user journey applies to a proof run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 010 closed | Internal | Yellow (pending) | The proof cannot start |
| `../001-unknowns-and-baseline/baseline.json` | Internal | Yellow (pending) | Counts cannot be compared |
| Installed `opencode` 1.19.3 and `opencode2` 2.0.32 | External | Yellow (version output not yet read) | The battery cannot run on that version |
| Doctor battery from phase 008 | Internal | Yellow (pending) | The version proof cannot run |
| cli-devin with DeepSeek V4.1 Flash max, and cli-codex with GPT-6 Luna max fast | External | Yellow (not yet run) | The claim cannot be written or reviewed. Retry once, then stop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite regresses, a battery fails on either version, or the claim fails validation.
- **Procedure**: Stop the step. Restore the claim files from `scratch/pre-claim/` if they were written, restore the reconciled files from `scratch/pre-reconcile/`, route the failure to its owning phase and record the stop in `proof.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Step | Depends On | Blocks |
|------|------------|--------|
| 1 Baseline | Phases 001 to 010 closed | 3 to 8 |
| 2 Versions | 1 | 6, 7 |
| 3 to 5 Suites | 1 | 8 |
| 6 and 7 Batteries | 2 | 8 |
| 8 Stop gate | 3 to 7 | 9 |
| 9 Claim write | 8 | 10 |
| 10 Claim review | 9 | 11 |
| 11 Claim validation | 10 | 12 |
| 12 and 13 Reconcile and evidence | 11 | 14 |
| 14 Recursive validation | 12 and 13 | 15 |
| 15 Final state | 14 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Proof (steps 1 to 8) | Medium | Scales with the suite count in the baseline, and each battery repeat |
| Claim (steps 9 to 11) | Low | One writer dispatch, one review and one validation |
| Reconcile and validate (steps 12 to 15) | Medium | Scales with the child count, which is eleven |
| **Total** | | Not estimated in hours. The baseline sets the size. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline counts read from `../001-unknowns-and-baseline/baseline.json`
- [ ] Pre-claim copies saved to `scratch/pre-claim/` before the claim write
- [ ] Pre-reconcile copies saved to `scratch/pre-reconcile/` before any status edit
- [ ] Feature flag: not applicable, because the phase changes no runtime flag

### Rollback Procedure
1. Stop the current step and leave the phase In Progress.
2. Restore the claim files from `scratch/pre-claim/` and the reconciled files from `scratch/pre-reconcile/`.
3. Rerun the validator for each restored file.
4. Record the stop and its reason in `proof.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The phase changes docs and status lines only.
<!-- /ANCHOR:enhanced-rollback -->
