---
title: "Checklist: sk-git skill gate (020 phase 008/012/006)"
description: "Blocking SOL verification contract for the read-only sk-git sibling rollup and whole-surface naming gate."
trigger_phrases:
  - "sk-git skill gate checklist"
  - "020 sk-git rollup verification"
  - "whole surface naming gate acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the sk-git rollup gate"
    next_safe_action: "Run the read-only rollup after sibling phases are accepted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/"
      - "../001-references/checklist.md"
      - "../002-assets/checklist.md"
      - "../003-manual-testing-playbook/checklist.md"
      - "../004-benchmark/checklist.md"
      - "../005-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. The verifier pins the candidate SHA, BASE SHA, sibling evidence hashes, aggregate counts, and naming-scan output, records read-only commands and exit codes, and fails on any sibling blocker, unclassified path, stale pointer, or gate mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Sibling phases 001 through 005 have passing P0 contracts, pinned reports, matching map hashes/counts, and no stray implementation-summary.md or scratch/ in their leaves.
- [ ] CHK-002 [P0] The candidate and BASE SHAs are pinned and the complete tracked .opencode/skills/sk-git path inventory is captured.
- [ ] CHK-003 [P1] The 020 exemption boundary and each excluded surface are recorded before the all-path scan.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Aggregate evidence reconciles the nine reference, three asset, 49 manual-playbook, and two benchmark-profile dispositions without unknown or duplicate entries.
- [ ] CHK-005 [P0] Every underscore path found by the full scan is classified as an allowed Python/package/tool-mandated/frozen exemption or the gate fails.
- [ ] CHK-006 [P1] The gate does not alter code, keys, fields, changelog content, version values, or any tracked file.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The full tracked-path scan finds zero in-scope snake_case directories or files outside the 020 exemption set.
- [ ] CHK-008 [P0] Active path resolution finds zero stale source pointers and zero source/target duplicate roots or files.
- [ ] CHK-009 [P0] Changelog/v1.3.2.0.md, SKILL.md, and README.md expose consistent version and scope evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] Every sibling acceptance row, map hash, count, and no-mutation proof is cited in the rollup report.
- [ ] CHK-011 [P1] The scan covers the full skill surface, including feature-catalog, scripts, changelog, benchmark, root files, and all four assigned migration leaves.
- [ ] CHK-012 [P1] Any failure is routed to its owning sibling phase with an exact path and evidence; the gate does not repair findings.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P2] No secret, access policy, executable behavior, release credential, or remote state changed during the read-only gate.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree that phase 006 is a read-only rollup gate.
- [ ] CHK-015 [P2] The phase outcome is linked from the parent map and the 020 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] The gate runs against a pinned candidate and leaves git status/diff unchanged.
- [ ] CHK-017 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all sibling P0 contracts pass, the aggregate evidence reconciles, the complete sk-git scan is zero-clean outside exemptions, active pointers and version evidence are closed, and the gate made no mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms sibling completion, aggregate map parity, full-surface naming cleanliness, pointer/version closure, exemption accuracy, and zero gate mutation.
<!-- /ANCHOR:sign-off -->
