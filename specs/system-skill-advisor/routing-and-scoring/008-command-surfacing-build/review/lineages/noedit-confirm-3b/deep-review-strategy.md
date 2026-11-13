# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent review state for the noedit-confirm-3b fan-out lineage. Pass three confirming round over commit `860610d783`, which fixed the two findings of review pass three. This lineage owns the no-edit gate fix first and deepest and checks the doctor hook check once.

### Review Charter

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder), reviewed through the two source files commit `860610d783` changed under `.skilled`.
- Dimensions: correctness, security, traceability, maintainability.
- Stop conditions: convergence (weighted new-finding ratio under 0.10) or `maxIterations=3`.
- Success criteria: each of the two fixes judged by a concrete input run through the code, the callers of `isNoEditRequest` covered, and every finding carrying `file:line` plus the input and output observed.
- Write surface: this lineage directory only. No code changes, no repo tooling that writes outside it.

---

## 2. TOPIC

Command surfacing review pass three confirming round: the `NO_EDIT_REQUEST` pattern and `isNoEditRequest` in `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` with its callers `lib/scorer/text.ts` and `lib/scorer/fusion.ts`; and the node-flag reader (`readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`) in `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the pass-three findings `DR3-P1-001` and `AR3-P2-001` themselves; this round judges the fixes.
- Reworking the whole advisor scorer or the whole doctor check.
- Reading holdout prompt text. Only a numstat proof is permitted.
- Changing code, running builds, the full suite, a daemon or a model CLI.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` under 0.10 with every dimension covered.
- `maxIterations=3` reached.
- A hard gate failure in the append gateway (exit 2) or a containment breach. Both halt the lineage.

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
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the check's trust boundary before judging the commit's claim: it showed a settings command is never executed and nothing is written, so no security surface moved (iteration 3).
- Driving the doctor check as a process against fixture checkouts instead of reading the flag tables: it pinned all seventeen verdicts to printed output and exit codes (iteration 2).
- Running the same prompt through `isNoEditRequest`, `attachCommand` and `commandMeaningEligible` in one probe: it showed the same boolean moving all four gates at once (iteration 1).
- Comparing the bare phrase with its object form in one probe pair (`make no changes` versus `make no changes to the tests`): it made the mirror regression unambiguous (iteration 1).
- Reading the two added tests before judging the fix: it showed the suite has no genuine case with an object, so the regression cannot fail anything (iteration 1).

---

## 9. WHAT FAILED
- Treating the commit message's full-suite figure as evidence: the focus forbids the full suite, so it stayed an unverified assertion (iteration 3).
- Reading the flag-name split as complete: a shell merges a quoted value into the flag word, so the long form still escapes (iteration 2).
- Treating the pass-three case list as proof the class is closed: the guard deletes the phrase for real no-edit requests and only covers one separator (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A `lastIndex` defect from the new lookahead: ruled out by reading the literal at `command-attach.ts:289`; it has no `g` or `y` flag. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `lastIndex` defect from the new lookahead: ruled out by reading the literal at `command-attach.ts:289`; it has no `g` or `y` flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `lastIndex` defect from the new lookahead: ruled out by reading the literal at `command-attach.ts:289`; it has no `g` or `y` flag.

### A caller that bypasses the helper and reads the raw pattern: ruled out by `rg` over the runtime; the only non-test readers are the helper itself and its four call sites. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A caller that bypasses the helper and reads the raw pattern: ruled out by `rg` over the runtime; the only non-test readers are the helper itself and its four call sites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A caller that bypasses the helper and reads the raw pattern: ruled out by `rg` over the runtime; the only non-test readers are the helper itself and its four call sites.

### A command-injection path through a hook settings file: the check reads JSON and prints lines; there is no `spawn`, `exec` or write in the module. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A command-injection path through a hook settings file: the check reads JSON and prints lines; there is no `spawn`, `exec` or write in the module.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A command-injection path through a hook settings file: the check reads JSON and prints lines; there is no `spawn`, `exec` or write in the module.

### A gate that reads `NO_EDIT_REQUEST` directly and so escapes the helper: ruled out in iteration 1 by `rg` over the runtime. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A gate that reads `NO_EDIT_REQUEST` directly and so escapes the helper: ruled out in iteration 1 by `rg` over the runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A gate that reads `NO_EDIT_REQUEST` directly and so escapes the helper: ruled out in iteration 1 by `rg` over the runtime.

### A holdout leak in this commit: the numstat lists four source and test files plus two scratch files, and neither prompt file. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A holdout leak in this commit: the numstat lists four source and test files plus two scratch files, and neither prompt file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A holdout leak in this commit: the numstat lists four source and test files plus two scratch files, and neither prompt file.

### A loop that consumes the script word as a flag argument: ruled out by reading `runsNodeOnMarker:273-279`; only `NODE_FLAGS_WITH_ARGUMENT` advances by two, and none of those names is in the skip set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A loop that consumes the script word as a flag argument: ruled out by reading `runsNodeOnMarker:273-279`; only `NODE_FLAGS_WITH_ARGUMENT` advances by two, and none of those names is in the skip set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A loop that consumes the script word as a flag argument: ruled out by reading `runsNodeOnMarker:273-279`; only `NODE_FLAGS_WITH_ARGUMENT` advances by two, and none of those names is in the skip set.

### A non-launch newly reported `ok`: ruled out for the attached short forms and for the `=`-attached long forms; the one remaining window is the P2 above and predates the commit. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A non-launch newly reported `ok`: ruled out for the attached short forms and for the `=`-attached long forms; the one remaining window is the P2 above and predates the commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A non-launch newly reported `ok`: ruled out for the attached short forms and for the `=`-attached long forms; the one remaining window is the P2 above and predates the commit.

### A regression in the `-r`/`-C` attached preload path: ruled out in iteration 2; both print `ok` and the loop advances past them correctly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A regression in the `-r`/`-C` attached preload path: ruled out in iteration 2; both print `ok` and the loop advances past them correctly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression in the `-r`/`-C` attached preload path: ruled out in iteration 2; both print `ok` and the loop advances past them correctly.

### A working command newly reported `hook-missing`: ruled out for the ten forms above, including the attached preload the commit adds a test for. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A working command newly reported `hook-missing`: ruled out for the ten forms above, including the attached preload the commit adds a test for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A working command newly reported `hook-missing`: ruled out for the ten forms above, including the attached preload the commit adds a test for.

### An apostrophe-folding regression: ruled out because the fold at `command-attach.ts:294` is unchanged and `Don\u2019t touch any files` still returns `true` in the suite run above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: An apostrophe-folding regression: ruled out because the fold at `command-attach.ts:294` is unchanged and `Don\u2019t touch any files` still returns `true` in the suite run above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An apostrophe-folding regression: ruled out because the fold at `command-attach.ts:294` is unchanged and `Don\u2019t touch any files` still returns `true` in the suite run above.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: correctness, security, traceability and maintainability each have a pass, and the third iteration adds no new defect. - Rotation status: complete. - Blocked/productive carry-forward: `NE3-P1-001` is active and keeps the verdict CONDITIONAL; `NE3-P2-002` and `NE3-P2-003` are advisories. - Required evidence: the findings registry totals, the three iteration verdicts, and the synthesis report. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-295` (`NO_EDIT_REQUEST`, `isNoEditRequest`), callers `lib/scorer/text.ts:150`, `lib/scorer/fusion.ts:677`, `lib/scorer/fusion.ts:881`, hub attach `lib/command-attach.ts:335`; doctor check `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:205-308`.
- Behavior claims: commit `860610d783` says the flag reader now reads the flag name first, and the no-edit pattern now keeps a change request that says what to leave alone.
- Reuse and conventions: one shared pattern serves every no-edit gate; the hook check reads shell words and never writes.
- Review risks and gaps: `steer.md` is absent at init, so no lead ruling applied; `resource-map.md` is absent so its coverage gate is skipped.
- Holdout hygiene: no holdout file is opened; only `git diff --numstat` may be read for a count.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Both fixes present at the cited lines; behavior gaps recorded as NE3-P1-001, NE3-P2-002 and NE3-P2-003. |
| `checklist_evidence` | core | pass | 3 | vitest `command-attach-guards.vitest.ts` 26 passed; `node --test hook-wiring-check.test.cjs` 32 passed, 0 failed; each added case fails if its fix is reverted. |
| `skill_agent` | overlay | notApplicable | - | No agent file in the changed set. |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent file in the changed set. |
| `feature_catalog_code` | overlay | notApplicable | - | No catalog page in the changed set. |
| `playbook_capability` | overlay | notApplicable | - | No playbook in the changed set. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | D1, D2, D3, D4 | 3 | 0 P0, 1 P1, 1 P2 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | D1, D3 | 3 | 0 | complete |
| .skilled/commands/doctor/scripts/hook-wiring-check.cjs | D1, D2, D3, D4 | 3 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs | D1, D3 | 3 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-noedit-confirm-3b-1794595021404-69frey, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T18:40:25Z
<!-- MACHINE-OWNED: END -->
