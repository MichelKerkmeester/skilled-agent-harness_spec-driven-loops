# Iteration 8 — Operator/AI-user UX of the `/deep:research:auto` orchestrator

**Segment:** 1 | **Iteration:** 8 of 10 | **Mode:** research
**Focus:** verify or refute the six defects the orchestrator running this very loop reported, ranked by operator cost.

## Focus

I am the AI user the topic asks about: this loop is a fan-out CLI lineage executing
`deep-research-auto.yaml` through the native-executor pre-resolution path (v4.0.0.8). The six claims
come from the orchestrator that dispatched me. Six claims, six verdicts — each grounded in a line I
opened this iteration. The one thing I could *not* refute from inside the run is claim (e): it is
visible in my own injected prompt, which is the strongest evidence available.

## Actions Taken

1. Read `deep-research-config.json`: `executor.kind = cli-pi`, `maxToolCallsPerIteration = 24`,
   `lineage.generation = 2`, `sessionId = 2026-11-08T20:14:35.000Z`. The config has **no**
   `executor.type` key.
2. Mapped the six `if_cli_*` branches in `deep-research-auto.yaml` and their `dispatchId` literals.
3. Traced the prompt-pack template that produced my own prompt, and grepped for every source of the
   "12 tool calls" number and of `{last_3_summaries}` / `{last_focus}`.
4. Grepped the hub canon for the persona rule and the dispatch branches for any persona wiring.
5. Attributed each defect with path-limited `git log -S` against the two carrier files.

## Findings

**Verdicts: (a) confirmed, (b) confirmed, (c) confirmed, (d) confirmed, (e) confirmed, (f) confirmed.
Six for six — and the ranking by operator cost differs from the order asked.**

### f-iter008-001 — P0 — `dispatchId` is built from `{generation}` in three of six branches, while `post_dispatch_validate` requires `{config.lineage.generation}`

The three branches that this lineage can plausibly run — cursor, devin, pi — each build
`'research-i{n}-g{generation}'` [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1327]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1428]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1530]. The other three
(claude-code 1253, opencode 1639, codex 1737) and the validation step
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1816] all use
`{config.lineage.generation}`. `{generation}` is a bare token, not a config path.

- **Operator cost:** the dispatch receipt, the fencing label and the validator disagree on the
  identity of the same dispatch. Homozygous failure modes: the label is the literal string
  `research-i8-g{generation}` (no receipt matches it), or the renderer leaves it and the validator
  raises `schema_mismatch` — the run's *own* iteration record is rejected.
- **Release:** **refuted attribution to v4.** `git log -S"g{generation}"` on this file bottoms out at
  `330427cf30` (2026-09-17, the `.opencode` → `.skilled` move). The v4 line rewrote the surrounding
  dispatch and left the token. So: inherited from pre-`v4.0.0.0`, not introduced by v4.0.0.15.
- **Confidence:** high on the drift (three lines vs one); medium on which of the two failure modes
  fires, because the substitution engine's unknown-token policy is not in `prompt-pack.ts`
  (`renderPromptPack` only fills `PromptPackVariables`) — UNKNOWN.
- **Verify:** `grep -n 'g{generation}' .skilled/commands/deep/assets/deep-research-auto.yaml` and
  `grep -n 'dispatchId: "research-i{current_iteration}' .skilled/commands/deep/assets/deep-research-auto.yaml`

### f-iter008-002 — P0 — every executor gate reads `config.executor.type`; the schema key is `kind`

`skip_when: "config.executor.type == 'native'"`, `branch_on: "config.executor.type"`,
`executorKind: '{config.executor.type}'` and `branchId: '{config.executor.type}'` recur across the
file [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1198]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1204]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1248]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1585], while the config carries
`executor: {"kind":"cli-pi", ...}` and the runtime's own tests speak only of *kind*
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:92].

- **Operator cost:** this is the *branching* input. If `config.executor.type` resolves to nothing,
  `skip_when` is never true and `branch_on` has no matching key — so either the native path runs
  under a cli executor, or the native skip never fires and an external dispatch is attempted by a
  lineage that already declared itself the executor. In my run the consequence was a *hand-written
  prose fallback* at [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1796]: the rule
  now says "when this run is ITSELF a fan-out CLI lineage … do not run this dispatch script". That
  a prose patch was needed is the strongest evidence the typed gate does not fire.
- **Release:** `git log -S"config.executor.type"` bottoms out at `7a2dd5401a` (2026-10-03) — also
  **pre-v4**, inherited.
- **Confidence:** high that the field name disagrees with the schema; medium that the engine does not
  normalise `type` from `kind` somewhere outside `prompt-pack.ts` (not found, but the token resolver
  itself was not located this iteration) — UNKNOWN, flagged for a follow-up.
- **Verify:** `node -e "const c=require('./specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json');console.log(c.executor.type, c.executor.kind)"`

### f-iter008-003 — P1 — the leaf is told 12 tool calls while the config says 24, with no way for either side to see the other

"Target 3-5 research actions. Max 12 tool calls total." is a **static line** in the template —
[SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:36] —
not a `{max_tool_calls}` variable, and the same literal is repeated in the leaf contract
[SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:104] and in review's protocol
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:708].
Config says 24.

- **Operator cost:** a leaf that obeys its harness under-researches by 2×; a leaf that obeys the
  config is out of compliance with the prompt it was given. Both are "correct" readings of the same
  run. (This iteration is itself the demonstration: I ran out of budget with six claims verified and
  the resolver question still open.)
- **Release:** pre-v4 (`330427cf30`), inherited.
- **Confidence:** high — three copies of a literal, zero references to the config field.
- **Verify:** `grep -rn 'maxToolCallsPerIteration' .skilled/skills/system-deep-loop/deep-research/ .skilled/commands/deep/ | wc -l` → 0.

### f-iter008-004 — P1 — the projected state summary has no field contract, so focus renders `undefined` — visibly, in my own prompt

My injected prompt reads `Last focus: undefined`, `Segment: 1 | … | Last focus: undefined` and
`Last 3 Iterations Summary: run 5: undefined (0.72); run 6: undefined (0.63); run 7: undefined (0.81)`. The ratio
survives; the focus does not. The producer is a *prose instruction*, not code:
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:619] ("Extract focus from latest
iteration record, else 'none yet'") and
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:632] ("Summarize the latest 3
iteration records as 'run N: focus (ratio)'"). The gateway that writes the log never touches `focus`
at all — `grep -n focus` on `append-mode-event.cjs` returns nothing.

- **Operator cost:** the focus line is the operator's only "what is this run doing right now" signal,
  and it has been dead for **eight consecutive iterations** in this lineage. It also degrades the
  leaf: `Last 3 Iterations Summary` is the anti-repetition signal, and `run 5: undefined (0.72)`
  carries no direction, only a score. This is the cheapest defect to fix and the most continuously
  expensive to leave.
- **Release:** unknown-in-v4; the instruction predates the line numbers I can attribute cheaply.
- **Confidence:** high — observed in the prompt I was given, plus zero code paths producing the field.
- **Verify:** `rg -n 'last_3_summaries|last_focus' .skilled --glob '!node_modules'` (all hits are
  template slots and prose instructions; no producer).

### f-iter008-005 — P1 — an executor quota error burns an iteration slot, and changing executor costs the research tree

The failure record is a canonical iteration row — `{"type":"iteration", …, "status":"error",
"findingsCount":0,"newInfoRatio":0.0, …}` at
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2040] — and `maxIterations` counts
records of exactly that type. So a devin `resource_exhausted` is indistinguishable, to the cap, from
a real attempt. Separately, the only live lineage mode that resets executor state is `restart`
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:323], which archives to
`{state_paths.archive_root}/{timestamp_slug}`
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:330] — and the surrounding note
records that `fork` and `completed-continue` are "deferred and no longer runtime-supported"
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:332].

- **Operator cost:** worst-case combination is real for this audit: a run that hits quota three times
  has spent 30% of a 10-iteration budget learning nothing, and the operator's only remedy (swap
  `executor.kind`) forces a restart that archives `research/` — i.e. throws away the accumulated
  `findings-registry.json`, strategy and containment ledger to change a model id.
- **Release:** the single-executor workflow is v4 (`v4.0.0.3`, `v4.0.0.16` per the release notes);
  the retry-vs-archive coupling was not narrowed to a commit this iteration.
- **Confidence:** high on both mechanisms (records and modes are explicit); medium that no
  `quota → non-counting` branch exists elsewhere in the reducer (not fully read) — UNKNOWN.
- **Verify:** `rg -n '"status":"error"' .skilled/commands/deep/assets/deep-research-auto.yaml` and
  `rg -n 'lineage_mode' .skilled/commands/deep/assets/deep-research-auto.yaml`.

### f-iter008-006 — P1 (canon contradiction) — persona injection is required by the hub, impossible in the pack, and rejected by the executor policy

The hub mandates it twice: "Attach the resolved agent persona to every external-CLI dispatch"
[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:189] and names itself the canonical
contract owner [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:217]. But the prompt pack
has no persona block (zero `persona` hits in
[SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:1] and
zero in the 2,300-line dispatch YAML), and the executor schema *rejects* `agentPersona` for exactly
the kind this run uses
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:420].

- **Operator cost:** not a crash — a silent quality floor. Three sources disagree and each is
  locally satisfiable, so nothing fails and nobody notices the dispatched CLI has no persona. This is
  the "impossible to execute" class the topic asked for: a hub rule with no compliant execution path
  for `cli-pi`.
- **Release:** the persona clause and the `agentPersona` policy both landed in the v4 line; which one
  is canonical is a Logic-Sync decision, recorded here rather than asked (no operator present).
- **Confidence:** high on the three-way contradiction; medium that `cli-pi` attaches persona
  out-of-band on the command line (no `--agent`/persona wiring found in the YAML — no hits).
- **Verify:** `rg -n 'persona' .skilled/commands/deep/assets/deep-research-auto.yaml | wc -l` → 0.

## Questions Answered

- **UX: which steps of `deep-research-auto.yaml`, `deep-research-presentation.txt` or the
  `cli-*/SKILL.md` dispatch rules are unclear, contradictory or impossible to execute for the operator
  or an AI user?** — Answered for the auto dispatch path: two P0 identity defects (001, 002), one
  budget contradiction (003), one dead state field (004), one failure-handling cost (005) and one
  unexecutable canon clause (006). Presentation and `deep-review-auto.yaml` remain unread.

## Questions Remaining

- What *is* the unknown-token policy of the `{...}` substitution engine — literal passthrough, empty
  string, or error? It decides whether 001 is a mislabel or a hard validation failure, and whether 002
  breaks branch selection or merely mislabels it.
- Is there any normalisation that maps `executor.kind` onto `executor.type` before the YAML renders?
- Does the reducer treat `status:"error"` iterations as counting toward `maxIterations`, or only the
  cap gate? (Two code paths, one not read.)
- Persona vs `agentPersona` policy: which is canonical — hub §189/217 or the executor schema?
- `deep-research-presentation.txt` and `deep-review-auto.yaml` UX: unexamined.

## Next Focus

Close the substitution-engine question (it gates the severity of both P0s), then spend the remaining
iterations on the last two key questions: extension (fan-out runner / executor registry) and hub-canon
conformance.

## Post-Gateway Verification — one finding was wrong, and the correction outranks everything above

After committing the iteration record (gateway exit `0`, ledger sequence 12, `projectionRefreshed: true`)
I read the projected row back out of `deep-research-state.jsonl`. My record carried 14 fields; the row
that landed carries 7:

```
state-log row: type, iteration, run, status, newInfoRatio, ruledOut, timestamp
my record:     + runId, sessionId, lineageId, mode, target_agent, focus, answeredQuestions, graphEvents
```

**f-iter008-004's stated mechanism is refuted.** There *is* a producer: the leaf supplies `focus` and
`answeredQuestions` exactly as the contract demands. The gateway's canonical projection drops them.
That makes the real defect strictly worse — nothing is missing upstream, the state is being discarded
on the way to the only artifact every downstream consumer reads.

### f-iter008-007 — P0 — the canonical iteration projection keeps 7 of the 14 fields the record contract requires

The projected row is `{type, iteration, run, status, newInfoRatio, ruledOut, timestamp}`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:1]. `focus`,
`answeredQuestions`, `keyQuestions`, `generation` and `sessionId` are all discarded.

- **Operator cost, three ways:** (1) `last_focus`/`last_3_summaries` cannot render — proven above, and
  now explained for all eight iterations; (2) the *declared* recovery path ("the reducer reads the
  combined state log + delta files to rebuild dashboards and registries") loses every answered-question
  set, so a rebuild after interruption re-opens questions that were already closed; (3) `generation`
  and `sessionId` are dropped, so a state-log-only rebuild cannot fence per generation — which
  compounds f-iter008-001 rather than duplicating it.
- **Confidence:** high, and the highest confidence in this iteration — the evidence is a row read back
  from disk, not an inference from code.
- **Rank:** this is the highest-value finding of the iteration, ahead of f-iter008-001. The identity
  defects mislabel a dispatch; this one silently discards the state every consumer depends on. It was
  invisible to the previous seven iterations because they reported the *symptom* (undefined focus) from
  inside a prompt and never read the row back.
- **Verify:** `node -e "const r=require('fs').readFileSync('specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-state.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse).filter(x=>x.type==='iteration').pop();console.log(Object.keys(r))"`

**Revised ranking by operator cost:** f-iter008-007 ≫ f-iter008-001 ≈ f-iter008-002 > f-iter008-004
(symptom of 007) > f-iter008-003 > f-iter008-005 > f-iter008-006.

## SCOPE VIOLATIONS

None against the researched surface. Three notes on containment, recorded rather than hidden:

1. **My own delta was malformed and I repaired it.** Seven finding rows put their *category*
   (`drift`, `bug`, …) in the `type` discriminator instead of `type:"finding"`, so the reducer would
   have read `findings: 0`. Caught by reading my own artifact back, repaired in place with the category
   preserved as `findingType`. Final delta: 1 iteration, 7 findings, 3 observations, 3 ruled_out, 0 invalid lines.
2. **`specs/system-speckit/graph-metadata.json` shows as modified** in `git status` after the gateway
   commit. I did not write it; the gateway's post-commit projection did, outside its own run directory.
   Reported, not fixed.
3. `?? specs/001-test-feature/` was already untracked before this iteration.

None. No file outside this iteration's narrative and delta was written; the researched surface
(`.skilled/commands/deep/**`, `.skilled/skills/**`) was read only. The append gateway wrote the state
log as designed.
