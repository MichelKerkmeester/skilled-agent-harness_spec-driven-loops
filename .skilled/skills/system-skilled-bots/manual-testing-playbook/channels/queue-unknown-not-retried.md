---
title: "BOT-058 -- A queued send is written before the I/O and an unknown send is never retried"
description: "This scenario proves that every outbound message reaches the durable send queue before the I/O, that a send whose result is uncertain is recorded `unknown` and never retried, that `bots channel list` reports the queue depth, that the entry holds no token value, and that `delivery.ts` names the four channel names beside `desktop`."
version: 1.0.0.0
---

# BOT-058 -- A queued send is written before the I/O and an unknown send is never retried

This document is the execution contract for `BOT-058`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator links a Signal channel, starts a stand-in daemon that accepts the JSON-RPC request and closes the socket without answering, and sends one message. The send is written to the queue before the request leaves, the result is uncertain, and the entry reads `unknown`. A second drain pass sends nothing. `bots channel list` reports the depth. The entry holds the secret's name and never its value. The delivery constant names the four channels beside `desktop`.

### Why This Matters

A send that is retried after an uncertain result is a message the recipient may receive twice, and a send that is never queued is a message lost with no record. The `unknown` state is the only honest answer when the transport cannot say whether the message arrived, and it has to be visible in `bots status` rather than only in a folder. The token rule matters because a queue entry outlives the call that wrote it, so a token in an entry is a credential on disk.

---

## 2. SCENARIO CONTRACT

- Objective: Prove enqueue before the I/O, the `unknown` state and its no-retry rule, the list depth, the token rule and the four delivery names.
- Real user request: `Show me a send that lands in the queue first, show me an uncertain send is never retried, and show me the queue depth in the channel list.`
- Prompt: `Show me a send that lands in the queue first, show me an uncertain send is never retried, and show me the queue depth in the channel list.`
- Expected execution process: build the world, store the token as a secret, link the channel, start a stand-in daemon that drops the RPC request, send one message, drain again, list the channels, read the entry and read the delivery constant.
- Expected signals: one file in `queue/`, the entry holding `unknown`, the stand-in's request log holding one line after two drain passes, the `signal` line of `channel list` holding a `1`, no token value anywhere under `queue/`, and `DELIVERY_CHANNELS` holding five names.
- Desired user-visible outcome: the operator sees the message queued before it was sent, sees it marked `unknown` and left alone, and sees the depth in the list.
- Pass/fail: PASS if the entry exists before the request, reads `unknown`, survives a second drain with no new request, the list shows the depth, no token value is on disk and the constant holds five names. FAIL if the entry is written after the request, if a second drain re-sends, if the entry holds the token value or if the constant holds fewer than five names.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me a send that lands in the queue first, show me an uncertain send is never retried, and show me the queue depth in the channel list.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **No account needed.** The Signal transport talks to a local daemon over HTTP, so the stand-in below is the whole prerequisite. No phone number and no registered account is involved, and the stand-in never reaches a network.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world and store the token as a secret.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
RT="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state"
git -C "$W/checkout" init -q
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "config"
pbots() { HOME="$W/acct" PATH="$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout"; }
printf 'pb-signal-token-7f3a\n' | pbots secret set signal --store file; echo "exit=$?"
pbots channel link signal; echo "exit=$?"
# 2. Turn 1: start a stand-in daemon that drops the RPC request without answering.
PORT="$(grep -oE '(127\.0\.0\.1|localhost):[0-9]+' "$RT/lib/channel-signal.ts" | head -1 | cut -d: -f2)"
printf 'port=%s\n' "${PORT:-none}"
"$NODE" -e 'const h=require("node:http"),f=require("node:fs");h.createServer((q,s)=>{if(q.url==="/api/v1/events"){s.writeHead(200,{"content-type":"text/event-stream"});return}f.appendFileSync(process.argv[1],q.method+" "+q.url+"\n");q.socket.destroy()}).listen(Number(process.argv[2]),"127.0.0.1")' "$W/requests.log" "$PORT" &
sleep 1
# 3. Turn 2: one send is queued first and its result is uncertain.
pbots channel send signal "the release notes are done"; echo "exit=$?"
ls "$W"/state/*/channels/queue/ | wc -l
grep -c 'unknown' "$W"/state/*/channels/queue/*
wc -l < "$W/requests.log"
# 4. Turn 3: a second drain pass sends nothing.
pbots channel drain; echo "exit=$?"
wc -l < "$W/requests.log"
# 5. Turn 4: the list reports the channel and its depth.
pbots channel list; echo "exit=$?"
pbots channel list | grep 'signal' | grep -c '1'
# 6. Turn 5: the entry holds the secret's name and never its value.
grep -rc 'pb-signal-token-7f3a' "$W"/state/*/channels/queue/ | grep -c ':0$'
# 7. Turn 6: delivery names the four channels beside desktop.
"$NODE" -e 'const s=require("node:fs").readFileSync(process.argv[1],"utf8");const m=s.match(/DELIVERY_CHANNELS\s*=\s*\[([^\]]*)\]/);const n=(m?m[1]:"").split(",").map(x=>x.trim().replace(/["\x27]/g,"")).filter(Boolean);console.log(n.join(" "));console.log("count="+n.length)' "$RT/lib/delivery.ts"
# Last. Stop the stand-in and remove the throwaway world.
kill %1 2>/dev/null; wait 2>/dev/null
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the channel is linked

- Expected: `exit=0` on the secret write and `exit=0` on the link, then `port=<a number>`. A `port=none` means the transport names no port in its source, so the send turns record `SKIP` with that as the blocker.

### Turn 2 -- the send is queued first and reads unknown

- Expected: one line from `ls | wc -l` reading `1`, one `grep -c 'unknown'` line reading `1`, and one `wc -l` line reading `1`. The exit is recorded and not asserted, because the contract names no refusal for an uncertain send.

### Turn 3 -- a second drain sends nothing

- Expected: `wc -l` still reading `1`, so no second request left the process. The entry is never retried.

### Turn 4 -- the list reports the channel and its depth

- Expected: one `signal` line holding a `1`, which is the queue depth, and `exit=0`.

### Turn 5 -- no token value on disk

- Expected: `1`, meaning every file under `queue/` holds zero occurrences of the token value.

### Turn 6 -- delivery names five channels

- Expected: one line reading `desktop telegram slack signal whatsapp` and one line reading `count=5`.

### Expected

- `exit=0` on the secret write, the link and the list.
- One queue entry, holding `unknown`.
- One request in the stand-in's log after two drain passes.
- The `signal` line of the list holding a `1`.
- Zero occurrences of the token value under `queue/`.
- `DELIVERY_CHANNELS` holding five names.

### Evidence

The link exits, the port line, the queue file count, the `unknown` count, the request log count before and after the second drain, the list output with its depth count, the token count and the delivery constant with its count.

### Pass / Fail

- **Pass**: the entry exists before the request, reads `unknown`, survives a second drain with no new request, the list shows the depth, no token value is on disk and the constant holds five names.
- **Fail**: the entry is written after the request, a second drain re-sends, the entry holds the token value or the constant holds fewer than five names.
- **Skip**: when `node` or `git` is unavailable, when the `channel` verb is missing, or when the transport names no port in its source, naming the missing piece and phase 011 as the blocker.

### Failure Triage

1. `channel link signal` is refused `secret-unknown`: the secret name and the channel name differ. Read the link and confirm the default secret name is the channel's own name.
2. `port=none`: the transport reads its port from somewhere other than a literal. Read the transport and record the blocker rather than guessing a port.
3. The queue folder holds no file after the send: the entry is written after the I/O. Read the send path and move the write before the request.
4. The entry reads `attempted` or `failed` instead of `unknown`: the transport maps a dropped socket to a retryable failure. Read the result mapping and treat a closed socket with no response as uncertain.
5. The request log reads `2` after the second drain: the `unknown` state is retried. Read the drain and skip every entry in that state.
6. The request log reads `0` after the first send: the stand-in never received the request, so the port is wrong or the transport refused before the I/O. Read the send's stderr.
7. The list prints no `signal` line: the channel is not in `$W/state/*/channels/config.json`. Read the link and confirm it writes the entry with `enabled: true`.
8. The token count reads `0` instead of `1`: a file under `queue/` holds the value. Read the entry writer and store the secret's name only.
9. `count=1`: the constant still holds `desktop` alone. Read `delivery.ts` and add the four channel names.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `channels/queue-unknown-not-retried.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Writes the entry before the I/O and records `unknown` |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts` | Sends through the local daemon and maps a dropped socket to uncertain |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Reads `$W/state/*/channels/config.json` and resolves the secret name |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Holds `DELIVERY_CHANNELS` |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | Owns the automated proof of the same three rules |

The durable queue, the `unknown` state and the backoff table are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:195]. The four delivery names are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:203]. The list and its depth are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:206]. The uncertain-send acceptance case is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:225]. The token rule for a queue entry is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:244]. The exit and layer for each channel refusal are `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md` section 3.10.

---

## 5. SOURCE METADATA

- Group: Channels
- Playbook ID: BOT-058
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `channels/queue-unknown-not-retried.md`
