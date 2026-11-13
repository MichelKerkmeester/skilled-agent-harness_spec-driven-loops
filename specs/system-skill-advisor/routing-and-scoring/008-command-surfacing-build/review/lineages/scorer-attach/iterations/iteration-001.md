# Review Iteration 001

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Target type: spec-folder (fan-out lineage `scorer-attach`)
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`
- Session: `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: correctness
- Budget profile: verify (11-13 calls)
- Operator review focus: command surfacing across the six named runtimes, mutating-command
  safety, holdout hygiene, and docs that disagree with code. See "Operator focus coverage" below.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-399`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:296-509,600-705`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1176-1194`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:57-205` (case inventory)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Deep-loop depth gate is satisfied by any typed `/deep:` prefix, not the attached command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385` -- `attachCommand` opens the costly deep-loop gate when the prompt contains the substring `/deep:` at all. A single-mode route that resolved to `review` therefore attaches `/deep:review` to a prompt whose only typed command was `/deep:research` (or `/deep:ai-council`). The reader is offered a different expensive command than the one they named, and the comment's intent ("typing the slash command is itself the ask") only holds when the typed command is the one being attached.
   Finding class: correctness / wrong-command-offer
   Scope proof: the guard lives in `lib/command-attach.ts` (scorer-attach scope) and is reachable from `enrichCompiledRoutes` in `handlers/advisor-recommend.ts:472`.
   Affected surface hints: advisor recommend output `command`/`policy`, hook brief, `compiledRoute` enrichment
   Case: `attachCommand('system-deep-loop', {action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]}, 'how does /deep:research compare to this')` returns `/deep:review`; the same call with `'what did /deep:ai-council decide'` also returns `/deep:review`.
   Evidence: executed the shipped module directly with `node --experimental-strip-types`; both prompts returned `/deep:review`. Reach needs the compiled sk-code/deep-loop route to name the review mode, which is the route's own contract for a review-shaped prompt.
   Downgrade trigger: none at P2; promote to P1 if the attached command's policy can be `run` (a deep command is `ask`, so the reader still confirms).

2. **Typed-command scan reads a document reference as the command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:266-274` -- the start/continuation boundaries treat `.` as an end boundary, so a prompt that cites the command's own document path (`/create:skill.md`) matches the tracked command `/create:skill`. The leading-slash path case the comment names (`docs/create:goal.md`) is correctly rejected because `s` is not a start boundary, but the absolute-path form is accepted.
   Finding class: correctness / false command match
   Scope proof: `typedCommandIn` is exported from `lib/command-attach.ts` and feeds `typedCommandForTop` in `handlers/advisor-recommend.ts:495`.
   Affected surface hints: typed-command attachment on the top recommendation, `ownerSkillId`/`policy` fields, hook brief
   Case: `typedCommandIn('see /create:skill.md for details')` returns `/create:skill`; with `sk-doc` as the top recommendation the reader is offered `/create:skill (start)` for a request to read a file.
   Evidence: executed the shipped module directly; the call returned `/create:skill`.
   Downgrade trigger: none at P2; a filename is a plausible prompt shape but the offer still asks before writing.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Generated `MODE_COMMANDS` and `TRACKED_COMMANDS` are consumed as the spec of the surfacing contract; two deviations recorded above. |
| `checklist_evidence` | core | pending | No packet checklist claims were in this iteration's focus. |

## Integration Evidence

- `handlers/advisor-recommend.ts:472-480` attaches the route-derived command and policy, and
  `:499-505` replaces it with the typed command on the top recommendation only.
- `handlers/advisor-recommend.ts:624-629,699-704` order compiled enrichment before typed attachment,
  so a typed command wins over a routed one as documented.
- `handler` guard `Object.hasOwn(TRACKED_COMMANDS, command)` at `advisor-recommend.ts:478` prevents a
  policy-less command from travelling.

## Operator Focus Coverage

- Six runtimes (claude, codex, opencode, pi, devin, dsh): `lib/command-attach.ts` contains no runtime
  branch; the surface is runtime-agnostic. The runtime label set lives in
  `runtime/lib/advisor-runtime-values.ts:9-17` and includes all six plus cursor. No divergence found
  in this iteration's files; the runtime-specific renderer/router is outside this lineage.
- Mutating-command safety: deferred to iteration 2 (security dimension).
- Holdout hygiene: no holdout vocabulary or corpus path occurs in `lib/command-attach.ts`; deferred
  to iteration 2 for the full surface.
- Docs that disagree with code: deferred to iteration 3 (traceability dimension).

## Edge Cases

- A multi-target route (`selectionKind` `multi`, `surfaceBundle`, `orderedBundle`) deliberately yields
  no command and no `needsMode` marker. Read as intended contract, not a defect: only a single-mode
  route can name one command unambiguously.
- `commandRowFor` uses own-key lookup, so an inherited name such as `constructor` cannot resolve a row.
  Verified by reading `:247-249`.
- The `/deep:` bypass finding states its reach condition (a single-mode review route) because the
  compiled-route front door was not executed; executing it is outside this lineage's write-safe scope.

## Confirmed-Clean Surfaces

- `typedCommandForTop` ownership gate (`:288-295`): a top skill that neither owns the command nor
  carries the same command row does not receive it.
- `attachCommand` shape narrowing (`:359-377`): non-route actions, multi-target routes, non-string
  workflow modes, and inherited keys all degrade to "no command offered" rather than throwing.
- `MODE_COMMANDS` coverage: sk-doc's 13 command-bearing modes in `mode-registry.json` match the 13
  generated rows exactly; the three hubs with command-bearing modes (sk-design 3, sk-doc 13,
  system-deep-loop 3) are exactly the three hubs present in the table.

## Ruled Out

- "`/create:skill-parent` is reduced to `/create:skill`": ruled out. `-` is inside
  `COMMAND_CONTINUATION` (`[a-z0-9_:-]`), so the shorter key does not match at that boundary, and the
  longest key wins; `/create:skill-x` returns no command (executed).
- "Typed command is overwritten by compiled enrichment": ruled out by call order
  (`advisor-recommend.ts:624-629,699-704`).
- "Cache serves a stale attached command": ruled out. The cached value is the pre-enrichment output
  and enrichment runs again on every cache hit (`:613-629`).

## Next Focus

- Dimension: security
- Focus area: mutating-command safety across `derivePolicy`, `COMMAND_ROWS.mutating`, `TRACKED_COMMANDS`
  and the doctor hand-off; holdout-row access in `handlers/advisor-status.ts` and
  `schemas/advisor-tool-schemas.ts`
- Reason: the operator focus names mutating-command safety and holdout hygiene as the two risks that
  can turn a surfacing bug into a write or a leak
- Rotation status: next dimension in the risk order
- Blocked/productive carry-forward: correctness was productive; carry the "no-edit prompt" question
  into the safety pass
- Required evidence: policy/class table rows, the deriver ladder, and the schema slice boundaries

Review verdict: PASS
