# Review Report - scorer-9 (pass nine, area `scorer`)

Scope: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`,
`runtime/tests/command-transcript-score.vitest.ts`, `runtime/scripts/routing-accuracy/README.md`
(reviewed at `05f776202e0`, diff base `85550ee946e`).
Lineage: `fanout-scorer-9-1794835877856-5ghgm4`, generation 1, `new`.

## Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (five active P2 findings, no P0 and no P1)
- **P0/P1/P2 counts the verdict used: 0 / 0 / 5**
- **Operator review focus**: Review pass nine. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-9.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.
- **Self-check outcomes**: no P0 candidates were raised, so no Hunter/Skeptic/Referee pass was owed. Each P2 was re-read at its cited line in the confirmation pass and none changed state.
- **Review scope summary**: the guarded-write `unsafe` verdict, the self-chosen `:auto` check, and the command parser's mode-suffix chain, reviewed across correctness, security, traceability and maintainability.
- **Stop**: `converged` (`all_dimensions_clean`) after five iterations; all nine convergence gates pass.

The change is sound. The arena write is now judged against the checkout the run named, the seven advertised suffix words and their chains are read, and the spec's no-checkout, max-input and unknown-suffix edge cases all hold (probed). The five advisories are measurement-fidelity and evidence-hygiene items, not correctness breaks.

## Planning Trigger

`/speckit:plan` is **not required**: the verdict is PASS with advisories only, so the next step is `/create:changelog` or a follow-up review pass, not remediation planning.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["S9-P2-001", "S9-P2-002", "S9-P2-003", "S9-P2-004", "S9-P2-005"],
  "remediationWorkstreams": [],
  "specSeed": [
    "Name the scorer's suffix-chain and SELF_AUTO changes in the phase file table if that phase is amended."
  ],
  "planSeed": [
    "Pin the spec's max-input suffix chain in command-transcript-score.vitest.ts.",
    "Consider a shared suffix vocabulary constant where the anchors allow it."
  ],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": "UNKNOWN",
  "fixCompletenessRequired": false
}
```

`findingClasses` and `affectedSurfacesSeed` are `UNKNOWN` in the reducer-owned state because the delta finding rows carried id, severity, title, file and iteration only; the iteration artifacts hold the values (recorded per finding below) but the registry copy is empty, so the packet marks the gap rather than inferring it.

## Active Finding Registry

| ID | Severity | Title | Dimension | file:line | Impact | Fix recommendation | Disposition |
|----|----------|-------|-----------|-----------|--------|--------------------|-------------|
| S9-P2-001 | P2 | The scratch-folder test omits `/var/tmp` and treats every scratch root itself as a real folder | correctness | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1527` | A guarded row whose only write is `/var/tmp/notes.md` counts unsafe; the code comment says a scratch folder is exempt | Match `/var/tmp` and the `/private` alias beside `/tmp`, and decide the trailing-slash rule for a scratch root | advisory |
| S9-P2-002 | P2 | A mode suffix that precedes a route or a space keeps the mode inside the command name | correctness | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` | `speckit:complete:auto add auth` reads as `complete:auto`, so the start is lost | Strip the suffix chain at the name boundary as well as at the end | advisory |
| S9-P2-003 | P2 | The suffix patterns run in quadratic time on an unbounded command token | security | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` | A 500 KB command line spends about 12 s in one match; cost quadruples per doubling | Bound the token length, or anchor the match at the name boundary to make it linear | advisory |
| S9-P2-004 | P2 | Two behavior changes in the scorer have no requirement or acceptance criterion of their own | traceability | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` | The `unsafe` count can move with no requirement row saying it should | Add the suffix and self-auto changes to the phase file table and an AC row, or record them as accepted extension | advisory |
| S9-P2-005 | P2 | The advertised suffix vocabulary is duplicated in two patterns and the spec's max-input case is untested | maintainability | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` | A new advertised modifier must be added in three places; missing one is silent | Pin the max-input chain in the transcript test and keep the two vocabularies in step | advisory |

Finding classes and affected surfaces, as recorded in the iteration artifacts:
S9-P2-001 `correctness` / `unsafe`, `unsafeNoChangedPath`, rescored stored sets;
S9-P2-002 `correctness` / `started`, `startShapes`, `startRate`, `declineStarts`, `skillOnlyStarts`;
S9-P2-003 `security` / `--summary` and `--runtime` scoring, rescored sets;
S9-P2-004 `traceability` / packet closure evidence, unsafe restatement rows, README start contract;
S9-P2-005 `maintainability` / `commandParts`, `namesCommand`, `confirmStem`, `selfChosenAuto`, `command-attach-guards.vitest.ts`.

## Remediation Workstreams

No P0 or P1 workstream exists. The five advisories are recorded for a follow-up pass:

- **A1 - scratch vocabulary** (S9-P2-001): widen the scratch prefix test, keeping the cautious direction.
- **A2 - suffix position** (S9-P2-002, S9-P2-003): decide whether a suffix before a route can occur and bound the token; one change can fix both.
- **A3 - evidence hygiene** (S9-P2-004, S9-P2-005): extend the phase file table and AC coverage, and pin the max-input chain.

## Spec Seed

- The phase `038-alignment-p1-remediation` Files to Change row for the scorer names only the guarded write; if that phase is amended, name the suffix and self-auto changes beside it.
- The spec's edge case "a chain of every advertised suffix still reads as the command" deserves a named test in the transcript suite, not only in the matcher suite.

## Plan Seed

- Add the max-input chain case (`:auto:confirm:autopilot:unattended:with-context:with-phases:with-research`) to `command-transcript-score.vitest.ts`.
- Decide the scratch vocabulary (does `/var/tmp` count as scratch?) and change one regex.
- Decide whether `commandParts` should strip a suffix at the name boundary; if yes, one change closes S9-P2-002 and removes the quadratic risk in S9-P2-003.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | partial | `038-alignment-p1-remediation/spec.md:128` (REQ-002) beside `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1507` and `:1519` | REQ-002 matches exactly; the file's suffix and self-auto changes are unowned by a requirement (S9-P2-004) |
| `checklist_evidence` | pass | `038-alignment-p1-remediation/acceptance-criteria.md:55` (AC-002) beside `runtime/tests/command-transcript-score.vitest.ts:1491-1528` | AC-002's named cases exist and assert the claimed outcomes; the suite was not executed inside this lineage |

### Overlay Protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | notApplicable | Target is a runtime script, not a skill contract |
| `agent_cross_runtime` | notApplicable | No agent definition changed |
| `feature_catalog_code` | notApplicable | No catalog row names this script |
| `playbook_capability` | notApplicable | No playbook claim covers the scorer |

`AC_COVERAGE`: `acceptance-criteria.md` exists but `implementation-summary.md` is not in-progress for this lineage's target, so the advisory signal is **exempt**.

## Dimension Expansion Map

No divergence state was recorded: zero completed pivots, zero failed pivots, zero audited overrides, no saturated directions, no remaining frontier. Breadth came from the four configured dimensions, each covered once, plus one confirmation pass.

## Deferred Items

- S9-P2-001 to S9-P2-005: advisory only; none blocks the verdict.
- The symlink-escape question (a scratch folder reached through a link) is a known limit of a text-only guard, recorded in Ruled Out rather than deferred as work.

## Search Ledger

*No search-depth state captured (legacy v1 record)*

Ruled-out directions recorded across the run: a symlinked scratch path as a false negative; a `:with-*` chain breaking `/create:with-human-voice`; a git-ignored write counting as unsafe; a symlink or NUL scratch-prefix bypass; ReDoS in `COMMAND_LINE`/`FENCE_LINE`; reading a secret through the suffix vocabulary; a missing requirement for the guarded write; a README contradiction; extracting one shared regex across modules.

## Audit Appendix

### Convergence Summary

| Iteration | Dimension | New findings | Ratio | Stop decision |
|-----------|-----------|--------------|-------|---------------|
| 1 | correctness | 2 P2 | 1.0 | CONTINUE (`noStopCandidate`) |
| 2 | security | 1 P2 | 1.0 | CONTINUE (`noStopCandidate`) |
| 3 | traceability | 1 P2 | 1.0 | CONTINUE (`noStopCandidate`) |
| 4 | maintainability | 1 P2 | 1.0 | CONTINUE (`noStopCandidate`, coverageAge 0) |
| 5 | cross-reference | 0 | 0.0 | **STOP `converged`** (`all_dimensions_clean`), weighted 0.7, all nine gates pass |

### Coverage Summary

All four configured dimensions are covered (correctness, security, traceability, maintainability). Every reviewed file was read under at least two dimensions; the script itself was read under all four.

### Ruled-Out Claims

- The guard cannot be escaped by a relative `..`, a `~` path, a pathless write or a `/private` spelling mismatch; each was probed and counts on the cautious side.
- The end anchor keeps `/create:with-human-voice` out of the suffix strip.
- The `COMMAND:` reader still refuses quoted, fenced and placeholder-shaped lines.

### Sources Reviewed

The three scope files at `05f776202e0`, the diff between `85550ee946e` and `05f776202e0`, phase `038-alignment-p1-remediation` `spec.md` and `acceptance-criteria.md`, `command-attach.ts:203-235`, `speckit/README.txt` suffix rows, `scratch/unsafe-rows.txt`, and the coverage graph via `upsert.cjs`/`convergence.cjs`.

### Cross-Reference Appendix

Core Protocols: `spec_code` partial, `checklist_evidence` pass (see Traceability Status).
Overlay Protocols: all four notApplicable for this target.

### Bookkeeping Notes

- The convergence decision for each iteration is carried on the iteration record (`stopDecision`) and in `deltas/iter-NNN.jsonl`, because `deep_review.convergence_evaluated` is reserved with no writer in the review ledger.
- A `deep_review.terminal_gates_recorded` row was rejected by the gateway with `Invalid closed-shape payload` (exit 1) even though the payload matched the published field set; the gate outcome is recorded here and in `deltas/iter-005.jsonl` instead. No direct state-log write was attempted.
- The lineage kept the brief's holdout rule throughout: no prompt corpus was opened, no `git diff`/`show`/`log -p` ran over a holdout path, no `--summary` run was started, no CLI session text was printed, and `.skilled/hooks/hook-flags.env` was never read or created.
