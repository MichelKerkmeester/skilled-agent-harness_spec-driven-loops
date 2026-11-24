# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2). Traceability is the lead focus: every REQ-001 to REQ-053 against the code that implements it or the ADR that records it, and every ticked task and `Met` acceptance row against evidence in the tree, including the twelfth fix round (T112 to T114).

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing any finding. This is a read-only review; implementation is a follow-up step.
- Re-running the advisor, Python, vitest or probe suites. Evidence is checked by reading the tree.
- Re-deciding the operator decisions ADR-001 to ADR-009. They are reviewed as records, not reopened.

---

## 5. STOP CONDITIONS
- `--max-iterations=7` with `stopPolicy=max-iterations`: the run stops at 7 iterations whatever convergence says.
- Any active P0 keeps the verdict at FAIL; an active P1 keeps it CONDITIONAL.

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
- P1 (Required): 0
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading `attachCommand` top-down against the contract comments and the guard cases: each branch's guard matched its stated intent, and the three suspicious reads resolved as unobservable rather than findings (iteration 1).
- Following a command string across the child boundary to every consumer: the CLI path vets it and the hook brief path does not, which surfaced the run's first P2 (iteration 2).
- Reading this lineage's own strategy as the reducer's output, not just as my notes: the exhausted-approaches projection and the confirmed-clean fallback surfaced two reducer P2s that a code-only read of the iteration contract would have missed (iteration 3).

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### **A child can inject an arbitrary command through `parseRecommendations`** -- the parser accepts any non-empty string ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]). Ruled out as a live injection: the Python rows' command comes from its own command table ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2391]), and the gate there sets only the `typed` marker ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5811]); the prompt never supplies the string, so the realistic case is table drift, which is what the P2 records. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A child can inject an arbitrary command through `parseRecommendations`** -- the parser accepts any non-empty string ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]). Ruled out as a live injection: the Python rows' command comes from its own command table ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2391]), and the gate there sets only the `typed` marker ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5811]); the prompt never supplies the string, so the realistic case is table drift, which is what the P2 records.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A declared change-set path is missing from the seeded review scope** — ruled out: the only two entries not present as lines are the `compiled/` and `dist/` directories, whose individual tracked files are in the scope list, and `dist/` is gitignored and rebuilt, which T111 states. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A declared change-set path is missing from the seeded review scope** — ruled out: the only two entries not present as lines are the `compiled/` and `dist/` directories, whose individual tracked files are in the scope list, and `dist/` is gitignored and rebuilt, which T111 states.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A fifth dimension or an unrecorded one** — ruled out: the configured set is the four canonical dimensions, and the registry shows each true. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A fifth dimension or an unrecorded one** — ruled out: the configured set is the four canonical dimensions, and the registry shows each true.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A long prompt makes the gate quadratic** -- ruled out as a security cost: the tool schema caps the prompt at 10,000 characters ([SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]) and the lead scans are bounded ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A long prompt makes the gate quadratic** -- ruled out as a security cost: the tool schema caps the prompt at 10,000 characters ([SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]) and the lead scans are bounded ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A P0 or P1 hides behind the P2 set** — ruled out on the evidence: the six open findings are a doc-vs-code rule drift (three surfaces plus a module reference), a stale checklist count, two reducer projection defects and a child-boundary vetting gap, and none of them makes a user-visible operation produce the wrong result. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A P0 or P1 hides behind the P2 set** — ruled out on the evidence: the six open findings are a doc-vs-code rule drift (three surfaces plus a module reference), a stale checklist count, two reducer projection defects and a child-boundary vetting gap, and none of them makes a user-visible operation produce the wrong result.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A REQ row names a symbol that no longer exists** — ruled out: the sweep resolves every symbol token except the REQ-011 names the requirement removes. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A REQ row names a symbol that no longer exists** — ruled out: the sweep resolves every symbol token except the REQ-011 names the requirement removes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **An acceptance row carries an evidence tail that does not resolve** — ruled out: `scratch/citations/evidence-tails.py` reports `problems=0` on `acceptance-criteria.md`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **An acceptance row carries an evidence tail that does not resolve** — ruled out: `scratch/citations/evidence-tails.py` reports `problems=0` on `acceptance-criteria.md`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **An acceptance row claims a current suite count it cannot support.** Ruled out: each such row names the round or commit it observed, so the counts are dated observations, not present-tense claims. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **An acceptance row claims a current suite count it cannot support.** Ruled out: each such row names the round or commit it observed, so the counts are dated observations, not present-tense claims.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Bounded negation window loses a distant refusal** -- `endsBefore` reads a 400-character window ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]). Ruled out: `RUN_ASK_NEGATED_SOURCE` itself allows at most two words between the lead and the phrase ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:763]), so the window is never the limiting factor and no prompt that the grammar would refuse is lost to it. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **Bounded negation window loses a distant refusal** -- `endsBefore` reads a 400-character window ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]). Ruled out: `RUN_ASK_NEGATED_SOURCE` itself allows at most two words between the lead and the phrase ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:763]), so the window is never the limiting factor and no prompt that the grammar would refuse is lost to it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Generation 8's findings are still open** — ruled out: each of the nine was traced to the row, task or symbol that closed it, listed above. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Generation 8's findings are still open** — ruled out: each of the nine was traced to the row, task or symbol that closed it, listed above.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **No-edit guard reads the routed mode, not the served mode** -- `attachCommand` withholds on `isNoEditRequest(prompt) && !READ_ONLY_LOOP_MODES.includes(workflowMode)` at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621] before `servedMode` is computed at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1637]. Ruled out as unobservable: the only modes the hub maps are `research` and `review` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36]), and both are in `READ_ONLY_LOOP_MODES` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:558]), so the two reads can never disagree on today's tree. No case produces a wrong result. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **No-edit guard reads the routed mode, not the served mode** -- `attachCommand` withholds on `isNoEditRequest(prompt) && !READ_ONLY_LOOP_MODES.includes(workflowMode)` at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621] before `servedMode` is computed at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1637]. Ruled out as unobservable: the only modes the hub maps are `research` and `review` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36]), and both are in `READ_ONLY_LOOP_MODES` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:558]), so the two reads can never disagree on today's tree. No case produces a wrong result.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Reducer section replacement could duplicate a heading** -- `replaceAnchorSection` absorbs an authored heading above the anchor ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2453]) and keeps the file's own ordinal ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2430]). Ruled out for the heading-first dialect: the authored-heading pattern requires the marker directly under the heading, and the strategy template this lineage wrote carries `MACHINE-OWNED` markers instead, which the heading fallback matches. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **Reducer section replacement could duplicate a heading** -- `replaceAnchorSection` absorbs an authored heading above the anchor ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2453]) and keeps the file's own ordinal ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2430]). Ruled out for the heading-first dialect: the authored-heading pattern requires the marker directly under the heading, and the strategy template this lineage wrote carries `MACHINE-OWNED` markers instead, which the heading fallback matches.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **T084 is silently closed by this run.** Ruled out as a documentation defect: T084 stays `[ ]` and AC-040 stays `Unmet`, which is what the terminal gates of this lineage will either satisfy or leave open. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **T084 is silently closed by this run.** Ruled out as a documentation defect: T084 stays `[ ]` and AC-040 stays `Unmet`, which is what the terminal gates of this lineage will either satisfy or leave open.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The deep gate could start a run without asking** -- both deep commands carry `ask` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122]) and the probe rows read `pol=ask`; `parentNamedOnly` additionally downgrades a non-read-only `run` in a child session ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:198]). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The deep gate could start a run without asking** -- both deep commands carry `ask` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122]) and the probe rows read `pol=ask`; `parentNamedOnly` additionally downgrades a non-read-only `run` in a child session ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:198]).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The feature catalog names a module that does not exist** -- ruled out: my first read of the page was taken through `rg -r`, whose replacement text rewrote the matched identifiers in the output only; reading the file directly shows `attachCommand()` and `lib/command-attach.ts`, and `lib/command-attach.ts` exists. Recorded because the false positive is instructive, not because the catalog is wrong. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **The feature catalog names a module that does not exist** -- ruled out: my first read of the page was taken through `rg -r`, whose replacement text rewrote the matched identifiers in the output only; reading the file directly shows `attachCommand()` and `lib/command-attach.ts`, and `lib/command-attach.ts` exists. Recorded because the false positive is instructive, not because the catalog is wrong.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The fixture is a second source of truth for behaviour** — the fixture holds only input/expected columns and both suites read it ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121]); no behaviour is encoded in the fixture that the gate does not implement, because each column is asserted against the gate's own return. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The fixture is a second source of truth for behaviour** — the fixture holds only input/expected columns and both suites read it ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121]); no behaviour is encoded in the fixture that the gate does not implement, because each column is asserted against the gate's own return.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The playbook scenario is broken by the reversed rule** -- ruled out for the leaf's own six prompts, which name creation and git work; the drift is in the general sentences (F-006-001). -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **The playbook scenario is broken by the reversed rule** -- ruled out for the leaf's own six prompts, which name creation and git work; the drift is in the general sentences (F-006-001).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The reducer can duplicate a machine-owned heading** — the ordinal is taken from the file and the authored heading is absorbed, so this lineage's strategy holds one `## 3`, `## 6`, `## 7` and `## 12`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The reducer can duplicate a machine-owned heading** — the ordinal is taken from the file and the authored heading is absorbed, so this lineage's strategy holds one `## 3`, `## 6`, `## 7` and `## 12`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The runtime mirrors are missing** -- ruled out: `.claude/agents/deep-review.md` and `.opencode/agents/deep-review.md` both exist and open on the same persona. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **The runtime mirrors are missing** -- ruled out: `.claude/agents/deep-review.md` and `.opencode/agents/deep-review.md` both exist and open on the same persona.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The strategy's numbered reads are inconsistent** — `extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')` passes the number, so a numbered template reads correctly; the strictness is a documented edge case rather than a live defect for this packet's template. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The strategy's numbered reads are inconsistent** — `extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')` passes the number, so a numbered template reads correctly; the strictness is a documented edge case rather than a live defect for this packet's template.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The Verification Summary miscounts its own items.** Ruled out: the 12 P0, 13 P1 and 1 P2 checks in `tasks.md` are exactly the counts the summary states, and the single unverified P0 is CHK-020. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **The Verification Summary miscounts its own items.** Ruled out: the 12 P0, 13 P1 and 1 P2 checks in `tasks.md` are exactly the counts the summary states, and the single unverified P0 is CHK-020.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Typed doctor on a stuck complaint bypasses the no-edit guard** -- the first branch returns the doctor for a typed doctor command ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1597]) before the no-edit test. Ruled out: `commandOnlyMentioned` still withholds a mention, and a typed doctor the reader asked for is the request itself, as the comments at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1593] state and the guard case "my deep research run is stuck, don't fix anything, just run /doctor:deep-loop …" pins. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **Typed doctor on a stuck complaint bypasses the no-edit guard** -- the first branch returns the doctor for a typed doctor command ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1597]) before the no-edit test. Ruled out: `commandOnlyMentioned` still withholds a mention, and a typed doctor the reader asked for is the request itself, as the comments at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1593] state and the guard case "my deep research run is stuck, don't fix anything, just run /doctor:deep-loop …" pins.
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
- [None yet]

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none remaining (all four recorded; 7 of 7 iterations used).
- Focus area: synthesis — compile the review report from this run's registry and iteration files, and record the terminal synthesis event.
- Reason: the iteration cap is reached; `stopPolicy=max-iterations` makes convergence telemetry only.
- Rotation status: complete.
- Required evidence: the registry counts, the six finding ids, and the run's dimension coverage.
- Blocked/productive carry-forward: none blocked.
- Recovery note: not applicable.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Target pointers: `spec.md` (REQ-001 to REQ-053), `acceptance-criteria.md` (AC-001 to AC-061), `tasks.md` (T001 to T114, CHK-001 to CHK-051), `decision-record.md` (ADR-001 to ADR-009), `implementation-summary.md` (twelve rounds, eight limitations), `timeline.md`.
- Code under trace: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `runtime/scripts/skill_advisor.py`, `runtime/lib/scorer/lanes/explicit.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/handlers/advisor-recommend.ts`, `runtime/skill-advisor-cli.ts`, `runtime/lib/subprocess.ts`, the shared fixture and its guard suites, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`.
- Behaviour claims: every REQ states a served result; the probe file `scratch/probes/results-after.json` holds 69 rows and `scratch/probes/results-spec-baseline.json` the pre-change baseline.
- Review risks and gaps: `dist/` is gitignored, so a served result proven only by `dist` cannot be checked from the tree; the review report of an earlier generation lives under `review-archive/<timestamp>/` and is not the current `review/`.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | REQ-049 whitespace folding confirmed in both copies; remaining REQ rows pending. |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795552859377-13gxwk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T20:42:23Z
<!-- MACHINE-OWNED: END -->
