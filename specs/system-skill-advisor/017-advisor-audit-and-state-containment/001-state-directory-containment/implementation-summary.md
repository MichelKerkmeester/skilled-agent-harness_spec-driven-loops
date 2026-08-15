---
title: "Implementation Summary: 001 State Directory Containment"
description: "Advisor state writers routed through the anchored resolver; strays cleaned; spec reconciled to reality."
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-08-15T13:30:28Z"
    last_updated_by: "claude-code"
    recent_action: "Advisor consumer routing fixed and verified"
    next_safe_action: "Close 001; 002 surface-audit remains"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: 001 State Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-state-directory-containment |
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Base branch** | `skilled/v4.0.0.0` (origin-synced) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Routed every advisor state writer through the already-anchored resolver `findAdvisorWorkspaceRoot`, so a session whose cwd is a `specs/<packet>` directory can no longer plant a stray `.advisor-state` tree there. The resolver itself was already correct; the fix is entirely consumer-side.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/user-prompt-submit.ts` | Modified | `workspaceRootFor` anchors via `findAdvisorWorkspaceRoot` (primary leak entry) |
| `mcp-server/lib/freshness/generation.ts` | Modified | `getSkillGraphGenerationPath` anchors the `.advisor-state` path |
| `mcp-server/lib/skill-graph/skill-graph-db.ts` | Modified | `resolveSkillGraphDbDir` anchors the DB dir default |
| `mcp-server/handlers/skill-graph/scan.ts` | Modified | Scan cwd anchored |
| `mcp-server/advisor-server.ts` | Modified | Daemon root fallback anchored |
| `mcp-server/schemas/advisor-tool-schemas.ts` | Modified | Allowlist twin realigned to `hoistAboveOpencodeTree` |
| `mcp-server/tests/state-containment.vitest.ts` | Created | Boundary regression test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduce-first: the new `state-containment.vitest.ts` asserted the anchored root for the generation path, DB dir, and hook entry, and was watched failing on the two chokepoints against current code. The two path resolvers and the four entry points were then routed through `findAdvisorWorkspaceRoot`. Temp-dir tests are unaffected because the resolver returns roots with no sentinel and no `.opencode` segment unchanged. The three existing strays under `specs/` were removed. The 001 spec, plan, tasks, and checklist were reconciled from their stale 2026-07-27 premise (broken deny-list resolver, 40-dir repo-wide leak) to the verified reality (resolver already anchored; consumer-side leak; other named writers already anchored or gone).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Anchor at the two path chokepoints, not every call site | `getSkillGraphGenerationPath` and `resolveSkillGraphDbDir` re-anchor any caller's root, closing the leak regardless of the caller |
| Reuse `findAdvisorWorkspaceRoot`, add no new resolver | The structural resolver already shipped; the gap was routing |
| Retire the `.gitignore` backstop and repo-wide 40-dir cleanup | The structural resolver makes advisor recurrence impossible; the other named writers were verified already-anchored or gone, so the broad cleanup was obsolete |
| Amend the spec rather than satisfy stale requirements | The 2026-07-27 premise no longer matched the tree; recording verified reality is more honest than mechanically checking obsolete boxes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| `state-containment.vitest.ts` | Pass | Red on the two chokepoints, then `4/4` green |
| Typecheck (`tsc --noEmit`) | Pass | `exit 0` |
| workspace-root + hook suites | Pass | `32/32` |
| generation stress | Pass | `7/7` |
| Full suite baseline | Pass (delta 0) | 36 failures confirmed pre-existing via stash; unrelated scorer/parity |
| Stray sweep | Pass | `find specs -type d -name .advisor-state` returns `0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 002 (advisor surface audit) is separate** and remains Draft; this packet closes only the state-containment phase.
2. **The full advisor test suite has 36 pre-existing failures** in scorer/parity/corpus subsystems (unrelated to this change; confirmed on clean HEAD). They are not introduced or resolved here.
3. **Non-advisor writers are out of scope** — verified already-anchored (`findRepoRoot`) or non-existent, so no change was required.
<!-- /ANCHOR:limitations -->
