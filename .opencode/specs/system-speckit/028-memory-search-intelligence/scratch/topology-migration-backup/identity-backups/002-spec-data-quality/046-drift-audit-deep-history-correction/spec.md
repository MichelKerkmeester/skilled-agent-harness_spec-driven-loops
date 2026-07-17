---
title: "Feature Specification: Drift Audit Deep History Correction"
description: "Second-pass correction across four feature areas in this packet: git history shows all four were built, shadow-shipped, benchmarked, and deliberately deleted for cause - not abandoned mid-flight as pass 1's GENUINELY_ABSENT framing implied."
trigger_phrases:
  - "drift audit deep history correction"
  - "028 pass 2 doc correction"
  - "git history reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/046-drift-audit-deep-history-correction"
    last_updated_at: "2026-07-04T17:11:46.692Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec folder for pass-2 doc correction"
    next_safe_action: "Dispatch GPT-5.5-fast to apply the 5 correction items"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "../045-drift-audit-remediation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-deep-history-correction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Tracked as a new sibling phase (009), not nested inside 008, mirroring this packet's own precedent of superseding via a new sibling phase rather than nesting (005-dark-flag-graduation superseding 022-kept-off-flag-resolution)."
      - "Item 2 (seeded-PPR) gets a forward-pointer only, finalized once the parallel 002-code-graph/010-edge-confidence-and-ppr-revisit work produces a real verdict."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Drift Audit Deep History Correction

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-01 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pass 1 of the drift audit corrected four feature docs to say their claimed shipped code was "GENUINELY_ABSENT" from the current tree. That was true but incomplete: git history (verified via `git show`/`git log` against real commit hashes) proves all four were actually built, shadow-shipped, benchmarked against real data, and deliberately deleted for cause. Two of pass 1's own corrections went further and stated the code "was never committed" - that specific claim is factually wrong for two of the four features.

### Purpose
Supplement (not replace) pass 1's corrections with the real history: exact commit hashes, exact measured numbers, and a fix for the two "never committed" factual errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add pass-2 correction notes to the docs for all 4 features (summary-fusion lane, seeded-PPR, C4 shadow-weight promoter, outcome-weighted ranking), citing real commit hashes and real benchmark numbers.
- Fix the two factually-wrong "never committed" claims (C4 promoter, outcome-weighted ranking).
- Fix a dangling link in outcome-weighted ranking's decision-record.md.
- Add a forward-pointer in seeded-PPR's docs to the parallel revisit work in `002-code-graph/010-edge-confidence-and-ppr-revisit`.
- Add a short pointer note in `045-drift-audit-remediation`'s own docs acknowledging this second pass.

### Out of Scope
- Re-implementing any of the 4 features (that decision was made per-feature; only seeded-PPR is being revisited, tracked separately in `002-code-graph/010-edge-confidence-and-ppr-revisit`).
- Finalizing seeded-PPR's verdict (depends on that parallel work completing first).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-speckit-memory/015-summary-fusion-grounding/{spec.md,implementation-summary.md,checklist.md}` | Modify | Add Recall@20 -0.036 + guessed-weight caveat |
| `002-code-graph/005-seeded-ppr-ranking/{spec.md,implementation-summary.md,plan.md,decision-record.md}` + `005-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` | Modify | Forward-pointer to revisit work + exact 0.0000-delta numbers |
| `system-skill-advisor/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior/{decision-record.md,implementation-summary.md,plan.md}` | Modify | Fix "never committed" -> built `10c5b61493`, deleted `8efcde0e6b` |
| `system-skill-advisor/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/{implementation-summary.md,plan.md,spec.md,decision-record.md,checklist.md}` | Modify | Fix pass-1's own wrong "never committed" claim + dangling link + real numbers |
| `045-drift-audit-remediation/{spec.md,implementation-summary.md}` | Modify | Pointer note to this second pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every correction cites a real, verified commit hash and real measured numbers | Re-read post-edit, no vague "it was cut" phrasing remains where a specific number/hash exists |
| REQ-002 | The two "never committed" factual errors are fixed | Both docs now say built-then-deleted with commit hashes, not "never committed" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Seeded-PPR docs get a forward-pointer, not a final verdict | Docs say "revisit in progress" pointing at the 010 folder, not a resolved outcome |
| REQ-004 | Dangling link in outcome-weighted ranking's decision-record.md fixed | Points at `001-speckit-memory/022-kept-off-flag-resolution/`, the real folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 correction items applied and independently re-verified.
- **SC-002**: No remaining "never committed" claim for the C4 promoter or outcome-weighted ranking.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-code-graph/010-edge-confidence-and-ppr-revisit` must produce a verdict before seeded-PPR's docs can be finalized | Docs would carry a stale "in progress" note if never revisited | Tracked as a follow-up task; forward-pointer is explicitly provisional |
| Risk | Worktree isolation required since this dispatch touches the same shared conventions as pass 1 | Same RM-8-class risk as before | Reuse the same worktree-isolation pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable - documentation-only changes.

### Security
- **NFR-S01**: No destructive shell commands in any dispatch; worktree-isolated same as pass 1.

### Reliability
- **NFR-R01**: Every correction independently re-verified before being considered final.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A doc with no pass-1 correction yet (summary-fusion's implementation-summary.md) gets a fresh correction, not a supplement to a nonexistent one.

### Error Scenarios
- If the parallel PPR revisit work isn't done yet when this pass runs: leave the forward-pointer provisional, do not fabricate a verdict.

### State Transitions
- Once the PPR revisit work completes, its real verdict replaces the provisional forward-pointer (tracked as a follow-up task, not part of this pass's completion criteria).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~18 files across 5 correction items, all documentation |
| Risk | 5/25 | Docs-only, worktree-isolated, no shared production code touched |
| Research | 5/20 | Already completed in the planning phase (commit hashes, numbers verified) |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this pass. Seeded-PPR's final verdict is tracked as a follow-up once `002-code-graph/010-edge-confidence-and-ppr-revisit` completes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Prior pass**: `../045-drift-audit-remediation/`
- **Parallel revisit work**: `../../../../system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/`
- **Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
