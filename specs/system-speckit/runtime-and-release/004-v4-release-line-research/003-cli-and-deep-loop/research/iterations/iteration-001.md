# Iteration 001 — Fan-out Parity

Segment 1, iteration 1 of 10. Read-only audit; no fix was applied.

## FOCUS

Fan-out parity across the executor registry. For every kind in `EXECUTOR_KINDS`, compare four
independent declarations that all claim to describe the same executor set:

1. `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` in the TypeScript registry
2. `LINEAGE_COMMAND_ADAPTERS` in the fan-out runner
3. the enforced model allowlists and defaults, which exist twice — once per file
4. the `if_cli_*` single-executor branches in the deep workflow YAMLs

The secondary target was the v4.0.0.0 claim that "the executor you name is the one that runs",
which is the user-visible promise all four declarations are supposed to keep.

## ACTIONS TAKEN

1. Enumerated `EXECUTOR_KINDS` (8 entries) and `EXECUTOR_KIND_FLAG_SUPPORT` (8 keys) in the
   registry, and `LINEAGE_COMMAND_ADAPTERS` (8 keys) in the runner. Tri-parity holds — every
   kind has an adapter, a flag-support row and a schema enum slot. No orphan in either direction.
2. Diffed the four duplicated model allowlists programmatically (node set comparison over the
   source text of both files, not by eye). Result: exact parity, 10 Pi ids, 29 Cursor ids,
   23 Devin ids, 2 DSH ids, with identical defaults in both files. Recorded as an invariant.
3. Diffed the seven `cli-*/SKILL.md` default-model statements against the runner constants. Six
   of seven name the same family; two packets publish a second, different "default" for a
   different context (hand-written dispatch vs unpinned lineage), which is deliberate and
   test-enforced — see Ruled Out.
4. Counted `if_cli_*` branches in both auto YAMLs and matched them against `EXECUTOR_KINDS`.
   This is where the parity claim breaks: the review YAML has seven branches and there are seven
   CLI kinds, so a count check passes while the two sets differ by one in each direction.
5. Read the drift test that is supposed to keep runner fallbacks and packet prose in family, and
   found it enumerates six kinds. The seventh — the one added most recently — is absent.
6. Traced the release-note claims in `v4.0.0.0.md` (seven bridges, roster sizes) and `v4.0.2.0.md`
   (Hermes out, DeepSeek Harness in) against the current tree.

## FINDINGS

### f-iter001-001 — `cli-deepseek-harness` has no single-executor branch, and a note claims it does

**Type** drift + bug · **Severity** P1 · **Release** v4.0.2.0 · **Confidence** high

`cli-deepseek-harness` is a first-class executor kind with an adapter, a flag-support row and a
hub mode. It has no `if_cli_deepseek_harness` branch in any of the four deep workflow YAMLs. Its
only trace in the workflow layer is a `notes:` bullet that sits *inside* the `if_cli_pi` branch
and asserts the opposite of the code:

> "cli-deepseek-harness single-executor (experimental, never a default): the same shared builder
> emits `dsh --profile headless` ..." — [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1579]

That bullet is a sibling of the `cli-pi single-executor` bullet in the same `notes:` list, one
step removed from `record_executor_audit`. There is no command body behind it, so a run whose
`config.executor.type` is `cli-deepseek-harness` matches no branch. The branch bodies themselves
document why that is the failure mode to avoid:

> "cursor-agent/devin/pi have no single-executor branch of their own, so without this they
> silently degrade to native." — [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1489]

Registry side, for the "it is a real kind" half:
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11] and
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:106].
Adapter side: [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3099].
Hub mode side: [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8].

This is the exact class of defect v4.0.0.0 claimed to have closed ("the executor you name is the
one that runs", [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:127]) and v4.0.0.16 claimed to
have hardened. The fan-out path honours it; the single-executor path does not.

**Verify**

```bash
grep -rn 'if_cli_deepseek_harness' .skilled/commands/deep/   # exit 1, no matches
grep -c 'if_cli_' .skilled/commands/deep/assets/deep-research-auto.yaml  # 6 branches for 7 CLI kinds
```

### f-iter001-002 — the drift test that guards runner-vs-packet fallbacks skips DSH

**Type** drift · **Severity** P2 · **Release** v4.0.2.0 · **Confidence** high

The test named `fanout-run.cjs — unpinned lineage fallbacks match their packets` exists so the
runner default and the packet prose cannot drift apart in silence. Its case table lists six
kinds — Codex, Claude Code, OpenCode, Cursor, Devin, Pi — and omits `DSH_DEFAULT_MODEL`:
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1779].

The omission is load-bearing because the same test asserts that each covered packet publishes a
`Fan-out fallback:` line. Six of the seven packets do; `cli-deepseek-harness` does not. So the
guard has a hole exactly where the newest executor kind was added, and nothing fails to say so.
The other six lines are present, e.g. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/ROUTER.md:59]
and [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:146].

**Verify**

```bash
grep -rn 'Fan-out fallback:' .skilled/skills/cli-external-orchestration/*/SKILL.md \
  .skilled/skills/cli-external-orchestration/*/ROUTER.md   # 6 hits, no cli-deepseek-harness
```

### f-iter001-003 — `if_cli_copilot` is unreachable, and its presence makes the branch count look correct

**Type** over-engineering · **Severity** P2 · **Release** pre-v4 (survived the cycle) · **Confidence** high

`cli-copilot` is not an executor kind and not a hub mode. The branch exists in three workflow
files and its own body concedes the point:

> "There is no cli-copilot kind in the executor schema, so it ..." — [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1288]

Branches: [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1239],
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1317],
[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1190].

The composition is what makes this P2 rather than cosmetic: `deep-review-auto.yaml` carries seven
`if_cli_*` branches for seven CLI kinds, so an operator or reviewer counting branches to check
parity gets a false pass — one branch is unreachable (copilot) and one kind has none (dsh). The
research YAML is the honest one at six branches, and it is the one that reads as short.

What breaks if removed: nothing dispatches through it, and the review changelog entry describing
the 16 KB `@path` threshold ([SOURCE: .skilled/skills/system-deep-loop/deep-review/changelog/v1.7.0.0.md:21])
would need to move onto a live branch or be retired with it.

**Verify**

```bash
grep -rn 'cli-copilot' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts \
  .skilled/skills/cli-external-orchestration/mode-registry.json   # exit 1, no matches
grep -c 'if_cli_' .skilled/commands/deep/assets/deep-review-auto.yaml  # 7 branches, 7 kinds, different sets
```

### f-iter001-004 — the shared branch body is triplicated, and its comment is false in two of the three copies

**Type** UX + improvement · **Severity** P2 · **Release** v4.0.0.16 (pi branch) · **Confidence** high

The same ~100-line builder body is copied into the cursor, devin and pi branches, carrying an
identical comment in all three copies:

[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1287] (inside `if_cli_cursor`, 1275),
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1388] (inside `if_cli_devin`, 1376),
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1489] (inside `if_cli_pi`, 1477).
Same pattern in [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1755], `:1856`, `:1957`.

The comment says these three kinds "have no single-executor branch of their own" while sitting
inside the branch that kind owns. Read charitably it means "no bespoke builder", but the literal
reading is contradicted by the enclosing structure, and the consequence is measurable: when a
fourth kind arrived needing the same body, no fourth copy was made (f-iter001-001). Three copies
of a dispatch body also means every future fix must land three times, or silently land in one.

**Verify**

```bash
grep -c 'no single-executor branch of their own' \
  .skilled/commands/deep/assets/deep-research-auto.yaml   # 3
```

### f-iter001-005 — `record_executor_audit` runs at a different point for different executors

**Type** UX (ordering) · **Severity** P2 · **Release** v4.0.0.0 · **Confidence** medium

The audit step is written as a sibling of the `if_cli_*` branches, so its position in the sequence
decides when the executor block is recorded relative to the dispatch it describes. It sits between
the pi branch and the opencode branch:

[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1580] — after `if_cli_cursor` (1275),
`if_cli_devin` (1376) and `if_cli_pi` (1477), before `if_cli_opencode` (1589) and `if_cli_codex` (1667).
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2096] — the same shape, at the end.

So a cursor/devin/pi run records its executor after dispatch and an opencode/codex run records it
before. The recorded value is config-derived rather than result-derived, which is why this does not
break a run today; it does mean the ordering is accidental rather than chosen, and any future
attempt to record dispatch outcome in that step would silently record it for the wrong half of the
kinds. Confidence is medium because I did not execute a workflow to observe the sequencing.

**Verify**

```bash
grep -n 'record_executor_audit\|if_cli_' .skilled/commands/deep/assets/deep-research-auto.yaml
```

### f-iter001-006 — two packets publish two different "defaults" and never reconcile them

**Type** UX · **Severity** P2 · **Release** v4.0.0.16 · **Confidence** high

`cli-devin` states a default of `swe` for hand-written dispatch at
[SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:100], and a fan-out fallback
of **SWE 2 Max** at [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:146].
`cli-claude-code` does the same with `claude-sonnet-5-5` at
[SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md:106] against an Opus
fallback at [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md:108].

Both lines are correct in their own context, and the split is deliberate (see Ruled Out). The
defect is that neither line says which context it governs, so an operator reading §"Default model"
and then omitting `--model` gets a different model than a lineage that omits `model` — and the
packet never says so. The runner documents the split once, in a source comment, where an operator
will not look.

**Verify**

```bash
sed -n '100p;146p' .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md
```

### f-iter001-007 — v4.0.0.0 roster counts are stale and are the only roster summary in the notes

**Type** drift · **Severity** P2 · **Release** v4.0.0.0 · **Confidence** high

The release note states "Cursor carries 21 ids across six families" and "Pi runs a closed
six-provider roster" ([SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:125]). The tree now holds
29 Cursor ids ([SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:353])
and 10 Pi ids ([SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:222]).
Growth inside a release line is expected and not itself a defect. It is recorded because no later
note in the line restates the rosters, so the stale numbers are the only roster summary a reader
of the changelog set will find.

**Verify**

```bash
node -e "const s=require('fs').readFileSync('.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts','utf8');console.log((s.match(/cursor-grok|grok-4\.7|composer-2\.5/g)||[]).length)"
```

### f-iter001-008 — "seven bridges" stayed true while the seven changed members

**Type** drift · **Severity** P2 · **Release** v4.0.2.0 · **Confidence** high

v4.0.0.0 lists the seven as "Cursor and Hermes join OpenCode, Claude Code, Codex, Devin and Pi"
([SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:48]). v4.0.2.0 removes Hermes and adds DeepSeek
Harness ([SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:160]). The count survived at seven, so
every check that validates "seven bridges" — including the registry prose "All seven modes route
by hub membership" at [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8] —
passes while the set it names is different. Membership, not cardinality, is the thing to assert.

**Verify**

```bash
ls .skilled/skills/cli-external-orchestration/ | grep '^cli-'   # 7, none of them hermes
grep -c 'workflowMode' .skilled/skills/cli-external-orchestration/mode-registry.json
```

### f-iter001-009 — the canonical state-log row drops the identity and answer fields the contract makes mandatory

**Type** drift (contract vs code) · **Severity** P2 · **Release** v4.0.0.0 (legacy projection) · **Confidence** high

Observed by running the append gateway for this iteration, not by reading. The record I submitted
carried `runId`, `sessionId`, `lineageId`, `focus`, `mode`, `target_agent` and `answeredQuestions`.
The gateway accepted it (`ok:true`, exit 0, stream sequence 5) and refreshed the state log. The row
that landed there is seven fields:

```
{"type":"iteration","iteration":1,"run":1,"status":"insight","newInfoRatio":0.72,"ruledOut":[],"timestamp":"..."}
```

The projection that produces it is the `deep_research.iteration_completed` branch at
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:297],
which reads `status`, `rawNewInfoRatio` and `ruledOutApproachRefs` and emits nothing else. The
contract makes `answeredQuestions` mandatory and says the reducer ticks a strategy box only on an
exact text match — so a consumer reading the state log, which the contract calls the canonical
record, sees no answered question and no run identity. The reducer survives because it also reads
the delta files, where the full record is intact.

**Verify**

```bash
node -e 'const r=require("fs").readFileSync("specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-state.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse).filter(x=>x.type==="iteration");console.log(Object.keys(r[0]))'
```

### inv-iter001-001 — the duplicated allowlists and defaults are in exact parity

The four enforced model allowlists and their defaults exist twice, once as TypeScript constants
and once as synchronous duplicates in the CommonJS runner. A programmatic set comparison over both
source texts returns an empty symmetric difference for all four, and identical defaults:

| Kind | Allowlist ids | TS default | CJS default |
| --- | --- | --- | --- |
| cli-pi | 10 | `deepseek-v4.1-flash-1017` | same |
| cli-cursor | 29 | `composer-2.5` | same |
| cli-devin | 23 | `swe-2-max` | same |
| cli-deepseek-harness | 2 | `deepseek-v4.1-flash-1017` | same |

Sources: [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:222],
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:264],
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:353],
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:449],
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2610],
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2746],
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2562],
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2943].

Codex, Claude Code and OpenCode carry no allowlist at all in either file — free-form model strings,
with their defaults single-sourced in the runner only (`gpt-6-luna`, `claude-opus-4-8`,
`llmgateway/deepseek-v4.1-flash-1017`, [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2602]).
That is a deliberate asymmetry, not a drift: an unenforced kind has nothing to keep in sync.

## QUESTIONS ANSWERED

- **Fan-out parity (v4.0.0.0, v4.0.0.16):** registry, adapters and flag support are in tri-parity
  for all eight kinds, and the four duplicated allowlists are byte-equivalent with identical
  defaults. Parity fails at the workflow layer, not the runtime layer: one kind has no
  single-executor branch, one branch has no kind, and the test that guards the packet-prose half of
  the contract skips the newest kind.

## QUESTIONS REMAINING

- Single-executor dispatch: the *ordering* and *missing-branch* defects are now evidenced, but the
  placeholder and field-name half of that question is untouched — each branch body's
  `'{config.executor.*}'` substitutions were not audited one by one, and the two confirm YAMLs were
  only spot-checked for branch presence.
- Mode retirement (v4.0.0.7): not started.
- Convergence, write containment, cli-classifier/cli-jev, hub canon, over-engineering beyond the
  copilot branch, UX beyond the packet-default split, extension, executor failure handling: not started.

## RULED OUT

**"The devin and claude-code default-model divergence is drift."** Ruled out. The runner's defaults
are deliberately not the model each packet recommends for a hand-written dispatch — that is stated
at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2596] and enforced by
the family-match test at
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1774]. `swe-2-max`
and `swe` are the same family, as are `claude-opus-4-8` and `claude-sonnet-5-5`'s Opus override
target. The real defect is documentation clarity (f-iter001-006), not a code/prose disagreement.

**"The duplicated allowlists have drifted."** Ruled out by set comparison. Recorded as an invariant
instead, so a later iteration does not re-spend effort here.

## NEXT FOCUS

Finish the single-executor dispatch question on the half that is still open: walk every
`if_cli_*` branch body in both auto YAMLs and both confirm YAMLs, and check each
`'{config.executor.*}'` placeholder against the config schema field name and the branch's own
`kind` literal. The dsh branch is missing entirely, so the check is: does any branch hard-code a
kind that disagrees with the `config.executor.type` it is keyed on, and does any placeholder name a
field the schema does not define.
