---
title: "Feature Specification: BM25 Warmup Churn Reduction"
description: "Packed BM25 warmup transiently spikes RSS to ~687MB on a realistic corpus while retained heap is only ~105MB, breaching phase 014's REQ-001 150MB RSS budget; reduce peak transient allocation during warmup so the committed-page high-water-mark stays within budget."
trigger_phrases:
  - "bm25 warmup churn reduction"
  - "packed bm25 rss spike"
  - "warmup memory budget"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/010-bm25-warmup-churn-reduction"
    last_updated_at: "2026-06-11T07:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep review applied: peak-sampled RSS gate + width-promotion tests; 136.5MB"
    next_safe_action: "None; REQ-001 met and deep-review remediation committed"
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
    answered_questions:
      - "Operator decision: keep REQ-001's 150MB RSS metric and fund the churn fix (not amend the metric or accept the minisearch dependency)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: BM25 Warmup Churn Reduction

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 014-packed-bm25-field-weights |
| **Successor** | None |
| **Handoff Criteria** | Realistic-fixture warmup RSS spike <= 150MB with ranking parity preserved and the hard RSS gate re-enabled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes phase 014's REQ-001 on the original 150MB RSS metric. The 014 deep review (adversarially verified) found that the packed BM25 engine's *retained* heap meets the budget (~105MB) but the transient *warmup* RSS spike breaches it (~687MB on a realistic 10,245-doc / 69.2MB corpus). The breach is allocation churn during warmup, not retained index size; 014 left the RSS test assertion advisory (`SPECKIT_BM25_RSS_GATE`) pending this fix.

**Scope Boundary**: the warmup/tokenization allocation path in `bm25-index.ts`. Ranking/scoring semantics and the packed-postings layout are frozen (retained heap is already within budget).

**Dependencies**:
- 014-packed-bm25-field-weights (the engine + the realistic RAM fixture + the advisory gate this phase re-enables).

**Deliverables**:
- Reduced peak transient allocation during warmup so the committed-page high-water-mark stays <= 150MB.
- The hard RSS gate re-enabled (advisory demotion removed) and passing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On a realistic corpus the packed BM25 warmup spikes process RSS to ~687MB (4.6x over the 150MB budget) even though retained heap after GC is only ~105MB. V8 commits the heap pages driven by peak transient allocation and does not decommit them within the run, so the spike — not retained size — is what breaches REQ-001. The churn sources are char-by-char token building, transient concatenated per-document strings (title+content+triggers+path joined before tokenization), and mutable `number[]` posting growth.

### Purpose
Cut peak transient allocation during warmup so the committed-page high-water-mark stays within the 150MB budget, with BM25 ranking output byte-identical to today, closing 014's REQ-001 on the original RSS metric.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Field-by-field tokenization that avoids materializing the full concatenated per-document string.
- Token-buffer reuse / reduced transient string allocation in the tokenizer.
- Pre-sized or pooled mutable postings to reduce `number[]` growth reallocation churn.
- Bounded-peak streaming warmup (process + release per unit so the high-water-mark stays low; periodic GC where it measurably helps).
- Re-enable the hard RSS gate in `tests/bm25-packed-inmemory.vitest.ts` (remove the advisory `SPECKIT_BM25_RSS_GATE` demotion) once the budget holds.

### Out of Scope
- BM25 scoring/ranking math and field weights - frozen; output must be byte-identical (parity-gated).
- The packed-postings on-disk/in-memory layout - retained heap already meets budget.
- The pre-existing hybrid-search fallback scope-then-limit bug - tracked separately as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Modify | Reduce warmup/tokenization transient allocation; preserve ranking |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Modify | Re-enable the hard RSS budget assertion once it holds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Realistic-fixture packed warmup RSS spike stays within the 150MB budget | The realistic-corpus warmup test measures peak RSS spike <= 150MB with the hard gate re-enabled |
| REQ-002 | BM25 ranking output is unchanged by the churn reduction | Existing packed-BM25 + hybrid-search ranking/parity suites stay green (no score or ordering change) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Warmup latency stays within budget after the change | Warmup completes within the existing 10s budget on the realistic fixture |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Realistic-fixture warmup peak RSS spike <= 150MB, asserted by the re-enabled hard gate.
- **SC-002**: Packed-BM25 and hybrid-search suites green with byte-identical ranking (no parity regression).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | V8 commits pages from peak transient allocation and does not decommit in-run | High | Lower the peak allocation rate (field-by-field tokenization, buffer reuse, bounded streaming) rather than relying on post-hoc GC |
| Risk | Allocation changes alter tokenization output and shift ranking | High | Parity-gate against the existing oracle suites; freeze scoring math |
| Dependency | 014 realistic RAM fixture + advisory gate | Available | This phase consumes and re-enables them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: ≤150MB was reached (136.5MB peak-sampled) by changing the packed-postings layout (no-copy chunked postings + Uint8→16→32 typed promotion) while keeping ranking byte-identical — the operator-sanctioned "may touch the frozen layout if parity holds" path. No metric amendment or minisearch dependency was needed. Deep review added peak-sampling to the RSS gate and direct width-promotion boundary coverage.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
