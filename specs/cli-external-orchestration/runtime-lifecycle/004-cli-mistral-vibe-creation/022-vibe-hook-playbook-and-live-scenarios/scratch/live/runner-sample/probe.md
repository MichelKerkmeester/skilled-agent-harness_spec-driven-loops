# Vibe adapter live probe

The probe plays the runner's own sample scenario, `MTP-007` from
`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md`,
into an interactive Vibe session. The only change is `vibe` added to the script's `runtimes`
array, because the runner skips a runtime the script does not list. The copy that ran is
`scenario.md` beside this note.

```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs \
    --scenario <temp>/sample-vibe.md --runtime vibe --scratch "$(mktemp -d)" \
    --out specs/.../022-vibe-hook-playbook-and-live-scenarios/scratch/live/runner-sample
runtime vibe: socket conv-42219-vibe
runtime vibe: PASS 6/6
```

`matrix.md` holds one `vibe` row reading `PASS 6/6`. `checkpoints.tsv` records one PASS per turn:
`single-select` (green), `multi-select` (small, large), `other-answer` (teal), `chat-reply` (yes),
`restart` (present) and `compact` (4). `result.json` records `sandbox: seatbelt`, so the subject ran
under the runner's write sandbox and still wrote its answers in the scratch project.

## What the live run confirmed

- **Ready**: the input line is `> ` and is the last line that starts with the glyph. An echoed send
  also starts with `> `, so the idle test reads the last match.
- **Busy**: `Generating… (0s Esc/Ctrl+C to interrupt)` and
  `User input required… (1s Esc/Ctrl+C to interrupt)` are drawn above the prompt, so the adapter
  tests the whole screen (`busyAnywhere`).
- **Single-select question**: a bordered box with the question, numbered rows and
  `↑↓/jk navigate  Enter select  Esc cancel`. The answer is an arrow move plus Enter.
- **Multi-select question**: rows carry `[ ]`, the free-text row is `Type your answer...`, a
  `Submit →` row follows it, and the footer reads `Space/Enter toggle`. Space toggles, the cursor
  moves to Submit and Enter sends.
- **Free-text answer**: Enter on the free-text row opens the input; typing and Enter commits the
  text. A single-select box submits on that Enter. A multi-select box leaves the row unchecked, so
  the adapter toggles it with Space before moving to Submit.
- **Restart**: `/exit` closes the session and the tmux server; `vibe --resume <session>` continues
  the same conversation. The session id is the newest folder under
  `$VIBE_HOME/logs/session/unified`.
- **Compaction**: `/compact` runs and the four-line answer file survives.

## Home layout

The adapter creates a fresh home beside the scratch project, copies the repository
`.vibe/config.toml` into it, and renders `.vibe/hooks.toml` there with
`.vibe/plugins/repo-guards/render-home-hooks.cjs`. The home is outside the checkout, so the
sandbox allows the journal, history and output writes. `VIBE_HOME` is added to the subject and
check environment, so a scenario check can read the journal at
`$VIBE_HOME/logs/session/unified/<session>/journal`.

The pass above ran while the adapter was still unprobed, so `result.json` records
`adapter.probed: false`. The adapter is marked probed after this pass, and the runner suite's
`adapter screens` line then counts six probed runtimes.
