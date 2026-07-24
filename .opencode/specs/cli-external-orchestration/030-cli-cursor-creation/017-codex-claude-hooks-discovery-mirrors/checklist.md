---
title: "Verification Checklist: Codex and Claude hooks discovery mirrors"
description: "Verification checklist for the Codex and Claude hook discovery mirrors."
trigger_phrases: ["codex claude hooks mirror checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/017-codex-claude-hooks-discovery-mirrors"
    last_updated_at: "2026-07-24T18:33:03Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "codex-claude-hooks-discovery-mirrors", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Codex and Claude hooks discovery mirrors

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
- [x] CHK-003 [P0] Script inventory extracted programmatically from both configs, not hand-listed — `16` Codex, `18` Claude
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] Every extracted path confirmed to resolve on disk before any symlink was created — `34/34`
- [x] CHK-005 [P1] All symlink targets are relative (`../../.opencode/...`), not absolute machine-specific paths
- [x] CHK-006 [P1] Basename-collision guard implemented (prefix the owning skill dir via `t.split('/')[2]`); `0` collisions actually occurred across either runtime
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `find .codex/hooks .claude/hooks -type l ! -exec test -e {} \; -print` returns empty — no broken symlinks
- [x] CHK-008 [P0] All `34/34` scripts swept by symlink-output vs real-path-output comparison, not by testing the symlink in isolation
- [x] CHK-009 [P0] Codex result recorded: `14/16` identical; differing = `session-start.js`, `user-prompt-submit.js`
- [x] CHK-010 [P0] Claude result recorded: `16/18` identical; differing = `session-prime.js`, `install-codex-hooks.mjs`
- [x] CHK-011 [P0] `.codex/hooks.json` and `.claude/settings.json` confirmed byte-identical via `git status --porcelain`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-012 [P0] The first sweep's false positive (reading a legitimate silent approve as a tripped guard) was caught and the sweep redone — `4` scripts it would have wrongly flagged (`spec-gate-enforce.mjs` in both runtimes, `task-dispatch-guard.cjs`, `mcp-route-guard.cjs`) came back clean; the incorrect reading never reached the READMEs
- [x] CHK-013 [P1] The tempting per-extension generalization was actively disproved and the counter-example documented: Claude's `user-prompt-submit.js` works through its symlink, Codex's identically-named sibling does not
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-014 [P1] `grep -riE "sk-ant|sk-proj|API_KEY|AUTH_TOKEN"` across both new READMEs → 0 matches; symlinks add no new credential surface
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-015 [P0] Each README names its OWN runtime's affected scripts (`.codex/hooks/README.md` names 2, `.claude/hooks/README.md` names 2), so neither depends on the reader having seen the Cursor mirror's README
- [x] CHK-016 [P1] Both READMEs state the do-not-repoint rule explicitly — `must keep doing so` — and note that several hooks emit nothing on approve as normal behavior
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-017 [P1] Only in-scope files created: `.codex/hooks/` and `.claude/hooks/` (34 symlinks + 2 READMEs); no runtime config or hook source touched
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |

**Verification Date**: 2026-07-24 — 34 symlinks across two runtimes, none broken, affected set established per-file with a false positive caught and corrected mid-sweep.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
