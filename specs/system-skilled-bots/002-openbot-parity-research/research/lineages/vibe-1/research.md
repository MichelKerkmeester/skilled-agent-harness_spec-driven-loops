# OpenBot parity for skilled bots: what a small team needs

Thirteen iterations, 197 findings, eight reference repos. The question was not "how do we
rebuild OpenBot" but "which of OpenBot's parts does a small team actually need, and what is the
smallest change that gets each one". The answer is seven build items, none of which needs a new
service, a database server, a container or a sign-in.

OpenBot frames a bot as eight parts in four pairs, and says so in one table: "Everything else in
OpenBot is one of eight things a Bot has. They come in four pairs, and each one answers a single
question." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:6]

| Pair | Part | The question it answers |
|---|---|---|
| Works | Conversations | How do I give it work? |
| Works | Routines | When does it work without being asked? |
| Learns | Memory | What does it know about me and my work? |
| Learns | Skills | What does it know how to do? |
| Uses | Apps | Which of my services can it reach? |
| Uses | Computer | Where does it browse, run commands and keep files? |
| Answers to you | Approvals | When does it stop and ask me? |
| Answers to you | Activity | What did it do? |

[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:9]

---

## 1. The eight parts, one at a time

### Conversations

**What OpenBot does.** "A conversation is where you give a Bot work and where it reports back. You
can write, talk, or send a file. A conversation can hold more than one Bot, and each takes the part
of the work that is its job." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:30]

**What the other repos do better.** openhuman's terminal client is the strongest evidence that a
conversation surface does not need a desktop: it is "a conversation-first terminal frontend", and
its chat "uses the same `web_chat` surface the desktop app drives".
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:6]

**What skilled bots has today.** No conversation surface. A bot is a `BOT.md` file run headless by
hand, on a schedule or from a queue; the person reads a delivery message, not a transcript.

**Smallest change.** Nothing in this packet. A conversation surface is the terminal client, which
is item 7 of the build order and depends on the six items before it.

### Routines

**What OpenBot does.** "A routine is a standing instruction: something a Bot carries out on a
schedule instead of waiting to be asked." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3]
Every routine is one sentence in four parts: What, Starts, Does, Until — and Starts can be a time,
an event ("a new email, a pull request"), or now.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:42]

**What the other repos do better.** Nothing beats the four-part sentence. It is the single best
idea in the set: it makes a routine readable to a person and checkable by a machine at once.

**What skilled bots has today.** Four trigger kinds — `cron`, `queue`, `git-hook`, `manual` — and a
cron translator that either fires exactly as cron would or refuses with a named invariant id.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25]

**Smallest change.** Write the four-part sentence as the `BOT.md` routine block, and render the
existing triggers into it: `cron` is Starts-at-a-time, `queue` and `git-hook` are Starts-on-an-event,
and `manual` is Starts-now. Size: a doc convention plus one renderer. Risk: low, because the
triggers do not change.

### Memory

**What OpenBot does.** "Memory is what a Bot knows about you and your work... Facts you add are
shared with all your Bots. Facts a Bot picks up while working stay with that Bot."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:61]
It is scoped per organization and per person, and a single-person install keeps no memory at all.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:10]

**What the other repos do better.** OpenGhost keeps one bounded memory for the user across all
chats — `LIMITS = { text: 400, records: 60, crowded: 28, chars: 3600 }` — and has a model rewrite it
shorter once it is crowded. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]
That is the smallest memory that still stays useful.

**What skilled bots has today.** Nothing: `grep -rn "memory" runtime/lib/*.ts` returns zero hits.

**Smallest change.** One JSON file per person at the shared level plus one per-bot overlay inside
the identity folder: `{stateRoot}/memory/{personId}.json` and
`{stateRoot}/{identityKey}/memory/{botId}.json`. The layout already has a shared level and a
per-identity level, so this adds a third entry to an existing shape rather than a subsystem.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:135]
Size: one module and one file shape. Risk: low.

### Skills

**What OpenBot does.** "A skill is a named way of doing a task, called with `/`... A skill is made
in one of three ways: you write it, you show the Bot the task once and it records the steps, or
OpenBot proposes one from your conversations."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:67]

**What the other repos do better.** hermes-muse's companion skill is the cleanest skill folder in
the set: 31 lines of `SKILL.md` over 21 references, with one generated reference that "no other page
repeats" and a rule that code owns the bookkeeping and the skill must never imitate it in prose.
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:12]

**What skilled bots has today.** The format, already: a folder with `SKILL.md`, a README, graph
metadata and references, discovered automatically from valid frontmatter with no registration step.
[SOURCE: .skilled/skills/README.txt:33] What is missing is the third origin — a skill proposed from
use — and any review of it.

**Smallest change.** A `proposals/` folder beside `.skilled/skills/`, each proposal holding the
files verbatim plus one `proposal.json` naming its target path and the revision it read, reviewed
through a needs-you item. Size: one store and one review path. Risk: low, because the review path
already exists.

### Apps

**What OpenBot does.** "An app is a service the Bot uses as you: Google Sheets, Gmail, Notion. You
connect an app once, on the Connections page. The Bot never sees your sign-in. A service that takes
a key gets it from your vault." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:74]

**What the other repos do better.** Nothing here is better; the vault rule is the good part. "The
vault is yours... A Bot never sees what is in it: OpenBot fills the page or signs the app in, and the
secret stays out of the conversation and out of memory."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:107]

**What skilled bots has today.** MCP servers and Code Mode, plus a secret check on every answer and
on every dispatched prompt. There is no vault: a secret is an environment variable the run can read.

**Smallest change.** Nothing in this packet. The vault is a real gap, but it is a separate packet:
it needs a store, a fill path and a rule that the run never reads it, and none of the seven build
items depends on it.

### Computer

**What OpenBot does.** "The Bot has a computer with a browser, a command line and files that stay
between tasks. It signs in with a login from your vault... When a page needs you, such as a passkey
or a code on your phone, you take control, do that step, and hand it back."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:80]

**What the other repos do better.** Nothing. OpenBot's hand-back is the right shape and no other
repo in the set does it better.

**What skilled bots has today.** Worktree isolation: every run gets its own git worktree, and a kept
worktree is named in the delivery message with its branch.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:185]

**Smallest change.** Nothing. A worktree is a better computer than a container for a small team: it
is the checkout the person already has, it costs nothing to start, and its diff is the activity
record. The browser and the hand-back are the parts we do not have, and they are the parts a small
team can do by hand.

### Approvals

**What OpenBot does.** "Approvals decide when a Bot stops and asks. Sending, sharing, posting and
deleting ask every time. Paying is always handed to you."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:88]
The order is fixed and the first answer wins: kinds of action, then rules, then auto-review, then
extra vigilant — and "the strictest one that matches wins".
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3]

**What the other repos do better.** hermes-muse's staged-write pinning: a staged write is pinned to
the exact entry it matched, and once a cleanup changed that entry the approval is refused.
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:20]

**What skilled bots has today.** The needs-you item: the runner writes one item when the child
prints a `[NEEDS-DECISION]` line, the run ends `awaiting-decision` with exit 5, and an open item
holds every later run of its bot. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:24]
Its state is derived from its fields every time it is read and never stored.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:49]

**Smallest change.** Write the precedence ladder as a doc and apply it at the one gate that exists:
the needs-you item. Size: a doc plus one check. Risk: low.

### Activity

**What OpenBot does.** "Activity is the record of what a Bot did: what it read, changed and sent,
what it was refused, and what you approved. Approvals are the check before an action. Activity is
the check after." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:95]

**What the other repos do better.** openhuman's activity projection is bounded and has six statuses
— running, done, failed, needs input, cancelled, stale — which is one more than a run record needs
and one fewer than a dashboard.
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6]

**What skilled bots has today.** Run records, a SQLite status index with `runs`, `deliveries` and
`items` tables, and `bots status`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]

**Smallest change.** Nothing. The activity record already exists and is already indexed; what is
missing is a view, and the view is the terminal client.

---

## 2. The terminal verdict

**A terminal can give the OpenBot app experience. A desktop shell adds one thing a terminal cannot,
and this runtime does not need it.**

The proof is openhuman, which ships both clients and shares the surface between them. Its terminal
client is "a conversation-first terminal frontend... built with ratatui and crossterm", embedding the
core in-process with no HTTP server or sidecar, and it covers "login, saved conversations,
model/agent selection, approvals, tools, child-run inspection, and diagnostics" through the existing
core contracts. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:3]
Its chat "uses the same `web_chat` surface the desktop app drives", so the terminal is not a lesser
client. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:6]

All four surfaces are there:

| OpenBot surface | How a terminal draws it |
|---|---|
| Conversations | A Chat tab plus a multiline composer, with send, steer and queue-follow-up keys |
| Approvals inbox | A plan-review overlay with `a` approve, `r` reject, `e` request revision, `Esc` leaves pending |
| Activity feed | Bounded tool and child-run projections with six statuses |
| Routine list | A table; the one surface openhuman does not have as a tab, and the one that needs no new idea |

[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:13]
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1]

**What a desktop shell adds.** OpenBot's Tauri app is not a chat client with a nicer window. Its
ownership table is explicit: the window owns screens and holds no credentials, and the native side
owns "Engine install, deployment layout, images, Compose, host processes, secrets, Stop and Quit".
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:165]
Its install requires Docker Desktop or Podman Desktop first.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:17]
So the desktop's unique value is installing and supervising a container stack. A runtime that boots
in-process has nothing to install and nothing to supervise.

**The one caveat.** openhuman's TUI is GPL-3.0, so its code cannot be lifted into this tree; only
its shape transfers. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:2]

---

## 3. The small team

**Who can talk to a bot.** Everyone who can run the CLI. There is no sign-in, no role and no
organization: state is keyed by repository identity `owner/name`, and the only identity dimension is
the checkout. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:118]

**Who can approve for a bot.** Everyone who can run the CLI. `bots answer` checks the answer for
secret literals and then writes it; there is no role check.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:73]

**Who can change a bot.** Everyone who can edit `BOT.md`. A change is caught, not prevented: the
next scheduled run is refused as `definition-drifted` until the change is approved again with
`bots enable <id>`. [SOURCE: .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md:52]

**Shared versus per-person memory.** This is a state-root choice, not a code change. The root is
`${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots` by default, so each OS user gets their
own memory and their own needs-you items.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102]
Point `SKILLED_BOTS_STATE_ROOT` at one shared path and the memory is shared.

**The smallest sign-in and roles model.** Three decisions, no new service:

1. **No sign-in.** OpenBot's own single-person install has none: "It signs nobody in, so it has
   neither OAuth nor API keys, and the operations that manage keys and sessions answer 503 with the
   code SIGN_IN_UNAVAILABLE."
   [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:57]
   A few people on one machine already have an OS identity; a session would only duplicate it.
2. **Two roles, not three.** OpenBot has `owner | admin | member`, where an owner or an admin
   governs "its people, its sign-in and its policy".
   [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:893]
   With no sign-in there is no sign-in to govern, so `admin` collapses into `owner`. Keep `owner`
   for whoever installed the jobs and `member` for everyone else, in one `operators.json` under the
   state root, read by `bots answer` before it writes.
3. **One folder-mode change for a shared host.** Every state folder is created mode `0o700`, so a
   shared root is unreadable by the second person.
   [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46]
   `0o770` with a group is the whole change.

---

## 4. The skip list

Each of these is a real part of OpenBot, and each is left out for a reason that is about this team,
not about the part's quality.

| Skipped | What it is | Why we do not need it |
|---|---|---|
| Kubernetes | Release promotion around an `openbot` Helm chart, checking the manifest image digest and chart checksum before invoking Helm [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:3] | A small team does not run a cluster, and the chart's value is release promotion, not running a bot |
| Managed upgrades | A management agent the chart installs into the cluster, connecting to CopilotKit's management service by default [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3] | It is a vendor service tied to that chart; with no chart there is nothing to manage |
| Multi-tenant | Memory scoped per organization, where a memory named from another organization answers not found [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:13] | A small team is one organization, so the second scope is a branch nothing takes |
| Enterprise roles | An `admin` tier that governs people, sign-in and policy [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:893] | There is no sign-in for it to govern |
| Mobile | A full React Native app, 632 files under `mobile/` [SOURCE: specs/system-skilled-bots/context/OpenBot-main/mobile/package.json:2] | A phone cannot run a launchd job, and the terminal is the client |
| PostgreSQL and Compose | Even the personal edition runs PostgreSQL, the one computer and the server [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:33] | The runtime is a Node CLI with a SQLite index; a database server and a container supervisor are the desktop shell's job |

---

## 5. Reuse: what to lift, and under which licence

Licences first, because two of the most attractive pieces are unusable as code: OpenBot, OpenGhost
and hermes-muse are MIT; OpenMausBot, rakazo, turnstone and buzz are Apache-2.0; openhuman is
GPL-3.0. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1]
[SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:2]

| Lift | Repo and path | Licence | What it gives us |
|---|---|---|---|
| The four-part routine sentence | OpenBot `docs/routines.md:16` | MIT | What / Starts / Does / Until, readable by a person and checkable by a machine |
| The approvals precedence ladder | OpenBot `docs/approvals.md:3` | MIT | Kinds, then rules, then auto-review, then extra vigilant; strictest wins |
| Derived review state and idempotent approve | OpenBot `api/openapi/learning.yaml:1130` | MIT | Approving again answers the same review; rejecting an approved one is refused |
| Bounded memory with a tidy rewrite | OpenGhost `memory.js:11` | MIT | 60 records, 3600 chars, crowded at 28, rewritten shorter by a model |
| Staged-write pinning | hermes-muse `skills/companion/references/memory.md:20` | MIT | A proposal names the revision it read, so a stale one is refused |
| TUI shape only | openhuman `crates/openhuman-tui/` | GPL-3.0 | Four tabs, overlay approvals, six activity statuses — the shape, not the code |

Four of the six are documents or patterns rather than code. That is the finding: the parts worth
copying are the rules, and the code that enforces them is small enough to write.

---

## 6. The ranked build order

Smallest first, each item depending only on the ones before it.

1. **The memory store.** One JSON file per person at the shared level plus one per-bot overlay
   inside the identity folder. It comes first because it is the only item that adds a new file
   shape, and every later item reads it: the review item reviews a fact, the proposal store reviews
   a skill, and the sync writes facts. Size: one module. Risk: low.
2. **The memory review item.** The needs-you item's file shape and derived state, with no hold and
   no resume: `id` is the fact id, `answer` is `confirmed | rejected`, and `edited` is the answer
   text rather than a third state. Size: one shape plus one verb. Risk: low.
3. **The skill proposal store.** A `proposals/` folder beside `.skilled/skills/`, each proposal
   holding its files verbatim plus a `proposal.json` naming the target path and the revision it
   read, reviewed through the same needs-you item. Size: one store. Risk: low.
4. **The memory source sync.** A `cron` trigger per source and a `run` request with
   `source: 'memory-sync'`. No new trigger kind, no stored `nextSyncAt` (the runtime already refuses
   to predict a fire), and no new retry path (the queue's bound of 3 and the drain job's backoff
   already cover it). Size: one source string plus one cron expression. Risk: low.
5. **Routines as sentences.** The four-part block in `BOT.md`, rendered from the existing four
   triggers. Size: a doc convention plus one renderer. Risk: low.
6. **The approvals ladder.** The precedence order as a doc, applied at the needs-you gate. Size: a
   doc plus one check. Risk: low.
7. **The terminal client.** Conversations, approvals, activity and routines in one TUI, written
   rather than lifted because the only one in the set is GPL-3.0. It comes last because it draws the
   four surfaces the six items before it create, and building it first would mean drawing empty
   screens. Size: the largest item in the packet. Risk: medium.

**What is deliberately not on the list:** a vault, a browser, a container, a database server, a
sign-in, a role tier, a mobile app and a desktop shell. Each is either a separate packet or on the
skip list above.

---

## 7. What this packet does not answer

- **The vault.** Apps and the computer both draw on it in OpenBot, and neither keeps secrets of its
  own. Skilled has no vault, and the seven items above do not need one. It is the largest remaining
  gap and it deserves its own packet.
- **The browser and the hand-back.** OpenBot's computer has a browser and a way for the person to
  take control for a passkey. A worktree has neither, and a small team can do those steps by hand.
- **Recording a skill from a demonstration.** OpenBot's second skill origin — "you show the Bot the
  task once and it records the steps" — has no counterpart here. The proposal store in item 3 can
  hold the result, but nothing produces it yet.
