---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Packed BM25 warmup RSS spike cut from 743MB to 134MB (under the 150MB budget) with ranking byte-identical, via no-copy chunked packed postings and compact typed-array promotion."
trigger_phrases:
  - "bm25 warmup churn reduction summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/017-bm25-warmup-churn-reduction"
    last_updated_at: "2026-06-11T07:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Warmup RSS reduced to 134MB; hard RSS gate re-enabled; ranking byte-identical"
    next_safe_action: "None; REQ-001 met — pending deep review"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-bm25-warmup-churn-reduction"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 017-bm25-warmup-churn-reduction |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packed in-memory BM25 engine now warms a realistic 10,245-doc / 69.2 MB corpus within a **134.3 MB** RSS spike — down from the 743 MB that the 014 realistic-fixture re-validation exposed, and under the 150 MB budget REQ-001 specifies. Ranking output is byte-identical to before: scores, ordering, and field weights are unchanged. This closes 014's REQ-001 on the original process-RSS metric (no metric amendment or external-dependency fallback was needed).

### Lower warmup memory high-water-mark

Two changes cut peak transient allocation during warmup. First, a prior pass replaced char-by-char token-string concatenation with range-scanning + token interning, reused per-document term-frequency scratch arrays, and stored doc term references as compact term ids (743 → ~244 MB). This phase then replaced the mutable-to-six-array finalization with **no-copy chunked packed postings**, and added **compact typed storage with width promotion** — field term frequencies as `Uint8Array → Uint16Array → Uint32Array`, doc ids as `Uint16Array → Uint32Array`, and per-document term ids sized to their range — so the build and packed structures never co-exist at full width (~244 → 134 MB).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/bm25-index.ts` | Modified | No-copy chunked packed postings + typed-array width promotion; reduced warmup transient allocation. Scoring math/field weights unchanged. |
| `mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Modified | Re-enabled the hard RSS budget assertion (always-on) + warmup-finalize/free regression coverage. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by cli-opencode gpt-5.5-fast (xhigh) under a hard parity gate, then independently verified: the realistic-corpus warmup test runs with `SPECKIT_BM25_RSS_GATE=1` and the RSS assertion is unconditional (no longer advisory). Every change was parity-checked against the hybrid-search oracle so ranking could not drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Touch the previously-frozen packed-postings layout | The 250→150 MB gap was structural; the operator sanctioned changing the layout IF ranking stays byte-identical, which the parity suite gates. |
| Compact typed-array width promotion (Uint8→16→32) | Most field term frequencies and ids fit in 8/16 bits at this corpus; promoting only on overflow keeps retained + transient memory small without changing values. |
| Keep scoring math + field weights frozen | REQ-001 is a memory goal, not a ranking change; byte-identical output is the hard constraint. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `SPECKIT_BM25_RSS_GATE=1 vitest bm25-packed-inmemory` | PASS — 6/6; warmup RSS spike 134.3 MB ≤ 150 MB |
| Ranking parity (`hybrid-search.vitest.ts`) | PASS — 94/94, byte-identical scores/order |
| Warmup latency | 2.3 s ≤ 10 s budget |
| `tsc --noEmit` | PASS — 0 diagnostics |
| Comment hygiene | PASS — no ephemeral labels |
| `validate.sh --strict` (017) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Memory headroom is corpus-dependent.** The 134 MB spike is measured at the current corpus shape (10,245 docs / 69.2 MB). A much larger corpus would push the spike up; the hard RSS gate will catch a regression at this fixture size, and the typed-array promotion already adapts widths to the data.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
