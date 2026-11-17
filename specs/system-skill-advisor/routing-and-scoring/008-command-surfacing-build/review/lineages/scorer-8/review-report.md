# Review Report - scorer-8 (pass eight)

Lineage: `fanout-scorer-8-1794832880917-x4m8iz` | Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-8` | Stop reason: `maxIterationsReached` | Iterations: 5

## Executive Summary

**Overall verdict: PASS (advisories only)**

- Question asked: does the pass-eight scorer diff implement the brief's guarded-write rule and the widened mode-suffix lookup, and does anything it changed break a real input?
- Answer: yes for the briefed inputs, with two P2 boundary gaps. The rewrite closes the pass-seven tilde, README and `..` findings by construction; the two remaining gaps are inputs the rule text does not name.
- `hasAdvisories`: **true**. `activeP0`: 0, `activeP1`: 0, `activeP2`: 2. These are the counts the verdict used, read from `deep-review-findings-registry.json` by `review-verdict.cjs`.
- Self-check outcomes: no P0 or P1 was raised, so no Hunter/Skeptic/Referee pass was required. Both P2s were re-examined at line level in iteration 4 and kept at P2 with their downgrade triggers; the chained-suffix input was recorded as a refinement of the mode-vocabulary finding and merged into it by the reducer.
- Review scope: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md`, diffed with `git -c core.fsmonitor=false diff 1c3d62def5a 3416b5e0526 -- <path>`.
- Operator review focus: Review pass eight. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-8.txt and follow it: it names your area by lineage label, the scope file review/review-scope-8.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder.
- Stop reason: the iteration cap of 5 was reached while one legal-stop gate (`hotspotSaturationGate`) vetoed the candidate because this lineage holds no hotspot metadata. Every actionable gate passed; the cap, not the review, ended the loop.

## Planning Trigger

`/speckit:plan` is **not required**. The verdict is PASS with advisory-only P2 findings, so the next step is `/create:changelog`. The two P2s are cheap follow-ups that can ride a later pass on the same files.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    "iter1-P2-self-auto-lags-mode-vocabulary",
    "iter1-P2-checkout-root-write-safe"
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-ADV-1",
      "severity": "P2",
      "findingIds": ["iter1-P2-self-auto-lags-mode-vocabulary"],
      "action": "Read the self-chosen mode off the same suffix chain MODE_SUFFIX already parses, so :autopilot, :unattended and an :auto placed anywhere in a chain are counted"
    },
    {
      "id": "WS-ADV-2",
      "severity": "P2",
      "findingIds": ["iter1-P2-checkout-root-write-safe"],
      "action": "Treat a write path equal to the checkout folder as inside it, and pin the equality case in the startState table"
    }
  ],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["correctness"],
  "affectedSurfacesSeed": [
    "score-command-transcripts.mjs SELF_AUTO / PROMPT_AUTO / selfChosenAuto",
    "score-command-transcripts.mjs guardedWriteCounts / insideCheckout",
    "command-transcript-score.vitest.ts startState cases",
    "routing-accuracy README unsafe sentence"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

| ID | Severity | Title | Dimension | File:line | Disposition |
|---|---|---|---|---|---|
| `iter1-P2-self-auto-lags-mode-vocabulary` | P2 | `:autopilot` and `:unattended` are read as mode suffixes for lookup but not as self-chosen modes for `unsafe` | correctness | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1362` | active |

- Evidence: `MODE_SUFFIX` at `:613` names `auto`, `confirm`, `autopilot`, `unattended` and three `with-*` modifiers; `SELF_AUTO` at `:1362` matches only `/:auto$/i`. Probe through `startState`: `create:readme:auto` → `unsafe true`; `create:readme:autopilot` → `unsafe false`; `create:readme:auto:with-research` → `unsafe false`; `create:readme:with-research:auto` → `unsafe true`.
- Impact: the per-arm `unsafe` metric undercounts a guarded run that took a stronger approval mode than `:auto`, and the same run is invisible to the self-chosen-mode rule. The command docs state that `:autopilot`, `:unattended` and `--unattended` bind execution to `autopilot` and are "not a quieter spelling of `:auto`" (`.skilled/commands/speckit/complete.md:68`, `implement.md:65`).
- Fix recommendation: derive the self-chosen check from the same suffix grammar, for example by reading the mode tokens `commandParts` already strips and counting any `auto|autopilot|unattended` element; keep `PROMPT_AUTO` symmetric with it.
- `findingClass`: `correctness`. `scopeProof`: both lines are inside the pass-eight scoped file, and the probe calls the exported `startState`. `affectedSurfaceHints`: `SELF_AUTO`, `PROMPT_AUTO`, `selfChosenAuto`, `startState.unsafe`, the arm `unsafe` count, `README.md:135`.
- Refinement merged by the reducer: `iter4-P2-chained-auto-escapes-self-auto-anchor` (skill `create:readme:auto:with-research` on an ask row returns `unsafe false`).

| ID | Severity | Title | Dimension | File:line | Disposition |
|---|---|---|---|---|---|
| `iter1-P2-checkout-root-write-safe` | P2 | A guarded write that names the checkout folder itself is scored safe | correctness | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1524` | active |

- Evidence: `guardedWriteCounts` returns `insideCheckout(normal, checkoutDir) || outsideScratch`; `insideCheckout` compares with a `${folder}/` prefix (`:718`), and the scratch clause is false for a path under `/private/var/folders`. Probe: write path equal to the arena → `unsafe false`; `arena/src/x.mjs` → `unsafe true`; `/tmp/notes.md` → `unsafe false`.
- Impact: a guarded run whose only write names the checkout root (`rm -rf <arena>` is recorded word by word by `ALWAYS_SHELL_WRITERS:801` and `EVERY_WORD_WRITERS:805`) is not counted unsafe, although it changes everything the checkout owns.
- Fix recommendation: accept `text === folder` as inside the checkout and add the equality case to the `startState` table next to the arena cases.
- `findingClass`: `correctness`. `scopeProof`: the predicate, its helper and the shell-writer list are inside the scoped file; the miss predates the extraction but the rewritten helper carries the policy comment that claims "A write inside it counts". `affectedSurfaceHints`: `guardedWriteCounts`, `insideCheckout`, the arm `unsafe` count, `unsafeNoChangedPath`.

## Remediation Workstreams

### P0

None.

### P1

None.

### P2 advisories (separate from the merge decision)

1. **WS-ADV-1, mode vocabulary parity** (iteration 1, refined in iteration 4). Change `SELF_AUTO`/`PROMPT_AUTO` to read the suffix chain instead of a trailing `:auto`, then extend the `startState` test that pins the chain (`command-transcript-score.vitest.ts:1527-1533`) with the guarded-row input.
2. **WS-ADV-2, checkout equality** (iteration 1). Accept `text === folder` in `insideCheckout` and add one `it.each` row to `:1418-1443` and one `startState` case next to the arena group.

Both are single-line policy changes with a test each. Neither blocks a release; neither is needed for the changelog.

## Spec Seed

- REQ-002's unsafe rule should name the three boundary spellings the branch now handles (`~`, `..`, checkout child) and state whether a write equal to the checkout root counts, so the scorer and its tests stop being the only statement of the rule.
- The mode vocabulary in REQ-003 should say that a `:with-*` modifier may chain with a mode in either order, and that the auto-family modes are `auto`, `autopilot` and `unattended` wherever a rule reads "the mode a run chose".
- AC-005's evidence row should name the count a future mode change would move, so an `unsafe` shift from a suffix fix is expected rather than surprising.

## Plan Seed

- T-ADV-1: read the mode list once and share it between `MODE_SUFFIX`, `SELF_AUTO` and `PROMPT_AUTO`; verify with the four probe inputs from iteration 5.
- T-ADV-2: add the checkout-equality case to `insideCheckout`; verify with the arena-root and arena-child probes.
- T-ADV-3: add the scorer-side negative suffix cases (`:with-everything`, `:auto:draft`) that today live only in `command-attach-guards.vitest.ts:451`.
- T-ADV-4: extract the four scratch roots to one list shared by `guardedWriteCounts:1522` and `insideCheckout:724-727` so the two cannot drift.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | REQ-002/AC-002 match `guardedWriteCounts:1518-1525`; recorded in iterations 1, 2, 4 and 5 | none for the briefed spellings; the two P2s are inputs the requirement text does not name |
| `checklist_evidence` | pass | AC-002's verification cell names the arena, scratch and real-folder cases; `tasks.md:47` and `:139` carry the suffix evidence | none |

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | pass | `sk-code-review/SKILL.md` and `references/review-core.md` loaded before the first severity call and applied to every finding | none |
| `agent_cross_runtime` | notApplicable | the scoped diff touches no agent file or mirror | none |
| `feature_catalog_code` | notApplicable | no catalog entry describes the scorer's `unsafe` metric | none |
| `playbook_capability` | notApplicable | no playbook claims this metric | none |

`AC_COVERAGE`: **exempt**. The root target has no `acceptance-criteria.md`; the child phase 038 carries AC-001..AC-005 and its rows are `Met`, but they are outside this lineage's evidence role.

## Dimension Expansion Map

- Saturated directions: none; no divergent pivot was prepared.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier: the mode-vocabulary parity and checkout-equality follow-ups, plus the two deferred maintainability items (shared scratch list, scorer-side negative suffix test).

## Search Ledger

*No search-depth state captured (legacy v1 record).*

- `searchDebt`: 0. `hasSearchDebt`: false.
- Ruled-out candidates this run: the double-slash scratch spelling, a mid-string suffix before an argument, `/dev/null` writes, case-variant scratch roots, symlink evasion of the lexical rule, chained modifiers on commands that advertise none, and a severity upgrade of either P2.

## Deferred Items

- Shared scratch-root list between `guardedWriteCounts:1522` and `insideCheckout:724-727` (no failing input today; drift risk only).
- Scorer-side negative suffix test for `:with-everything` and `:auto:draft` (pinned today only in the attach suite).
- Re-scoring stored run sets to measure how many runs the two P2s move. The brief forbids `--summary`, so this pass cites probes instead of counts.

## Audit Appendix

### Convergence Summary

- Iterations: 5. Ratios: 1.0, 0.0, 0.0, 0.33, 0.0.
- Stop decisions: CONTINUE, CONTINUE, STUCK_RECOVERY, BLOCKED (hotspotSaturationGate), STOP `maxIterationsReached`.
- Weighted stop score at the final check: 0.70. Stuck count 1 at stop.
- Terminal gates: evidence pass (`all-findings-cited`), scope pass (`all-findings-in-scope`), coverage pass (`coverage-complete`). `failedRequiredGateIds`: [].
- Synthesis closeout: `synthesis_incomplete` (warning) with the invariant `structured_state_findings_partially_reflected_in_registry` (3 iteration findings, 2 registry findings). The reducer merged the iteration-4 chained-suffix refinement into its parent finding (`iter1-P2-self-auto-lags-mode-vocabulary`) because the record carried a `refines` link, which is the intended dedup behavior and leaves one registry row for the two inputs. No artifact is missing; the counts, verdict and terminal gates are unaffected.

### Coverage Summary

- Dimensions covered: correctness, security, traceability, maintainability (4/4).
- Files: the scorer source, its vitest file and its README were each read for every dimension that applied.
- The sibling matcher (`command-attach.ts:203-235`) and the phase 038 AC/task rows were read as traceability evidence only.

### Ruled-Out Claims

- `posix.normalize('//tmp/x')` escapes the scratch test: false, it returns `/tmp/x`.
- A scratch-looking prefix with `..` still hides a real folder: fixed; `/tmp/../Users/dev/repo/README.md` is unsafe.
- A `~` write defeats the rule: fixed; `~/repo/README.md` is unsafe and the case is pinned.
- The suffix chain strips an unknown modifier: false; `:with-everything` and `:auto:draft` stay unresolved.
- The suffix chain collapses a real command name: false; no command under `.skilled/commands` is named after one of the six suffixes.

### Sources Reviewed

- Scoped: `score-command-transcripts.mjs`, `command-transcript-score.vitest.ts`, `routing-accuracy/README.md`.
- Context: `review-brief-8.txt`, `review-scope-8.txt`, the deep-review skill and iteration prompt pack, `sk-code-review` doctrine, `speckit/complete.md`, `speckit/plan.md`, `command-attach.ts`, `038-alignment-p1-remediation/acceptance-criteria.md` and `tasks.md`, the pass-seven lineage registry.
- Not opened: `command-prompts.jsonl`, `holdout-prompts.jsonl`, `behaviour-fresh-prompts.jsonl`, any CLI session store, `.skilled/hooks/hook-flags.env`; `score-command-transcripts.mjs --summary` was not run.

### Cross-Reference Appendix

Core Protocols: `spec_code` pass, `checklist_evidence` pass.

Overlay Protocols: `skill_agent` pass; `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` notApplicable with the reasons above.
