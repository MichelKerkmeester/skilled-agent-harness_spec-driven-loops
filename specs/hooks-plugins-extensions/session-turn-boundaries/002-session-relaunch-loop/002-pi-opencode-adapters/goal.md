---
title: "Goal: Phase 2: pi-opencode-adapters"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi opencode adapters goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/002-pi-opencode-adapters"
    last_updated_at: "2026-10-16T20:16:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: pi-opencode-adapters

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Pi and OpenCode sessions hand off automatically at 80% of their context window through the shared session-relaunch core, on each runtime whose usage, nudge, arm and seed surfaces a spike verified.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each runtime gets a spike verdict of `AUTO`, `COMMAND-ONLY` or `BLOCKED`, and only an `AUTO` runtime gets an automatic trigger. |
| D2 | Pi uses `message_end` usage and a model-only `pi.sendMessage({display:false})` nudge. OpenCode uses event `info.tokens` and `experimental.chat.system.transform`, unless the spike disproves either. |
| D3 | Both adapters reuse `relaunch-core.cjs` and `context-usage.cjs` and duplicate no state logic. |
| D4 | Wrapper case arms are added only for runtimes whose interactive seed and name flags the spike verified. |
| D5 | Live runs and probes that need a model provider use the OpenAI provider with `gpt-6-luna` (parent D7). |
| D6 | When the note names a spec folder, the claim seed carries it as a `Spec folder:` clause and the adapters read it from the seed (parent D3). |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The phase README holds a verdict row for Pi and one for OpenCode, each with a quoted help line, source line or captured event. Evidence: run-ledger D27 and D36, plus the spike report verdict table.
- [x] Adapter tests for Pi and OpenCode end with `fail 0`, including a fixture test of one nudge at the threshold and one re-nudge at +5%. Evidence: run-ledger D47, D54 and PG1 report passing suites, including Node 170/170 fail 0, Pi 11/11 and OpenCode plugin 20/20.
- [x] `pi --offline --approve -p "list your available tools" </dev/null` exits 0 and the OpenCode plugin import prints `ok`. Evidence: run-ledger AC-2.3 smokes records isolated-extension Pi rc=0 and OpenCode import output `function`. The plain Pi command returned rc=1 on the pre-existing duplicate `--fast` extension. The import output differs from `ok`.
- [x] For each `AUTO` runtime, the stub-runtime wrapper test asserts the seed, the cwd change and no resume flag. Evidence: run-ledger D36 wrapper arms 20/20, D40 model carry, D43 Pi extension-selection carry and D52 spec-folder carry.
- [x] `validate.sh` on this phase prints `RESULT: PASSED` and all 6 rows in its `acceptance-criteria.md` are Met
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
| Goal authored | Done | Orchestrator, 2026-10-16 |
| Live Pi run 2 test-session save | Done | Written by the live test session's /speckit:save at 14:03; test continuity only, run-ledger.md Live Pi run 2 |
| Phase 002 closure documentation | In progress | Updated the four scoped closure files from run-ledger D25-D60, spike and live-run evidence |
| Strict packet validation | Pending orchestrator metadata refresh | RESULT: FAILED with SOURCE_FINGERPRINT_MISMATCH and description drift in generated metadata outside the four-file scope |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
