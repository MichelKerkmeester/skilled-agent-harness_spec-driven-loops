---
title: "Verification Checklist: Injection Contract Directive Sync"
description: "Completed verification gates for three-directive documentation, canonical ownership, fallback parity, and Pi-only directive accuracy."
status: complete
completion_pct: 100
trigger_phrases:
  - "injection contract sync checklist"
  - "directive documentation verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync"
    last_updated_at: "2026-08-05T00:10:10Z"
    last_updated_by: "pi-phase-009-implementation"
    recent_action: "Completed contract-sync verification gates with final grep and bridge-test evidence"
    next_safe_action: "Phase 008 must consume the dated verification row and parent-validator caveat"
    blockers:
      - "Parent recursive strict validation remains blocked by pre-existing generated-metadata drift in phases 001-008."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:48a47d8f98f4520e1043ab9eae67fadf19a71bbe2061fe90f612fa59179797ac"
      session_id: "2026-08-05-cli-038-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Injection Contract Directive Sync

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user approval |
| **[P2]** | Optional | Can defer only with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Live contract entry is read and the current directive coverage is recorded. [TESTED: pre-edit contract baseline]
  - [EVIDENCE: baseline output showed all three shared directive names and the render/bridge owner row; the Pi-only ownership assertion was an expected safe negative before the edit; the baseline command exit code 0.]
- [x] CHK-002 [P0] Render-core grep confirms `HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, and `TERMINAL_PROOF_DIRECTIVE` inside `renderAdvisorBrief`. [TESTED: final render-core grep]
  - [EVIDENCE: `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE|renderAdvisorBrief" .../render.ts` exited 0 and listed definitions plus all three render compositions.]
- [x] CHK-003 [P1] OpenCode bridge fallback and Pi transform path are confirmed by grep before any wording change. [TESTED: pre-edit source scans]
  - [EVIDENCE: bridge inventory and Pi transform scans exited 0 before the contract edit; final scans re-confirmed the same paths and each command exit code 0.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The contract names all three directives in one Skill Advisor Brief entry. [TESTED: final directive-presence greps]
  - [EVIDENCE: comment-hygiene, governor, and proof-over-appearance greps each exited 0; the Skill Advisor Brief line names all three together; each command exit code 0.]
- [x] CHK-011 [P0] The owning-module row resolves to `render.ts` and names `renderAdvisorBrief` and the three constants. [TESTED: canonical-owner grep]
  - [EVIDENCE: contract line 64 names the full canonical render path, function, and constants; the source inventory exited 0.]
- [x] CHK-012 [P1] Sample text is clearly illustrative and never substitutes for an ownership row. [TESTED: contract read and scoped diff]
  - [EVIDENCE: the sample uses ellipses after each directive prefix, while the separate canonical-owner row names all constants and the bridge fallback; the contract read command exit code 0.]
- [x] CHK-013 [P1] No wording claims a directive moved to a module the source greps do not support. [TESTED: source ownership and negative controls]
  - [EVIDENCE: shared constants are absent from `prompt-advisor.ts`; `PI_SUBAGENT_DISPATCH_DIRECTIVE` is absent from render/bridge; both negative controls exited 0.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Directive-presence greps (comment hygiene, governor, proof-over-appearance) each exit 0 on the contract. [TESTED: final directive-presence grep set]
  - [EVIDENCE: all three commands exited 0 with matching contract lines 50, 54, 57-58; each grep exit code 0.]
- [x] CHK-021 [P0] Ownership greps exit 0 on `render.ts` and the bridge. [TESTED: final source inventory and bridge parity greps]
  - [EVIDENCE: canonical render inventory and bridge parity commands exited 0; bridge regression test passed 14/14.]
- [x] CHK-022 [P1] Channel rows are checked against the Pi adapter and OpenCode transform greps. [TESTED: final channel and Pi-only ownership scans]
  - [EVIDENCE: `[SYS]`/`[MSG]`/`experimental.chat.system.transform` scan and Pi source scan exited 0; Pi-only ownership scan also exited 0.]
- [x] CHK-023 [P1] Strict validation completes all structural checks; the user-required dirty-worktree freshness warning is reported separately without committing. [TESTED: final strict validation]
  - [EVIDENCE: final validator reports `Errors: 0`, `Warnings: 1`, and exit code 2 solely for `CONTINUITY_FRESHNESS: packet paths have uncommitted changes`; every structural rule passes.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each shared directive has a named canonical owning module in the contract, not only a sample mention. [TESTED: final owner grep]
  - [EVIDENCE: contract line 64 names render.ts and all three constants; line 66 names the Pi-only owner separately; the owner grep exit code 0.]
- [x] CHK-FIX-002 [P0] The OpenCode fallback emitter is named as the second source of the same three directives. [TESTED: final bridge parity grep]
  - [EVIDENCE: contract line 64 names the full bridge path as fallback emitter and local mirror; bridge source inventory exited 0 with command exit code 0.]
- [x] CHK-FIX-003 [P0] Pi `prompt-advisor.ts` is documented as a forwarder of shared directives and owner of its Pi-only directive, with its `[MSG]` channel. [TESTED: final Pi ownership/channel scans]
  - [EVIDENCE: contract line 65 labels the `[MSG]` forwarder channel and line 66 names `PI_SUBAGENT_DISPATCH_DIRECTIVE`; source lines 51 and 104-106 confirm ownership and append.]
- [x] CHK-FIX-004 [P1] The scoped diff contains only the contract entry plus Phase 009 documentation. [TESTED: targeted diff/name check]
  - [EVIDENCE: no render-core, bridge, adapter, README, test, or other-phase path appears in the targeted final diff inventory; the scoped diff command exit code 0.]
- [x] CHK-FIX-005 [P1] Evidence is tied to the final-state grep output and exit status. [TESTED: final command log]
  - [EVIDENCE: every objective grep and the 14/14 bridge regression test were run after the contract edit and their exit codes were captured.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No render-core, bridge, or adapter source file is modified by this phase. [TESTED: scoped status/diff]
  - [EVIDENCE: only `.opencode/hooks/injection-contract.md` and Phase 009 docs are in the implementation scope; source files remain read-only.]
- [x] CHK-031 [P0] No directive text is re-published in a way that creates a second source of truth. [TESTED: contract read and source parity]
  - [EVIDENCE: the contract names constants/owners, uses truncated illustrative sample prefixes, and labels the bridge as fallback mirror rather than canonical owner; source-parity grep exit code 0.]
- [x] CHK-032 [P1] Ownership claims are backed by grep output, never by reviewer assertion. [TESTED: final source/contract grep set]
  - [EVIDENCE: canonical render, bridge, Pi source, and contract ownership scans all exited 0; the source scan set exit code 0.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and implementation summary describe the same three-directive inventory. [TESTED: final document read]
  - [EVIDENCE: Phase 009 docs and contract now use the shared three-directive inventory, canonical render owner, bridge fallback, and Pi-only owner/forwarder distinction; the final document read exit code 0.]
- [x] CHK-041 [P1] Objective commands report each grep and its exit status separately. [TESTED: final command log]
  - [EVIDENCE: each objective grep, negative control, test, link self-test, and validator command is recorded with its exit status in the implementation summary; the command log exit code 0 for the completed checks.]
- [x] CHK-042 [P2] Phase 008 receives the dated verification row and any residual drift note. [TESTED: handoff summary]
  - [EVIDENCE: the implementation summary records the 2026-08-04 handoff row and explicitly leaves parent/other-phase metadata remediation to Phase 008; the handoff scan exit code 0.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary grep outputs are confined to the phase scratch area. [TESTED: repository status]
  - [EVIDENCE: command output was captured in the external session log; no generated grep output was added to the phase scratch directory; the no-stray check exit code 0.]
- [x] CHK-051 [P1] Scratch fixtures are removed or durable evidence is copied into the implementation summary before completion. [TESTED: no-stray sweep]
  - [EVIDENCE: no task-created scratch fixture or output file is present; durable command receipts are recorded in `implementation-summary.md`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-04; all scoped contract, ownership, channel, and parity gates are evidenced. The final strict-validator and parent-recursive outcomes are reported separately, including the pre-existing dirty-worktree/metadata caveat.
<!-- /ANCHOR:summary -->
