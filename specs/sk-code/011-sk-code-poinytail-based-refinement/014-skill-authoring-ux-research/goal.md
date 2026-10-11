---
title: "Goal: Skill authoring UX research and remediation"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research"
    last_updated_at: "2026-10-10T20:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Skill authoring UX research and remediation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remediate every finding of the skill authoring UX research so the 092 class of authoring errors is stopped where the author works, each fix proven by a check that ran.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | DeepSeek V4.1 Flash at max effort through cli-pi builds, one change per brief; LLM Gateway first, then the cline route, then wait for the reset |
| D2 | A builder report is a claim; the orchestrator reruns every criterion, and each new test fails once before its change |
| D3 | Phases own disjoint files; document content owned by the feature-catalog track is handed off, never edited |
| D4 | One sk-git commit per phase in this worktree; never push or merge |
| D5 | Three failed repairs of one problem stop that phase and are reported |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-authoring-ux-research | `001-authoring-ux-research/goal.md` |
| 002-parent-goal-budget | `002-parent-goal-budget/goal.md` |
| 003-unread-version-fields | `003-unread-version-fields/goal.md` |
| 004-commit-hook-checks | `004-commit-hook-checks/goal.md` |
| 005-changelog-single-bump | `005-changelog-single-bump/goal.md` |
| 006-create-skill-guidance | `006-create-skill-guidance/goal.md` |
| 007-advisor-name-mention-scoring | `007-advisor-name-mention-scoring/goal.md` |
| 008-advisor-surface-hint | `008-advisor-surface-hint/goal.md` |
| 009-advisor-vocabulary-freshness | `009-advisor-vocabulary-freshness/goal.md` |
| 010-validator-false-positives | `010-validator-false-positives/goal.md` |
| 011-remediation-deep-review | `011-remediation-deep-review/goal.md` |
| 012-advisor-doc-target-and-engines | `012-advisor-doc-target-and-engines/goal.md` |
| 013-python-advisor-native-and-parity | `013-python-advisor-native-and-parity/goal.md` |
| 014-gate-index-and-deletions | `014-gate-index-and-deletions/goal.md` |
| 015-freshness-strict-content | `015-freshness-strict-content/goal.md` |
| 016-sk-doc-tooling-followups | `016-sk-doc-tooling-followups/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research --strict --recursive`, run from the repository root, prints RESULT: PASSED for the parent and all sixteen children.
- [ ] `git log --format=%s 5d9c970447..HEAD -- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research`, run from the repository root, lists at least fifteen commits.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research`, run from the repository root, prints RESULT: PASSED.
- [ ] `git status --short`, run from the repository root, prints nothing after the last phase commit.
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
| Research phase moved to child 001 | Done | The packet became a phase parent on the operator's instruction |
| Remediation phases 002 to 009 planned | Done | One child per file area, each with its own goal |
| Phases 002 to 009 built and committed | Done | Each phase closed with its criteria rerun and strict validation |
| Phase 010 added and built | Done | Validator false positives handed off by the feature-catalog track |
| Review findings remediated | Done | Phases 012 to 016 close both P1 and all ten P2 findings of phase 011 |
| Phase 011 review | Done | Five-iteration deep review; 2 P1 and 10 P2 in `011-remediation-deep-review/review/review-report.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Standard packet turned phase parent | The operator asked for the remediation phases as children of this packet. The research moved into 001-authoring-ux-research, and its goal criteria were amended to the new paths |
| Criteria amended to sixteen children and fifteen commits | Phases 012 to 016 joined from the operator's fix round on the phase 011 review |
| Criteria amended from nine to ten children and commits | Phase 010 joined after the plan, from a handoff by the feature-catalog track |
| Criteria amended from ten to eleven children | Phase 011 adds the deep review of phases 002 to 010 |
| Phase 003 dropped the version removal | The reader search showed the changelog and commit-hook phases stop the drift at far lower cost |
<!-- /ANCHOR:log -->
