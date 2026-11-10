---
title: "Goal: Phase 8: project-scoped-state"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "project scoped state goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/008-project-scoped-state"
    last_updated_at: "2026-11-03T09:15:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: project-scoped-state

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Each project that links `.skilled` keeps its own decision-capture queue and consumed log, so a save in one project never lists or hides another project's answers, and no answer captured before the change goes missing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | State lives in `<root>/.skilled/skills/.state/decision-capture/<projectToken>/`. The token is the first 12 hex characters of the SHA-256 of one canonical root: the git top-level through `realpath`, or the `realpath` of the given directory outside git. The helper resolves the root itself. |
| D2 | `capture-core.mjs` owns `projectToken` and `queueDir`; `decision-record-writer.ts` exports `stateDirPath`; the matcher keeps no copy of the path. A test proves the ESM and TypeScript paths agree for a root, a subfolder and a symlinked path. |
| D3 | Dual-read, single-write: the core's `readQueue` and `readConsumedKeys`, the matcher's `readQueueRecords` and the writer's `readConsumedRows` read the subfolder and the legacy root; only the subfolder is written; `--release` reaches the legacy log; `--scan-orphans` lists only the subfolder. |
| D4 | A project-local folder outside `.skilled` is rejected, because it adds an untracked folder to every linked project. The review's `symlinked_queue_path_escape` stays open as a sanctioned-link exception. |
| D5 | Tests run in temp folders and the session scratchpad, never in this repository's `.skilled/skills/.state/decision-capture/` (parent D4). Code goes to `gpt-6-luna` xhigh fast through cli-codex, falling back to `llmgateway/deepseek-v4.1-flash-1017` max through cli-pi (parent D6). |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` reports `fail 0`, and the writer and matcher vitest suites report no failure.
- [x] The scratch two-project run prints `false` twice, and `match-decision-table.js --scan-orphans --project-root app-b` prints `no session queues with pending records`.
- [x] `rg -c 'STATE_DIR_SEGMENTS' .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` prints nothing.
- [ ] Every row of `acceptance-criteria.md` reads Met.
- [x] `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/008-project-scoped-state --strict` prints RESULT: PASSED.
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
| Planning docs | Done | spec, plan, tasks and acceptance criteria filled 2026-11-03 |
| Baseline | Done | Scratch matcher printed `1 session-a` for `app-b`; hooks lib and bin 99 of 99, writer and matcher 27 of 27 |
| Core, writer, matcher | Done | Hooks 111 of 111; writer, matcher and session-stop 52 of 52; two-project rerun printed `false`, `false` and no pending sessions for `app-b` |
| Docs and playbooks | Open | `decision-capture-save-writer.md` steps 3 to 5 quote the subfolder glob, so AC-010 is Unmet; `tasks.md` T011 |

### Deviations and findings

| Item | Note |
|------|------|
| Consumed-key reader names | The brief named a writer `readConsumedKeys`. The code has `readConsumedKeys` in `capture-core.mjs` and `readConsumedRows` in the writer; the plan dual-reads both. |
| Playbook consumers | Six `decision-capture-*` playbooks read the flat root. They joined the scope so no check reads an empty folder and passes. |
<!-- /ANCHOR:log -->
