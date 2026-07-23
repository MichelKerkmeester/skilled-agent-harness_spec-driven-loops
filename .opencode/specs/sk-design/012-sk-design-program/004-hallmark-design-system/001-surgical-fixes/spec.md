---
title: "Feature Specification: Surgical Fixes to Existing sk-design Modes"
description: "Adopt five Hallmark-grounded heuristics (hero/media contract, multi-page coherence lock, expanded anti-slop probes, fallback-font CLS proof, responsive proof matrix) into existing sk-design modes via clean-room ADAPT, preserving the evidence-first P0-P3 severity model."
trigger_phrases:
  - "hallmark surgical fixes"
  - "anti-slop audit probes"
  - "hero media contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes"
    last_updated_at: "2026-07-22T18:00:04Z"

    last_updated_by: "implementation-agent"
    recent_action: "Implemented and strictly validated all five workstreams"
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

# Feature Specification: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-sk-design-program/004-hallmark-design-system` |
| **Successor** | `002-evidence-envelopes` |
| **Phase** | 1 of 4 |
| **Implements** | `../../001-research/004-hallmark-design-skill-research/research/` (Hallmark adoption research syntheses) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Hallmark (an external, MIT-licensed static-site design skill researched in packet `012-sk-design-program/001-research/004-hallmark-design-skill-research`) encodes several heuristics that sk-design's existing modes currently lack: a disciplined hero/media enrichment gate, an explicit multi-page coherence lock, a broader anti-slop audit probe set with cognitive/perceptual rationale, engineering-verifiable fallback-font layout-shift proof, and a target-derived responsive proof matrix. Adopting these heuristics naively risks importing Hallmark's incompatible all-or-nothing 58-gate posture in place of sk-design's evidence-first P0-P3 severity model, and risks introducing new modes or commands where none are needed.

### Purpose

Land five scoped, clean-room-adapted heuristic upgrades directly into the existing sk-design mode owners (`design-interface`, `design-audit`, `design-foundations`) — no new modes or commands — so that hero/media decisions, multi-page systems, anti-slop audits, fallback-font typography, and responsive proofs each gain a grounded, testable heuristic while sk-design's evidence-first P0-P3 severity model remains the sole governing posture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Interface hero/media contract** — a signature-role decision (zero-or-one enrichment archetype AND zero-or-one polish pattern, stamped into a CSS comment) plus a deletion test; Tier 0 (typography-only) heroes MUST pass.
- **Multi-page coherence** — a MUST-SHARE vs MAY-DIFFER axis table for existing multi-page/system workflows, plus an amend-don't-override rule for lock exceptions.
- **~7-15 new anti-slop audit probes**, each with a cognitive/perceptual rationale field, sequenced after the 6-axis pre-emit self-critique (established in the ai-slop-check procedure by this lane).
- **Fallback-font metric overrides + CLS proof** — `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` matched to the real face, plus `font-display: swap`, verified via a CLS score.
- **Target-derived responsive proof matrix** — a hard floor at 320/375/414/768 CSS-px widths, pointer/hover feature queries (not width) for interaction capability, and a clickable-text-never-wraps fix order; the orientation/zoom extension is flagged as a net-new sk-design addition beyond Hallmark's width + pointer/hover scope.
- Preserving sk-design's evidence-first P0-P3 severity model as the governing posture for all five workstreams.

### Out of Scope

- New sk-design modes, or new `/interface:*` / `/design:*` commands.
- Importing Hallmark's catalogs, recipes, or its all-or-nothing 58-gate posture.
- Phases 2-4 of the parent `012-sk-design-program/004-hallmark-design-system` packet (evidence envelopes and successor concerns).
- External Hallmark images, fonts, or third-party assets — excluded from the repository's MIT grant and not carried into sk-design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/references/design-process/design-principles.md` | Modify | Add the hero/media signature-role decision + deletion test + Tier 0 typography-only pass rule |
| `.opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md` | Modify | Add the multi-page MUST-SHARE/MAY-DIFFER axis table + amend-don't-override rule |
| `.opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md` | Modify | Add the multi-page diversification-rule inversion once a design.md lock exists |
| `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` | Modify | Add ~7-15 new anti-slop probes with cognitive/perceptual rationale fields |
| `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` | Modify | Add the AI-nav and AI-footer fingerprint probes |
| `.opencode/skills/sk-design/design-audit/procedures/ai-slop-check.md` | Modify | Sequence the pre-emit 6-axis self-critique ahead of the gate sweep |
| `.opencode/skills/sk-design/design-audit/references/audit-contract.md` | Modify | Reaffirm the evidence-first P0-P3 severity model; forbid an all-or-nothing gate posture |
| `.opencode/skills/sk-design/design-foundations/references/type/typography-system.md` | Modify | Add fallback-font metric overrides + CLS-score verification requirement |
| `.opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md` | Modify | Add the proof matrix, feature-query rule, clickable-text fix order, orientation/zoom flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hero/media contract heuristic | A signature-role decision (zero-or-one enrichment archetype AND zero-or-one polish pattern, stamped into a CSS comment) and a deletion test are documented; Tier 0 (typography-only) heroes are defined as an always-acceptable PASS state. |
| REQ-002 | Multi-page coherence lock | A MUST-SHARE axis list (wordmark/logotype, accent colour + placement at <=5% per viewport, display+body fonts, CTA voice, section-heading rhythm) and a MAY-DIFFER axis list (macrostructure within the page-type family, hero archetype within that family, marketing-only enrichment) are documented, with an amend-don't-override rule for lock exceptions. |
| REQ-003 | Anti-slop audit probe set | ~7-15 new probes are documented, each carrying a cognitive/perceptual rationale field, sequenced after (not instead of) the 6-axis pre-emit self-critique (established in the ai-slop-check procedure by this lane). |
| REQ-004 | Evidence-first severity model preserved | Every adapted heuristic is expressed as an evidence-first P0-P3 finding, not a binary gate; Hallmark's all-or-nothing 58-gate posture is explicitly not imported. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fallback-font metric overrides + CLS proof | `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` (matched to the real face) plus `font-display: swap` are required, verified via a CLS score rather than a visual approximation. |
| REQ-006 | Target-derived responsive proof matrix | A hard floor at 320/375/414/768 CSS-px widths, pointer/hover feature queries (not width) for interaction capability, and a clickable-text-never-wraps fix order are documented; the orientation/zoom extension is flagged as a net-new sk-design addition, not a Hallmark adoption. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All five workstreams (REQ-001, REQ-002, REQ-003, REQ-005, REQ-006, with REQ-004 as the cross-cutting governing constraint) are landed as heuristic content inside their existing mode-owned reference files; zero new sk-design modes or commands are introduced; the evidence-first P0-P3 severity model is unchanged; `checklist.md` is fully verified with evidence; `validate.sh --strict` reports 0 errors once Phase 1 is implemented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** `../../001-research/004-hallmark-design-skill-research/research/` (Hallmark adoption research syntheses) and the existing sk-design mode reference files listed in §3 Files to Change.
- **Risk:** Importing Hallmark's all-or-nothing 58-gate posture instead of adapting to evidence-first P0-P3 — mitigated by REQ-004 and by requiring clean-room ADAPT rather than verbatim transcription.
- **Licensing risk:** Hallmark is MIT-licensed (`.opencode/specs/sk-design/012-sk-design-program/001-research/004-hallmark-design-skill-research/external/hallmark/LICENSE`). Prefer clean-room ADAPT with independently-worded heuristics grounded in the concept. If any probe table substantially copies Hallmark's gate text, add Hallmark's MIT notice to a third-party notice surface. External Hallmark images, fonts, and other third-party assets are SKIP — they are not covered by the repository's MIT grant.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- All five workstreams land as documentation-only reference-file additions; no runtime performance impact is expected from Phase 1 (advisory heuristics consulted during design/audit, not executable gates).

### Security

- No new network surface, executable code, or mutation capability is introduced; all additions are advisory Markdown reference content consumed by the existing read-only `design-interface`, `design-audit`, and `design-foundations` modes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The nine existing files in §3 were extended in place; no dedicated hero/media file, mode, or command was created.
- CLS-score verification is a manual audit-step requirement. This phase adds no automated CLS checker.
<!-- /ANCHOR:questions -->
