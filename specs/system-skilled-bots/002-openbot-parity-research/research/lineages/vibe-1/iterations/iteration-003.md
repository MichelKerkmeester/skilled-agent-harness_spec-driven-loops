# Iteration 3: hermes-muse — one skill directory, and memory borrowed from the host

## Focus
Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

This iteration takes the `hermes-muse-main` comparison point for both halves of the node: its skill store and its memory model.

## Actions Taken
1. Enumerated `hermes-muse-main/skills` and read `skills/companion/SKILL.md`.
2. Read `skills/companion/references/memory.md` end to end.
3. Read the `disposition` field in `skills/companion/references/interface.md`.
4. Grepped `docs/DESIGN.md` for the memory-upkeep job, the compaction hook and the state store.

## Findings
1. hermes-muse ships exactly one skill, `companion`, and a skill is a directory of markdown: `skills/companion/SKILL.md` (31 lines) plus 21 reference files under `skills/companion/references/`. There is no skill database and no per-skill record. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:1]
2. The SKILL.md frontmatter is only `name`, `description` and `version`. There is no tools list, no owner, no bot list and no review state — the fields OpenBot's `Skill` record carries are simply absent. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:1]
3. The skill body is a router, not a procedure: it names the two tools (`muse_manage` for the user's conversation, `muse_job` for its own runs) and then points at reference files by topic. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:7]
4. Field types and limits live in exactly one generated file: "All fields, types and limits are in [interface](references/interface.md). That file is generated from the code, so no other page repeats it." This is the cheapest anti-drift device in any of the reference repos. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:11]
5. hermes-muse refuses to own a second memory store: "Native memory (or the configured provider) holds what the user said about themselves. Muse does not keep a second user profile, and it never rewrites SOUL, USER or MEMORY." [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:3]
6. Memory intake is a scheduled job, not a chat-time write: "each hour the job sees new private user messages as short excerpts", and each message is classified `saved` (with `facts`), `context` or `ignored`. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:6]
7. The classification is a required enum on the job's submit payload, so a run cannot finish without deciding what each message was: `disposition` is required and is `saved / ignored / context`. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/interface.md:242]
8. Secrets are excluded by construction rather than by policy: "Never save secrets: excerpts are redacted, so keep them that way." [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:9]
9. A model's own output is not memory: "Do not save guesses or summaries Muse produced itself as if the user said them." [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:10]
10. A full store is compacted, never truncated: merge duplicates or shorten verbose entries in the same batch that saves the new fact, and "Never delete an entry outright; Muse refuses that write". [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:11]
11. The compaction rule is enforced in code, not prose: a `pre_tool_call` hook "refuses a native `memory` call with more removes than patches, and every change is recorded by code. Muse never writes the memory files itself." [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md:123]
12. Staged writes are approved from the CLI, not a web page: `/memory approve <id>`, `/memory reject <id>` and `/memory pending` list and resolve them. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:17]
13. A patch or remove is pinned to the exact entry it matched, so a concurrent cleanup invalidates the approval rather than silently applying to a different entry. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:19]
14. The upkeep job is `memory-upkeep`, hourly and local, and a store at least 90% full is named in the packet as `memory_full` (at most 3 per packet). [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md:134] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md:163]
15. All operational state lives in one SQLite file, `muse/state-v2.db` (WAL), as `entity` rows with an `event` log kept 30 days — one store for goals, notices, receipts and watermarks. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md:57]
16. The licence is MIT, so the skill directory and the memory reference are liftable with attribution. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1]

## Ruled Out
- Copying hermes-muse's `SKILL.md` frontmatter as a skill record. It carries three fields and no scoping, so it cannot express who may use a skill or which bot offers it; the OpenBot `Skill` record is the better shape and the Skilled `SKILL.md` frontmatter is already richer.
- Building a second memory store beside the host's. hermes-muse explicitly declines to, and the reason is structural: two stores drift and the model cannot tell which is authoritative.

## Dead Ends
- Looking for a skill-proposal or skill-review path in hermes-muse. There is none: its one skill is hand-authored and shipped, so it offers no evidence for the "proposed from use" origin. That origin has to be answered from OpenBot and from Skilled's own spec-kit, not from this repo.

## Edge Cases
- Ambiguous input: none. The node names `hermes-muse-main/skills`; this iteration reads that directory and the memory reference it points at.
- Contradictory evidence: none.
- Missing dependencies: hermes-muse's host (Hermes) is not in this checkout, so the native memory tool's own contract is unavailable. Fallback used: the plugin's own reference file, which states what it will and will not write. Recorded as a confidence limit on the native store's format.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md:1-31
- specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:1-29
- specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/interface.md:240-246
- specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md:9-164
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1

## Assessment
- New information ratio: 1.0
- Questions addressed: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- Questions answered: none fully. The hermes-muse comparison is now evidenced for both halves.

## Reflection
- What worked and why: reading `memory.md` before `DESIGN.md`. The reference file states the rules the model must follow, and `DESIGN.md` then showed which of those rules are enforced in code — that split is the reusable idea, because a rule stated only in prose is a rule a model can drift from.
- What did not work and why: looking for a skill proposal path. hermes-muse ships one hand-authored skill, so it has no learning loop to compare; the absence is itself the finding.
- What I would do differently: read `interface.md` first. It is generated from the code, so it is the only page that cannot be stale, and it would have told me the `disposition` enum before I read three prose pages to infer it.

## Recommended Next Focus
`openhuman-main` and `OpenGhost-main` memory stores: whether either keeps a per-bot or per-person memory on disk that a small team could copy instead of building one, and what its record shape is. That closes the repo comparison for F-1-003.
