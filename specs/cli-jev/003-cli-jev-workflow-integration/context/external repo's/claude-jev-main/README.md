# claude-jev

A Claude Code plugin that turns a question about your code into a typed
[TypeSafe Jev](https://docs.typesafe.ai) query and hands back calibrated
probabilities.

Jev is a **System One** model. It does not write text, code, or explanations. It
takes a state plus named typed questions and returns numbers. That makes it a
second opinion an agent cannot bluff its way past: the answer is a probability,
and it either clears your threshold or it does not.

## Why

When Claude reviews a diff, hunts a bug, or picks between two designs, every
judgement in that work comes from one source — Claude. "This is a real bug",
"this option is safer", "this file matters" are assertions, not measurements,
and a confident wrong one costs you the same as a confident right one.

This plugin adds a second, independent, cheap judge to those moments:

- **Review** — candidate findings go through Jev before you ever read them, so
  false positives are dropped with a number attached instead of argued about.
- **Debugging** — competing hypotheses are ranked against the symptom, so the
  first cause that came to mind does not automatically win.
- **Planning** — implementation options are rated on three separate axes, and
  when the axes disagree the trade-off becomes visible instead of silent.
- **Search** — a hundred grep hits are filtered down before any of them are
  read, so the context stays for the work.

Input tokens cost **$0.042 per million** and answers come back in roughly
150 ms, which is what makes asking on every review viable.

## How Jev answers

Three question types, and the answer shape follows from the type:

| Type | Question | Answer |
| --- | --- | --- |
| `noul` | Is this condition true? | `noul`: the probability that the answer is yes. **No confidence value.** |
| `choice` | Which of these labels? | the picked label, a probability for every label, and `confidence` |
| `score` | Where on this rubric? | a probability-weighted position on your ordered levels, and `confidence` |

`confidence` summarizes how concentrated the distribution is. It is not a
measure of correctness, and a `noul` near 0.5 means yes and no are about equally
likely — not "medium intensity".

## The tools

Five MCP tools, exposed in a session as `mcp__plugin_claude-jev_jev__<tool>`.
Four of them are presets: the question texts and the thresholds that read them
live in `src/domain/catalog/`, so the part a human should review sits in one
place instead of being scattered through prompts.

### `jev_review_findings`

You collect candidate findings; Jev rates each one on four independent
judgements, and code turns those into a verdict.

| Question | Type | Asks |
| --- | --- | --- |
| `real` | `noul` | Is the defect actually present in the code shown? |
| `reachable` | `noul` | Can an ordinary caller reach it? |
| `already_handled` | `noul` | Does an existing guard already cover it? |
| `severity` | `score` | How bad is the worst consequence? |

```
real < 0.5                      -> drop   (probably not in the code)
already_handled >= 0.7          -> drop   (an existing guard covers it)
reachable < 0.4                 -> keep_low
otherwise                       -> keep, ranked by severity
```

Real output, from this repository's own source reader — two of the three
findings were planted, and the verdicts are Jev's:

```
keep     ceiling_bypass  real 0.92  reach 0.88  guarded 0.07  severity 2.37/3 (conf 0.52)  real and reachable
keep     stale_end_line  real 0.57  reach 0.79  guarded 0.16  severity 1.95/3 (conf 0.75)  real and reachable
drop     symlink_escape  real 0.25  reach 0.42  guarded 0.74  severity 2.90/3 (conf 0.90)  the defect is probably not in the code

severity levels: 0=Cosmetic, 1=Minor, 2=A normal case breaks, 3=Data loss, corruption or a security hole
2 of 3 findings survive · jev-1.13.0 · 1 request · state ~1714 tok · 2616 input tok
```

`ceiling_bypass` was a real bug and was fixed in
[`fs-source-reader.ts`](src/infrastructure/fs-source-reader.ts) before this was
published: the 4 MB ceiling had been skipped whenever a line range was given,
which let a request for two lines of a huge file read the whole thing into
memory. `symlink_escape` was correctly dropped — `realpath` runs before the
containment check. `stale_end_line` was a planted false positive and Jev kept it
anyway at 0.57, a hair over the threshold. **That is the honest picture: the
filter removes noise, it does not certify truth, and a value near the threshold
is a weak signal you still have to read yourself.**

### `jev_rank_hypotheses`

| Question | Type | Asks |
| --- | --- | --- |
| `explains` | `noul` | Would this cause produce the *whole* symptom, not part of it? |
| `supported` | `noul` | Does the shown code and evidence point at it? |
| `next_check` | `choice` | Cheapest way to settle it: read code, run a test, reproduce, or add instrumentation? |

Ranked by `0.6 * explains + 0.4 * supported`. The weights are constants in
`src/domain/catalog/hypotheses.ts`, not something the model chooses.

### `jev_pick_option`

Three separate `choice` questions over the same 2–6 labels — **best** for the
stated requirement, **safest** for existing behavior, **simplest** — plus a
`score` risk rating per option. Their disagreement is the point: when `best` and
`safest` pick different options, you are looking at a real trade-off rather than
a preference.

### `jev_filter_relevance`

One `noul` per candidate: *is this needed to answer the question?* Only the head
of each file is read (1500 bytes by default), so a long list of grep hits is
cheap to triage, and the files never pass through the agent's context.

### `jev_ask`

The escape hatch. Claude writes the questions itself, any mix of the three
types, one call. Real output against this repository:

```
throws_on_overflow  noul 0.95
layer  choice domain  conf 1.00  [domain 1.00, infrastructure 0.00, application 0.00]
side_effects  score 0.50/3  conf 0.50  [0 0.51, 1 0.49, 2 0.00, 3 0.00]

jev-1.13.0 · 1 request · state ~666 tok · 1054 input tok
```

The `side_effects` split is worth reading: the rubric offered "no side effects"
and "mutates only what it created", and the function is pure from the outside
while building arrays internally. Both levels were defensible, so the
probability split. A flat distribution usually means the question, not the code,
was ambiguous.

## How a call actually works

```
tool call
  ├─ sources: [{path, start, end}]
  │    FsSourceReader resolves each path against the session's working
  │    directories (MCP roots/list), realpaths it, re-checks containment,
  │    refuses secrets and key material, slices the line range, caps the bytes
  │
  ├─ state = { task, <preset fields>, sources: [{path, start_line, content}] }
  │
  ├─ questions = catalogue(items)          one entry per item per judgement
  │
  ├─ planBatches(state, questions)
  │    estimates tokens, then splits the questions into as many requests as
  │    the limits demand: 64k for state and questions together, 32k for the
  │    state plus the longest single question
  │
  ├─ requests run concurrently, each carrying the whole state, answers merged
  │
  ├─ catalogue verdicts applied in pure code against fixed thresholds
  │
  └─ one block of compact text: verdicts, the numbers behind them, and the cost
```

Two things follow from that shape and are worth knowing before you rely on it:

- **The state is resent with every request of a fan-out.** Jev ingests the state
  once per request, so a hundred questions beside a 20k-token state costs
  several copies of that state. Still pennies, but prefer one call with many
  questions over many calls with few.
- **The tools refuse rather than truncate.** If the state alone does not fit,
  you get an error telling you to narrow the line ranges. Nothing is silently
  dropped behind your back.

Token counts are estimated from character counts, deliberately rounded up. There
is no tokenizer in the loop.

## Install

Needs Node 20+ and Claude Code 2.1.269+.

```sh
claude plugin marketplace add buchmark/claude-jev
claude plugin install claude-jev@claude-jev
```

`dist/server.js` is committed, so nothing has to be built to install. The
install prompts for the plugin options; leave the API key blank to use
`TYPESAFE_API_KEY` from the environment instead. Then `/reload-plugins`, and
`/mcp` should show the `jev` server with five tools.

### Supplying the key

Get one from [console.typesafe.ai/keys](https://console.typesafe.ai/keys). Three
ways to hand it over, best first:

1. **The plugin option.** Type `/plugin`, open `claude-jev`, fill in the API key
   field. It is declared `sensitive`, so the value goes to the macOS Keychain
   rather than to `settings.json`.
2. **`~/.claude/settings.json`** → `{"env": {"TYPESAFE_API_KEY": "..."}}`.
3. **`export TYPESAFE_API_KEY=...` in your shell profile**, then restart Claude
   Code — the MCP server inherits the environment of the process that spawns it,
   so exporting in an already-running session does nothing.

The last two leave the key in plaintext on disk. Only the first does not.

### From a checkout

```sh
git clone https://github.com/buchmark/claude-jev.git
cd claude-jev
npm ci
npm run build
export TYPESAFE_API_KEY=...
npm run check            # lists models, asks one cheap question
claude plugin marketplace add .
claude plugin install claude-jev@claude-jev
```

## Configuration

| Option | Default | Meaning |
| --- | --- | --- |
| API key | `TYPESAFE_API_KEY` | Stored in the Keychain when set as a plugin option |
| Model | `jev-latest` | Pin `jev-1.13.0` to keep tuned thresholds stable across releases |
| Source reading | on | Off means only text passed in the call is sent |
| Max bytes per source | 65536 | Longer snippets are truncated, and the snippet says so |
| Max sources per call | 20 | Upper bound on files read for one call |
| Max requests per call | 8 | Ceiling on the fan-out, so a wide question set cannot run away |

Verdict thresholds are deliberately **not** options. They live next to the rule
that reads them in `src/domain/catalog/`, so a question and its cut-off are
reviewed together rather than drifting apart across two files.

## What leaves your machine

With source reading on, the snippets named in a tool call are sent to
`api.typesafe.ai`, and the whole state is resent with each request of a fan-out.
If that is not acceptable for a repository, turn the option off and pass text
explicitly instead.

The server refuses these outright, with no option to allow them:

- env files — `.env`, `.env.*`
- key material — `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.p8`, `*.ppk`,
  `*.kdbx`, `id_rsa` and friends
- secret stores — `credentials*`, `secrets.json`, `secrets.yaml`, `.npmrc`,
  `.netrc`, `.pgpass`, `.pypirc`, `.dockercfg`
- anything inside `.git`, `.ssh`, `.gnupg`, `.aws`, `.gcloud`
- anything outside the session's working directories, including by way of a
  symlink — the path is `realpath`ed and re-checked before it is opened
- anything over 4 MB, and binary files, which are described rather than sent

Two limits that are not the plugin's to fix:

- **A state read from a repository is data, not instructions**, and Jev does not
  treat it as hostile. Code or comments written to steer a model can move an
  answer. A surprising number is a reason to read the code yourself.
- **Calibration is a property of many answers, not of one.** A probability is
  not a proof. The skill tells Claude to name the number when a conclusion rests
  on it, and never to treat one as authorization for an irreversible action.

## What Jev is bad at

Taken from TypeSafe's own
[jaggedness page](https://docs.typesafe.ai/jaggedness), because it shaped every
question in the catalogue:

| Weakness | What the catalogue does about it |
| --- | --- |
| Reads questions literally | The condition is stated in full in `instructions`, boundary cases in `criteria` |
| Does not count or do arithmetic | No question asks for a count; line numbers are labels, never something to tally |
| Cannot compare dates | No question involves ordering or durations |
| Struggles with multi-hop indirection | One judgement per question, always |
| Accuracy falls on large, noisy state | Sources are line ranges, not whole files |
| Does not generate text | Claude writes the code and the prose; Jev only rates |

If you extend the catalogue, keep those out too.

## Layout

Dependencies point inward: `infrastructure → adapters → application → domain`.

```
src/domain/          question types, token budget, question catalogue and thresholds
src/application/     use cases and the ports they depend on
src/adapters/        MCP tool schemas, input validation, output formatting
src/infrastructure/  TypeSafe SDK client, filesystem reader, config, stdio server
skills/jev/          when Claude should reach for a tool and how to write a question
commands/            /jev-review, /jev-why, /jev-pick, /jev-ask
```

`src/domain/` imports nothing outside itself: no SDK, no `node:fs`, no MCP. The
TypeSafe SDK and the filesystem appear only in `src/infrastructure/`, behind the
`JevPort` and `SourceReader` interfaces the use cases depend on. That is what
makes the whole suite runnable against a fake Jev with no network.

## Development

```sh
npm run typecheck        # tsc --noEmit, strict, no `any`
npm test                 # 72 tests, fake Jev, no network
npm run build            # esbuild -> dist/server.js, single file, no runtime deps
npm run validate:plugin  # claude plugin validate
npm run check            # the only thing that talks to TypeSafe
```

`dist/server.js` is a committed build artifact. Rebuild and commit it whenever
`src/` changes, or the published plugin runs stale code.

## License

MIT. See [LICENSE](LICENSE).
