# Review Report - attach-docs-8

Lineage: `attach-docs-8`, area `attach-docs`, code review pass eight.
Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
Scope: the three files from `review/review-scope-8.txt` whose area is `attach-docs`, plus the pass-seven lineage report it cites.

## 1. Executive Summary

- **Overall verdict: PASS.** `hasAdvisories: true` because one P2 remains active.
- **Active findings: P0=0, P1=0, P2=1**, the counts `review-verdict.cjs` read from the registry.
- **Adversarial self-check:** no active P0 or P1 existed, so no claim needed a Hunter/Skeptic/Referee pass. One reducer summary row, `SUMMARY-P2-001`, was withdrawn as `none`: iteration 5's summary count repeated the one active P2 rather than reporting a new finding, and the false-positive adjudication is recorded in the state log.
- **Review scope:** the typed-command matcher comment and suffix tests in `.skilled/skills/system-skill-advisor/runtime/`, and this branch's net change to `CONTRIBUTING.md` against `origin/main`.
- **Iterations:** 5 of 5. **Stop reason:** `maxIterationsReached`. **Terminal gates:** evidence pass, scope pass, coverage pass.
- **Operator review focus (verbatim):** "Review pass eight. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-8.txt and follow it: it names your area by lineage label, the scope file review/review-scope-8.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder."

### What was reviewed

The branch change under this area is small: commit `3416b5e0526` rewords the matcher comment above `MODE_SUFFIX`, and the branch's net change to `CONTRIBUTING.md` renames `/create:skill` to `/create:sk-skill` at line 155. The test file is unchanged in the reviewed range (`1c3d62def5a..3416b5e0526`); its suffix cases from phase 038 are the standing guard for the reworded comment and were reviewed as such.

The five iterations covered correctness, traceability, security and maintainability, then a stability pass. They re-ran the matcher against the documented suffix union, swept all 46 `argument-hint` files, resolved every command `CONTRIBUTING.md` names, probed the no-edit and owner gates with a suffixed command, and grepped the test matrix for every advertised modifier. The one finding is the missing `:with-phases` test row pass seven's own plan seed asked for.

## 2. Planning Trigger

`/speckit:plan` is **not required**. The verdict is PASS with one advisory P2; the review verdict table routes PASS to `/create:changelog`, and a one-line test addition does not need a remediation plan.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["R4-P2-001"],
  "remediationWorkstreams": [],
  "specSeed": [
    "If the shared suffix rule is the intended contract, name it in the phase spec and in AC-003 rather than only in a code comment, so the test matrix has a stated requirement to follow."
  ],
  "planSeed": [
    "Optional: add one suffix case, `/speckit:plan:with-phases add a login page`, to `tests/command-attach-guards.vitest.ts` so the `phases` alternative and the shared-rule sentence both fail a suite when removed."
  ],
  "findingClasses": ["matrix/evidence"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### R4-P2-001 -- The rewritten comment defines a shared suffix rule that no suffix test pins, and the documented `:with-phases` modifier has no positive case

- **Severity**: P2
- **Dimension**: maintainability
- **File:line**: `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442` (affected surfaces `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211`, `.skilled/commands/speckit/plan.md:3`)
- **Evidence**: the comment now says a `:with-*` modifier typed on a command that does not take it still names that command, and `MODE_SUFFIX` reads `:with-phases`. The suffix suite types only modifiers each tested command advertises and never types `:with-phases`; the prior remediation record asked for exactly that case.
- **Impact**: a maintainer who narrows the set (the other option pass seven offered) makes `/speckit:plan:with-phases add a login page` stop reading as `/speckit:plan`, while every suffix test stays green. The comment is then the only record of the rule.
- **Fix recommendation**: add one `it` case for `/speckit:plan:with-phases add a login page` (and optionally `/speckit:plan:with-research`, a modifier `plan.md` does not advertise).
- **Disposition**: active, advisory.
- **Finding class**: `matrix/evidence`
- **Scope proof**: the suffix tests are the only guard for `MODE_SUFFIX`; a grep of `tests/` finds no `:with-phases` case and no `:with-*` case on a command that does not advertise it.
- **Affected surface hints**: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211`, `.skilled/commands/speckit/plan.md:3`, `.skilled/commands/speckit/complete.md:3`

## 4. Remediation Workstreams

**P0 / P1:** none.

**P2 advisories, in order:** no remediation workstream is required for PASS. The single advisory follow-up is recorded in Deferred Items; it is a one-line test addition to the suite in this area.

## 5. Spec Seed

- One typed-command suffix vocabulary is shared by the attach matcher and the transcript scorer, and it is described today in a code comment and the scorer README. If the shared union is the contract, the phase spec or AC-003 should name `:with-phases` and the shared rule so the test matrix follows a requirement rather than a comment. No spec delta is required for the PASS itself.

## 6. Plan Seed

1. Optional: add `/speckit:plan:with-phases add a login page` and `/speckit:plan:with-research add a login page` to the suffix suite; the first should stay `/speckit:plan` under the shared rule, and both would fail if the set is narrowed without a decision.
2. No other implementation step is needed. The documentation rename is complete and every command it names resolves.

## 7. Traceability Status

**Core protocols**

- `spec_code`: **pass**. REQ-003 and AC-003 are satisfied for every input they enumerate (`:unattended`, `:with-research`, `:with-context`, `:auto:with-research`, `:with-everything`, `:auto:draft`), and the attacher's suffix union equals the transcript scorer's. The active P2 sits outside the enumerated matrix and is recorded as a matrix/evidence gap, not an AC failure. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/acceptance-criteria.md:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `checklist_evidence`: **notApplicable**. The target is a phase-parent packet with no `checklist.md`; the pass-eight brief and scope file are the operative checklist. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1]

**Overlay protocols**

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: **notApplicable**. The area is a runtime library, its tests and a root contribution guide; no skill definition, agent mirror, feature catalog or playbook is in the changed surface.

**AC_COVERAGE**: exempt. The phase-parent target has no `acceptance-criteria.md`; the child phases own theirs.

`resource-map.md` is absent at init, so the Resource Map Coverage Gate section is omitted.

## 8. Deferred Items

- **The `:with-phases` guard case** (the active P2, advisory): the positive suffix tests pin `:with-research` and `:with-context` but never `:with-phases`. Recorded as P2 because the current matcher returns the right command; the risk is a silent regression path, not a present misread.
- **Recorded limits carried from the brief, not re-reported**: a suffix followed by a file extension (`:auto.md`) reads as the command, the `node -e` arrow inside escaped quotes still reads as a redirect, and `isolation-check.sh` is macOS only.
- **Accepted packet limits, not re-raised**: a retired name typed in a question or refusal still attaches its successor (phase 020 spec and decision P045); the current pass reproduced it only to confirm no new input breaks it.
- **Empty coverage graph**: the fan-out lineage owns no seed, so the graph signals stay at zero. The three required terminal gates were computed from the config, state log and registry and all pass.

## Dimension Expansion Map

No divergent pivot ran. `divergence.saturatedDirections` is empty, completed and failed pivots are 0, audited overrides are 0, and no Council artifact exists for this lineage. Remaining frontier: none recorded. This section records breadth only and does not alter the verdict or the registry.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

`searchCoverage`, `candidateCoverage` and `searchDebt` are empty in the registry. The search depth for this area was direct diff reading plus source-reproduced matcher probes, recorded per iteration in this lineage's `iterations/iteration-00N.md` sections "Findings - New", "Integration Evidence", "Edge Cases" and "Ruled Out".

## 10. Audit Appendix

### Convergence Summary

- Iterations: 5. newFindingsRatio per iteration: 0.0, 0.0, 0.0, 1.0, 0.0.
- Stop decision: `STOP`, reason `maxIterationsReached`. Terminal gate rows: evidence pass, scope pass, coverage pass; failed required gate ids `[]`.
- Dimensions: correctness (iteration 1), traceability (2), security (3), maintainability (4), stability pass (5). Coverage complete, coverage age 1 at the stop.

### Coverage Summary

- Dimensions: 4 of 4 covered, each with a full iteration, plus the stability pass.
- Traceability protocols: `spec_code` pass, `checklist_evidence` notApplicable, `unfinishedCoreProtocols` empty.
- Open findings by severity: P0 0, P1 0, P2 1. Resolved: 1 (the `SUMMARY-P2-001` false positive).

### Ruled-Out Claims

- Catastrophic backtracking in `MODE_SUFFIX`: every repetition consumes one colon-prefixed literal, alternatives are prefix-disambiguated, and the trailing lookahead fails once, so scanning stays linear.
- A false `:auto` match inside `:automation` or `:autopilot2`: the negative lookahead and the chain's inability to settle on a shorter prefix keep it out.
- A longest-key regression from the suffix branch: `/create:skill-parent:auto` keeps the longer key because the shorter retired key is rejected by the `-parent` continuation.
- A prompt-controlled regex injection: the suffix pattern is a constant and `escapePhrase` guards the mention pattern.
- A suffix that escapes the no-edit gate: `attachCommand` consults `isNoEditRequest` first and returns no command.
- A missing command name in `CONTRIBUTING.md`: all six names resolve under `.skilled/commands`.
- A documented suffix the matcher refuses: the 46-hint sweep found only the seven-token union.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (197-245, 256-264, 316, 351-357, 417-445, 465-519)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (396-502)
- `CONTRIBUTING.md` (36, 155) and `git diff origin/main HEAD -- CONTRIBUTING.md`
- `.skilled/commands/create/sk-skill.md`, `skill-parent.md`, `command.md`, `agent.md`; `.skilled/commands/doctor/setup.md`, `mcp.md`
- `.skilled/commands/*/**.md` argument hints (46 files) and `.skilled/commands/speckit/{complete,plan,implement}.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` as integration evidence
- `038-alignment-p1-remediation/spec.md` (REQ-003), `acceptance-criteria.md` (AC-003), `tasks.md` (T004, T013, CHK-042)
- `review/lineages/attach-config-7/review-report.md` (pass-seven findings and plan seed)
- `review/review-brief-8.txt`, `review/review-scope-8.txt`

### Core Protocols

- `spec_code` pass, `checklist_evidence` notApplicable (see section 7).

### Overlay Protocols

- All four notApplicable for this area (see section 7).
