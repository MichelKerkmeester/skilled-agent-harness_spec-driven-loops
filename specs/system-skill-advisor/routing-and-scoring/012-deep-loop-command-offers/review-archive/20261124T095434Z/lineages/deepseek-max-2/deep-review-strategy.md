---
title: Deep Review Strategy
description: Session tracking for the lineage deepseek-max-2 traceability review of packet 012-deep-loop-command-offers.
---

# Deep Review Strategy - deepseek-max-2

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`, fan-out lineage against the packet's `review/`.
- Operator review focus (bound): finish the `spec_code` and `checklist_evidence` protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Stop policy: `max-iterations` with `maxIterations: 5`. Convergence before the cap is telemetry only.
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
- P1 (Required): 1
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the producer predicate and then exercising the real module over the REQ prompt set: it turned restated prose into observed behaviour in one pass (iteration 1)
- Timing the gate over adversarial shapes: REQ-030's cost claim became a measurement rather than a restated number (iteration 2)
- Comparing the two recorded probe files row by row, and running the 38-prompt matrix: REQ-001 to REQ-027 became settled facts rather than prose (iteration 3)
- Parsing the checklist rows and the waiver map instead of trusting the Verification Summary: the counts and ADRs agreed, which narrowed the pass to the two real defects (iteration 4)
- Comparing a finding with the packet's own prior review before settling its severity: the REQ-011 raise is grounded in the sixth round having been commissioned for the same class (iteration 5)

---

## 9. WHAT FAILED
- Calling `_apply_deep_loop_offer_gate` with its arguments reversed, and with a row id the gate does not key on, produced two false "no change" readings before the real row ids were used (iteration 1)
- `dist/` is gitignored and absent here, so REQ-006's `live` probe claim cannot be reproduced from this worktree without a build (iteration 2)
- The first citation sweep resolved short-form `path:line` references from the packet's own working directory instead of the advisor runtime, which reported false missing files until the base directory was fixed (iteration 3)
- Treating a resolvable line as a verified pointer missed AC-032's blank-line anchor; only a content check of the target line found it (iteration 4)
- Recording a core protocol as advisory to clear the coverage gate was considered and rejected: `reduce-state.cjs:1573-1580` exists to stop exactly that (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A `spec_code` mismatch on REQ-001 to REQ-004: ruled out by the row-by-row probe comparison. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A `spec_code` mismatch on REQ-001 to REQ-004: ruled out by the row-by-row probe comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `spec_code` mismatch on REQ-001 to REQ-004: ruled out by the row-by-row probe comparison.

### A behavioural failure of any REQ in the tree: ruled out across iterations 1 to 3 by live probes of the REQ prompt sets (42 prompts on correctness, 38 on the REQ-015 to REQ-027 matrix, 9 through the Python gate), the recorded probe pair and the adversarial timing shapes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A behavioural failure of any REQ in the tree: ruled out across iterations 1 to 3 by live probes of the REQ prompt sets (42 prompts on correctness, 38 on the REQ-015 to REQ-027 matrix, 9 through the Python gate), the recorded probe pair and the adversarial timing shapes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A behavioural failure of any REQ in the tree: ruled out across iterations 1 to 3 by live probes of the REQ prompt sets (42 prompts on correctness, 38 on the REQ-015 to REQ-027 matrix, 9 through the Python gate), the recorded probe pair and the adversarial timing shapes.

### A catastrophic-backtracking regression in the new patterns: ruled out by timing eight adversarial shapes; the worst case is 9.9 ms at 40,012 characters. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A catastrophic-backtracking regression in the new patterns: ruled out by timing eight adversarial shapes; the worst case is 9.9 ms at 40,012 characters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A catastrophic-backtracking regression in the new patterns: ruled out by timing eight adversarial shapes; the worst case is 9.9 ms at 40,012 characters.

### A clean status for either core protocol: ruled out by the six active findings, each re-read this iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A clean status for either core protocol: ruled out by the six active findings, each re-read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A clean status for either core protocol: ruled out by the six active findings, each re-read this iteration.

### A further batch of shifted `implementation-summary.md` pointers beyond the eleven reported in iteration 3: ruled out by the full sweep; every other citation resolves to a line with content. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A further batch of shifted `implementation-summary.md` pointers beyond the eleven reported in iteration 3: ruled out by the full sweep; every other citation resolves to a line with content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A further batch of shifted `implementation-summary.md` pointers beyond the eleven reported in iteration 3: ruled out by the full sweep; every other citation resolves to a line with content.

### A gate bug in the depth-word negative path: ruled out. `R7` and the no-gain prompts return no command, and no depth or council word opens the gate (`command-attach.ts:326-450`, live probe). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A gate bug in the depth-word negative path: ruled out. `R7` and the no-gain prompts return no command, and no depth or council word opens the gate (`command-attach.ts:326-450`, live probe).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A gate bug in the depth-word negative path: ruled out. `R7` and the no-gain prompts return no command, and no depth or council word opens the gate (`command-attach.ts:326-450`, live probe).

### A hidden compiled-contract string: ruled out; no `ASK with SINGLE prompt` anywhere under `assets/compiled/`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A hidden compiled-contract string: ruled out; no `ASK with SINGLE prompt` anywhere under `assets/compiled/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hidden compiled-contract string: ruled out; no `ASK with SINGLE prompt` anywhere under `assets/compiled/`.

### A live gate failure against any REQ-015 to REQ-027 prompt: ruled out by the 38-prompt matrix, zero mismatches. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A live gate failure against any REQ-015 to REQ-027 prompt: ruled out by the 38-prompt matrix, zero mismatches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live gate failure against any REQ-015 to REQ-027 prompt: ruled out by the 38-prompt matrix, zero mismatches.

### A missing acceptance-row anchor for the sixth round: ruled out; AC-030 to AC-042 all resolve. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing acceptance-row anchor for the sixth round: ruled out; AC-030 to AC-042 all resolve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing acceptance-row anchor for the sixth round: ruled out; AC-030 to AC-042 all resolve.

### A missing fixture-layer statement: ruled out by reading the header. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A missing fixture-layer statement: ruled out by reading the header.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing fixture-layer statement: ruled out by reading the header.

### A quadratic scan left in the lead reads: ruled out for the tested prompt (400 repetitions returned withheld) and by reading `endsBefore`, which slices a 400-character window rather than the whole prefix (`command-attach.ts:592-612`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A quadratic scan left in the lead reads: ruled out for the tested prompt (400 repetitions returned withheld) and by reading `endsBefore`, which slices a 400-character window rather than the whole prefix (`command-attach.ts:592-612`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A quadratic scan left in the lead reads: ruled out for the tested prompt (400 repetitions returned withheld) and by reading `endsBefore`, which slices a 400-character window rather than the whole prefix (`command-attach.ts:592-612`).

### A regression in REQ-003's keep group: ruled out for the sampled prompts (`run a deep-review …`, curly-apostrophe research loop, `my deep research run is stuck` keeps the doctor row). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A regression in REQ-003's keep group: ruled out for the sampled prompts (`run a deep-review …`, curly-apostrophe research loop, `my deep research run is stuck` keeps the doctor row).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression in REQ-003's keep group: ruled out for the sampled prompts (`run a deep-review …`, curly-apostrophe research loop, `my deep research run is stuck` keeps the doctor row).

### A route by which a plain prompt starts a deep run: ruled out. No path returns a deep command with `policy: run`; the only `run`-policy return is the add-only doctor. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A route by which a plain prompt starts a deep run: ruled out. No path returns a deep command with `policy: run`; the only `run`-policy return is the add-only doctor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A route by which a plain prompt starts a deep run: ruled out. No path returns a deep command with `policy: run`; the only `run`-policy return is the add-only doctor.

### A secret in the changed files: ruled out by search over the five changed runtime files and the fixture. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A secret in the changed files: ruled out by search over the five changed runtime files and the fixture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A secret in the changed files: ruled out by search over the five changed runtime files and the fixture.

### A TypeScript/Python divergence in the ask gate for REQ-020's four prompts: ruled out at the gate layer by the live Python probe; the disagreeing layer is the served head, which ADR-005 records. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A TypeScript/Python divergence in the ask gate for REQ-020's four prompts: ruled out at the gate layer by the live Python probe; the disagreeing layer is the served head, which ADR-005 records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A TypeScript/Python divergence in the ask gate for REQ-020's four prompts: ruled out at the gate layer by the live Python probe; the disagreeing layer is the served head, which ADR-005 records.

### A Verification Summary miscount: ruled out by parsing every `CHK-*` row. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A Verification Summary miscount: ruled out by parsing every `CHK-*` row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Verification Summary miscount: ruled out by parsing every `CHK-*` row.

### An acceptance row waived without a backing ADR: ruled out; the three waiver rows name ADR-001, ADR-002 and ADR-003, all present. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: An acceptance row waived without a backing ADR: ruled out; the three waiver rows name ADR-001, ADR-002 and ADR-003, all present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An acceptance row waived without a backing ADR: ruled out; the three waiver rows name ADR-001, ADR-002 and ADR-003, all present.

### Fixing any finding here: out of contract. The packet's docs are outside this lineage's write surface, and remediation is a separate step. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Fixing any finding here: out of contract. The packet's docs are outside this lineage's write surface, and remediation is a separate step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixing any finding here: out of contract. The packet's docs are outside this lineage's write surface, and remediation is a separate step.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A depth-word false offer in the current tree: ruled out by live probe of R7 and the no-gain prompts (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326`)
- A TS/Python divergence in the REQ-020 ask gate: ruled out at the gate layer by live Python probe (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306`)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations: 5`, and the run proceeds to synthesis with stop reason `maxIterationsReached`. - Rotation status: fourth rotation complete; no dimension is uncovered. - Blocked/productive carry-forward: the productive category "producer read, then live exercise" carried the run; the exhausted category "citation resolution" is closed. - Required evidence for synthesis: the seven active findings, the two protocol statuses, the terminal gate rows, and the four-dimension coverage record.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 46 files in `review-scope-files.txt`, headed by `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, the two command documents, the two presentation assets, the shared fixture, both gate test suites and the packet's own docs.
- Behavior claims: `spec.md` REQ-001 to REQ-034, `acceptance-criteria.md` AC-001 to AC-042, `tasks.md` T001 to T085, and ADR-001 to ADR-006 in `decision-record.md`.
- Reuse and conventions: the gate is pinned in two copies (TypeScript `command-attach.ts` and Python `skill_advisor.py`), and the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is the parity surface both suites read.
- Review risks: the packet's own documented evidence is a prior build's report; the probe/suite numbers are recorded evidence, not reproducible inside this lineage, so a claim is checked by confirming the cited code and line exist and say what the row says they say.
- Prior review state: the packet's `review/review-report.md` (three Opus lineages, 2026-11-24) returned FAIL on the coverage gate; this lineage is the follow-up rerun REQ-033 and T084/AC-040 ask for.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1-5 | all 34 REQ rows checked; REQ-011 is the one mismatch and is an active P1 |
| `checklist_evidence` | core | partial | 3-5 | all 85 task rows and 42 AC rows checked; five P2 doc defects remain |
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
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-deep-loop/command-metadata.json` | D2 | 2 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `spec.md`, `acceptance-criteria.md`, `tasks.md`, `implementation-summary.md` | D3 | 3 | 4 P2 | partial |
| (39 remaining scope files) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-deepseek-max-2-1795511183570-92w0ez, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:08:05Z
- Stop: maxIterationsReached at iteration 5; terminal gates evidence pass, scope pass, coverage fail (traceability-incomplete)
<!-- MACHINE-OWNED: END -->
