---
title: "Implementation Summary: Residual 029 Design Units"
description: "SCAFFOLD state. This packet documents the three residual 029 design units and their defer-bucket; no implementation has started. Inputs are the 029 handover §3 and the AI Council report."
trigger_phrases:
  - "residual design units summary"
  - "030 implementation summary"
  - "030 scaffold state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/030-residual-design-units"
    last_updated_at: "2026-06-13T14:30:00Z"
    last_updated_by: "scaffold-author"
    recent_action: "Recorded SCAFFOLD state; no implementation started"
    next_safe_action: "Operator review; then begin Unit A design note"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-scaffold-populate-2026-06-13"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-residual-design-units |
| **Completed** | Not started (SCAFFOLD) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a SCAFFOLD: it captures the residual 029 work as three design units plus a defer-by-design bucket, but no implementation has started. It exists so the 027 epic could close with its last genuinely-open work carried as one structured follow-on rather than a flat backlog. The scope, sequencing, and safety gates are specified in `spec.md` and `plan.md`; the work items live in `tasks.md`, all marked pending.

### Planned Units (not yet implemented)

- **Unit A — Vector storage truth (tri-105 reconcile).** Reconcile the live divergence (active surface `vec_768=10381` vs `vec_memories=10072`: 6 orphans + 308 non-success-with-vectors + 5 missing-success) behind a backup and a daemon-quiesced op with a per-class decision. The divergence health already shipped; only the data reconcile remains.
- **Unit B — Shadow/feedback + replay pool (tri-007/009/103).** Build a privacy-preserving hash-class synthetic replay corpus (no raw query text) and wire it into the shadow-evaluation scheduler; fold the Cluster B/C remnants. The typed no-replay-pool skip already shipped.
- **Unit C — Launcher parity (tri-148).** Port the spec-memory packet-140 supervision scaffold into `mk-code-index-launcher.cjs` behind the live-daemon adoption harness, or record the document-the-asymmetry decision.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Problem/scope, the 3 units as requirements, defer-bucket + L9/L2 tail, per-unit acceptance gates |
| plan.md | Created | Unit sequencing behind safety gates; affected-surfaces inventory |
| tasks.md | Created | Units + defer-bucket + L9/L2 tail as not-started tasks |
| ../spec.md | Modified | Filled parent phase-map row-30 scope/criteria/verification |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The packet was populated from two committed, authoritative inputs: the 029 handover (`../029-deep-research-remediation/handover.md` §3, the deferred-work table) and the AI Council report (`../029-deep-research-remediation/ai-council/council-report.md`, the design-unit roadmap and epic-close verdict). The next step is operator review, then the per-unit design notes before any code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Structure the residual as design units, not a flat list | The AI Council found the items interlock (vector truth pairs with health; replay feeds L2; launcher is delicate); a flat list underweights the interlocks and the blast radius. |
| Sequence the launcher port last | It carries the highest blast radius (3x historical dual-writer DB corruption); the council leans document-the-asymmetry over porting. |
| Carry the `:637` NULL content_text test as a separate investigation | It was proven pre-existing via stash-repro and lives in an untouched subsystem; pulling it in would break scope-lock and verify-first. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this packet | PASS (scaffold populated; 0 errors) |
| Implementation work | NOT STARTED — no code, no tests run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** This is a scaffold; all three units and the defer-bucket are pending operator review and the three escalation decisions (Unit A per-class reconcile, Unit B corpus model, Unit C parity-vs-document).
2. **Escalation-gated.** Units A, B, and C each require an operator decision before their build can begin; none can proceed autonomously.
3. **L9/L2 tail dispositions may be stale.** Several tail items are likely already-fixed and must be re-confirmed still-real before any implementation.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
