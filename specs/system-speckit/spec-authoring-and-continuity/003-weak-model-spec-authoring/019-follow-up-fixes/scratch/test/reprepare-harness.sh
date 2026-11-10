#!/bin/bash
# Runs loop.sh's ready_field and reprepare, extracted verbatim, against a stub prepare.sh,
# so the real (non-dry) re-prepare paths run without building a sandbox or dispatching a model.
# Run from the repository root with /bin/bash (3.2 on macOS, the shell loop.sh targets).
L=specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop
W=$(mktemp -d "${TMPDIR:-/tmp}/reprepare-harness.XXXXXX") || exit 2
trap 'rm -rf "$W"' EXIT
mkdir -p "$W/stub" "$W/sbx"
awk '/^ready_field\(\)/{print} /^REFUSED=$/{f=1} f{print} f&&/^}$/{exit}' "$L/loop.sh" > "$W/fns.sh"
grep -q '^reprepare()' "$W/fns.sh" || { echo "reprepare not found in loop.sh"; exit 2; }
# The stub rebuilds the sandbox like prepare.sh: same head, a moved head, a failure, or a leak.
cat > "$W/stub/prepare.sh" <<'EOF'
v=$1; [ "$MODE" = fail ] && { rm -rf "$SBX/$v"; exit 1; }
rm -rf "$SBX/$v"; mkdir -p "$SBX/$v"
h=H1; [ "$MODE" = diff ] && h=H2; n=0; [ "$MODE" = leak ] && n=3
echo "variant=$v head=$h task_term_refs=$n base=x" > "$SBX/$v/ready"
EOF
SBX=$W/sbx; export SBX MODE; LOOP=$W/stub; DRY=0; DF=; TRACK=zz-track; TERMS=/x/terms
sbx_dir() { echo "$SBX/$1"; }
. "$W/fns.sh"
VS=(a b c d); H0=(H1 H1 H1 H1)
for v in a b c d; do
  mkdir -p "$SBX/$v"; echo "variant=$v head=H1 task_term_refs=0 base=x" > "$SBX/$v/ready"; touch "$SBX/$v/DIRTY"
done
dirty() { [ -e "$SBX/$1/DIRTY" ] && echo y || echo n; }
MODE=same; reprepare 2 0
MODE=diff; reprepare 2 1
MODE=fail; reprepare 2 2
MODE=leak; reprepare 2 3
echo "-- after round 2: DIRTY a=$(dirty a) b=$(dirty b) c=$(dirty c) d=$(dirty d)"
echo "-- round 3, every MODE same: refused b, c, d stay out and clean a is skipped"
MODE=same; for i in 0 1 2 3; do reprepare 3 "$i"; done
echo "-- round 4: a dirty again is re-prepared"
touch "$SBX/a/DIRTY"; MODE=same; reprepare 4 0
