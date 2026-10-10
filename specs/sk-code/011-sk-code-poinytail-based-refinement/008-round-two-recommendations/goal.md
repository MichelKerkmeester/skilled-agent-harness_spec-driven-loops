---
title: "Goal: Round-two research recommendations for sk-code"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations"
    last_updated_at: "2026-10-10T07:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-round-two-recommendations"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Round-two research recommendations for sk-code

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build every round-two Ponytail recommendation that still holds against the tree, so restraint requests route, review findings carry a reproducing case, the code agents disclose what they skipped, `ceiling:` markers are reported, the Hermes mirror is gated locally and the repo rules carry the six amendments.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude agents on the haiku model at xhigh effort plan and build each child; they never commit |
| D2 | The orchestrator reruns every criterion in a child's `goal.md` before calling it done, then makes one commit per child in folder order; never push |
| D3 | `AGENTS.md` and `REPO RULES.md` stay unchanged; root-level recommendations land in the repo rule files |
| D4 | A new doctor check that flags another hub's existing drift reports a warning, not a failure, and the drift is recorded |
| D5 | Three failed repairs on one child stop that child; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-restraint-routing | `001-restraint-routing/goal.md` |
| 002-review-contract | `002-review-contract/goal.md` |
| 003-agent-disclosure | `003-agent-disclosure/goal.md` |
| 004-debt-report-and-hermes-gate | `004-debt-report-and-hermes-gate/goal.md` |
| 005-rule-amendments | `005-rule-amendments/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations --recursive --strict` prints `RESULT: PASSED` 6 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/00[1-5]-*/implementation-summary.md | wc -l` prints 5
- [ ] In the worktree, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD | grep -c '/008-round-two-recommendations/'` prints 5, one per child, and `git status --short` prints nothing
- [ ] In the worktree, `node .skilled/bin/compiled-route-guard.cjs` exits 0 listing sk-code `fresh`, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0, and `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` exits 0
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
| 001 restraint routing | Done | Six criteria rerun by the orchestrator; canary 11 cases 0 failures; parity check 5k passes on sk-code and warns only on drift other hubs already had |
| 002 review contract | Pending | Not started |
| 003 agent disclosure | Pending | Not started |
| 004 debt report and Hermes gate | Pending | Not started |
| 005 rule amendments | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Research rows dropped before planning | Rows 8 and 26: the agent copies are symlinks to one directory. Row 28: agent and rule docs hold one `path:line` reference to lint. Rows 14, 24 and 25: already done |
| Build order | 001, 004 and 005 build in parallel, then 002, then 003. 002 and 003 both regenerate every agent mirror, and 001 and 002 both re-mint the compiled sk-code manifest; commits still land in folder order |
| Plan decisions taken by the orchestrator | 002 keeps its section 7 defaults. 003 makes `not_checked` a required RETURN field. 004 anchors the marker at the start of a comment, with no version bump and no SKILL.md edit. 005 adds no firing bullet |
| Move-or-merge rule placed in prevent-overengineering.md | The research suggested `scope-discipline.md` section 2, which defines what is in scope; a restraint on how moves behave fits section 4 of `prevent-overengineering.md` |
<!-- /ANCHOR:log -->
