# Keyed main-session run: the advisor brief reaches the model

Run 2026-11-14 on `vibe 3.1.2`, `deepseek-flash`, from a scratch cwd with the
rendered home hooks and no `AI_SESSION_CHILD`.

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

The prompt writes nothing, so the spec gate never denies a call. The run exited
`0` and printed `OK`.

## Outcome record

`export.json` records `exit_code` `0`, `outcome` `finished`, `active_model`
`deepseek-flash` and `vibe_version` `3.1.2`.

## Journal

`journal-0000000000000001.jsonl` holds one `pre_agent_turn` `hook_completed`
record. Its `user_content` carries the operator prompt, then the hook context
entries. Read with:

```bash
node -e '
const fs=require("fs");
const lines=fs.readFileSync(process.argv[1],"utf8").split("\n").filter(Boolean);
for (const line of lines) {
  const rec=JSON.parse(line);
  const inner=rec?.payload?.result;
  if (inner?.result?.hook !== "pre_agent_turn" || inner?.type !== "hook_completed") continue;
  for (const entry of inner.result.output.user_content ?? []) {
    if (entry?._meta?.["vibe.hookContext"] === true) console.log(JSON.stringify(String(entry.text).slice(0, 120)));
  }
}
' journal-0000000000000001.jsonl
```

Observed:

```text
"Advisor: no skill matched.\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER emb"
"## Session Context\nSession context received. Current state:\n\n- Continuity: recov"
```

The first hook-context entry starts with `Advisor:`, which is the advisor part's
brief. The second is the `session_start` context that the first message carries.
The brief's `no skill matched` head is the expected answer for a no-tool prompt;
the `Directives:` block after it is the constant block the shared store sends
once per session.
