# Configuration

Settings resolve in this order, later wins: built-in defaults, config file, environment variables, command-line flags.

## jev config

| Subcommand | Does |
| --- | --- |
| `jev config` or `jev config show` | Effective settings, masked credentials, key sources, resolved provider. Exit 1 if no provider can be resolved. |
| `jev config path` | Print the config file location |
| `jev config init` | Write a file with the defaults |
| `jev config set <key> <value>` | Set one value, e.g. `jev config set screen.blockAt 0.6`. Unknown keys and out-of-range values are rejected. |
| `jev config unset <key>` | Remove a top-level key |
| `jev config reset` | Delete the file |

## Config file

`$JEV_CONFIG` if set, else `$XDG_CONFIG_HOME/jev/config.json`, else `~/.config/jev/config.json`. It never holds API keys.

```json
{
  "provider": "auto",
  "model": "jev-latest",
  "timeoutMs": 30000,
  "format": "text",
  "verify":   { "autoAccept": 0.8 },
  "screen":   { "blockAt": 0.75, "reviewAt": 0.25 },
  "find":     { "topK": 5, "found": 0.7, "absent": 0.35 },
  "classify": { "minConfidence": 0.6, "threshold": 0.5 },
  "extract":  { "minConfidence": 0.6 },
  "rerank":   { "topK": 10, "min": 0.5 },
  "route":    { "minConfidence": 0.6 },
  "compact":  { "keepThreshold": 0.5, "preserveRecent": 6, "maxStateTokens": 25000, "maxRequestTokens": 30000, "truncateHead": 300, "minReduction": 0.25, "concurrency": 4 },
  "batch":    { "concurrency": 4 }
}
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TYPESAFE_API_KEY` | TypeSafe key. Optional when stored with `jev auth login`; takes precedence when set. |
| `TYPESAFE_BASE_URL` | Alternate TypeSafe endpoint, for proxies or testing |
| `OPENROUTER_API_KEY` | OpenRouter key (`sk-or-...`), used when no TypeSafe key is present |
| `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Workers AI, used when no other key is present. `JEV_CLOUDFLARE_API_TOKEN` takes precedence over `CLOUDFLARE_API_TOKEN`. |
| `JEV_PROVIDER` | Force `typesafe`, `openrouter`, or `cloudflare` |
| `JEV_MODEL` | Default model |
| `JEV_TIMEOUT_MS` | Default per-request timeout |
| `JEV_FORMAT` | Default output format: `text`, `json`, `jsonl`, `md`, `csv`, `tsv` |
| `JEV_CONFIG` | Config file path |
| `JEV_CREDENTIALS` | Credentials file path (file store) |
| `JEV_CREDENTIAL_STORE` | `auto`, `keychain`, or `file` |
| `JEV_NO_STORED_CREDENTIALS=1` | Ignore stored keys; environment only |
| `JEV_NO_UPDATE_CHECK=1` | Skip the "update available" check |
| `JEV_DEBUG=1` | Print stack traces on errors |

## Providers

| Provider | Notes |
| --- | --- |
| TypeSafe (direct) | Recommended. Lowest latency, `jev-latest` alias, pinned versions, automatic retries with backoff. |
| OpenRouter | Alpha endpoint. Pinned versions only, so `jev-latest` maps to `typesafe/jev-1.13`. Adds a hop. |
| Cloudflare Workers AI | Single `typesafe/jev` alias, no version pinning. Adds a hop. |

With the default `auto` and no TypeSafe key, an `OPENROUTER_API_KEY` or Cloudflare pair already in your
environment is enough to route your text through that provider. When that happens jev prints one line on
stderr naming the host it passes through. Choosing the provider yourself, with `-P` or the config file,
silences it.

## Global flags

Work before or after the subcommand.

| Flag | Meaning |
| --- | --- |
| `--json`, `--md`, `--format <name>` | `text`, `json`, `jsonl`, `md`, `csv`, `tsv`; see [Output formats](output.md) |
| `--pluck <path>` | Print one value from the JSON result |
| `-m, --model <name>` | `jev-latest` or a pinned version such as `jev-1.13.0` |
| `-P, --provider <name>` | `auto`, `typesafe`, `openrouter`, `cloudflare` |
| `--timeout <ms>` | Per-request timeout, default 30000. It is per attempt: the TypeSafe transport retries twice with backoff, so one failing request can take up to three attempts. |
| `--dry-run` | Print the exact request, exit 0, no API call. Every command that calls the API honors it, `models` included; `auth`, `config` and `update` never reach the API, so it does nothing there. |
| `-q, --quiet` | Omit the token usage footer |
| `--no-color` | Disable colors; `NO_COLOR` and `FORCE_COLOR` are honored too |

## Models

`jev models` lists the models your account can use, with release dates. TypeSafe provider only. Pin a version with `-m jev-1.13.0` once you have tuned thresholds, so an alias update does not shift results.
