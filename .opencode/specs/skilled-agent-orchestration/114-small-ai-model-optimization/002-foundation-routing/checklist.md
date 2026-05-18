---
title: "Verification Checklist: foundation routing"
description: "L2 quality gates for Phase A: pre-impl, code quality, testing, fix-completeness, security, docs, file-org, summary."
trigger_phrases:
  - "foundation routing checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/002-foundation-routing"
    last_updated_at: "2026-05-18T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 002 checklist.md"
    next_safe_action: "Mint metadata + validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000006"
      session_id: "114-002-checklist-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: foundation routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] spec.md L2 strict-validates exit 0
- [x] CHK-002 [P0] plan.md L2 strict-validates exit 0
- [x] CHK-003 [P0] research.md §RQ5 HYBRID-with-Anchor verdict is the architecture input
- [x] CHK-004 [P1] Skill-advisor scorer logic (fusion.ts:41-200) understood by implementer
- [x] CHK-005 [P1] sk-prompt graph-metadata.json reviewed as enhances precedent template
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] sk-small-model/SKILL.md ≤ 200 LOC
- [x] CHK-011 [P0] sk-small-model/references/pattern-index.md ≤ 100 LOC
- [x] CHK-012 [P0] All JSON files (graph-metadata.json, description.json) are well-formed (jq parses)
- [x] CHK-013 [P1] Enhances edges include `context` strings (not just weights)
- [x] CHK-014 [P1] pattern-index.md uses relative paths (survives refactors)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Sample prompt "dispatch SWE-1.6 to read file X" surfaces sk-small-model in top-3 with confidence ≥ 0.8
- [x] CHK-021 [P0] Sample prompt "use cli-devin for code review with output verification" same
- [x] CHK-022 [P0] Sample prompt "what's the small-model output verification pattern" same
- [x] CHK-023 [P0] Regression: "code review TypeScript file" (non-small-model) does NOT pull sk-small-model into top-3 (or confidence < 0.5)
- [ ] CHK-024 [P1] Existing cli-devin advisor confidence on its baseline triggers (e.g. "swe-1.6 dispatch") stays within ±0.05 of pre-change baseline — not measured against pre-change baseline; current `swe-1.6 dispatch` ranks cli-devin confidence 0.9339.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 4 sk-small-model files created and present
- [x] CHK-031 [P0] AGENTS.md edit applied and verifiable via grep
- [x] CHK-032 [P0] cli-devin + cli-opencode graph-metadata.json edits applied
- [x] CHK-033 [P0] Skill-advisor re-index successful (no error log entries)
- [x] CHK-034 [P1] No spurious files created (only the 4 sk-small-model files + 3 metadata edits + 1 AGENTS.md edit)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] sk-small-model/SKILL.md `allowed-tools` is empty `[]` (sentinel skill needs no tools)
- [x] CHK-041 [P2] No credentials or secrets accidentally added to metadata
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] sk-small-model/SKILL.md frontmatter includes `description`, `name`, `version`, `allowed-tools=[]`
- [x] CHK-051 [P0] AGENTS.md "Small-model dispatch rule" matches the template in research.md §RQ5 Refined Verdict
- [x] CHK-052 [P1] pattern-index.md cites all expected reference paths (anticipating 003-007)
- [x] CHK-053 [P1] All cross-references in this packet's docs are accurate (no stale links)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] sk-small-model directory follows the standard skill layout: SKILL.md, description.json, graph-metadata.json, references/
- [x] CHK-061 [P0] No empty subdirectories
- [x] CHK-062 [P1] AGENTS.md edit preserves existing line structure (no accidental reformatting)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Total checks**: 30+
- **P0 blockers**: 18
- **P1 required**: 10
- **P2 optional**: 2
- **Pass state for `done` claim**: all P0 checked with evidence, P1 checked or user-deferred, P2 documented
<!-- /ANCHOR:summary -->
