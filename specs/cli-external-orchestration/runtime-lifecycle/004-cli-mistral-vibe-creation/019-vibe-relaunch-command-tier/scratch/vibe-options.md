# Vibe options that take a value

Source: `vibe -h` (Vibe 3.1.2 interactive CLI). A relaunch line must know which options
consume the following word, or a value could be handed to Vibe as the start prompt.

| Option | Value |
|---|---|
| `--workdir` | `<CWD>` |
| `--resume` | `[<RESUME>]` optional |
| `-p`, `--prompt` | `[<PROMPT>]` optional |
| `--output` | `<OUTPUT>` |
| `--max-turns` | `<MAX_TURNS>` |
| `--max-price` | `<MAX_PRICE>` |
| `--max-tokens` | `<MAX_TOKENS>` |
| `--time-limit` | `<SECONDS>` |
| `--prompt-file` | `<PATH>` |
| `--system-prompt-file` | `<PATH>` |
| `--output-dir` | `<DIR>` |
| `--agent` | `<NAME>` |
| `--model` | `<ALIAS>` (headless mode only) |
| `--enabled-tools` | `<ENABLED_TOOLS>` repeatable |
| `--disabled-tools` | `<DISABLED_TOOLS>` repeatable |
| `--worktree` | `[<WORKTREE>]` optional |
| `--add-dir` | `<ADD_DIR>` repeatable |

Options that take no value: version, continue, setup, auto-approve (alias yolo),
smart-approve, trust, check-upgrade and help.

## Relaunch consequence

`vibe "<seed>"` is the interactive launch form. The model flag is headless-only, so the
interactive relaunch never passes it and keeps the config's `active_model`. Session and
prompt selectors (continue, resume, prompt, prompt-file and worktree) must not be replayed,
or the hop would reopen the sender's conversation instead of starting fresh.
