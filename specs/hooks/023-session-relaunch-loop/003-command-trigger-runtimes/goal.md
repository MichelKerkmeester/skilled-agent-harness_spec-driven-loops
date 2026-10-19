---
title: "Goal: Phase 3: command-trigger-runtimes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "command trigger runtimes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/003-command-trigger-runtimes"
    last_updated_at: "2026-10-16T20:16:22Z"
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
# Goal: Phase 3: command-trigger-runtimes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Codex, Cursor, Devin and Hermes sessions can enter the session relaunch loop through `skilled-loop` and `/speckit:handoff`, with an automatic trigger only where a spike captured the event firing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each runtime gets a spike verdict of `AUTO`, `COMMAND-ONLY` or `BLOCKED`, backed by a quoted help line, source line or captured event. |
| D2 | No adapter or registry row exists for a runtime without a captured firing event. Cursor `stop` is not wired. |
| D3 | A worker never probes its own runtime: SWE probes Codex, Cursor and Hermes, and Luna probes Devin. |
| D4 | Seed syntax for each wrapper case arm comes from that runtime's verified help or a live probe, never from memory. |
| D5 | Live runs and probes that need a model provider use the OpenAI provider with `gpt-6-luna` (parent D7). |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The phase README runtime matrix holds four rows (Codex, Cursor, Devin, Hermes), each with a verdict and quoted evidence
- [x] `node --test` on this phase's stub-runtime wrapper tests ends with `fail 0`
- [x] No adapter file or registry row exists for a runtime whose verdict is `COMMAND-ONLY` or `BLOCKED`
- [x] `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` both exit 0
- [x] `validate.sh` on this phase prints `RESULT: PASSED` and all 5 rows in its `acceptance-criteria.md` are Met
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
| Lane 3.1 spike | Done | Verdicts at run-ledger D57 (Codex AUTO), D58 (Hermes AUTO, Cursor COMMAND-ONLY), D62 (Devin COMMAND-ONLY); evidence in `scratch/spike/SPIKE-*.md`; matrix published at `.skilled/hooks/session-relaunch/README.md:13-21` |
| Wrapper arms | Done | codex, cursor, hermes arms D63; devin arm D70; stub suite `skilled-loop.test.cjs` RUNTIME_RELAUNCH_CASES; PG1 node 214/214 `fail 0` |
| Codex adapter + registry | Done | D64, D65; 3 Codex rows are the only registry delta (PG2, run-ledger.md:292) |
| Hermes adapter | Done | D66 via `.hermes/plugins/repo-guards/`; node 200/200 + pytest 57/57 at the lane run |
| Command mirrors | Done | D68 `.hermes/prompts/speckit-handoff.md`; Codex and Cursor resolve to canonical; Devin has no surface; PG3 mirrors PASS 192 |
| Docs family | Done | D78, D82; `validate_document.py` 9/9 rc=0, catalog and playbook validators rc=0 (PG6) |
| Gate PG | Done | Run from the final state at run-ledger.md:290-299: PG1-PG8 PASS, review gap noted for D68 |
| Phase 003 closure docs | Done | This lane: summary, criteria, tasks, goal and spec status completed 2026-10-17 |

### Deviations and findings

| Item | Note |
|------|------|
| Luna quota deviation | D74 and D75 Luna lanes did not run; quota reset was scheduled for 2026-10-22 08:13. Operator answered "Wait for Luna" at H6 earlier, then "I build these two fixes" at D76. Phase 003 docs were reassigned from Luna to SWE at D78. The D68 mirror diff got no Luna review; the orchestrator `sync-prompts-hermes --check` PASS 38 stands in. |
| Hermes provider deviation | The Hermes live run used `--provider llmgateway`, the only configured Hermes provider, despite parent D7/D5 requiring the OpenAI provider with `gpt-6-luna`. Recorded in SPIKE-cursor-hermes.md and the ledger. |
| Scope amendment | Operator answered "Amend the 003 out-of-scope line (Recommended)" at D80; spec.md gained the review-defect clause permitting fixes to defects found by the phase's own reviews. |
| Carried P2 findings | Nine review findings carry to phase 004 (run-ledger.md "Carried to phase 004 from D77 and D83"), plus the live-check deferral to phase 004 lane 4.5. |
<!-- /ANCHOR:log -->
