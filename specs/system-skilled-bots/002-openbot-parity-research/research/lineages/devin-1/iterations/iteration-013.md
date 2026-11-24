# Iteration 13: Final synthesis — the eight-part gap table and a ranked build order

## Focus
Final synthesis: the eight-part gap table with the smallest change, size and risk for each part, followed by a ranked build order. This iteration assembles the answers from iterations 1-12 rather than opening new sources.

## Actions Taken
- Consolidated every part answer from the preceding twelve iterations.
- Sized each proposed change against the existing runtime modules.
- Ranked the changes by dependency order and visible value.
- Carried forward the skip list and the reuse ranking as constraints.

## Findings
1. **Conversations.** OpenBot keeps server-owned transcripts that can hold several bots, each answering in its own attributed thread; skilled bots has no conversation surface, only a chain of runs. The smallest change is a `bots chat` command rendering a transcript from run records, plus a `conversation` id on the request and one message row per human message, delivery and answer. Size M, risk low. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:10-31] [SOURCE: .skilled/bin/bots.cjs:19-50]
2. **Routines.** OpenBot's four-part sentence (What, Starts, Does, Until) with goals and check-ins as variants maps onto skilled bots' cron, queue, git-hook and manual triggers; the only missing part is an outcome. The smallest change is an optional `until:` block in BOT.md plus a `bots routines` list, with event starts fed by the existing queue. Size M, risk medium. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:12-28] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:14-40] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-38]
3. **Memory.** OpenBot's team-only, provenance-gated memory maps onto typed per-bot and shared memory files with actor, source, bot and date, appended by `bots remember` and prepended to the prompt. Size S, risk low. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:370-383] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58]
4. **Skills.** OpenBot's written, recorded and proposed skills map onto a proposed `SKILL.md` plus evidence written into a packet's `scratch/proposed-skills/`, reviewed before installation in `.skilled/skills/<name>/`. Size S, risk low. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:64-70] [SOURCE: .skilled/skills/sk-doc/SKILL.md:1-10]
5. **Apps.** OpenBot's admin-granted connectors and vault map onto Code Mode MCP plus one `bots vault` surface backed by the OS keychain or an age-encrypted file, with a per-bot secret-name allowlist. Size M, risk medium. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:325-341] [SOURCE: .devin/skills/mcp-code-mode/SKILL.md:1-20]
6. **Computer.** OpenBot's browser-and-folder computer needs no new machinery: the worktree and posture matrix already are the bot's computer, and an optional path allowlist covers a folder outside the tree. Size S, risk low. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:129-142] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]
7. **Approvals.** OpenBot's ordered action policy and four answers map onto an `actor` field on the definition approval, the needs-you answer and the run record, plus optionally the lifted action-kind classifier. Size S-M, risk medium. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-31] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:3-16] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:3-17]
8. **Activity.** OpenBot's audit-before-action rule and seven lifecycle groups map onto one `bots activity` read over run records, delivery entries and result events, using the same seven group ids. Size S, risk low. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:41-52] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:6-45] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:70-190]
9. **Ranked build order.** The order is: `bots chat`, `bots activity`, the actor field, `bots remember`, `bots routines` with `until:`, `bots learn`, `bots vault`, the action classifier, and a Tauri shell only last if the terminal proves insufficient. Each step names a module or field that already exists, which is why none is an L. [INFERENCE: based on findings 1-8]
10. **Verdict.** Terminal-first is sufficient for every part; OpenBot's distinctive value is its ordered policy and its record, not its window. [INFERENCE: based on findings 1-9]

### Gap table

| Part | Smallest change | Size | Risk |
| --- | --- | --- | --- |
| Conversations | `bots chat` transcript, conversation id, message rows | M | Low |
| Routines | `until:` block plus `bots routines` list; event starts via queue producer | M | Medium |
| Memory | Typed per-bot and shared memory files; `bots remember` | S | Low |
| Skills | `bots learn` proposed SKILL.md reviewed in a packet | S | Low |
| Apps | `bots vault` plus per-bot secret allowlist | M | Medium |
| Computer | Document worktree as the computer; optional path allowlist | S | Low |
| Approvals | `actor` on approval, answer and run record; optional action classifier | S-M | Medium |
| Activity | `bots activity` grouped over run records, delivery and result events | S | Low |

### Ranked build order

- **Step 1 — `bots chat` transcript and conversation id** (M, low risk). The visible surface everything else hangs from, reading records the runtime already writes. The shape is openhuman-tui's transcript plus composer, as a design reference only because it is GPL-3.0.
- **Step 2 — `bots activity` grouped view** (S, low risk). Lift OpenBot's MIT `activity-groups.ts` and `activity-rows.ts` and group existing run records, delivery entries and result events.
- **Step 3 — actor on approvals, answers and run records** (S, low risk). One field per record, taken from the host identity; the shared-host prerequisite.
- **Step 4 — `bots remember` memory files** (S, low risk). Per-bot and shared typed files with provenance; turnstone's memory model (Apache-2.0) is the reference.
- **Step 5 — `bots routines` list and `until:` outcome** (M, medium risk). The list is a read; the outcome adds one optional BOT.md block and a completion check in the runner.
- **Step 6 — `bots learn` proposed skills** (S, low risk). Writes a proposed `SKILL.md` and evidence into a packet; review installs it.
- **Step 7 — `bots vault` and per-bot secret allowlist** (M, medium risk). Keychain-backed secrets with references in BOT.md; the dispatch literal scanner stays as the last line of defence.
- **Step 8 — action-kind classifier for approvals** (M, medium risk). Lift OpenBot's MIT `tool-name.ts` only after the actor field exists, so a decision names both what and who.
- **Step 9 — desktop shell (Tauri) last.** OpenBot's own desktop layer exists to install engines, supervise containers, manage updates and grant OS folder authority, none of which is needed to reach parity on the eight parts.

## Ruled Out
- A desktop-first build. Iteration 1 found that OpenBot's chat surface is the web app and its Tauri layer is engine and update management.
- A server or database for conversations, memory, skills or activity. Each maps to files the runtime already writes, and the queue already provides atomic claims.
- Any enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile work (iteration 11).

## Dead Ends
- Looking for one OpenBot component that could be lifted wholesale. The value is distributed across small pure modules and policy documents; the UI is not portable.
- Treating the eight parts as independent. Conversations, activity and approvals share the run record and the actor field; building them in the ranked order avoids writing that record three times.

## Edge Cases
- Ambiguous input: "as close to OpenBot as possible" could mean feature-for-feature or experience-for-experience. The topic's own scoping sentence — only what a small team needs, terminal preferred — was treated as authoritative.
- Contradictory evidence: OpenBot's personal edition has no memory while its how-it-works page describes memory without qualification; the architecture page's edition boundary was treated as authoritative.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- All sources cited in iterations 1-12, consolidated rather than re-read.
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts
- specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts
- .skilled/skills/system-skilled-bots/runtime/lib/README.md
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts

## Assessment
- New information ratio: 0.55
- Questions addressed: the eight-part gap table and the build order
- Questions answered: final synthesis

## Reflection
- What worked and why: sizing each change against an existing module kept the table honest. Every "smallest change" names a file that already exists or a field that already has a home, which is why the sizes are S or M and not L.
- What did not work and why: ranking by value alone put the desktop shell high because it is the most visible OpenBot surface; ranking by dependency and risk moved it last, which matches the topic's terminal preference.
- What I would do differently: validate the two riskiest items (the `until:` completion check and the action classifier) with a small prototype before committing a build packet to them.

## Recommended Next Focus
No further research focus. The packet is ready for synthesis: eight parts answered, nine additional questions answered, skip list and reuse ranked, and a build order a first packet can start from.
