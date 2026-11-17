# Review Report: Command Surfacing Build, Pass Four (accuracy-runner closeout lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the closing round of review pass four, on the fix range `48f03b5013..868b185e76`.
- Lineage: `accuracy-runner-close-4c`, area `accuracy-runner`, run
  `fanout-accuracy-runner-close-4c-1794682797954-pcdanq`, executor `cli-opencode`
  `opencode-go/deepseek-v4.1-flash` at reasoning effort max.
- Reviewed scope: the one accuracy-runner path in `review/review-scope-4c.txt` (the routing-accuracy
  `README.md`) plus the six code and test surfaces the brief names as verification checks: the two
  run-log writers, the transcript scorer, the Codex reader and the holdout guard.
- Inputs to this synthesis: the two iteration narratives, the two delta files, the lineage registry
  (3 active P2 findings), the strategy and the dashboard.
- Cross-area boundary: `lib/command-attach.ts`, the scorer fusion, the recommend handler and the
  feature docs belong to `scorer-attach-close-4c`. This lineage read the mention reader only as
  context and raises no finding against it.
- Iteration cap: 2 of 2. The loop stopped at the cap; convergence was not declared.
- Operator review focus: Closing round of review pass four of command surfacing. FIRST read and
  follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4c.txt:
  it names the scope file, the commit range, which files your lineage reviews and the checks.
  HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through
  jq 'del(.prompt)', never run git diff, show or log -p over a path that includes
  command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print
  a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage
  folder.

---

## 1. Executive Summary

- **Finding verdict: PASS.** No P0 and no P1 finding is active.
- **hasAdvisories: true.** Three P2 findings remain active: one parser edge and two documentation
  drifts. The dashboard's own `hasAdvisories` flag reads false because its provisional verdict is
  CONDITIONAL on the search debt below; the finding-severity view is PASS with three advisories.
- **Active counts:** P0 0, P1 0, P2 3.
- **The 4b accuracy-runner P2s are fixed.** `README.md:76` now says four fields, `:125` lists
  `offeredAs`, and `:70` names the head-moved line's four-field exception. No "three fields" string
  remains.
- **Both run-log writers keep `offeredAs`.** The backfill writes it at `command-offer.mjs:496`, the
  live turn spreads `offerLineFields` at `run-command-behaviour.mjs:1203`, and the scorer reads it
  at `score-command-transcripts.mjs:1471-1476`.
- **The other brief checks hold.** A `cat` of a command document counts as a start; `rg`, an
  in-place `sed` and a heredoc line do not. A heredoc end word with a hyphen or a dot closes. The
  Codex reader opens `storePath`, the file containment resolved. The holdout guard checks the live
  capture as well as the committed baseline.
- **The new P2 parser edge.** `shellReadTargets` recognizes only a word starting with `>` as a
  redirect, so a `2>` or `&>` target that names a command document is counted as a read and, through
  `readDocument`, as a start (`score-command-transcripts.mjs:677,922`).
- **The two new P2 doc drifts.** `README.md:123` still says a stored run line holds no `offeredAs`,
  which the fixed writers made false. `README.md:125` puts `[--brief-only]` inside a sentence that
  promises the four-field rewrite, which that mode does not perform; `README.md:85` states the
  correct behavior.
- **Search debt.** One deferred scope row records the phase 026 items (pair-doc shared row,
  reserved `paired` arm name, dead `unscoredOnly` field). The dashboard's provisional verdict is
  CONDITIONAL on that debt; the finding-severity verdict is PASS, and the cross-lineage merge
  recomputes from the findings registry.
- **Holdout hygiene:** no holdout prompt text was read or printed. Corpus access was limited to the
  code and the committed test, and no prompt value is used in a finding or report sentence.
- **Release readiness:** `in-progress`. The cap was reached; no convergence event was recorded.

---

## 2. Planning Trigger

No plan is required for the PASS finding verdict. The three P2s are advisory: two documentation
corrections and one small parser guard. They do not block release. The phase 026 deferral is
recorded as search debt, not as a new finding.

```json Planning Packet
{
  "triggered": false,
  "triggerReason": "PASS with three advisory P2 findings; no P0 or P1 remains.",
  "verdict": "PASS",
  "dashboardVerdict": "CONDITIONAL",
  "hasAdvisories": true,
  "hasSearchDebt": true,
  "counts": { "p0": 0, "p1": 0, "p2": 3, "active": 3, "iterations": 2 },
  "activeFindings": [
    {
      "id": "ARC4C-P2-001",
      "severity": "P2",
      "title": "A 2> or &> redirect target that names a command document still counts as a start",
      "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:677",
      "findingClass": "correctness",
      "disposition": "advisory"
    },
    {
      "id": "ARC4C-P2-002",
      "severity": "P2",
      "title": "The README says a stored run line holds no offeredAs, but both current writers store it",
      "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:123",
      "findingClass": "traceability",
      "disposition": "advisory"
    },
    {
      "id": "ARC4C-P2-003",
      "severity": "P2",
      "title": "The runner row says --brief-only rewrites the four fields, but that mode copies the offer fields untouched",
      "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:125",
      "findingClass": "maintainability",
      "disposition": "advisory"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "advisory": true,
      "name": "Redirect operator parsing",
      "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"],
      "actions": [
        "Recognize 2>, &>, 2>> and &>> as redirect operators in shellReadTargets, not only a word starting with >.",
        "Skip the redirect target rather than every later word, so a real read after a redirect still counts.",
        "Add the redirect row the T009 table never had: head -n 1 2> <command document> must not set started."
      ]
    },
    {
      "order": 2,
      "advisory": true,
      "name": "README offeredAs sentences",
      "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md"],
      "actions": [
        "Change :123 to say a line written before the field existed holds no offeredAs, so a legacy line counts as before.",
        "Move [--brief-only] out of the four-field sentence at :125, or say that the default backfill writes the four and the brief-only mode copies the offer fields as held."
      ]
    }
  ],
  "specSeed": [
    "The routing-accuracy README is the document of record for the two writers; its stored-line sentence must distinguish a legacy line from a line the current writers produce.",
    "The redirect guard in the transcript scorer should name the operator forms it accepts; the T009 table currently covers no redirect at all."
  ],
  "planSeed": [
    "Patch the redirect test in shellReadTargets and add a head -n 1 2> <doc> case to the startState table.",
    "Edit README.md:123 to qualify the legacy line and README.md:125 to scope the four-field rewrite to the default backfill."
  ],
  "findingClasses": ["correctness", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    "score-command-transcripts shell read and start detection",
    "routing-accuracy README attribution section",
    "run-command-behaviour backfill mode"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

### ARC4C-P2-001 — A `2>` or `&>` redirect target that names a command document still counts as a start

- Severity: P2
- Dimension: correctness
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:677`
- Finding class: `correctness`
- Evidence: `shellReadTargets` sets the redirect flag only for a word starting with `>` (`:677`). `2>` and `&>` do not match, so a target ending in `.md`, `.yaml` or `.yml` is pushed at `:687`. `readDocument` then returns true at `:922`.
- Case: `head -n 1 2> .skilled/commands/create/readme.md` followed by a `Write`; the command reads stdin and writes stderr to the document, but `startState.started` is true.
- Fix: recognize `2>`, `&>`, `2>>` and `&>>`; skip the target and continue scanning after it. Add the redirect row to the T009 table.
- Scope proof: the scorer is a named verification surface in the 4c brief; the shell branch at `:922` is the T009 fix and `:677` is the redirect guard it relies on.
- Affected surface hints: `startRate`, `startedOfOffered`, `loops`, `unsafe`, command documents, stderr redirects.
- Disposition: advisory, P2.

### ARC4C-P2-002 — The README says a stored run line holds no `offeredAs`, but both current writers store it

- Severity: P2
- Dimension: traceability
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:123`
- Finding class: `traceability`
- Evidence: `README.md:123` says "A stored run line holds no `offeredAs`, so its offer counts as before." `command-offer.mjs:496` and `run-command-behaviour.mjs:1203` write the field; `score-command-transcripts.mjs:1471-1476` reads it to split `offeredAsPartner` from `offered`.
- Case: a live line written at `run-command-behaviour.mjs:1201-1205` carries `offeredAs: "partner"`; `offerOf` counts it in `offeredAsPartner`, not in `offered`, while the README says a stored line holds no field and counts as before.
- Fix: change the sentence to "A run line written before the field existed holds no `offeredAs`, so its offer counts as before."
- Scope proof: the README is the changed accuracy-runner path; both writers and the scorer are the brief's verification surfaces.
- Affected surface hints: `offerOf`, `offeredAsPartner`, `offerFieldAbsent`, stored run logs, backfill.
- Disposition: advisory, P2.

### ARC4C-P2-003 — The runner row says `--brief-only` rewrites the four fields, but that mode copies the offer fields untouched

- Severity: P2
- Dimension: maintainability
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:125`
- Finding class: `maintainability`
- Evidence: `README.md:125` lists `[--brief-only]` in the sentence "rewrites a finished log with `offeredCommand`, `offeredPolicy`, `offeredAs` and `briefDelivered`." `command-offer.mjs:489-490` copies the line and changes only `briefDelivered` and `briefBackfilled` when brief-only; the offer fields stay as held. `README.md:85` says the same.
- Case: a legacy line with no offer fields, run through `--backfill --brief-only`; the output has `briefDelivered` and `briefBackfilled` but no `offeredCommand`, `offeredPolicy` or `offeredAs`, contradicting the runner row.
- Fix: move `[--brief-only]` out of the four-field sentence, or qualify the sentence as the default backfill path.
- Scope proof: the README is the changed accuracy-runner path; the brief-only branch is the writer the row describes.
- Affected surface hints: `--brief-only`, backfill field list, `briefBackfilled`, legacy run logs.
- Disposition: advisory, P2.

---

## 4. Remediation Workstreams

### P0 — none

### P1 — none

### P2 — advisory

1. **Redirect operator parsing** (`score-command-transcripts.mjs`): recognize the `2>`, `&>`, `2>>`
   and `&>>` forms, skip the target and keep scanning, and add the missing test row. This is one
   guard and one test case.
2. **README stored-line sentence** (`README.md:123`): qualify the legacy line so it does not claim
   every stored line lacks `offeredAs`.
3. **README brief-only clause** (`README.md:125`): scope the four-field rewrite to the default
   backfill or move the flag out of the sentence.

None of these blocks the PASS finding verdict. Items 2 and 3 are doc-only and can fold into the
phase 026 doc pass. Item 1 is a small parser guard in the scorer.

---

## 5. Spec Seed

- The routing-accuracy README is the document of record for the two writers. Its stored-line
  sentence must distinguish a line written before `offeredAs` existed from a line the current
  writers produce.
- The `--brief-only` mode copies every offer field exactly as held and recomputes only
  `briefDelivered`. Any field-list sentence that includes the flag must say so.
- The transcript scorer's redirect guard should name the operator forms it accepts. The T009 test
  table covers `cat`, `rg`, an in-place `sed` and a heredoc, but no redirect.
- A shell read of a command document is a start; a redirect target is not a read. The two rules are
  independent and need separate cases.

---

## 6. Plan Seed

- Add `2>`, `&>`, `2>>` and `&>>` to the redirect guard and skip only the target word; add a
  start-state case for `head -n 1 2> <command document>` that expects `started: false`.
- Edit `README.md:123` to name the legacy line and edit `README.md:125` to scope the four-field
  rewrite to the default backfill.
- Re-run the README's own three T030 string checks after the doc edits; no code or test change is
  needed for the two doc findings.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | partial | T006-T011 and T030 are `[x]` with evidence; the offeredAs writers, heredoc, shell read, Codex read and live holdout guard match. T009's redirect claim covers `>` only, and README `:123`/`:125` remain drift. |
| `checklist_evidence` | core | partial | AC-003's `cat`, `rg`, in-place `sed` and heredoc inputs read as described; the brief's redirect input is not in that table. AC-010 is unmet for `:123` and the brief-only clause. `CHK-040` is met. |

### Overlay Protocols

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | notApplicable | The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog page describes the changed accuracy-runner lines. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed. |

### AC_COVERAGE

`exempt`. The review target's root folder has no `acceptance-criteria.md`; the phase children hold
their own criteria, and this lineage's scope is the changed accuracy-runner files.

---

## 8. Deferred Items

- **Phase 026 doc and code items.** The pair-doc shared-row sentence, the reserved `paired` arm name
  and the dead `unscoredOnly` field are assigned to phase 026 by
  `027-review-pass-four-remediation/spec.md:214`. They are recorded as the one search-debt row
  `ARC4C-SL-009`, not re-reported as findings.
- **The redirect parser edge is not deferred.** It is active as `ARC4C-P2-001`.
- **No live per-runtime session was captured.** Runtime behavior is read from the fixed code, the
  committed tests and the 027 evidence.
- **The mention reader is the sibling lineage's surface.** `scorer-attach-close-4c` reads
  `command-attach.ts`; this lineage raises no finding against it.

---

## Dimension Expansion Map

- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Swept directions: none. The two iterations covered correctness/security, then
  traceability/maintainability.
- Remaining frontier: none within the cap.

---

## 9. Search Ledger

- `searchCoverage.requiredBugClasses`: `shell_command_parsing`, `start_detection`,
  `heredoc_parsing`, `path_containment`, `holdout_publication`, `doc_code_drift`,
  `doc_contradiction`, `checklist_evidence`, `deferred_scope`.
- `searchCoverage.covered`: everything except `deferred_scope`.
- `searchCoverage.ruledOut`: `heredoc_parsing`, `path_containment`, `holdout_publication`.
- `searchCoverage.deferred`: `deferred_scope`.
- `searchCoverage.blocked`: none.
- `hasSearchDebt: true`. One row (`ARC4C-SL-009`) records the phase 026 deferral. The dashboard's
  provisional verdict is CONDITIONAL on that debt; the finding-severity verdict is PASS, and the
  cross-lineage merge recomputes from the findings registry.
- `cleanSearchProof`: the heredoc end word, the Codex resolved read, the live holdout guard and the
  two offeredAs writers each carry a direct-read ledger row with file:line evidence.

---

## 10. Audit Appendix

### Convergence Summary

| Iteration | Focus | P0/P1/P2 (new) | newFindingsRatio | Verdict |
|-----------|-------|----------------|------------------|---------|
| 1 | correctness and security | 0/0/1 | 1.0 | PASS |
| 2 | traceability and maintainability | 0/0/2 | 0.6667 | PASS |

- The rolling average of the two ratios is 0.8334, above the 0.10 threshold.
- The cap is 2 and the second iteration still produced new findings, so the stop reason is
  `maxIterationsReached`; convergence was not declared.
- The release-readiness state is `in-progress`.

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability (4 of 4).
- Files: the routing-accuracy README plus the two writers, the transcript scorer, the Codex reader
  and the holdout test (6 of 6).
- Active findings: 3 P2; no P0 or P1.

### Ruled-Out Claims

- `offeredAs` is still dropped by a writer.
- A hyphen or dot heredoc end word is read as a command.
- The Codex reader opens the caller's locator.
- The holdout guard checks only the committed baseline.
- A refusal or question over an or-list carries a command (sibling surface; read as context).

### Sources Reviewed

- `review/review-brief-4c.txt`, `review/review-scope-4c.txt`, `review/verify-4/report.md`.
- `027-review-pass-four-remediation/scratch/review-rounds.txt`, `spec.md:204-238`,
  `tasks.md:84-110`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md`,
  `command-offer.mjs`, `run-command-behaviour.mjs`, `score-command-transcripts.mjs`.
- `.skilled/hooks/shared/session-readers/codex.mjs`,
  `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (context only).

### Cross-Reference Appendix

Core protocols: `spec_code` partial, `checklist_evidence` partial. Overlay protocols:
`skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability`
notApplicable.

Review verdict: PASS
