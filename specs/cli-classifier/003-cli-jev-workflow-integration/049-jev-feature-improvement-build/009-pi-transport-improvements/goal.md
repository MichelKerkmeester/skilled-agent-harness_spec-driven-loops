---
title: "Goal: Build: improve the Jev Pi native classifier transport (037)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/009-pi-transport-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev Pi native classifier transport (037)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev Pi native classifier transport (037) that need no new labels, corpus or default-on switch, and record one re-measure.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | Build only what this spec names. New corpora, new labels and any default-on switch stay out, per 003 D4 and 047 D6 |
| D2 | A change to a flag line, call protocol, aggregation or question text is a keep-rule amendment. Record it in the log before the re-measure, and keep the old verdict on record |
| D3 | A re-measure calls live Jev only when `jev auth status` passes, and records every call with `--out` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `jev-transport.test.mjs` passes, with cases for provider routing, kill-switch precedence and runtime caching
- [x] `score-pi-transport.test.mjs` passes, with cases for the paired run and the escalation arm
- [x] The paired run's verdict line is in the log
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's ranked table |
| Provider map (2026-10-03) | Done | Luna on cli-codex; 79 passed; DeepSeek review: no P0, 1 P1 closed by the paired run below, 4 P2 recorded |
| Paired run on the official host (2026-10-03) | Done | Pi `typesafe/jev-latest` against the jev CLI on `official` (`jev-1.13.0`), same day, fresh: `verdict pi-transport: adopt K=111 M=103 A=98 coverage=92.8 agreement=95.1 median_abs_dp=0.0100 p95_ms=299/575 cost_per_100=0.0000`. Escalation: 96 served by Pi, 7 deferred, A=101 of 103, agreement 98.1. 723 calls recorded in `~/.skilled/.labels/runs/049-009-paired-20261003`; no key text in any run file |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |
| Build | Done | Luna on cli-codex, resumed once after the usage limit, then one fix dispatch; `node --test` on both suites 77 pass (baseline 63) |
| Cross-family review | Done | DeepSeek on cli-pi: 0 P0, 2 P1 fixed (an omitted `--provider` now follows `JEV_PROVIDER` then `official`; the Pi pin moved to the installed 0.99.2), 2 P2 recorded |
| Pi replay on 0.99.2 (2026-10-03) | Done | `score-pi-transport.mjs --pi --out ~/.skilled/.labels/runs/049-009-pi-20261003`, exit 0 in 83 s: `verdict pi-transport: adopt K=111 M=103 A=98 coverage=92.8 agreement=95.1 median_abs_dp=0.0100 p95_ms=341/390 cost_per_100=0.0022`. 037 on 0.99.1 read agreement 95.5 and p95 340/387. 8 rows excluded because their cluster changed since the 019 baseline |
| Paired run with escalation arm | Superseded | `jev auth status --provider openrouter` returns `stored openrouter API key is empty`. The paired run needs the jev CLI on OpenRouter, and 003 D1 gives Jev no secret. Operator decision |

### Deviations and findings

| Item | Note |
|------|------|
| Pi pin follows the installed version | The research asked for a pinned Pi version with a rerun trigger. The first build pinned 0.99.1, which 037 measured, while 0.99.2 is installed, so every call fell back to the CLI. The pin moved to 0.99.2 and the replay above is its rerun |
| Paired run moved to the official host (2026-10-03) | Neither opencode-go nor LLM Gateway works: Pi has no Jev classifier on opencode-go, and on LLM Gateway Pi has no classifier implementation while the jev CLI would need the gateway key. Pi ships a `typesafe` classifier provider for `jev-latest` at `api.typesafe.ai`, the jev CLI's `official` host. The operator chose that pairing and stores `TYPESAFE_API_KEY` in the macOS Keychain, read per process. Jev gets no new secret |
| Review P2s | Recorded per 003 D5: the metrics line prints rounded rates while the judge decides on raw counts, and the escalation agreement counts deferred rows as agreeing |
| Paired host moved from OpenRouter to Typesafe | Recorded in the spec amendment: the OpenRouter pairing needed a jev key D1 forbids |
<!-- /ANCHOR:log -->
