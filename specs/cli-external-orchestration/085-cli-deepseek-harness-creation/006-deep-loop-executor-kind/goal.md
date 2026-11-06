---
title: "Goal: Phase 6: deep-loop-executor-kind"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep loop executor kind goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/006-deep-loop-executor-kind"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded final unit and validation results"
    next_safe_action: "Resolve the remaining verification gaps"
    blockers: ["Quality review open", "Default-table search open"]
    key_files: ["evidence/focused-suites-after.txt", "evidence/full-unit-current.txt", "evidence/task-verify-outputs.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-006-deep-loop-executor-kind"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: deep-loop-executor-kind

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** `cli-deepseek-harness` is a closed, unit-tested deep-loop executor kind that dispatches dsh safely and stays experimental.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The env allowlist adds prefix `LLMGATEWAY_` and single keys `DSH_HOME` and `OPENCODE_API_KEY`, and admits neither `DEEPSEEK_` nor a blanket `DSH_` |
| D2 | The binary map entry is `'cli-deepseek-harness': 'dsh'` with no self-presence exemption |
| D3 | State env is `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` plus `DSH_HOME`, and the default home is `.dsh` |
| D4 | The preventive sandbox capability stays false and MCP stays off in this phase |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] vitest on `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` and `executor-audit.vitest.ts` passes, and the full unit directory adds no failure over the recorded baseline
- [ ] A builder test asserts the exact argv ending in `--approval-policy never -`, stdin as the prompt and cwd as the lineage directory
- [ ] An env test passes `LLMGATEWAY_API_KEY`, `OPENCODE_API_KEY` and `DSH_HOME` and drops `DEEPSEEK_API_KEY`, `DSH_TELEMETRY_OTLP_URL` and `OPENCODE_FOO`
- [ ] Tests fail a non-zero exit, a missing `final`, an `error` event and a non-`completed` reason, and refuse a nested `dsh`
- [ ] `rg` on the default tables in `executor-config.ts` finds no `cli-deepseek-harness`
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
| Unit baseline | Recorded | `evidence/baseline-unit.txt`: 139 files, 2503 tests passed, exit 0 |
| Config, audit, builder and tests | Built. Focused suites pass | `evidence/focused-suites-after.txt`: 4 files, 356 tests passed, exit 0. Static checks are in `evidence/task-verify-outputs.txt` |
| Full-unit comparison | Passed | Baseline: 139 files, 2503 tests. The four suites passed 356 tests, then the full run passed 139 files and 2524 tests with exit 0 after the latest code mtime (`evidence/baseline-unit.txt`, `evidence/focused-suites-after.txt`, `evidence/full-unit-current.txt`) |
| Default-table search | Open | `evidence/task-verify-outputs.txt` records a global config grep, not a search isolated to every default table |
| Strict documentation validation | Passed | `evidence/closeout-validation.txt` reports `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Environment policy | Caller-supplied `DSH_HOME` is dropped. The runner creates a fresh home under system temp and removes it after the lineage (`evidence/task-verify-outputs.txt`, `evidence/focused-suites-after.txt`) |
| MCP capability | `code_mode` is enabled. Phase 010 owns additional MCP routes and live MCP verification (`evidence/task-verify-outputs.txt`) |
| Goal wording | The completion criteria still say inherited `DSH_HOME` passes. The directive was left unchanged as requested. The phase spec and acceptance criteria describe the current filter |
| Remaining checks | The isolated default-table search and `sk-code-quality` pass are not recorded |
<!-- /ANCHOR:log -->
