---
title: Deep Review Strategy - command mention pass twelve
description: Runtime strategy for the mention-12 lineage, tracking the commandOnlyMentioned wrapper, quote and alias guards and their invariance test.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - mention-12

## 1. OVERVIEW

### Purpose

Persistent state for the `mention-12` lineage of review pass twelve. It records which dimensions remain, what was found, which approaches worked, and where the next iteration focuses.

### Usage

- **Init:** populated from the review brief, the scope file and the commit range.
- **Per iteration:** read Next Focus, review the named area, record findings, mark dimensions, set the next focus.
- **Mutability:** updated in place by this lineage.

---

## 2. TOPIC

Review of the mention area for command surfacing pass twelve: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`. The area covers `commandOnlyMentioned`, which now drops a single quote that opens or closes a command name, keeps an apostrophe inside a word, and reads a retired command name beside the command it maps to, plus the wrapper invariance test that checks every mention fixture reads the same wrapped in code, quote or bold marks, or under the retired name, as plain.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Reviewing the merged area (`sk-doc/ROUTER.md`, `sk-doc/SKILL.md`, `sk-doc/graph-metadata.json`, the doctor install contract test) assigned to `merged-12`; read-only context only.
- Re-reporting the recorded limits in `review-brief-12.txt` unless a new input breaks them.
- Reviewing `typedCommandIn`'s retired-name mapping as new work beyond its interaction with the mention guard.
- Running the repository test suite, the build, or any git write; this lineage reports only.
- Opening the prompt corpora except through the allowed aggregate paths; the holdout rule stays in force.

---

## 5. STOP CONDITIONS

- Composite convergence stop at threshold 0.10 with all four dimensions covered.
- `maxIterations` 8 reached without a legal convergence stop.
- A blocking stop from `convergence.cjs` naming an uncovered dimension or an unresolved active P0.

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

- Init: read the brief, the scope file, the two scope files and the pass-ten/pass-eleven reports before choosing a focus; the prior reports name the single-quote and retired-name fixes this pass must test.
- Iteration 1: exercising the module's exported `commandOnlyMentioned` over the test's own `PLAIN_ROWS` instead of only reading the assertions. That drove the wrapper matrix through the real normalizer and lead tests, so the flip is reproduced rather than argued.
- Iteration 1: reading the occurrence scan and the lead tests separately. It showed the bracketed name is found and the lead is lost, which separated F001 (strip list) from F002 (occurrence boundary) instead of merging them.
- Iteration 2: comparing the two "is this command named" readers on the same wrapped prompt. The parenthesized form already worked, which proved the missing characters are confined to `COMMAND_START_BOUNDARY` rather than a general markup failure.
- Iteration 2: measuring the scan on large prompts (100 KB with one occurrence, 2,000 occurrences in 52 KB) instead of asserting a DoS; both are linear and cheap.
- Iteration 3: re-running the exact finding prompts from the final tree and comparing each delta's first line with its `iter-NNN.record.json`. The three findings reproduce, and the state log, registry and strategy agree on counts and coverage.

---

## 9. WHAT FAILED

- Init: none.
- Iteration 1: a first read treated the invariance test's "every fixture" comment as full coverage; it is full coverage of the six listed marks only. The wrapper set is the boundary, not the fixture list.
- Iteration 1: the `PLAIN_ROWS` omission of the or-list question, bare-lead, pronoun and later-clause rows looked like a separate coverage gap, but all those rows show 0 mismatches under the covered wrappers, so it was ruled out rather than reported.
- Iteration 2: the deep-loop half of F003 is masked whenever the prompt also carries depth wording, so the first probe (`**/deep:review** the diff with a thorough pass`) offered the command and had to be narrowed to a short typed request before the loss showed.
- Iteration 3: the final pass produced no new defect; the remaining open items are the three findings already recorded, so the stop decision is the only open question.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `escapePhrase` drift: the command names come from trusted tables and every metacharacter in them is escaped before the regex is built. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `escapePhrase` drift: the command names come from trusted tables and every metacharacter in them is escaped before the regex is built.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `escapePhrase` drift: the command names come from trusted tables and every metacharacter in them is escaped before the regex is built.

### A bypass that offers a mutating command from a prompt that never names a tracked command: the homoglyph, zero-width, fullwidth-slash and case variants do not match the tracked tables, so no route selects the command. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A bypass that offers a mutating command from a prompt that never names a tracked command: the homoglyph, zero-width, fullwidth-slash and case variants do not match the tracked tables, so no route selects the command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A bypass that offers a mutating command from a prompt that never names a tracked command: the homoglyph, zero-width, fullwidth-slash and case variants do not match the tracked tables, so no route selects the command.

### A distinct security finding: no prompt-controlled regex, no secret or filesystem surface, and no super-linear scan. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A distinct security finding: no prompt-controlled regex, no secret or filesystem surface, and no super-linear scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A distinct security finding: no prompt-controlled regex, no secret or filesystem surface, and no super-linear scan.

### A missing occurrence of a bracketed name: the scan finds the name inside `[...]`; only the lead fails. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A missing occurrence of a bracketed name: the scan finds the name inside `[...]`; only the lead fails.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing occurrence of a bracketed name: the scan finds the name inside `[...]`; only the lead fails.

### A new defect in the wrapper matrix beyond F001: the six covered wrappers still show 0 mismatches on every fixture row, and the uncovered pairs still fail only in the refusal/question direction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new defect in the wrapper matrix beyond F001: the six covered wrappers still show 0 mismatches on every fixture row, and the uncovered pairs still fail only in the refusal/question direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new defect in the wrapper matrix beyond F001: the six covered wrappers still show 0 mismatches on every fixture row, and the uncovered pairs still fail only in the refusal/question direction.

### A ReDoS or super-linear scan from prompt-controlled repetition (measured above). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A ReDoS or super-linear scan from prompt-controlled repetition (measured above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A ReDoS or super-linear scan from prompt-controlled repetition (measured above).

### A regression from the single-quote or retired-name fixes: both still behave as pass eleven recorded. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A regression from the single-quote or retired-name fixes: both still behave as pass eleven recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression from the single-quote or retired-name fixes: both still behave as pass eleven recorded.

### A regression in the path case beyond F002: the directory-segment form (`/create:readme/notes.txt`) fails the same way, so both path forms are one finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A regression in the path case beyond F002: the directory-segment form (`/create:readme/notes.txt`) fails the same way, so both path forms are one finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression in the path case beyond F002: the directory-segment form (`/create:readme/notes.txt`) fails the same way, so both path forms are one finding.

### A regression in the retired-name or single-quote behavior of the typed path: `typedCommandIn('/create:skill:auto')` still returns `/create:sk-skill`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A regression in the retired-name or single-quote behavior of the typed path: `typedCommandIn('/create:skill:auto')` still returns `/create:sk-skill`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression in the retired-name or single-quote behavior of the typed path: `typedCommandIn('/create:skill:auto')` still returns `/create:sk-skill`.

### A stale-line citation: every finding line was re-read at `05475f9d044`; the cited lines are unchanged. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A stale-line citation: every finding line was re-read at `05475f9d044`; the cited lines are unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale-line citation: every finding line was re-read at `05475f9d044`; the cited lines are unchanged.

### ReDoS in the lead patterns: a 2,025-character or-list prompt evaluates in 1.2 ms and a 2,425-character alternating list in 0.1 ms; the anchored alternation does not backtrack catastrophically at these sizes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: ReDoS in the lead patterns: a 2,025-character or-list prompt evaluates in 1.2 ms and a 2,425-character alternating list in 0.1 ms; the anchored alternation does not backtrack catastrophically at these sizes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS in the lead patterns: a 2,025-character or-list prompt evaluates in 1.2 ms and a 2,425-character alternating list in 0.1 ms; the anchored alternation does not backtrack catastrophically at these sizes.

### The test's omission of the or-list question, bare-lead, pronoun and later-clause rows from `PLAIN_ROWS`: all of those rows still show 0 mismatches under the six covered wrappers, so the omission is not hiding a second defect today. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The test's omission of the or-list question, bare-lead, pronoun and later-clause rows from `PLAIN_ROWS`: all of those rows still show 0 mismatches under the six covered wrappers, so the omission is not hiding a second defect today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The test's omission of the or-list question, bare-lead, pronoun and later-clause rows from `PLAIN_ROWS`: all of those rows still show 0 mismatches under the six covered wrappers, so the omission is not hiding a second defect today.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- ReDoS in the lead patterns: a 2,025-character or-list prompt evaluates in 1.2 ms and a 2,425-character alternating list in 0.1 ms (iteration 1).
- The invariance test's omission of the or-list question, bare-lead, pronoun and later-clause rows from `PLAIN_ROWS`: all those rows show 0 mismatches under the six covered wrappers (iteration 1).
- A broken single-quote or retired-name fix: both still read refusals, questions and requests as pass eleven recorded (iteration 1).
- A prompt-controlled regex or secret surface: the patterns are built from tracked tables and `escapePhrase`, and the module reads only its arguments (iteration 2).
- A DoS from prompt repetition: 100 KB with one occurrence takes 3.3 ms and 2,000 occurrences take 289 ms, linear in occurrences (iteration 2).
- A homoglyph, zero-width or fullwidth command form as a guard bypass: it does not name a tracked command, so no route selects the command (iteration 2).
- A new defect in the wrapper matrix beyond F001: the six covered wrappers still show 0 mismatches on every fixture row, and the uncovered pairs fail only in the refusal/question direction (iteration 3).
- A path case beyond F002: the directory-segment form fails the same way, so both path forms are one finding (iteration 3).
- A stale-line citation: every finding line was re-read at the final tree; the cited lines are unchanged (iteration 3).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: none; the stop decision is expected at this pass. - Reason: all four dimensions and all six protocols are covered and the three findings are re-verified; the only open items are advisories F002 and F003 plus the active P1 F001. - Rotation status: exhausted. - Blocked/productive carry-forward: the exported-function probe over concrete prompts for any follow-up pass. - Required evidence: the convergence script's stop decision recorded in the state log. - Recovery note: none.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `command-attach.ts` `commandOnlyMentioned` (line 424), `COMMAND_GAP_WORDS` (line 363), `RETIRED_COMMANDS` (line 217), `typedCommandIn` (line 221); `command-attach-guards.vitest.ts` `WRAPPERS` and `PLAIN_ROWS` (lines 175-197).
- Behavior claims: a prompt that names a command to refuse it or ask about it must not receive the command; markup around the name must not change that reading; a retired name reads as the command it maps to.
- Prior fixes: pass ten dropped a single quote that opens a command name; pass eleven dropped a closing quote and read the retired name in the mention check; AC-007 pins the wrapper matrix to backtick, straight and curly quote, bold, and the retired name.
- Consumers: `attachCommand` line 510 (hub routes), `lib/scorer/fusion.ts:1204-1215` (`withholdMentionedCommands`), `typedCommandForTop` line 256 via `handlers/advisor-recommend.ts:427`.
- Review risks: the wrapper matrix is defined by the normalizer, so a wrapper outside it is invisible to the test; the occurrence regex has a different boundary rule than `typedCommandIn`.
- Out of scope: the merged area, the scorer weights, and the broad routing accuracy suite; context only.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | The branch diff is the two scope files and does what pass eleven's report says; F001 and F002 are new defects outside AC-007's enumerated marks. |
| `checklist_evidence` | core | notApplicable | 3 | No packet checklist belongs to this review pass; 039 AC-007 was read as the wrapper contract and is met as written. |
| `skill_agent` | overlay | pass | 3 | No agent definition is in the diff. |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No runtime mirror is touched by the scope files. |
| `feature_catalog_code` | overlay | partial | 3 | The wrapper test pins the six listed marks; F001 names the class it cannot see, F002 the occurrence-boundary disagreement, and F003 the second wrapper implementation in the typed path. |
| `playbook_capability` | overlay | partial | 3 | No playbook scenario executed; the exported functions were re-run directly in the final pass. |

<!-- /ANCHOR:cross-reference-status -->
## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2, D3, D4 | 3 | 1 P1, 2 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1, D2, D3, D4 | 3 | 0 | complete |

---

<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-mention-12-1794856957949-n58dw7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T19:34:48Z

<!-- /ANCHOR:review-boundaries -->
