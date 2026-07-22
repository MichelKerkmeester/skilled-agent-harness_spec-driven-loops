---
title: "Implementation Plan: Surgical Fixes to Existing sk-design Modes"
description: "Phase 1 implementation plan for landing five Hallmark-grounded heuristic adaptations directly into existing sk-design mode reference files, with no new modes or commands."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 1 implementation plan (planned)"
    next_safe_action: "Begin Phase 1 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

sk-design is a parent skill hub whose modes (`design-interface`, `design-audit`, `design-foundations`, and others) consult Markdown reference files under each mode's `references/` tree; there is no separate executable surface for the heuristics targeted by this packet. This phase makes additive Markdown edits to nine existing reference/procedure files across three mode-owned trees; it introduces no new modes, commands, scripts, or runtime execution paths.

### Overview

Five workstreams land in this phase: (1) a hero/media signature-role + deletion-test contract for `design-interface`; (2) a multi-page MUST-SHARE/MAY-DIFFER coherence lock, also for `design-interface`; (3) ~7-15 new anti-slop audit probes with rationale fields for `design-audit`; (4) fallback-font metric overrides with CLS-score proof for `design-foundations`; and (5) a target-derived responsive proof matrix, also for `design-foundations`. A sixth cross-cutting requirement (REQ-004) reaffirms that sk-design's evidence-first P0-P3 severity model governs all five, in place of Hallmark's all-or-nothing 58-gate posture.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- `spec.md` for this phase is approved; the `014-hallmark-design-skill-research/001-research/research/` syntheses are available as grounding; the nine target reference files in `spec.md` §3 are identified and confirmed to exist.

### Definition of Done

- All five workstreams' heuristics are documented in their owning reference files; REQ-001 through REQ-006 are satisfied; `checklist.md` is fully checked with evidence; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` reports 0 errors; no new sk-design modes or commands exist on disk.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only reference-file amendment: each workstream lands as a new or expanded subsection inside the existing mode-owned `references/` (or `procedures/`) tree, cross-referenced from the owning mode's index rather than duplicated across modes.

### Data Flow

Hallmark research syntheses (`014-hallmark-design-skill-research/001-research/research/`) flow through a clean-room ADAPT step (independently-worded heuristics grounded in the concept, never verbatim transcription) into the target mode-owned reference file. That file is then consulted at design/audit time by the existing read-only `design-interface`, `design-audit`, and `design-foundations` workflows. No runtime execution path, data store, or command surface changes; only the advisory reference content consulted during design/audit work changes.

### Key Components

| Workstream | Target Mode | Primary File |
|---|---|---|
| Hero/media contract | `design-interface` | `references/design-process/design-principles.md` |
| Multi-page coherence lock | `design-interface` | `references/design-process/redesign-intake.md`, `references/design-process/variation-diversity.md` |
| Anti-slop audit probes | `design-audit` | `references/anti-patterns-production.md`, `references/ai-fingerprint-tells.md`, `procedures/ai-slop-check.md` |
| Severity model preserved | `design-audit` | `references/audit-contract.md` |
| Fallback-font CLS proof | `design-foundations` | `references/type/typography-system.md` |
| Responsive proof matrix | `design-foundations` | `references/layout/layout-responsive.md` |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm the nine target reference files, re-read the relevant `014` research syntheses per workstream, and confirm the clean-room ADAPT / MIT-notice posture before drafting any heuristic text.

### Phase 2: Implementation

Land the five workstreams' heuristics into their target reference files per REQ-001 through REQ-006, including the evidence-first severity-model reaffirmation in `audit-contract.md`.

### Phase 3: Verification

Verify each workstream against its `spec.md` acceptance criteria (including the Tier 0 deletion-test pass), verify no probe table substantially copies Hallmark's gate text without a notice, run `checklist.md`, and run `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a documentation-only packet: no application code changes, so no unit/integration test suite applies. "Testing" consists of (1) structural spec-folder validation (`validate.sh --strict`), (2) a manual pass confirming a Tier 0 (typography-only) exemplar passes the new deletion test, and (3) a licensing check confirming no probe table copies Hallmark's gate text substantially without an added MIT notice.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/` — Hallmark adoption research syntheses (grounding source).
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/` — MIT-licensed Hallmark source; read-only grounding, never copied verbatim.
- The nine existing sk-design mode reference/procedure files listed in `spec.md` §3 Files to Change.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additive Markdown edits to existing reference files; rollback is a `git revert` of the commit(s) touching the nine listed files. No schema or data migrations, no runtime state, and no command/mode registration changes are involved, so rollback carries no downstream-consumer risk.
<!-- /ANCHOR:rollback -->
