# Iteration 7: Phases 009-skills and 010-conversations

## Focus
Per-phase evidence for `009-skills` (the `skills:` list, the prompt block, the two caps, `bots skill propose` and the checker invariants) and `010-conversations` (the `chat` verb, the message record, the conversation prompt block, `@bot` routing, the resumed answer). The pair is taken together because a skill body and a conversation block share the same prompt budget, and because the reference wraps one inside the other.

## Actions Taken
1. Read 009's requirement table and its measured budget figures.
2. Read OpenGhost's `skills.js` name grammar, mention grammar and block wrapper.
3. Read OpenGhost's `rules.js` event table and matcher grammar, then searched the whole build plan for an owning phase.
4. Read 010's child 002 scope boundary and its exclusion list, and OpenBot's transcript paragraphs in `docs/architecture.md`.

## Findings

1. **A skill name is never validated as a path segment, and the reference has a grammar plus this packet already has the rule for bot ids.** 009 requires `skills` to parse as a list of skill names and requires an unresolvable name to refuse `skill-unknown`, and the body is read from `<skilledTree>/.skilled/skills/<name>/SKILL.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] Nothing in the requirement table constrains the name's characters. The reference's grammar is `^[a-z0-9][a-z0-9-]{0,63}$` — one line, applied before any lookup. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:10] And 005 already carries the equivalent rule for the other identifier that becomes a path: "a bot id that is not a safe segment is refused by name instead of becoming a path". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:164] **Observed.** A definition naming `skills: ["../../etc"]` makes the resolver build a path outside the skills tree; a name with an uppercase letter or a dot resolves to nothing and refuses `skill-unknown`, which is a misleading refusal for a name that was never legal. The fix is the reference's grammar with a refusal name of its own (`skill-name-invalid`), validated in the same place 005 validates a bot id.

2. **OpenGhost's hook rules engine has no owning phase, and the earlier synthesis defers it to "later per-action policy" with nothing to land on.** `rules.js` is 703 lines carrying fifteen event types with a named matcher source each — `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Notification`, `SubagentStart`, `SubagentStop`, `StopFailure`, `PreCompact`, `PostCompact`, `PostModelSwitch` and the rest — plus a matcher grammar ("empty or `*` for all; letters, digits, `_`, `-`, spaces, commas and `|` as exact names") and a `Name(args)` rule grammar. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:19-37] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:117-119] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:138] The earlier synthesis lists the lift as "`/name` skill parser, hook rules engine … Skills, later per-action policy". [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:130] Searching every phase spec for `hook` finds only the git-hook trigger, and 009 mentions no hook at all. **Observed.** So the mechanism is in neither the plan nor the skip list, and it is the largest single capability in either of these phases' sources: per-action policy is what lets a host say "never run `rm -rf`", "always format after a write" or "ask before a push" without a person present. It belongs in the net-new ranking (iteration 10) as well as here, because its size is known and its licensing is clean — OpenGhost is MIT.

3. **The reference injects a skill by mention and keeps it across a conversation summary; the plan injects only declared skills, which is auditable but removes mid-conversation invocation.** OpenGhost finds a skill named in a message with `/(^|[\s(])\/([a-z0-9][a-z0-9-]{0,63})(?=$|[\s.,;:!?)])/g`, hands the instructions wrapped in `<skill_content name="…">`, and re-finds those blocks with a second regex so a summary of the chat keeps them. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:9-13] The plan has no mention path: a bot's skills come from its definition, and the block is inserted at a fixed prompt position. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] **Observed.** The evidence supports the plan for a governed host — a declared list is what makes the checker's three invariants possible and what makes a run's posture reviewable — and the loss is a person's ability to call a skill mid-conversation. The reference's second regex is the part worth keeping in mind: if a later phase adds mentions, the block must survive the conversation budget's oldest-message eviction, and a wrapper the eviction can recognise is the only way to do that.

4. **The plan excludes bot-to-bot handoff and cites the exact rule that makes the exclusion load-bearing.** 010 routes human messages only, and the exclusion names OpenBot's rule: a bot naming a peer `@Name` hands off "under the same grants and caps". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:111] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:189] **Observed.** The confirm matters because the alternative is posture escalation: a handoff that started a run under the *target* bot's own posture would let a `workspace-write` bot reach a `danger-full-access` peer by naming it. The plan's exclusion is the cheapest correct answer, and the reference's rule is the citation a later phase needs if it ever adds handoff.

## Ruled Out
- **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills.
- **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such.
- **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding.

## Dead Ends
- A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2.
- 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule.

## Edge Cases
- Ambiguous input: "skills" could mean the Skilled repository's own `.skilled/skills/` catalogue, which is exactly what the plan reads. No ambiguity remained after REQ-002's path.
- Contradictory evidence: none.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenGhost-main/skills.js
- specs/system-skilled-bots/context/OpenGhost-main/rules.js
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md

## Assessment
- New information ratio: 0.88
- Questions addressed: 009-skills reference grammar, wrapper and mention path; 010-conversations transcript and handoff rules; the unowned hook rules engine.
- Questions answered: 009 is answered with one missing guard and one large unowned capability; 010 is answered with a confirmed exclusion and no reference to mirror for its own records.

## Reflection
- What worked and why: searching the *whole plan* for one word (`hook`) after finding a large reference capability. The negative result converted a plausible "later phase owns it" assumption into a citable absence in one call.
- What did not work and why: expecting 010 to have reference-side evidence. Its records are packet-internal contracts, so the only reference material is two paragraphs of architecture prose; the phase is essentially net-new and the finding had to be about the exclusion rather than the design.
- What I would do differently: for every phase, grep the plan for the *mechanism's* name rather than the phase's, because a capability can be named in a lift table and owned by no folder.

## Recommended Next Focus
Phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review: the three proof and alignment phases, which need evidence for whether the references carry a manual test script, a documentation-alignment check or a review loop the plan could mirror, and which of their rules have no reference at all.
