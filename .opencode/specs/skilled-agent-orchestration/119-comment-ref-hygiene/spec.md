---
title: "Feature Specification: Forbid ephemeral-artifact references in code comments"
description: "Phase-parent for the comment hygiene program. Phase 001 added the sk-code §4 rule and swept Bucket-A violations. Phase 002 builds the active enforcement layer (write-time hooks, pre-commit gate, checker script) so the rule is mechanically enforced and cannot be ignored."
trigger_phrases:
  - "comment hygiene"
  - "ephemeral artifact references"
  - "spec folder references in comments"
  - "sk-code comment rule"
  - "119 comment hygiene"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Converted to phase parent; 001 rule+cleanup complete; 002 enforcement layer in progress"
    next_safe_action: "Resume 002-active-enforcement-layer investigation tasks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/universal/code_style_guide.md"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Rule scope: Broad + revise section 4 (forbid spec/packet/phase/feature-catalog/ADR/T/REQ/CHK in comments)"
      - "Executor: CLI-CODEX/gpt-5.5"
      - "Spec folder: Level 3 with decision-record.md"
      - "Code locations: comments only (Bucket A); leave functional literals (B) and test fixtures (C)"
---
# Feature Specification: Forbid Ephemeral-Artifact References in Code Comments

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Phase Parent) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-27 |
| **Updated** | 2026-05-30 |
| **Branch** | main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
AI assistants routinely embed pointers to ephemeral tracking artifacts — spec folders, packet/phase numbers, feature-catalog entries, ADR ids, and task/checklist ids — directly into inline code comments. Those artifacts get renamed, renumbered, or archived while the code lives on, so the comment rots into a dangling, misleading pointer. Phase 001 added a text rule to sk-code. Despite the rule, 27 files required cleanup 100 commits later — text rules alone are insufficient.

### Purpose
The program delivers two things: (1) a durable canonical rule in sk-code that forbids the pattern on both surfaces and cleans existing offenders, and (2) an active enforcement layer (write-time hooks, commit-time gate, shared checker script) that catches violations mechanically before they land.

> **Phase-parent note**: This spec.md is the ONLY authored document at this level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

This is a phase-parent coordination document. See child phases for detailed scope.

### Phase Map

| Phase | Title | Status |
|-------|-------|--------|
| 001-rule-and-cleanup/ | sk-code §4 rule + Bucket-A comment sweep across 4 skills | Complete |
| 002-active-enforcement-layer/ | Write-time hooks, pre-commit gate, checker script, CLAUDE.md, constitutional memory | In Progress |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

See child phase spec.md files for detailed requirements.

**Program-level goals**:
- P0: sk-code forbids ephemeral-artifact pointers in comments on both surfaces (done, 001)
- P0: Active enforcement catches violations at write and commit time (002)
- P1: Zero ephemeral refs in code comments across 100+ consecutive commits post-enforcement
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future AI adding `// REQ-011: lease cleanup runs unconditionally` sees a write-time hook warning and self-corrects.
- **SC-002**: A future `git commit` with a staged ephemeral ref comment is blocked automatically.
- **SC-003**: Zero manual cleanup sweeps required in the next 100 commits.
<!-- /ANCHOR:success-criteria -->

## RELATED DOCUMENTS
- **Phase 001**: `001-rule-and-cleanup/spec.md` — rule + cleanup (complete)
- **Phase 002**: `002-active-enforcement-layer/spec.md` — enforcement layer (in progress)
- **Resource Map**: `resource-map.md`
