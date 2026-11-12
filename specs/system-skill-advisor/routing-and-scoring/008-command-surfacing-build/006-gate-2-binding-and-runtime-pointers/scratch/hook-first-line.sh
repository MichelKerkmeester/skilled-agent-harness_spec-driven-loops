#!/usr/bin/env bash
# Runs the Claude prompt hook on one prompt and prints the first line of the injected brief.
printf '{"prompt":"%s","session_id":"plan-probe-%s","cwd":"%s","hook_event_name":"UserPromptSubmit"}' "$1" "$RANDOM" "$PWD" \
  | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null \
  | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d}).on("end",()=>{console.log(JSON.parse(s).hookSpecificOutput.additionalContext.split("\n")[0])})'
