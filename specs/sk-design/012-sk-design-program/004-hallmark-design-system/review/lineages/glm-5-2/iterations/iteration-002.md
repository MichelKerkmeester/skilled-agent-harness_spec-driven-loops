# Iteration 002 — Security + Maintainability

## Focus
D2 Security: audit the 004 "authored never enters measured" hard boundary and the 002 detector-evidence-driven conditionality as trust-boundary claims. D4 Maintainability: structural/template consistency across the five child specs and parent metadata quality.

## Dimensions Covered
- D2 Security
- D4 Maintainability

## Files Reviewed
- `shared/authored-brand/authored-brand-boundary.mjs` (full read)
- `shared/evidence-envelopes/owned-asset-manifest.md` (never-hotlink contract, referenced)
- `design-md-generator/backend/scripts/validate.ts` (motion-evidence enforcement, lines 398-463)
- `004-brand-first-lane/spec.md`, `005-measured-composition-and-retrieval-facets/spec.md`
- `004-hallmark-design-system/description.json`

## Findings

### D2 Security — no new findings (PASS)
- **Authored→measured boundary (004 REQ-002/REQ-005):** `[SOURCE: shared/authored-brand/authored-brand-boundary.mjs:20-37]` `assertAuthoredDestination` rejects `DESIGN.md`/`tokens.json`/`styles` basenames and any `styles` path segment; `[SOURCE: ...mjs:57-74]` `writeAuthoredArtifact` blocks path traversal (`path.dirname(destination) !== root`); `[SOURCE: ...mjs:99-133]` `assertReviewedConversionArtifact` rejects an evidence-free `verified` flag and requires named human reviewer + four manual attestations + non-empty measurement evidence per selection. The strict two-filename allowlist (`AUTHORED-DESIGN.md`, `authored-tokens.json`, root-only) closes the case-sensitivity observation below. Adversarial test file present (`brand-first-boundary.test.mjs`, 247 lines). Claim CONFIRMED sound.
- **Detector-evidence conditionality (002 REQ-006):** `[SOURCE: design-md-generator/backend/scripts/validate.ts:446-448]` `unexpected-motion-section` rejects a Motion section without measured `durationScale`; `[SOURCE: ...validate.ts:461-463]` `motion-value-fidelity` rejects altered measured values. Claim CONFIRMED.
- **Never-hotlink-Hallmark (002 REQ-001):** scoped in the spec as an evidence-only manifest contract, not a runtime gate — consistent with the evidence-only NFR. Not a code-enforcement gap.
- **Observation (not a finding):** `MEASURED_TARGETS` basename matching is case-sensitive, but because the writable set is locked to exactly two authored filenames in the root, a case-variant measured name is not writeable. No exploitable path.

### F003 — P2 — Phase numbering drift (4 vs 5)
- **Evidence:**
  - `[SOURCE: 001-surgical-fixes/spec.md:49]` `Phase | 1 of 4`
  - `[SOURCE: 002-evidence-envelopes/spec.md:51]` `Phase | 2 of 4`
  - `[SOURCE: 003-authored-cards/spec.md:50]` `Phase | 3 of 4`
  - `[SOURCE: 004-brand-first-lane/spec.md:50]` `Phase | 4 of 4`
  - `[SOURCE: 005-measured-composition-and-retrieval-facets/spec.md:55]` `Phase | 5`
- **Why P2:** Children disagree on the total phase count ("of 4" vs a bare "Phase 5"). Cosmetic/structural drift, no behavior impact. Reinforces F002's root cause.

### F004 — P2 — 005 spec.md retains template scaffolding and drifts from sibling template
- **Evidence:**
  - `[SOURCE: 005-measured-composition-and-retrieval-facets/spec.md:34-40]` `SELF-CHECK:` / `FAILURE MODES:` template comment block left in (siblings carry no such block).
  - `[SOURCE: 005-.../spec.md:212-217]` trailing `CORE TEMPLATE (~80 lines)` scaffolding comment.
  - `[SOURCE: 005-.../spec.md:205]` `## 10. OPEN QUESTIONS` — mis-numbered (siblings use `## 7. OPEN QUESTIONS`).
  - `[SOURCE: 005-.../spec.md:56]` metadata uses `Research Basis` + `Phase 5` instead of the siblings' `Implements` + `Parent Packet` fields.
- **Why P2:** Maintainability/consistency drift; one child was authored from a different template shell than its siblings. No correctness impact.

### F006 — P2 — Parent description.json description truncated mid-sentence
- **Evidence:** `[SOURCE: 004-hallmark-design-system/description.json:3]` `"description": "The hallmark design system needed adopting into sk-design in a controlled way — surgical fixes first, then evidence envelopes, authored cards, and a"` — cuts off at "and a".
- **Why P2:** Auto-generated metadata quality; the sentence is incomplete. Low impact (description.json is derived), but it degrades memory-search snippets.

## Traceability Checks
None new this iteration (no traceability-dimension focus). `feature_catalog_code` and `playbook_capability` overlays deferred to iteration 3.

## Dimension Verdicts
- D2 Security: PASS — both trust-boundary claims (authored/measured boundary, motion detector conditionality) resolve to robust, adversarially-tested code.
- D4 Maintainability: PASS with advisories — three P2 structural/quality findings (F003, F004, F006); no P0/P1.

## Summary
Security dimension is clean: the hard boundary and detector conditionality are sound. Maintainability surfaces three P2 consistency/quality drifts, all concentrated in the 005 lane and the parent metadata. No P0, no new P1.

Review verdict: PASS
