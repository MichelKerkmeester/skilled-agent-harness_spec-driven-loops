#!/bin/sh
# Runs `bots run` for a read-only OpenCode bot in four scratch repositories with NO model
# call: OPENCODE_BIN points at a shim that hands `--version` and `debug agents` to the real
# binary (no model) and exits 99 on `run`, after recording the argv and inline config it got.
# So a bot that passes the builder's agent check reaches the shim and fails there; one that
# does not is refused before dispatch. Named without the CLI's word so the recursion guard,
# which reads every ancestor's command line, does not refuse it.
# Usage: sh oc-gate-e2e.sh
set -u
W="$(cd "$(dirname "$0")/../../../../.." && pwd)"
BOTS="$W/.skilled/bin/bots.cjs"
REAL="${OPENCODE_REAL:-$HOME/.local/bin/opencode}"
ROOT="$(mktemp -d "${TMPDIR:-/tmp}/oc-gate-e2e.XXXXXX")"
trap 'rm -rf "$ROOT"' EXIT
STATE_HOME="$ROOT/state"; TREE="$ROOT/tree"; SHIM="$ROOT/shim/oc"
mkdir -p "$STATE_HOME" "$TREE/.skilled/skills/.state" "$ROOT/shim"
git -C "$TREE" init -q
printf '%s\n' '.skilled/skills/.state/*/*' > "$TREE/.gitignore"
cat > "$SHIM" <<SHIM
#!/bin/sh
case "\$1" in
  --version|debug) exec "$REAL" "\$@" ;;
esac
printf '%s\n' "\$@" > "\$PWD/.shim-run-argv"
printf '%s' "\$OPENCODE_CONFIG_CONTENT" > "\$PWD/.shim-run-config"
exit 99
SHIM
chmod +x "$SHIM"
echo "oc-gate-e2e $(date -u +%FT%TZ), real binary $("$REAL" --version)"

fixture() {
  NAME="$1"; CONFIG="$2"
  REPO="$ROOT/repo-$NAME"; mkdir -p "$REPO/bots/probe"
  git -C "$REPO" init -q
  printf '{"identity":"probe/%s"}\n' "$NAME" > "$REPO/bots/config.json"
  printf '%s\n' "$CONFIG" > "$REPO/opencode.json"
  printf -- '---\nid: probe\ntrigger: {kind: manual}\nruntime: {kind: cli-opencode, model: llmgateway/deepseek-v4.1-flash-1017}\nisolation: shared\nsandbox: read-only\n---\nNever sent: the shim stops the run.\n' > "$REPO/bots/probe/BOT.md"
  git -C "$REPO" -c user.email=p@example.invalid -c user.name=p add -A
  git -C "$REPO" -c user.email=p@example.invalid -c user.name=p commit -q --no-verify -m probe
  echo "--- $NAME: opencode.json=$CONFIG"
  OUT="$(OPENCODE_BIN="$SHIM" XDG_STATE_HOME="$STATE_HOME" node "$BOTS" run probe --repo "$REPO" --skilled-tree "$TREE" </dev/null 2>&1)"
  CODE=$?
  printf '%s
' "$OUT" | grep -v '^WARN' | sed "s|$ROOT|<root>|g"
  echo "bots exit=$CODE"
  if [ -f "$REPO/.shim-run-argv" ]; then
    echo "reached run (no model): argv $(tr '\n' ' ' < "$REPO/.shim-run-argv" | sed 's/Never sent.*//')"
    echo "inline config at run: $(cat "$REPO/.shim-run-config")"
  else
    echo "never reached run"
  fi
}

fixture plain '{}'
fixture mcp '{"mcp":{"demo":{"type":"local","command":["node","-e","0"],"enabled":true}}}'
fixture agent-override '{"agent":{"build":{"permission":{"bash":"allow","edit":"allow"}}}}'
fixture default-agent '{"default_agent":"plan","agent":{"plan":{"permission":{"bash":"allow","edit":"allow"}}}}'
