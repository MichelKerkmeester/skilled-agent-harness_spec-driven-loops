#!/usr/bin/env bash
# Staged re-pin proof on a throwaway vendored consumer. Everything lives under $ROOT.
# launchctl is answered by the runtime's own test intercept; HOME and the state root are temp.
set -u
W="$1"; ROOT="$2"
rm -rf "$ROOT"; mkdir -p "$ROOT"
G=(git -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false -c core.hooksPath=/dev/null -c init.defaultBranch=main -c core.excludesFile=/dev/null)
ENGINE="$W/.skilled/commands/doctor/scripts/overlay-engine.cjs"
BOTS="$W/.skilled/bin/bots.cjs"
INTERCEPT="$W/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/launchctl-intercept.cjs"
UP="$ROOT/upstream"; C="$ROOT/consumer"; STAGE="$ROOT/stage"
export HOME="$ROOT/home" GIT_CONFIG_NOSYSTEM=1; unset XDG_STATE_HOME; STATE="$HOME/.local/state"
export BOTS_TEST_LAUNCHCTL_LOG="$ROOT/launchctl-calls.jsonl" BOTS_TEST_ACCOUNT_HOME="$ROOT/home"
mkdir -p "$HOME/Library/LaunchAgents" "$STATE"

echo "## upstream with two commits"
mkdir -p "$UP/.skilled/bin" "$UP/.skilled/skills/hub"
"${G[@]}" -C "$UP" init -q
printf '// runner stand-in\n' > "$UP/.skilled/bin/bots.cjs"
printf 'skill v1\n' > "$UP/.skilled/skills/hub/SKILL.md"
printf 'upstream agents\n' > "$UP/AGENTS.md"
"${G[@]}" -C "$UP" add -A; "${G[@]}" -C "$UP" commit -q -m old
OLD=$("${G[@]}" -C "$UP" rev-parse HEAD)
printf 'skill v2\n' > "$UP/.skilled/skills/hub/SKILL.md"
printf 'added\n' > "$UP/.skilled/skills/hub/added.md"
"${G[@]}" -C "$UP" add -A; "${G[@]}" -C "$UP" commit -q -m new
NEW=$("${G[@]}" -C "$UP" rev-parse HEAD)
echo "old=${OLD:0:10} new=${NEW:0:10}"

echo "## vendored consumer at the old pin, with a bots/ folder"
mkdir -p "$C"
"${G[@]}" -C "$UP" archive --format=tar -o "$ROOT/old.tar" "$OLD"; tar -xf "$ROOT/old.tar" -C "$C"; rm "$ROOT/old.tar"
mkdir -p "$C/skilled-overlays/files"
printf 'project agents\n' > "$C/skilled-overlays/files/AGENTS.md"
AGENTS_SHA=$(printf 'upstream agents\n' | shasum -a 256 | cut -d' ' -f1)
cat > "$C/skilled-overlays/overlay-manifest.json" <<JSON
{
  "schemaVersion": 1,
  "pin": { "upstream": "fixture", "commit": "${OLD:0:10}" },
  "layoutLinks": [],
  "overlays": [
    { "id": "agents", "scope": "file", "source": "files/AGENTS.md", "destination": "AGENTS.md", "pinnedSha256": "$AGENTS_SHA" }
  ]
}
JSON
cp -R "$W/.skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots" "$C/bots"
mkdir -p "$C/bots/tidy-notes"; cp "$W/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/manual.md" "$C/bots/tidy-notes/BOT.md"
printf '.skilled/skills/.state/*/*\n' > "$C/.gitignore"
"${G[@]}" -C "$C" init -q; "${G[@]}" -C "$C" add -A; "${G[@]}" -C "$C" commit -q -m consumer
node "$ENGINE" apply --root "$C"; echo "apply exit=$?"
node "$ENGINE" status --root "$C" | tail -2; echo "status exit=$?"

echo "## install record, job file and one run, through the runtime's own writers (status test support shape)"
R="$W/.skilled/skills/system-skilled-bots/runtime"
(cd "$R" && ./node_modules/.bin/tsx "$(dirname "$0")/repin-fake-install.mts" "$R/lib" "$W/.skilled/skills/system-deep-loop/runtime/lib/deep-loop" "$C" "$STATE/system-skilled-bots" "$HOME/Library/LaunchAgents"); FI=$?; echo "fake-install exit=$FI"; [ "$FI" = 0 ] || exit 3
echo "temp agents folder:"; ls "$HOME/Library/LaunchAgents"
RUNDIR_REL=$(cd "$C" && find .skilled/skills/.state -type d -name 'fixture-run-0001' | head -1); echo "run folder: $RUNDIR_REL"

echo "## bots/ hashes before"
(cd "$C" && find bots -type f -print0 | xargs -0 shasum -a 256 | sort -k2) > "$ROOT/bots-before.txt"; cat "$ROOT/bots-before.txt"
(cd "$C" && node --require "$INTERCEPT" "$BOTS" status --repo "$C"); echo "status-before exit=$?"

echo "## staged re-pin"
node "$ENGINE" repin --upstream "$UP" --to "${NEW:0:10}" --root "$C" --stage "$STAGE"; echo "repin exit=$?"
ls -a "$STAGE"
ST="$STAGE"; [ -d "$STAGE/consumer" ] && ST="$STAGE/consumer"
echo "staged tree root: ${ST#$ROOT/}"
(cd "$C" && find bots -type f -print0 | xargs -0 shasum -a 256 | sort -k2) > "$ROOT/bots-after.txt"
(cd "$ST" && find bots -type f -print0 | xargs -0 shasum -a 256 | sort -k2) > "$ROOT/bots-staged.txt"
echo "diff before after:"; diff "$ROOT/bots-before.txt" "$ROOT/bots-after.txt"; echo "diff1 exit=$?"
echo "diff before staged:"; diff "$ROOT/bots-before.txt" "$ROOT/bots-staged.txt"; echo "diff2 exit=$?"
echo "pin in copy: $(node -e 'console.log(require(process.argv[1]).pin.commit)' "$C/skilled-overlays/overlay-manifest.json")  pin in stage: $(node -e 'console.log(require(process.argv[1]).pin.commit)' "$ST/skilled-overlays/overlay-manifest.json" 2>&1)"
echo "run folder in copy:"; ls -la "$C/$RUNDIR_REL" 2>&1
echo "run folder in stage:"; ls -la "$ST/$RUNDIR_REL" 2>&1

echo "## bots status reading the staged tree in place"
(cd "$ST" && node --require "$INTERCEPT" "$BOTS" status --repo "$ST"); echo "status-stage exit=$?"

echo "## bots status after the staged tree takes the copy's path (promotion, simulated in temp only)"
mv "$C" "$ROOT/consumer.pre-promote"; cp -Rp "$ST" "$C"
(cd "$C" && node --require "$INTERCEPT" "$BOTS" status --repo "$C"); echo "status-promoted exit=$?"
(cd "$C" && node --require "$INTERCEPT" "$BOTS" status --json --repo "$C") | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);for(const row of r.rows.filter(x=>x.kind==="bot"))console.log(JSON.stringify({botId:row.botId,flags:row.flags,reinstall:row.reinstall,fix:row.fix}))})'
echo "launchctl verbs seen:"; cut -c1-60 "$BOTS_TEST_LAUNCHCTL_LOG" | sort | uniq -c
