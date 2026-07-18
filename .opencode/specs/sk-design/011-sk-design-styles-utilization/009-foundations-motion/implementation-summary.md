---
title: "Implementation Summary: foundations + motion styles-library wiring (Phase C)"
description: "Planned scaffold for wiring design-foundations and design-motion to the styles library via the phase-007 seam. Nothing is built yet; this records the intended shape and the not-started status."
trigger_phrases:
  - "foundations motion summary"
  - "compatibility graph status"
  - "restraint gate status"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations-motion L3 scaffold"
    next_safe_action: "Build the phase-007 seam wiring for foundations then motion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-found-motion-011-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: foundations + motion styles-library wiring (Phase C)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-foundations-motion |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 3 |
| **Origin** | Phase C child of the styles-library utilization phase parent (011) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This is a planned scaffold that records the intended shape of Phase C before any mode runtime changes. It captures how `design-foundations` and `design-motion` will consume the styles library through the phase-007 seam so the work can start from a fixed contract rather than an open question.

### design-foundations (planned)

Foundations will express token compatibility as typed dependency edges ("these tokens work together / conflict") over 1 coherent style plus at most 3 axis owners, with a relationship blueprint, a transformation ledger (source → relationship → transformation → lock), and downstream `not-assessed` checks. It will reject raw token averaging/interpolation and top-level token-axis co-presence as compatibility, and it will not override target roles/values, accessibility checks, or extraction truth.

### design-motion (planned)

Motion will run a restraint-first "should this move at all?" query gate before any retrieval, then polarity-aware eligibility with hard negatives (explicit negations never surfacing as false positives), purpose/state archetypes, and negative baselines. Only the restraint gate plus target evidence will decide no-motion — never static similarity or absent prose — and it will not override reduced-motion/performance proof or the target mechanism.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Phase C requirements, scope, and success criteria |
| `plan.md` | Created | Phased approach, dependencies, and rollback |
| `tasks.md` | Created | Pending run queue (all unchecked) |
| `checklist.md` | Created | L3 verification checklist (all unchecked) |
| `decision-record.md` | Created | ADR-001 typed edges, ADR-002 restraint gate |
| `.opencode/skills/sk-design/design-foundations/**` | Proposed | Typed compatibility graph + blueprint + ledger (not started) |
| `.opencode/skills/sk-design/design-motion/**` | Proposed | Restraint gate + polarity-aware eligibility (not started) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The plan sequences foundations and motion after the phase-007 seam and phase-008 pilots stabilize, so both modes consume proven proof/provenance/fallback fixtures rather than inventing parallel envelopes. Verification will come from the checklist and the parent recursive `validate.sh` run once the additions land.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Typed compatibility edges, not scalar averaging | Averaging invents non-existent tokens and hides conflict; typed edges keep foundations reference-only and auditable (ADR-001) |
| Restraint gate before retrieval | Running retrieval first lets static similarity fabricate motion; the gate keeps the no-motion path cheap and correct (ADR-002) |
| Reuse Phase 008 proof patterns | The interface and audit pilots prove the shared fixtures before the relationship-heavy modes consume them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scaffold docs authored (six-doc L3 set) | PASS via `validate.sh <folder> --strict` (Errors: 0) |
| Foundations typed-edge acceptance (REQ-001, REQ-004) | Not started — no runtime built |
| Motion restraint-gate acceptance (REQ-002, REQ-005) | Not started — no runtime built |
| Corpus reference-only authority order (REQ-003) | Not started — no runtime built |

Re-confirm once the additions land with `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization --strict --recursive`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a plan, not a build.** No `design-foundations/` or `design-motion/` runtime code exists yet; all mode-dir entries are proposed.
2. **Blocked on upstream phases.** Real work waits on the phase-007 seam, phase-004 retrieval, and the phase-008 pilot patterns.
3. **Cost is an upper envelope.** Foundations ~10-17 days and motion ~9-16 days overlap heavily on shared fixtures; re-estimate after the seam and pilots reveal actual reuse.
<!-- /ANCHOR:limitations -->
