---
title: "Implementation Plan: Codex and Claude hooks discovery mirrors"
description: "Plan for mirroring both runtimes' hook inventories as symlinks and empirically establishing the affected set."
trigger_phrases: ["codex claude hooks mirror plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/012-codex-claude-hooks-discovery-mirrors"
    last_updated_at: "2026-07-24T18:33:03Z"
    last_updated_by: "claude-code"
    recent_action: "All phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "codex-claude-hooks-discovery-mirrors", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Codex and Claude hooks discovery mirrors

<!-- ANCHOR:summary -->
## 1. SUMMARY
Extract every script `.codex/hooks.json` and `.claude/settings.json` actually invoke, mirror each runtime's set as relative symlinks under `.codex/hooks/` and `.claude/hooks/`, then sweep all 34 comparing symlink-invoked output against real-path output to establish per-file which are safe through the mirror — documenting the real affected set rather than generalizing from the Cursor result.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Script paths extracted programmatically from both configs, including inside `bash -c` wrappers.
- [x] Every extracted path confirmed to resolve before linking.
- [x] No broken symlinks in either mirror.
- [x] All 34 swept by symlink-vs-real comparison.
- [x] Both runtime configs left byte-identical.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Two flat symlink folders, one per runtime, each mirroring only what that runtime's own config invokes — so each mirror is an accurate index of live wiring rather than of the hook source tree. Targets are relative (`../../.opencode/...`) for clone portability. A basename-collision guard prefixes the owning skill directory when two skills would contribute the same filename.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extract
- [x] Parsed `.codex/hooks.json` (nested `hooks.<Event>[].hooks[]`, commands wrapped in `bash -c '... && <script> || printf ...'`) and `.claude/settings.json` with a regex over every embedded `.opencode/...` path.
- [x] 16 unique Codex scripts, 18 unique Claude scripts; all 34 confirmed present on disk.

### Phase 2: Mirror
- [x] Created `.codex/hooks/` (16) and `.claude/hooks/` (18) with relative symlinks, basename-collision guard applied (no collision occurred).
- [x] `find ... -type l ! -exec test -e {} \; -print` empty for both.

### Phase 3: Sweep and document
- [x] First sweep read "empty output" as a tripped guard — a FALSE POSITIVE, since several Claude/Codex hooks approve by emitting nothing. Discarded and redone.
- [x] Re-swept all 34 as symlink-output vs real-path-output comparison: Codex 14/16 identical, Claude 16/18 identical.
- [x] Confirmed the counter-example that disproves a per-extension rule: Claude's `user-prompt-submit.js` works through its symlink while Codex's identically-named sibling does not.
- [x] Wrote a README per mirror naming that runtime's exact affected scripts.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Differential testing: each script is invoked twice with the same synthetic payload — once through its symlink, once through its real path — and the outputs compared. This is the only method that distinguishes a tripped entrypoint guard from a hook that legitimately approves silently, which is precisely the distinction the first sweep got wrong.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `.codex/hooks.json` / `.claude/settings.json` | Internal | Green | Source of each mirror's inventory |
| Phase 014's Cursor mirror | Internal | Green | The pattern extended here |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`rm -rf .codex/hooks/ .claude/hooks/` — zero effect on hook execution, since neither runtime config ever referenced the mirrors.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends phase 014's discovery-mirror pattern to the two remaining hook-config-driven runtimes.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Extract + mirror | Low | 20 min |
| Sweep (incl. redoing the false positive) | Medium | 25 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Additive only; neither runtime config was touched, so removal cannot affect behavior.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
