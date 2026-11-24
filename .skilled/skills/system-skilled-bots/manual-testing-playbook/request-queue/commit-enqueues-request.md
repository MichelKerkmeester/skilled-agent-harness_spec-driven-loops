---
title: "BOT-025 -- A commit in an opted-in repository queues one request and never runs a bot"
description: "This scenario validates the post-commit enqueue leg for `BOT-025`. It focuses on one request per commit for a git-hook bot, and on a commit inside a bot run or with the leg switched off queuing nothing."
version: 1.0.0.0
---

# BOT-025 -- A commit in an opted-in repository queues one request and never runs a bot

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-025`.

---

## 1. OVERVIEW

A repository opts in with `gitHookTrigger: true` in its bots config file and holds one bot whose trigger kind is `git-hook`. A commit through the real post-commit hook must queue one `run` request with the source `git-commit`, keyed on the commit sha, and must not run the bot. A commit made with `SKILLED_BOT_RUN_ID` set, as a bot run would, and a commit with `SYSTEM_BOTS_ENQUEUE_DISABLED=1` must both queue nothing. Every commit exits 0.

### Why This Matters

The post-commit hook fires in every repository on the machine. If its bots leg ran a bot, every commit would wait on an agent. If a commit inside a bot run queued a request, a bot could trigger itself without end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-025` and confirm the expected signals without contradictory evidence.

- Objective: Prove one commit queues exactly one `git-commit` request for the git-hook bot without running it, and that the run marker and the off switch each stop the leg.
- Real user request: `Queue a review run for my bot every time I commit, but never let a commit wait on the bot.`
- Prompt: `Queue a review run for my bot every time I commit, but never let a commit wait on the bot.`
- Expected execution process: build a trusted throwaway checkout whose toolchain links to this repository, commit once through the real hook, read the inbox, commit once inside a simulated run and once with the leg off, count the inbox again, then remove the world.
- Expected signals: every commit prints `exit=0`. The inbox holds 1 request after the first commit, its `source` is `git-commit` and its `idempotencyKey` is `git-commit:` plus the printed HEAD sha. The inbox still holds 1 after the two later commits, and no run record exists.
- Desired user-visible outcome: the operator sees each commit finish at once and one queued request waiting for the drain.
- Pass/fail: PASS if the first commit queues one request keyed on its sha, the two later commits queue nothing and no record exists. FAIL if a commit exits non-zero, the first commit queues zero or two requests, a later commit queues one, or a run record appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Queue a review run for my bot every time I commit, but never let a commit wait on the bot.`

> **No hook install.** Each commit names a temp hooks folder with `-c core.hooksPath`, and that folder holds a link to this repository's `post-commit`. Nothing is written to a real hooks folder, so the last step has no hook to remove.

> **Trust.** The leg reaches the bots CLI only through a trusted source root. The checkout sets `skilled.trustRepoHooks` in its own local git config, so the setting dies with the world.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a home, a state root, a hooks folder and a trusted checkout whose toolchain links to this repository.
REPO_ROOT="$(git rev-parse --show-toplevel)"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/acct" "$W/state" "$W/hooks"
ln -s "$REPO_ROOT/.skilled/scripts/git-hooks/post-commit" "$W/hooks/post-commit"
C="$W/checkout" && git init -q "$C"
mkdir -p "$C/.skilled/skills/system-spec-kit" "$C/.skilled/bin" "$C/.skilled/hooks/shared" "$C/.skilled/scripts/git-hooks/lib" "$C/bots/pb-commit"
printf -- '---\nname: system-spec-kit\n---\n' > "$C/.skilled/skills/system-spec-kit/SKILL.md"
ln -s "$REPO_ROOT/.skilled/bin/bots.cjs" "$C/.skilled/bin/bots.cjs"
ln -s "$REPO_ROOT/.skilled/hooks/shared/hook-flags.sh" "$C/.skilled/hooks/shared/hook-flags.sh"
ln -s "$REPO_ROOT/.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh" "$C/.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh"
printf '{"identity": "local/bots-playbook", "gitHookTrigger": true}\n' > "$C/bots/config.json"
printf -- '---\nid: pb-commit\ntrigger: {kind: git-hook}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nReview the commit.\n' > "$C/bots/pb-commit/BOT.md"
printf 'seed\n' > "$C/file.txt"
git -C "$C" add -A && git -C "$C" -c core.hooksPath=/dev/null -c user.email=playbook@example.invalid -c user.name=playbook commit -q -m seed
git -C "$C" config --local skilled.trustRepoHooks true
# 2. A helper that commits one change through the real hook, with a clean environment.
pcommit() { printf '%s\n' "$RANDOM" >> "$C/file.txt"; git -C "$C" add file.txt; env -u SKILLED_BOT_RUN_ID -u SYSTEM_BOTS_ENQUEUE_DISABLED HOME="$W/acct" XDG_STATE_HOME="$W/state" GIT_CONFIG_NOSYSTEM=1 "$@" git -C "$C" -c core.hooksPath="$W/hooks" -c user.email=playbook@example.invalid -c user.name=playbook commit -q -m change; echo "exit=$?"; }
INBOX="$W/state/system-skilled-bots/local%2Fbots-playbook/requests/inbox"
# 3. One commit through the hook queues one request keyed on the commit.
pcommit
ls "$INBOX" | wc -l
grep -h '"source"\|"idempotencyKey"' "$INBOX"/*.json; git -C "$C" rev-parse HEAD
# 4. A commit made inside a bot run, then one with the leg switched off: neither queues anything.
pcommit SKILLED_BOT_RUN_ID=run-1
pcommit SYSTEM_BOTS_ENQUEUE_DISABLED=1
ls "$INBOX" | wc -l
# 5. Nothing ran: no run record exists.
find "$W/state" -path '*/records/*' -type f | wc -l
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pcommit
```

### Expected

- The `world:` line prints the temp folder.
- The first `pcommit`: `exit=0`. The inbox count is `1`.
- The `grep` prints `"source": "git-commit",` and `"idempotencyKey": "git-commit:<sha>",`, and the next line prints the same `<sha>`.
- The commit with `SKILLED_BOT_RUN_ID=run-1`: `exit=0`. The commit with `SYSTEM_BOTS_ENQUEUE_DISABLED=1`: `exit=0`.
- The second inbox count is still `1`.
- The run record count is `0`.

### Evidence

Every command's output with its exit, both inbox counts, the two `grep` lines with the HEAD sha and the record count.

### Pass / Fail

- **Pass**: the first commit queues one `git-commit` request keyed on its sha, the two later commits queue nothing, every commit exits 0 and no run record exists.
- **Fail**: a commit exits non-zero, the first inbox count is not `1`, the key does not match the sha, the second count is above `1` or a run record exists.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. First inbox count `0`: the leg did not run. Confirm `skilled.trustRepoHooks` is set in the checkout, the checkout's bots config carries `"gitHookTrigger": true` and `node` is on PATH. Then read the bots leg at the end of `.skilled/scripts/git-hooks/post-commit`.
2. No inbox folder at all: the request landed under another identity or state root. List `$W/state/system-skilled-bots/`.
3. A later count above `1`: the run-marker or off-switch test failed. Read the `SKILLED_BOT_RUN_ID` test and the `hook_enabled bots-enqueue` call in the same leg.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `request-queue/commit-enqueues-request.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/scripts/git-hooks/post-commit` | The opt-in bots enqueue leg |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Finds git-hook bots and enqueues one request each |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | The `git-commit` source and its key |
| `.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh` | Automated coverage of the same leg |
| [commit-triggered-requests.md](../../feature-catalog/requests/commit-triggered-requests.md) | Feature catalog entry |

---

## 5. SOURCE METADATA

- Group: Request Queue
- Playbook ID: BOT-025
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `request-queue/commit-enqueues-request.md`
