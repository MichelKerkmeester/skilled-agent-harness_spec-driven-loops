---
title: "Checklist: Config, checkpoints, vectors, and constitutional verification (032 subtree 008 phase 010)"
description: "This verify-only phase audits the runtime agent directories and adjacent system-spec-kit config, checkpoint, vector, and constitutional surfaces for permitted snake_case filesystem names. The pinned inventory has zero rename candidates in the three runtime agent directories; generated/vector/checkpoint artifacts and tool-mandated names retain their exempt disposition."
trigger_phrases:
  - "system-spec-kit agent directory naming audit"
  - "config checkpoints vectors constitutional verify"
  - "zero agent rename candidates"
  - "system-spec-kit phase 010"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/010-config-checkpoints-vectors-constitutional-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored zero-candidate checklist"
    next_safe_action: "Repeat the scoped zero-candidate scan against the pinned BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Config, checkpoints, vectors, and constitutional verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 010. The verifier records BASE SHA, exact scan roots, commands, exit codes, candidate counts, and exemption-ledger evidence before accepting the verify-only phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE and all three runtime agent roots are pinned.
- [ ] CHK-002 [P0] Adjacent config, checkpoint, vector, constitutional, and runtime roots are listed.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/` each have an explicit zero-candidate result.
- [ ] CHK-004 [P1] The report distinguishes authored names from generated/vector/checkpoint and tool-mandated names.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The three runtime agent directory scans report zero permitted rename candidates.
- [ ] CHK-006 [P0] Every adjacent underscore-bearing name has a documented exemption or candidate disposition.
- [ ] CHK-007 [P0] The audited runtime surfaces have no non-documentation diff.
- [ ] CHK-008 [P1] The evidence is reproducible against the pinned BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P0] No agent-directory rename candidate is omitted behind an incomplete glob.
- [ ] CHK-010 [P1] No generated, vector, checkpoint, Python, package, or tool-mandated name is incorrectly proposed for rename.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Agent/config/runtime boundaries and generated artifact handling are not broadened by the scan.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The explicit zero-candidate fact and exemption ledger are retained for the changelog and subtree gate.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] This phase changes only its assigned documentation files; no audited surface is modified.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when each runtime agent root independently proves zero candidates, adjacent artifacts have complete dispositions, and the verify-only boundary is evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier records the zero-candidate result for all three agent directories and no unknown support path remains.
<!-- /ANCHOR:sign-off -->

