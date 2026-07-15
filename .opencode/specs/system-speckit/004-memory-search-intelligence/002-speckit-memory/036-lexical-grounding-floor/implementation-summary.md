---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Gated good and cite_results on a lexical-grounding floor and added single-hit corroboration to assessRequestQuality, both behind the default-OFF SPECKIT_LEXICAL_GROUNDING_V1 flag, with a verdict-level vitest over the off-corpus anchor and the aligned good queries. The 025 off-corpus driver falseConfirmRate drops from 0.833 to 0 with the flag ON and the flag-OFF path is byte-for-byte the shipped verdict."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/036-lexical-grounding-floor"
    last_updated_at: "2026-07-06T19:16:35.192Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented floor and corroboration guard behind default-OFF flag, vitest green"
    next_safe_action: "Graduate the flag to ON after a wider off-corpus and aligned-good validation pass"
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
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The lexical-grounding floor and the single-hit corroboration guard landed in `assessRequestQuality` behind the default-OFF flag, the verdict-level vitest passes, and the 025 off-corpus driver confirms the false-confirm rate drops from 0.833 to 0 with the flag ON.

### Lexical-grounding floor on the verdict

A lexical-grounding floor was added to `assessRequestQuality` in `confidence-scoring.ts`. The shipped verdict awards good from `topScore`, `qualityRatio` and `topMargin` alone, with zero query-term or lexical-grounding signal, so a fluent off-corpus term such as kubernetes earned a confident citation on one spurious high-cosine hit. When the flag is ON the floor denies good unless the top hit clears the grounding floor, read off the `fts_score`/`bm25_score`/`keyword` signal already populated on the rows at `search-results.ts:915` through a new `resolveLexicalSignal` helper that mirrors the formatter projection. A direct query-term overlap against the row title, content or trigger phrases grounds a hit that the lexical lane did not score, using the query string now threaded into the verdict. The floor gates all three good branches including the top-dominant one, so an ungrounded hit cannot reach good even at a 0.8 cosine. The cite_results policy follows because `deriveCitationPolicy` at `search-results.ts:368-370` already derives the policy from the gated label, so no formatter logic edit was needed beyond passing the query. An absent or zero lexical signal with no query-term match fails closed to weak or gap.

### Single-hit corroboration in assessRequestQuality

A single-hit corroboration guard was added to `assessRequestQuality`. A lone above-floor hit over a weak tail produces the largest possible top-margin, so the margin signal perversely rewards the spurious hit. The 030 verification refined this: a single-result kubernetes sample sets `topMargin` to 0 because there is no runner-up, so the lone hit actually reached good through the `qualityRatio` path on a single result, not the margin. The guard counts hits whose absolute relevance clears the corroboration threshold and requires at least two before good is reachable through the margin path OR the `qualityRatio`-on-a-lone-hit path, so a single off-corpus result with a zero margin can no longer reach good. The top-dominant path stays exempt from corroboration so a strong grounded single hit remains citable.

### Default-OFF flag and the dark default

Both behaviors ship behind a single default-OFF flag `SPECKIT_LEXICAL_GROUNDING_V1`, added to `search-flags.ts` through the existing `isOptInEnabled` reader, which resolves an unset, empty or unparseable value to OFF. When the flag is OFF the verdict and citation logic runs the unchanged shipped branch, byte-for-byte, so every existing spec doc that carries the current verdict prose still reads the shipped behavior and the stored prose statuses stay accurate until the flag flips. The flag graduates to ON only after a wider off-corpus and aligned-good validation pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modified | Added the lexical-grounding floor, the single-hit corroboration guard and the lexical-signal and query-overlap helpers to `assessRequestQuality`, all gated by the default-OFF flag, with the flag-OFF branch left unchanged |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Added the `isLexicalGroundingEnabled` default-OFF flag reader for `SPECKIT_LEXICAL_GROUNDING_V1` |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Modified | Threaded the query string into the `assessRequestQuality` call so the grounding floor can read query-term overlap. `deriveCitationPolicy` itself is unchanged and the gated label flows to cite_results automatically |
| `.opencode/skills/system-spec-kit/mcp_server/tests/lexical-grounding-floor.vitest.ts` | Created | Verdict-level proof over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The default-OFF flag reader landed first, then the lexical-grounding floor and the corroboration guard inside `assessRequestQuality` gated by that flag, then the verdict-level vitest. The flag-OFF branch is the original good and weak and gap ladder left intact, and the gated branch is a sibling block reached only when the flag is ON, so the dark default is a no-op. The query string is threaded from the formatter into the verdict so the floor can read query-term overlap as a secondary grounding signal.

The verdict-level vitest proves the off-corpus denial that the kubernetes-shaped sample scores weak with the flag ON, the lone-hit proof that a single-result zero-margin sample scores weak while a two-hit corroborated query at the same top score scores good, the dark-default proof that the same lone hit still scores good with the flag OFF, the fail-closed proof on an absent lexical signal, and the non-regression proof that an aligned good query and the correctly-weak authentication case hold.

The 025 off-corpus eval driver was run against the live DB and the active nomic-embed-text-v1.5 embedder to measure the end-to-end effect. With the flag OFF the driver reports falseConfirmRate 0.833 (five of six absent terms scored good, kubernetes among them). With `SPECKIT_LEXICAL_GROUNDING_V1=true` the driver reports falseConfirmRate 0 (every absent term scored weak or gap). The driver does not pass the query into the verdict, so this confirms the floor fires off the row lexical-signal absence alone.

Deviation from the scaffold: the vitest lives at `tests/lexical-grounding-floor.vitest.ts` rather than the scaffold-named `__tests__/search/` path, because the repo `vitest.config.ts` only includes `mcp_server/tests/**`, so a file under `__tests__/search/` would never run. Placing it beside the sibling `request-quality-aggregation.vitest.ts` keeps it runnable, which is the intent the scaffold path expressed.
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

Test command `npx vitest run tests/lexical-grounding-floor.vitest.ts` passes 12 of 12. The sibling `tests/request-quality-aggregation.vitest.ts` and `tests/scoring-opt-in.vitest.ts` pass unchanged, proving the flag-OFF path is byte-for-byte the shipped verdict. The 025 driver command is `node scripts/evals/run-false-confirm-eval.mjs` (flag OFF) and the same with `SPECKIT_LEXICAL_GROUNDING_V1=true` (flag ON). The docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| With the flag ON the off-corpus sample scores weak or gap and returns do_not_cite_results | PASS, 025 driver falseConfirmRate 0.833 -> 0, kubernetes weak with the flag ON |
| With the flag ON a single-result zero-margin sample scores weak and a two-hit corroborated query at the same top score scores good | PASS, vitest corroboration cases green |
| With the flag OFF the lone hit still scores good, proving the dark default leaves the shipped contract untouched | PASS, vitest dark-default case green and the two sibling suites unchanged |
| The aligned good queries still score good and the authentication case still scores weak with the flag ON | PASS, vitest aligned-good and correctly-weak cases green |
| An absent lexical signal fails closed to weak or gap rather than awarding a citation | PASS, vitest fail-closed case green |
| The vitest asserts a cosine profile rather than an embedder-specific cosine | PASS, cases assert qualitative verdicts over a strong-top-over-weak-tail profile |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark by default.** The flag ships OFF, so the live verdict is unchanged until a graduation decision flips it. The 025 driver delta was measured with the flag forced ON, not in the default path.
2. **Single-embedder evidence.** The 0.833 to 0 falseConfirmRate delta was measured on nomic-embed-text-v1.5 against the live DB. The grounding floor is a presence test on the row lexical signal rather than a pinned cosine, so it is embedder-portable, but the measured rate itself is embedder-scoped and should be re-measured before graduating on a different embedder.
3. **Floor value.** The lexical-grounding floor is held at zero, meaning a present positive lexical match grounds a hit while an absent or zero signal does not. A stricter positive floor was not needed to separate the off-corpus class from the aligned good queries on the current embedder, but a future embedder with noisier lexical scores may warrant tuning it.
4. **Corroboration threshold.** Corroboration counts hits whose absolute relevance clears the weak-tier floor, which keeps a genuine second medium hit corroborating while a weak tail does not. A single grounded hit below the top-dominant cosine is intentionally downgraded to weak under the flag, which is the lone-hit signal the guard exists to read.
<!-- /ANCHOR:limitations -->

---
