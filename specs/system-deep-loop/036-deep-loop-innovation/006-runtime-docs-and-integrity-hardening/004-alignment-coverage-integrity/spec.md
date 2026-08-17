---
title: "Feature Specification: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "The densest confirmed cluster in the register: 15 of 20 findings carry a CONFIRMED mark. Alignment coverage fails open (an absent corpus reads as 100 percent), lane identity is neither injective nor agreed between the two readers, and coverage credit is self-attested with no proof that the claimed artifacts were audited. This child makes all three provable, including the three §5 residuals."
trigger_phrases:
  - "alignment coverage integrity"
  - "coverage fails open corpus"
  - "lane identity injective normalizer"
  - "unearned coverage credit alignment"
  - "deep loop 026 alignment"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/004-alignment-coverage-integrity"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Landed as ca64df3f55+ee8c4dd67a+c83c53d44c+1578d8533e on skilled/v4.0.0.0"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions:
      - "For F-SOL-04, F-SOL-06 and F-SOL-07 the register supplies no recommended action; ADR-004 through ADR-006 derive and accept the actions."
      - "The evidence-binding design generalizes at the leaf-writer boundary; alignment adopts it without restructuring durable publication."
    answered_questions:
      - "All six F-RES-* residuals are scoped here; none is deferred"
      - "The slice-binding layer sits on top of the closed record parser that `024` owns structurally"
      - "The 5 pre-existing command-contract failures in the alignment script suite belong to `031`, not here"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Make Alignment Coverage, Seal State and Lane Identity Provable

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `003-artifact-certificate-binding`; successor `005-mode-gate-and-contract-binding`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The alignment half's own `STOPPED-AFTER-SAMPLE.md` says every coverage figure the mode produces is invalid. Three mechanisms explain it. Coverage fails open: an absent or malformed corpus yields an empty map, every lane is skipped, and the ratio returns 1.0, so missing evidence reads as full coverage. Identity is neither injective nor agreed: `laneKey()` omits the adapter, lane identity omits scope type and joins arrays with a comma-space, and the two readers normalize differently, so identical bytes are accepted by one and rejected as an orphan by the other. And credit is self-attested: neither reducer nor leaf writer proves the claimed artifacts were audited, which is the same fabrication mode observed live when a fan-out lineage emitted formally valid iteration artifacts it had not earned.

**Key Decisions**: One shared normalizer and canonical lane identity used by both readers (ADR-001); coverage fails closed with four distinguishable states (ADR-002); coverage credit is bound to per-artifact evidence and restricted to the dispatched slice (ADR-003); the three derived actions are accepted in ADR-004 through ADR-006.

**Critical Dependencies**: `024` hard, at file level: the closed record parser in `leaf-artifact-writer.ts`. `021` for the RED alignment baseline. Sequence before `031` for `reduce-alignment-state.cjs`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-07-30 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/004-alignment-coverage-integrity` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W3 |
| **Findings in scope** | 20 (8 P0 / 12 P1 / 0 P2), 15 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — gates the alignment lane of the cutover (not one of the four named blockers) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three mechanisms invalidate alignment coverage. **Coverage fails open.** An absent or malformed corpus yields `{}`, every lane is skipped as `laneDiscovered===0`, and `coverage = discovered>0 ? checked/discovered : 1.0` returns 1.0 (`F-009-01`, CONFIRMED). The reducer unions any non-empty `artifactsChecked` string with no intersection against the canonical corpus, so N arbitrary identifiers satisfy an N-artifact corpus (`F-009-02`, CONFIRMED). Bare numeric counts accumulate and clamp at corpus size, so re-checking one slice reaches full coverage (`F-SOL-07`). Failed, stuck and timed-out iterations still contribute coverage and feed the stability window (`F-RES-03`). A lane in config but absent from a non-empty corpus becomes `NOT_APPLICABLE` and drops out of both the ratio and the partitioning (`F-SOL-01`). The seal predicate excludes integrity faults but not pre-discovery state (`F-RES-02`), and the workflow marks `status complete` without checking `sealed===true` (`F-RES-01`). **Identity is not injective and not agreed.** `laneKey()` omits the adapter, so `sk-design` and `sk-design-live-render` share reducer state (`F-009-03`). Lane identity omits scope type and joins array values with a comma-space, so `paths:["docs/"]` collides with `globs:["docs/"]` (`F-RES-05`, whose consequence is now inverted: legitimate distinct lanes collide into a duplicate-corpus integrity fault and halt the run). `check-convergence.cjs` normalises with `.trim()` while the reducer collapses internal whitespace (`F-SOL-04`, which also reports an over-tightening regression from the in-run fix). Duplicate lane IDs overwrite in Maps while totals sum, so `CONVERGED` can coexist with `overallVerdict: FAIL` (`F-SOL-02`). **Credit is self-attested.** Neither reducer nor leaf writer proves the claimed canonical paths were audited or belonged to the dispatched slice (`F-RES-04`), and the live-render adapter returns clean on a caller-supplied `dispatchedThrough` string with no measurements (`F-009-04`). The partitioner falls back to a raw count as a cursor, so a count-only record equal to corpus size returns `done:true` with zero credited coverage (`F-RES-06`).

### Purpose
Make alignment coverage, seal state and lane identity provable: both readers agree on identical bytes, four corpus states are distinguishable, and coverage credit requires per-artifact evidence from the dispatched slice.

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
- The five pre-existing command-contract failures in the alignment script suite (`F-ORC-01`). `021` records them as a RED baseline; `031` triages them. They are not regressions of this child.
- The structural ownership of `leaf-artifact-writer.ts` — `024` owns atomic publication and the closed parser; this child layers slice-binding on top.
- Strict delta-corruption handling in `reduce-alignment-state.cjs` — that is `031`, sequenced after this child.
- Certificate binding (`025`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shared normalizer used by both `check-convergence.cjs` and `reduce-alignment-state.cjs`, so identical bytes reach the same conclusion.
- Canonical lane identity that includes the adapter and the scope type and cannot collide across separator choices (hash the canonical scope object, or use a separator that cannot occur in scope values).
- Coverage that fails closed: an absent or malformed corpus is never 100 percent.
- Four distinguishable states: corpus absent (discovery incomplete), present and valid with zero artifacts (genuine `NOTHING_TO_CONVERGE`), present and malformed (integrity fault), configured lane missing from a non-empty corpus (integrity fault).
- Intersection of `artifactsChecked` against the canonical corpus rather than a union of arbitrary strings.
- Failed, stuck and timed-out iterations excluded from coverage and from the stability window.
- Seal predicate that excludes pre-discovery state, and a workflow that checks `sealed===true` before marking complete.
- Coverage credit bound to per-artifact evidence (a finding, a content digest, or an adapter check receipt) and restricted to the dispatched slice.
- Live-render adapter returning a check receipt with measurements rather than a caller-supplied `dispatchedThrough` string.
- Partition cursor advanced from credited identity evidence only.
- Registry honesty: alignment registered against the convergence backend it actually uses (`F-026-04`).
- Fixing the `F-SOL-04` over-tightening regression introduced by the in-run fix.

### Out of Scope
- The 5 pre-existing command-contract test failures (`031`).
- Atomic leaf publication and the closed parser (`024`).
- Strict delta-corruption handling in the reducer (`031`).

### Findings in Scope (20)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-009-01` | P0 | CONFIRMED | `deep-alignment/scripts/check-convergence.cjs:107` | Missing or corrupt corpus becomes 100% coverage |
| `F-009-02` | P0 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:259` | Coverage accepts checked identifiers outside the corpus |
| `F-009-03` | P0 | unverified | `runtime/scripts/reduce-alignment-state.cjs:97` | Adapter variants collide under the same lane identity |
| `F-009-04` | P0 | unverified | `deep-alignment/scripts/adapters/sk-design-live-render.cjs:465` | Live-render adapter passes without render evidence |
| `F-009-05` | P1 | unverified | `deep-alignment/scripts/partition-corpus.cjs:92` | Live-render artifacts have no partition identity |
| `F-009-06` | P1 | unverified | `deep-alignment/scripts/scoping.cjs:254` | Interactive scoping discards the selected adapter |
| `F-RES-01` | P0 | CONFIRMED | `commands/deep/assets/deep-alignment-auto.yaml:770` | Workflow marks a run complete without requiring the reducer to have sealed it |
| `F-RES-02` | P0 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:641` | Reducer seal predicate excludes integrity faults but not pre-discovery state |
| `F-RES-03` | P0 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:393` | Failed iteration evidence still counts toward coverage and stability |
| `F-RES-04` | P0 | CONFIRMED | `runtime/lib/deep-loop/leaf-artifact-writer.ts:145` | Alignment artifact coverage is self-attested — audit execution is never proven |
| `F-RES-05` | P1 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:100` | Lane IDs are not injective across scope types or comma-containing values |
| `F-RES-06` | P1 | CONFIRMED | `deep-alignment/scripts/partition-corpus.cjs:126` | Count-only progress advances the partition cursor without earning credit |
| `F-SOL-01` | P1 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:399` | Alignment corpus/config bijection unvalidated — omitted lane silently drops from coverage |
| `F-SOL-02` | P1 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:188` | Duplicate/orphan corpus lane IDs accepted; the two readers disagree |
| `F-SOL-03` | P1 | CONFIRMED | `deep-alignment/scripts/check-convergence.cjs:227` | Absent corpus indistinguishable from valid empty corpus — pre-discovery reads as a pass |
| `F-SOL-04` | P1 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:212` | Alignment lane-ID normalization differs between the two readers |
| `F-SOL-05` | P1 | CONFIRMED | `commands/deep/assets/deep-alignment-auto.yaml:733` | DISCOVERY_INCOMPLETE is not handled by its workflow consumers |
| `F-SOL-06` | P1 | CONFIRMED | `deep-alignment/scripts/check-convergence.cjs:168` | Present-but-empty corpus with configured lanes still reads as NOTHING_TO_CONVERGE |
| `F-SOL-07` | P1 | CONFIRMED | `runtime/scripts/reduce-alignment-state.cjs:381` | Repeated bare artifact counts re-credit coverage for unmeasured identities |
| `F-026-04` | P1 | unverified | `deep-alignment/scripts/check-convergence.cjs:21` | Alignment is registered as review-backed although it uses a separate convergence backend |

Fifteen of these twenty carry a CONFIRMED mark, which makes this the densest confirmed cluster in the register and the strongest argument for Level 3 despite the work being "just scripts". Three findings (`F-SOL-04`, `F-SOL-06`, `F-SOL-07`) ship with "Recommended action: Not supplied by the reporting iteration — derive one when triaging", so their remediation is design work requiring a decision record. `F-SOL-04` additionally reports an over-tightening regression from the in-run fix: an honest corpus lane is now falsely rejected, so this child must fix a fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Modify | Shared normalizer; fail-closed coverage; four distinguishable states (`F-009-01`, `F-SOL-03`, `F-SOL-06`, `F-026-04`) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | Modify | Retain the selected adapter through interactive scoping (`F-009-06`) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs` | Modify | Partition identity for live-render artifacts; cursor from credited evidence (`F-009-05`, `F-RES-06`) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs` | Modify | Return a check receipt with measurements (`F-009-04`) |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Modify | Canonical lane identity; corpus intersection; failed-iteration exclusion; seal predicate (`F-009-02`, `F-009-03`, `F-RES-02`, `F-RES-03`, `F-RES-05`, `F-SOL-01`, `F-SOL-02`, `F-SOL-04`, `F-SOL-07`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts` | Modify | Slice-binding semantics on top of `024`'s closed parser (`F-RES-04`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-alignment-auto.yaml` | Modify | Require `sealed===true` before complete; handle `DISCOVERY_INCOMPLETE` (`F-RES-01`, `F-SOL-05`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-alignment-confirm.yaml` | Modify | Same seal and discovery handling as the auto variant |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modify | Register alignment against its actual convergence backend (`F-026-04`) |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modify | Registry honesty follow-through for `F-026-04` |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/coverage-integrity.test.cjs` | Modify | Four-state and unearned-credit assertions |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/partition-identity-progress.test.cjs` | Modify | Cursor-from-credited-evidence assertions |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/reducer-seal-state.test.cjs` | Modify | Seal predicate excludes pre-discovery state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both readers reach the same conclusion on identical bytes. | Shared-normalizer differential test over a corpus fixture set including duplicate IDs, orphan lanes, repeated internal whitespace, `paths` versus `globs` with equal values, and comma-containing values: `check-convergence.cjs` and `reduce-alignment-state.cjs` agree on every case. |
| REQ-002 | Four corpus states are distinguishable and none of them is 100 percent coverage by default. | Corpus absent = discovery incomplete (non-pass); present, valid, zero artifacts = genuine `NOTHING_TO_CONVERGE`; present and malformed = integrity fault; configured lane missing from a non-empty corpus = integrity fault. |
| REQ-003 | Coverage credit requires per-artifact evidence and is restricted to the dispatched slice. | Unearned-credit test: a leaf claiming the full canonical corpus with no per-artifact evidence earns zero coverage. |
| REQ-004 | Lane identity is injective over the canonical scope object. | `paths:["docs/"]` and `globs:["docs/"]` produce different identities; `paths:["a","b"]` and `paths:["a, b"]` produce different identities; `sk-design` and `sk-design-live-render` do not share reducer state. |
| REQ-005 | The workflow may not mark a run complete without `sealed===true`. | A run whose reducer did not seal cannot reach `status complete`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Failed, stuck and timed-out iterations contribute no coverage and do not feed the stability window. | Named test per iteration outcome. |
| REQ-007 | The live-render adapter returns a check receipt with measurements rather than a caller-supplied string. | An adapter call with a `dispatchedThrough` string and no measurements does not return clean. |
| REQ-008 | The partition cursor advances only from credited identity evidence. | A count-only record equal to corpus size does not return `done:true` with zero credited coverage. |
| REQ-009 | The `F-SOL-04` over-tightening regression is fixed: an honest corpus lane is no longer falsely rejected. | Named test with an honest corpus lane that the in-run fix rejects and this child accepts. |
| REQ-010 | Alignment is registered against the convergence backend it actually uses. | `mode-registry.json` and the hub docs state the real backend; a registry-versus-implementation check passes. |

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

- **SC-001**: All 20 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: The shared-normalizer differential test is green across the full adversarial corpus fixture set.
- **SC-003**: Four corpus states are distinguishable, and an absent corpus never reads as full coverage.
- **SC-004**: A leaf claiming the full canonical corpus with no per-artifact evidence earns zero coverage.
- **SC-005**: Lane identity is injective across scope types, separators and adapters.
- **SC-006**: The `F-SOL-04` over-tightening regression is fixed and covered by a test.
- **SC-007**: `node --test` over the alignment script suite reports a delta against the `021` RED baseline, with the 5 pre-existing command-contract failures excluded as `031`'s scope.
- **SC-008**: `npm run typecheck && npm test` in `runtime` green as a delta against the `021` baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-tightening again: the in-run fix already produced one false rejection (`F-SOL-04`) | High | Honest-corpus fixtures in the differential test set; REQ-009 makes the regression an explicit acceptance case |
| Risk | The evidence-binding design is alignment-shaped and does not generalize, though the same fabrication mode was seen live in fan-out | Medium | ADR-003 states the generalization intent; the binding lives in the leaf writer layer so other modes can adopt it |
| Risk | Miscounting the 5 pre-existing failures as regressions | High | The `021` RED baseline is the delta anchor; the 5 failures are named and excluded explicitly |
| Risk | File-level collision with `024` on `leaf-artifact-writer.ts` | High | `024` owns the parser structurally and lands it early; this child layers on top and never restructures publication |
| Risk | `031` also edits `reduce-alignment-state.cjs` | Medium | This child lands coverage and identity semantics first; `031` then applies strict delta-corruption handling |
| Dependency | `024` closed record parser | Hard, file level | Cannot start the slice-binding layer until the parser exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Agreement
- **NFR-A01**: Both readers must reach the same conclusion for identical input bytes, across the full adversarial fixture set.

### Fail-closed
- **NFR-F01**: Absence of evidence must never be reported as coverage.
- **NFR-F02**: A run may not be marked complete unless the reducer sealed it.

### Identity
- **NFR-I01**: Lane identity must be injective over the canonical scope object, independent of separator choice and array ordering conventions.

### Provability
- **NFR-P01**: Coverage credit must be traceable to per-artifact evidence within the dispatched slice.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Corpus absent: discovery incomplete, non-pass (`F-SOL-03`).
- Corpus present, valid, zero artifacts: genuine `NOTHING_TO_CONVERGE` (`F-SOL-06`).
- Corpus present, malformed: integrity fault, never 100 percent (`F-009-01`).
- Configured lane absent from a non-empty corpus: integrity fault, not `NOT_APPLICABLE` (`F-SOL-01`).
- `paths:["docs/"]` versus `globs:["docs/"]`: distinct identities (`F-RES-05`).
- `paths:["a","b"]` versus `paths:["a, b"]`: distinct identities (`F-RES-05`).

### Error Scenarios
- Duplicate lane IDs: the two views must not disagree; `CONVERGED` may not coexist with `overallVerdict: FAIL` (`F-SOL-02`).
- Repeated internal whitespace: both readers must treat it identically (`F-SOL-04`).
- Failed, stuck or timed-out iteration: contributes no coverage (`F-RES-03`).
- Leaf claiming the whole corpus with no evidence: zero coverage (`F-RES-04`).

### State Transitions
- Count-only record equal to corpus size: does not strand the loop with `done:true` and zero credit (`F-RES-06`).
- Reducer did not seal: workflow cannot mark complete (`F-RES-01`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 20 findings (8 P0 / 12 P1) across 12 files spanning three layers: CommonJS scripts, `runtime/lib` TypeScript, and YAML workflow assets |
| Risk | 22/25 | Edits `leaf-artifact-writer.ts` and `reduce-alignment-state.cjs`, both consumed by other modes; the lane-identity change unmatches existing reducer state; five named risks (R-001..R-005) with H/M impact |
| Research | 14/20 | 15 of 20 findings already CONFIRMED, but `F-SOL-04`, `F-SOL-06`, `F-SOL-07` ship with no recommended action, requiring three derived ADRs before any code targets them |
| Multi-Agent | 8/15 | Five sequential phases, three independent ADR derivations in Phase 1, one independent-verification pass (REQ-U04) |
| Coordination | 10/15 | Hard file-level dependency on `024`'s closed record parser; sequenced before `031`'s reducer work; gates the alignment lane of `014` (not one of the four named cutover blockers) |
| **Total** | **76/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Over-tightening rejects an honest corpus lane again | H | M | Honest-corpus fixtures; REQ-009 makes the `F-SOL-04` regression an explicit acceptance case |
| R-002 | The 5 pre-existing failures are counted as regressions of this child | M | H | `021` RED baseline as the delta anchor; the 5 are named and excluded |
| R-003 | File collision with `024` on `leaf-artifact-writer.ts` | H | M | `024` owns the parser and lands it early; this child never restructures publication |
| R-004 | The evidence-binding design does not generalize beyond alignment | M | M | ADR-003 places the binding in the leaf writer layer, where other modes can adopt it |
| R-005 | Shared normalizer changes behavior for existing corpora in unexpected ways | M | M | Differential test across the adversarial fixture set before landing |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Missing evidence is not full coverage (Priority: P0)

**As a** operator reading an alignment coverage figure, **I want** an absent or malformed corpus to be distinguishable from complete coverage, **so that** a coverage number means work was done rather than that nothing was found.

**Acceptance Criteria**:
1. Given an absent corpus, When convergence is checked, Then the result is discovery incomplete and non-pass.
2. Given a present, valid, empty corpus, When convergence is checked, Then the result is a genuine `NOTHING_TO_CONVERGE`, distinct from the absent case.

### US-002: Credit must be earned (Priority: P0)

**As a** reviewer auditing an alignment run, **I want** a leaf claiming the whole corpus with no per-artifact evidence to earn zero coverage, **so that** a formally valid artifact cannot fabricate audit work that was never done.

**Acceptance Criteria**:
1. Given a leaf artifact claiming the full canonical corpus with no per-artifact evidence, When the reducer credits coverage, Then it credits zero.
2. Given a leaf claiming artifacts outside its dispatched slice, When the reducer credits coverage, Then only the in-slice artifacts count.

### US-003: Both readers agree (Priority: P0)

**As a** engineer debugging a run where convergence and the reducer disagree, **I want** identical bytes to produce identical conclusions in both readers, **so that** a lane is not accepted by one reader and rejected as an orphan by the other.

**Acceptance Criteria**:
1. Given a corpus fixture with repeated internal whitespace, When both readers process it, Then they reach the same conclusion.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- `F-SOL-04`, `F-SOL-06` and `F-SOL-07` ship with "Recommended action: Not supplied by the reporting iteration — derive one when triaging". Deriving those three actions is design work; each is recorded as an ADR in `decision-record.md` as it is derived, not assumed here.
- Does the evidence-binding design generalize beyond alignment? The same fabrication mode was observed live when a fan-out lineage emitted formally valid iteration artifacts it had not earned, which argues the binding belongs in the leaf writer layer rather than in the alignment reducer. ADR-003 takes that position; confirm before Phase 4.
- `F-RES-05`'s consequence is inverted from the original defect: legitimate distinct lanes now collide into a duplicate-corpus integrity fault and halt the run. The fix must restore injectivity without re-introducing the original collision. Both directions need a fixture.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../001-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../001-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../001-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
