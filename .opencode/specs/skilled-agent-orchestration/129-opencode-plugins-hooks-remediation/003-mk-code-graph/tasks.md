---
title: "Tasks: mk-code-graph remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-code-graph remediation"
  - "mk-code-graph fixes"
  - "mk-code-graph bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/003-mk-code-graph"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 13 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-code-graph.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-code-graph remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the mk-code-graph test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] Bridge timeout can leave its promise unresolved when descendants retain stdio (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:403`)
    - Source: iteration-1 F2, Opus verdict: adjusted
    - Fix: Mirror the Claude fallback: spawn the shim with detached:true, kill the process group on timeout, listen for exit as well as close, and settle after a short exit grace period.
- [ ] T004 [P1 (GPT P1 / Opus refinement)] Claude runs a stale compiled hook instead of the reviewed source (`.claude/settings.json:56`)
    - Source: iteration-1 F3, Opus verdict: adjusted
    - Fix: Rebuild the spec-kit MCP server and keep the dist-freshness check as a blocking verification gate whenever hook source changes.
- [ ] T005 [P1 (GPT P1 / Opus P2)] Claude never refreshes code-graph status after startup or resume (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361`)
    - Source: iteration-1 F4, Opus verdict: confirmed
    - Fix: Reuse the bounded warm-only helper from the existing UserPromptSubmit and PreCompact paths, or add equivalent cached refresh logic there. Also permit a compact-source status section when the recovered payload lacks current structural status.

### P2 - minor bugs

- [ ] T006 [P2 (GPT P2 / Opus refinement)] Named parser export can cause OpenCode to drop the entire plugin (`.opencode/plugins/mk-code-graph.js:176`)
    - Source: iteration-1 F1, Opus verdict: adjusted
    - Fix: Remove the named export from the plugin module. Keep parseTransportPlan module-local or move it to a separate non-plugin helper module that tests can import, and add a loader-contract test asserting that the plugin module exposes exactly one default export.
- [ ] T007 [P2] Malformed plugin configuration is silently treated as absent (`.opencode/plugins/mk-code-graph.js:54`)
    - Source: iteration-1 F5, Opus verdict: confirmed
    - Fix: Ignore only ENOENT silently. Record other failures in plugin diagnostic state and expose them through mk_code_graph_status, with stderr emission remaining debug-gated.
- [ ] T008 [P2] Successful slow bridge responses are cached already expired (`.opencode/plugins/mk-code-graph.js:318`)
    - Source: iteration-1 F6, Opus verdict: confirmed
    - Fix: Calculate expiresAt from Date.now() after the bridge succeeds, while retaining the original start time separately if latency diagnostics are needed.
- [ ] T009 [P2 (GPT P2 / Opus refinement)] Transport-plan validation permits message blocks that crash the transform (`.opencode/plugins/mk-code-graph.js:193`)
    - Source: iteration-1 F7, Opus verdict: adjusted
    - Fix: Validate interfaceVersion and every transport block before caching the plan; reject the complete plan with a status-tool diagnostic when required string fields are absent.
- [ ] T010 [P2 · Opus-new] messages.transform hook lacks the output guard its sibling hooks have (`.opencode/plugins/mk-code-graph.js:470`)
    - Source: Opus iteration-2 (new)
    - Fix: Mirror the sibling guards: bail early if output is not an object or output.messages is not an array before calling .at(-1).
- [ ] T011 [P2 · Opus-new] No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache (`.opencode/plugins/mk-code-graph.js:288`)
    - Source: Opus iteration-2 (new)
    - Fix: Store the pending Promise keyed by cacheKeyForSession and return it to concurrent callers until it settles, then cache the result.
- [ ] T012 [P2 · Opus-new] Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369`)
    - Source: Opus iteration-2 (new)
    - Fix: Have the bridge omit the raw codeGraphStatus payload from the plugin-facing response (or gate it behind a flag); the plugin only needs opencodeTransport + brief. Optionally raise the plugin maxBuffer.

### Refinements

- [ ] T013 [refinement] Bridge accepts minimal and spec-folder flags but never uses them (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239`)
    - Source: iteration-1 F8, Opus verdict: confirmed
    - Fix: Either remove the unused flags and related plugin option or explicitly map them into supported code-index arguments and add an integration assertion proving the resulting query scope.
- [ ] T014 [refinement · Opus-new] Dedup scan assumes string entries in output.system / output.context (`.opencode/plugins/mk-code-graph.js:463`)
    - Source: Opus iteration-2 (new)
    - Fix: Guard with `typeof entry === 'string' && entry.includes(rendered)`.
- [ ] T015 [refinement · Opus-new] Cache invalidation frequency asymmetry compounds the F6 slow-cache bug (`.opencode/plugins/mk-code-graph.js:371`)
    - Source: Opus iteration-2 (new)
    - Fix: Decouple TTL from invalidation: only invalidate on session lifecycle boundaries (not every message.*), and raise TTL above typical bridge latency so warm entries actually serve.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T016 Re-run the mk-code-graph test suite; confirm green
- [ ] T017 Verify each fixed finding no longer reproduces
- [ ] T018 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/003-mk-code-graph/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
