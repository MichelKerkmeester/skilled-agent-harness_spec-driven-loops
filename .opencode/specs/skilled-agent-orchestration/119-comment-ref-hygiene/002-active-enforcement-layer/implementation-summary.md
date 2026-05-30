---
title: "Implementation Summary: Active enforcement layer for comment hygiene"
description: "Complete. Active enforcement stack built: Python3 checker, Claude Code PostToolUse hook, pre-commit gate, passive reinforcement (CLAUDE.md, constitutional memory, sk-code step), and 4 runtime gap ADRs."
trigger_phrases:
  - "comment hygiene enforcement summary"
  - "119 enforcement implementation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "All tasks complete; checklist filled; packet closed"
    next_safe_action: "None; 002 complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
      - ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh"
      - ".opencode/hooks/pre-commit"
      - ".opencode/hooks/install-hooks.sh"
      - ".claude/settings.local.json"
      - ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md"
      - ".opencode/skills/sk-code/SKILL.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code PostToolUse stdin schema: {session_id, transcript_path, cwd, permission_mode, hook_event_name, tool_name, tool_input.file_path, tool_result} — source: hook-development SKILL.md"
      - "Claude Code tool names: Write=Write, Edit=Edit (PascalCase); matcher = 'Write|Edit'"
      - "OpenCode file-write event: not available — no tool:write, file:write, PostToolUse, or post-tool-use event in OpenCode plugin API; pre-commit is the fallback for OpenCode sessions"
      - "Pre-commit install strategy: install-hooks.sh manual symlink (no Husky dependency)"
      - "Hook config entry format confirmed for .claude/settings.local.json PostToolUse entry"
      - "Codex/Gemini/Devin write-time hook gaps documented in decision-record.md ADR-002/003/004"
---
# Implementation Summary: Active Enforcement Layer for Comment Hygiene

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: COMPLETE — All tasks shipped and verified.**

### Why this phase exists

Packet 119-comment-ref-hygiene (root) closed with a text rule in `sk-code §4` and a production sweep leaving zero violations. Commit `5040eac9ef` (2026-05-29) then stripped 27 more files — proof that the rule is ignored during subsequent long implementation sessions. The violations are predictable: AIs add packet/phase numbers, ADR ids, review finding ids, and requirement ids as traceability anchors during deep work, not realizing they are ephemeral labels that rot.

**Root cause**: The rule is passive text loaded once at session start. During commit 20–50 of a long run, it falls out of working context. There is no enforcement at write or commit time.

**This phase's answer**: Built an active enforcement stack — a shared checker script called by write-time hooks (Claude Code) and a git pre-commit gate. Layered passive reinforcement (CLAUDE.md block, constitutional memory, sk-code quality gate step) and runtime-gap ADRs on top.

### Deliverables shipped

| Deliverable | Path | Notes |
|-------------|------|-------|
| `check-comment-hygiene.sh` | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Python3, language-aware; calibrated against known violations and allowed-class patterns |
| `claude-posttooluse.sh` | `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | PostToolUse hook; warn-only; always exit 0 (fail-safe) |
| PostToolUse hook entry | `.claude/settings.local.json` | Wired to `Write\|Edit` tool matcher; calls posttooluse script |
| Pre-commit gate | `.opencode/hooks/pre-commit` | Blocks staged violations; references code_style_guide.md §4 |
| Hook installer | `.opencode/hooks/install-hooks.sh` | Symlinks pre-commit into .git/hooks/; idempotent |
| CLAUDE.md comment hygiene block | `CLAUDE.md §1` | "Comment Hygiene [HARD] BLOCK" — always-in-context passive rule |
| Constitutional memory entry | `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Always-surface entry; tops every memory search |
| sk-code SKILL.md Phase 1.5 step | `.opencode/skills/sk-code/SKILL.md` | Step 4 in OPENCODE Workflow section |
| Runtime gap ADRs | `decision-record.md` | ADR-001 (OpenCode), ADR-002 (Codex), ADR-003 (Gemini), ADR-004 (Devin) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single-agent implementation following the planned sequence: investigate hook APIs (T01–T07) → build checker (T10–T13) → passive reinforcement (T14–T16) → write-time hooks (T17–T20) → pre-commit gate (T21–T24) → Codex/Gemini/Devin gap ADRs (T25–T27) → verify all tiers (T30–T39).

Each tier was independently verified: checker calibrated against known violations and allowed-class patterns, PostToolUse hook smoke-tested in Claude Code, pre-commit gate tested with staged violation and staged clean file, passive reinforcement confirmed in CLAUDE.md and constitutional memory, and sk-code SKILL.md step added in Phase 1.5 block. validate.sh --strict passes with exit 0, 0 errors, 0 warnings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why | Status |
|----------|-----|--------|
| Shared checker script as foundation | Single source of truth for violation patterns; all tiers call it | Decided |
| Fail-safe hooks (exit 0 on error) | Enforcement gaps are better than broken tooling | Decided |
| Pre-commit as mandatory floor | Runtime-agnostic; catches everything regardless of which AI wrote it | Decided |
| Write-time hooks as highest-value tier | Real-time feedback before AI continues; self-correction likely | Decided |
| OpenCode: gap documented — no write-time hook possible | Plugin API exposes no file-write event; pre-commit is the sole enforcement gate for OpenCode sessions | Resolved (gap ADR needed in T20) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Method | Result |
|-------|--------|--------|
| Checker: known violation → exit 1 | Direct invocation against commit 5040eac9ef patterns | PASS |
| Checker: allowed class → exit 0 | Direct invocation with CWE/RFC/HTTP/platform tags | PASS |
| Checker: hygiene-ok escape | Direct invocation with escape annotation | PASS |
| Checker: zero false positives on context-server.ts | Direct invocation | PASS |
| Claude Code PostToolUse hook fires on Write | Smoke-test: write TS file with violation | PASS — warning in tool result |
| Pre-commit blocks staged violation | `git commit` integration test | PASS — exit 1 with message |
| Pre-commit allows clean staged file | `git commit` integration test | PASS — exit 0 |
| CLAUDE.md §1 comment hygiene block present | Read file; grep confirmed line 49 | PASS |
| Constitutional memory entry on disk | ls check | PASS |
| sk-code SKILL.md Phase 1.5 step present | grep confirmed line 216 | PASS |
| PostToolUse wired in settings.local.json | grep confirmed lines 80/86 | PASS |
| validate.sh --strict Exit 0 | Run validator | PASS — 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Pre-commit hook requires one-time `bash .opencode/hooks/install-hooks.sh` per fresh clone.
- Write-time hooks depend on PostToolUse stdin schema — if the schema differs from expectation, the hook will need adjustment (fail-safe design ensures tooling doesn't break in the meantime).
- OpenCode write-time enforcement may not be possible if the plugin API doesn't expose a file-write event; the pre-commit gate is the fallback for OpenCode sessions.
- This phase does not clean up new violations found during investigation — that is a separate sweep.
<!-- /ANCHOR:limitations -->
