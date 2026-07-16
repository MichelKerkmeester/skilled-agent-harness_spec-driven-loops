---
title: "Feature Specification: Lexical-Grounding Floor and Single-Hit Corroboration [template:level_2/spec.md]"
description: "The verdict and citation path scores good and cite_results from the absolute cosine plus a top-margin alone, with zero query-term or lexical-grounding signal, so a fluent off-corpus term such as kubernetes earns a confident citation on one spurious high-cosine hit. A lone above-floor hit also produces the largest top-margin and can reach good through qualityRatio on a single result with a zero margin, so the margin signal perversely rewards the spurious hit. This phase gates good and cite_results on a lexical-grounding floor and requires single-hit corroboration, both behind a default-OFF flag."
trigger_phrases:
  - "lexical grounding floor"
  - "single hit corroboration"
  - "off corpus false relevance"
  - "citation grounding floor"
  - "assess request quality corroboration"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/036-lexical-grounding-floor"
    last_updated_at: "2026-07-04T17:50:59.665Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped floor and corroboration guard behind default-OFF flag, vitest green"
    next_safe_action: "Graduate the flag to ON after a wider off-corpus and aligned-good validation pass"
    blockers: []
    key_files:
      - "../../003-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-lexical-grounding-floor"
      parent_session_id: "phase-026-lexical-grounding-floor"
    completion_pct: 100
    open_questions:
      - "What lexical-grounding floor value separates the kubernetes off-corpus hit from the aligned good queries on the current embedder"
    answered_questions:
      - "Whether corroboration gates the margin path alone or also the qualityRatio-on-a-lone-hit path, it gates both per the rank 4 verification refinement"
---
# Feature Specification: Lexical-Grounding Floor and Single-Hit Corroboration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | COMPLETE |
| **Created** | 2026-06-22 |
| **Branch** | `026-lexical-grounding-floor` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../035-off-corpus-eval-fixture-gate/spec.md |
| **Successor** | ../037-envelope-fidelity-enforcement/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/memory:search` verdict cites an off-corpus term with confidence. The 029 model benchmark found `kubernetes` scored good at 0.78 on a semantically unrelated doc, identical across all four models, and the 030 improvement research diagnosed this as a score-calibration miss rather than an envelope-fidelity miss. The entire verdict and citation path uses only the absolute cosine score plus a top-margin, with zero query-term or lexical-grounding signal. Nomic embeddings hand fluent but unrelated text a high background cosine, so a lone spurious hit sails through. The citation policy derives only from `requestQuality.label` at `deriveCitationPolicy` (`search-results.ts:368-370`), and `assessRequestQuality` reads only `topScore`, `qualityRatio` and `topMargin` with no lexical input (`confidence-scoring.ts:453-484`), even though the lexical signals `fts_score`, `bm25_score` and `keyword` are already populated on the raw rows (`search-results.ts:915`).

A second defect compounds the first. A lone above-floor hit over a weak tail produces the largest possible top-margin, so the margin signal perversely rewards the spurious hit. The 030 verification refined this: a single-result `kubernetes` sample sets `topMargin` to 0 because there is no runner-up, so the lone hit actually earned good through the `qualityRatio` path on a single result, not through the margin. The corroboration requirement must therefore gate the `qualityRatio`-on-a-lone-hit path as well as the margin path.

This phase implements rec 3 (gate good and cite_results on a lexical-grounding floor) and rec 4 (single-hit corroboration in `assessRequestQuality`) from the 030 ranked proposals.

### Purpose
Require lexical grounding, a query-term or BM25 overlap floor, before awarding good or cite_results, reusing the keyword and fts signals already on the result rows. Require a second above-threshold hit, corroboration, before good can be reached through either the margin path or the `qualityRatio`-on-a-lone-hit path. Both behaviors ship behind a single default-OFF flag and graduate only after validating on the 030 off-corpus fixtures, so the aligned good queries and the correctly-weak authentication case provably do not regress, and every existing spec doc that carries the current verdict prose still reads the shipped behavior until the flag flips.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A lexical-grounding floor in `assessRequestQuality` (`confidence-scoring.ts`) that denies good when the top hit carries no query-term or BM25 overlap above a configured floor, reusing the lexical signal already populated on the rows. The cite_results policy follows because `deriveCitationPolicy` reads only the label.
- A single-hit corroboration guard in `assessRequestQuality` that requires a second above-threshold hit before good is reached through the margin path or the `qualityRatio`-on-a-lone-hit path, so a single off-corpus result with a zero margin can no longer reach good.
- A single default-OFF flag (`SPECKIT_LEXICAL_GROUNDING_V1`) that gates both behaviors. When OFF the shipped verdict and citation logic is byte-for-byte unchanged, so existing spec docs and their stored prose statuses read the current behavior.
- A vitest covering the kubernetes off-corpus regression anchor, the aligned good queries, the correctly-weak authentication case, and the single-result lone-hit path, asserting qualitative verdicts over a cosine profile so the test is embedder-portable.

### Out of Scope
- The off-corpus eval fixture and the false-confirm-rate eval driver (recs 1 and 2). Those are the precondition test additions and live in their own phases. This phase consumes those fixtures for validation but does not author them.
- The isotonic calibration re-fit (rec 12). The verdict band is taken off the pre-calibration value at `confidence-scoring.ts:400`, so a curve re-fit can never move good versus weak and is a proven non-fix.
- The render-mandate, the post-render fidelity check, the noise-floor subtraction and every other 030 rec ranked 5 through 12. They are separate soft spots or separate phases.
- Any change to ranking, retrieval lanes or the embedder. This phase reads the lexical signal already on the rows and changes only the verdict gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modify | Add the lexical-grounding floor and the single-hit corroboration guard to `assessRequestQuality`, both gated by the default-OFF flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add the `SPECKIT_LEXICAL_GROUNDING_V1` default-OFF flag reader alongside the existing `isResultConfidenceEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Verify (no change) | `deriveCitationPolicy` already derives cite_results from the label and the lexical signal is already on the rows, so cite_results follows the gated label with no formatter edit |
| `.opencode/skills/system-spec-kit/mcp_server/tests/lexical-grounding-floor.vitest.ts` | Create | Verdict-level vitest over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN the flag is ON the verdict MUST deny good and cite_results IF the top hit carries no query-term or BM25 lexical overlap above the configured grounding floor, reusing the `fts_score`/`bm25_score`/`keyword` signal already on the rows (rec 3) | With the flag ON, the kubernetes off-corpus sample scores weak or gap and `deriveCitationPolicy` returns do_not_cite_results, while an aligned good query that carries lexical overlap still scores good |
| REQ-002 | WHEN the flag is ON a lone above-floor hit MUST NOT reach good through the `qualityRatio`-on-a-lone-hit path or the margin path without a second above-threshold hit, corroboration (rec 4) | With the flag ON, a single-result sample with a zero top-margin scores weak rather than good, and a two-hit corroborated query at the same top score still scores good |
| REQ-003 | The flag `SPECKIT_LEXICAL_GROUNDING_V1` MUST default OFF, and WHEN OFF the verdict and citation logic MUST be byte-for-byte the current shipped behavior | With the flag unset the kubernetes sample still scores good as it does today, proving the dark default does not regress the shipped contract or the prose statuses existing spec docs already carry |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The grounding floor and the corroboration guard MUST gate BOTH the margin path and the `qualityRatio`-on-a-lone-hit path in `assessRequestQuality`, per the rank 4 verification refinement that a single off-corpus result reaches good through the ratio with a zero margin | A unit assertion confirms a single-result sample cannot reach good through either branch with the flag ON, and the margin branch and the ratio branch are each exercised by a dedicated case |
| REQ-005 | The vitest MUST assert qualitative verdicts over a cosine profile rather than a hard-coded cosine number, so the fixture survives an embedder change (theme 7, embedder-portability) | The test fixtures express the verdict expectation as a band over a cosine profile, no test pins a literal embedder-specific cosine as a pass condition |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag ON the kubernetes off-corpus sample scores weak or gap and returns do_not_cite_results, proving the lexical-grounding floor closes the benchmarked false-positive (rec 3).
- **SC-002**: With the flag ON a single-result lone hit with a zero top-margin scores weak, while a two-hit corroborated query at the same top score scores good, proving corroboration gates both the ratio and margin paths (rec 4).
- **SC-003**: With the flag OFF the kubernetes sample scores good exactly as it does today, proving the dark default leaves the shipped contract and the existing spec-doc prose statuses untouched.
- **SC-004**: The aligned good queries still score good and the correctly-weak authentication case still scores weak with the flag ON, proving the floor and the guard do not over-deny.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 030 off-corpus fixture and false-confirm driver (recs 1 and 2) | The floor cannot be validated against a measured off-corpus class until the fixture exists | Land the fixture and driver first per the 030 build order, gate this phase ON only after validating on them |
| Risk | The grounding floor over-denies an aligned good query that happens to carry low lexical overlap | High | Author the floor behind the flag, validate against the aligned good queries before flipping, and tune the floor on the cosine profile not a single embedder number |
| Risk | Corroboration drops a legitimately dominant single result | Med | Require corroboration only when the lexical floor is borderline, keep a strong-lexical single hit citable, and prove the two-hit-versus-one-hit boundary in the vitest |
| Risk | The flag default is read as ON somewhere and silently changes the shipped verdict | High | Default the flag OFF in `search-flags.ts`, assert the OFF path is byte-for-byte the current behavior, and prove the kubernetes-still-good OFF case |
| Risk | The fixture pins an embedder-specific cosine and breaks on an embedder change | Med | Assert qualitative verdicts over a cosine profile per theme 7, never a literal cosine as a pass condition |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The floor and the guard read the lexical signal already on the rows and add no new query, embedding call or DB read to the verdict path.

### Reliability
- **NFR-R01**: With the flag OFF the verdict is deterministic and identical to the shipped behavior, so the dark default is a no-op for every existing caller.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A single-result query with a zero top-margin: with the flag ON it cannot reach good through the ratio path without corroboration, so it scores weak by design, which is the lone-hit signal the guard exists to read.
- A result row missing the lexical signal entirely (no `fts_score`, `bm25_score` or `keyword`): the floor treats absent lexical overlap as below floor and denies good, failing closed rather than awarding a confident citation on a missing signal.

### Error Scenarios
- The flag is set to an unparseable value: `search-flags.ts` resolves it to the OFF default rather than throwing, so a misconfigured env never crashes the verdict path.
- The lexical signal is present but zero: zero overlap is below any positive floor, so the floor denies good, which is the off-corpus case.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two guarded branches in `assessRequestQuality`, one flag reader, one vitest, no new lens or query |
| Risk | 9/25 | The floor and the guard sit on the citation verdict, so over-denial is the live risk, mitigated by the default-OFF flag and the aligned-good validation |
| Research | 3/20 | Seams verified to file:line in the 030 research and re-confirmed against the live `confidence-scoring.ts` and `search-results.ts` |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What lexical-grounding floor value separates the kubernetes off-corpus hit from the aligned good queries on the current embedder, given the floor must be expressed as a cosine profile rather than a single number.
- Whether corroboration should require a second hit above the same lexical floor or above a separate corroboration threshold, resolved only after the first off-corpus validation run.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

GO-on-cost behind a default-OFF flag. This phase implements the convergent root-cause fix four 030 angles reached independently, the lexical-grounding floor, plus the rank 4 corroboration guard the verification refined to gate both the margin and the `qualityRatio`-on-a-lone-hit paths. The seams are verified to file:line: the citation policy derives only from the label at `search-results.ts:368-370`, `assessRequestQuality` reads only `topScore`, `qualityRatio` and `topMargin` at `confidence-scoring.ts:453-484`, and the lexical signal is already on the rows at `search-results.ts:915`, so the fix is feasible without a new query. The build ships dark behind `SPECKIT_LEXICAL_GROUNDING_V1` and graduates only after validating on the 030 off-corpus fixtures, so the aligned good queries and the correctly-weak authentication case provably do not regress and every existing spec doc that carries the current verdict prose still reads the shipped behavior until the flag flips. The calibration re-fit is excluded as a proven non-fix because the band is taken off the pre-calibration value.
<!-- /ANCHOR:verdict -->
