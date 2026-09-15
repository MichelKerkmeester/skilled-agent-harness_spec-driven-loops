---
title: "Feature Specification: Phase 6: ledger-stem-producers"
description: "The registered ledger vocabulary and the spellings producers actually write disagreed, and nothing failed when they did. This packet reconciles the two, declares the census beside the stem arrays, and enforces agreement with a conformance checker."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: ledger-stem-producers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-confirm-variant-parity |
| **Successor** | 008-agent-mirror-parity |
| **Handoff Criteria** | Every registered stem carries a census entry, the conformance checker exits 0 on the real tree, and the deep-loop suite is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Remediate the alignment review findings specification.

**Scope Boundary**: the registered ledger vocabulary of both deep-loop lanes (review and research) and the producer surfaces that write it. The packet does not change what the workflow steps decide; it makes the registry and the producers agree about how a decision is named, and it makes the library refuse a projection that would silently drop attribution.

**Dependencies**:
- The two frozen stem arrays and their wire-event maps (`runtime/lib/deep-review-ledger-schema/`, `runtime/lib/deep-research-ledger-schema/`)
- The legacy projection engine and its shadow store (`runtime/lib/legacy-projections/`)
- The nine producer surfaces: four workflow YAML assets under `.opencode/commands/deep/assets/` and five runtime `.cjs` scripts

**Deliverables**:
- A per-stem producer census declared beside each frozen stem array
- `runtime/scripts/check-ledger-stem-producers.cjs`, its vitest wrapper, and the violation rules that make the census falsifiable
- The adjudication-spelling decision, proven by cross-shape rejection tests and a fold test
- The `ATTRIBUTION_COLLAPSE` replace guard in the shadow projection store
- The frames-root report from the ledger-backing gate, plus verify-authority CLI coverage
- The vocabulary, authority and projection-ceiling prose in all eight state reference documents

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ledger schemas register 61 dotted event stems, and a census of the nine producer surfaces found 56 of them written by no mechanical producer at all. Worse, the split was invisible: the review workflow speaks the flat gate-summary spelling `deep_review.claim_adjudication`, while the schema's heavier typed per-finding record is `deep_review.claim_adjudication_recorded`, and nothing in either the registry or the reader-facing references said so. The cutover could therefore arm against a vocabulary half of which no writer emits, and a projection refresh could quietly replace a rich configuration row with the thinner row the fold rebuilds.

### Purpose
Make the registry and the producers agree about every stem, record which stems have no producer and why, and fail loudly the moment either side drifts or a projection refresh would drop attribution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The per-stem producer census for both lanes, declared in the ledger types files and re-exported from both barrels
- A conformance checker that reads that census, scans the producer surface for structured `stem` key occurrences, and fails on undeclared, unregistered or unspoken stems
- The adjudication-spelling decision at registration level, with the proofs that keep it honest
- The `ATTRIBUTION_COLLAPSE` no-loss replace guard and its operator-visible consequence
- Reporting which frames root backed a run, and covering the verify-authority CLI
- The state reference prose that states the vocabulary, the authority-dependent write target and the projection ceiling

### Out of Scope
- Changing what any workflow step decides, or making a producer emit a stem whose payload it does not already carry - the producers write the flat gate summary because that is the content they hold
- Changing the nine producer surfaces themselves - the census records what they write today
- The `cli-external-orchestration/071-cli-hermes-creation/015-wire-executor-builders` executor-transport preflight and the stress assertion it invalidates - a different track's in-flight work, reported in `tasks.md` and `acceptance-criteria.md` rather than repaired here
- The pre-existing `lib/deep-loop/executor-config.ts` typecheck error - another session's committed failure

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Producer census beside the frozen stem array; clarify the flat adjudication payload |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/index.ts` | Modify | Re-export the census |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Producer census beside the frozen stem array |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/index.ts` | Modify | Re-export the census |
| `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-errors.ts` | Modify | Add the `ATTRIBUTION_COLLAPSE` error code |
| `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts` | Modify | Refuse a replace that would drop keys from an existing config row |
| `.opencode/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` | Create | Conformance checker over census and producer surface |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | Report the frames root that backed the run |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts` | Create | Fixture-tree coverage of every violation rule |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Modify | Cross-post proof that the two adjudication shapes reject each other |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-projections-contract.vitest.ts` | Modify | Proof that a folded flat adjudication stays out of the typed array |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts` | Modify | Guard case: a lossy replace is refused and the bytes stay |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | Both frames-root kinds, the kill switch and legacy authority |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/verify-authority-cli.vitest.ts` | Create | CLI coverage for the independent authority verifier |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Seed a projection-consistent config row in the synthesis fixture |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-format.md` | Modify | Vocabulary section, adjudication spelling, projection ceiling |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md` | Modify | Authority-dependent write target and the thin projected config row |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | Modify | Pointer to the vocabulary section |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md` | Modify | Pointer to the vocabulary section |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-format.md` | Modify | Vocabulary section, authority and projection ceiling |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | Modify | Correct the unconditional projection claim |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-outputs.md` | Modify | Pointer to the vocabulary section |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md` | Modify | Pointer to the vocabulary section |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Modify | Regenerated source digest |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Modify | Regenerated source digest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every stem registered in either lane's frozen stem array either has a producer on the measured producer surface or is recorded as reserved with its reason, and the record sits beside the array it describes. |
| REQ-002 | Every producer's record spelling is registered, enforced by a checker plus a test that fails when a producer emits an unregistered stem or a stem declared reserved. |
| REQ-003 | The deep-loop suite exits zero with this change set in place. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The flat gate-summary adjudication spelling is declared canonical in its own right rather than an alias, and the two adjudication payload shapes reject each other. |
| REQ-005 | A projection replace that would drop keys from an existing config row is refused loudly instead of silently truncating attribution, and the refusal names what would be lost. |
| REQ-006 | The ledger-backing gate names the frames root that backed the run, and still accepts the parent-of-lineage root. |
| REQ-007 | The state reference documents state the registered vocabulary, the authority-dependent write target and the projection's ceiling where a reader meets them. |
| REQ-008 | The verify-authority CLI has test coverage for its stored, default and malformed record paths and for its argument handling. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-ledger-stem-producers.cjs` exits 0 on the real tree, reporting 61 registered, 5 spoken and 56 reserved stems with zero violations.
- **SC-002**: The checker exits 2 with a named rule for each of undeclared, unspoken, reserved-but-emitted and unregistered spellings, proven by fixture trees.
- **SC-003**: No registered stem is left unaccounted for: the census keys exactly the stem array's members.
- **SC-004**: A projection replace that would drop an existing config key is refused with `ATTRIBUTION_COLLAPSE` and leaves the published bytes untouched.
- **SC-005**: Every state reference document that describes a mode's state names its ledger vocabulary and the authority that decides which surface is authoritative.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The nine producer surfaces | The census can only be as accurate as the scan | The checker re-scans them on every run and fails when a declared producer stops emitting |
| Risk | The guard refuses a real post-flip append | Medium: a run whose legacy config row is richer than the projection exits 2 | The refusal is named and loud rather than silent; the operator migrates the fields into a registered `run_initialized` payload or accepts the loss by moving the legacy file |
| Risk | An emitter hides behind a YAML shell scalar | Low: escaped quotes could evade the scan | The scan tolerates backslash-escaped quotes and is exercised by a fixture that writes its record that way |
| Risk | The suite is red for a reason outside this packet | High: it blocks closure | Measured, attributed to the owning commit and reported in `tasks.md` and `acceptance-criteria.md`; not repaired here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The checker is a single pass over ten files and completes in well under a second on the committed tree.
- **NFR-P02**: The replace guard adds one parse of the existing output's first line per projection replace.

### Security
- **NFR-S01**: The checker reads a caller-supplied `--repo-root` and resolves every scanned path inside it; no path is executed.
- **NFR-S02**: The guard never writes on refusal, so no partial state is published.

### Reliability
- **NFR-R01**: The checker's exit codes are stable: 0 clean, 1 script error, 2 conformance violation.
- **NFR-R02**: A torn or non-UTF-8 shadow output still takes the repair path rather than being misread as an attribution collapse.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a census object with no parseable entries is a script error, not a clean run.
- Maximum length: duplicate stem entries and unparseable census lines are script errors.
- Invalid format: an emitter written inside a YAML double-quoted scalar with escaped quotes is still detected.

### Error Scenarios
- External service failure: not applicable, the checker is offline.
- Network timeout: not applicable.
- Concurrent access: the guard compares key sets only, so a concurrent writer that adds keys is not silently overwritten.

### State Transitions
- Partial completion: a projection that crashes after the output is durable but before the watermark keeps its recovery path.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two lanes' registries, nine producer surfaces, eight reference docs and six test files |
| Risk | 10/25 | One behaviour change (the replace guard) with an operator-visible consequence |
| Research | 12/20 | The adjudication split needed the reducer, the projection arms and the workflow YAMLs read together |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Who repairs the client-side stress assertion that the executor-transport preflight invalidated? It belongs to the `cli-hermes` track's packet, not this one, and this packet's REQ-003 stays unmet until it lands.
<!-- /ANCHOR:questions -->

---


