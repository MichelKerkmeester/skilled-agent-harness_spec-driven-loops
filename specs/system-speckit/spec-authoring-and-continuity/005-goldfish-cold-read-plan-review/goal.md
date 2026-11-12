---
title: "Goal: Plan-check research built, reviewed and released as v4.0.2.1"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review"
    last_updated_at: "2026-11-11T21:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Plan-check research built, reviewed and released as v4.0.2.1

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every confirmed recommendation of this packet's research is planned, built, reviewed, remediated and released as v4.0.2.1 without a question to the operator.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Run end to end without asking the operator. Settle any open choice, log it and continue. |
| D2 | Specs: GPT Luna xhigh fast on cli-codex, then one fresh Fable 5.2 high review and improvement pass. Children 002 to 006 are Level 2. |
| D3 | Build and remediation fixes: DeepSeek V4.1 Flash max agents on cli-pi, one phase each. 002 lands before 003. |
| D4 | Review: `/deep:review:auto`, 5 iterations, DeepSeek Flash max, through the command workflow, a fresh process per iteration, never `fanout-run.cjs` directly. Remediation is child 007. |
| D5 | A fresh Opus 5.5 high session writes the synthesis. `local-skilled-alignment` runs after it. |
| D6 | Release only when review, synthesis and alignment are clean: update the v4.0.2.1 changelog, commit, push `main`, delete the live `v4.0.2.1` tag and release, republish both at the new commit. Operator authorised 2026-11-11. Rollback: re-push the tag at `3d665d103d`. |
| D7 | Out of scope: the Devin `AGENTS.md` overrun, and deleting `quality_gates`, `circuit_breaker` or `default_level`. |
| D8 | On provider quota exhaustion stop and report. Never re-route a model to another provider. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-research-egm-checks-and-chat-path-gaps/goal.md` |
| 002 | `002-bind-single-entry-executors-to-single-path/goal.md` |
| 003 | `003-refuse-single-lineage-fanout-run/goal.md` |
| 004 | `004-name-file-in-plan-phase-lines/goal.md` |
| 005 | `005-point-chat-sessions-at-authoring-card/goal.md` |
| 006 | `006-repair-speckit-workflow-gates/goal.md` |
| 007 | `007-fix-deep-review-p2-findings-for-plan-check-builds/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `validate.sh <packet> --recursive --strict` prints `RESULT: PASSED`
- [ ] Children 002 to 007 have Status Complete and every `acceptance-criteria.md` row `Met`
- [ ] `fanout-run.cjs` exits non-zero on a one-lineage research matrix without `--allow-single-lineage`, and the deep-loop unit and stress suites pass
- [ ] The system-spec-kit `runtime/cli` suite passes with the regenerated scaffold snapshot
- [ ] `review/review-report.md` covers 5 iterations and no P0 or P1 finding stays open after remediation
- [ ] `synthesis.md` by Opus exists and `local-skilled-alignment` reports no open finding
- [ ] `git ls-remote --tags origin v4.0.2.1` names the commit holding this work, and the v4.0.2.1 changelog lists it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phases scaffolded and specs drafted | Done | Luna dispatches 002 to 006 exited 0 on 2026-11-11; fresh Fable 5.2 high review in `scratch/fable-review-of-phase-specs.md` |
| Build of 002 to 006 | Done | 34 of 34 edits applied by DeepSeek Flash max, exact match, `scratch/build-evidence.md` |
| Deep review | Done | `review/review-report.md`: 5 iterations, CONDITIONAL, P0 0, P1 0, P2 12, 2 deferred checks |
| Remediation, child 007 | Done | 28 of 28 edits applied; full deep-loop suite exit 0, 2,884 passed; `scratch/remediation-evidence.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
| D6 rollback commit corrected | The live tag pointed at `3d665d103d`, not `b7c114b13c`; the first value came from a stale memory note |
| Review executor chosen by the session | The operator named DeepSeek Flash max for build and fixes only; the review uses it too |
| Review orchestrated by a nested Opus 5.5 session | It walked `deep-review-auto.yaml`; every iteration was its own `pi` process |
| Stale council contract recompiled | Commit `ba2647e2c2` left `deep-ai-council.contract.markdown` stale and two suite tests red before this work; one line regenerated |
| Closeout docs written by Luna, not DeepSeek | Evidence recording is spec work under D2; source edits stayed with DeepSeek under D3 |
| Evidence gaps in 005 and 007 settled by the session | Receipts and reasoning in `scratch/build-evidence.md` and child 007 `tasks.md` CHK-002 |
| Goal amended: binding row 007, criterion 2 covers 007 | Child 007 exists on disk; the operator needs the resent chat slice |
<!-- /ANCHOR:log -->
