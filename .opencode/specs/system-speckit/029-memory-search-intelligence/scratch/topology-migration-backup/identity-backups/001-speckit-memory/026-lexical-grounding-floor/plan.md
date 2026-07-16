---
title: "Implementation Plan: Lexical-Grounding Floor and Single-Hit Corroboration [template:level_2/plan.md]"
description: "Gate good and cite_results on a lexical-grounding floor and require single-hit corroboration in assessRequestQuality, reusing the lexical signal already on the result rows and the citation policy already derived from the label, both behind a single default-OFF flag, with a verdict-level vitest over the off-corpus anchor and the aligned good queries."
trigger_phrases:
  - "lexical grounding floor"
  - "single hit corroboration"
  - "off corpus false relevance"
  - "citation grounding floor"
  - "assess request quality corroboration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/026-lexical-grounding-floor"
    last_updated_at: "2026-07-04T17:50:59.665Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified the floor gate, the corroboration guard and the flag"
    next_safe_action: "Graduate the flag after a wider validation pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-lexical-grounding-floor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Lexical-Grounding Floor and Single-Hit Corroboration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server, `lib/search` verdict path |
| **Framework** | spec-kit memory search confidence scoring and the search-results formatter |
| **Storage** | None added, the lexical signal is already on the result rows |
| **Testing** | A verdict-level vitest over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF |

### Overview
This phase changes only the verdict gate. It adds a lexical-grounding floor and a single-hit corroboration guard to `assessRequestQuality` in `confidence-scoring.ts`, both gated by a single default-OFF flag `SPECKIT_LEXICAL_GROUNDING_V1` read from `search-flags.ts`. The floor denies good when the top hit carries no query-term or BM25 overlap above the configured floor, reusing the `fts_score`/`bm25_score`/`keyword` signal already populated on the rows. The corroboration guard requires a second above-threshold hit before good is reached through either the margin path or the `qualityRatio`-on-a-lone-hit path, per the 030 rank 4 verification refinement. The cite_results policy follows for free because `deriveCitationPolicy` (`search-results.ts:368-370`) already derives the policy from the gated label, so no formatter edit is needed. With the flag OFF the verdict is byte-for-byte the shipped behavior, so existing spec docs and their stored prose statuses read the current contract until the flag flips.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded branch inside an existing verdict function. The floor and the corroboration guard sit inside `assessRequestQuality`, read the lexical signal already on the rows, and are wrapped by a single default-OFF flag so the shipped path is unchanged when the flag is OFF. No new lens, no new query, no new DB read.

### Key Components
- **`assessRequestQuality` floor branch**: before awarding good through either the top-dominant, the margin or the `qualityRatio` branch, require the top hit to clear the lexical-grounding floor. Absent or zero lexical overlap fails closed to weak or gap.
- **`assessRequestQuality` corroboration branch**: require a second above-threshold hit before good is reachable through the margin path or the `qualityRatio`-on-a-lone-hit path, so a single off-corpus result with a zero top-margin cannot reach good.
- **`search-flags.ts` flag reader**: `SPECKIT_LEXICAL_GROUNDING_V1`, default OFF, resolving an unparseable value to OFF, alongside the existing `isResultConfidenceEnabled`.
- **`deriveCitationPolicy`**: unchanged, it already maps the gated label to cite_results or do_not_cite_results.
- **`lexical-grounding-floor.vitest.ts`**: the verdict-level proof over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF.

### Data Flow
The search pipeline populates `fts_score`/`bm25_score`/`keyword` on each raw row, the formatter exposes it as the lexical signal at `search-results.ts:915`, and `assessRequestQuality` already receives the scored results. The floor reads the top hit's lexical signal off that already-present field, the corroboration guard counts above-threshold hits over the same results array, the flag wraps both, and the existing `deriveCitationPolicy` derives cite_results from the resulting label with no change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assessRequestQuality` good gate (`confidence-scoring.ts:471-478`) | Awards good from `topScore`, `qualityRatio` and `topMargin` with no lexical input | add a lexical-grounding floor that denies good when the top hit carries no query-term or BM25 overlap above the floor, gated by the default-OFF flag | with the flag ON the kubernetes off-corpus sample scores weak or gap, an aligned good query with overlap still scores good, and with the flag OFF the verdict is unchanged |
| `assessRequestQuality` margin and ratio branches (`confidence-scoring.ts:476-484`) | A lone above-floor hit produces the largest margin, and a single result reaches good through `qualityRatio` with a zero margin | add a single-hit corroboration guard requiring a second above-threshold hit before good is reachable through the margin path or the `qualityRatio`-on-a-lone-hit path, gated by the flag | with the flag ON a single-result zero-margin sample scores weak, a two-hit corroborated query at the same top score scores good, and both branches are exercised |
| `computeMargin` and `topMargin` (`confidence-scoring.ts:309-312`) | A plain first-minus-second with no corroboration, returns 0 for a single result | no change, the corroboration guard sits in the caller and reads the same results array | grep shows `computeMargin` unedited and the guard added in `assessRequestQuality` only |
| `SPECKIT_LEXICAL_GROUNDING_V1` flag (`search-flags.ts`) | Does not exist | add a default-OFF flag reader alongside `isResultConfidenceEnabled`, resolving an unparseable value to OFF | the flag defaults OFF, an unset env leaves the verdict shipped-identical, and a misconfigured value does not throw |
| `deriveCitationPolicy` (`search-results.ts:368-370`) | Maps `label === 'good'` to cite_results, else do_not_cite_results | no change, cite_results follows the gated label automatically | grep shows `deriveCitationPolicy` unedited and do_not_cite_results returned for the gated kubernetes sample |
| Lexical signal on the rows (`search-results.ts:915`) | Already populates `fts_score`/`bm25_score`/`keyword` on each raw row | no change, the floor reads the existing field | grep shows the lexical field present and read by the floor with no new query added |
| Existing spec docs carrying the current verdict prose | Document the shipped good-cites-off-corpus behavior | no change, the default-OFF flag keeps the shipped behavior so the prose statuses stay accurate until the flag flips | with the flag OFF the kubernetes sample still scores good, so no existing doc is contradicted before graduation |
| `lexical-grounding-floor.vitest.ts` | Does not exist | create the verdict-level proof over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF, asserting a cosine profile not a literal cosine | the test runs green, the flag-OFF cases assert the shipped behavior, and no test pins an embedder-specific cosine |

Required inventories:
- Same-class producers: `rg -n 'assessRequestQuality|deriveCitationPolicy|requestQuality.label' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of the changed verdict: `rg -n 'cite_results|citationPolicy|requestQuality' .opencode/skills/system-spec-kit/mcp_server/formatters`.
- Lexical-signal producers: `rg -n 'fts_score|bm25_score|sourceScores' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag OFF (shipped), flag ON off-corpus, flag ON aligned-good, flag ON correctly-weak, flag ON single-result zero-margin, flag ON two-hit corroborated, absent lexical signal, unparseable flag value.
- Algorithm invariant: with the flag ON good requires both lexical grounding above the floor and corroboration on the margin and ratio paths, with the flag OFF the verdict is byte-for-byte the shipped behavior, and the cite_results policy always follows the label with no formatter change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the lexical signal `fts_score`/`bm25_score`/`keyword` is on the scored results reaching `assessRequestQuality`, and decide how the floor reads it off the top hit
- [x] Add the `SPECKIT_LEXICAL_GROUNDING_V1` default-OFF flag reader to `search-flags.ts`, resolving an unparseable value to OFF
- [x] Confirm `deriveCitationPolicy` needs no edit because cite_results already follows the label
- [x] Pull the 030 off-corpus anchor, the aligned good queries and the correctly-weak authentication case as the validation set

### Phase 2: Core Implementation
- [x] Add the lexical-grounding floor to `assessRequestQuality`, denying good when the top hit carries no overlap above the floor, gated by the flag, failing closed on an absent or zero signal
- [x] Add the single-hit corroboration guard requiring a second above-threshold hit before good is reachable through the margin path or the `qualityRatio`-on-a-lone-hit path, gated by the flag
- [x] Keep the flag-OFF path byte-for-byte the shipped behavior, with the new branches reachable only when the flag is ON
- [x] Author `lexical-grounding-floor.vitest.ts` over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, asserting a cosine profile, flag ON and flag OFF

### Phase 3: Verification
- [x] With the flag ON the kubernetes off-corpus sample scores weak or gap and returns do_not_cite_results
- [x] With the flag ON a single-result zero-margin sample scores weak and a two-hit corroborated query at the same top score scores good
- [x] With the flag OFF the kubernetes sample still scores good, proving the dark default leaves the shipped contract and the spec-doc prose statuses untouched
- [x] The aligned good queries still score good and the authentication case still scores weak with the flag ON
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `assessRequestQuality` floor and corroboration branches, the margin path and the `qualityRatio`-on-a-lone-hit path each exercised, an absent lexical signal failing closed | `tests/lexical-grounding-floor.vitest.ts` |
| Integration | Flag OFF returns the shipped verdict and cite_results, flag ON denies the off-corpus sample and the lone hit, `deriveCitationPolicy` follows the gated label | the same vitest driving the verdict and the citation policy together |
| Manual | Confirm the floor and the corroboration thresholds separate the off-corpus anchor from the aligned good queries on the 030 fixture cosine profile | inspection of the validation set against the floor |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The lexical signal `fts_score`/`bm25_score`/`keyword` on the result rows | Internal | Green | Already populated at `search-results.ts:915`, the floor reads it with no new query |
| `deriveCitationPolicy` deriving cite_results from the label | Internal | Green | Already shipped at `search-results.ts:368-370`, so the policy follows the gated label with no edit |
| The 030 off-corpus fixture and false-confirm driver (recs 1 and 2) | Internal | Yellow | The floor cannot be validated against a measured off-corpus class until that fixture lands, so the flag stays OFF until then |
| A non-regressing run on the aligned good queries and the authentication case | Internal | Yellow | The flag graduates to ON only after this validation passes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The floor over-denies an aligned good query, or the corroboration guard drops a legitimately dominant single result.
- **Procedure**: Leave the flag OFF, the default, which restores the byte-for-byte shipped behavior with no code revert. If the branches must be removed, delete the two guarded blocks in `assessRequestQuality` and the flag reader in `search-flags.ts`. No data migration is involved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Flag defaults OFF and the OFF path proven byte-for-byte the shipped verdict
- [x] Off-corpus denial and aligned-good non-regression proven with the flag ON
- [x] The single-result zero-margin lone-hit case proven to score weak

### Rollback Procedure
1. Leave `SPECKIT_LEXICAL_GROUNDING_V1` OFF, the default, to restore the shipped behavior with no code change
2. If removing the code, delete the floor branch and the corroboration guard in `assessRequestQuality`
3. Delete the flag reader in `search-flags.ts`
4. Re-run the verdict path to confirm it returns to the shipped behavior

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds two guarded verdict branches and one flag reader, no data is written
<!-- /ANCHOR:enhanced-rollback -->

---
