---
title: "Feature Specification: Retrieval drift remediation"
description: "Close every confirmed finding from the ripgrep search system research lane: doc-versus-code drift in the retrieval conventions, the search router and the doctor workflow, the manifest exclusion record, and the retrofit pipeline sitting in the hot retrieval directory."
trigger_phrases:
  - "retrieval drift remediation"
  - "concept lane removal"
  - "committed pair mismatch"
  - "retrofit convention ops move"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retrieval drift remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 001-ripgrep-search-system |
| **Successor** | None |
| **Handoff Criteria** | Every row of `001-ripgrep-search-system/research/confirmed-findings.md` is fixed or carries a recorded no-change decision, and the retrieval suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the spec-kit simplification research program.

**Scope Boundary**: the retrieval conventions reference, the `/speckit:search` router and its presentation asset, the `/doctor speckit-retrieval` workflow, the retrieval CLI folder and its READMEs, the ops folder, the coverage-parity and retrofit-pipeline tests, and the trigger-index maintenance row in the root document.

**Dependencies**:
- `001-ripgrep-search-system/research/confirmed-findings.md`, the reproduced table this phase closes

**Deliverables**:
- Conventions, router, presentation asset and doctor workflow that describe what the code does
- A manifest exclusion record that names every directory the walker prunes, with a test that keeps it so
- The retrofit pipeline relocated out of the lookup-time directory
- The committed index and manifest regenerated together

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval code is correct and its documents are not: the conventions describe a concept lane over an embedded index that does not exist, the search router carries a recipe that drops three mandatory flags, the presentation asset names three of five match classes, the READMEs give test commands over a directory that was moved, and the doctor never performs the one cheap check that would have caught the committed index lagging its manifest. The manifest also records an exclusion policy the walker stopped applying when it began pruning `dist`, and a finished one-time migration pipeline sits in the directory every lookup imports from.

### Purpose
A reader who follows any retrieval document runs the same recipe, sees the same labels and reaches the same verifier the code implements.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the lane description, availability note, ranking classes, single-token guidance and coverage rows in `retrieval-conventions.md`
- Make the router recipe identical to section 2.1 and list all five match classes in the presentation asset
- Add the committed-pair comparison and the optional latency check to the doctor workflow
- Record `dist` in `EXCLUSIONS`, assert the record in the parity suite, regenerate the index and manifest together
- Move `retrofit-convention.mjs` to `runtime/cli/ops/` and update every importer and document
- Correct both retrieval READMEs and the root document's maintenance row

### Out of Scope
- Retiring the `promptSetHash` slot - removing it changes every manifest hash for no reader
- Wiring the trigger lookup into a prompt hook - the hook-system table documents it as the manual fallback by design
- Any change to lookup scoring or the ripgrep lane's globs - the code was verified correct

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Two lanes, five classes, single-token rule, `dist` and alias rows |
| `.opencode/commands/speckit/search.md` | Modify | Recipe identical to section 2.1; flag count corrected |
| `.opencode/commands/speckit/assets/search-presentation.txt` | Modify | Five match-class labels |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | `committed_pair_mismatch` signal, comparison activity, optional latency activity |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | `**/dist/**` in `EXCLUSIONS`; comment states it is manifest identity |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Modify | Index-only `dist` divergence; exclusion-record assertion; import path |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts` | Modify | Import path |
| `.opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs` | Move | From `retrieval/`; imports repointed |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Retrofit removed, frozen fixtures named, test commands corrected |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modify | Consumer paths and test commands |
| `.opencode/skills/system-spec-kit/runtime/cli/ops/README.md` | Modify | Retrofit entry point and key-file row |
| `.opencode/skills/system-spec-kit/references/structure/grep-convention.md` | Modify | Retrofit path |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | `--limit 0` documented |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerate | One generator run after the exclusion change |
| `AGENTS.md` | Modify | Maintenance row names the doctor as the verifier |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every retrieval document describes only the two lanes that exist and lists the five match classes the lookup emits |
| REQ-002 | The router recipe is byte-identical to section 2.1 of the conventions |
| REQ-003 | `EXCLUSIONS` names every directory in `EXCLUDED_DIR_NAMES` and a test fails when it does not |
| REQ-004 | The committed index and manifest carry the same `manifestHash` after regeneration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The doctor workflow compares the committed index hash with the committed manifest hash without a corpus walk |
| REQ-006 | `retrofit-convention.mjs` lives under `runtime/cli/ops/` and no document or import names the old path |
| REQ-007 | Both retrieval READMEs give a test invocation that runs |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The seven retrieval suites pass from `runtime/cli` with the invocation the README gives
- **SC-002**: A search for the old retrofit path outside `specs/` and changelogs returns nothing
- **SC-003**: `generate-trigger-index.mjs --json` reports zero malformed documents and the index and manifest hashes match
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another session had regenerated the index fixtures uncommitted | A commit could carry a build over documents that are not yet committed | The regeneration is deterministic over the tree; the doctor's new check reports any later split pair |
| Risk | Changing `EXCLUSIONS` changes every manifest hash | Fixtures pinned to older hashes look stale | The README now states those pins are frozen acceptance evidence, not staleness |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The committed-pair check costs two JSON reads and no corpus walk
- **NFR-P02**: Regeneration remains byte-identical across two runs over one tree

### Security
- **NFR-S01**: No document tells a diagnostic run to write the committed latency fixture
- **NFR-S02**: The relocated pipeline keeps its manifest-frozen stages; no stage re-walks the corpus

### Reliability
- **NFR-R01**: The parity suite fails on the next undeclared exclusion divergence
- **NFR-R02**: Every gate result was read from the command output, not inferred from exit codes alone
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a single-token phrase is now documented as exact-only, so authors know why it never ranks
- Maximum length: `--limit 0` is documented as unlimited, the default stays 20
- Invalid format: a manifest whose hash differs from the index is classified, not treated as missing

### Error Scenarios
- External service failure: none; every check reads committed files
- Network timeout: not applicable
- Concurrent access: another session regenerating the index produces the same bytes over the same tree

### State Transitions
- Partial completion: a commit that carried the index without the manifest is exactly the split pair the doctor now names
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Fifteen files, one relocation, one regeneration |
| Risk | 6/25 | Doc-heavy; one shared constant that feeds a hash |
| Research | 4/20 | Findings arrived reproduced |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Both carried questions from the research lane are recorded in its confirmed-findings document with the decision taken here.
<!-- /ANCHOR:questions -->
