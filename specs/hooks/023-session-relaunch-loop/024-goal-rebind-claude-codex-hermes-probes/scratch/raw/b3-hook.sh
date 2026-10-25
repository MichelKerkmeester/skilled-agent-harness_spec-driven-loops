#!/bin/bash
# throwaway probe hook: mode=silent
in=$(cat)
echo "ran $(date -u +%FT%TZ) stdin_bytes=${#in} source=$(printf '%s' "$in" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("source"))' 2>/dev/null)" >> /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bf59c2c4-b852-41a2-886d-00232422ac9e/scratchpad/probe/b3/hook-ran.log
case "silent" in
  initial_goal) printf '%s' '{"hookSpecificOutput":{"hookEventName":"SessionStart","initialUserMessage":"/goal Probe B1 via initialUserMessage: the file /nonexistent/probe-b1-never exists on disk"}}' ;;
  context_goal) printf '%s' '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"/goal Probe B2 via additionalContext: the file /nonexistent/probe-b2-never exists on disk"}}' ;;
  stdout_goal) echo '/goal Probe B5 via plain stdout: the file /nonexistent/probe-b5-never exists on disk' ;;
  initial_plain) printf '%s' '{"hookSpecificOutput":{"hookEventName":"SessionStart","initialUserMessage":"Reply with exactly the word PLAINMSG-RECEIVED and nothing else."}}' ;;
  silent) : ;;
esac
exit 0
