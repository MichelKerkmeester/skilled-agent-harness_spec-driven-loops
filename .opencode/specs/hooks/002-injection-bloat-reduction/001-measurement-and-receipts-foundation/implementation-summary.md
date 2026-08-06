---
title: "Implementation Summary: Measurement & Receipts Foundation"
description: "Planned, not yet built. This packet documents the intended shadow planner, canonical block IDs, delivery-receipt fields, and parity fixtures ahead of implementation."
trigger_phrases:
  - "measurement and receipts summary"
  - "shadow planner not yet built"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the forward-looking not-yet-built implementation placeholder"
    next_safe_action: "Implement policy-plan.ts per plan.md Phase 2 once this program's build is scheduled"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Measurement & Receipts Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-measurement-and-receipts-foundation |
| **Completed** | Not yet completed - planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning spec: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` describe the intended shadow planner (`lib/policy-plan.ts`), its canonical block IDs, its privacy-safe content and ordered policy-set hashes, its seven-field delivery-receipt shape, and the byte-stable parity fixture matrix that will prove zero output change. None of `policy-plan.ts`, its six runtime call sites, or its test suites exist on disk yet.

### Planned Files (not yet created)

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Create | Canonical block registry, hashers, and delivery-receipt builder |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Add a shadow-only call to the planner; no output change |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts` | Create | Unit tests for IDs, hash purity, receipt shape |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/policy-plan-serializer-parity.vitest.ts` | Create | Byte-stable parity across six native serializers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. `plan.md` section 4 lays out the intended delivery order: (1) inventory the six existing call sites and capture a pre-change byte-exact baseline as a negative control, (2) implement the block registry, hash functions, and receipt builder, then wire shadow-only calls into all six runtime paths, (3) prove zero output diff with the parity fixture matrix plus the raw-data-leakage adversarial control, then run the whole-package typecheck and Vitest suite. When implementation lands, this section will be rewritten to describe what was actually delivered, replacing this forward-looking description.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shadow-only, zero-output-change scope for this phase | Every later reduction candidate needs a receipt to gate activation on; shipping any output change before receipts exist would repeat the unconditional-directive-removal failure mode research.md ruled out |
| Hash inputs restricted to block ID + content + order | Privacy-safe by construction - raw prompts, paths, and session identifiers must never enter a persisted hash or receipt |
| New dedicated shadow-delta stream, not the existing scorer `shadow-deltas.jsonl` | `lib/shadow/shadow-sink.ts` already serves an unrelated recommendation-scoring comparison; reusing it would conflate two different shadow-mode purposes |
| Planner imports `render.ts`'s existing directive constants rather than redefining block text | Prevents the canonical content and the planner's copy from silently drifting apart |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control (pre-change baseline capture) | Not yet run |
| `policy-plan.vitest.ts` | Not yet run |
| `policy-plan-serializer-parity.vitest.ts` | Not yet run |
| Raw-data-leakage adversarial control | Not yet run |
| Whole-package typecheck | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning artifact, not a shipped fix.** No code exists yet; every row above is a planned action, not a completed one.
2. **The exact block-ID extension list beyond the four named IDs is not finalized.** `spec.md`/`plan.md` name governor, proof-over-appearance, SessionStart, OpenCode continuity, and OpenCode compiled route as candidates under the same v1 ID scheme; the final enumeration happens during implementation against research.md §3's full ownership table.
3. **Host-receipt semantics per runtime are an open question (spec.md §7).** This phase's fixture matrix is expected to surface, per runtime, whether a real host acknowledgement exists or a behavioral probe is required instead; that answer is not assumed in advance.
<!-- /ANCHOR:limitations -->
