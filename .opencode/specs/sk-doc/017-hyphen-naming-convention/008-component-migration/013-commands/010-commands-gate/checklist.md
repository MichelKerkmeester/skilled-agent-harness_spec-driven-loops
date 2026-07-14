---
title: "Checklist: commands subtree rollup gate (017 phase 008/013/010)"
description: "Blocking SOL verification contract for all commands child phases, whole-tree kebab-case cleanliness, exemption evidence, and active reference closure."
trigger_phrases:
  - "commands rollup checklist"
  - "commands subtree naming verification"
  - "whole command surface kebab check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored commands rollup checklist"
    next_safe_action: "Run the whole commands naming gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Commands subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the commands subtree. The report pins all nine child verdicts, BASE/candidate SHAs, full inventory count, ownership and exemption hashes, snake_case scan, path/reference results, behavior checks, and scoped diff. This gate cannot create a missing child receipt.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Child checklists 001–009 are present, accepted, and backed by evidence; no child has an unresolved P0/P1 failure.
- [ ] CHK-002 [P0] The merged manifest covers every `.opencode/commands/**` file and directory exactly once and records all child map revisions.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The gate performs no migration, content rewrite, regeneration, or sibling checklist repair.
- [ ] CHK-004 [P0] Every remaining underscore-bearing basename has a policy-backed Python, package, tool-mandated, generated, fixture, or frozen-history disposition; no generic exception is accepted.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The whole `.opencode/commands/**` scan reports zero in-scope snake_case filesystem names outside the exemption ledger.
- [ ] CHK-006 [P0] Every active link, reference, template pointer, manifest input, and command path resolves to a final target; no active old path remains.
- [ ] CHK-007 [P0] Command discovery, relevant command-reference/self-tests, generated/tool-boundary checks, and exact/casefold/NFC collision checks pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P0] The manifest contains the expected direct candidate groups: create 30 assets, deep maintained/legacy rows plus generated boundary, design 15 assets, doctor 16 assets plus special files, memory 4 assets, scripts audit rows, speckit 12 assets, loose roots, and residual rows.
- [ ] CHK-009 [P0] Every child disposition is represented once in the rollup, and every old path occurrence is classified as active, historical, generated, fixture, tool, semantic, or unresolved.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Allowed tools, plugin boundaries, command permissions, runtime roots, generated authority, fixture failure semantics, and executable bits are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P1] The rollup report records child verdicts, final manifest, exemption ledger, path/reference receipts, behavior receipts, and the blocking/pass rationale.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The final scoped diff contains only the authorized migration closure and spec evidence; no scratch, implementation-summary, duplicate-owner, or unrelated command files remain.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the commands subtree only when every P0 check passes, all nine sibling phases are accepted, every non-exempt filesystem basename is kebab-case, active references resolve, and the complete manifest is unique.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains all receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
