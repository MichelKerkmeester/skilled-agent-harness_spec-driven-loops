# jev compact

Shrink an agent transcript without summarizing anything. Jev decides, per old tool call, whether the call and whether its full output still matter. Stale results are cut to a short head plus a note, stale calls are removed, everything else is returned exactly as it was. User and assistant text is never touched.

```bash
jev compact [transcript] [options]
```

## When to use

Before handing a long session to another agent, to audit what a compaction would drop, or as the engine behind the Claude Code plugin's compaction hook, which replaces the built-in summary in-session. Summaries are lossy: a path, an exact error, or a constraint can vanish. This never rewrites, only deletes what Jev says is no longer needed, and the assistant can always re-run a tool.

## Input

| Form | Example |
| --- | --- |
| Claude Code session log | `@~/.claude/projects/<project>/<session>.jsonl` |
| Messages JSON | `[{"role","text","toolUses":[{"tool_use_id","tool","input"}],"toolResults":[{"tool_use_id","text"}]}]`; `text` and `toolUses` may be omitted |

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `-g, --goal <text>` | The ongoing task, so Jev knows what still matters | last three user prompts |
| `--keep-threshold <p>` | Keep a call or result when Jev's probability is at least this | `0.5` |
| `--preserve-recent <n>` | Newest messages never touched; the first is always kept | `6` |
| `--max-state-tokens <n>` | Budget for the history sent to Jev | `25000` |
| `--max-request-tokens <n>` | Budget for history plus one batch of questions | `30000` |
| `--truncate-head <n>` | Characters kept from a dropped result before its note | `300` |
| `--min-reduction <p>` | Below this ratio the result is `worth_it: false` | `0.25` |
| `--concurrency <n>` | Question batches in flight at once, 1 to 64 | `4` |
| `-o, --out <path>` | Write the compacted transcript as messages JSON | |
| `--fail-on <list>` | Exit 2 on `low-reduction` | `none` |

## How it fits Jev's 32k window

Jev never sees the raw transcript. The state is the whole conversation with every tool output replaced by a one-line note (`ok, 4213 chars (omitted)`). If that exceeds the budget it is shrunk in stages: tool inputs truncated, long texts abridged, old messages collapsed to a note, old calls reduced to one line, old call-less messages left out. Questions (two per candidate call) are split across as many requests as needed, each resending the same state. They run concurrently, at most `--concurrency` at a time (default 4), because every request in flight carries another copy of the state. Compressing the state never changes the output; it only shapes what Jev reads to decide. Token counts are estimates calibrated slightly above Jev's real counts.

## Output

`reduction`, `worth_it`, `stats` (messages and chars before and after, kept/truncated/dropped/pinned counts, state tokens and stage, requests, ms), `decisions[]` (`id`, `tool`, `action`, `keepCall`, `keepResult`), `messages` (the compacted transcript).

## Example

```bash
jev compact @session.jsonl --out compacted.json
```

```text
61% smaller  528 → 341 messages · 1,204,311 → 470,902 chars
209 tool calls: 58 kept · 71 results truncated · 77 calls dropped · 3 pinned · state ~24944 tokens (old messages collapsed) in 5 request(s), 2140 ms

Call  Tool  Action    P(call)  P(result)
----  ----  --------  -------  ---------
t1    Bash  truncate  0.91     0.12
t2    Read  drop      0.08     0.03
```

In-session use: see [plugin/hooks/README.md](../plugin/hooks/README.md). Adapted from [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) (MIT).
