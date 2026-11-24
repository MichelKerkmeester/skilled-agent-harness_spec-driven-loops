# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder target, Level 2). Operator focus: finish the `spec_code` and `checklist_evidence` traceability protocols by checking every REQ against the code or decision that implements it, and every ticked task and `Met` acceptance row against evidence that exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Implementing any fix found here; review is observation-only.
- Re-running the advisor build, the vitest suite, the probe harness or the corpus capture, because each writes outside the lineage artifact directory.
- Judging packet 013 beyond the traceability it owns for this packet's REQ-034.

---

## 5. STOP CONDITIONS
- `config.stopPolicy: max-iterations`, cap 7. Convergence is telemetry only.
- A lineage that cannot read a cited path stops after three failed reads on the same path and records the blocker.

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
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Opening each acceptance evidence cell on the line it cites, rather than reading the narrative around it: every sixth-round cell named a line that held the claimed code or test (iteration 1).
- Counting fixture rows (`refusal-verb-` 11, `doctorWithheld` 26, 285 cases) against the counts the cells state: this is the cheapest way to catch a stale closure count (iteration 1).
- Reading every `implementation-summary.md:<n>` pointer in the acceptance table at once: this exposed the one-row shift the eighth round's closure row claims was fixed (iteration 2).
- Comparing the captured probe result against the baseline in memory: this closed REQ-001 to REQ-005 without running a probe that would write outside the lineage (iteration 3).
- Reading the optional groups of `LOOP_EFFORT_AFTER` rather than only its fixture rows: the missing subject/verb requirement is invisible from the passing complaint case (iteration 4).
- Following a child-supplied string from `parseRecommendations` through `degradedRecommendations` to `sanitizeSkillLabel`: three independent guards each closed the path (iteration 5).
- Diffing the mirror bodies instead of the whole file: the frontmatter is translated by design, so a raw diff reports a false drift (iteration 6).
- Comparing all four packet status surfaces at once: the closure statement, the spec status, the implementation-summary completion line and the task boxes agree, which is what a cross-reference fallback is for (iteration 7).

---

## 9. WHAT FAILED
- Re-running vitest, the Python suite or the probes inside the lineage is not available: those runs write build and cache output outside the lineage, so the evidence limit is recorded instead (iteration 1).
- Checking pointers one at a time hides a class of them: the first drifted cell looked like a typo, and only the whole-table pass showed the systematic shift (iteration 2).
- Reading the requirement's phrase instead of its intent can find a false gap: the `completion.message` block does not name `--extend`, but REQ-009's "completed-packet message" is the `:663` detection message (iteration 3).
- The reducer's dimension table records all three P2 findings under `correctness` because the delta finding-row schema omits a dimension field; the iteration artifacts keep two under `traceability` and one under `correctness` (synthesis note).
- A fixture that pins one complaint does not prove the complaint rule: REQ-037's manner control all sit before the loop name, so the post-name position went untested (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`typedCommandsIn` lets a longer command hide a shorter one": ruled out; it keys by start index and keeps the longer only where two commands start at the same place. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`typedCommandsIn` lets a longer command hide a shorter one": ruled out; it keys by start index and keeps the longer only where two commands start at the same place.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`typedCommandsIn` lets a longer command hide a shorter one": ruled out; it keys by start index and keeps the longer only where two commands start at the same place.

### "A changed code comment carries a requirement or task id": ruled out; the scan found only the policy string in `render.ts`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "A changed code comment carries a requirement or task id": ruled out; the scan found only the policy string in `render.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A changed code comment carries a requirement or task id": ruled out; the scan found only the policy string in `render.ts`.

### "A child-supplied command string can reach the brief on the CLI degraded path": ruled out; `trackedCommandForOwner` checks the tracked table and the row's own owner or alias, and the test drops an unknown shell pipeline and another skill's command. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A child-supplied command string can reach the brief on the CLI degraded path": ruled out; `trackedCommandForOwner` checks the tracked table and the row's own owner or alias, and the test drops an unknown shell pipeline and another skill's command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A child-supplied command string can reach the brief on the CLI degraded path": ruled out; `trackedCommandForOwner` checks the tracked table and the row's own owner or alias, and the test drops an unknown shell pipeline and another skill's command.

### "A child-supplied label can inject a second brief line": ruled out; `sanitizeSkillLabel` rejects newlines, strips control characters and rejects an instruction-shaped label. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A child-supplied label can inject a second brief line": ruled out; `sanitizeSkillLabel` rejects newlines, strips control characters and rejects an instruction-shaped label.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A child-supplied label can inject a second brief line": ruled out; `sanitizeSkillLabel` rejects newlines, strips control characters and rejects an instruction-shaped label.

### "A conjunction inside the refusal gap still negates the next clause": ruled out; the gap's negative lookahead names `and`, `then`, `but` and `or`, and the two conjunction fixtures pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "A conjunction inside the refusal gap still negates the next clause": ruled out; the gap's negative lookahead names `and`, `then`, `but` and `or`, and the two conjunction fixtures pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A conjunction inside the refusal gap still negates the next clause": ruled out; the gap's negative lookahead names `and`, `then`, `but` and `or`, and the two conjunction fixtures pass.

### "A dimension has no recorded status": ruled out; correctness, security, traceability and maintainability each read complete in the strategy, and the two overlays that apply read pass. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "A dimension has no recorded status": ruled out; correctness, security, traceability and maintainability each read complete in the strategy, and the two overlays that apply read pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A dimension has no recorded status": ruled out; correctness, security, traceability and maintainability each read complete in the strategy, and the two overlays that apply read pass.

### "A prompt larger than the schema cap reaches the Python gate whole": ruled out; `_advisor_prompt_head` cuts the same 10,000 units and the long-prompt test covers 96,000 characters. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A prompt larger than the schema cap reaches the Python gate whole": ruled out; `_advisor_prompt_head` cuts the same 10,000 units and the long-prompt test covers 96,000 characters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A prompt larger than the schema cap reaches the Python gate whole": ruled out; `_advisor_prompt_head` cuts the same 10,000 units and the long-prompt test covers 96,000 characters.

### "A waived or superseded row names a missing ADR": ruled out; ADR-001, ADR-002 and ADR-003 exist. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "A waived or superseded row names a missing ADR": ruled out; ADR-001, ADR-002 and ADR-003 exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A waived or superseded row names a missing ADR": ruled out; ADR-001, ADR-002 and ADR-003 exist.

### "AC-019's 31 near-miss count is stale": ruled out; `rg -c '"row_type":"near-miss"'` prints 31. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "AC-019's 31 near-miss count is stale": ruled out; `rg -c '"row_type":"near-miss"'` prints 31.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "AC-019's 31 near-miss count is stale": ruled out; `rg -c '"row_type":"near-miss"'` prints 31.

### "AC-036's served column only exists in TypeScript": ruled out; the Python suite reads `servedReviewKept` at `tests/python/test_skill_advisor.py:2875`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "AC-036's served column only exists in TypeScript": ruled out; the Python suite reads `servedReviewKept` at `tests/python/test_skill_advisor.py:2875`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "AC-036's served column only exists in TypeScript": ruled out; the Python suite reads `servedReviewKept` at `tests/python/test_skill_advisor.py:2875`.

### "AC-043's aliases are absent from one of the two hub files": ruled out; both `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research`, and neither carries `autonomous research`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "AC-043's aliases are absent from one of the two hub files": ruled out; both `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research`, and neither carries `autonomous research`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "AC-043's aliases are absent from one of the two hub files": ruled out; both `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research`, and neither carries `autonomous research`.

### "REQ-025 changed `typedCommandIn` for other callers": ruled out; the function at `command-attach.ts:251` still keeps the longest key and `typedCommandsIn` is a separate export at `:274`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "REQ-025 changed `typedCommandIn` for other callers": ruled out; the function at `command-attach.ts:251` still keeps the longest key and `typedCommandsIn` is a separate export at `:274`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-025 changed `typedCommandIn` for other callers": ruled out; the function at `command-attach.ts:251` still keeps the longest key and `typedCommandsIn` is a separate export at `:274`.

### "REQ-030's bounded window is native-only": ruled out; `_ends_before` uses `_LEAD_WINDOW` at `skill_advisor.py:5011` to `:5013`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "REQ-030's bounded window is native-only": ruled out; `_ends_before` uses `_LEAD_WINDOW` at `skill_advisor.py:5011` to `:5013`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-030's bounded window is native-only": ruled out; `_ends_before` uses `_LEAD_WINDOW` at `skill_advisor.py:5011` to `:5013`.

### "REQ-031's Python tuples are inline patterns with no named copy": ruled out; all fifteen tuple names exist at `skill_advisor.py:4480` to `:5213`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "REQ-031's Python tuples are inline patterns with no named copy": ruled out; all fifteen tuple names exist at `skill_advisor.py:4480` to `:5213`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-031's Python tuples are inline patterns with no named copy": ruled out; all fifteen tuple names exist at `skill_advisor.py:4480` to `:5213`.

### "REQ-035's plural forms are read from a separate list that the drift guard does not compare": ruled out; the plurals sit inside `LOOP_WORDING` and `LOOP_NAMES`, both compared at `deep-loop-offer-cases.vitest.ts:68` to `:79`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "REQ-035's plural forms are read from a separate list that the drift guard does not compare": ruled out; the plurals sit inside `LOOP_WORDING` and `LOOP_NAMES`, both compared at `deep-loop-offer-cases.vitest.ts:68` to `:79`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-035's plural forms are read from a separate list that the drift guard does not compare": ruled out; the plurals sit inside `LOOP_WORDING` and `LOOP_NAMES`, both compared at `deep-loop-offer-cases.vitest.ts:68` to `:79`.

### "REQ-036's `how do` exception is native-only": ruled out; `_LOOP_QUESTION_AUXILIARY_LIST` exists at `skill_advisor.py:4870` and is compared by the drift guard. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "REQ-036's `how do` exception is native-only": ruled out; `_LOOP_QUESTION_AUXILIARY_LIST` exists at `skill_advisor.py:4870` and is compared by the drift guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-036's `how do` exception is native-only": ruled out; `_LOOP_QUESTION_AUXILIARY_LIST` exists at `skill_advisor.py:4870` and is compared by the drift guard.

### "REQ-038 accepts a command tracked for the row's alias group without checking ownership": ruled out; `trackedCommandForOwner` compares both `ownerSkillId` and `mergedSkillForAlias(skill)` at `skill-advisor-cli.ts:1492` to `:1493`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "REQ-038 accepts a command tracked for the row's alias group without checking ownership": ruled out; `trackedCommandForOwner` compares both `ownerSkillId` and `mergedSkillForAlias(skill)` at `skill-advisor-cli.ts:1492` to `:1493`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-038 accepts a command tracked for the row's alias group without checking ownership": ruled out; `trackedCommandForOwner` compares both `ownerSkillId` and `mergedSkillForAlias(skill)` at `skill-advisor-cli.ts:1492` to `:1493`.

### "The bounded window loses a lead at the cut": ruled out; `endsBefore` keeps 16 characters of context and starts the search at the slice's window offset. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The bounded window loses a lead at the cut": ruled out; `endsBefore` keeps 16 characters of context and starts the search at the slice's window offset.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The bounded window loses a lead at the cut": ruled out; `endsBefore` keeps 16 characters of context and starts the search at the slice's window offset.

### "The Claude mirror has drifted from the canonical agent": ruled out; the body is identical apart from the two path conventions the mirror must apply. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The Claude mirror has drifted from the canonical agent": ruled out; the body is identical apart from the two path conventions the mirror must apply.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Claude mirror has drifted from the canonical agent": ruled out; the body is identical apart from the two path conventions the mirror must apply.

### "The compiled contracts still teach the old setup prompt": ruled out; `rg -c 'ASK with SINGLE prompt'` over `.skilled/commands/deep/assets/compiled/` printed nothing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The compiled contracts still teach the old setup prompt": ruled out; `rg -c 'ASK with SINGLE prompt'` over `.skilled/commands/deep/assets/compiled/` printed nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The compiled contracts still teach the old setup prompt": ruled out; `rg -c 'ASK with SINGLE prompt'` over `.skilled/commands/deep/assets/compiled/` printed nothing.

### "The deep commands can be started by the `run` policy": ruled out; the deep rows carry `ask` and the gate never upgrades a policy. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The deep commands can be started by the `run` policy": ruled out; the deep rows carry `ask` and the gate never upgrades a policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The deep commands can be started by the `run` policy": ruled out; the deep rows carry `ask` and the gate never upgrades a policy.

### "The deep-research presentation is missing the fan-out condition": ruled out; the flag table at `:54` says fan-out appears only on two or more executors or models, or independent takes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The deep-research presentation is missing the fan-out condition": ruled out; the flag table at `:54` says fan-out appears only on two or more executors or models, or independent takes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The deep-research presentation is missing the fan-out condition": ruled out; the flag table at `:54` says fan-out appears only on two or more executors or models, or independent takes.

### "The deferred mode cue counts a subject loop name as a cue": ruled out; `namesLoopSubject` blanks it before `MODE_CUES` runs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The deferred mode cue counts a subject loop name as a cue": ruled out; `namesLoopSubject` blanks it before `MODE_CUES` runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The deferred mode cue counts a subject loop name as a cue": ruled out; `namesLoopSubject` blanks it before `MODE_CUES` runs.

### "The feature catalog still describes the old depth-word gate": ruled out; the catalog has no advisor-gate claim at all. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The feature catalog still describes the old depth-word gate": ruled out; the catalog has no advisor-gate claim at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The feature catalog still describes the old depth-word gate": ruled out; the catalog has no advisor-gate claim at all.

### "The keep or negative groups moved after the ninth round": ruled out; the in-memory compare of `results-after.json` against `results-spec-baseline.json` reported 0 changes across all 34 rows. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The keep or negative groups moved after the ninth round": ruled out; the in-memory compare of `results-after.json` against `results-spec-baseline.json` reported 0 changes across all 34 rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The keep or negative groups moved after the ninth round": ruled out; the in-memory compare of `results-after.json` against `results-spec-baseline.json` reported 0 changes across all 34 rows.

### "The manual-testing playbook depends on the old offer behavior": ruled out; it carries no offer scenario. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The manual-testing playbook depends on the old offer behavior": ruled out; it carries no offer scenario.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The manual-testing playbook depends on the old offer behavior": ruled out; it carries no offer scenario.

### "The packet claims closure while AC-040 is open": ruled out; all four status surfaces keep it open. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The packet claims closure while AC-040 is open": ruled out; all four status surfaces keep it open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The packet claims closure while AC-040 is open": ruled out; all four status surfaces keep it open.

### "The Verification Summary counts boxes the file does not hold": ruled out; 11 of 12 P0, 13 of 13 P1 and 1 of 1 P2 match the ticked and open boxes. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The Verification Summary counts boxes the file does not hold": ruled out; 11 of 12 P0, 13 of 13 P1 and 1 of 1 P2 match the ticked and open boxes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Verification Summary counts boxes the file does not hold": ruled out; 11 of 12 P0, 13 of 13 P1 and 1 of 1 P2 match the ticked and open boxes.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- "The served typed-on-stuck column exists only in TypeScript": ruled out; `tests/python/test_skill_advisor.py:2875` reads it (iteration 1).
- "REQ-031's Python vocabulary is inline with no named tuple": ruled out; all fifteen tuple names exist from `skill_advisor.py:4480` to `:5213` (iteration 1).
- "REQ-025 changed `typedCommandIn` for other callers": ruled out; it still keeps the longest key at `command-attach.ts:251` (iteration 1).
- "REQ-035's plural names are unguarded by the drift check": ruled out; they sit in `LOOP_WORDING` and `LOOP_NAMES`, both compared (iteration 2).
- "REQ-038 accepts an alias-group command without an ownership check": ruled out; `trackedCommandForOwner` compares both the owner and the merged alias (iteration 2).
- "The keep or negative probe groups moved after the ninth round": ruled out; the in-memory compare against the baseline found 0 changes across 34 rows (iteration 3).
- "The deep-research presentation is missing the fan-out condition": ruled out; the flag table says fan-out only on two or more named executors or independent takes (iteration 3).
- "The compiled contracts still teach the old setup prompt": ruled out; `ASK with SINGLE prompt` matches nothing under `compiled/` (iteration 3).
- "AC-019's 31 near-miss count is stale": ruled out; the corpus count is 31 (iteration 3).
- "The bounded window loses a lead at the cut": ruled out; `endsBefore` keeps 16 characters of context and starts at the window offset (iteration 4).
- "A conjunction inside the refusal gap still negates the next clause": ruled out; the gap lookahead names the four conjunctions and both conjunction fixtures pass (iteration 4).
- "`typedCommandsIn` lets a longer command hide a shorter one": ruled out; it keys by start index, longest first (iteration 4).
- "The deferred mode cue counts a subject loop name as a cue": ruled out; the subject is blanked before `MODE_CUES` runs (iteration 4).
- "A child-supplied command string can reach the brief": ruled out; `trackedCommandForOwner` checks the tracked table and the row's own owner or alias (iteration 5).
- "A child-supplied label can inject a second brief line": ruled out; `sanitizeSkillLabel` rejects newlines and instruction-shaped labels (iteration 5).
- "An oversized prompt reaches the Python gate whole": ruled out; `_advisor_prompt_head` cuts the same 10,000 units (iteration 5).
- "A deep command can be started by the `run` policy": ruled out; the deep rows carry `ask` (iteration 5).
- "The Claude mirror drifted from the canonical agent": ruled out; the body differs only in the path convention and related-agent paths (iteration 6).
- "The feature catalog still describes the old depth-word gate": ruled out; it has no advisor-gate claim (iteration 6).
- "A changed code comment carries a requirement or task id": ruled out; only the policy string matches (iteration 6).
- "The manual-testing playbook depends on the old offer behavior": ruled out; it carries no offer scenario (iteration 6).
- "The packet claims closure while AC-040 is open": ruled out; all four status surfaces keep it open (iteration 7).
- "A waived or superseded row names a missing ADR": ruled out; ADR-001, ADR-002 and ADR-003 exist (iteration 7).
- "The Verification Summary counts boxes the file does not hold": ruled out; 11/12 P0, 13/13 P1 and 1/1 P2 match the boxes (iteration 7).
- "A dimension has no recorded status": ruled out; four dimensions complete and the two applicable overlays pass (iteration 7).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; synthesis complete.
- Focus area: the three P2 advisories and the failed coverage gate; the packet cannot close until the evidence cells are repointed.
- Reason: the iteration cap is reached with every dimension covered.
- Rotation status: all four dimensions complete; the cross-reference fallback is done.
- Carry-forward: R2-P2-001, R2-P2-002 and R4-P2-001 are active advisories; one deferred test-execution row is search debt.
- Required evidence: the report's Executive Summary, the terminal gate row and stop reason maxIterationsReached.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the packet docs under `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/` and the scope files listed in `review-scope-files.txt` (46 paths: advisor gate copies, fixtures, tests, command assets, deep-loop runtime reducer and tests, and packet 013 docs).
- Behavior claims: REQ-001 to REQ-039, SC-001 to SC-006, AC-001 to AC-047, ADR-001 to ADR-007, and the ticked task rows T001 to T093.
- Reuse and conventions: the advisor gate is implemented twice, in `runtime/lib/command-attach.ts` and `runtime/scripts/skill_advisor.py`, and the shared fixture `runtime/tests/fixtures/deep-loop-offer-cases.json` is what keeps the copies aligned.
- Review risks and gaps: the packet carries 39 requirements across nine fix rounds, so evidence cells can point at a line that moved. Line numbers are checked against the tree as it is now, not against the commit a row names.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | All REQ-001 to REQ-039 resolve to a producer or a decision; probe, fixture, command and corpus evidence checked. |
| `checklist_evidence` | core | partial | 7 | 47 rows: 43 Met, 2 Waived, 1 Superseded, 1 Unmet (AC-040); two P2 evidence drifts remain. |
| `skill_agent` | overlay | pass | 6 | Agent and skill agree on 0.10, P0/P1/P2, LEAF-only and the writable packet paths. |
| `agent_cross_runtime` | overlay | pass | 6 | Claude body differs only in path names; OpenCode copy is byte-identical. |
| `feature_catalog_code` | overlay | notApplicable | 6 | The catalog has no advisor-gate claim; its flag claims match the command docs. |
| `playbook_capability` | overlay | notApplicable | 6 | The deep-review playbook has no offer-gate scenario. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope was discovered at the fan-out root and is pre-bound in `review-scope-files.txt`; per-file coverage is recorded per iteration.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-3-1795518961022-7ms9ak, parentSessionId=2026-11-24T11:16:00.000Z, generation=5, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T11:16:57Z
<!-- MACHINE-OWNED: END -->
