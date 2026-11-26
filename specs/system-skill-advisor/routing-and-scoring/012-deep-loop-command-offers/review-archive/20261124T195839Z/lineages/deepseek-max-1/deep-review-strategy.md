
# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder). Fan-out lineage deepseek-max-1 of the generation-7 traceability rerun.

Operator review focus: Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Implementing fixes. Report-only.
- Re-running the advisor build or suites from this lineage (write containment). Evidence is read from the tree and from recorded command output.
- Reviewing packets other than 012 and the 013 closure row 012 depends on.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: the loop runs all 7 iterations and synthesis records maxIterationsReached.
- Convergence is telemetry only.

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
- P1 (Required): 2
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Probing the built `dist/runtime/lib/command-attach.js` directly with the scorer's single-route shape: twelve prompts across REQ-001, REQ-002, REQ-023 to REQ-027, REQ-035, REQ-040, REQ-041, REQ-043 and REQ-044 all agreed with the requirement text, which turns a doc reading into observed behaviour (iteration 1).
- Comparing each compiled command contract's `sourceDigests` against the current file bytes: 31 sources across two contracts, 0 stale, which settles REQ-007's regeneration clause without running the compiler (iteration 1).
- Comparing the exported vocabulary in `command-attach.ts` against its Python tuple entry for entry: 20 lists, drift 0, which is the substance behind REQ-031 and REQ-045 (iteration 1).
- Parsing every `Evidence: path:N (anchor)` tail in `acceptance-criteria.md` against the tree: 55 of 56 resolve on the cited line, which located the one stale pointer precisely (iteration 1).

---

## 9. WHAT FAILED
- Reading a requirement's own claim as its proof: REQ-009 and REQ-011 verify on files the review scope does not contain, so a finding there would fail the terminal scope gate. The scope, not the requirement, is the defect (iteration 1).
- Two false positives from reading only `lib/`: `attachTypedCommand` and the `servedReviewKept` reader live in `handlers/advisor-recommend.ts` and the test files, so a `lib`-only search reports a symbol as missing (iteration 1). Both were caught before they reached a finding.

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### "`attachTypedCommand` named by REQ-029 does not exist": ruled out. It is exported from `handlers/advisor-recommend.ts:442` and imported by the handler test; the initial search only covered `lib/`. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "`attachTypedCommand` named by REQ-029 does not exist": ruled out. It is exported from `handlers/advisor-recommend.ts:442` and imported by the handler test; the initial search only covered `lib/`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A double space anywhere in the sentence breaks the gate": ruled out. Only whitespace inside the phrase does; "run a deep review of the parser" still serves `/deep:review`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "A double space anywhere in the sentence breaks the gate": ruled out. Only whitespace inside the phrase does; "run a deep review of the parser" still serves `/deep:review`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A prompt over the cap makes the hook fail": ruled out. The hook truncates at the same boundary the schema enforces. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A prompt over the cap makes the hook fail": ruled out. The hook truncates at the same boundary the schema enforces.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A shell metacharacter in the prompt can inject into the served command": ruled out. The command comes from a fixed table, and nine crafted strings returned table values only. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A shell metacharacter in the prompt can inject into the served command": ruled out. The command comes from a fixed table, and nine crafted strings returned table values only.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A single ruling is written as permanently BLOCKED": ruled out. `MIN_BLOCKED_ATTEMPTS` (2) routes one attempt to `RULED OUT` with a `Reopen when:` line (`reduce-state.cjs:2386`). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A single ruling is written as permanently BLOCKED": ruled out. `MIN_BLOCKED_ATTEMPTS` (2) routes one attempt to `RULED OUT` with a `Reopen when:` line (`reduce-state.cjs:2386`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A task cites a fixture row that no longer exists": ruled out. All 27 row ids resolve. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "A task cites a fixture row that no longer exists": ruled out. All 27 row ids resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A task cites a test title that does not exist": ruled out. The one apparent miss, `withholds the %s command on a refused run: %s`, exists at `tests/command-attach-guards.vitest.ts:803`; the miss was the checker's own double-space normalisation. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A task cites a test title that does not exist": ruled out. The one apparent miss, `withholds the %s command on a refused run: %s`, exists at `tests/command-attach-guards.vitest.ts:803`; the miss was the checker's own double-space normalisation.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A task cites an advisor test file that no longer exists": ruled out. All 35 file citations resolve. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "A task cites an advisor test file that no longer exists": ruled out. All 35 file citations resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "Historical intermediate counts in `tasks.md` are stale claims": ruled out for the round-scoped observations, which name the round they belong to; carried into the finding only where the row reads as current. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "Historical intermediate counts in `tasks.md` are stale claims": ruled out for the round-scoped observations, which name the round they belong to; carried into the finding only where the row reads as current.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "Seven dead exports mean the module carries unused code": ruled out as a finding. `RUN_REFUSED` is read through `isRunRefused`, the pattern fragments are part of the exported surface the tests read by name, and none of them is unreachable code; calling them dead would be a phantom issue. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "Seven dead exports mean the module carries unused code": ruled out as a finding. `RUN_REFUSED` is read through `isRunRefused`, the pattern fragments are part of the exported surface the tests read by name, and none of them is unreachable code; calling them dead would be a phantom issue.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The `Waived` rows are unbacked": ruled out. ADR-002 and ADR-003 exist and describe the waivers. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The `Waived` rows are unbacked": ruled out. ADR-002 and ADR-003 exist and describe the waivers.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The codex runtime is missing its deep-review agent mirror": ruled out. `.codex/agents/deep-review.toml` is the codex dialect the crosswalk sanctions. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The codex runtime is missing its deep-review agent mirror": ruled out. `.codex/agents/deep-review.toml` is the codex dialect the crosswalk sanctions.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The council words reappear in the scorer, so REQ-011 fails": ruled out. `explicit.ts:151` keeps them for the `/speckit:ai-council` cue, which REQ-011 does not ask to remove; the gate's depth vocabulary is where they had to leave. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The council words reappear in the scorer, so REQ-011 fails": ruled out. `explicit.ts:151` keeps them for the `/speckit:ai-council` cue, which REQ-011 does not ask to remove; the gate's depth vocabulary is where they had to leave.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The doctor row's `run` policy is a violation of NFR-S01": ruled out. NFR-S01 is written about the two deep commands, and `/doctor:deep-loop` is the hand-off this packet's REQ-009/REQ-024 deliberately offer. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The doctor row's `run` policy is a violation of NFR-S01": ruled out. NFR-S01 is written about the two deep commands, and `/doctor:deep-loop` is the hand-off this packet's REQ-009/REQ-024 deliberately offer.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The gate is case-sensitive": ruled out. Upper and title case both serve the command. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The gate is case-sensitive": ruled out. Upper and title case both serve the command.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The gate reads files or credentials under attacker control": ruled out. The only reads are the tracked table and the compiled-route lookup. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The gate reads files or credentials under attacker control": ruled out. The only reads are the tracked table and the compiled-route lookup.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The gate throws or hangs on adversarial prompts": ruled out. Eleven shapes, none threw, and the slowest was 13.5 ms. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The gate throws or hangs on adversarial prompts": ruled out. Eleven shapes, none threw, and the slowest was 13.5 ms.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The lineage lost an iteration or a delta": ruled out. One narrative and one delta per iteration, seven completed and the eighth being this record. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The lineage lost an iteration or a delta": ruled out. One narrative and one delta per iteration, seven completed and the eighth being this record.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The offer section is missing from the compiled command contracts, so REQ-007 fails": ruled out. `compile-command-contracts.cjs` renders named blocks rather than the presentation wholesale, and its header digests prove the contracts were regenerated against the edited presentation. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The offer section is missing from the compiled command contracts, so REQ-007 fails": ruled out. `compile-command-contracts.cjs` renders named blocks rather than the presentation wholesale, and its header digests prove the contracts were regenerated against the edited presentation.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The overlay protocols are unfinished, so coverage cannot close": ruled out. Two ran and two are `notApplicable` with a recorded reason, which is a terminal status for each. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The overlay protocols are unfinished, so coverage cannot close": ruled out. Two ran and two are `notApplicable` with a recorded reason, which is a terminal status for each.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Python head cuts at a different length than the native schema": ruled out. `_advisor_prompt_head` (`skill_advisor.py:888`) counts a character outside the BMP as two units, which is the JavaScript count `ADVISOR_PROMPT_MAX_CHARS` is measured in. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The Python head cuts at a different length than the native schema": ruled out. `_advisor_prompt_head` (`skill_advisor.py:888`) counts a character outside the BMP as two units, which is the JavaScript count `ADVISOR_PROMPT_MAX_CHARS` is measured in.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The routing baseline is stale because its `capturedAt` predates the recapture": ruled out. The field is the pinned scorer-eval scoring date, read from another baseline, not the capture time (`capture-command-routing-baseline.mjs:111`). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The routing baseline is stale because its `capturedAt` predates the recapture": ruled out. The field is the pinned scorer-eval scoring date, read from another baseline, not the capture time (`capture-command-routing-baseline.mjs:111`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The scorer's normalisation covers the gate": ruled out. `normalizeText` is the scorer's own step (`lib/scorer/text.ts:22`); `attachCommand` reads `scoredPrompt`, which keeps the reader's spacing. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The scorer's normalisation covers the gate": ruled out. `normalizeText` is the scorer's own step (`lib/scorer/text.ts:22`); `attachCommand` reads `scoredPrompt`, which keeps the reader's spacing.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The strategy file gains a second heading with the same number": ruled out. The reducer's heading absorption works; section 12 appears once after two passes. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The strategy file gains a second heading with the same number": ruled out. The reducer's heading absorption works; section 12 appears once after two passes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The two gate copies have already drifted": ruled out. Twenty vocabulary lists, two numbers and the whitespace probe all agree; finding 7 is about the guard's size, not a drift. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The two gate copies have already drifted": ruled out. Twenty vocabulary lists, two numbers and the whitespace probe all agree; finding 7 is about the guard's size, not a drift.
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
- "The offer section is missing from the compiled command contracts, so REQ-007 fails": ruled out. `compile-command-contracts.cjs` renders named blocks, not the presentation wholesale, and the header digests prove regeneration against the edited presentation (iteration 1, evidence: `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1`).
- "`attachTypedCommand`, which REQ-029 names, does not exist": ruled out. Exported from `handlers/advisor-recommend.ts:442` (iteration 1).
- "The council words reappear in the scorer, so REQ-011 fails": ruled out. `explicit.ts:151` keeps them for the `/speckit:ai-council` cue, which REQ-011 does not ask to remove (iteration 1).
- "The TypeScript and Python word lists drift on the refusal and want leads": ruled out. Both apparent drifts were extraction artifacts of a single-quote-only reader; the corrected reader compares 20 lists with drift 0 (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- None. The run reaches `maxIterations` at this iteration, so the loop stops with stop reason `maxIterationsReached` and the synthesis phase compiles the report. - What synthesis should carry forward: the two active P1 rows (`R1-P1-001`, `R4-P1-001`) and the five P2 rows, with the CONDITIONAL verdict they force. - Rotation status: every configured dimension covered at least once. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Fan-out lineage under review/lineages/deepseek-max-1. Packet docs: spec.md (REQ-001..REQ-048, SC-001..SC-006), acceptance-criteria.md (AC-001..AC-056), tasks.md (T001..T105 + CHK rows), decision-record.md (ADR-001..ADR-008), implementation-summary.md, timeline.md.

Review scope: 54 pre-bound files (see section 15).

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1-3 | All 48 REQ rows mapped to a symbol, test title, fixture row or decision record. Run-level suite clauses are recorded as this lineage's limitation, not claimed as observed |
| `checklist_evidence` | core | pass | 3 | 104 ticked tasks, 52 Met rows, 26 CHK boxes resolved by name; 27 fixture ids, 35 advisor paths, 14 test titles exist; one stale row count (R3-P2-001) |
| `skill_agent` | overlay | pending | - | Overlay not yet run |
| `agent_cross_runtime` | overlay | pending | - | Overlay not yet run |
| `feature_catalog_code` | overlay | pending | - | Overlay not yet run |
| `playbook_capability` | overlay | pending | - | Overlay not yet run |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/changelog/skilled/v4.2.0.0.md` | - | - | - | not-started |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | - | - | - | not-started |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | - | - | - | not-started |
| `.skilled/commands/deep/research.md` | - | - | - | not-started |
| `.skilled/commands/deep/review.md` | - | - | - | not-started |
| `.skilled/hooks/injection-contract.md` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-refinements.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/multi-typed-command-gates.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-plural-noun.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts` | - | - | - | not-started |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/next-focus.txt` | - | - | - | not-started |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md` | - | - | - | not-started |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795546920757-7pyjry, parentSessionId=2026-11-24T19:01:50.000Z, generation=7, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T19:02:56.000Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
