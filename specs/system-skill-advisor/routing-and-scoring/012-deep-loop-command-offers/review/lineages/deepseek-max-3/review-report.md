# Deep Review Report

**Target:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
**Mode:** review, spec-folder target, Level 2
**Run:** `fanout-deepseek-max-3-1795518961022-7ms9ak` (fan-out lineage, generation 5)
**Iterations:** 7 of 7
**Stop reason:** `maxIterationsReached`
**Executor:** cli-pi, deepseek-v4.1-flash-1017

---

## 1. Executive Summary

**Overall verdict: FAIL.** No active P0 or P1 exists, but the terminal `coverage` gate fails with reason `traceability-incomplete`, and the review verdict table makes a required quality gate failing at the stop a FAIL. The registry-only derivation would read CONDITIONAL on the three P2 findings and the one search-debt row; the gate is the release-blocking input, and the dashboard records the same FAIL.

**Ledger note:** the `synthesis_complete` row records the value the workflow's registry-only derivation produced (CONDITIONAL). The terminal gate row and the reducer dashboard record FAIL. The fan-out merge reads the gate and the active counts, so FAIL is the release verdict; the registry-only value is kept visible rather than overwritten.

**Required quality gates at the terminal stop:** `evidence` pass, `scope` pass, **`coverage` fail** with reason `traceability-incomplete`. The coverage gate fails because the `checklist_evidence` core protocol is `partial` on a hard gate: thirteen `Met` acceptance rows cite the row above the evidence they name, and one more row's sentence about `review/` no longer describes the tree. The fan-out merge escalates any lineage whose required gate is still failing at its stop to a merged FAIL; this lineage reports the failure rather than hiding it.

**Counts the verdict used:** P0 = 0, P1 = 0, P2 = 3. Search debt = 1 deferred test-execution row.

**Self-check outcomes:** no active P0 or P1 existed, so the adversarial self-check had nothing to adjudicate; no finding was confirmed, downgraded or called a false positive.

**Review scope:** 46 pre-bound scope files (the advisor gate copies, shared fixture, guard and serving tests, command assets, deep-loop runtime reducer and its tests, and packet 013 docs), plus the packet docs required for traceability. All 39 REQs, all 47 acceptance rows and all 93 task rows were read. The two core protocols were exercised; `spec_code` reads `pass`, `checklist_evidence` reads `partial`.

**Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

## 2. Planning Trigger

`/speckit:plan` **is required**. The packet is not closeable: AC-040 is `Unmet`, the coverage gate fails on the evidence-cell drift, and one code advisory needs a fixture and a two-copy fix.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "requiredGateFailure": ["coverage"],
  "activeFindings": ["R2-P2-001", "R2-P2-002", "R4-P2-001"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "severity": "P2",
      "title": "Repoint the acceptance evidence cells",
      "findings": ["R2-P2-001", "R2-P2-002"],
      "surface": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
    },
    {
      "id": "WS-2",
      "severity": "P2",
      "title": "Read the effort word in a complaint shape, not after any loop name",
      "findings": ["R4-P2-001"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts, runtime/scripts/skill_advisor.py, tests/fixtures/deep-loop-offer-cases.json"
    }
  ],
  "specSeed": [
    "AC-001 to AC-017, AC-021, AC-028 and AC-041 cite implementation-summary.md rows one line early; repoint them and keep AC-040's review/ sentence true.",
    "A request that puts an effort word after the loop name (\"run a deep review longer than the last one\") is withheld; define the manner-vs-complaint rule explicitly."
  ],
  "planSeed": [
    "Repoint every drifted evidence cell in acceptance-criteria.md and re-read each row on the cited line.",
    "Add fixture cases for a post-name effort manner and its control, then align both gate copies.",
    "Rerun the traceability review so checklist_evidence can read pass and the coverage gate can pass."
  ],
  "findingClasses": ["instance-only", "class-of-bug"],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### R2-P2-001 -- Acceptance evidence cells point one row above the closure-pass and limitation rows they cite

- **Severity:** P2
- **Dimension:** traceability
- **File:line:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58`
- **Evidence:** AC-001 to AC-005, AC-010, AC-013, AC-016 and AC-021 cite `implementation-summary.md:153` (the fourth-round corpus row) instead of `:154` (the closure-pass probe row); AC-011 cites `:154` instead of `:155`; AC-012 cites `:155` instead of `:156`; AC-017 cites `:156` instead of `:157`; AC-028 cites `:177` to `:178` and misses the probe row at `:180`; AC-041 cites `:232`, `:230`, `:258`, `:259` and `:260` for the paragraph at `:233`, the reversed line at `:231`, limitations 6 and 7 at `:259` and `:260`, and limitation 8 at `:261`.
- **Impact:** a reader following a `Met` row lands on the neighbouring observation; the checklist-evidence protocol cannot pass while its pointers are wrong, which is what fails the coverage gate.
- **Fix recommendation:** repoint the cells to the named rows, preferably by row label rather than a bare line number, and re-read each on the cited line.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** every pointer is in the acceptance table; each cited line was opened at the stated number.
- **Affected surface hints:** `acceptance-criteria.md`; the row labels in `implementation-summary.md` are the durable anchors.

### R2-P2-002 -- AC-040 says `review/` still holds the pre-fix report, but the report is archived

- **Severity:** P2
- **Dimension:** traceability
- **File:line:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:135`
- **Evidence:** `review/` holds no `review-report.md`; the prior reports are at `review-archive/20261124T090549Z/review-report.md`, `review-archive/20261124T095434Z/review-report.md` and `review-archive/20261124T111600Z/review-report.md`.
- **Impact:** the row's `Unmet` status is still correct, but its sentence about where the report lives misleads a reader.
- **Fix recommendation:** send the row to `review-archive/20261124T111600Z/review-report.md`, or state that the root report is archived before a rerun.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** `ls` of `review/` and a `find` for `review-report*.md` returned the three archive paths and no root report.
- **Affected surface hints:** `acceptance-criteria.md` AC-040; `review-archive/20261124T111600Z/review-report.md`.

### R4-P2-001 -- An effort word after the loop name withholds the command even when it is a manner on the request

- **Severity:** P2
- **Dimension:** correctness
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:931`
- **Evidence:** `LOOP_EFFORT_AFTER` leaves every group before the effort word optional, so it matches `" longer"` after any loop name; `_LOOP_EFFORT_AFTER_RE` at `skill_advisor.py:4781` has the same shape, read at `:5097`. The fixture pins the complaint (`deep-loop-offer-cases.json:276`) and three manner controls before the name, but no post-name manner.
- **Impact:** "run a deep review longer than the last one on the parser" gets no `/deep:review`; the prompt asks for a run and receives nothing.
- **Fix recommendation:** require a complaint shape (a subject or verb before the effort word) before treating it as a complaint, add a post-name manner fixture and its control, and mirror it in Python.
- **Disposition:** active
- **Finding class:** class-of-bug
- **Scope proof:** the pattern is at `command-attach.ts:931` to `:938`, read at `:968`; the Python copy is at `skill_advisor.py:4781` to `:4789`, read at `:5097`.
- **Affected surface hints:** `command-attach.ts`, `skill_advisor.py`, `deep-loop-offer-cases.json`, `command-attach-guards.vitest.ts`.

---

## 4. Remediation Workstreams

### P0 -- none

### P1 -- none

### P2 advisories

**WS-1 -- Repoint the acceptance evidence cells (R2-P2-001, R2-P2-002).**
1. Open `implementation-summary.md` and record the row label for each cited observation: closure probe, advisor suite, corpus, alias replay, sixth-round paragraph, reversed stuck-drop line, limitations 6, 7 and 8.
2. Repoint AC-001 to AC-005, AC-010, AC-013, AC-016, AC-021, AC-011, AC-012, AC-017, AC-028 and AC-041 to those rows.
3. Rewrite AC-040's sentence to name `review-archive/20261124T111600Z/review-report.md` (or the current archive) instead of `review/`.
4. Re-read every changed cell on its cited line before closing the workstream.

**WS-2 -- Read the effort word in a complaint shape (R4-P2-001).**
1. Add a fixture row for "run a deep review longer than the last one on the parser" (`asksForLoopRun: true`) and a control that keeps the complaint at `:276`.
2. Require the complaint's subject or verb before `LOOP_EFFORT_WORDS` matches, in `command-attach.ts` and `_LOOP_EFFORT_AFTER_RE`.
3. Run the two gate files and the Python suite; the shared fixture must agree on both sides.

---

## 5. Spec Seed

- State that a `Met` row's evidence must open on the observation it names, and that a bare line number is a weak anchor after a table grows.
- State the effort rule as a shape: a subject or verb plus an effort word is a complaint; an effort word as the manner of a requested run keeps the command.
- Keep AC-040's statement about the prior report accurate for the archive layout a rerun leaves behind.

---

## 6. Plan Seed

- [ ] Repoint the thirteen acceptance cells named in R2-P2-001 and the AC-040 sentence in R2-P2-002.
- [ ] Add the post-name effort fixture and its complaint control, then fix both gate copies.
- [ ] Rerun the fixture, the guard file and the Python suite.
- [ ] Rerun `/deep:review` on this packet with traceability as its focus so `checklist_evidence` can pass and AC-040 can close.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | All 39 REQs map to a producer, a decision or a captured run. REQ-001 to REQ-005 to `results-after.json`; REQ-006 to REQ-008 to the fixture and the guard file; REQ-009 to REQ-012 to the YAML, the presentations and the corpus; REQ-013 to REQ-022 to the hook capture and the fixture; REQ-023 to REQ-030 to both gate copies and the degraded path; REQ-031 to REQ-039 to the drift guard, the reducer, the corpus and the closure docs. |
| `checklist_evidence` | partial | 47 rows: 43 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet` (AC-040). Thirteen `Met` cells and AC-041's limitation block point one row early; AC-040's `review/` sentence is stale. The two `Waived` rows name ADR-002 and ADR-003; the `Superseded` row names ADR-001; all three exist. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `.skilled/agents/deep-review.md:37` and `deep-review/SKILL.md:19` agree on 0.10; both state P0/P1/P2, LEAF-only and the same writable packet paths. |
| `agent_cross_runtime` | pass | The Claude mirror body differs only in the path convention and two related-agent paths; the OpenCode copy is byte-identical to the canonical agent. |
| `feature_catalog_code` | notApplicable | The catalog makes no advisor-gate claim; its `--depth-mode` and `--extend` claims match the command docs. |
| `playbook_capability` | notApplicable | The deep-review manual-testing playbook has no offer-gate scenario. |

### AC_COVERAGE

Status: **advisory-shortfall**. 46 of 47 rows resolve (43 `Met` + 2 `Waived` + 1 `Superseded`); AC-040 stays `Unmet` because this review cannot write the packet's root report and the two evidence drifts keep `checklist_evidence` partial. The row is the closure gate, so the packet remains uncloseable.

---

## 8. Deferred Items

- **Search debt:** one deferred row, `SL-003`, bug class `test_execution`. The advisor vitest, Python and probe suites were not re-executed in this lineage because those runs write build and cache output outside the lineage write surface; the tests and their assertions were read instead. This debt is why the registry-derived verdict is CONDITIONAL rather than PASS. The next `/deep:review` over this packet, run where the suites may execute, should clear it.
- **Frontier:** the registry carries no `frontier` object, so there is no follow-up node to list.
- **Advisories:** R2-P2-001, R2-P2-002 and R4-P2-001 above are advisory-only for the release verdict; they do not raise an active P0 or P1.

---

## Dimension Expansion Map

Reducer-owned divergence: no completed pivot, no failed pivot, no audited override, no saturated direction, no remaining frontier and no current pivot focus. The run took the fixed dimension order plus the cross-reference fallback; no Council artifact was produced and no direction was overridden.

---

## 9. Search Ledger

- **`searchCoverage`:** required bug classes were `spec_code_drift`, `checklist_evidence_drift`, `test_execution`, plus the correctness and security classes raised later. `spec_code_drift`, `checklist_evidence_drift`, `effort_manner_false_negative`, `command_injection`, `prompt_dos`, `secret_exposure`, `comment_hygiene`, `mirror_drift`, `catalog_drift`, `playbook_gap`, `status_contradiction`, `waiver_backing` and `count_drift` are covered or ruled out. `test_execution` is deferred. `graphCoverageMode` is `graph`.
- **`candidateCoverage`:** covered `checklist_evidence_drift`, `effort_manner_false_negative` and `spec_code_drift`; 12 classes ruled out; 1 deferred.
- **`searchDebt`:** one row, `SL-003`, deferred, `test_execution`. `hasSearchDebt: true`. The release verdict is already FAIL on the coverage gate; the debt is the reason a registry-only derivation would still read CONDITIONAL rather than PASS.
- **`ruledOutCandidates` / `cleanSearchProof`:** 17 ledger rows, each with evidence refs at `command-attach.ts`, `skill_advisor.py`, the fixture, the corpus or the packet docs. The clean-search rows are the first-pass traceability and security probes; they cite the producer or test that closes each class.
- **Unresolved:** none beyond the deferred row.

---

## 10. Audit Appendix

### Convergence Summary

- Iterations: 7 of 7; stop reason `maxIterationsReached`.
- Dimension order: traceability (1-3), correctness (4), security (5), maintainability and overlays (6), cross-reference fallback (7).
- New findings by iteration: 0, 2, 0, 1, 0, 0, 0.
- No iteration failed or timed out; no stuck recovery, pause or manual stop.

### Coverage Summary

| Dimension | Iterations | Verdict |
|-----------|------------|---------|
| traceability | 1, 2, 3, 7 | PASS with two P2 advisories |
| correctness | 4 | PASS with one P2 advisory |
| security | 5 | PASS, no finding |
| maintainability | 6 | PASS, no finding |

Evidence density: all three active findings carry a `file:line`; the evidence gate passes. Scope: all three findings sit inside the review target; the scope gate passes. Coverage: four of four dimensions covered, but the `checklist_evidence` core protocol is partial on a hard gate, so the coverage gate fails.

State-integrity note: the reducer's dimension table records all three P2 findings under `correctness` because the delta finding-row schema does not carry a dimension field. The iteration artifacts and this report record R2-P2-001 and R2-P2-002 under `traceability` and R4-P2-001 under `correctness`. The counts agree (3 active P2, 0 resolved); only the reducer's dimension attribution differs, and it changes no verdict input.

### Ruled-Out Claims

- The served typed-on-stuck column exists only in TypeScript -- false; Python reads it.
- REQ-031's Python vocabulary has no named copy -- false; all fifteen tuples exist.
- REQ-025 changed `typedCommandIn` for other callers -- false; it still keeps the longest key.
- The bounded window is native-only -- false; Python reads the same 400.
- Keep or negative probe groups moved -- false; 0 changes against the baseline over 34 rows.
- A child-supplied command can reach the brief -- false; the tracked table gates it.
- A changed code comment carries an ephemeral label -- false; only the policy string matches.
- The packet claims closure while AC-040 is open -- false; all four status surfaces keep it open.
- A waived row names a missing ADR -- false; ADR-001, ADR-002 and ADR-003 exist.

### Sources Reviewed

- Packet docs: `spec.md`, `acceptance-criteria.md`, `decision-record.md`, `tasks.md`, `implementation-summary.md`, `plan.md`.
- Captured evidence: `scratch/probes/results-after.json`, `results-spec-baseline.json`, `fresh-review-hook.txt`, `scratch/behaviour/F6-sample-1.md`, `command-prompts.jsonl`, `command-routing-baseline.json`.
- Advisor code: `command-attach.ts`, `skill_advisor.py`, `skill-advisor-cli.ts`, `subprocess.ts`, `render.ts`, `fusion.ts`, `explicit.ts`, `advisor-recommend.ts`, `advisor-tool-schemas.ts`, the hook fallback.
- Tests: `deep-loop-offer-cases.vitest.ts`, `command-attach-guards.vitest.ts`, `typed-on-stuck-serving.vitest.ts`, `cli-degraded-command-contract.vitest.ts`, `command-brief-golden.vitest.ts`, `subprocess-typed-fields.vitest.ts`, `test_skill_advisor.py`, and the reducer's two unit files.
- Deep-loop runtime: `reduce-state.cjs`.
- Skill and agent surfaces: `.skilled/agents/deep-review.md`, both runtime mirrors, `deep-review/SKILL.md`, the deep-loop hub and its feature catalog, the manual-testing playbook.
- Command assets: both deep presentation files, `research.md`, `review.md`, both deep YAMLs, the compiled directory, the changelog.

### Cross-Reference Appendix

**Core Protocols:** `spec_code` pass; `checklist_evidence` partial (evidence-cell drift, R2-P2-001 and R2-P2-002).

**Overlay Protocols:** `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` notApplicable; `playbook_capability` notApplicable.
