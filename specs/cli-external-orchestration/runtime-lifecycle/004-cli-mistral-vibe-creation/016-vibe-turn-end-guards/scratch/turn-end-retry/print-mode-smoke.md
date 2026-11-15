# Print-mode smoke run: the new post_agent entry loads and accepts

Run 2026-11-14 on `vibe 3.1.2`, `deepseek-flash`, from a `mktemp` run folder with
a rendered home hooks file. It is not the T017 proof: a print-mode run has no
`ask_user_question`, so the ask-surface part passes by design. It proves the one
thing the fixtures cannot: Vibe accepts the `post_agent` entry in the rendered
home file and runs the composer to completion.

## Command shape

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
VIBE_HOME="$RUN_DIR/.vibe-home"
mkdir -p "$VIBE_HOME"
cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
cd "$RUN_DIR" && env -u AI_SESSION_CHILD VIBE_HOME="$VIBE_HOME" \
  vibe -p 'Reply with the single word OK. Use no tools.' \
  --model deepseek-flash --max-turns 2 --time-limit 180 \
  --output-dir "$RUN_DIR/out" </dev/null
```

The prompt uses no tool, so no guard denies a call.

## Observed

```text
OK
vibe exit=0
```

`out/export.json` records `"outcome": "finished"` and `"steps": 1`.

The journal's `post_agent_turn` `action_intent` names one binding:

```text
intent bindings: ["user:turn-end"]
```

and its `core_input` command result is:

```text
OUTPUT: {"acceptance":{"type":"candidate"},"type":"accept"}
```

So the rendered entry `turn-end` ran and accepted the turn, with no deny.

## What is still missing for T017

An interactive TUI turn that ends in a prose option menu, answered by an
operator, so the deny becomes a retry user message starting with
`[ask-surface]`. `procedure.md` holds that run.
