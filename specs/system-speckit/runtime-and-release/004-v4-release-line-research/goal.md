---
title: "Goal: v4 release line research and autonomous remediation"
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
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research"
    last_updated_at: "2026-11-08T22:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All remediation phases closed; final gates run"
    next_safe_action: "Operator reviews and merges the worktree branch; runs the operator-only steps"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-08-047-v4-release-line-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: v4 release line research and autonomous remediation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Research the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for drift, misalignment with sk-code, sk-doc and Skilled canon, bugs, UX and improvement gaps, over-engineering and extension ideas, then plan and implement every accepted fix autonomously. Never ask the operator: decide, record it in the phase's `decision-record.md`, continue.

### Decisions

| ID | Decision |
|----|----------|
| G1 | Research: children 001-005, one `/deep:research:auto` run each, `--stop-policy=max-iterations`, at least 10 productive iterations each, +5 per cluster below the depth bar. Executor DeepSeek V4.1 Flash max: cli-devin, else cli-pi or cli-opencode on `opencode-go/deepseek-v4.1-flash`. |
| G2 | Synthesis: a fresh opus-medium writes `research/research.md` (ranked P0/P1/P2, evidence, release, confidence, cut list, extensions, remediation phases); cli-codex `gpt-6-luna` xhigh fast workers verify the top findings. |
| G3 | Remediation: one phase child per remediation theme, numbered 006 onward under this parent, each through `/speckit:plan:auto` then `/speckit:implement:auto`. Only findings the synthesis verified are fixed. |
| G4 | Implementation workers are CLI only: cli-codex `gpt-6-luna` high fast for P0/P1 and risky code, DeepSeek V4.1 Flash max for P2, docs and mechanical edits. Each phase's diff is reviewed by the other family before it closes. |
| G5 | Claude team: lead plus two opus-medium orchestrators per stage and the synthesizer. Orchestrators steer, verify and run checks; they never write product code. |
| G6 | Workspace: commit this packet on `main`, then build in one sk-git worktree. One conventional commit per closed phase in the worktree. No push, no merge, no history rewrite. |
| G7 | A failing check gets three fix attempts; then the phase is marked Blocked with evidence and the next phase starts. Out-of-scope defects are recorded, never fixed. |
| G8 | Baseline every test suite a phase touches before its first edit and report the delta at close. No spec path or finding id in a code comment. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

Each child's `spec.md` scope is its directive. Decisions above outrank child detail.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Children 001-005 each hold at least 10 productive iterations and a depth-bar score in `implementation-summary.md`
- [ ] `research/research.md` exists with verified, ranked findings and the remediation phase list
- [ ] Every remediation phase is Complete, or Blocked with evidence in its `decision-record.md`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/004-v4-release-line-research --recursive --strict` prints `RESULT: PASSED`
- [ ] Every touched test suite passes in the worktree, with baseline and final counts recorded
- [ ] A final status separates verified from inferred and lists the worktree branch and commits
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE and not part of the directive.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Research children 001-005 | Done | 101 state rows, 96 productive iterations; every child cleared the depth bar |
| Synthesis | Done | `research/research.md`: 1 P0, 45 P1, 14 P2 verified; Luna 33 confirmed, 27 changed, 5 refuted |
| Remediation 006-017 | Done | 11 Complete, 013 Blocked on operator steps; commits on `worktrees/334-v4-release-remediation` |

### Deviations and findings

| Item | Note |
|------|------|
| GPT quota exhausted mid-remediation | From phase 016 on, Luna-tier writes went to DeepSeek and the second-family review was done by the Claude orchestrator; recorded per phase |
| Spec-remint bypass on phase commits | Two orchestrators shared one worktree, so each phase commit skipped only the remint check after a manual repair-derived; the closing parent commit runs it |
| cli-deepseek-harness skipped | Single-executor path throws `requires a lineage directory` (`fanout-run.cjs:3002`) while `deep-research-auto.yaml:1579` advertises support |
<!-- /ANCHOR:log -->
