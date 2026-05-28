---
title: "Implementation Summary: Non-destructive mcp-server build (RC-4)"
description: "Removed the destructive prebuild auto-clean from @spec-kit/mcp-server so tsc --build runs incrementally in place; the live dist/ is never wiped, a running daemon survives a rebuild, and builds drop from minutes to ~1s. First implemented fix from the 030 daemon-reliability roadmap."
trigger_phrases:
  - "non-destructive mcp build summary"
  - "rebuild no longer crashes daemon"
  - "prebuild clean removed incremental"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-nondestructive-mcp-server-build"
    last_updated_at: "2026-05-28T20:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped non-destructive incremental build; verified (dist-freshness 18/18, orphan 5/6)"
    next_safe_action: "None for F4. Remaining 030 fixes (F2/F1/F3) are separate packets"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000314"
      session_id: "031-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-nondestructive-mcp-server-build |
| **Completed** | 2026-05-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rebuilding the mcp-server no longer kills a running daemon. The build used to delete the live `dist/` before recompiling; now it updates `dist/` incrementally in place, so a daemon mid-session keeps its loaded modules — and as a bonus, builds dropped from minutes to about a second. This is the first fix shipped from the 030 daemon-reliability roadmap (RC-4).

### Non-destructive incremental build

`@spec-kit/mcp-server`'s `prebuild` ran `clean` → `rmSync('dist', {recursive,force})` before every `tsc --build`. That wipe is what crashed the daemon during every rebuild this session (lazy imports hit `MODULE_NOT_FOUND` against the half-gone tree), and it deleted `dist/tsconfig.tsbuildinfo` so every build was a slow full recompile. Removing the auto-`prebuild` lets `tsc --build` reconcile only changed files in place against the preserved build-info — the live `dist/` is never destroyed. An explicit `clean` stays for manual wipes, and a new `rebuild` (`clean && build`) covers the rare intentional full rebuild. Sibling workspaces (`@spec-kit/shared`, `@spec-kit/scripts`) were already non-destructive, so the fix is scoped to mcp_server alone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Removed `prebuild` auto-clean; added `rebuild` (`clean && build`); kept `clean` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verified by running `npm run build` and confirming the live `dist/` stayed present throughout with all required artifacts (finalize-dist's `assertRequiredArtifacts()` passed), the rebuild completed in ~1s reusing `dist/tsconfig.tsbuildinfo` (incremental), and the regression guards held: `dist-freshness` 18/18 and source/dist orphan detection 5/6 (1 pre-existing skip). MCP was disconnected during the change, so no live daemon was at risk while touching the build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| In-place incremental build, not a `dist.next` + atomic-rename swap | The composite tsc project + project references make a per-invocation `outDir` redirect fragile; not wiping the live `dist/` already satisfies "never destroy the running daemon's tree," and it restores incrementality |
| Keep `clean`, add `rebuild` | Preserve an explicit full-clean path for orphan cleanup / CI without putting a destructive wipe on the default build path |
| Scope to mcp_server only | Grep confirmed shared + scripts already build incrementally with no destructive prebuild |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` leaves live dist intact + complete | PASS (key artifacts present before+after; finalize asserts passed) |
| Incremental (tsbuildinfo reused) | PASS (~1s wall-time vs minutes for a full wipe) |
| `dist-freshness.vitest.ts` | PASS (18/18) |
| `check-source-dist-alignment-orphans.vitest.ts` | PASS (5/6; 1 pre-existing skip) |
| Rebuild-while-daemon-runs (live) | Not run this session (MCP disconnected); the non-destructive property is structural (live dist never deleted) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A from-scratch build (`npm run rebuild`/`clean`) still has a partial-tree window** while tsc repopulates. The default `build` path no longer does this; run `rebuild` only when no daemon must stay up.
2. **Orphan `.js` from deleted/renamed sources** can linger without the auto-clean. The `dist-freshness`/orphan tests catch this, and `npm run rebuild` clears it. Not a daemon-stability issue.
3. **Only RC-4 is addressed.** The other 030 root causes (sidecar OOM, no auto-respawn, bridge-to-dead-socket) remain — separate packets per the 030 §6 roadmap.
<!-- /ANCHOR:limitations -->
