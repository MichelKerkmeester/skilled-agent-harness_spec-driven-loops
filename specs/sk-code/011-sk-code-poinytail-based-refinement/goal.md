---
title: "Goal: sk-code Ponytail 5 refinement"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement"
    last_updated_at: "2026-10-09T18:03:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-code Ponytail 5 refinement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build and independently verify phases 002 to 008 so sk-code, its agents, checkers and rules carry the Ponytail 5 research's changes and follow-ups.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | cli-codex (gpt-6-luna, max, fast) builds 002 to 006; haiku xhigh agents build the children of 007 and 008 |
| D2 | An executor report is a claim: the orchestrator reruns every criterion in the phase's `goal.md` itself |
| D3 | Work in one numbered worktree made through sk-git, never raw git; edit only its copy of this packet |
| D4 | Commit in folder order: 002 to 006, then the children of 007 and 008 |
| D5 | Phase done means: all its goal criteria pass, its summary is filled, `repair-derived.cjs --apply` ran and `validate.sh --strict` prints `RESULT: PASSED` |
| D6 | One conventional commit per phase or child in the worktree; never push |
| D7 | Three failed repairs on one phase stop the run; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-ponytail-deep-research | `001-ponytail-deep-research/goal.md` |
| 002-surface-contract-alignment | `002-surface-contract-alignment/goal.md` |
| 003-doctrine-pass | `003-doctrine-pass/goal.md` |
| 004-webflow-checker-fix | `004-webflow-checker-fix/goal.md` |
| 005-review-output-additions | `005-review-output-additions/goal.md` |
| 006-guard-retirement-notes | `006-guard-retirement-notes/goal.md` |
| 007-follow-up-fixes | `007-follow-up-fixes/goal.md` |
| 008-round-two-recommendations | `008-round-two-recommendations/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement --recursive --strict` prints `RESULT: PASSED` 9 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -lr --include=implementation-summary.md 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement | grep -vc /001-ponytail` prints 15
- [ ] In the worktree, `git rev-list --count main..HEAD` prints 16, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD` prints 16 `Spec:` values, one per phase or child, `git status --short` prints nothing, and `git ls-remote --heads origin "$(git branch --show-current)"` prints nothing
- [ ] In the worktree, `node .skilled/bin/compiled-route-guard.cjs` exits 0 listing sk-code `fresh`, and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "code review my obsidian plugin"` prints JSON with `"action":"route"` and no `servingAuthority` key
- [ ] In the worktree, `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` both exit 0, and `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints `PASS: stack-folders`
- [ ] In the worktree, `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` both exit 0
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
| 001 ponytail deep research | Done | `001-ponytail-deep-research/goal.md` log; strict validation passed 2026-10-09 |
| 002 surface contract alignment | Done | Commit `ee78fc56b9`; all seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 003 doctrine pass | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed; three dispatches, all stops were task or brief wording |
| 004 webflow checker fix | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 005 review output additions | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 007 follow-up fixes | Done | Five children planned and built by haiku xhigh agents, each rerun by the orchestrator and committed |
| 006 guard retirement notes | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md in any child | Every child is Level 1; each child goal takes its criteria from its spec's REQ and SC rows and its tasks' verification commands |
| Criterion 3 amended 2026-10-09 | sk-git's commit contract bars phase identifiers in subjects, so the phase is checked through each commit's `Spec:` trailer instead of its subject |
| Criterion 1 count corrected to 8 | `--recursive` validates one level: the parent and its seven direct children. 007's own goal covers its five children (6 PASSED) |
| Research round two 2026-10-10 | Ten more 001 iterations on DeepSeek V4.1 Flash (cli-pi, max), orchestrated by Opus 5.5 high; committed as one more 001 commit, so criterion 3 counts 11 |
| 007 added 2026-10-10 | The operator chose to fix the follow-ups as child 007 with haiku xhigh agents; criteria 1 to 3 counts, D1, D4 and D6 amended to cover it |
| Handed off, not built here | D2 Codex mirror gap (deep-improvement and git hooks) and D4 stdin deadline (hooks); recorded in the parent spec |
<!-- /ANCHOR:log -->
