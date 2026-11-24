# OpenBot Parity for Skilled Bots — the `vibe-2` lineage

Progressive synthesis for the `vibe-2` fan-out lineage of the OpenBot parity research run.
Scope of this lineage: frontier node **F-1-004** — how the reference repos connect a bot to apps and
secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree
isolation — plus the sub-questions that evidence opened across thirteen iterations.

Every claim carries a `[SOURCE: path:line]` that resolves in this checkout.

---

## 1. The frame this lineage works inside

OpenBot describes a bot as eight things in four pairs, and says anything not on the list is a kind of
one of them or a setting of one. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:11]

| Pair | Primitive | The question it answers |
| --- | --- | --- |
| Works | Conversations | How do I give it work? |
| Works | Routines | When does it work without being asked? |
| Learns | Memory | What does it know about me and my work? |
| Learns | Skills | What does it know how to do? |
| Uses | **Apps** | Which of my services can it reach? |
| Uses | **Computer** | Where does it browse, run commands and keep files? |
| Answers to you | Approvals | When does it stop and ask me? |
| Answers to you | Activity | What did it do? |

[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:11]

This lineage owns the **Uses** pair and answers the other six from the evidence it gathered, because
the coupling between them is where the design decisions actually live.

---

## 2. The eight parts, one section each

### Part 1 — Conversations

**What OpenBot does.** Conversations is where the work happens, and it "has nothing to configure".
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:139] A conversation
can hold one bot or several, with messages, voice, files and results.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:147]

**What skilled bots has.** `bots run <id>` runs one bot now, in the shared checkout or in its own
worktree, and the executor's own interactive mode is the conversation.
[SOURCE: .skilled/bin/bots.cjs:18]

**The gap.** Several bots in one conversation. Skilled bots has no conversation object at all: a run
is one bot, one prompt, one record.

**Smallest change.** None for this lineage. A multi-bot conversation is a routing question over
`bots run`, and it belongs to whichever lineage owns the Works pair.

### Part 2 — Routines

**What OpenBot does.** A routine is written as a sentence with four parts: **What** (the instruction,
in your words), **Starts** (a time, an event such as a new email or a pull request, or now once — and
a routine can have more than one start), **Does** (acts within your approvals, or only tells you), and
**Until** (you stop it, or it is done when you gave it an outcome to reach).
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:40] A routine with
an outcome is a goal and shows its progress; a routine that only tells you is a check-in.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:50]

**What skilled bots has.** Four triggers — manual, queue, git-hook and launchd — with the git-hook
trigger opt-in and off by default. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:50]
`bots enqueue` takes a source, an event id or a key, a prompt and an origin, and an event sent twice
is a duplicate. [SOURCE: .skilled/bin/bots.cjs:18]

**The gap.** The **Until** part. Skilled bots has no outcome to reach and no progress to show: a run
either finishes or parks.

**Smallest change.** A `until:` line in the routine that names a check the bot runs at the end of
each run, and a `progress:` line it writes. Both are prompt-level, not machinery.

### Part 3 — Memory

**What OpenBot does.** Memory is "what a Bot knows about you and your work: who is on your team,
which sheet is 'the sales sheet', how you like numbers shown. Facts you add are shared with all your
Bots. Facts a Bot picks up while working stay with that Bot."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:61]

**What skilled bots has.** **Nothing.** A case-insensitive grep for `memory` across the whole skill
matches only `node_modules` and one line of `bots-author/SKILL.md`.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/]

**The gap.** The whole part, and it is the only part with **no coupling at all** — which is why it
should be built last rather than first.

**Smallest change.** Two files per identity under the state root: `memory/shared.md` and
`memory/<bot-id>.md`, both appended to the prompt preamble. That is OpenBot's shared-versus-per-bot
split with no database.

### Part 4 — Skills

**What OpenBot does.** A skill is "a named way of doing a task, called with `/`", and it is made in
one of three ways: you write it, you show the bot the task once and it records the steps, or OpenBot
proposes one from your conversations.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:66]

**What skilled bots has.** Skills already exist as `.skilled/skills/*/SKILL.md`, and the spec-kit is
the recording mechanism: a packet records what was done and why.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]

**The gap.** The third way — **proposing** a skill from use. Skilled bots has no path from a run
record to a proposed skill.

**Smallest change.** A `bots propose-skill <run-id>` verb that reads a run record and writes a draft
`SKILL.md` into the bot's own folder for the operator to accept. No new store.

### Part 5 — Apps

**What OpenBot does.** An app is a *connection*: "a person's connections to apps: the accounts they
signed in with so their Bots can act there for them, and an app's one shared account when an
administrator connects it for everybody."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:63] Each app carries "the
actions it offers and the Bots that may use each one", so the grant is per action per bot.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203] Account mode is a
per-app switch between `personal` and `shared`, and switching to shared is itself an approval change.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203] Connecting returns one
of three next steps — `consent`, `form` or `connected` — and coming back from a sign-in page proves
nothing, so `confirmConnection` asks the app whether the account is really connected.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626] An OAuth client is
needed only for a catalogue app whose vendor will not let OpenBot register one itself.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626]

**What skilled bots has.** One repo-wide UTCP config with 14 MCP servers, each a
`manual_call_templates` entry with `call_template_type: mcp`; server environment comes from one
dotenv file; and the whole surface is reached through one launcher that does no per-bot filtering.
[SOURCE: .utcp_config.json:1] [SOURCE: .mcp.json:1]

**The gap.** A per-bot grant. Today every bot can reach every configured server.

**Smallest change.** An `apps:` frontmatter key, a per-run filtered UTCP config written to the run
folder, `HonoredPosture.apps`, and an `apps-unknown-server` checker invariant. **150–250 lines.**

### Part 6 — Computer

**What OpenBot does.** The computer is a container of its own, not a mode of the server, with
entrypoint `/app/bin/openbot-computer`, "so what a Bot's shell can read is what this service is given
below and not the server's own environment". It is loopback-only because "this process drives a
browser holding real logins". The browser is headed by default on the container's own X server,
because bot checks such as Cloudflare's challenge treat headless worse.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1] Files persist on
two volumes, `agent-workspace:/workspace` and `agent-profiles:/profiles`, the second "so logins
survive container restarts". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1]
Each per-bot computer gets its own token derived as `HMAC-SHA256(COMPUTER_TOKEN, label)`, so "a Bot
that reads its own computer's token opens only its own".
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1]

**What skilled bots has.** A git worktree for `isolation: worktree`, with the launcher's shared paths
linked in and a removal path that unlinks links rather than following them.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:5] And a **per-run folder** at
`<skilledTree>/.skilled/skills/.state/system-skilled-bots/<identity>/runs/<runId>`, owner-only, kept
for 200 runs per bot. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:366]

**The gap.** Not persistence — the run folder already is the workspace volume. The gap is that the
run folder is treated as *evidence* and never as a working directory the bot is told about. And the
sandbox is not a container: `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` is true for only `cli-codex`,
`cli-cursor` and `cli-deepseek-harness`; every other kind's sandbox is a tool gate.
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299]

**Smallest change.** Name the run folder in the prompt preamble and start the shell there when
`isolation: shared`; add `bots open <run-id>` for the operator's own browser. **20–40 lines.**

### Part 7 — Approvals

**What OpenBot does.** Approvals "decide when a Bot stops and asks. Sending, sharing, posting and
deleting ask every time. Paying is always handed to you. Everything else follows your rules."
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:88]

**What skilled bots has.** needs-you items: an unattended run that needs a decision "ends instead of
waiting, and leaves one item the operator answers later", and the item's state is derived from its
fields, never stored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1] The CLI
already has the exit vocabulary: exit 5 is "awaiting decision".
[SOURCE: .skilled/bin/bots.cjs:54]

**The gap.** An approval cannot name what it is approving: `NeedsYouItem` has no field for a grant.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1]

**Smallest change.** A `grants: string[]` field on the item. **20–40 lines.**

### Part 8 — Activity

**What OpenBot does.** Activity "is the record of what a Bot did: what it read, changed and sent,
what it was refused, and what you approved. Approvals are the check before an action. Activity is the
check after." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:95]

**What skilled bots has.** A run record with nine blocks, of which `posture` is the only one that
describes what the run was allowed to do.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:1] And a status index with six
tables, none of which has a column for a grant, a secret name or an app.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]

**The gap.** The record says what was *allowed* but not what was *reached*, and the only delivery
channel is `desktop`, which does not acknowledge.
[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45]

**Smallest change.** `HonoredPosture.apps` and `HonoredPosture.secretsUsed`, both lists of names.
**0 lines beyond the two stores that fill them.**

---

## 3. The terminal verdict

**A CLI matches the OpenBot app experience for this slice.** The four surfaces are already four verbs:
`run` (a conversation), `inbox` and `answer` (the approvals inbox), `status` (the activity feed), and
`schedule install` plus `status` (the routine list). [SOURCE: .skilled/bin/bots.cjs:18] The exit codes
already name the states: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before
dispatch, 5 awaiting decision. [SOURCE: .skilled/bin/bots.cjs:54]

| OpenBot app surface | Terminal equivalent | Matches? |
| --- | --- | --- |
| Conversations with a bot | `bots run <id>`, plus the executor's interactive mode | yes |
| Approvals inbox | `bots inbox`, `bots answer <item-id> <text>` | yes |
| Activity feed | `bots status`, `bots status --json` | yes |
| Routine list | `bots status` and `bots schedule install` | yes |
| Vault | `bots secret set` with a no-echo prompt | yes |
| Connections | `apps:` in `BOT.md`, checked by the checker | yes, and simpler |
| Computer | the run folder, opened with `bots open` | yes for files; no for a browser |
| Masked field | a no-echo terminal prompt | yes |

**What a desktop shell would add that a terminal cannot.** OpenBot's Tauri shell is a 1000×800 window
wrapping the same web app, with a bundled CLI, an auto-updater and platform signing.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1] So it adds
four things: a window, a bundled CLI, an auto-updater, and OS integration (a microphone on macOS,
`pkexec` on Linux). Of those, only the auto-updater matters to a small team, and only if the team
installs the product rather than running it from a checkout.

**The one genuine terminal gap** is a headed browser with the operator's live sessions. It is closed
by the operator's own browser plus `bots open`, not by a Tauri shell.

---

## 4. The small team

Skilled bots has **no sign-in**: identity is `owner/name`, resolved from the installed job's pinned
environment variable, then the checkout's `bots/config.json`, then the environment, then the git
origin remote. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:20] The pinned
value outranks the config because "a run with checkout write access could edit to move every lookup
under another identity's empty folders", and a pinned value that is not `owner/name` is refused rather
than skipped. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:57]

OpenBot has three roles — `owner`, `admin`, `member` — where "an owner or an admin governs it: its
people, its sign-in and its policy. A member uses it", and a client reads a role it does not know as a
member. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23491] Only `admin`
and `member` are assignable; `owner` is not.
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23505]

| Question | Answer | Why |
| --- | --- | --- |
| Who may connect an app? | whoever can edit `BOT.md` and run `bots secret set` | there is no second authority to check against |
| Who may approve a use? | whoever answers the needs-you item | the item is a file under the state root, so the filesystem is the permission |
| Shared or per-person secrets? | shared per identity (the repository) | `identityKey` is the repository, not the person |
| Shared or per-person memory? | shared, and it does not exist yet | same reason, and memory is the one part with no coupling |
| Sign-in? | none | the git remote is the identity |
| Roles? | two: the machine's owner, and everyone else | OpenBot's `owner` is not assignable either |

**The one thing a small team does need** is a way to tell *which person* answered an item or set a
secret, because a shared identity erases that. The smallest form is a `by:` field on the needs-you
answer and on the secret record, filled from the OS user or an explicit `--as` flag — one string, no
accounts.

---

## 5. The skip list

| Skipped | Reason |
| --- | --- |
| **Enterprise and multi-tenant** | OpenBot's per-organization vault, per-tenant computer tokens and organization-scoped labels exist to separate tenants. A small team is one tenant, and `identityKey` already separates repositories. |
| **Kubernetes** | OpenBot's supervisor exists to hold the Docker socket and expose "Bot-level verbs" so a container farm can be scheduled. A small team runs one bot at a time on one machine. |
| **Managed upgrade** | The Tauri auto-updater is the only part of the desktop shell a small team would notice, and it matters only to an installed product. A checkout updates with `git pull`. |
| **Mobile** | No repo in the eight ships a mobile client, and the four surfaces are four verbs. |
| **A browser farm** | `COMPUTER_MAX_BROWSERS` defaults to 8 with idle and memory bounds. A small team needs one browser, and it is the operator's. |
| **gVisor** | OpenBot itself leaves `COMPUTER_RUNTIME=runsc` unset by default, and the executor kinds that matter already give an OS boundary. |
| **An OAuth server** | Needed only for a catalogue app whose vendor refuses dynamic registration. A small team uses a key or a shared account. |
| **Per-person OAuth** | turnstone's per-user path is opt-in per `mcp_servers` row and dark by default: "Local-auth Turnstone installs with no `oauth_user` rows exercise zero new code paths." |
| **A connector catalogue** | The UTCP config already names the servers this team has. |
| **A profiles volume** | The operator's own browser profile is the profiles volume and is already logged in. |
| **A TUI** | The four surfaces are four verbs; a TUI over `status --json` is polish, not capability. |
| **openhuman as a source** | GPL-3.0 is copyleft, so nothing from it can be lifted into a permissively licensed product. |

---

## 6. Recommendations — the ranked build order

| # | Slice | Size | Risk | Why here |
| --- | --- | --- | --- | --- |
| 1 | Run folder as the bot's working directory, named in the prompt preamble | 20–40 lines | low | touches nothing; makes an existing store usable |
| 2 | `apps:` frontmatter key, per-run filtered UTCP config, `HonoredPosture.apps`, `apps-unknown-server` invariant | 150–250 lines | medium | a whitelist over an existing config; fails closed |
| 3 | `bots secret set` with a no-echo prompt, per-identity store under the state root, child-environment injection, `HonoredPosture.secretsUsed` | 200–300 lines | medium | the only slice that can leak, so it lands after the two that cannot |
| 4 | `grants` on the needs-you item, so an approval names what it approves | 20–40 lines | low | both stores need it; neither can add it alone |
| 5 | `bots open <run-id>` | 0 lines | none | a documented command, not code |
| 6 | Memory | out of scope | — | couples to nothing, and another pair owns it |

**The first build packet should take slices 1 and 2 together.** They are independent, they total under
300 lines, and together they prove the two claims the design rests on: that a bot can be given a place
to work without a container, and that a bot can be given an app without an OAuth server.

**The reuse list.** Three TypeScript files from rakazo and one from OpenBot, all permissive:

| What | Repo | Path | Licence | Lift or rewrite |
| --- | --- | --- | --- | --- |
| Secret policy vocabulary | rakazo | `packages/core/src/integrations/vault.ts` (174 lines) | Apache 2.0 | lift, keep the NOTICE |
| Leak matcher | rakazo | `packages/core/src/messages/secret-matcher.ts` (199 lines) | Apache 2.0 | lift, compare against `findSecretLiteral` |
| Placeholder guard | rakazo | `packages/core/src/node/secrets-guard.ts` (188 lines) | Apache 2.0 | lift the rule, not the file |
| Per-bot token derivation | OpenBot | `shared/computer-token.ts` (70 lines) | MIT | lift if per-bot tokens are ever needed |
| Container spec | OpenBot | `shared/computer-start.ts` (13 lines) | MIT | read as a checklist |
| Keyring rule | turnstone | the crypto module | Apache 2.0 | rewrite: Python, and the rule is one paragraph |
| Masked-field injection | OpenBot | `api/openapi.yaml` `computer_request_secret` | MIT | rewrite as a no-echo prompt |
| Connection registry | OpenBot | `api/openapi.yaml` apps and connections | MIT | rewrite: the shape is the value |
| **Nothing** | openhuman | — | **GPL-3.0** | **do not lift** |

---

## 7. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| A page-field injection like OpenBot's masked box | skilled bots has no browser, so there is no field to fill | `computer_request_secret` needs a page | 2, 6 |
| A proxy injection like rakazo's `secret_request` | it needs a server that makes the outbound call | rakazo `secret_request` | 5, 6 |
| An external password manager like OpenMausBot's Bitwarden | adds a service, a CLI dependency and a sync loop | `bw://` references | 5, 6 |
| Building an OAuth server | the largest piece of OpenBot's app layer, and a shared account or a key covers the common case | `openapi.yaml:5626` | 3, 7 |
| Per-person connections | they need a sign-in surface and a session store | `openapi.yaml:5203` | 3, 7, 11 |
| A connector catalogue | the UTCP config already names the servers this team has | `.utcp_config.json:1` | 7 |
| A per-bot container | it exists to serve a browser farm; a small team runs one bot at a time | `computer-start.ts:1` | 4, 8 |
| gVisor | OpenBot leaves it unset by default | `COMPUTER_RUNTIME=runsc` | 4, 8 |
| A profiles volume | the operator's own browser profile already is one | `agent-profiles:/profiles` | 4, 8 |
| A `grants` table in the status index | the index is a projection of files, so a table would be a second source of truth | `status-index.ts:165` | 9 |
| A new delivery channel for approvals | `desktop` is the only channel and does not acknowledge; fix the acknowledgement instead | `delivery.ts:45` | 9 |
| Building memory now | it couples to nothing, so it can be added at any time | grep for `memory` | 9, 11 |
| Building a TUI now | the four surfaces are four verbs | `bots.cjs:18` | 10 |
| A Tauri shell | it wraps a web app that does not exist; its value is packaging | `tauri.conf.json:1` | 10 |
| A browser inside the product | the operator's own browser already has the logins | `computer-start.ts:1` | 8, 10 |
| A sign-in system | it would be a second identity beside the one every path already uses | `identity.ts:20` | 11 |
| Three roles | OpenBot's own `owner` is not assignable | `openapi.yaml:23505` | 11 |
| Per-person secret stores | they would break the shared-account case | `openapi.yaml:5203` | 11 |
| Lifting anything from openhuman | GPL-3.0 is copyleft | `openhuman-main/LICENSE:1` | 12 |
| Lifting turnstone's OAuth runtime | it is Python and dark by default | `test_mcp_crypto.py:1` | 12 |
| Copying OpenBot's connection registry | it is an OpenAPI description of a server this product does not have | `openapi.yaml:5203` | 12 |
| Starting with the secret store | the largest slice and the only one that can leak | iteration 6 | 13 |
| Building all four slices as one packet | the first two prove the design; the last two depend on what they learn | iteration 9 | 13 |
| A per-bot MCP filter inside the launcher | the launcher is a pass-through and should not know about bots | `mcp-code-mode-launcher.cjs:1` | 7 |
| A browser capability from the executor matrix | the matrix covers web search, not a browser | `executor-config.ts:299` | 8 |
| A memory module under another name | the runtime has none; the nearest thing is the spec-kit's per-spec documents | grep for `memory` | 9 |
| A per-person key in the state root | `identityStatePaths` keys by identity only | `state-root.ts:117` | 11 |
| A TypeScript secret store in OpenBot | OpenBot's vault is server-side; rakazo's is the only liftable one | `vault.ts:1` | 12 |

---

## 8. Open Questions

1. **Several bots in one conversation.** Skilled bots has no conversation object. This lineage did not
   investigate it because the Works pair owns it, and the answer is a routing question over `bots run`.
2. **The `Until` part of a routine.** No repo in the eight was examined for goal-progress tracking
   beyond OpenBot's own description. A build packet that takes routines needs one more iteration here.
3. **Skill proposal from use.** The mechanism is clear (read a run record, write a draft `SKILL.md`),
   but no repo was examined for how a proposal is reviewed before it becomes a skill.
4. **The encryption key for the secret store.** Iteration 6 established turnstone's rule — a key
   accepted only from a config file, with an ordered list for rotation — but not where skilled bots
   should keep that file.
5. **Whether `desktop` should acknowledge.** Iteration 9 found the only delivery channel does not
   acknowledge. Whether to fix that or add a channel is a decision, not a finding.

---

## 9. References

- `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md` — the eight-part frame.
- `specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml` — the vault, connections, roles.
- `specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts` and `computer-token.ts` —
  the computer's container spec and its per-bot token derivation.
- `specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json` — the desktop shell.
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts` — the
  liftable secret policy layer.
- `specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md` — the opt-in per-user OAuth rule.
- `.skilled/skills/system-skilled-bots/runtime/lib/` — `state-root.ts`, `identity.ts`, `definition.ts`,
  `run-record.ts`, `needs-you.ts`, `status-index.ts`, `delivery.ts`, `isolation.ts`, `repo-config.ts`.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` — the sandbox map.
- `.skilled/bin/bots.cjs` — the thirteen verbs and six exit codes.
- `.utcp_config.json` and `.mcp.json` — the connector surface.

---

## 10. Iteration log

- **Iteration 1** — F-1-004 baseline: OpenBot's app/connection model, the vault as a ninth store, the
  per-identity computer with its handoff, and Skilled's declared-but-unenforced posture. 10 findings,
  newInfoRatio 1.0.
- **Iteration 2** — F-2-005, the vault: write-only credentials, per-organization scope, saved logins
  where use *is* the approval, masked-box injection, and the read/write permission split. 10 findings,
  newInfoRatio 0.9.
- **Iteration 3** — F-2-006, the connection registry: per-action per-bot grants, the personal/shared
  account switch as an approval change, the three connect outcomes, and `confirmConnection` because a
  return from a sign-in page proves nothing. 10 findings, newInfoRatio 0.9.
- **Iteration 4** — F-2-007, the computer: its own container, loopback-only, headed browser by
  default, count/idle/memory bounds, two volumes, per-bot tokens and egress, opt-in gVisor, and a
  start cost measured in minutes. 11 findings, newInfoRatio 0.9.
- **Iteration 5** — F-2-008, the other three repos: rakazo's reference-plus-proxy secrets, turnstone's
  opt-in per-user OAuth and file-only keyring, OpenMausBot's external password manager and
  desktop-as-computer. 12 findings, newInfoRatio 0.85.
- **Iteration 6** — F-3-009, the secret store design: state-root placement, `posture.secrets` as a
  name, child-environment injection, needs-you as the approval, per-identity keying, exit 5, and
  turnstone's keyring rule. 10 findings, newInfoRatio 0.85.
- **Iteration 7** — the connector registry design: one repo-wide UTCP config with 14 servers, one
  dotenv secret path, one pass-through launcher, and the existing environment allowlist — so the
  smallest registry is a per-run filtered config plus an `apps:` frontmatter key. 10 findings,
  newInfoRatio 0.9.
- **Iteration 8** — the computer beyond a worktree: the run folder already is the workspace volume,
  the sandbox is executor-dependent rather than container-provided, and only a headed browser has no
  terminal equivalent. 11 findings, newInfoRatio 0.85.
- **Iteration 9** — cross-part coupling: `NeedsYouItem` has no grant field, the status index has no
  grant column, `desktop` is the only delivery channel and does not acknowledge, and memory does not
  exist at all. 10 findings, newInfoRatio 0.8.
- **Iteration 10** — the terminal verdict: thirteen verbs and six exit codes already are the four app
  surfaces, and the Tauri shell adds a window, a bundled CLI, an auto-updater and OS integration.
  10 findings, newInfoRatio 0.75.
- **Iteration 11** — small-team roles: identity is the repository, so every store is already shared,
  the smallest sign-in is none, and the smallest roles model is two. 10 findings, newInfoRatio 0.8.
- **Iteration 12** — reuse: OpenBot is MIT, four repos are Apache 2.0, and openhuman is GPL-3.0; the
  liftable set is three rakazo TypeScript files and one from OpenBot. 8 findings, newInfoRatio 0.85.
- **Iteration 13** — the ranked build order: coupling and failure mode agree on one order, and the
  first packet should take the run folder and the connector registry together. 8 findings,
  newInfoRatio 0.6.
