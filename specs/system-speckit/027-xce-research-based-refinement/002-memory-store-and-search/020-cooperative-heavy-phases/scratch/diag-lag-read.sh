#!/usr/bin/env bash
# Isolated scan event-loop-lag diagnostic for packet 027/002/021.
#
# WHY a clone: the live daemon + this editor's MCP both bridge to the same
# /tmp/mk-spec-memory daemon over the live 719MB context-index.sqlite (which has
# a multi-backup corruption history). Measuring against it would mean killing the
# live launcher (churning every session) and a second writer on the live DB. So
# we snapshot the DB to an isolated dir and run a BARE daemon (no launcher → no
# lease/owner/re-election machinery to collide with the live launcher) on its own
# socket. The daemon honors SPEC_KIT_DB_DIR (core/config.ts) for DB + vectors +
# instance-lock + markers, and SPECKIT_IPC_SOCKET_DIR for its socket — full
# isolation from the live instance.
#
# The instrumentation (event-loop lag sampler + per-phase timing) is gated on the
# background scan path (ctx.onPhase), so we drive a force+background scan and read
# the daemon's stderr (re-election's stdio:ignore problem does not apply — a bare
# daemon's stderr goes straight to our log).
set -uo pipefail

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
MCP="$REPO/.opencode/skills/system-spec-kit/mcp_server"
LIVE_DB_DIR="$MCP/database"
DAEMON="$MCP/dist/context-server.js"
CLI="$REPO/.opencode/bin/spec-memory.cjs"

DIAG_DB_DIR="$HOME/.mk-spec-diag-db"   # under $HOME -> passes config.ts boundary check
DIAG_SOCK="/tmp/mk-spec-diag"          # short -> under Darwin 103-byte sun_path limit
LOG="/tmp/021-daemon.log"              # bare daemon stderr+stdout (instrumentation lands here)
PROGRESS="/tmp/021-diag-progress.log"  # this script's own narration
MARKER="__DIAG_021_MARKER__"           # unique argv tag so we never kill the live daemon
PIDFILE="$DIAG_DB_DIR/.diag.pid"
NODE="${NODE:-$(command -v node)}"

say() { echo "$(date '+%H:%M:%S') $*" | tee -a "$PROGRESS"; }
: > "$PROGRESS"

kill_diag() {
  # Kill ONLY our marker-tagged daemon, never the live context-server.js.
  if [ -f "$PIDFILE" ]; then
    local p; p="$(cat "$PIDFILE" 2>/dev/null || true)"
    if [ -n "${p:-}" ] && ps -p "$p" -o command= 2>/dev/null | grep -q "$MARKER"; then
      kill "$p" 2>/dev/null || true; sleep 1; kill -9 "$p" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
  fi
  pkill -f "$MARKER" 2>/dev/null || true   # belt-and-suspenders, marker is unique to this script
}
trap kill_diag EXIT

say "== [1/8] Preflight =="
[ -f "$DAEMON" ] || { say "FATAL: daemon dist missing ($DAEMON) — run npm run build"; exit 1; }
[ -x "$NODE" ] || { say "FATAL: node not found"; exit 1; }
LIVE_ABS="$(cd "$LIVE_DB_DIR" && pwd)"
[ "$DIAG_DB_DIR" != "$LIVE_ABS" ] || { say "FATAL: clone dir == live dir"; exit 1; }
grep -q "max-event-loop-lag" "$MCP/dist/handlers/memory-index.js" || { say "FATAL: dist lacks instrumentation — stale build"; exit 1; }
say "node=$NODE  live_db=$LIVE_ABS  clone=$DIAG_DB_DIR  sock=$DIAG_SOCK"

say "== [2/8] Tear down any prior diagnostic, reset clone dir =="
kill_diag
rm -rf "$DIAG_DB_DIR"; mkdir -p "$DIAG_DB_DIR/vectors"
rm -rf "$DIAG_SOCK"; mkdir -p "$DIAG_SOCK"; chmod 700 "$DIAG_SOCK"

say "== [3/8] Consistent snapshot of live DB + active vectors (sqlite .backup; read-only on live) =="
sqlite3 "$LIVE_DB_DIR/context-index.sqlite" ".backup '$DIAG_DB_DIR/context-index.sqlite'" \
  || { say "FATAL: main DB backup failed"; exit 1; }
for v in "$LIVE_DB_DIR"/vectors/context-vectors__*.sqlite; do
  [ -e "$v" ] || continue
  case "$v" in *.staging|*.quarantined*) continue;; esac
  base="$(basename "$v")"
  sqlite3 "$v" ".backup '$DIAG_DB_DIR/vectors/$base'" \
    && say "  cloned vectors: $base" \
    || say "  WARN: vectors backup failed for $base (continuing)"
done
say "clone footprint: $(du -sh "$DIAG_DB_DIR" 2>/dev/null | cut -f1)"

say "== [4/8] Launch BARE diagnostic daemon (isolated DB + socket; stderr -> log) =="
: > "$LOG"
SPEC_KIT_DB_DIR="$DIAG_DB_DIR" \
SPECKIT_IPC_SOCKET_DIR="$DIAG_SOCK" \
  "$NODE" --max-old-space-size=4096 "$DAEMON" "$MARKER" </dev/null >>"$LOG" 2>&1 &
DPID=$!
echo "$DPID" > "$PIDFILE"
say "daemon pid=$DPID (marker=$MARKER)"

say "== [5/8] Wait for IPC socket + boot to settle =="
for i in $(seq 1 60); do
  [ -S "$DIAG_SOCK/daemon-ipc.sock" ] && break
  ps -p "$DPID" >/dev/null 2>&1 || { say "FATAL: daemon exited during boot — tail of log:"; tail -30 "$LOG" | tee -a "$PROGRESS"; exit 1; }
  sleep 1
done
[ -S "$DIAG_SOCK/daemon-ipc.sock" ] || { say "FATAL: socket never appeared"; tail -30 "$LOG" | tee -a "$PROGRESS"; exit 1; }
# Confirm the daemon opened the CLONE, not the live DB.
if grep -q "$LIVE_ABS/context-index.sqlite" "$LOG"; then say "FATAL: daemon referenced LIVE db path — aborting"; exit 1; fi
sleep 5  # let the incremental startupScan settle before the instrumented scan

cliq() { SPECKIT_IPC_SOCKET_DIR="$DIAG_SOCK" SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 "$NODE" "$CLI" "$@" 2>>"$PROGRESS"; }

say "== [6/8] Trigger force + background index scan (instrumented path) =="
SCAN_OUT="$(cliq memory_index_scan --json '{"force":true,"background":true}' --format json --timeout-ms 30000)"
say "scan trigger response: $(echo "$SCAN_OUT" | head -c 400)"
JOB="$(echo "$SCAN_OUT" | grep -oE '"jobId"[^,}]*' | head -1 | grep -oE '[A-Za-z0-9_-]+$')"
say "jobId=${JOB:-<none>}"

say "== [7/8] Poll scan to completion (cap 20 min) =="
DONE=0
for i in $(seq 1 240); do
  ps -p "$DPID" >/dev/null 2>&1 || { say "FATAL: daemon died mid-scan — tail:"; tail -40 "$LOG" | tee -a "$PROGRESS"; exit 1; }
  # Primary completion signal: the scan's finally-block lag summary line. It fires
  # when runIndexScan returns (all phases done), BEFORE the deferred embedding queue
  # drains — so we capture the lag answer without forcing a full ollama re-embed.
  if grep -q "\[memory-index-scan\] max-event-loop-lag" "$LOG"; then
    say "scan phases complete (max-event-loop-lag line present in log)"; DONE=1; break
  fi
  ST="$(cliq memory_index_scan_status ${JOB:+--json "{\"jobId\":\"$JOB\"}"} --format json --timeout-ms 15000)"
  STATE="$(echo "$ST" | grep -oE '"(state|status)"[^,}]*' | head -1)"
  if echo "$ST" | grep -qiE '"(state|status)"\s*:\s*"(completed|complete|done|success|idle|cancelled|failed|error)"'; then
    say "scan terminal: $STATE"; DONE=1; break
  fi
  [ $((i % 6)) -eq 0 ] && say "  ...polling ($((i*5))s) $STATE"
  sleep 5
done
[ "$DONE" = 1 ] || say "WARN: scan poll cap reached; reading whatever instrumentation exists"
sleep 2

say "== [8/8] RESULTS =="
echo "----- INSTRUMENTATION (from $LOG) -----" | tee -a "$PROGRESS"
grep -E "\[memory-index-scan\] (phase=|event-loop blocked|max-event-loop-lag)" "$LOG" | tee -a "$PROGRESS" || say "(no instrumentation lines found)"
echo "----- DAEMON PID STABILITY -----" | tee -a "$PROGRESS"
if ps -p "$DPID" >/dev/null 2>&1; then say "daemon pid $DPID UNCHANGED across scan (PASS)"; else say "daemon pid $DPID NO LONGER ALIVE (investigate)"; fi
echo "----- vec == fts (memory_health.consistency) -----" | tee -a "$PROGRESS"
HEALTH="$(cliq memory_health --format json --timeout-ms 30000)"
echo "$HEALTH" | grep -oE '"(rowsTotal|ftsRowsTotal|vecRowsTotal|mismatchedIds)"[^]}]*' | tee -a "$PROGRESS" || say "(could not parse consistency)"

say "== DONE.  Clone left at $DIAG_DB_DIR (du $(du -sh "$DIAG_DB_DIR" 2>/dev/null | cut -f1)); daemon will be killed on exit. =="
