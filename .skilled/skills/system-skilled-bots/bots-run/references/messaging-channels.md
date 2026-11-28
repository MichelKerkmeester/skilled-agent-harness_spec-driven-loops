---
title: "Bot Runs: Messaging Channels"
description: "Set up a chat transport for bots: the credentials, the secret names, the setup commands, the preflight, health and rotation checks and what to do when a send fails."
trigger_phrases:
  - "bots channel"
  - "messaging channels setup"
  - "telegram bot channel"
  - "slack socket mode channel"
  - "signal-cli daemon channel"
  - "whatsapp webhook channel"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Bot Runs: Messaging Channels

Every command on this page runs on the host as the operator, and each transport is set up once per identity and then checked before it carries a run.

---

## 1. OVERVIEW

### Purpose

Give the operator the credentials to create, the secret names to set, the setup commands to run and the checks that prove a chat transport is ready, for the four transports this runtime speaks: Telegram, Slack, Signal and WhatsApp. `bots channel` holds the verbs `roster`, `link`, `unlink`, `list`, `listen`, `send` and `drain`, and `bots` means `node .skilled/bin/bots.cjs`. A secret value is never an argument: `bots secret set <name>` reads one line from stdin when stdin is not a terminal and prompts with echo off when it is.

### When to Use

- Setting up a transport for the first time.
- Linking a member's own chat so it can answer.
- Checking a transport before a run depends on it.
- Rotating a token, an app secret or a number.
- A send failed, or a queue is not draining.

---

## 2. ONCE PER IDENTITY

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `bots channel roster add ada --role owner` | Creates `operators.json`. `bots channel link` refuses `channel-roster-missing` until this has run |
| 2 | `bots channel roster add grace --role member` | Adds a person who may also answer from a chat |
| 3 | `bots channel roster list` | Prints `owner ada` and `member grace` |

A member links their own chat, so the link record names them and not the operator. `bots channel link <channel> --as <actor>` takes the actor, and refuses a link whose actor is neither the `owner` nor a `member` with `answer-not-approver` and exit 4. The member runs it from a terminal on the host, because the state root is owner-only:

```text
$ bots channel link telegram --as grace
bots: telegram link code 731406, valid for 5 minutes
```

Then grace sends `731406` from her own chat, and `links.json` records `actor: "grace"` with her sender id. A member who cannot reach the host's state root cannot link until the shared-host packet lands the 0770 mode, and the roster row is what makes their chat an approver once they can.

A delivery target in a bot's definition names the chat a parked prompt goes to: `delivery.targets: ["telegram:81234567"]`, in the `<channel>:<address>` form `delivery.ts` already parses.

---

## 3. SECRET NAMES

The contract gives each channel one `secret`. Slack needs an app-level token and a bot token, and WhatsApp needs an access token, a verify token and the Meta app secret. Signal's account and WhatsApp's `phone_number_id` have no key either. Adding keys would change a frozen contract, so every further name is derived from the configured one by a fixed suffix. Each derived name stays inside the secret-name grammar, because a suffix adds only lowercase letters and hyphens.

| Channel | Name | Holds | Read by |
|---------|------|-------|---------|
| `telegram` | `<secret>` | The bot token | `getUpdates` and `sendMessage` |
| `slack` | `<secret>` | The app-level `xapp-` token | `apps.connections.open` |
| `slack` | `<secret>-bot` | The bot `xoxb-` token | `chat.postMessage` |
| `signal` | `<secret>` | The registered account number in E.164 form | the JSON-RPC `account` parameter and the events query |
| `whatsapp` | `<secret>` | The Cloud API access token | every Graph call |
| `whatsapp` | `<secret>-app-secret` | The Meta app secret, the key of `X-Hub-Signature-256` | the webhook check |
| `whatsapp` | `<secret>-verify-token` | The verify token of the subscription handshake | the `GET` handshake |
| `whatsapp` | `<secret>-phone-number-id` | The sending number's id | the send URL and the inbound binding |

With the contract's sample, Slack reads `slack-app-token` and `slack-app-token-bot`. The phone number id and the account number are not credentials, and they sit in the vault because the config has no other place for them and the vault already keeps them off every log. A missing derived name refuses `secret-unknown` before any I/O, the same as a missing primary name.

**The length bound.** A derived name must stay within the 64 characters of the secret-name grammar. The longest suffix is `-phone-number-id`, 16 characters, so a `whatsapp` entry's `secret` is at most 48 characters. `bots channel link whatsapp --secret <name>` refuses a name longer than 48 characters with `secret-name-invalid` and exit 4, before it writes the entry, so the bound is checked where the name is chosen rather than discovered at the first `listen`. A name that reaches the vault anyway derives a name the vault cannot hold: `bots secret set` refuses it `secret-name-invalid`, and `bots channel listen whatsapp` then refuses `secret-unknown`.

**The fixed addresses.** Two addresses are fixed rather than configured: the Signal daemon at `http://127.0.0.1:8080` and the WhatsApp webhook listener at `127.0.0.1:8787`. Start the daemon and the tunnel on those addresses. `channels/config.json` gains no key for either, so a later key for either counts as an added key.

---

## 4. TELEGRAM

| Item | Detail |
|------|--------|
| Credential | A bot token, created by the operator in BotFather |
| Scopes | None. A bot token is all-or-nothing |
| Public URL | None. The transport long-polls `getUpdates` and clears any webhook first |
| Group use | Approvals in a group are refused `channel-group-approval`. A direct chat with the bot is the supported path |

```text
$ printf '%s\n' "$TELEGRAM_TOKEN" | bots secret set telegram
$ bots channel link telegram
bots: telegram link code 482913, valid for 5 minutes
$ bots channel listen telegram
```

Then send `482913` to the bot from the chat to link. The bot answers `Linked. This chat now answers as <actor>.`

| Check | How | Pass |
|-------|-----|------|
| Preflight | `bots secret list` and `bots channel list` | `telegram` is listed in both, and the channel row reads `enabled` |
| Health | `bots channel listen telegram` calls `getMe` once before its first poll | The first stderr line reads `bots: telegram ready as @<bot username>` |
| Rotation | Revoke the token in BotFather, then `printf '%s\n' "$NEW" \| bots secret set telegram` | No restart. The token is read at every poll and every send, so the next poll uses the new one |

---

## 5. SLACK

| Item | Detail |
|------|--------|
| Credentials | Two. An app-level `xapp-` token from Socket Mode, and a bot `xoxb-` token from installing the app |
| Scopes | Bot token: `chat:write`, `im:history` and `channels:history`. Events: `message.im` and `message.channels`. This is the subset that direct messages and one channel need. Its other scopes serve reactions and slash commands, which this phase does not use. The app-level token needs `connections:write`, which no reference file states and the Slack app settings page asks for when Socket Mode is enabled. **Confirm on the settings page** |
| Interactivity | Interactivity must be on, so a button press arrives as `block_actions` over the socket |
| Public URL | None. Socket Mode opens an outbound socket |

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
| Health | `listen slack` calls `auth.test` with the bot token, then `apps.connections.open` with the app token | The first stderr line reads `bots: slack ready as <bot user id>` |
| Rotation | Regenerate the token in the app settings, then set the same secret name again | The bot token takes effect at the next send. The app token takes effect at the next reconnect, so restart `listen slack` to apply it at once |

---

## 6. SIGNAL

| Item | Detail |
|------|--------|
| Credential | None held by this runtime. A local `signal-cli` daemon holds the registered or linked account |
| The account | Stored as the secret `signal`, the number in E.164 form, because the config has no other place for it (section 3 of this page) |
| The daemon | `signal-cli daemon --http 127.0.0.1:8080`, the fixed address this phase reads. It listens on localhost only, so no public URL |
| Lost messages | A message that arrives while `listen signal` is stopped may be lost, and whether signal-cli keeps events for a client that was away is UNKNOWN |

```text
$ signal-cli daemon --http 127.0.0.1:8080 &
$ printf '%s\n' '+15550100' | bots secret set signal
$ bots channel link signal
bots: signal link code 205118, valid for 5 minutes
$ bots channel listen signal
```

| Check | How | Pass |
|-------|-----|------|
| Preflight | `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/api/v1/check` | Prints `200` |
| Health | `listen signal` calls the same check first | The first stderr line reads `bots: signal ready as +15550100`. A refused connection exits 4 with `bots: channel-daemon-unreachable` |
| Rotation | A new number is a new registration in signal-cli. Set the secret to the new number and restart `listen signal` | The SSE query names the account, so the restart is what applies it |

---

## 7. WHATSAPP

| Item | Detail |
|------|--------|
| Credentials | A Cloud API access token, the Meta app secret, a verify token the operator invents and the sending number's `phone_number_id` |
| Permissions | `whatsapp_business_messaging` and `whatsapp_business_management` on the token |
| Public URL | Required. The webhook listener binds `127.0.0.1:8787`, and an operator-run HTTPS tunnel forwards the public URL to it. This is the one transport with that prerequisite |
| Business account | A Meta business account with the number added. Without it no webhook is delivered |
| The 24-hour window | Meta delivers a free-form message only within 24 hours of the person's last message. Outside it the API accepts the call and then reports the send as `failed` on a `statuses` entry, which the queue entry and the run record carry. A prompt sent outside the window therefore reads `failed` in `bots status` rather than `delivered`, and the person never saw it. Template messages would reach them and this phase does not send any, so the advice is to answer inside the window or to ask the operator to run `bots answer` on the host |

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

## 8. WHEN SOMETHING FAILS

| Symptom | Where it shows | What to do |
|---------|----------------|------------|
| `bots: channel-roster-missing` on `link` | stderr, exit 4 | Section 2 step 1 |
| `bots: secret-unknown: <name>` on `listen` | stderr, exit 4 | Set the named secret. A derived name is listed in section 3 of this page |
| `bots: channel-listening` | stderr, exit 4 | Another `listen` holds `channels/listen-<channel>.lease`. Stop it first |
| A notice reads `unknown` in `bots status` | the run's delivery entry | The send may have landed. It is never retried. Check the chat by hand |
| A notice reads `failed` in `bots status` | the run's delivery entry | The provider accepted the send and then could not deliver it, as a WhatsApp send outside the 24-hour window does. The prompt's index entry is gone, so a reply cannot answer it. Answer on the host with `bots answer` |
| `queueDepth` grows in `bots channel list` | the channel row | The transport is down or rate limited. `bots channel drain` retries due entries and exits 1 when any due entry ended `failed` or `unknown` in that pass, else 0 |
| A prompt sits `queued` with no `listen` running | the queue folder | `bots channel listen <channel>` drains its own channel after every inbound turn and on a 60 s tick, so a prompt leaves the queue while a listener runs. With no listener, run `bots channel drain` by hand or install the drain job |
