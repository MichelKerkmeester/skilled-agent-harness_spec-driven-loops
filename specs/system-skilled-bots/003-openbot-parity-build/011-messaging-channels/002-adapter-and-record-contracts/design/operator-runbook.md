---
title: "Design: operator runbook per transport"
description: "Per transport: the credentials and scopes to create, the bots secret set and bots channel link commands, a preflight check, a health check and what to do when a token is rotated."
trigger_phrases:
  - "channel operator runbook"
  - "telegram slack signal whatsapp setup"
  - "channel token rotation"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Operator runbook per transport

The operator prerequisites were a risk table, not a runbook. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:206] This file is the runbook. `../../007-conformance-hardening-and-proof/` copies it into `bots-run/references/messaging-channels.md` when the transports ship, so a person setting up a channel reads one page.

Every command below runs on the host as the operator. `bots` is `node .skilled/bin/bots.cjs`. A secret value is never an argument: `bots secret set <name>` reads one line from stdin when stdin is not a terminal and prompts with echo off when it is. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-001] Secret names and the suffixes each transport derives are `records.md` section 1.1.

---

## 1. ONCE PER IDENTITY

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `bots channel roster add ada --role owner` | Creates `operators.json`. `bots channel link` refuses `channel-roster-missing` until this has run |
| 2 | `bots channel roster add grace --role member` | Adds a person who may also answer from a chat |
| 3 | `bots channel roster list` | Prints `owner ada` and `member grace` |

A member links their own chat, so the link record names them and not the operator. `bots channel link <channel> --as <actor>` takes the actor under the tty rule of `../../../001-activity-and-actor/spec.md` REQ-008, and refuses a link whose actor is neither the `owner` nor a `member` with `answer-not-approver` and exit 4. The member runs it from a terminal on the host, because the state root is owner-only:

```text
$ bots channel link telegram --as grace
bots: telegram link code 731406, valid for 5 minutes
```

Then grace sends `731406` from her own chat, and `links.json` records `actor: "grace"` with her sender id. A member who cannot reach the host's state root cannot link until the shared-host packet lands the 0770 mode, and the roster row is what makes their chat an approver once they can.

A delivery target in a bot's definition names the chat a parked prompt goes to: `delivery.targets: ["telegram:81234567"]`, in the `<channel>:<address>` form `delivery.ts` already parses. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:44-45]

---

## 2. TELEGRAM

| Item | Detail |
|------|--------|
| Credential | A bot token, created by the operator in BotFather [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/hosted-telegram.md:17] |
| Scopes | None. A bot token is all-or-nothing |
| Public URL | None. The transport long-polls `getUpdates` and clears any webhook first [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs:267-272] |
| Group use | Approvals in a group are refused `channel-group-approval`. A direct chat with the bot is the supported path |

```text
$ printf '%s\n' "$TELEGRAM_TOKEN" | bots secret set telegram
$ bots channel link telegram
bots: telegram link code 482913, valid for 5 minutes
$ bots channel listen telegram
```

Then send `482913` to the bot from the chat to link. The bot answers with catalog row M10 of `../../001-channel-ux-and-message-map/design/message-catalog.md`.

| Check | How | Pass |
|-------|-----|------|
| Preflight | `bots secret list` and `bots channel list` | `telegram` is listed in both, and the channel row reads `enabled` |
| Health | `bots channel listen telegram` calls `getMe` once before its first poll [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs:331] | The first stderr line reads `bots: telegram ready as @<bot username>` |
| Rotation | Revoke the token in BotFather, then `printf '%s\n' "$NEW" \| bots secret set telegram` | No restart. The token is read at every poll and every send, so the next poll uses the new one |

---

## 3. SLACK

| Item | Detail |
|------|--------|
| Credentials | Two. An app-level `xapp-` token from Socket Mode, and a bot `xoxb-` token from installing the app [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/channels/slack/config.py:17-29] |
| Scopes | Bot token: `chat:write`, `im:history` and `channels:history`. Events: `message.im` and `message.channels`. This is the subset of the reference's list that direct messages and one channel need. Its other scopes serve reactions and slash commands, which this phase does not use [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/channels.md:141-147]. The app-level token needs `connections:write`, which no reference file states and the Slack app settings page asks for when Socket Mode is enabled. **Confirm on the settings page** |
| Interactivity | Interactivity must be on, so a button press arrives as `block_actions` over the socket |
| Public URL | None. Socket Mode opens an outbound socket [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/channels.md:128-130] |

```text
$ printf '%s\n' "$SLACK_APP_TOKEN" | bots secret set slack-app-token
$ printf '%s\n' "$SLACK_BOT_TOKEN" | bots secret set slack-app-token-bot
$ bots channel link slack --secret slack-app-token
bots: slack link code 731406, valid for 5 minutes
$ bots channel listen slack
```

| Check | How | Pass |
|-------|-----|------|
| Preflight | `bots secret list` | Both `slack-app-token` and `slack-app-token-bot` are listed |
| Health | `listen slack` calls `auth.test` with the bot token, then `apps.connections.open` with the app token [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:58-65] | The first stderr line reads `bots: slack ready as <bot user id>` |
| Rotation | Regenerate the token in the app settings, then set the same secret name again | The bot token takes effect at the next send. The app token takes effect at the next reconnect, so restart `listen slack` to apply it at once |

---

## 4. SIGNAL

| Item | Detail |
|------|--------|
| Credential | None held by this runtime. A local `signal-cli` daemon holds the registered or linked account [SOURCE: specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/features/channels.md:64] |
| The account | Stored as the secret `signal`, the number in E.164 form, because the config has no other place for it (`records.md` section 1.1) |
| The daemon | `signal-cli daemon --http 127.0.0.1:8080`, the fixed address this phase reads. It listens on localhost only, so no public URL |
| Lost messages | A message that arrives while `listen signal` is stopped may be lost. `inbound-sequence.md` section 4 marks this UNKNOWN |

```text
$ signal-cli daemon --http 127.0.0.1:8080 &
$ printf '%s\n' '+15550100' | bots secret set signal
$ bots channel link signal
bots: signal link code 205118, valid for 5 minutes
$ bots channel listen signal
```

| Check | How | Pass |
|-------|-----|------|
| Preflight | `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/api/v1/check` | Prints `200` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/config.rs:86] |
| Health | `listen signal` calls the same check first | The first stderr line reads `bots: signal ready as +15550100`. A refused connection exits 4 with `bots: channel-daemon-unreachable` |
| Rotation | A new number is a new registration in signal-cli. Set the secret to the new number and restart `listen signal` | The SSE query names the account, so the restart is what applies it |

---

## 5. WHATSAPP

| Item | Detail |
|------|--------|
| Credentials | A Cloud API access token, the Meta app secret, a verify token the operator invents and the sending number's `phone_number_id` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/channel.rs:31-39] |
| Permissions | `whatsapp_business_messaging` and `whatsapp_business_management` on the token [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/hosted-whatsapp-launch.md:115] |
| Public URL | Required. The webhook listener binds `127.0.0.1:8787`, and an operator-run HTTPS tunnel forwards the public URL to it. This is the one transport with that prerequisite |
| Business account | A Meta business account with the number added. Without it no webhook is delivered |
| The 24-hour window | Meta delivers a free-form message only within 24 hours of the person's last message. Outside it the API accepts the call and then reports the send as `failed` on a `statuses` entry, which `inbound-sequence.md` section 5 maps onto the queue entry and the run record. A prompt sent outside the window therefore reads `failed` in `bots status` rather than `delivered`, and the person never saw it. Template messages would reach them and this phase does not send any, so the runbook's advice is to answer inside the window or to ask the operator to run `bots answer` on the host |

```text
$ printf '%s\n' "$WA_TOKEN"      | bots secret set whatsapp
$ printf '%s\n' "$WA_APP_SECRET" | bots secret set whatsapp-app-secret
$ printf '%s\n' "$WA_VERIFY"     | bots secret set whatsapp-verify-token
$ printf '%s\n' "$WA_PHONE_ID"   | bots secret set whatsapp-phone-number-id
$ bots channel link whatsapp
bots: whatsapp link code 660734, valid for 5 minutes
$ bots channel listen whatsapp
```

Then set the webhook URL in the Meta app to the tunnel's public HTTPS URL with the verify token above, and subscribe to `messages`.

| Check | How | Pass |
|-------|-----|------|
| Preflight | `bots secret list` | All four names are listed |
| Handshake | Meta's verification request reaches the listener | The listener logs `bots: whatsapp webhook verified`. A wrong verify token answers `403` |
| Health | `curl -s -o /dev/null -w '%{http_code}\n' -X POST http://127.0.0.1:8787/ -d '{}'` from the host | Prints `401`, because an unsigned body is refused before parse. A `200` here would mean the signature check is off |
| Rotation | Generate a new token or app secret in Meta, then set the same secret name | The access token takes effect at the next send. The app secret is read per request, so the next webhook is checked against it |

---

## 6. WHEN SOMETHING FAILS

| Symptom | Where it shows | What to do |
|---------|----------------|------------|
| `bots: channel-roster-missing` on `link` | stderr, exit 4 | Section 1 step 1 |
| `bots: secret-unknown: <name>` on `listen` | stderr, exit 4 | Set the named secret. A derived name is listed in `records.md` section 1.1 |
| `bots: channel-listening` | stderr, exit 4 | Another `listen` holds `channels/listen-<channel>.lease`. Stop it first |
| A notice reads `unknown` in `bots status` | the run's delivery entry | The send may have landed. It is never retried. Check the chat by hand |
| A notice reads `failed` in `bots status` | the run's delivery entry | The provider accepted the send and then could not deliver it, as a WhatsApp send outside the 24-hour window does. The prompt's index entry is gone, so a reply cannot answer it. Answer on the host with `bots answer` |
| `queueDepth` grows in `bots channel list` | the channel row | The transport is down or rate limited. `bots channel drain` retries due entries and exits 1 when any due entry ended `failed` or `unknown` in that pass, else 0 |
| A prompt sits `queued` with no `listen` running | the queue folder | `bots channel listen <channel>` drains its own channel after every inbound turn and on a 60 s tick, so a prompt leaves the queue while a listener runs. With no listener, run `bots channel drain` by hand or install the drain job |

---

## 7. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design
rg -c '^\| (Preflight|Health|Rotation) \|' $D/operator-runbook.md
rg -c 'bots secret set' $D/operator-runbook.md
```

The first prints 12, three rows for each of four transports. The second prints 12.
