# Cursor event-delivery probe

Run on 2026-09-11 against `cursor-agent` build `2026.09.02-c22c1a3`, Pro tier, authenticated.

## Method

A throwaway hook (`probe-hook.mjs`) was registered on two events in `.cursor/hooks.json`:
`sessionStart` as a positive control, and `beforeSubmitPrompt` as the event under test.
Each appends one line to a log, then returns `{"permission":"allow"}`. The log was cleared
before each run. `.cursor/hooks.json` was restored from `backup.cursor-hooks.json` afterwards
and verified byte-identical.

## Runs

| Run | Command | Model outcome | Log |
|-----|---------|---------------|-----|
| 1 | `cursor-agent -p ... --output-format text` | refused, workspace not trusted | empty |
| 2 | `... --trust` | `ActionRequiredError: You're out of usage` | `FIRED sessionStart bytes=445` |
| 3 | `... --trust --model auto` | replied `PROBE_OK` | `FIRED sessionStart bytes=431` |

Run 2 is inconclusive on its own: the session started but the model call failed, so the prompt
may never have reached a submit. Run 3 is the clean test. The model completed a full turn, which
means a prompt was submitted, and `beforeSubmitPrompt` still did not fire.

## Result

`beforeSubmitPrompt` is not delivered by this build. The positive control fired on both runs that
started a session, so the harness is sound and the negative is a real absence rather than a broken
probe.

This confirms rather than supersedes the record already in
`cli-external-orchestration/cli-cursor/references/hook-contract.md` section 7, which reported the
same absence under an earlier build.

## Consequence

Cursor has no prompt-time model-visible injection channel. `sessionStart` fires once per session
and cannot carry per-image evidence. `preToolUse` fires, but the Cursor goal adapter records that
its `agent_message` is not spliced into the model-visible transcript. The packet's original Cursor
design is therefore not buildable as written.

## Operator traps found

- `cursor-agent -p` refuses an untrusted directory and exits without running. `--trust` is required
  for a non-interactive dispatch from this checkout.
- A usage-limit refusal still starts a session, so `sessionStart` fires while the turn never
  happens. A probe that only watches a session-scoped event will read that as success.
