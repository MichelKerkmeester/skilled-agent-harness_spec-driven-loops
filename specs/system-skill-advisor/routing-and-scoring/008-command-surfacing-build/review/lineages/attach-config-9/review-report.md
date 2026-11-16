# Review Report - attach-config lineage, command-surfacing pass nine

## 1. Executive Summary

- **Overall verdict: PASS** -- derived from the reducer-owned registry, not from this prose: `review-verdict.cjs` reports `verdict: PASS`, `active_p0: 0`, `active_p1: 0`, `active_p2: 1`, `search_debt: 0`, `failed_required_gate_ids: []`.
- **hasAdvisories: true** -- one active P2 advisory remains.
- **P0/P1/P2 counts: 0 / 0 / 1**, the counts the verdict used.
- **Self-check outcomes**: the single P2 was re-read in iteration 4 (compact skeptic and referee). It was confirmed at P2; nothing was downgraded and nothing was called a false positive. No P0 or P1 existed, so no full three-pass replay was owed.
- **Review scope**: the four files from `review/review-scope-9.txt` whose area is `attach-config` -- the typed command matcher, its boundary suite, the advisor vitest config, and the doctor brief test that pins child and parent shapes.
- **Iterations**: 4 of an allowed 8. **Stop reason**: `converged` (`all_dimensions_clean`, weighted stop score 0.70, graph decision `STOP_ALLOWED`).
- **Release readiness**: `converged`.
- **Operator review focus (verbatim)**: "Review pass nine, lineage attach-config-9. Follow review/review-brief-9.txt and review/review-scope-9.txt: area attach-config covers the typed command matcher's suffix chain in runtime/lib/command-attach.ts, the vitest config that clears an inherited AI_SESSION_CHILD and sets a per-run temp folder, and the tests that pin child or parent sessions. Run the graph and stop steps each iteration, honour the holdout rule, and raise no finding the evidence does not support."

### What was reviewed

The pass-nine delta for this area is small and precise. Since pass seven the only production change in these four files is the comment over `MODE_SUFFIX` -- rewritten to state that the shared suffix set applies to any tracked command -- plus two pins in the boundary suite (`/speckit:plan:with-phases` and `/deep:review:with-research`, a modifier on a command whose hint omits it). The `:unattended`/`:with-*`/chained-suffix pattern, the `TMPDIR`/`TEMP`/`TMP` export and the `delete process.env.AI_SESSION_CHILD` line arrived earlier and were reviewed here at `05f776202e0` because the brief's diff base predates them.

Iteration 1 covered correctness: the chain in every ordinal position, the negative boundaries, case folding, the longest-key rule, the retired-name path, the refusal and question leads, and the deep-loop attach gate. Iteration 2 covered security: the per-run temp folder as a trust boundary, the three-variable export, the exit cleanup and the process-wide child-flag clear, checked against every consumer of `AI_SESSION_CHILD` under the advisor runtime. Iteration 3 covered traceability and maintainability: the accepted vocabulary against all 46 command documents and the packet's own record, then whether the branch's boundary decisions are actually held by tests. Iteration 4 was the confirmation pass that re-read every scope file and reconciled registry, state log and deltas.

### Why the verdict is PASS

All four configured dimensions carry a full iteration, the coverage-stabilization pass ran, both core traceability protocols are resolved (`spec_code` pass, `checklist_evidence` notApplicable), no P0 or P1 exists, and the one P2 is an advisory about test coverage rather than a shipped defect. The convergence score and the graph agree, so the stop is `converged` rather than the iteration cap.

## 2. Planning Trigger

`/speckit:plan` is **not required**. The verdict is PASS with one P2 advisory, no P0/P1 and no open search debt. The advisory's one-line fix is recorded in section 4 so it can be applied opportunistically, and the next step after a PASS is a changelog rather than a remediation plan.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "AC9-P2-001",
      "severity": "P2",
      "title": "The suffix chain leading anchor has no test behind it",
      "dimension": "maintainability",
      "file": ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455",
      "findingClass": "missing boundary regression coverage in a changed matcher",
      "fixCompletenessRequired": false
    }
  ],
  "remediationWorkstreams": [],
  "specSeed": [],
  "planSeed": [
    "Add one assertion to the 'does not read a command followed by an unknown suffix' test: typedCommandIn('/speckit:complete:draft:auto now') is undefined, with a comment that the leading anchor is what refuses a chain that does not abut the name."
  ],
  "findingClasses": ["missing boundary regression coverage in a changed matcher"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455"
  ],
  "fixCompletenessRequired": false
}
```

Two registry fields are reported as UNKNOWN rather than inferred: the reducer's open-finding entry carries `findingClass: null` and `affectedSurfaceHints: []` because the delta finding row holds only the required minimum fields. The values above come from the iteration-3 record's `findingDetails` and its narrative, which are the sanctioned sources, and they are identical in both.

## 3. Active Finding Registry

| Field | Value |
|-------|-------|
| ID | `AC9-P2-001` |
| Severity | P2 |
| Title | The suffix chain leading anchor has no test behind it |
| Dimension | maintainability |
| File:line | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455` |
| Evidence | The pattern is `^`-anchored at `command-attach.ts:211`; the four existing negative cases (`:automation`, `:draft`, `:with-everything`, `:auto:draft`) are all refused by the trailing lookahead, so none of them distinguishes an anchored from an unanchored search. A comparison of both shapes on the suite's own inputs shows only `:draft:auto` and `:phase-2:with-research` separate them. |
| Impact | No shipped behaviour is wrong. The next editor who relaxes the pattern can silently start reading a chain that does not abut the command name, and the suite stays green. |
| Fix recommendation | Add one assertion to the existing unknown-suffix test: `typedCommandIn('/speckit:complete:draft:auto now')` is `undefined`, with a comment naming the leading anchor as the reason. |
| Disposition | active, advisory |
| Finding class | missing boundary regression coverage in a changed matcher |
| Scope proof | The pattern, its comment and the boundary suite are this area's own changed surface; the evidence is the suite file at the test that covers unknown suffixes. |
| Affected surface hints | `command-attach.ts:211`, `command-attach-guards.vitest.ts:459` |
| Case | A prompt reads `/speckit:complete:draft:auto the login spec`. Today the matcher returns `undefined`; with the leading anchor removed it would return `/speckit:complete`, and no assertion in `command-attach-guards.vitest.ts` would fail. |

## 4. Remediation Workstreams

No P0 or P1 workstream exists. One P2 advisory, ordered last and independently applicable:

1. **Pin the suffix chain's leading anchor** (P2, `command-attach-guards.vitest.ts:455`). One assertion in the existing unknown-suffix test. It fails for one real reason -- an unanchored suffix search -- that no current test catches. No production code changes.

## 5. Spec Seed

- Record the accepted suffix vocabulary and its shared-set rule in the command-surface specification: `:auto`, `:confirm`, `:autopilot`, `:unattended`, `:with-context`, `:with-phases`, `:with-research`, chained in any order, applied to every tracked command regardless of which hint lists it.
- Record the two boundary decisions the matcher makes, so a later edit has a written contract: a chain must abut the command name, and a suffix followed by a file extension still reads as the command (the recorded trade-off).
- Record that the advisor suite clears an inherited `AI_SESSION_CHILD` and confines every temp write to one per-run folder, with each test that needs a child session setting the flag itself.

## 6. Plan Seed

- Add the leading-anchor assertion described in section 4, and name it so the property is searchable: a chain behind an unknown segment must not read as the command.
- Optional, only if the extension-adjacent trade-off is ever revisited: add a companion assertion pinning `:with-research.md` as the command, so the accepted read is frozen rather than incidental.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The accepted vocabulary is exactly the union of the `argument-hint` suffixes across 46 command files (`:auto` 26, `:confirm` 25, `:unattended` 3, `:autopilot` 3, `:with-phases` 2, `:with-context` 2, `:with-research` 1). No documented suffix is refused and none undocumented is accepted. The diff implements the two packet rows that name the behaviour: D-01 at `goal.md:206` and CRIT-4 at `goal.md:365`. `speckit/complete.md:46-48` classifies the `:with-*` forms as workflow inputs on the same command, which is how the matcher reads them. |
| `checklist_evidence` | notApplicable | The phase-parent packet has no `checklist.md`; the review closes over the area files and the packet's goal rows. |

Unresolved drift: none for the core protocols. One asymmetry is named and left with its owner -- the transcript scorer strips the suffix set only at the end of the command text, while the matcher anchors at the command name; for the ordinary `COMMAND: /x:with-research` form the scorer's route split keeps them aligned, and the scorer's own area owns the residual.

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill or agent definition is in this area's scope. |
| `agent_cross_runtime` | notApplicable | The runtime mirror `dist/runtime/lib/command-attach.js` is build output of the same source, not a second definition. |
| `feature_catalog_code` | notApplicable | No catalog entry is in scope. |
| `playbook_capability` | notApplicable | No playbook entry is in scope. |

`AC_COVERAGE`: **exempt**. The target is a phase-parent spec folder with no `acceptance-criteria.md`, so the lifecycle predicate for the advisory signal is not met.

## 8. Deferred Items

- `AC9-P2-001`, the leading-anchor test gap, is advisory and deferred by choice: it changes no shipped behaviour and its fix is one assertion.
- The `:suffix + file extension` read stays as recorded: `/speckit:plan:with-phases.md` is the command, accepted in the packet as a trade-off. No test pins it; if the trade-off is ever revisited, pin the new decision at the same time.
- Two tokenizer copies still strip only execution-mode suffixes (`lib/scorer/text.ts:45`, `scripts/skill_advisor.py:2997`). A previous pass considered and set this aside as a deliberate tokenization choice; it remains an asymmetry between what the matcher accepts and what the tokenizer ignores.
- The advisor suite's temp folder survives a signal-killed run, because an exit handler does not run on a signal. Recorded in the config's own comment; not re-raised.
- The convergence decision is printed by `convergence.cjs` and carried in the next iteration record rather than appended as its own state-log event, because the append gateway accepts no review event of that name (`deep-review.yaml:955` records the same limit for its own stop row).

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: maintainability of the matcher's boundary, security of the test environment, correctness of the suffix chain
- Pivot lineage: none yet
- Remaining frontier: the extension-adjacent read and the tokenizer asymmetry, both recorded and deferred

This section records breadth only. It does not alter the verdict, the advisory flag, the finding registry or the self-check result.

## 9. Search Ledger

- `searchCoverage`: not captured in a v2 record; this lineage ran the legacy v1 iteration shape, so no `requiredBugClasses` / `covered` / `deferred` ledger exists.
- `candidateCoverage`: none.
- `searchDebt`: none -- `review-verdict.cjs` reports `search_debt: 0`.
- `ruledOutCandidates`: the chain's backtracking behaviour, a false `:auto` inside `:automation`, regex injection from prompt text, a stale suffix copy inside the area, a second renderer environment dependency, a temp-folder exposure, a security regression from the flag clear, a missing documented suffix, a per-command vocabulary requirement in the packet, and a spec contradiction in `spec.md`.
- `cleanSearchProof`: every scope file was read at the reviewed commit and probed where the behaviour was executable (the matcher imports nothing, so it was called directly); the document sweep covered all 46 command files rather than a sample.

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

### Convergence Summary

| Iteration | Focus | Dimensions | newFindingsRatio | Findings P0/P1/P2 | Status |
|-----------|-------|------------|------------------|-------------------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability, maintainability | 1.00 | 0/0/1 | complete |
| 4 | confirmation | all four | 0.00 | 0/0/0 | complete |

Stop: `converged` at iteration 4 of 8. Weighted stop score 0.70; graph decision `STOP_ALLOWED` with every signal at threshold (`dimensionCoverage 1.0`, `findingStability 1.0`, `p0ResolutionRate 1.0`, `evidenceDensity 1.0`, `hotspotSaturation 1.0`). Coverage age 1: full dimension coverage arrived at iteration 3 and the confirmation pass supplied the stabilization record.

### Coverage Summary

| Dimension | Status | Files |
|-----------|--------|-------|
| correctness | complete | all four scope files |
| security | complete | `vitest.config.ts`, both test files, matcher input boundary |
| traceability | complete | all four scope files, the 46 command documents, the packet rows |
| maintainability | complete | all four scope files, the boundary suite's coverage |

### Ruled-Out Claims

- Catastrophic backtracking in the repeated suffix group: each repetition consumes at least one character after a mandatory colon and the alternatives are prefix-distinct apart from `auto`/`autopilot`, which costs one backtrack per repetition.
- A false `:auto` match inside `:automation`: the trailing lookahead rejects the following letter and the chain cannot fall back to zero repetitions.
- Regex injection from prompt text: the suffix pattern is a constant, and the one prompt-built pattern still escapes its phrase.
- A second renderer environment dependency: `render.ts` reads only `AI_SESSION_CHILD`.
- A temp-folder exposure: `mkdtempSync` creates the folder owner-only, and the three-variable export points more children at that same protected folder.
- A security regression from clearing the child flag: the clear is test-process only, production reads the flag at `render.ts:529`, and every child-shape test injects it.
- A missing documented suffix: the 46-file sweep found none.
- A per-command vocabulary requirement: no packet requirement narrows the set per command, and the rewritten comment now states the shared-set rule.
- A spec contradiction: the only command-related criterion, that no typed command is ambiguous with its own owner, is still enforced by `typedCommandForTop`.

### Sources Reviewed

`review/review-brief-9.txt`; `review/review-scope-9.txt`; the four scope files at `05f776202e0` and their diffs from `85550ee946e`; `.skilled/commands` argument hints (46 files); `.skilled/commands/speckit/{plan,complete,implement}.md`; `.skilled/commands/deep/review.md`; `runtime/lib/render.ts`; `runtime/lib/metrics.ts`; `runtime/lib/scorer/text.ts`; `runtime/scripts/routing-accuracy/score-command-transcripts.mjs`; `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`; `runtime/scripts/skill_advisor.py`; `runtime/tests/{command-behaviour-guards,render-child-session,measure-brief-cost,command-brief-golden}.vitest.ts`; `system-spec-kit/runtime/tests/_support/vitest-setup.ts`; `specs/.../008-command-surfacing-build/{spec.md,goal.md,decision-record.md}`.

### Cross-Reference Appendix - Core Protocols

| Protocol | Status | Iteration |
|----------|--------|-----------|
| `spec_code` | pass | 4 |
| `checklist_evidence` | notApplicable | 1 |

### Cross-Reference Appendix - Overlay Protocols

| Protocol | Status | Iteration |
|----------|--------|-----------|
| `skill_agent` | notApplicable | 3 |
| `agent_cross_runtime` | notApplicable | 3 |
| `feature_catalog_code` | notApplicable | 3 |
| `playbook_capability` | notApplicable | 3 |
