---
title: "Packet 126: deep-agent-improvement evaluator hardening"
description: "Level 3 specification for scorer reproducibility, promotion gates, dedup hardening, mirror coverage, and dashboard transparency."
trigger_phrases:
  - "packet 126"
  - "deep-agent-improvement evaluator hardening"
  - "DAI-001"
  - "DAI-005"
  - "DAI-012"
  - "DAI-022"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/006-deep-agent-improvement/006-evaluator-hardening"
    recent_action: "Implemented packet 126 evaluator hardening and authored Level 3 docs."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run final strict validation and hand off for commit."
---
# Packet 126: deep-agent-improvement evaluator hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 126 hardens the `deep-agent-improvement` evaluator after packets 124 and 125 repaired correctness and documentation truth. The packet closes six P1 items: named promotion gates, reproducible score hashing/cache, mutation-signature empty-field safety, evaluator-level runtime mirror coverage warning, candidate proposal content-hash dedup, and dashboard visibility for unscored dimensions.

The central decision is ADR-001, the Evaluator Reproducibility Contract. The scorer now emits a rubric version and SHA-256 input hash, promotion thresholds live in a shared named map, and null dimensions remain visible in both score output and dashboard output instead of being averaged away.

Critical dependencies are packet 123's roadmap, packet 124's null-dimension precedent, packet 122's content-hash dedup pattern, and packet 121's convergence transparency pattern.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
| --- | --- |
| Level | 3 |
| Status | Complete |
| Priority | P1 |
| Date | 2026-05-23 |
| Spec Folder | `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/006-evaluator-hardening/` |
| Target Skill | `.opencode/skills/deep-agent-improvement/` |
| Source Roadmap | `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/003-recommendations/improvement-roadmap.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 123 identified that DAI evaluator output was not robust enough for repeated comparison across candidates and sessions. Promotion had threshold values embedded in script logic and config fallbacks; scoring lacked an input-hash determinism contract; mutation signatures could collide when different fields were empty; runtime mirror coverage was only a downstream promotion concern; proposal storage lacked content-hash dedup; and the dashboard did not clearly surface dimensions that packet 124 made `null`.

The purpose is to make evaluator artifacts comparable, inspectable, and resistant to duplicate or partial evidence without implementing packet 127's full four-runtime sync gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- DAI-001: named per-dimension promotion gate map wired into scoring and promotion.
- DAI-005: scorer input hash, cache lookup, and `--no-cache` opt-out.
- DAI-012: mutation signature sentinel values for empty/null fields.
- DAI-022: evaluator-level runtime mirror coverage checkpoint and warning.
- Packet 122/DR-005 pattern: SHA-256 content-hash dedup for candidate proposal lineage.
- Packet 121/DR-003 pattern: dashboard section listing unscored dimensions.
- Level 3 packet documentation and ADR-001.

### Out of Scope

- Full cross-runtime mirror write/sync gate. Packet 127 owns enforcement.
- Changes to `deep-loop-runtime`, `deep-review`, `deep-research`, packets 127/128, or DAI `README.md`.
- Direct edits to `/improve` command YAML files.
- New scoring dimensions beyond the existing 5D rubric.

### Files to Change

| File Path | Change Type | Description |
| --- | --- | --- |
| `.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs` | Create | Shared named gate constants and evaluator. |
| `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs` | Modify | Input hashing/cache, gate metadata, mirror coverage warning. |
| `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs` | Modify | Per-dimension and named benchmark/weighted gate enforcement. |
| `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs` | Modify | Distinct empty-field sentinels in signatures. |
| `.opencode/skills/deep-agent-improvement/scripts/candidate-lineage.cjs` | Modify | Candidate content-hash dedup with duplicate ledger. |
| `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` | Modify | Dashboard unscored dimension surfacing. |
| `.opencode/skills/deep-agent-improvement/scripts/tests/*.vitest.ts` | Modify/Create | Regression coverage for reproducibility, dedup, and dashboard transparency. |
| `.opencode/skills/deep-agent-improvement/references/*.md` | Modify | Scoring, promotion, and proposal docs. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/006-evaluator-hardening/*` | Create | Level 3 docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | Codify promotion gates per dimension | `PROMOTION_GATES` maps all five dimensions and promotion rejects failed or unscored gates. |
| REQ-002 | Make scoring reproducible | Score output includes `rubricVersion` and `inputHash`; identical input returns identical score/hash across two runs; `--no-cache` disables cache lookup/write. |
| REQ-003 | Fix mutation signature empty-field collision | Empty/null `dimension`, `mutationType`, `targetSection`, and `body` use distinct field sentinels before hashing. |
| REQ-004 | Add runtime mirror coverage signal | Score output includes `runtimeMirrorCoverage` with expected/considered count and warning when all four mirrors were not considered. |
| REQ-005 | Apply content-hash proposal dedup | Candidate lineage computes SHA-256 over normalized rubric-stripped content and stores duplicates separately. |
| REQ-006 | Surface unscored dimensions | Reducer dashboard lists null-scored dimensions under "Unscored Dimensions". |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All six P1 deliverables have code and/or reference-doc changes.
- SC-002: Modified `.cjs` files pass `node --check`.
- SC-003: Direct smoke test validates DAI-005, DAI-012, candidate content-hash dedup, and dashboard unscored dimensions.
- SC-004: Existing Vitest files are attempted; unavailable runner/network is recorded honestly.
- SC-005: `validate.sh <packet> --strict` exits 0 with no warnings.
- SC-006: `implementation-summary.md` includes the requested Commit Handoff section.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| --- | --- | --- | --- |
| Dependency | Packet 124 null scoring | High | Build dashboard visibility on `score: null` and `unscoredDimensions`. |
| Dependency | Packet 122 content hash precedent | Medium | Hash normalized full proposal content, not fuzzy similarity. |
| Risk | Cache staleness from volatile scanner/profile fields | Medium | Strip timestamps/generatedAt from the input hash. |
| Risk | Gate thresholds become policy drift | Medium | Centralize values in `lib/promotion-gates.cjs` and document them. |
| Risk | Mirror coverage warning confused with sync enforcement | Medium | Name it coverage-only and leave full gate to packet 127. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-001 | Determinism | Same rubric/config/content/integration inputs produce the same input hash and score. |
| NFR-002 | Transparency | Null dimensions are visible in score output, registry state, and dashboard markdown. |
| NFR-003 | Scope Control | No writes outside packet 126 docs and the allowed DAI skill subpaths. |
| NFR-004 | Compatibility | Preserve existing function signatures; return values may gain fields but calls remain valid. |
| NFR-005 | Verifiability | Regression checks must be runnable without external services. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Candidate has identical body but different frontmatter: content hash dedup treats it as duplicate.
- Candidate contains rubric comments: hash strips rubric metadata before normalization.
- Mutation has missing `dimension` and another has missing `mutationType`: signatures remain distinct.
- Integration scanner returns no mirror array: scorer emits a warning rather than failing the score.
- A dimension has `score: null`: dashboard lists it as unscored and does not use it in latest/best math.
- Cache directory is absent: scorer creates it on first write.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
| --- | ---: | --- |
| Scope | 18/25 | Multiple evaluator scripts and references. |
| Risk | 18/25 | Scoring and promotion are trust boundaries. |
| Research | 15/20 | Requires packet 121/122/123/124 precedents. |
| Multi-Agent | 5/15 | No sub-dispatch; evaluator artifacts affect later agents. |
| Coordination | 12/15 | Packet 127 dependency boundary must remain explicit. |
| Total | 68/100 | Level 3 |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- | --- |
| R-001 | Cache hides changed integration state | Medium | Include sanitized integration report in the input hash. |
| R-002 | Per-dimension gates block previously acceptable candidates | Medium | Gates apply to promotion, not basic scoring visibility. |
| R-003 | Duplicate content hash over-dedupes candidates | Medium | Hash normalized full content after only rubric/frontmatter stripping. |
| R-004 | Dashboard undercounts unscored dimensions | Low | Avoid double-counting when both dimensions and `unscoredDimensions` are present. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Reproducible Scoring

As a DAI operator, I want identical candidate inputs to produce the same score hash and score, so that repeated evaluator runs are comparable.

Acceptance: two runs against identical candidate content and config produce the same `inputHash`, `score`, and dimension output.

### US-002: Promotion Gate Clarity

As a maintainer, I want promotion thresholds in one named map, so that changing a gate is a policy edit rather than a script archaeology exercise.

Acceptance: all five dimensions appear in `PROMOTION_GATES`, and promotion rejects any failed or unscored dimension.

### US-003: Transparent Partial Evidence

As a reviewer, I want unscored dimensions listed in the dashboard, so that convergence does not hide missing checks.

Acceptance: reducer output contains an "Unscored Dimensions" section when any dimension score is null.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Packet 127 must decide whether runtime mirror coverage becomes a hard promotion gate or a pre-promotion sync action.
- A later packet may choose whether score caches should be stored packet-locally instead of under the OS temp directory.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Implementation plan: `plan.md`
- Task list: `tasks.md`
- Verification checklist: `checklist.md`
- Decision record: `decision-record.md`
- Implementation summary: `implementation-summary.md`
