# Iteration 001 - Correctness Pass

## Scope

Focused on retrieval correctness for `memory_context`, `memory_match_triggers`, and their supporting session and trigger-matching helpers.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`

## Findings

### F001 - P1 - `memory_context` omits the minted session and reuses a process-wide fallback

Claim: when `memory_context` is called without `sessionId`, the public schema says the server generates a new session for the request, but the handler discards that generated UUID and uses a deterministic process-wide ID instead.

Evidence:

- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:44] documents that omitting `sessionId` lets the server generate a new session for the request.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`:421] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`:425] show `resolveTrustedSession(null)` returns `crypto.randomUUID()`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1111] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1116] call `resolveTrustedSession(args.sessionId ?? null, ...)`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1128] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1131] ignore `trustedSession.effectiveSessionId` when no session was requested and substitute `SPECKIT_MEMORY_SESSION_ID` or `PROCESS_MEMORY_SESSION_ID`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:164] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:167] define `PROCESS_MEMORY_SESSION_ID` from `cwd`, `pid`, and `ppid`, making it stable across omitted-session calls in the same process.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1522] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1526] still reports the scope as `ephemeral`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1561] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1568] forwards the reused ID into retrieval strategies.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1634] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1640] saves session state under that reused ID.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`:510] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`:524] claim to test an ephemeral UUID but only check string type and length, so the deterministic fallback can pass.

Impact: unrelated callers that omit `sessionId` can share working-memory mode, dedup state, event counters, and persisted scope metadata inside one server process. That contradicts the schema contract and can leak or suppress retrieval context across calls.

Concrete fix: use `trustedSession.effectiveSessionId` for omitted-session calls. If an environment override must exist for local debugging, expose it as an explicit non-ephemeral scope in metadata and test it separately. Add a regression test that calls `memory_context` twice without `sessionId` and asserts two different UUID-shaped effective IDs.

Claim adjudication:

- Counterevidence sought: whether `PROCESS_MEMORY_SESSION_ID` was only used before trusted-session support or hidden behind a test flag.
- Counterevidence found: none. The live code path uses the deterministic fallback unconditionally when no session was requested.
- Alternative explanation: stable process scope could be intentional for REPL continuity, but the schema and metadata both advertise per-request ephemeral behavior.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: only downgrade if product contract is changed to document process-wide anonymous sessions and isolation is no longer required.

### F003 - P1 - `memory_match_triggers` can drop valid scoped matches before filtering

Claim: scoped trigger matching fetches only `limit * 2` global matches before scope filtering, so valid in-scope matches that rank below out-of-scope matches never get considered.

Evidence:

- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:248] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:250] clamp the caller limit.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:304] calls `matchTriggerPhrasesWithStats(prompt, limit * 2)` before scope filtering.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`:871] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`:874] pass that limit into the actual matcher.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:307] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:340] apply `specFolder`, `tenantId`, `userId`, and `agentId` filters only after the capped global result set is produced.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`:322] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`:367] verify filtering over a small mocked set but do not cover the oversampling/refill case where scoped matches exist beyond the initial global cutoff.

Impact: a scoped call can return no or too few trigger matches even when matching in-scope trigger phrases exist. Any startup or resume path relying on `memory_match_triggers({ specFolder, tenantId, userId, agentId })` can miss relevant continuity because out-of-scope matches consumed the small prefilter window.

Concrete fix: push scope constraints into trigger matching, or overfetch until either the scoped limit is satisfied or the match corpus is exhausted. Add a regression test with more than `limit * 2` out-of-scope high-ranked matches followed by an in-scope match.

Claim adjudication:

- Counterevidence sought: whether `limit * 2` is guaranteed to exceed the trigger corpus or whether cache entries are pre-partitioned by scope.
- Counterevidence found: the handler explicitly queries `memory_index` for only the capped memory IDs after global matching, so no pre-partition guarantee is present at this layer.
- Alternative explanation: overfetch was intended as a cheap approximation. That does not satisfy exact governed-scope retrieval.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: downgrade to P2 only if trigger matching is advisory-only and never used for scoped resume/context recovery.

## Traceability Check

- `spec_code`: covered. The findings map to the retrieval correctness scope in [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:36] to [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:40].
- `checklist_evidence`: not applicable for this packet because no `checklist.md` exists; evidence is captured directly in this iteration.

## Reducer Delta

- New findings: F001, F003.
- Dimensions covered: correctness.
- Severity delta: P1 +2.
- New findings ratio: 1.00.

Review verdict: CONDITIONAL
