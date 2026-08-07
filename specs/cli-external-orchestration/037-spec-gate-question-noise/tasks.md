---
title: "Tasks: Spec-gate question noise"
description: "Task breakdown for stopping per-turn SPEC FOLDER QUESTION re-injection: core semantics, answer-attempt detection, question text alignment, pi adapter hardening, cross-runtime verification, agent validation fanout."
trigger_phrases:
  - "spec-gate question noise tasks"
  - "gate question fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/037-spec-gate-question-noise"
    last_updated_at: "2026-08-02T15:36:37Z"
    last_updated_by: "implementer"
    recent_action: "Packet scaffolded: runtime audit done; root causes pinned"
    next_safe_action: "Implement core question semantics change, then pi adapter hardening, then verify"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-enforce.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-037-spec-gate-question-noise"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
# Tasks: Spec-gate question noise

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->


<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done with evidence; `[ ]` = pending; `[B]` = blocked.
- IDs are T001..T0NN; sub-items use letters (T006a/T006b).
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001 — Audit all six runtime classify surfaces.** Inventory pi/claude/codex/cursor/opencode/devin adapters, their events, session identities, and injection points.
  - **Evidence**: `.opencode/skills/system-spec-kit/mcp-server/hooks/{pi,claude,codex,cursor,devin}/` adapters + `.opencode/plugins/mk-spec-gate.js` read; wiring confirmed in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`.
- [x] **T002 — Pin root causes with receipts.**
  - **Evidence**: `.spec-gate-state/` UUIDs match per-turn pi session files under `~/.pi/agent/sessions/` (1:1, all `open`, none answered); live `classifyPrompt` run on this conversation's message returned `triggersGate3: true, matched: create,fix` from the compacted summary; `classifyIntent` final branch returns `GATE_3_QUESTION` whenever state is `open`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T003 — Core semantics: `classifyIntent` + `isAnswerAttempt`.** When the gate is `open` and the turn neither triggers nor parses as an answer, return `{ status: 'open', question: null }`; re-surface the question on answer-attempt turns.
  - **Evidence**: `spec-gate-core.mjs` final branch + exported `isAnswerAttempt`; tests `an open gate stays open but silent on a read-only turn`, `an answer attempt without a named folder re-surfaces the question`, `a self-contradicting skip attempt re-surfaces the question` green.
- [x] **T004 — `resolveSessionKey` helper.** Session-file-basename key with UUID fallback; used by both pi adapters.
  - **Evidence**: exported from `spec-gate-core.mjs`; unit test `resolveSessionKey: session file wins, id and unknown token are fallbacks` green; live state files keyed `file:<basename>`.
- [x] **T005 — Question text alignment.** A/C/D options instruct naming the folder path; `AGENTS.md` static copy updated in parity.
  - **Evidence**: `GATE_3_QUESTION` options A-D (B included for the same binding-grammar reason) instruct replying with the path; worktree `AGENTS.md` Gate 3 options A-D updated.
- [x] **T006 — pi classify adapter.** Strip embedded harness history before `classifyIntent`; pass `resolveSessionKey` output as sessionID.
  - **Evidence**: `hooks/pi/spec-gate-classify.ts` strips the sibling-injected advisor capsule (last `\nDirectives:`) and classifies only after the last `[user]` marker; live smoke silent on read-only.
- [x] **T007 — pi enforce adapter.** Same `resolveSessionKey` derivation so classify/enforce share the state key.
  - **Evidence**: `hooks/pi/spec-gate-enforce.ts` calls `resolveSessionKey` with identical inputs; both read/write the same `file:<basename>` key.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T008 — Core suite updates.** New cases: open+read-only → `question: null`; open+attempt-without-path → question; closed+read-only → closed. Existing trigger/skip/binding tests pass unchanged.
  - **Evidence**: `node --test lib/spec-gate/spec-gate-core.test.mjs` → 69 pass, 0 fail (3 pre-existing skips). The two handover-flagged tests (letter-without-path, invalid-folder) still pass — their prompts still trigger classification, so no assertion change was needed.
- [x] **T009 — Runtime co-located suites.** `node --test` on codex/cursor/devin tests; update only stale assertions of the old always-question behavior.
  - **Evidence**: `node --test 'codex/*.test.mjs' 'cursor/*.test.mjs' 'devin/*.test.mjs'` → 47/47 pass; no stale assertions found (the flagged `codex:138`/`devin:146` assert trigger-turn behavior, unchanged).
- [x] **T010 — Live pi smoke.** Read-only prompt → no question; mutating prompt → question; answers persist across invocations when the same session file is used.
  - **Evidence**: read-only run (session `2026-08-02T14-06-04-133Z`) → no question, no state file; mutating run (session `2026-08-02T14-06-14-434Z`) → `{"status":"open"}` under key `file:<basename>` + question echoed. Cross-invocation persistence remains harness-limited (fresh session file per invocation, documented).
- [x] **T011 — Agent validation fanout.** Three parallel read-only GPT 5.6 LUNA MAX FAST agents (core / pi / other runtimes); accepted findings fixed.
  - **Evidence**: three rounds dispatched via `opencode run --model openai/gpt-5.6-luna-fast --format json` with `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`; final verdicts core/pi/runtimes all `APPROVED_WITH_NOTES` (only P2 notes: no pi-adapter unit-test harness; env-suppressed test runs). Findings fixed in rounds 2-3; see implementation-summary Verification.
- [x] **T012 — Metadata + validation.** Regenerate `description.json`/`graph-metadata.json`; `validate.sh --strict` passes Errors 0 Warnings 0.
  - **Evidence**: metadata regenerated via generate-description.js + backfill-graph-metadata.js; `validate.sh --strict` on the packet → Errors 0 Warnings 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

1. Read-only turns never re-surface the question in any runtime (core semantics + tests).
2. Mutating turns still surface the question; gate still opens on first trigger.
3. Answer-attempt turns (letter without path) re-surface the question with the aligned text.
4. pi: history blocks don't trigger classification; classify/enforce share one session key.
5. All runtime test suites green; live pi smoke green; agent verdicts `APPROVED`/`APPROVED_WITH_NOTES`; packet validated.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `.opencode/specs/cli-external-orchestration/037-spec-gate-question-noise/spec.md`
- Plan: `plan.md` (same folder)
- Checklist: `checklist.md` (same folder)
<!-- /ANCHOR:cross-refs -->
