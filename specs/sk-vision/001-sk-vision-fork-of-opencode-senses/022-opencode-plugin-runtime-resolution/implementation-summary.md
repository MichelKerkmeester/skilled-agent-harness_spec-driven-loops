---
title: "Implementation Summary: OpenCode plugin runtime resolution"
description: "Closeout for repointing the OpenCode plugin load path to the self-locating dist/plugin.js, fixing the RUNTIME_UNAVAILABLE regression, and correcting the load-path docs."
trigger_phrases:
  - "sk-vision opencode plugin runtime resolution summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution"
    last_updated_at: "2026-08-18T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Repointed the OpenCode plugin symlink to dist/plugin.js; docs fixed."
    next_safe_action: "Restart OpenCode to confirm the spawn, then commit."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution/implementation-summary.md"
      - ".opencode/plugins/sk-vision.js"
      - ".opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-022-opencode-plugin-runtime-resolution"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-opencode-plugin-runtime-resolution |
| **Status** | In Progress |
| **Level** | 1 |

The symlink repoint and doc corrections are done and verified by replication; a live OpenCode spawn (needs a restart, not testable from a Claude session) and the commit are the remaining steps.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode plugin load path now resolves to the built `vision-runtime/dist/plugin.js`, which lives inside the runtime package and therefore locates `python/runtime.py` at spawn — fixing the `RUNTIME_UNAVAILABLE` regression. The docs that named the un-locatable `hooks/opencode/sk-vision.js` bundle were corrected.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Load-path repoint | `.opencode/plugins/sk-vision.js` | Symlink → `../skills/sk-vision/vision-runtime/dist/plugin.js` |
| Docs | `SKILL.md` | Load target, acceptance row, source map, and host-load-path note corrected |
| Docs | `README.md` | Source table row, host-load-path line, and OpenCode bullet corrected |
| Docs | `feature-catalog/host-adapters/opencode-plugin.md` | "re-exports/real file" → "symlink resolves to"; self-location reason added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failing symptom came from an OpenCode session (its `SK-VISION Atlas/Notice` blocks originate in `opencode/attachments.ts`), not a Claude session, where sk-vision is intentionally unregistered. The root cause was traced to `RuntimeClient.repoRoot()`: it climbs from the plugin bundle's own `import.meta.url`, so a bundle relocated outside `vision-runtime/` (the committed `hooks/opencode/sk-vision.js` target) never finds `python/runtime.py`, falls back to `cwd`, and spawns a non-existent script — marking the client broken.

The diagnosis was proven by replicating the exact `repoRoot()` walk for both symlink targets, watching the hooks bundle resolve `runtimeScript` to a missing path (spawn fails) and `dist/plugin.js` resolve to the real one (spawns). The fix repoints the symlink at `dist/plugin.js` — the package `main`, built from `src/plugin.ts`, and functionally identical to the hooks bundle (same 13 tools, same `attachments.js` auto-inspect). No shared runtime code changed, so Pi (which loads source and already resolves inside `vision-runtime/src/`) and the Cursor/Devin MCP server are untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repoint the symlink rather than change `repoRoot()`/build | `dist/plugin.js` is the package `main` and already self-locates; touching shared runtime code would risk Pi and the MCP server, which work |
| Point at the built entry, not the hooks source | A relocated bundle cannot self-locate; the entry must live inside the runtime package |
| Correct three docs to name `dist/plugin.js` | Leaving them on the broken `hooks/opencode/sk-vision.js` target would be an undocumented, misleading contract |
| Leave `hooks/opencode/sk-vision.ts` in place | Removing the now-redundant parallel adapter is a separate follow-up, out of this packet's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `repoRoot()` for `hooks/opencode/sk-vision.js` | `runtimeScript = <repo>/python/runtime.py` — missing → spawn fails |
| `repoRoot()` for `dist/plugin.js` | `runtimeScript = vision-runtime/python/runtime.py` — exists → spawns |
| Feature completeness | `src/plugin.ts` and `hooks/opencode/sk-vision.ts` both register 13 tools + same `attachments.js` |
| Other hosts | Pi loads source (resolves inside `vision-runtime/src/`); Cursor/Devin launch the MCP server — all unchanged |
| Docs | No residual hooks-bundle load-path claim; feature-catalog validator PASS (0 violations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- The fix is proven by replicating `repoRoot()` plus the runtime's standalone `pong`, not by a live OpenCode load — that cannot be exercised from a Claude session and needs an OpenCode restart.
- `hooks/opencode/sk-vision.ts`/`.js` is now a redundant parallel OpenCode adapter (no longer the loaded entry); a follow-up could remove it and stop the build emitting it.
- `dist/plugin.js` is a gitignored build artifact; other environments must run `bun run build` (as `hooks/README.md` documents) to pick up the entry.
- `description.json` / `graph-metadata.json` are generator-produced, not hand-authored.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:commit-status -->
## COMMIT STATUS

Nothing in this packet is committed. The symlink repoint was already present in the working tree (from the session that first surfaced the failure); the doc corrections and this packet are added on top. Committing is withheld until the operator asks; the fix is already live in this checkout, and takes effect in OpenCode on its next restart.
<!-- /ANCHOR:commit-status -->
