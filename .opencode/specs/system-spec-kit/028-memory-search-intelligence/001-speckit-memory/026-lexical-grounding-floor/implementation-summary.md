---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will gate good and cite_results on a lexical-grounding floor and require single-hit corroboration in assessRequestQuality, both behind a default-OFF flag, with a verdict-level vitest over the off-corpus anchor and the aligned good queries. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/026-lexical-grounding-floor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the planned floor and corroboration guard impl scope"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-lexical-grounding-floor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-lexical-grounding-floor |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Lexical-grounding floor on the verdict

The phase will add a lexical-grounding floor to `assessRequestQuality` in `confidence-scoring.ts`. Today the verdict awards good from `topScore`, `qualityRatio` and `topMargin` alone, with zero query-term or lexical-grounding signal, so a fluent off-corpus term such as kubernetes earns a confident citation on one spurious high-cosine hit. The floor will deny good when the top hit carries no query-term or BM25 overlap above a configured floor, reusing the `fts_score`/`bm25_score`/`keyword` signal already populated on the rows at `search-results.ts:915`. The cite_results policy follows because `deriveCitationPolicy` at `search-results.ts:368-370` already derives the policy from the gated label, so no formatter edit is planned. An absent or zero lexical signal fails closed to weak or gap rather than awarding a citation on a missing signal.

### Single-hit corroboration in assessRequestQuality

The phase will add a single-hit corroboration guard to `assessRequestQuality`. A lone above-floor hit over a weak tail produces the largest possible top-margin, so the margin signal perversely rewards the spurious hit. The 030 verification refined this: a single-result kubernetes sample sets `topMargin` to 0 because there is no runner-up, so the lone hit actually reaches good through the `qualityRatio` path on a single result, not the margin. The guard will therefore require a second above-threshold hit before good is reachable through the margin path AND the `qualityRatio`-on-a-lone-hit path, so a single off-corpus result with a zero margin can no longer reach good.

### Default-OFF flag and the dark default

Both behaviors will ship behind a single default-OFF flag `SPECKIT_LEXICAL_GROUNDING_V1`, added to `search-flags.ts` alongside the existing `isResultConfidenceEnabled`, resolving an unparseable value to OFF. When the flag is OFF the verdict and citation logic is byte-for-byte the current shipped behavior, so every existing spec doc that carries the current verdict prose still reads the shipped behavior and the stored prose statuses stay accurate until the flag flips. The flag graduates to ON only after validating on the 030 off-corpus fixtures, so the aligned good queries and the correctly-weak authentication case provably do not regress.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Planned modify | Add the lexical-grounding floor and the single-hit corroboration guard to `assessRequestQuality`, both gated by the default-OFF flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Planned modify | Add the `SPECKIT_LEXICAL_GROUNDING_V1` default-OFF flag reader |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Verify only | `deriveCitationPolicy` already derives cite_results from the label and the lexical signal is already on the rows, so cite_results follows the gated label with no edit |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/lexical-grounding-floor.vitest.ts` | Planned create | Verdict-level proof over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence adds the default-OFF flag reader first, then the lexical-grounding floor and the corroboration guard inside `assessRequestQuality` gated by that flag, then the verdict-level vitest. The off-corpus denial proof that the kubernetes sample scores weak or gap and returns do_not_cite_results with the flag ON, the lone-hit proof that a single-result zero-margin sample scores weak while a two-hit corroborated query at the same top score scores good, the dark-default proof that the kubernetes sample still scores good with the flag OFF, and the non-regression proof that the aligned good queries and the authentication case hold, all land with the vitest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate good and cite_results on a lexical-grounding floor | The verdict path uses only the absolute cosine and a top-margin with no lexical input, so a fluent off-corpus term earns a confident citation on a spurious high-cosine hit, the convergent root-cause four 030 angles reached independently |
| Require single-hit corroboration on both the margin and ratio paths | A lone hit produces the largest margin and a single result reaches good through `qualityRatio` with a zero margin, so corroboration must gate both paths per the 030 rank 4 verification refinement |
| Read the lexical signal already on the rows | `fts_score`/`bm25_score`/`keyword` is already populated at `search-results.ts:915`, so the floor needs no new query, embedding call or DB read |
| Leave `deriveCitationPolicy` unchanged | The policy already derives cite_results from the label, so the gated label flows to the citation policy with no formatter edit |
| Ship behind a single default-OFF flag | The shipped verdict prose lives in existing spec docs, so a dark default keeps those statuses accurate until the flag graduates on the off-corpus fixtures |
| Exclude the calibration re-fit | The band is taken off the pre-calibration value at `confidence-scoring.ts:400`, so a curve re-fit is a proven non-fix for the false-positive |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned test command is `vitest run __tests__/search/lexical-grounding-floor.vitest.ts` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| With the flag ON the kubernetes off-corpus sample scores weak or gap and returns do_not_cite_results | PLANNED, not yet run |
| With the flag ON a single-result zero-margin sample scores weak and a two-hit corroborated query at the same top score scores good | PLANNED, not yet run |
| With the flag OFF the kubernetes sample still scores good, proving the dark default leaves the shipped contract untouched | PLANNED, not yet run |
| The aligned good queries still score good and the authentication case still scores weak with the flag ON | PLANNED, not yet run |
| An absent lexical signal fails closed to weak or gap rather than awarding a citation | PLANNED, not yet run |
| The vitest asserts a cosine profile rather than an embedder-specific cosine | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Fixture precondition.** The floor cannot be validated against a measured off-corpus class until the 030 off-corpus fixture and false-confirm driver land, so the flag stays OFF until then.
3. **Open floor question.** The lexical-grounding floor value that separates the kubernetes off-corpus hit from the aligned good queries is unresolved until the first off-corpus validation run, and it must be expressed as a cosine profile rather than a single embedder number.
4. **Embedder portability.** The floor and the corroboration thresholds are calibrated against a specific embedder, so the fixture asserts qualitative verdicts over a cosine profile and the floor must be re-validated on an embedder change.
<!-- /ANCHOR:limitations -->

---
