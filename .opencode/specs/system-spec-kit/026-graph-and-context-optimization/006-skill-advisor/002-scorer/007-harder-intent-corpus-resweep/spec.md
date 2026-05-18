---
title: "Feature Specification: Harder intent-described corpus + sweep against lexical false-positives"
description: "Author 15-25 prompts where the lexical lane mis-routes today, add to the sweep fixture, re-run the seeded sweep, document whether cosine lane materially helps on harder cases."
trigger_phrases:
  - "harder intent prompt corpus"
  - "lexical false positive corpus"
  - "advisor cosine harder sweep"
  - "intent described misroute test"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-harder-intent-corpus-resweep"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001507"
      session_id: "007-harder-intent-corpus-resweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Add NEW prompts to a sibling fixture; do not delete or rewrite the existing 24-prompt corpus."
      - "Author each new prompt by IMAGINING what a lexical-only scorer would mis-route, then capturing the EXPECTED correct skill."
      - "Re-run sweep against the combined corpus (existing + new); per-vector totals will reflect the bigger set."
      - "lane-registry.ts unchanged in this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Harder intent-described corpus + sweep against lexical false-positives

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `007-harder-intent-corpus-resweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015/004 + 015/006 proved that the existing 24-prompt corpus is lexical-saturated: even with audit-improved metadata + real Gemma vectors flowing through the cosine lane at any weight from 0 to 0.30, no candidate vector flipped a single routing decision. The 8 wrong intent-described prompts are wrong for reasons no semantic-similarity weighting can fix on this corpus shape.

The natural next question is: does that mean the cosine lane is useless, OR is the existing corpus simply not testing the lane's actual strength? A harder corpus — specifically prompts where the lexical lane mis-routes — would tell us.

### Purpose
Author 15-25 NEW prompts where the lexical lane is expected to mis-route (because the prompt describes intent without using the target skill's keywords, or uses keywords that match a different skill more strongly). Add them to a sibling fixture file, re-run the seeded sweep against the combined corpus, document whether the cosine lane produces a measurable lift on the harder set.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author a new fixture file `mcp_server/skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` with 15-25 entries.
- Each entry: `{ prompt, expectedSkill, category: 'lexical-mis-route' }`.
- Authoring rule: each prompt must describe intent that the target skill genuinely owns, but use phrasing that the lexical lane would either:
  - Not match at all (no skill keywords)
  - Match a DIFFERENT skill more strongly (decoy lexical signal)
- Modify `lane-weight-sweep.vitest.ts` to run a SECOND sweep over the combined corpus (existing 24 + new harder set).
- Emit `007-harder-intent-corpus-resweep/research/sweep-results-harder.md` with per-vector accuracy on the harder set, deltas vs the original 24-prompt baseline, and per-case routing diffs.
- Recommendation: stay at 0.05, OR raise to a specific value justified by the harder-set deltas.

### Out of Scope
- Modifying `intent-prompt-corpus.ts` (the original 24).
- Modifying `lane-registry.ts`.
- Modifying any skill metadata (sibling packet 015/008 handles that).
- Modifying the cosine lane math.
- Authoring more than 25 entries (over-scoping).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | New fixture file with 15-25 entries. | File exists; entry count in range. |
| REQ-002 | Each entry tagged `category: 'lexical-mis-route'`. | TypeScript type forces it; no other category appears. |
| REQ-003 | Each prompt describes intent the target skill owns. | Manual review: prompt + expected skill pair are coherent. |
| REQ-004 | Sweep runs over BOTH the original 24 AND the new harder set. | Two separate `runLaneWeightSweep` calls in the test, OR one combined call with categories preserved. |
| REQ-005 | Per-vector accuracy on the harder set documented. | Markdown table includes harder-set rows. |
| REQ-006 | Recommendation cites the harder-set numbers. | "Stay at 0.05" or "Raise to X" justified. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: `npm run typecheck` passes.
- **SC-003**: Sweep test passes (or skips cleanly if provider unavailable).
- **SC-004**: Harder-set accuracy is documented per vector.
- **SC-005**: `lane-registry.ts` unchanged.
- **SC-006**: Recommendation explicitly addresses the corpus-saturation hypothesis from 015/006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Authored prompts unintentionally match the target skill via lexical | Test does not actually probe cosine | Spot-check expected-actual pairs; for each entry, mentally verify "would lexical alone get this right?" |
| Risk | Sweep variance still zero on harder set | Cosine lane truly has no impact at any weight | Document the finding; conclude "no realistic weight surfaces cosine value" |
| Risk | Provider unavailable in codex sandbox | Sweep skips like in 015/004 | Skip-not-fail; document |
| Dependency | Existing sweep test from 015/003+004 + helper from 015/004 | Reused as-is | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Exact distribution of skills targeted by harder prompts (try to cover 8-12 distinct skill ids, not all sk-code)
- Whether to include adversarial prompts (e.g., asking for X but using vocabulary of Y)
- Format of the per-skill harder-set breakdown
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Combined sweep (24 + harder) runs under 90s with cold cache. |
| NFR-S01 | Security | No secrets in any prompt. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Prompt is genuinely ambiguous (multiple skills could be right): pick the BEST single skill and document the ambiguity in a comment.
- Sweep variance still zero on harder set: document the finding clearly; that itself is informative.
- Provider unavailable: skip cleanly with documented reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 200-400 | Mostly the new fixture + minor sweep test extension |
| **Surface area** | Small | Test fixtures + one test file |
| **Risk** | Low | Test-only; no production code change |
| **Reversibility** | High | Single-commit revert |
<!-- /ANCHOR:complexity -->
