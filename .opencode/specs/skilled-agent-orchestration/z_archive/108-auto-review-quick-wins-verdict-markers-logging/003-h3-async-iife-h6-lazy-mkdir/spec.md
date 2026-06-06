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
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/003-h3-async-iife-h6-lazy-mkdir"
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
| **Phase Parent** | `108-auto-review-quick-wins-verdict-markers-logging` |
| **Source teachings** | H-3 + H-6 from `106/research/review-report.md` §5.4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement (REVISED per council §6 + §10.1-2)

The original phase scope conflated two different concerns:
- `metrics.ts:233-247` is **bounded-retention diagnostic logging** — reads existing JSONL, appends one record, rewrites the last N records. Naive append-only would break retention semantics.
- `ccc-feedback.ts:18-72` is **authoritative MCP-handler persistence** that returns an error on write failure (lines 64-72). Fire-and-forget would silently drop user feedback and break the error contract.

Both are sync but they need DIFFERENT refactors. Mistreating either as "diagnostic fire-and-forget" would introduce bugs the council flagged as HIGH-severity.

### Purpose (REVISED)

Apply targeted refactors that preserve existing semantics while removing only the sync-blocking-on-disk-I/O latency:

1. **`metrics.ts` (diagnostic, bounded retention)**: Convert `mkdirSync`+`writeFileSync` to awaited `mkdir`+`writeFile` using `fs/promises`. Keep the read-append-rewrite-last-N pattern intact. Add closure-based `dirReady` flag for lazy mkdir. Add env-var enable gate `SKILL_ADVISOR_DEBUG=1` for the write path (default disabled in production). Refactor must remain awaited because retention requires the read-then-write ordering.

2. **`ccc-feedback.ts` (authoritative persistence)**: Convert `appendFileSync` to **awaited** `appendFile` from `fs/promises` (NOT fire-and-forget). Preserve the error-return contract at lines 64-72. Add lazy mkdir via closure flag. Safe-stringify fallback for circular objects. NO enable gate — this is user-facing feedback persistence, must always run.

The upstream pattern is "non-blocking diagnostic logging." `ccc-feedback.ts` is NOT diagnostic logging — it's a documented MCP handler with an error contract. The council unanimously called the original phase "lossy fire-and-forget on user data." Revised scope eliminates that risk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (REVISED per council §10.1-2)

**`metrics.ts` (skill-advisor, diagnostic logging with bounded retention)**:
- Keep the read-then-rewrite-last-N pattern at lines 233-247 (do NOT replace with naive append-only)
- Replace `mkdirSync` (line 219) + `writeFileSync` (line 247) with awaited `mkdir`/`writeFile` from `fs/promises`
- Add closure-scoped `dirReady` flag (lazy mkdir)
- Add env-var enable gate `SKILL_ADVISOR_DEBUG=1` early-return if disabled (diagnostic logging is opt-in in production)
- Smoke-test: write more than `maxRecords` lines, verify last-N retention still works

**`ccc-feedback.ts` (code-graph, authoritative persistence)**:
- Replace `appendFileSync` (line 63) with **awaited** `await appendFile(...)` from `fs/promises` — NOT fire-and-forget
- Replace `mkdirSync` (line 50) with awaited `await mkdir(...)`
- Add closure-scoped `dirReady` flag (lazy mkdir)
- Preserve existing error-return contract at lines 64-72 (catch errors and return MCP error response, do NOT silently swallow)
- Add safe-stringify fallback for circular objects (`try JSON.stringify catch { String(arg) }`)
- NO env-var enable gate — this is user-facing feedback persistence, must always run
- Smoke-test: confirm error contract intact when write fails (mock `fs.promises.appendFile` to throw, verify MCP error response returned)

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
