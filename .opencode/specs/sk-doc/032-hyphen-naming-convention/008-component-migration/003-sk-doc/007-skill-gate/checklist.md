---
title: "Checklist: sk-doc subtree rollup gate"
description: "Blocking SOL verifier contract for the sk-doc sibling evidence and whole-surface naming gate."
trigger_phrases:
  - "sk-doc skill gate checklist"
  - "sk-doc naming rollup verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-doc rollup gate checklist"
    next_safe_action: "Run the read-only subtree gate"
    blockers: []
    key_files: [".opencode/skills/sk-doc/", "../003-create-packets/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. The report pins BASE, candidate SHA, aggregate evidence hash, and final census hash, records every child result and command exit code, and fails on any missing/failed leaf, unknown path, in-scope snake_case residue, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Direct leaves 001, 002, 004, 005, 006 and nested leaves 001-011 have reports/checklists available.
- [ ] CHK-002 [P0] BASE, aggregate evidence hash, final census command, and 001 exemption set are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Every sibling report proves its own scope and no sibling phase has an unexpected adjacent edit.
- [ ] CHK-004 [P0] Exemption rows identify Python `.py`, Python package directories, tool-mandated names, keys, and frozen surfaces concretely.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every executable sibling checklist passes, including all eleven create-packet leaves and the changelog verification.
- [ ] CHK-006 [P0] Root benchmark and create-diff zero-row evidence is present and pinned to their baselines.
- [ ] CHK-007 [P0] Whole `.opencode/skills/sk-doc` census reports zero in-scope snake_case names and zero unknown classifications.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Aggregate rename/reference maps cover every discovered candidate exactly once and no stale live path remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] The gate performs no repair and no executable permission, allowlist, or sandbox boundary changes.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Parent maps, leaf docs, changelog evidence, and the aggregate evidence matrix agree on scope and status.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Gate output is read-only evidence; no implementation-summary or scratch artifact remains in any assigned leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree passes only when every child is green, zero-row phases are evidenced, the whole naming census is clean under the exemptions, and the gate itself has made no migration change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires the aggregate child receipts, final census hash, changelog/version evidence, and a clean documentation-only gate diff.
<!-- /ANCHOR:sign-off -->
