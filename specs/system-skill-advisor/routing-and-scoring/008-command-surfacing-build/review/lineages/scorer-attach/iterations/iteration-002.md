# Review Iteration 002

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Target type: spec-folder (fan-out lineage `scorer-attach`)
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`
- Session: `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: security
- Budget profile: verify (11-13 calls)
- Prior findings: P0=0 P1=0 P2=2 (carried forward, still active)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:44-241` (policy, class and owner tables)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:454-500,1100-1230`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:677-698,882-939,1103-1170`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:155-230`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:505-614`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:105-128`
- `.skilled/commands/doctor/install.md:1-60` and `.skilled/commands/doctor/_routes.yaml:626-645` (context evidence for the derived class)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Hub-attached commands skip the no-edit gate the command scorer applies** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:353-388` -- `attachCommand` decides on the compiled route and the deep-loop effort wording only. It never consults `NO_EDIT_REQUEST`, while the command-row path in `lib/scorer/fusion.ts:677,887` refuses every command on a prompt that says "no edits", "just show" or "do not change". The same reader therefore gets no command from a scored command row but a mutating hub command from a single-mode route: `attachCommand('sk-doc', <sk-create-skill route>, 'explain the create skill flow, no edits')` returns `/create:skill`, whose class is `mutates` and whose policy is `start` (`command-attach.ts:66,129`).
   Finding class: security / safety-of-offering-a-mutating-command
   Scope proof: the guard would belong in `lib/command-attach.ts` (scorer-attach scope); its absence is reachable from `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:472-479`), which runs on every hub recommendation.
   Affected surface hints: hook brief command offer, recommend output `command`/`policy`, mutating `/create:*` commands
   Case: a prompt that explicitly asks for an explanation with no edits and a compiled `sk-doc` route that names the `sk-create-skill` mode yields `sk-doc → /create:skill (start)`; no-edit wording is expected to suppress a mutating offer, as it does on the scorer path.
   Mitigation in place: `start` means the command's setup asks before writing, and no `run` command in the shipped table has a writing class (executed proof below). Reach needs the compiled sk-doc route to name the create-skill mode, which is the route's own job for a create-skill prompt; the route was not executed here, so reach is stated, not proven.
   Upgrade trigger: promote to P1 if the compiled `sk-doc` route returns `action=route, selectionKind=single, workflowMode=sk-create-skill` for an explicit no-edit prompt, or if a future mode maps to a `run` + mutating command.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Policy ladder `derivePolicy` (`derive-command-bridges.cjs:489-497`) matches README §8 step for step. |
| `checklist_evidence` | core | pending | No packet checklist claims were in this iteration's focus. |
| `feature_catalog_code` | overlay | pending | Feature-catalog claims about policy and mutating classes were confirmed but the catalog pass is iteration 3. |

## Integration Evidence

- `derivePolicy` order: `ask_first` → `ask`; doctor + `mutates` → `ask`; `read-only` → `run`;
  `add-only` + `write_scope=spec-folder` → `run`; otherwise `start` (`derive-command-bridges.cjs:489-497`).
  README §8 reproduces the same five steps (`command-bridges/README.md:120-127`).
- Executed check over the shipped table: 56 `COMMAND_ROWS`, **0** rows with policy `run` and a writing
  class, **0** `run` + `mutates` rows, **0** policy mismatches between `TRACKED_COMMANDS` and the
  generated `COMMAND_POLICIES` map.
- `/doctor:install` is derived `run` from `mutating: read-only` (`_routes.yaml:631`), and the command
  doc states it writes nothing and prints the writing commands for the operator
  (`install.md:5`). The most dangerous-sounding `run` row is therefore correctly read-only.
- Doctor hand-off safety: `runnableDoctorBridgeId` admits only a row whose policy is `run`
  (`fusion.ts:1103-1110`), so a doctor route classed `mutates` can only reach the reader as
  `/doctor:helper`, never by name.
- Holdout hygiene: the only holdout vocabulary in this lineage's scope is the validate output schema,
  which exposes `holdout_top1` as a matched/total/top1 slice
  (`advisor-tool-schemas.ts:511-520,588-590`) and no per-row text. `lib/command-attach.ts`,
  `handlers/advisor-status.ts`, `derive-command-bridges.cjs` and the command-bridge JSON contain no
  holdout, corpus or prompt-row path. No holdout prompt text was read in this iteration.

## Operator Focus Coverage

- Mutating-command safety: executed proof that no `run` policy carries a writing class, plus the
  deriver ladder and the install-guide cross-check; one P2 gap recorded for the hub-attach path.
- Holdout hygiene: this lineage's surface is clean (count-only schema slices, no corpus path). The
  tune/fix/report implementations that do touch splits live in
  `runtime/scripts/routing-accuracy/*` and belong to the `accuracy-runner` lineage — named here as an
  out-of-scope boundary, not asserted clean.
- Six runtimes: `CommandRow` and `TrackedCommand` carry no runtime key
  (`command-attach.ts:48-62`), so policy and class are runtime-agnostic by construction. Nothing in
  this iteration diverges by runtime.
- Docs that disagree with code: deferred to iteration 3.

## Edge Cases

- `TRACKED_COMMANDS` has 63 keys while `COMMAND_POLICIES` has 52: the 11 commands with no scorer row
  (`/create:benchmark`, `/create:skill-parent`, `/deep:ai-council`, `/design:*`, …) carry their policy
  in `TRACKED_COMMANDS`, and every consumer reads that map. Confirmed the two maps never disagree
  where both hold a key (executed comparison).
- `command-doctor-deep-loop` is `run` + `add-only` and writes a state file under the active spec
  folder. Read as intended: the policy ladder explicitly allows a spec-folder-confined add-only route
  to run, and it writes no source.
- The doctor route manifest was read as context only; its content belongs to another lineage.

## Confirmed-Clean Surfaces

- Policy derivation and its documentation agree exactly (five-step ladder, same order, same outcomes).
- No shipped command is both `run` and writing; a mutating command is `ask` (doctor) or `start`
  (metadata), so every mutating offer still asks before writing.
- The doctor hand-off never surfaces a mutating route by name.
- Holdout rows are not reachable from this lineage's read paths, and the validate schema returns
  counts only.

## Ruled Out

- "`/doctor:install` is a mutating command mislabelled read-only": ruled out against `install.md:5`
  and the route's `gate3_location` n/a — it is a guide that prints commands.
- "A doctor route classed `mutates` can be offered by name through the helper hand-off": ruled out by
  the `policy === 'run'` filter in `runnableDoctorBridgeId`.
- "`COMMAND_POLICIES` and `TRACKED_COMMANDS` disagree": ruled out by executed comparison (0 mismatches).
- "Holdout rows leak through `advisor_status`": ruled out — the status surface reports vector counts,
  not prompts.

## Next Focus

- Dimension: traceability
- Focus area: docs that describe command surfacing versus the generated tables — the 45-row claim, the
  runtime coverage sentence, and the feature-catalog claims about `MODE_COMMANDS`
- Reason: the operator focus names docs that disagree with code, and two doc files were edited in the
  same change as the generated tables
- Rotation status: next dimension in the risk order
- Blocked/productive carry-forward: security was productive; carry the `COMMAND_POLICIES` dead-export
  observation into maintainability
- Required evidence: the doc line, the generated data line, and a count taken from the artifact

Review verdict: PASS
