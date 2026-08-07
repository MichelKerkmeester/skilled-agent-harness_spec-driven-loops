---
title: "Verification Checklist: Cursor agents/skills/rules parity"
description: "Evidence gate for the UserPromptSubmit question resolution, the .cursor/rules build, and the agents/commands decisions."
trigger_phrases:
  - "cursor agents skills rules parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented static rules and parity findings."
    next_safe_action: "Review scoped uncommitted diff."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines four acceptance-tested requirements (REQ-001 through REQ-004).]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` records the source-read-before-rules ordering and the resolved dormant-delivery architecture.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 004 is complete; `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5-14` provides the hook source and was read at the cited lines.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `.cursor/hooks.json`'s `UserPromptSubmit` handler is not modified by this phase. [EVIDENCE: `git diff --stat -- .cursor/hooks.json` produces no output.]
- [x] CHK-011 [P1] The new `.cursor/rules/*.md` content does not duplicate what the hook already injects. [EVIDENCE: `implementation-summary.md` records the source comparison and the static-vs-dynamic scope separation.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The `UserPromptSubmit` open question is resolved with a cited source read (file + line range), not an assumption. [EVIDENCE: `implementation-summary.md` cites `user-prompt-submit.ts:5-14` and `:45-51`, plus the live result at `hook-contract.md:106`.]
- [x] CHK-021 [P1] `.cursor/rules/*.md` contains real, non-empty content. [EVIDENCE: `find .cursor/rules -name '*.md' -size +0c` lists `skill-routing.md`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] `.cursor/rules/` is no longer empty (0 files). [EVIDENCE: `find .cursor/rules -maxdepth 1 -type f -print` lists `skill-routing.md`.]
- [x] CHK-031 [P1] The agents non-applicability decision is recorded explicitly. [EVIDENCE: `cli-cursor/SKILL.md` states the live `cursor-agent --help` confirmation.]
- [x] CHK-032 [P1] The commands non-applicability decision is recorded explicitly. [EVIDENCE: `cli-cursor/SKILL.md` states the live `cursor-agent --help` confirmation.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] The new rules content introduces no credential or secret exposure. [EVIDENCE: content review of `.cursor/rules/skill-routing.md` found only repository-relative skill paths and routing guidance.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: final `validate.sh --strict` reports 0 errors and 0 warnings for phase 014.]
- [x] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: no code files were changed; the Python-backed `check-comment-hygiene.sh` exits 2 as not applicable for each Markdown file, and phase validation reports `COMMENT_HYGIENE_MARKER` passed.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New rules content lives under `.cursor/rules/`, matching the documented directory convention. [EVIDENCE: `.cursor/rules/skill-routing.md` confirmed on disk.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27 (Complete)
<!-- /ANCHOR:summary -->
