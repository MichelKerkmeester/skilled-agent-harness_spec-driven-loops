# jev-cli

[![CI](https://github.com/Nasrallah-AL/jev-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Nasrallah-AL/jev-cli/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/jevctl.svg)](https://www.npmjs.com/package/jevctl)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-jevcli.vectorz.app-blue)](https://jevcli.vectorz.app/)

Fast, typed AI judgments from the command line, powered by TypeSafe's [Jev](https://docs.typesafe.ai) model.

Jev does not write text. You give it content and a question with a fixed set of answers, and it returns a probability for each answer in a few hundred milliseconds for a fraction of a cent. `jev` wraps that into commands you can pipe into, script around, and gate CI on.

Installed from npm as **`jevctl`**. The command is **`jev`**. Website: [jevcli.vectorz.app](https://jevcli.vectorz.app/).

## Install

```bash
npm install -g jevctl
jev auth login        # paste your TypeSafe key at the hidden prompt; stored in the OS keychain
jev config            # confirms the key is found and shows the effective settings
```

Needs Node.js 20.12+ and a key from [console.typesafe.ai/settings/keys](https://console.typesafe.ai/settings/keys). No install: `npx jevctl <command>`.

## First run

```bash
jev verify "Helmets are optional for adults" \
  --evidence "Every rider must wear an approved helmet."
```

```text
#  Verdict       Conf  Action  Claim
-  ------------  ----  ------  -------------------------------
1  contradicted  1.00  auto    Helmets are optional for adults
```

Exit code was 2: a claim was contradicted. Add `--json` to any command for machine-readable output, or `--dry-run` to see exactly what would be sent without calling the API.

## Commands

Each command has its own page with options, output fields, and examples.

| Command | Answers | Docs |
| --- | --- | --- |
| `jev verify` | Does this evidence support, contradict, or ignore each claim? | [docs/verify.md](docs/verify.md) |
| `jev screen` | Is this text trying to hijack an AI agent? Is it worth reading? | [docs/screen.md](docs/screen.md) |
| `jev classify` | Which label fits? Which labels apply? Where in this hierarchy? | [docs/classify.md](docs/classify.md) |
| `jev extract` | Which span in the text is the email, amount, date, id I want? | [docs/extract.md](docs/extract.md) |
| `jev find` | Which candidate best answers the query? Does any? | [docs/find.md](docs/find.md) |
| `jev rerank` | How relevant is each result to the query, on its own? | [docs/rerank.md](docs/rerank.md) |
| `jev match` | Do these two records describe the same thing? | [docs/match.md](docs/match.md) |
| `jev route` | Which handler takes this request, with which arguments? | [docs/route.md](docs/route.md) |
| `jev ask` | Any yes/no, pick-one, or rated question you write yourself | [docs/ask.md](docs/ask.md) |
| `jev compact` | Which old tool calls in this agent transcript still matter? | [docs/compact.md](docs/compact.md) |
| `jev batch` | Any of the above, over many rows, with a concurrency pool | [docs/batch.md](docs/batch.md) |
| `jev auth` | Store the API key in the keychain instead of exporting it | [docs/auth.md](docs/auth.md) |
| `jev config` | Show or edit settings; check which key source is in use | [docs/config.md](docs/config.md) |
| `jev models` | List the models your account can use | [docs/config.md#models](docs/config.md#models) |
| `jev update` | Check npm for a newer jevctl release and install it | [docs/update.md](docs/update.md) |

## Conventions

Same rules for every command. Details in [docs/output.md](docs/output.md) and [docs/config.md](docs/config.md).

| | Rule |
| --- | --- |
| Input | Any value is literal text, `@path` for a file, or `-` for stdin (one per command). `@@x` is a literal starting with `@`. |
| Output | Table by default. `--json` for scripts, `--md` for PR comments, `--format csv\|tsv\|jsonl`, `--pluck <path>` for one value. JSON field names are a stable contract. |
| Exit codes | `0` ok · `1` usage, config, input, or network error (stderr) · `2` a `--fail-on` condition matched. Code 2 makes `jev` a gate in `&&`, hooks, and CI. |
| Thresholds | Defaults follow TypeSafe's cookbooks. Sample your data with `--json`, then tune via flags or [config](docs/config.md). |
| Global flags | `--json` `--md` `--format` `--pluck` `--dry-run` `-m` `-P` `--timeout` `-q` `--no-color`, before or after the subcommand. |
| Errors | One line on stderr, exit 1. A response that is not one answer per question is `Malformed response`, never a silent pass. |

## Claude Code plugin

The repo ships a plugin that teaches Claude Code when to use `jev`, adds `/jev:*` slash commands, and replaces Claude Code's compaction summary with `jev compact`'s verbatim procedure.

```bash
claude plugin marketplace add Nasrallah-AL/jev-cli
claude plugin install jev@jev-cli
```

See [plugin/README.md](plugin/README.md), and [plugin/hooks/README.md](plugin/hooks/README.md) for the compaction hook.

## More

- [Output formats](docs/output.md): text, json, jsonl, md, csv, tsv, and `--pluck`
- [Configuration](docs/config.md): config file, environment variables, providers, global flags
- [Recipes](docs/recipes.md): CI gates, agent guardrails, dedupe, routing, compaction
- [Guidelines](docs/guidelines.md): writing good claims and labels, reading confidence, cost
- [Use from Node.js](docs/library.md): the same functions as a library
- [Troubleshooting](docs/troubleshooting.md)
- [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)
