---
title: "Checklist: P0 Fixes"
description: "Verification checklist for remediation phase 1."
trigger_phrases:
  - "028 drift remediation"
  - "checklist: p0 fixes"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded checklist for phase 1"
    next_safe_action: "Verify each finding"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: P0 Fixes

<!-- ANCHOR:protocol -->
## Protocol
Mark an item done only after opus re-reads the file and confirms the cited evidence is resolved (or records a false-positive in the ledger).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Ledger entries for 001-p0-fixes loaded
- [ ] Cited files present
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Edits minimal and scoped to cited drift
- [ ] Comment hygiene respected (no artifact-ids/spec paths in code comments)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Affected tests/validators re-run where a finding touches code or a test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets or scope-violating changes introduced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] F001 `.opencode/commands/doctor/_routes.yaml` /doctor code-graph route declares read-only but advertises mutating operations
- [ ] F002 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/graph-metadata.json` Phase parent 005 carries full Level 3 heavy-doc stack + missing migrated flag
- [ ] F003 `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` Causal-graph doctor mutation boundaries invert the canonical DB path
- [ ] F004 `.codex/agents/ai-council.toml` ai-council agent re-pinned to gpt-5.4 after cli-codex gpt-5.5 lock
- [ ] F005 `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` Fallback router type expects model-level quota_pool that does not exist
- [ ] F006 `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` Fallback router tests exercise stale cli-devin registry
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] No files created or moved outside the cited targets
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary
- [ ] All 6 findings terminal in the ledger
<!-- /ANCHOR:summary -->
