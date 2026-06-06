---
title: "Implementation Summary: Runtime Defect Fixes [system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/implementation-summary]"
description: "Four live defects fixed and smoke-verified: code-graph plugin bridge restored, Codex hooks rewired to their adapters, two doc corrections; orphan sweep verified as a no-op."
trigger_phrases:
  - "runtime defect fixes result"
  - "bridge repair complete"
  - "026 008 summary"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes"
    last_updated_at: "2026-06-06T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All four fixes applied and smoke-verified"
    next_safe_action: "Commit alongside the 028 program work"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
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
| **Spec Folder** | 026-graph-and-context-optimization/008-runtime-defect-fixes |
| **Completed** | 2026-06-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four live defects surfaced by the 028 CLI-transition research are fixed in place. The OpenCode code-graph plugin bridge (`mk-code-graph-bridge.mjs`) imports its session-resume/vector-index/session-manager modules from system-spec-kit's compiled dist again — it had crashed on import since skill extraction moved those files, which is why sessions reported "Code Graph: unavailable". Codex sessions now run the purpose-built Codex hook adapters (SessionStart + UserPromptSubmit) instead of Claude's scripts; PreCompact intentionally keeps the shared Claude script. The backwards DB-path note in `.codex/config.toml` and the Gemini catalog's shim-vs-implementation confusion are corrected.

The planned orphan-launcher sweep ended as a verified NO-OP: parent-process classification showed all 9 running launchers belong to live sessions (six Claude sessions, one OpenCode TUI — including a 1-day-7-hour session still open). The launcher-lifecycle fix for true owner-exit orphans stays with the 028 skill-advisor workstream.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| mk-code-graph-bridge.mjs | Modified | Three imports re-pointed + borrow documented |
| .codex/hooks.json | Modified | SessionStart/UserPromptSubmit → codex adapters |
| .codex/config.toml | Modified | DB-path note corrected |
| gemini-hook.md (skill-advisor catalog) | Modified | Implementation/shim rows corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verify-first: each defect was reproduced live (missing import targets listed, hook commands grepped, launcher parent PIDs classified) before its minimal fix, then smoke-tested immediately (bridge `--minimal` run, both codex adapters fed sample stdin).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep PreCompact on the shared Claude script | The hook architecture shares it by design; only SessionStart/UserPromptSubmit have Codex-native adapters |
| Document the cross-skill borrow in the bridge instead of restructuring | The 028 code-index phase 3 replaces this bridge path with the CLI-backed one; minimal fix now, proper transport later |
| Sweep as no-op rather than killing old launchers | Every launcher's parent is a live session; launchers ARE those sessions' MCP transports — killing them breaks working sessions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bridge smoke (`--minimal`) | PASS — exit 0, 6,097-byte JSON, `data.opencodeTransport.transportOnly: true` |
| Codex session-start smoke | PASS — valid envelope, 466-byte additionalContext |
| Codex user-prompt-submit smoke | PASS — valid JSON fail-open envelope |
| hooks.json parses | PASS |
| Sweep safety (REQ-004) | PASS — zero kills; all 9 launcher parents classified as live sessions |
| Packet strict validation | PASS (run at reconciliation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The bridge still borrows spec-kit internals cross-skill — acceptable stopgap; the 028 code-index runtime-integration phase delivers the proper CLI-backed transport.
2. Codex UPS smoke returned a fail-open empty envelope (advisor brief content depends on daemon availability at call time) — correct contract behavior, but a live Codex session should confirm brief content post-rewiring.
<!-- /ANCHOR:limitations -->
