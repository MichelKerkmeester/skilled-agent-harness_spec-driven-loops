# Iteration 4: Adversarial verification of the recommended refusal

## Focus

Take iteration 3's change 1 — a one-lineage refusal in `fanout-run.cjs`, predicate `(loopType === 'research' || loopType === 'review') && allLineages.length < 2`, escape `--allow-single-lineage` — and try to construct a **legitimate** caller it would wrongly refuse. Iteration 3 named three candidates: `fanout-salvage.cjs`, the council's `buildLineageCommand` path (already shown inert), and a resume of a run whose persisted config carries a single executor. This iteration worked all three, plus the two surfaces iteration 3 did not name: the `--count` replica path and any in-tree packet config that already holds a one-entry matrix. It also closes the oldest carried-forward question — whether the *correct* fan-out path ever writes `config.status: complete` — because that decides whether a status check is a safe gate or a false-positive generator.

**Ambiguity resolved:** "legitimate caller" was read as *a call the repository's own documents or artifacts already describe as legal*, not merely "a call that currently succeeds". A caller that only succeeds because the guard is missing is the incident, not a false positive. Deferred: whether the *policy* itself is right (that a one-executor, N-iteration fan-out lineage must be refused rather than fixed) — that is iteration 3's Finding 8 code path, unchanged here.

## Actions Taken

1. Read the guard's insertion region and the flag plumbing in `fanout-run.cjs` (`20-50` flag allowlist, `110-129` parser and `inputError`, `3370-3430` expansion and the `stopPolicy` guard).
2. Read `expandLineages` in full (`executor-config.ts:1148-1167`) to establish what `count` does to the lineage list the predicate counts.
3. Grepped every caller of `fanout-run.cjs` and read the stress fixtures that invoke it with executors (`stress/cli-adapter/fanout.vitest.ts:160-180, 752-806`); grepped the unit suites for the same shape.
4. Read the command docs' fan-out policy paragraphs (`research.md:108-129`, `review.md:93-99`) and the presentation policy lines (`deep-research-presentation.txt:68-71, 103-109`).
5. Read the YAML's fan-out step (`deep-research-auto.yaml:205-235`), the pre-existing single-lineage refusal precedent (`1204-1222`), and the status writer plus every `skip_to: phase_synthesis` (`2186`, `2325-2345`; review `deep-review-auto.yaml:226, 420, 1105-1111, 2451`; `deep-review-confirm.yaml:208, 408, 2011`).
6. Sampled persisted packet and lineage configs for a stored fan-out matrix (`deep-research-config.json` files across `specs/`), and grepped the runtime for any reader of a persisted `fanout.executors`.
7. Re-read `fanout-run.cjs:475-484` (`ACTIVE_FANOUT_LOOP_TYPES`, `assertActiveFanoutLoopType`) for the council exclusion path.

## Findings

1. **The predicate is right as written, but only because `count` expansion runs first — a "two or more labels" guard written literally over the *base* labels would refuse a documented path.** `expandLineages` keeps a `count: 1` entry as one lineage and expands `count > 1` into `${label}-1 … ${label}-N`, each carrying `count: 1`. So a single `--executor X --count 5` — documented as native fan-out that "runs N sequential `@deep-research` agent dispatches" — expands to five lineages and passes `allLineages.length < 2`. Counting *distinct base labels* instead would refuse it. The predicate as proposed (`allLineages.length < 2`, after expansion) is therefore the correct one, and the refusal message must say "expanded lineages", not "labels", or it will read as forbidding `--count`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1158]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1165]
[SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]
[SOURCE: .skilled/commands/deep/research.md:126]

2. **The one false positive is real, it is already in-tree, and it does not come from resume — it comes from a packet whose stored matrix has one executor.** `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/per-prompt-injection-audit/research/deep-research-config.json` persists `fanout.executors` of length one (`sol`, `iterations: 15`, `concurrency: 1`). Re-invoking that packet's matrix after the guard lands is refused unless `--allow-single-lineage` is passed. That is a *declared behaviour change*, not a defect: the run is the incident shape, so refusing it is the intent, but the change note must say that this packet needs the flag to continue. Contrast with a genuine two-lineage packet (`006-fanout-deep-review/review/deep-review-config.json`, `mimo` + `deepseek`), whose resume is unaffected. [SOURCE: specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/per-prompt-injection-audit/research/deep-research-config.json:5]
[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/deep-review-config.json:33]

3. **Iteration 3's third false-positive candidate is empty: nothing re-enters the guard from a persisted matrix, because nothing reads a persisted matrix.** Resume is decided inside `phase_init` (`on_resume` branch, state-artifact reconciliation), and the fan-out matrix is a render-time binding computed from the invocation flags — no runtime script reads a stored `fanout.executors`. A lineage child is marked by `config.fanout_lineage_artifact_dir` plus a `fanout` block holding `{label, concurrency, siblingLineage}` and **no** `executors` key, which is also why the YAML's `no entries in config.fanout.executors` skip keeps working inside a lineage. The escape flag is therefore needed for fixtures and for declared-flagless re-runs, not for resume. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:310]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]
[SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/lineages/deepseek/deep-review-config.json:36]

4. **The loop-type conjunction in the predicate is an optimization, not load-bearing: the council is refused by a code check two lines into the run.** `ACTIVE_FANOUT_LOOP_TYPES` is `{research, review}` and `assertActiveFanoutLoopType` throws `inputError` for anything else with the deprecation message, so no `council` lineage can reach the expansion at all. Iteration 3 proved this by import graph; this is a second, independent proof in code. Practical consequence: the reviewer may drop `(loopType === 'research' || loopType === 'review')` from the new condition without changing behaviour — keeping it costs nothing and documents intent, so keep it, but nobody should argue the change is council-unsafe. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:475]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:479]

5. **`--allow-single-lineage` is mandatory, not optional: at least three stress cases invoke the CLI with exactly one executor.** `fanout.vitest.ts` builds its configs as `executors: [{...}]` — one entry at `165`, one at `756`, one at `794` — and pins one shim capture per run, so a second entry would break the assertion, not just the setup. The unit suites do not exercise `fanout-config-json` at all (`rg` over `tests/unit` returns no executor matrices passed to the CLI), so the fixture cost is confined to the stress suite. Without the escape flag, change 1 makes three existing green tests red. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:165]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:756]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:794]

6. **The repository already ships the refusal this change adds, one layer up, and its wording is the one to reuse.** The research YAML's non-fan-out dispatch branch refuses `cli-deepseek-harness` with a stderr message — `'cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind'` — followed by `process.exit(2)`, and its note records that it "fails closed before any dispatch receipt is written". That is the house style for "this executor needs a fan-out, pick another route": name the two legal routes, fail closed before any side effect. `fanout-run.cjs`'s `inputError` path produces the same fail-closed shape (`{status:'error', code:'INPUT_VALIDATION'}`) before the pool spawns, so the new refusal should borrow this sentence rather than invent new wording. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1212]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1216]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1220]

7. **Change 2 must amend the trigger sentence itself, or code and doc contradict each other.** Both command docs currently say fan-out begins on "an `--executors` value" — a one-entry `--executors` matrix included — and "one independent lineage per label". With the guard in place a one-entry `--executors` value is refused, so appending a clarifying sentence to the same paragraph (iteration 3's plan) leaves the preceding line promising the exact call the code now rejects. The edit has to restate the trigger as *two or more expanded lineages*: two or more `--executor` groups, a `--count` above 1, or an `--executors` matrix that expands to two or more. Same wording in `research.md:125-128` and `review.md:97-98`, and the two presentation policy lines that repeat the trigger (`deep-research-presentation.txt:71`, `deep-review-presentation.txt:88`). [SOURCE: .skilled/commands/deep/research.md:125]
[SOURCE: .skilled/commands/deep/research.md:126]
[SOURCE: .skilled/commands/deep/review.md:97]
[SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:88]

8. **The carried-forward status question is answered, and it clears the status field of the false-positive charge: the correct fan-out path does write `status: complete`, unconditionally.** `step_update_config_status` has no `skip_when` and no fan-out branch, it sits in `phase_synthesis`, and every fan-out continuation jumps to `phase_synthesis` (`research-auto.yaml:1053,1056,1059`; `review-auto.yaml:420,1105-1111`; `review-confirm.yaml:408`). The writer exists in all three generated YAMLs (`research-auto.yaml:2340`, `review-auto.yaml:2451`, `review-confirm.yaml:2011`). So a packet left at `initialized` after a run is a *true* discriminator, and a check on it cannot false-positive a correct fan-out run — it still fires only after the damage, which is why it remains a report rather than a gate. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2340]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1053]
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2451]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:2011]

## Questions Answered

- **Does the correct fan-out path ever write `config.status: complete` at packet level?** Yes, unconditionally, via `step_update_config_status` in `phase_synthesis`, which every fan-out branch reaches. The status field is a safe post-hoc discriminator and cannot false-positive a correct run (Finding 8).
- **Should the escape be a flag or a config field?** A flag, and it is mandatory rather than optional — three stress fixtures pass one-entry matrices to the CLI and cannot be changed to two entries without weakening what they assert (Findings 3, 5). The field alternative would also need a schema change on the parse contract already ruled out in iteration 2.
- **Which legitimate callers would the predicate wrongly refuse?** None that survive the read: `--count > 1` passes (Finding 1), the council never arrives (Finding 4), resume carries no stored matrix (Finding 3). The only refused caller is a declared one — a flagless re-run of a one-entry packet matrix (Finding 2).

## Questions Remaining

None from the strategy's key-question set. The two carried-forward implementation questions are now settled (escape hatch, status field). One item is explicitly *not* research's to settle and remains with the follow-up packet: whether a fan-out lineage should later be given packet-level `phase_init`/`phase_save` so the "declared behaviour change" in Finding 2 disappears rather than being papered over by a flag.

## Ruled Out

- **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]
- **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]
- **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open.

## Dead Ends

- **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break.
- **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation.

## Edge Cases

- **Ambiguous input:** "legitimate caller" read as calls the repository documents describe as legal; deferred the policy question behind Finding 8 (whether one-executor fan-out should be fixed rather than refused).
- **Contradictory evidence:** code vs doc, found and reported rather than smoothed: with change 1 landed, the docs' trigger sentence ("an `--executors` value") promises a call the code refuses. Finding 7 converts the contradiction into a required doc edit; if only change 1 ships, the contradiction is real.
- **Missing dependencies:** none. No network source used; `resource-map.md` remains absent by config, so no coverage gate applies.
- **Partial success:** no suite was run. Every fixture claim is read-level (file contents and one assertion paragraph), not an observed test outcome. `durationMs` is a wall-clock estimate, not instrumented.

## Sources Consulted

- specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/per-prompt-injection-audit/research/deep-research-config.json:5
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/deep-review-config.json:33
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/lineages/deepseek/deep-review-config.json:36
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1148-1167
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:20-50, 110-129, 475-484, 3370-3430
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:160-180, 752-806
- .skilled/commands/deep/research.md:108-129
- .skilled/commands/deep/review.md:93-99
- .skilled/commands/deep/assets/deep-research-presentation.txt:68-71, 103-109
- .skilled/commands/deep/assets/deep-review-presentation.txt:85-88
- .skilled/commands/deep/assets/deep-research-auto.yaml:205-235, 310-321, 1049-1060, 1204-1222, 2325-2345
- .skilled/commands/deep/assets/deep-review-auto.yaml:226, 420, 1105-1111, 2451
- .skilled/commands/deep/assets/deep-review-confirm.yaml:208, 408, 2011

## Assessment

- New information ratio: 0.73
- Questions addressed: the guard's false-positive surface (all five caller classes) and the two carried-forward implementation questions (escape hatch, status field)
- Questions answered: 3 (status field; escape hatch; false-positive inventory)

## Reflection

- **What worked and why:** testing the *artifact* rather than the hypothesis. Reading `expandLineages` was expected to confirm "one entry means one lineage"; what it actually showed is that replica expansion rewrites labels, which is what makes the length predicate and the label predicate coincide — and what would have made a naively-worded label rule refuse `--count`. The second productive read was `rg`-ing for `fanout.executors` readers: an empty result is a stronger answer to a resume false-positive than any amount of reasoning about resume flow.
- **What did not work and why:** searching for a persisted-matrix reconstruction path consumed two calls and found nothing, because the design never persisted the matrix for re-use — resume is a workflow branch (`on_resume`), not a re-entry. The wrong prior was "resume must replay the same spawn"; the evidence is that lineage children are identified by `fanout_lineage_artifact_dir` instead.
- **What I would do differently:** sample a real packet config before reasoning about resume at all. The two config files took one call and settled both the "does a one-entry matrix exist" and "how is a lineage child marked" questions at once.

## Next Focus

**None required.** All strategy key questions are `[x]` and the two carried-forward implementation questions are settled. If a fifth iteration runs, the only remaining research value is a different artifact class: run the three stress fixtures against a patched `fanout-run.cjs` and record observed pass/fail, which converts this iteration's read-level fixture claims into executed evidence. That is verification of a change, not research about the workflow, and it belongs in the implementation packet.

## SCOPE VIOLATIONS

- **`research/research.md` was not updated again, although `progressiveSynthesis` is `true`.** The config enables progressive synthesis; this dispatch's allowlist names only `iterations/iteration-004.md`, `deltas/iter-004.jsonl` and the append gateway's own writes. The narrower allowlist was followed and no write was attempted; `research/research.md` still stops at iteration 1 pending the workflow's synthesis phase. Recorded rather than resolved: the two rules disagree and the dispatch allowlist wins by construction. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/deep-research-config.json]
