---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/003-runtime-deregistration"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-003-runtime-deregistration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-runtime-deregistration |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Every runtime config that registered the `mk_code_index` MCP server has been cleared, and the two Claude hook/allowlist entries that pointed into the skill folder are gone. No runtime now attempts to spawn a launcher whose target is about to disappear.

### Registrations cleared

The `mk_code_index` server block was removed from `opencode.json`, `.claude/mcp.json` (which the `.mcp.json` and `.cursor/mcp.json` symlinks resolve to), `.pi/mcp.json`, and `.codex/config.toml` (the latter was already clean). The Claude `Write|Edit` PostToolUse freshness hook was removed from `.claude/settings.json`, and the `code-index.cjs` entry was removed from the `.claude/settings.local.json` Bash allowlist. You can start OpenCode, Claude, Codex, or Pi without an MCP registration error.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `opencode.json` | Modified | Removed `mk_code_index` server block |
| `.claude/mcp.json` | Modified | Removed block (covers `.mcp.json` + `.cursor/mcp.json` symlinks) |
| `.pi/mcp.json` | Modified | Removed block |
| `.claude/settings.json` | Modified | Removed PostToolUse freshness hook |
| `.claude/settings.local.json` | Modified | Removed `code-index.cjs` allowlist entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Symlinks were resolved first so each real file was edited exactly once, then a `rg --hidden --no-ignore` sweep confirmed no `mk_code_index` reference survives in any config and JSON/TOML still parse.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Edit the real file behind the symlinks, not each link | Editing through a symlink would create a duplicate file and diverge the runtimes |
| Record `.codex/config.toml` as already-clean rather than editing | It contained no `mk_code_index` entry, so no change was needed or made |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `rg --hidden --no-ignore mk_code_index` across configs | PASS — no hit in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.pi/mcp.json` |
| JSON / TOML parse after edits | PASS |
| Fresh session start per runtime | Not separately recorded; inferred clean from the config sweep |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Fresh-session start was not separately captured** per runtime in the facts; the clean config sweep is the recorded evidence. A runtime restart beyond a fresh session is not measured.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

