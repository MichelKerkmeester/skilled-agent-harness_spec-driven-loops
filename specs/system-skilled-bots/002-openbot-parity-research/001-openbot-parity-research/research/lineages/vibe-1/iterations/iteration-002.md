# Iteration 2: OpenBot's skills model — three origins, one review gate, snapshot delivery

## Focus
Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

This iteration takes the skills half of the OpenBot baseline: the `Skill` record, the three origins, and the proposal review lifecycle. It completes the OpenBot side of F-1-003 so iterations 3-4 can compare the other repos against it.

## Actions Taken
1. Read the `Skill` and `SkillInput` schemas and the list/replace operation descriptions in `OpenBot-main/api/openapi/skills.yaml`.
2. Read the `LearningProposal` schema in `OpenBot-main/api/openapi/learning.yaml`.
3. Read `OpenBot-main/docs/automatic-learning.md` §"Each person's own Learning space" and §"Reviewing learned skills".
4. Read the skills paragraph in `OpenBot-main/docs/how-openbot-works.md` §4.

## Findings
1. A skill is a named instruction a person runs with `/`, and its record is `slug`, `title`, `summary`, `instructions`, `tools`, `ownerId`, `botIds`, `usableOnYourBots`. The `slug` is both what a person types and the skill's address. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:294]
2. A skill's `tools` list is declarative, not a grant: "The actions it needs, as appId/toolName. Naming one gives no Bot access to it: a Bot uses only what it can already use." A skill can therefore be reviewed and approved without widening any bot's reach. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:314]
3. Skill ownership is three-valued in one record: `ownerId` is a person id, or null when the skill is the organization's; `botIds` is the bots that offer it; `usableOnYourBots` says whether the caller may put it on a bot they own. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:321] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:329]
4. Visibility is computed, not stored per viewer: a caller sees their own skills, the ones granted to a team they are in, and the organization's that are granted to no team; an organization's skill granted to teams is listed only to those teams' people, and an admin sees every skill. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:13]
5. The three origins are named explicitly: "A skill is made in one of three ways: you write it, you show the Bot the task once and it records the steps, or OpenBot proposes one from your conversations." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:68]
6. The "proposed from use" origin is a first-class reviewable object, not a background write. `LearningProposal` carries `runId` (the run that proposed it), `operation` (`add | update | remove`), `status` (`pending_review | approved | rejected`), `title`, `description`, `reason`, `reviewedAt` and `publishedSkillId`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2146]
7. Approval is what publishes: `publishedSkillId` is "The skill an approval published. Null until approved." A proposal is therefore a staging record that becomes a skill only on approval, and `operation: remove` means the same pipeline can retire a skill. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2167]
8. A proposal must be readable before it can be judged: opening a waiting skill "shows its SKILL.md, why it was proposed, and the conversations and recordings it was learned from." The review artifact is the skill file itself plus its evidence, not a diff summary. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78]
9. Delivery is a per-run snapshot, not a live lookup: shipped remote agents "receive the server-selected, verified skill snapshot for each run". A run's skills are fixed when the run starts. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:107]
10. Learned guidance never widens capability: "Keep existing tool grants, boundaries, credentials, and manually authored slash skills in place: learned guidance does not grant tools or replace them." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:107]
11. Skill precedence on a run is a fixed three-level order: the bot's own published skills, then the person's own, then any skills another person opened; on a name clash the bot's own wins, then the person's own, and two people's same-named skills are both kept as `<their container>/<name>`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:65]
12. Sharing is a per-person three-way choice — only their own bots (the default), every bot in the deployment, or the skills they open one by one — and an admin must allow the wider choice first. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:66] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:75]
13. The sharing index is held in memory and re-read at once on the replica that saved a change and within 30 seconds elsewhere, so no run asks each person's container who shares what. A missing, refusing or slow person container never fails a run. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:66]
14. Skilled bots has no per-bot skill record. A `BOT.md` has no skills field, so a bot's skills today are whatever the shared skill system discovers, not a list the bot owns. [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:1]

## Ruled Out
- Treating `tools` on a skill as a capability grant. The schema says naming an action gives no bot access to it, so a skill cannot be used to escalate a bot's reach and does not need a grant check at approval time.
- Modelling the three origins as three storage locations. All three produce the same `Skill` record; only the proposal path adds a staging row, so the origin is provenance rather than a separate store.

## Dead Ends
- Searching `skills.yaml` for a "taught" or "recorded" origin field returned nothing. The recorded-from-a-demonstration origin is not a field on `Skill`; it is a Learning path that ends in the same record. Any design that adds an `origin` column to a skill store is inventing a distinction OpenBot does not persist.

## Edge Cases
- Ambiguous input: none. The node names skills; this iteration covers the OpenBot skills baseline.
- Contradictory evidence: none. The spec, the how-it-works doc and the automatic-learning doc agree on the three origins and the approval gate.
- Missing dependencies: OpenBot's Learning service is external (CopilotKit Intelligence), so the proposal-generation algorithm is not in this checkout. Fallback used: the proposal contract and the review UI description, which fix what a proposal must carry and what a reviewer must see. Recorded as a confidence limit on "how proposals are generated".
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:1-180
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:294-360
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124-2180
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:22-90
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:107
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:64-70
- .skilled/skills/system-skilled-bots/assets/bot-template.txt:1-33

## Assessment
- New information ratio: 1.0
- Questions addressed: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- Questions answered: none fully. The OpenBot baseline for both halves of F-1-003 is now evidenced; the other repos and the mapping remain.

## Reflection
- What worked and why: reading the `Skill` schema before the Learning docs. Seeing that `tools` is declarative and that `ownerId`/`botIds` carry the scoping made the Learning material read as "how a skill gets created", not "how a skill gets permission" — which is the distinction that decides how small a parity change can be.
- What did not work and why: looking for an origin field on `Skill`. The three origins converge on one record, so the search was answering a question the design deliberately does not ask.
- What I would do differently: read the proposal schema before the review prose. The `operation: add | update | remove` enum is the finding that matters for a small team, because it means one review queue covers creation, edit and retirement rather than three.

## Recommended Next Focus
The other repos' skill stores, starting with `hermes-muse-main/skills`: what a skill file looks like there, whether it is a directory or a single file, and whether it is close enough to a `SKILL.md` to lift. That is the first comparison point against the OpenBot baseline just established.
