# Review Report - attach-config lineage, command-surfacing pass seven

## 1. Executive Summary

- **Overall verdict: FAIL** — gate-level, not defect-level. No P0 and no P1 finding exists. Two P2 advisories are active. The FAIL comes from one required terminal quality gate: coverage stability was not achieved before the iteration cap.
- **hasAdvisories: false** — the advisory flag applies only to a PASS verdict.
- **Active findings: P0=0, P1=0, P2=2.**
- **Review scope**: the five files from `review/review-scope-7.txt` whose area is `attach-config`, reviewed against the command documents they depend on.
- **Iterations**: 3 of 3. **Stop reason**: `maxIterationsReached`.
- **Release readiness**: `in-progress`.
- **Operator review focus (verbatim)**: "Review pass seven. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-7.txt and follow it: it names your area by lineage label, the scope file review/review-scope-7.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder."

### What was reviewed

The branch change under this area is commit `38aa768f9da`'s attach-config surface: the typed command matcher now reads `:unattended`, the `:with-context`/`:with-phases`/`:with-research` modifiers and chains of them as the command; the advisor vitest config clears an inherited `AI_SESSION_CHILD` and gives each run its own temp folder; the doctor-brief test pins the parent shape; the arena test checks its own buffer premise.

Iteration 1 covered correctness: suffix chain, boundaries, longest-key rule, the deep-loop attach gate, and the temp-folder environment handling. Iteration 2 covered traceability: every `argument-hint` in the repository against the matcher's vocabulary, then the downstream parser that names the same typed command. Iteration 3 covered security and maintainability: the test-environment trust boundary, pattern injection, temp-folder permissions, comment accuracy and test coverage.

### Why the verdict is FAIL

The review itself is complete for its declared scope: all four configured dimensions have a full iteration, both findings carry file:line evidence and a concrete input, and every finding sits inside the dispatched review scope. The terminal coverage gate still fails for one mechanical reason:

- `coverageAge = 0`. `security` and `maintainability` were first covered in iteration 3, the same iteration the cap ended the loop, so the required one-pass coverage stabilization never ran (`terminal-gates.cjs` reason `coverage-too-young`).

The config conflict is real: `maxIterations=3` with four dimensions and a one-pass stabilization requirement cannot satisfy coverage stability. The evidence and scope gates pass, and the registry records `traceabilityCovered: true` with no unfinished core protocol, so this is not a missing-check false negative. The gate is carried in section 8.

## 2. Planning Trigger

`/speckit:plan` is required for the two advisory remediations and for the coverage-stability follow-up. The packet is built from the reducer registry plus the iteration `findingDetails`; no field is inferred from prose.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["R2-P2-001", "R3-P2-002"],
  "remediationWorkstreams": [
    "WS-1 Align the transcript scorer's command parser with the widened suffix vocabulary",
    "WS-2 Correct or scope the matcher's shared-suffix comment",
    "WS-3 Run one coverage-stabilization pass before the next stop"
  ],
  "specSeed": [
    "State one shared typed-command vocabulary for the attach matcher and the transcript scorer, or derive both from the command argument-hints.",
    "Decide whether the accepted suffix set is per command or shared, and say so where the matcher defines it."
  ],
  "planSeed": [
    "Extend the transcript scorer's commandParts to strip :with-* modifiers and their chains, then add a case that pins /speckit:complete:with-research as speckit:complete.",
    "Reword command-attach.ts:203 or replace the constant with a per-command set derived from argument-hint.",
    "Add a :with-phases case to command-attach-guards.vitest.ts so the second advertised modifier is pinned.",
    "Re-run this lineage with maxIterations 4, or with all four dimensions covered by iteration 2, so coverageAge reaches 1 before the stop."
  ],
  "findingClasses": ["cross-surface contract drift in a measurement path", "documentation accuracy for a shared routing vocabulary"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### R2-P2-001 — The widened suffix vocabulary is not mirrored in the transcript scorer's command parser

- **Severity**: P2
- **Dimension**: traceability
- **File:line**: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210` (affected surface `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:612`, `:623`, `:697`)
- **Evidence**: `commandParts` strips only a trailing `:(auto|confirm|autopilot|unattended)`. Reproduced outside the repository: `/speckit:complete:with-research` becomes `{namespace:"speckit", name:"complete:with-research"}` and `namesCommand` returns false against the expected `speckit:complete`.
- **Impact**: a stored run that typed a with-modified command is scored as not naming it, so the routing accuracy metric undercounts those offers. The user-facing attach path is correct.
- **Fix recommendation**: strip `:with-*` modifiers and chains in the scorer's `MODE_SUFFIX`, or source both parsers from one shared suffix table.
- **Disposition**: active, advisory.
- **Finding class**: cross-surface contract drift in a measurement path
- **Scope proof**: the widened constant is in this area; the consumer is a named integration surface.
- **Affected surface hints**: `score-command-transcripts.mjs:612`, `:623`, `:697`

### R3-P2-002 — The matcher applies one shared suffix vocabulary to commands that advertise no `:with-*` modifier, and the comment states the opposite

- **Severity**: P2
- **Dimension**: maintainability (registry records security as the first listed dimension of the iteration)
- **File:line**: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203`
- **Evidence**: `plan.md:3` advertises `:with-context` and `:with-phases` but not `:with-research`; `deep/review.md:3` advertises only `:auto|:confirm`; the shared constant still reads every modifier after every command.
- **Impact**: the comment states a per-command documentation rule that the code does not implement, so a follow-on editor would widen the set further on a false premise.
- **Fix recommendation**: derive the set per command from `argument-hint`, or reword the comment to describe a shared union accepted after every command.
- **Disposition**: active, advisory.
- **Finding class**: documentation accuracy for a shared routing vocabulary
- **Scope proof**: comment and constant are both in `command-attach.ts`.
- **Affected surface hints**: `.skilled/commands/deep/review.md:3`, `.skilled/commands/create/sk-skill.md:3`, `.skilled/commands/speckit/plan.md:3`

## 4. Remediation Workstreams

**P2 advisories, in order**

1. **WS-1 Scorer parser alignment** (R2-P2-001): strip `:with-*` and chained suffixes in `commandParts`, then pin `/speckit:complete:with-research` and `/speckit:complete:auto:with-research` in the transcript score suite.
2. **WS-2 Vocabulary scope** (R3-P2-002): choose per-command or shared, then make the comment and the constant agree. Add the missing `:with-phases` guard case while there.

**Coverage follow-up (the FAIL cause)**

3. **WS-3 Coverage stabilization**: run one more pass with all four dimensions already covered, or raise `maxIterations` to 4, so `coverageAge` reaches 1 before the stop. No code change is involved.

## 5. Spec Seed

- One typed-command vocabulary is shared by the attach matcher and the transcript scorer, or each is derived from the command documents. A hand-widened constant in one place and a different rule in the other is the state that produced R2-P2-001.
- The accepted suffix scope is stated once: per command or shared. R3-P2-002 exists because the comment and the code disagree about which one it is.

## 6. Plan Seed

1. Extend `commandParts` in `score-command-transcripts.mjs` to strip `:with-context`, `:with-phases`, `:with-research` and chains, then add a transcript score case for the chain.
2. Reword `command-attach.ts:203-206` or replace the constant with a per-command set read from the command rows.
3. Add `/speckit:plan:with-phases` and `/speckit:plan:with-research` to `command-attach-guards.vitest.ts` so the per-command question is pinned either way.
4. Re-run the lineage with `maxIterations: 4` or with four dimensions covered by iteration 2.

## 7. Traceability Status

**Core Protocols**

- `spec_code`: **pass**. The accepted suffix set equals the union of every `argument-hint` under `.skilled/commands` (46 files: `:auto` 26, `:confirm` 25, `:unattended` 3, `:autopilot` 3, `:with-phases` 2, `:with-context` 2, `:with-research` 1). No documented suffix is refused.
- `checklist_evidence`: **notApplicable**. The review target is a phase-parent packet with no `checklist.md`; the scope is the five child-area files.

**Overlay Protocols**

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: **notApplicable**. The area is a runtime library, its test config and its tests; no skill definition, agent mirror, feature catalog or playbook is in the changed surface.

**AC_COVERAGE**: exempt. The phase-parent target has no `acceptance-criteria.md`; the child phases own theirs.

`resource-map.md` is absent at init, so the Resource Map Coverage Gate section is omitted.

## 8. Deferred Items

- **Coverage stabilization** (blocking for PASS, not a code defect): one pass with the four dimensions already covered, or a higher cap.
- **The `:with-phases` guard case**: the positive tests pin `:with-research` and `:with-context` but never `:with-phases`, so a future edit that drops `phases` from the alternation would stay green. Recorded as a coverage gap, not an active finding, because no current input produces a wrong result.
- **Recorded limits carried from the brief, not re-reported**: a suffix followed by a file extension, the `node -e` arrow inside escaped quotes, the macOS-only `isolation-check.sh`, `started of offered` from `readOnly`, and older goal rows.

## Dimension Expansion Map

No divergent pivot ran. `divergence.saturatedDirections` is empty, completed and failed pivots are 0, audited overrides are 0, and no Council artifact exists for this lineage. Remaining frontier: none recorded. This section records breadth only and does not alter the verdict or the registry.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

`searchCoverage`, `candidateCoverage` and `searchDebt` are empty in the registry. The search depth for this area was direct diff reading plus source-reproduced probes, recorded per iteration in this lineage's `iterations/iteration-00N.md` sections "Behavior Probes", "Security Checks" and "Ruled Out".

## 10. Audit Appendix

### Convergence Summary

- Iterations: 3. newFindingsRatio per iteration: 0.0, 1.0, 0.5. Weighted stop score: 0.25.
- Stop decision: `STOP`, reason `maxIterationsReached`, detail `maxIterationsReached`.
- Legal-stop gates at the cap: `convergenceGate` pass, `dimensionCoverageGate` fail (coverage age), `p0ResolutionGate` pass, `evidenceDensityGate` pass, `hotspotSaturationGate` fail (no saturation evidence on an empty coverage graph), `claimAdjudicationGate` pass, `fixCompletenessReplayGate` pass, `candidateCoverageGate` pass (skipped, legacy), `graphlessFallbackGate` pass (skipped).
- Terminal required gates: evidence pass, scope pass, coverage fail `coverage-too-young`. Verdict derived from the registry and that row: FAIL, hasAdvisories false.

### Coverage Summary

- Dimensions: correctness, traceability, security and maintainability each have a full iteration (4/4).
- Coverage age at stop: 0 (coverage last changed in iteration 3).
- Traceability protocols: `spec_code` pass, `checklist_evidence` notApplicable, `unfinishedCoreProtocols` empty.
- Open findings by severity: P0 0, P1 0, P2 2. Resolved: 0.

### Ruled-Out Claims

- Catastrophic backtracking in the chained suffix pattern: each repetition consumes at least one character and the alternatives are prefix-disambiguated.
- Regex injection from prompt text: the suffix pattern is a constant and `commandOnlyMentioned` escapes the command phrase.
- A false `:auto` match inside `:automation`: the negative lookahead and the chain's inability to back down to zero repetitions keep it out, pinned by the existing guard test.
- A missing documented suffix: the 46-file sweep found none.
- A security regression from the deleted child flag: the deletion is test-process only; production reads the flag at `render.ts:529`.
- A temp-folder exposure: `mkdtempSync` creates the folder owner-only and the exit handler removes it on normal exit.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (197-263, 456-518)
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (1-71)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (410-502)
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (55-124)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` (15-55, 753-798)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (505-730) as integration evidence
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` (25-56) and `lib/scorer/fusion.ts` (1210-1254) as integration evidence
- `.skilled/commands` argument-hints (46 files) and `.skilled/commands/speckit/complete.md`, `plan.md`, `deep/review.md`, `create/sk-skill.md`
- `review/review-brief-7.txt`, `review/review-scope-7.txt`

### Core Protocols

- `spec_code` pass, `checklist_evidence` notApplicable (see section 7).

### Overlay Protocols

- All four notApplicable for this area (see section 7).
