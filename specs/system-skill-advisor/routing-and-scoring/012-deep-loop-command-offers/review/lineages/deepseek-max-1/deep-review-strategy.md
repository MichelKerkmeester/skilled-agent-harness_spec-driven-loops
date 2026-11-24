# Deep Review Strategy - 012-deep-loop-command-offers (lineage deepseek-max-1)

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 3 packet, generation 8 lineage)
- Dimensions: correctness → security → traceability → maintainability (risk order)
- Operator review focus: finish the `spec_code` and `checklist_evidence` protocols; check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Stop conditions: `max-iterations` policy with a cap of 7 iterations; convergence is telemetry only in this lineage.
- Success criteria: both core traceability protocols reach a supported status with `file:line` evidence, and every active finding carries a case plus a fix-completeness line set.

## 2. TOPIC

Deep review of the 012-deep-loop-command-offers packet: the sixth fix round that made the skill advisor serve typed `/deep:review` and `/deep:research` commands (offer shaping, head-length budget, ask/start/run timing, degraded mode) and the packet docs that claim it.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-litigating the accepted design in ADR-001 to ADR-006; the review checks that the decision is implemented and recorded, not that the decision is the best one.
- Not reviewing the routing-accuracy corpus scoring run itself; only the code paths it exercises when a scope file is part of an active claim.
- No fixes during review: findings only.

## 5. STOP CONDITIONS

- `config.stopPolicy = max-iterations`, `config.maxIterations = 7`: the loop stops at iteration 7 with `stopReason = maxIterationsReached` even if convergence telemetry arrives earlier.
- No operator pause sentinel is expected in a non-interactive lineage.

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
- P1 (Required): 0
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Re-deriving every counted claim in `acceptance-criteria.md` from the tree, rather than re-reading the claim: it found a stale pair count in AC-038 and confirmed seven other counts at once (iteration 1)
- Resolving each `Evidence: path:line (quote)` cell and comparing the quote with the cited line: 60 of 60 landed, which retires the whole citation-drift class cheaply (iteration 1)
- Reading the spawn sites instead of the tests that assert them: three exec sites, one schema bound and one allowlist settled the whole security dimension in a dozen reads (iteration 2)

## 9. WHAT FAILED

- Reading `spec.md` REQ rows alone gave no way to judge whether a claim was implemented; the code reads were what produced evidence. Prose-first passes will not be used again (iteration 1)
- A `max` bound on a schema field and a truncating fallback are not the same contract: the oversized-prompt case took three reads to tell a transport difference from a gate difference, and it is not a finding (iteration 2)

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### `PATTERNS_NOT_COMPARED` count drift (AC-059): investigated, eliminated — 38 named rows and 40 compared pairs both match the tree. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: `PATTERNS_NOT_COMPARED` count drift (AC-059): investigated, eliminated — 38 named rows and 40 compared pairs both match the tree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A "stuck run drops the run row" sentence left behind in the implementation summary: eliminated, no line in `implementation-summary.md` holds it. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: A "stuck run drops the run row" sentence left behind in the implementation summary: eliminated, no line in `implementation-summary.md` holds it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A `Met` row with no evidence behind it: eliminated, every row carries a verification or evidence cell, and the 60 quoted cells were already checked line by line in iteration 1. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A `Met` row with no evidence behind it: eliminated, every row carries a verification or evidence cell, and the 60 quoted cells were already checked line by line in iteration 1.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A compiled contract that lags its source YAML: eliminated, both contracts carry the lines the YAMLs carry. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: A compiled contract that lags its source YAML: eliminated, both contracts carry the lines the YAMLs carry.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A flag hint that drifted between the command docs and the metadata copy (T046): eliminated, both docs and the copy carry the same three flags. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A flag hint that drifted between the command docs and the metadata copy (T046): eliminated, both docs and the copy carry the same three flags.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A left-behind council boost on either lane (REQ-011): eliminated in both files. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: A left-behind council boost on either lane (REQ-011): eliminated in both files.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A pattern the drift guard neither compares nor names: eliminated, 40 compared plus 38 named with reasons, and a coverage test that asserts the whole set. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A pattern the drift guard neither compares nor names: eliminated, 40 compared plus 38 named with reasons, and a coverage test that asserts the whole set.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A requirement in REQ-035 to REQ-051 with no fixture row behind it: eliminated, every row group named in the requirement block exists with the stated column values. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A requirement in REQ-035 to REQ-051 with no fixture row behind it: eliminated, every row group named in the requirement block exists with the stated column values.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A stale compiled contract (REQ-007): eliminated, no compiled file holds the retired `ASK with SINGLE prompt` text. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: A stale compiled contract (REQ-007): eliminated, no compiled file holds the retired `ASK with SINGLE prompt` text.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A ticked task pointing at a file that was renamed or removed: eliminated, all 19 bare filenames resolve. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A ticked task pointing at a file that was renamed or removed: eliminated, all 19 bare filenames resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### ADR-005 recorded but not implemented: eliminated, the served head applies the typed command after the diagnosis on both handler paths and the fixture pins it in a column the Python suite also reads. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: ADR-005 recorded but not implemented: eliminated, the served head applies the typed command after the diagnosis on both handler paths and the fixture pins it in a column the Python suite also reads.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### ADR-006 recorded but not implemented: eliminated, the loop names are read only behind a use, continue or want verb, and the mode-free asks carry `servedRun: "none"`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: ADR-006 recorded but not implemented: eliminated, the loop names are read only behind a use, continue or want verb, and the mode-free asks carry `servedRun: "none"`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Citation drift across `acceptance-criteria.md`: investigated because a long-lived packet accumulates stale line references. Eliminated for this iteration — 60 of 60 quoted cells land on their quote, and no reference is past end-of-file. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: Citation drift across `acceptance-criteria.md`: investigated because a long-lived packet accumulates stale line references. Eliminated for this iteration — 60 of 60 quoted cells land on their quote, and no reference is past end-of-file.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Command injection through a supplied command string or a typed command: eliminated, every one of the three execution sites uses an argument vector with no shell, and the degraded path gates the string through `trackedCommandForOwner` before it can print. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Command injection through a supplied command string or a typed command: eliminated, every one of the three execution sites uses an argument vector with no shell, and the degraded path gates the string through `trackedCommandForOwner` before it can print.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Dead code among the reducer symbols the requirements name: eliminated, every one has a call site. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: Dead code among the reducer symbols the requirements name: eliminated, every one has a call site.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Drift between the probe file and the requirements it is cited for (REQ-001, REQ-002, REQ-014): eliminated for the ids checked, the probe rows carry the commands and the absences the requirements state. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: Drift between the probe file and the requirements it is cited for (REQ-001, REQ-002, REQ-014): eliminated for the ids checked, the probe rows carry the commands and the absences the requirements state.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Missing offer wiring between the command docs and the presentations (REQ-005): eliminated, step 0 in both docs names the section and both presentations carry it. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: Missing offer wiring between the command docs and the presentations (REQ-005): eliminated, step 0 in both docs names the section and both presentations carry it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Near-miss count drift (AC-019): investigated, eliminated — the corpus holds 31 `near-miss` rows, which is the number AC-019 says was observed after later rounds moved it past the original 15. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: Near-miss count drift (AC-019): investigated, eliminated — the corpus holds 31 `near-miss` rows, which is the number AC-019 says was observed after later rounds moved it past the original 15.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Overlay protocols applying to this packet: eliminated, no skill contract, agent definition, feature catalog entry or playbook is inside the review scope, so each is recorded `notApplicable` with `applicable: false` rather than left pending. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: Overlay protocols applying to this packet: eliminated, no skill contract, agent definition, feature catalog entry or playbook is inside the review scope, so each is recorded `notApplicable` with `applicable: false` rather than left pending.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Packet identifiers leaking into code comments in any scope file: eliminated, the search over all 28 code files found none. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: Packet identifiers leaking into code comments in any scope file: eliminated, the search over all 28 code files found none.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Prompt disclosure through the process table: eliminated, both spawn paths carry the prompt on stdin and `advisor-recommend.ts:300` refuses a front door that cannot read stdin rather than falling back to argv. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Prompt disclosure through the process table: eliminated, both spawn paths carry the prompt on stdin and `advisor-recommend.ts:300` refuses a front door that cannot read stdin rather than falling back to argv.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### REQ-034's changelog clause unfulfilled: eliminated, the changelog carries both the run-or-fix exception and the refusal-verb sentence. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: REQ-034's changelog clause unfulfilled: eliminated, the changelog carries both the run-or-fix exception and the refusal-verb sentence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Secret or path disclosure through a child failure: eliminated as a security finding, stderr is reduced to 240 characters and the brief already names the workspace root, so the reduction does not hide a secret or expose one. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Secret or path disclosure through a child failure: eliminated as a security finding, stderr is reduced to 240 characters and the brief already names the workspace root, so the reduction does not hide a secret or expose one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Section numbering drift in a strategy the reducer has repeatedly rewritten: eliminated on this lineage's own file. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: Section numbering drift in a strategy the reducer has repeatedly rewritten: eliminated on this lineage's own file.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Two disagreeing implementations of the refinement rule: eliminated, the reducer and the closeout apply the same file-and-dimension test. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: Two disagreeing implementations of the refinement rule: eliminated, the reducer and the closeout apply the same file-and-dimension test.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Unbounded work on a 96,000-character prompt: eliminated at the code level, the gate reads a 10,000-unit head and the per-match prefix scan is bounded at 400 units on both sides. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Unbounded work on a 96,000-character prompt: eliminated at the code level, the gate reads a 10,000-unit head and the per-match prefix scan is bounded at 400 units on both sides.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Whitespace folding that changes a reader's quoted prompt (REQ-049): eliminated for the gate result, the four variant rows withhold nothing. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: Whitespace folding that changes a reader's quoted prompt (REQ-049): eliminated for the gate result, the four variant rows withhold nothing.
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

- Citation drift across `acceptance-criteria.md`: eliminated, 60/60 quoted cells resolve to their quote and no ref is past end-of-file (iteration 1, evidence: `acceptance-criteria.md`)
- Near-miss count drift in AC-019: eliminated, the corpus holds 31 `near-miss` rows as stated (iteration 1, evidence: `command-prompts.jsonl`)
- `PATTERNS_NOT_COMPARED` count drift in AC-059: eliminated, 38 named rows and 40 compared pairs both match (iteration 1, evidence: `deep-loop-offer-cases.vitest.ts`)

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none — the dimension queue is exhausted and all four dimensions have a full pass. Synthesis follows.
- Focus area: synthesis compiles the report, records the terminal gates, and settles the verdict from the registry.
- Reason: seven iterations are the configured cap (`stopPolicy: max-iterations`, `maxIterations: 7`).
- Rotation status: D1, D2, D3 and D4 all covered; every dimension has one full pass.
- Blocked/productive carry-forward: DR1-P2-001 is the one open finding and is a docs row, so it is a change a `/speckit:plan` follow-up can make without touching code.
- Required evidence: the terminal gates and the registry-derived verdict.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 012 packet docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `timeline.md`), the 013 sibling packet docs, the advisor runtime (`handlers/advisor-recommend.ts`, `lib/command-attach.ts`, `lib/render.ts`, `lib/subprocess.ts`, `schemas/advisor-tool-schemas.ts`, `scorer/lanes/explicit.ts`, `scorer/fusion.ts`), the deep-loop command surfaces (`.skilled/commands/deep/review.md`, `assets/deep-review.yaml`, presentations, compiled contracts) and the reducer/closeout scripts under `.skilled/skills/system-deep-loop/runtime/`.
- Behavior claims to verify: typed command offers on `/deep:review` and `/deep:research`, head-length budget, ask/start/run timing gates, degraded-mode typed fields, typed-on-stuck serving, duplicate-command handling, and each REQ in `spec.md` including REQ-023 to REQ-034.
- Reuse and conventions: the advisor's command attach contract (`command-attach.ts`) and the deep-loop command docs are the authority for offer shape; the packet's `decision-record.md` ADR-004 to ADR-006 are the authority for the sixth fix round's decisions.
- Review risks and gaps: the packet was authored alongside the implementation by the same change, so prose claims may lead implementation; several scope entries are tests, where the risk is a test that asserts a narrower behavior than the REQ claims. `resource-map.md` is absent, so the coverage gate is skipped.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | [details] |
| `checklist_evidence` | core | pending | - | [details] |
| `skill_agent` | overlay | pending | - | [details] |
| `agent_cross_runtime` | overlay | pending | - | [details] |
| `feature_catalog_code` | overlay | pending | - | [details] |
| `playbook_capability` | overlay | pending | - | [details] |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795550334883-gjbarh, parentSessionId=2026-11-24T19:58:39.000Z, generation=8, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T20:00:20Z
- Artifact dir: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1`
<!-- MACHINE-OWNED: END -->
