---
title: "Goal: teach every gate and CI workflow the .skilled root"
description: "The durable directive for the phase that makes hooks and CI check changes under either root and fail loudly when a gate cannot find its script, and the criteria it closes against."
trigger_phrases:
  - "gate readiness phase goal"
  - "skilled gate teaching goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness"
    last_updated_at: "2026-09-16T18:21:34Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive and planning documents"
    next_safe_action: "Wait for phase 004 to validate, then run T001"
    blockers:
      - "Phase 004 has not validated"
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: teach every gate and CI workflow the .skilled root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Before anything moves, every git hook and CI workflow checks changes under `.skilled/` or `.opencode/` and fails loudly when a gate cannot find its script, proven by a check that lives outside the moved tree.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One two-root rule, `.skilled/` first and `.opencode/` second, kept in `.github/scripts/source-root.sh` and copied byte-identical into each gate file. |
| D2 | Where the spec-kit sentinel resolves under either root, a missing gate script never passes: blocking gates block and name the path, and gates that cannot block warn. Any other repository sees no change. |
| D3 | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway makes the literal edits, one workflow or hook section per brief, suite-verified before the next. The block, the missing-script rule, the fail-closed workflows, the check and the drill are drafted by the orchestrator or DeepSeek, reviewed by GPT-5.6 on cli-codex and verified by the orchestrator. |
| D4 | The scripts the gates call and the human-facing text naming `.opencode` stay as they are in this phase. Phase 006 teaches those scripts and phase 009 rewrites that text. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` on the phase tip
- [ ] `bash .github/scripts/tests/broken-move-drill.sh` prints `RESULT: PASSED`, which it does only when every deliberate break failed both the check and its hook
- [ ] The six hook test scripts pass above their 126-case baseline with no case removed, and every new test script passes
- [ ] Every workflow `paths:` entry naming `.opencode/` has a `.skilled/` twin, and no workflow exits 0 on a missing guard
- [ ] Every contract change has a GPT-5.6 review with no open finding
- [ ] The phase validates PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, written on 2026-09-16 against `728c4f3efc` |
| Baseline hook tests | Observed | Six test scripts at `728c4f3efc` pass 126 cases: `pre-commit` 25, `pre-push` 19, `prepare-commit-msg` 51, `commit-msg` 17, `autostash-orphan-guard` 2, `mass-deletion-guard` 12 |
| Implementation | Pending | Waits for phase 004 to validate |

### Deviations and findings

| Item | Note |
|------|------|
| Gate lines moved since phase 001 cited them | Comment hygiene is now `pre-commit:50`, the agent filter `:95` and the parity skip `:180`, with the six parity scripts at `:168-175` |
| "12 of 19 workflows skip on a missing guard" | The workflow count holds and the mechanism does not. Only 6 of the 12 missing-guard conditionals skip, in five workflows, and the other six fail closed. The twelve silent workflows combine those skips with eight path-filtered workflows and one name filter |
| Two pre-push gates disengage silently | `pre-push:52-54` skips the remote-push permission gate, and `:252` skips the compiled-routing guard with no output |
| The agent checker drops names it does not match | `check-agent-mirror-sync.cjs:32` and `:60-68` exit 0 with "nothing verified", so a hook filter that admits `.skilled/agents/` checks nothing there until phase 006 changes the checker |
| The skill-root metadata gate's comment and code disagree | `pre-push:201-203` says the gate blocks, but `:216-229` never exits non-zero, even where it prints "AUTOSYNC BLOCKED". Noted, not changed: this phase follows the code |
<!-- /ANCHOR:log -->
