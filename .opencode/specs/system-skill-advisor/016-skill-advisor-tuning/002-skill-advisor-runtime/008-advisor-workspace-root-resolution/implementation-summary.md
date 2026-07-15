---
title: "Implementation Summary: Advisor workspace-root resolution by walk-up [template:level_2/implementation-summary.md]"
description: "Replaced cwd-based workspace-root resolution in the skill advisor with a deterministic module-relative walk-up, routed the two write-path call sites through it, rebuilt dist and cleaned 9 stray nested .advisor-state directories."
trigger_phrases:
  - "advisor root summary"
  - "advisor-state fix"
  - "resolveWorkspaceRoot walk-up summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/008-advisor-workspace-root-resolution"
    last_updated_at: "2026-07-06T16:57:18.543Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 implementation record"
    next_safe_action: "Recycle advisor daemon to activate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-advisor-root-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Advisor workspace-root resolution by walk-up

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/008-advisor-workspace-root-resolution |
| **Completed** | 2026-06-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor now resolves its workspace root deterministically instead of from the process working directory. `resolveWorkspaceRoot()` walks up from the module's own location until it finds the directory containing `.opencode/skills/system-skill-advisor`, then returns it. The startup scan and the daemon initialization, which previously passed `process.cwd()` as the workspace root, now use the resolver. Because generation paths derive from that root, the advisor always writes to the canonical `<root>/.opencode/skills/.advisor-state/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only investigation pinned the cause to `process.cwd()` at `advisor-server.ts:134` and `:298`, plus a latent bug in `resolveWorkspaceRoot()`: its `import.meta.dirname` candidate used a fixed `../../../..` depth that is correct for the source file but wrong for the compiled file, which lives one level deeper under `dist/mcp_server/`. That made the candidate dead at runtime, so the function always fell back to `process.cwd()`. The fix replaces the fixed-depth candidate with a walk-up, which is robust to both layouts and can never resolve a subdirectory.

Cleanup ran first so a leftover stray could not influence the result. Thirteen stray nested `.advisor-state` directories existed. The nine in the main tree were removed leaf-only, preserving any parent `.opencode` that held other content. The four inside isolated git worktrees were left untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Walk-up instead of reordering fixed-depth candidates | The compiled file is one level deeper than source, so no single fixed depth is correct. A walk-up handles both |
| Leaf-only cleanup | Several stray parents share a `.opencode` with real content (a worktree, a playbook tree). Removing only the `.advisor-state` leaf is safe |
| Leave worktree strays | Isolated and possibly owned by active sessions. They clear when those worktrees are removed |
| `resolveSkillGraphSourceDir` left as-is | It is a read path and does not create nesting. Noted as a follow-up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (advisor mcp_server) | PASS (0 errors) |
| `npm run build` (dist rebuild) | PASS (dist/mcp_server/advisor-server.js rebuilt) |
| Resolver from `cwd=tool/` | PASS (returns repo root, not the subdirectory) |
| Stray cleanup | 9 main-tree leaves removed, 0 remaining, canonical `.advisor-state/` intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live activation pending.** The running advisor daemon keeps the old dist until a `/mcp` reconnect or a fresh session. The launcher exits on child SIGTERM, so it is not transparent-recycle.
2. **Worktree strays remain.** Four stray `.advisor-state` directories inside isolated git worktrees were intentionally left.
3. **Sibling read path.** `resolveSkillGraphSourceDir()` shares the same fixed-depth anti-pattern but does not create nesting. A follow-up can route it through the resolver too.
<!-- /ANCHOR:limitations -->
