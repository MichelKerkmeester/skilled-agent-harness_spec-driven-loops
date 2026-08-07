---
title: "Tasks: Surgical Fixes to Existing sk-design Modes"
description: "Phase 1 task breakdown for the five surgical Hallmark-adoption heuristic fixes across the sk-design interface, audit, and foundations mode reference trees."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes"
    last_updated_at: "2026-07-22T18:00:04Z"

    last_updated_by: "implementation-agent"
    recent_action: "Completed all ten implementation and verification tasks"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:notation -->
## Task Notation

- Tasks use ID `T00N` in ascending order across all three phases.
- Every task is checked (`- [x]`) because its output and verification evidence exist on disk.
- `[EVIDENCE: ...]` names the artifact, command result, or exemplar that proves completion.
- Completion remains valid only while the cited output and verification result remain current.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the exact target reference file per workstream (`design-principles.md`, `redesign-intake.md`, `variation-diversity.md`, `anti-patterns-production.md`, `ai-fingerprint-tells.md`, `ai-slop-check.md`, `audit-contract.md`, `typography-system.md`, `layout-responsive.md`) and record any needed renames. [EVIDENCE: all nine paths in `spec.md` §3 existed and were extended in place; no rename or new file was needed]
- [x] T002 Re-read the relevant `012-sk-design-program/001-research/004-hallmark-design-skill-research` syntheses per workstream to confirm the grounding cited in spec.md before drafting adapted heuristic text. [EVIDENCE: `../../001-research/004-hallmark-design-skill-research/research/lineages/sol-codex/research.md` and `../../001-research/004-hallmark-design-skill-research/research/lineages/sol-opencode/research.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Draft and land the hero/media signature-role decision + deletion test + Tier 0 typography-only pass rule into the interface mode's design-process reference. [EVIDENCE: `design-interface/references/design-process/design-principles.md` §Hero Signature-Role Contract]
- [x] T004 Draft and land the multi-page MUST-SHARE/MAY-DIFFER axis table + amend-don't-override rule, including the diversification-rule inversion once a design.md lock exists. [EVIDENCE: `design-interface/references/design-process/redesign-intake.md` §Multi-Page Coherence Lock; `variation-diversity.md` §Multi-Page Inversion After A System Lock]
- [x] T005 Draft and land the ~7-15 new anti-slop probes with cognitive/perceptual rationale fields, including the AI-nav and AI-footer fingerprint probes, sequenced after the 6-axis pre-emit self-critique (established in the ai-slop-check procedure by this lane). [EVIDENCE: nine-row sweep in `design-audit/references/anti-patterns-production.md`, two page-furniture probes in `ai-fingerprint-tells.md`, ordered procedure in `procedures/ai-slop-check.md`]
- [x] T006 Add the evidence-first P0-P3 severity-model reaffirmation to the audit contract reference, explicitly forbidding an all-or-nothing gate posture. [EVIDENCE: `design-audit/references/audit-contract.md` §Evidence-First Probe Rule]
- [x] T007 Draft and land the fallback-font metric-override requirement (`size-adjust`/`ascent-override`/`descent-override`/`line-gap-override`/`font-display: swap`) plus the CLS-score verification requirement into the foundations typography reference. [EVIDENCE: `design-foundations/references/type/typography-system.md` §Fallback Metric Contract and §CLS Proof; manual audit step in `design-audit/references/audit-contract.md`]
- [x] T008 Draft and land the target-derived responsive proof matrix (320/375/414/768 CSS-px floor, pointer/hover feature queries, clickable-text-never-wraps fix order) into the foundations responsive reference, flagging the orientation/zoom extension as net-new. [EVIDENCE: `design-foundations/references/layout/layout-responsive.md` §Target-Derived Proof Matrix through §Net-New Orientation And Zoom Extension]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify a Tier 0 (typography-only) hero passes the new deletion test using at least one existing sk-design exemplar. [EVIDENCE: `design-principles.md` deletion-test criteria applied to `styles/library/bundles/ncda/DESIGN.md` §Imagery and §Layout: the pure-type hero retains subject, identity, hierarchy, and navigation with no enrichment or polish to remove]
- [x] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` against this spec folder and reconcile `checklist.md` evidence before any completion claim. [EVIDENCE: strict validation reported `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` after all 11 checklist rows were reconciled]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of T001 through T010 are checked with evidence; REQ-001 through REQ-006 in `spec.md` are satisfied; `checklist.md` is fully verified; `validate.sh --strict` reports 0 errors; no new sk-design modes or commands exist on disk.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`, `plan.md`, `checklist.md` (this folder)
- `../spec.md` — parent packet `012-sk-design-program/004-hallmark-design-system`
- `../../001-research/004-hallmark-design-skill-research/research/` — Hallmark adoption research syntheses
- `.opencode/specs/sk-design/012-sk-design-program/001-research/004-hallmark-design-skill-research/external/hallmark/LICENSE` — MIT license source
<!-- /ANCHOR:cross-refs -->
