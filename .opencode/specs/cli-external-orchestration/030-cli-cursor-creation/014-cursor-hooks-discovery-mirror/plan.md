---
title: "Implementation Plan: .cursor/hooks/ discovery mirror"
description: "Plan for creating .cursor/hooks/ as a symlink mirror and documenting the entrypoint-guard gotcha found while verifying it."
trigger_phrases: ["cursor hooks discovery mirror plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-hooks-discovery-mirror"
    last_updated_at: "2026-07-24T17:37:51Z"
    last_updated_by: "claude-code"
    recent_action: "All phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-discovery-mirror", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: .cursor/hooks/ discovery mirror

<!-- ANCHOR:summary -->
## 1. SUMMARY
Confirm `.cursor/hooks/` is Cursor's own documented convention, create it with a relative symlink to each of the 13 files `.cursor/hooks.json` invokes, verify none are broken and re-test functionality through the new path, discover and document a real entrypoint-guard gotcha affecting 4 of the 13 files, and leave `.cursor/hooks.json`'s own command paths untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] `.cursor/hooks/` contains a symlink to all 13 currently-wired files.
- [x] No broken symlinks.
- [x] `.cursor/hooks.json` unchanged.
- [x] Entrypoint-guard gotcha confirmed via direct testing (not assumed) and documented in 2 places.
- [x] Symlinks are relative, not absolute.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Pure filesystem/documentation change: one new directory (`.cursor/hooks/`) of relative symlinks pointing at the existing, already-wired hook files, plus a README explaining the mirror, plus an addendum to the canonical cross-runtime `hooks.md` reference. No code, no config, no runtime behavior change to the actual hook execution path.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm convention
- [x] `WebFetch` against Cursor's own hooks documentation — confirmed `.cursor/hooks/` (project scope) is the documented conventional path, quoting the exact example (`.cursor/hooks/format.sh`).

### Phase 2: Create mirror
- [x] Re-read the live `.cursor/hooks.json` to enumerate all 13 currently-wired `command` targets.
- [x] Created `.cursor/hooks/` and one relative symlink per target (`../../<path-from-repo-root>`), preserving each file's original basename.
- [x] `find .cursor/hooks -type l ! -exec test -e {} \; -print` — empty (no broken links).

### Phase 3: Verify + document the gotcha
- [x] Functionally re-tested all 13 files through their new symlink path with the same synthetic payloads used in earlier phases.
- [x] Found `session-start.js` returns empty output through the symlink (not the expected fail-open envelope) — investigated and traced to `shared.ts`'s `runCursorHook(import.meta.url, main)` entrypoint guard comparing `process.argv[1]` (stays the symlink path) against the ESM-loader-resolved `import.meta.url` (resolves through the symlink to the real path).
- [x] Confirmed the same empty-output behavior for `session-end.js`, `user-prompt-submit.js`, `precompact.js` (the other 3 files compiled from a `runCursorHook`-using `.ts` source); confirmed the 9 plain-script files (no such guard) work identically through either path.
- [x] Ran a control test — the same file via its real path returns the correct output — confirming this is specifically a symlink-invocation artifact, not a regression.
- [x] Wrote `.cursor/hooks/README.md` explaining the mirror's purpose and the gotcha in full technical detail.
- [x] Extended `code-opencode/references/shared/hooks.md`'s `CURSOR HOOKS` section with a matching "Discovery Mirror" subsection; bumped version to `1.0.0.16`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Direct functional testing of every symlinked file against the same synthetic payloads used in phases 010/011/013, comparing symlink-path output to real-path output. This is what surfaced the entrypoint-guard gotcha — a manual "looks fine" review of the symlinks alone would have missed it, since the gotcha only manifests at actual invocation time.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 010's committed `.cursor/hooks.json` | Internal | Green | Source of the 13 targets this phase mirrors |
| Node.js ESM symlink-resolution behavior | External (runtime) | Confirmed via direct test | Root cause of the entrypoint-guard gotcha |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`rm -rf .cursor/hooks/` removes the entire mirror with zero effect on actual hook execution, since `.cursor/hooks.json` never referenced it.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phase 010's committed `.cursor/hooks.json` specifically).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Confirm convention + create mirror | Low | 15 min |
| Verify + document gotcha | Low | 20 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Minimal blast radius: additive-only, zero effect on `.cursor/hooks.json`'s actual wiring. `rm -rf .cursor/hooks/` fully reverts.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
