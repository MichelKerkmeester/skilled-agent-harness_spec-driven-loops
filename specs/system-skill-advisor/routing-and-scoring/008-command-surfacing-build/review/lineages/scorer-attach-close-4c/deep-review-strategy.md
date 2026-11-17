---
title: Deep Review Strategy - scorer-attach-close-4c lineage
description: Runtime strategy tracking the closing round of review pass four for the scorer-attach fan-out lineage.
version: 1.11.14.0
---

# Deep Review Strategy - scorer-attach-close-4c lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human
commentary and operator overrides live outside those markers.

---

## 2. TOPIC

Closing round of review pass four of
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` in the
`scorer-attach` area, over the fix commit range `48f03b5013..868b185e76`.

Scope: the `scorer-attach` rows of `review/review-scope-4c.txt` — `command-attach.ts` and
`command-attach-guards.vitest.ts` — and the shared docs that describe them. The
`accuracy-runner` row (the routing-accuracy `README.md`) belongs to the sibling lineage and is
read here only as doc context. The round confirms the fixes for SAC4B-P1-001 and SAC4B-P2-001
and for the verified findings in `review/verify-4/report.md`, and looks for defects the fixes
added. A finding that report rejects, or records as an accepted limit, is not re-raised without
a new input that breaks it.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The accuracy-runner harness, its run-log writers and session readers are the sibling
  lineage's code scope; this lineage checks only that its own scorer surface agrees with them.
- Hook, plugin, render and doctor-command code is outside both scope rows.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold.
- Cap: `maxIterations` 3; the terminal record must carry `stopReason: maxIterationsReached`.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

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
- P1 (Required): 1
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Importing the real `command-attach.ts` through Node's type stripping and probing the predicate, `attachCommand` and `typedCommandForTop` in one run separated the fixed single-word rows from the failing two-word row (iteration 1).
- Running the advisor CLI on the same prompts turned the predicate result into a user-visible row list, which confirmed the fix and the remaining hole without touching the corpus (iteration 1).
- Comparing each spec sentence against a `git show` of the prior commit located the stale line pointer and the stale scope text in one pass (iteration 2).
- Reading the repeated group as a token+`or` sequence gave a bounded-backtracking argument without needing a timing run (iteration 3).

---

## 9. WHAT FAILED

- Reading the diff alone would have missed the multi-word item: the constant looks complete until it is probed with a `/doctor:` command (iteration 1).
- Extrapolating from the three REQ-001 refusals to "every command the list joins" is unsound; the reachable vocabulary decides (iteration 1).
- Reading the spec's Out-of-Scope line as current scope would have hidden that T029 had already implemented the question carry; the tasks file is the newer record (iteration 2).
- Trusting the reducer's managed strategy blocks as a faithful summary: it lists traceability bullets under Exhausted Approaches, so the block needs a hand tidy at synthesis (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A changelog entry is missing**: T029's scope and the phase's Out-of-Scope line assign release notes to phase 025, so no entry is expected here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A changelog entry is missing**: T029's scope and the phase's Out-of-Scope line assign release notes to phase 025, so no entry is expected here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A changelog entry is missing**: T029's scope and the phase's Out-of-Scope line assign release notes to phase 025, so no entry is expected here.

### **A comment-hygiene violation in the added lines**: no path, task, ADR or finding id appears in the changed comments. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A comment-hygiene violation in the added lines**: no path, task, ADR or finding id appears in the changed comments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A comment-hygiene violation in the added lines**: no path, task, ADR or finding id appears in the changed comments.

### **A hub-level regression test is missing for the article and question forms**: `attachCommand` consults only `commandOnlyMentioned` for a mention, and that predicate is pinned per form; the existing `offers no hub command for %s` row exercises the same branch, so a second row would add no distinct failure mode. Recorded as coverage commentary, not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A hub-level regression test is missing for the article and question forms**: `attachCommand` consults only `commandOnlyMentioned` for a mention, and that predicate is pinned per form; the existing `offers no hub command for %s` row exercises the same branch, so a second row would add no distinct failure mode. Recorded as coverage commentary, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hub-level regression test is missing for the article and question forms**: `attachCommand` consults only `commandOnlyMentioned` for a mention, and that predicate is pinned per form; the existing `offers no hub command for %s` row exercises the same branch, so a second row would add no distinct failure mode. Recorded as coverage commentary, not a finding.

### **A maintainability finding in the duplicated insertions**: the four uses share one constant, so there is no copy to drift. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A maintainability finding in the duplicated insertions**: the four uses share one constant, so there is no copy to drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A maintainability finding in the duplicated insertions**: the four uses share one constant, so there is no copy to drift.

### **A new behaviour supplied to the reader**: the iteration-1 request probes kept their commands, so the change withholds commands only on refusals and questions. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A new behaviour supplied to the reader**: the iteration-1 request probes kept their commands, so the change withholds commands only on refusals and questions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new behaviour supplied to the reader**: the iteration-1 request probes kept their commands, so the change withholds commands only on refusals and questions.

### **A ReDoS-class denial of service in the new group**: every iteration consumes a command token and the literal `or`; the outer loop is bounded by the number of `or` occurrences, and no nested unbounded quantifier overlaps. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A ReDoS-class denial of service in the new group**: every iteration consumes a command token and the literal `or`; the outer loop is bounded by the number of `or` occurrences, and no nested unbounded quantifier overlaps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A ReDoS-class denial of service in the new group**: every iteration consumes a command token and the literal `or`; the outer loop is bounded by the number of `or` occurrences, and no nested unbounded quantifier overlaps.

### **Prompt-driven regex injection**: the command name is escaped and the leads are constants; no prompt text is concatenated into a pattern unescaped. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Prompt-driven regex injection**: the command name is escaped and the leads are constants; no prompt text is concatenated into a pattern unescaped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt-driven regex injection**: the command name is escaped and the leads are constants; no prompt text is concatenated into a pattern unescaped.

### **The article allowance breaks an existing question row**: `Is the /doctor:update command safe?` and the sentence-start bare-ask rows still read as questions, because the added group matches zero iterations when no `or` is present. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The article allowance breaks an existing question row**: `Is the /doctor:update command safe?` and the sentence-start bare-ask rows still read as questions, because the added group matches zero iterations when no `or` is present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The article allowance breaks an existing question row**: `Is the /doctor:update command safe?` and the sentence-start bare-ask rows still read as questions, because the added group matches zero iterations when no `or` is present.

### **The capture corpus is involved**: no prompt file was opened this iteration; only code, packet docs and the CLI were read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The capture corpus is involved**: no prompt file was opened this iteration; only code, packet docs and the CLI were read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The capture corpus is involved**: no prompt file was opened this iteration; only code, packet docs and the CLI were read.

### **The change is not what ships**: the ignored build output at `runtime/dist/runtime/lib/command-attach.js` holds the same constant and the three insertions, so the local CLI path carries the fix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The change is not what ships**: the ignored build output at `runtime/dist/runtime/lib/command-attach.js` holds the same constant and the three insertions, so the local CLI path carries the fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The change is not what ships**: the ignored build output at `runtime/dist/runtime/lib/command-attach.js` holds the same constant and the three insertions, so the local CLI path carries the fix.

### **The fix over-suppresses requests**: probed seven request shapes (with and without the article, `the next step is`, a later unled clause); all kept their command. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The fix over-suppresses requests**: probed seven request shapes (with and without the article, `the next step is`, a later unled clause); all kept their command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The fix over-suppresses requests**: probed seven request shapes (with and without the article, `the next step is`, a later unled clause); all kept their command.

### **The holdout corpus is involved**: no prompt file was opened; only code, packet docs and the CLI were read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The holdout corpus is involved**: no prompt file was opened; only code, packet docs and the CLI were read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The holdout corpus is involved**: no prompt file was opened; only code, packet docs and the CLI were read.

### **The README's four-field sentences are wrong**: they match `backfillRunLog`/`offerLineFields` behaviour as read, and the row belongs to the sibling lineage; not re-raised. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The README's four-field sentences are wrong**: they match `backfillRunLog`/`offerLineFields` behaviour as read, and the row belongs to the sibling lineage; not re-raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README's four-field sentences are wrong**: they match `backfillRunLog`/`offerLineFields` behaviour as read, and the row belongs to the sibling lineage; not re-raised.

### **The stale `:405` pointer alone**: too low-value to raise separately; carried inside finding 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The stale `:405` pointer alone**: too low-value to raise separately; carried inside finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The stale `:405` pointer alone**: too low-value to raise separately; carried inside finding 1.

### **The test count is short**: 9 added rows matches T028's 5 plus T029's 4; the added `it.each` tables account for every one. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The test count is short**: 9 added rows matches T028's 5 plus T029's 4; the added `it.each` tables account for every one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The test count is short**: 9 added rows matches T028's 5 plus T029's 4; the added `it.each` tables account for every one.

### `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are `[x]` and their evidence matches the code, diff and test rows exactly. AC-001 and AC-006 read `Unmet`, which AC-011 (`acceptance-criteria.md:66`) makes expected until this confirming round closes; not drift. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are `[x]` and their evidence matches the code, diff and test rows exactly. AC-001 and AC-006 read `Unmet`, which AC-011 (`acceptance-criteria.md:66`) makes expected until this confirming round closes; not drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are `[x]` and their evidence matches the code, diff and test rows exactly. AC-001 and AC-006 read `Unmet`, which AC-011 (`acceptance-criteria.md:66`) makes expected until this confirming round closes; not drift.

### `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are marked `[x]` with verifier evidence that matches the code and tests. Their AC rows (AC-001, AC-006) still read `Unmet`, which is expected mid-round because AC-011 requires this confirming round before closeout, so this is not drift by itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are marked `[x]` with verifier evidence that matches the code and tests. Their AC rows (AC-001, AC-006) still read `Unmet`, which is expected mid-round because AC-011 requires this confirming round before closeout, so this is not drift by itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are marked `[x]` with verifier evidence that matches the code and tests. Their AC rows (AC-001, AC-006) still read `Unmet`, which is expected mid-round because AC-011 requires this confirming round before closeout, so this is not drift by itself.

### `feature_catalog_code`: **not run this iteration** (reserved for iteration 2). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: **not run this iteration** (reserved for iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: **not run this iteration** (reserved for iteration 2).

### `feature_catalog_code`: **pass**. `advisor-recommend.md:33` describes `attachCommand`'s route/selection/table conditions and the deep-loop depth gate, and makes no claim about refusals or or-lists, so the fix leaves it accurate. `command-meaning-matching.md:44,65` and the README's scoring rows do not describe the mention grammar either; no sentence there contradicts the code. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: **pass**. `advisor-recommend.md:33` describes `attachCommand`'s route/selection/table conditions and the deep-loop depth gate, and makes no claim about refusals or or-lists, so the fix leaves it accurate. `command-meaning-matching.md:44,65` and the README's scoring rows do not describe the mention grammar either; no sentence there contradicts the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: **pass**. `advisor-recommend.md:33` describes `attachCommand`'s route/selection/table conditions and the deep-loop depth gate, and makes no claim about refusals or or-lists, so the fix leaves it accurate. `command-meaning-matching.md:44,65` and the README's scoring rows do not describe the mention grammar either; no sentence there contradicts the code.

### `skill_agent`, `agent_cross_runtime`, `playbook_capability`: **notApplicable** for this lineage's scope. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `playbook_capability`: **notApplicable** for this lineage's scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `playbook_capability`: **notApplicable** for this lineage's scope.

### `spec_code`: **partial**. Every code claim in the brief's check list that iteration 1 could execute holds except the two-word item (SAC4C-P1-001). The written alignment fails in one direction: the phase spec's scope text and REQ-001 lag the implemented question carry (finding 1). Implementation evidence is authoritative, so this is recorded as a documentation defect, not as a behaviour failure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: **partial**. Every code claim in the brief's check list that iteration 1 could execute holds except the two-word item (SAC4C-P1-001). The written alignment fails in one direction: the phase spec's scope text and REQ-001 lag the implemented question carry (finding 1). Implementation evidence is authoritative, so this is recorded as a documentation defect, not as a behaviour failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial**. Every code claim in the brief's check list that iteration 1 could execute holds except the two-word item (SAC4C-P1-001). The written alignment fails in one direction: the phase spec's scope text and REQ-001 lag the implemented question carry (finding 1). Implementation evidence is authoritative, so this is recorded as a documentation defect, not as a behaviour failure.

### `spec_code`: **partial**. REQ-001 (`spec.md:279`) names three or-list refusals; all three carry no command at the CLI, and both commands of `use A or B` keep theirs. The generalized contract in the code comment (`command-attach.ts:376-379`, "every command the list joins") is not met for the two-word rows, so the requirement's intent is met only for the asserted single-word corpus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: **partial**. REQ-001 (`spec.md:279`) names three or-list refusals; all three carry no command at the CLI, and both commands of `use A or B` keep theirs. The generalized contract in the code comment (`command-attach.ts:376-379`, "every command the list joins") is not met for the two-word rows, so the requirement's intent is met only for the asserted single-word corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial**. REQ-001 (`spec.md:279`) names three or-list refusals; all three carry no command at the CLI, and both commands of `use A or B` keep theirs. The generalized contract in the code comment (`command-attach.ts:376-379`, "every command the list joins") is not met for the two-word rows, so the requirement's intent is met only for the asserted single-word corpus.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- The fix over-suppresses requests: seven probed request shapes kept their command (iteration 1, evidence: tmp/probe-or-list.mjs and the CLI rows).
- The article allowance breaks an existing question row: rows without an `or` match zero iterations of the added group (iteration 1, evidence: command-attach-guards.vitest.ts:185-198).
- The shipped build lacks the fix: the ignored dist copy holds the same constant and three insertions (iteration 1, evidence: runtime/dist/runtime/lib/command-attach.js:331,375-386).
- A missing hub-level row hides a distinct failure: attachCommand's only mention branch is the pinned predicate (iteration 2, evidence: command-attach.ts:492).
- A changelog entry is missing: release notes belong to phase 025 (iteration 2, evidence: 027 spec Out of Scope).
- Prompt-driven regex injection or catastrophic backtracking: the name is escaped, the leads are constants, and each repeated iteration consumes a token plus `or` (iteration 3, evidence: command-attach.ts:376-380,418).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining (all four dimensions covered; synthesis complete).
- Focus area: the merged verdict carries SAC4C-P1-001 and SAC4C-P2-001; the terminal stop reason is `maxIterationsReached` and the release-readiness state is `in-progress`.
- Reason: the iteration cap is reached and no dimension is uncovered.
- Rotation status: correctness, traceability, maintainability and the security cross-reference complete.
- Blocked/productive carry-forward: nothing blocked; the P1 and P2 stay open for the merge.
- Required evidence: `deep-review-findings-registry.json`, the three iteration files and `review-report.md`.
- Recovery note: none.

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (module under review), `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (its unit tests).
- Behavior claims: a refusal or a question over an or-list carries no command; a request over an or-list keeps its command; the article `the` and the word `command` may appear on a listed item; the command after the last `or` may carry `the`.
- Findings to confirm: SAC4B-P1-001 (a refusal over `A or the B command` kept B), SAC4B-P2-001 (a question over an or-list kept its second command).
- Prior report: `review/verify-4/report.md` — 3 P1 and 15 P2 confirmed, 3 rejected. Rejected and accepted-limit findings are not re-raised without a new input.
- Commands that attach a command live in `MODE_COMMANDS` (`sk-design`, `sk-doc`, `system-deep-loop`); multi-word commands exist only under `/doctor:` and are typed-command rows.
- Conventions: comment explains the grammar it guards; every new rule carries a test row.
- Out-of-scope areas: the run-log writers (`command-offer.mjs`, `run-command-behaviour.mjs`) and the accuracy runner belong to the sibling lineage.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | REQ-001's three refusals pass at the CLI; the spec's Out-of-Scope line and A3 lag the implemented question carry (SAC4C-P2-001) |
| `checklist_evidence` | core | partial | 2 | T028 and T029 are `[x]` with matching verifier evidence; AC-001 and AC-006 stay `Unmet` until this round closes (AC-011), which is expected |
| `skill_agent` | overlay | notApplicable | 0 | no agent surface in this lineage's scope |
| `agent_cross_runtime` | overlay | notApplicable | 0 | no runtime mirror in this lineage's scope |
| `feature_catalog_code` | overlay | pass | 2 | advisor-recommend.md:33 describes attachCommand accurately and makes no or-list claim; no skill doc contradicts the code |
| `playbook_capability` | overlay | notApplicable | 0 | no playbook surface in this lineage's scope |

<!-- /ANCHOR:cross-reference-status -->

---

<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | [D1, D3] | [2] | [0 P0, 1 P1, 0 P2] | [partial: grammar confirmed, two-word item open] |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | [D1, D3] | [2] | [0 P0, 0 P1, 0 P2] | [partial: added rows match T028/T029] |

<!-- /ANCHOR:files-under-review -->

---

## 16. REVIEW BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-attach-close-4c-1794682797954-pcdanq, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T20:05:00Z
