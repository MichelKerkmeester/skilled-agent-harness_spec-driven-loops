#!/bin/bash
# Counts --fast in a plain and a trusted help run for the primary and worktree layouts.
export PATH=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$HOME/.local/bin:/usr/bin:/bin
for layout in "primary:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/159-pi-fast-mode-trusted-flag" "worktree:/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/g021/q"; do name=${layout%%:*}; dir=${layout#*:}
  for mode in plain trusted untrusted; do flag=""; [ $mode = trusted ] && flag="-a"; [ $mode = untrusted ] && flag="-na"
    out=$(cd "$dir" && PI_CODING_AGENT_DIR=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/g021/ag pi $flag --offline --help 2>&1); rc=$?
    echo "$name $mode exit=$rc fast=$(printf '%s\n' "$out" | grep -c -- '^  --fast ') conflict=$(printf '%s\n' "$out" | grep -ci 'conflicts with')"
  done; done
