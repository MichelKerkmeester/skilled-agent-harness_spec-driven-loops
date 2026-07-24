---
title: "Tasks: Codex and Claude hooks discovery mirrors"
description: "Task breakdown for the Codex and Claude hook discovery mirrors."
trigger_phrases: ["codex claude hooks mirror tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/017-codex-claude-hooks-discovery-mirrors"
    last_updated_at: "2026-07-24T18:33:03Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "codex-claude-hooks-discovery-mirrors", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Codex and Claude hooks discovery mirrors

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirmed `.codex/` and `.claude/` both exist and neither had a `hooks/` folder; `.claude/` already uses symlinks for `skills`, `commands`, `specs`, `changelog`, so the pattern was already established there
- [x] T002 Extracted every `.opencode/...` script path from `.codex/hooks.json` and `.claude/settings.json` with a regex that reaches inside the `bash -c '... && <script> || printf ...'` wrappers Codex uses
- [x] T003 Confirmed all 34 extracted paths resolve on disk — `16/16` Codex, `18/18` Claude
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Created `.codex/hooks/` with `16` relative symlinks (`../../.opencode/...`), basename-collision guard applied
- [x] T005 Created `.claude/hooks/` with `18` relative symlinks, same guard; no collision occurred in either runtime
- [x] T006 `find .codex/hooks .claude/hooks -type l ! -exec test -e {} \; -print` → empty, no broken links
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T007 First sweep incorrectly read "empty output" as a tripped guard — a FALSE POSITIVE, since `spec-gate-enforce.mjs` and peers approve by emitting nothing; discarded rather than documented
- [x] T008 Re-swept all `34/34` as a symlink-output vs real-path-output comparison, the only method that separates a tripped guard from a silent approve
- [x] T009 Result: Codex `14/16` identical, differing = `session-start.js`, `user-prompt-submit.js`; Claude `16/18` identical, differing = `session-prime.js`, `install-codex-hooks.mjs`
- [x] T010 Confirmed the per-extension generalization is FALSE — Claude's `user-prompt-submit.js` works through its symlink while Codex's identically-named sibling does not
- [x] T011 Wrote `.codex/hooks/README.md` and `.claude/hooks/README.md`, each naming its own runtime's affected scripts and the do-not-repoint rule
- [x] T012 Confirmed `.codex/hooks.json` and `.claude/settings.json` both byte-identical via `git status --porcelain`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T013 `validate.sh 017-codex-claude-hooks-discovery-mirrors --strict` passes 0/0; SC-001..SC-006 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Extends the `.cursor/hooks/` mirror pattern from phase 014 to the two remaining hook-config-driven runtimes.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
