---
title: "Checklist: mcp-tooling benchmark naming closure (020 phase 006)"
description: "Blocking SOL verifier contract for the benchmark boundary naming phase."
trigger_phrases:
  - "mcp-tooling benchmark checklist"
  - "benchmark artifact verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 006 SOL verifier contract"
    next_safe_action: "Verify the benchmark zero-candidate condition"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/benchmark/"
      - ".opencode/skills/mcp-tooling/benchmark/.gitkeep"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling Benchmark Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the benchmark scan
- [ ] CHK-002 [P2] The report proves whether benchmark/ contains only .gitkeep and records the visible artifact count
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to benchmark artifacts and their path consumers; no speculative fixture/profile/storage-guide is added
- [ ] CHK-004 [P2] .gitkeep, data keys, scenario IDs, frontmatter fields, generated output, and lockfiles remain unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every discovered benchmark candidate is classified exactly once, or the report records the current zero-candidate condition
- [ ] CHK-006 [P0] No in-scope snake_case filesystem name remains under benchmark/
- [ ] CHK-007 [P0] Every affected benchmark loader, documentation path, and path-valued metadata reference resolves
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The artifact map covers all discovered fixture/profile/storage-guide/support paths and all references to moved paths
- [ ] CHK-009 [P1] The post-change inventory still contains .gitkeep and no invented benchmark content
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No benchmark execution command, credential handling, generated-output policy, or sandbox boundary changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Benchmark navigation documents the zero-candidate baseline or the exact discovered artifact closure
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Any artifact rename is path-scoped and reversible; verification leaves git diff-index --quiet HEAD -- clean
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when the benchmark inventory is honest, all P0 checks pass, .gitkeep is preserved, affected references resolve, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and no speculative benchmark surface was introduced.
<!-- /ANCHOR:sign-off -->
