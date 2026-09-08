---
title: "Feature Specification: Trigger phrase quality enforcement"
description: "Give the trigger-index pipeline the two negative classes the convention bans but nothing enforced, count every rejected class in the generator's diagnostics, point the doctor at that count, and correct the presentation, README and conventions lines round two found left behind."
trigger_phrases:
  - "trigger phrase quality enforcement"
  - "single token phrase class"
  - "phrase quality diagnostics bucket"
  - "search presentation labels fixed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Trigger phrase quality enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 001-ripgrep-search-system |
| **Successor** | None |
| **Handoff Criteria** | Every row of lane 001's round-two section in `research/confirmed-findings.md` is fixed, documented or carries a recorded decision, and the retrieval suites and the index regeneration agree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the spec-kit simplification research program: the remediation child for the retrieval lane's second round.

**Scope Boundary**: the phrase judge and its two consumers, the index generator's diagnostics, the retrieval doctor asset, the search presentation asset, the retrieval README and the retrieval conventions.

**Dependencies**:
- Lane 001's round-two synthesis and its census section in `../001-ripgrep-search-system/research/confirmed-findings.md`
- Child 006, whose remediation this round verified

**Deliverables**:
- `lib/phrase-judge.mjs`, the one dependency-free home of the phrase rules, with `single-token` and `numeric-only` classes, re-exported by the retrofit and validator module
- A `phraseQuality` bucket in the generation diagnostics counting unique phrases and owning documents per class, printed by the generator
- A doctor pollution signal that reads that bucket and a pair check over all four generated artifacts
- The presentation asset's §3 naming the five labels and four fields the code emits; the README and conventions describing the scripts, recipes, lookup limits and coverage rows as they are
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The convention said to declare phrases of two or more tokens and never to index bare numbers or generic words, and nothing enforced the first two rules anywhere: the committed index carried 352 single-token keys across 826 documents, 42 of them only numbers, and sweep-produced fragments such as `ation` passed the judge, the validator, the generator and the doctor. The doctor's pollution screen could only ever see five stale samples, so its high severity had no detection power. Beside that, the search presentation asset still documented three match classes and two field names the code never emits, and the retrieval README still drew a script that had moved and counted recipes three ways.

### Purpose
A phrase the convention rejects is named at the judge, counted at generation, and surfaced by the doctor; an agent reading the presentation asset sees the labels the tool prints; a maintainer reading the README sees the scripts and recipes that exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The judge module extraction and its two new classes, with tests
- The generator's quality bucket, with a test, and the regenerated committed artifacts
- The doctor asset, the presentation asset, the README and the conventions corrections

### Out of Scope
- Cleaning the 826 documents that own single-token phrases: a content decision for each packet's owner, now visible on every generator run
- Indexing `repo-rules/`: rule documents load at Gate 5 through the trigger table, not at Gate 1; the exclusion is now documented in §9
- Making `phrase-variants.json` opt-in: kept as the documented operator trace of raw spellings

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/retrieval/lib/phrase-judge.mjs` | Create | Word lists and `judgeTriggerPhrase` with `single-token` and `numeric-only` |
| `runtime/cli/retrieval/lib/grep-convention.mjs` | Modify | Imports and re-exports the judge |
| `runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | `phraseQuality` in diagnostics and stats; printed in the report |
| `runtime/cli/tests/{grep-convention,trigger-index}.vitest.ts` | Modify | New classes; quality bucket; the allowlist test follows the two-token rule |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | Pollution signal from the diagnostics; medium severity; four-artifact pair check |
| `.opencode/commands/speckit/assets/search-presentation.txt` | Modify | Five labels, four fields, re-rendered example |
| `runtime/cli/retrieval/README.md`, `references/retrieval/retrieval-conventions.md` | Modify | Scripts, recipes, judge home, lookup limits, two coverage rows |
| `runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/*.json` | Regenerate | Diagnostics carry the bucket |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `judgeTriggerPhrase` rejects a single-token phrase and a numbers-only phrase with their own classes, keeps every earlier class ahead of them, and admits a two-token concept |
| REQ-002 | The generator's diagnostics carry a `phraseQuality` bucket with per-class phrase and owning-document counts, and a second regeneration reproduces the index byte for byte |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The doctor's pollution signal reads the committed diagnostics and its pair check names all four generated artifacts |
| REQ-004 | The presentation asset, README and conventions carry no label, field name, script count, recipe count or coverage row the code contradicts |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The grep-convention, trigger-index, coverage-parity, recipe and retrofit suites pass together
- **SC-002**: The committed diagnostics show the pollution counts round two measured by hand
- **SC-003**: The sk-doc validator exits zero on the touched README and reference
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new classes make `GREP_CONVENTION` warn on hundreds of packets | Noisier validation output | The rule reports warnings, never errors; the convention already banned the phrases, and the counts are what the doctor now reads |
| Risk | Moving the judge changes an import path a consumer relied on | A retrofit or validator import breaks | The old module re-exports every moved symbol; its two consumers and their tests pass unchanged |
| Dependency | The generator must stay dependency-free of the retrofit machinery | The Gate 1 maintenance command would need the shared workspace | The judge module imports only the normalizer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The quality pass judges 35,453 unique keys once per generation, well inside the run's existing seconds
- **NFR-P02**: The lookup path is untouched

### Security
- **NFR-S01**: No rule became less strict; two warning classes were added
- **NFR-S02**: No committed artifact gained a new reader outside the doctor

### Reliability
- **NFR-R01**: Regeneration stays deterministic; verified by two consecutive runs
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a corpus with no rejected phrase yields a bucket with only `ok`
- Maximum length: the prose-sentence class still fires before the single-token class cannot
- Invalid format: a phrase that normalizes to nothing keeps its existing class

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: code, tests, artifacts and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new module, five code and asset files, two documents, regenerated artifacts |
| Risk | 8/25 | Additive warning classes behind an unchanged re-export surface |
| Research | 6/20 | Every count re-measured before the change |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The corpus cleanup and the repo-rules decision live in the lane's confirmed-findings document.
<!-- /ANCHOR:questions -->
