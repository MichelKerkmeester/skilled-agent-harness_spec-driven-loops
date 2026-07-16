---
title: "Plan: create-benchmark completeness remediation"
description: "Execution plan for closing the dual-review findings: fix in scoped groups (P1 functional/authoring, P2 local, P2 cross-tree), validate each edit at author time, then a GPT-5.6 Sol Ultra re-review gate before ship."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-16T04:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored execution plan"
    next_safe_action: "Execute Phase 1 (P1) fixes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Plan: create-benchmark completeness remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fix the verified create-benchmark completeness findings in three scoped groups, then verify with an independent re-review. Each edit is confirmed against the real file at author time (finding = hypothesis), validated with `validate_document.py` immediately, and committed pathspec-scoped so the concurrent operator session in the main tree is never swept. Every change is documentation, templates, or one router-fallback string — no scoring, evaluator, scheduler, or runtime logic.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `validate_document.py` passes (same type, zero new issues) on every edited doc.
- No create-benchmark guide links to a non-existent target after the sweep.
- The GPT-5.6 Sol Ultra Fast re-review reports no surviving P1 and no new regression.
- `validate.sh --strict` on this child is Errors:0; the two review reports are archived under `evidence/`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The remediation touches three layers, each with a fixed owner boundary the fixes preserve: (1) the create-benchmark authoring home (`SKILL.md`, `references/`, `assets/`) which owns templates and guides; (2) the deep-alignment conformance package which owns the shipped `command-surface` exemplar; (3) the consuming exemplar trees (system-spec-kit MCP, Lane C hubs, the four behavior indexes) which own their own READMEs. No lane-local evaluator/scorer/runtime code is touched.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P1 fixes
Router fallback, behavior schema-v2 scaffold, conformance exemplar completion.

### Phase 2: P2 create-benchmark-local
Command-benchmark first-classing, route-map refresh, phantom Lane D, deep-command links, Lane C fixture link.

### Phase 3: P2 cross-tree
MCP consumer README + template href, Lane C exemplar READMEs (hyphen-pilot-aware), behavior-index back-pointers.

### Phase 4: Verify
Sol Ultra Fast re-review, strict validation, scoped commit + FF-push.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-doc `validate_document.py` at edit time; a v2 scenario authored from the patched template parsed against the runner's schema-v2 field set; cross-link resolution spot-checks; `validate.sh --strict` on the child; the independent Sol Ultra re-review as the acceptance gate.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The shipped behavior framework/runner, the `sk-doc-command` adapter and its allowlist entry, the `/create:benchmark` authoring command, and the two archived review reports (finding source of truth).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every fix is an isolated doc/template edit; revert any single fix with `git revert <sha>` without cross-file coupling. The router-fallback string change is the only functional edit and is a one-line revert.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 → Phase 2 → Phase 3 are independent finding groups and may proceed in any order; Phase 4 (verify) depends on all three being landed. The conformance exemplar completion (Phase 1) is soft-coupled to 066 closeout and is cross-referenced there.
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

Roughly one focused session: ~13 scoped doc/template edits plus one re-review dispatch and validation. No code, no fixtures, no runs beyond the single Sol Ultra re-review.
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

Because commits are pathspec-scoped per finding group, a group can be reverted independently of the others. If the Sol Ultra re-review surfaces a regression, revert only the offending finding's commit and re-run the per-doc validator; no packet-wide rollback is required.
<!-- /ANCHOR:l2-rollback -->
