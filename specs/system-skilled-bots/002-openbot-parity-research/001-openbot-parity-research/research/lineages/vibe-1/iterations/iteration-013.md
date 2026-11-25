# Iteration 13: The skip list, the reuse inventory and the ranked build order

## Focus
The skip list and the reuse inventory: which enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts to leave out with a reason each, and which code is liftable with repo, path and license. This is the last iteration before synthesis.

## Actions Taken
1. Verified the licence of all eight reference repos from their `LICENSE` files.
2. Read OpenBot's `personal-edition.md` for the two-edition model and what even the personal edition runs.
3. Read the Kubernetes and managed-upgrade docs for what those parts actually do.
4. Measured the mobile app.
5. Read `routines.md` and `approvals.md` for the two parts not yet sourced, and to fix the build order.

## Findings
1. OpenBot has exactly two editions: `OPENBOT_EDITION=personal` "runs OpenBot for one person on their own machine: nobody signs in, there is one computer, and the deployment starts with a single Bot"; unset, or `team`, is OpenBot as an organization runs it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:3]
2. Even the personal edition runs PostgreSQL, the one computer and the server, and no supervisor and no bundled Bot containers. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:33]
3. The Kubernetes part is release promotion: `bun scripts/update.ts kubernetes plan|apply|gitops` around an `openbot` Helm chart, checking the manifest's image digest and the chart archive checksum before invoking Helm. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:3]
4. The managed-upgrade part is a management agent the `openbot` chart installs into the cluster, which connects to CopilotKit's management service by default. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3]
5. The mobile part is a full React Native app: 632 files under `mobile/`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/mobile/ (632 files)]
6. A routine is "a standing instruction: something a Bot carries out on a schedule instead of waiting to be asked", and its reply lands in a channel like any other message. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3]
7. Routines, goals and check-ins are one list drawn from three stores, and every row is the same sentence in four parts: What it is, Starts, Does, and Until. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:16]
8. Approvals resolve in a fixed order where the first answer wins: kinds of action, then rules, then auto-review, then extra vigilant; and "the strictest one that matches wins, so a team rule that asks beats anything you allowed". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3]
9. Six kinds of action ask in every edition whatever the person's own switch says: deleting, sending to other people, sharing, posting, paying, and changing a password or account settings. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:5]
10. Licences: OpenBot, OpenGhost and hermes-muse are MIT; OpenMausBot, rakazo, turnstone and buzz are Apache-2.0; openhuman is GPL-3.0. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:2]
11. openhuman's GPL-3.0 means its TUI code cannot be lifted into a permissively licensed tree: only its shape — the four tabs, the overlay approvals, the six activity statuses — is reusable. [INFERENCE: based on finding 10]
12. The skip list, with a reason each: Kubernetes (release promotion for a cluster a small team does not run), managed upgrades (a vendor agent tied to that chart), multi-tenant (memory scoped per organization when a small team is one organization), enterprise roles (an `admin` tier that governs sign-in when there is no sign-in), mobile (632 files for a client that cannot run a launchd job), and PostgreSQL plus Compose (a database server and a container supervisor where the runtime is a Node CLI with a SQLite index). [INFERENCE: based on findings 1 through 5 and iteration 12]
13. The reuse inventory, with repo, path and licence: OpenBot's four-part routine sentence (`docs/routines.md:16`, MIT), OpenBot's approvals precedence ladder (`docs/approvals.md:3`, MIT), OpenBot's derived review state and idempotent approve (`api/openapi/learning.yaml:1130`, MIT), OpenGhost's bounded memory with a tidy rewrite (`memory.js:11`, MIT), and hermes-muse's staged-write pinning rule (`skills/companion/references/memory.md:20`, MIT). [INFERENCE: based on findings 6 through 10]
14. Four of the five reusable items are documents or patterns rather than code, which is the point: the parts worth copying are the rules, and the code that enforces them is small enough to write. [INFERENCE: based on finding 13]
15. The ranked build order, smallest first: the memory store, the memory review item, the skill proposal store, the memory source sync, routines as sentences, the approvals ladder, and the terminal client last. [INFERENCE: based on iterations 6 through 12]
16. The memory store comes first because it is the only item that adds a new file shape, and every later item reads it: the review item reviews a fact, the proposal store reviews a skill, and the sync writes facts. [INFERENCE: based on iteration 7 and finding 15]
17. The terminal client comes last because it draws the four surfaces the earlier items create, and building it first would mean drawing empty screens. [INFERENCE: based on iteration 11 and finding 15]
18. The whole build is seven items, none of which needs a new service, a database server, a container or a sign-in. [INFERENCE: based on findings 12, 15 and 16]

## Ruled Out
- Lifting openhuman's TUI code. GPL-3.0 cannot be relicensed into this tree, so only the shape transfers.
- Lifting OpenBot's desktop shell. Its native side installs and supervises Compose, which this runtime does not have.
- Keeping the multi-tenant memory scope. A small team is one organization, so the second scope would be a branch nothing takes.
- Building the terminal client first. It would draw four empty surfaces until the memory, review, proposal and routine items exist.

## Dead Ends
- Looking for a permissively licensed terminal client to lift. The only one in the set is openhuman's, and it is GPL-3.0.

## Edge Cases
- Ambiguous input: none. The node names the skip list and the reuse inventory.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-60
- specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-12
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:1-10
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:1-30
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:1-20
- specs/system-skilled-bots/context/OpenBot-main/mobile/ (632 files)
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1
- specs/system-skilled-bots/context/openhuman-main/LICENSE:2
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1

## Assessment
- New information ratio: 0.87
- Questions addressed: Which enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts to skip and why; which code is liftable with repo, path and licence; what order to build in.
- Questions answered: Which enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts to skip and why; which code is liftable with repo, path and licence; what order to build in.

## Reflection
- What worked and why: reading `personal-edition.md` before the skip list. It shows OpenBot itself ships a one-person, no-sign-in edition, so the skip list is not a list of things OpenBot lacks — it is a list of things the `team` edition adds for organizations larger than this one.
- What did not work and why: looking for a permissively licensed terminal client. The only one is GPL-3.0, so the terminal item has to be written rather than lifted, which is why it sits last.
- What I would do differently: check licences before reading any code. Two of the most attractive pieces — openhuman's TUI and its activity projection — turned out to be unusable as code, and knowing that first would have changed which files I read closely.

## Recommended Next Focus
Synthesis: name all eight OpenBot bot parts with a resolving source each, state the terminal verdict, the small-team section and the skip list, and end with the ranked build order.
