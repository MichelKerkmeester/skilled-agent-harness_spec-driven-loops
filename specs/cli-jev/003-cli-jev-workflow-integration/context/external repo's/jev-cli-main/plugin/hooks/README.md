# Jev compaction hook

Replaces Claude Code's compaction summary with verbatim, Jev-guided compaction. When the
context fills up, instead of summarizing old turns (which can lose a file path, an exact error,
or a constraint), the hook asks Jev, for every old tool call, whether the call and whether its
full output still matter. Stale results are truncated to a short head plus a note, stale calls
are removed, and everything else stays exactly as it was. User and assistant text is never touched.

The same procedure is available offline as `jev compact @session.jsonl`.

## Enable it

Function hooks are an early-access Claude Code feature, so two things must be true wherever
Claude Code runs:

1. `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` is set.
2. `TYPESAFE_API_KEY` is available: in the environment, in `~/.claude/settings.json` under `env`,
   or as the plugin's sensitive `apiKey` option.

Recommended, in `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1",
    "TYPESAFE_API_KEY": "<your key>"
  }
}
```

Then install the plugin (the hook is part of it and is on by default):

```sh
claude plugin marketplace add Nasrallah-AL/jev-cli
claude plugin install jev@jev-cli
```

For a local checkout: `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir ./plugin`.

You will see a toast on each compaction: either "kept N/M messages verbatim, no summary" with the
reduction and decision counts, or "falling back to the built-in summary" with the reason.

## What it registers

| Hook | Behavior |
| --- | --- |
| `session.compact` | Runs Jev compaction over the transcript. Falls back to the built-in summary if the key is missing, Jev fails, the history cannot be fitted into the state budget, or the estimated reduction is below `minReductionRatio`. |
| `turn.complete` | When context usage reaches `compactAtPercent`, requests a compaction (with an in-flight guard). Set `compactAtPercent` to `0` to leave compaction timing to Claude Code. |

## Options

Set in the plugin's user config (`claude plugin config jev` or the plugin settings UI).

| Option | Default | Meaning |
| --- | --- | --- |
| `compaction` | `true` | Master switch for the hook |
| `apiKey` | unset | TypeSafe key; prefer `TYPESAFE_API_KEY` in the environment |
| `keepThreshold` | `0.5` | Keep a call or result when Jev's probability is at least this |
| `preserveRecentMessages` | `6` | Newest messages never touched (the first is always kept) |
| `compactAtPercent` | `60` | Auto-request compaction at this context percentage; `0` disables |
| `minReductionRatio` | `0.25` | Below this estimated reduction, fall back to the summary |
| `maxStateTokens` | `25000` | Budget for the history sent to Jev |
| `maxRequestTokens` | `30000` | Budget for history plus one batch of questions |
| `concurrency` | `4` | Question batches in flight at once (1 to 64) |
| `truncateHeadChars` | `300` | Characters kept from a dropped tool result |
| `model` | `jev-latest` | Jev model |

## Files

- `hooks.json` registers `fast-jev.ts`.
- `fast-jev.ts` is the adapter between Claude Code's `session.compact` event and the library.
- `compaction/` is a self-contained copy of `src/vendor/compaction/` (the plugin folder must not
  import from outside itself). `npm run sync:hooks` refreshes it; `npm run check` fails on drift.
- `types/claude-code.d.ts` is the function-hook type reference written by Claude Code 2.1.274.
  Regenerate with `/plugin-types` after a Claude Code upgrade. `npm run typecheck:hooks` checks
  the hook against it.

Adapted from [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) (MIT).
