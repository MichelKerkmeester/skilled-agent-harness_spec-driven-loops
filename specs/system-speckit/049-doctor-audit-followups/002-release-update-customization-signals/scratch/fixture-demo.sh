#!/usr/bin/env bash
set -euo pipefail
E="$1"; D="$(mktemp -d)"; trap 'rm -rf "$D"' EXIT
g(){ git -C "$1" "${@:2}"; }
mk(){ mkdir -p "$(dirname "$1")"; printf '%s' "$2" > "$1"; }
U=$D/upstream; mkdir -p $U; g $U init -q; g $U config user.name d; g $U config user.email d@example.invalid
mk $U/.skilled/skills/hub-a/SKILL.md $'# hub-a\n'; mk $U/.skilled/skills/hub-a/references/a.md $'base\n'
g $U add -A; g $U commit -qm base; g $U tag -a v1.9.0.0 -m r
cp -R $U/.skilled $D/copy-skilled
for t in v1.10.0.0 v1.9.5.0-rc.1 v1.11.0.0-beta.1; do mk $U/.skilled/skills/hub-a/references/a.md "$t"$'\n'; g $U add -A; g $U commit -qm $t; g $U tag -a $t -m r; done
O=$D/operator; git clone -q $U $O
echo "## prerelease policy"
echo "default:  $(node $E check --repo $O --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log("upstream.latest="+r.upstream.latest+" release="+r.release)})')"
echo "opted in: $(node $E check --repo $O --include-prerelease --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log("upstream.latest="+r.upstream.latest+" release="+r.release)})')"
V=$D/vendor; mkdir -p $V; g $V init -q; g $V config user.name d; g $V config user.email d@example.invalid; cp -R $D/copy-skilled $V/.skilled; g $V add -A; g $V commit -qm vendor
echo "## copied tree base recording"
echo "before:   $(node $E check --repo $V --remote $U --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log(r.units.map(u=>u.name+" baseSource="+u.baseSource).join(", ")+" | baseRecording.needed="+r.baseRecording.needed)})')"
node $E record-base --repo $V --remote $U --release v1.9.0.0 --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log("record:   ok="+r.ok+" release="+r.release+" units="+r.units.join(","))})'
echo "after:    $(node $E check --repo $V --remote $U --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log(r.units.map(u=>u.name+" baseSource="+u.baseSource+" status="+u.status).join(", ")+" | baseRecording.needed="+r.baseRecording.needed)})')"
