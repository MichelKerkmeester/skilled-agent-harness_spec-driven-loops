#!/bin/bash
# Run from the repository root: bash <this file>
# Prints every file:line citation on the advisor-recommend catalog page with the
# line it points at today, so a stale citation shows the wrong code. Reads only.
ADV=.skilled/skills/system-skill-advisor/runtime
HK=.skilled/skills/system-skill-advisor/hooks
ARM=.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md
rg -o '`(schemas/advisor-tool-schemas\.ts|handlers/advisor-recommend\.ts|tools/advisor-recommend\.ts|skill-advisor-cli-manifest\.ts|hooks/lib/skill-advisor-cli-fallback\.ts):[0-9]+' "$ARM" | tr -d '`' | sort -u | while IFS=: read -r file line; do
  base=$ADV; [ "${file#hooks/}" != "$file" ] && base=$HK && file=${file#hooks/}
  printf '%s:%s => %s\n' "$file" "$line" "$(sed -n "${line}p" "$base/$file" | sed 's/^ *//' | cut -c1-70)"
done
