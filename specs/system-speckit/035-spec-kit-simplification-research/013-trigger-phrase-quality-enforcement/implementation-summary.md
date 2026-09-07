---
title: "Implementation Summary: Trigger phrase quality enforcement"
description: "The phrase judge now names single-token and numbers-only phrases, the generator counts every rejected class in its diagnostics, the doctor reads that count as its pollution signal, and the presentation asset, README and conventions describe the retrieval scripts as they are."
trigger_phrases:
  - "phrase quality summary"
  - "what shipped phrase judge"
  - "diagnostics bucket shipped"
  - "presentation labels corrected"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/013-trigger-phrase-quality-enforcement"
    last_updated_at: "2026-09-07T06:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the next round-two lane"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs"
      - ".opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs"
    session_dedup:
      fingerprint: "sha256:4a913bc4ab3b6238f9c510419714eaa9fecc067cdcf501a8042ffa0c1bdfc48d"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Trigger phrase quality enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-trigger-phrase-quality-enforcement |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The retrieval lane's second round verified that child 006 had landed, then looked where round one never had: inside the committed index. It found 352 single-token keys across 826 documents, 42 of them only numbers, and fragments such as `ation` that a repo-wide frontmatter sweep had left behind, all admitted by a judge that had no class for them and screened by a doctor that could only see five stale samples.

### One judge, three readers

`lib/phrase-judge.mjs` now holds the word lists and `judgeTriggerPhrase`, importing only the normalizer, so the index generator can use it without the retrofit machinery. Two classes join the five that existed: `numeric-only` for a phrase that is only digits, and `single-token` for anything left with one token. The retrofit pipeline and the validator re-export the judge from where they always imported it and report the new classes as warnings, as they did the old ones.

### A count where there was silence

Every unique key is judged at generation and the diagnostics gain a `phraseQuality` bucket: phrases and owning documents per class. The generator prints it; the committed run shows 314 single-token phrases across 825 documents and 42 numbers-only phrases across 121. The doctor reads that bucket as its pollution signal, independent of staleness sampling, at medium severity because the phrases never rank, and its pair check now compares all four generated artifacts.

### Documents that match the tools

The search presentation asset's §3 names the five match classes and four evidence fields the wrapper emits. The README shows the retrofit under `../ops/`, counts five scripts, and says three of the four documented recipes run through the wrapper. The conventions name the judge as the home of the rules, ask for a second token beside a symbol name, document the lookup's three-character floor and eight-token cap, and gain a row for `repo-rules` and one for `tests/fixtures`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/retrieval/lib/phrase-judge.mjs` | Created | Word lists and the judge with two new classes |
| `runtime/cli/retrieval/lib/grep-convention.mjs` | Modified | Imports and re-exports the judge |
| `runtime/cli/retrieval/generate-trigger-index.mjs` | Modified | `phraseQuality` in diagnostics, stats and the printed report |
| `runtime/cli/tests/grep-convention.vitest.ts`, `trigger-index.vitest.ts` | Modified | Judge cases; bucket case; the allowlist case follows the two-token rule |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modified | Pollution from the diagnostics; four-artifact pair check; recommendation rules |
| `.opencode/commands/speckit/assets/search-presentation.txt` | Modified | Five labels, four fields, example |
| `runtime/cli/retrieval/README.md`, `references/retrieval/retrieval-conventions.md` | Modified | Scripts, recipes, judge, symbols, lookup limits, two coverage rows |
| `runtime/data/trigger-index.json`, `retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerated | Diagnostics carry the bucket |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every count was re-measured with a census of the committed index before anything changed and matched the lane. The judge moved first so the generator could import it; the classes were added behind the existing ones so no earlier verdict changed; the bucket, the doctor and the documents followed in one literal-replacement pass. One existing test admitted bare symbols, which the convention itself disallows; it was corrected with the reason beside it. The index was regenerated twice and the hashes compared. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Count and warn rather than reject at generation | The generator must not delete an author's phrase; a count on every run is what makes the corpus cleanup an owner's decision instead of a silent condition |
| A dependency-free judge module | The generator is the Gate 1 maintenance command and must not depend on the shared workspace the retrofit machinery imports |
| Medium severity for pollution | The phrases never rank; the cost is precision and parse time, not a wrong answer |
| Keep repo-rules out of the index | Gate 5 loads them through the trigger table; a rule surfacing as a Gate 1 context candidate would be the wrong mechanism |
| Keep the variants sidecar | It is the documented operator trace of raw spellings and is tested |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the three modules; YAML parse of the doctor asset | Exit 0 |
| grep-convention, trigger-index, coverage-parity, recipe and retrofit suites | PASS, 5 files, 177 tests |
| Two regenerations | Identical hash; bucket printed as recorded in the acceptance criteria |
| sk-doc validator on the README and the conventions | Exit 0 |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The corpus is still polluted** 825 documents own single-token phrases; every validate run on such a packet now carries a warning, and the doctor reports the count, but the phrases stay until their owners rewrite them.
2. **Fragments are caught only as single tokens** A two-token fragment phrase would pass; none was found in the census.
<!-- /ANCHOR:limitations -->

---
