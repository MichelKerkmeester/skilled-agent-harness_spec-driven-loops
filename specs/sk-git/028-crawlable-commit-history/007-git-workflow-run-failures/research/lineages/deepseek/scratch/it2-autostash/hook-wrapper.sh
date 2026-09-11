#!/usr/bin/env bash
# Instrumented post-rewrite hook: records invocation + stash visibility at hook time,
# then delegates to the real hook.
LOG="$(git rev-parse --show-toplevel)/.git/post-rewrite-invocations.log"
printf 'post-rewrite invoked args=%s\n' "$*" >> "$LOG"
printf 'stash_list_at_hook_time:\n' >> "$LOG"
git stash list >> "$LOG" 2>&1
exec bash "$(git rev-parse --show-toplevel)/.opencode/scripts/git-hooks/post-rewrite" "$@"
