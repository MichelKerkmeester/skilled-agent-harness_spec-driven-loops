---
title: Deep Review Strategy - hook-confirm-3b
---

# Deep Review Strategy - hook-confirm-3b

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder; review scope is commit `860610d783` and the two source files it changed plus their tests).
- Lineage: `hook-confirm-3b`, session `fanout-hook-confirm-3b-1794595021404-69frey`, generation 1, lineage mode `new`.
- Operator focus: confirm the pass-three fixes in commit `860610d783`; the doctor hook check is reviewed first and deepest, the no-edit pattern once.
- Dimensions: correctness, security, traceability, maintainability.
- Success criteria: every finding carries file:line and a concrete input the executor ran; no finding rests on inference alone.

## 2. NON-GOALS

- No code changes: the review target is read-only.
- No re-litigation of pass-one and pass-two findings that are already closed; only the pass-three diff and its two source files are in scope.
- No holdout prompt text: `holdout-prompts.jsonl` is never opened.
- No repository tooling beyond the two named single test files and the hook check CLI.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 6. STOP CONDITIONS

- `maxIterations` = 3 or convergence (`newFindingsRatio` below 0.10) at the end of an iteration, whichever comes first.
- A confirmed active P0 stops the verdict at FAIL regardless of convergence.
- Three consecutive iteration errors would stop the loop; none are expected.

## 7. SCOPE FILES

| Area | Path |
|------|------|
| doctor-docs | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` |
| doctor-docs | `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` |
| advisor-runtime | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` |
| advisor-runtime | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` |

## 8. WHAT WORKED
- Driving the real CLI against a settings root per command: `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <probe>` distinguishes the fix from a regression in one run, and the paired `printf '' | node - <script>` probe proves what node actually executes rather than what the reader assumes (iteration 1).
- Reading the flag grammar from node's own behaviour (`node -rc /dev/null` -> `bad option`) instead of inferring it from the flag tables (iteration 1).
- Running the same prompt through the pre-commit module extracted with `git show 860610d783^:...` and the current module: the before/after delta for a predicate change is measured, not asserted (iteration 2).
- Tracing each changed surface to its owning phase packet (`017-review-pass-two-remediation` REQ-001, AC-001, AC-027) and to the feature-catalog promise, which separated "criterion met as written" from "product promise violated" (iteration 3).

## 8A. WHAT FAILED
- Relying on the commit's suite claim as evidence: the dispatch permits only the two named single test files, so the claim was treated as unverified prose and the CLI probes carried the proof instead (iteration 1).
- Trusting a green guard suite as evidence that a predicate change is safe: the suite passed 26/26 while a genuine no-edit prompt was misrouted, because no row exercises `make no changes to <object>` as a no-edit request (iteration 2).
- Reading AC-001's `Met` row as blanket coverage of the no-edit gate: it is scoped to requests *ending* in a no-edit phrase and never claims the object-bearing class (iteration 3).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A caller compensates with a second check": ruled out by reading all three call sites — none inspects the sentence beyond the predicate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A caller compensates with a second check": ruled out by reading all three call sites — none inspects the sentence beyond the predicate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A caller compensates with a second check": ruled out by reading all three call sites — none inspects the sentence beyond the predicate.

### "Another alternative in `NO_EDIT_REQUEST` catches the failing prompt": ruled out by enumerating all nine alternatives against `make no changes to any file, just report what you find`; none matches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Another alternative in `NO_EDIT_REQUEST` catches the failing prompt": ruled out by enumerating all nine alternatives against `make no changes to any file, just report what you find`; none matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Another alternative in `NO_EDIT_REQUEST` catches the failing prompt": ruled out by enumerating all nine alternatives against `make no changes to any file, just report what you find`; none matches.

### "Doc drift in the feature catalog": ruled out as a separate finding — both catalog rows describe the predicate mechanism correctly; the contradiction is behavioural (P1 finding 1), not stale wording. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Doc drift in the feature catalog": ruled out as a separate finding — both catalog rows describe the predicate mechanism correctly; the contradiction is behavioural (P1 finding 1), not stale wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Doc drift in the feature catalog": ruled out as a separate finding — both catalog rows describe the predicate mechanism correctly; the contradiction is behavioural (P1 finding 1), not stale wording.

### "The `/^-[rC]/` early return swallows a real no-run short flag": ruled out by reading node's option grammar — `-r`/`-C` consume the rest of the word as their value, so any later letter is a value, not a flag. `node -rc /dev/null` exits with `bad option: -rc`, which is the false-`ok` case folded into P2 finding 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The `/^-[rC]/` early return swallows a real no-run short flag": ruled out by reading node's option grammar — `-r`/`-C` consume the rest of the word as their value, so any later letter is a value, not a flag. `node -rc /dev/null` exits with `bad option: -rc`, which is the false-`ok` case folded into P2 finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `/^-[rC]/` early return swallows a real no-run short flag": ruled out by reading node's option grammar — `-r`/`-C` consume the rest of the word as their value, so any later letter is a value, not a flag. `node -rc /dev/null` exits with `bad option: -rc`, which is the false-`ok` case folded into P2 finding 1.

### "The attached-value branch breaks a spaced value": ruled out — `--require ./preload.cjs` and `-r ./preload.cjs` still advance two words and report `ok`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The attached-value branch breaks a spaced value": ruled out — `--require ./preload.cjs` and `-r ./preload.cjs` still advance two words and report `ok`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The attached-value branch breaks a spaced value": ruled out — `--require ./preload.cjs` and `-r ./preload.cjs` still advance two words and report `ok`.

### "The commit's two fixes leave no regression anywhere": ruled out for the no-edit half by P1 finding 1, and confirmed clean for the hook half by iteration 1's eleven probes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The commit's two fixes leave no regression anywhere": ruled out for the no-edit half by P1 finding 1, and confirmed clean for the hook half by iteration 1's eleven probes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The commit's two fixes leave no regression anywhere": ruled out for the no-edit half by P1 finding 1, and confirmed clean for the hook half by iteration 1's eleven probes.

### "The fix breaks the original `AR3-P2-001` case": ruled out — both commit-added rows and the predicate return `false`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The fix breaks the original `AR3-P2-001` case": ruled out — both commit-added rows and the predicate return `false`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fix breaks the original `AR3-P2-001` case": ruled out — both commit-added rows and the predicate return `false`.

### "The fix reports a plausible working hook command as hook-missing": ruled out by the eight no-regression probes above, including the attached-preload case the commit added a test for. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The fix reports a plausible working hook command as hook-missing": ruled out by the eight no-regression probes above, including the attached-preload case the commit added a test for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fix reports a plausible working hook command as hook-missing": ruled out by the eight no-regression probes above, including the attached-preload case the commit added a test for.

### "The packet's acceptance rows are falsely marked Met": ruled out — AC-001 and AC-027 are scoped to the literal classes they tested and both still pass; what is missing is a row for the object-bearing class, recorded as P2 finding 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The packet's acceptance rows are falsely marked Met": ruled out — AC-001 and AC-027 are scoped to the literal classes they tested and both still pass; what is missing is a row for the object-bearing class, recorded as P2 finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The packet's acceptance rows are falsely marked Met": ruled out — AC-001 and AC-027 are scoped to the literal classes they tested and both still pass; what is missing is a row for the object-bearing class, recorded as P2 finding 1.

### `agent_cross_runtime` — notApplicable (no runtime mirror in this diff). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` — notApplicable (no runtime mirror in this diff).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` — notApplicable (no runtime mirror in this diff).

### `checklist_evidence` — **not applicable this iteration**. The spec folder has no `checklist.md`; the review target is the commit diff, not a packet checklist row. Recorded rather than silently passed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` — **not applicable this iteration**. The spec folder has no `checklist.md`; the review target is the commit diff, not a packet checklist row. Recorded rather than silently passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **not applicable this iteration**. The spec folder has no `checklist.md`; the review target is the commit diff, not a packet checklist row. Recorded rather than silently passed.

### `checklist_evidence` — **notApplicable**: no `checklist.md` in the packet. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` — **notApplicable**: no `checklist.md` in the packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **notApplicable**: no `checklist.md` in the packet.

### `checklist_evidence` — **pass with scope note**. AC-001 and AC-027 are recorded `Met` in `017-review-pass-two-remediation/acceptance-criteria.md`. Both remain Met for the scope they state (the four ending wordings; the seven wrapper launches). Neither row claims the object-bearing no-edit class, which is why the regression does not falsify a `Met` row — it exposes that no row covers it (P2 finding 1). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` — **pass with scope note**. AC-001 and AC-027 are recorded `Met` in `017-review-pass-two-remediation/acceptance-criteria.md`. Both remain Met for the scope they state (the four ending wordings; the seven wrapper launches). Neither row claims the object-bearing no-edit class, which is why the regression does not falsify a `Met` row — it exposes that no row covers it (P2 finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **pass with scope note**. AC-001 and AC-027 are recorded `Met` in `017-review-pass-two-remediation/acceptance-criteria.md`. Both remain Met for the scope they state (the four ending wordings; the seven wrapper launches). Neither row claims the object-bearing no-edit class, which is why the regression does not falsify a `Met` row — it exposes that no row covers it (P2 finding 1).

### `feature_catalog_code` — **partial**. `feature-catalog/cli-surface/advisor-recommend.md:33` promises "A prompt that matches `NO_EDIT_REQUEST` gets no command from any hub, because a reader who rules out a change is never handed work that writes", and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` repeats it for the meaning gate. The predicate-level sentence stays literally true, but the product promise is contradicted for the object-bearing wording class by P1 finding 1: a reader who rules out a change is handed `/create:agent`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` — **partial**. `feature-catalog/cli-surface/advisor-recommend.md:33` promises "A prompt that matches `NO_EDIT_REQUEST` gets no command from any hub, because a reader who rules out a change is never handed work that writes", and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` repeats it for the meaning gate. The predicate-level sentence stays literally true, but the product promise is contradicted for the object-bearing wording class by P1 finding 1: a reader who rules out a change is handed `/create:agent`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — **partial**. `feature-catalog/cli-surface/advisor-recommend.md:33` promises "A prompt that matches `NO_EDIT_REQUEST` gets no command from any hub, because a reader who rules out a change is never handed work that writes", and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` repeats it for the meaning gate. The predicate-level sentence stays literally true, but the product promise is contradicted for the object-bearing wording class by P1 finding 1: a reader who rules out a change is handed `/create:agent`.

### `feature_catalog_code` — deferred to iteration 3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` — deferred to iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — deferred to iteration 3.

### `skill_agent` — **pass**: `attachCommand`'s early return at `command-attach.ts:335` calls the shared predicate, so the hub-command gate inherits the same behaviour; no drift between the two gates. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` — **pass**: `attachCommand`'s early return at `command-attach.ts:335` calls the shared predicate, so the hub-command gate inherits the same behaviour; no drift between the two gates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — **pass**: `attachCommand`'s early return at `command-attach.ts:335` calls the shared predicate, so the hub-command gate inherits the same behaviour; no drift between the two gates.

### `skill_agent` — **pass**. `attachCommand` (`command-attach.ts:335`), `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`) and `isReadOnlyExplainer` (`text.ts:150`) all call the shared predicate; no gate holds a private copy. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` — **pass**. `attachCommand` (`command-attach.ts:335`), `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`) and `isReadOnlyExplainer` (`text.ts:150`) all call the shared predicate; no gate holds a private copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — **pass**. `attachCommand` (`command-attach.ts:335`), `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`) and `isReadOnlyExplainer` (`text.ts:150`) all call the shared predicate; no gate holds a private copy.

### `skill_agent` — deferred to iteration 3 (the doctor command surface is not the reviewed file itself). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` — deferred to iteration 3 (the doctor command surface is not the reviewed file itself).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — deferred to iteration 3 (the doctor command surface is not the reviewed file itself).

### `spec_code` — **partial**. `017-review-pass-two-remediation` REQ-001 states the mechanism: the pattern is "widened with `make no changes`, `no changes yet` and the `don't` contraction". The commit keeps the phrase for the bare and change-request forms but removes it for every `make no changes to <object>` sentence, so the mechanism statement no longer holds for that class (P1 finding 1). AC-001's literal scope — "an agent request **ending** in each of the four no-edit wordings" — still passes; all four were run: -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` — **partial**. `017-review-pass-two-remediation` REQ-001 states the mechanism: the pattern is "widened with `make no changes`, `no changes yet` and the `don't` contraction". The commit keeps the phrase for the bare and change-request forms but removes it for every `make no changes to <object>` sentence, so the mechanism statement no longer holds for that class (P1 finding 1). AC-001's literal scope — "an agent request **ending** in each of the four no-edit wordings" — still passes; all four were run:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **partial**. `017-review-pass-two-remediation` REQ-001 states the mechanism: the pattern is "widened with `make no changes`, `no changes yet` and the `don't` contraction". The commit keeps the phrase for the bare and change-request forms but removes it for every `make no changes to <object>` sentence, so the mechanism statement no longer holds for that class (P1 finding 1). AC-001's literal scope — "an agent request **ending** in each of the four no-edit wordings" — still passes; all four were run:

### `spec_code` — **partial**. The commit message says: "The no-edit pattern read a change request that says what to leave alone ... as a request for no change at all. That wording now keeps its command." The named wording does keep its command (`make no changes to its public api` -> `false`, `make no changes in the tests` -> `false`), so the stated mechanism is present at `command-attach.ts:289`. The same sentence also implies the pattern still reads *genuine* no-edit wording as no-edit; that half is now false for the object-bearing form, which is P1 finding 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` — **partial**. The commit message says: "The no-edit pattern read a change request that says what to leave alone ... as a request for no change at all. That wording now keeps its command." The named wording does keep its command (`make no changes to its public api` -> `false`, `make no changes in the tests` -> `false`), so the stated mechanism is present at `command-attach.ts:289`. The same sentence also implies the pattern still reads *genuine* no-edit wording as no-edit; that half is now false for the object-bearing form, which is P1 finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **partial**. The commit message says: "The no-edit pattern read a change request that says what to leave alone ... as a request for no change at all. That wording now keeps its command." The named wording does keep its command (`make no changes to its public api` -> `false`, `make no changes in the tests` -> `false`), so the stated mechanism is present at `command-attach.ts:289`. The same sentence also implies the pattern still reads *genuine* no-edit wording as no-edit; that half is now false for the object-bearing form, which is P1 finding 1.

### `spec_code` — **pass** (hook half). The commit message claims: "It now reads the flag name first, so those commands report a missing hook." Probe evidence: `node -e1 <marker>`, `node --eval=1 <marker>`, `node --print=1 <marker>` each return `hook-missing claude .claude/settings.json` and exit 1, where the pass-three finding `DR3-P1-001` said they were read as a launch. The implementation at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:231-237` is the stated mechanism (name read first, then the set lookup). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` — **pass** (hook half). The commit message claims: "It now reads the flag name first, so those commands report a missing hook." Probe evidence: `node -e1 <marker>`, `node --eval=1 <marker>`, `node --print=1 <marker>` each return `hook-missing claude .claude/settings.json` and exit 1, where the pass-three finding `DR3-P1-001` said they were read as a launch. The implementation at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:231-237` is the stated mechanism (name read first, then the set lookup).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **pass** (hook half). The commit message claims: "It now reads the flag name first, so those commands report a missing hook." Probe evidence: `node -e1 <marker>`, `node --eval=1 <marker>`, `node --print=1 <marker>` each return `hook-missing claude .claude/settings.json` and exit 1, where the pass-three finding `DR3-P1-001` said they were read as a launch. The implementation at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:231-237` is the stated mechanism (name read first, then the set lookup).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- "The hook fix reports a plausible working hook command as hook-missing": eight launch-shaped probes still return `ok`, including `node -r./preload.cjs <marker>` and `node --no-warnings <marker>` (iteration 1, evidence: `hook-wiring-check.cjs:231-237` and the probe table in `iterations/iteration-001.md`).
- "The `/^-[rC]/` early return hides a real no-run short flag": `-r`/`-C` consume the rest of the word as a value, so a later letter is a value, not a flag (iteration 1, evidence: `node -rc /dev/null` -> `bad option: -rc`).
- "The no-edit fix breaks the case it targeted": both commit-added rows and `make no changes to its public api` return `false` (iteration 2, evidence: `command-attach.ts:289` and the predicate run in `iterations/iteration-002.md`).
- "Another alternative in `NO_EDIT_REQUEST` catches `make no changes to any file, just report what you find`": all nine alternatives were enumerated against the prompt and none match (iteration 2).
- "A caller compensates for the predicate change with a second check": `attachCommand`, `readOnlyRouteAllowed`, `commandMeaningEligible` and `isReadOnlyExplainer` all delegate to the predicate and add no object or verb check (iteration 2).
- "The packet's acceptance rows are falsely marked Met": AC-001 is scoped to requests ending in a no-edit phrase and AC-027 to the seven wrapper launches; both still pass, so what is missing is a row, not a false claim (iteration 3).
- "Doc drift in the feature catalog": both catalog rows describe the predicate mechanism correctly; the contradiction is behavioural (P1-001), not stale wording (iteration 3).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; maxIterations (3) is reached. - Focus area: synthesis — reconcile the active P1 and four P2s into the review report and the release-readiness state. - Reason: hard stop `maxIterationsReached` per the workflow's convergence step 1a. - Rotation status: correctness, maintainability and traceability covered; security had no surface in this diff (pure parsing predicates, no trust boundary crossed). - Required evidence: registry counts, verdict recomputation, and both permitted suites green.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:226-237` (new `nodeFlagSkipsScript`), `:270-280` (`runsNodeOnMarker`), `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` (`NO_EDIT_REQUEST`), `:293-295` (`isNoEditRequest`), callers `runtime/lib/scorer/fusion.ts:677,881` and `runtime/lib/scorer/text.ts:150`.
- Behavior claims: an attached node flag value (`-e1`, `--eval=1`, `--print=1`) must not read as a launch of the hook script; an attached preload (`-r./preload.cjs`) must still read as a launch; `make no changes to <surface>` inside a change request must not read as a no-edit request.
- Reuse and conventions: review doctrine from `sk-code-review/references/review-core.md`; severity P0/P1/P2 only; every finding needs `file:line` and a concrete input run.
- Review risks and gaps: the pass-three commit's own suite claims (184 files, 1798 passed) are not re-run in full here; the two named single test files are the only suites run. The `node -` non-launch path is pre-existing, not introduced by this commit.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ-001's mechanism narrowed for object-bearing `make no changes` (P1-001); AC-001's four ending wordings and AC-027's launches still pass |
| `checklist_evidence` | core | pass | 3 | AC-001 and AC-027 remain Met for the literal scope they state; neither claims the object-bearing class |
| `skill_agent` | overlay | pass | 2 | `attachCommand` consumes the shared predicate at `command-attach.ts:335`; no gate drift |
| `agent_cross_runtime` | overlay | notApplicable | - | no runtime mirror in this diff |
| `feature_catalog_code` | overlay | partial | 3 | catalog row promises a reader who rules out a change is never handed work that writes; contradicted for the object-bearing class by P1-001 |
| `playbook_capability` | overlay | notApplicable | - | no playbook surface in this diff |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | correctness | 2 | 0 P0, 1 P1, 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | correctness, maintainability | 3 | 0 P0, 0 P1, 1 P2 (gap) | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-hook-confirm-3b-1794595021404-69frey, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T18:42:04Z
<!-- MACHINE-OWNED: END -->
