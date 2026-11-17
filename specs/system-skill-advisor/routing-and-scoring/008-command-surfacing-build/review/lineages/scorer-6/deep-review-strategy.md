# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the pass-six `scorer-6` review lineage. The lineage reviews the transcript scorer, its vitest file and the routing-accuracy README only: the heredoc redirect fix, the start shape split and the rule that a document read with no checkout write is a lookup. Every finding is P0/P1/P2 with file:line and a concrete input.

### Usage

- Init wrote the topic, dimensions, known context and boundaries below.
- Each iteration reads Next Focus, reviews one dimension, updates the running counts and sets the next focus.
- Mutability: mutable, updated by each iteration. Machine-owned blocks are between explicit markers.

---

## 2. TOPIC

Pass-six code review of the command-surfacing transcript scorer: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `runtime/tests/command-transcript-score.vitest.ts` and `runtime/scripts/routing-accuracy/README.md`. Net diff `git -c core.fsmonitor=false diff ddb12a6852c 85550ee946e` covers phase 034 (heredoc redirect fix), the empty-heredoc end-line fix, phase 035 (start shapes) and phase 036 (a read alone is a lookup). Review target is the spec folder `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The `arena-config` and `merge-docs` areas other lineages own in pass six.
- The runner, advisor, arena builder, row files and run logs; only the scorer and its own docs are in scope.
- Any code change. The lineage reports findings only.
- Holdout prompt text: never read, printed or quoted, at any point.
- Re-reporting the recorded limits unless a new input breaks them.

---

## 5. STOP CONDITIONS

- Convergence at `convergenceThreshold` 0.1 or `maxIterations` 3, whichever comes first.
- A P0 finding halts the PASS claim but not the iteration loop.
- Any write outside `review/lineages/scorer-6/` stops the lineage.

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

- Init read the brief, the scope file, the fan-out config and the packet's phase 034/035/036 specs before choosing a focus.
- Importing the scorer directly and running one `node --input-type=module -e` probe over crafted records turned both heredoc claims into observed event lists, without opening a prompt file or running `--summary` (iteration 1).
- Reading `firstWritePosition` beside `writePaths` and `insideCheckout` isolated the unnamed-write boundary in one pass instead of a hunt through the tally (iteration 1).
- Grepping every `process.stdout.write` line in one call proved the scorer's output surface carries ids, codes and counts only, which settled the holdout question without opening a corpus row (iteration 2).
- Reading the AC's cited `scratch/` files instead of re-running the score checked the checklist evidence at the level the brief allows (iteration 2).
- Comparing `scoreRun`'s `@returns` union against the object it builds and the field `addScored` reads found the one contract the change left behind (iteration 3).

---

## 9. WHAT FAILED

- Treating the new `HEREDOC_BODY` as a complete heredoc parser: its opening-line group still swallows a second delimiter, so a two-heredoc line leaves the second body scannable (iteration 1).
- Assuming an unnamed write is dropped before the boundary: `writePaths` keeps it as `[null]` and `firstWritePosition` reads it as inside the checkout (iteration 1).
- Expecting the README to have dropped its old `cat` sentence when phase 036 added the new rule: both sentences sit in the same row, and the shell-step test comment keeps the old claim too (iteration 2).
- Expecting `scoreRun`'s declared return type to carry the field the branch added: the union predates `startShape` and still omits it (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `readDocument` counting a `cat` of the document with a redirect as a shell read: normalize emits a write event instead of a shell event for a redirecting command, which the registry already records as "A shell read counts as a workflow load but not as a start or a loop". -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `readDocument` counting a `cat` of the document with a redirect as a shell read: normalize emits a write event instead of a shell event for a redirecting command, which the registry already records as "A shell read counts as a workflow load but not as a start or a loop".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `readDocument` counting a `cat` of the document with a redirect as a shell read: normalize emits a write event instead of a shell event for a redirecting command, which the registry already records as "A shell read counts as a workflow load but not as a start or a loop".

### `startShape`'s skill/reported/expanded precedence changing a count: all four starting shapes add to `started`, so the order changes only which label a start carries. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `startShape`'s skill/reported/expanded precedence changing a count: all four starting shapes add to `started`, so the order changes only which label a start carries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `startShape`'s skill/reported/expanded precedence changing a count: all four starting shapes add to `started`, so the order changes only which label a start carries.

### A `$'EOF'` ANSI-C-quoted delimiter leaving its body in the scan: already recorded as an open P2 in the packet registry ("A heredoc whose delimiter is not a bare identifier is read as commands"), so not re-reported; pass six fixed only the backslash form. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `$'EOF'` ANSI-C-quoted delimiter leaving its body in the scan: already recorded as an open P2 in the packet registry ("A heredoc whose delimiter is not a bare identifier is read as commands"), so not re-reported; pass six fixed only the backslash form.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `$'EOF'` ANSI-C-quoted delimiter leaving its body in the scan: already recorded as an open P2 in the packet registry ("A heredoc whose delimiter is not a bare identifier is read as commands"), so not re-reported; pass six fixed only the backslash form.

### A `SKILL_ADVISOR_FRESH_PROMPTS_PATH` redirect of a holdout row as a security hole: only the scoped test sets it, and a holdout row still needs a plain row with the same id in that file to be scored; recorded as ruled out rather than as a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A `SKILL_ADVISOR_FRESH_PROMPTS_PATH` redirect of a holdout row as a security hole: only the scoped test sets it, and a holdout row still needs a plain row with the same id in that file to be scored; recorded as ruled out rather than as a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `SKILL_ADVISOR_FRESH_PROMPTS_PATH` redirect of a holdout row as a security hole: only the scoped test sets it, and a holdout row still needs a plain row with the same id in that file to be scored; recorded as ruled out rather than as a finding.

### A holdout row id in `unscoredRuns` as a leak: ids are committed in the corpus, and the reason carries no prompt. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A holdout row id in `unscoredRuns` as a leak: ids are committed in the corpus, and the reason carries no prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A holdout row id in `unscoredRuns` as a leak: ids are committed in the corpus, and the reason carries no prompt.

### A write outside the checkout defeating the read-alone rule when `projectDir` is present: the vitest case at `command-transcript-score.vitest.ts:1520` pins it and the probe agrees. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A write outside the checkout defeating the read-alone rule when `projectDir` is present: the vitest case at `command-transcript-score.vitest.ts:1520` pins it and the probe agrees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A write outside the checkout defeating the read-alone rule when `projectDir` is present: the vitest case at `command-transcript-score.vitest.ts:1520` pins it and the probe agrees.

### Calling the summary assertion `shapes.reduce(...) === 1` weak: its comment says it pins that the capped row adds no shape, and the same test's `startRate` assertion pins the started count, so it is fit for its stated purpose. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Calling the summary assertion `shapes.reduce(...) === 1` weak: its comment says it pins that the capped row adds no shape, and the same test's `startRate` assertion pins the started count, so it is fit for its stated purpose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the summary assertion `shapes.reduce(...) === 1` weak: its comment says it pins that the capped row adds no shape, and the same test's `startRate` assertion pins the started count, so it is fit for its stated purpose.

### Raising the duplicated start rule (`startShape` versus `startedCommand`'s skill/report/expand/boundary sequence) as a finding: the two agree today, the comment in `readDocument` names both, and two instances do not justify a shared helper under the repository's restraint rule. Recorded as a follow-on risk, not a finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Raising the duplicated start rule (`startShape` versus `startedCommand`'s skill/report/expand/boundary sequence) as a finding: the two agree today, the comment in `readDocument` names both, and two instances do not justify a shared helper under the repository's restraint rule. Recorded as a follow-on risk, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the duplicated start rule (`startShape` versus `startedCommand`'s skill/report/expand/boundary sequence) as a finding: the two agree today, the comment in `readDocument` names both, and two instances do not justify a shared helper under the repository's restraint rule. Recorded as a follow-on risk, not a finding.

### Raising the missing shared shape-key constant twice (in `newTally` and in `startShape`'s literals): folded into the finding above as its fix rather than counted again. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Raising the missing shared shape-key constant twice (in `newTally` and in `startShape`'s literals): folded into the finding above as its fix rather than counted again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the missing shared shape-key constant twice (in `newTally` and in `startShape`'s literals): folded into the finding above as its fix rather than counted again.

### The scorer writing anything to disk: it has no filesystem write call; all of its writes are stdout. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The scorer writing anything to disk: it has no filesystem write call; all of its writes are stdout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The scorer writing anything to disk: it has no filesystem write call; all of its writes are stdout.

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
- Dimension: none; all four dimensions are covered and this is the third of three permitted iterations. - Focus area: synthesis. - Reason: `maxIterations` is reached; the remaining findings are four P2 advisories. - Rotation status: swept. - Required evidence: none outstanding. - Run verdict for this lineage: PASS with advisories (4 active P2, 0 P1, 0 P0). Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `score-command-transcripts.mjs` (about 2700 lines; exports `normalize`, `startState`, `startedCommand`, `insideCheckout`, `commandLines`, `loopInit` for direct tests), `command-transcript-score.vitest.ts` (about 3500 lines), `routing-accuracy/README.md` (scorer row at line 135, start rule at line 115).
- Behaviour claims to verify: `redirectTargets` strips heredoc bodies before it scans for `>`; an empty heredoc body ends at its own end line and a backslash-quoted end word is honoured; `startState` returns a shape and counts a read alone as `readOnly`; `startShapes` sums to `started` over uncapped start rows; `startRate`, `startedOfOffered` and `byPolicy.started` all read the same `started` fact.
- Reuse and conventions: `firstWritePosition(events, checkoutDir)` is the single write-boundary helper; `insideCheckout` treats a relative path as inside and a `/tmp`, `/var/folders` or `~` path as outside; `writePaths` keeps a write whose target the record never names as `[null]`; `documentTails` matches a command document by path tail.
- Review risks and gaps: the packet registry holds 164 prior findings, so deduplication against `deep-review-findings-registry.json` is mandatory; the brief forbids `--summary`, so numeric rescore claims cannot be re-verified; holdout prompt text must never be read or printed.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1, 2, 3 | Phase 036 REQ-004 maps to `startState`'s shape return and its cases; REQ-001 holds by construction. Numeric restatement not re-scored: the brief forbids `--summary`. |
| `checklist_evidence` | core | pass | 2, 3 | 036 `scratch/restate.txt`, `restate-sets.txt` and `after.txt` carry the counts AC-001, AC-003 and AC-004 name, including the mutation check. |
| `skill_agent` | overlay | notApplicable | 3 | No skill file names the scorer. |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No agent definition or runtime mirror names the scorer. |
| `feature_catalog_code` | overlay | notApplicable | 3 | The scorer is a measurement script with no catalog row. |
| `playbook_capability` | overlay | notApplicable | 3 | No playbook capability names the scorer. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | correctness, security, traceability, maintainability | 3 | 0 P0, 0 P1, 3 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | correctness, traceability | 3 | 0 P0, 0 P1, 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | correctness, traceability | 3 | 0 P0, 0 P1, 1 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-6-1794815529929-dybl7p, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T08:07:33Z
<!-- MACHINE-OWNED: END -->
