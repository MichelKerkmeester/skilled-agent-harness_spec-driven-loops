#!/bin/zsh
# Reproduction of the Gate 2 direct call under each way the skill-advisor hooks can be off.
# Run from the repository root. Each line sets one switch, or none, in an environment stripped
# of every name the shared resolver reads for the skill-advisor concern. It prints the decision
# the prompt hooks take in that same environment (hookFlagDecision in hook-flags.cjs), then the
# answer of the direct call, and whether the two agree. The hooks are off exactly when the
# resolver names a key, so a line with hook=off and direct=on is the defect.
# The two flags-file lines point HOOK_FLAGS_CONFIG at kill-switch.env beside this script. Every
# other line points it at no-such-flags.env, which does not exist, so a real hook-flags.env never
# takes part. Nothing is written: no temp file, no socket folder, no edit to the real flags file.
# The script first warms the workspace daemon with an unflagged status call, as the sibling
# reproduction of the off switch does, and prints the lease before and after, so equal lease
# lines show the daemon did not change during the run.
HERE=${0:A:h}
FILE=$HERE/kill-switch.env
NOFILE=$HERE/no-such-flags.env
HF=./.skilled/hooks/shared/hook-flags.cjs
Q='{"prompt":"write a readme for the utils folder"}'
HOOKJS="const d=require('$HF').hookFlagDecision('skill-advisor');console.log(d.enabled?'on':'off:'+d.key)"
NAMES=(${(s: :)"$(node -e "const f=require('$HF');console.log([f.MASTER_FLAG,...f.MASTER_ALIASES,f.concernFlag('skill-advisor'),...f.LEGACY_ALIASES['skill-advisor']].join(' '))")"})
UNSET=(-u HOOK_FLAGS_CONFIG)
for n in $NAMES; do UNSET+=(-u $n); done
decision() { jq -r '(.data.abstainReasons // []) | map(select(startswith("Skill advisor disabled by "))) | if length > 0 then "off:" + (.[0] | sub("^Skill advisor disabled by "; "") | sub("[.]$"; "")) else "on" end'; }
rows() { jq -c '[.data.recommendations[]? | "\(.skillId):\(.command // "-"):\(.policy // "-")"]'; }
report() { # $1 label, $2 hook decision, $3 direct call output
  local d; d=$(print -r -- "$3" | decision)
  print -r -- "$1 hook=$2 direct=$d match=$([[ $2 == $d ]] && print yes || print no) recs=$(print -r -- "$3" | rows)"
}
row() { # $1 label, then the assignments of this line
  local label=$1; shift
  local h out
  h=$(env $UNSET HOOK_FLAGS_CONFIG=$NOFILE "$@" node -e "$HOOKJS" 2>/dev/null)
  out=$(env $UNSET HOOK_FLAGS_CONFIG=$NOFILE "$@" node .skilled/bin/skill-advisor.cjs advisor_recommend --json "$Q" --format json 2>/dev/null)
  report "$label" "$h" "$out"
}
LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
env $UNSET HOOK_FLAGS_CONFIG=$NOFILE \
  node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --no-warm-only >/dev/null 2>&1
print -r -- "lease before $(jq -c '{pid, childPid, startedAt}' $LEASE)"
row "none                                  "
row "SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1   " SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1
row "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1  " SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
row "SYSTEM_SKILL_ADVISOR_DISABLED=1        " SYSTEM_SKILL_ADVISOR_DISABLED=1
row "SYSTEM_SKILL_ADVISOR_DISABLED=true     " SYSTEM_SKILL_ADVISOR_DISABLED=true
row "SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=yes " SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=yes
row "SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=on" SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=on
row "SYSTEM_HOOKS_DISABLED=1                " SYSTEM_HOOKS_DISABLED=1
row "MK_HOOKS_DISABLED=1                    " MK_HOOKS_DISABLED=1
row "SYSTEM_SKILL_ADVISOR_DISABLED=0        " SYSTEM_SKILL_ADVISOR_DISABLED=0
row "flags file                             " HOOK_FLAGS_CONFIG=$FILE
row "flags file, env SYSTEM_..._DISABLED=0  " HOOK_FLAGS_CONFIG=$FILE SYSTEM_SKILL_ADVISOR_DISABLED=0
h=$(env $UNSET HOOK_FLAGS_CONFIG=$NOFILE SYSTEM_SKILL_ADVISOR_DISABLED=1 node -e "$HOOKJS" 2>/dev/null)
out=$(printf '%s' "$Q" | env $UNSET HOOK_FLAGS_CONFIG=$NOFILE SYSTEM_SKILL_ADVISOR_DISABLED=1 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json 2>/dev/null)
report "stdin, SYSTEM_SKILL_ADVISOR_DISABLED=1 " "$h" "$out"
row "none, after the flagged lines         "
print -r -- "lease after  $(jq -c '{pid, childPid, startedAt}' $LEASE)"
