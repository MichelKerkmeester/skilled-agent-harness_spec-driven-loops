---
title: "Feature Specification: Devin hook hardening"
description: "Harden the 10 Devin hook adapters around workspace-root resolution, fail-open stdin discipline, and discriminating process-level test coverage, plus trim stale historical comment scar tissue."
trigger_phrases:
  - "devin hook hardening"
  - "devin workspace root agreement"
  - "devin spec-gate test suite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Added Successor link to phase 013 (PHASE_LINKS gate)."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-hook-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Devin hook hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../011-hook-truth-and-runtime-readmes/spec.md` (sequential); `../008-devin-hook-parity/spec.md` (dependency — built the adapters this phase hardens) |
| **Successor** | `../013-devin-permission-request-handler/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An independent review of the 10 Devin hook adapters (built in phases 004 and 008) found four hardening gaps:

1. Eight adapters resolve `projectDir` with `payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd()`, which treats a whitespace-only `cwd` as truthy. The ninth adapter (`post-edit-quality.cjs`) already uses the safer trim-and-fallback pattern. The two spec-gate adapters agree with each other (no enforcement bypass), but the invariant — "producer and consumer derive the same projectDir for every payload shape" — is not preserved uniformly.
2. `completion-evidence-stop.cjs` hardcodes `process.cwd()` and ignores `payload?.cwd`, diverging from the other 9 adapters. If Devin ever delivers a `cwd` field that differs from `process.cwd()`, the adapter looks in the wrong `speckit-claude-hooks` directory and silently approves (fail-open, safe direction, but continuity rehydration is lost).
3. There is no process-level test suite for any Devin adapter. The adapters were validated by direct invocation and live `devin -p` observation only. The shared cores they delegate to are tested, but the Devin-specific surface (stdin parsing, envelope translation, `DEVIN_PROJECT_DIR` resolution, fail-open on malformed input) is not.
4. Nine adapters carry an 8-line "STATUS: LIVE" historical scar-tissue block documenting a registration-schema bug corrected in phase 008. The block is now stale and will rot further; the durable fact fits in one line.

### Purpose
Apply the trim-and-fallback pattern uniformly across all 10 adapters, add `payload?.cwd` resolution to `completion-evidence-stop.cjs`, build a discriminating process-level test suite for the spec-gate adapters mirroring the Cursor prebind matrix, and trim the stale comment block to a durable one-liner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply `post-edit-quality.cjs`'s trim-and-fallback pattern to the 8 adapters using `payload?.cwd || ...`.
- Add `payload?.cwd || DEVIN_PROJECT_DIR || process.cwd()` resolution to `completion-evidence-stop.cjs`.
- Trim the 8-line "STATUS: LIVE" block in 9 adapters to a one-line durable comment.
- Build a process-level test suite for the Devin spec-gate adapters (`spec-gate-classify.mjs` and `spec-gate-enforce.mjs`) covering malformed input, missing identity, disabled session, autonomous child session, whitespace cwd, and terminal-state preservation.

### Out of Scope
- Building a process-level test suite for the 8 non-spec-gate adapters. Their shared cores are already tested; the Devin-specific translation layer is smaller and lower-risk. Tracked as a separate follow-up if the spec-gate suite surfaces a class of issue that warrants broader coverage.
- Changing the Devin envelope shape (`hookSpecificOutput`) or the registration schema in `.devin/hooks.v1.json`.
- Modifying any shared core (`spec-gate-core.mjs`, `dispatch-guard.cjs`, `mcp-route-guard.cjs`, `post-edit-router.cjs`, `freshness-core.cjs`, `completion-evidence-sentinel.cjs`).
- The cli-devin skill packet build (phase 003) and the manual-testing-playbook deny-branch scenario (phase 006) — separate scopes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs` | Modify | Add `payload?.cwd` fallback; trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/session-start.ts` | Modify | Trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/session-stop.ts` | Modify | Trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts` | Modify | Trim stale comment. |
| `system-spec-kit/mcp-server/hooks/devin/shared.ts` | Modify | Trim stale comment. |
| `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs` | Modify | Trim stale comment (already uses trim-and-fallback). |
| `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `cli-external-orchestration/cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `cli-external-orchestration/cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs` | Modify | Trim-and-fallback for `projectDir`; trim stale comment. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs` | Create | Process-level test matrix for the devin spec-gate adapters. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 Devin adapters resolve `projectDir` with the same trim-and-fallback pattern. | A whitespace-only `payload.cwd` falls back to `DEVIN_PROJECT_DIR` then `process.cwd()` in every adapter; grep finds no `payload?.cwd \|\|` patterns remaining. |
| REQ-002 | A process-level test suite covers the devin spec-gate adapters' matrix. | `spec-gate-devin.test.mjs` passes a discriminating matrix including malformed input, missing identity, disabled, child, whitespace cwd, and terminal-state preservation. |
| REQ-003 | No shared core is modified. | `git diff --stat` on the 6 shared cores is empty. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The stale "STATUS: LIVE" 8-line block is trimmed to a durable one-liner in every adapter that carries it. | Grep finds no multi-line "STATUS: LIVE" blocks; the durable fact (hooks fire under the documented nested event schema) is preserved. |
| REQ-005 | The devin spec-gate test suite is discriminating, not merely green. | At least one row fails on the pre-fix adapter (whitespace cwd or trimmed-id regression) and passes after the fix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The devin spec-gate test suite passes all rows.
- **SC-002**: The shared spec-gate core suite (67/67) and OpenCode plugin suite (11/11) remain green (no regression from touching the adapters).
- **SC-003**: Phase 012 strict validation passes with 0 errors and 0 warnings.
- **SC-004**: Recursive parent strict validation (029-cli-devin-revival) passes with 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Comment trim accidentally removes a load-bearing durable fact | Low — the trimmed block is historical, not durable | Preserve the one-line fact; review each trim before applying. |
| Risk | Trim-and-fallback changes resolution for a payload shape Devin actually delivers | Low — Devin's `cwd` field is well-formed in practice | The `.devin/hooks.v1.json` `cd` wrapper makes `process.cwd()` correct regardless; the fix only matters for pathological whitespace. |
| Dependency | Phase 008 (devin-hook-parity) | The adapters this phase hardens were built by phase 008 | Phase 008 is complete; this phase is a post-closeout hardening addendum. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every adapter continues to fail open on malformed input, missing identity, or internal error.
- **NFR-R02**: The trim-and-fallback change is purely additive — it only changes behavior for whitespace-only `cwd`, which is currently treated as truthy.

### Security
- **NFR-S01**: No adapter logs or transmits raw payload contents that could contain user secrets.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A whitespace-only `payload.cwd` is treated as absent in all 10 adapters.
- A missing `payload.cwd` falls back to `DEVIN_PROJECT_DIR` then `process.cwd()` (unchanged behavior).
- Malformed stdin continues to fail open with no output.

### State Transitions
- No state transition changes — the adapters delegate to shared cores, which own state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 14 file edits (1-2 lines each) + 1 new test file. |
| Risk | 10/25 | Touches 10 runtime adapters but only their projectDir resolution + comment hygiene. |
| Research | 4/20 | Pattern already established by `post-edit-quality.cjs` and the Cursor prebind fix. |
| **Total** | **22/70** | **Level 2 — bounded hardening pass with a discriminating test gate.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- None. The hardening pattern is established; the test matrix mirrors the proven Cursor prebind suite.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- `../008-devin-hook-parity/spec.md` (predecessor — built the adapters this phase hardens)
- `../../030-cli-cursor-creation/013-cursor-spec-gate-prebind/spec.md` (Cursor prebind precedent for the trim-and-fallback fix and test matrix shape)
