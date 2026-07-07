---
title: "Feature Specification: Apply 015/005 metadata fixes and re-run the seeded sweep"
description: "Apply the top-8 audit recommendations from 015/005 to skill graph-metadata.json and SKILL.md descriptions, invalidate the embedding cache, re-run the 7-vector seeded sweep, compare to the 015/004 baseline."
trigger_phrases:
  - "skill metadata fixes apply"
  - "post-audit metadata refresh"
  - "advisor seeded resweep"
  - "metadata-aware sweep delta"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-metadata-fixes-and-seeded-sweep-rerun"
    last_updated_at: "2026-05-14T01:00:00Z"
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
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001506"
      session_id: "006-apply-metadata-fixes-and-resweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Apply only the top-8 recommendations from 015/005 audit-report.md."
      - "Edit only graph-metadata.json + SKILL.md description; do not touch SKILL.md body or other skill files."
      - "Invalidate the embedding cache for affected skills before re-running the sweep."
      - "Recommendation about lane weight stays advisory; lane-registry.ts unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Apply 015/005 metadata fixes and re-run the seeded sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `006-apply-metadata-fixes-and-resweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015/005 produced a research report (`research/audit-report.md`) ranking the 8 lowest-scoring skills with concrete WHAT/WHY/EXAMPLE phrasing changes. The report is advisory — no skill files were modified. We do not yet know whether applying those changes actually moves the seeded-sweep numbers from 015/004 (V0 baseline: `accuracyTotal 0.6667, todayCorrect 1.0000, intentDescribed 0.3333, flippedFromBaseline 0`).

### Purpose
Apply the audit's top-8 recommendations to the affected skills' `graph-metadata.json` and the `description:` field of their `SKILL.md` frontmatter, invalidate the embedding cache for those skills, re-run the same 7-vector seeded sweep from 015/004, compare against the 015/004 baseline, document whether metadata fixes moved any of the sweep dimensions. If margins move, the cosine lane has empirical room to grow; if numbers stay flat, the conclusion is "current corpus is genuinely lexical-saturated and the cosine lane is not the right knob to turn for these prompts."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read 015/005 `research/audit-report.md` and extract the top-8 recommendations.
- For each affected skill: edit `graph-metadata.json` (specifically `derived.trigger_phrases`, `derived.key_topics`; optionally seed `derived.intent_signals` or `manual.depends_on`/`manual.related_to` when the audit explicitly recommended it) and the `description:` field in `SKILL.md` frontmatter (NOT body).
- Invalidate the embedding cache file under `mcp_server/skill_advisor/tests/scorer/fixtures/.embeddings-cache/` so the next sweep re-embeds the changed skills.
- Re-run `lane-weight-sweep.vitest.ts` and emit fresh markdown report at this packet's `research/sweep-results-after-fixes.md`.
- Cite per-vector deltas vs 015/004 baseline.
- Land a recommendation: stay at 0.05, OR raise/lower to a specific value, OR conclude that metadata fixes alone are not enough.

### Out of Scope
- Modifying any skill's SKILL.md body content (only `description:` in frontmatter).
- Modifying any test file, helper, or scoring lane code.
- Modifying `lane-registry.ts`.
- Adding new skills.
- Editing skills NOT in the top-8 list.
- Changing the corpus (intent-prompt-corpus.ts).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Apply each top-8 recommendation faithfully. | Each affected skill's edited file matches the WHAT/EXAMPLE phrasing from 015/005 audit. |
| REQ-002 | Invalidate embedding cache for affected skills. | The cache file is removed or the affected skills' rows are deleted before the sweep runs. |
| REQ-003 | Re-run the 7-vector sweep with seeded vectors against the same 24-prompt corpus. | Sweep executes; report emitted. |
| REQ-004 | Per-vector deltas vs 015/004 baseline are tabulated. | New report has a "Delta vs 015/004" column for each metric. |
| REQ-005 | Recommendation cites specific deltas. | "Stay at 0.05" or "Raise to X" justified by numbers, not handwave. |
| REQ-006 | Skill files modified count matches expectations. | Count is documented in implementation-summary.md (expected: ≤ 16 files = 8 skills × 2 files). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for this packet.
- **SC-002**: `npm run typecheck` passes from `mcp_server/`.
- **SC-003**: Sweep test passes (or skips cleanly if provider unavailable).
- **SC-004**: New sweep report documents whether ANY vector produced different numbers than 015/004 baseline.
- **SC-005**: `lane-registry.ts` unchanged.
- **SC-006**: Edited skills still pass any existing skill-graph validation (no schema breakage).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Edits break a skill's discovery | Advisor stops routing to that skill | After edits, run `skill_graph_scan` (or its tests) to confirm all 17 skills still parse |
| Risk | Cache invalidation incomplete | Sweep uses stale embeddings, masking delta | Delete the cache file outright before the sweep |
| Risk | Audit phrasing examples were generic | Edits don't materially change embeddings | Skill descriptions get authored from the EXAMPLE block, not from "make it more specific"; if EXAMPLE missing, skip that skill and note it |
| Risk | Production behavior shifts unexpectedly | Live advisor routings change in surprising ways | Recommendation packet is research-style for the WEIGHT decision; metadata edits are real production changes — flag in commit message |
| Dependency | 015/005 audit-report.md exists with top-8 list + EXAMPLE phrasings | Without it, no input | Already on main (commit `441dd0377`) |
| Dependency | 015/004 baseline numbers documented | Without them, no delta | Documented in `004-corpus-seeded-sweep/implementation-summary.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- How to handle a top-8 entry whose EXAMPLE block is too vague to apply mechanically (skip + note).
- Whether to apply intent_signals or manual.depends_on/related_to additions when the audit recommended them (default yes if the recommendation is concrete).
- Whether to update the affected skills' graph-metadata.json `derived.causal_summary` if changing trigger_phrases/key_topics materially shifts the meaning (default no — leave summary alone).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Sweep re-run with cold-cache embeddings completes under 90s. |
| NFR-S01 | Security | No secrets introduced in skill descriptions. |
| NFR-R01 | Reliability | All 17 skills still discoverable post-edits. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Top-8 entry with no EXAMPLE phrasing: skip + note in implementation-summary.md.
- Edit collides with a parallel branch (file modified after audit report was written): use the audit's recommendation; flag in commit if conflict.
- Sweep still produces zero variance: document the finding; conclude "metadata fixes alone are insufficient on this corpus" and recommend either (a) stay at 0.05 or (b) author a harder corpus in a future packet.
- Cache invalidation accidentally drops vectors for non-top-8 skills: re-embed all on next run; under the 90s budget that is acceptable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 100-300 | Edits are mostly small JSON/frontmatter changes; sweep helper is reused as-is |
| **Surface area** | Medium | Affects up to 16 production-visible skill files |
| **Risk** | Medium | Real production metadata changes; rollback is straightforward but observable |
| **Reversibility** | High | Single-commit revert restores all edited skills |
<!-- /ANCHOR:complexity -->
