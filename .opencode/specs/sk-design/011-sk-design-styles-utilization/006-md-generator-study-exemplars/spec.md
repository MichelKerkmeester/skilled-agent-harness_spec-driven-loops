---
title: "Feature Specification: bounded STUDY exemplars for design-md-generator"
description: "Add a separate, reversible pre-WRITE STUDY phase to design-md-generator that grounds prose in ONE real style without copying — one-bundle selection, a de-literalized observation transformer, a target-facts-bound optional prompt block, a provenance/rights/injection envelope, and a two-signal source-leak gate with discard-and-retry-without-STUDY. Implements the Phase B recommendation from ../002-md-generator-upgrade research; depends on phases 004 (retrieval) and 005 (schema contract)."
trigger_phrases:
  - "md generator study exemplars"
  - "design-md-generator STUDY phase"
  - "bounded exemplar hydration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the L2 STUDY-exemplars scaffold"
    next_safe_action: "Implement STUDY module after phases 004 and 005 land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-study-011-006"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the STUDY prompt block sit before or interleaved with the section-by-section prose task once the 005 schema contract lands?"
    answered_questions:
      - "STUDY is a separate, reversible pre-WRITE phase — never a raw few-shot shortcut."
---

# Feature Specification: bounded STUDY exemplars for design-md-generator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — scaffold; implementation not started |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../005-md-generator-schema-contract/` |
| **Successor** | `../007-shared-context-seam/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `design-md-generator` mode writes DESIGN.md prose with no grounding in any real, shipped design system. The 002 research ranked a bounded STUDY exemplar (rank 5) plus a two-signal source-leak gate (rank 6) as the highest-lift **prose** improvement — but also the riskiest. A naive few-shot exemplar would leak source-specific literals, phrasing, and target-measured values into the generated document, averaging real styles into generic or plagiarized prose. The lift is real; the risk is that the corpus is used as a copy source rather than as a teacher of shape.

### Purpose
Add a separate, reversible pre-WRITE STUDY phase that grounds prose in exactly ONE coherent real style without copying it. The STUDY phase selects a single style bundle, transforms it into structural observations (never verbatim values or phrases), binds those observations to the locked target-facts digest, and injects an optional prompt block AFTER the locked FACTS and before the prose task. It ships only with its transformation, provenance, and leakage controls together — never as a raw few-shot shortcut. The rule is: the corpus teaches shape, never target values.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A one-bundle STUDY selection + generation-guarded hydration path that, via the phase-004 retrieval surface, picks a single coherent style and loads its matched DESIGN.md + token artifacts.
- A de-literalized observation transformer that turns the exemplar into structural observations only, never verbatim values or phrases.
- A target-facts digest binding plus an optional STUDY prompt block injected AFTER the locked FACTS and before the prose task, wired via `build-write-prompt.ts::buildWritePrompt` and `guided-run.ts::buildPlan`.
- A provenance / rights / injection envelope carried with each STUDY bundle.
- A two-signal source-leak gate (exact-value + normalized-span) at the authored-draft boundary in `runGuided`; on failure, discard the draft and retry WITHOUT STUDY.
- Adversarial + counterfactual fixtures exercising the leak gate and the no-STUDY retry.

### Out of Scope
- The phase-004 retrieval substrate itself (dependency, consumed read-only here).
- The phase-005 versioned schema/validation contract (dependency; STUDY binds to its locked FACTS, does not define them).
- Any raw few-shot prompting shortcut that ships exemplars without the transformation, provenance, and leakage controls together.
- The diversity-preserving calibration watchdog and learned/fuzzy ranking (later, optional Phase C).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/**/study-*.ts` (new module) | Create (proposed) | STUDY selection, de-literalized observation transformer, provenance/rights/injection envelope, and the two-signal source-leak gate. |
| `design-md-generator/**/build-write-prompt.ts` | Modify (proposed) | `buildWritePrompt` gains the optional STUDY block after locked FACTS, before the prose task. |
| `design-md-generator/**/guided-run.ts` | Modify (proposed) | `buildPlan` wires STUDY into the plan; `runGuided` enforces the leak gate at the authored-draft boundary with discard-and-retry-without-STUDY. |
| `design-md-generator/**/__fixtures__/study-*` (new) | Create (proposed) | Adversarial + counterfactual fixtures for the leak gate and retry path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | STUDY is a separate, reversible pre-WRITE phase | The generator runs an identical WRITE path with STUDY disabled; enabling STUDY only adds an optional prompt block after locked FACTS, and any STUDY failure falls back to the no-STUDY path without corrupting output. |
| REQ-002 | The exemplar is de-literalized before it reaches the prompt | The observation transformer emits structural observations only; no verbatim source values, literals, phrases, or assets from the exemplar appear in the STUDY block. |
| REQ-003 | A two-signal source-leak gate guards the authored draft | At the authored-draft boundary in `runGuided`, both an exact-value check and a normalized-span check run; on either signal, the draft is discarded and regenerated WITHOUT STUDY. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | One-bundle, generation-guarded hydration | STUDY selects exactly one coherent style bundle via phase-004 retrieval and loads its matched DESIGN.md + token artifacts under a generation guard so stale bundles are not hydrated. |
| REQ-005 | Target-facts binding precedes the STUDY block | The STUDY block is bound to the locked target-facts digest and injected AFTER the locked FACTS and before the prose task via `buildWritePrompt` / `buildPlan`. |
| REQ-006 | Provenance / rights / injection envelope | Every STUDY bundle carries a provenance/rights/injection envelope so its origin, usage rights, and injection boundary are explicit and auditable. |
| REQ-007 | Adversarial + counterfactual fixtures exist | Fixtures exercise leak-gate trips (exact-value and normalized-span) and confirm the no-STUDY retry produces a clean draft. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With STUDY disabled, generator output is byte-identical to the pre-STUDY WRITE path (reversibility proven).
- **SC-002**: The de-literalized transformer produces no verbatim source values or phrases across the adversarial fixtures.
- **SC-003**: The two-signal leak gate discards and retries without STUDY on every seeded leak fixture, and the retried draft passes clean.
- **SC-004**: STUDY ships only with its transformation, provenance, and leakage controls together — no raw few-shot shortcut path exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Source leakage into authored prose | High | Two-signal (exact-value + normalized-span) leak gate at the authored-draft boundary; discard-and-retry-without-STUDY on any trip. |
| Risk | Corpus averages styles into generic prose | High | One-bundle selection (never a blend) + de-literalized structural observations that teach shape, never target values. |
| Risk | STUDY becomes a raw few-shot shortcut | Medium | Ship transformation, provenance, and leakage controls together; no code path injects a raw exemplar. |
| Risk | Stale bundle hydration | Medium | Generation-guarded hydration keyed off the phase-004 retrieval generation. |
| Dependency | `../004-*` retrieval surface | High | Consumed read-only for one-bundle selection; STUDY does not build retrieval. |
| Dependency | `../005-md-generator-schema-contract/` | High | STUDY binds to the locked target-facts / FACTS from the schema contract; it does not define them. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the STUDY prompt block be a single pre-task block, or interleaved per section, once the 005 schema contract fixes section shapes?
- What normalization is aggressive enough for the normalized-span signal without producing false leak trips on shared design vocabulary?
- Where should the provenance/rights envelope live — inline in the bundle artifact or in a sidecar the leak gate reads?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: STUDY selection + hydration adds no more than one bounded retrieval round-trip to the WRITE path; the STUDY-off path incurs zero added cost.
- **NFR-P02**: The two-signal leak gate runs at the authored-draft boundary without a second model call; a leak trip triggers at most one no-STUDY regeneration.

### Security
- **NFR-S01**: No verbatim source values, literals, phrases, or assets from the exemplar reach the prompt or the authored draft.
- **NFR-S02**: Every STUDY bundle carries a provenance/rights/injection envelope; bundles without a valid envelope are not injected.

### Reliability
- **NFR-R01**: Any STUDY failure (selection, hydration, transform, gate) falls back to the no-STUDY path without corrupting output.
- **NFR-R02**: Locked FACTS remain the sole authority for target-measured values regardless of STUDY state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No coherent bundle available from phase-004 retrieval: skip STUDY, run the no-STUDY path.
- Exemplar bundle missing token artifacts: treat as unhydratable, skip STUDY.
- Exemplar shares generic design vocabulary with the target: normalized-span signal must not false-trip on shared vocabulary.

### Error Scenarios
- Stale bundle generation: generation guard rejects the hydration and skips STUDY.
- Leak gate trips on the retry draft as well: discard STUDY entirely and emit the no-STUDY draft.
- Missing or malformed provenance envelope: refuse injection.

### State Transitions
- STUDY toggled off mid-run: WRITE path is byte-identical to the pre-STUDY pipeline.
- Partial hydration: no partial STUDY block is injected; STUDY is all-or-nothing per run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | New study module + edits to two guided-WRITE surfaces + fixtures. |
| Risk | 20/25 | Source-leak / rights / injection risk; mitigated by reversibility and the two-signal gate. |
| Research | 8/20 | Approach is fixed by 002 research §10 Phase B; open questions are localized. |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../005-md-generator-schema-contract/`
- **Successor**: `../007-shared-context-seam/`
- **Source research**: `../002-md-generator-upgrade/research/lineages/sol/research.md` (Phase B; ranked levers 5 + 6)
- **Subject backend**: `.opencode/skills/sk-design/design-md-generator/`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
