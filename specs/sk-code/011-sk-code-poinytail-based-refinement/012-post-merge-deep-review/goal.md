---
title: "Goal: Post-merge deep review"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review"
    last_updated_at: "2026-10-10T18:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-012-post-merge-deep-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Post-merge deep review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Review the 40 commits `ba56b03412..5d9c970447` on main in ten deep-review iterations, confirm the 092 epic's work and its merge resolution are intact, record every confirmed error and open end with a ranked fix, then fix confirmed P2s 1 to 10 except P2 4 in five phase children.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `/deep:review:auto` with `--max-iterations=10 --stop-policy=max-iterations`, executor cli-pi `deepseek-v4.1-flash` at `max` on the DevPass route; `cline-pass/deepseek-v4.1-flash` only if that route fails |
| D2 | The review changes no product file; fixes land only through the phase children, which own disjoint files |
| D5 | Each phase is planned by the orchestrator and built by DeepSeek V4.1 Flash at `max` through cli-pi, one change per brief; the orchestrator verifies every builder report |
| D6 | P2 4 is the master orchestrator's at merge; P2 11 and P2 12 are build nothing |
| D3 | A finding stays only when a rerun command or a read line proves it, and it is marked CONFIRMED with that evidence |
| D4 | Every recommendation kept passes `.skilled/repo-rules/prevent-overengineering.md` |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-hook-stdin-deadlines | `001-hook-stdin-deadlines/goal.md` |
| 002-webflow-runtime-and-references | `002-webflow-runtime-and-references/goal.md` |
| 003-drift-guard-warning-count | `003-drift-guard-warning-count/goal.md` |
| 004-hub-doc-pointers | `004-hub-doc-pointers/goal.md` |
| 005-claim-corrections | `005-claim-corrections/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/deep-review-state.jsonl` prints 10 or more, and `grep -l '"kind":"cli-pi"' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/dispatch-receipts/*.completion.json | wc -l` prints at least 10
- [ ] `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/review-report.md` exists and `grep -c 'CONFIRMED' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/review-report.md` prints at least 1
- [ ] `grep -c 'generate-leaf-manifest.cjs' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/review-report.md` prints at least 1, showing the merge resolution was checked
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review --strict` prints `RESULT: PASSED`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review --recursive --strict` prints `RESULT: PASSED` 6 times and `RESULT: FAILED` 0 times, `git status --short` prints nothing, and `git ls-remote --heads origin "$(git branch --show-current)"` prints nothing
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
| Packet scaffolded | Done | `create.sh --phase --parent` added row 12 to the parent phase map |
| Ten review iterations | Done | 10 iteration records, 10 cli-pi completion receipts, all on the DevPass route |
| Review report | Done | `review/review-report.md`: 0 P0, 0 P1, 12 confirmed epic P2s, known items rerun |

### Deviations and findings

| Item | Note |
|------|------|
| Fix phases added 2026-10-10 | The operator chose to fix confirmed P2s 1 to 10 in phase children; the objective, D2 and criterion 5 amended, D5 and D6 added, binding table added |
| Criterion 1 amended 2026-10-10 | The state log is a projection of the ledger and drops the executor field, so the executor kind is counted in the dispatch completion receipts instead |
<!-- /ANCHOR:log -->
