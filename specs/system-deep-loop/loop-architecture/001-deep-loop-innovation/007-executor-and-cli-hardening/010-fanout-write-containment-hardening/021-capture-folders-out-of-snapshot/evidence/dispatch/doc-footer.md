
VERIFY - run these three, paste each command with its result line
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot --verbose 2>&1 | grep "TARGET_FILE" ; echo "placeholder_lines=$?"   # placeholder_lines=1 (no lines) is the pass
  grep -c '<!-- /\?ANCHOR:' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/TARGET_FILE      # must equal ANCHOR_COUNT
  grep -c -e '—' -e ';' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/TARGET_FILE          # report the count; 0 is the goal outside code spans

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
facts_not_in_evidence: <none, or each sentence you could not source>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
