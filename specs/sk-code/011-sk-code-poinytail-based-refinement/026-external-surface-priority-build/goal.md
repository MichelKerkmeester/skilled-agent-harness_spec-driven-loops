---
title: "Goal: External surface priority build"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: External surface priority build

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build every verified final recommendation of the 025 research and the 13a ruling, so an external user can drop the example sk-code surfaces, add their own ahead of OpenCode and reach a green check battery.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | 001, 002 and 003 build in parallel from origin/main once this plan is on it; each finished phase goes to main after the operator's go-ahead; 004 starts from origin/main once 002 is on it; 005 starts from origin/main once 001 to 004 are on it |
| D2 | Never push and never merge into main; the operator merges |
| D3 | Only 005 writes the next Skilled release note; v4.0.0.4 stays as shipped |
| D4 | Out: R5 (operator ruling), R6, R10, X11, X20, X23, X24 |
| D5 | A child's report is a claim: rerun its criteria before calling it done; stop a child after three failed repairs of one symptom |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-scaffold-surface-placement/goal.md` |
| 002 | `002-doctor-guard-sync-messages/goal.md` |
| 003 | `003-example-tolerant-drift-guards/goal.md` |
| 004 | `004-router-version-parity/goal.md` |
| 005 | `005-external-user-guide/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `P=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build; [ "$(cat $P/00*/goal.md | grep -c '^- \[ \] ')" = 0 ] && [ "$(grep -l 'completion_pct: 100' $P/00*/implementation-summary.md | wc -l | tr -d ' ')" = 5 ] && echo ok` prints ok.
- [ ] `P=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build; for c in $P $P/00*/; do node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $c | tail -1; done | grep -c 'RESULT: PASSED'` prints 6.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build --recursive --strict` prints `RESULT: PASSED` 6 times and `RESULT: FAILED` 0 times.
- [ ] `f=$(ls .skilled/changelog/skilled/v*.md | sort -V | tail -1); [ "$f" != .skilled/changelog/skilled/v4.0.0.4.md ] && grep -qi 'optional example' "$f" && grep -q 'ROUTER.md' "$f" && echo ok` prints ok.
- [ ] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1 && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs >/dev/null 2>&1 && echo ok`, run on 005's branch, prints ok.

All commands run from the repository root.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planned 2026-10-13 | Done | create.sh phase mode, `--path`, `--level 2`, `--with-goal`, five children; traceability table in `spec.md` maps R1, R2, R3, R4, R7, R8, R9 and 13a to exactly one child each |
| 001 scaffold surface placement | Done | On origin/main (its `Spec:` commits end at `c0831d5c1c`); goal criteria passed on its branch |
| 002 doctor guard and sync messages | Done | On origin/main (its `Spec:` commits end at `0efd5a12b5`); goal criteria passed on its branch |
| 003 example-tolerant drift guards | Done | On origin/main (its `Spec:` commits end at `dd949ccbeb`); goal criteria passed on its branch |
| 004 router version parity | Done | On origin/main (its `Spec:` commits end at `d99ddaff7d`); goal criteria passed after the rebase |
| 005 external user guide | Done | Branch `worktrees/129-surface-guide`, not merged; guide, R4 markers and v4.0.0.5, reader test green, review PASS with advisories; this parent closed on the same branch |

### Deviations and findings

| Item | Note |
|------|------|
| Level 2 for every child | `recommend-level.sh` scores the children 0 or 1 alone (7 to 35 of 100), and the build as a whole 46, Level 2. Level 2 is used because the whole build scores it, sk-create-goal's phase-parent workflow requires each child's `acceptance-criteria.md`, which Level 2 scaffolds, and 022 set the same precedent |
| No phased grandchildren | No phase meets both thresholds of `phase-definitions.md` section 2 (phase score 0 to 10 of 50, levels below 3), so every child is a plain child |
| 004 scope beyond 13a | The changelog twins' version-copy line and `frontmatter-versioning.md:122` also tie `ROUTER.md` to the release version, so 004 drops both with 13a |
| 005 base, operator ruling 2026-10-13 | The operator chose to merge 001 to 004 into main first, each after its own go-ahead; 005 starts from origin/main with all four on it, and no local integration branch is made |
| Builds wait on this plan reaching origin/main | Child worktrees start from origin/main, which lacks this folder until the operator merges `worktrees/124-surface-priority-round-two` |
<!-- /ANCHOR:log -->
