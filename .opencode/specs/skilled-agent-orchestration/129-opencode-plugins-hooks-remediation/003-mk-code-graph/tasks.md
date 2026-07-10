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
    last_updated_at: "2026-07-10T11:42:16.907Z"
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
    - Source: iteration-1 F2, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Mirror the already-correct Claude fallback in code-index-cli-fallback.ts (runWarmCodeIndexCliTool, lines 209-296): spawn detached, kill the whole process group on timeout, and settle on 'exit' after a short grace in addition to 'close'.
    - REVIEW-FLAG (correct the design before implementing): The Claude-fallback timeout only kills the process group and still depends on error/exit/close to settle; ensure the promise resolves even if descendants retain stdio.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [ ] T004 [RECLASSIFIED: non-issue] Claude runs a stale compiled hook instead of the reviewed source (`.claude/settings.json:56`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. 4-model consensus: dist is verifiably fresh and running the compiled JS from .claude/settings.json is intentional. No code fix. Keep the dist-freshness / CI gate as process discipline.
- [ ] T005 [P1 (GPT P1 / Opus P2)] Claude never refreshes code-graph status after startup or resume (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361`)
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Reuse the existing bounded warm helper on the per-turn and pre-compaction Claude hooks so Claude reaches rough parity with OpenCode's per-transform refresh, and allow a compact-source status section. Keep the same warm-only, retryable, no-cold-spawn discipline (timeoutMs ≤ 600).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)

### P2 - minor bugs

- [ ] T006 [P2 (GPT P2 / Opus refinement)] Named parser export can cause OpenCode to drop the entire plugin (`.opencode/plugins/mk-code-graph.js:176`)
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Make the plugin module export ONLY its default factory. Move parseTransportPlan (and diagnoseTransportPlanFailure, which is module-local anyway) into a separate non-plugin helper module that both the plugin and tests import.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [ ] T007 [P2] Malformed plugin configuration is silently treated as absent (`.opencode/plugins/mk-code-graph.js:54`)
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Silently ignore ONLY ENOENT (expected absence). For any other error, record it into plugin diagnostic state and surface it via mk_code_graph_status, keeping stderr emission debug-gated (TUI-safe).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [ ] T008 [P2] Successful slow bridge responses are cached already expired (`.opencode/plugins/mk-code-graph.js:318`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Compute expiresAt from a fresh timestamp taken AFTER the bridge succeeds. Keep the original start time only if you want latency diagnostics.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [ ] T009 [P2 (GPT P2 / Opus refinement)] Transport-plan validation permits message blocks that crash the transform (`.opencode/plugins/mk-code-graph.js:193`)
    - Source: iteration-1 F7, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Validate each transport block (and its required string fields) during parse, before the plan is cached/returned. Reject the whole plan with a status-tool diagnostic when a required field is missing or a block is malformed. Optionally validate interfaceVersion.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [ ] T010 [P2 · Opus-new] messages.transform hook lacks the output guard its sibling hooks have (`.opencode/plugins/mk-code-graph.js:470`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Add the same defensive guard the siblings have before dereferencing output.messages.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
- [ ] T011 [P2 · Opus-new] No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache (`.opencode/plugins/mk-code-graph.js:288`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Single-flight: keep a pending-promise map keyed by cacheKeyForSession; concurrent callers on a cold key await the same in-flight promise; clear it once settled, then serve from the completed cache.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [ ] T012 [P2 · Opus-new] Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Have the bridge omit the raw codeGraphStatus payload from the plugin-facing response when the plugin's `--minimal` flag is set (this also gives F8's minimal flag real meaning). Keep opencodeTransport + brief. This is the smaller, correct fix vs. bumping maxBuffer.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)

### Refinements

- [ ] T013 [refinement] Bridge accepts minimal and spec-folder flags but never uses them (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239`)
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Give `minimal` a real use (gate the raw codeGraphStatus payload per O3) and REMOVE the dead specFolder forwarding rather than inventing an unsupported scope arg. Keep the plugin's own specFolder usage (cache keying/invalidation) which is legitimate and separate.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [ ] T014 [refinement · Opus-new] Dedup scan assumes string entries in output.system / output.context (`.opencode/plugins/mk-code-graph.js:463`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Guard each entry with a typeof check before calling includes, in both the system and context dedup scans.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [ ] T015 [refinement · Opus-new] Cache invalidation frequency asymmetry compounds the F6 slow-cache bug (`.opencode/plugins/mk-code-graph.js:371`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Decouple TTL from invalidation semantics: invalidate only on session lifecycle boundaries and genuine graph-mutation signals — NOT on ordinary message.* traffic — and raise TTL above typical bridge latency so warm entries actually serve. Combine with F6's timestamp fix and O2's single-flight.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)

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
