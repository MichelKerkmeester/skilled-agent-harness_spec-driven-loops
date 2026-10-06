---
title: "Goal: v4.0.0.3 review remediation"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation"
    last_updated_at: "2026-10-06T10:15:28Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: v4.0.0.3 review remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every finding in the v4.0.0.3 release deep review (`specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/review-report.md`, R-01 to R-21, plus R-22 found during planning) and every fix in its Luna halt analysis (`review/luna-halt-analysis.md`, F1 to F8), each with a commit and a test or with a recorded waiver, working in worktree 090 on its current branch.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The four P1s (R-01, R-02, R-03, R-22) go first, and each regression test is observed failing before its fix lands. |
| D2 | P2 order follows the report: sk-git and deep-loop (WS-4, WS-5), then release tail and contract gaps (WS-6, WS-7), then the lineage-prompt fixes F1 to F8. |
| D3 | R-01 uses the reserved review stems for six rows and pins `config_warning` and `lock_released` as bookkeeping (ADR-003). R-03 reads the record back after the rename (ADR-002). |
| D4 | F1 changes `AGENTS.md` as ADR-001 states (accepted by the operator on 2026-10-06). It is written byte-neutral before the Blast-Radius anchor, so `check-rule-copies.js` keeps exiting 0. |
| D5 | No workflow lock edit (R-22, F5 wording) lands before the loop-lock library change (R-03, then R-22) is committed. |
| D6 | One commit per workstream, with a `Spec:` trailer and no attribution lines. Push to `main` only when the operator asks. |
| D7 | Work runs as the seven workstreams and six waves in `plan.md`. Each file has one owning workstream, implementers never commit, and the integrator verifies every return before committing it. |
| D8 | R-22 uses ADR-004: a transient-owner lock is judged by its heartbeat, and every workflow refreshes it per iteration. F5's lock wording lands with it in Phase A. |
| D9 | Implementers run as DeepSeek V4.1 Flash at max effort through `cli-pi` with the `opencode-go` provider, falling back to `cline-pass` at `xhigh`. The integrator verifies and commits every return. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Four regression tests, one each for R-01, R-02, R-03 and R-22, are recorded in `specs/system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation/implementation-summary.md` with a `FAIL` run before a fix commit and a `PASS` run after it.
- [ ] `implementation-summary.md` in that packet maps all 22 findings and all 8 fixes to a commit SHA or to an ADR in `decision-record.md`, with no row left blank.
- [ ] Each test suite listed in that packet's `research/research.md` section 3 has no failing test that is absent from a pre-edit baseline of pass and fail counts recorded in `implementation-summary.md`.
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` each exit 0 at the packet's closing commit.
- [ ] A two-iteration Luna lineage run through `fanout-run.cjs` writes both iteration files, and no lineage transcript ends on a question.
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for `specs/system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation` and for `specs/system-speckit/033-system-speckit-v4`.
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
| Planning (`/speckit:plan :auto`) | Done | spec, plan, tasks, decision record, research, acceptance criteria written 2026-10-06 |
| ADR-001 and ADR-004 acceptance | Done | Operator answers, 2026-10-06 |
| Implementation (`/speckit:implement`) | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| R-22 found in planning | Probe: a second acquire 160 ms later reclaimed a fresh workflow lock; ADR-004 |
| R-14 already fixed | Phase 68's commit `b5353b1f7a` re-derived the 033 metadata; T052 re-checks it at close |
| Level 3 over the recommended 2 | The packet changes a hard-rule document and two shared runtime contracts, which need decision records |
<!-- /ANCHOR:log -->
