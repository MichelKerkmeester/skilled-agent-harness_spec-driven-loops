---
title: "Feature Specification: Active enforcement layer for comment hygiene"
description: "119 produced the text rule in sk-code §4. AIs still added 27-file worth of violations in the next 100 commits. This phase builds write-time hooks (Claude Code, OpenCode), a runtime-agnostic git pre-commit gate, a shared checker script, a sk-code router step, and optional CLAUDE.md / constitutional memory reinforcement — layered defense that catches violations before they land."
trigger_phrases:
  - "comment hygiene enforcement"
  - "pre-commit hook ephemeral"
  - "write-time hook comment hygiene"
  - "sk-code comment checker"
  - "119 enforcement layer"
  - "comment hygiene hook"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/002-active-enforcement-layer"
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code PostToolUse stdin schema confirmed — {session_id, transcript_path, cwd, hook_event_name, tool_name, tool_input.file_path, tool_result}"
      - "OpenCode file-write event: not available — pre-commit is the fallback (ADR-001)"
      - "Codex/Gemini/Devin: no write-time hooks — documented in ADR-002/003/004"
---
# Feature Specification: Active Enforcement Layer for Comment Hygiene

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 119 added the canonical "no ephemeral-artifact pointers" rule to `sk-code §4`. Despite that rule, 27 files in the ~100 commits that followed still required cleanup (commit `5040eac9ef`, 2026-05-29). The pattern is consistent: AIs start sessions knowing the rule, then drift into adding spec-folder/packet/phase/ADR/task ids as traceability anchors during long implementation runs. Text rules alone cannot fix attention drift.

This phase builds an **active enforcement stack** with three tiers:

| Tier | Mechanism | Scope |
|------|-----------|-------|
| 1 — Write-time | Claude Code PostToolUse hook + OpenCode write hook | Real-time warning before the AI continues |
| 2 — Commit-time | Git pre-commit hook (shared checker script) | Runtime-agnostic; catches everything at commit |
| 3 — Always-in-context | CLAUDE.md §1 addition + constitutional memory entry | Keeps the rule in the AI's attention even before skill load |

A **shared shell checker script** (`sk-code/scripts/check-comment-hygiene.sh`) powers both Tier 1 and Tier 2 so the pattern logic lives in exactly one place.

**Key Decisions**: Investigate hook APIs first; implement shared checker before any per-runtime wiring; git pre-commit is the mandatory floor; write-time hooks are the highest-value layer.

**Critical Dependencies**: Claude Code hook parameter contract (PostToolUse stdin schema); OpenCode hook event types; git pre-commit hook install strategy; sk-code scripts folder (does not exist yet — must create).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `119-comment-ref-hygiene` (root) — established the rule; this phase enforces it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-code §4` text rule exists. AIs acknowledge it at session start. Yet by commit 40–50 of a long implementation run, they add `// 031/005: carry the parsed health body`, `// REQ-011: lease cleanup runs unconditionally`, `// (026/007/011 review finding)`, and similar. The violations are from deep, legitimate implementation work — the AI genuinely tries to provide traceability. The rule is passive; the behavior is active and recurs.

Three root causes:

1. **Attention drift in long sessions** — the style guide is loaded once; the rule drops out of working context by commit 20.
2. **Deep-loop bypass** — `deep-review` and `deep-research` agents dispatch code-authoring sub-agents that may not load sk-code at all, or load an old snapshot of it.
3. **No enforcement at write/commit time** — there is no hook, linter, or gate that says "STOP — this comment names a packet phase."

### Purpose

Install enforcement that intercepts violations at the moment they occur (write-time) and/or at the last reliable checkpoint (commit-time), regardless of which AI, runtime, or skill path produced the code. The result: the next 100 commits require zero manual cleanup sweeps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Investigation of hook APIs: Claude Code PostToolUse, OpenCode write event, Codex `PreToolUse`, Gemini, Devin.
- A shared `check-comment-hygiene.sh` checker script (language-aware, fast, used by all tiers).
- Claude Code PostToolUse hook wired in `.claude/settings.local.json`.
- OpenCode write hook wired in `opencode.json` (if a suitable event exists; else document the gap and plan the plugin approach).
- A committed git pre-commit hook at `.opencode/hooks/pre-commit` with an install script or Husky integration.
- A `sk-code` Phase 1.5 quality-gate step that explicitly calls the checker before committing.
- A CLAUDE.md §1 CRITICAL RULES entry for comment hygiene.
- A constitutional memory entry so the rule surfaces at the top of every memory search.
- Codex/Gemini/Devin: investigate and wire where hook support exists; document gaps where it does not.

### Out of Scope

- Changing the existing text rule in `code_style_guide.md §4` (already correct).
- Cleaning up new violations found during investigation (that is a separate sweep following 119's pattern).
- CI/CD pipeline linting (a future P2 follow-on if the hook approach proves insufficient).
- False-positive tuning beyond the initial calibration pass.

### Files to Create / Modify

| Path | Change | Notes |
|------|--------|-------|
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Create | Shared checker; language-aware; used by all tiers |
| `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | Create | Reads stdin, extracts file_path, calls checker |
| `.claude/settings.local.json` | Modify | Add PostToolUse hook entry for Write\|Edit |
| `opencode.json` | Modify (or doc gap) | Wire OpenCode write hook if event type exists |
| `.opencode/hooks/pre-commit` | Create | Committed pre-commit hook script |
| `.opencode/hooks/install-hooks.sh` | Create | One-command hook installer for fresh clones |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add Phase 1.5 quality-gate step for checker |
| `CLAUDE.md` (project root) | Modify | Add §1 comment-hygiene entry |
| `.opencode/skills/system-spec-kit/constitutional/` | Create | Always-surface constitutional memory entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared checker script exists and correctly identifies the violation patterns from commit `5040eac9ef` | Running checker on a file with `// 026/007/011 review finding` returns exit 1 with the violation reported |
| REQ-002 | Checker produces zero false positives on the allowed classes: HTTP codes, CWE ids, RFC ids, `WEBFLOW:`, `MOTION:`, functional path constants | Smoke-test file with 10 allowed patterns exits 0 |
| REQ-003 | Git pre-commit hook blocks a commit that introduces a comment with an ephemeral ref | Test: `git commit` with a staged ephemeral ref comment returns exit 1 with clear error |
| REQ-004 | Claude Code PostToolUse hook fires on Write and Edit, calls the checker, and its output appears in the tool result (AI sees it) | Smoke-test: write a TS file with `// REQ-011: ...` in Claude Code — the hook warning appears before the next AI turn |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | OpenCode write event wired (or gap documented with plugin approach specified) | Either hook config in `opencode.json` or a written gap + plugin design in the decision record |
| REQ-006 | sk-code Phase 1.5 quality gate updated to include a "run checker before committing" step | Step visible in SKILL.md Phase 1.5 block |
| REQ-007 | CLAUDE.md §1 entry added for comment hygiene | Entry present in §1 CRITICAL RULES, under a new "Comment Hygiene" subsection |
| REQ-008 | Constitutional memory entry created and validated | Entry appears at top of `memory_search` results for "comment hygiene" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future AI writing code under sk-code, when it adds `// REQ-011: lease cleanup runs unconditionally`, sees a warning from the write-time hook before its next turn and self-corrects.
- **SC-002**: A future `git commit` with a staged ephemeral ref in a comment is blocked by the pre-commit hook with a clear message pointing to `code_style_guide.md §4`.
- **SC-003**: Zero ephemeral refs appear in code comments across the next 100 commits (measured by a follow-on sweep or per-commit CI check).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False positives in checker pattern | Medium — annoys AI, prompts disabling the hook | Calibrate on the 27-file violation corpus + 20-file allowed corpus before wiring |
| Risk | Claude Code hook stdin schema undocumented / changes between versions | High — hook silently fails | Read existing hook source (`session-prime.js`) for confirmed stdin schema; add fallback to skip on parse failure |
| Risk | OpenCode lacks a write-event hook in its current plugin API | Medium — Tier 1 coverage gap | Document the gap; propose a plugin PR or rely on Tier 2 (pre-commit) |
| Risk | Developer installs a fresh clone and skips `install-hooks.sh` | Medium — pre-commit gate missing | Add install step to repo README and consider Husky auto-install |
| Dependency | `check-comment-hygiene.sh` must exist before any hook can call it | Blocks all hook wiring | Create checker (Task 2) before any hook tasks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: No runtime behavior change — all deliverables are hooks, scripts, and docs; zero production logic changes.
- **NFR-S01**: The checker script must not read file content outside the repo root; no network access.
- **NFR-R01**: Every hook must fail-safe — if the checker script is missing or the stdin parse fails, the hook exits 0 (no block) and logs a warning. Enforcement gaps are preferable to broken tooling.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`// hygiene-ok` escape hatch**: A line ending with this annotation is exempt. Used for the rare structural comment that looks like an ephemeral ref but is intentional (e.g., a test fixture's inline comment).
- **Multi-line block comments**: The checker scans individual lines; a block comment that spans lines is checked line-by-line, so each line with a violation is reported independently.
- **JSONC / config files**: `//` inside JSON is not a comment in strict JSON but is in JSONC. The checker applies the same rule to `.jsonc` and `.json` files as to TypeScript.
- **Compiled output (`*.vitest.js`, `dist/*.js`)**: The checker skips `dist/`, `node_modules/`, and `*.vitest.js` by default — source files are the target, not compiled output.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: ~8 created/modified, Systems: 5 runtimes + git |
| Risk | 10/25 | Hook API uncertainty; false-positive calibration |
| Research | 12/20 | Hook API investigation across 5 runtimes |
| Multi-Agent | 0/15 | Single-agent implementation |
| Coordination | 5/15 | Single-process with verification gate |
| **Total** | **39/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1**: Exact PostToolUse stdin schema for Write/Edit tools in Claude Code (which fields are present?).
- **Q2**: Does OpenCode's plugin API expose a file-write event type that can call an external script?
- **Q3**: Which Codex/Gemini/Devin runtimes support write-time hooks vs. only session/prompt hooks?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md` — the original packet establishing the text rule
- **sk-code Style Guide**: `.opencode/skills/sk-code/references/universal/code_style_guide.md §4`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
