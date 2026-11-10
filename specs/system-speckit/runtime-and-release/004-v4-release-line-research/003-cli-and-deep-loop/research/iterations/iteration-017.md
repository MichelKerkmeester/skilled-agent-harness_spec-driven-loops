# Iteration 017 — Settling B3, and the field-name divergence it exposed

## Focus

Settle the one inferred bug: B3 claimed the single-executor `if_cli_opencode` branch passes an
OpenCode-1-only `--pure` flag. Second, rerun the skill advisor for `"opencode go route this task"`.
Third, produce the improvement and extension findings for the single-executor YAML branches — the
thinnest finding types in this cluster.

## Actions Taken

1. Gate 1 trigger-index lookup (`--scoring-only`) → `results: []`, clean no-hit.
2. Read the run config for stable identity (`lineage.sessionId = 2026-11-08T20:14:35.000Z`) and the
   declared executor block.
3. Located the canonical asset paths. The prior citation path
   `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-auto.yaml` **does not exist**.
   `ls` of that `assets/` directory returns only `deep-research-config.json`,
   `deep-research-dashboard.md`, `deep-research-strategy.md`, `prompt-pack-iteration.md.tmpl` and
   `runtime-capabilities.json`. The YAMLs live only under `.skilled/commands/deep/assets/`
   (`deep-research-auto.yaml` 162,400 bytes, `deep-review-auto.yaml` 183,453 bytes).
4. Read both cited regions and both argv arrays, then ran a cluster-wide grep for
   `config.executor.type` versus `config.executor.kind`.
5. Searched for any normaliser that maps `executor.kind` onto `executor.type` before the YAML
   evaluates `branch_on`.
6. Attempted the requested live dispatch probe. **Blocked by the session dispatch guard** — every
   `opencode` invocation, including a bare `opencode --version`, was refused:

   ```
   Pi dispatch denied: the command does not prove one direct executor. Call one executor by its
   literal name, such as `pi -p` or `codex exec`, not through a variable or alias, and name that
   executor in the user request.
   ```

   This fired twice: once for a `TMP=$(mktemp -d); cd $TMP; timeout 120 opencode run --pure …`
   compound, and once for a bare `opencode --version`. No exit code and no output from OpenCode were
   therefore obtainable in this leaf. The guard is a Pi-layer constraint on *tool calls*; the YAML's
   own dispatch runs `process.exit(runAuditedExecutorCommand({ command: 'opencode', … }))` through
   Node, so it is not subject to it.
7. Reran the advisor CLI and read its top recommendations with scores.

## Findings

### f-iter017-001 — B3 is **NARROWED**: the flag is in both twins; its validity is untested | bug | P2

B3's premise that the branch passes an OpenCode-1-only flag **only** in the research single-executor
branch is falsified. `--pure` is present, byte-identical in context, in **both** twins:

- [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1619]
- [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1547]

Both argv arrays share the same shape: `run --model <m> --format json --dangerously-skip-permissions
--pure --dir <repo_root>`, then an optional `--variant <reasoningEffort>`, then the message. So the
"research-only" framing is wrong — whatever is true of `--pure` is true of review too.

What survives is the half I could not test: whether the **installed** OpenCode accepts `--pure` at
all. Version probing was refused by the dispatch guard (verbatim above), so the claim is neither
confirmed nor falsified. The honest verdict is **NARROWED, not CONFIRMED**: presence proven,
validity unproven. Confidence in presence 1.0; in validity 0.0 (untested, not refuted).

Verify: `grep -n "'--pure'" .skilled/commands/deep/assets/deep-{research,review}-auto.yaml`
(closes the presence half from any checkout). The validity half needs an operator-run
`opencode run --help | grep -i pure` outside this leaf's guard.

### f-iter017-002 — NEW P1 bug: the research family branches on a config key the schema does not have

The two families read **different** config keys for the same concept, and only one of them exists.

| Family | Key read | Sites |
|---|---|---|
| research (`deep-research-auto.yaml`, `deep-research-confirm.yaml`) | `config.executor.type` | 8 |
| review (`deep-review-auto.yaml`, `deep-review-confirm.yaml`) | `config.executor.kind` | every occurrence |

Evidence on the research side: [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1204]
(`branch_on: "config.executor.type"`), [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1634]
(`executorKind: '{config.executor.type}'`). Evidence on the review side:
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1232]
(`branch_on: "config.executor.kind"`),
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1562]
(`executorKind: '{config.executor.kind}'`).

The schema says `kind` and has no `type`. The run's own config, read this iteration:

```
{"kind":"cli-pi","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max",
 "serviceTier":null,"sandboxMode":null,"timeoutSeconds":2400}
has type? false
```

Consequences, both real: (a) `skip_when: "config.executor.type == 'native'"` evaluates against
`undefined`, so it is **false for every config** — a `native` executor never skips the CLI branch on
the research side; (b) `branch_on: "config.executor.type"` selects on `undefined`, so `if_native` is
unreachable and the branch order silently decides. The review family, reading `kind`, does not have
this defect — which is exactly how the divergence stayed invisible.

Confidence 0.95. Uncertainty is confined to the substitution engine's unknown-token rendering: whether
`{config.executor.type}` renders empty, as the literal string `undefined`, or as literal passthrough.
All three are wrong records; the defect stands regardless of which.

Verify: `grep -n "config.executor.type" .skilled/commands/deep/assets/deep-research-auto.yaml`

### f-iter017-003 — ANSWERED (carried across four iterations): there is no normaliser before YAML evaluation

The carried question was whether some step maps `executor.kind` onto `executor.type` before the YAML
renders. There is exactly one adapter and it is positioned too late to help:

```
function getExecutorKind(config: ExecutorConfig): ExecutorKind {
  return config.kind ?? (config as ExecutorConfig & { type?: ExecutorKind }).type ?? 'native';
}
```

[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:204]

That call runs **inside** `runAuditedExecutorCommand`, downstream of both branch selection and token
rendering. A grep for assignment-style mappings (`executor.type =`, `type: executor.kind`,
`normalize*executor` …) across the deep-loop runtime and system-spec-kit CLI returned no hit on the
render/evaluate path. So `config.executor.type` in the YAML is never populated.

One second-order note worth recording: the adapter's fallback is `?? 'native'`. An executor object
carrying neither key therefore **self-identifies as native** in the audit trail rather than raising —
a silent misattribution in the exact record an operator would read after a failed dispatch.

Confidence 1.0. Verify: `sed -n '203,205p' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`

### f-iter017-004 — Drift: the citation path earlier iterations used does not exist | drift | P2

Iterations 1–16 cited the auto YAMLs under
`.skilled/skills/system-deep-loop/deep-{research,review}/assets/`. No such file exists; that directory
holds config, dashboard, strategy, prompt-pack template and the capability matrix only. The command
asset tree is the sole home. Any finding whose verify command was written against the nonexistent path
is not reproducible as written. Confidence 1.0 (proved by `ls` and by `sed` returning
`No such file or directory`).

Verify: `ls .skilled/skills/system-deep-loop/deep-research/assets/`

### f-iter017-005 — Advisor routing: a phrase naming one CLI vendor resolves to another vendor's packet | UX | P2

Rerun of `advisor_recommend --json '{"prompt":"opencode go route this task"}' --format json`:

| # | skillId | score | confidence | uncertainty | dominantLane | resolved packet |
|---|---|---|---|---|---|---|
| 1 | `sk-code` | 0.783309 | 0.941 | 0.12 | explicit_author | `sk-code-skilled` |
| 2 | `cli-external-orchestration` | 0.316101 | 0.820 | 0.12 | lexical | `cli-deepseek-harness` |

`ambiguous: false`. Two observations, one of them a defect:

1. A prompt whose verbs are *route* and whose noun is *opencode* is answered first by `sk-code`, the
   implementation skill, at 2.5× the score of the CLI hub. "route this task" is CLI-hub vocabulary and
   the hub carries it.
2. The CLI hub does match — but its `compiledRoute` selects packet **`cli-deepseek-harness`** for a
   phrase naming **opencode**. A vendor-named phrase resolving to a different vendor's harness packet
   is the kind of collision that looks correct at the skill layer and wrong one level down.

Scope note: the CLI emitted two recommendations before the output was truncated at 60 lines, so a third
may exist below the cut; `ambiguous: false` and the 0.78-vs-0.32 score gap make it immaterial.

Confidence 0.9 (one `compiledRoute` observed directly; truncation disclosed).

Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"opencode go route this task"}' --format json`

### f-iter017-006 — Improvement: one argv builder and one dispatch-facts builder for all six branches | improvement | P1

This cluster's thinnest finding type, and this iteration produced the concrete case for it. The six
hand-written JS blocks in the single-executor branches (`if_native`, the four `if_cli_*`, and the
fallback, across both YAMLs) already disagree on two of the four things they are supposed to
reproduce identically:

- the **config key** for executor identity (`type` vs `kind`, f-iter017-002);
- the **generation token** spelling — research builds `generation: Number('{config.lineage.generation}')`
  at [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1635] while review builds
  `generation: Number('{generation}')` at
  [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1562].

The argv arrays, by contrast, agree exactly. That is the shape of the fix: argv drifted less because it
is *more* duplicated-looking and therefore read side by side; the facts block drifted because it looks
like plumbing. A single `buildExecutorArgv(executor, { dir })` and `buildDispatchFacts(config)` in
`runtime/lib/deep-loop/` — callable from a YAML `node -e` exactly as
`runAuditedExecutorCommand` already is — turns six blocks into two calls and states each rule once.

What breaks if not done: every future executor flag or fact must be added in six places, and the
divergence found this iteration is the demonstrated symptom, not a hypothetical one.

Verify (the divergence, statically):
`grep -n "generation: Number" .skilled/commands/deep/assets/deep-{research,review}-auto.yaml`

### f-iter017-007 — Extension: a static token-vs-schema contract test over every `if_cli_*` branch | extension | P2

A pure-static check would have caught f-iter017-002 at authoring time, with no dispatch, no model and no
network: for each `if_*` executor branch, extract every `{config.executor.*}` and every
`config.executor.*` appearing in `skip_when`, `branch_on` and `dispatchFacts`, and assert each path
exists in the executor schema JSON. Two inputs, one comparison.

It belongs beside the existing validator rather than in a new tool: the cluster already ships
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts], which
demonstrates the pattern for post-hoc event validation — this is the pre-dispatch counterpart.

Why it is worth more than a normaliser: a normaliser would make `type` and `kind` both work, entrenching
two spellings. A contract test deletes the second spelling. Note this also composes with the
`hub-router.json` `vocabularyClasses` / `mode-registry.json` `aliases` generation proposed in earlier
iterations — same class of fix ("one rule stated in three files → generate two from one").

Verify: `grep -c "config.executor\." .skilled/commands/deep/assets/deep-research-auto.yaml`

### f-iter017-008 — UX: a failed dispatch cannot be attributed to a branch from the log | UX | P2

With six near-identical hand-written blocks inside 162 KB and 183 KB files, an operator reading a
failure has no cheap way to know which block produced it — the blocks differ in the exact field the
record would need to carry. `dispatchId` exists (`research-i{N}-g{G}`, e.g.
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1634] region) but is constructed *inside*
each block from the same literal template, so it does not distinguish them.

The minimal improvement is not new machinery: emit `branchId` alongside `dispatchId` in the failure
event, using the branch's own name. That is one field, and it makes f-iter017-006/f-iter017-007
diagnosable in production rather than only at authoring time.

Verify: `grep -n "dispatchId = " .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml`

## Questions Answered

No strategy key question was closed by exact text this iteration. Three carried-forward open questions
were closed:

- "Whether any normaliser maps `executor.kind` onto `executor.type` before the YAML evaluates
  `branch_on`" → **answered negatively** (f-iter017-003): no normaliser exists on the evaluation path;
  the only adapter sits inside the dispatch helper.
- B3 (inferred bug, `--pure` is OpenCode-1-only) → **narrowed** (f-iter017-001): present in both twins,
  validity untestable in this leaf because the dispatch guard refuses every `opencode` token.
- "the `deep-research-*` twin comparison" for the single-executor branches → **done** for argv,
  `dispatchFacts` key, generation token and `--pure` (f-iter017-001, -002, -006).

## Questions Remaining

- **`--pure` validity** (f-iter017-001): does the installed OpenCode accept `--pure`, and does it
  suppress project config such that the branch's own config-dir assumption still holds? Needs one
  operator-run `opencode run --help` outside the dispatch guard.
- **Unknown-token rendering policy**: f-iter017-002 records the defect under all three candidate
  policies, but which one the engine actually implements determines whether the state log carries
  `""`, `"undefined"` or the literal `{config.executor.type}`. Still unread across the run.
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its modes —
  still unproven. This iteration added no evidence either way.
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — thirteenth carry: what a single-executor run
  records for a devin `resource_exhausted`, or when a builder throws. Note f-iter017-003's `?? 'native'`
  fallback is adjacent to this: a failure path that cannot name its executor kind will name `native`.
- **UX**: two of the three `*-presentation.txt` assets remain unread.
- **Drift method**: f-iter017-004 is a third instance of "the citation, not the code, is wrong". A
  `git log --name-only` pass per tag against each note's headline list still has not been run.

## Next Focus

Settle the `--pure` validity half from inside the leaf's authority: read the OpenCode adapter's
capability table and any version gate the runtime already encodes (the `runAuditedExecutorCommand`
env allowlist and the `runtime-capabilities.json` matrix are both in-scope reads and neither has been
read for this question). If the runtime encodes no version gate for `--pure`, that is itself the
finding: a flag with no documented minimum version, passed on every dispatch, in both twins.

## SCOPE VIOLATIONS

None. No write was attempted outside the allowed paths. The one out-of-authority action — the live
`opencode` dispatch probe — was **refused by the session dispatch guard before execution**, not by this
leaf's containment rules; it was retried once with a bare `opencode --version` and refused identically,
then abandoned and recorded as evidence rather than worked around.
