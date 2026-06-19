---
title: "Feature Specification: Deep Research Reducer-Anchor Template Fix (028/004 ship-first correctness)"
description: "The shipped deep_research_strategy.md template carried none of the 7 ANCHOR markers the deep-research reduce-state reducer requires, so the reducer hard-failed Missing anchor section on the first reduce after iteration 1. Wrap the seven reducer-owned headings in their anchor pairs so a freshly-copied strategy reduces deterministically. Template-only, no runtime change."
trigger_phrases:
  - "reducer anchor fix"
  - "deep research strategy template anchors"
  - "Q6 anchor"
  - "missing anchor section"
  - "reduce-state hard fail"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/001-reducer-anchor-fix"
    last_updated_at: "2026-06-19T08:10:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-1 impl sub-phase for the DONE Q6-anchor reducer template fix (commit 738e118751)"
    next_safe_action: "None — candidate is COMPLETE; this sub-phase records it against its 030 commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-001-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep Research Reducer-Anchor Template Fix (028/004 ship-first correctness)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `028-memory-search-intelligence/004-deep-loop` (Deep Loop — convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md`; `../../research/roadmap.md`; `../../research/synthesis/01-go-candidates.md` + `03` + `04` |
| **Shipped-record cross-ref** | `030-memory-search-intelligence-impl/spec.md` §14 candidate 1 (commit `738e118751`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-research loop folds cross-iteration state by rewriting anchored sections of a per-run strategy file. `updateStrategyContent` (`reduce-state.cjs:734-745`) calls `replaceAnchorSection` for **7** reducer-owned sections — `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`. `replaceAnchorSection` (`:699-714`) builds a regex over the `ANCHOR:<id>` … `/ANCHOR:<id>` HTML-comment marker pair and **throws `Missing anchor section <id> in strategy file` (`:709-711`)** when the pair is absent. The shipped template `deep-loop-workflows/deep-research/assets/deep_research_strategy.md` carried all 13 section headings and a machine-owned start marker but **ZERO `ANCHOR:*` markers** (grep count = 0). A freshly-copied strategy therefore hard-failed `Missing anchor section key-questions in strategy file` on the **first reduce** after iteration 1. [CONFIRMED iter-1 F16-18; research.md §"Reducer-anchor template gap — CONFIRMED REAL BUG".]

This is a workflow-level **correctness defect, not a cosmetic gap**: a reducer that hard-fails on a fresh strategy is non-deterministic at the loop level — the loop cannot reliably fold state. This session's own deep-research driver hit the throw firsthand and hand-patched the 7 anchor pairs into its working copy (`004-deep-loop/research/deep-research-strategy.md`, 8 anchor markers present today) — self-evidence of the bug. [CONFIRMED iter-4 F-Q7b.]

### Purpose

Wrap each of the 7 reducer-owned headings in its `ANCHOR:<id>` … `/ANCHOR:<id>` HTML-comment marker pair in the shipped strategy template, so a freshly-copied strategy file reduces deterministically and the reducer never throws `Missing anchor section` on a clean run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the single ship-first correctness candidate

| ID | Candidate | One-line | Seam | Eff | Status |
|----|-----------|----------|------|-----|--------|
| Q6-anchor | **Reducer-anchor template FIX** | wrap the 7 reducer-target headings (`key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`) in `ANCHOR:*` marker pairs in the shipped strategy template | template `deep_research_strategy.md` vs `reduce-state.cjs:699-745` | S (near-zero) | **DONE** — commit `738e118751` |

This is the deep-loop roadmap's **rank-1 candidate and the only unconditional ship-first win**: a confirmed correctness defect, near-zero effort/risk, template-only, **no runtime-code change, no dependencies**. The build order is `Q6-anchor FIX (ship first) → D2 → D3 → Q2 → D1`; everything after Q6-anchor depends on the absent D2 reliability signal and is NO-GO until built and benchmarked (sibling sub-phases of `004-deep-loop`, not here). [research.md §"Top-5 Ranked + Build Order"; roadmap.md §"Wave-0 spearhead".]

### Out of Scope (documented, NOT built this sub-phase)

- **Any runtime-code change to `reduce-state.cjs`.** The fix is purely the template; the reducer regex is the spec the template must satisfy, not something to alter.
- **The other 13 reducer anchors** (`overview`, `status`, `progress`, `questions`, `uncovered-questions`, `trend`, `dead-ends`, `next-focus`, `active-risks`, …) the reducer writes elsewhere (`reduce-state.cjs:785+`). Only the **7** `updateStrategyContent` targets (`:734-745`) are the hard-failure surface; they are the complete scope of this candidate. [CONFIRMED: the throw originates only from the `updateStrategyContent` path.]
- **D1 / D2 / D3 / Q2 and the rest of the deep-loop candidate catalog** — D2-reliability is a wholly-absent net-new build (every input is `r=0.5` today), so D3 is NOT a no-op and Q2 is NO-GO until D2 exists. These ship in sibling impl sub-phases of `004-deep-loop` after this fix, not here. [research.md Broadening Addendum.]
- Modifying the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modify | Add the 7 `ANCHOR:<id>` / `/ANCHOR:<id>` HTML-comment marker pairs around the reducer-owned headings (template-only; +14 marker lines). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 reducer-owned headings are anchor-wrapped in the shipped template | The template `deep_research_strategy.md` contains a matching `ANCHOR:<id>` … `/ANCHOR:<id>` HTML-comment pair for each of `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus` (the exact ids `updateStrategyContent` passes at `reduce-state.cjs:734-745`). [research: iter-1 F16-18] |
| REQ-002 | The reducer regex matches a fresh copy without throwing | For each of the 7 ids, `replaceAnchorSection`'s regex over the `ANCHOR:<id>` … `/ANCHOR:<id>` marker pair matches the shipped template — i.e. a freshly-copied strategy reduces past iteration 1 without raising `Missing anchor section`. [seam: `reduce-state.cjs:699-714`] |
| REQ-003 | Template-only; no runtime-code change | The diff touches only `deep_research_strategy.md`; `reduce-state.cjs` and every other runtime file are unchanged. [research: §"Verdict legend: FIX … no runtime-code change"] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shipped strategy template carries exactly the 7 reducer-owned anchor pairs (14 `ANCHOR:` markers), matching the already-correct shape of this session's hand-patched working copy. [VERIFIED: template grep = 14 `ANCHOR:` markers, all 7 ids present.]
- **SC-002**: A fresh strategy copy reduces deterministically — the reducer never throws `Missing anchor section` on the first reduce. [VERIFIED: each of the 7 ids matches the `replaceAnchorSection` regex.]
- **SC-003**: The change is template-only and independently reversible (a single 14-line additive hunk). [VERIFIED: commit `738e118751` touches only the template + scaffolds the 030 record.]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An anchor id typo would silently keep the reducer throwing | High (reducer still hard-fails) | Ids copied verbatim from the `updateStrategyContent` call sites (`reduce-state.cjs:734-745`) and verified to match the `replaceAnchorSection` regex for all 7 |
| Risk | Wrapping a heading could shift other reducer anchors | Low (template-only) | Only the 7 `updateStrategyContent`-target headings are wrapped; the additive markers do not move or rename existing headings |
| Dependency | `reduce-state.cjs` anchor regex contract | None — contract is fixed | The reducer regex is the spec; the template is edited to satisfy it, not vice-versa |
| Dependency | D2 reliability signal (for D1/D3/Q2) | None for this candidate | Q6-anchor is fully independent; everything that depends on D2 is out of scope and ships later |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The candidate is a confirmed, scoped, template-only fix and is already DONE (commit `738e118751`). The remaining deep-loop open questions (D3 threshold re-baselining, the 001 content-derived ordering call site, non-prompt-pack continuity paths) belong to the D2/D3/Q2 cluster, not to this sub-phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent research**: `../research/research.md` (Deep Loop external-mining synthesis; §"Reducer-anchor template gap — CONFIRMED REAL BUG", Q6 in §"Key Questions — Answers").
- **Cross-cutting roadmap**: `../../research/roadmap.md` (§"a near-zero-effort correctness FIX"; Wave-0 spearhead rank-1); `../../research/synthesis/01-go-candidates.md`; `03-corrections-caveats-and-residuals.md`; `04-sibling-and-cross-cutting.md`.
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 candidate 1 (commit `738e118751` — "7 anchor pairs added; reducer regex verified (all 7 match)").
