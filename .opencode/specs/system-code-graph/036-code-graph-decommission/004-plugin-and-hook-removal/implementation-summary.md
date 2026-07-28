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
    packet_pointer: "system-code-graph/036-code-graph-decommission/004-plugin-and-hook-removal"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-004-plugin-and-hook-removal"
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
| **Spec Folder** | 004-plugin-and-hook-removal |
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

Every load-time and lifecycle-time path that reached into the code-graph skill folder is severed. The two OpenCode plugins are gone, the freshness hooks are out of every manifest, the reaper scripts no longer match a daemon that will never exist, and the orphan freshness-state directory is deleted.

### Plugins and hooks removed

The transport-bridge plugin (`mk-code-graph.js`) and the freshness plugin (`mk-code-graph-freshness.js`) were deleted along with their tests, because a static ESM import that fails cannot degrade gracefully and would crash the plugin host. The freshness hook entries were removed structurally from the Codex and Devin manifests, and the Cursor chained hook that lives inside `system-spec-kit` (rather than beside its three siblings) was stripped. Post-commit database invalidation, the daemon match patterns in `session-cleanup.sh` and `orphan-mcp-sweeper.sh`, and the worktree copy/exclude rules were all cleaned, and the `.code-graph-freshness-state` directory was deleted.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-code-graph.js` | Deleted | Transport bridge plugin |
| `.opencode/plugins/mk-code-graph-freshness.js` | Deleted | Freshness plugin |
| `.opencode/plugins/tests/mk-code-graph*.test.cjs` | Deleted | Plugin tests |
| `.codex/hooks.json`, `.devin/hooks.v1.json` | Modified | Freshness hook entries removed |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Modified | Cursor chained hook stripped |
| `.opencode/scripts/git-hooks/post-commit` | Modified | Database invalidation removed |
| `.opencode/scripts/session-cleanup.sh`, `orphan-mcp-sweeper.sh` | Modified | Daemon match patterns removed |
| `.opencode/bin/worktree-session.sh` | Modified | Copy/exclude rules cleaned |
| `.opencode/skills/.code-graph-freshness-state/` | Deleted | Orphan state directory |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Plugins were deleted outright rather than guarded, hook entries removed structurally (matcher objects, not just strings), and the session-cleanup test was repointed at a surviving launcher so the suite stayed green at 13/13. The work was partly executed by a concurrent session and completed here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Delete plugins outright instead of guarding the import | A static ESM import failure crashes plugin load; guarding leaves a dead code path |
| Remove the Codex hook matcher object structurally | Dropping only the string would leave a matcher pointing at nothing |
| Repoint the session-cleanup test at a surviving launcher | Keeps reaper coverage honest without referencing the removed daemon |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| session-cleanup vitest suite | PASS — 13/13 after repointing to a surviving launcher |
| Hook manifests parse and omit the entry | PASS |
| Reaper scripts match nothing | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **The installed `~/.codex/hooks.json` refresh** (outside the repo) is not confirmed green in the facts; the tracked manifest is clean, but drift of the deployed copy is not separately recorded here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

