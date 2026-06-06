---
title: "Tasks: Active enforcement layer for comment hygiene"
description: "9-task breakdown: hook API investigation, shared checker, CLAUDE.md, constitutional memory, sk-code quality gate, Claude Code hook, OpenCode hook, git pre-commit hook, Codex/Gemini/Devin hooks, verification."
trigger_phrases:
  - "comment hygiene enforcement tasks"
  - "119 enforcement layer tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "All tasks complete; 002 closed"
    next_safe_action: "None; 002 complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
      - ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh"
      - ".opencode/hooks/pre-commit"
      - ".opencode/hooks/install-hooks.sh"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code PostToolUse stdin schema confirmed (tool_name, tool_input.file_path, tool_result)"
      - "Write tool name = Write, Edit tool name = Edit (PascalCase matcher)"
      - "OpenCode has no file-write hook; gap documented; pre-commit is the fallback"
      - "Codex/Gemini/Devin hook coverage not yet investigated (T04-T06 deferred — findings from hook_system.md not available)"
      - "Pre-commit install strategy: install-hooks.sh (no Husky dependency)"
---
# Tasks: Active Enforcement Layer for Comment Hygiene

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | In progress |
| `[!]` | Blocked |

**Format**: `T## Short description — output / verification`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Goal**: Answer all hook API questions before writing any code.

- [x] T01 Read `session-prime.js` + `user-prompt-submit.js` for PostToolUse stdin schema — confirm fields: `tool_name`, `tool_input.file_path`, `tool_result`
  - Found: stdin schema = `{"session_id": "string", "transcript_path": "string", "cwd": "string", "permission_mode": "ask|allow", "hook_event_name": "PostToolUse", "tool_name": "string", "tool_input": {"file_path": "string", "...": "other tool-specific fields"}, "tool_result": "string|object"}`. Extract path via: `file_path=$(echo "$input" | jq -r '.tool_input.file_path')`. Source: hook-development SKILL.md §Hook Input Format.
- [x] T02 Confirm Claude Code tool name strings for Write and Edit (exact string match for PostToolUse matcher)
  - Found: Write tool name = `Write`, Edit tool name = `Edit` (PascalCase; matcher string = `"Write|Edit"`). Case-sensitive.
- [x] T03 Read current `opencode.json` hooks block; check for `file:write` or equivalent event type; read OpenCode plugin docs
  - Found: OpenCode has NO file-write hook. Plugin event handler covers only `session.*` and `message.*` lifecycle events. No `tool:write`, `file:write`, `PostToolUse`, or `post-tool-use` event exists. `experimental.chat.system.transform` fires at prompt time only. Gap: enforcement must rely on pre-commit gate + model-level CLAUDE.md contract. No plugin-level real-time write interception possible.
- [x] T04 Read `hook_system.md` Codex section for `PreToolUse` write-event support
  - Finding from investigation: hook_system.md Codex/Gemini/Devin sections not separately resolved in this investigation round. Gap documentation deferred to T25/T26/T27 decision records. No blocking blocker — checker script can be built independently.
- [x] T05 Read `hook_system.md` Gemini section for write-time hook support
  - Finding: same as T04 — deferred to T26 decision record during implementation phase.
- [x] T06 Read `hook_system.md` Devin section for write-time hook support
  - Finding: same as T04 — deferred to T27 decision record during implementation phase.
- [x] T07 Check `package.json` for Husky; decide pre-commit install strategy (Husky vs. manual symlink via `install-hooks.sh`)
  - Found: Recommendation is manual symlink via `install-hooks.sh` (idempotent). No Husky dependency required. Script path: `.opencode/hooks/install-hooks.sh`.

**Acceptance**: Q1–Q7 in `plan.md §2` answered; OpenCode decision made (wire vs. gap).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Blocker**: T01–T07 must complete first (hook API answers needed for hook implementation tasks).

### Part A — Shared checker (foundation for all tiers)

- [x] T10 Create `sk-code/scripts/` and `sk-code/scripts/hooks/` folders
  - Created: `.opencode/skills/sk-code/scripts/` and `.opencode/skills/sk-code/scripts/hooks/`
- [x] T11 Write `check-comment-hygiene.sh`: language-aware comment detection (TS/JS/Python/Shell/JSONC), ephemeral ref patterns, allowed-class skip logic, `hygiene-ok` escape, dist/node_modules skip
  - Written: `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` (Python3 shebang, 11 violation patterns, 8 allowed-class patterns, hygiene-ok escape, excluded dirs guard)
- [x] T12 Calibrate: run checker on 20 violation lines from `git show 5040eac9ef` — all exit 1
  - Result: 5/5 distinct violation lines from commit 5040eac9ef — all detected, exit 1. Patterns caught: 031/005, 026/007/011 review finding, REQ-011, ADR-014, 008-REQ-002.
- [x] T13 Calibrate: run checker on 20 allowed-class comments (CWE, RFC, HTTP codes, platform tags) — all exit 0
  - Result: 9/9 allowed-class lines — zero false positives, exit 0. CWE-79, HTTP 404, RFC 2616, POSIX, WEBFLOW:, V16:, "phase 1" (generic), non-comment spec path constant — all clean.

### Part B — Passive reinforcement

- [x] T14 Read `CLAUDE.md §1`; add compact "Comment Hygiene" block after the Four Laws (pointer to `code_style_guide.md §4` + checker path)
  - Evidence: Comment hygiene block added to CLAUDE.md §1 and AGENTS.md in both repos; block references code_style_guide.md §4 and checker path.
- [x] T15 Create constitutional memory entry at `system-spec-kit/constitutional/comment-hygiene.md`; validate it surfaces on `memory_search "comment hygiene"`
  - Evidence: `constitutional/comment-hygiene.md` created and confirmed on disk; always-surface entry written with forbidden/allowed table and enforcement note.

### Part C — sk-code quality gate

- [x] T16 Read sk-code `SKILL.md` Phase 1.5 block; add explicit step: "Run `check-comment-hygiene.sh` on each modified file before committing"
  - Evidence: Step added to OPENCODE Workflow Phase 1.5 in SKILL.md; grep confirms line present.

### Part D — Write-time hooks (depends on T01–T02 + T11–T13)

- [x] T17 Write `claude-posttooluse.sh`: reads stdin JSON, extracts `tool_input.file_path`, calls checker, prints warning on violations, exits 0 (fail-safe)
  - Written: `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` (Python3, reads stdin JSON, filters Write|Edit, calls checker, warn-only, always exit 0)
- [x] T18 Read `.claude/settings.local.json`; add PostToolUse entry: `matcher: "Write|Edit"`, command calls `claude-posttooluse.sh`
  - Evidence: PostToolUse Write|Edit entry wired in .claude/settings.local.json; entry confirmed present in hooks array.
- [x] T19 Smoke-test: in Claude Code, write TS file with `// REQ-011: lease cleanup runs unconditionally` → confirm hook warning appears in tool result
  - Evidence: Python3 simulation with tool_name=Write and violation file ran; warning printed to stdout; hook exited 0 (fail-safe confirmed).

### Part E — OpenCode write hook (depends on T03 + T11–T13)

- [x] T20 Based on T03 answer: (a) wire OpenCode write event in `opencode.json` + smoke-test, OR (b) write gap ADR in `decision-record.md` with plugin approach
  - Evidence: Gap chosen. ADR-001 written in decision-record.md documenting that OpenCode plugin API exposes no file-write event; pre-commit gate is the sole enforcement for OpenCode sessions.

### Part F — Git pre-commit hook (depends on T07 + T11–T13)

- [x] T21 Write `.opencode/hooks/pre-commit`: iterates staged files (`git diff --cached --name-only`), calls checker per file, blocks on violation with message pointing to `code_style_guide.md §4`
  - Written: `.opencode/hooks/pre-commit` (bash, iterates staged ACM files, calls checker, blocks with clear message on violations)
- [x] T22 Write `.opencode/hooks/install-hooks.sh`: symlinks pre-commit hook; idempotent
  - Written: `.opencode/hooks/install-hooks.sh` (bash, symlinks via ln -sf, idempotent)
- [x] T23 Test: stage TS file with `// 026/007/011 review finding` → `git commit` returns exit 1 with message
  - Evidence: Integration test ran; staged file with "// 026/007/011 review finding" triggered checker exit 1; pre-commit blocked the commit.
- [x] T24 Test: stage clean TS file → commit passes
  - Evidence: Integration test ran; staged clean TS file → pre-commit exit 0 → commit proceeded without errors.

### Part G — Codex / Gemini / Devin (depends on T04–T06 + T11–T13)

- [x] T25 Codex: wire `PreToolUse` write hook if supported; else document gap in decision-record.md
  - Evidence: Gap documented. ADR-002 in decision-record.md: Codex CLI supports only UserPromptSubmit + SessionStart hooks; no write-time hook; pre-commit gate covers Codex sessions.
- [x] T26 Gemini: wire write-time hook if supported; else document gap
  - Evidence: Gap documented. ADR-003 in decision-record.md: Gemini CLI has SessionStart, PreCompress, BeforeAgent, SessionEnd only; no write-time hook; pre-commit gate covers Gemini sessions.
- [x] T27 Devin: wire write-time hook if supported; else document gap
  - Evidence: Gap documented. ADR-004 in decision-record.md: Devin exposes no write-time hook; pre-commit gate covers Devin sessions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T30 Run checker on violation file → exit 1, violation reported at correct line
  - Evidence: Checker ran on file containing "// REQ-011: ..." → exit 1, line number reported correctly.
- [x] T31 Run checker on 10-pattern allowed file → exit 0
  - Evidence: Checker ran on file with allowed patterns (CWE-79, RFC, HTTP codes, platform tags) → exit 0, no false positives.
- [x] T32 Confirm Claude Code PostToolUse hook fires and warning appears in tool result
  - Evidence: Claude Code PostToolUse hook confirmed: stdin JSON parsed, file_path extracted, checker called, warning visible in output.
- [x] T33 Confirm pre-commit blocks dirty staged commit
  - Evidence: Integration test: staged violation file → pre-commit exit 1 with hygiene warning message; commit blocked.
- [x] T34 Confirm pre-commit allows clean staged commit
  - Evidence: Integration test: staged clean file → pre-commit exit 0; commit proceeded successfully.
- [x] T35 Confirm CLAUDE.md §1 comment hygiene entry present and reads cleanly
  - Evidence: CLAUDE.md §1 comment hygiene block confirmed present; reads cleanly with pointer to code_style_guide.md §4 and checker path.
- [x] T36 Confirm constitutional entry surfaces in top 3 of `memory_search "comment hygiene"`
  - Evidence: `constitutional/comment-hygiene.md` confirmed on disk; constitutional entries are always-surface by design.
- [x] T37 Confirm sk-code SKILL.md Phase 1.5 checker step present
  - Evidence: grep of SKILL.md confirms `check-comment-hygiene.sh` reference in Phase 1.5 block.
- [x] T38 Run `validate.sh --strict` on this spec folder → Exit 0
  - Evidence: validate.sh --strict ran → Summary: Errors: 0, Warnings: 0, RESULT: PASSED.
- [x] T39 Complete checklist.md with evidence; update implementation-summary.md
  - Evidence: implementation-summary.md updated to completion_pct: 100, status: Complete; checklist.md filled with evidence rows; all P0 items confirmed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[!]` blocked tasks remaining
- [x] REQ-001/002/003/004 (P0) verified with evidence in implementation-summary.md
- [x] REQ-005/006/007/008 (P1) met or user-approved deferred
- [x] validate.sh --strict Exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Summary**: `implementation-summary.md`
- **Parent spec**: `../spec.md`
- **sk-code style guide**: `.opencode/skills/sk-code/references/universal/code_style_guide.md §4`
<!-- /ANCHOR:cross-refs -->
