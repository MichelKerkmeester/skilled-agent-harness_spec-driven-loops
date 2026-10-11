---
title: "Goal: Open ends remediation"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-021-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Open ends remediation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every recommendation the open ends research kept, Fixed with a command proof or Closed with a written reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The four children are independent; each builds in its own worktree branched from the scaffold commit |
| D2 | `.claude/settings.json` does not change: onboarding R3 is closed by the operator decision of 2026-10-11 |
| D3 | A Closed row's reason cites prevent-overengineering or an operator decision |
| D4 | Each child bumps each skill it touches once; colliding version numbers are renumbered at integration |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-typo-proof-parsers | `001-typo-proof-parsers/goal.md` |
| 002-onboarding-fixes | `002-onboarding-fixes/goal.md` |
| 003-doc-and-catalog-truth | `003-doc-and-catalog-truth/goal.md` |
| 004-routing-parity-ci | `004-routing-parity-ci/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cat specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/00*/implementation-summary.md | grep -cE '^\| (F[0-9]+|U[1-4]|R[0-9]+|(DV|PC)-R[0-9]+) \| (Fixed|Closed) \|'`, run from the repository root, prints 108.
- [ ] `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/00*/implementation-summary.md | wc -l | tr -d ' '`, run from the repository root, prints 4.
- [ ] `for c in specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/00*/; do node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $c | tail -1; done | grep -c 'RESULT: PASSED'`, run from the repository root, prints 4.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation --recursive --strict`, run from the repository root, prints `RESULT: PASSED` 5 times and `RESULT: FAILED` 0 times.
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
| Scaffold | Done | Parent and four children created with create.sh phase mode, `--path`, `--level 1` and `--with-goal`; each child spec lists its ledger rows |
| 001 typo-proof parsers | Pending | |
| 002 onboarding fixes | Pending | |
| 003 doc and catalog truth | Pending | |
| 004 routing parity CI | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Ledger total 108 | 001 has 68 rows (64 findings and 4 unreproduced), 002 has 14, 003 has 17 and 004 has 9 |
| Exit code for F48 | The brief sets exit 2 for every unknown option, while the review row for `dist-freshness.cjs` recommends 64 to match its existing usage code; 001's spec keeps 2 for the new branch and records both codes |
<!-- /ANCHOR:log -->
