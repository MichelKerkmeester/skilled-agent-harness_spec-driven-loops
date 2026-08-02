---
title: "Implementation Plan: Spec-gate question noise"
description: "Stop the SPEC FOLDER QUESTION from re-injecting on every turn: change the shared core's question semantics, align question text with the answer parser, harden the pi adapter (history stripping + stable session key), verify across all six runtime surfaces, and validate via three parallel GPT 5.6 LUNA MAX FAST agents."
trigger_phrases:
  - "spec-gate question noise plan"
  - "gate question fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/037-spec-gate-question-noise"
    last_updated_at: "2026-08-02T14:35:53Z"
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
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Git workspace: operator chose a git worktree (branch system-spec-kit/0130-spec-gate-question-noise)"
      - "Agent fanout: three parallel read-only GPT 5.6 LUNA MAX FAST validation agents after implementation"
---
# Implementation Plan: Spec-gate question noise

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->


<!-- ANCHOR:summary -->
## 1. SUMMARY

All six runtime surfaces (pi, claude, codex, cursor, opencode, devin) share one Gate-3 core (`hooks/lib/spec-gate/spec-gate-core.mjs`). Three defects cause per-turn question injection: (1) the core re-surfaces the question on every turn while the persisted gate is `open`, ignoring the current turn's own classification; (2) the answer grammar binds only on a named folder path while the question text invites bare letters; (3) pi sessions get a fresh UUID per invocation (answers never persist) and the harness embeds full history in each message (keyword false positives). The fix is a core semantics change (one file), question-text alignment, and pi adapter hardening — then verification across all runtimes and a three-agent GPT 5.6 LUNA MAX FAST validation fanout.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Command |
|------|-------|---------|
| G1 | Core suite green | `node --test lib/spec-gate/spec-gate-core.test.mjs` (from hooks dir) |
| G2 | Runtime co-located suites green | `node --test codex/ cursor/ devin/` (from hooks dir) |
| G3 | Live pi smoke | `pi --offline --approve -p "..."` — read-only → no question; mutating → question |
| G4 | Packet validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/037-spec-gate-question-noise --strict` |
| G5 | Agent review | 3 parallel GPT 5.6 LUNA MAX FAST read-only validators, findings fixed |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The Gate-3 policy lives in the runtime-neutral core; each runtime adapter is a thin transport. Therefore the primary change is in the core only:

- `classifyIntent()` final branch: when gate is `open` and the turn neither triggers nor parses as an answer, keep `status: 'open'` (enforcement unchanged) but return `question: null`.
- New exported `isAnswerAttempt(text)`: true when the turn starts with the answer grammar (skip word, standalone D, natural lead-in, or A-E letter prefix) — used to re-surface the question when `answerParse` failed to bind (letter without path, contradictory skip).
- New exported `resolveSessionKey({ sessionId, sessionFile })`: prefers the session-file basename (stable across pi invocations of the same conversation) over the raw UUID; both pi adapters use it so classify and enforce agree on the state key.
- `GATE_3_QUESTION` text: A/C/D options now instruct naming the folder path (matches `answerParse`'s binding grammar); AGENTS.md static copy updated in parity.

The pi classify adapter additionally strips embedded harness history (`## Post-Compaction Summary` … up to the last `[user]` marker) before classification, so summary text can never trip the keyword classifier.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (done — audit)

- [x] Trace all six runtime classify surfaces and their session identities (T001).
  - **Evidence**: adapter inventory in tasks.md T001; wiring confirmed in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`.
- [x] Pin root causes with receipts — state files 1:1 with per-turn pi session files; live classifier run showing `create, fix` matched from compacted history (T002).
  - **Evidence**: receipts in tasks.md T002 (`.spec-gate-state/` UUID mapping; live `classifyPrompt` run).

### Phase 2: Implementation (~45 min)

- [ ] T003: Core semantics — `classifyIntent` final branch + `isAnswerAttempt` helper.
- [ ] T004: `resolveSessionKey` helper (session-file-based key with UUID fallback).
- [ ] T005: `GATE_3_QUESTION` text alignment + AGENTS.md static copy parity.
- [ ] T006: pi classify adapter — history stripping + `resolveSessionKey`.
- [ ] T007: pi enforce adapter — same `resolveSessionKey` derivation.

### Phase 3: Verification (~60 min)

- [ ] T008: Core suite updates/additions (read-only turn, answer attempt, unchanged trigger/skip/binding).
- [ ] T009: Runtime co-located suites (codex/cursor/devin) — update only stale assertions.
- [ ] T010: Live pi smoke (read-only → no question; mutating → question).
- [ ] T011: Dispatch 3 parallel GPT 5.6 LUNA MAX FAST read-only validation agents (core / pi / other runtimes); fix accepted findings.
- [ ] T012: Metadata regeneration + `validate.sh --strict`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Core semantics**: extend `spec-gate-core.test.mjs` — new cases for open+read-only → `question: null`, open+attempt-without-path → question, closed+read-only → closed. Existing trigger/skip/binding/self-binding tests must pass unchanged.
- **Runtime suites**: `node --test` on codex/cursor/devin co-located tests; only stale assertions of the old always-question behavior get updated.
- **Live pi**: `pi --offline --approve` with (a) a read-only question, (b) a mutating request; assert the injected context differs.
- **Agent fanout**: three read-only `opencode run --model openai/gpt-5.6-luna-fast --variant high` sessions, findings-first, fenced JSON verdicts.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `opencode` CLI with OpenAI provider auth (GPT 5.6 LUNA FAST live slug — confirm via `opencode models openai` before dispatch).
- pi CLI for live smoke.
- No schema changes; no migration.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- All changes are tracked-file edits in two files plus one test file and AGENTS.md — `git checkout` of the touched paths restores the old behavior.
- The core change is additive in behavior (question withheld, never added); no state format change, so no state migration.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- T003 → T008 (tests validate the semantics).
- T006/T007 → T010 (live smoke needs both adapters on the same key).
- T011 → T012 (docs record agent findings).
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Est. | Actual |
|-------|------|--------|
| Setup (audit) | 30 min | done |
| Implementation | 45 min | pending |
| Verification | 60 min | pending |
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

- Pre-change snapshot: none needed (git-tracked files only).
- Riskiest step: `GATE_3_QUESTION` text change — reverting it is a one-line restore; AGENTS.md parity must be reverted together.
<!-- /ANCHOR:l2-rollback -->
