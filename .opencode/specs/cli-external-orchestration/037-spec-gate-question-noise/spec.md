---
title: "Feature Specification: Spec-gate question noise (stop per-turn re-injection across all runtimes)"
description: "The SPEC FOLDER QUESTION is re-injected on nearly every turn: once the gate opens, the shared core re-surfaces it on every subsequent turn regardless of content (all six runtimes), the answer grammar rejects bare letters the question text invites, and in pi the per-invocation session identity defeats answer persistence while embedded compacted history trips the keyword classifier. Fix the core question semantics, align question text with the parser, and harden the pi adapter."
trigger_phrases:
  - "spec folder question noise"
  - "gate 3 re-ask"
  - "spec-gate question every turn"
  - "spec folder question every query"
  - "gate question injection"
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
    open_questions:
      - "Git workspace choice for implementation (worktree vs current branch) -- operator decision at implementation start"
    answered_questions:
      - "Agent fanout: three parallel read-only GPT 5.6 LUNA MAX FAST validation agents (core, pi, other runtimes) after implementation"
---
# Feature Specification: Spec-gate question noise (stop per-turn re-injection across all runtimes)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-02 |
| **Branch** | `system-spec-kit/0130-spec-gate-question-noise` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The SPEC FOLDER QUESTION is injected on nearly every user turn in the pi CLI, and re-asks every turn in every runtime once the gate has opened. Root causes, pinned by direct inspection:

1. **Sticky-open re-ask (shared core, all six runtimes):** `classifyIntent()` in `hooks/lib/spec-gate/spec-gate-core.mjs` returns `question: GATE_3_QUESTION` on EVERY turn while the persisted session state is `open` — even pure read-only turns. The current turn's own classification is ignored once the gate is open. This contradicts the AGENTS.md protocol ("The answer applies for the ENTIRE session").
2. **Answer grammar rejects the answers the question invites:** `answerParse()` binds only when a turn names a valid spec-folder path (`SPEC_PATH_REGEX` / `BARE_FOLDER_TOKEN_REGEX`). A bare letter ("A)") or "A) Use an existing spec folder" returns `null` → "stay open and re-ask rather than guessing at a target". The question text invites exactly those bare-letter answers.
3. **pi-specific compounding:** (a) each pi invocation receives a fresh session UUID (verified: `.spec-gate-state/` holds one `open` state file per message, 1:1 with per-turn pi session files under `~/.pi/agent/sessions/`), so answers never persist and the gate re-opens on every trigger-y message; (b) this harness embeds the full transcript (including `## Post-Compaction Summary` blocks) inside each message, so the keyword classifier matches history text — verified live: this turn triggered on `create, fix` from the compacted summary, not the user's words.

### Purpose

The question appears only when a turn genuinely asks for file mutation (or is an incomplete answer to an open gate); read-only turns stay clean; answers persist across pi invocations of the same conversation where a session file exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared core question semantics: no re-ask on non-trigger turns while gate is open (status stays `open` for enforcement).
- Answer-attempt detection: turns that look like an answer but fail to bind re-surface the question.
- Question text alignment: A/C/D options instruct naming the folder path, matching `answerParse()`.
- pi adapter hardening: strip embedded history/compaction blocks before classification; derive a stable session key from `ctx.sessionManager.getSessionFile()` when available, used identically by both pi spec-gate adapters.
- Tests: core test suite updates + additions; co-located runtime tests (codex/cursor/devin) checked and updated only if they assert the old semantics.
- AGENTS.md static question copy parity.

### Out of Scope
- Enforcement/deny logic (`evaluateMutation`, `GATE_3_DENY_DETAIL`) - unchanged; the gate stays open for enforcement while the question is withheld.
- Classifier trigger vocabulary (`FILE_WRITE_TRIGGERS` etc.) - the keyword set is not part of this fix.
- Other runtimes' adapters (claude/codex/cursor/opencode/devin) - verified thin shells over the core; the core fix covers them.
- pi harness session identity itself (one session file per invocation is the harness's design; documented as a limitation).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Question semantics in `classifyIntent`, `isAnswerAttempt` helper, `resolveSessionKey` helper, `GATE_3_QUESTION` text |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Update stale assertions; add read-only-turn and answer-attempt tests |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts` | Modify | Strip embedded history; stable session key |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-enforce.ts` | Modify | Same session key derivation as classify |
| `AGENTS.md` | Modify | Static question copy parity with new text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read-only turns in an open-gate session must not re-surface the question | Core test: gate open, non-trigger turn → `{ status: 'open', question: null }` |
| REQ-002 | Mutating turns still surface the question and still open the gate on first trigger | Core test: trigger turn with closed gate → `{ status: 'open', question: GATE_3_QUESTION }` |
| REQ-003 | An attempted-but-invalid answer (letter without path, contradictory skip) re-surfaces the question | Core test: open gate, "A)" turn → `question` present |
| REQ-004 | pi: embedded history/compaction blocks must not trigger classification | Live pi smoke: read-only prompt with pasted history → no question injected |
| REQ-005 | pi: gate state keyed on stable session-file identity when available; classify and enforce derive the same key | Both pi adapters call the shared `resolveSessionKey` with identical inputs; enforce reads what classify wrote |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Question text tells the user to name the folder path for A/C/D; AGENTS.md static copy matches | `GATE_3_QUESTION` includes path instruction; AGENTS.md Gate 3 block textually matches |
| REQ-007 | No behavioral change outside the question surface; fail-open preserved; comment hygiene maintained | All runtime test suites pass; no new writes on error paths; no packet/task ids in code comments |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test` core suite green with the new semantics (read-only-turn, answer-attempt, trigger, skip/binding unchanged).
- **SC-002**: Live `pi --offline --approve` smoke: read-only prompt → no question; mutating prompt → question.
- **SC-003**: Codex/cursor/devin co-located suites green (no assertion of the old always-question behavior remains).
- **SC-004**: Three parallel read-only GPT 5.6 LUNA MAX FAST validation agents return `APPROVED`/`APPROVED_WITH_NOTES`; accepted findings fixed.
- **SC-005**: `validate.sh --strict` on packet 037 passes Errors 0 Warnings 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A user answers the gate and the harness restarts pi (new session file) → answer lost | Med | Documented limitation; in-turn self-binding and trigger-turn question still work; stable key helps normal interactive pi |
| Risk | Question withheld on read-only turns could hide an open gate from the user | Low | Enforce hooks still deny/advise at write time (`GATE_3_DENY_DETAIL` instructs the model to ask); status stays `open` |
| Risk | Answer-attempt detection drifts from `answerParse` grammar | Low | Both share the same anchored regexes; tests cover both |
| Dependency | pi extension API `sessionManager.getSessionFile()` | Low | Falls back to `getSessionId()` when unavailable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Core change is in-memory only (no new I/O, spawns, or state writes on read-only turns) - zero measurable latency impact on the existing hook paths.

### Security
- **NFR-S01**: The question remains a fixed string; matched classifier tokens are never echoed into injected context.

### Reliability
- **NFR-R01**: Fail-open preserved on every error path; a classifier bug must never block or corrupt a turn.
- **NFR-R02**: Comment hygiene: no ADR-/REQ-/CHK-/task ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/whitespace prompt: classified as non-trigger, non-attempt → no question.
- Gate already `satisfied`/`skipped`: question never surfaces (unchanged).
- Turn that is both trigger AND answer ("fix it, use .opencode/specs/999-x"): trigger-turn self-binding closes the gate without a question (unchanged).
- `MK_SPEC_GATE_DISABLED=1` or child session: full no-op (unchanged).

### Error Scenarios
- `sessionManager.getSessionFile()` throws or returns empty: fall back to session UUID key.
- Classifier throws: fail open, no question, no state write (unchanged); existing open state evicted best-effort.

### State Transitions
- open + read-only → stays open, no question (new).
- open + trigger → open, question (unchanged).
- open + attempt-without-path → open, question (unchanged result, now via explicit attempt detection).
- open + valid answer → satisfied/skipped, no question (unchanged).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 5 files, ~100 LOC changed |
| Risk | 6/25 | Core gate semantics; low blast radius (question surface only) |
| Research | 4/20 | Audit already complete (all six runtimes) |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Git workspace choice for implementation -- operator chose a git worktree (A) at implementation start.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:related-docs -->
