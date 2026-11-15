# Operator procedure: a live Vibe answer lands in the decision queue

Interactive-only. A print-mode run removes `ask_user_question` from the tool list
(`NON_INTERACTIVE_DISABLED_TOOLS` in `vibe/acp/agent.py`), so a dispatched worker
cannot answer the widget and cannot produce the record. One operator at the TUI
runs this, and the procedure is blocked until then.

The proof is one unanswered save: the queue must hold one pending record after the
widget returns, before any `sweep-vibe.mjs` call. The sweep exists for the hook
that never fired, so running it first would hide whether the hook works.

## 1. Setup

Run from the repository root, with `MISTRAL_API_KEY` already exported and a `vibe`
binary on `PATH`. The home stays a throwaway folder; never use `~/.vibe`.

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
SCRATCH="$RUN_DIR/project"
VIBE_HOME="$RUN_DIR/.vibe-home"
mkdir -p "$SCRATCH" "$VIBE_HOME"
cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
```

The renderer writes `$VIBE_HOME/hooks.toml` with every command anchored to the
checkout by absolute path, so the home hooks load from the scratch cwd. Confirm the
new entry is in the rendered file:

```bash
rg -n 'decision-capture-ask|ask-capture-post-tool' "$VIBE_HOME/hooks.toml"
```

## 2. Run

```bash
cd "$SCRATCH" && env -u AI_SESSION_CHILD VIBE_HOME="$VIBE_HOME" \
  vibe --max-turns 8 --time-limit 300 --output-dir "$RUN_DIR/out"
```

At the prompt, send:

```text
Call the ask_user_question tool now and ask me exactly one question: which of two
routes the cache should take, with options A) Direct and B) Via proxy. Do not
answer it yourself and do not ask it as prose.
```

Answer the widget with `A`. The `post_tool` entry named `decision-capture-ask`
runs when the widget returns and appends the record through
`.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs`.

Then send `/exit`.

## 3. Verify the pending record

The session id is `meta.json`'s `session_id`, which is the same identity the
`post_tool` payload carried.

```bash
SESSION_DIR="$(ls -1dt "$VIBE_HOME"/logs/session/unified/*/ | head -1)"
SESSION_ID="$(node -e 'console.log(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).session_id)' "$SESSION_DIR/meta.json")"
node -e 'const { pathToFileURL } = require("node:url"); import(pathToFileURL(process.argv[1]).href).then(({ pendingRecords }) => console.log(pendingRecords(process.argv[2], process.argv[3]).length));' \
  "$REPO/.skilled/hooks/decision-capture/lib/capture-core.mjs" "$SCRATCH" "$SESSION_ID"
```

A `1` is the live proof. A `0` means the hook did not fire; rerun the same read
after the fallback sweep, and record that the live path was missed:

```bash
cd "$SCRATCH" && node "$REPO/.skilled/hooks/decision-capture/bin/sweep-vibe.mjs" --session "$SESSION_DIR"
```

The sweep must then leave the same `1`, not `2`, because it writes the same key.

## 4. Evidence to copy into this folder

```bash
cp -R "$RUN_DIR/out" "$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture/scratch/live-capture/"
cp "$VIBE_HOME"/logs/session/unified/*/meta.json \
  "$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture/scratch/live-capture/session-meta.json"
cp "$SCRATCH"/.skilled/skills/.state/decision-capture/*/*.jsonl \
  "$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture/scratch/live-capture/queue.jsonl"
```

Write the count line, the session id and whether the hook fired before the sweep
into `scratch/live-capture/result.md`.

## Why this is blocked here

A non-interactive dispatch has no operator to answer the widget, and a print-mode
run has no question tool at all, so this worker can write the procedure but cannot
run it. The fixture suites cover the payload, the mapper and the key; this run is
the only proof that Vibe's `post_tool` reaches the adapter for the real tool.
