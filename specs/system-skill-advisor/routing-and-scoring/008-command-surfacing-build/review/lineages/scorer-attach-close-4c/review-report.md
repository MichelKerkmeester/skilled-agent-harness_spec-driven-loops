# Review Report — scorer-attach closing round, pass four

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the verdict is CONDITIONAL, not PASS with advisories)
- **Active findings: 0 P0, 1 P1, 1 P2**
- **Review scope:** the `scorer-attach` rows of `review-scope-4c.txt` — `command-attach.ts` and `command-attach-guards.vitest.ts` — plus the docs that describe them, for commit range `48f03b5013..868b185e76`. Inspection was read-only; all writes are inside `review/lineages/scorer-attach-close-4c/`.
- **Iterations:** 3 of 3 (cap reached and recorded as `maxIterationsReached`; the last iteration's `newFindingsRatio` was 0.00, below the 0.10 threshold).
- **Operator review focus (verbatim):**

> Closing round of review pass four of command surfacing. FIRST read and follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4c.txt: it names the scope file, the commit range, which files your lineage reviews and the checks. HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through jq 'del(.prompt)', never run git diff, show or log -p over a path that includes command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage folder.

The round's own checks resolve as follows. **Refusals over an or-list** carry no command, with the article and the word `command`, and the plain form, at the predicate, `attachCommand` and the advisor CLI. **Questions over an or-list** carry no command; **requests over a list** keep their command. The exception is a list whose non-final item is a two-word `/doctor:` command, which is the active P1. The `offeredAs`, shell-read, heredoc, Codex-read and live-holdout checks belong to the sibling `accuracy-runner` lineage and to `verify-4`, and were not re-graded here; the docs this lineage read agree with the scorer code.

## 2. Planning Trigger

`/speckit:plan` is required: an active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "SAC4C-P1-001",
      "severity": "P1",
      "title": "An or-list whose non-final item is a two-word /doctor command still publishes the refused command",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:380",
      "dimension": "correctness"
    },
    {
      "id": "SAC4C-P2-001",
      "severity": "P2",
      "title": "The remediation spec still calls the question-over-an-or-list unreproduced and out of scope, and describes the carry as decline-only",
      "file": "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:239",
      "dimension": "traceability"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "order": 1,
      "findingIds": ["SAC4C-P1-001"],
      "action": "Extend the or-list item grammar to a two-word command, or record the limit; pin both the predicate and the CLI row."
    },
    {
      "id": "WS-2",
      "order": 2,
      "findingIds": ["SAC4C-P2-001"],
      "action": "Amend the remediation spec's requirement, scope, file table and assumption to match the implemented question carry, and correct the moved line pointer."
    }
  ],
  "specSeed": "Record that an or-list refusal or question covers every joined command the tracked table can express, and state whether two-word /doctor commands are in scope. Record the confirming-round additions (article form, question over a list) in the phase requirement rather than only in the appended tasks.",
  "planSeed": [
    "Add a test row for `do not run /doctor:ci report or /doctor:ci scaffold` to the or-list refusal table and to the `offers no hub command for %s` table; expect no command on either surface.",
    "Widen `COMMAND_OR_LIST`'s item to an optional second word, or derive the item from `TRACKED_COMMANDS`, then re-run the single-word rows, the request rows and the CLI probe.",
    "Amend `027-review-pass-four-remediation/spec.md`: REQ-001, the Out-of-Scope line, the Files-to-Change description, A3 and the mechanism pointer (:405 to :412).",
    "Re-run the confirming round over the amended diff; keep the ratio at or below 0.10."
  ],
  "findingClasses": ["incomplete-fix", "doc-drift"],
  "affectedSurfacesSeed": [
    "commandOnlyMentioned",
    "typedCommandForTop",
    "withholdMentionedCommands",
    "rankTypedCommandOwnerFirst",
    "COMMAND_OR_LIST",
    "advisor CLI rows",
    "027-review-pass-four-remediation/spec.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### SAC4C-P1-001 — P1, correctness

- **Title:** An or-list whose non-final item is a two-word `/doctor:` command still publishes the refused command.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:380` (applied at `:427`, `:429`, `:432`, `:439`).
- **Evidence:** `COMMAND_OR_LIST` matches a listed item as one token. `TRACKED_COMMANDS` ships 22 two-word `/doctor:` rows (`:143-178`), and `withholdMentionedCommands` compares a command row on its base name (`fusion.ts:1209`), so the second occurrence is unled. The CLI printed `[["command-doctor-ci-report","/doctor:ci report","run"],["command-doctor-ci-scaffold","/doctor:ci scaffold","ask"]]` for `do not run /doctor:ci report or /doctor:ci scaffold`; `typedCommandForTop('sk-code', …)` returned `/doctor:ci scaffold`. Both were reproduced at synthesis on the final tree.
- **Impact:** a reader who explicitly refuses two `/doctor:` commands is shown both refused commands on the top two rows, and the typed-command path can attach the refused command. Same symptom class as the SAC4B-P1-001 this round fixed, narrowed to the two-word rows.
- **Fix recommendation:** let the list item carry an optional second word (`(?: [a-z][a-z0-9_-]*)?`), or match the item against the tracked command vocabulary; add the predicate row and a hub/CLI row; keep the request, question and second-use-verb controls green.
- **Disposition:** active; not a regression introduced by the fix (the pre-fix constant had the same single-token shape), but the fix's own contract sentence claims "every command the list joins".
- **Finding class:** incomplete-fix. **Scope proof:** item pattern at `:380`, call sites at `:427-439`, two-word rows at `:143-178`, base-name comparison at `fusion.ts:1209`. **Affected surface hints:** `commandOnlyMentioned`, `typedCommandForTop`, `withholdMentionedCommands`, `rankTypedCommandOwnerFirst`, `COMMAND_OR_LIST`, advisor CLI rows.
- **Claim adjudication:** HUNTER found a positional multi-word gap; SKEPTIC checked REQ-001, A3/P049 and the 020 accepted limits and found no recorded exclusion; REFEREE kept P1 because the module's stated contract and a real CLI row reproduce it. Confidence high. Downgrade to P2 only with a recorded single-token or out-of-contract declaration.

### SAC4C-P2-001 — P2, traceability

- **Title:** The remediation spec still calls the question-over-an-or-list unreproduced and out of scope, and describes the carry as decline-only.
- **File:line:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:239` (also `:201`, `:248`, `:279`, `:384`).
- **Evidence:** the Out-of-Scope line says a question over an or-list was never reproduced; A3 says the carry "applies to the decline leads only"; the Files-to-Change row says "for the decline leads"; REQ-001 enumerates only the three single-word refusals; the mechanism row points at `command-attach.ts:405`, which is now `:412`. T029 (`tasks.md:82`) implements the question carry, and the tests pin it at `command-attach-guards.vitest.ts:160-174,209-215`.
- **Impact:** a reader planning or verifying from the spec is told an implemented, tested case is out of scope; the stale pointer also costs a lookup. No behaviour impact.
- **Fix recommendation:** amend REQ-001, the Out-of-Scope line, the Files-to-Change description, A3 and the pointer; optionally restate AC-001/AC-006 to name the added forms.
- **Disposition:** active advisory.
- **Finding class:** doc-drift. **Scope proof:** the five spec lines are the only statements about the carry; T029 and the code/test lines above implement it. **Affected surface hints:** 027 spec, 027 acceptance criteria; no code.

## 4. Remediation Workstreams

1. **WS-1 (P1, before release):** close the two-word item gap in `COMMAND_OR_LIST`; pin it at the predicate and at a hub/CLI row; re-run the single-word refusal, question and request controls. The fix is small; the risk is over-widening the item and swallowing a request, so the request rows are the guard.
2. **WS-2 (P2, advisory):** amend the 027 spec so the requirement, scope, file table and assumption describe the code as shipped; correct the moved pointer. Doc-only.

## 5. Spec Seed

- The or-list contract should state whether the list item is one token or a tracked command (which makes `/doctor:ci report` part of the grammar), so the next reader does not have to infer it from the constant.
- The confirming-round additions (article on a listed item, `command` after it, question over a list) belong in the phase requirement, not only in appended task rows.
- Keep the clause-separation rule explicit: a second use verb opens a new clause and keeps its command.

## 6. Plan Seed

- Test first: add `do not run /doctor:ci report or /doctor:ci scaffold` to the refusal table and to the `offers no hub command for %s` table; run the guards suite and the CLI probe and see the command offered before the change.
- Widen the item once, re-run the guards suite, the typecheck and the mention probe; keep the request rows (`use A or B`, `use A, not B`, `do not run A, run B or C`, `do not run A or run B`) green.
- Amend the 027 spec in one pass; run the packet's doc checks; re-run the confirming round on the amended range.

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | REQ-001's three refusals and the request controls behave as written at the CLI; T028/T029 implement the article and question forms | SAC4C-P1-001 (multi-word item) and SAC4C-P2-001 (spec text lags the implemented question carry) |
| `checklist_evidence` | partial | T028 and T029 are `[x]` with evidence that matches the diff, code and test rows; the nine added test rows match the two task contracts | AC-001 and AC-006 still read `Unmet`; expected until AC-011 closes this round |

### Overlay protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | `advisor-recommend.md:33` describes `attachCommand` accurately and makes no or-list claim; no skill doc contradicts the code |
| `skill_agent` | notApplicable | no agent surface in this lineage's scope |
| `agent_cross_runtime` | notApplicable | no runtime mirror in this lineage's scope |
| `playbook_capability` | notApplicable | no playbook surface in this lineage's scope |

**AC_COVERAGE:** exempt. The review target's root has no `acceptance-criteria.md` and no `implementation-summary.md`; the acceptance gates live in the phase children (027 is the one this round touches), so the advisory signal does not apply at this level.

## 8. Deferred Items

- The two-word item fix could be folded into phase 026's stored-number freeze if the lead prefers one edit window; it is not a blocker for this lineage's report.
- The reducer's registry attributes SAC4C-P2-001 to `correctness` because the delta finding row carried no `dimension` field; the report and iterations attribute it to `traceability`. Counts and severity are unaffected; a reducer re-run with a dimension-bearing row would correct the label.
- No resource-map gate: `resource-map.md` is absent at the target root, so the gate and its report section are skipped by contract.

## Dimension Expansion Map

- Completed pivots: 0; failed pivots: 0; audited overrides: 0.
- Swept directions: none. Saturated directions: none.
- Selected review directions: correctness (iteration 1, or-list grammar), traceability (iteration 2, spec and docs), maintainability with security cross-reference (iteration 3).
- Remaining frontier: none — all four configured dimensions covered.
- This section records breadth only and does not alter the verdict or the registry.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

- Search methods used: direct reads of the changed files and callers, exact `grep` for `commandOnlyMentioned` call sites and doc claims, `git show`/`git diff` for the base-commit line numbers, a real-module probe under Node type stripping, and the advisor CLI on the round's prompts.
- No corpus file was opened; no holdout prompt was read or printed.

## 10. Audit Appendix

### Convergence summary

| Iteration | Focus | newFindingsRatio | P0/P1/P2 | Verdict |
|-----------|-------|------------------|----------|---------|
| 1 | correctness | 1.00 | 0/1/0 | CONDITIONAL |
| 2 | traceability | 1.00 | 0/0/1 | CONDITIONAL |
| 3 | maintainability + security | 0.00 | 0/0/0 | CONDITIONAL |

- The last ratio clears the 0.10 threshold, but iteration 3 is the cap, so the legal stop is `maxIterationsReached`; the convergence telemetry is preserved.
- Active P0: 0. Active P1: 1. Active P2: 1. Resolved: 0.

### Coverage summary

- Dimensions covered: correctness, security, traceability, maintainability (4/4).
- Files reviewed: `command-attach.ts`, `command-attach-guards.vitest.ts`, `fusion.ts` and `advisor-recommend.ts` as callers, the 027 spec/tasks/AC, and three skill docs as doc context.

### Ruled-out claims

- The fix over-suppresses requests (seven request shapes kept their command).
- The article allowance breaks an existing question row (zero-iteration match when no `or`).
- The shipped build lacks the fix (the dist copy carries it).
- A missing hub-level row hides a distinct failure (the predicate is the only mention branch).
- A changelog entry is missing (phase 025 owns release notes).
- ReDoS or regex injection (bounded iteration, escaped name, constant leads).
- Comment-hygiene violation or duplicated grammar (one constant, no ids).

### Sources reviewed

- `git -c core.fsmonitor=false diff 48f03b5013 868b185e76 -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (and the guards test; README as doc context).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:356-441,459-514`.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:145-274`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1246`; `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:500`.
- `027-review-pass-four-remediation/spec.md:195-205,239,244-252,279,356,378-390`, `tasks.md:57-82`, `acceptance-criteria.md:56,61,66`.
- `review/verify-4/report.md`, `review/review-brief-4c.txt`, `review/review-scope-4c.txt`, `027-review-pass-four-remediation/scratch/review-rounds.txt`.
- Live probes: `tmp/probe-or-list.mjs`, the advisor CLI rows, and `git show` of the two prior commits.

### Cross-reference appendix

**Core Protocols:** `spec_code` partial; `checklist_evidence` partial (reasons above).
**Overlay Protocols:** `feature_catalog_code` pass; `skill_agent`, `agent_cross_runtime`, `playbook_capability` notApplicable.

### Release-readiness state

`in-progress` — the stop reason is `maxIterationsReached` (not `converged`) and one P1 remains active.
