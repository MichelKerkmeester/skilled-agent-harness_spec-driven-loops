---
title: "Implementation Summary: .cursor/hooks/ discovery mirror"
description: "Created .cursor/hooks/, Cursor's own documented conventional path, as a symlink mirror of every hook .cursor/hooks.json invokes; discovered and documented a real symlink+ESM entrypoint-guard gotcha affecting 4 of the 13 files."
trigger_phrases: ["cursor hooks discovery mirror implementation", "cursor hook symlink gotcha finding"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror"
    last_updated_at: "2026-07-27T03:27:34Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, verified, and validated"
    next_safe_action: "Commit"
    blockers: []
    key_files: [".cursor/hooks/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-discovery-mirror", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 006-cursor-hooks-discovery-mirror |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`.cursor/hooks/` now exists — Cursor's own documented conventional path for hook scripts — holding a relative symlink to every one of the 13 files `.cursor/hooks.json` currently invokes: `session-start.js`, `session-end.js`, `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh`, `install-codex-hooks.mjs`, `session-cleanup.sh`, `spec-gate-enforce.mjs`, `task-dispatch-guard.mjs`, `post-tool-use.mjs`, `spec-gate-classify.mjs`, `user-prompt-submit.js`, `precompact.js`.

### The gotcha this phase found and documented
Functionally re-testing every symlink against the same synthetic payloads used in earlier phases surfaced a real behavioral difference: 4 of the 13 files (`session-start.js`, `session-end.js`, `user-prompt-submit.js`, `precompact.js` — every file compiled from a `.ts` source ending in `runCursorHook(import.meta.url, main)`) return **zero output** when invoked through the symlink, instead of their documented response envelope. Root cause: `runCursorHook`'s entrypoint guard compares `process.argv[1]` (the path Node was invoked with — stays the symlink path) against `fileURLToPath(import.meta.url)` (which Node's ESM loader resolves through the symlink to the real, canonical file path). The two never match through a symlink, so `main()` never runs and nothing is written to stdout — not even the documented fail-open `{"permission":"allow"}` envelope.

A control test confirmed this is specifically a symlink-invocation artifact: the identical file invoked via its real path returns the correct, full response. The remaining 9 files (plain `.sh`/`.mjs` scripts with no such guard) work identically through either path.

### What this means for `.cursor/hooks.json`
Nothing changed there, and nothing should: `.cursor/hooks.json`'s `command` fields continue to reference the original real paths under `.opencode/`, exactly as phases 010/011 shipped them. `.cursor/hooks/` is a pure discovery/organizational mirror — it has zero functional role in what actually executes. This is now documented explicitly in two places (`.cursor/hooks/README.md` and the canonical `code-opencode/references/shared/hooks.md`) specifically so nobody mistakes the mirror for a safe repoint target in the future.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Confirmed via `WebFetch` against Cursor's own hooks documentation that `.cursor/hooks/` (project scope) is the actual documented convention, quoting the exact example path (`.cursor/hooks/format.sh`) rather than assuming a folder name.
2. Re-read the live `.cursor/hooks.json` fresh to enumerate all 13 currently-wired targets, rather than reconstructing the list from memory of earlier phases.
3. Created `.cursor/hooks/` and 13 relative symlinks (`../../<repo-root-relative-path>`), preserving each file's original basename, keeping the same portable-path discipline established for `.cursor/hooks.json` itself in phase 010.
4. Confirmed no broken symlinks via `find ... ! -exec test -e`.
5. Functionally re-tested every symlink with the same synthetic payloads used in phases 010/011/013 — this is what surfaced the entrypoint-guard gotcha; a static "the link resolves" check alone would have missed it, since the failure only manifests at actual invocation time.
6. Investigated the unexpected empty output by reading `shared.ts`'s `runCursorHook()` implementation again and reasoning through Node's ESM symlink-resolution semantics, rather than guessing.
7. Confirmed the same behavior across all 4 affected files and ran a real-path control test to isolate the cause specifically to symlink invocation.
8. Documented the finding in `.cursor/hooks/README.md` and extended `hooks.md`'s existing `CURSOR HOOKS` section with a matching explanation, keeping both documents' technical description consistent.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Mirror only the 13 currently-wired files, not every file in the hook adapter tree.** `spec-gate-prebind.mjs` (unreviewed, concurrent session's file) and `mcp-route-guard.mjs` (built but unwired, per phase 011) are both real files under this packet's hook directories but neither is part of what `.cursor/hooks.json` actually invokes today — mirroring only the live wiring keeps the discovery folder an accurate reflection of what's actually active.
- **Do not repoint `.cursor/hooks.json` at the new mirror.** The entrypoint-guard finding makes this a correctness requirement, not just a caution — repointing would silently break session-priming, session-cleanup accounting, the prompt-time advisor, and compaction pre-caching, with zero visible error.
- **Document the gotcha in two places, not one.** The mirror's own README is where someone browsing `.cursor/hooks/` would look first; the canonical `hooks.md` reference is where someone auditing hook wiring more broadly would look. Duplicating the explanation (kept consistent) covers both entry points.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| 13 symlinks present, all resolving (SC-001) | PASS |
| `.cursor/hooks.json` unchanged (SC-002) | PASS — `git diff` empty on that file |
| 9 plain-script files functionally identical through symlink (SC-003a) | PASS |
| 4 `runCursorHook`-guarded files empty through symlink, confirmed + documented (SC-003b) | PASS |
| Gotcha documented consistently in both locations (SC-004) | PASS |
| `validate.sh 014-cursor-hooks-discovery-mirror --strict` | PASS |
| `validate.sh 030-cli-cursor-creation --recursive --strict` | PASS across all 15 folders (parent + 14 children) |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. This phase does not fix the entrypoint-guard's symlink intolerance — that would be a `shared.ts` behavior change (e.g. resolving both sides through `fs.realpathSync` before comparing), which was not requested and is out of scope for a discovery-mirror task.
2. The mirror is a snapshot of `.cursor/hooks.json`'s wiring at the time this phase ran — a future hook addition/removal needs a matching mirror update, the same class of drift `hooks.md`'s pre-existing maintenance checklist already covers for every runtime.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.cursor/hooks/README.md`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md`
