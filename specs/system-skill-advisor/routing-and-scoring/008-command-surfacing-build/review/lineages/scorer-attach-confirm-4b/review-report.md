# Review Report — scorer-attach-confirm-4b

Lineage `scorer-attach-confirm-4b` of the command-surfacing pass-four confirming round.
Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.
Range: `11af224a34..48f03b5013`. Scope rows: the `scorer-attach` area of `review/review-scope-4b.txt`.
Ledger: `review/verify-4/report.md`; brief: `review/review-brief-4b.txt`.

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false (a P1 is active, so the verdict is not PASS)
- Active counts: P0 0, P1 1, P2 1
- Review scope: eight files — the attach reader, the transcript scorer, three test files, and three shared docs
- Operator review focus: Confirming round of review pass four of command surfacing. Scope: `review-scope-4b.txt` lists the files of the fix commit, one per line as area TAB path, for the commit range `11af224a34..48f03b5013`. This lineage reviews the lines whose area is `scorer-attach`, plus the shared docs that describe them. The round confirms the fixes for the findings in `review/verify-4/report.md` and looks for defects the fixes added. Every finding is P0, P1 or P2 with file:line and a concrete input. The holdout rule held throughout: `command-prompts.jsonl` and `holdout-prompts.jsonl` were never opened except through `jq 'del(.prompt)'`, no diff over a path including `command-prompts.jsonl` ran without the exclude pathspec, and no holdout prompt was printed.

The round confirms eight of the nine fixes in its scope and finds one incomplete fix: the or-list refusal reader joins only `or /cmd`, so a refusal that names its second command as `or the /cmd command` still yields a command. One earlier finding was retracted after re-reading its evidence, and one was closed as an operator-approved deferral.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["SAC4B-P1-001", "SAC4B-P2-001"],
  "remediationWorkstreams": [
    "Widen COMMAND_OR_LIST to accept the article before a joined command and add one refusal row per widened form",
    "Apply the same list rule to COMMAND_ASK_LEADS and pin a question-over-a-list row"
  ],
  "specSeed": [
    "The or-list refusal contract in the pass-four remediation spec covers every command the list joins; name the article form explicitly",
    "The question branch shares the refusal grammar's list rule; say so in the same sentence"
  ],
  "planSeed": [
    "Edit the one constant and its two use sites, test-first with the article input",
    "Add the article row to the adversarial delimiter table",
    "Re-run command-attach-guards and the attach slice"
  ],
  "findingClasses": {
    "SAC4B-P1-001": "class-of-bug",
    "SAC4B-P2-001": "class-of-bug"
  },
  "affectedSurfacesSeed": [
    "commandOnlyMentioned",
    "attachCommand",
    "refusal lead grammar",
    "COMMAND_ASK_LEADS",
    "or-list"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### SAC4B-P1-001 — P1, correctness

- Title: An or-list refusal that names its second command as "the /x command" still attaches that command
- Location: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:379` (constant), `:425-426` (decline branch), `:491` (attach gate), `:512` (return)
- Evidence: `COMMAND_OR_LIST` is `(?:\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?,? or )*`, so the joined item must start at `/`. A module-level probe printed `REQUEST` for `do not run /create:agent or the /create:readme command`, `skip /create:agent or the /create:readme command` and `do not run /create:agent, or the /create:readme command`, while `do not run /create:agent or /create:readme` printed `MENTION`.
- Impact: a refusal can still carry a `(start)`-policy command, the harm class the pass-four fix set out to close.
- Fix recommendation: make the joined item `(?:the )?` tolerant inside `COMMAND_OR_LIST` (one constant plus its test row), and confirm a second use verb still opens a new clause.
- Disposition: open
- Finding class: class-of-bug
- Scope proof: the constant has one use; the five or-list rows in `command-attach-guards.vitest.ts:155-163` all use the bare form, and `027 tasks.md:79` defines only that form.
- Affected surface hints: `commandOnlyMentioned`, `attachCommand`, `refusal lead grammar`, `or-list`

### SAC4B-P2-001 — P2, correctness

- Title: A question over an or-list still attaches its second command
- Location: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:386-389`
- Evidence: `COMMAND_ASK_LEADS` never receives `COMMAND_OR_LIST`; the probe printed `REQUEST` for `what does /create:readme or /create:agent do?` against `/create:agent`, while the single-command question printed `MENTION`.
- Impact: a pure question can carry a mutating command; advisory because the brief scoped the or-list fix to refusals.
- Fix recommendation: share the list rule between the decline and ask branches.
- Disposition: open
- Finding class: class-of-bug
- Scope proof: one pattern family; no ask-side list row exists in the guard table.
- Affected surface hints: `COMMAND_ASK_LEADS`, `commandOnlyMentioned`

## 4. Remediation Workstreams

1. **P1 — close the or-list grammar gap.** Edit `COMMAND_OR_LIST`, add the article row, and re-run `tests/command-attach-guards.vitest.ts` plus the attach slice.
2. **P2 — share the list rule with the ask branch.** Apply the same constant in `COMMAND_ASK_LEADS` and add one question-over-a-list row.

## 5. Spec Seed

- The pass-four remediation spec already states that a decline lead covers every command an or-list joins; make the article form explicit so the fix and its test row cannot diverge again.
- The question branch is the same grammar over a different lead family; state the shared rule once.

## 6. Plan Seed

- Test-first: add `['do not run /create:agent or the /create:readme command', '/create:readme']` to the refusal table and watch it fail.
- Widen the constant, keep `do not run A or run B` as the request control.
- Add the ask-side row and apply the constant.
- Re-run the guard table and the attach slice; no stored score moves (the gate feeds offers, not the corpus numbers).

## 7. Traceability Status

### Core Protocols

- `spec_code`: **partial** — the pass-four remediation contract for the or-list (`027/spec.md:201`) is met for the bare form only; the article form stays a request. The live-holdout, shell-read, heredoc, head-command and doc tasks (T006-T016) match their code.
- `checklist_evidence`: **partial** — CHK-FIX-004's adversarial delimiter table (`027/tasks.md:221`) has no article-inside-or-list row; every other required row holds.

### Overlay Protocols

- `skill_agent`: **pass** — `README.md:121` matches `render.ts:113` and `doctor-brief-render.vitest.ts:84`.
- `agent_cross_runtime`: **pass (context)** — the Codex reader opens the containment-resolved `storePath` (`codex.mjs:164-171`); sibling-owned.
- `feature_catalog_code`: **pass** — `advisor-recommend.md:39` matches `advisor-recommend.ts:475-478`; `command-meaning-matching.md:65` matches 28 test blocks.
- `playbook_capability`: **notApplicable** — no playbook in scope.

### AC_COVERAGE

`exempt` — this lineage reviews the pass-four fix rows, not packet closure; no ACC coverage signal was computed and the advisory signal does not alter the verdict.

## 8. Deferred Items

- `iter4-P2-unscored-only-dead-field` (dead `unscoredOnly` in the summary projection): operator decision P046 defers it to phase 026 T052. Confirmed still dead, not counted active.
- `iter3-P2-pair-doc-shared-rows` and `iter4-P2-paired-arm-key-collision`: same deferral to phase 026 (P046).
- `SA4-P1-001` (retired name in a refusal) and `SA4-P1-003` (broad creation words): accepted limits under P045, not built.
- `SA4-P2-004` (phase 020 says 10, code uses 9): superseding note under P048.

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Selected review directions: correctness (iteration 1) → traceability (iteration 2) → security and maintainability (iteration 3)
- Saturated directions: none
- Remaining frontier: none

## 10. Search Ledger

*No search-depth state captured (legacy v1 record).*

## 11. Audit Appendix

### Convergence

- Iterations: 3 of 3 (cap reached; the third produced no new findings and all dimensions are covered)
- Stop reason: `maxIterationsReached`
- newFindingsRatio by iteration: 1 → 0.88, 2 → 0, 3 → 0
- Active findings: P0 0, P1 1, P2 1

### Coverage

- Dimensions covered: correctness, traceability, security, maintainability (4 of 4)
- Files reviewed: `command-attach.ts`, `score-command-transcripts.mjs`, `command-attach-guards.vitest.ts`, `command-transcript-score.vitest.ts`, `command-routing-slice.vitest.ts`, `README.md`, `advisor-recommend.md`, `command-meaning-matching.md`

### Ruled Out Claims

- `R4-P2-002` first-row lead, `iter2-P1-fit-decline-ungated`, `iter3-P2-attached-metrics-unpinned`: rejected by the verifier; no new input found.
- ReDoS on `COMMAND_OR_LIST`: flat timing to 1200 list items; the repetition cannot match empty.
- Holdout leak through the live capture: guarded on all four published maps.
- `unscoredOnly` as active work: deferred by P046.

### Corrections

- `SAC4B-P2-002` was retracted in iteration 2. Iteration 1 read `render.ts` through `rg -r`, whose replace flag printed the file as if the phrase were `n`; the file prints `parent-named only` and the README matches it.

### Sources Reviewed

`review-brief-4b.txt`, `review-scope-4b.txt`, `review/verify-4/report.md`, `027-review-pass-four-remediation/spec.md` and `tasks.md`, `020-command-offer-fit-guards/spec.md`, the eight scope files, `render.ts`, `doctor-brief-render.vitest.ts`, `command-offer.mjs`, `run-command-behaviour.mjs`, `codex.mjs`.

Review verdict: CONDITIONAL
