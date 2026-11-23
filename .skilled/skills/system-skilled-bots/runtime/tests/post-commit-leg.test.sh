#!/usr/bin/env bash
# Test harness for the bots enqueue leg of the post-commit hook.
#
# WHY: the hook fires in every repository on the machine, so the leg must do nothing
# unless a trusted repository opts in, must never fail or block a commit, and must never
# run a bot. Each row commits through the real hook in a temp repository and counts what
# landed in the watched folder of a temp state root. Nothing here touches a real
# repository, a real hooks folder or the real state root.
#
# Exit 0 = all pass, 1 = any failure.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$(cd "$HERE/../../../.." && pwd)"
HOOK="$SOURCE/scripts/git-hooks/post-commit"
BOTS_CLI="$SOURCE/bin/bots.cjs"
NODE_BIN="$(command -v node)"
GIT_BIN="$(command -v git)"

pass=0; fail=0
chk() { # <actual> <expected> <name>
  if [[ "$1" == "$2" ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (got '$1' want '$2')"; fail=$((fail + 1)); fi
}

T="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/post-commit-leg-test.XXXXXX")" && pwd -P)"
trap 'rm -rf "$T"' EXIT

# A clean environment: temp HOME and state root, no system git config, no switch or run marker inherited.
export HOME="$T/home" GIT_CONFIG_NOSYSTEM=1 XDG_STATE_HOME="$T/state"
mkdir -p "$HOME" "$XDG_STATE_HOME"
unset GITHUB_REPOSITORY SKILLED_BOT_RUN_ID SYSTEM_BOTS_ENQUEUE_DISABLED SYSTEM_HOOKS_DISABLED MK_HOOKS_DISABLED \
  SPECKIT_AUTOSYNC SPECKIT_LIVE_BRANCH HOOK_FLAGS_CONFIG GIT_DIR GIT_WORK_TREE

# The hook is reached only through this temp hooks folder.
mkdir -p "$T/hooks"
ln -s "$HOOK" "$T/hooks/post-commit"

# A node shim that logs every start, and a bots shim that must never be called.
mkdir -p "$T/shim"
printf '#!/bin/sh\necho "$*" >> "%s"\nexec "%s" "$@"\n' "$T/node-starts.log" "$NODE_BIN" > "$T/shim/node"
printf '#!/bin/sh\necho called >> "%s"\n' "$T/bots-shim.log" > "$T/shim/bots"
chmod +x "$T/shim/node" "$T/shim/bots"
BASE_PATH="$T/shim:$(dirname "$GIT_BIN"):/usr/bin:/bin"
export PATH="$BASE_PATH"

IDENTITY_KEY='acme%2Fhooked'
QUEUE="$XDG_STATE_HOME/system-skilled-bots/$IDENTITY_KEY/requests"

toolchain() { # toolchain <repo>: a source tree whose CLI and resolver are the real ones
  mkdir -p "$1/.skilled/skills/system-spec-kit" "$1/.skilled/bin" "$1/.skilled/hooks/shared" "$1/.skilled/scripts/git-hooks/lib"
  printf -- '---\nname: system-spec-kit\n---\n' > "$1/.skilled/skills/system-spec-kit/SKILL.md"
  ln -s "$BOTS_CLI" "$1/.skilled/bin/bots.cjs"
  ln -s "$SOURCE/hooks/shared/hook-flags.sh" "$1/.skilled/hooks/shared/hook-flags.sh"
  ln -s "$SOURCE/scripts/git-hooks/lib/autostash-orphan-guard.sh" "$1/.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh"
}

commit_bot() { # commit_bot <repo>: one bot with a git-hook trigger
  mkdir -p "$1/bots/on-commit"
  printf -- '---\nid: on-commit\ntrigger: {kind: git-hook}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nReview the commit.\n' \
    > "$1/bots/on-commit/BOT.md"
}

fixture() { # fixture <repo> [config json]: a trusted repository with the toolchain and, when given, a bots config
  git init -q "$1"
  toolchain "$1"
  commit_bot "$1"
  if [[ -n "${2:-}" ]]; then printf '%s\n' "$2" > "$1/bots/config.json"; fi
  printf 'seed\n' > "$1/file.txt"
  git -C "$1" add -A
  git -C "$1" -c core.hooksPath=/dev/null -c user.email=t@example.com -c user.name=test commit -q -m seed
  git -C "$1" config --local skilled.trustRepoHooks true
}

commit() { # commit <repo> [VAR=value ...]: commit one change through the hook; prints the commit's exit status
  local repo="$1"; shift
  printf '%s\n' "$RANDOM" >> "$repo/file.txt"
  git -C "$repo" add file.txt
  env "$@" git -C "$repo" -c core.hooksPath="$T/hooks" -c user.email=t@example.com -c user.name=test \
    commit -q -m change 2>"$T/last-stderr"
  echo $?
}

inbox_count() { ls -A "$QUEUE/inbox" 2>/dev/null | wc -l | tr -d ' '; }
node_starts() { if [[ -f "$T/node-starts.log" ]]; then wc -l < "$T/node-starts.log" | tr -d ' '; else echo 0; fi; }

OPTED_IN='{"identity": "acme/hooked", "gitHookTrigger": true}'

# ── 1. trusted, opted in, outside a run, node present: one request per commit ──
fixture "$T/trusted" "$OPTED_IN"
chk "$(commit "$T/trusted")" "0" "a commit in an opted-in trusted repository exits 0"
chk "$(inbox_count)" "1" "it enqueues one request"
chk "$(grep -c '"source": "git-commit"' "$QUEUE/inbox/"*.json 2>/dev/null)" "1" "the request names the git-commit source"
head_sha="$(git -C "$T/trusted" rev-parse HEAD)"
chk "$(grep -c "\"idempotencyKey\": \"git-commit:$head_sha\"" "$QUEUE/inbox/"*.json 2>/dev/null)" "1" "the request keys on the commit SHA"

# ── 2. a linked worktree of the same repository: the leg is not limited to the primary checkout ──
git -C "$T/trusted" worktree add -q "$T/trusted-wt" -b wt-branch 2>/dev/null
chk "$(commit "$T/trusted-wt")" "0" "a commit in a linked worktree exits 0"
chk "$(inbox_count)" "2" "the linked worktree's commit enqueues one more request"

# ── 3. a commit made inside a bot run enqueues nothing ──
chk "$(commit "$T/trusted" SKILLED_BOT_RUN_ID=run-1)" "0" "a commit inside a bot run exits 0"
chk "$(inbox_count)" "2" "a commit inside a bot run enqueues nothing"

# ── 4. the off switch stops the leg ──
chk "$(commit "$T/trusted" SYSTEM_BOTS_ENQUEUE_DISABLED=1)" "0" "a commit with the leg switched off exits 0"
chk "$(inbox_count)" "2" "the off switch enqueues nothing"

# ── 5. node missing from PATH ──
mkdir -p "$T/nonode"
ln -s "$GIT_BIN" "$T/nonode/git"
if PATH="$T/nonode:/usr/bin:/bin" command -v node >/dev/null 2>&1; then
  echo "SKIP: node is in /usr/bin or /bin, so the no-node row cannot be built here"
else
  chk "$(commit "$T/trusted" PATH="$T/nonode:/usr/bin:/bin")" "0" "a commit with no node on PATH exits 0"
  chk "$(inbox_count)" "2" "with no node on PATH nothing is enqueued"
fi

# ── 6. opted out: gitHookTrigger false: the text check stops the leg before node ──
fixture "$T/opted-out" '{"identity": "acme/hooked", "gitHookTrigger": false}'
before_nodes="$(node_starts)"
chk "$(commit "$T/opted-out")" "0" "a commit in an opted-out repository exits 0"
chk "$(node_starts)" "$before_nodes" "an opted-out repository starts no node process"
chk "$(inbox_count)" "2" "an opted-out repository enqueues nothing"

# ── 7. no bots/config.json: only a file test runs, no node starts, nothing new on stderr ──
fixture "$T/no-config"
before_nodes="$(node_starts)"
chk "$(commit "$T/no-config")" "0" "a commit in a repository with no bots config exits 0"
chk "$(node_starts)" "$before_nodes" "a repository with no bots config starts no node process"
chk "$(wc -c < "$T/last-stderr" | tr -d ' ')" "0" "a repository with no bots config prints nothing on stderr"
chk "$(inbox_count)" "2" "a repository with no bots config enqueues nothing"

# ── 8. an untrusted clone with a planted CLI and a bots shim on PATH enqueues nothing ──
git clone -q "$T/trusted" "$T/untrusted"
rm "$T/untrusted/.skilled/bin/bots.cjs"
printf '#!/usr/bin/env node\nrequire("node:fs").writeFileSync("%s", "ran");\n' "$T/planted-ran" > "$T/untrusted/.skilled/bin/bots.cjs"
chk "$(git -C "$T/untrusted" config --local --bool skilled.trustRepoHooks 2>/dev/null || echo unset)" "unset" "the clone does not inherit the trust setting"
chk "$(commit "$T/untrusted")" "0" "a commit in an untrusted clone exits 0"
chk "$(inbox_count)" "2" "an untrusted clone enqueues nothing"
chk "$([[ -e "$T/planted-ran" ]] && echo ran || echo blocked)" "blocked" "an untrusted clone's planted CLI does not run"
chk "$([[ -e "$T/bots-shim.log" ]] && echo called || echo unused)" "unused" "a bots command on PATH is never called"

# ── 9. opted in with no identity and no remote: the commit still succeeds and nothing is written ──
export XDG_STATE_HOME="$T/state-unknown"
mkdir -p "$XDG_STATE_HOME"
fixture "$T/no-identity" '{"gitHookTrigger": true}'
chk "$(commit "$T/no-identity")" "0" "a commit in an opted-in repository with no identity exits 0"
chk "$(find "$XDG_STATE_HOME" -type f | wc -l | tr -d ' ')" "0" "an unknown identity writes no file under the state root"
export XDG_STATE_HOME="$T/state"

# ── 10. no row started a bot ──
chk "$(find "$T/state" -path '*/records/*' -type f | wc -l | tr -d ' ')" "0" "no row wrote a run record"
chk "$(find "$T/state" -path '*/leases/*' -type f | wc -l | tr -d ' ')" "0" "no row took a bot lease"

echo
echo "post-commit-leg: $pass passed, $fail failed"
[[ "$fail" -eq 0 ]]
