# Iteration 11: The small-team model — ownership, memory scope and sign-in

## Focus

The small-team model: who can talk to, approve for and change a Bot, shared versus per-person memory, and the smallest sign-in and roles model for a few people on one machine or a shared host.

## Actions Taken

1. Read OpenBot's personal-edition and team-edition scopes.
2. Read the deployment authentication requirements and the single-user switch.
3. Read the routine creator-grants rule and the memory split.
4. Read the skilled-bots repository identity, user state root and needs-you storage.
5. Read the OpenMausBot licensing carve-out for the enterprise boundary.

## Findings

1. OpenBot's personal edition runs for one person on their own machine: nobody signs in, there is one computer, and the deployment starts with a single Personal Assistant Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-10]
2. OpenBot's team edition adds one "Everyone" admin scope above "Every Bot" and "This Bot"; people, sign-in and policy are how an admin sets the eight primitives, not a ninth primitive. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131]
3. OpenBot requires an identity provider, and its `OPENBOT_SINGLE_USER=true` escape hatch refuses to start on a public address because every visitor would be the administrator. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:143-154]
4. A routine runs as the person who created it, with that person's own grants, so a routine can do exactly what its creator could do in chat and nothing more. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:184-192]
5. OpenBot's memory scope follows origin: facts a person adds are shared with all their Bots, while facts a Bot learns stay with that Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63]
6. Skilled bots keys every label, queue, lease and state folder by repository identity, and keeps the state a run must not write under a user-level root outside every checkout with owner-only permissions. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:30-34]
7. Skilled bots has no sign-in or roles: bots are files changed through git, so change authority is repository write access, and approval authority is whoever can read the user-level state root that holds the needs-you items. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-12]
8. The smallest one-machine model is no sign-in at all: the OS user plus repository write access is the role model, a team-wide shared memory file sits beside a per-bot file, and a per-person file lives in that user's state root. Size S, risk low. [INFERENCE: based on findings 1, 5 and 6]
9. The smallest shared-host model is OS users with 0700 state roots and a 0600 vault, plus an `owner` field in BOT.md naming who may change or approve that Bot; it needs no password store, no roles and no SSO. If a socket or web surface is added later, one shared bearer token is the smallest sign-in, but the terminal does not need it. [INFERENCE: based on findings 3, 6 and 7]
10. Enterprise SSO and the team admin policy layer belong on the skip list: OpenMausBot's `enterprise/` is separately licensed, and OpenBot's team scope exists to administer many people, which a few people on one machine do not need. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:1-12] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131]

## Ruled Out

- Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat.
- Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs.
- Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others.

## Dead Ends

- Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend.
- Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model.

## Edge Cases

- Ambiguous input: none. The small-team question names the authority, memory and sign-in axes.
- Contradictory evidence: none. OpenBot's personal and team editions describe different scales without conflicting.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-10
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:143-154
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:184-192
- .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:1-20
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-20
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:30-34
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:1-12

## Assessment

- New information ratio: 0.9
- Questions addressed: small team (topic question 7)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the repository identity and state root before the OpenBot team scope showed that the small-team model is already OS-level, so the recommendation is a documented ownership field rather than an auth system.
- What did not work and why: Searching for a user model found none, because the runtime deliberately keys state by repository and OS user rather than by application account.
- What I would do differently: Read the personal-edition document first, so the one-person baseline is set before the team edition is assessed.

## Recommended Next Focus

Terminal versus desktop: whether a CLI or TUI can give the OpenBot app experience (conversations, approvals inbox, activity feed, routine list), which repos ship a terminal UI or desktop shell worth copying, and what a Tauri desktop shell adds that a terminal cannot.
