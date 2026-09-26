# jev auth

Keep the API key out of shell profiles and process environments.

```bash
jev auth login [provider] [--key-stdin]
jev auth status
jev auth logout [provider] [--all]
```

## Subcommands

| Subcommand | Does |
| --- | --- |
| `login [typesafe\|openrouter]` | Prompts with masked input and stores the key. With `--key-stdin`, or when piped, reads one line from stdin so password managers work. |
| `status` | Where each provider's key comes from: `env`, `keychain`, `file`, or `none`. Exit 1 if none. |
| `logout [provider] [--all]` | Remove a stored key |

## Where keys go

| Platform | Store |
| --- | --- |
| macOS | Keychain, service `jevctl` |
| Linux with `secret-tool` | Secret Service |
| Otherwise | `~/.config/jev/credentials.json`, mode `0600` |

Force one with `JEV_CREDENTIAL_STORE=file` or `keychain`. Move the file with `JEV_CREDENTIALS`.

## Resolution order

1. The environment variable (`TYPESAFE_API_KEY`, `OPENROUTER_API_KEY`)
2. The store

`JEV_NO_STORED_CREDENTIALS=1` ignores the store, useful in CI. `jev config` shows which source won.

## Examples

```bash
jev auth login
op read "op://Private/TypeSafe/credential" | jev auth login --key-stdin
jev auth login openrouter
jev auth status
```

```text
Provider    Source    Key
----------  --------  -------
typesafe    keychain  apik…64
openrouter  none      -
store: macOS Keychain (service "jevctl")
```

The Claude Code compaction hook runs in Claude Code's sandbox and cannot read the keychain. For it, put the key in `~/.claude/settings.json` under `env`, or use the plugin's sensitive `apiKey` option.
