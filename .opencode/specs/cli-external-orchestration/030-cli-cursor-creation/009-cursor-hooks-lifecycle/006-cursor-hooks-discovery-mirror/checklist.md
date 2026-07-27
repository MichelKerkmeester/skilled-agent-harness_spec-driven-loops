---
title: "Verification Checklist: .cursor/hooks/ discovery mirror"
description: "Verification checklist for the .cursor/hooks/ discovery mirror phase."
trigger_phrases: ["cursor hooks discovery mirror checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-hooks-discovery-mirror"
    last_updated_at: "2026-07-24T18:05:09Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-discovery-mirror", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: .cursor/hooks/ discovery mirror

All items below are checked — this phase is Complete.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] `.cursor/hooks/` confirmed as Cursor's actual documented convention via `WebFetch`, not assumed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] All 13 currently-wired `.cursor/hooks.json` targets have a corresponding symlink in `.cursor/hooks/`
- [x] CHK-005 [P0] `find .cursor/hooks -type l ! -exec test -e {} \; -print` returns empty — no broken symlinks
- [x] CHK-006 [P1] All symlink targets are relative (`../../<path>`), not absolute machine-specific paths
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `.cursor/hooks.json` confirmed byte-identical to its pre-phase content via `git diff` (empty diff)
- [x] CHK-008 [P0] All 9 plain-script symlinks (`.sh`/non-`runCursorHook` `.mjs`) functionally re-tested through the symlink path and confirmed to return identical output to their real-path invocation
- [x] CHK-009 [P0] All 4 `runCursorHook`-guarded symlinks (`session-start.js`, `session-end.js`, `user-prompt-submit.js`, `precompact.js`) confirmed to return EMPTY output through the symlink — a real, root-caused, and now-documented behavior, not a bug requiring a fix in this phase
- [x] CHK-010 [P0] Control test: `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/session-start.js` (real path, same payload) returned the full `agent_message` envelope, isolating the symlink itself as the cause
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-011 [P1] `.cursor/hooks.json`'s own `command` fields deliberately left unchanged, per the entrypoint-guard finding
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-012 [P1] `grep -riE "sk-ant|sk-proj|CURSOR_(API_KEY|AUTH_TOKEN)\s*="` across `.cursor/hooks/README.md` and the `hooks.md` addendum → 0 matches
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-013 [P0] `.cursor/hooks/README.md` documents the mirror's purpose and the entrypoint-guard gotcha with the exact technical mechanism (`process.argv[1]` vs ESM-resolved `import.meta.url`)
- [x] CHK-014 [P0] `code-opencode/references/shared/hooks.md`'s `CURSOR HOOKS` section carries a matching "Discovery Mirror" subsection; version bumped to `1.0.0.16`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-015 [P1] Only in-scope files touched: `.cursor/hooks/` (13 symlinks + README) and `hooks.md`; no packet-local `graph-metadata.json`/`description.json` added outside the spec-folder convention
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 4 | 4/4 |

**Verification Date**: 2026-07-24 — mirror created, no broken symlinks, `.cursor/hooks.json` untouched, and a real symlink-invocation gotcha confirmed via direct testing and documented in two places.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
