---
title: "Checklist: active specs and documents (032 phase 007 child 004)"
description: "Blocking SOL verifier contract for active spec/document names: active-versus-generated classification, structural phase-folder protection, link and continuity closure, strict validation, and downstream handoff."
trigger_phrases:
  - "active spec document closure checklist"
  - "spec document naming verifier"
  - "phase 007 child 004 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the active spec/document SOL verifier contract"
    next_safe_action: "Run the checklist against the candidate active-document closure commit"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/system-code-graph/"
      - ".opencode/specs/system-deep-loop/"
      - ".opencode/specs/system-speckit/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Strict validation is a future execution gate; this authoring pass does not run it"
---
# Checklist: Active Specs and Documents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 004. The verifier pins candidate SHA, BASE SHA, and map hash; records active-packet, document, link, and validation counts with command exit codes; and fails on a zero-file scan, an unclassified path, broken link, missing required doc, stale continuity pointer, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate worktree, phase 006 map hash, and phase 005 checker receipt are recorded
- [ ] CHK-002 [P0] The active spec census distinguishes authored packets from archives, changelogs, generated state, research/review outputs, and scratch
- [ ] CHK-003 [P0] Numeric phase-folder forms matching `^[0-9]{3}-[a-z0-9-]+$` are recorded as compliant and excluded from rename candidates
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every active candidate has one classification and one semantic target or exemption reason
- [ ] CHK-005 [P1] Only filesystem names and path-derived values changed; frontmatter fields, data keys, code identifiers, and generated state did not
- [ ] CHK-006 [P1] Symlink/shared-script edges are recorded for children 002/003 and not partially changed in this closure
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] A positive/negative structural fixture accepts a compliant three-digit hyphenated phase folder and rejects a fresh in-scope snake_case document name
- [ ] CHK-008 [P0] Markdown links, relative references, `_memory.continuity.packet_pointer` values, and other path-valued frontmatter resolve with zero stale source paths
- [ ] CHK-009 [P0] Every touched packet passes `validate.sh --strict` with the required Level 2/3 docs and anchors present
- [ ] CHK-010 [P0] Archives, changelogs, completed history, generated research/review state, scratch output, Python names, tool-mandated names, and data keys retain approved dispositions
- [ ] CHK-011 [P1] The active packet/document scan and validation scan are non-zero and their counts are recorded against BASE
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] The handoff lists every touched packet, changed path, link evidence, strict-validation receipt, and downstream dependency
- [ ] CHK-013 [P1] No packet is handed off with a missing required doc, stale metadata pointer, or unresolved cross-closure edge
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P2] No tool-owned path, generated state boundary, archive, or workflow authority changed through a document-name rewrite
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P2] The classification ledger, link report, packet validation receipts, and handoff are linked from the phase evidence
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Each packet/document closure lands in a dependency-closed, path-scoped commit with no partial continuity or link update
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child passes only when every P0 item is green, active packets remain structurally valid, compliant phase folders and excluded surfaces are protected, all changed paths resolve, and phase 008 receives complete packet-level evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the active spec/document contract and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
