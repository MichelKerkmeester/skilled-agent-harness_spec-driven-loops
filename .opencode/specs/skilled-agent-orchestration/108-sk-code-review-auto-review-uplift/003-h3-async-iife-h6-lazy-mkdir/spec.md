---
title: "Phase 3: Async-IIFE diagnostic logging (H-3) + Lazy mkdir (H-6) for skill-advisor + code-graph hooks"
description: "Replace synchronous writeFileSync/appendFileSync in hook diagnostic-log paths with fire-and-forget async-IIFE wrapper. Add closure-based lazy mkdir flag to avoid redundant mkdirSync calls. Add env-var enable gates (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1). Eliminates 50-200ms latency per hook invocation on slow filesystems."
trigger_phrases:
  - "h3 async-iife logging"
  - "h6 lazy mkdir"
  - "hook performance uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-sk-code-review-auto-review-uplift/003-h3-async-iife-h6-lazy-mkdir"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_3_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict in parent ai-council/"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-003-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: H-3 Async-IIFE + H-6 Lazy mkdir

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned — gated on council approval |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `108-sk-code-review-auto-review-uplift` |
| **Source teachings** | H-3 + H-6 from `106/research/review-report.md` §5.4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our hook diagnostic-log writers use synchronous file operations (`writeFileSync` in `skill-advisor` `metrics.ts:243-248`, `appendFileSync` in `code-graph` `ccc-feedback.ts:63`). Each write blocks the caller's execution; on slow filesystems or network-mounted directories this adds 50-200ms latency PER hook invocation. Across many hooks per session, latency compounds and becomes user-perceptible. Additionally, current implementation calls `mkdirSync` on every write rather than tracking dir-readiness via a closure flag (wasted work even if idempotent).

### Purpose
Adopt the upstream auto-review pattern: fire-and-forget async-IIFE wrapper `;(async () => { try { await appendFile(...) } catch {} })()` for non-blocking writes, plus closure-based lazy mkdir flag (`dirReady`). Add env-var enable gates so logging is opt-in in production (`SKILL_ADVISOR_DEBUG=1`, `CODE_GRAPH_DEBUG=1`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refactor `metrics.ts:243-248` (skill-advisor): replace `writeFileSync` with async-IIFE wrapper
- Refactor `ccc-feedback.ts:63` (code-graph): replace `appendFileSync` with async-IIFE wrapper
- Add closure-scoped `dirReady` flag in both files; only call `mkdir` on first write
- Add env-var enable gate at start of each logging function (early-return if disabled)
- Add safe stringify fallback (try JSON.stringify, fall back to String) for circular objects
- Smoke-test on a network-mounted dir to verify latency improvement

### Out of Scope
- Migrating deep-* skill JSONL state writes (they're not in hot hook paths; less performance-critical)
- Adding async-IIFE to other plugins (mk-skill-advisor.js / mk-code-graph.js bridge code) unless they have similar hot writes
- H-1/H-2 (separate phases)

### Files to Change

| File:line | Change |
|-----------|--------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:218-220` | Replace mkdirSync-every-call with lazy mkdir flag |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:243-248` | Replace writeFileSync with async-IIFE wrapper + enable gate |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:49-50` | Lazy mkdir |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63` | Async-IIFE + enable gate + safe stringify |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Async-IIFE pattern in 2 files | Code review: matches `;(async () => { try { await appendFile(...) } catch {} })()` |
| REQ-002 | Lazy mkdir flag in 2 files | Code review: closure-scoped `dirReady = false` + `if (!dirReady) await mkdir(...); dirReady = true;` |
| REQ-003 | Enable gate via env var in 2 files | `if (!process.env.X_DEBUG) return;` at logging-function entry |
| REQ-004 | Safe stringify fallback in code-graph (skill-advisor already has it) | `try JSON.stringify(arg) catch { String(arg) }` |
| REQ-005 | Latency reduction measurable | Smoke-test: log 100 messages, measure total wall-clock; async should be 10x+ faster than sync on slow FS |
| REQ-006 | TypeScript compile clean | `npm --prefix .../mcp_server run typecheck` exit 0 |
| REQ-007 | Vitest tests still green | `npm --prefix .../mcp_server test` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 2 files refactored (metrics.ts + ccc-feedback.ts) with async-IIFE + lazy mkdir + enable gate + safe stringify.
- **SC-002**: TypeScript typecheck exit 0 on both skill-advisor + code-graph MCP servers.
- **SC-003**: Vitest tests exit 0 on both.
- **SC-004**: Latency smoke-test shows async writes complete in <1ms per call (vs 50-200ms for sync on slow FS).
- **SC-005**: Strict validate exit 0 on this packet + phase parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Async-IIFE loses log entries under crash (process exits before flush) | Diagnostic gap | Acceptable trade for diagnostic logs (fire-and-forget contract). Add fsync flag option for critical logs in follow-on if needed. |
| Risk | Race conditions on high-concurrency writes | Log corruption | JSONL append is atomic on most POSIX filesystems (single-line writes < PIPE_BUF). Document the contract. |
| Risk | Refactor breaks existing tests that assert sync write behavior | Test failures | Smoke-test post-refactor before commit; update tests if they explicitly assert sync behavior |
| Risk | Enable gate makes debug logs invisible in production | Operator confusion | Document the env vars prominently in INSTALL_GUIDE.md |
| Dependency | TypeScript + Node 18+ for `import { appendFile } from 'fs/promises'` | Build env | Verified — both skills already use ESM async patterns |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should the async-IIFE pattern be extracted into a shared helper (e.g. `shared/async-log.ts`) used by both skills? Council to advise.
2. **Q2**: Should enable gates default to ON (more debug visibility, default tradeoff) or OFF (more performance, current upstream default)? Council to advise.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Read metrics.ts:218-248 and ccc-feedback.ts:49-63 (current state) |
| 2 | Apply lazy mkdir + async-IIFE + enable gate to metrics.ts |
| 3 | Run skill-advisor typecheck + tests; fix any breakage |
| 4 | Apply same pattern + safe stringify to ccc-feedback.ts |
| 5 | Run code-graph typecheck + tests; fix any breakage |
| 6 | Latency smoke-test on slow FS (e.g. tmpfs throttled or network mount) |
| 7 | Strict validate + commit + push |
<!-- /ANCHOR:iteration-plan -->
