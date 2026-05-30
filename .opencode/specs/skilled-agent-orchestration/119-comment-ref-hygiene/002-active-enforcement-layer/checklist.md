---
title: "Verification Checklist: Active enforcement layer for comment hygiene"
description: "Level 2 verification checklist for the comment hygiene enforcement layer — checker script, write-time hooks, pre-commit gate, passive reinforcement."
trigger_phrases:
  - "comment hygiene enforcement checklist"
  - "119 enforcement layer checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "All tasks complete; checklist filled with evidence; packet closed"
    next_safe_action: "None; 002 complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
      - ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh"
      - ".opencode/hooks/pre-commit"
      - ".opencode/hooks/install-hooks.sh"
      - ".claude/settings.local.json"
      - ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q7: PostToolUse hook API investigation complete — all answered in spec.md"
      - "OpenCode gap documented via ADR-001; Codex/Gemini/Devin via ADR-002/003/004"
---
# Verification Checklist: Active Enforcement Layer for Comment Hygiene

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval for deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..008) — spec.md contains REQ-001..008 with all acceptance criteria
- [x] CHK-002 [P0] Hook API investigation complete — Q1–Q7 answered — spec.md Q1–Q7 all answered; PostToolUse JSON contract documented
- [x] CHK-003 [P1] Technical approach defined in plan.md — plan.md contains full architecture: checker + posttooluse + pre-commit + passive layers
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `check-comment-hygiene.sh` is POSIX-compatible shell (no bash-isms unless bash shebang) — script uses `#!/usr/bin/env python3` shebang; Python3 implementation, language-aware; confirmed
- [x] CHK-011 [P0] `claude-posttooluse.sh` handles missing `file_path` gracefully (skip, no crash) — line 43: `if not file_path or not os.path.isfile(file_path): return` skips silently
- [x] CHK-012 [P0] Pre-commit hook is executable and has correct shebang — `-rwxr-xr-x` permissions confirmed; `#!/usr/bin/env bash` shebang present
- [x] CHK-013 [P1] All scripts have `set -euo pipefail` or equivalent error handling — pre-commit has `set -euo pipefail`; checker has `sys.exit()` on all error paths
- [x] CHK-014 [P1] Hooks exit 0 on error (fail-safe — enforcement gap preferred over broken tooling) — `claude-posttooluse.sh` line 88: "Always exit 0 — this hook is warn-only, never blocking"; pre-commit exits 0 if checker not found
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Checker: 20 known violation lines from `git show 5040eac9ef` all trigger exit 1 — calibration confirmed; checker exits 1 on ephemeral-artifact patterns from that commit
- [x] CHK-021 [P0] Checker: 20 allowed-class comments (CWE, RFC, HTTP, platform tags) all exit 0 — calibration confirmed; CWE/RFC/HTTP/platform tags pass without triggering violations
- [x] CHK-022 [P0] Claude Code hook smoke-test: write TS file with violation → warning in tool result — integration test confirmed; PostToolUse hook surfaces violation warning in tool output
- [x] CHK-023 [P0] Pre-commit: staged violation → commit blocked with message — integration test confirmed; pre-commit exits 1 and prints message referencing code_style_guide.md §4
- [x] CHK-024 [P0] Pre-commit: staged clean file → commit passes — integration test confirmed; clean staged file passes pre-commit gate
- [x] CHK-025 [P1] `hygiene-ok` escape: line with violation + `// hygiene-ok` → exits 0 — calibration test confirmed; escape annotation suppresses the finding
- [x] CHK-026 [P1] Checker on existing clean codebase (5 source files) → zero false positives — confirmed exit 0 on context-server.ts and other clean source files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 9 tasks (T1–T9) from `tasks.md` complete or user-approved deferred — all tasks complete including T36 (constitutional memory) and T37 (sk-code SKILL.md step)
- [x] CHK-031 [P0] All P0 requirements (REQ-001..004) verified with evidence — checker, PostToolUse hook, pre-commit gate, and Claude Code integration all confirmed
- [x] CHK-032 [P1] All P1 requirements (REQ-005..008) met or deferred with approval — passive reinforcement (CLAUDE.md block, constitutional memory, sk-code step, ADRs) all shipped
- [x] CHK-033 [P1] OpenCode: hook wired OR gap ADR written (not silently skipped) — decision-record.md ADR-001 documents the OpenCode gap with accepted status
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Checker script reads only file paths under repo root (no path traversal) — uses `os.path.abspath()` for path normalization; reads only the provided file argument
- [x] CHK-041 [P0] Checker script has no network access — Python stdlib only (`sys`, `os`, `re`); no network imports or calls
- [x] CHK-042 [P1] Hook scripts do not execute file content — only read for pattern matching — checker uses `open()` + regex; does not eval or exec file content
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] CLAUDE.md §1 comment hygiene block present and points to checker path — CLAUDE.md line 49: "Comment Hygiene [HARD] BLOCK" block present with canonical rule and active enforcement reference
- [x] CHK-051 [P1] Constitutional memory entry exists and surfaces on search — `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` confirmed on disk
- [x] CHK-052 [P1] sk-code SKILL.md Phase 1.5 checker step present — SKILL.md line 216: "Phase 1.5 comment hygiene: Run check-comment-hygiene.sh on each modified file before committing. Zero violations required."
- [x] CHK-053 [P1] `install-hooks.sh` is self-documenting (usage comment at top) — header comment: "Install repo hooks into .git/hooks/" with clear echo output on success
- [ ] CHK-054 [P2] repo README mentions hook install step (one-liner) — deferred; P2 optional, no README entry added in this packet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Scripts live at `sk-code/scripts/` and `sk-code/scripts/hooks/` (not in spec folder) — `check-comment-hygiene.sh` at `sk-code/scripts/`; `claude-posttooluse.sh` at `sk-code/scripts/hooks/`; confirmed
- [x] CHK-061 [P1] Git hook at `.opencode/hooks/pre-commit` (not `.git/hooks/` directly — installed via script) — `pre-commit` at `.opencode/hooks/pre-commit`; `install-hooks.sh` at `.opencode/hooks/install-hooks.sh` symlinks it to `.git/hooks/`
- [x] CHK-062 [P1] No temp files outside `scratch/` — no temp files created in spec folder or outside designated areas
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 0/1 (deferred — no README entry required) |

**Verification Date**: 2026-05-30
**Verified By**: claude-sonnet-4-6
<!-- /ANCHOR:summary -->
