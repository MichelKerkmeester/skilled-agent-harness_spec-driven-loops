---
title: "Feature Specification: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Six shadow-parity harness adapters compare a projection to a near-copy of itself, so the harness cannot fail. This child rebuilds each one so the ledger side materialises from the folded reducer projection only, the legacy side is an independently implemented oracle, and reducer exceptions propagate as parity failures instead of legacy successes."
trigger_phrases:
  - "shadow parity independent derivation"
  - "blocker 1 parity harness"
  - "harness adapter legacy oracle"
  - "divergence injection test parity"
  - "deep loop 022 parity"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-shadow-parity-independent-derivation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the remediation child package from the WS1 phase-tree proposal"
    next_safe_action: "Run T001 against the 6 scoped findings before any edit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 17
    open_questions:
      - "Does `assertLegacyProjectionMatchesCurrentState` become the shared comparator core, or does each mode keep its own oracle?"
      - "What is the complete protected semantic surface per mode that the comparator must cover?"
    answered_questions:
      - "The fix is one pattern applied six times, not six bespoke rebuilds"
      - "Per-mode acceptance is a divergence-injection test, not a green suite"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Rebuild Shadow Parity So Both Sides Derive Independently

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `021-completion-evidence-reconcile`; successor `023-legacy-compat-event-vocabulary`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Blocker 1 is that shadow parity, the named precondition for every authority cutover, cannot fail. Six harness adapters derive both sides of the comparison from the same source: council folds the real reducer only to check success and then returns a hand-derived event-stem scan; alignment derives both sides from one `foldProjection`; agent-improvement, model-benchmark and skill-benchmark fold and then discard `folded.projection` in favour of `legacyProjection(...)`; deep-review converts a reducer exception into legacy success. Parity evidence issued by such a harness carries no information. This child rebuilds all six around one pattern and proves each rebuild with an injected divergence the old harness passed.

**Key Decisions**: One shared comparator pattern applied six times (ADR-001); the existing partial oracle `assertLegacyProjectionMatchesCurrentState` is folded into the comparator rather than duplicated (ADR-002)

**Critical Dependencies**: `021` — parity evidence may not be issued against a baseline whose test counts are not honest.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress (1/6 modes built + verified: deep-ai-council independent-derivation; 5 remain) |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W2 (hard gate on 014) |
| **Findings in scope** | 6 (0 P0 / 6 P1 / 0 P2), 2 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — Blocker 1 of the four named cutover blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six shadow-parity harness adapters compare a projection to a near-copy of itself. `F-006-01` (CONFIRMED) records that the council adapter folds the real reducer only to validate success and then returns a hand-derived event-stem scan. `F-006-02` (CONFIRMED) records that the alignment adapter derives both sides from a single `foldProjection`, where only a resume digest is path-dependent. `F-012-01` through `F-012-03` record that agent-improvement, model-benchmark and skill-benchmark all fold and then discard `folded.projection` in favour of `legacyProjection(...)`. `F-012-04` records that deep-review additionally converts a reducer exception into legacy success. The mechanism in every case is that the harness cannot fail, which makes shadow parity, a named cutover precondition, an empty gate.

### Purpose
Make each mode's shadow parity a real comparison between an independently derived legacy oracle and the folded reducer projection, and prove it by injecting a semantic divergence that the current harness passes and the rebuilt harness must fail.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- Flipping any authority. Parity is proven here; authority moves only in `014`.
- Changing reducer semantics. Where the reducer and the oracle disagree, the disagreement is a finding, not a licence to edit the reducer to match.
- Rebuilding the compat upcasters — that is `023`.
- Certificate binding — that is `025`, even where it touches council reducer files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All six shadow-parity harness adapters: council, alignment, agent-improvement, model-benchmark, skill-benchmark, deep-review.
- For each: the ledger side materialises from `folded.projection` only.
- For each: the legacy side is an independently implemented oracle, not a re-read of the same projection.
- For each: reducer exceptions and non-`projected` outcomes propagate as parity **failures**, never as legacy success.
- For each: the comparator covers the complete protected semantic surface, not a fingerprint of shared state.
- For each: a divergence-injection test that the pre-fix harness passes and the post-fix harness fails.
- Folding the existing partial oracle (`assertLegacyProjectionMatchesCurrentState`, 4 digests, throws rather than diffing) into the comparator instead of duplicating it.

### Out of Scope
- The compat upcasters (`023`) even though both touch ledger-schema modules.
- Certificate issuance and verification (`025`).
- Any change to `014` cutover mechanics.

### Findings in Scope (6)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-006-01` | P1 | CONFIRMED | `runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:1263` | Council parity discards the real reducer projection |
| `F-006-02` | P1 | CONFIRMED | `runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts:793` | Alignment parity derives both paths from one typed projection |
| `F-012-01` | P1 | unverified | `runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts:850` | Agent-improvement ledger parity returns the legacy projection |
| `F-012-02` | P1 | unverified | `runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts:784` | Model-benchmark ledger parity discards the reducer projection |
| `F-012-03` | P1 | unverified | `runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts:788` | Skill-benchmark ledger parity discards the reducer projection |
| `F-012-04` | P1 | unverified | `runtime/lib/deep-review-shadow-parity/harness-adapter.ts:1637` | Deep-review parity converts reducer failure into legacy success |

Every ID above is assigned to this child and to no other. Locations are the anchors recorded during the review run; T001 re-resolves each one at HEAD.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts` | Modify | Return the folded reducer projection; add an independent legacy oracle (`F-006-01`, CONFIRMED) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts` | Modify | Derive the legacy side independently of `foldProjection` (`F-006-02`, CONFIRMED) |
| `.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts` | Modify | Stop discarding `folded.projection` (`F-012-01`) |
| `.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts` | Modify | Stop discarding `folded.projection` (`F-012-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts` | Modify | Stop discarding `folded.projection` (`F-012-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts` | Modify | Propagate reducer exceptions as parity failures (`F-012-04`) |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts` | Modify | Add the council divergence-injection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-shadow-parity.vitest.ts` | Modify | Add the alignment divergence-injection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-shadow-parity.vitest.ts` | Modify | Add the agent-improvement divergence-injection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-shadow-parity.vitest.ts` | Modify | Add the model-benchmark divergence-injection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-shadow-parity.vitest.ts` | Modify | Add the skill-benchmark divergence-injection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts` | Modify | Add the deep-review exception-propagation test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | For each of the six modes, the ledger side of the parity comparison materialises from `folded.projection` only. | Grep each adapter: no path returns a hand-derived scan or `legacyProjection(...)` as the ledger side. A test asserts the returned ledger projection is object-identical to `folded.projection`. |
| REQ-002 | For each of the six modes, the legacy side is an independently implemented oracle that does not read the folded projection. | The oracle module has no import path reaching the reducer fold. A test mutating `folded.projection` leaves the oracle output unchanged. |
| REQ-003 | Reducer exceptions and non-`projected` outcomes propagate as parity **failures**. | A test that makes the reducer throw produces a parity FAIL, never a legacy success (`F-012-04` inverted). |
| REQ-004 | Each of the six modes has a divergence-injection test that the pre-fix harness passes and the post-fix harness fails. | Six named tests, each demonstrated green against the pre-fix adapter and red against it after the rebuild inverts the outcome. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The comparator covers the complete protected semantic surface per mode, not a fingerprint of shared state. | Per mode, an enumerated surface list; a test per surface element proving a divergence in that element is detected. |
| REQ-006 | The existing partial oracle `assertLegacyProjectionMatchesCurrentState` is folded into the comparator, not duplicated. | One comparator implementation; the four digests it checked are covered by the new surface list; no second copy exists. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: Six divergence-injection tests exist, each demonstrated to pass against the pre-fix harness and fail against it after the rebuild.
- **SC-003**: No adapter returns a legacy-derived value as the ledger side of the comparison.
- **SC-004**: A reducer exception in any mode produces a parity failure.
- **SC-005**: `npm run typecheck && npm test` in `runtime` is green, reported as a delta against the `021` baseline.
- **SC-006**: Blocker 1 is discharged: parity evidence for each mode now distinguishes a rebuilt harness from a renamed one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rebuilt harness is renamed rather than genuinely independent | High | REQ-004 divergence injection is the only accepted proof; a green suite is not |
| Risk | Six independent oracles duplicate reducer logic and drift | Medium | ADR-002 folds the existing partial oracle into one comparator core; per-mode surface lists stay data, not code |
| Risk | Real parity failures surface once the harness works, blocking `014` further | Medium | That is the intended outcome. Record each as a finding against the owning mode rather than tuning the comparator to pass |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021`; cite the `021` baseline explicitly |
| Dependency | `025` shares council reducer files | Merge conflict risk | Coordinate on `deep-ai-council-reducers/`; serialize the merge, not the work |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Independence
- **NFR-I01**: The legacy oracle module must not transitively import the reducer fold. Enforced by an import-graph assertion.
- **NFR-I02**: A change to the reducer projection must not change the oracle output for the same input log.

### Determinism
- **NFR-D01**: Both sides must be deterministic for a fixed input log; parity failures must be reproducible.

### Coverage
- **NFR-C01**: Every element of the per-mode protected semantic surface must have a divergence test.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty event log: both sides must produce the same empty projection, and the comparator must report a pass rather than a vacuous skip.
- Single-event log: exercised per mode so the oracle is not only tested on rich inputs.
- Log containing an unknown event stem: the comparator must fail rather than ignore it.

### Error Scenarios
- Reducer throws: parity FAIL (`F-012-04` inverted), never legacy success.
- Reducer returns a non-`projected` outcome: parity FAIL.
- Oracle throws: parity FAIL, and the exception surfaces rather than being swallowed.

### State Transitions
- Partial fold followed by an exception: no partial projection may be compared as if complete.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 12 files in the scope table (6 harness adapters + 6 vitest suites), plus a new comparator core and six oracle modules under `runtime/lib` |
| Risk | 18/25 | Shared comparator core touches six modes at once; a core bug is loud (all six divergence injections fail together) rather than silent, but the blast radius still spans every mode's parity gate |
| Research | 12/20 | Two findings are CONFIRMED and root-caused, but the per-mode protected semantic surface is not yet enumerated — that is real open investigation, not confirm-before-build alone |
| Multi-Agent | 6/15 | Single workstream, five sequential phases, one independent-verification pass (REQ-U04) targeted at oracle independence |
| Coordination | 13/15 | Hard gate on `014` Blocker 1 (Wave W2); depends on `021`'s honest baseline; shares `deep-ai-council-reducers/` with `025` and must serialize the merge |
| **Total** | **65/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The rebuild is cosmetic: the harness still cannot fail | H | M | Divergence injection per mode is the acceptance gate (REQ-004) |
| R-002 | Six oracles drift from one another and from the reducer | M | M | One comparator core (ADR-002); per-mode surfaces expressed as data |
| R-003 | Working parity reveals real divergences that block `014` longer | M | H | Expected; record as findings against the owning mode, never tune the comparator to pass |
| R-004 | Concurrent edits to council reducer files by `025` | M | M | Serialize the merge; declare file ownership in `MANIFEST.md` |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Parity evidence means something (Priority: P0)

**As a** operator deciding whether a mode can flip authority, **I want** the shadow-parity result to be capable of failing, **so that** a green parity run is evidence rather than a tautology.

**Acceptance Criteria**:
1. Given a semantic divergence injected into a mode's legacy path, When shadow parity runs, Then it reports FAIL.
2. Given the same injection against the pre-fix harness, When shadow parity runs, Then it reported PASS — and that contrast is recorded.

### US-002: A reducer crash is never a success (Priority: P0)

**As a** engineer reading a parity report, **I want** a reducer exception to be a parity failure, **so that** a crash cannot be laundered into legacy success.

**Acceptance Criteria**:
1. Given a reducer that throws, When deep-review shadow parity runs, Then the result is FAIL and the exception is surfaced.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Does `assertLegacyProjectionMatchesCurrentState` become the shared comparator core for all six modes, or does each mode keep a local oracle with a shared surface list? ADR-002 proposes the former; the alternative is recorded there.
- What is the complete protected semantic surface per mode? Enumerating it is the first task of Phase 2 and must be reviewed before the comparators are written, or the rebuild reproduces the original defect at a different granularity.
- Where the rebuilt harness reveals a genuine legacy/ledger divergence, does it block this child or open a finding against the owning mode? Recommended: open a finding, do not tune the comparator.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../016-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../016-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../016-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
