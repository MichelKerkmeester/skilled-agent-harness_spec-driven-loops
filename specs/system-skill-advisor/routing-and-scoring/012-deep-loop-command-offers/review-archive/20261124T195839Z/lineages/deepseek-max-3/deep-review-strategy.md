---
title: Deep Review Strategy - 012 deep-loop command offers (lineage deepseek-max-3)
description: Runtime strategy for the fan-out review lineage deepseek-max-3 over packet 012, tracking dimension coverage, findings, exhausted approaches and next focus.
trigger_phrases:
  - "deep review strategy 012"
  - "deepseek-max-3 review strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Review Strategy - Session 012 deep-loop command offers (deepseek-max-3)

## 1. OVERVIEW

### Purpose

Persistent state for this fan-out review lineage. Records which dimensions remain, what was found (P0/P1/P2), which review approaches worked or failed, and where to focus next.

### Usage

- Init: populated from `deep-review-config.json` and the operator review focus.
- Per iteration: the reviewer reads Next Focus, reviews the assigned dimension plus the operator focus, writes the iteration narrative and delta, and updates this file.
- Mutability: mutable except the machine-owned blocks, which the reducer refreshes.

---

## 2. TOPIC
Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder target). The packet records the advisor work that offers `/deep:review` or `/deep:research` from explicit loop wording, across ten fix rounds and six traceability reruns.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Re-implementing the gate, editing any reviewed file, or re-running the build/test suites as a release gate. This lineage reports findings only.

---

## 5. STOP CONDITIONS
The loop runs to `config.maxIterations` (7) with `stopPolicy: max-iterations`; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Evaluating every shared-fixture row against the built `dist` gate: 347 rows agreed on eight columns, which turns REQ-006/REQ-023 to REQ-029 from prose into a checked surface (iteration 1)
- Parsing every `Evidence: `path:line`` cell in `acceptance-criteria.md` and resolving it against the tree: 49 cells checked, one stale path found, and the method scales to the remaining closure docs (iteration 1)
- Diffing the exported word lists against `VOCABULARY_PAIRS` rather than reading the requirement: the guard's own data names the gap (iteration 1)

---

## 9. WHAT FAILED
- Reading `acceptance-criteria.md` citations from the repo root instead of the packet root: 22 false drifts until the base path was corrected (iteration 1, recoverable)
- Treating `doctorWithheld` as "no command at all": seven false mismatches until the column's own header (`$comment`) was read (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### "A `Met` row rests on an `Unmet`-style stale pointer": the only stale path is AC-040's, and that row is `Unmet`. A `Met` row's tail resolves to its token in every other case (49 cells checked in iteration 1). -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A `Met` row rests on an `Unmet`-style stale pointer": the only stale path is AC-040's, and that row is `Unmet`. A `Met` row's tail resolves to its token in every other case (49 cells checked in iteration 1).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A command pasted inside an earlier reply is marked typed on the native served head, while the degraded path strips it": the handler strips once at `advisor-recommend.ts:545` and feeds the stripped `scoredPrompt` to both `enrichCompiledRoutes` and `attachTypedCommand` (`:642`); `subprocess.ts:251` and `skill-advisor-cli.ts:1511` strip too. A direct call to `typedCommandForTop` with the raw prompt does mark it, but the handler never makes that call, so the divergence is not in reach. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A command pasted inside an earlier reply is marked typed on the native served head, while the degraded path strips it": the handler strips once at `advisor-recommend.ts:545` and feeds the stripped `scoredPrompt` to both `enrichCompiledRoutes` and `attachTypedCommand` (`:642`); `subprocess.ts:251` and `skill-advisor-cli.ts:1511` strip too. A direct call to `typedCommandForTop` with the raw prompt does mark it, but the handler never makes that call, so the divergence is not in reach.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A ticked task cites a file that has moved": no citation fails to resolve once `$ADV`/`$PKT` are expanded; the two that needed a second root are named above. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A ticked task cites a file that has moved": no citation fails to resolve once `$ADV`/`$PKT` are expanded; the two that needed a second root are named above.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-030's refusal count drifts from REQ-023": the fixture holds twelve `refusal-verb-*` rows — six named refusals, `refusal-verb-refused-to`, three keep controls and two conjunction controls — and the AC-030 verification cell counts exactly those seven/three/two. The "six" in the Given clause is narrower than the seven the verification counts, but the row is `Met` on the wider set and no claim is false. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "AC-030's refusal count drifts from REQ-023": the fixture holds twelve `refusal-verb-*` rows — six named refusals, `refusal-verb-refused-to`, three keep controls and two conjunction controls — and the AC-030 verification cell counts exactly those seven/three/two. The "six" in the Given clause is narrower than the seven the verification counts, but the row is `Met` on the wider set and no claim is false.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-032's double-typed prompts are ambiguous because `/doctor:deep-loop` shares the hub owner": `typedCommandsIn` returns commands in prompt order and `typedCommandForTop` takes the first owned one, so `/deep:review` wins the review route and `/doctor:deep-loop` wins when it is the only typed command. The two rows pin both orders. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "AC-032's double-typed prompts are ambiguous because `/doctor:deep-loop` shares the hub owner": `typedCommandsIn` returns commands in prompt order and `typedCommandForTop` takes the first owned one, so `/deep:review` wins the review route and `/doctor:deep-loop` wins when it is the only typed command. The two rows pin both orders.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-037's timing claim is unverifiable": the Python case prints its own timings (`counted=103ms, refused=100ms`) and both scans are windowed; the claim is recorded, not asserted here. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "AC-037's timing claim is unverifiable": the Python case prints its own timings (`counted=103ms, refused=100ms`) and both scans are windowed; the claim is recorded, not asserted here.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-038's twelve-and-ten split is wrong": twelve lists carry a per-entry `it.each`, and the ten named grammar-only lists match the ten pairs with no such case. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "AC-038's twelve-and-ten split is wrong": twelve lists carry a per-entry `it.each`, and the ten named grammar-only lists match the ten pairs with no such case.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "Packet 013's degraded-path row borrows evidence that does not resolve": all four cited lines hold the cases the row names. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "Packet 013's degraded-path row borrows evidence that does not resolve": all four cited lines hold the cases the row names.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-011's aliases are missing from the router": both files carry `iterative research` and `multi-round research` once each, and `autonomous research` is absent, which is what ADR-007 amends. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "REQ-011's aliases are missing from the router": both files carry `iterative research` and `multi-round research` once each, and `autonomous research` is absent, which is what ADR-007 amends.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-012's near-miss rows are countable but not real": the five probe prompts map to five distinct near-miss rows, and D1 maps to a plain doctor row whose `expected_command` is `/doctor:deep-loop`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "REQ-012's near-miss rows are countable but not real": the five probe prompts map to five distinct near-miss rows, and D1 maps to a plain doctor row whose `expected_command` is `/doctor:deep-loop`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-020's served-head exception is an undocumented drift": ADR-005 (`decision-record.md:412`) records it, AC-027 and AC-036 both name it, and the fixture carries `servedReviewKept`. The exception is documented at every layer. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "REQ-020's served-head exception is an undocumented drift": ADR-005 (`decision-record.md:412`) records it, AC-027 and AC-036 both name it, and the fixture carries `servedReviewKept`. The exception is documented at every layer.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-028 names `parseRecommendations` but the typed marking happens elsewhere": `parseRecommendations` (`subprocess.ts:187-236`) already preserves `command`, `policy`, `ownerSkillId` and `typed` from the child, and `withTypedCommand` only adds what the child omitted. The requirement's parenthetical holds. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "REQ-028 names `parseRecommendations` but the typed marking happens elsewhere": `parseRecommendations` (`subprocess.ts:187-236`) already preserves `command`, `policy`, `ownerSkillId` and `typed` from the child, and `withTypedCommand` only adds what the child omitted. The requirement's parenthetical holds.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-033 can be closed by this lineage's rerun": the rerun ends CONDITIONAL with an active P1, so the rerun AC-040 asks for is not a passing one. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "REQ-033 can be closed by this lineage's rerun": the rerun ends CONDITIONAL with an active P1, so the rerun AC-040 asks for is not a passing one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-034's Verification Summary does not match its boxes": the CHK rows count 12 P0 (11 ticked), 13 P1, 1 P2, exactly the summary's numbers. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "REQ-034's Verification Summary does not match its boxes": the CHK rows count 12 P0 (11 ticked), 13 P1, 1 P2, exactly the summary's numbers.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The `.claude` agent mirror drifts from canonical": the three differences are the documented frontmatter dialect and two runtime path renames, the `.opencode` mirror is byte-identical, and the packet changes no agent. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The `.claude` agent mirror drifts from canonical": the three differences are the documented frontmatter dialect and two runtime path renames, the `.opencode` mirror is byte-identical, and the packet changes no agent.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The 10,000-unit cut is a security-relevant truncation an attacker can use to smuggle a second instruction past the window": both copies cut the head and then scan windowed prefixes of that head; no scan reads the uncut tail, and the renderer prints no prompt text. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The 10,000-unit cut is a security-relevant truncation an attacker can use to smuggle a second instruction past the window": both copies cut the head and then scan windowed prefixes of that head; no scan reads the uncut tail, and the renderer prints no prompt text.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The closure docs' five different suite totals for one suite are contradictory": each total carries its commit stamp (3,029 at the sixth round, 3,188 at the eighth, 3,415 at `3db3085bcf0`, 3,418 on the final tree), and AC-028 states which is the final tree. Not drift. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The closure docs' five different suite totals for one suite are contradictory": each total carries its commit stamp (3,029 at the sixth round, 3,188 at the eighth, 3,415 at `3db3085bcf0`, 3,418 on the final tree), and AC-028 states which is the final tree. Not drift.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The double-negation gap is a parity failure between the copies": both copies return false, so the copies agree and the rule is the gap. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The double-negation gap is a parity failure between the copies": both copies return false, so the copies agree and the rule is the gap.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The feature catalog omits a documented feature": the offer is documented in the presentation contracts and command documents, which REQ-005 names; no requirement places it in a catalog. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The feature catalog omits a documented feature": the offer is documented in the presentation contracts and command documents, which REQ-005 names; no requirement places it in a catalog.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The gate offers a run for the mode-free plural ask": `attachCommand` on a deferred route returns nothing for "run two deep loops on the cache layer" (probe), and the fixture row `plural-deep-loops-served` reads `servedRun: none` (`tests/fixtures/deep-loop-offer-cases.json:318`). ADR-008's amendment and the code agree. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The gate offers a run for the mode-free plural ask": `attachCommand` on a deferred route returns nothing for "run two deep loops on the cache layer" (probe), and the fixture row `plural-deep-loops-served` reads `servedRun: none` (`tests/fixtures/deep-loop-offer-cases.json:318`). ADR-008's amendment and the code agree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The no-edit guard wrongly withholds the doctor command on a stuck run": the behaviour is intended and pinned (`tests/fixtures/deep-loop-offer-cases.json:148`, `no-edit-stuck`, `doctorWithheld: true`), and the fixture header states the no-edit withholds for the doctor row. Not a defect. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The no-edit guard wrongly withholds the doctor command on a stuck run": the behaviour is intended and pinned (`tests/fixtures/deep-loop-offer-cases.json:148`, `no-edit-stuck`, `doctorWithheld: true`), and the fixture header states the no-edit withholds for the doctor row. Not a defect.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The reducer flattening a multi-line Next Focus into one line is a defect": the reducer owns the anchor body and the template requires only the fields, so the flattening loses formatting but no content. Not a finding. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The reducer flattening a multi-line Next Focus into one line is a defect": the reducer owns the anchor body and the template requires only the fields, so the flattening loses formatting but no content. Not a finding.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The sixth-round paragraph's eleven pairs is stale": it is a historical statement about the sixth round, and the later rounds record the growth (T087 twelfth pair, T092 fifteen). Not drift. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The sixth-round paragraph's eleven pairs is stale": it is a historical statement about the sixth round, and the later rounds record the growth (T087 twelfth pair, T092 fifteen). Not drift.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The suite totals are mutually contradictory": each carries the round and commit it measured; AC-028 states which belongs to the final tree. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The suite totals are mutually contradictory": each carries the round and commit it measured; AC-028 states which belongs to the final tree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- None. This is the last iteration under `maxIterations`; the run goes to synthesis with stop reason `maxIterationsReached`. - Rotation status: correctness, security, traceability and maintainability each covered; both core protocols executed; overlays resolved. - Carry-forward for synthesis: P0=0, P1=1, P2=4, verdict CONDITIONAL, release readiness `in-progress`. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md` (D1-D10, 48 REQ), `acceptance-criteria.md` (56 AC), `tasks.md` (135 tasks, ten fix rounds), `decision-record.md` (8 ADRs), `implementation-summary.md`; code under `.skilled/skills/system-skill-advisor/runtime/` (gate, scorer, CLI degraded path, Python fallback), `.skilled/commands/deep/`, the reducer `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, and the shared fixture `tests/fixtures/deep-loop-offer-cases.json`.
- Behavior claims: REQ-001 to REQ-048, AC-001 to AC-056. The operator focus names the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Reuse and conventions: the packet's own ten rounds treat closure-doc drift as P2 and a claim without tree evidence as P1; AC-040 reads `Unmet` for the rerun the packet never ran.
- Review risks and gaps: five prior reruns returned FAIL on the coverage gate; evidence cells cite `path:line`, so a moved line is drift; the tree carries `.skilled/` and the mirror `dist` build, so a code claim can be true in source and false in the built artifact.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [54 scope files recorded in `deep-review-config.json` `reviewScopeFiles`] | [D1, D3] | [N] | [0 P0, 0 P1, 0 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-3-1795546920757-7pyjry, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T19:03:48Z
<!-- MACHINE-OWNED: END -->
