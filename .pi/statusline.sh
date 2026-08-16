#!/usr/bin/env bash
# Status line for pi (pi-statusline extension) — branch, model, rate limits, context usage, cost
set -euo pipefail

input=$(cat)

# --- Git branch ---
branch=$(git -C "$(echo "$input" | jq -r '.workspace.current_dir')" \
  --no-optional-locks branch --show-current 2>/dev/null || true)
if [ -n "$branch" ]; then
  branch_part=" $branch"
else
  branch_part=""
fi

# --- Model name ---
model_name=$(echo "$input" | jq -r '.model.display_name // empty')
if [ -n "$model_name" ]; then
  model_part=" | $model_name"
else
  model_part=""
fi

# --- 5-hour session limit ---
five_pct=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
if [ -n "$five_pct" ]; then
  five_fmt=$(printf "%.0f" "$five_pct")
  five_part=" | 5h: ${five_fmt}%"
else
  five_part=""
fi

# --- 7-day weekly limit ---
week_pct=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')
if [ -n "$week_pct" ]; then
  week_fmt=$(printf "%.0f" "$week_pct")
  week_part=" | 7d: ${week_fmt}%"
else
  week_part=""
fi

# --- Context window remaining ---
ctx_rem=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty')
if [ -n "$ctx_rem" ]; then
  ctx_fmt=$(printf "%.0f" "$ctx_rem")
  ctx_part=" | ctx: ${ctx_fmt}% left"
else
  ctx_part=""
fi

# --- Context used tokens (current usage, session total as fallback) ---
used_tok=$(echo "$input" | jq -r '([.context_window.current_usage.input_tokens, .context_window.current_usage.cache_read_input_tokens, .context_window.current_usage.cache_creation_input_tokens] | map(select(. != null)) | add) // .context_window.total_input_tokens // empty')
if [ -n "$used_tok" ]; then
  used_fmt=$(awk -v n="$used_tok" 'BEGIN { if (n >= 1000) printf "%.1fk", n / 1000; else printf "%d", n }')
  used_part=" | used: ${used_fmt} tok"
else
  used_part=""
fi

# --- Session cost ---
cost_usd=$(echo "$input" | jq -r '.cost.total_cost_usd // empty')
if [ -n "$cost_usd" ]; then
  cost_fmt=$(printf '%.2f' "$cost_usd")
  cost_part=" | \$${cost_fmt}"
else
  cost_part=""
fi

# --- DeepSeek peak/off-peak phase ---
# DeepSeek's pricing schedule (baked into @juanmackie/pi-deepseek-peak and the
# docs at api-docs.deepseek.com): PEAK 01:00-04:00 UTC and 06:00-10:00 UTC, 2x
# off-peak; the schedule becomes effective 2026-08-16 16:00 UTC. Before the
# cutover the phase is a projection and the countdown targets LIVE.
# DS_TEST_EPOCH overrides the clock for boundary testing.
utc_epoch() {
  date -u -j -f "%Y-%m-%d %H:%M:%S" "$1" +%s 2>/dev/null \
    || date -u -d "$1" +%s 2>/dev/null \
    || echo 0
}
fmt_dur() {
  local m=$1
  if [ "$m" -ge 60 ]; then printf "%dh %02dm" $((m / 60)) $((m % 60)); else printf "%dm" "$m"; fi
}

now_epoch=$(date -u +%s)
[ -n "${DS_TEST_EPOCH:-}" ] && now_epoch="$DS_TEST_EPOCH"
cutover_epoch=$(utc_epoch "2026-08-16 16:00:00")
min_of_day=$(( (now_epoch / 60) % 1440 ))

phase="OFF-PEAK"
if { [ "$min_of_day" -ge 60 ] && [ "$min_of_day" -lt 240 ]; } \
   || { [ "$min_of_day" -ge 360 ] && [ "$min_of_day" -lt 600 ]; }; then
  phase="PEAK"
fi

next_boundary=1440
for b in 60 240 360 600; do
  if [ "$b" -gt "$min_of_day" ] && [ "$b" -lt "$next_boundary" ]; then
    next_boundary=$b
  fi
  if [ "$next_boundary" -eq 1440 ]; then
    next_boundary=$((60 + 1440))
  fi
done
rem_min=$((next_boundary - min_of_day))

if [ "$now_epoch" -lt "$cutover_epoch" ]; then
  ds_part=" | DS ● $phase · PRE-CUTOVER · $(fmt_dur $(((cutover_epoch - now_epoch) / 60))) → LIVE"
else
  next_phase="PEAK"; [ "$phase" = "PEAK" ] && next_phase="OFF-PEAK"
  ds_part=" | DS ● $phase · $(fmt_dur "$rem_min") → $next_phase"
fi

printf "%s%s%s%s%s%s%s%s" "$branch_part" "$model_part" "$five_part" "$week_part" "$ctx_part" "$used_part" "$cost_part" "$ds_part"
