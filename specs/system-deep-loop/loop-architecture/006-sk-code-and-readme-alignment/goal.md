---
title: "Goal: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
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
    packet_pointer: "system-deep-loop/loop-architecture/006-sk-code-and-readme-alignment"
    last_updated_at: "2026-11-21T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dlh-006-sk-code-and-readme-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every code folder in the system-deep-loop skill carry a README that matches its code and passes the sk-create-readme checkers, and bring its code onto the sk-code checklists wherever that changes no behaviour.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A finding that changes runtime output, exports, CLI flags, exit codes or JSON shapes is built only with operator approval and a test that fails before its fix. Undecided findings get a proposed default and are not built. |
| D2 | Command YAMLs under `.skilled/commands/deep/` are out of scope, because sk-code covers only CI workflow YAML. |
| D3 | Inline-code paths in code-folder READMEs resolve from the README's own folder. |
| D4 | Doc comments cover exported functions, classes and interfaces outside test folders. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `check_readme_references.py` over every skill README prints `fail=0`.
- [x] `check_derived_readme_counts.py` over every skill README prints `fail=0`.
- [x] `runtime/tests/_support/README.md` exists and `audit_readmes.py --document-type code-folder` reports it valid.
- [x] The sk-code quality gate over every tracked skill code file prints NO_BLOCKER_FOUND, and the runtime typecheck exits 0.
- [x] The runtime vitest suite reports 0 failed and at least 3967 passed.
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
| README checkers | Done | `SUMMARY files=79 pass=79 fail=0` from both checkers |
| Support README | Done | code-folder audit: `runtime/tests/_support/README.md valid` |
| Code gate | Done | NO_BLOCKER_FOUND over 582 files, typecheck exit 0 |
| Vitest | Done | 3967 passed, 11 skipped, 0 failed at `fe8909a3a8e` |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline vitest | The baseline run at HEAD showed 2 failed and 9 skipped, and the two tests passed when run alone. The final run showed 0 failed and 11 skipped. The cause of the flip is not confirmed |
| Open findings | Behaviour-changing and undecided findings are listed in `implementation-summary.md` |
<!-- /ANCHOR:log -->
