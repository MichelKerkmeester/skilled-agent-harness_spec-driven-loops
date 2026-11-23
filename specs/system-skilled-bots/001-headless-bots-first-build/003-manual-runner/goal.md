---
title: "Goal: Phase 3: manual-runner"
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
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/003-manual-runner"
    last_updated_at: "2026-11-23T06:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-003-manual-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: manual-runner

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make `bots run <id>` run a manual bot end to end in a shared checkout, refuse what it cannot honor, park a run that needs a person as a needs-you item, and leave one terminal run record that says what ran, how it was confined and where its evidence lives.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The runner accepts `isolation: shared` only and refuses `worktree` before dispatch until worktree isolation exists. |
| D2 | The lease is taken on `loop-lock`, keyed by workflow, repository and spec target, never by a worktree path. |
| D3 | Dispatch is headless through the `cli-external-orchestration` packets with `AI_SESSION_CHILD=1` and an allowlisted environment, and `SKILLED_BOT_RUN_ID` joins `EXECUTOR_COMMON_ENV_ALLOWLIST` (ADR-005). |
| D4 | A run that needs a decision ends `awaiting-decision`, writes one needs-you item and releases its lease. The bot's other runs are refused with `awaiting-decision-hold` until the item is answered or expires (ADR-001). |
| D5 | This phase adds `bots inbox` but no queue code and no `bots answer`, and calls no `launchctl`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `bots run <fixture-id>` exits 0, and `records/` under the identity folder holds exactly one new terminal record that points to its run folder and reads delivery `not-attempted`
- [x] A disabled bot, a paused bot, a precheck that exits non-zero, a precheck that prints `[SILENT]`, an `isolation: worktree` bot and a second concurrent run each end with no dispatch receipt and one record naming the refusal reason
- [x] `rg -F` for the fixture's prompt text and for a planted environment value over every log the runner wrote prints nothing
- [x] A fixture child that prints `[NEEDS-DECISION]` leaves one open item in `bots inbox`, no held lease, and a record with exit `awaiting-decision`, stop reason `blockedStop` and class `operator`
- [x] With one open item for a bot, a second run of that bot exits with the refusal code and cause `awaiting-decision-hold` and no dispatch receipt, and once the item is answered or expired the same run dispatches
- [x] `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing
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
| Goal authored | Done | Criteria drawn from spec.md section 5 and acceptance-criteria.md |
| Live verification, 2026-11-22 and 2026-11-23 | Done | Codex live run exit 0, `converged`, one new record, consumer git status unchanged (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:3`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:4`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:5`); OpenCode probe three fixtures PASS (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:43`); Vibe rerun PASS, bots exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:17`). All six criteria above already held; none was newly ticked |
| Completion criteria, after the review rework | Done | Bots suite 17 files, 179 passed (`scratch/bots-suite-rework.txt`); AC-001, AC-002, AC-003, AC-006, AC-013, AC-019 and AC-007 carry the per-criterion evidence. The `rg -F` criterion now covers argv kinds too, since receipts left the run folder |

### Deviations and findings

| Item | Note |
|------|------|
| Review P1 | A Claude Code stream-json child that asked and exited 0 was recorded `converged`; fixed by reading each kind's final answer (T035) |
| Operator decisions D14, D15 | Receipts moved to the user-level state root (ADR-006); the result event goes through the append gateway (ADR-007), which made `runBot` async |
| Operator decision 2026-11-22, "Support read-only now" | OpenCode and Mistral Vibe admitted for read-only bots through a tool-narrowing profile in the shared deep-loop builders (ADR-008). Bots suite 17 files, 184 passed; deep-loop 4039 to 4041 passed. The completion criteria above still hold. The live probes (AC-024, AC-025) await the orchestrator |
| Operator decision 2026-11-22, "Fix all, third review" | The second review's four P1 and three P2 findings were fixed at the source (ADR-008, third review): an OpenCode read-only allowlist checked against the resolved agent, Vibe judged by its export, the checkout path in a lineage-folder prompt, and the three runner hardening fixes. Bots suite 17 files, 191 passed; deep-loop 4041 passed, unchanged. The completion criteria above still hold. The live probes (AC-024, AC-025) await the orchestrator |
<!-- /ANCHOR:log -->
