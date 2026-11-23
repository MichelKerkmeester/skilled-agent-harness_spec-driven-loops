---
title: "Commit-triggered requests"
description: "Queues one run request per commit for each git-hook bot in a repository that opts in, without ever running a bot from the hook."
trigger_phrases:
  - "commit-triggered requests"
  - "git-hook bot trigger"
  - "post-commit bots enqueue"
  - "gitHookTrigger"
version: 1.0.0.0
---

# Commit-triggered requests (post-commit hook)

## 1. OVERVIEW

Queues one run request per commit for each git-hook bot in a repository that opts in, without ever running a bot from the hook.

The post-commit hook fires in every repository on the machine, so its bots leg is opt-in, cheap to skip and unable to block a commit. It only writes requests, so a commit never waits on an agent. The drain runs them later.

---

## 2. HOW IT WORKS

The leg runs only when `bots/config.json` exists and sets `gitHookTrigger` to true, no `SKILLED_BOT_RUN_ID` run marker is set, the trusted source root holds the bots CLI and `node` is present. The file test comes first, so a repository without bots starts no process. The `bots-enqueue` hook flag, set off by `SYSTEM_BOTS_ENQUEUE_DISABLED=1`, switches the leg off. A commit made inside a bot run is skipped, so a bot cannot enqueue itself, and the CLI is reached only through the trusted source root and never through `PATH`.

The leg calls `bots enqueue --git-commit <sha>`. The CLI rereads the config and stays the authority on whether anything is queued. It finds every bot whose definition parses, whose folder matches its id and whose trigger kind is `git-hook`, and writes one `run` request per bot with the source `git-commit` and the commit sha as the event id. Recommitting the same sha is therefore a duplicate. Every failure in the leg is swallowed, and the hook always exits 0.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/scripts/git-hooks/post-commit` | Script | The opt-in bots enqueue leg of the post-commit hook |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Shared | Finds commit-triggered bots and enqueues one request each |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Shared | The `git-commit` source and key derivation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh` | Automated test | Commits through the real hook in temp repositories and counts what lands in the inbox |
| `.skilled/scripts/git-hooks/README.md` | Reference | The hook set and the bots leg's place in it |

---

## 4. SOURCE METADATA

- Group: Requests
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `requests/commit-triggered-requests.md`

Related references:
- [request-queue.md](request-queue.md) - where the commit requests land
- [queue-drain.md](queue-drain.md) - the pass that runs them
