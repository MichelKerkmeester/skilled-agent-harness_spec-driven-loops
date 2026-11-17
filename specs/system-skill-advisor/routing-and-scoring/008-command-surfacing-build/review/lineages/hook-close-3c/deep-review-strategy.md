---
title: Deep Review Strategy - hook-close-3c
---

# Deep Review Strategy - hook-close-3c

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder; review scope is the final state of the two source files and two test files listed in `review/review-scope-3c.txt`).
- Lineage: `hook-close-3c`, session `fanout-hook-close-3c-1794596804847-827gze`, generation 1, lineage mode `new`.
- Operator focus: PASS THREE closing round. The doctor hook check is reviewed first and the no-edit gate second. The two settled decisions are not re-reported: the "make no changes" safe reading, and the hook check being a wiring heuristic rather than a node or shell parser.
- Dimensions: correctness, security, traceability, maintainability.
- Success criteria: every finding carries file:line and a concrete input the executor ran; no finding rests on inference alone; a clean result is stated plainly.

## 2. TOPIC

Final-state review of the doctor hook wiring check and the shared no-edit predicate after commits `860610d783` and `846eab66b8`.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No code changes: the review target is read-only.
- No re-litigation of the two settled decisions (the "make no changes" safe reading and the wiring-heuristic scope).
- No holdout prompt text: `holdout-prompts.jsonl` is never opened.
- No repository tooling beyond the two named single test files and the hook check CLI.

## 5. STOP CONDITIONS

- `maxIterations` = 3 or convergence (`newFindingsRatio` below 0.10) at the end of an iteration, whichever comes first.
- A confirmed active P0 stops the verdict at FAIL regardless of convergence.
- Three consecutive iteration errors would stop the loop; none are expected.

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
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A caller compensates for the miss" — ruled out by reading all four call sites; every one delegates to the same predicate and returns the failing branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A caller compensates for the miss" — ruled out by reading all four call sites; every one delegates to the same predicate and returns the failing branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A caller compensates for the miss" — ruled out by reading all four call sites; every one delegates to the same predicate and returns the failing branch.

### "A test that cannot fail" — none found; the two new negative rows and the `--json` assertions change outcome if the matcher changes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "A test that cannot fail" — none found; the two new negative rows and the `--json` assertions change outcome if the matcher changes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A test that cannot fail" — none found; the two new negative rows and the `--json` assertions change outcome if the matcher changes.

### "Re-report the `make no changes` reading" — not reported; it is settled decision 1 and the probe confirms it works as decided. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Re-report the `make no changes` reading" — not reported; it is settled decision 1 and the probe confirms it works as decided.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Re-report the `make no changes` reading" — not reported; it is settled decision 1 and the probe confirms it works as decided.

### "Settled decision 2 inputs (`node -rc <marker>`, `node --eval"1" <marker>`)" — not re-reported; they are the wiring heuristic's documented carve-out (already recorded as P2 in the prior confirming round). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Settled decision 2 inputs (`node -rc <marker>`, `node --eval"1" <marker>`)" — not re-reported; they are the wiring heuristic's documented carve-out (already recorded as P2 in the prior confirming round).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Settled decision 2 inputs (`node -rc <marker>`, `node --eval"1" <marker>`)" — not re-reported; they are the wiring heuristic's documented carve-out (already recorded as P2 in the prior confirming round).

### "The `860610d783` flag-name fix regresses a spaced flag" — ruled out: `--require ./preload.cjs`, `-r ./preload.cjs` and `-C development` still report `ok`; the new branch only changes long flags read by name and short clusters. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The `860610d783` flag-name fix regresses a spaced flag" — ruled out: `--require ./preload.cjs`, `-r ./preload.cjs` and `-C development` still report `ok`; the new branch only changes long flags read by name and short clusters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `860610d783` flag-name fix regresses a spaced flag" — ruled out: `--require ./preload.cjs`, `-r ./preload.cjs` and `-C development` still report `ok`; the new branch only changes long flags read by name and short clusters.

### "The check crashes or hangs on malformed input" — ruled out by reading every loop in `readWords`/`simpleCommands`/`runsMarker` and by the CLI's exit-2 path for a bad argument; no unbounded loop or undefined dereference exists (`scriptWord` cannot return `undefined` because of its `index < rest.length - 1` guard). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The check crashes or hangs on malformed input" — ruled out by reading every loop in `readWords`/`simpleCommands`/`runsMarker` and by the CLI's exit-2 path for a bad argument; no unbounded loop or undefined dereference exists (`scriptWord` cannot return `undefined` because of its `index < rest.length - 1` guard).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The check crashes or hangs on malformed input" — ruled out by reading every loop in `readWords`/`simpleCommands`/`runsMarker` and by the CLI's exit-2 path for a bad argument; no unbounded loop or undefined dereference exists (`scriptWord` cannot return `undefined` because of its `index < rest.length - 1` guard).

### "The pattern is stateful across calls" — ruled out: the literal has no `g`/`y` flag; `isNoEditRequest` constructs no new state. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The pattern is stateful across calls" — ruled out: the literal has no `g`/`y` flag; `isNoEditRequest` constructs no new state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The pattern is stateful across calls" — ruled out: the literal has no `g`/`y` flag; `isNoEditRequest` constructs no new state.

### "The typed-command path hides the miss" — not applicable: a typed command is the user's own ask and is delivered by `typedCommandForTop`, not by this gate; the finding is about the hub-command path the gate protects. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The typed-command path hides the miss" — not applicable: a typed command is the user's own ask and is delivered by `typedCommandForTop`, not by this gate; the finding is about the hub-command path the gate protects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The typed-command path hides the miss" — not applicable: a typed command is the user's own ask and is delivered by `typedCommandForTop`, not by this gate; the finding is about the hub-command path the gate protects.

### **A doc that claims the contracted `make changes` form is covered.** Searched the three doc surfaces that mention the gate; none names the contracted form, so the gap is a code gap (`HC3-P1-001`), not a doc/code contradiction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A doc that claims the contracted `make changes` form is covered.** Searched the three doc surfaces that mention the gate; none names the contracted form, so the gap is a code gap (`HC3-P1-001`), not a doc/code contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doc that claims the contracted `make changes` form is covered.** Searched the three doc surfaces that mention the gate; none names the contracted form, so the gap is a code gap (`HC3-P1-001`), not a doc/code contradiction.

### **A vacuous assertion in the generated-table test.** `tests/command-attach-guards.vitest.ts:137-147` reads the interface block and the README sentence and fails if a field is missing or the sentence omits one; it changes outcome with either artifact, so it is not vacuous. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A vacuous assertion in the generated-table test.** `tests/command-attach-guards.vitest.ts:137-147` reads the interface block and the README sentence and fails if a field is missing or the sentence omits one; it changes outcome with either artifact, so it is not vacuous.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A vacuous assertion in the generated-table test.** `tests/command-attach-guards.vitest.ts:137-147` reads the interface block and the README sentence and fails if a field is missing or the sentence omits one; it changes outcome with either artifact, so it is not vacuous.

### **Reporting the stale phase-014 limitations as a P2.** Ruled out: phase summaries record their own close-out state, phase 017 supersedes the list with the current limitations, and neither statement describes the code the two commits under review changed. Evidence and the drift are recorded under Edge Cases so the operator can still see it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reporting the stale phase-014 limitations as a P2.** Ruled out: phase summaries record their own close-out state, phase 017 supersedes the list with the current limitations, and neither statement describes the code the two commits under review changed. Evidence and the drift are recorded under Edge Cases so the operator can still see it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reporting the stale phase-014 limitations as a P2.** Ruled out: phase summaries record their own close-out state, phase 017 supersedes the list with the current limitations, and neither statement describes the code the two commits under review changed. Evidence and the drift are recorded under Edge Cases so the operator can still see it.

### **The `sh` hook case missing from the test table.** Recorded as a known limitation at `017/implementation-summary.md:176`; not a defect the closing round can treat as new. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `sh` hook case missing from the test table.** Recorded as a known limitation at `017/implementation-summary.md:176`; not a defect the closing round can treat as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `sh` hook case missing from the test table.** Recorded as a known limitation at `017/implementation-summary.md:176`; not a defect the closing round can treat as new.

### `agent_cross_runtime` — **not applicable**. Neither changed file is an agent definition or a runtime mirror; the changed surfaces are a script and a runtime library module, and no `.claude/agents/*` mirror describes them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` — **not applicable**. Neither changed file is an agent definition or a runtime mirror; the changed surfaces are a script and a runtime library module, and no `.claude/agents/*` mirror describes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` — **not applicable**. Neither changed file is an agent definition or a runtime mirror; the changed surfaces are a script and a runtime library module, and no `.claude/agents/*` mirror describes them.

### `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).

### `checklist_evidence` — **not applicable**. No `checklist.md` in the target packet. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` — **not applicable**. No `checklist.md` in the target packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **not applicable**. No `checklist.md` in the target packet.

### `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; nothing to reconcile. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; nothing to reconcile.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; nothing to reconcile.

### `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; the review target is the final source state, not a checklist row. Recorded rather than silently passed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; the review target is the final source state, not a checklist row. Recorded rather than silently passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; the review target is the final source state, not a checklist row. Recorded rather than silently passed.

### `feature_catalog_code` — **pass**. `feature-catalog/scorer-fusion/command-meaning-matching.md:36` says a prompt matching `NO_EDIT_REQUEST`, "such as 'no edits', 'do not change', 'just show' or 'just list'", rules out every command on meaning and that `readOnlyRouteAllowed` reads the same pattern. Every listed example is a literal alternative in the pattern, and `fusion.ts:677` reads the same predicate; no drift. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` — **pass**. `feature-catalog/scorer-fusion/command-meaning-matching.md:36` says a prompt matching `NO_EDIT_REQUEST`, "such as 'no edits', 'do not change', 'just show' or 'just list'", rules out every command on meaning and that `readOnlyRouteAllowed` reads the same pattern. Every listed example is a literal alternative in the pattern, and `fusion.ts:677` reads the same predicate; no drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — **pass**. `feature-catalog/scorer-fusion/command-meaning-matching.md:36` says a prompt matching `NO_EDIT_REQUEST`, "such as 'no edits', 'do not change', 'just show' or 'just list'", rules out every command on meaning and that `readOnlyRouteAllowed` reads the same pattern. Every listed example is a literal alternative in the pattern, and `fusion.ts:677` reads the same predicate; no drift.

### `feature_catalog_code`, `agent_cross_runtime`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`, `agent_cross_runtime`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`, `agent_cross_runtime`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).

### `playbook_capability` — **not applicable**. The advisor manual-testing playbook has no scenario for the no-edit gate or the hook-wiring check (content search over the playbook returned no row). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability` — **not applicable**. The advisor manual-testing playbook has no scenario for the no-edit gate or the hook-wiring check (content search over the playbook returned no row).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — **not applicable**. The advisor manual-testing playbook has no scenario for the no-edit gate or the hook-wiring check (content search over the playbook returned no row).

### `skill_agent` — **pass**. `attachCommand` is the delivery path and `COMMAND_ROWS` records `/create:agent` as `policy: 'start'`, `mutating: 'mutates'` (`command-attach.ts:66`), so the miss is an offer of a mutating command, not a read-only one. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` — **pass**. `attachCommand` is the delivery path and `COMMAND_ROWS` records `/create:agent` as `policy: 'start'`, `mutating: 'mutates'` (`command-attach.ts:66`), so the miss is an offer of a mutating command, not a read-only one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — **pass**. `attachCommand` is the delivery path and `COMMAND_ROWS` records `/create:agent` as `policy: 'start'`, `mutating: 'mutates'` (`command-attach.ts:66`), so the miss is an offer of a mutating command, not a read-only one.

### `skill_agent` — **pass**. The attach gate and the three scorer/explainer call sites were read at their lines in iteration 2, and the doctor YAML consumers at `doctor-setup.yaml:40,61` and `doctor-symlink-check.yaml:37,60` in iteration 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` — **pass**. The attach gate and the three scorer/explainer call sites were read at their lines in iteration 2, and the doctor YAML consumers at `doctor-setup.yaml:40,61` and `doctor-symlink-check.yaml:37,60` in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — **pass**. The attach gate and the three scorer/explainer call sites were read at their lines in iteration 2, and the doctor YAML consumers at `doctor-setup.yaml:40,61` and `doctor-symlink-check.yaml:37,60` in iteration 1.

### `skill_agent` — **pass**. The command surface that consumes this check was read, not inferred: `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` invoke `hook-wiring-check.cjs --root` and map exit 1 to DEGRADED/WARN, so a false `hook-missing` line becomes an operator-visible repair instruction. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` — **pass**. The command surface that consumes this check was read, not inferred: `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` invoke `hook-wiring-check.cjs --root` and map exit 1 to DEGRADED/WARN, so a false `hook-missing` line becomes an operator-visible repair instruction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — **pass**. The command surface that consumes this check was read, not inferred: `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` invoke `hook-wiring-check.cjs --root` and map exit 1 to DEGRADED/WARN, so a false `hook-missing` line becomes an operator-visible repair instruction.

### `spec_code` — **partial**. Commit `846eab66b8` claims: "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings." Verified for the literal phrase: the test table at `tests/command-attach-guards.vitest.ts:80-85` pins `show me the plan and make no changes to the files` and `refactor the parser and make no changes to its public api` as `true`, and both return `true` in the probe. The claim does not extend to the contracted form, which the table does not contain; that gap is the finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` — **partial**. Commit `846eab66b8` claims: "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings." Verified for the literal phrase: the test table at `tests/command-attach-guards.vitest.ts:80-85` pins `show me the plan and make no changes to the files` and `refactor the parser and make no changes to its public api` as `true`, and both return `true` in the probe. The claim does not extend to the contracted form, which the table does not contain; that gap is the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **partial**. Commit `846eab66b8` claims: "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings." Verified for the literal phrase: the test table at `tests/command-attach-guards.vitest.ts:80-85` pins `show me the plan and make no changes to the files` and `refactor the parser and make no changes to its public api` as `true`, and both return `true` in the probe. The claim does not extend to the contracted form, which the table does not contain; that gap is the finding.

### `spec_code` — **partial**. Commit `860610d783` claims: "It now reads the flag name first, so those commands report a missing hook." Verified: `node -e1 <marker>`, `node --eval=1 <marker>` and `node --print=1 <marker>` each print `hook-missing claude` and exit 1, while `node -r./preload.cjs <marker>`, `node -r ./preload.cjs <marker>` and `node --require ./preload.cjs <marker>` print `ok claude`. The stated mechanism (`nodeFlagSkipsScript` at `:231-237`) is what runs. The partial status is the incomplete value-taking flag table recorded as finding 1, not a failure of the stated fix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` — **partial**. Commit `860610d783` claims: "It now reads the flag name first, so those commands report a missing hook." Verified: `node -e1 <marker>`, `node --eval=1 <marker>` and `node --print=1 <marker>` each print `hook-missing claude` and exit 1, while `node -r./preload.cjs <marker>`, `node -r ./preload.cjs <marker>` and `node --require ./preload.cjs <marker>` print `ok claude`. The stated mechanism (`nodeFlagSkipsScript` at `:231-237`) is what runs. The partial status is the incomplete value-taking flag table recorded as finding 1, not a failure of the stated fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **partial**. Commit `860610d783` claims: "It now reads the flag name first, so those commands report a missing hook." Verified: `node -e1 <marker>`, `node --eval=1 <marker>` and `node --print=1 <marker>` each print `hook-missing claude` and exit 1, while `node -r./preload.cjs <marker>`, `node -r ./preload.cjs <marker>` and `node --require ./preload.cjs <marker>` print `ok claude`. The stated mechanism (`nodeFlagSkipsScript` at `:231-237`) is what runs. The partial status is the incomplete value-taking flag table recorded as finding 1, not a failure of the stated fix.

### `spec_code` — **pass**. Commit `860610d783` claims "It now reads the flag name first": verified by probes (`node -e1 <marker>` → `hook-missing`, `node -r./preload.cjs <marker>` → `ok`). Commit `846eab66b8` claims "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings": the two rows at `tests/command-attach-guards.vitest.ts:80-85` both return `true` in the real module, and the five scope/attach rows in that file return the values the file pins (`probes/noedit-tests-probe.mjs`). Packet `017-review-pass-two-remediation/acceptance-criteria.md:56` claims four no-edit wordings; `NOEDIT4` at `tests/command-attach-guards.vitest.ts:30-35` is exactly those four, and all four return `true`. AC-027 at `:82` claims seven wrapper launches plus a quoted `echo`; the probe run in iteration 1 produced `ok` for the wrapper shapes and `hook-missing` for the quoted echo. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` — **pass**. Commit `860610d783` claims "It now reads the flag name first": verified by probes (`node -e1 <marker>` → `hook-missing`, `node -r./preload.cjs <marker>` → `ok`). Commit `846eab66b8` claims "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings": the two rows at `tests/command-attach-guards.vitest.ts:80-85` both return `true` in the real module, and the five scope/attach rows in that file return the values the file pins (`probes/noedit-tests-probe.mjs`). Packet `017-review-pass-two-remediation/acceptance-criteria.md:56` claims four no-edit wordings; `NOEDIT4` at `tests/command-attach-guards.vitest.ts:30-35` is exactly those four, and all four return `true`. AC-027 at `:82` claims seven wrapper launches plus a quoted `echo`; the probe run in iteration 1 produced `ok` for the wrapper shapes and `hook-missing` for the quoted echo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — **pass**. Commit `860610d783` claims "It now reads the flag name first": verified by probes (`node -e1 <marker>` → `hook-missing`, `node -r./preload.cjs <marker>` → `ok`). Commit `846eab66b8` claims "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings": the two rows at `tests/command-attach-guards.vitest.ts:80-85` both return `true` in the real module, and the five scope/attach rows in that file return the values the file pins (`probes/noedit-tests-probe.mjs`). Packet `017-review-pass-two-remediation/acceptance-criteria.md:56` claims four no-edit wordings; `NOEDIT4` at `tests/command-attach-guards.vitest.ts:30-35` is exactly those four, and all four return `true`. AC-027 at `:82` claims seven wrapper launches plus a quoted `echo`; the probe run in iteration 1 produced `ok` for the wrapper shapes and `hook-missing` for the quoted echo.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: synthesis. - Reason: correctness (iteration 1), security (iteration 2), traceability and maintainability (this iteration) are covered; iteration 3 adds no new finding, so `newFindingsRatio` is 0 and the loop converges at the iteration cap. - Rotation status: all four dimensions covered. - Blocked/productive carry-forward: no blocked approach; the active P1 and two P2s are carried to synthesis unchanged. - Required evidence: the reconciliation of the registry, the three iteration files and the review report at synthesis.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

- Prior pass-three confirming rounds (`hook-confirm-3b`, `noedit-confirm-3b`) found: an attached evaluation flag misread as a launch, a "make no changes to" regression, and a pre-existing false-`ok` for `node -` / bad short clusters. The first two are fixed by the two commits under review; the third is a recorded P2.
- Recorded active P2 from pass two: `SA2-P2-002` (NO_EDIT_REQUEST vocabulary narrower than the no-edit intent).
- `holdout-prompts.jsonl` is out of bounds and was not opened.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` | - | - | - | pending |
| `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-hook-close-3c-1794596804847-827gze, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T19:19:03.103Z
<!-- MACHINE-OWNED: END -->
