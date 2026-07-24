---
title: "Tasks: docs, agents, governance and closeout"
description: "Task breakdown for the cli-cursor docs/agents/governance/closeout phase."
trigger_phrases: ["cli-cursor closeout tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T12:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 10 tasks complete; whole packet validate --recursive --strict 0/0"
    next_safe_action: "Write implementation-summary.md, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["AGENTS.md-as-Cursor-rules: stays executor-agnostic - no CLI-specific special-casing exists in AGENTS.md/CLAUDE.md today for any sibling, so Cursor gets none either."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: docs, agents, governance and closeout

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Ran `rg -l 'cli-codex|cli-claude-code|cli-opencode'` over rosters/governance/cross-skill trees — narrowed to live (non-archival, non-historical-spec) surfaces per Out-of-Scope: `.opencode/agents/deep-improvement.md` (+ `.claude` mirror), root `README.md` (CROSS-AI CLI section), `cli-external-orchestration/README.md` (hub's own — found 0 `cli-cursor` mentions despite `SKILL.md` having 7 from phase 003)
- [x] T002 Decided: root `AGENTS.md`-as-Cursor-rules stays **executor-agnostic**. Grepped `AGENTS.md`/`CLAUDE.md` for any existing per-CLI special-casing — found none for any of the 3 existing siblings either (only one incidental "cli-opencode" usage example, unrelated to rules content) — so Cursor gets no bespoke note, consistent with the existing pattern
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Added `cli-cursor` to the one roster surface that enumerated dispatch executors: `.opencode/agents/deep-improvement.md` + `.claude/agents/deep-improvement.md` (`.codex/agents/deep-improvement.md` does not exist, so no 3rd mirror to touch) — "across cli-opencode, claude-code, and codex" → "...codex, and cursor"
- [x] T004 Added `cli-cursor` to governance/README enumeration surfaces: root `README.md` (CROSS-AI CLI section — advisor-identity sentence + new `cli-cursor` bullet + `prompt-models` Composer-2.5 mention), `cli-external-orchestration/README.md` (frontmatter description/trigger_phrases/version, tagline, AT A GLANCE table x4, OVERVIEW section x4, QUICK START example). `AGENTS.md`/`CLAUDE.md` needed no edit (T002 — no per-CLI enumeration exists there)
- [x] T005 [P] No additional cross-skill sibling docs identified beyond T003/T004 — verified via `grep -rl "cli-opencode" .opencode/skills/*/README.md .opencode/skills/*/SKILL.md | xargs grep -l "cli-claude-code" | xargs grep -l "cli-codex"`, which returned only `cli-external-orchestration/README.md` and `cli-external-orchestration/SKILL.md` (both already fixed under T004/phase 003)
- [x] T006 Reconciled packet completion metadata via `grep "Status" 00{1..6}-*/spec.md`: all 6 read `| **Status** | Complete |` (004's carries an additional parenthetical noting the deferred `.cursor/hooks.json` registration); phase 007 (this phase) status set to `Complete` in `spec.md` line 31
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T007 `bash validate.sh 030-cli-cursor-creation --recursive --strict` → 0 errors, 0 warnings across the phase-parent and all 7 phase children
- [x] T008 `parent-skill-check.cjs` → `OK ... all hard invariants passed, 0 warnings`; `validate_skill_package.py` (default, non-strict invocation, matching REQ-005's literal wording) → `package_skill.py --check: PASS`, `compiled routing readiness: PASS` (fixed a stale bookkeeping hash — see implementation-summary.md), `parent-skill-check.cjs: PASS`
- [x] T009 Coverage-sweep: `grep -rn "cli-cursor" .opencode/agents/deep-improvement.md .claude/agents/deep-improvement.md README.md .opencode/skills/cli-external-orchestration/README.md` confirms `cli-cursor` now present in every surface identified in T001 wherever the 3 siblings already were
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T010 `validate.sh 007-docs-agents-governance-and-closeout --strict` passes 0/0; SC-001..SC-004 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Final phase; depends on phases 002-006 for the surfaces it references.
- Sibling closeout precedent: `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
