---
title: "Feature Specification: Phase 10: verification-and-release"
description: "Phases 1 to 9 each prove their own slice, but nothing yet proves the whole program left every shipped skill, the routing baselines and CI where they were while the new command works end to end. This phase runs that end-to-end proof and writes the framework release changelog."
trigger_phrases:
  - "verification and release"
  - "phase 10 verification and release"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: verification-and-release

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-mirror-and-template-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every row in section 4 holds on the final tree and on main after merge, recorded with command output in `scratch/after.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: Verification runs and one framework changelog entry. A failing check is repaired in the phase that owns the failing file, not here; this phase reruns until every check holds.

**Dependencies**:
- Phases 1 to 9 closed. Phase 1's baseline of `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs` for every shipped root is the comparison point (design section 5).
- Phase 5's temp-repo harness (Hermes honours `HERMES_SKILLS_OUTPUT_DIR`, freshness honours `SKILL_GRAPH_FRESHNESS_ROOT`) runs the end-to-end conversions.

**Deliverables**:
- `scratch/after.md` with the output and exit code of every check in section 4.
- The framework release entry under `.skilled/changelog/skilled/`, written by create-changelog.
- `scratch/workflow-run.md`, the workflow-level convert run: one run cancelled with the tree unchanged, and one run completed with its four post-checks passing.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The program edits doctor routes, sk-doc docs and manifests, advisor bridges and a skill template. Any of those can move a routing number or a strict verdict without failing the phase that made it. Without one run over the final tree, "no regressions" is a claim, not a measurement.

### Purpose
One recorded run shows the shipped skills, the scorer and replay baselines and the doctor suite unchanged, the new command converting both input kinds to a strict PASS, and CI green on main.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep ^total
total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
exit 0
  "full_corpus_top1": { "correct": 155, "total": 195, "accuracy": 0.7949 }
  "holdout_top1":     { "correct": 49,  "total": 66,  "accuracy": 0.7424 }
  "ambiguity_top1":   { "correct": 19,  "total": 24,  "accuracy": 0.7917, "tau": 0.03 }
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/ci.md --type command
VALID: .skilled/commands/doctor/ci.md
Total issues: 0
exit 0
$ ls .skilled/changelog/skilled | sort -V | tail -1
v4.0.1.1.md
```
Run in the worktree on 2026-10-30 at `66157ee7e6` (the scorer JSON is abridged to the three metrics; the full output also carries buckets and corpus hashes). These are the baselines the final run must match. The validator prints a leading check-mark glyph before `VALID`, omitted here. Its run on an existing doctor router shows the check this phase applies to the new router.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rerun `package_skill.py --check --strict` on every shipped skill and compare with the phase 1 baseline.
- Rerun the advisor scorer baseline and the leaf-route replay and compare with the numbers above.
- Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh`.
- Run a full convert, in phase 5's temp-repo harness, on a scratch plain skill and on a scratch pre-migration skill (a copy of `sk-git` at `ca10a236d2^`, as design section 7 did), each ending strict PASS with a resolving changelog link.
- Check that `/doctor:setup` lists `/doctor:sk-skill check` and `convert`, and that the router passes `validate_document.py --type command`.
- Confirm CI green on main after merge, and write the framework release changelog entry through create-changelog.

### Out of Scope
- Fixing a failing check inside this phase - the owning phase reopens; this phase records the failure.
- Merging or pushing - the operator does that; this phase reads the CI result on main afterwards.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/075-doctor-sk-skill-command/010-verification-and-release/scratch/after.md` | Create | Every check's command, output and exit code |
| `specs/sk-doc/075-doctor-sk-skill-command/010-verification-and-release/scratch/workflow-run.md` | Create | The workflow-level convert run: the cancelled path, the completed path, and the four checks after it |
| `.skilled/changelog/skilled/v<next>.md` | Create | Framework release entry, version after `v4.0.1.1` computed by create-changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every shipped skill that passed `package_skill.py --check --strict` in the phase 1 baseline still passes, and none that failed there changed verdict without a recorded reason. No `local-` root is in the run. |
| REQ-002 | `capture-scorer-eval-baseline.mjs` (no `--write`) reads full corpus 155/195, holdout 49/66 and ambiguity 19/24. |
| REQ-003 | `leaf-route-replay.cjs | grep ^total` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`. |
| REQ-004 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints every suite PASS. |
| REQ-005 | A full convert on a scratch plain skill and on a scratch pre-migration skill each ends with `package_skill.py --check --strict` PASS and a `.skilled/changelog/<name>` link that resolves to a folder holding `v<version>.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `/doctor:setup` lists `/doctor:sk-skill check` and `/doctor:sk-skill convert`: `rg -c "doctor:sk-skill" .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints 2 and a `/doctor:setup` run shows both rows. |
| REQ-007 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` exits 0 with `Total issues: 0`, and the presentation passes `route-validate.sh` menu parity. |
| REQ-008 | CI is green on main: every workflow run for the merge commit concludes `success` or is switched off by its CI switch. |
| REQ-009 | A framework changelog entry for the release exists under `.skilled/changelog/skilled/` and passes `validate_document.py --type changelog`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/after.md` shows every REQ row holding, each with its command output and exit code.
- **SC-002**: Both scratch conversions end strict PASS with a resolving changelog link, and the scratch skills are gone afterwards.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 baseline of strict verdicts | Without it REQ-001 has nothing to compare against | Read it from the phase 1 folder; if missing, reopen phase 1 rather than re-baseline on the final tree |
| Risk | Scratch conversions left in the real `.skilled/skills/` or `.skilled/changelog/` | High | Run them only in the temp-repo harness, then confirm `git status --porcelain` in the worktree shows no skill or changelog path |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: verification phase; it adds no runtime path.
- **NFR-P02**: N/A: no service.

### Security
- **NFR-S01**: No scratch skill uses a `local-` name, and no output in `scratch/after.md` names an operator-local skill or command.
- **NFR-S02**: The scorer baseline runs without `--write`, so no tracked baseline file changes.

### Reliability
- **NFR-R01**: Each check's result is recorded with its exit code and output, never the exit code alone.
- **NFR-R02**: The whole check set reruns after any repair, not only the failed check.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a CI workflow switched off by its repository variable reports success; it counts as switched off, not as a pass of its job.
- Maximum input: all shipped skills in one strict run; the run lists each skill with its verdict.
- Failure path: any baseline number that moves stops the release; the phase records the delta and reopens the phase that caused it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Many checks, two created files |
| Risk | 10/25 | Gate for the release |
| Research | 4/20 | Commands and baselines already known |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which version does the framework entry take? Decision: the next four-part version after `v4.0.1.1`, as create-changelog computes it at release time.
- None else blocks.
<!-- /ANCHOR:questions -->

---


