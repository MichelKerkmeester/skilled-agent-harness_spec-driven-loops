---
title: "Verification Checklist: sk-prompt design-tool usecases"
description: "Verification evidence for the sk-prompt design-generation assessment and the design-generation prompt reference plus router wiring added as a result. Each item marked [x] carries evidence."
trigger_phrases:
  - "sk-prompt design tool checklist"
  - "design generation prompt verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/006-sk-prompt-design-tool-usecases"
    last_updated_at: "2026-06-14T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Orchestrator registers the 006 child in the 150 parent"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-006-sk-prompt-design-tool-usecases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-prompt design-tool usecases

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

- [x] CHK-001 [P0] Source skills read before any edit
  - **Evidence**: Read sk-prompt (SKILL.md, depth_framework.md, patterns_evaluation.md, README), mcp-magicpath and mcp-open-design SKILL.md, and claude_design_parity.md
- [x] CHK-002 [P0] Multi-turn discovery flow grounded, not assumed
  - **Evidence**: `od_cli_reference.md` lines 149-153 confirm `start_run` is multi-turn and `od ui respond` answers a blocked GenUI form
- [x] CHK-003 [P0] Assessment verdict reached per need (a) to (d)
  - **Evidence**: spec.md §10 and implementation-summary.md record yes for the grounded brief, seed-of-thought, and discovery-form needs, and a pointer for the sk-code handoff
- [x] CHK-004 [P1] Baseline captured before edits
  - **Evidence**: `package_skill.py --check` PASS at start with 1 pre-existing framework-registry.json naming warning
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New reference matches the 5-field reference frontmatter
  - **Evidence**: `design_generation_patterns.md` carries title, description, trigger_phrases, importance_tier, contextType, matching the other references
- [x] CHK-011 [P0] House voice honored in new prose
  - **Evidence**: No em dashes and no prose semicolons in the new reference, SKILL.md edits, changelog, or packet docs
- [x] CHK-012 [P1] Addition fits the existing architecture
  - **Evidence**: Reference plus `DESIGN_GEN` router intent, mirroring how `patterns_evaluation.md` loads for `FRAMEWORK`, with no new pipeline or scoring change
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `package_skill.py --check` passes
  - **Evidence**: Result PASS, 1 pre-existing naming warning, no new errors
- [x] CHK-021 [P0] README structure check clean
  - **Evidence**: `validate_document.py --type readme` reports 0 issues after the §9 row was added
- [x] CHK-022 [P0] Packet docs validate strict
  - **Evidence**: `validate.sh --strict` on this folder reports 0 errors
- [x] CHK-023 [P1] Router consistency across SKILL.md surfaces
  - **Evidence**: `DESIGN_GEN` present in INTENT_MODEL, RESOURCE_MAP, resource domains, loading levels, §5 and §9
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The assessed gap is fully closed
  - **Evidence**: The reference covers all three confirmed-gap needs (grounded brief, seed-of-thought, discovery-form pre-answer) plus the handoff pointer
- [x] CHK-031 [P0] Anti-default guardrail honored
  - **Evidence**: The seed-of-thought indexes brief-grounded directions only, and the reference restates the no-preset rule from `claude_design_parity.md` §8
- [x] CHK-032 [P1] Ownership boundary explicit
  - **Evidence**: The reference defers the look to `sk-design-interface`, the transport to the MCP skills, and points to `claude_design_parity.md` §6 for handoff
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets and no security-sensitive surface touched
  - **Evidence**: The change is markdown skill content only, with no credentials, tokens, or executable paths added
- [x] CHK-041 [P1] No spec paths or artifact ids embedded in skill code
  - **Evidence**: The reference uses durable cross-skill paths only, with no packet, ADR, or task ids in any skill file
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Changelog added for the version bump
  - **Evidence**: `changelog/v2.2.0.0.md` records the addition and files changed, matching SKILL.md version 2.2.0.0
- [x] CHK-051 [P1] README reflects the new reference
  - **Evidence**: RELATED DOCUMENTS gained a row for `design_generation_patterns.md`
- [x] CHK-052 [P1] Packet spec, plan, tasks synchronized
  - **Evidence**: All three docs and this checklist describe the same scope and completed state
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] `sk-design-interface` untouched
  - **Evidence**: No edits under `.opencode/skills/sk-design-interface/`. Phase 005 owns it
- [x] CHK-061 [P2] No stray temp files left behind
  - **Evidence**: No scratch or temp files created outside this packet and the sk-prompt skill
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-14
**Verified By**: AI Assistant (Claude Opus)
<!-- /ANCHOR:summary -->
