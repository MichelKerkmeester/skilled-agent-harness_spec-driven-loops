---
title: "Checklist: loose command ID naming (017 phase 008/013/008)"
description: "Blocking SOL verification contract for root command filename classification, public ID preservation, and approved path closure."
trigger_phrases:
  - "loose command ID checklist"
  - "root command filename verification"
  - "command ID preservation verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored loose command checklist"
    next_safe_action: "Verify root command ID dispositions"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Loose command ID naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the loose-command child. The report pins candidate SHA, BASE SHA, two candidate rows, one compliant control row, loader evidence, consumer inventory, exact-ID outcomes, plugin tests, and path-scoped diff. An unresolved filename/ID contract is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the root-command handoff, filename/ID/tool-path matrix, and loader contract evidence.
- [ ] CHK-002 [P2] The report records the pre-change root-file count, BASE SHA, candidate SHA, and disposition-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to approved root-command paths and their proven README, install-guide, loader, and plugin-test consumers.
- [ ] CHK-004 [P0] No public command ID, plugin tool name, frontmatter field, data key, generated output, historical evidence, or tool-mandated basename changed without an explicit disposition.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Root command discovery finds every approved target and no missing source; preserved public IDs `/agent_router` and `/goal_opencode` remain addressable.
- [ ] CHK-006 [P0] Goal plugin capability and tool-path tests pass against the final physical path or documented exemption.
- [ ] CHK-007 [P0] Approved targets pass exact/casefold/NFC collision checks and every updated active path resolves.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every occurrence is classified as physical path, public ID, tool contract, historical text, generated output, or other documented exemption.
- [ ] CHK-009 [P1] No active old physical path remains for an approved rename, and every preserved underscore name has contract evidence.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Allowed tools, plugin boundaries, goal-state ownership, sandbox assumptions, and executable bits are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] README, install-guide, plugin-test, and phase evidence distinguish final filesystem names from stable public IDs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Any approved root moves and path rewrites land as one dependency-closed batch with no scratch, implementation-summary, or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when both candidate dispositions are evidence-backed, exact command IDs and plugin flows pass, active paths resolve, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains all receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
