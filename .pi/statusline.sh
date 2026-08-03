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

printf "%s%s%s%s%s%s%s" "$branch_part" "$model_part" "$five_part" "$week_part" "$ctx_part" "$used_part" "$cost_part"
