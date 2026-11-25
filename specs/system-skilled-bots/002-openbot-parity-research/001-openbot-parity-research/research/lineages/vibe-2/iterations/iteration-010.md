# Iteration 10: The terminal verdict for the apps and computer slice

## Focus

Broadening pass. Decision D4 prefers a terminal over a desktop app when it can match OpenBot's, so this iteration tests that preference against the slice this lineage owns: can a CLI give the OpenBot app experience for **apps, secrets and a bot's computer**, and what exactly would a desktop shell add? The angle is the verdict, not the design.

## Actions Taken

1. Read the `bots` CLI's full usage block and its exit vocabulary.
2. Listed OpenBot's app component folders to size the desktop surface.
3. Read the Tauri configuration for what the shell actually is.
4. Checked the bundled-CLI and platform-specific configuration files.

## Findings

1. The `bots` CLI **already has thirteen verbs covering the four app surfaces**: `run` (a conversation), `inbox` and `answer` (the approvals inbox), `status` (the activity feed), and `schedule install` plus `status` (the routine list). [SOURCE: .skilled/bin/bots.cjs:18]
2. The CLI has a **documented exit vocabulary that maps to the app's states**: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision. [SOURCE: .skilled/bin/bots.cjs:54]
3. `status --json` is the **machine-readable form**, so a TUI would be a renderer over an existing command rather than a new API. [SOURCE: .skilled/bin/bots.cjs:18]
4. OpenBot's app is **forty-plus component folders** — `admin`, `approvals`, `audit`, `bots`, `browser`, `channels`, `computer`, `connections`, `decisions`, `delivery`, `desktop`, `gallery`, `learning`, `manage`, `memory`, `moves`, `needs-you`, `notifications`, `onboarding`, `passwords`, `plan`, `plugins`, `recorder`, `responsibilities`, `routines`, `settings`, `skills`, `tasks`, `team-grants`, `teams`, `vault`, `what-if`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/]
5. The Tauri shell is **a 1000×800 window wrapping the same web app**, with a bundled CLI, an auto-updater and platform signing. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1]
6. So the desktop shell adds **four things a terminal cannot**: a window, a bundled CLI, an auto-updater, and OS integration (a microphone on macOS, `pkexec` on Linux). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1]
7. Of those four, **only the auto-updater matters to a small team**, and it matters only if the team installs the product rather than running it from a checkout. [INFERENCE: from findings 5 and 6 — a window is a preference, a bundled CLI is a packaging choice, and OS integration serves the browser and voice features this slice does not have]
8. The apps/computer slice **needs none of the four**: a connector grant is a frontmatter edit, a secret is a `bots secret set`, and a computer is a run folder. [INFERENCE: from iterations 6, 7 and 8]
9. The one genuine terminal gap is the **masked field**, and a terminal can close it: OpenBot's secret injection needs a person to type into a box the bot cannot read, and a no-echo prompt is the same guarantee with less machinery. [INFERENCE: from iteration 2 finding 6 and iteration 6 finding 3]
10. **Verdict: a CLI matches the OpenBot app experience for this slice.** The four surfaces are already four verbs, the exit codes already name the states, and the TUI is optional polish rather than a missing capability. [INFERENCE: from findings 1, 2, 3 and 8]

## The verdict, stated plainly

| OpenBot app surface | Terminal equivalent | Matches? |
| --- | --- | --- |
| Conversations with a bot | `bots run <id>`, plus the executor's own interactive mode | yes |
| Approvals inbox | `bots inbox`, `bots answer <item-id> <text>` | yes |
| Activity feed | `bots status`, `bots status --json` | yes |
| Routine list | `bots status` (installed schedules) and `bots schedule install` | yes |
| Vault | `bots secret set` with a no-echo prompt | yes |
| Connections | `apps:` in `BOT.md`, checked by the checker | yes, and simpler |
| Computer | the run folder, opened with `bots open` | yes for files; no for a browser |
| Masked field | a no-echo terminal prompt | yes |

**What a desktop shell would add that a terminal cannot:** a window, an auto-updater, and OS integration for voice and for the browser. None of the three is in this slice, and the auto-updater is the only one a small team would notice.

## Ruled Out

- Building a TUI now: the four surfaces are four verbs, and a TUI over `status --json` is a rendering exercise that can follow the stores rather than precede them.
- A Tauri shell: it wraps a web app that does not exist, and its value is packaging rather than capability.
- A browser inside the product: the operator's own browser already has the logins, which is what OpenBot's profiles volume exists to preserve.

## Dead Ends

- Looking for a terminal UI in the other seven repos: none ships one. OpenMausBot is Electron, OpenBot is Tauri plus a web app, and the rest are servers or CLIs without a TUI.

## Edge Cases

- Ambiguous input: "the OpenBot app experience" could mean the visual design or the four surfaces. Selected interpretation: the four surfaces, because D4 asks whether a terminal can *match* the experience, not reproduce it.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/bin/bots.cjs:18-60
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-50
- specs/system-skilled-bots/context/OpenBot-main/desktop/ (directory listing)

## Assessment

- New information ratio: 0.75
- Questions addressed: whether a CLI can match the OpenBot app experience for apps, secrets and computer; what a desktop shell adds
- Questions answered: whether a CLI can match the OpenBot app experience for apps, secrets and computer; what a desktop shell adds

## Reflection

- What worked and why: reading the CLI's usage block as a *product surface* rather than as documentation. Thirteen verbs and six exit codes are a complete app in text form, and the comparison to forty component folders is the whole verdict.
- What did not work and why: expecting the Tauri shell to be a separate application. It is a window around the same web app, so its value is packaging, and packaging is not a capability a small team is missing.
- What I would do differently: count the surfaces before reading the components. The four-surface frame came from the CLI, and it made the forty folders legible as variations rather than as requirements.

## Recommended Next Focus

Small-team roles for apps and secrets: who may connect an app, who may approve a use, and whether memory is shared or per person — the smallest sign-in and roles model that works for a few people on one machine or a shared host.
