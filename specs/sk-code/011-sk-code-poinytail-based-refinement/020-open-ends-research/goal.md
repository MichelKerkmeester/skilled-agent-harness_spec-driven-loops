---
title: "Goal: Open ends research"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research"
    last_updated_at: "2026-10-11T16:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Open ends research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer the epic's five open ends with ten-iteration loops whose ranked recommendations cite path:line and pass the overengineering rule.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The five children are independent; each runs in its own worktree branched from the scaffold commit |
| D2 | 001 to 005 are read-only: each writes only under its own folder. 006 builds the approved R1 and R2 from 003 |
| D3 | 001 to 004 run /deep:research and 005 runs /deep:review, 10 iterations each; an early convergence stop is not done |
| D4 | No recommendation fixes probes P4 or P7 or admission scenario DOC-331; that fix is in flight elsewhere |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-doc-version-contract | `001-doc-version-contract/goal.md` |
| 002-fresh-clone-onboarding | `002-fresh-clone-onboarding/goal.md` |
| 003-playbook-catalog-truth | `003-playbook-catalog-truth/goal.md` |
| 004-routing-evaluation | `004-routing-evaluation/goal.md` |
| 005-silent-input-sweep | `005-silent-input-sweep/goal.md` |
| 006-ci-truth-checks | `006-ci-truth-checks/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research -name 'deep-re*-state.jsonl' -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least 5 lines, and every line it prints is 10.
- [ ] `ls specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/00[1-4]-*/research/research.md specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md | wc -l`, run from the repository root, prints 5.
- [ ] `cat specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/00[1-4]-*/research/research.md specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md | grep -E '^\| [RF][0-9]+ \|' | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every recommendation cites a path:line.
- [ ] `cat specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/00[1-4]-*/research/research.md specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md | grep -E '^\| [RF][0-9]+ \|' | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every recommendation names its move from .skilled/repo-rules/prevent-overengineering.md.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research --recursive --strict`, run from the repository root, prints `RESULT: PASSED` 7 times and `RESULT: FAILED` 0 times.
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
| Scaffold | Done | Parent and five children created with create.sh phase mode and `--with-goal`; strict validation passed |
| 001 doc-version contract | Pending | |
| 002 fresh-clone onboarding | Pending | |
| 003 playbook and catalog truth | Pending | |
| 004 routing evaluation | Pending | |
| 005 silent input sweep | Pending | |
| 006 CI truth checks | Done | Catalog and citation jobs built and verified |

### Deviations and findings

| Item | Note |
|------|------|
| Folder number 020 | The orchestrator assigned 020. create.sh `--phase-parent` on 011 appends the next free number (019) and cannot scaffold a new nested parent, so the parent and its five children were created in one phase-mode call with an explicit path instead |
<!-- /ANCHOR:log -->
