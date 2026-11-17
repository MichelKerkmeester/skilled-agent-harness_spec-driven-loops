# Iteration 4: Q6 — completed-run extension design for deep-research and deep-review

## Focus

Design an in-place way to add iterations to a completed packet (the deferred `completed-continue` lineage mode, surfaced as `--extend=N`). Traced `step_classify_session.on_completed_session`, `step_apply_lifecycle_request`, the ledger stems, the convergence cap/floor, the max-duration clock and the synthesis tail in both YAML workflows, plus both ledger schemas and the legacy upcaster.

## Actions Taken

1. Read both workflows' lifecycle steps: `deep-research.yaml` `step_apply_lifecycle_request`/`step_classify_session` and `deep-review.yaml` equivalents.
2. Read `loop-protocol.md` §Lifecycle Branch Contract and the Auto-Resume protocol.
3. Read `convergence.cjs` decision ordering (cap, floor, candidates) and `step_check_max_duration` in both YAMLs.
4. Read `gate_pre_synthesis.on_B`, `step_update_config_status`, `step_create_config`/`step_create_state_log`, synthesis read/extract steps.
5. Read `deep-research-ledger-schema.ts` stem registry and `legacy-compatibility.ts` upcast tables; grepped `deep-review-ledger-types.ts` stem statuses and `lifecycle-taxonomy.cjs`.
6. Grepped `fileProtection` consumers, `segment_start`/`segment` emitters, and `--lineage-mode` validation surfaces (command docs + compiled contracts).

## Findings

1. **The completed-session branches are asymmetric, and the Q6 premise is half wrong.** Research `on_completed_session` halts and releases the lock (`deep-research.yaml:515-519`: "Archive or replace the existing research/ tree"). Review `on_completed_session` does `skip_to: phase_synthesis` (`deep-review.yaml:584-587`) — a completed review re-synthesizes in place but cannot add iterations. `status:"complete"` is stamped late by `step_update_config_status` after synthesis and spec write-back (`deep-research.yaml:1923-1927`, `deep-review.yaml:2165`; initial value `initialized`, `deep-research.yaml:565`). [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:515-519,565,1923-1927; .skilled/commands/deep/assets/deep-review.yaml:584-587,2165]

2. **A confirm-mode extension path already exists inside the loop — the design only needs to extend it past `status:"complete"`.** `gate_pre_synthesis.on_B` = "Run more iterations (increase max)… raise maxDurationMinutes in the config too, or the duration check stops the loop again" → `phase_loop` (`deep-research.yaml:1766-1771`, mirrored at `deep-review.yaml:1878-1883`). This proves two things: the workflow already treats `maxIterations`/`maxDurationMinutes` as mutable despite `fileProtection."deep-research-config.json": "immutable"` (config field protection binds the LEAF and the optimizer `_optimizerManaged.lockedFields`, not the workflow itself — `step_update_config_status` already `edit`s the config), and the workflow already knows the duration clock must be raised alongside the iteration budget. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1766-1771,1923-1927; .skilled/commands/deep/assets/deep-review.yaml:1883; research config fileProtection block]

3. **The cap and floor need no code change for a raised `maxIterations`.** `convergence.cjs:1049` reads `config.maxIterations`; `iterationCount >= maxIterations` at :1115-1124 is the terminal STOP that outranks every veto. `minIterations` (1051) is a CONTINUE floor evaluated only when a stop candidate exists and only for `loopType === 'research'` (:1159-1161). Raising `maxIterations` in place re-arms the loop correctly because the reducer counts every `type==="iteration"` row in the log — pre- and post-extension iterations are one continuous count, which is exactly the desired semantics. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1049-1051,1115-1124,1159-1161]

4. **The max-duration clock is the trap the Q6 prompt predicted.** `step_check_max_duration` computes `elapsedMinutes = floor((now − Date.parse(config.createdAt))/60000)` and stops at `>= config.maxDurationMinutes` (`deep-research.yaml:882-902`, `deep-review.yaml:932-951`). Its own note: "The clock starts at the createdAt of the current generation's config. A resume keeps it and a restart resets it, so paused and waiting time counts." An in-place extension keeps `createdAt`, so a packet that completed near its 120-minute ceiling re-stops on the FIRST post-extension duration check unless `maxDurationMinutes` is raised (or `createdAt` re-stamped, which would erase elapsed-time audit). Design: raise `maxDurationMinutes` by a bounded addend, never re-stamp `createdAt`. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:882-902; .skilled/commands/deep/assets/deep-review.yaml:932-951]

5. **Ledger vocabulary is closed; an `extended` event needs a new stem per mode.** Research legacy rows upcast through `LEGACY_EVENT_STEMS` (`legacy-compatibility.ts:32-71`) into `deep_research.run_resumed`/`run_restarted` (schema `DATA_FIELD_RULES` at `deep-research-ledger-schema.ts:263-278`; scope fields `['runId','lineageId']` at :741-742); unknown event names are refused by the upcaster. Review appends canonical stems directly (`deep_review.run_resumed` at `deep-review.yaml:469,484`; `run_restarted` at :777; `run_initialized` at :748). Both schemas lack any extension stem; `deep_review.run_completed` is *reserved* (deep-review-ledger-types.ts:646 — "closure is the reducer inference from flat rows"), so there is no run-termination event today either — `status:"complete"` lives only in config. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:32-71,601-620; .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:263-278,741-742; .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:620-653]

6. **`completed-continue` is already the reserved name — adopt it rather than inventing a parallel flag.** It sits in `lineage.deferredModes` in this run's config, is named "deferred and rejected" in the flag docs (`research.md:109`, `deep-review.yaml:58`), and is named in both `note_deferred_branches` strings (`deep-research.yaml:514`, `deep-review.yaml:538`) and the Lifecycle Branch Contract (`loop-protocol.md:119-146`). Implementing it = moving it from `deferredModes` to `allowedModes`, adding `--lineage-mode=completed-continue` (with `--extend=N` as the ergonomic spelling that also carries the addend), and wiring one classify branch. An `--extend=N` flag without the mode would still need the same event+config machinery while diverging the vocabulary. [SOURCE: .skilled/commands/deep/research.md:108-109; .skilled/commands/deep/assets/deep-research.yaml:68,514; .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:119-146; deep-research-config.json lineage block]

7. **Recommended event+config shape.** Record through the gateway a new stem `deep_research.run_extended` / `deep_review.run_extended` (mirroring `run_resumed` fields: `priorTailDigest`, `sourceLineageId`=same sessionId, `generation`=same, `continuedFromRun`=completed iteration count, plus `extension:{addedIterations, priorMaxIterations, newMaxIterations, priorMaxDurationMinutes, newMaxDurationMinutes, priorStatus:"complete"}`). Config mutation, same sessionId/generation/createdAt: `status:"complete"`→`"active"` (any value ≠ `complete` so next classify lands `resume`); `maxIterations += N` (cumulative — convergence counts all rows); `maxDurationMinutes += M`; `lineage.continuedFromRun = <count>`; optional `lineage.extensionCount += 1`. Placement: extend `step_apply_lifecycle_request`-adjacent processing BEFORE `step_classify_session` (pre-classify mutation makes classify land `resume` naturally), or add an `on_completed_continue` classify branch — the pre-classify mutation is the smaller diff but the distinct event must still be appended through the gateway so the dashboard Lifecycle section can show the top-up. `lifecycle-taxonomy.cjs` needs no change (extension is not a STOP_REASONS value). [INFERENCE: based on findings 1-6]

8. **Segment seam exists but is unwired.** `current_segment` extraction reads "Latest segment_start event segment, else 1" (`deep-research.yaml:1737`) and iteration rows may carry `"segment":1` (`convergence-reference-only.md:46`), yet nothing in the runtime emits `segment_start`. If the `extended` event carries `segment:<n>` (or doubles as the segment marker), the prompt-pack `Segment: N` display and reducer ancestry get the pre/post boundary for free; post-extension iteration rows could then carry `segment:2`. Cheapest honest version: keep all iterations in one segment and let the `extended` event itself be the boundary marker in the dashboard. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1737; .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md:46]

9. **Edge: extension under `stopPolicy:convergence` re-stops immediately if no questions were added.** `all_questions_answered` (`convergence.cjs:1149-1150`) is still true after extension when the question set is unchanged; quality guards may CONTINUE it, but the honest contract is: an extension should be coupled with inbox question injection (`research/inbox.jsonl` for research — the review side has no question surface, per iteration 3's finding) or documented to need `--convergence-mode=off`/`stopPolicy=max-iterations` for the extension window. This is the single largest behavioral subtlety of the feature. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149-1150; iteration-003 findings]

10. **Files and tests that change.** Docs/flags: `.skilled/commands/deep/{research.md,review.md}` argument tables (un-reject `completed-continue`, add `--extend`); `deep-{research,review}.yaml` `lineage_mode` param descriptions (:68/:58), `note_deferred_branches` (:514/:538), new `completed-continue` handling (pre-classify config mutation step + gateway append, or `on_completed_continue` branch; review's `on_completed_session` must check lineage_mode before `skip_to: phase_synthesis`); regenerated `deep-{research,review}.contract.markdown` + `-presentation.txt`. Schemas: `deep-research-ledger-schema.ts` (`DATA_FIELD_RULES`, `SCOPE_FIELDS`, wire types), `deep-research-ledger-types.ts`, `legacy-compatibility.ts` (`LEGACY_EVENT_STEMS.extended` + upcast case + `ReducerReadRowShape`), `deep-review-ledger-types.ts` + its schema (new `deep_review.run_extended`, status `spoken`). Protocol: `loop-protocol.md` Lifecycle Branch Contract row + event contract; deep-review protocol §Lifecycle Branches. Config assets: `deep-review-config.json` asset and the research config template for `allowedModes`. Tests: `runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` (extend ordering coverage), `system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts`, ledger-schema + upcast vitest suites, reducer parity tests for the dashboard Lifecycle section (`loop-protocol.md:146` mandates parity), a manual-testing-playbook entry, and a telemetry test that two `completed` terminal rows for one sessionId are tolerated (`step_telemetry_heartbeat_terminal`, `deep-research.yaml:1929-1937`). Synthesis path needs no change: `step_read_all_iterations` globs `iteration-*.md` and `step_update_config_status` re-marks complete; the spec.md fence write-back is a whole-block replace and is idempotent. [INFERENCE: consolidated from findings 1-9]

## Ruled Out

- **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling.
- **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes.
- **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry.

## Dead Ends

None — all paths read productively. (Candidate for reducer promotion: none.)

## Edge Cases

- Ambiguous input: "completed-continue or an --extend=N flag" — resolved: implement the mode, spell it `--extend`. Deferred alternative (bare flag) recorded in Ruled Out.
- Contradictory evidence: Q6's premise "a completed packet halts" holds only for research; review `skip_to: phase_synthesis` instead. Both preserved in finding 1.
- Missing dependencies: none.
- Partial success: none — all planned reads succeeded.

## Sources Consulted

- `.skilled/commands/deep/assets/deep-research.yaml:240-535,545-604,882-902,1700-1989`
- `.skilled/commands/deep/assets/deep-review.yaml:240-607,709-714,932-951,1860-1899,2165`
- `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:95-214`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1040-1169`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:253-349`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:25-104,560-669`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:620-702`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs`
- `.skilled/commands/deep/research.md:3,17,20,108-109` and `deep/assets/compiled/deep-*.contract.markdown` lineage surfaces

## Assessment

- New information ratio: 0.9 (9 of 10 findings fully new ground — the completed-session path, ledger vocabulary, clock trap, segment dormancy, and file/test surface were unexamined until now; finding 3 partially overlaps iteration 2's cap reading)
- Questions addressed: Q6 (all sub-parts: config fields, ledger event, reducer/floor/clock/synthesis treatment, files and tests)
- Questions answered: Q6

## Reflection

- What worked: tracing the classify branches in both YAMLs first exposed the research/review asymmetry that reframed the whole question; reading the schema's `DATA_FIELD_RULES` + the upcaster side by side priced the ledger change precisely (new stem + upcast case + read shape, not a rewrite).
- What did not work: nothing failed; `fileProtection` enforcement needed only a grep to establish it binds the LEAF/optimizer rather than the workflow.
- What I would do differently: nothing material — the remaining unknown (exact reducer dashboard rendering point for the event) is bounded and named in finding 10.

## Recommended Next Focus

Iteration 5 (final): Q5 — fold the completed-run extension design (finding 10's file/test list) plus iteration 3's review-side findings into the concrete change-slice plan with ordering and default-path risk; Q4 (skill-advisor df-idf.ts) only if budget remains.
