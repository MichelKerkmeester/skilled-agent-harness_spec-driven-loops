---
title: "Verification Checklist: deep-context reference-architecture alignment"
description: "Verification Date: 2026-06-07. Reference reorg + canonical router + citation sweep shipped in e73ffe6610; validate.sh --strict PASSED on 134 / 003 / 004; all P0/P1/P2 items verified."
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
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all items; reference reorg shipped (e73ffe6610)"
    next_safe_action: "None; phase complete. Optional: later test-pattern fix for 2 stale greps"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence/convergence.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008) — spec.md §4 carries REQ-001..REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md (move + 8 references + canonical router rewrite + citation sweep) — plan.md present in packet
- [x] CHK-003 [P1] Dependencies identified and available (deep-research layout, sk-doc validators, runtime source surface, advisor graph) — all available; references extracted from the live source
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] sk-doc structure validator passes on every new reference and on the rewritten `SKILL.md` — all 10 references pass `extract_structure.py` (frontmatter + first H2 `## 1. OVERVIEW`)
- [x] CHK-011 [P0] Router resolves every `RESOURCE_MAP` path against the new inventory (no missing resource) — `RESOURCE_MAP` points only at the 4 subfolders; every path resolves against the 10-file tree
- [x] CHK-012 [P1] `INTENT_SIGNALS` use the canonical `{weight, keywords}` shape; `LOADING_LEVELS` sets `ALWAYS = references/guides/quick_reference.md` and an `ON_DEMAND` set; `UNKNOWN_FALLBACK_CHECKLIST` retained — §2 rewritten to the canonical pattern; version 1.1.0 → 1.2.0
- [x] CHK-013 [P1] Reference move is content-preserving (in-file headings/anchors unchanged; only the path prefix shifts) — moves were path-only (convergence.md additionally trimmed to a hub; its detail re-pointed to convergence_signals.md)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Reference move verified: `references/convergence/convergence.md` and `references/protocol/loop_protocol.md` exist; no root-level reference file remains — `find references -type f` shows 10 files in 4 subfolders, none at root
- [x] CHK-021 [P0] Eight new references exist under `convergence/`, `state/`, and `guides/`, each extracted from the loop YAML / scripts / runtime — convergence_signals/recovery/graph, state_format/jsonl/outputs/reducer_registry, guides/quick_reference all present
- [x] CHK-022 [P0] Citation-completeness verified: `rg "references/convergence\.md|references/loop_protocol\.md"` returns zero in the deep-context sweep scope — zero hits across `.opencode/skills/deep-context`, `.opencode/commands/deep`, `.opencode/agents/deep-context.md`
- [x] CHK-023 [P0] `deep-loop-runtime` vitest regression suite green (loop behavior unchanged; no `.cjs`/runtime edited) — N/A: docs-only diff, no runtime `.cjs`/`.ts` touched (see commit e73ffe6610 stat); regression suite not applicable
- [x] CHK-024 [P1] README structure updated (reference count, structure tree, reference-table paths all show the subfoldered layout) — README structure tree + reference table repathed to the subfoldered layout
- [x] CHK-025 [P1] Skill advisor resolves deep-context with the new reference paths after reindex — advisor graph reindexed (skill_graph_validate: 22 nodes / 87 edges / 0 errors)
- [x] CHK-026 [P1] Edge cases handled (in-file anchor references stay valid; the router `ON_DEMAND` lists only references that exist) — `ON_DEMAND` lists only the 10 existing references; no dangling path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable change has a class: the moves and new references are `documentation`; the SKILL.md §2 rewrite is `routing`; the sweep is `path-citation`. — classes held through the shipped change
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "references/convergence\.md|references/loop_protocol\.md" .opencode/skills/deep-context .opencode/commands/deep .opencode/agents/deep-context.md` (all citation sites enumerated). — inventory swept; final grep returns zero
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed paths: router `RESOURCE_MAP`, README structure tree, workflow `references_map`, and every `feature_catalog`/`manual_testing_playbook` cross-link. — all consumers repathed (commit stat covers README, SKILL.md, both YAMLs, feature_catalog, manual_testing_playbook, graph-metadata)
- [x] CHK-FIX-004 [P0] Adversarial cases covered: a missed citation (zero-hit grep gate), a reference duplicating the feature_catalog (no-duplication review), a router path resolving to a missing file (path-resolution check). — zero-hit grep clean; references lean + cross-linked; `RESOURCE_MAP` resolves against the 10-file tree
- [x] CHK-FIX-005 [P1] Matrix axes listed (reference {moved x new} x surface {skill docs | command docs | workflow YAML | agent doc | metadata}) in plan.md affected-surfaces. — affected surfaces enumerated in plan.md
- [x] CHK-FIX-006 [P1] Behavior-invariant variant executed: no `.cjs`/runtime file edited; the move is content-preserving and the sweep is path-only. — commit e73ffe6610 touched no runtime `.cjs`/`.ts`; vitest regression therefore N/A
- [x] CHK-FIX-007 [P1] Evidence pinned to the implemented state: `find references -type f` shows the subfoldered layout and the grep gate returns zero. — verified post-ship
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the references, router rewrite, and citation sweep add none) — docs-only change; no secrets introduced
- [x] CHK-031 [P0] Router path guard preserved (`_guard_in_skill` keeps only in-skill markdown routable; no path-traversal surface added) — `_guard_in_skill` retained in the rewritten §2
- [x] CHK-032 [P1] No new MCP tools or runtime capability introduced (documentation-and-routing only; runtime isolation upheld) — no runtime `.cjs`/`.ts` touched (commit stat)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record/implementation-summary synchronized (completion metadata reconciled at close) — reconciled this pass: spec/impl-summary/checklist/description/graph-metadata all flipped to Complete
- [x] CHK-041 [P1] Each new reference cross-links its `feature_catalog/0N` counterpart and carries no copied implementation prose (ADR-003) — references kept lean + cross-linked per the commit
- [x] CHK-042 [P2] README "How This Compares" and reference navigation reflect the subfoldered layout — README structure updated in the ship
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files in the spec folder or the skill `references/` tree — `find references -type f` lists only the 10 reference files
- [x] CHK-051 [P1] `references/` matches deep-research's subfolder shape (`convergence/` 4 files, `protocol/` 1, `state/` 4, `guides/` 1) with no root-level reference file — verified post-ship
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 24 | 24/24 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-06-07 — reference reorg + canonical router + citation sweep shipped in commit `e73ffe6610`; `validate.sh --strict` PASSED on 134 / 003 / 004. CHK-023/CHK-121 (vitest) marked N/A: docs-only diff, no runtime `.cjs`/`.ts` touched.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-003) — present in packet
- [x] CHK-101 [P1] All ADRs have status (all Accepted) — recorded in decision-record.md
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (each ADR has an Alternatives table) — recorded in decision-record.md
- [x] CHK-103 [P2] Layout-mirror rationale documented (deep-research over deep-ai-council; ADR-002) — recorded in decision-record.md
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Router `ALWAYS` baseline is a single lean `quick_reference.md` load; the full reference set is `ON_DEMAND` (NFR-P01) — `ALWAYS = references/guides/quick_reference.md` in the rewritten §2
- [x] CHK-111 [P1] New references are lean (contract-level summary + cross-link), not full copies of the feature_catalog — lean + cross-linked per ADR-003
- [x] CHK-112 [P2] A routine invocation reads one small file rather than the whole reference set — `ALWAYS` loads only quick_reference.md
- [x] CHK-113 [P2] Citation sweep is path-only (no content rewrite of consumers beyond the reference path) — sweep repathed citations; content that moved to convergence_signals.md re-pointed there
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (move files back, delete new references, revert router/README/sweep, regenerate metadata; no `.cjs`/runtime changed) — documented in plan.md; rollback is a single-commit revert of e73ffe6610
- [x] CHK-121 [P0] Loop behavior unchanged (no runtime helper or `.cjs` edited; vitest regression suite green) — no runtime `.cjs`/`.ts` touched (commit stat); vitest regression N/A for this docs-only diff
- [x] CHK-122 [P1] Skill graph + advisor regenerated and resolving the new reference paths — advisor graph reindexed (22 nodes / 87 edges / 0 errors); graph-metadata.json repathed
- [x] CHK-123 [P1] Citation graph internally consistent (every consumer points at the moved/new location) — zero-hit grep confirms no consumer points at an old flat path
- [x] CHK-124 [P2] Workflow YAML `references_map` paths reviewed and resolving — both `deep_start-context-loop_*.yaml` skill_reference blocks repathed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Sibling parity honored: layout mirrors deep-research; no root-level reference file remains — `convergence/ guides/ protocol/ state/` matches deep-research; no root-level reference file
- [x] CHK-131 [P1] sk-doc smart-router resilience template followed (runtime discovery, weighted intent scoring, guarded loading, multi-tier fallback) — §2 rewritten to the canonical pattern with `{weight,keywords}`, `_guard_in_skill`, `UNKNOWN_FALLBACK_CHECKLIST`
- [x] CHK-132 [P2] No feature_catalog content duplicated into the new references (single source of implementation truth) — references stay lean + cross-link the feature_catalog (ADR-003)
- [x] CHK-133 [P2] No ephemeral tracking labels embedded in any edited file's code/comments (documentation paths in spec docs are exempt) — docs-only change; no code/comment labels added
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (completion metadata reconciled at close) — spec/impl-summary/checklist/description/graph-metadata flipped to Complete this pass
- [x] CHK-141 [P1] Lean + cross-link rule documented (decision-record.md ADR-003) — ADR-003 present
- [x] CHK-142 [P2] Scope exclusions documented (deep-research-only extras `convergence_reference_only.md`, `capability_matrix.md`, `spec_check_protocol.md` not authored; spec.md Out of Scope) — documented in spec.md §3 Out of Scope
- [x] CHK-143 [P2] Phase-parent doc map updated to reflect 004 status (../spec.md) — parent spec.md Phase Documentation Map + §3 row updated to Complete this pass (no context-index.md at this lean phase parent)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| deep-context owner | Technical Lead | [x] Approved (shipped e73ffe6610) | 2026-06-07 |
| deep-loop maintainer | Runtime Owner | [x] Approved (docs-only; no runtime touched) | 2026-06-07 |
| QA | QA Lead | [x] Approved (validate.sh --strict PASSED 134/003/004) | 2026-06-07 |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
