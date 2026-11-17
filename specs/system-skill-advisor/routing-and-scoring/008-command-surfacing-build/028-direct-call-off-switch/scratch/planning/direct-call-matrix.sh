#!/bin/zsh
# Reproduction of the direct call under the off switch. Run from the repository root.
# Calls the Gate 2 direct call with the switch the behaviour arm sets (OFF) and without it,
# against the warm default daemon and against two fresh socket folders, in both call orders,
# then the stdin form AGENTS.md names. Each line prints the count rule the switch probe of the
# behaviour arm uses, then the source of the answer and its rows as skill:command:policy.
# Fresh socket folders are short paths under /tmp, because the shim refuses a socket path past
# the Darwin sun_path limit and the client refuses a group- or world-writable folder. They are
# removed at the end. Nothing is written inside the repository.
# The script first warms the workspace daemon with an unflagged status call. After a rebuild a live
# daemon predates the build, and the next call that is not warm-only recycles it through a launcher
# that carries the caller's environment, so a flagged first call would start a replacement daemon
# that abstains for every caller. The lease line before and after shows whether the daemon changed.
Q='{"prompt":"write a readme for the utils folder"}'
show() { jq -c '{degraded, source, freshness: .data.freshness, abstain: .data.abstainReasons, recs: [.data.recommendations[]? | "\(.skillId):\(.command // "-"):\(.policy // "-")"]}'; }
count() { print -r -- "$1" | rg -c 'disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED' || print none; }
call() { # $1 label, $2 off|on, $3 socket folder or empty for the default one
  local out
  if [[ $2 == off ]]; then
    out=$(env ${3:+SPECKIT_IPC_SOCKET_DIR=$3} SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1 \
      node .skilled/bin/skill-advisor.cjs advisor_recommend --json "$Q" --format json 2>/dev/null)
  else
    out=$(env -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED \
      ${3:+SPECKIT_IPC_SOCKET_DIR=$3} node .skilled/bin/skill-advisor.cjs advisor_recommend --json "$Q" --format json 2>/dev/null)
  fi
  print -r -- "$1 $2 disabledCount=$(count "$out") $(print -r -- "$out" | show)"
}
LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
env -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED \
  node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --no-warm-only >/dev/null 2>&1
print -r -- "lease before $(jq -c '{pid, childPid, startedAt}' $LEASE)"
call "warm, flag first   1st" off ""
call "warm, flag first   2nd" on ""
call "warm, plain first  1st" on ""
call "warm, plain first  2nd" off ""
A=$(mktemp -d /tmp/s028.XXXXXX); chmod 700 $A
call "fresh, flag first  1st" off $A
call "fresh, flag first  2nd" on $A
B=$(mktemp -d /tmp/s028.XXXXXX); chmod 700 $B
call "fresh, plain first 1st" on $B
call "fresh, plain first 2nd" off $B
out=$(printf '%s' "$Q" | SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json 2>/dev/null)
print -r -- "warm, stdin form       off disabledCount=$(count "$out") $(print -r -- "$out" | show)"
rm -rf $A $B
print -r -- "lease after  $(jq -c '{pid, childPid, startedAt}' $LEASE)"
