---
title: Deep Review Strategy
description: Session tracking for the lineage deepseek-max-3 traceability review of packet 012-deep-loop-command-offers.
---

# Deep Review Strategy - deepseek-max-3

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
- Session: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`, fan-out lineage against the packet's `review/`.
- Operator review focus (bound): finish the `spec_code` and `checklist_evidence` protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Stop policy: `max-iterations` with `maxIterations: 5`. Convergence before the cap is telemetry only.
- Success criteria: both core traceability protocols recorded with `pass` and file:line evidence; every REQ carries an implementation or decision anchor; every ticked task and `Met` AC row cites evidence that resolves in the tree.

## 2. TOPIC

Review of packet `012-deep-loop-command-offers`: the advisor's deep-loop command gate, the offer documentation, the hub routing drift, the degraded-brief rendering, and the sixth and seventh remediation rounds (REQ-023 to REQ-034, AC-030 to AC-043, ADR-005, ADR-006, ADR-007).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- Re-running the advisor build, vitest suite, Python suite, probe harness or corpus recapture. Those write outside this lineage and are the build's evidence, not this review's; they are read as recorded evidence and their line anchors are verified in the tree.
- Fixing any finding. The review is observation-only; remediation is a separate step.
- Reviewing packet 013 as a target. It is cited only as the cross-packet evidence REQ-034 names.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (5) reached, with `maxIterationsReached` as the terminal stop reason.
- All four canonical dimensions covered and both core traceability protocols recorded at `pass`.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED

- Importing the TypeScript module through the repo's own tsx loader and exercising `attachCommand` over 40 prompts: the gate's refusal, typed, deferred and stuck branches became observed behaviour in one pass (iteration 1)
- Cutting the Python gate at the same prompts through its own `_apply_deep_loop_offer_gate`: the two copies agreed row for row, which turned a parity claim into a measurement (iteration 1, iteration 2)
- Timing a 96,150-character prompt: REQ-030's cost claim became 12 ms of measured work rather than a restated number (iteration 1)
- Comparing the 69-row probe pair against the baseline for the keep and negative rows: REQ-001 to REQ-004 and REQ-008 settled as a 34-row identity rather than as prose (iteration 3)
- Hashing every `sourceDigests` entry in the compiled command contract: REQ-007's "regenerated" claim became fifteen matching digests (iteration 3)
- Resolving each citation against the base its document declares: 116 references resolved, and the 42 that would have looked missing read from the packet directory instead (iteration 3, iteration 4)
- Rerunning fifteen ticked rows' own commands: the checklist became reproducible without a suite build (iteration 4)
- Reading the drift guard's Python-source reader: it fails closed on a renamed list, which is what makes the two-language maintenance story credible (iteration 5)

---

## 9. WHAT FAILED

- Reading the citation base first would have saved a sweep: resolving short-form `path:line` references from the packet directory reported 42 false missing files before the `$ADV` base was applied (iteration 3)
- The 26-versus-27 `doctorWithheld` count looked like a fixture drift until the header's own mention of the field was found; counting lines is not counting rows (iteration 4)
- Leaving `maintainability` to the final iteration cost the coverage gate: `coverage-too-young` needs one iteration after the last dimension is first covered, and a five-iteration run has no such pass left (iteration 5)
- The review could not rerun the vitest or Python suites, because `dist/` is absent and the review may not write; the packet's recorded numbers were read as evidence instead (every iteration)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A `Met` row resting on a citation that does not resolve:** ruled out; all 116 `path:line` citations in the packet resolve once the documents' declared `$ADV` base is applied. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A `Met` row resting on a citation that does not resolve:** ruled out; all 116 `path:line` citations in the packet resolve once the documents' declared `$ADV` base is applied.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `Met` row resting on a citation that does not resolve:** ruled out; all 116 `path:line` citations in the packet resolve once the documents' declared `$ADV` base is applied.

### **A `Waived` or `Superseded` row with no backing ADR:** ruled out; ADR-001, ADR-002 and ADR-003 all exist and say what the cells claim. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A `Waived` or `Superseded` row with no backing ADR:** ruled out; ADR-001, ADR-002 and ADR-003 all exist and say what the cells claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `Waived` or `Superseded` row with no backing ADR:** ruled out; ADR-001, ADR-002 and ADR-003 all exist and say what the cells claim.

### **A bare-naming false offer:** ruled out; "refactor the deep research scorer", "review our multi-pass compiler" and the other seven REQ-019 subject prompts return no command on either route. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A bare-naming false offer:** ruled out; "refactor the deep research scorer", "review our multi-pass compiler" and the other seven REQ-019 subject prompts return no command on either route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A bare-naming false offer:** ruled out; "refactor the deep research scorer", "review our multi-pass compiler" and the other seven REQ-019 subject prompts return no command on either route.

### **A checklist row silently ticked while the work is outstanding:** ruled out; `T084` and `CHK-020` are open and each names its reason. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A checklist row silently ticked while the work is outstanding:** ruled out; `T084` and `CHK-020` are open and each names its reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A checklist row silently ticked while the work is outstanding:** ruled out; `T084` and `CHK-020` are open and each names its reason.

### **A closure story that diverges between the four packet documents:** ruled out; the rounds, their numbers and their ADRs agree, apart from the scaffold block raised above. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A closure story that diverges between the four packet documents:** ruled out; the rounds, their numbers and their ADRs agree, apart from the scaffold block raised above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A closure story that diverges between the four packet documents:** ruled out; the rounds, their numbers and their ADRs agree, apart from the scaffold block raised above.

### **A drift guard that silently compares against an empty list:** ruled out; the Python tuple reader answers `undefined` on a renamed list, and the test asserts it is defined before comparing. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A drift guard that silently compares against an empty list:** ruled out; the Python tuple reader answers `undefined` on a renamed list, and the test asserts it is defined before comparing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A drift guard that silently compares against an empty list:** ruled out; the Python tuple reader answers `undefined` on a renamed list, and the test asserts it is defined before comparing.

### **A maintainability defect in the reducer's refinement path:** ruled out by reading the rule and its unit test's stated result. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A maintainability defect in the reducer's refinement path:** ruled out by reading the rule and its unit test's stated result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A maintainability defect in the reducer's refinement path:** ruled out by reading the rule and its unit test's stated result.

### **A missing near-miss or holdout row:** ruled out; 31 near-miss rows and the three `-04` deep-family holdouts are present. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing near-miss or holdout row:** ruled out; 31 near-miss rows and the three `-04` deep-family holdouts are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing near-miss or holdout row:** ruled out; 31 near-miss rows and the three `-04` deep-family holdouts are present.

### **A path or quoted mention becomes a request:** ruled out for the `.md` path form and for the parenthesised form, by probe. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A path or quoted mention becomes a request:** ruled out for the `.md` path form and for the parenthesised form, by probe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A path or quoted mention becomes a request:** ruled out for the `.md` path form and for the parenthesised form, by probe.

### **A prompt can start a deep run without confirmation:** ruled out; both `/deep` rows carry `policy: ask`, and `attachCommand` returns a bare command string with no policy override. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A prompt can start a deep run without confirmation:** ruled out; both `/deep` rows carry `policy: ask`, and `attachCommand` returns a bare command string with no policy override.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt can start a deep run without confirmation:** ruled out; both `/deep` rows carry `policy: ask`, and `attachCommand` returns a bare command string with no policy override.

### **A quadratic scan left in the lead reads:** ruled out; `endsBefore` slices a 400-character window rather than the whole prefix (`command-attach.ts:629-646`), and the 96,150-character probe completed in 12 ms. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A quadratic scan left in the lead reads:** ruled out; `endsBefore` slices a 400-character window rather than the whole prefix (`command-attach.ts:629-646`), and the 96,150-character probe completed in 12 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A quadratic scan left in the lead reads:** ruled out; `endsBefore` slices a 400-character window rather than the whole prefix (`command-attach.ts:629-646`), and the 96,150-character probe completed in 12 ms.

### **A refusal of the change still yielding a writing command:** ruled out; the no-edit guard precedes the deep gate and the fused writing-command guard repeats it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A refusal of the change still yielding a writing command:** ruled out; the no-edit guard precedes the deep gate and the fused writing-command guard repeats it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refusal of the change still yielding a writing command:** ruled out; the no-edit guard precedes the deep gate and the fused writing-command guard repeats it.

### **A refusal placed after a 90,000-character prefix escapes the bounded window:** ruled out; the trailing refusal is still read and the command withheld. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A refusal placed after a 90,000-character prefix escapes the bounded window:** ruled out; the trailing refusal is still read and the command withheld.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refusal placed after a 90,000-character prefix escapes the bounded window:** ruled out; the trailing refusal is still read and the command withheld.

### **A refusal that still offers the command:** ruled out for all six REQ-023 verbs and for the six REQ-015 prompts, by probe on both copies. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A refusal that still offers the command:** ruled out for all six REQ-023 verbs and for the six REQ-015 prompts, by probe on both copies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refusal that still offers the command:** ruled out for all six REQ-023 verbs and for the six REQ-015 prompts, by probe on both copies.

### **A regression in the keep or negative groups:** ruled out; 34 rows match the baseline exactly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A regression in the keep or negative groups:** ruled out; 34 rows match the baseline exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A regression in the keep or negative groups:** ruled out; 34 rows match the baseline exactly.

### **A REQ row with no implementation behind it:** ruled out; each of the 34 resolved to a file, an ADR or a stored measurement. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A REQ row with no implementation behind it:** ruled out; each of the 34 resolved to a file, an ADR or a stored measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A REQ row with no implementation behind it:** ruled out; each of the 34 resolved to a file, an ADR or a stored measurement.

### **A REQ-011 clause still unmet after ADR-007:** ruled out; the two aliases are in both files, the dropped alias is absent from both, and the four removed regression phrases are gone from the two mode packets. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A REQ-011 clause still unmet after ADR-007:** ruled out; the two aliases are in both files, the dropped alias is absent from both, and the four removed regression phrases are gone from the two mode packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A REQ-011 clause still unmet after ADR-007:** ruled out; the two aliases are in both files, the dropped alias is absent from both, and the four removed regression phrases are gone from the two mode packets.

### **A secret left in the changed runtime files:** ruled out by grep over all six. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A secret left in the changed runtime files:** ruled out by grep over all six.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A secret left in the changed runtime files:** ruled out by grep over all six.

### **A spec or task id left in a code comment:** ruled out across the eight changed files. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A spec or task id left in a code comment:** ruled out across the eight changed files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A spec or task id left in a code comment:** ruled out across the eight changed files.

### **A stale compiled contract:** ruled out; all fifteen digests match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale compiled contract:** ruled out; all fifteen digests match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale compiled contract:** ruled out; all fifteen digests match.

### **A ticked task whose stated verification no longer holds:** ruled out over fifteen reruns and the whole-row sweep. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A ticked task whose stated verification no longer holds:** ruled out over fifteen reruns and the whole-row sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A ticked task whose stated verification no longer holds:** ruled out over fifteen reruns and the whole-row sweep.

### **A type/length divergence between the two copies on the head and the window:** ruled out; both read `10_000` and `400` (`advisor-tool-schemas.ts:257`, `skill_advisor.py:52`, `skill_advisor.py:4921`), and the drift guard compares the two numbers against the Python source (`deep-loop-offer-cases.vitest.ts:80-83`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A type/length divergence between the two copies on the head and the window:** ruled out; both read `10_000` and `400` (`advisor-tool-schemas.ts:257`, `skill_advisor.py:52`, `skill_advisor.py:4921`), and the drift guard compares the two numbers against the Python source (`deep-loop-offer-cases.vitest.ts:80-83`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A type/length divergence between the two copies on the head and the window:** ruled out; both read `10_000` and `400` (`advisor-tool-schemas.ts:257`, `skill_advisor.py:52`, `skill_advisor.py:4921`), and the drift guard compares the two numbers against the Python source (`deep-loop-offer-cases.vitest.ts:80-83`).

### **A typed command hidden by a longer second command:** ruled out by probe over both REQ-025 prompts. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A typed command hidden by a longer second command:** ruled out by probe over both REQ-025 prompts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A typed command hidden by a longer second command:** ruled out by probe over both REQ-025 prompts.

### **A Verification Summary that overstates the verified count:** ruled out; `11/12`, `13/13` and `1/1` are what the boxes hold. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A Verification Summary that overstates the verified count:** ruled out; `11/12`, `13/13` and `1/1` are what the boxes hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Verification Summary that overstates the verified count:** ruled out; `11/12`, `13/13` and `1/1` are what the boxes hold.

### **Directive-like text inside the review targets:** ruled out; none found, so no untrusted-instruction finding is raised. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Directive-like text inside the review targets:** ruled out; none found, so no untrusted-instruction finding is raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Directive-like text inside the review targets:** ruled out; none found, so no untrusted-instruction finding is raised.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- [Populated as iterations rule directions out, with iteration and evidence]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations: 5`; the run proceeds to synthesis with stop reason `maxIterationsReached`. - Rotation status: fourth rotation complete; all four canonical dimensions are covered and both core protocols are at pass. - Blocked/productive carry-forward: the productive category "resolve the citation against its declared base, then read the line" carried the two traceability passes; the exhausted category "probe with a wrong argument order" from the template's prior run does not apply here. - Required evidence for synthesis: five active P2 findings, two protocol statuses at pass with file:line references, the terminal gate rows, and the four-dimension coverage record.

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 46 files in `review-scope-files.txt`, headed by `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `skill_advisor.py`, the two command documents, the two presentation assets, the shared fixture, both gate test suites and the packet's own docs.
- Behavior claims: `spec.md` REQ-001 to REQ-034, `acceptance-criteria.md` AC-001 to AC-043, `tasks.md` T001 to T087 with CHK rows, and ADR-001 to ADR-007 in `decision-record.md`.
- Reuse and conventions: the gate is pinned in two copies (TypeScript `command-attach.ts` and Python `skill_advisor.py`); the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is the parity surface both suites read; `reduce-state.cjs` folds findings.
- Review risks: the packet's documented evidence is a prior build's report, and `dist/` is gitignored, so probe and suite numbers are recorded evidence rather than reproducible inside this lineage. A claim is checked by confirming the cited code and line exist and say what the row says they say. Task and decision citations use the documents' declared shell aliases (`$ADV` and its `lib/`, `scripts/`, `tests/` subdirectories), so a short-form `path:line` must be resolved against the alias base, never the packet directory.
- Prior review state: the packet's earlier `review/review-report.md` returned FAIL on its coverage gate; this lineage is the follow-up rerun REQ-033, T084 and AC-040 ask for.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | not run yet |
| `checklist_evidence` | core | pending | - | not run yet |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| (46 scope files) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-deepseek-max-3-1795514074741-gl47kr, parentSessionId=2026-11-24T09:54:34.000Z, generation=4, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:56:49Z
<!-- MACHINE-OWNED: END -->
