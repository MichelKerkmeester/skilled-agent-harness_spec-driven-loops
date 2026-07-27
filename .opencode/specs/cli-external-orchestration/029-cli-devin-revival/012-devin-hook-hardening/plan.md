---
title: "Implementation Plan: Devin hook hardening"
description: "Apply uniform workspace-root resolution, add cwd fallback to completion-evidence-stop, build a discriminating spec-gate test suite, and trim stale comment scar tissue across the 10 Devin adapters."
trigger_phrases:
  - "devin hook hardening plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Hardening pass complete: 10 adapters unified, test suite 10/10 green."
    next_safe_action: "Run strict validation, then move to phase 006 and 003."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-hook-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin hook hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM, CommonJS, TypeScript (comments only) |
| **Framework** | Devin hooks.v1.json transport |
| **Testing** | Node test runner plus strict spec validation |

### Overview
Apply a uniform trim-and-fallback `projectDir` resolution across all 10 Devin adapters, add `payload?.cwd` resolution to `completion-evidence-stop.cjs`, build a discriminating process-level test suite for the spec-gate adapters, and trim stale historical comment scar tissue to a durable one-liner.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` defines the four hardening gaps.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines four command-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: phase `008-devin-hook-parity` is complete; shared cores are green.]

### Definition of Done
- [x] All acceptance criteria met. [EVIDENCE: runtime suites 10/10, 67/67, 11/11 all pass; `validate.sh --strict` 0 errors 0 warnings.]
- [x] Process-level tests pass. [EVIDENCE: `spec-gate-devin.test.mjs` 10/10 suite green.]
- [x] No shared core modified. [EVIDENCE: `git diff --stat` empty on the 6 cores.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical hardening of thin adapters over unmodified shared cores.

### Key Components
- **Trim-and-fallback resolution**: `typeof payload.cwd === 'string' && payload.cwd.trim() ? payload.cwd : (process.env.DEVIN_PROJECT_DIR || process.cwd())` — already proven in `post-edit-quality.cjs`.
- **Process test suite**: `spawnSync` each spec-gate adapter with isolated workspace and environment, mirroring the Cursor prebind matrix shape.

### Data Flow
Unchanged. Adapters continue to read stdin JSON, delegate to shared cores, emit Devin's `hookSpecificOutput` envelope. The only change is the `projectDir` resolution line and the trimmed comment block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-gate-classify.mjs` | UserPromptSubmit producer | Trim-and-fallback; trim comment | Process suite discriminating row |
| `spec-gate-enforce.mjs` | PreToolUse consumer/deny | Trim-and-fallback; trim comment | Process suite discriminating row |
| `completion-evidence-stop.cjs` | Stop advisory | Add `payload?.cwd` fallback; trim comment | Direct invocation (existing) |
| `post-compaction.cjs` | PostCompaction recovery | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `session-start.ts` | SessionStart lifecycle | Trim comment | Compiled + direct invocation (existing) |
| `session-stop.ts` | Stop lifecycle | Trim comment | Compiled + direct invocation (existing) |
| `user-prompt-submit.ts` | UserPromptSubmit lifecycle | Trim comment | Compiled + direct invocation (existing) |
| `shared.ts` | Devin adapter utilities | Trim comment | Compiled + existing tests |
| `task-dispatch-guard.cjs` | PreToolUse dispatch guard | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `mcp-route-guard.cjs` | PreToolUse MCP advisory | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `post-edit-quality.cjs` | PostToolUse quality | Trim comment (already trim-and-fallback) | Direct invocation (existing) |
| `code-graph-freshness.cjs` | PostToolUse freshness | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `dispatch-preflight-lint.mjs` | PreToolUse dispatch lint | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `dispatch-audit-posttooluse.mjs` | PostToolUse audit | Trim-and-fallback; trim comment | Direct invocation (existing) |
| `spec-gate-devin.test.mjs` | New process test suite | Create | Node test runner |

Matrix axes: payload validity, session identity, disabled flag, child flag, cwd shape (missing/whitespace/valid), terminal-state preservation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code hardening
- [ ] Apply trim-and-fallback to 8 adapters using `payload?.cwd || ...`.
- [ ] Add `payload?.cwd` fallback to `completion-evidence-stop.cjs`.
- [ ] Trim the stale 8-line "STATUS: LIVE" block to a one-liner in 9 adapters.
- [ ] Confirm `post-edit-quality.cjs` already uses trim-and-fallback (comment trim only).

### Phase 2: Test suite
- [ ] Build `spec-gate-devin.test.mjs` mirroring the Cursor prebind matrix.
- [ ] Include a discriminating whitespace-cwd row that fails on the pre-fix adapter.
- [ ] Run the suite green.

### Phase 3: Verification and closeout
- [ ] Run devin spec-gate suite, shared core suite, OpenCode plugin suite.
- [ ] Confirm `git diff --stat` empty on the 6 shared cores.
- [ ] Run phase 012 strict and recursive parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Process | Devin spec-gate environment/state matrix | `node --test` |
| Integration | Classify producer + enforce consumer agreement | Child-process invocation |
| Regression | Shared core + OpenCode plugin suites remain green | `node --test` |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 (devin-hook-parity) | Internal | Complete | Built the adapters this phase hardens. |
| Shared spec-gate core | Internal | Green | Provides the policy primitives the test suite exercises. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test suite fails, shared core regression, or envelope shape break.
- **Procedure**: Revert the adapter edits; the trim-and-fallback change is purely additive for well-formed payloads, so revert restores the prior `||` resolution without behavior change for real Devin sessions.
<!-- /ANCHOR:rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
