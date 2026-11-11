# Iteration 1: Enforcement map — what the code holds, what only prose holds

## Focus

Establish, for the chat-started deep-loop incident, (a) which lines invited or allowed the bypass and which steps of the single-executor path are enforced by code rather than prose, and (b) why a fan-out lineage runs all its iterations in one process and whether anything records that. Focus chosen because strategy Section 11 (Next Focus) is empty and this is the first unchecked key question; it is also the question every later fix option depends on.

Ambiguity resolved: the topic's phrase "the workflow" has three candidate referents (the command doc, the YAML, the skill). Treated as the YAML's `phase_init → phase_loop → phase_synthesis → phase_save` sequence, since that is what the incident names as skipped. Deferred: whether `deep-research-confirm.yaml` has a different contract (not read).

## Actions Taken

1. Read the incident record and the 250-line driver end to end.
2. Read `.skilled/commands/deep/research.md` in full (175 lines) and grepped the 2,539-line auto YAML for phase/step boundaries, then read the fan-out step, the init phase, and the synthesis/save phases verbatim.
3. Read `fanout-run.cjs`'s child-prompt construction (lines 1540–1725), its lineage-session reader (620–646), its anomaly collector (1325–1329, 4193–4218), and its exit-code path (4244–4275).
4. Grepped `verify-iteration.cjs`, `fanout-merge.cjs`, `synthesis-closeout.cjs` for their verdict conditions and read the relevant bodies.
5. `rg` over `.skilled` for callers of `fanout-run.cjs` and for any assertion on `config.status === 'complete'`, to find checks that live outside the workflow.

## Findings

1. **The fan-out policy is prose keyed on flag shape, and the script it points at never re-checks it.** The command doc states the rule — "zero or one `--executor` and no `--executors` runs the single-executor path; two or more `--executor` flags, an `--executors` value, or any `--count` above 1 switches to fan-out" — and the presentation asset repeats it as a binding default. `fanout-run.cjs` accepts `--fanout-config-json` and spawns exactly the lineages it is handed, with no comparison against that policy and no minimum lineage count. A one-entry JSON therefore reaches the fan-out path while the caller believes it selected the runner for the single-executor path. [SOURCE: .skilled/commands/deep/research.md:125]
[SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3456]

2. **The fan-out path does not merely skip `phase_init`; it is defined as not containing it.** The YAML says: "After all lineages complete, jump directly to phase_synthesis — skip phase_init and phase_main_loop entirely (those are the single-executor path)." So the packet-level lock, session classification, spec check, config creation, state-log creation, strategy and registry steps are absent from fan-out by design, for *every* lineage count, not only for the incident's single lineage. The child prompt then re-asks for those phases in prose: "Run phase_init, phase_main_loop (…), and phase_synthesis." Nothing outside the child's own compliance notices whether it did. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:207]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:217]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1710]

3. **In-process iteration is a deliberate CLI-lineage design, stated in the prompt and explained in the code comment — and it silently overrides the repo's stated "fresh context per iteration" principle.** The child prompt carries a section headed "EXECUTION MODE (read this first): THIS process is the executor for EVERY iteration", followed by "The workflow YAML's per-iteration executor-dispatch steps are ALREADY SATISFIED by this process: treat them as done and run the iteration inline" and an explicit prohibition on nested dispatch. The adjacent comment gives the causal reason: a leaf that reads the YAML literally "spawns a nested CLI from inside its own sandbox, where nested dispatch is denied — the lineage then burns every iteration on dispatch failures and produces zero findings." Meanwhile the YAML's operating principle still reads "Fresh context per iteration + externalized state = no context degradation", and the mode skill calls fresh context per dispatch its "Core Innovation". Neither document names the CLI-lineage exception. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1568]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1583]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:35]
[SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:152]

4. **Nothing records or reports that a lineage's iterations shared one context.** The only artefacts that differ are timestamps and durations: the incident's ten-iteration run finished in 577 s with iterations 7, 9 and 10 sharing a modification second. The repo already computes exactly that signal — `checkLineageTimestampWindow` compares every state record's `timestamp` against the lineage's dispatch window with a tolerance, `collectTimestampAnomalies` gathers the results, and a `timestamp_anomaly` row is written to the status ledger and folded into `orchestration-summary.json`. It is explicitly non-fatal: "Timestamp telemetry is advisory and cannot affect lineage fulfillment", and the exit code is computed from `fulfilled`/`rejected` only. A reported warning existed; nothing surfaced it to the operator. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:79]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4193]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4216]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272]

5. **Every hard check in the loop is invoked from inside a YAML step, so a route that skips the workflow skips all of them at once.** The gateway fences state rows and refuses stable-identity-less records; `verify-iteration.cjs` requires the narrative, the delta's `type=iteration` row, the state record, and a gateway-backed ledger; `synthesis-closeout.cjs` fails closed on missing synthesis artefacts and on state findings not reflected in the registry. Each of these is *called by* `step_dispatch_iteration`, `step_reduce_state`, `step_fanout_merge` or `step_synthesis`. There is no caller outside the workflow, so none of them can be reached by a route that did not enter the workflow — which is the structural reason the incident produced no failure in any of them. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:445]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:497]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:329]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1163]

6. **`verify-iteration.cjs` passes on a run whose packet-level phases never happened.** It verifies per-iteration artefacts inside whatever `--artifact-dir` it is given: narrative non-empty, delta present, state record for that iteration, gateway receipt. It does not assert that a lock was ever acquired, that session classification or the spec check ran, that synthesis wrote back, that a continuity save ran, or that config status became `complete`. Its route proof degrades to a warning when the projection carries no leaf dispatch fields, and an inline executor that writes the route-proof fields itself satisfies it. Ten clean passes are compatible with zero packet-level workflow. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:476]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:531]

7. **No script anywhere asserts that a run completed.** The YAML's completion marker is a one-field edit — `step_update_config_status` sets `status: "complete"`. Across the runtime's scripts the only reader of that field is `readStoredLineageSessionId`, which uses `config.status === 'complete'` solely to decide whether to reuse a session id. The incident's third run stayed `initialized` and nothing objected. This is the cheapest possible completion check: the marker is already written by the workflow and already meaningful to the code. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2340]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:640]

8. **One file's report is the leverage point for all three modes.** `fanout-run.cjs` is the shared lineage executor: `deep-ai-council/scripts/orchestrate-session.cjs` calls it, `deep-review` reaches it through the same `--loop-type review` surface, and the prompt/skill paths are already parameterised by loop type. A reporting change inside `fanout-run.cjs` lands on research, review and council simultaneously; a per-mode compliance check would have to be built three times. [INFERENCE: based on the loop-type parameterisation at fanout-run.cjs:1540 and the council caller found by rg over .skilled]

## Ruled Out

- **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps.
- **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests.
- **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530]
- **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts.

## Dead Ends

- Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`.
- Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do.

## Edge Cases

- **Ambiguous input**: "the workflow" had three referents (command doc, YAML, skill). Resolved to the YAML's phase sequence; the confirm-workflow variant was deferred and is unread.
- **Contradictory evidence**: yes, and it is load-bearing. `deep-research/SKILL.md` and the YAML both state fresh context per iteration as a core property, while `fanout-run.cjs` instructs the CLI lineage to be the executor for every iteration. Both are current, both are authoritative for their scope; the contradiction is unresolved by any other document. Recorded rather than smoothed: the CLI-lineage exception exists in code only. No operator is present, so no LOGIC-SYNC halt is raised.
- **Missing dependencies**: none. `research/resource-map.md` is absent by config; no coverage gate applies.
- **Partial success**: none material. Nothing was fetched from the network, so no source-failure path was exercised.

## Questions Answered

- Which lines in the command doc, the workflow YAML, the skills and AGENTS.md allowed or invited the bypass in the incident, and which steps of the single-executor path are enforced by code as opposed to prose? Cite file and line.
- Why does a fan-out lineage run all its iterations in one process, is that by design, and does anything record or report that a lineage's iterations did not each get a fresh context?

## Questions Remaining

- Which existing checks could have caught the incident before or after the run, and why did each not fire? (Largely answered as a by-product here; the positive case — what would have fired on the driver path too — is not yet tested.)
- What are the candidate fixes, their cost, their cost on the seven runtimes, and their behaviour in a dispatched child?
- What is the smallest set of changes, and what should not be built?
- Unasked but open: does the *correct* fan-out path ever write `config.status: complete` at packet level, given `step_update_config_status` lives in `phase_synthesis` and fan-out reaches `phase_synthesis`? This decides whether a status check would be a safe gate or a false-positive generator.

## Sources Consulted

- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md:1-30
- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py:37-47, 116-266
- .skilled/commands/deep/research.md:11-22, 27-45, 56-80, 103, 105-128, 169-175
- .skilled/commands/deep/assets/deep-research-auto.yaml:25-37, 179-235, 240-250, 284, 302, 387, 444, 456, 536-586, 591-600, 1163, 2186-2210, 2315-2343, 2439-2470
- .skilled/commands/deep/assets/deep-research-presentation.txt:68-71, 95-109, 343-366
- .skilled/skills/system-deep-loop/SKILL.md:36, 63, 91-93
- .skilled/skills/system-deep-loop/deep-research/SKILL.md:3, 13, 150-154, 163-168, 212, 225-229, 266
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:406-414, 620-646, 1325-1329, 1540-1725, 3456-3495, 4193-4218, 4244-4275
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:275-303, 351-372, 393-445, 476-531
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1501-1545
- .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:300-345, 381-424
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:79-99
- .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs (caller of fanout-run.cjs; located by rg)
- AGENTS.md:20-28, 86-89
- .skilled/repo-rules/delegation-and-orchestration.md:126-150, 207-222

## Assessment

- New information ratio: 0.88
- Questions addressed: Q1 (enforcement map), Q2 (one-process lineage, by design, recorded only as advisory telemetry)
- Questions answered: both of the above

## Reflection

- **What worked and why**: reading the *script the incident actually ran* rather than the workflow it was supposed to run. `fanout-run.cjs`'s child prompt (1585–1600) is the only place in the repo that states the in-process rule, and it explains itself; that single block converted "unexplained speed" into "designed behaviour with an undocumented exception". Pairing it with the YAML's fan-out step (207–219) then showed the packet-level phases are absent from fan-out by construction, which reframes the incident from operator error to a missing boundary.
- **What did not work and why**: searching for a completion assertion by name. No file contains one, so the search returned only `readStoredLineageSessionId`, which reads the field for an unrelated purpose. The conclusion "nothing asserts completion" is therefore a negative result and is stated as one, backed by the `rg` over `runtime/scripts`. A first pass also tried to treat `verify-iteration.cjs` as the workflow's validator; its signature (`--loop-type`, `--artifact-dir`, `--iteration`) makes it per-iteration by construction, which I should have read before assuming.
- **What I would do differently**: check the caller graph before the check bodies. The decisive fact is not what each check tests but that every caller sits inside a YAML step; one `rg` for callers would have reached Finding 5 first and saved a pass through `synthesis-closeout.cjs`.

## Next Focus

**Recommended next focus:** answer the open question that gates the fix design: does a legitimate fan-out run ever leave the packet `config.status` at a non-`complete` value, and does the native-vs-CLI lineage split change that? Trace `phase_synthesis`/`step_update_config_status` on the fan-out route end to end, then price the three cheapest candidates against it — a `config_status` field in `fanout-run.cjs`'s existing summary, escalation of the already-computed timestamp anomaly from advisory to reported, and one line in `.skilled/commands/deep/research.md` beside the fan-out policy naming what the fan-out path does not do. Do not open the "new runner command" option before this is settled: the driver is 250 lines of YAML-block extraction (source: scratch/single-executor-driver.py:37-47), which is a second template engine, not a thin wrapper.
