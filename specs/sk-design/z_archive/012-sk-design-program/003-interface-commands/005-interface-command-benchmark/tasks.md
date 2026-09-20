---
title: "Tasks: /interface:* Structure + Live Multi-Model Benchmark"
description: "Task ledger for the /interface:* hybrid benchmark: pre-flight + setup, the deterministic structure axis, three sequential live legs (deepseek, mimo, luna), and extract-score-report verification."
trigger_phrases:
  - "interface benchmark tasks"
  - "three leg benchmark task ledger"
  - "interface design benchmark tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/005-interface-command-benchmark"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Completed all benchmark tasks"
    next_safe_action: "Operator reviews the verdict"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/003-interface-commands/005-interface-command-benchmark/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-010-interface-benchmark-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: /interface:* Structure + Live Multi-Model Benchmark

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done with evidence. The executable contract: contract test 8/8, three live-leg
artifacts captured + scored, and a written scorecard.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Provider/auth pre-flight + self-invocation guards. [SOURCE: DeepSeek + Xiaomi api + ChatGPT OAuth confirmed; 0 OPENCODE_/CODEX_ env]
- [x] T002 Scaffold packet + evidence dir; write shared brief + codex raw prompt. [SOURCE: `review/`, scratchpad `bench/`; codex prompt 292 lines]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Structure axis: contract test + conformance scorecard. [TESTED: `interface-command-contract.test.mjs` 8/8; 5/5 commands router-detected + one @-include + no-taste + modes]
- [x] T004 Leg 1 — cli-opencode `deepseek/deepseek-v4-pro --variant high`, native `--command interface/design :auto`. [SOURCE: `review/legs/leg1-deepseek.*`; 27 KB artifact]
- [x] T005 Leg 2 — cli-opencode `xiaomi/mimo-v2.5-pro`, native `--command`. [SOURCE: `review/legs/leg2-mimo.*`; 20 KB]
- [x] T006 Leg 3 — cli-codex `gpt-5.6-luna` high, raw prompt. [SOURCE: `review/legs/leg3-luna.*`; 9.7 KB]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Extract each artifact; score the six-point rubric per leg. [TESTED: 8/8 visible blocks each; taste 110/38/6; no proof-tier overclaims]
- [x] T008 Write `review/review-report.md` + finalize spec verdict; validate. [SOURCE: `review/review-report.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Structure axis PASS (contract 8/8, scorecard 5/5) — T003
- [x] Three live-leg artifacts captured + scored — T004/T005/T006/T007
- [x] Scorecard + verdict written — T008
<!-- /ANCHOR:completion -->
