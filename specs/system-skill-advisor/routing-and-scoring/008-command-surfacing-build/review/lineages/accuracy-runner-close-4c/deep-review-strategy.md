---
title: Deep Review Strategy - accuracy-runner-close-4c lineage
description: Runtime strategy tracking the closing review of pass-four fixes in the accuracy-runner area of command surfacing.
version: 1.11.14.0
---

# Deep Review Strategy - accuracy-runner-close-4c lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership anchors. Human
commentary and operator overrides live outside those anchors.

---

## 2. TOPIC

Closing round of review pass four of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
in the `accuracy-runner` area. The changed accuracy-runner path in `review/review-scope-4c.txt`
is the routing-accuracy `README.md`; the brief's checks also name the run-log writers, the
transcript scorer, the Codex reader and the holdout guard as verification surfaces. The change
range is `48f03b5013..868b185e76`.

The operator focus is the closing brief: read `review-brief-4c.txt` first; confirm that a refusal
over an or-list, with or without the article and the word command, and a question over an or-list
carry no command while a request over a list keeps its command; that both run-log writers keep
`offeredAs`; that a shell read of a command document counts as a start while a search, an in-place
`sed`, a redirect and a heredoc line do not; that a heredoc end word with a hyphen or a dot closes
correctly; that the Codex reader opens the resolved file; that the holdout guard reads the live
capture; and that docs agree with code. Holdout prompt text is never read or printed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The mention reader in `lib/command-attach.ts`, the scorer fusion, the recommend handler and the
  feature docs belong to the `scorer-attach-close-4c` lineage. This lineage reads them only as
  context evidence and raises no finding against them.
- The deferred pair-doc sentence, the reserved `paired` arm name and the `unscoredOnly` field are
  phase 026 work per `027-review-pass-four-remediation/spec.md`; they are not re-reported here.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.
- No runtime command, build, test run or generator is executed; every claim is grounded in a
  direct file read of the fixed tree.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold with no active P0.
- Cap: `maxIterations` 2.
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
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Reading both writers against the one consumer closed the `offeredAs` question without a run: the
  backfill at `command-offer.mjs:496`, the live helper at `run-command-behaviour.mjs:824` and its
  call at `:1203` all carry the field, and the head-moved early return is the only documented
  exception. (iteration 1)
- Following a shell target from `shellReadTargets` into `readDocument` exposed the `2>`/`&>`
  redirect gap: the parser's redirect flag is set only for a word starting with `>`. (iteration 1)
- Reading the Codex containment branch and the holdout test side by side confirmed both security
  fixes: `codex.mjs:169` opens `storePath`, and `command-routing-slice.vitest.ts:206-210` checks
  the live capture. (iteration 1)
- Comparing the T009 test table with the brief's redirect input showed the redirect row was never
  in the table, which is why the green suite did not catch the `2>` form. (iteration 1)
- Reading the `offeredAs` field list, the backfill branch and the scorer's `offerOf` together
  showed that "a stored run line holds no `offeredAs`" is a legacy statement the writers made
  false. (iteration 2)
- Comparing the runner row's `[--brief-only]` clause with the brief-only branch at
  `command-offer.mjs:489-490` exposed the four-field promise the mode does not keep; the
  paragraph at `README.md:85` already states the correct behavior. (iteration 2)
- Re-running the T030 string checks (`three fields`, `carries none of the four`, the four-field
  list) confirmed the 4b fixes before the semantic sentences were read. (iteration 2)

---

## 9. WHAT FAILED

- The T009 test table never covers a redirect, so its "a redirect does not count" clause is
  asserted by the brief and the code comment but not by a case. The `2>`/`&>` gap survived the
  phase's green suite because no row exercises it. (iteration 1)
- No review approach failed; the code-side pass produced one P2 edge and confirmed the other four
  checks by direct read. (iteration 1)
- The 4b pass checked the three/four count and the head-moved line but not the two older
  `offeredAs` sentences, so the stored-line statement and the `[--brief-only]` clause survived
  into this round. (iteration 2)
- The cap is reached at ratio 0.6667, so no legal convergence stop is available; the lineage
  closes on maxIterationsReached with three P2 advisories. (iteration 2)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`offeredAs` is still dropped by a writer.** Ruled out: the backfill writes it at -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`offeredAs` is still dropped by a writer.** Ruled out: the backfill writes it at
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`offeredAs` is still dropped by a writer.** Ruled out: the backfill writes it at

### **A hyphen or dot heredoc end word is read as a command.** Ruled out: -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A hyphen or dot heredoc end word is read as a command.** Ruled out:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hyphen or dot heredoc end word is read as a command.** Ruled out:

### **A refusal or question over an or-list carries a command.** Ruled out in the sibling area by -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A refusal or question over an or-list carries a command.** Ruled out in the sibling area by
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refusal or question over an or-list carries a command.** Ruled out in the sibling area by

### A stored run line can still carry `offeredAs` -- PRODUCTIVE (iteration 2)
- What worked: reading the fixed writers against `README.md:123`; the current line keeps the field, so the stale sentence was raised as `ARC4C-P2-002`.
- Prefer for: legacy-versus-current line semantics in the routing-accuracy doc.

### **The Codex reader still opens the caller's link.** Ruled out: `codex.mjs:169` reads -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The Codex reader still opens the caller's link.** Ruled out: `codex.mjs:169` reads
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Codex reader still opens the caller's link.** Ruled out: `codex.mjs:169` reads

### **The holdout guard still checks only the committed baseline.** Ruled out: -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The holdout guard still checks only the committed baseline.** Ruled out:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The holdout guard still checks only the committed baseline.** Ruled out:

### **The output sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The output sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The output sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.

### **The pair-doc shared-row limit is a new finding.** Ruled out: `027` spec:214 defers the pair -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The pair-doc shared-row limit is a new finding.** Ruled out: `027` spec:214 defers the pair
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pair-doc shared-row limit is a new finding.** Ruled out: `027` spec:214 defers the pair

### **The redirect edge is a P1.** Ruled out: the false start needs a `2>` or `&>` target that names -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The redirect edge is a P1.** Ruled out: the false start needs a `2>` or `&>` target that names
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The redirect edge is a P1.** Ruled out: the false start needs a `2>` or `&>` target that names

### **The T030 edits are incomplete.** Ruled out: the three exact strings are present, and the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The T030 edits are incomplete.** Ruled out: the three exact strings are present, and the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The T030 edits are incomplete.** Ruled out: the three exact strings are present, and the

### **The top field list still says three fields.** Ruled out: `README.md:65-70` names four, -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The top field list still says three fields.** Ruled out: `README.md:65-70` names four,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The top field list still says three fields.** Ruled out: `README.md:65-70` names four,

### `agent_cross_runtime` -- notApplicable. No runtime branch in the changed doc; the Codex reader is covered by the iteration-1 check. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` -- notApplicable. No runtime branch in the changed doc; the Codex reader is covered by the iteration-1 check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- notApplicable. No runtime branch in the changed doc; the Codex reader is covered by the iteration-1 check.

### `agent_cross_runtime` -- notApplicable. The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime` -- notApplicable. The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- notApplicable. The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly.

### `checklist_evidence` -- partial. AC-003's four inputs (`cat`, `rg`, in-place `sed`, heredoc) read as the task describes, and `CHK-040`'s offeredAs claim is met by both writers. The brief's redirect input is not in AC-003's table, and the `2>` form is the remaining gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` -- partial. AC-003's four inputs (`cat`, `rg`, in-place `sed`, heredoc) read as the task describes, and `CHK-040`'s offeredAs claim is met by both writers. The brief's redirect input is not in AC-003's table, and the `2>` form is the remaining gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- partial. AC-003's four inputs (`cat`, `rg`, in-place `sed`, heredoc) read as the task describes, and `CHK-040`'s offeredAs claim is met by both writers. The brief's redirect input is not in AC-003's table, and the `2>` form is the remaining gap.

### `checklist_evidence` -- partial. AC-010 asks the docs to name the behaviour the code has; the T030 sentences do, but `:123` and the `[--brief-only]` clause at `:125` do not. `CHK-040`'s offeredAs field-list claim is met by both lists. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` -- partial. AC-010 asks the docs to name the behaviour the code has; the T030 sentences do, but `:123` and the `[--brief-only]` clause at `:125` do not. `CHK-040`'s offeredAs field-list claim is met by both lists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- partial. AC-010 asks the docs to name the behaviour the code has; the T030 sentences do, but `:123` and the `[--brief-only]` clause at `:125` do not. `CHK-040`'s offeredAs field-list claim is met by both lists.

### `feature_catalog_code` -- notApplicable. No feature-catalog page describes the changed accuracy-runner lines. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `feature_catalog_code` -- notApplicable. No feature-catalog page describes the changed accuracy-runner lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- notApplicable. No feature-catalog page describes the changed accuracy-runner lines.

### `playbook_capability` -- notApplicable. No playbook surface changed. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `playbook_capability` -- notApplicable. No playbook surface changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` -- notApplicable. No playbook surface changed.

### `skill_agent` -- notApplicable. No agent definition changed in this area. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `skill_agent` -- notApplicable. No agent definition changed in this area.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` -- notApplicable. No agent definition changed in this area.

### `spec_code` -- partial. Phase 027 T006, T007, T008, T009, T010, T011 and T030 are marked `[x]` with evidence. Reading the fixed files confirms the offeredAs writers, the heredoc end word, the shell-read start, the Codex resolved read and the live holdout guard. T009's redirect claim is only met for a bare `>`; `2>` and `&>` remain counted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` -- partial. Phase 027 T006, T007, T008, T009, T010, T011 and T030 are marked `[x]` with evidence. Reading the fixed files confirms the offeredAs writers, the heredoc end word, the shell-read start, the Codex resolved read and the live holdout guard. T009's redirect claim is only met for a bare `>`; `2>` and `&>` remain counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. Phase 027 T006, T007, T008, T009, T010, T011 and T030 are marked `[x]` with evidence. Reading the fixed files confirms the offeredAs writers, the heredoc end word, the shell-read start, the Codex resolved read and the live holdout guard. T009's redirect claim is only met for a bare `>`; `2>` and `&>` remain counted.

### `spec_code` -- partial. T030 fixed the two 4b list counts and added the head-moved sentence; `README.md:70` matches `run-command-behaviour.mjs:1180-1184`, `:76` says four fields and `:125` lists `offeredAs`. The two sentences above remain the only doc-code drift. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` -- partial. T030 fixed the two 4b list counts and added the head-moved sentence; `README.md:70` matches `run-command-behaviour.mjs:1180-1184`, `:76` says four fields and `:125` lists `offeredAs`. The two sentences above remain the only doc-code drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. T030 fixed the two 4b list counts and added the head-moved sentence; `README.md:70` matches `run-command-behaviour.mjs:1180-1184`, `:76` says four fields and `:125` lists `offeredAs`. The two sentences above remain the only doc-code drift.

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

- **`offeredAs` is still dropped by a writer.** Ruled out: `command-offer.mjs:496` and
  `run-command-behaviour.mjs:1203` keep it; the head-moved line is the documented exception.
- **A hyphen or dot heredoc end word is read as a command.** Ruled out:
  `score-command-transcripts.mjs:648` captures the full end word.
- **The Codex reader opens the caller's locator.** Ruled out: `codex.mjs:169` reads `storePath`.
- **The holdout guard checks only the committed baseline.** Ruled out:
  `command-routing-slice.vitest.ts:206-210` checks the live capture.
- **A refusal or question over an or-list carries a command.** Ruled out in the sibling area by
  `command-attach.ts:380,427-439`.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining within the cap; synthesis - Focus area: compile the lineage report from the registry, the two deltas and the three active P2 findings. - Reason: two iterations are complete; the cap is reached with three active P2 advisories and no P0/P1. - Rotation status: correctness and security complete in iteration 1; traceability and maintainability complete in iteration 2. - Required evidence: the registry's active counts, the two iteration final lines and the synthesis report. - Blocked/productive carry-forward: no blocked approach; the redirect P2 is carried. - Recovery note: none; the cap is reached before a legal convergence stop.

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the accuracy-runner `README.md` line in `review/review-scope-4c.txt`; the
  verification surfaces named by the brief (`command-offer.mjs`, `run-command-behaviour.mjs`,
  `score-command-transcripts.mjs`, `codex.mjs`, `command-routing-slice.vitest.ts`); the 4c fix
  commit `868b185e76`; the verify report `review/verify-4/report.md`; the 4b adjudication
  `027-review-pass-four-remediation/scratch/review-rounds.txt`.
- Behavior claims: `offeredAs` travels through both run-log writers; a shell read of a command
  document starts it while a search, an in-place `sed`, a redirect and a heredoc line do not; an
  end word with a hyphen or a dot closes a heredoc; the Codex reader opens the containment-resolved
  path; the holdout guard checks the live capture; a refusal or question over an or-list carries
  no command while a request keeps it.
- Reuse and conventions: the reviewer containment pattern already used by `claude.mjs`; the
  `P0/P1/P2` scale; the delta plus iteration narrative pair; the append gateway as sole state-log
  writer; the reducer-owned registry and dashboard.
- Review risks and gaps: no live per-runtime session was captured in this lineage, so runtime
  behaviour is read from code, tests and the 027 evidence. The mention reader is the sibling
  lineage's surface. The holdout corpus is not opened.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | T006-T011 and T030 are `[x]`; the fixed writers, heredoc, shell read, Codex read and live holdout guard match. T009's redirect claim covers `>` only, and README `:123`/`:125` remain doc drift. |
| `checklist_evidence` | core | partial | 2 | AC-003 covers `cat`, `rg`, in-place `sed` and heredoc; the brief's redirect input is not in the table. AC-010 is unmet for `:123` and the brief-only clause. `CHK-040` is met. |
| `skill_agent` | overlay | notApplicable | 1 | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog page describes the changed accuracy-runner lines. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook surface changed. |

<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D3, D4 | 2 | 2 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | D1, D3 | 2 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | D1, D3 | 2 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1, D3 | 2 | 1 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/codex.mjs` | D2 | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | D2 | 1 | 0 | reviewed |

---

## 16. REVIEW BOUNDARIES

- Max iterations: 2
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-close-4c-1794682797954-pcdanq,
  parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence],
  overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T19:11:54Z
