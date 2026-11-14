# Deep Review Strategy - accuracy-runner-4 Lineage

## 1. REVIEW CHARTER

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder target)
- Fan-out lineage: `accuracy-runner-4` (artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/accuracy-runner-4`); pass-four area is `accuracy-runner`
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: legal convergence at `convergenceThreshold=0.10`, or `maxIterations=4`, whichever comes first
- Success criteria: every pass-four area file reviewed; every finding carries `file:line` and a concrete input; holdout hygiene verified by counts only; docs that disagree with code reported
- Review focus (operator bound): pass-four code review of command surfacing. Read `review-brief-4.txt` first. Review the files whose area is `accuracy-runner` plus shared docs that describe them: the routing-accuracy capture, the transcript scorer, the offer attribution module and their tests. Check behaviour on claude, codex, opencode, pi, devin and dsh; whether a refusal, a question or a mention can still attach or start a mutating command; whether the transcript scorer counts a load, a followed step or an offer that did not happen (Codex exec bodies, rg and grep, heredocs, cd, partner-side commands, paired arms, Wilson ranges); holdout hygiene; docs that disagree with code.
- Resource map: `resource-map.md` not present; skipping coverage gate

---

## 2. TOPIC

Command surfacing behaviour for the routed skill/command advisor, restricted to the pass-four `accuracy-runner` area: the routing-accuracy capture and its committed baseline, the transcript scorer and its run-log summary, the command-offer attribution module, and the three vitest files that pin them.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- Not reviewing `scorer-attach`, `render-hooks-plugin` or `doctor-docs` area files except as read-only context when a cross-area contract is required
- Not fixing anything: the review is observation-only
- Not reading or printing holdout prompt text; holdout coverage is counts-only
- Not running repo tooling that writes outside the lineage; runners are audited by reading

---

## 5. STOP CONDITIONS

- Legal convergence (all dimensions covered plus stabilization) at or below `convergenceThreshold`
- `maxIterations=4` reached (`stopReason: maxIterationsReached`)
- Any active P0 blocks a PASS verdict but does not stop iteration dispatch by itself; the P0 override keeps `newFindingsRatio >= 0.50`

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED
- Reading the producer and its consumer together found the dead `offeredAs` field: `parseOffer`/`replayOffer` compute it, both writers drop it, and the scorer's partner branch reads it (iteration 1).
- Checking the heredoc filter against a delimiter outside its grammar found a body line that the new shell reader parses as a read (iteration 1).
- Asking which detector consumes the new shell-read capability found that `readDocument`/`takenLoop` do not, so a Codex shell read is a load but not a start or a loop (iteration 1).
- Reading the new fit branch against the silence tally found that the 24 decline rows are removed before `false_offer`, so the baseline's 8 carried commands cannot fail anything (iteration 2).
- Asking whether the holdout publication test reads the live capture or the committed file found that it reads only the baseline, and the live row comparison filters holdout ids out (iteration 2).
- Comparing the slice file's baseline comparisons with the new attached-metrics blocks found that the stage and fit counts are invariant-tested but never baseline-pinned (iteration 3).
- Treating the summary as one key space found that `unscored` is reserved but `paired` is not, and that `workflow.unscoredOnly` is never written (iteration 4).

---

## 9. WHAT FAILED
- Checking the offer field only in the parser and the scorer looked clean; only `rg` over every writer showed that no run line ever carries the new field (iteration 1).
- The backfill test's replay stub returns no `offeredAs`, so its "adds the offer" assertion could not catch the drop (iteration 1).
- Reading the slice test's holdout check by name looked sufficient; only tracing its `baseline` binding showed it never reads the live maps (iteration 2).
- The new stage tests look like a ratchet because they assert partitions and fixed totals; only tracing which object they read showed the baseline is never consulted (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`rg`/`grep` counted as a load.** Removed from `SHELL_READERS`; the shell reader also ignores a search's printed path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`rg`/`grep` counted as a load.** Removed from `SHELL_READERS`; the shell reader also ignores a search's printed path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`rg`/`grep` counted as a load.** Removed from `SHELL_READERS`; the shell reader also ignores a search's printed path.

### **A `--pair` comparison using a holdout row.** The comparison reads `pairRows`, which only holds scored non-holdout rows. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `--pair` comparison using a holdout row.** The comparison reads `pairRows`, which only holds scored non-holdout rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `--pair` comparison using a holdout row.** The comparison reads `pairRows`, which only holds scored non-holdout rows.

### **A `cd` that changes the folder for later commands.** The folder is carried across `&&`/`;` parts; the tests cover the quoted trailing-slash form. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `cd` that changes the folder for later commands.** The folder is carried across `&&`/`;` parts; the tests cover the quoted trailing-slash form.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `cd` that changes the folder for later commands.** The folder is carried across `&&`/`;` parts; the tests cover the quoted trailing-slash form.

### **A `COMMAND:` line naming another command.** `offerSeenIn` filters through `namesCommand`; the declined-other-command test holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `COMMAND:` line naming another command.** `offerSeenIn` filters through `namesCommand`; the declined-other-command test holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `COMMAND:` line naming another command.** `offerSeenIn` filters through `namesCommand`; the declined-other-command test holds.

### **A `spec_code` contradiction with a normative threshold.** The packet sets no numeric floor for these new counts; the defect is the missing ratchet, not a breached number. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A `spec_code` contradiction with a normative threshold.** The packet sets no numeric floor for these new counts; the defect is the missing ratchet, not a breached number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `spec_code` contradiction with a normative threshold.** The packet sets no numeric floor for these new counts; the defect is the missing ratchet, not a breached number.

### **A backfill executing code from an untrusted checkout.** `trustedCheckout` admits only the project root or an arena with the builder's marker; a run line without a checkout is refused with `no_checkout`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A backfill executing code from an untrusted checkout.** `trustedCheckout` admits only the project root or an arena with the builder's marker; a run line without a checkout is refused with `no_checkout`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A backfill executing code from an untrusted checkout.** `trustedCheckout` admits only the project root or an arena with the builder's marker; a run line without a checkout is refused with `no_checkout`.

### **A Codex body string that is not a command but names a document.** The every-string fallback only runs when no `cmd:` literal exists, and the test's list form is the intended shape; no real body in the area names a workflow document from a non-command string. Deferred as a hardening note, not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A Codex body string that is not a command but names a document.** The every-string fallback only runs when no `cmd:` literal exists, and the test's list form is the intended shape; no real body in the area names a workflow document from a non-command string. Deferred as a hardening note, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Codex body string that is not a command but names a document.** The every-string fallback only runs when no `cmd:` literal exists, and the test's list form is the intended shape; no real body in the area names a workflow document from a non-command string. Deferred as a hardening note, not a finding.

### **A fit row's prompt leaking through the duplicate error.** `assertFitRowsUnique` names the two row ids, never the prompt text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A fit row's prompt leaking through the duplicate error.** `assertFitRowsUnique` names the two row ids, never the prompt text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fit row's prompt leaking through the duplicate error.** `assertFitRowsUnique` names the two row ids, never the prompt text.

### **A holdout id in the baseline's stage/fit blocks.** Counts only; no row id appears. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A holdout id in the baseline's stage/fit blocks.** Counts only; no row id appears.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout id in the baseline's stage/fit blocks.** Counts only; no row id appears.

### **A holdout leak in this iteration.** The summary keys and the new findings name no holdout prompt; the fit and stage blocks stay counts-only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A holdout leak in this iteration.** The summary keys and the new findings name no holdout prompt; the fit and stage blocks stay counts-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout leak in this iteration.** The summary keys and the new findings name no holdout prompt; the fit and stage blocks stay counts-only.

### **A holdout prompt leak in the new fit/stage blocks.** The blocks carry counts and `byKind` totals only; the new slice test checks the `fit-` prefix against the live maps. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A holdout prompt leak in the new fit/stage blocks.** The blocks carry counts and `byKind` totals only; the new slice test checks the `fit-` prefix against the live maps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout prompt leak in the new fit/stage blocks.** The blocks carry counts and `byKind` totals only; the new slice test checks the `fit-` prefix against the live maps.

### **A holdout row reaching the scorer through `--summary`.** `scoreRun` returns before `loadSession`; the label map marks it. Re-checked after the pass-four changes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A holdout row reaching the scorer through `--summary`.** `scoreRun` returns before `loadSession`; the label map marks it. Re-checked after the pass-four changes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout row reaching the scorer through `--summary`.** `scoreRun` returns before `loadSession`; the label map marks it. Re-checked after the pass-four changes.

### **A new correctness or security finding in the summary key space.** The `paired` collision is a naming/reservation gap; the counts themselves are correct when the arm name is not reserved. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A new correctness or security finding in the summary key space.** The `paired` collision is a naming/reservation gap; the counts themselves are correct when the arm name is not reserved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new correctness or security finding in the summary key space.** The `paired` collision is a naming/reservation gap; the counts themselves are correct when the arm name is not reserved.

### **A pair block that includes a row only one arm scored.** `shared` is the intersection of the two arms' `pairRows`; the disjoint test gap is finding 2's converse, not a counting defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A pair block that includes a row only one arm scored.** `shared` is the intersection of the two arms' `pairRows`; the disjoint test gap is finding 2's converse, not a counting defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pair block that includes a row only one arm scored.** `shared` is the intersection of the two arms' `pairRows`; the disjoint test gap is finding 2's converse, not a counting defect.

### **A read after the first write still counted as followed.** `followedBeforeWrite` compares the event position to the boundary; the existing negative tests hold. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A read after the first write still counted as followed.** `followedBeforeWrite` compares the event position to the boundary; the existing negative tests hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A read after the first write still counted as followed.** `followedBeforeWrite` compares the event position to the boundary; the existing negative tests hold.

### **A README claim that the new stage/fit blocks publish a row.** They carry counts and kinds only; the fit test verifies no `fit-` id reaches the live row maps. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A README claim that the new stage/fit blocks publish a row.** They carry counts and kinds only; the fit test verifies no `fit-` id reaches the live row maps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A README claim that the new stage/fit blocks publish a row.** They carry counts and kinds only; the fit test verifies no `fit-` id reaches the live row maps.

### **A Wilson interval computed from the wrong denominator.** `followedRange` and `loadRange` use the same six path counts as the printed rates; the unit cases at the middle and both ends hold. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A Wilson interval computed from the wrong denominator.** `followedRange` and `loadRange` use the same six path counts as the printed rates; the unit cases at the middle and both ends hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Wilson interval computed from the wrong denominator.** `followedRange` and `loadRange` use the same six path counts as the printed rates; the unit cases at the middle and both ends hold.

### **The `noOwner` pair exclusion is a counting bug.** It is the documented `pairRows` rule; the README's wording is the iteration-3 finding, not a second defect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `noOwner` pair exclusion is a counting bug.** It is the documented `pairRows` rule; the README's wording is the iteration-3 finding, not a second defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `noOwner` pair exclusion is a counting bug.** It is the documented `pairRows` rule; the README's wording is the iteration-3 finding, not a second defect.

### **The iteration-1 P1 is stale.** Re-read `command-offer.mjs:486-499`; both writers still omit `offeredAs`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The iteration-1 P1 is stale.** Re-read `command-offer.mjs:486-499`; both writers still omit `offeredAs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The iteration-1 P1 is stale.** Re-read `command-offer.mjs:486-499`; both writers still omit `offeredAs`.

### **The iteration-2 P1 is stale.** Re-read `capture-command-routing-baseline.mjs:595-607,666-677` and the baseline's `fit.decline.carried: 8`; the rows still leave the false-offer tally. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The iteration-2 P1 is stale.** Re-read `capture-command-routing-baseline.mjs:595-607,666-677` and the baseline's `fit.decline.carried: 8`; the rows still leave the false-offer tally.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The iteration-2 P1 is stale.** Re-read `capture-command-routing-baseline.mjs:595-607,666-677` and the baseline's `fit.decline.carried: 8`; the rows still leave the false-offer tally.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Populated after each iteration]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (maintainability is the last configured dimension) - Focus area: terminal synthesis and the active-finding replay - Reason: the loop reaches `maxIterations=4` after this iteration; the next step is the synthesis report and the closeout event, not another dispatch. The two active P1s keep the verdict CONDITIONAL; the seven P2s are advisories. - Rotation status: all four dimensions covered; no new dimension remains - Required evidence: the findings registry, all four iteration files and deltas, and the reducer's final state - Recovery note: the run did not reach a legal graph-backed convergence; the stop reason is `maxIterationsReached`, and the report must say so. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

- Pass three closed at `0cdc9fa3ef`; HEAD is `400c90e158`; the area diff is six files, 2,392 insertions and 48 deletions
- The area's current state is the commit pair `4a622e419f` (fit rows, workflow block, offer `offeredAs`) and `a1c31b6f38` (Codex shell steps, heredoc/cd, partner offers)
- Baseline `command-routing-baseline.json` was captured at SHA `60968af043`, pinned date `2026-10-11`
- The pass-four scope is `review-scope-4.txt`; the holdout rule is counts only

---

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | The area is harness code, not a spec implementation |
| `checklist_evidence` | core | pending | - | The parent packet holds no checklist |
| `skill_agent` | overlay | notApplicable | - | No agent definition owns the area |
| `agent_cross_runtime` | overlay | pending | - | Six runtimes are named in the brief; live proof stays phase 007 |
| `feature_catalog_code` | overlay | pending | - | Check the README capability claims |
| `playbook_capability` | overlay | pending | - | Check the manual-testing playbook claims if reached |

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | - | - | - | pending |

---

## 16. REVIEW BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-4-1794669272137-9v23rz, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T15:20:00Z
