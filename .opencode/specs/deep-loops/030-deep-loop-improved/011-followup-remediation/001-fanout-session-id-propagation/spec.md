---
title: "Feature Specification: Fanout Session-ID Propagation"
description: "Bind the real fan-out lineage session_id into review/research/context init instead of a fresh timestamp, fixing codex-lineage finding F002."
trigger_phrases:
  - "fanout session id propagation"
  - "F002 session id fix"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/011-followup-remediation/001-fanout-session-id-propagation"
    last_updated_at: "2026-07-01T19:54:34Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed fanout session-id propagation"
    next_safe_action: "Proceed to successor 002 if continuing remediation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_confirm.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fanout Session-ID Propagation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 |
| **Predecessor** | None |
| **Successor** | 002-fanout-leaf-identity-conflation |
| **Handoff Criteria** | Config/state-log/findings-registry `sessionId` equals the fan-out runner's real supplied session id, not a fresh timestamp, for both CLI and native executor paths |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fanout-run.cjs:1500` generates a concrete `sessionId` (`fanout-${lineage.label}-${runId}`) and threads it into the CLI subprocess prompt as a free-text `session_id: ${sessionId}` line (`fanout-run.cjs:894`). But `deep_review_auto.yaml` never declares `session_id` as an accepted `user_inputs` binding, so its "new lineage" init path writes `sessionId: "{ISO_8601_NOW}"` at 3 separate places (`:373` config, `:408` state-log record, `:413` findings registry) — a fresh timestamp, not the supplied id. Every downstream consumer (convergence events, blocked-stop, claim adjudication, memory upsert) inherits the wrong id from the single `{session_id}` extraction at `:497`. The sibling `deep_review_confirm.yaml` has the identical bug at `:349,379,384`. The native-executor path (`buildNativeCommandInput`, `fanout-run.cjs:947-980`) never passes any session id at all, so it can't be fixed the same way without also adding the binding there.

### Purpose
Bind the real supplied `session_id` into every init-time write, for both the CLI and native executor paths, with a timestamp fallback only when no session id was actually supplied (e.g. a manually-invoked `/deep:review` outside any fan-out context).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `session_id` to `deep_review_auto.yaml`'s `user_inputs` declaration.
- Add a `step_resolve_session_id` step before config creation: bind `session_id_init = {session_id}` when supplied, else `{ISO_8601_NOW}`.
- Swap the 3 literal-timestamp writes (`:373`, `:408`, `:413`) to `{session_id_init}`.
- Apply the identical 3 changes to `deep_review_confirm.yaml` (`:349`, `:379`, `:384`).
- Add a `session_id:` line to `buildNativeCommandInput` (`fanout-run.cjs:947-980`) so native lineages get parity with CLI ones.
- New test asserting `sessionId` in config/state-log/findings-registry equals the supplied id when present, and falls back to a timestamp only when absent.

### Out of Scope
- The LEAF-identity conflation fix (F003) — that's child 002.
- Any change to `deep_context_auto.yaml` or `deep_research_auto.yaml` unless they share the exact same init-time sessionId bug (check during implementation; if so, note as a follow-up rather than silently expanding scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify | Add `session_id` user_input, `step_resolve_session_id`, swap 3 literal writes |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Modify | Same 3 changes |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Add `session_id:` line to `buildNativeCommandInput` |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | New test case for sessionId propagation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Supplied session_id wins over timestamp | When a fan-out lineage supplies `session_id`, config/state-log/findings-registry all carry that exact value |
| REQ-002 | Fallback preserved for non-fanout invocations | When no `session_id` is supplied (e.g. a bare `/deep:review` call), the existing `{ISO_8601_NOW}` fallback still fires — no regression |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Native executor parity | `buildNativeCommandInput`'s PRE-BOUND SETUP ANSWERS block includes `session_id` |
| REQ-004 | confirm mode parity | `deep_review_confirm.yaml` gets the identical fix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture dispatch with a known `session_id` produces matching `sessionId` fields in config.json, the first state.jsonl record, and the findings registry.
- **SC-002**: Existing `fanout-run.vitest.ts` assertions (which don't touch `session_id:` content) still pass unmodified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Other loop types (context/research) may share the same bug pattern | Scope creep if fixed here too | Check during implementation; if found, report as a finding rather than silently expanding this child's scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by the codex lineage's F002 finding, independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->
