# Operator procedure: the ask-surface reprompt retries a Vibe turn

Interactive-only. A print-mode run never lists `ask_user_question`
(`NON_INTERACTIVE_DISABLED_TOOLS` in `vibe/acp/agent.py`), so the ask-surface
part passes it by design and cannot show the retry. This procedure needs one
operator at the TUI.

## Setup

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
VIBE_HOME="$RUN_DIR/.vibe-home"
mkdir -p "$VIBE_HOME"
cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
```

The rendered home hooks name every command by absolute checkout path, and the
run stays outside `~/.vibe`.

## Run

```bash
cd "$RUN_DIR" && env -u AI_SESSION_CHILD VIBE_HOME="$VIBE_HOME" \
  vibe --model deepseek-flash --max-turns 4 --time-limit 300 \
  --output-dir "$RUN_DIR/out"
```

At the prompt, send:

```text
Do not use any tool. Reply with exactly one short sentence and then a prose
option menu: a question that asks which of two files I want changed, followed
by A) src/parser.ts and B) src/lexer.ts.
```

Do not answer the menu. The expected observable is a second turn whose user
message starts with `[ask-surface]`, sent by the post_agent deny, and a reply
that asks through the question widget instead of repeating the menu.

## Evidence to copy into this folder

```bash
cp -R "$RUN_DIR/out" "$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/016-vibe-turn-end-guards/scratch/turn-end-retry/"
cp "$RUN_DIR/.skilled/skills/.state/ask-surface/fires.jsonl" \
  "$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/016-vibe-turn-end-guards/scratch/turn-end-retry/fires.jsonl"
```

The copied journal must hold a user entry whose text starts with
`[ask-surface]`, and `fires.jsonl` must gain one line with `"runtime":"vibe"`.

## Why this is blocked here

A non-interactive dispatch has no operator to answer the widget, and a
print-mode run has no question tool, so the retry cannot be produced from this
worker. The fixture suite covers the same decision on a recorded journal; this
run is the live proof the journal format still yields it.
