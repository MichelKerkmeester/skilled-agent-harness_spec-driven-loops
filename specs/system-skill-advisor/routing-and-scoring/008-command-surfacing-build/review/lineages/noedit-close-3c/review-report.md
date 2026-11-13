# Review Report - Command Surfacing, Pass Three Closing Round (noedit-close-3c lineage)

- Run: `fanout-noedit-close-3c-1794596804847-827gze`
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Base / HEAD: `846eab66b8984c0e745a768fcc12f176ebdf1991` (the final pass-three commit)
- Lineage artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/noedit-close-3c`
- Stop reason: `maxIterationsReached` (3 of 3; the third iteration added no new finding)

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: **false** (the algorithm reserves `true` for a PASS carrying P2; this run has an active P1, and two active P2 are listed below as advisories)
- Active findings: **P0 0, P1 1, P2 2**
- Review scope: the final state of the no-edit gate (`NO_EDIT_REQUEST`, `isNoEditRequest`) and its three callers, then the doctor hook check (`readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`), each with its test file.
- Operator review focus: "Code review of command surfacing, PASS THREE closing round. FIRST read the full instructions in /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3c.txt and follow them exactly, including the two settled decisions you must not report again. Scope: the final state of the doctor hook check and the no-edit pattern. Every finding is P0, P1 or P2 with file:line and a concrete input you ran. Finding nothing new is a valid result. Never open holdout-prompts.jsonl. Change no code, write only inside your lineage folder."

### What this lineage did with the two settled decisions

| Settled decision | Handling |
|---|---|
| "make no changes" rules out a change whatever follows it | Not re-reported. The settled control was run once (`refactor the parser and make no changes to its public api` → matched, no command) and left alone. |
| The hook check is a wiring heuristic, not a node or shell parser | Not re-reported. `bash -o pipefail -c` and `command node` misreads are recorded as edge cases in iteration 2, not findings. |

### The two review areas, judged

| Area | New findings | Evidence |
|---|---|---|
| No-edit gate | **P1 1, P2 1** | `don't create it yet` / `don't write the file yet` are not matched and keep `/create:changelog`; `just show … then create it` is matched and loses it, while the same sentence without "just" keeps it. Both were run through the shipped modules. |
| Doctor hook check | **P2 1** | A valid `node --env-file .env <marker>` reports `hook-missing` exit 1, while `node --env-file=.env <marker>` reports `ok` exit 0. Run as a process against a `mktemp` checkout. |

## 2. Planning Trigger

`/speckit:plan` is required for this lineage: the verdict is CONDITIONAL because `NC3-P1-001` is active. The P1 is a one-line widening of the negative-instruction verb list plus tests; the two P2 advisories can ride along.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "NC3-P1-001",
      "severity": "P1",
      "title": "NO_EDIT_REQUEST omits the write verbs, so \"don't create it yet\" keeps a mutating command",
      "dimension": "correctness",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292",
      "findingClass": "class-of-bug",
      "scopeProof": "the matcher is the changed line and the attach gate is its caller (:338); the probe prompt is a hub naming prompt with one selected mode, the shape attachCommand requires",
      "affectedSurfaceHints": ["hub command attachment", "/create:* mutating offers", "shared matcher consumed by fusion.ts:677, fusion.ts:881 and text.ts:150"],
      "evidence": "use sk-doc to plan the changelog, don't create it yet -> isNoEditRequest false, isReadOnlyExplainer false, attachCommand returns /create:changelog; control with don't change anything yet -> undefined",
      "disposition": "required"
    },
    {
      "id": "NC3-P2-002",
      "severity": "P2",
      "title": "\"just show\" and \"just list\" read a two-step change request as a no-edit request",
      "dimension": "correctness",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292",
      "findingClass": "class-of-bug",
      "scopeProof": "both prompts exercise the changed matcher through the hub gate at :338 with the same single-mode route; the only input difference is the word just",
      "affectedSurfaceHints": ["hub command attachment", "two-step look-first-then-change prompts", "shared matcher read-only branches"],
      "evidence": "just show me the changelog draft, then create it -> matcher true, command undefined; show me the changelog draft, then create it -> matcher false, command /create:changelog",
      "disposition": "advisory"
    },
    {
      "id": "NC3-P2-003",
      "severity": "P2",
      "title": "A valid node flag whose value stands in the next word is read as the hook script, so a wired hook reports hook-missing",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:222",
      "findingClass": "class-of-bug",
      "scopeProof": "the skip is on the reviewed line (the NODE_FLAGS_WITH_ARGUMENT set at :222, consumed at :277) and the probe command is a valid node invocation that runs the hook script named in the settings file",
      "affectedSurfaceHints": ["/doctor hook wiring diagnosis", "claude/codex/cursor/devin hook rows", "doctor-setup and doctor-symlink-check delivery legs"],
      "evidence": "settings command node --env-file .env <marker> -> hook-missing claude .claude/settings.json exit 1; node --env-file=.env <marker> -> ok claude exit 0",
      "disposition": "advisory"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P1",
      "findings": ["NC3-P1-001"],
      "action": "Extend the negative-instruction alternative to the write verbs a reader actually uses (create, write, save, and their relatives) and add a genuine no-edit case with an object to command-attach-guards.vitest.ts that calls attachCommand, not only the matcher."
    },
    {
      "order": 2,
      "severity": "P2",
      "findings": ["NC3-P2-002", "NC3-P2-003"],
      "action": "Anchor the just show / just list markers to the end of the request, or require that no write verb follows in the same sentence; add --env-file and --title to the node argument-taking flag set with the separated and attached forms as two test rows."
    }
  ],
  "specSeed": [
    "Record the rule the matcher must honour: a negative instruction rules out the change whichever write verb names it, and a read-only opener that is followed by a change verb is not a no-edit request.",
    "Record that the hook check reads a node launch word by word, including a flag whose value stands in the next word."
  ],
  "planSeed": [
    "Add the failing probe as a case: use sk-doc to plan the changelog, don't create it yet (no-edit, no command).",
    "Add the paired control: use sk-doc to plan the changelog, don't change anything yet (already matched).",
    "Add the two-step case: just show me the changelog draft, then create it keeps /create:changelog.",
    "Add a hook case for node --env-file .env <marker> expecting ok, beside the existing node --no-warnings row."
  ],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts",
    ".skilled/commands/doctor/scripts/hook-wiring-check.cjs",
    ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|-------|-----------|----------|--------|--------------------|-------------|---------------|-------------|------------------------|
| NC3-P1-001 | P1 | correctness | NO_EDIT_REQUEST omits the write verbs, so "don't create it yet" keeps a mutating command | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` | `isNoEditRequest('use sk-doc to plan the changelog, don't create it yet')` false; `attachCommand` returns `/create:changelog`; the control with `don't change anything yet` returns `undefined` | A reader who rules out the creation is handed a `mutates` command offer, the exact failure the guard exists to prevent | Add create/write/save to the negative-instruction alternative and pin an object-bearing no-edit case through `attachCommand` | required | class-of-bug | matcher on the changed line; gate at `:338`; route mode `sk-create-changelog` is `mutatesWorkspace: true` in `mode-registry.json:317-336` | hub attach path; `/create:*`; three shared-matcher callers |
| NC3-P2-002 | P2 | correctness | "just show" and "just list" read a two-step change request as a no-edit request | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` | `just show me the changelog draft, then create it` → matcher true, no command; without "just" → matcher false, `/create:changelog` | A change request loses its command offer because of one read-only opener | Anchor the marker to the end of the request or require no write verb after it | advisory | class-of-bug | same matcher, same gate, one-word input difference | hub attach path; two-step prompts |
| NC3-P2-003 | P2 | correctness | A valid node flag whose value stands in the next word is read as the hook script | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:222` | `node --env-file .env <marker>` → `hook-missing` exit 1; `node --env-file=.env <marker>` → `ok` exit 0; node accepts both forms | A correctly wired hook is reported missing and the operator chases the wrong repair | Add the argument-taking flags outside the module-loader family (`--env-file`, `--title`) to the set | advisory | class-of-bug | skip at `:277`; valid node invocation; no shell construct | `/doctor` hook wiring diagnosis; four runtime rows; two doctor delivery legs |

## 4. Remediation Workstreams

### P0

None.

### P1

1. **Widen the negative-instruction verbs (`NC3-P1-001`).** In `command-attach.ts:292`, extend `(?:do not|don't) (change|edit|modify|touch)` to the write verbs a reader uses when refusing work (`create`, `write`, `save`). Add to `command-attach-guards.vitest.ts` a case that calls `attachCommand` with a single-mode `sk-create-changelog` route on `use sk-doc to plan the changelog, don't create it yet` and expects `undefined`, plus the `don't write` and `don't save` variants at the matcher level.

### P2 advisories (separate, non-blocking)

2. **Anchor the read-only markers (`NC3-P2-002`).** Make `just show` / `just list` match only when the request does not continue into a change, or move them to a list of openers that a later write verb overrides. Add the paired rows (`just show … then create it` → no match; `show … then create it` → match stays as today).
3. **Complete the node argument set (`NC3-P2-003`).** Add `--env-file` and `--title` to `NODE_FLAGS_WITH_ARGUMENT`, with one test row for the separated form next to the existing `node --no-warnings` row. Leave the quoted-value and shell-grammar cases to the settled decision.

## 5. Spec Seed

- The no-edit contract should say that a negative instruction rules out the change whichever write verb names it, and that an object after the phrase never decides the reading alone (the settled cost stays).
- The no-edit contract should say that a read-only opener followed by a change verb is a change request, not a refusal.
- The hook contract should say that the check reads a node launch word by word, including a flag whose value stands in the next word, and that shell-grammar shapes remain out of scope by decision.

## 6. Plan Seed

- Add the failing no-edit probe as an `attachCommand` test: `use sk-doc to plan the changelog, don't create it yet` → `undefined`.
- Add the matcher rows for `don't write the file yet` and `do not save them yet`.
- Add the two-step rows: `just show me the changelog draft, then create it` keeps `/create:changelog`; `show me the changelog draft, then create it` stays as today.
- Add the hook row: settings command `node --env-file .env <marker>` → `ok claude` exit 0.
- Run the two single test files named in the review focus, not the full suite.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass with the two findings standing as the gap | `runtime/lib/README.md:132`, `scorer/README.md:55`, `feature-catalog/scorer-fusion/command-meaning-matching.md:36`, `feature-catalog/cli-surface/advisor-recommend.md:33` all describe the final code | none |
| `checklist_evidence` | partial | `014-review-remediation/acceptance-criteria.md:60` (AC-005) claims the no-edit prompt attaches nothing and `fusion.ts` reads the same pattern; both hold | the two pass-three commits are post-acceptance remediation with no checklist row of their own |

AC_COVERAGE: **disabled** — the advisory signal applies only when the validation rule runs for a Level 2+ spec folder; this lineage did not run validation and makes no claim from it.

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `feature_catalog_code` | pass | `command-meaning-matching.md:36` names the same four markers and both gates | none |
| `agent_cross_runtime` | partial | `doctor-setup.yaml:61` and `doctor-symlink-check.yaml:60` describe the check's exit roles correctly; all four runtime files in this checkout print `ok` | `NC3-P2-003` is one valid launch inside the model that still reports exit 1 |
| `skill_agent` | notApplicable | no agent or command document changed in scope | none |
| `playbook_capability` | notApplicable | no playbook surface in either file | none |

Security was assessed in iteration 3 as a no-applicable-surface audit: neither module executes reviewed input, the matcher pattern is a literal with no user-built pattern, and the hook check only reads JSON and compares strings.

## 8. Deferred Items

- The stale `014-review-remediation/implementation-summary.md` "Known Limitations" rows (items 1 and 4) describe the pre-pass-two state. The section dates itself with "Review pass two has not run", so it is historical context, not a live claim; updating it belongs to the phase-014 owner, not this review.
- The shell-grammar shapes the hook check does not read (`bash -o pipefail -c`, `command node`) stay deferred under the second settled decision.

## Dimension Expansion Map

- Completed pivots: 0; failed pivots: 0; audited overrides: 0
- Swept directions: none
- Selected review directions: no-edit gate correctness (iteration 1), hook check correctness (iteration 2), traceability and maintainability (iteration 3)
- Remaining frontier: none recorded; the loop hit the iteration cap with the frontier empty

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New findings | newFindingsRatio | Status |
|---|---|---|---|---|
| 1 | correctness (no-edit gate) | P1 1, P2 1 | 1.0 | complete |
| 2 | correctness (hook check) | P2 1 | 1.0 | complete |
| 3 | traceability + maintainability | none | 0 | complete |

- Stop reason: `maxIterationsReached` (iteration cap 3; the third iteration added no finding, so no fourth pass was available to confirm stabilization)
- Convergence score at close: 1.00 (reducer); release-readiness state: `in-progress`
- Verdict derivation: active P0 = 0, active P1 = 1 → CONDITIONAL

### Coverage summary

| Dimension | Covered | Iterations | Notes |
|---|---|---|---|
| correctness | yes | 1, 2 | no-edit gate and hook check |
| traceability | yes | 3 | core and overlay status above |
| maintainability | yes | 3 | comments, docs, test comments |
| security | assessed | 3 | no-applicable-surface audit; no iteration record emitted |

### Ruled-out claims

- Regex backtracking, `lastIndex` state, non-string input, and the curly-apostrophe fold (iteration 1).
- Crash/hang in the hook check, marker-suffix false positives, vacuous launch tests (iteration 2).
- Stale third pattern copy, stale lookahead prose, crossed doctor exit codes, an unstated runtime row (iteration 3).

### Deliberately skipped workflow steps

- **Cross-lineage merge (`step_fanout_merge`)**: the parent fan-out runner owns the merge over all lineage registries; running it here would write outside this lineage's authority.
- **Continuity save (`phase_save` / `generate-context.js`)**: barred by the dispatch, which limits every write to this lineage directory.
- **Resource map emission**: the workflow skips it for a fan-out lineage (`config.fanout` present).

### Sources reviewed

- The two changed source files, their two test files, the three shared-matcher callers, the packet's AC-005 row, the phase-014 known-limitations list, the two feature-catalog rows, the two library README rows, the sk-doc mode-registry entry, and the two doctor delivery assets.
- Never opened: `holdout-prompts.jsonl` or any holdout prompt text.

### Cross-reference appendix

- `Core Protocols`: `spec_code` pass-with-gaps, `checklist_evidence` partial.
- `Overlay Protocols`: `feature_catalog_code` pass, `agent_cross_runtime` partial, `skill_agent` notApplicable, `playbook_capability` notApplicable.
