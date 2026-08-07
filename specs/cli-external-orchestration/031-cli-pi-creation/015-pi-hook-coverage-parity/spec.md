---
title: "Feature Specification: Pi hook coverage parity"
description: "Close the confirmed hook-coverage gap between .pi/extensions/ (6 files) and .devin/hooks/ and .cursor/hooks/ (13 real adapters each): 8 buildable session-lifecycle hooks bridged, 2 confirmed non-gaps documented."
trigger_phrases:
  - "pi hook coverage parity"
  - "pi extension coverage gap"
  - "pi session lifecycle hooks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-pi-hook-coverage-parity"
    last_updated_at: "2026-07-27T20:30:34Z"
    last_updated_by: "claude-code"
    recent_action: "Built directly, live pi session verified, GLM-5.2 independently reviewed"
    next_safe_action: "None -- terminal phase; packet re-closes at 15 phases"
    blockers: []
    key_files: [".pi/extensions/lib/claude-hook-adapter.ts", ".pi/extensions/session-start-context.ts", ".pi/extensions/session-start-advisories.ts", ".pi/extensions/session-stop-context.ts", ".pi/extensions/prompt-advisor.ts", ".pi/extensions/session-compact-context.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-hook-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Confirmed Pi's real 33-event lifecycle API via a direct read of the installed @earendil-works/pi-coding-agent package's dist/core/extensions/types.d.ts, not phase 008's summary of it.", "Confirmed session-prime.js/session-stop.js emit plain text while user-prompt-submit.js emits a hookSpecificOutput JSON envelope, via direct spawn tests -- corrected an initial wrong assumption that all three shared the JSON envelope.", "Confirmed input-event transform handlers chain additively (runner.js emitInput), not last-writer-wins, so prompt-advisor.ts composes safely with the existing spec-gate-classify.ts.", "Confirmed permission-request-policy.mjs and spec-gate-prebind.mjs are non-gaps: their underlying policy/state-establishment need is already met by Pi's own tool_call and input events respectively."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi hook coverage parity

<!-- SPECKIT_LEVEL: 2 -->
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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Phase** | 15 of 15 |
| **Predecessor** | `../014-pi-devin-cursor-parity-alignment/spec.md` |
| **Successor** | None (final phase) |
| **Handoff Criteria** | **Entry**: the operator flagged that `.devin/hooks/` and `.cursor/hooks/` support materially more hook concerns than `.pi/extensions/`. **Exit (terminal)**: every buildable gap is bridged with a live-verified Pi session, every non-gap is documented with evidence, and GLM-5.2's independent review returns no unresolved blocking finding. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the CLI Pi creation specification — a fourth post-hoc phase, added at the operator's explicit observation that `.pi/extensions/` (6 files, built in phase 012) covers far fewer hook/guard concerns than `.devin/hooks/` and `.cursor/hooks/` (13 real adapters each, per their own `hooks.v1.json`/`hooks.json` event maps).

**Scope Boundary**: `.pi/extensions/*.ts` runtime artifacts and their supporting documentation only — no changes to the devin/cursor hook files themselves, no changes to the shared `.opencode/` guard cores, no new deep-loop executor behavior.

**Dependencies**:
- `008-pi-hook-extension-layer` — the original type-confirmed 32/33-event Pi Extension API discovery this phase re-verified directly against the installed package.
- `012-pi-runtime-compatibility` — the original 6-file `.pi/extensions/` build this phase extends.
- `.devin/hooks.v1.json`, `.cursor/hooks.json`, and their `README.md` files — the real event-to-script wiring this phase compared against.

**Deliverables**:
- `lib/claude-hook-adapter.ts`: a Pi-specific spawnSync proxy into the Claude lifecycle-hook dist files, mirroring devin's own `hooks/devin/shared.ts` pattern.
- 5 new extension files bridging 8 previously-missing hooks: `session-start-context.ts` (session-prime), `session-start-advisories.ts` (worktree-guard/check-git-hooks/check-dist-staleness/install-codex-hooks, bundled), `session-stop-context.ts` (session-stop), `prompt-advisor.ts` (skill-advisor UserPromptSubmit), `session-compact-context.ts` (native port of post-compaction.cjs).
- `.pi/extensions/README.md` updated with the 6 new files, a new §3A CONFIRMED NON-GAPS section, and corrected output-shape documentation.
- This phase's spec-folder documentation.

**Changelog**: none — this phase does not touch `cli-external-orchestration/cli-pi/`'s own `changelog/` (that directory covers the skill packet's reference/asset content, not `.pi/` runtime artifacts).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 012 built 6 `.pi/extensions/*.ts` files bridging the tool_call/tool_result/input-scoped guard cores (spec-gate, dispatch-preflight, dispatch-audit, post-edit-quality, mcp-route-guard). But `.devin/hooks.v1.json` and `.cursor/hooks.json` each wire 13 real adapters across 7-8 lifecycle events, including a whole class phase 012 never touched: session-start context priming, session-shutdown autosave, prompt-submit skill-advisor recommendation, and post-compaction continuity recovery. The operator's observation was correct — this was a real, evidence-backed gap, not a false alarm.

### Purpose
Close the buildable subset of that gap by bridging Pi's real session-lifecycle events (`session_start`, `session_shutdown`, `session_compact`, `input`) to the same underlying logic devin/cursor already use, and document the 2 hooks that are confirmed non-gaps (not deferred for lack of effort, but architecturally moot given Pi's own event model) so the packet's coverage claim is honest and complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Direct verification of Pi's real Extension API by reading the installed package's `dist/core/extensions/types.d.ts` (not phase 008's summary), confirming the full event list, `ExtensionAPI.on()` overloads, and result-composition semantics.
- Direct reads of every missing devin/cursor hook script's actual logic (not just its existence) to determine, per hook, whether a Pi event equivalent exists and what it actually delegates to.
- `lib/claude-hook-adapter.ts`: `runClaudeHookAdapter()` (spawnSync proxy) and `extractAdditionalContext()` (JSON-envelope parser for the one dist hook that uses it).
- `session-start-context.ts`: bridges `session-prime.js`'s SessionStart context (compact recovery, resume reminder, constitutional-memory priming) via `pi.sendMessage()`.
- `session-start-advisories.ts`: runs the 4 warn-only SessionStart CLI checks (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`) via `ctx.exec()`, surfacing any warning via `ctx.ui.notify()`.
- `session-stop-context.ts`: bridges `session-stop.js`'s autosave/state-cleanup side effects on `session_shutdown(reason="quit")`.
- `prompt-advisor.ts`: bridges the skill-advisor's real UserPromptSubmit recommendation (distinct from the existing `spec-gate-classify.ts`, which only appends the Gate-3 question) on the `input` event, verified to compose safely (transform-chaining, not overwrite) via a direct read of `runner.js`'s `emitInput()`.
- `session-compact-context.ts`: a native port (not a spawnSync proxy) of devin's `post-compaction.cjs` recovery chain onto Pi's own `session_compact` event, since Pi already carries the real `compactionEntry.summary` in-process.
- `.pi/extensions/README.md`: updated Directory Tree, Key Files, a new §3A CONFIRMED NON-GAPS section, corrected Boundaries and Flow (two adapter patterns, output-shape caveat), updated Entrypoints.
- This phase's spec-folder documentation and the parent packet's reconciliation to 15 phases.

### Out of Scope
- `permission-request-policy.mjs` and `spec-gate-prebind.mjs` — confirmed non-gaps (see §2 Purpose and the README's §3A), documented rather than bridged.
- `task-dispatch-guard` and `completion-evidence-stop.cjs` — remain deliberately deferred from phase 008/012, unchanged by this phase.
- Any change to `.devin/hooks/`, `.cursor/hooks/`, or the shared `.opencode/` guard-core modules themselves.
- A live provider-authenticated trace confirming every new hook fires exactly as designed under interactive use (the existing packet-wide caveat: this phase's verification is a clean extension-load smoke test plus isolated spawn tests of each proxied dist hook, not a full interactive session trace).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/lib/claude-hook-adapter.ts` | Create | Pi-specific spawnSync proxy + JSON-envelope parser. |
| `.pi/extensions/session-start-context.ts` | Create | session_start bridge to session-prime.js. |
| `.pi/extensions/session-start-advisories.ts` | Create | session_start bridge to 4 warn-only CLI checks. |
| `.pi/extensions/session-stop-context.ts` | Create | session_shutdown bridge to session-stop.js. |
| `.pi/extensions/prompt-advisor.ts` | Create | input bridge to the skill-advisor UserPromptSubmit hook. |
| `.pi/extensions/session-compact-context.ts` | Create | session_compact native port of post-compaction.cjs. |
| `.pi/extensions/README.md` | Modify | Directory Tree, Key Files, new §3A, Boundaries/Flow, Entrypoints updated for 12 files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi's real Extension API is re-verified directly from the installed package, not from a prior summary. | `dist/core/extensions/types.d.ts` read in full; the event list and `ExtensionAPI.on()` overloads cited in this spec match the file byte-for-byte. |
| REQ-002 | Every one of the 10 missing devin/cursor hooks is classified buildable or non-gap based on its actual logic, not its name alone. | Each of the 10 hook scripts' real source was read; the classification and its rationale are recorded in this spec and the README. |
| REQ-003 | Every buildable hook is bridged with the correct output-shape handling (plain text vs. JSON envelope). | Verified via isolated `node <dist-hook>.js` spawn tests against real stdin payloads before wiring into the extension files; the initial wrong assumption (all three shared a JSON envelope) was caught and fixed by this verification. |
| REQ-004 | A live Pi session starts without an extension-load error after every new file is added. | `pi --offline --approve -p "list your available tools"` exits 0 with no extension-load error, re-run after each structural change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `prompt-advisor.ts` composes safely with the pre-existing `spec-gate-classify.ts` on the same `input` event. | Verified via a direct read of `runner.js`'s `emitInput()`: transforms chain additively across handlers, not last-writer-wins. |
| REQ-006 | GLM-5.2 independently reviews all new files for factual accuracy against the real repo. | Review dispatched via `devin -p --model glm-5.2`; verdict recorded in `implementation-summary.md`; every blocking finding fixed before commit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 12 files in `.pi/extensions/` (6 pre-existing + 6 new) pass a live Pi session smoke test with 0 extension-load errors.
- **SC-002**: `.pi/extensions/README.md` passes `validate_document.py` with 0 issues.
- **SC-003**: GLM-5.2's independent review returns no unresolved blocking finding.
- **SC-004**: Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 15 phases) returns `Errors: 0, Warnings: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pi's `session_start`/`session_shutdown` handlers have no result channel to inject text (unlike Claude's `hookSpecificOutput.additionalContext`), so context injection relies on `pi.sendMessage()`. | Medium — if `sendMessage()` content is not actually LLM-visible, the bridge is a silent no-op. | Live-verified: a smoke-test session's response referenced content only present in the injected `session-prime.js` text, and `messages.ts`'s `convertToLlm()` type-confirms `CustomMessage` entries are transformed into LLM-compatible messages. |
| Risk | `session-stop-context.ts`'s spawnSync call (10s timeout budget, matching devin's own) runs synchronously inside `session_shutdown`, which could add latency to quit. | Low — bounded by the same timeout devin already uses in production; fail-open on any error. | Timeout matches the devin precedent exactly; not a new risk class. |
| Dependency | `008-pi-hook-extension-layer`, `012-pi-runtime-compatibility` | Complete — this phase extends their output directly. | Re-verified the event API and the existing 6 files' patterns before adding new files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — every hook in the original gap was resolved to either buildable-and-built or confirmed-non-gap-and-documented. The pre-existing packet-wide open item (a live provider-authenticated interactive-session trace of every lifecycle event firing) remains open, inherited from phase 008, and is explicitly named in §3 Out of Scope rather than silently dropped.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../008-pi-hook-extension-layer/spec.md`, `../008-pi-hook-extension-layer/implementation-summary.md` (original type-confirmed event API discovery this phase re-verified)
- `../012-pi-runtime-compatibility/implementation-summary.md` (the original 6-file `.pi/extensions/` build this phase extends)
- `.devin/hooks.v1.json`, `.devin/hooks/README.md`, `.cursor/hooks.json`, `.cursor/hooks/README.md` (the real event-to-script wiring this phase compared against)
- `.pi/extensions/README.md` (updated by this phase)
