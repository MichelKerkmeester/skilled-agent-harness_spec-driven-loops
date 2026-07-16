---
title: "Implementation Summary: Determinism + Content-ID Foundation"
description: "Closeout summary for the determinism + content-id foundation sub-phase: 5 keystone candidates shipped in Wave-0 with commit evidence, 4 gated residue candidates documented (configured-mode, render-stage, single-tenant identity pair) and the cross-subsystem byte-compare contract recorded."
trigger_phrases:
  - "implementation summary determinism content-id foundation"
  - "memory total comparator closeout"
  - "028 speckit-memory determinism shipped pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-06T19:16:28.132Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "5 determinism candidates shipped default-byte-identical + 4 gated residue"
    next_safe_action: "Land the fusion-bonus invariant test before any configured-mode promotion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-determinism-content-id-foundation |
| **Authored** | 2026-06-19 |
| **Level** | 3 |
| **Scope** | Determinism + content-id foundation: 5 shipped (Wave-0), 4 gated residue |
| **Branch** | system-speckit/029-memory-search-intelligence |
| **Shipped via** | packet 030 (Wave-0), commits `738e118751..ab5459fb6d` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase is the determinism keystone of the Spec-Kit Memory MCP retrieval-intelligence work. Five candidates, the two content-id primitives, the content-derived comparator/output tiebreak (C5-B), the ANN below-RRF tiebreak, the byte-identical `bonusOverChannels` param (C-X1 `'active'`) and the rank-time decay clock (C6-A), were implemented and committed in the flat Wave-0 implementation record (030). They establish the shared total-comparator, the centralized SHA-256 content-id formula and the byte-identical-by-default fusion seams that the three sibling subsystems (Code Graph 002, Skill Advisor 003, Deep Loop 004) byte-compare against. Four further candidates remain gated PENDING and were deliberately not built.

### Shipped Candidates (Wave-0 / packet 030)

| # | Candidate | Commit | Result |
|---|-----------|--------|--------|
| 1 | two-content-id-primitives | `18c8582e33` | Centralized `hashContentBody` (content-body) + `hashCanonicalJson` (canonical-field) into `lib/content-id.ts`, byte-identical parity proven, no behavior change. |
| 2 | ANN-tie-stable-order | `bec0eed27f` | `, m.id ASC` (COALESCE) on the 4 ranked ANN `ORDER BY distance`, LIMIT-survival into fusion now run-stable. |
| 3 | C5-B content-derived tiebreak | `bec0eed27f` | `content_hash`-asc tiebreak (COALESCE id) in the deterministic comparator + all 5 RRF output sorts, primary order unchanged (verified). |
| 4 | C-X1 (`'active'`) | `65cfcea513` | `bonusOverChannels` param defaulting to `'active'`, byte-identical traced arithmetically, opus SHIP. |
| 5 | C6-A rank-time decay clock | `65cfcea513` | Caller-`nowMs` rank-time decay, restored no-timestamp skip guard so it is a pure refactor, reinforcement stays a separate event. |

### Gated Residue (PENDING, documented, not built)

| # | Candidate | Gate | Evidence |
|---|-----------|------|----------|
| 6 | C-X1-true-multichannel (`'configured'`) | shared-infra-dep | No consumer until Wave-1 C2-B per-class zero-weighting, conditioned on the still-open fusion-bonus unit test, C-X1 confirmed from-scratch (aionforge has no bonus term, `iteration-031.md` H31-02). |
| 7 | C5-A render-order serialization stage | render-build | Fuller-parity successor to the shipped C5-B stopgap, golden-file re-baseline once, render tiebreak separate from fusion tiebreak (`iteration-003.md` C5-A, `iteration-031.md` H31-04). |
| 8 | M-dual-class-identity | multi-writer (single-tenant-refuted) | iter-14 PROMOTE → iter-23 PARTIAL/NO-GO: capture/content distinction already informal, pays off only for distributed/multi-writer merge. |
| 9 | M-clock-skew-replay-window | multi-writer (single-tenant-refuted) | iter-14 BUILD → iter-23 REFUTED/NO-GO: anti-replay is a network/multi-writer threat, local writes have no adversarial replay + receipts already dedup. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The five shipped candidates landed as scoped commits on `system-speckit/029-memory-search-intelligence` during the flat Wave-0 implementation record (030), each following the one-candidate-at-a-time loop: read the seam, patch only that seam, add a focused test, prove byte-identity (parity test / arithmetic trace), request opus review on the higher-risk fusion seams, then commit. This sub-phase re-homes those commits under the correct subsystem-research phase (028/001-speckit-memory) as the determinism + content-id foundation, records the four gated residue candidates that the flat layout missed or deferred and documents the cross-subsystem byte-compare contract (`fuseResultsMulti` `'active'` default) that the foundation must hold for consumers 002/003/004.

No code was written in this re-plan: the shipped work already exists in packet 030 (the Wave-0 shipped record), and the residue is deliberately unbuilt behind its gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Total-comparator + content-id is the keystone, shipped first | Accepted | One comparator + two primitives reused across candidates and siblings. |
| ADR-002 | Byte-identical default behavior is the fusion-seam ship gate | Accepted | C-X1 `'active'` + C6-A clock land without re-ordering any consumer. |
| ADR-003 | Gate the render-stage and configured-mode residue behind their consumers | Accepted | No dead code, `'configured'` and C5-A wait for C2-B / a golden re-baseline. |
| ADR-004 | Refuse the identity-hardening pair for a single-trusted-host tool | Accepted | No misleading multi-writer hardening on a single-tenant MCP. |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the total-comparator + content-id formula once | JS `(a,b)=>b-a` is not total, siblings byte-compare against this primitive. |
| Centralize the formula, parameterize the identity | Legacy hashes are bare-hex, Primitive B's token-stripping is receipt-specific. |
| Default `bonusOverChannels` to `'active'`, keep the C6-A clock-less path byte-identical | The cross-subsystem byte-compare contract must not move. |
| Drop the galadriel prompt-cache (~84%) justification | Invalid for an out-of-band MCP server, determinism stands on reproducibility. |
| Keep `'configured'` and C5-A gated | Neither has a present consumer, building now adds churn without an earned benefit. |
| Refuse dual-class identity / clock-skew window | Single-tenant threat model, receipts already dedup (iter-23). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Item | Command | Result |
|------|---------|--------|
| Shipped commits traced | `git log --oneline 1ecc531431..HEAD` | The 5 candidate commits (`18c8582e33`, `bec0eed27f`, `65cfcea513`) present in the Wave-0 range. |
| Content-id parity | `content-hash-dedup.vitest.ts` (Wave-0 closeout) | PASS, byte-identical hash outputs (per `030` §14 cand 7). |
| Determinism seams | Memory focused suite (`stage2-fusion`, `rrf-fusion`, `unit-rrf-fusion`) (Wave-0) | PASS, primary order unchanged, default byte-identical (per `030` §14 cand 3-5). |
| Sub-phase docs | `validate.sh --strict` on this folder | PASS, Level-3 structure, anchors, frontmatter, required files. |

### Commands

```bash
git log --oneline 1ecc531431..HEAD
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation --strict
```

> The candidate-level test/build evidence is owned by the Wave-0 shipped record (Wave-0 verification evidence). This sub-phase re-homes the commits and adds the gated residue, it does not re-run the full subsystem suite.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fusion-bonus invariant unit test is still open.** Every "byte-identical-by-default" determinism claim is conditional on it. It must land before any `'configured'` promotion.
2. **No candidate has a measured benefit number.** All leverage/effort are structural inference, the shipped seams are tie-only re-orders or default-identity refactors, not benchmarked deltas.
3. **The `'configured'` mode and C5-A are unbuilt.** They wait for the Wave-1 C2-B consumer and a render-stage golden re-baseline respectively.
4. **The identity-hardening pair is unbuilt by design.** It is documented-NO-GO for a single-trusted-host tool, only a multi-writer adoption revives it.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Occurred | Impact | Resolution |
|------|----------|--------|------------|
| Identity-hardening hypothesis (multi-writer threat) does not apply | Yes | Dual-class / clock-skew cannot ship safely | Refused, documented-NO-GO behind a multi-writer gate (iter-23) |
| Galadriel prompt-cache used as a determinism justification | Yes (in pass-1 framing) | Would over-sell the benefit | Dropped, determinism rests on reproducibility (`synthesis/03` §A) |
| `'configured'` mode has no present consumer | Yes | Building it now would be dead code | Gated behind Wave-1 C2-B + the open unit test |
<!-- /ANCHOR:risks-realized -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Implement candidates in this sub-phase | Re-homed already-shipped Wave-0 commits + documented gated residue | The cheap reversible wins already shipped in the flat packet 030, this is a re-plan, not new implementation. |
| Flat Wave-0 candidate layout (packet 030) | Phased child under 028/001-speckit-memory | The flat layout was structurally wrong and missed the determinism residue, this sub-phase is the correct subsystem-scoped home. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Land the fusion-bonus invariant unit test (the standing gate on every byte-identical-by-default claim).
- [ ] Build C-X1-true-multichannel (`'configured'` mode) alongside the Wave-1 C2-B per-class weight consumer.
- [ ] Build C5-A render-order serialization stage as the fuller-parity successor to C5-B (one-time golden re-baseline).
- [ ] Revisit M-dual-class-identity / M-clock-skew-replay-window only if a multi-writer / distributed-merge / strict-isolation mode is adopted.
<!-- /ANCHOR:follow-up -->
