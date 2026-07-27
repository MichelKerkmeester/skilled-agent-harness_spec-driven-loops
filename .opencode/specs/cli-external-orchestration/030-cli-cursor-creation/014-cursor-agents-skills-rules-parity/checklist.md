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
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Verify each item with command-backed evidence."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
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

- [ ] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines four acceptance-tested requirements (REQ-001 through REQ-004).]
- [ ] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` orders the source-read before the rules-content build.]
- [ ] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 004 is complete and provides the hook source.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.cursor/hooks.json`'s `UserPromptSubmit` handler is not modified by this phase. [EVIDENCE: `git diff --stat` on the hook file produces no output.]
- [ ] CHK-011 [P1] The new `.cursor/rules/*.md` content does not duplicate what the hook already injects. [EVIDENCE: diff shown in `implementation-summary.md`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The `UserPromptSubmit` open question is resolved with a cited source read (file + line range), not an assumption. [EVIDENCE: `implementation-summary.md` cites the exact source.]
- [ ] CHK-021 [P1] `.cursor/rules/*.md` contains real, non-empty content. [EVIDENCE: file listing shows non-empty `.md` files under `.cursor/rules/`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `.cursor/rules/` is no longer empty (0 files). [EVIDENCE: `ls .cursor/rules/` shows at least one file.]
- [ ] CHK-031 [P1] The agents non-applicability decision is recorded explicitly. [EVIDENCE: `cli-cursor/SKILL.md` states the live `--help` confirmation.]
- [ ] CHK-032 [P1] The commands non-applicability decision is recorded explicitly. [EVIDENCE: `cli-cursor/SKILL.md` states the live `--help` confirmation.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] The new rules content introduces no credential or secret exposure. [EVIDENCE: content review of `.cursor/rules/*.md`.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 014.]
- [ ] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] New rules content lives under `.cursor/rules/`, matching the documented directory convention. [EVIDENCE: file paths confirmed on disk.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 0/4 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (Planned)
<!-- /ANCHOR:summary -->
