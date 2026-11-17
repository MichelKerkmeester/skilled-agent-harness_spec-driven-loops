# Review Iteration 004

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Target type: spec-folder (fan-out lineage `scorer-attach`)
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`
- Session: `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: maintainability
- Budget profile: scan (9-11 calls)
- Prior findings: P0=0 P1=0 P2=5 (carried forward, still active)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:44-241`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:13,449-482`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1180-1230`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50-54,128`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:745-790`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:45` (context evidence; `render-hooks-plugin` scope)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`COMMAND_POLICIES` is generated, drift-guarded and documented as the attach-path policy lookup, but no code reads it** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:123-176` -- the generated block holds 52 policy rows and the deriver regenerates it on every run (`derive-command-bridges.cjs:1218`), yet a repository-wide reference search finds only its declaration, the generator, the built `dist` copy and prose. The one attach path reads the policy from `TRACKED_COMMANDS[command].policy` instead (`handlers/advisor-recommend.ts:478`), so the table is a second source of truth that nothing consumes. The command-bridges README says the block exists "so a surface that attaches a command can name its policy without a second lookup" (`command-bridges/README.md:50`), and a feature-catalog page in another lineage's scope states the opposite of the code ("takes its `policy` from `COMMAND_POLICIES[command]`", `feature-catalog/cli-surface/advisor-recommend.md:45`).
   Finding class: maintainability / dead generated surface + contradictory documentation
   Scope proof: the dead block and its consumer are both scorer-attach paths (`lib/command-attach.ts`, `handlers/advisor-recommend.ts`); the catalog page is cited as context only and is not filed against, because `render-hooks-plugin` owns it.
   Affected surface hints: generated blocks and their drift guard, attach-path policy source, two prose surfaces
   Case: a maintainer corrects a policy in the generated `commandPolicies` record or in `COMMAND_POLICIES` and ships it; nothing changes, because the attach path reads `TRACKED_COMMANDS`. A reader of the catalog believes the opposite, so the two docs cannot both be right.
   Evidence: generated block at lines 123-176; consumer at `advisor-recommend.ts:478`; README sentence at `command-bridges/README.md:50`; catalog sentence at `feature-catalog/cli-surface/advisor-recommend.md:45`; repository-wide search for `COMMAND_POLICIES` returns no import site.
   Downgrade trigger: none at P2; the two maps currently agree in value (iteration 2 executed comparison), so this is a cost and a contradiction, not a live wrong policy.

2. **Dead empty conditional in `primaryIntentBonus`** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:750-751` -- the branch tests `/\bsemantic (code )?search\b/` against the prompt and then returns nothing, so the test runs on every recommendation and changes no score. No other code depends on the branch's presence.
   Finding class: maintainability / dead control flow
   Scope proof: `lib/scorer/fusion.ts` is a scorer-attach scope entry; the branch is inside the scoring path consumed by every recommendation.
   Affected surface hints: `primaryIntentBonus`, per-recommendation scoring cost, reviewer confidence in the rule table
   Case: a reader of the bonus ladder sees a rule for semantic-search prompts and assumes semantic-search prompts get a bonus; they get none, and the next rule decides. Removing the branch changes no output.
   Evidence: the empty block read at lines 750-751; no assignment or return inside it.
   Downgrade trigger: none at P2; pre-existing rather than introduced here, and cosmetic in impact.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | The generated policy block's documented role does not match its only consumer (recorded above). |
| `checklist_evidence` | core | partial | No packet checklist claim covers generated-block consumption. |
| `skill_agent` | overlay | pass | Carried from iteration 3 (36/36 owner tags match). |
| `agent_cross_runtime` | overlay | partial | Carried from iteration 3 (architecture prose omits `dsh`). |
| `feature_catalog_code` | overlay | partial | Both catalog pages describe command surfaces; the cli-surface page contradicts the code's policy source (context, other lineage) and the scorer-fusion page carries the 45-row drift. |
| `playbook_capability` | overlay | notApplicable | No playbook path is part of this surface. |

## Integration Evidence

- `handlers/advisor-recommend.ts:13` imports `TRACKED_COMMANDS`; the file does not import
  `COMMAND_POLICIES`.
- `derive-command-bridges.cjs:1180-1215` emits both `TRACKED_COMMANDS` (with `policy`) and
  `COMMAND_POLICIES`, so the same fact is generated twice from one policy record.
- `command-bridges-drift-guard.vitest.ts` pins the regenerated file byte for byte, so the dead block is
  actively maintained rather than merely stale.

## Operator Focus Coverage

- Docs that disagree with code: the dead table is the code-side cause of a doc contradiction; the
  catalog page itself belongs to `render-hooks-plugin` and is named, not filed against.
- Six runtimes: no runtime branch is added by either finding.
- Mutating-command safety: unchanged — the two policy maps agree in value today, so the dead table does
  not currently mis-state a policy.
- Holdout hygiene: no holdout path is touched by this iteration.

## Edge Cases

- Deleting `COMMAND_POLICIES` would also need the deriver emitter and the drift-guard expectation
  updated in the same change; wiring the consumer to it is the smaller change. Either fix is a
  one-owner decision, recorded here rather than executed (review is observation-only).
- The empty conditional is pre-existing; reporting it is still actionable because the file is in scope
  and the branch is one line.

## Confirmed-Clean Surfaces

- `COMMAND_ROWS` and `TRACKED_COMMANDS` currently agree wherever both hold a key (iteration 2 executed
  comparison, 0 mismatches), so the duplicate tables have not drifted in value.
- The deriver emits both maps from one policy record, so a generator-level fix keeps them aligned.

## Ruled Out

- "`COMMAND_POLICIES` is read through a namespace or dynamic access": ruled out — a repository-wide
  search finds no import site and no `command-attach` namespace import.
- "The empty conditional is a stub for a planned rule": ruled out as an assumption; no comment, no
  ticket reference, and no test asserts a semantic-search bonus.

## Next Focus

- Dimension: cross-reference / adversarial recheck
- Focus area: revalidate the five active P2 findings against current file content, confirm the
  convergence signal, and check that no finding was filed outside the lineage's scope
- Reason: last iteration; the cap and the convergence rule meet here
- Rotation status: all four dimensions covered; this is the stabilization pass
- Blocked/productive carry-forward: maintainability was productive; no blocked approaches
- Required evidence: a reread of every cited line and a scope audit of the lineage directory

Review verdict: PASS
