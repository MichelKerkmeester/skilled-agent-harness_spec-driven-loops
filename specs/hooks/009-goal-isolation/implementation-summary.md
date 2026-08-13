---
title: "Implementation Summary: Cross-Runtime Goal Isolation"
description: "Session-scoped goal state, native Pi and Cursor bindings, bounded OpenCode persistence, explicit legacy handling, and aligned playbooks are verified; delivery freshness remains pending."
status: "in_progress"
trigger_phrases:
  - "goal isolation implementation status"
  - "goal isolation implementation summary"
  - "pi goal isolation handoff"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation"
    last_updated_at: "2026-08-11T06:46:15.236Z"
    last_updated_by: "codex"
    recent_action: "All six implementation phases and content checks passed"
    next_safe_action: "After authorized delivery, rerun default strict validation from clean packet paths"
    blockers:
      - "The no-commit task boundary leaves strict completion freshness red on dirty packet paths."
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".pi/settings.json"
      - "006-opencode-goal-optimization-and-devin-removal/handover.md"
    session_dedup:
      fingerprint: "sha256:bdc29c6ffbb12d94c5ad07f1320a861985a7eec0a3b107a08bfc174729c76e38"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions:
      - "Cross-runtime goal state requires explicit workspace, runtime, and native session identity."
      - "Pi native commands and lifecycle hooks share sessionManager.getSessionId()."
      - "Cursor injection is scoped; prompt management is unsupported without native identity."
      - "Legacy singleton state never injects and requires explicit migration or archive."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-goal-isolation |
| **Implemented** | 2026-08-10 |
| **Level** | 3 |
| **Status** | In progress — implementation verified; delivery freshness pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime-neutral goal system in `.opencode/hooks/goal/lib/goal-core.cjs` now stores one active goal per explicit workspace/runtime/session scope. It canonicalizes workspace to the repository root, hashes the unambiguous JSON tuple into one opaque filename, serializes same-scope read-modify-write operations across processes, and contains every archive target under the real state root. Reads never fall back to the legacy singleton.

`.opencode/hooks/goal/pi/goal-context.ts` uses Pi's native session manager for input, session start, turn end, and the registered `/goal-pi` command. `.opencode/hooks/goal/cursor/goal-inject.mjs` uses `session_id` with the documented `conversation_id` fallback. Cursor prompt management fails closed because that surface cannot prove native command identity. Devin remains decommissioned.

Legacy state is diagnostic-only. Operators can inspect it, explicitly bind a valid record to a validated scope, or archive valid/malformed bytes. Occupied targets and malformed migration attempts fail without overwriting either side, and concurrent migration losers cannot delete another process's successful target.

OpenCode remains a separate native plugin. Its session files now use fixed 64-character SHA-256 keys, and valid earlier hex-keyed active/archive records migrate lazily only after a present exact embedded session identity matches. Long-session canonical deletion ignores impossible legacy path components, an occupied digest target remains authoritative, native token accounting is unchanged, and the focused suite passes 128/128.

Claude's checked-in command discovery is a generated filtered directory of per-command relative symlinks. Shared commands remain mirrored, while the OpenCode-only goal router is excluded and enforced by the mirror checker. Live Claude product-native goal behavior remains unverified and is not claimed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The six-phase packet separated research, scoped storage, native bindings, legacy/documentation cutover, independent verification, and OpenCode persistence hardening. Pi remained disabled throughout the initial implementation. After the goal-specific gates passed, `.pi/settings.json` removed the exclusion and a trusted-project normal-discovery canary proved that Pi registers `/goal-pi` without an explicit extension flag. The earlier implementation was published, but this post-review Phase 6 repair remains an uncommitted shared-checkout diff because no commit or push was authorized.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require composite scope for every operation | Ownership must be an input; a field on one global record cannot represent concurrent goals. |
| Hash the canonical JSON scope tuple | Runtime, repository workspace, and session namespaces cannot collide or leak into filenames. |
| Serialize shared-core lifecycle mutation across processes | Atomic rename prevents torn files but cannot prevent lost read-modify-write updates. |
| Contain archive paths from persisted identifiers | Stored goal ids are untrusted and cannot choose relative or symlink-escaped targets. |
| Fail open for prompt delivery and fail closed for mutation | Missing identity must not block the user turn or select/write ambiguous state. |
| Keep Cursor prompt management unsupported | A shell prompt without native identity would recreate global ownership ambiguity. |
| Preserve legacy bytes without implicit ownership | The old objective may be valuable, but its owner cannot be inferred safely. |
| Filter Claude's repository command tree | Runtime-exclusive OpenCode commands must not leak through a whole-directory mirror. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Integrated cross-runtime goal suite | PASS: 91/91. |
| OpenCode goal regression control | PASS: 128/128, up from the 119-test baseline. |
| Focused repaired producers | PASS: shared core 49/49; OpenCode state/lifecycle 70/70. |
| Pi TypeScript and executable syntax | PASS: no-emit TypeScript compile and all syntax checks. |
| Real Pi A/B native commands | PASS: two distinct scoped files, correct objectives, mode 0600, opaque paths. |
| Pi rollout | PASS: trusted-project normal discovery handled `/goal-pi` after exclusion removal. |
| Runtime registration truth | PASS: Pi enabled, one Cursor registration, zero Devin goal registrations. |
| Documentation | PASS: 16/16 documents and 199/199 relative links. |
| Quality | PASS: comment hygiene 8/8; packet alignment 8 files with zero findings. |
| Runtime mirrors | PASS: 165 links across eight trees; Claude's exclusive goal router is absent. |
| Repository-wide drift wrapper | EXPECTED GLOBAL BACKLOG: exit 1 after 807,825 files and 25,551 findings (12,774 errors and 12,777 warnings); stack folders pass 6/6 and router sync passes 10/10. |
| Phase 6 alignment | PASS: 42 source files with zero findings; Claude goal slice has zero violations; nine changed documents validate. |
| Final recursive packet validation | BLOCKED FOR DELIVERY: default Phase 6 strict exits 0 with zero errors/warnings; recursive parent strict exits 2 with zero errors/one parent `dirty_tree` warning while all six child phases pass. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Cursor prompt management remains unavailable until Cursor exposes the same native identity as its hook payload.
2. Live Claude product-native goal behavior is unverified; only the checked-in command discovery boundary is proven.
3. The repository-wide alignment backlog is outside this packet. The goal-isolation code/test delta contributes zero findings.
4. The isolated normal-discovery canary emitted a `deep-pi` statistics-lock warning from a separate extension; `/goal-pi` still registered and completed successfully.
5. The post-review Phase 6 repair remains uncommitted. Preserved unrelated dirty paths remain untouched.
6. Default strict completion freshness cannot pass until an authorized delivery makes the repaired packet paths clean; packet completion is not claimed in this state.
<!-- /ANCHOR:limitations -->
