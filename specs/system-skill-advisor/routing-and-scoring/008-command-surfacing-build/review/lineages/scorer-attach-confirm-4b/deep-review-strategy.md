---
title: Deep Review Strategy - scorer-attach-confirm-4b lineage
description: Runtime strategy tracking the confirming round of review pass four for the scorer-attach fan-out lineage.
version: 1.11.14.0
---

# Deep Review Strategy - scorer-attach-confirm-4b lineage

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

Confirming round of review pass four of
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` in the
`scorer-attach` area, over the fix commit range `11af224a34..48f03b5013`.

Scope: the `scorer-attach` area rows of `review/review-scope-4b.txt` — `command-attach.ts`,
`score-command-transcripts.mjs`, the four matching tests, and the shared docs that describe
them (`README.md`, `feature-catalog/cli-surface/advisor-recommend.md`,
`feature-catalog/scorer-fusion/command-meaning-matching.md`). The `accuracy-runner` rows
(`codex.mjs`, `command-offer.mjs`, `run-command-behaviour.mjs`, their tests and the doctor
presentation asset) belong to the sibling lineage and are read here only as context.

This round confirms the fixes for the findings in `review/verify-4/report.md` and looks for
defects those fixes added. A finding the report rejects or records as an accepted limit is not
re-raised without a new input that breaks it.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The accuracy-runner harness and session readers are the sibling lineage's code scope; this
  lineage checks only that its own scoring surface agrees with them.
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
- Resolved: 4

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Importing `command-attach.ts` directly with Node's type stripping: it is the actual module, so a gate result is observed behavior rather than a regex reading (iteration 1).
- Pairing each brief check with its pinning test row: it separates "the fix holds" from "the test only covers the easy form" (iteration 1).
- Reading the holdout gate as an ordering property (`label` → `holdout` → `loadSession`) instead of grepping for the word holdout: it proves the prompt cannot be reached (iteration 3).
- Timing the new delimiter on growing lists: a flat curve rules out the ReDoS class without a security tool (iteration 3).

---

## 9. WHAT FAILED

- Reading the or-list tests as proof of the whole class: all five rows use a bare `/cmd or /cmd` shape, so the article form stayed invisible until the probe (iteration 1).
- Reading a file through `rg -r`: the replace flag printed the file with my own replacement text, which produced a false P2 (iteration 2, retracted).
- Treating a verifier-confirmed P2 as unfixed without checking the remediation spec: the dead field is an accepted deferral, not open work (iteration 2).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `iter2-P1-fit-decline-ungated`: rejected by the report; the slice test compares the whole block (`command-routing-slice.vitest.ts:277-280`), so a move from 8 to 9 fails the suite. Not re-opened. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `iter2-P1-fit-decline-ungated`: rejected by the report; the slice test compares the whole block (`command-routing-slice.vitest.ts:277-280`), so a move from 8 to 9 fails the suite. Not re-opened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `iter2-P1-fit-decline-ungated`: rejected by the report; the slice test compares the whole block (`command-routing-slice.vitest.ts:277-280`), so a move from 8 to 9 fails the suite. Not re-opened.

### `iter3-P2-attached-metrics-unpinned`: rejected; same whole-block comparison. Not re-opened. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `iter3-P2-attached-metrics-unpinned`: rejected; same whole-block comparison. Not re-opened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `iter3-P2-attached-metrics-unpinned`: rejected; same whole-block comparison. Not re-opened.

### `iter3-P2-pair-doc-shared-rows`, `iter4-P2-paired-arm-key-collision`, `iter4-P2-unscored-only-dead-field`: accepted deferrals to phase 026 (P046); not re-raised. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `iter3-P2-pair-doc-shared-rows`, `iter4-P2-paired-arm-key-collision`, `iter4-P2-unscored-only-dead-field`: accepted deferrals to phase 026 (P046); not re-raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `iter3-P2-pair-doc-shared-rows`, `iter4-P2-paired-arm-key-collision`, `iter4-P2-unscored-only-dead-field`: accepted deferrals to phase 026 (P046); not re-raised.

### `R4-P2-002` (first returned row always leads): rejected by `verify-4/report.md:16`; the attach path at `advisor-recommend.ts:475-478` shows the head is the only row guaranteed to render, so no new input breaks the rejection. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `R4-P2-002` (first returned row always leads): rejected by `verify-4/report.md:16`; the attach path at `advisor-recommend.ts:475-478` shows the head is the only row guaranteed to render, so no new input breaks the rejection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R4-P2-002` (first returned row always leads): rejected by `verify-4/report.md:16`; the attach path at `advisor-recommend.ts:475-478` shows the head is the only row guaranteed to render, so no new input breaks the rejection.

### `R4-P2-002`, `iter2-P1-fit-decline-ungated`, `iter3-P2-attached-metrics-unpinned`: rejected in `verify-4/report.md`; no new input found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `R4-P2-002`, `iter2-P1-fit-decline-ungated`, `iter3-P2-attached-metrics-unpinned`: rejected in `verify-4/report.md`; no new input found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R4-P2-002`, `iter2-P1-fit-decline-ungated`, `iter3-P2-attached-metrics-unpinned`: rejected in `verify-4/report.md`; no new input found.

### `SA4-P2-004` (10 vs 9): accepted superseding note under P048; re-reporting it would contradict the operator decision. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `SA4-P2-004` (10 vs 9): accepted superseding note under P048; re-reporting it would contradict the operator decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SA4-P2-004` (10 vs 9): accepted superseding note under P048; re-reporting it would contradict the operator decision.

### `unscoredOnly`, pair-block and `paired` name: accepted deferrals to phase 026 (P046), not re-raised. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `unscoredOnly`, pair-block and `paired` name: accepted deferrals to phase 026 (P046), not re-raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `unscoredOnly`, pair-block and `paired` name: accepted deferrals to phase 026 (P046), not re-raised.

### A shell read counting a failed `cat` (exit status is not on the normalized event, `:710-714`): outside the fix's claim and unchanged by it; not raised. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A shell read counting a failed `cat` (exit status is not on the normalized event, `:710-714`): outside the fix's claim and unchanged by it; not raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A shell read counting a failed `cat` (exit status is not on the normalized event, `:710-714`): outside the fix's claim and unchanged by it; not raised.

### Holdout leak through `command-routing-slice.vitest.ts`: the live capture is now checked; no prompt value is read by the helper. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Holdout leak through `command-routing-slice.vitest.ts`: the live capture is now checked; no prompt value is read by the helper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Holdout leak through `command-routing-slice.vitest.ts`: the live capture is now checked; no prompt value is read by the helper.

### ReDoS on `COMMAND_OR_LIST`: the repetition cannot match empty, so the `$` anchor cannot force exponential backtracking; measured flat. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: ReDoS on `COMMAND_OR_LIST`: the repetition cannot match empty, so the `$` anchor cannot force exponential backtracking; measured flat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS on `COMMAND_OR_LIST`: the repetition cannot match empty, so the `$` anchor cannot force exponential backtracking; measured flat.

### The 027 T016 verification line was re-run mentally against the real file: `rg -c -F "PARENT_NAMED_POLICY = 'parent-named only'" render.ts` prints 1, so the task's evidence is sound. No finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The 027 T016 verification line was re-run mentally against the real file: `rg -c -F "PARENT_NAMED_POLICY = 'parent-named only'" render.ts` prints 1, so the task's evidence is sound. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The 027 T016 verification line was re-run mentally against the real file: `rg -c -F "PARENT_NAMED_POLICY = 'parent-named only'" render.ts` prints 1, so the task's evidence is sound. No finding.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- SA4-P1-002 confirmation, refusal over an or-list: confirmed for the bare form; the article form remains open as SAC4B-P1-001 (iteration 1).
- R4-P2-002 (first-row lead): rejected by `verify-4/report.md`; not re-opened without a new input.
- SAC4B-P2-002 (README policy token): retracted; `render.ts:113` prints `parent-named only` and the README matches (iteration 2).
- `iter4-P2-unscored-only-dead-field`: accepted deferral to phase 026 T052 by P046 (`027/spec.md:214`); closed, not re-raised (iteration 2).
- `SA4-P2-004` (10 vs 9): superseding note under P048 (`027/spec.md:210,387`); not raised (iteration 2).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: correctness, traceability, security and maintainability each have one full iteration; the last two produced no new findings - Rotation status: all dimensions covered - Required evidence: `verify-4/report.md` ledger plus iterations 1-3 - Recovery note: none Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `runtime/lib/command-attach.ts` (refusal and question suppression, heredoc
  scan, shell-read start), `runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
  (`readDocument`, `offeredAs`, holdout guard), `runtime/tests/command-attach-guards.vitest.ts`,
  `command-transcript-score.vitest.ts`, `command-routing-slice.vitest.ts`.
- Behavior claims: a refusal over an or-list carries no command; an is-the question carries no
  command; a request over a list keeps its command; both run-log writers keep `offeredAs`; a
  shell read of a command document counts as a start while a search, an in-place `sed`, a
  redirect and a heredoc line do not; a heredoc end word with `-` or `.` closes correctly; the
  Codex reader opens the resolved file; the holdout guard reads the live capture; docs agree
  with code.
- Conventions: P0/P1/P2 only; every finding carries `file:line` and a concrete `Case:`; the
  five fix-completeness lines are required per finding.
- Risks: the `verify-4` report rejected three findings; re-raising them needs a new input. The
  scorer keeps stored baselines, so a doc claim and a stored number can disagree silently.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | remediation contract met except the article-inside-or-list form (SAC4B-P1-001) |
| `checklist_evidence` | core | partial | 2 | CHK-FIX-004 adversarial table lacks the article row; all other rows hold |
| `skill_agent` | overlay | pass | 2 | README child-session policy matches `render.ts:113` |
| `agent_cross_runtime` | overlay | pass | 2 | Codex reader opens `storePath` (context; sibling row) |
| `feature_catalog_code` | overlay | pass | 2 | `advisor-recommend.md:39`, `command-meaning-matching.md:65` match code |
| `playbook_capability` | overlay | notApplicable | - | no playbook in scope |

<!-- /ANCHOR:cross-reference-status -->

---

<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1 | 1 | 1 P1, 1 P2 | complete for pass-four checks |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1, D2, D4 | 3 | 1 P2 (carried) | holdout gate and shell-read branch clean |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/README.md` | D1, D3 | 2 | 0 | clean after retraction |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | D3 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | D3 | 1 | 0 | complete |

<!-- /ANCHOR:files-under-review -->

---

<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES

- Phase save skipped by dispatch instruction: the lineage prompt forbids `generate-context.js`, so continuity was not written outside the lineage.
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-attach-confirm-4b-1794680176420-xvj4ed, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T19:16:00Z

<!-- /ANCHOR:review-boundaries -->
