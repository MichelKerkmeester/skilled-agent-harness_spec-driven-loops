---
title: "Feature Specification: Novel GO Automatic Example and Test Generation From Specs [template:level_2/spec.md]"
description: "Authored requirement prose carries no examples or test stubs so adherence stays unprovable per requirement and the spec-REQ-to-tasks linkage has nothing concrete to anchor on. This phase adds an additive human-approved generator that proposes worked examples and test stubs from a spec's requirements without ever rewriting requirement prose."
trigger_phrases:
  - "example generation"
  - "test generation from specs"
  - "additive adherence artifacts"
  - "novel go floor bypass"
  - "ears ac coverage consumer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/004-novel-research/021-novel-example-test-generation"
    last_updated_at: "2026-07-04T17:12:07.329Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research novel-GO row"
    next_safe_action: "Run generate-context and graph-metadata generators"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl"
      - ".opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Novel GO Automatic Example and Test Generation From Specs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `021-novel-example-test-generation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Authored spec requirements are prose-only, so adherence to a requirement is unprovable per requirement: there is no worked example showing the intended behavior and no test stub that pins it. The downstream `AC_COVERAGE` and `REQ_COVERAGE` gates measure that a requirement is linked to a task or acceptance criterion, but they cannot measure whether the requirement is concretely exercised because no concrete artifact exists for them to count. The research names this the strongest adherence lever in the topic and a genuinely novel floor-bypasser the reuse-first work missed: it writes additive adherence artifacts not vector rows, so it pays no truncation-floor tax and no re-index cost (`research.md` section 3 row "Automatic example and test generation from specs", verdict GO-on-cost; `research.md` section 1 truncation law). The opposing rail is equally clear: an auto-generator that silently rewrote requirement prose would cross the no-body-mutate rail and reward-hack a proxy (`research.md` section 3 NO-GO row "Retrieval-driven doc AUTO-rewriting"; `research.md` section 5 INV-1).

### Purpose
Add an additive, human-approved generator that proposes worked examples and test stubs from a spec's requirements as new artifacts, never a silent rewrite of requirement prose, feeding the `AC_COVERAGE` and `EARS` and `REQ_COVERAGE` work as its downstream consumer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A generator script that reads a spec's REQUIREMENTS anchor and emits proposed worked examples and test stubs as a separate artifact, never editing requirement prose in place.
- An additive output surface: the generator writes only into a clearly-named examples-and-tests artifact (a new file or a clearly-marked appended section), so a reviewer can accept, edit, or discard the proposal as a unit.
- A mandatory human-approval gate: nothing the generator proposes lands without an explicit operator confirm step, mirroring the suggest-only, human-gated boundary the research requires for any body-adjacent content.
- A consumer linkage so the generated examples and test stubs are addressable by the A7 `REQ_COVERAGE` and `AC_COVERAGE` gates, giving those gates concrete artifacts to count per requirement.
- Default-off behavior behind a feature flag so the legacy corpus and existing save and validate paths are untouched until the generator is explicitly invoked.

### Out of Scope
- Any rewrite or in-place mutation of authored requirement prose. The generator is additive-only and never a silent body edit (`research.md` section 3 NO-GO "Retrieval-driven doc AUTO-rewriting"; `research.md` section 5 INV-1, a fix touching an authored body is never `safe`).
- Auto-committing or auto-applying generated artifacts. CI and the save path stay report-only and human-gated (`research.md` section 5, CI never auto-commits).
- Building or modifying the `AC_COVERAGE` rule, the `REQ_COVERAGE` rule, the EARS patterns, or the constraint tier. Those are owned by the sibling A7 phase (`007-ears-constraints-req-coverage`); this phase produces the artifacts A7 consumes.
- Any retrieval-class or vector change. This item is floor-bypassing on the adherence reader only and is not gated on `015-prodmode-recall-gate`.
- Running the generated tests in CI or wiring an execution harness. This phase generates stubs and examples. Execution wiring is a later, separate concern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts` | Create | Generator that reads a spec's REQUIREMENTS anchor and emits proposed worked examples and test stubs into an additive artifact, default-off behind a flag, never editing requirement prose |
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modify | Add an optional EXAMPLES anchor (or document the separate examples-and-tests artifact) as the named additive landing surface the generator writes into |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Modify | Document the generated test-stub linkage so a task row can reference the stub that exercises its REQ, giving `REQ_COVERAGE` and `AC_COVERAGE` a concrete artifact to count |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register the generator flag (default-off) so its presence is discoverable next to the existing rules, without registering it as a blocking validation rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The system shall generate proposed worked examples and test stubs from a spec's REQUIREMENTS anchor as a separate additive artifact and shall never edit requirement prose in place. | Running the generator on a Level 2 spec produces an examples-and-tests artifact with one example or stub per requirement and leaves the source `spec.md` REQUIREMENTS prose byte-for-byte unchanged. |
| REQ-002 | While the generator flag is unset, the system shall behave exactly as today, so the legacy corpus and the existing save and validate paths are unaffected. | A clean `validate.sh` run and a clean save across an existing 005 sibling packet with the flag unset produce the same exit code and the same files as before this phase. |
| REQ-003 | When a generated artifact is proposed, the system shall require an explicit human-approval confirm before the artifact lands, so no generated content is written without operator consent. | Invoking the generator without the confirm step writes nothing to the repo (dry-run report only); the artifact is written only after the explicit confirm. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The generated examples and test stubs shall be addressable per requirement so the A7 `AC_COVERAGE` and `REQ_COVERAGE` gates can count concrete artifacts against each REQ id. | Each generated example or stub carries the REQ id it derives from, and a `REQ_COVERAGE`-style read can map a requirement to its generated stub. |
| REQ-005 | When the source REQUIREMENTS anchor is empty or absent, the system shall emit a no-op explanatory message and shall not fail. | Running the generator on a spec with no requirement rows prints a no-requirements notice and exits cleanly with no artifact written. |
| REQ-006 | The generator shall mark every proposed artifact as a proposal pending human review, so an unreviewed artifact is visibly distinguishable from an approved one. | A freshly generated artifact carries an explicit proposal or pending-review marker that an operator clears on approval. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The generator produces additive worked examples and test stubs from a spec's requirements as a separate artifact, leaves all requirement prose unchanged, and writes nothing without an explicit human-approval confirm.
- **SC-002**: The generated artifacts are per-requirement addressable so the sibling A7 `AC_COVERAGE` and `REQ_COVERAGE` gates have concrete artifacts to count, and with the generator flag unset an existing 005 sibling packet validates and saves byte-for-byte as before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `007-ears-constraints-req-coverage` (the `AC_COVERAGE` and `REQ_COVERAGE` gates and the EARS patterns) | This phase generates the concrete examples and test stubs that A7's coverage gates consume. Without A7 the artifacts have no gate to count them | Land this phase as the producer, A7 as the consumer. The two can ship in either order since the generator is additive and the gates are default-off |
| Dependency | None on `026-shared-safe-fix-engine` | The shared safe-fix engine gates the A1, B1, and B2 mutating front doors only. This generator writes a brand-new additive artifact, not a fix onto an existing body, so INV-1 keeps it out of the `safe` fix path entirely | Treat the generator as a standalone additive producer, not a registered `fixClass`; record here that `026-shared-safe-fix-engine` does NOT gate it |
| Dependency | None on `015-prodmode-recall-gate` | The C2 prod-mode recall gate gates every Tier-C and 027 retrieval item only. This item is floor-bypassing on the adherence reader and emits no vector rows | Ship standalone on cost as a novel GO-on-cost capability. Note the C2 gate does NOT apply |
| Risk | The auto-rewrite rail (`research.md` section 3 NO-GO, section 5 INV-1) | An over-eager generator that edited requirement prose would mutate an authored git-tracked artifact and reward-hack the adherence proxy | Make additivity structural: write only into the named examples-and-tests artifact, never touch the REQUIREMENTS prose, and gate every write behind an explicit human confirm |
| Risk | Low-quality or hallucinated examples landing unreviewed | A generated example that misstates the requirement would mislead a future reader | Keep every proposal pending-review by default (REQ-006) and require the human-approval confirm (REQ-003) before any artifact lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The generator is an on-demand operator-invoked pass over a single spec's REQUIREMENTS anchor, not a hot-path step, so it adds no cost to a default `validate.sh` run or to the save path while its flag is unset.

### Security
- **NFR-S01**: The generator writes only into the named additive examples-and-tests artifact under the active spec folder and never into requirement prose, the JSONs, or any database, so it introduces no new mutation surface beyond one new file under the spec folder.

### Reliability
- **NFR-R01**: With the generator flag unset the save and validation results are byte-for-byte equivalent to the pre-phase results, so no existing packet regresses.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or absent REQUIREMENTS anchor: the generator emits a no-requirements notice and writes nothing (REQ-005).
- A requirement row inside a fenced code block: the requirement scan is fence-aware so a code-fenced line is not mistaken for a requirement, matching the fence-aware discipline of the shipped `AC_COVERAGE` counter (`check-ac-coverage.sh:84-85`).
- An existing examples-and-tests artifact already present: the generator proposes a diff against it rather than clobbering, and the human confirm decides what lands.

### Error Scenarios
- The model or generator backend is unavailable: the generator fails closed with an explanatory message and writes nothing, never a partial or silent artifact.
- The confirm step is declined: nothing is written and the dry-run report is preserved for inspection.

### State Transitions
- Generator flag toggled on mid-corpus: the first invocation is dry-run report-only by default, so no in-flight packet is mutated without an explicit confirm.
- Requirement prose later edited by the author: the generated artifact carries its REQ ids so a re-run can re-propose only for the changed requirements.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One new generator script, two template edits, one registry entry for the flag |
| Risk | 10/25 | Additive-only and human-gated, no body mutation and no auto-apply, but it does invoke a generation backend |
| Research | 8/20 | Novel-GO with the floor-bypass and additivity rails grounded. The generation quality bar is the open part |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the generated artifact live as a new `examples.md` file under the spec folder or as a clearly-marked EXAMPLES anchor appended to `spec.md`, given the additivity rail forbids touching the REQUIREMENTS prose either way?
- What is the acceptance bar for a generated test stub: a named test description per requirement, or a compilable stub in the surface's test framework, and does that bar differ between a doc-only spec and a code-bearing one?
- Which generation backend authors the proposals, and what minimum review checklist must an operator clear before clearing the pending-review marker?
<!-- /ANCHOR:questions -->

---

## VERDICT

Novel GO, GO-on-cost. This is a genuinely novel floor-bypassing capability the reuse-first work missed and the lineage headline among the novel out-of-the-box candidates (`research.md` section 3 row "Automatic example and test generation from specs"; section 3 lead paragraph, every genuinely-novel GO is a floor-bypasser). It writes additive adherence artifacts not vector rows, so it pays no truncation-floor tax and no re-index cost and is not gated on `015-prodmode-recall-gate`. It is the strongest adherence lever in the topic and dodges the auto-rewrite rail by being additive and human-approved, never a silent rewrite of requirement prose (`research.md` section 3; section 5 INV-1). It pairs with the EARS and `AC_COVERAGE` and `REQ_COVERAGE` work in `007-ears-constraints-req-coverage` as its downstream consumer, giving those coverage gates concrete per-requirement artifacts to count.
