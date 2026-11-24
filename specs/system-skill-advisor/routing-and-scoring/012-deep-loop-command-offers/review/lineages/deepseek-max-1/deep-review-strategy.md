---
title: Deep Review Strategy
description: Session tracking for the lineage deepseek-max-1 traceability review of packet 012-deep-loop-command-offers.
---

# Deep Review Strategy - deepseek-max-1

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
- Session: `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`, fan-out lineage against the packet's `review/`.
- Operator review focus (bound): finish the `spec_code` and `checklist_evidence` protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Stop policy: `max-iterations` with `maxIterations: 5`. Convergence before the cap is telemetry only; the run broadens review angles instead of synthesizing early.
- Success criteria: both core traceability protocols recorded with evidence; every REQ carries an implementation or decision anchor; every ticked task and `Met` AC row cites evidence that exists.

## 2. TOPIC

Review of packet `012-deep-loop-command-offers`: the advisor's deep-loop command gate, the offer documentation, the hub routing drift, and the sixth remediation round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the advisor's build, vitest suite, Python suite, probe set or corpus recapture. Those write outside this lineage and are the build's evidence, not this review's; they are read as recorded evidence and their line anchors are verified in the tree.
- Fixing any finding. The review is observation-only; remediation is a separate step.
- Reviewing packet 013 (`013-deep-loop-offer-in-hint`) as a target. It is cited only as the cross-packet evidence REQ-034 and AC-041 name.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (5) reached, with `maxIterationsReached` as the terminal stop reason.
- All four canonical dimensions covered and both core traceability protocols recorded.

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
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the probe file as data and then the requirement row: the gain, keep and negative rows became one observed result instead of prose (iteration 1)
- A mechanical sweep of all 116 `path:line` citations across the six docs: it cleared the citation layer in one pass and left only semantic defects (iteration 1)
- Comparing each REQ-015 to REQ-019 prompt against the shared fixture by substring: every stated boolean held, so the band closed without a live run (iteration 2)
- Running `compare.mjs` instead of restating AC-042: `changes=0 guarded_failures=0` became observed command evidence (iteration 4)
- Counting CHK boxes by priority tag: the Verification Summary's 12/13/1 and 11/13/1 matched, which narrowed the checklist pass to the four real rows (iterations 2 and 4)
- Scanning the added runtime/lib lines for artifact labels: the comment-hygiene gate cleared as an observation, not a claim (iteration 5)

---

## 9. WHAT FAILED
- Treating a resolvable `file:line` as verified evidence: all twelve AC-030 to AC-041 citations resolved, yet three of them carry counts the tree no longer produces (iteration 4)
- Reading the first six fixture rows and inferring the fixture size: the count only became visible after parsing the whole file with `node` (iteration 1)
- Assuming the seventh round updated every closure surface it touched: the changelog and T087 moved to 3,126 while AC-042 stayed at 3,029, which is the count finding (iteration 2)
- Estimating the iteration timestamps for iterations 3 to 5 instead of reading the clock, so those records run ahead of the ledger receipts (recorded as a provenance caveat in the report, not a finding)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A `DEPTH_WORDING` contradiction in REQ-011: ruled out as a finding because the packet records the symbol's removal in CHK-FIX-002 and AC-016/AC-018 test the behavioural clause directly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `DEPTH_WORDING` contradiction in REQ-011: ruled out as a finding because the packet records the symbol's removal in CHK-FIX-002 and AC-016/AC-018 test the behavioural clause directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `DEPTH_WORDING` contradiction in REQ-011: ruled out as a finding because the packet records the symbol's removal in CHK-FIX-002 and AC-016/AC-018 test the behavioural clause directly.

### A `typed: true` marker stripped by the Zod parse: ruled out by `advisor-tool-schemas.ts:308`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A `typed: true` marker stripped by the Zod parse: ruled out by `advisor-tool-schemas.ts:308`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `typed: true` marker stripped by the Zod parse: ruled out by `advisor-tool-schemas.ts:308`.

### A broken citation path anywhere in the packet's six docs: ruled out by the 116-reference sweep (0 unresolved). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A broken citation path anywhere in the packet's six docs: ruled out by the 116-reference sweep (0 unresolved).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken citation path anywhere in the packet's six docs: ruled out by the 116-reference sweep (0 unresolved).

### A builder that tunes on a holdout row: ruled out by reading the three split readers; each skips or labels holdout rows. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A builder that tunes on a holdout row: ruled out by reading the three split readers; each skips or labels holdout rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A builder that tunes on a holdout row: ruled out by reading the three split readers; each skips or labels holdout rows.

### A comment-hygiene violation in the changed code: ruled out by the added-line scan over the packet's commits. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A comment-hygiene violation in the changed code: ruled out by the added-line scan over the packet's commits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A comment-hygiene violation in the changed code: ruled out by the added-line scan over the packet's commits.

### A contradiction between AC-035 and the `:364` test: ruled out by reading the test body; it exercises an untyped row the degraded producer no longer emits. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A contradiction between AC-035 and the `:364` test: ruled out by reading the test body; it exercises an untyped row the degraded producer no longer emits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A contradiction between AC-035 and the `:364` test: ruled out by reading the test body; it exercises an untyped row the degraded producer no longer emits.

### A dead-end worth a finding in the singular `typedCommandIn` export: ruled out. Its longest-key contract is pinned by `command-attach.vitest.ts:173-175`, and every production caller now reads `typedCommandsIn`, which satisfies rather than contradicts REQ-025. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A dead-end worth a finding in the singular `typedCommandIn` export: ruled out. Its longest-key contract is pinned by `command-attach.vitest.ts:173-175`, and every production caller now reads `typedCommandsIn`, which satisfies rather than contradicts REQ-025.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dead-end worth a finding in the singular `typedCommandIn` export: ruled out. Its longest-key contract is pinned by `command-attach.vitest.ts:173-175`, and every production caller now reads `typedCommandsIn`, which satisfies rather than contradicts REQ-025.

### A divergence between `attachCommand` and the Python gate on the four typed rows: ruled out by the shared fixture columns and the line-by-line comparison above. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A divergence between `attachCommand` and the Python gate on the four typed rows: ruled out by the shared fixture columns and the line-by-line comparison above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A divergence between `attachCommand` and the Python gate on the four typed rows: ruled out by the shared fixture columns and the line-by-line comparison above.

### A drift between ADR-007 and the hub files: ruled out by searching both aliases and the dropped one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A drift between ADR-007 and the hub files: ruled out by searching both aliases and the dropped one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A drift between ADR-007 and the hub files: ruled out by searching both aliases and the dropped one.

### A false command on any gain or keep probe: ruled out by the 69-row probe file, every row `live` with `exit 0`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A false command on any gain or keep probe: ruled out by the 69-row probe file, every row `live` with `exit 0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false command on any gain or keep probe: ruled out by the 69-row probe file, every row `live` with `exit 0`.

### A false offer on "review our multi-pass compiler" through a missing artifact noun: ruled out by the hyphen-count subject rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A false offer on "review our multi-pass compiler" through a missing artifact noun: ruled out by the hyphen-count subject rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false offer on "review our multi-pass compiler" through a missing artifact noun: ruled out by the hyphen-count subject rule.

### A further behavioural REQ mismatch beyond those already recorded: ruled out by the four-pass REQ sweep; the remaining defects are documentation-state defects. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A further behavioural REQ mismatch beyond those already recorded: ruled out by the four-pass REQ sweep; the remaining defects are documentation-state defects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A further behavioural REQ mismatch beyond those already recorded: ruled out by the four-pass REQ sweep; the remaining defects are documentation-state defects.

### A miscount in the Verification Summary: ruled out by counting CHK boxes by priority tag. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A miscount in the Verification Summary: ruled out by counting CHK boxes by priority tag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A miscount in the Verification Summary: ruled out by counting CHK boxes by priority tag.

### A missing fixture row for any REQ-015 to REQ-019 prompt: ruled out by prompt-substring search over all 248 cases. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missing fixture row for any REQ-015 to REQ-019 prompt: ruled out by prompt-substring search over all 248 cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing fixture row for any REQ-015 to REQ-019 prompt: ruled out by prompt-substring search over all 248 cases.

### A prompt-injection or ReDoS opening in the changed gate: ruled out by the bounded head, the bounded lead window and the absence of dynamic execution. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A prompt-injection or ReDoS opening in the changed gate: ruled out by the bounded head, the bounded lead window and the absence of dynamic execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A prompt-injection or ReDoS opening in the changed gate: ruled out by the bounded head, the bounded lead window and the absence of dynamic execution.

### A remaining `autonomous research` alias or a council-word boost in the gate: ruled out by two `rg` sweeps that print nothing. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A remaining `autonomous research` alias or a council-word boost in the gate: ruled out by two `rg` sweeps that print nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A remaining `autonomous research` alias or a council-word boost in the gate: ruled out by two `rg` sweeps that print nothing.

### A TypeScript/Python divergence on the typed-stuck, typed-refused, typed-question or typed-doc-path rows: ruled out at the gate layer by the shared `typedReviewKept`/`servedReviewKept` columns and the Python `_apply_deep_loop_offer_gate` clauses. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A TypeScript/Python divergence on the typed-stuck, typed-refused, typed-question or typed-doc-path rows: ruled out at the gate layer by the shared `typedReviewKept`/`servedReviewKept` columns and the Python `_apply_deep_loop_offer_gate` clauses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A TypeScript/Python divergence on the typed-stuck, typed-refused, typed-question or typed-doc-path rows: ruled out at the gate layer by the shared `typedReviewKept`/`servedReviewKept` columns and the Python `_apply_deep_loop_offer_gate` clauses.

### A Verification Summary miscount: ruled out by counting the CHK boxes and matching 12/13/1 with 11/13/1 verified. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A Verification Summary miscount: ruled out by counting the CHK boxes and matching 12/13/1 with 11/13/1 verified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Verification Summary miscount: ruled out by counting the CHK boxes and matching 12/13/1 with 11/13/1 verified.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A false command on any gain, keep or negative probe row: ruled out by the 69-row probe file, every row `live`/`exit 0` (iterations 1 and 4)
- A remaining `autonomous research` alias or a council-word boost: ruled out by `rg` over the hub files and the gate (iteration 1)
- A broken `path:line` citation in the packet docs: 116 references, 0 missing, 0 past end (iteration 1)
- A missing or inverted fixture row for any REQ-015 to REQ-019 prompt: ruled out by substring search over all 248 cases (iteration 2)
- A builder that tunes on a holdout row: the three split readers skip or label holdout rows (iteration 2)
- A TypeScript/Python divergence on the typed, stuck or doctor rows: the shared fixture columns and both copies agree (iterations 2 and 3)
- A prompt-injection or ReDoS opening: 10,000-unit head, 400-character lead window, no dynamic execution (iteration 5)
- A comment-hygiene violation in the changed code: the added-line scan prints nothing (iteration 5)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations: 5`; the run proceeded to synthesis with stop reason `maxIterationsReached`.
- Rotation status: all four canonical dimensions covered (traceability 1-2-4, correctness 3, maintainability and security 5).
- Blocked/productive carry-forward: the productive category "observed command, then read the cited line" carried the run; the two-language gate divergence direction is closed for this tree.
- Required evidence for synthesis: six active P2 findings, the two protocol statuses, the terminal gate rows and the four-dimension coverage record.
- Verdict: FAIL on the coverage gate (checklist_evidence partial); remediation is workstreams W1 to W4 in `review-report.md`.
<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 46 files in `review-scope-files.txt`, headed by `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, the two command documents, the two presentation assets, the shared fixture, both gate test suites and the packet's own docs.
- Behavior claims: `spec.md` REQ-001 to REQ-034, `acceptance-criteria.md` AC-001 to AC-043, `tasks.md` T001 to T087, and ADR-001 to ADR-007 in `decision-record.md`.
- Reuse and conventions: the gate is pinned in two copies (TypeScript `command-attach.ts` and Python `skill_advisor.py`), and the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is the parity surface both suites read.
- Review risks: the packet's own documented evidence is a prior build's report; the probe/suite numbers are recorded evidence, not reproducible inside this lineage, so a claim is checked by confirming the cited code and line exist and say what the row says they say.
- Prior review state: the packet's archived three-lineage review (2026-11-24) returned FAIL on the coverage gate; this lineage is one of the follow-up reruns REQ-033 and T084/AC-040 ask for. It returned FAIL on the coverage gate for the four residual closure-row defects, with no P0 or P1.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1-3 | all 34 REQ rows checked; no unimplemented or contradicted requirement |
| `checklist_evidence` | core | partial | 1, 4, 5 | all 43 rows read; four Met rows carry defective evidence (three counts, one pointer) and AC-012's requirement link is wrong |
| `skill_agent` | overlay | notApplicable | - | packet is a spec folder, no skill/agent pair is the target |
| `agent_cross_runtime` | overlay | notApplicable | - | no agent mirrors in scope |
| `feature_catalog_code` | overlay | notApplicable | - | no catalog claim in scope |
| `playbook_capability` | overlay | notApplicable | - | no playbook in scope |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `command-attach.ts`, `skill_advisor.py`, `fusion.ts`, `explicit.ts`, handler/render/schema files | D1, D2, D3, D4 | 5 | 0 P0, 0 P1, 0 P2 in code | complete |
| `deep-loop-offer-cases.json`, the gate vitest suites, `test_skill_advisor.py` | D1, D3 | 4 | 1 P2 (counts) | complete |
| `spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, changelog | D3, D4 | 5 | 0 P0, 0 P1, 6 P2 | complete |
| the two command documents, both presentation files, both YAMLs, hub router/ROUTER, hub SKILL | D3 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| probe files, `compare.mjs`, reducer and closure scripts | D1, D3 | 5 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-deepseek-max-1-1795514074741-gl47kr, parentSessionId=2026-11-24T09:54:34.000Z, generation=4, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:55:25Z
<!-- MACHINE-OWNED: END -->
