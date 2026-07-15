---
title: "Checklist: verify ai-council agent naming (017 phase 001)"
description: "Checklist for phase 001 of the 017 agents component migration: verify the ai-council filename candidate set."
trigger_phrases:
  - "ai-council agent naming checklist"
  - "agents phase 001 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/001-ai-council-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored ai-council phase docs"
    next_safe_action: "Execute verify-only inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: AI Council Agent Naming Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned BASE and all three runtime agent directories are available for the ai-council inventory
- [ ] CHK-002 [P2] The candidate report records the pinned BASE SHA and rename-map hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are scoped to this verify-only phase; no runtime agent file is edited and all exemptions are honored
- [ ] CHK-004 [P2] No agent content, frontmatter field, TOML key, code identifier, or non-filesystem value is altered
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The inventory records exactly .opencode/agents/ai-council.md, .claude/agents/ai-council.md, and .codex/agents/ai-council.toml
- [ ] CHK-006 [P0] The rename-candidate set is exactly ∅; each of the three basenames is already kebab-case
- [ ] CHK-007 [P0] A missing or unexpected definition path fails the phase instead of being silently omitted
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No rename or reference-rewrite task is created when the verified candidate set is empty
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable behavior or allowlist changed beyond the intended inventory; sandbox and gate posture preserved
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The phase spec, plan, tasks, and zero-candidate evidence use the same component and path set
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Only the assigned phase documentation changes; the runtime agent directories remain unmodified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report records the exact three paths and ∅
rename candidates, and the gate shows no unexpected tracked mutation or runtime file change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and git diff-index --quiet HEAD -- shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
