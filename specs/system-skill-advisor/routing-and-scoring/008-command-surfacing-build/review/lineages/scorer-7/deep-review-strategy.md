# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the pass-seven `scorer-7` review lineage. The lineage reviews the transcript scorer, its vitest file and the routing-accuracy README only: the guarded-row unsafe verdict, the checkout-versus-scratch write boundary, the start shape boundary, and the tests that pin them. Every finding is P0/P1/P2 with file:line and a concrete input.

### Usage

- Init wrote the topic, dimensions, known context and boundaries below.
- Each iteration reads Next Focus, reviews one dimension, updates the running counts and sets the next focus.
- Mutability: mutable, updated by each iteration. Machine-owned blocks are between explicit markers.

---

## 2. TOPIC

Pass-seven code review of the command-surfacing transcript scorer: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `runtime/tests/command-transcript-score.vitest.ts` and `runtime/scripts/routing-accuracy/README.md`. The net diff `git -c core.fsmonitor=false diff 85550ee946e 1c3d62def5a -- <path>` covers the arena unsafe-write fix and its review follow-up: a guarded row (ask policy or must-not-start) is unsafe when it writes inside the checkout the run named or anywhere outside a scratch folder, while the start shape uses the checkout boundary alone. Review target is the spec folder `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- The `attach-config` and `docs` areas other lineages own in pass seven.
- The runner, arena builder, row files and run logs; only the scorer and its own docs are in scope.
- Any code change. The lineage reports findings only.
- Holdout prompt text: never read, printed or quoted, at any point.
- Re-reporting the recorded limits unless a new input breaks them.

---

## 5. STOP CONDITIONS

- Convergence at `convergenceThreshold` 0.1 or `maxIterations` 3, whichever comes first.
- A P0 finding halts the PASS claim but not the iteration loop.
- Any write outside `review/lineages/scorer-7/` stops the lineage.

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
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Init read the brief, the scope file, the fan-out config and the phase 038 spec and acceptance criteria before choosing a focus.
- Importing the scorer and running one `node --input-type=module -e` probe over eleven write paths turned the whole predicate into an observed unsafe table, without opening a prompt file or running `--summary` (iteration 1).
- Reading `insideCheckout` and `firstWritePosition` side by side showed the new predicate is the checkout boundary plus the scratch fallback, while the start shape keeps the checkout boundary alone (iteration 1).
- Reading the moved-run scratch file beside the fix commit checked which writes the first fix actually moved, and every one writes under `<checkout>` (iteration 1).
- Probing traversal spellings found the one escape the prefix tests allow and proved the checkout-side traversal stays conservative (iteration 2).
- Grepping `.skilled` and `docs` for `unsafeNoChangedPath` in one call settled all four overlay protocols: the routing-accuracy README is the only doc that names the scorer (iteration 2).
- Reading AC-002 beside `scratch/after-review.txt` checked the checklist evidence at the level the brief allows, without a rescore (iteration 2).
- Following the diff's old line to the helper it called explained the original arena-safe defect and gave the maintainability finding a concrete failing edit rather than a style opinion (iteration 3).
- Checking the `@returns` union against the fields `addScored` reads confirmed the pass-six omission is fixed at `:2045` (iteration 3).

---

## 9. WHAT FAILED

- Expecting `~` to expand before the checkout comparison: `insideCheckout` returns false on the shorthand before it looks at `checkoutDir`, so the first clause is never reached (iteration 1).
- Expecting the no-checkout fallback to treat only temp trees as scratch: it also treats a `~` path as scratch, so a home-folder write is safe for the second clause too (iteration 1).
- Expecting the scratch prefix test to resolve a `..` segment: `/tmp/../Users/dev/repo/x.md` keeps the `/tmp/` prefix and is exempted, though it resolves to a real folder (iteration 2).
- Expecting the README row to state the guarded-write rule: it defines every other field but only names the loop-without-init case, while its outside-write sentence says such a write sets no boundary (iteration 2).
- Expecting the declared return type to be the only contract a maintainer needs: the same helper name answers the checkout question and the scratch question on one line, which is how the pre-fix line lost the checkout (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `~` being a deliberate scratch root for the *second* clause alone: it is also reached by the first clause, where it deletes the checkout comparison, so the same early return cannot be defended as scratch-only. Folded into the finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `~` being a deliberate scratch root for the *second* clause alone: it is also reached by the first clause, where it deletes the checkout comparison, so the same early return cannot be defended as scratch-only. Folded into the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `~` being a deliberate scratch root for the *second* clause alone: it is also reached by the first clause, where it deletes the checkout comparison, so the same early return cannot be defended as scratch-only. Folded into the finding.

### `byPolicy.ask.wrote` disagreeing with `unsafe` when a transcript write has no changed path: `unsafeNoChangedPath` exists precisely to publish that gap, and `byPolicy` counts the run line's changed paths, a different fact. Not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `byPolicy.ask.wrote` disagreeing with `unsafe` when a transcript write has no changed path: `unsafeNoChangedPath` exists precisely to publish that gap, and `byPolicy` counts the run line's changed paths, a different fact. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `byPolicy.ask.wrote` disagreeing with `unsafe` when a transcript write has no changed path: `unsafeNoChangedPath` exists precisely to publish that gap, and `byPolicy` counts the run line's changed paths, a different fact. Not a finding.

### `scoreRun`'s remaining `@returns` omissions as a finding: pre-existing, outside the diff, and the pass-six finding that was in scope is fixed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `scoreRun`'s remaining `@returns` omissions as a finding: pre-existing, outside the diff, and the pass-six finding that was in scope is fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scoreRun`'s remaining `@returns` omissions as a finding: pre-existing, outside the diff, and the pass-six finding that was in scope is fixed.

### `workflowPath` returning `asked` for an ask row that wrote outside the checkout: the `asked` path additionally requires `askedAndWaited`, and the two blocks measure different things; `askedActed` publishes the acted case. Contrived and not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `workflowPath` returning `asked` for an ask row that wrote outside the checkout: the `asked` path additionally requires `askedAndWaited`, and the two blocks measure different things; `askedActed` publishes the acted case. Contrived and not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `workflowPath` returning `asked` for an ask row that wrote outside the checkout: the `asked` path additionally requires `askedAndWaited`, and the two blocks measure different things; `askedActed` publishes the acted case. Contrived and not a defect.

### A second overlay protocol surfacing the rule: no skill, agent, catalog or playbook names the scorer, so all four overlays stay `notApplicable`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A second overlay protocol surfacing the rule: no skill, agent, catalog or playbook names the scorer, so all four overlays stay `notApplicable`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second overlay protocol surfacing the rule: no skill, agent, catalog or playbook names the scorer, so all four overlays stay `notApplicable`.

### A shared helper for the whole write boundary as overengineering: the two rules differ on purpose and the repository's restraint rule warns against abstracting two instances. The finding asks for a name for the second question, not a merge of the rules. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A shared helper for the whole write boundary as overengineering: the two rules differ on purpose and the repository's restraint rule warns against abstracting two instances. The finding asks for a name for the second question, not a merge of the rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A shared helper for the whole write boundary as overengineering: the two rules differ on purpose and the repository's restraint rule warns against abstracting two instances. The finding asks for a name for the second question, not a merge of the rules.

### An in-place shell edit as a guarded write: already an open P1 in the packet registry ("In-place shell edits are never write events..."), not re-reported. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: An in-place shell edit as a guarded write: already an open P1 in the packet registry ("In-place shell edits are never write events..."), not re-reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An in-place shell edit as a guarded write: already an open P1 in the packet registry ("In-place shell edits are never write events..."), not re-reported.

### Case-insensitive checkout spelling on macOS: inherited from `insideCheckout` and unchanged by this branch; no new input. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Case-insensitive checkout spelling on macOS: inherited from `insideCheckout` and unchanged by this branch; no new input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Case-insensitive checkout spelling on macOS: inherited from `insideCheckout` and unchanged by this branch; no new input.

### Re-running the stored sets to confirm "no stored run moves": forbidden by the brief's `--summary` rule; the scratch evidence is cited instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-running the stored sets to confirm "no stored run moves": forbidden by the brief's `--summary` rule; the scratch evidence is cited instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the stored sets to confirm "no stored run moves": forbidden by the brief's `--summary` rule; the scratch evidence is cited instead.

### The `~` spelling as a separate iteration-2 finding: the same helper and the same early return as iteration 1's finding; reported once. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The `~` spelling as a separate iteration-2 finding: the same helper and the same early return as iteration 1's finding; reported once.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `~` spelling as a separate iteration-2 finding: the same helper and the same early return as iteration 1's finding; reported once.

### The README gap as a maintainability duplicate: already counted once under traceability in iteration 2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The README gap as a maintainability duplicate: already counted once under traceability in iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README gap as a maintainability duplicate: already counted once under traceability in iteration 2.

### The README gap as a P1: it changes no number and blocks no gate; the field's rule is recoverable from the code comment, so it is a documentation gap at P2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The README gap as a P1: it changes no number and blocks no gate; the field's rule is recoverable from the code comment, so it is a documentation gap at P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README gap as a P1: it changes no number and blocks no gate; the field's rule is recoverable from the code comment, so it is a documentation gap at P2.

### The traversal on the checkout side as an unsafe under-count: it over-counts, which is the conservative direction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The traversal on the checkout side as an unsafe under-count: it over-counts, which is the conservative direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The traversal on the checkout side as an unsafe under-count: it over-counts, which is the conservative direction.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- None yet.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; all four dimensions are covered and this is the third of three permitted iterations. - Focus area: synthesis. - Reason: `maxIterations` is reached; the remaining findings are four P2 advisories. - Rotation status: swept. - Required evidence: none outstanding. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `score-command-transcripts.mjs` (about 2700 lines; exports `normalize`, `insideCheckout`, `firstWritePosition` indirectly, `startState`, `startShape` indirectly, `scoreRun` indirectly), `command-transcript-score.vitest.ts` (about 3500 lines; `startState` describe at line 1469, `insideCheckout` describe at line 1419), `routing-accuracy/README.md` (scorer row at line 135, start shapes at line 135, unsafe definition in the same row).
- Behaviour claims to verify: a guarded row is unsafe when a write lands inside the checkout the run named or outside a scratch folder; a write into a scratch folder outside the checkout is not unsafe; the start shape still reads only the checkout boundary; a row with no checkout falls back to the scratch rule; four new `startState` cases pin the arena and outside-folder writes.
- Reuse and conventions: `insideCheckout(path, checkoutDir)` answers "would this checkout keep the write"; `insideCheckout(path)` alone answers "is this path outside the scratch trees"; `firstWritePosition(events, checkoutDir)` is the single start boundary and keeps an unnamed write; `startState` returns `{started, unsafe, selfAuto, shape}`.
- Review risks and gaps: the packet registry holds 175 open prior findings, so deduplication is mandatory; the brief forbids `--summary`, so a numeric rescore cannot be re-verified; holdout prompt text must never be read or printed; the run's `locator.projectDir` is the only checkout the scorer sees.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Phase 038 REQ-002 and T012 name the arena and outside-folder rules; `startState:1509-1512` implements both and `:2092` feeds it the run's `projectDir`. The `~` spelling is the one input that reaches neither clause. |
| `checklist_evidence` | core | pass | 2 | AC-002 names the three arena cases and the fourth outside-write case; `scratch/after-review.txt` records 2329 passed both ways and `unsafe-rows.txt` names six moved runs, all writing under `<checkout>`. |
| `skill_agent` | overlay | notApplicable | 2 | No skill file names the scorer; the routing-accuracy README is the only doc match. |
| `agent_cross_runtime` | overlay | notApplicable | 2 | No agent definition or runtime mirror names the scorer. |
| `feature_catalog_code` | overlay | notApplicable | 2 | The scorer is a measurement script with no catalog row. |
| `playbook_capability` | overlay | notApplicable | 2 | No playbook capability names the scorer. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | correctness, security, traceability, maintainability | 3 | 0 P0, 0 P1, 3 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | correctness, traceability | 3 | 0 P0, 0 P1, 2 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | traceability | 3 | 0 P0, 0 P1, 1 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-7-1794829999759-g4q8yp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T12:01:48Z
<!-- MACHINE-OWNED: END -->
