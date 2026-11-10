#!/usr/bin/env bash
# Builds a throwaway checkout holding the real relaunch hooks, the real wrapper and a harmless
# goal packet. Usage: build-sandbox.sh <sandbox-dir> <durable-chars> <worktree>
set -euo pipefail
sandbox="$1"; chars="$2"; worktree="$3"
here="$(cd "$(dirname "$0")" && pwd)"
rm -rf "$sandbox"; mkdir -p "$sandbox/.skilled/hooks" "$sandbox/.skilled/bin" "$sandbox/.claude" \
  "$sandbox/.skilled/skills/system-spec-kit/templates"
for d in session-relaunch shared goal; do
  rsync -a --exclude tests --exclude '*.test.*' --exclude node_modules "$worktree/.skilled/hooks/$d" "$sandbox/.skilled/hooks/"
done
cp "$worktree/.skilled/bin/skilled-loop" "$sandbox/.skilled/bin/skilled-loop"
cp "$worktree/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json" "$sandbox/.skilled/skills/system-spec-kit/templates/"
node "$here/make-goal.cjs" "$sandbox/specs/demo/001-demo" "$chars"
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
