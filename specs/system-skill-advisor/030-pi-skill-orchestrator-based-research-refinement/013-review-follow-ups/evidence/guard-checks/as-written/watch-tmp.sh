#!/bin/bash
# Samples the sandbox folders every 2 seconds for the given number of seconds.
end=$(( $(date +%s) + $1 ))
while [ "$(date +%s)" -lt "$end" ]; do
  echo "$(date -u +%H:%M:%SZ) $(ls -d /tmp/cp003.* /tmp/cp004.* /tmp/cli-playbook.* 2>/dev/null | tr '\n' ' ')"
  sleep 2
done
