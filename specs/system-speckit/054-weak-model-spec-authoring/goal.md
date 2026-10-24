---
title: "Goal: Make system-spec-kit templates and authoring docs followable by a weak-model agent swarm"
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
    packet_pointer: "system-speckit/054-weak-model-spec-authoring"
    last_updated_at: "2026-10-23T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Make system-spec-kit templates and authoring docs followable by a weak-model agent swarm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A weak-model swarm authors valid, filled spec packets from the system-spec-kit templates, proved by a before and after measured on SWE 2 Max, with no change to the verdict of any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phases 001 to 009, plus one write-recipe child under `041-write-recipe-fixes`. All logic lives in system-spec-kit, never sk-prompt. |
| D2 | The placeholder gate applies to new docs only, through the v2.3 template marker. No existing or external packet gets a new failure. |
| D3 | At most 3 parallel lanes, never two on one file. |
| D4 | Every phase closes on scripted gates plus one read-only review (cli-devin, swe-2-max). |
| D5 | Phase 008 runs the playbooks in a disposable sk-git worktree. |
| D6 | Every phase is Level 3 with its own goal, bound below. |
| D7 | The conductor is a Claude Code session. Execution and verification run on Sonnet 5.5 high subagents. |
| D8 | The benchmark subject is cli-devin swe-2-max. Its 3 baseline runs rerun at the start commit, and phases 005 and 009 compare against them. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-template-drift-census-and-baseline | `001-template-drift-census-and-baseline/goal.md` |
| 002-template-and-example-defect-repair | `002-template-and-example-defect-repair/goal.md` |
| 003-versioned-placeholder-gate | `003-versioned-placeholder-gate/goal.md` |
| 004-template-section-fill-guidance | `004-template-section-fill-guidance/goal.md` |
| 005-weak-model-authoring-card | `005-weak-model-authoring-card/goal.md` |
| 006-speckit-command-and-agent-alignment | `006-speckit-command-and-agent-alignment/goal.md` |
| 007-playbook-catalog-readme-alignment | `007-playbook-catalog-readme-alignment/goal.md` |
| 008-playbook-run-in-worktree | `008-playbook-run-in-worktree/goal.md` |
| 009-authoring-benchmark-and-closeout | `009-authoring-benchmark-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`
- [ ] A new v2.3 core doc with an unfilled `[YOUR_VALUE_HERE: ...]` token passes strict validation while its status is Draft and fails it at any other status, and a v2.2 doc validates as it did before
- [ ] Recursive strict validation over `specs/` gives the same pass and fail counts before phase 003 and after phase 009
- [ ] `check-example-drift.sh` and `check-card-sync.sh` both exit 0 on the final tree
- [ ] The 3 final Level 3 runs all pass strict validation, and none is worse than the SWE 2 Max baseline's worst on leftover_hints, missing_anchors or out_of_scope_writes. The phase 009 report lists min and max for five metrics
- [ ] Every playbook scenario this packet added has a recorded PASS in the phase 008 report, or a FAIL logged with its escalation
- [ ] The swarm commits only on the build worktree and never pushes
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
| Launch precondition 1: workspace chosen (A worktree or B branch) | Done | Operator chose A. `worktree-naming.sh create weak-model-spec-authoring main` created branch `worktrees/217-weak-model-spec-authoring` at `.worktrees/217-weak-model-spec-authoring`, HEAD `ac2be31ec60c3a15db527b3d8400ae68b373984a`, provisioned with `11 installed, 5 built, 3 already present, 0 failed`. |
| Launch precondition 2: `opencode.json` names `llmgateway/deepseek-v4.1-flash-1017` and OpenCode v2 is logged in to llmgateway | Done | `rg -c 'deepseek-v4.1-flash-1017' opencode.json` printed `3`. The session's provider is `llmgateway` on `deepseek-v4.1-flash-1017`, and `opencode2 --version` printed `opencode v2.1.4`, so the conductor's login is live and workers inherit it. |
| Launch precondition 3: three-lane authorization | Done | Given by the operator before planning |
| Launch precondition 4: conductor is an OpenCode v2 session with the goal bound | Done | `opencode_goal({ action: "bind" })` returned `STATUS=OK ACTION=bind`, `mutation=bound`, `packet_bound=true`, goal id `goal-eccd2c3c-89fc-4674-b016-7ab897fad066`; the operator states this session is the conductor on DeepSeek V4.1 Flash max. |
| Launch precondition 2 after the takeover: cli-codex and cli-devin logged in | Done | `codex login status` printed `Logged in using ChatGPT` and `devin auth status` printed `Logged in (via Devin)` on 2026-10-24 |
| Launch precondition 4 after the takeover: conductor is a Claude Code session | Done | The operator handed the run to this session on 2026-10-24 and sets the updated goal before work resumes |
| WORKTREE path | Done | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring` |
| Start commit | `ac2be31ec60c3a15db527b3d8400ae68b373984a` | Phase 001 T003 `git rev-parse HEAD` on the worktree before the first phase write. |
| Phase 001 progress | Done | T001-T014 done. Ledger 72 rows, baseline 3 runs, review 47 findings with 47 T012 lines. `validate.sh --strict` printed `RESULT: PASSED` and the T014 status diff printed 0. |
| Phase 002 progress | Done | T001 to T017 done, 7 of 7 acceptance rows Met, strict `RESULT: PASSED`, suite `SUITE_MATCH`. The phase start commit was re-recorded as `800c89b504`. The operator kept the core and addons rows (phase 003 counts now 14 and 217) and had five disk-fact evidence commands in the phase 001 ledger rewritten |
| SWE 2 Max rebaseline | Done | Level 3 version of the phase 001 T009 task, 3 serial cli-devin swe-2-max runs on templates identical to start commit `ac2be31ec6` (`git diff ac2be31ec6 HEAD -- .skilled` printed nothing). Runs 1 to 3: `leftover_hints` 1, 0, 1, `seconds` 326, 317, 384, all `strict_passed` 1, `missing_anchors` 0, `out_of_scope_writes` 0. Stored in `001-template-drift-census-and-baseline/scratch/baseline-swe-l3/` with `hints-l3.txt` (121 patterns) and `anchors-l3.txt` (spec 7, plan 14, tasks 21, acceptance-criteria 3). Devin sessions `marked-platypus`, `shrub-syringa` and `cautious-utensil` show 0 tool calls naming `baseline-swe`, `bench-packets` or `/private/tmp` |
| BASE_REF | Pending | The git ref phase 008 builds its disposable worktree from. It must contain the phase 002 to 007 changes. Replace Pending with the ref |

### Deviations and findings

| Item | Note |
|------|------|
| Cli-opencode rule 15 L4 | The operator chose DeepSeek Task subagents over a Copilot gpt-6-sol executor. See D8 |
| cli-devin dangerous mode | The operator approved `--permission-mode dangerous` for every cli-devin writer and benchmark dispatch in this packet, which satisfies cli-devin NEVER rule 1. Reviews stay read-only on `--permission-mode auto` |
| Level 2 SWE baseline invalid | The Level 2 runs in `001-template-drift-census-and-baseline/scratch/baseline-swe/` (hints 0, 0, 1) are not a baseline. Devin session `glimmer-tent`, run 2, read run 1's finished packet inside the worktree. The operator chose a Level 3 task instead, and later bench packets are kept outside the worktree |
| Criterion 5 reworded | The operator replaced "the final lowest leftover_hints is below the baseline's lowest" with a no-regression rule, because the Level 3 baseline already reaches 0 hints in one run. To keep the slice under 4000 characters, D1, D2, D3, D7 and criterion 6 lost words without a change in meaning |
| Commit per phase on 2026-10-24 | 041-006 D5 and phase 003 D8 said the operator commits. The operator chose one local commit per phase on the worktree branch, never pushed. 041-006 closed as `72001d694f` |
| Agent executors on 2026-10-24 | The operator directed that the remaining work finish on Claude Code subagents: Sonnet 5.5 at high effort for execution and Haiku 5.5 at xhigh effort for verification, with this session as conductor. This replaces the cli-codex writer in D7 for phases 003 (from T015) to 009. Reviews stay on cli-devin swe-2-max read-only per D4, and the phase 009 benchmark subject stays cli-devin swe-2-max per D8. The operator approved the D7 amendment the same day, and D7 now names these executors |
| Era report fix on 2026-10-24 | Phase 003 OP-1: the manifest bump to v2.3 made `repo-era.mjs` count every v2.2 doc as legacy, so `/doctor:update check` would report about 17,900 pre-v4 docs on a current repo. The operator chose to fix the rule at its source: a stamp counts as legacy only when it is older than v2.2, the first v4-era stamp. It lands as its own local commit after phase 003 and before phase 004, as an amendment to phase 003 D7, with a test and a count check against the start commit. Landed as `2ed9c2e0b9`: templateMarkers went from `{"new":1451,"legacy":17869,"none":510}` to `{"new":16944,"legacy":2376,"none":510}`, equal to the pre-bump script on today's docs, with zero per-doc status differences over 19,830 docs. Phase 003 itself closed as `8b60bfc041` and was independently verified |
| Sonnet only on 2026-10-24 | The operator directed that every subagent from here on runs on Sonnet 5.5 at high effort, verification included. D7 was amended to match. The phase 004 to 009 runbooks were written earlier by Haiku 5.5 xhigh agents and the doctor re-audit by Opus 5.5 medium, all read-only |
| Phase 006 scope extension on 2026-10-24 | The phase 006 runbook found 45 `checklist.md` mentions in 16 command assets outside the frozen 27 rows: 14 `/create:*` workflow files and 2 `/deep:review` workflow files. No `checklist.md` template exists any more. The operator chose to fix them in phase 006: an execution agent drafts extra rows, the swe-2-max review checks them, and the same applier writes them |
| Packet changelog on 2026-10-24 | Phases 004 to 009 say to refresh `../changelog/` at close and no changelog folder existed. The operator chose to create it: each phase from 004 runs `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <phase folder> --write` at close, and the conductor backfills phases 001 to 003 the same way |
| Doctor commands in phase 006 on 2026-10-24 | The parent scope table marks the doctor speckit entries Modify for phase 006, while the phase 006 plan audits them all as OK. The operator ordered a read-only re-audit on Opus 5.5 medium before phase 006 runs. Rows are added only for real authoring findings. Result: 91 doctor files checked with the plan's detectors and wider terms, 0 authoring findings, so the plan's OK stands and phase 006 adds no doctor row. One non-authoring side effect: `doctor-update-check.yaml:140` counts `templateMarkers.legacy` as a pre-v4 signal, which the phase 003 manifest bump inflates (phase 003 OP-1). Report: conductor scratchpad `audit-doctor-006.md` |
| L-A-015 and L-A-016 handoff on 2026-10-24 | The operator accepted the conductor's call: the two missing Level 3 anchors in core `spec.md.tmpl` are not added in phase 003. Phase 004's frozen alignment table removes `risk-matrix` and `user-stories` from the level-3 example instead, and no gate requires them in a scaffold |
| Takeover on 2026-10-24 | LLM Gateway ran out of usage after phase 001. The operator moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, the benchmark subject included, and the review to swe-2-max. D3, D4, D7, D8, the objective and criterion 5 changed. The DeepSeek baseline in phase 001 stays as history. |
<!-- /ANCHOR:log -->
