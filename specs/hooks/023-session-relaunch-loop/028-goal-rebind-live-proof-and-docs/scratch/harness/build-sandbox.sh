#!/usr/bin/env bash
# Builds a throwaway checkout holding the real relaunch hooks, the real wrapper, the real goal
# hooks for one runtime and a harmless goal packet.
# Usage: build-sandbox.sh <claude|pi|opencode|devin> <sandbox-dir> <durable-chars> <worktree>
set -euo pipefail
runtime="$1"; sandbox="$2"; chars="$3"; worktree="$4"
here="$(cd "$(dirname "$0")" && pwd)"
rm -rf "$sandbox"
mkdir -p "$sandbox/.skilled/hooks" "$sandbox/.skilled/bin" "$sandbox/.skilled/commands" \
  "$sandbox/.skilled/skills/system-spec-kit/templates"
for d in session-relaunch shared goal; do
  rsync -a --exclude tests --exclude '*.test.*' --exclude node_modules "$worktree/.skilled/hooks/$d" "$sandbox/.skilled/hooks/"
done
cp "$worktree/.skilled/bin/skilled-loop" "$sandbox/.skilled/bin/skilled-loop"
cp "$worktree/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json" "$sandbox/.skilled/skills/system-spec-kit/templates/"
node "$here/make-goal.cjs" "$sandbox/specs/demo/001-demo" "$chars"

case "$runtime" in
  claude)
    mkdir -p "$sandbox/.claude"
    python3 - "$worktree/.claude/settings.json" "$sandbox/.claude/settings.json" <<'PY'
import json, sys
src = json.load(open(sys.argv[1]))
keep = {}
for event, groups in src["hooks"].items():
    for group in groups:
        for hook in group["hooks"]:
            if "session-relaunch/claude/" in hook["command"]:
                keep.setdefault(event, []).append({"matcher": group.get("matcher", ""), "hooks": [hook]})
json.dump({"hooks": keep}, open(sys.argv[2], "w"), indent=2)
print({event: len(groups) for event, groups in keep.items()})
PY
    ;;
  pi)
    mkdir -p "$sandbox/.pi/extensions"
    ln -s ../../.skilled/hooks/session-relaunch/pi/session-relaunch.ts "$sandbox/.pi/extensions/session-relaunch.ts"
    ln -s ../../.skilled/hooks/goal/pi/goal-context.ts "$sandbox/.pi/extensions/goal-context.ts"
    ;;
  opencode)
    mkdir -p "$sandbox/.opencode/plugins"
    cp "$worktree/.skilled/commands/goal-opencode.md" "$sandbox/.skilled/commands/"
    cp -R "$worktree/.opencode/plugins/lib" "$sandbox/.opencode/plugins/lib"
    cp "$worktree/.opencode/plugins/session-relaunch.js" "$worktree/.opencode/plugins/opencode-goal.js" "$sandbox/.opencode/plugins/"
    cp "$worktree/.opencode/package.json" "$sandbox/.opencode/package.json"
    ln -s "$worktree/.opencode/node_modules" "$sandbox/.opencode/node_modules"
    ln -s ../.skilled/hooks "$sandbox/.opencode/hooks"
    ln -s ../.skilled/commands "$sandbox/.opencode/commands"
    ln -s ../.skilled/skills "$sandbox/.opencode/skills"
    cat > "$sandbox/opencode.json" <<'JSON'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openai/gpt-6-luna",
  "permission": { "edit": "allow", "bash": "allow", "webfetch": "deny", "doom_loop": "allow", "external_directory": "deny" }
}
JSON
    ;;
  devin)
    mkdir -p "$sandbox/.devin"
    python3 - "$worktree/.devin/hooks.v1.json" "$sandbox/.devin/hooks.v1.json" <<'PY'
import json, sys
src = json.load(open(sys.argv[1]))
keep = {}
for event, groups in src.items():
    for group in groups:
        hooks = [h for h in group.get("hooks", []) if "goal-inject" in h.get("command", "")]
        if hooks:
            keep.setdefault(event, []).append({**{k: v for k, v in group.items() if k != "hooks"}, "hooks": hooks})
json.dump(keep, open(sys.argv[2], "w"), indent=2)
print({event: len(groups) for event, groups in keep.items()})
PY
    ;;
  *) echo "unknown runtime $runtime" >&2; exit 2 ;;
esac
echo "sandbox built: $sandbox ($runtime)"
