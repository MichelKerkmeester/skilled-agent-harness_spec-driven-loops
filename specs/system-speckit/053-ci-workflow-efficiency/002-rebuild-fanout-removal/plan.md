---
title: "Implementation Plan: Phase 2: rebuild-fanout-removal"
description: "Append a [skip ci] token to the trigger-index rebuild commit body, keep the loop-guard trailer last, document it in the workflows README, assert it in the rebuild workflow's vitest suite with a token-stripped negative proof, add the workflow to both spec-kit-check filters, then record a fresh 24 h run-data baseline for every later phase."
trigger_phrases:
  - "rebuild fanout removal plan"
  - "phase 2 rebuild fanout removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: rebuild-fanout-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Node.js 22, TypeScript (vitest), bash |
| **Framework** | GitHub Actions; the spec-kit CLI vitest project (`--project cli`); the repository's `check-gate-inputs.sh` |
| **Storage** | None. The four generated trigger-index files are read-only inputs to this phase |
| **Testing** | `npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts`, `bash .github/scripts/check-gate-inputs.sh`, `gh run list --commit <sha>` |

### Overview
Add `[skip ci]` to the rebuild commit's body line so the pushed rebuild starts no workflow run, and keep `Trigger-Index-Rebuild: ci` as the message's last line so the loop guard still matches. Guard the change with a case in the workflow's own vitest suite, prove the case fails on a token-stripped copy, and add the workflow file to both `spec-kit-check.yml` path lists so the suite runs when the workflow changes. Finish by recording a 24 h run-data snapshot that phases 003 to 009 measure against.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (D1 answered, `gh` authenticated, checkout with spec-kit dependencies installed)

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (new vitest case green, token-stripped variant red, gate-inputs `RESULT: PASSED`)
- [x] Docs updated (`.github/workflows/README.md` rows, spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-producer change with a co-located assertion test: the workflow that writes the message owns the token, and the suite that already executes that workflow's run blocks owns the proof.

### Key Components
- **Commit step** (`trigger-index-rebuild.yml:70-166`): builds the message from three `-m` arguments, subject at `:148`, body at `:149`, trailer at `:150`. This phase appends the token to the body.
- **Loop guard** (`trigger-index-rebuild.yml:33`): `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')`. It reads the message suffix, so the trailer must remain the final line.
- **Push job** (`trigger-index-rebuild.yml:178-322`): pushes the bundled commit with `secrets.TRIGGER_INDEX_PUSH_TOKEN`, which is owned by a ruleset bypass actor (`:274`).
- **Vitest suite** (`trigger-index-rebuild-workflow.vitest.ts`): parses the real workflow YAML (`:187-190`), runs each step's `run:` block under bash against local fixtures (`:652`), and reads the resulting commit message from the fixture origin (`:887-892`). Its `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` override (`:32-35`) exists so an assertion can be shown failing against a broken variant.
- **spec-kit-check filters** (`spec-kit-check.yml:6-31` push, `:34-59` pull request): decide whether the suite runs. Neither list names `.github/workflows/trigger-index-rebuild.yml` today.
- **Gate-input checker** (`check-gate-inputs.sh`): parses every workflow's `paths:` and `paths-ignore:` (`:350-372`), requires a `.opencode/` twin for each `.skilled/` entry (`:110-122`, `:336`), and prints `RESULT: PASSED`. It does not require twins for `.github/` entries.

### Data Flow
A human push changes the corpus → the rebuild workflow regenerates and commits the index → the push job pushes that commit → GitHub evaluates the pushed commit's message → `[skip ci]` suppresses every `push`- and `pull_request`-triggered workflow for that SHA → no downstream run starts, and the rebuild workflow's own run does not start either. The loop guard remains as the second line of defence for a `workflow_dispatch` re-run, which the token does not affect.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `trigger-index-rebuild.yml:148-150` | Producer of the rebuild commit message | update: append the token to the body line | `sed -n '146,152p' .github/workflows/trigger-index-rebuild.yml` |
| `trigger-index-rebuild.yml:33` | Consumer of the message suffix (loop guard) | unchanged, must keep matching | `node -e` suffix check over the message the fixture produced |
| GitHub event scheduler | Consumer of the token | external, behaviour unproven here | `gh run list --commit <sha>` on three rebuild SHAs |
| `trigger-index-rebuild-workflow.vitest.ts:83-84,886-892` | Consumer of the workflow text and the produced message | update: new constant and case | the suite passes; the token-stripped variant fails |
| `spec-kit-check.yml:9,37` | Consumer of the workflow path, decides whether the suite runs | update: name the workflow in both lists | `grep -n 'trigger-index-rebuild.yml' .github/workflows/spec-kit-check.yml` |
| `.github/workflows/README.md:58,75` | Documentation consumer | update: state the skip and the retained guard | `grep -n 'skip ci' .github/workflows/README.md` |
| `message-contract.yml` + `validate-message.mjs` | Consumer of every pushed commit message | unchanged; the new body still passes | `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit <file>` exits 0 (observed on the new text) |
| `check-gate-inputs.sh` | Consumer of every workflow's filters | unchanged | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` (observed baseline: `files=45 inputs_resolved=236 dynamic_inputs=11 twin_pairs=311 failures=0`) |

Required inventories:
- Same-class producers: `rg -n 'Trigger-Index-Rebuild: ci|\[skip ci\]' .github .skilled --glob '!**/node_modules/**'` — today the trailer appears at `trigger-index-rebuild.yml:33,150`, `trigger-index-rebuild-workflow.vitest.ts:84`, and `.github/workflows/README.md:58`; the token appears nowhere.
- Consumers of changed symbols: `rg -n 'endsWith\(github\.event\.head_commit\.message|REBUILD_SUBJECT|LOOP_GUARD_TRAILER' .github .skilled --glob '!**/node_modules/**'`.
- Matrix axes: event (`push`, `pull_request`, `workflow_dispatch`) × commit kind (human, rebuild with token, rebuild with token removed, race-rejected rebuild). Required rows: push+human (all workflows run), push+rebuild with token (0 runs), push+rebuild without token (14 runs, the current behaviour), `workflow_dispatch` (rebuild runs, guard decides), race-rejected push (exits 0, the newer commit's rebuild carries its own token).
- Algorithm invariant: the message's final line equals `Trigger-Index-Rebuild: ci` exactly. Adversarial cases: token in the subject line, token inside the trailer value, token appended after the trailer, trailer quoted in the body. The guard is a suffix match, so only the last case is safe and it is the one the workflow builds.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **D1=A, recorded 2026-10-23 and frozen here.** Option A is the `[skip ci]` token in the commit body: one line, no twin entries, no new YAML pattern. Option B is a push-only `paths-ignore:` on the 9 unfiltered workflows plus `!` negations on the 4 path-filtered ones, 8 entries each, 104 in total across 13 files, with ordering rule 2 amended, for about 2,002 runner-min/day with message-contract left unfiltered (`final-review.md:199-202`). If a later phase reverses D1 to B, tasks T004 to T007 and T010 to T011 are replaced by that edit set and T008 and T009 assert the ignore instead of the token; the baseline and gate tasks are unchanged.
- **One commit for the token and the test.** The suite is red between a test-only commit and a workflow-only commit, and spec-kit-check runs on any change under `.skilled/skills/system-spec-kit/**`. The token and its assertion therefore land in the same commit, so no commit is red and no commit carries an unguarded token.
- **No ephemeral ids in code.** The workflow comment, the test's `it(...)` name and any new comment describe behaviour only. No R-id, D-id or phase number goes into a code comment, a test name or a README row; those ids belong to these spec documents.
- **The trailer is not a place for the token.** It is a suffix match, so the token goes on the body line at `:149` and nowhere near `:150`.
- **The token is a literal.** It is not interpolated from the run, the branch or the corpus, so a crafted corpus path cannot alter the message.
- **R2 is a guard, not a saving.** Its measured saving is 0 runner-min/day; it exists so R1's ~2,073 cannot be undone by a later edit that drops the token or the trailer.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The new case: token present in the body, trailer still last | `npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts` from `.skilled/skills/system-spec-kit/runtime/cli` |
| Negative | The same suite against a copy of the workflow with the token removed | `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH=/tmp/trigger-index-rebuild.no-token.yml` with the same command; expect a non-zero exit naming the new case |
| Integration | Every workflow's filters still parse and twin | `bash .github/scripts/tests/check-gate-inputs.test.sh` then `bash .github/scripts/check-gate-inputs.sh` |
| Manual | The skip holds for a bypass-actor PAT push | `gh run list --commit <rebuild-sha> --json databaseId,workflowName` on three consecutive rebuild SHAs |
| Manual | The new trigger fires | A pull request that touches only `.github/workflows/trigger-index-rebuild.yml` starts the `Spec-Kit Check` workflow for its head SHA (`gh run list --workflow spec-kit-check.yml --commit <head-sha>`) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision D1 | Internal | Green | D1=A (2026-10-23); T001 only verifies `scratch/d1-answer.md` |
| `gh` with `repo` and `actions` scopes | External | Green | No baseline snapshot and no three-rebuild check |
| A checkout with `.skilled/skills/system-spec-kit` dependencies installed | Internal | Yellow in this worktree (no build) | The vitest suite cannot run locally; spec-kit-check still runs it in CI |
| Phase `003-trigger-and-job-hygiene`, `004-setup-caching-provisioning`, `005-slow-and-failing-tests`, `006-sk-code-ci-surface`, `007-workflow-hygiene-on-off-control`, `008-consolidation-decision` and `009-doctor-ci-review-wiring` | Internal | Pending | They measure against this phase's baseline; without it their savings are unanchored |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The token does not suppress runs for a bypass-actor push, or a downstream gate is found to depend on the rebuild commit's statuses.
- **Procedure**: Revert the single commit that carries the workflow line, the test case, the two filter entries and the README rows. The next human push rebuilds the index as it does today, and the fan-out returns on the rebuild that follows. `scratch/baseline-24h/` stays: it records what was measured, and a revert invalidates it by comparison, not by deletion.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (D1, pre-flight capture) ──► Change (token + test + filters + docs) ──► Verify (three rebuilds, gates) ──► Baseline (24 h snapshot)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | D1 answered | Change |
| Change | Setup | Verify |
| Verify | Change, three real rebuilds on `main` | Baseline |
| Baseline | Verify, 24 h of post-merge traffic | `003-trigger-and-job-hygiene`, `004-setup-caching-provisioning`, `005-slow-and-failing-tests`, `006-sk-code-ci-surface`, `007-workflow-hygiene-on-off-control`, `008-consolidation-decision`, `009-doctor-ci-review-wiring` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~10 minutes, mostly the D1 answer |
| Change | Low | ~30 minutes: one workflow line, one test case, two filter entries, two README rows |
| Verify | Low | ~20 minutes of runs, then waiting for three rebuilds |
| Baseline | Med | ~1 hour of collection after a 24 h wait |
| **Total** | | **~2 hours of work across one calendar day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, no data changes
- [ ] Feature flag configured - not applicable; the token is the switch, and D1=A (2026-10-23) is the recorded choice
- [ ] Monitoring alerts set - the three-rebuild check and the 24 h snapshot are the monitoring

### Rollback Procedure
1. Revert the phase commit on `main`.
2. Confirm the next human push starts the rebuild workflow and produces a rebuild commit without the token.
3. Confirm the rebuild SHA shows 14 runs again, which proves the revert took effect.
4. No stakeholder notice is needed; nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The baseline snapshot stays as a record of the measured state; a revert is visible as a divergence from it.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                    ┌───────────────────────┐
                    │ T001  D1 answer       │
                    └───────────┬───────────┘
                ┌───────────────┴───────────────┐
                ▼                               ▼
     ┌────────────────────┐          ┌────────────────────┐
     │ T002  pre-change   │          │ T003  suite        │
     │ run capture        │          │ baseline, green    │
     └─────────┬──────────┘          └─────────┬──────────┘
               └───────────────┬───────────────┘
                               ▼
     ┌─────────────────────────────────────────────────────┐
     │ T004-T013  token, two README rows, SKIP_TOKEN,      │
     │            one case, two filter entries, proofs     │
     └─────────────────────────┬───────────────────────────┘
                               ▼
     ┌─────────────────────────────────────────────────────┐
     │ T014  one commit on main                            │
     └─────────────────────────┬───────────────────────────┘
                               ▼
     ┌─────────────────────────────────────────────────────┐
     │ T015-T018  three rebuild SHAs, loop guard,          │
     │            spec-kit-check, workflow-only PR probe   │
     └─────────────────────────┬───────────────────────────┘
                               ▼
     ┌─────────────────────────────────────────────────────┐
     │ T019  24 h baseline snapshot                        │
     └─────────────────────────┬───────────────────────────┘
                               ▼
     ┌─────────────────────────────────────────────────────┐
     │ T020  acceptance criteria closed with evidence      │
     └─────────────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| D1 answer (T001) | `scratch/d1-answer.md` | A verified `D1=A` line | T004 to T011 |
| Pre-change capture (T002) | `gh` with `repo` and `actions` | `scratch/pre-change/<sha>.json`, 14 rows per SHA | T015's before number |
| Suite baseline (T003) | An installed spec-kit workspace | A green pre-edit run of the workflow suite | T008, T009, T012 |
| Token and README rows (T004 to T007) | T001, T002 | `[skip ci]` on the body line, two README rows | T014 |
| Assertion (T008, T009) | T001, T003 | `SKIP_TOKEN` and one new case | T012, T014 |
| Filter entries (T010, T011) | T001 | The workflow named in both `spec-kit-check.yml` lists | T018 |
| One commit (T014) | T004 to T013 | One commit on `main` | T015 to T020 |
| Three-rebuild check (T015, T016) | T014, three real rebuilds | 0 runs per rebuild SHA and a matching trailer | T019 |
| 24 h baseline (T019) | T014, 24 h of post-merge traffic | `scratch/baseline-24h/summary.md` | Phases 003 to 009 |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001, verify the recorded D1=A answer** - ~2 minutes - CRITICAL
2. **T002, the pre-change capture** - ~10 minutes, three rebuild SHAs - CRITICAL
3. **T004 to T013, the change set** - ~40 minutes, five files and two proofs - CRITICAL
4. **T014, the one commit** - ~10 minutes including `validate-message.mjs` - CRITICAL
5. **T015, three real rebuilds** - one to three days of natural corpus pushes - CRITICAL
6. **T019, the 24 h baseline** - 24 hours of wall clock after the merge - CRITICAL
7. **T020, closure** - ~10 minutes - CRITICAL

**Total Critical Path**: ~1 hour of hands-on work inside a wall-clock window of one to four days, set by the wait for three rebuilds plus the 24 h baseline.

**Parallel Opportunities**:
- T002 and T003 run at the same time: one reads GitHub's run history, the other installs the workspace.
- T005 to T007 (README and workflow text) can be drafted while T003 installs.
- T008 and T009 touch the test file, T010 and T011 touch the workflow file, so the two pairs can be edited in either order after T003.
- T016 and T017 can be checked as soon as the first post-change rebuild lands, without waiting for all three.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Decision and before-state captured | D1 recorded in `scratch/d1-answer.md`; three pre-change SHAs each show 14 runs; the suite is green before any edit | After T001 to T003 |
| M2 | Change committed | One commit on `main` carries the token, the case, both filter entries and both README rows; gate-inputs prints `RESULT: PASSED` | After T014 |
| M3 | Skip proven on real rebuilds | Three consecutive rebuild SHAs show 0 runs; the trailer still ends the message; spec-kit-check is green; a workflow-only pull request starts it | After T018 |
| M4 | Baseline recorded and phase closed | `scratch/baseline-24h/summary.md` records a 24 h total of 2,191 runner-min (the band amended from 1,700-1,850 on 2026-10-25, ADR-006) and 0 runs per rebuild SHA; every acceptance row is `Met` | After T020 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Suppress the fan-out at the commit message, not in thirteen workflow filters

**Status**: Proposed

**Context**: 35 of the 73 push SHAs in the measured window were rebuild commits, and each started 14 runs. The alternative is to teach the 13 downstream workflows to ignore the four generated paths, which needs 104 twin-matched filter entries across 13 files and an amendment to ordering rule 2.

**Decision**: The rebuild workflow writes `[skip ci]` into its own commit body. GitHub then starts no push- or pull_request-triggered workflow for that commit, and no downstream file changes.

**Consequences**:
- One line replaces 104 filter entries, and the twin gate and its ordering rule stay untouched.
- `message-contract` and the report-only freshness recheck no longer see the rebuild commit; both losses are accepted and recorded.
- `main`'s HEAD carries no statuses after a rebuild, so phase 009 resolves the newest non-rebuild SHA.

**Alternatives Rejected**:
- Option B, push-only `paths-ignore` with `!` negations: 104 entries across 13 files and an amended ordering rule 2, for ~2,002 runner-min/day instead of ~2,073.
- A `concurrency` group on the rebuild: it cancels queued runs, not triggers, so 13 runs still start.

The formal records, including D1's recorded answer, its alternative and the design choices this plan freezes, are `decision-record.md` ADR-001 to ADR-005.

---
