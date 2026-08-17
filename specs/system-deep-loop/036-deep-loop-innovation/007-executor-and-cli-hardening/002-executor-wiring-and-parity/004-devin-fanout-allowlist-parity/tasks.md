---
title: "Tasks: devin fan-out allowlist parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin allowlist parity tasks"
  - "executor config devin tasks"
  - "fanout allowlist task list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/004-devin-fanout-allowlist-parity"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "implementer"
    recent_action: "Mark executed tasks with evidence"
    next_safe_action: "Commit the packet + runtime change"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: devin fan-out allowlist parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete · `[ ]` pending · `[P]` parallelizable · `[B]` blocked
- Format: `T### description — [evidence: proof]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 Read the live devin block in `executor-config.ts` and every vitest pin (allowlist, default, rejection fixture) — [evidence: pins located at `fanout-run.vitest.ts:1197/1216/1230` before edit]
- [x] T002 Confirm the 043 lane quiet: `git status --porcelain` clean on all four runtime files — [evidence: empty status output before dispatch]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

Dispatched to GPT-5.6 SOL (high, fast) via cli-codex under exact-edit briefs.

- [x] T003 Extend `DEVIN_SUPPORTED_MODELS` with the seven curated ids in `executor-config.ts` — [evidence: grep count 7/7 new ids]
- [x] T004 Flip `DEVIN_DEFAULT_MODEL` to `swe` in `executor-config.ts` — [evidence: `executor-config.ts:260`]
- [x] T005 Update vitest pins: allowlist expectation, omitted-model default test renamed and asserting `swe`, rejection fixture `grok-4-5-high` replaced by `kimi-k3-high` (`tests/unit/fanout-run.vitest.ts`) — [evidence: `fanout-run.vitest.ts:1207-1208/1232`]
- [x] T006 Align the duplicated allowlist + default in `scripts/fanout-run.cjs` with a durable mirror-note comment — [evidence: `fanout-run.cjs:1789-1816`, `DEVIN_DEFAULT_MODEL = 'swe'`]
- [x] T007 Confirm `executor-config.vitest.ts` carries no devin pins (no change needed) — [evidence: executor grep reported none; orchestrator grep confirmed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

Orchestrator-run, independent of the executor's claims.

- [x] T008 Re-run both suites: `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` — [evidence: Test Files 2 passed, Tests 180 passed (180)]
- [x] T009 Content greps: 7/7 ids in both surfaces; default `swe` in both; allowlist pin still contains every pre-existing alias — [evidence: grep output; `fanout-run.vitest.ts:1216` retains adaptive/opus/sonnet/claude/haiku/swe/gpt/gemini/codex]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Both unit suites green in an orchestrator-run pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Requirements and acceptance criteria: `spec.md`
- Executed approach and rollback: `plan.md`
- Verification results: `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
