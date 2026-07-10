---
title: "Implementation Summary [129/003-mk-code-graph]"
description: "mk-code-graph plugin/bridge/hook remediation: 12 of 13 audit findings shipped and tested; F3 confirmed non-issue."
trigger_phrases:
  - "mk-code-graph remediation summary"
  - "mk-code-graph implementation summary"
  - "mk-code-graph fixes shipped"
  - "opencode plugin remediation summary"
importance_tier: "normal"
contextType: "implementation"
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
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs"
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mk-code-graph |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Remediated the mk-code-graph OpenCode plugin, its Node bridge, and the Claude-side code-graph refresh hooks against the 129 audit. Of the 13 findings, 12 shipped (F1, F2, F4, F5, F6, F7, F8, O1-O5); F3 was confirmed a non-issue by a 4-model review and correctly received no code change. The three findings authored in this session are F4 (Claude per-turn + pre-compaction code-graph refresh parity), F1 (parser extracted so the plugin module is default-export-only), and F8 (dead `--spec-folder` forwarding removed). The remaining nine were already shipped earlier in the packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs` | Created | Houses `parseTransportPlan` + `diagnoseTransportPlanFailure` (F1) with the per-block string-field validation (F7), so the plugin module no longer needs a named export. |
| `.opencode/plugins/mk-code-graph.js` | Modified | Default-export-only (imports the transport helper, F1); ENOENT-only config swallow with diagnostic surfacing (F5); post-success cache timestamp (F6); messages.transform output guard (O1); single-flight in-flight dedup (O2); string-typeof dedup guards (O4); session-lifecycle-only invalidation (O5); dropped `--spec-folder` forwarding (F8). |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Modified | Detached process-group spawn + group-kill + exit-grace settle for the timeout path (F2); `--minimal` now gates the raw `codeGraphStatus` payload (O3); removed the unused `--spec-folder` parseArgs branch + metadata (F8). |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Modified | Added a warm-only, cached per-turn code-graph status refresh so Claude reaches parity with OpenCode's per-transform refresh (F4). |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modified | Added a bounded warm code-graph status read into the PreCompact codeGraph input (F4). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding's fix design was verified against the real code by two independent models (`fix-design/fix-design.md`) before implementation. The 12 shipped fixes were applied across the plugin, the new transport helper, the bridge, and the two Claude hooks, then exercised by the plugin/hook suite (188/189, the single failure pre-existing and unrelated), a clean type-check, and a `dist/` rebuild so the compiled Claude hooks match source. F3 was closed as a non-issue by the 4-model review rather than shipped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Extract the parser into a sibling `.mjs` rather than just dropping the `export` keyword | OpenCode's legacy loader treats every exported plugin function as an entrypoint; a shared helper keeps the plugin default-export-only while both plugin and tests still import the parser. |
| Remove dead `--spec-folder` forwarding instead of wiring a scope arg | `code-index.cjs` has no spec-folder scoping, so code-graph-status is graph-global; forwarding would be a no-op. Plugin-side `specFolder` cache keying/invalidation is legitimate and was kept. |
| Gate the raw `codeGraphStatus` payload behind `--minimal` (O3) rather than raise `maxBuffer` | The plugin only reads `opencodeTransport`; omitting the raw payload is the smaller correct fix for the 1MB execFile limit and gives F8's `minimal` flag real meaning. |
| F3 left as a non-issue, no code change | 4-model consensus (GPT + Opus designed; Fable 5 + Sol xhigh reviewed): the compiled dist is verifiably fresh and running compiled JS from `.claude/settings.json` is intentional. Kept as CI/dist-freshness process discipline. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Plugin/hook suite | Pass (188/189) | The single failure is the pre-existing mk-goal-tool-path deep-loops path artifact, NOT a regression from this packet. |
| Type-check | Pass (0 errors) | Full type-check clean after the hook and bridge edits. |
| Build | Pass | `dist/` rebuilt so the compiled Claude hooks match source. |
| Finding parity (F2, F4) | Pass | F2 mirrors the Claude fallback's detached group-kill + exit-grace; F4 adds Claude per-turn + pre-compaction refresh matching OpenCode's per-transform cadence. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One pre-existing suite failure remains red** - The mk-goal-tool-path deep-loops path artifact (188/189) is unrelated to this packet and out of scope here.
2. **F3 is process discipline, not code** - Preventing a stale compiled Claude hook depends on the dist-freshness / CI gate staying enforced; no runtime code guards it.
3. **O5 keeps the default TTL** - Invalidation was narrowed to session lifecycle events; raising `DEFAULT_CACHE_TTL_MS` above bridge latency remains a separately measured freshness decision if warm-serve rates prove insufficient.
<!-- /ANCHOR:limitations -->
