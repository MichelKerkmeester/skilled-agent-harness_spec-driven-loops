# Deep Review Report - scorer-attach lineage

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Lineage: `scorer-attach` (fan-out), session `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1
- Dimensions: correctness, security, traceability, maintainability
- Iterations: 5 of 5 (convergence reached at the cap; `newFindingsRatio` 0.00 on the last pass)
- Verdict: **PASS** with 7 active P2 advisories (`hasAdvisories = true`)

## 1. Executive summary

The command-surfacing change holds up on the two questions that matter most. No shipped command is
both runnable without asking (`run`) and writing: an executed sweep of all 56 `COMMAND_ROWS` found 0
such rows, the policy ladder in `derive-command-bridges.cjs` produces that result by construction,
and the doctor hand-off refuses to name any mutating route. No holdout row is reachable from this
lineage's surface: the validate schema exposes only matched/total/top1 slices, and no
command-surfacing path reads a corpus file.

Seven P2 advisories remain, all in two themes. Three are attach-path behaviour: the deep-loop effort
gate accepts any `/deep:` mention rather than the command being attached, a document path such as
`/create:skill.md` is read as a typed command, and the hub-attach path offers a mutating `/create:*`
command on an explicit no-edit prompt where the scorer path refuses one. Three are doc-code drift: two
sentences added by this change say 45 TypeScript-served command rows where the artifact holds 46, and
the runtime coverage sentence omits `dsh`. One is dead generated data: `COMMAND_POLICIES` is
regenerated and drift-guarded but read by no code, while two prose surfaces disagree about whether it
is the policy source. A seventh small advisory records a dead empty conditional on the scoring path.

None of these blocks release. The three attach-path advisories are wrong-offer risks, not wrong-write
risks, because every mutating command they can reach carries `start` or `ask`.

## 2. Planning trigger

- Required: no. There is no active P0 and no active P1, so the promotion gate is PASS.
- Recommended: yes, as one small cleanup packet. Four of the seven advisories are one-line or
  one-sentence fixes, and two of them (the doc counts) are corrections to text added in this change.
- Not recommended: a remediation plan that reopens the command-surfacing design. The route-derived
  attach contract, the policy ladder and the single-mode rule are sound.

## 3. Active finding registry

| Id | Severity | Dimension | Location | Title |
|---|---|---|---|---|
| R1-P2-001 | P2 | correctness | `runtime/lib/command-attach.ts:385` | Deep-loop depth gate is satisfied by any typed `/deep:` prefix, not the attached command |
| R1-P2-002 | P2 | correctness | `runtime/lib/command-attach.ts:266` | Typed-command scan reads a document reference as the command |
| R2-P2-001 | P2 | security | `runtime/lib/command-attach.ts:353` | Hub-attached commands skip the no-edit gate the command scorer applies |
| R3-P2-001 | P2 | traceability | `README.md:176` (also `feature-catalog/scorer-fusion/command-meaning-matching.md:26`) | Two docs added by this change state 45 TypeScript-served command rows; the artifact holds 46 |
| R3-P2-002 | P2 | traceability | `ARCHITECTURE.md:142` | The runtime coverage sentence omits `dsh` while the canonical set and hook readers include it |
| R4-P2-001 | P2 | maintainability | `runtime/lib/command-attach.ts:123` | `COMMAND_POLICIES` is generated, drift-guarded and documented as the attach-path policy lookup, but no code reads it |
| R4-P2-002 | P2 | maintainability | `runtime/lib/scorer/fusion.ts:750` | Dead empty conditional in `primaryIntentBonus` |

Totals: P0 0, P1 0, P2 7 active, 0 resolved, 0 repeated.

## 4. Remediation workstreams

**W1 - Attach-path guards** (R1-P2-001, R1-P2-002, R2-P2-001)
Reuse one predicate for "the prompt asks for no change" on the hub-attach path, the way
`fusion.ts` already does for command rows; match a typed command only at a command boundary that
rejects a trailing `.` path extension; and gate a deep-loop command on the command actually attached
(or on a per-command effort table) rather than on the presence of `/deep:`.
Owner: the advisor runtime. Size: one file plus tests. Risk: low — three narrow guards, all with a
unit reproduction already in the iteration files.

**W2 - Documentation truth** (R3-P2-001, R3-P2-002)
Correct the two 45-row sentences to 46 and add `dsh` to the runtime sentence (or state what the
sentence is enumerating if it is deliberately narrower than the runtime label set).
Owner: docs. Size: three lines. Risk: none.

**W3 - Dead generated surface** (R4-P2-001)
Choose one: delete `COMMAND_POLICIES` from the generated block and its emitter, or point
`advisor-recommend.ts:478` at it and drop the duplicate policy from `TRACKED_COMMANDS`. The second is
the smaller diff and makes the two prose surfaces agree. The `render-hooks-plugin` catalog page that
already describes the second shape is another lineage's file, so a coordinated touch is needed if the
delete option is chosen.
Owner: advisor runtime plus that doc's owner. Size: one emitter change and one consumer line, or a
delete plus drift-guard update. Risk: low.

**W4 - Dead control flow** (R4-P2-002)
Delete the empty `if` block in `primaryIntentBonus`. No expected-output change.
Owner: advisor runtime. Size: two lines. Risk: none.

## 5. Spec seed

Proposed acceptance criteria for a cleanup packet:

1. A prompt containing only `/deep:<other-mode>` never attaches a deep command for a different mode.
2. A prompt that cites a command document path (`/create:<name>.md`) attaches no command.
3. A prompt matching the shared no-edit wording attaches no mutating command from either the scorer
   path or the hub route path.
4. The documented TypeScript-served command-row count equals `counts.typescriptActive` in
   `command-bridges.generated.json`.
5. The architecture runtime sentence names every runtime in `ADVISOR_RUNTIME_VALUES`, or states the
   narrower enumeration it intends.
6. No generated export in `command-attach.ts` lacks a runtime consumer, or its documented consumer is
   the one that reads it.
7. The scoring path contains no empty conditional.

## 6. Plan seed

1. Add the no-edit predicate to `attachCommand` and reuse the same regex constant as `fusion.ts`
   (avoid a second copy).
2. Tighten `typedCommandIn`'s end boundary so a `.` or a path separator after the command cancels the
   match, keeping `-` as a continuation character.
3. Replace the `includes('/deep:')` bypass with a check on the command returned for the routed mode.
4. Update the two row-count sentences and the runtime sentence.
5. Resolve `COMMAND_POLICIES`: wire the consumer or delete the block and its emitter.
6. Delete the empty conditional.
7. Add one regression test per changed behaviour, each failing on the old code for exactly one reason.

## 7. Traceability status

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | Four P2 deviations across the generated tables and their docs. |
| `checklist_evidence` | core | partial | No packet checklist claim is contradicted; no claim covers the generated blocks. |
| `skill_agent` | overlay | pass | 36 doctor bridge owners match their 17 router `skill_agent` tags, 0 mismatches. |
| `agent_cross_runtime` | overlay | partial | Seven runtime labels accepted; architecture prose omits `dsh`. |
| `feature_catalog_code` | overlay | partial | Cosine 0.72 and margin 0.02 claims match the constants; the 45-row count does not. |
| `playbook_capability` | overlay | notApplicable | No playbook path in this surface. |

Resource Map Coverage Gate: skipped — no `resource-map.md` at init.

## 8. Deferred items

- Holdout-path hygiene for the `tune`, `fix` and report commands: the implementations live in
  `runtime/scripts/routing-accuracy/*` and belong to the `accuracy-runner` lineage. This lineage
  verified only that its own surface never reads or prints holdout rows, and read no holdout prompt
  text (counts only).
- Compiled-route mode selection for no-edit prompts: proving the reach of R2-P2-001 needs a write-safe
  probe of `.skilled/bin/compiled-route.cjs --hub sk-doc`, which is outside this lineage's write-safe
  scope.
- The `feature-catalog/cli-surface/advisor-recommend.md` sentence that names `COMMAND_POLICIES` as the
  policy source: `render-hooks-plugin` owns that file; it was cited as context for R4-P2-001 and not
  filed against.
- Runtime-specific command rendering (the hook brief and the six runtime adapters): outside this
  lineage; the runtime label set and the docs were checked, the renderers were not.

## 9. Audit appendix

- Iterations: `iterations/iteration-001.md` … `iteration-005.md`; deltas `deltas/iter-001.jsonl` …
  `iter-005.jsonl`; each iteration recorded once through `append-mode-event.cjs` (ledger sequences
  2-6, all exit 0) and reduced with `reduce-state.cjs`.
- Evidence style: every finding cites `file:line`. Four findings were reproduced by executing the
  shipped module with `node --experimental-strip-types`; four whole-table checks were executed
  (`COMMAND_ROWS` policy/class sweep, policy-map agreement, `MODE_COMMANDS` file existence, doctor
  owner tags).
- Scope audit: every write resolved under
  `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`.
  No review target, config, findings registry, dashboard, command, skill or mirror was hand-edited;
  the registry and dashboard are reducer output.
- Anti-sycophancy note: R2-P2-001 was tested against its own P1 promotion trigger in iteration 5 and
  held at P2 because the reach condition was not proven.
- Holdout handling: no holdout prompt text was read or printed in any iteration.
