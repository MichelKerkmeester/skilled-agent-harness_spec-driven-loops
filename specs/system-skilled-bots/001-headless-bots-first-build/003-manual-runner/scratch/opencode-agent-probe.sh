#!/bin/bash
# Resolves OpenCode's agents with `opencode debug agents --standalone` (a private
# server, no model call) for three scratch repositories and one inline permission
# profile, and prints the last matching rule per action on the named agent.
# usage: opencode-agent-probe.sh <label> '<OPENCODE_CONFIG_CONTENT json>' [agent]
set -u
LABEL=$1; CONTENT=$2; AGENT=${3:-build}
OC=${OPENCODE_REAL:-$HOME/.local/bin/opencode}
ROOT=$(mktemp -d "${TMPDIR:-/tmp}/oc-agent-probe-XXXXXX")
trap 'rm -rf "$ROOT"' EXIT
mkdir -p "$ROOT/plain" "$ROOT/mcp" "$ROOT/agent" "$ROOT/agent-md/.opencode/agent"
echo '{}' > "$ROOT/plain/opencode.json"
echo '{"mcp":{"demo":{"type":"local","command":["node","-e","0"],"enabled":true}}}' > "$ROOT/mcp/opencode.json"
echo '{"agent":{"build":{"permission":{"bash":"allow","edit":"allow"}}}}' > "$ROOT/agent/opencode.json"
echo '{}' > "$ROOT/agent-md/opencode.json"
printf -- '---\ndescription: build override\nmode: primary\npermission:\n  bash: allow\n  edit: allow\n---\nYou build.\n' > "$ROOT/agent-md/.opencode/agent/build.md"
echo "probe: $LABEL  opencode $($OC --version)  $(date -u +%FT%TZ)"
echo "OPENCODE_CONFIG_CONTENT=$CONTENT"
for repo in plain mcp agent agent-md; do
  dir="$ROOT/$repo"
  before=$(cd "$dir" && find . -print | sort | shasum)
  echo "--- repo: $repo  opencode.json=$(cat "$dir/opencode.json")"
  [ -d "$dir/.opencode/agent" ] && echo "    .opencode/agent/build.md: $(tr '\n' ' ' < "$dir/.opencode/agent/build.md")"
  (cd "$dir" && OPENCODE_CONFIG_CONTENT="$CONTENT" "$OC" debug agents --standalone > "$ROOT/$repo.json" 2>"$ROOT/$repo.err"); echo "debug agents exit=$?"
  after=$(cd "$dir" && find . -print | sort | shasum)
  [ "$before" = "$after" ] && echo "repo file list unchanged by the probe" || echo "repo file list CHANGED by the probe"
  node - "$ROOT/$repo.json" "$AGENT" <<'NODE'
const [file, id] = process.argv.slice(2);
const agents = JSON.parse(require('fs').readFileSync(file, 'utf8'));
const a = agents.find((x) => x.id === id);
if (!a) { console.log(`agent ${id}: absent`); process.exit(0); }
const glob = (p, s) => new RegExp('^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$').test(s);
console.log(`agent ${id} rules: ${a.permissions.map((p) => `${p.action}:${p.resource}=${p.effect}`).join(' ')}`);
for (const action of ['edit', 'shell', 'subagent', 'external_directory', 'webfetch', 'question', 'demo_tool', 'read', 'grep', 'glob', 'list']) {
  const last = [...a.permissions].reverse().find((p) => glob(p.action, action) && p.resource === '*');
  console.log(`  ${action.padEnd(19)} last rule for resource *: ${last ? `${last.action}:${last.resource}=${last.effect}` : 'none'}`);
}
NODE
done
