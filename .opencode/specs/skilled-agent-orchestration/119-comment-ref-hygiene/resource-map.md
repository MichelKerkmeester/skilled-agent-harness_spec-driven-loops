---
title: "Resource Map: Comment Hygiene Program (119)"
description: "Key files, scripts, and config locations for the comment hygiene enforcement program."
trigger_phrases:
  - "comment hygiene resources"
  - "119 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Resource map created for phase-parent"
    next_safe_action: "Resume 002 tasks"
    blockers: []
    key_files: []
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Resource Map: Comment Hygiene Program (119)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

---

## Phase 001 — Rule & Cleanup (Complete)

| Resource | Path | Purpose |
|----------|------|---------|
| Canonical rule | `.opencode/skills/sk-code/references/universal/code_style_guide.md §4` | The text rule forbidding ephemeral-artifact pointers in comments |
| P0 mirror | `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | P0-level enforcement copy of the rule |
| OpenCode revision | `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md §4` | Aggressive revision of the formerly contradicting section |
| Webflow pointer | `.opencode/skills/sk-code/references/webflow/shared/cross_language_rules.md §7` | Webflow surface pointer to the canonical rule |

## Phase 002 — Active Enforcement Layer (In Progress)

| Resource | Path | Purpose |
|----------|------|---------|
| Shared checker script | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Language-aware ephemeral ref detector; used by all enforcement tiers |
| Claude Code hook | `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | PostToolUse hook; warns AI at write time |
| Claude Code hook config | `.claude/settings.local.json` | PostToolUse entry wiring the hook |
| Git pre-commit hook | `.opencode/hooks/pre-commit` | Commit-time gate; runtime-agnostic |
| Hook installer | `.opencode/hooks/install-hooks.sh` | One-command hook install for fresh clones |
| CLAUDE.md entry | `CLAUDE.md §1` | Always-in-context comment hygiene rule |
| Constitutional memory | `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Always-surface memory entry |

## Spec Folder Navigation

| Document | Path |
|----------|------|
| Phase-parent spec | `119-comment-ref-hygiene/spec.md` (this folder) |
| Phase 001 spec | `119-comment-ref-hygiene/001-rule-and-cleanup/spec.md` |
| Phase 002 spec | `119-comment-ref-hygiene/002-active-enforcement-layer/spec.md` |
| Phase 002 tasks | `119-comment-ref-hygiene/002-active-enforcement-layer/tasks.md` |
