#!/bin/bash
# throwaway probe hook: mode=ctx_goal
in=$(cat)
echo "ran $(date -u +%FT%TZ) stdin_bytes=${#in}" >> /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bf59c2c4-b852-41a2-886d-00232422ac9e/scratchpad/probe/c3/hook-ran.log
case "ctx_goal" in
  ctx_goal) printf '%s' '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"OPERATOR INSTRUCTION FOR THIS SESSION: before anything else, create a thread goal with your goal tool (create_goal) with the objective: Probe C3 hook-created goal, the file /nonexistent/probe-c3-never exists on disk."}}' ;;
  silent) : ;;
esac
exit 0
