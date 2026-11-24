# Iteration 004 - Traceability (seventh to ninth round: REQ-035 to REQ-046, AC-043 to AC-054)

## Dispatcher

- Mode: review, lineage `deepseek-max-1`, generation 1, iteration 4 of 7.
- Dimension: traceability, fourth slice: the last three rounds - REQ-035 to REQ-046 against the gate and the scorer, AC-043 to AC-054 against their cells, ADR-007 and ADR-008 read as the decisions.
- Operator review focus: this slice closes the requirement sweep the focus asks for; after it, every REQ-001 to REQ-046 has been read against its producer.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:247` to `:258` (REQ-035 to REQ-046), `:285`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:101` to `:111` (AC-044 to AC-054)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603` (ADR-007), `:702` (ADR-008)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` parsed: `plural-*` rows at `:262` to `:278`, `how-*` rows at `:279` to `:285`, `effort-*` rows at `:286` to `:309`, `no-edit-*` at `:310` to `:312`, `refused-cue-*` at `:313` to `:317`, `-served` rows at `:318` to `:325`, `typed-doctor-*` at `:328`, grammar rows at `:332`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:634` (`hasUnrefusedPronounRerun`), `:649`, `:661`, `:773` (`LOOP_ASK_REFUSED_AFTER`), `:1119`, `:1123`, `:1592`, `:1648` (`routedLoopMode`), `:1673`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454`, `:457`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489`, `:1571`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362` (`MIN_BLOCKED_ATTEMPTS`), `:2386`, `:2420`; `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80`, `:423`, `:448`, `:483`, `:485`; `tests/scorer/deep-loop-plural-noun.vitest.ts:26`; `tests/scorer/doctor-handoff-command.vitest.ts:206`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (`metrics.false_offer` = 0 of 57, `attachedMetrics.false_offer_attached` = 1 of 57, 155 recorded rows, `capturedAtSha a139ac3b248`), `command-prompts.jsonl` (247 rows, 31 `near-miss`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. Every behaviour claim in the last three rounds holds on the tree; the one finding is the fixture-span citation in three rows.

### P2 Findings

1. **AC-044, AC-045 and AC-046 cite fixture spans that the ninth round moved** -- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:253` -- AC-044 says the eight plural run rows run "from `plural-deep-reviews-use-verb` to `plural-review-loops` (`:253`)" and the five negatives "from `plural-deep-reviews-stuck` to `plural-deep-reviews-question` (`:261`)". The eight run rows are `:262` to `:269` and the five negative rows are `:270`, `:271`, `:272`, `:277` and `:278` - the range now also contains two past-summary rows and two effort rows that are not plural rows at all. AC-045 cites `:266` and `:271` for the two `how do` / `how can` question rows, which are at `:279` and `:280`, with the run-after-question row at `:284`; AC-046 cites `:273` for the complaint family, which opens at `:286`, and `:286` for the four effort controls, which are at `:299` to `:302`. All three rows' substance holds when the rows are located by id.
   Finding class: evidence-pointer drift.
   Scope proof: a parse of the fixture prints each id with its line, and the values match the three criteria (`asksForLoopRun` true on the eight, false on the five, false on the thirteen complaints and true on the four controls).
   Affected surface hints: `acceptance-criteria.md` AC-044, AC-045, AC-046 cells.
   Case: a reader slicing `:253` to `:261` for the plural run rows gets ten past-run and effort rows and none of the eight.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` (REQ-035 to REQ-046) | pass | Every requirement maps to a producer, a fixture column or a test line, and every substance claim was confirmed against the tree; three AC cells carry a stale fixture span, recorded as R4-P2-001. |

Requirement by requirement:

- REQ-035: the plural rows read as asks (`plural-*` `:262` to `:269` true, `:270` to `:278` false), `explicit.ts:457` reads `loops?`, and the mode-free row `plural-deep-loops-served` carries `servedRun: null` as ADR-008 amends.
- REQ-036: `how-do-run-deep-review` and `how-can-research-loop-stop` read false, `how-do-then-run-deep-review` reads true, and `LOOP_QUESTION_AUXILIARIES` is the 22nd compared pair at `deep-loop-offer-cases.vitest.ts:87`.
- REQ-037: the thirteen complaint rows read false and the four controls read true; `LOOP_EFFORT_WORDS` and `LOOP_EFFORT_LEADS` carry per-entry cases at `:333` and `:338`.
- REQ-038: `trackedCommandForOwner` at `skill-advisor-cli.ts:1489`, read at `:1571`, and `cli-degraded-command-contract.vitest.ts:152`/`:178` pin both the kept and the dropped case.
- REQ-039: `metrics.false_offer` is `{count: 0, total: 57}` and `attachedMetrics.false_offer_attached` is `{count: 1, total: 57}` - the one attached row is V7, which T047 records as unchanged. The corpus holds 31 `near-miss` rows over 247 commits of case history.
- REQ-040: `no-edit-*` rows `:310` to `:312` carry `readOnlyRunKept` `review`, `review`, `research`, and `READ_ONLY_LOOP_MODES` is compared as a pair.
- REQ-041: `LOOP_ASK_REFUSED_AFTER` at `command-attach.ts:773` gates the cue blanking at `:1119` and `:1673`; the five `refused-cue-*` rows read the asked mode.
- REQ-042: `routedLoopMode` is defined at `:1648` and read on the routed single-target branch at `:1592`.
- REQ-043: `hasUnrefusedPronounRerun` at `:634`, read at `:649`, `:661` and `:1123`; the pronoun rows read true and the past-summary rows carry `doctorWithheld: true`.
- REQ-044: effort-manner rows at `:303` to `:305` read true while the complaint at `:306` reads false; `typed-doctor-comma-joined` at `:328` carries `doctorWithheld: false`.
- REQ-045: the mode-surface block at `:485` asserts `MODE_CUES`, `MODE_CUE_WORDS` and `HUB_ROUTER.routerSignals` against `SERVED_MODES`, which is `Object.keys(MODE_COMMANDS[DEEP_LOOP_HUB])` at `:483` - the command table is the reference, so all four surfaces are compared. `NAMED_LOOP_MODE` is compared with `_NAMED_LOOP_MODE_RE` at `:423`.
- REQ-046: `MIN_BLOCKED_ATTEMPTS = 2` at `:2362` with its use at `:2386`, the authored-heading absorption at `:2420`, and `enrichCompiledRoutes` at `advisor-recommend.ts:363` with its duplicate set.

Decisions:

- ADR-007 (`decision-record.md:603`) amends REQ-011 to the two aliases the hub carries; iteration 1 confirmed both are present and `autonomous research` is absent.
- ADR-008 (`:702`) amends REQ-035 for the mode-free plural; the fixture row above carries the null it describes.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:457` is the scorer surface REQ-035's plural promise rides on; without it the hub lane is never pushed for a plural loop noun even though the gate serves the command.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` is the served-head enrichment REQ-046 changes, and its duplicate set is what keeps a derived command from being offered twice.

## Edge Cases

- AC-050's "sweep of 338 prompts" and AC-053's "3,729 generated grammar prompts" have no committed artifact under `scratch/probes/`. They are corroborating prose on a code anchor that does resolve, so they are recorded as unverifiable rather than as findings.
- AC-039's "3 files, 108 tests passed" and AC-054's "190 files, 3,632 passed" are run claims this read-only review cannot reproduce; the test files they name exist.
- The baseline stores only totals (57), so AC-012's "0 over the 35 rows that existed before" cannot be re-derived from the committed file; `implementation-summary.md:156` carries it as a recorded observation.

## Confirmed-Clean Surfaces

- AC-043, AC-047, AC-048, AC-049, AC-050, AC-051, AC-052, AC-053, AC-054: their code anchors resolve and their stated behaviour exists in the tree.
- REQ-035 to REQ-046: no requirement-level gap found. This is the first slice in the run that closes with a single finding.

## Ruled Out

- "The mode guard covers only the deferred route": `routedLoopMode` is read at `:1592` (the routed single-target branch) and defined at `:1648`.
- "A mode-free plural ask still serves a command": `plural-deep-loops-served` carries `servedRun: null`, matching ADR-008 and the singular row.
- "The corpus `false_offer_attached` count regressed": it is 1 of 57, the V7 near-miss row the packet added by design.

## SCOPE VIOLATIONS

None.

## Next Focus

- Dimension: correctness
- Focus: the gate's served behaviour on the prompts the packet names, read through the built module rather than the prose, plus the state machine of the refusals and the typed-over-stuck precedence
- Reason: traceability is complete across all four slices; correctness is the next configured dimension and it is where a claim can be true in code yet wrong in effect.
- Rotation status: traceability closes with `spec_code` `pass` on substance and `checklist_evidence` `partial` on the citation layer; correctness starts next.

Review verdict: PASS
