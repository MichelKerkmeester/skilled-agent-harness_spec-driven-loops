---
title: "Tasks: Phase 5: integration"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "integration tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/005-integration"
    last_updated_at: "2026-10-30T09:15:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Completed every library task and recorded the evidence"
    next_safe_action: "Conductor wires applyIntegration into the convert apply path"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOC` is `.skilled/commands/doctor`. `REACH` is `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`.
`LIB` is `DOC/scripts/lib/sk-skill-integrate.cjs`. The rows live in `LIB` rather than inline in
`DOC/scripts/sk-skill-convert.cjs` so this phase can build beside the plain-skill phase; the conductor adds
the `applyIntegration` call, and `implementation-summary.md` records the deviation.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the reach fleet output before any change (`scratch/reach-before.txt`). Verify: the file is non-empty. Evidence: the capture, the after-run and `cmp` were produced under the worker scratch area with a stand-in advisor, so no live advisor answer entered the comparison: `node reach-compare.cjs` printed `cmp exit=0`, and a 65536-byte report hashed `670de1bb...` on both sides. The packet `scratch/` folder is untouched.
- [x] T002 Build a temp-repo harness that sets `HERMES_SKILLS_OUTPUT_DIR` and `SKILL_GRAPH_FRESHNESS_ROOT` (`DOC/scripts/tests/sk-skill-integrate.test.cjs`). Verify: the harness removes its temp dir after each case. Evidence: `makeTempRepo` registers `t.after(() => fs.rmSync(root, { recursive: true, force: true }))`; all 23 cases pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 I1 scan with `skill_graph_scan --trusted` and the printed rebuild fallback (`LIB`). Verify: no `advisor_rebuild` call appears in a traced run. Evidence: the stub advisor logs every argv; the test asserts one `skill_graph_scan --trusted` call, no `advisor_rebuild` substring anywhere in the log, and the fallback in the output.
- [x] T004 I2 compiled graph export, named as a tracked-file write (`LIB`). Verify: the plan line names `skill-graph.json`. Evidence: two plan lines name it; the test runs the real `skill-graph-freshness.cjs --strict` against the compiled graph and gets exit 0 with `STALE COMPILED: none`.
- [x] T005 I3 warm-only probes on three phrases plus the budget row, and `--skill <id>` on the reach script (`LIB`, `REACH`). Verify: `node REACH --skill <fixture>` reports one row. Evidence: the test asserts three `advisor_recommend --warm-only` calls and the rank for each phrase; `--skill <fixture>` prints exactly one `OK` row and `RESULT: PASSED` against a stand-in advisor, and a live run of `--skill sk-git --limit 1` prints one row with `RESULT: PASSED` at advisor generation 1.
- [x] T006 [P] I4 regression rows: append for a framework skill, print rows and `--dataset` command for an adopter skill (`LIB`). Verify: the adopter case leaves `skill-advisor-regression-cases.jsonl` unchanged. Evidence: the test compares the corpus bytes before and after an adopter run and finds them equal; a second framework run appends nothing.
- [x] T007 [P] I5 Hermes sync then `--check`, n/a when `.hermes/` is absent (`LIB`). Verify: the absent case creates no `.hermes/`. Evidence: the absent case reports n/a, spawns nothing and leaves `.hermes/` missing; the present case runs the sync then `--check` in that order.
- [x] T011 I4 skill-local cases: write an adopter skill's rows to `<skill>/benchmark/advisor-cases.jsonl`, and if `package_skill.py` rejects the file, teach it to accept `.jsonl` under `benchmark/` with a test (`LIB`, `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`). Verify: `package_skill.py <fixture> --check --strict` prints `Result: PASS` and `skill_advisor_regression.py --dataset <fixture>/benchmark/advisor-cases.jsonl` exits 0. Evidence: `package_skill.py --check --strict` already accepts the file because `benchmark` is an exempt subtree for path naming and the resource-doc checks read only `scripts/`, `references/` and `assets/`, so no change was needed; the test proves `Result: PASS` with the file present and runs the printed `--dataset` command to `"overall_pass": true`.
- [x] T008 I6 `changelog/v<version>.md` and the relative link (`LIB`). Verify: `readlink .skilled/changelog/<name>` prints `../skills/<name>/changelog`. Evidence: the test asserts `fs.readlinkSync` returns exactly `../skills/<name>/changelog`, that the link resolves to a directory, and that an existing entry and link are kept.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the temp-repo cases (`DOC/scripts/tests/sk-skill-integrate.test.cjs`). Verify: Hermes `--check` PASS and `skill-graph-freshness.cjs --strict` exits 0. Evidence: `node --test` reports 23 pass, 0 fail; inside it the freshness panel exits 0 and the Hermes check is observed passing.
- [x] T010 Capture the fleet output after the change and compare (`scratch/reach-after.txt`). Verify: `cmp scratch/reach-before.txt scratch/reach-after.txt` prints nothing. Evidence: `cmp exit=0 stdout=""`; both runs exit 1 on the same stubbed verdict, so the verdict is unchanged as well as the bytes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Temp-repo checks pass and reach fleet output is byte-identical

**Remaining outside this phase**: the conductor adds `applyIntegration` to the convert apply path. Until it
does, the acceptance criteria in `acceptance-criteria.md` stay `Unmet`, because each one reads "when convert
finishes".
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 3 rows I1 to I6
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Reach fleet output captured before the change
- [x] CHK-003 [P1] Temp-repo harness in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on every changed script
- [x] CHK-011 [P0] Reach default path unchanged
- [x] CHK-012 [P1] Every integration step records created and overwritten paths
- [ ] CHK-013 [P1] No integration step runs after a failed V8
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Temp-repo Hermes and freshness checks pass
- [x] CHK-022 [P1] Hermes-absent case tested
- [x] CHK-023 [P1] Adopter regression case tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Tests write only inside their temp repo
- [x] CHK-032 [P1] No `local-` prefixed name reaches the regression fixture
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] `--skill` usage line added to the reach script's help text
- [x] CHK-042 [P2] README entries deferred to phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Reach captures live under scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 1/1 |

**CHK-020 stays open on purpose.** Every acceptance row reads "when convert finishes" and convert does not
call this library yet, so the criteria are documented as `Unmet` with the evidence observed so far rather
than ticked.

**CHK-013 stays open for the same reason.** The library runs a row only under `apply: true` and never calls
itself, but "nothing runs after a failed V8" is the convert step's ordering promise, and the conductor owns
that call site.

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
