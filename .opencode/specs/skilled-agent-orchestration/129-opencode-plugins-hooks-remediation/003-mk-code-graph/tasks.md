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
    last_updated_at: "2026-07-10T20:17:48.051Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped remaining mk-code-graph fixes"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-code-graph.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
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
- [x] T001 Capture a green baseline of the mk-code-graph test suite before any change
    - Evidence: baseline captured before edits; plugin suite re-run post-implementation 188/189 (the 1 fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not a regression).
- [x] T002 Confirm each targeted finding reproduces against current code
    - Evidence: each finding cross-checked against real code during the reconciled fix-design pass (`fix-design/fix-design.md`), both models re-reading source.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [x] T003 [P1 (GPT P1 / Opus P2)] Bridge timeout can leave its promise unresolved when descendants retain stdio (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:403`)
    - IMPLEMENTED (F2): detached-group spawn + process-group kill + exit-grace settle ported to the bridge runCli. Evidence: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`.
    - Source: iteration-1 F2, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Mirror the already-correct Claude fallback in code-index-cli-fallback.ts (runWarmCodeIndexCliTool, lines 209-296): spawn detached, kill the whole process group on timeout, and settle on 'exit' after a short grace in addition to 'close'.
    - REVIEW-FLAG (correct the design before implementing): The Claude-fallback timeout only kills the process group and still depends on error/exit/close to settle; ensure the promise resolves even if descendants retain stdio.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [ ] T004 [RECLASSIFIED: non-issue — no fix, by design] Claude runs a stale compiled hook instead of the reviewed source (`.claude/settings.json:56`)
    - Disposition: RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. 4-model consensus: dist is verifiably fresh and running the compiled JS from .claude/settings.json is intentional. No code fix. Keep the dist-freshness / CI gate as process discipline. Left unchecked intentionally (F3 = non-issue, correctly no fix).
- [x] T005 [P1 (GPT P1 / Opus P2)] Claude never refreshes code-graph status after startup or resume (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361`)
    - IMPLEMENTED (F4): per-turn warm code-graph refresh added to the Claude UserPromptSubmit shim; PreCompact warm status read added; session-prime already carried compact eligibility. Evidence: `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`.
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Reuse the existing bounded warm helper on the per-turn and pre-compaction Claude hooks so Claude reaches rough parity with OpenCode's per-transform refresh, and allow a compact-source status section. Keep the same warm-only, retryable, no-cold-spawn discipline (timeoutMs ≤ 600).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)

### P2 - minor bugs

- [x] T006 [P2 (GPT P2 / Opus refinement)] Named parser export can cause OpenCode to drop the entire plugin (`.opencode/plugins/mk-code-graph.js:176`)
    - IMPLEMENTED (F1): `parseTransportPlan` + `diagnoseTransportPlanFailure` extracted to a sibling helper so the plugin module is default-export-only. Evidence: new `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs`; `.opencode/plugins/mk-code-graph.js` now imports them (no named export).
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Make the plugin module export ONLY its default factory. Move parseTransportPlan (and diagnoseTransportPlanFailure, which is module-local anyway) into a separate non-plugin helper module that both the plugin and tests import.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [x] T007 [P2] Malformed plugin configuration is silently treated as absent (`.opencode/plugins/mk-code-graph.js:54`)
    - IMPLEMENTED (F5): only ENOENT is swallowed silently; other config errors are recorded and surfaced via `mk_code_graph_status`. Evidence: `.opencode/plugins/mk-code-graph.js`.
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Silently ignore ONLY ENOENT (expected absence). For any other error, record it into plugin diagnostic state and surface it via mk_code_graph_status, keeping stderr emission debug-gated (TUI-safe).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [x] T008 [P2] Successful slow bridge responses are cached already expired (`.opencode/plugins/mk-code-graph.js:318`)
    - IMPLEMENTED (F6): `expiresAt`/`updatedAt` computed from a fresh timestamp taken AFTER the bridge succeeds. Evidence: `.opencode/plugins/mk-code-graph.js`.
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Compute expiresAt from a fresh timestamp taken AFTER the bridge succeeds. Keep the original start time only if you want latency diagnostics.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [x] T009 [P2 (GPT P2 / Opus refinement)] Transport-plan validation permits message blocks that crash the transform (`.opencode/plugins/mk-code-graph.js:193`)
    - IMPLEMENTED (F7): each transport block and its required string fields are validated during parse; malformed plans are rejected with a status-tool diagnostic. Evidence: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs` (parse/validate + `diagnoseTransportPlanFailure`).
    - Source: iteration-1 F7, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Validate each transport block (and its required string fields) during parse, before the plan is cached/returned. Reject the whole plan with a status-tool diagnostic when a required field is missing or a block is malformed. Optionally validate interfaceVersion.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [x] T010 [P2 · Opus-new] messages.transform hook lacks the output guard its sibling hooks have (`.opencode/plugins/mk-code-graph.js:470`)
    - IMPLEMENTED (O1): the same defensive `output`/`output.messages` guard the sibling hooks have added before dereferencing. Evidence: `.opencode/plugins/mk-code-graph.js`.
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Add the same defensive guard the siblings have before dereferencing output.messages.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
- [x] T011 [P2 · Opus-new] No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache (`.opencode/plugins/mk-code-graph.js:288`)
    - IMPLEMENTED (O2): single-flight pending-promise map keyed by cache key; concurrent cold callers await one in-flight bridge call, cleared on settle. Evidence: `.opencode/plugins/mk-code-graph.js`.
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Single-flight: keep a pending-promise map keyed by cacheKeyForSession; concurrent callers on a cold key await the same in-flight promise; clear it once settled, then serve from the completed cache.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [x] T012 [P2 · Opus-new] Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369`)
    - IMPLEMENTED (O3): the raw `codeGraphStatus` payload is omitted from the plugin-facing response when `--minimal` is set (gates F8's minimal flag too); `opencodeTransport` + brief retained. Evidence: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` (`...(!input.minimal ? { codeGraphStatus: payload } : {})`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Have the bridge omit the raw codeGraphStatus payload from the plugin-facing response when the plugin's `--minimal` flag is set (this also gives F8's minimal flag real meaning). Keep opencodeTransport + brief. This is the smaller, correct fix vs. bumping maxBuffer.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)

### Refinements

- [x] T013 [refinement] Bridge accepts minimal and spec-folder flags but never uses them (`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239`)
    - IMPLEMENTED (F8): `minimal` now gates the raw payload (via O3); the dead `--spec-folder` forwarding removed from the plugin invocation and from the bridge parseArgs + metadata. Plugin-side `specFolder` cache keying/invalidation kept (legitimate, separate). Evidence: `.opencode/plugins/mk-code-graph.js` (no `--spec-folder` forwarding), `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` (parseArgs no longer recognizes `--spec-folder`).
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Give `minimal` a real use (gate the raw codeGraphStatus payload per O3) and REMOVE the dead specFolder forwarding rather than inventing an unsupported scope arg. Keep the plugin's own specFolder usage (cache keying/invalidation) which is legitimate and separate.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [x] T014 [refinement · Opus-new] Dedup scan assumes string entries in output.system / output.context (`.opencode/plugins/mk-code-graph.js:463`)
    - IMPLEMENTED (O4): each entry guarded with a `typeof entry === 'string'` check before `.includes`, in both the system and context dedup scans. Evidence: `.opencode/plugins/mk-code-graph.js`.
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Guard each entry with a typeof check before calling includes, in both the system and context dedup scans.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [x] T015 [refinement · Opus-new] Cache invalidation frequency asymmetry compounds the F6 slow-cache bug (`.opencode/plugins/mk-code-graph.js:371`)
    - IMPLEMENTED (O5): invalidation decoupled from TTL — narrowed to session lifecycle boundaries instead of ordinary `message.*` traffic, combined with F6's timestamp fix and O2's single-flight. Evidence: `.opencode/plugins/mk-code-graph.js` (`shouldInvalidateEvent`/`invalidateTransportCache`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Decouple TTL from invalidation semantics: invalidate only on session lifecycle boundaries and genuine graph-mutation signals — NOT on ordinary message.* traffic — and raise TTL above typical bridge latency so warm entries actually serve. Combine with F6's timestamp fix and O2's single-flight.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T016 Re-run the mk-code-graph test suite; confirm green
    - Evidence: plugin suite 188/189; the single failure is the pre-existing mk-goal-tool-path deep-loops path artifact (not a regression from this packet). Type-check 0 errors; `dist/` rebuilt.
- [x] T017 Verify each fixed finding no longer reproduces
    - Evidence: F1/F5/F6/F7/O1-O5/F8 fixes exercised by the plugin/bridge suites; F2/F4 covered by bridge lifecycle and Claude hook tests. F3 intentionally unchanged (non-issue).
- [x] T018 Verify OpenCode<->Claude parity for this plugin
    - Evidence: F2 brings the bridge to parity with the Claude fallback (detached group-kill + exit-grace); F4 adds Claude per-turn + pre-compaction code-graph refresh matching OpenCode's per-transform refresh.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P1 tasks `[x]` (T003 F2, T005 F4)
- [x] P2 + refinements applied or deferred with rationale (T006-T015 shipped; T004/F3 non-issue by design)
- [x] Plugin tests green; no `[B]` blocked tasks (188/189; 1 pre-existing unrelated failure)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/003-mk-code-graph/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
