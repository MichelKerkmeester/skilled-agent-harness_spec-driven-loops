---
title: "Implementation Plan: Deep Research Reducer-Anchor Template Fix (028/004)"
description: "Template-only fix: add the 7 reducer-owned ANCHOR marker pairs to the shipped deep_research_strategy.md so reduce-state.cjs stops hard-failing Missing anchor section on the first reduce. No runtime-code change, no dependencies. Already landed in commit 738e118751."
trigger_phrases:
  - "reducer anchor fix plan"
  - "deep research strategy template plan"
  - "Q6 anchor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/001-reducer-anchor-fix"
    last_updated_at: "2026-06-19T08:10:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-1 plan for the DONE Q6-anchor reducer template fix"
    next_safe_action: "None, candidate is COMPLETE (commit 738e118751)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-001-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research Reducer-Anchor Template Fix (028/004)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown template consumed by Node.js (`.cjs`) reducer |
| **Framework** | deep-loop-runtime / deep-loop-workflows deep-research mode |
| **Storage** | None (per-run strategy file copied from the shipped template) |
| **Testing** | `node --check` + reducer regex match against the 7 anchor ids |

### Overview

Add the 7 reducer-owned `ANCHOR:<id>` / `/ANCHOR:<id>` HTML-comment marker pairs to the shipped `deep_research_strategy.md` template so that `reduce-state.cjs`'s `replaceAnchorSection` regex matches each section on a freshly-copied strategy. This stops the reducer hard-failing `Missing anchor section key-questions` on the first reduce after iteration 1. The change is purely the template. The reducer regex is the fixed contract the template is edited to satisfy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (the 7-anchor gap is CONFIRMED against `reduce-state.cjs:699-745`)
- [x] Success criteria measurable (14 `ANCHOR:` markers present, all 7 ids match the reducer regex)
- [x] Dependencies identified (none, fully independent of D2/D3/Q2)

### Definition of Done
- [x] All acceptance criteria met (REQ-001/002/003)
- [x] Reducer regex verified to match all 7 ids on the shipped template
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-satisfies-contract. The reducer (`reduce-state.cjs`) owns a fixed regex contract. The shipped strategy template is the artifact edited to satisfy it. No code-path change.

### Key Components
- **`deep_research_strategy.md` (shipped template)**: the artifact copied per run. Must carry the 7 anchor pairs.
- **`reduce-state.cjs` `updateStrategyContent` (`:734-745`)**: calls `replaceAnchorSection` for the 7 reducer-owned ids, the consumer the template must satisfy (unchanged).
- **`replaceAnchorSection` (`:699-714`)**: builds a regex over the `ANCHOR:<id>` … `/ANCHOR:<id>` marker pair and throws `Missing anchor section` (`:709-711`) on absence, the defining contract.

### Data Flow
Run start copies the shipped template → iteration 1 produces findings → first reduce calls `updateStrategyContent` → `replaceAnchorSection` rewrites each of the 7 anchored sections in place. Without the markers the first reduce throws. With them it folds deterministically.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a `fix_bug` change planned from the 028 deep-loop research's CONFIRMED reducer-anchor defect.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_research_strategy.md` (shipped template) | producer of the per-run strategy file | update, add the 7 anchor pairs | grep for the open-marker comment = 14. All 7 ids present |
| `reduce-state.cjs` `replaceAnchorSection`/`updateStrategyContent` | consumer (regex contract) | unchanged, it is the spec the template satisfies | `rg -n 'replaceAnchorSection\(updated' reduce-state.cjs` → 7 calls, ids unchanged |
| `004-deep-loop/research/deep-research-strategy.md` | this session's hand-patched working copy (self-evidence) | not a consumer, reference shape only | already carries the anchor pairs (8 markers), confirms the target shape |

Required inventories:
- Reducer-target ids: `rg -n "replaceAnchorSection\(updated, '" reduce-state.cjs` → the 7 ids (`key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`).
- Template marker presence: grep the strategy template for both the `ANCHOR:<id>` open and `/ANCHOR:<id>` close comments → matching open/close pair per id.
- Algorithm invariant: for each id, the reducer regex over the `ANCHOR:<id>` … `/ANCHOR:<id>` marker pair must match exactly once. Adversarial case = a stray/typo'd id leaves the reducer throwing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the 7 reducer-target ids and call sites in `reduce-state.cjs:734-745`
- [x] Confirm the shipped template carried ZERO anchor markers (grep count = 0 pre-fix)
- [x] Reference the hand-patched working copy for the correct target shape

### Phase 2: Core Implementation
- [x] Wrap each of the 7 reducer-owned headings in its `ANCHOR:<id>` … `/ANCHOR:<id>` HTML-comment pair
- [x] Preserve all existing headings and the `<!-- MACHINE-OWNED: START -->` marker (additive only)

### Phase 3: Verification
- [x] Verify all 7 ids match the `replaceAnchorSection` regex
- [x] Confirm template-only diff (no runtime-code change)
- [x] Confirm independently reversible (single 14-line additive hunk)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Template carries 14 `ANCHOR:` markers. All 7 ids present | `rg -c` / `rg -n` |
| Contract | Each of the 7 ids matches `replaceAnchorSection`'s regex (no `Missing anchor section` throw on a fresh copy) | reducer regex match (manual / scripted) |
| Manual | A fresh deep-research run reduces past iteration 1 without the throw | deep-research loop dry-run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `reduce-state.cjs` anchor regex contract | Internal | Green (fixed contract) | None, the template is edited to satisfy it |
| D2 reliability signal (D1/D3/Q2 cluster) | Internal | N/A for this candidate | None, Q6-anchor is fully independent and ships first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reducer still throws `Missing anchor section`, or an anchor id is mismatched.
- **Procedure**: Revert the single template hunk (commit `738e118751` touches only `deep_research_strategy.md` plus the 030 scaffold). The change is additive and isolated. Reverting restores the prior template with zero runtime-code impact.
<!-- /ANCHOR:rollback -->
