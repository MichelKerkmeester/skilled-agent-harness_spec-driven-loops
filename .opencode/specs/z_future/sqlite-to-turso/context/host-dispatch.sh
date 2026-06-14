#!/bin/bash
# Dispatch all three MiMo seats for one deep-context iteration, in parallel,
# with the cli-opencode non-TTY contract (closed stdin, json format, no --agent)
# and a hard per-seat timeout. Barrier-joins before returning.
set -u
ITER="$1"   # e.g. iter-003
REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SF=".opencode/specs/z_future/sqlite-to-turso"
cd "$REPO" || exit 1
mkdir -p "$SF/context/seats/$ITER"
for L in mimo-a mimo-b mimo-c; do
  (
    SPECKIT_CLI_DISPATCH_STACK=deep-context AI_SESSION_CHILD=1 \
    gtimeout 900 opencode run \
      --model xiaomi/mimo-v2.5-pro --variant high --format json --dir "$REPO" \
      "$(cat "$SF/context/prompts/$ITER/$L.md")" \
      </dev/null \
      > "$SF/context/seats/$ITER/$L.raw.json" \
      2> "$SF/context/seats/$ITER/$L.err.log"
    echo "$L exit=$?"
  ) &
done
wait
echo "=== barrier joined: $ITER ==="
ls -la "$SF/context/seats/$ITER/" | grep raw || true
