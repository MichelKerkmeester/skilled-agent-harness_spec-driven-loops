---
title: "Feature Specification: Phase 9: review-closeout"
description: "Implements the review recommendations the operator accepted on 2026-10-26: an outside skill's broken quality row errors only where it applies, configured checks from a committed config need a trust grant, the node syntax check runs as a bounded pool, the two declaredSurfaces readers get a parity test, and the packet records and criteria are corrected."
trigger_phrases:
  - "review closeout"
  - "phase 9 review closeout"
  - "quality gate trust opt-in"
  - "trust repo checks grant"
  - "scoped checklist errors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 9: review-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9, the review closeout of the parent packet, built after every other phase |
| **Predecessor** | 008-runner-limit-closeout, and 006-measurement, which closed the packet before the review |
| **Successor** | None |
| **Handoff Criteria** | The ten requirements pass on the branch head, the five-run timing record exists in `evidence/timing.json`, every phase folder passes `validate.sh --strict`, and the whole packet passes recursive strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Make sk-code-quality a codebase-agnostic, executable author gate specification. A fresh reviewer read the finished packet and gave a list of recommendations. The operator accepted all of them on 2026-10-26 with the words "Go, all is accepted as recommended". This phase implements them, so no accepted item stays as prose in a review note.

**Scope Boundary**: The outside-skill fault rule in the runner, the trust grant for configured checks and the doctor's read of it, the node syntax check's concurrency and its timing record, one parity test for the two `declaredSurfaces` readers, the @code QUALITY step's runner path, and the record fixes in the eight earlier phases, packet 053's goal and the parent spec. It does not change the verdict schema name, the exit codes, the built-in sensors' findings or the added lines rule.

**Dependencies**:
- Phases 001 to 008 are Complete. This phase edits files they created: `quality-gate.cjs`, its tests and `runner-contract.md` from 002, `quality-config.md`, `configured-checks.test.cjs` and the doctor script from 003, the @code agent from 005, and the 006 records.
- `quality-gate.cjs` is edited by three requirements. REQ-001, REQ-002 and REQ-003 run in that order, one after the other, so no two lanes edit the file at once.
- `specs/system-speckit/053-ci-workflow-efficiency/goal.md` belongs to another packet. REQ-008 edits one criterion and its amendment row there and nothing else.

**Deliverables**:
- The scoped outside-skill fault rule and the `config.warnings` array.
- The `skilled.trustRepoChecks` grant, the `SKIPPED_UNTRUSTED` state and its repair line, the trust section in `quality-config.md` and the doctor's read-only trust report.
- The bounded `node --check` pool and `evidence/timing.json` with five full runs.
- `declared-surfaces-parity.test.cjs`.
- The @code QUALITY step that names the runner by the loaded skill's location, in the source agent and its mirrors.
- The confirmation lines in phases 001 to 008, the restored 006 scope criterion, the labelled 006 NFR, the benchmark README note, the narrowed 053 criterion and the parent spec fixes.
- The version bumps and changelog entries, and the packet changelog at landing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found that the gate still trusts too much and claims too much in a few places. One malformed quality row in any installed skill turns every run into `ERROR`, even when that skill's surface touches none of the files in scope. A committed `.sk-code/quality.json` in a cloned repository runs its commands the moment the gate runs, with no grant from the operator, while the git hooks already ask for one. The node syntax check spawns one `node --check` after another, the 50-file timing was never recorded as five full runs with per-check durations, and the two `declaredSurfaces` readers can drift with no test to catch it. Several records also say something the work no longer supports: the @code step names a `.skilled/` path that a foreign repository lacks, the decisions still read as pending confirmation, 006 AC-021 lost its scope check, and the parent spec names seven phases and three rule sources for UNKNOWN.

### Purpose
The gate errors only on faults that affect the files it checks, runs a repository's commands only after a stated grant, meets its timing budget with a recorded measurement, and every record in the packet says what is true on 2026-10-26.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scope the outside-skill quality faults to the files in scope, and list the rest in a non-gating `config.warnings` array.
- Gate configured checks on a trust grant, report `SKIPPED_UNTRUSTED` without one, and let the doctor report the trust state without changing it.
- Run the per-file `node --check` calls as a bounded concurrent pool, and record five full timed runs with per-check `duration_ms`.
- Add a parity test for the hub's `declaredSurfaces` reader and the advisor plugin's copy.
- Point the @code QUALITY step at the runner through the loaded sk-code skill's location, in the source agent and every mirror.
- Record the operator's confirmation in phases 001 to 008, and correct the 006, 053, benchmark README and parent spec records the review named.
- Bump the version and write the changelog entry of every skill packet this phase touches, and the packet changelog at landing.

### Out of Scope
- The verdict schema name `code-quality-run/v1` and the five exit codes. `config.warnings` is an added field, and `SKIPPED_UNTRUSTED` reuses exit 4, so no reader breaks.
- Folding the advisor plugin's `declaredSurfaces` copy into the hub reader. Parent ADR-006 keeps the copy, and the parity test catches the drift it leaves open.
- An in-process JavaScript parser for the syntax check. ADR-003 keeps `node --check`.
- Any change to the git hook trust key `skilled.trustRepoHooks` or the hooks that read it. ADR-001 keeps the two grants apart.
- Any other criterion or row in packet 053. Only completion criterion 3 and its amendment note move.
- The version numbers themselves. The conductor picks them at landing, as parent G5 says.

### Files to Change

| File Path | Change Type | Requirement | Description |
|-----------|-------------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Edit | REQ-001, REQ-002, REQ-003 | The outside-skill fault rule scoped to applying surfaces with `config.warnings`, the trust check before configured checks with `SKIPPED_UNTRUSTED`, and the bounded `node --check` pool |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Edit | REQ-001, REQ-003 | A fault on a non-applying surface warns, a fault on an applying surface errors, and the pool gives the same findings as one-at-a-time |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` | Edit | REQ-002 | The trust cases: hub repository, `skilled.trustRepoChecks` true in local git config, explicit `--config`, `skcode.qualityConfig` stored in the repository's own `.git/config`, and none of them |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Edit | REQ-001, REQ-002 | `config.warnings`, the scoped fault rule, the `SKIPPED_UNTRUSTED` state and its exit |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Edit | REQ-002 | Section 8 trust boundary names the grant, the four ways to hold it and the repair line |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Edit | REQ-002 | `status` reports the trust state read-only |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Edit | REQ-002 | The doctor reports trusted and untrusted, and writes no git config |
| `specs/sk-code/015-quality-agnostic-gate/009-review-closeout/evidence/timing.json` | Create | REQ-003 | Five full runs over 50 files, wall time and per-check `duration_ms`, with the machine and HEAD |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` | Create | REQ-004 | Fails when the hub reader and the plugin copy return different labels |
| `.skilled/agents/code.md`, `.claude/agents/code.md`, `.pi/agents/code.md`, `.codex/agents/code.toml`, `.hermes/skills/agent-code/SKILL.md` | Edit, Regenerate | REQ-005 | The QUALITY step names the runner by the loaded sk-code skill's location. The mirrors follow the source through the mirror tooling |
| `specs/sk-code/015-quality-agnostic-gate/00[1-8]-*/decision-record.md`, `implementation-summary.md`, `spec.md`, `acceptance-criteria.md` | Edit | REQ-006 | The operator confirmation of 2026-10-26 on every decision that waited for it, and the 005 outside-skill fault rule marked amended by this phase |
| `specs/sk-code/015-quality-agnostic-gate/006-measurement/acceptance-criteria.md`, `006-measurement/spec.md` | Edit | REQ-007 | AC-021 restored to a scope check, and NFR-P01 labelled a reference-machine figure with five runs |
| `.skilled/skills/sk-code/benchmark/README.md` | Edit | REQ-007 | Folders dated before the renderer are legacy, and `--check` does not apply to them |
| `specs/system-speckit/053-ci-workflow-efficiency/goal.md` | Edit | REQ-008 | Criterion 3 excludes only the CodeQL workflow's `dynamic` runs, by workflow name |
| `specs/sk-code/015-quality-agnostic-gate/spec.md` | Edit | REQ-009 | The four UNKNOWN rule sources, the phase count in the purpose line, and the confirmed ADR statuses |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `README.md`, `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Edit | REQ-010 | Version bumps at the numbers the conductor picks |
| `.skilled/skills/sk-code/changelog/`, `.skilled/skills/sk-code/sk-code-quality/changelog/`, `.skilled/skills/sk-code/sk-code-skilled/changelog/` | Create | REQ-010 | One entry per changed skill packet |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/sk-code-skilled/SKILL.md` | Regenerate | REQ-010 | `sync-skills-hermes.cjs` copies of the edited `SKILL.md` files, never written by hand |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-009-review-closeout.md` | Create | REQ-010 | Packet changelog, written at landing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `CHECKLIST_OUTSIDE_SKILL` or `CHECKLIST_ROW_INVALID` fault in an outside skill's quality block or row makes the gate `ERROR` only when that skill's surface applies to at least one file in scope. Otherwise the fault is listed in a new `config.warnings` array, each entry with its code, the skill and the reason, and the gate, the exit code and every other field are what they would be without the fault. `runner-contract.md` states the rule and the array. Two fixture cases cover it: a fault on a surface no file in scope reaches warns, and the same fault with a file of that surface in scope errors. |
| REQ-002 | A configured check from a committed `.sk-code/quality.json` runs only when one of four grants holds: the operator named the file with `--config`, `skcode.qualityConfig` is stored in the repository's own `.git/config`, not through an include, `git config --local --bool skilled.trustRepoChecks` prints `true` in the repository under test, or the repository under test shares its git common dir with the checkout that holds the runner. Without a grant each configured check reports the new state `SKIPPED_UNTRUSTED` with the repair line `git config --local skilled.trustRepoChecks true`, and a required one makes the run `UNVERIFIED` with exit 4. The built-in checks run as before. `quality-config.md` section 8 names the grant and the four ways to hold it, `runner-contract.md` defines the state, and the doctor's quality leg reports the trust state without writing any git config. |
| REQ-003 | The `syntax-node` built-in check runs its per-file `node --check` calls as a bounded concurrent pool and returns the same findings, in the same order, as the one-at-a-time loop. The 50-file timing is measured again over five full runs, each with its wall time and the per-check `duration_ms` the verdict reports, and recorded in `009-review-closeout/evidence/timing.json` with the machine, the core count and the HEAD. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A new test, `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs`, calls the hub reader `declaredSurfaces` in `router-replay-lib.cjs` and the copy in `.skilled/plugins/system-skill-advisor.js` on the same inputs and fails when the two return different labels. |
| REQ-005 | The @code agent's QUALITY step names the runner by the loaded sk-code skill's location, not by a `.skilled/...` path relative to the repository root, so the step works in a repository with no `.skilled/` tree. The source agent and each runtime mirror carry the same wording, and the mirror check passes. |
| REQ-006 | Every decision in phases 001 to 008 that waited for operator confirmation records the confirmation of 2026-10-26, in that phase's `decision-record.md`, `implementation-summary.md`, `spec.md` and `acceptance-criteria.md` wherever the pending wording appears. The 005 decision on outside-skill faults is marked amended by this phase, with REQ-001 as the new rule. |
| REQ-007 | 006 AC-021 is a scope check again: the files 006's commits changed, from `git diff --name-only` over 006's commit range, are compared with the files-to-change list in 006 `plan.md`. 006 `spec.md` NFR-P01 is labelled a reference-machine figure measured over five runs. `.skilled/skills/sk-code/benchmark/README.md` says that report folders dated before the renderer are legacy and that `--check` does not apply to them. |
| REQ-008 | Completion criterion 3 in `specs/system-speckit/053-ci-workflow-efficiency/goal.md` leaves out only the `dynamic` runs of the CodeQL workflow, matched by workflow name, rather than every `dynamic` run. Its amendment note says so. |
| REQ-009 | The parent `spec.md` ADR-001 decision names all four rule sources an UNKNOWN surface gets, as `phase-detection.md` Iron Law 3 lists them: the universal floor, the runner's built-in checks, the quality mode's surface-neutral checklists the runner lists, and the checks the repository's quality config names. The purpose line names the phases that exist rather than seven. Every ADR status in parent section 5 reads `Accepted, confirmed by the operator 2026-10-26`, and the section says none was reversed. |
| REQ-010 | Each skill packet this phase touches, the sk-code hub, sk-code-quality and sk-code-skilled, carries a version bump and a changelog entry, and the packet changelog exists at landing. The conductor picks the numbers. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0` with the new warning, trust and pool cases in it.
- **SC-002**: A run in a fixture repository with a committed config and no grant prints `SKIPPED_UNTRUSTED` for each configured check, names `git config --local skilled.trustRepoChecks true`, and exits 4 when one is required.
- **SC-003**: `evidence/timing.json` holds five full runs, each wall time under 2000 ms on the reference machine, with per-check `duration_ms`.
- **SC-004**: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` exits 0, and fails when one reader is changed by hand.
- **SC-005**: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0, and `rg -c 'node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md` prints `0`.
- **SC-006**: `rg -n 'pending operator confirmation' specs/sk-code/015-quality-agnostic-gate` prints no line.
- **SC-007**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Three requirements edit `quality-gate.cjs` | Parallel lanes would overwrite each other's edits | REQ-001, REQ-002 and REQ-003 run in sequence, and each lane re-reads the file before its first edit |
| Dependency | Packet 053's goal belongs to another program | An edit outside criterion 3 changes that packet's contract | REQ-008 edits criterion 3 and its amendment row only, and the lane diffs the file before and after |
| Risk | The trust grant turns existing configured runs into `SKIPPED_UNTRUSTED` | A repository that relied on its config sees exit 4 after the update | The hub repository holds a grant by default, the repair line is one command, and the changelog names the change |
| Risk | A concurrent pool reorders findings or loses a stderr line | The verdict changes for the same input | The pool collects results by input index, and a case compares the pool's findings with the one-at-a-time loop on the same files |
| Risk | The timing figure is machine specific | A slower machine misses the budget | The figure is labelled a reference-machine figure with the machine, core count and HEAD beside five runs |
| Risk | A warning is ignored where it should block | A broken row on an applying surface could hide | Only a non-applying surface warns, and a case proves the applying one still errors |
| Risk | Record edits in 001 to 008 collide with other agents editing those folders | A lost edit or a merge conflict | The REQ-006 lane runs after the other lanes land, and re-reads every file before its edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full run over 50 changed files finishes under 2000 ms on each of five runs on the reference machine, an Apple M5 Max with 18 cores. This is a reference-machine figure, recorded in `evidence/timing.json`, and never asserted in a test.
- **NFR-P02**: The `node --check` pool is bounded by the core count, so a 50-file run never starts more child processes than the machine has cores.

### Security
- **NFR-S01**: No configured command from a committed config runs without one of the four grants REQ-002 names.
- **NFR-S02**: The doctor reads the trust state and never writes it. Only the operator sets `skilled.trustRepoChecks`.

### Reliability
- **NFR-R01**: The pool's findings match the one-at-a-time loop on the same files, in content and in order.
- **NFR-R02**: A fault on a non-applying surface changes no field of the verdict except `config.warnings`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no `.js` or `.mjs` file in scope reads `syntax-node` as `NOT_APPLICABLE`, and the pool starts nothing.
- Maximum length: 50 changed files is the measured scope. A larger scope runs through the same bounded pool.
- Invalid format: `skilled.trustRepoChecks` set to a value that is not a git boolean reads as no grant, with the repair line.

### Error Scenarios
- One `node --check` call crashes or times out: that file's finding is reported as before, and the other calls in the pool finish.
- Git is absent: neither git config grant can be read and no git common dir can be compared, so only `--config` applies.
- A fault sits in a skill whose surface applies to one file of many: the gate errors, because one applying file is enough.

### State Transitions
- Partial completion: a pool cut short by the deadline reports the files it did not reach as unverified, never clean.
- Session expiry: N/A. The runner keeps no state between runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Seven code and test files, five agent copies, about thirty record files across eight phases, one foreign goal, and the version and changelog files |
| Risk | 15/25 | A new trust gate that changes what runs, a concurrency change in a blocking check, and record edits in folders other agents touch |
| Research | 5/20 | The reviewer named each item and the operator accepted each one. The work reads code to place the changes |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocks the phase. The operator accepted every recommendation on 2026-10-26, and the three choices the work needed are recorded in `decision-record.md`.
- The version numbers are picked by the conductor at landing, because other lanes move the same skills.
<!-- /ANCHOR:questions -->

---
