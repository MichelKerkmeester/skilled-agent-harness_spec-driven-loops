---
title: "Goal: Phase 1: Make Pi the default Jev transport when it is available"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/001-pi-default-transport"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs"
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs"
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs"
      - ".skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs"
      - ".skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: Make Pi the default Jev transport when it is available

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer Jev calls through Pi by default whenever Pi can answer them, and through the jev CLI otherwise.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | With no transport named, Pi answers when its preflight passes and the CLI answers otherwise, with no skip line |
| D2 | `JEV_TRANSPORT=jev` forces the CLI and `JEV_TRANSPORT=pi` keeps its skip line. Both stay as they are |
| D3 | The module never reads a credential. Pi uses its own store or the caller's environment |
| D4 | No feature turns on by default. Each scorer still calls Jev only behind `--jev` and its auth gate |
| D5 | Workers per 003 D5. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The transport suite passes with cases for the automatic route on `choice` and `noul`, each failing gate, and both `JEV_TRANSPORT` values
- [x] All eight scorers call Jev through `spawnClassifierCall`, each with a routing test, and each suite passes at or above its baseline with the key set and unset
- [x] A live smoke answers one `noul` and one `choice` call through Pi with the key, and through the CLI without it
- [x] `validate_document.py` exits 0 on each changed doc, and the cross-family review leaves no open P0 or P1
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from the operator's request |
| Build | Done | Luna on cli-codex: transport in two runs, then the eight scorers |
| Docs | Done | DeepSeek on cli-pi: five docs, `validate_document.py` exit 0 |
| Cross-family review | Done | DeepSeek on the code: 0 P0, 1 P1 (two unpinned suites), 5 P2. Luna on the docs: 1 P1 (caller count), 5 P2. Both P1s and the doc P2s fixed, each fix checked by the session |
| Suites (2026-10-03) | Done | Transport 83, 032 38, 035 50, 025 and 024 78, 017 30, 026 and 031 62, 029 29, pinned pair 62, each the same with `TYPESAFE_API_KEY` set and unset |
| Live smoke (2026-10-03) | Done | Key from the Keychain per process: noul and choice answered by Pi. Without it: both answered by the CLI. No line printed |

### Deviations and findings

| Item | Note |
|------|------|
| Benchmark task closed by check | `score-pi-transport.mjs` never calls the transport, so no route change was needed. The spec row and T008 say so |
| Two suites added to scope | `leaf-route-replay.test.cjs` and `score-clarify-default.test.cjs` stub `jev` and their scorers already call the transport, so they needed the pin. Review P1 |
| Fixes checked by the session, not re-reviewed | Both fixes were small: one env key per suite and doc wording. The session reran the suites and the playbook step |
| Review P2s recorded | The model name on a Pi record, `wallMs` after a fallback, 026's auth record without `transport`, and vitest's 5 s default timeout for 031's suite. Each is passed to phase 002 as a measurement caveat |
<!-- /ANCHOR:log -->
