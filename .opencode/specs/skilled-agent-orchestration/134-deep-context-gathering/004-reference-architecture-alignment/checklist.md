---
title: "Verification Checklist: deep-context reference-architecture alignment"
description: "Verification Date: pending (reference work executes in a separate pass)"
trigger_phrases:
  - "reference alignment checklist"
  - "smart router rewrite verification"
  - "citation completeness check"
  - "verification"
  - "checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/004-reference-architecture-alignment"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 checklist for the reference-architecture-alignment phase"
    next_safe_action: "Execute the reference move + 8 new refs + router rewrite + citation sweep"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Verification items defined for the move + 8 refs + router rewrite + citation sweep"
      - "Citation-completeness (zero old-flat-path) is a P0 gate"
---
# Verification Checklist: deep-context reference-architecture alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (move + 8 references + canonical router rewrite + citation sweep)
- [ ] CHK-003 [P1] Dependencies identified and available (deep-research layout, sk-doc validators, runtime source surface, advisor graph)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] sk-doc structure validator passes on every new reference and on the rewritten `SKILL.md`
- [ ] CHK-011 [P0] Router resolves every `RESOURCE_MAP` path against the new inventory (no missing resource)
- [ ] CHK-012 [P1] `INTENT_SIGNALS` use the canonical `{weight, keywords}` shape; `LOADING_LEVELS` sets `ALWAYS = references/guides/quick_reference.md` and an `ON_DEMAND` set; `UNKNOWN_FALLBACK_CHECKLIST` retained
- [ ] CHK-013 [P1] Reference move is content-preserving (in-file headings/anchors unchanged; only the path prefix shifts)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Reference move verified: `references/convergence/convergence.md` and `references/protocol/loop_protocol.md` exist; no root-level reference file remains
- [ ] CHK-021 [P0] Eight new references exist under `convergence/`, `state/`, and `guides/`, each extracted from the loop YAML / scripts / runtime
- [ ] CHK-022 [P0] Citation-completeness verified: `rg "references/convergence\.md|references/loop_protocol\.md"` returns zero in the deep-context sweep scope
- [ ] CHK-023 [P0] `deep-loop-runtime` vitest regression suite green (loop behavior unchanged; no `.cjs`/runtime edited)
- [ ] CHK-024 [P1] README structure updated (reference count, structure tree, reference-table paths all show the subfoldered layout)
- [ ] CHK-025 [P1] Skill advisor resolves deep-context with the new reference paths after reindex
- [ ] CHK-026 [P1] Edge cases handled (in-file anchor references stay valid; the router `ON_DEMAND` lists only references that exist)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable change has a class: the moves and new references are `documentation`; the SKILL.md §2 rewrite is `routing`; the sweep is `path-citation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "references/convergence\.md|references/loop_protocol\.md" .opencode/skills/deep-context .opencode/commands/deep .opencode/agents/deep-context.md` (all citation sites enumerated, ~62 hits).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed paths: router `RESOURCE_MAP`, README structure tree, workflow `references_map`, and every `feature_catalog`/`manual_testing_playbook` cross-link.
- [ ] CHK-FIX-004 [P0] Adversarial cases covered: a missed citation (zero-hit grep gate), a reference duplicating the feature_catalog (no-duplication review), a router path resolving to a missing file (path-resolution check).
- [ ] CHK-FIX-005 [P1] Matrix axes listed (reference {moved x new} x surface {skill docs | command docs | workflow YAML | agent doc | metadata}) in plan.md affected-surfaces.
- [ ] CHK-FIX-006 [P1] Behavior-invariant variant executed: no `.cjs`/runtime file edited; the move is content-preserving and the sweep is path-only; vitest regression suite stays green.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the implemented state: `find references -type f` shows the subfoldered layout and the grep gate returns zero.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (the references, router rewrite, and citation sweep add none)
- [ ] CHK-031 [P0] Router path guard preserved (`_guard_in_skill` keeps only in-skill markdown routable; no path-traversal surface added)
- [ ] CHK-032 [P1] No new MCP tools or runtime capability introduced (documentation-and-routing only; runtime isolation upheld)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/decision-record/implementation-summary synchronized (completion metadata reconciled at close)
- [ ] CHK-041 [P1] Each new reference cross-links its `feature_catalog/0N` counterpart and carries no copied implementation prose (ADR-003)
- [ ] CHK-042 [P2] README "How This Compares" and reference navigation reflect the subfoldered layout
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files in the spec folder or the skill `references/` tree
- [ ] CHK-051 [P1] `references/` matches deep-research's subfolder shape (`convergence/` 4 files, `protocol/` 1, `state/` 4, `guides/` 1) with no root-level reference file
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 16 | 0/16 |
| P2 Items | 4 | 0/4 |

**Verification Date**: pending (reference work executes in a separate pass; spec/plan/tasks/checklist/decision-record authored now, evidence lands after)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-003)
- [ ] CHK-101 [P1] All ADRs have status (all Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (each ADR has an Alternatives table)
- [ ] CHK-103 [P2] Layout-mirror rationale documented (deep-research over deep-ai-council; ADR-002)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Router `ALWAYS` baseline is a single lean `quick_reference.md` load; the full reference set is `ON_DEMAND` (NFR-P01)
- [ ] CHK-111 [P1] New references are lean (contract-level summary + cross-link), not full copies of the feature_catalog
- [ ] CHK-112 [P2] A routine invocation reads one small file rather than the whole reference set
- [ ] CHK-113 [P2] Citation sweep is path-only (no content rewrite of consumers beyond the reference path)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (move files back, delete new references, revert router/README/sweep, regenerate metadata; no `.cjs`/runtime changed)
- [ ] CHK-121 [P0] Loop behavior unchanged (no runtime helper or `.cjs` edited; vitest regression suite green)
- [ ] CHK-122 [P1] Skill graph + advisor regenerated and resolving the new reference paths
- [ ] CHK-123 [P1] Citation graph internally consistent (every consumer points at the moved/new location)
- [ ] CHK-124 [P2] Workflow YAML `references_map` paths reviewed and resolving
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Sibling parity honored: layout mirrors deep-research; no root-level reference file remains
- [ ] CHK-131 [P1] sk-doc smart-router resilience template followed (runtime discovery, weighted intent scoring, guarded loading, multi-tier fallback)
- [ ] CHK-132 [P2] No feature_catalog content duplicated into the new references (single source of implementation truth)
- [ ] CHK-133 [P2] No ephemeral tracking labels embedded in any edited file's code/comments (documentation paths in spec docs are exempt)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (completion metadata reconciled at close)
- [ ] CHK-141 [P1] Lean + cross-link rule documented (decision-record.md ADR-003)
- [ ] CHK-142 [P2] Scope exclusions documented (deep-research-only extras `convergence_reference_only.md`, `capability_matrix.md`, `spec_check_protocol.md` not authored; spec.md Out of Scope)
- [ ] CHK-143 [P2] Phase-parent doc map updated to reflect 004 status (../spec.md / ../context-index.md)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| deep-context owner | Technical Lead | [ ] Pending | - |
| deep-loop maintainer | Runtime Owner | [ ] Pending | - |
| QA | QA Lead | [ ] Pending | - |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
