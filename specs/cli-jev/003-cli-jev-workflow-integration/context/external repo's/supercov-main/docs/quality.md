# Understanding quality

`npx supercov quality` tells you what is in your code: twelve named properties,
checked file by file, so a score is never a number you have to take on faith.

Judgments come from [Jev](https://typesafe.ai), which answers typed questions
rather than generating prose. Supercov asks the questions and does the
arithmetic, so every part of a score is a claim you can check against the file.

## Set your key

Assessing needs a TypeSafe AI API key, and your coding agent will usually ask
you for it. Get one at [typesafe.ai](https://typesafe.ai).

Supercov looks for it in `TYPESAFE_API_KEY`:

```bash
export TYPESAFE_API_KEY=...        # for this shell
TYPESAFE_API_KEY=... npx supercov quality   # for one command
```

The environment variable is the only way to pass it. A key given on the command
line ends up in your shell history and in the process list, where anyone on the
machine can read it.

Set it the way your environment already sets secrets:

| Where | How |
| --- | --- |
| GitHub Actions | `env: { TYPESAFE_API_KEY: ${{ secrets.TYPESAFE_API_KEY }} }` |
| GitLab CI | a masked CI/CD variable named `TYPESAFE_API_KEY` |
| Docker | `docker run -e TYPESAFE_API_KEY ...` |
| Local development | a `.env` loaded by `direnv`, `dotenv` or your shell profile |

Reading a saved assessment never needs a key, and `--dry-run` prints the exact
requests without sending them.

## Use Jev through another provider

Supercov reads the same variables as TypeSafe's own SDKs, so a provider that
serves Jev, such as [OpenRouter](https://openrouter.ai), needs only its URL, its
name for the model, and its key:

```bash
export TYPESAFE_BASE_URL=https://openrouter.ai/api
export TYPESAFE_DEFAULT_MODEL=typesafe/jev-1.13
export TYPESAFE_API_KEY=sk-or-...
npx supercov quality
```

| Variable | What it is | Default |
| --- | --- | --- |
| `TYPESAFE_BASE_URL` | where requests go | `https://api.typesafe.ai` |
| `TYPESAFE_DEFAULT_MODEL` | the model asked for | `jev-1.13.0` |

Snapshots record the model, and `quality diff` compares only snapshots from the
same one.

## Start with the repository

```bash
npx supercov quality
```

No arguments, no configuration. It finds your source, asks twelve questions of
each file, and saves a snapshot you can read afterwards without a key or a
network.

```
Quality fair (5.0/10) over 163 files.
  11 good, 53 fair, 99 weak.

Weakest:
  weak  src/lib/modernHttp.ts
        long_method 0.93, duplicated_logic 0.88, complex_conditional 0.87, +7 more
```

`good` is 8 and above, `fair` is 5 to 8, `weak` is below 5. `--json` carries the
number when something needs to sort.

## The twelve properties

god class, long method, deep nesting, complex conditional, long parameter list,
duplicated logic, primitive obsession, dead code, feature envy, temporary field,
message chains, magic values.

They come from Fowler and Beck's refactoring smells and the class-scope smells
CodeScene's Code Health is built from. Each is a yes/no question with a
definition and a stated exception, so two careful readers would agree on the
answer.

Three of them fire on more than half the files in a typical repository, so the
summary shows the three strongest per file. To see all twelve with what is known
about each:

```bash
npx supercov quality file src/lib/modernHttp.ts
npx supercov quality gaps        # only files something fired on
```

## Reading the score

Health is the mean of the twelve answers, done by this command rather than by
the model. A directory or a whole repository counts its larger files for more,
so a folder of one-line re-exports cannot outvote the file everything depends
on.

Use it to find the code that is hardest to change, and `quality gaps` to jump
straight to the files something fired on.

## What a change introduced

```bash
npx supercov quality patch
```

With no range it reviews your uncommitted work when the tree is dirty, and
everything since your branch left its default branch when it is clean. Say so
explicitly with `--unstaged`, `--staged`, or `--base origin/main`, which uses
the merge base so commits other people landed after you branched are not
counted as yours.

It asks the twelve properties differentially, whether the new version shows
something the old one did not, adds three checks that only make sense for a
change, and asks the twelve [security surface](security.md) checks the same
differential way:

- a test that now checks less than it did
- a database schema or data migration
- debugging left behind
- a secret in source, an injection sink, unescaped output, a path or
  destination taken from a caller, a handler with no visible authorisation, and
  the rest of the security catalog, each only if the change introduced it

Output lists only files where something appeared. A change that introduces
nothing says so in one line.

```bash
npx supercov quality patch --base origin/main --annotate github
```

`--annotate github` prints workflow annotations on stdout. It needs no token and
posts no comment.

## Which files get looked at

```bash
npx supercov quality scope
```

Source roots come from your package manifests and from what they declare, so a
`bin` or `exports` entry counts even when it is not in a conventional directory.
Test files, generated output, tool scripts, examples, benchmarks and
documentation are left out, each with its reason. `--all` includes everything.

If some of your code sits somewhere none of that recognises, Supercov asks Jev
about those paths with your whole tree as context, and says how many it decided
that way. To decide yourself:

```bash
SUPERCOV_SOURCE_ROOTS=src,packages npx supercov quality
```

A declaration is never second-guessed.

## Tracking it over time

```bash
npx supercov quality snapshots
npx supercov quality diff <older> <newer>
```

Which files lost health, which gained, which properties appeared, and which
files entered or left the scope. A file whose contents did not change is marked,
so a small movement does not send you looking for an edit that was never made.

## What it costs

Jev charges for what it reads and nothing for what it writes, at $42 per billion
input tokens. What that means in practice, measured rather than estimated:

| | source | cost |
| --- | ---: | ---: |
| Supercov's CLI crate | 0.5 MB | $0.007 |
| a TypeScript gateway, 197 files | 0.9 MB | $0.02 |
| one changed file in a review | — | $0.0005 |

About a cent per megabyte of source, a little more when the files are small,
because each one carries its own questions.

The command prints its estimate before sending anything, so a number that looks
wrong can be stopped rather than discovered on an invoice:

```
[supercov] quality: 35 requests, about 111840 input tokens ($0.0047) if none is cached
```

**Most runs cost far less than that estimate.** Answers are cached by content
under `.supercov/quality/requests/`, so a second run pays only for files that
actually changed. The cache follows content rather than paths, which means
switching branches, rebasing or checking out an old commit reuses everything
unchanged: assessing the same directory 400 commits back in a real repository
answered every file from cache and sent nothing.

Three ways to spend less:

- **Assess a directory, not the tree**, while you are iterating:
  `npx supercov quality src/api`.
- **Review the change, not the repository**, in CI: `npx supercov quality patch`
  costs about $0.0005 per changed file, so a typical pull request is a fraction
  of a cent.
- **Keep `.supercov/` between CI runs** if your runner supports a cache. An
  unchanged file then costs nothing on every run after the first.

`--refresh` asks again and bypasses the cache. `--dry-run` prints the exact
requests, sends nothing and costs nothing.

## Reference

```bash
npx supercov quality                             # this repository
npx supercov quality gaps                        # only files something fired on
npx supercov quality file src/server.ts          # one file, every check
npx supercov quality scope                       # which files, and why
npx supercov quality snapshots                   # saved assessments
npx supercov quality diff <older> <newer>        # what declined
npx supercov quality patch                       # what a change introduced
```

Full options are in the [CLI reference](https://supercov.com/docs/cli).
