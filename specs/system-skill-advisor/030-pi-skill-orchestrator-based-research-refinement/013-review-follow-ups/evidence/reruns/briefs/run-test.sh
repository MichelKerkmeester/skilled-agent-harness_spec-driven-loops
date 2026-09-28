#!/usr/bin/env bash
# Runs one manual-test dispatch: $1 = cli (pi|opencode|devin|cursor|codex), $2 = scenario id or "probe".
# Raw output goes to $RUN_OUT_DIR (default ./out), and one row per run is appended to ../ledger.tsv.
set -uo pipefail
cli="$1"; id="$2"
d="$(cd "$(dirname "$0")" && pwd)"
repo=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cd "$repo" || exit 1
outdir="${RUN_OUT_DIR:-$d/out}"
mkdir -p "$outdir"
out="$outdir/$cli-$id"
ledger="$d/../ledger.tsv"
case "$cli" in
  pi|opencode|devin|codex) bin="$cli" ;;
  cursor) bin=cursor-agent ;;
  *) echo "unknown cli $cli" >&2; exit 2 ;;
esac
start_iso=$(date -u +%Y-%m-%dT%H:%M:%SZ)
# Each cli contract requires the binary check before every dispatch.
if ! command -v "$bin" >/dev/null 2>&1; then
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$cli" "$id" "$start_iso" "$start_iso" 127 0 >> "$ledger"
  echo "$bin not on PATH" > "$out.err"
  exit 127
fi
if [ "$id" = "probe" ]; then
  prompt="thanks"
else
  prompt="$(cat "$d/header.txt" "$d/$id.task" "$d/footer.txt" | sed "s/__CLI__/$cli/g")"
fi
printf '%s' "$prompt" > "$out.prompt"
limit=2400
start=$(date +%s)
export SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 SKILL_ADVISOR_DEBUG=1
case "$cli" in
  pi) PI_BLACKHOLE_PASSIVE=true perl -e 'alarm shift; exec @ARGV' $limit pi -p "$prompt" --model llmgateway/mimo-v2.6-pro --thinking high --mode text --offline </dev/null > "$out.out" 2> "$out.err" ;;
  opencode) perl -e 'alarm shift; exec @ARGV' $limit opencode run --model llmgateway/mimo-v2.6-pro --variant high --format json --dir "$repo" "$prompt" </dev/null > "$out.out" 2> "$out.err" ;;
  devin) perl -e 'alarm shift; exec @ARGV' $limit devin -p --model swe-2-high --permission-mode dangerous -- "$prompt" </dev/null > "$out.out" 2> "$out.err" ;;
  cursor) perl -e 'alarm shift; exec @ARGV' $limit cursor-agent -p "$prompt" --output-format text --model grok-4.7-high --auto-review --sandbox enabled </dev/null > "$out.out" 2> "$out.err" ;;
  codex) perl -e 'alarm shift; exec @ARGV' $limit codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox danger-full-access -o "$out.last" "$prompt" </dev/null > "$out.out" 2> "$out.err" ;;
esac
rc=$?
printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$cli" "$id" "$start_iso" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$rc" "$(( $(date +%s) - start ))" >> "$ledger"
