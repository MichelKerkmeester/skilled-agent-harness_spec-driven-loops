---
title: "Verification Checklist: Public Redirect And Replacement Context Contracts"
description: "Verification checklist for the phase 002 /deep:context redirect and replacement context snapshot contracts."
trigger_phrases:
  - "deep-context redirect checklist"
  - "replacement context verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 002 redirect"
    next_safe_action: "Begin phase 003 discoverability cleanup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-002-checklist"
      parent_session_id: "2026-07-04-phase-002-contract-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Preserve @context as a replacement option."
      - "Deprecated /deep:context must not claim spec-folder write authority."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Public Redirect And Replacement Context Contracts

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this phase ready until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: phase 002 requirements table]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [EVIDENCE: phase 002 architecture and phases]
- [x] CHK-003 [P1] Dependencies identified. [EVIDENCE: command source authority marked red]
- [x] CHK-004 [P0] `/deep:context` source authority resolved. [EVIDENCE: `.opencode/commands/deep/context.md` exists and `compile-command-contracts.cjs` maps `deep/context` to maintained redirect and replacement sources.]
- [x] CHK-005 [P0] Fresh active-surface grep inventory captured before runtime edits. [EVIDENCE: Grep inventory for `deep_context_auto`, `deep_context_confirm`, `render-command-contract`, and replacement route surfaces.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Authored docs are based on SpecKit templates. [EVIDENCE: `SPECKIT_TEMPLATE_SOURCE` markers]
- [x] CHK-011 [P0] Phase docs contain no placeholders. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts` passed.]
- [x] CHK-012 [P0] Maintained command source contains fail-closed redirect logic. [EVIDENCE: `.opencode/commands/deep/context.md`; `.opencode/commands/deep/assets/legacy/deep_context.body.md`; `.opencode/commands/deep/assets/deep_context_presentation.txt`.]
- [x] CHK-013 [P0] YAML assets cannot dispatch legacy context loop after redirect. [EVIDENCE: Ruby YAML invariant check passed for no-write stubs and `must_not` legacy dispatch guards.]
- [x] CHK-014 [P1] Research/review snapshot contract stays pointer-based and bounded. [EVIDENCE: `deep-research/SKILL.md`, `deep_research_strategy.md`, `deep-review/SKILL.md`, `deep_review_strategy.md`, and `review_mode_contract.yaml`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `/deep:context:auto` behavior verified. [EVIDENCE: `SPECKIT_COMMAND_INJECTION_MODE='deep/context:fix' node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs --command deep/context -- ':auto scope=.opencode/commands/deep'` exited 0.]
- [x] CHK-021 [P0] `/deep:context:confirm` behavior verified. [EVIDENCE: `SPECKIT_COMMAND_INJECTION_MODE='deep/context:fix' node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs --command deep/context -- ':confirm scope=.opencode/commands/deep'` exited 0.]
- [x] CHK-022 [P0] Compiled command contract regenerated from maintained sources. [EVIDENCE: `node .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs --command deep/context --write` rewrote `.opencode/commands/deep/assets/compiled/deep_context.contract.md`; drift check passed.]
- [x] CHK-023 [P1] YAML/script path checks pass for edited deep command assets. [EVIDENCE: `node --check` on compiler/render/drift scripts; Ruby YAML invariant check; OpenCode alignment checks passed.]
- [x] CHK-024 [P0] Phase 002 strict validation passes. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts --strict` passed.]
- [x] CHK-025 [P0] Parent recursive strict validation passes. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities --recursive --strict` passed.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each active standalone context surface is classified before runtime edits. [EVIDENCE: phase 001 inventory plus fresh grep of command assets and replacement route surfaces.]
- [x] CHK-FIX-002 [P0] Same-class command producers are inventoried: command source, legacy body, presentation, auto YAML, confirm YAML, compiled contract. [EVIDENCE: direct reads of all producer files before edits.]
- [x] CHK-FIX-003 [P0] Consumers are inventoried: generated manifest, registry, advisor, agents, docs, fixtures, and benchmarks. [EVIDENCE: phase 001 inventory; phase 003/004 remain explicitly blocked until redirect proof.]
- [x] CHK-FIX-004 [P1] Historical archive preservation rule documented. [EVIDENCE: `spec.md` out-of-scope]
- [x] CHK-FIX-005 [P1] Verification matrix includes auto, confirm, generated contract, research snapshot, and review snapshot rows. [EVIDENCE: checklist Testing and Code Quality sections.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced in docs, command output, YAML, or generated contracts. [EVIDENCE: redirect text contains replacement commands and repo-local source paths only.]
- [x] CHK-031 [P0] Redirect text does not expose local private paths beyond existing command documentation conventions. [EVIDENCE: user-facing redirect text names commands, not absolute local paths.]
- [x] CHK-032 [P1] No auth/authz behavior is in scope. [EVIDENCE: phase scope]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for intended phase 002 work. [EVIDENCE: authored docs]
- [x] CHK-041 [P1] User-facing replacement guidance is synchronized across command presentation and research/review docs. [EVIDENCE: `@context`, `/deep:research`, `/deep:review`, and `/speckit:plan` appear in redirect assets; bounded snapshots appear in research/review docs.]
- [x] CHK-042 [P2] README or quick-reference docs updated if phase 003 does not own the surface. [EVIDENCE: Phase 003 owns README/quick-reference cleanup, so no phase 002 doc update is required.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain unnecessary for phase doc authoring. [EVIDENCE: no scratch files authored]
- [x] CHK-051 [P1] Generated contract files are touched only through regeneration. [EVIDENCE: compiled contract was produced by `compile-command-contracts.cjs --write`, not hand-edited.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 19 | 19/19 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in `decision-record.md`. [EVIDENCE: fail-closed redirect ADR]
- [x] CHK-101 [P1] Decision has status. [EVIDENCE: ADR metadata]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: ADR alternatives]
- [x] CHK-103 [P2] Migration path verified after runtime diff is known. [EVIDENCE: runtime diff leaves `/deep:context` as no-write redirect while phase 003/004 own discoverability and cleanup migration steps.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Replacement snapshot remains bounded and pointer-based. [EVIDENCE: replacement docs require pointer-based snapshots and forbid full source-body inlining.]
- [x] CHK-111 [P1] Redirect path does not run legacy context-loop setup. [EVIDENCE: redirect YAML no-write invariants and rendered contract no-dispatch directive.]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented. [EVIDENCE: `plan.md` rollback]
- [x] CHK-121 [P0] No feature flag required for fail-closed command redirect. [EVIDENCE: phase scope]
- [x] CHK-122 [P1] Restart note prepared for OpenCode command/skill changes. [EVIDENCE: final handoff must include OpenCode restart requirement for command/skill file changes.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Generated-contract source integrity reviewed. [EVIDENCE: `check-contract-drift.cjs --command deep/context` passed after regeneration.]
- [x] CHK-131 [P1] No persisted user data migration occurs. [EVIDENCE: file-level command/docs changes only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All phase 002 docs validate. [EVIDENCE: phase 002 strict validation passed.]
- [x] CHK-141 [P1] Parent recursive validation passes. [EVIDENCE: parent recursive strict validation passed.]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved phased conversion | 2026-07-04 |
| OpenCode assistant | Implementer | Validated | 2026-07-04 |
<!-- /ANCHOR:sign-off -->
