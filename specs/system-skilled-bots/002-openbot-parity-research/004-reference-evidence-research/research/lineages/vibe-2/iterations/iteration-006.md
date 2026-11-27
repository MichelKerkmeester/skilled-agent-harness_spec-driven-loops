# Iteration 6: Phases 009-skills and 010-conversations

## Focus

Phases 009-skills and 010-conversations: which reference files implement the same thing, what a builder should lift or mirror, where the plan differs from the reference and which side the evidence supports, and which failures the plan does not yet guard against.

009 is the phase with the most reference surface in the whole packet — `tinyskills` is a 78,138-line library whose subject is exactly the plan's — and 010 is the phase whose reference is a conversation that outlives its work. Both are read here for the rules the plan has no row for.

## Actions Taken

1. Read `openhuman-full/vendor/tinyskills/README.md` in full for the bundle grammar, the scan, the scope precedence and the digest.
2. Read the plan's 009 REQ-001 to REQ-009 and its scope boundary.
3. Read `OpenBot-main/shared/orchestration.ts` for the conversation tool vocabulary, the retired tool and the conditional prompt section.
4. Read the plan's 010 phase-parent scope and child 002's REQ-005, REQ-006 and its risk table.
5. Compared the reference's task-thread handoff with the plan's run-as-conversation.

## Findings

1. **009 — the reference scans a skill body for supply-chain hazards and the plan scans only the draft for secrets.** tinyskills' `scan_skill` "returns `pass`/`warn`/`block` findings (invisible/bidi/zero-width code points, hard-coded credentials, and escaping resource paths block; agent-addressed text, fetch-and-exec pipelines, and undeclared MCP references warn), plus `sanitize_catalogue_text` for rendering untrusted text into a prompt as data". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:38] *(observed)* The plan's 009 checks the *draft* for secret literals before writing it, refusing `proposal-secret`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:173] *(observed)* It never scans a *loaded* body. A skill body is injected into the prompt as instructions, so a bidi override or an agent-addressed line goes straight in, and the plan's 003 sanitizer does not catch it because a bidi mark is not a control character. This is the strongest 009 finding and the one gap in the packet with a known attack.

2. **009 — the reference's `allowed-tools` frontmatter is the per-skill tool declaration the plan has no place for.** tinyskills parses "YAML frontmatter with scalar or sequence `allowed-tools`". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:27] *(observed)* The plan's 009 has `skills:` as a list of names and 007's `apps:` is per bot. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160] *(observed)* A skill that declares the tools it needs would let 007 filter per skill rather than per bot, which is the narrower grant. The plan's 007 is already built around a per-run filtered config, so the declaration has somewhere to land.

3. **009 — the reference pins an installed document by digest and the plan pins a proposal by digest, independently.** `document_digest` is "the sha256 of one rendered document, for pinning an installed copy (not the same value as `BundledSkill::digest`)". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:45] *(observed)* The plan's `revisionRead` is "the SHA-256 hex of the target body's bytes as read, or `null` when the target did not exist", and a mismatch refuses `proposal-stale`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164] *(observed)* Two independent designs reached the same staged-write pin. The reference's parenthetical is the trap the plan avoids: a digest of a *rendered* document is not a digest of the bytes, and the plan hashes the bytes as read.

4. **009 — the reference has a scope precedence for discovery and the plan has none, and the plan is right.** tinyskills has "explicit scope precedence for builtin, legacy, user, project, and profile roots". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:31] *(observed)* The plan resolves a name against `<skilledTree>/.skilled/skills/<name>/SKILL.md` and refuses `skill-unknown`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] *(observed)* One root, one name, no precedence. The evidence supports the plan: a precedence ladder is what a multi-root product needs, and the plan has one tree. Record it as a deliberate simplification so a later phase does not add a second root without adding the ladder.

5. **009 — the reference bounds a resource read by size, symlink and UTF-8 and the plan bounds a body by bytes only.** tinyskills offers "traversal-, symlink-, size-, and UTF-8-safe resource reads". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:32] *(observed)* The plan refuses `skill-too-large` over 16,384 bytes and `skills-over-budget` over 20,480. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] *(observed)* The plan's name grammar closes traversal, because a name outside it is refused `skills-name-invalid`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:172] *(observed)* A symlinked `SKILL.md` at that path is not closed: the loader reads whatever the link points at, and the byte cap then measures the wrong file. One `lstat` and a refusal is the whole fix.

6. **010 — the reference's conversation is a front for a task thread and the plan's conversation is the run.** `DELEGATE_TOOL = "delegate"` hands "a piece of work into a task thread of the Bot's own", and `LINK_TOOL`, `FOLLOW_UP_TOOL` and `STOP_TOOL` find, add to and stop that thread. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:11-27] *(observed)* The plan's 010 appends one human and one bot message and dispatches one run, and its Problem Statement says "Nothing records a sequence of exchanges, so a second message cannot refer to the first". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:56] *(observed)* The reference's conversation survives the work; the plan's conversation is a log of runs. The evidence supports the plan for a headless CLI, and `link_to_thread` is what a person needs when a run outlives the conversation — which is exactly the case the plan's own Problem Statement names.

7. **010 — the reference retired a tool and kept its name so an old transcript still draws, and the plan has no retirement rule.** `REACT_TOOL = "react"` is "The tool a Bot once reacted to the person's message with, instead of writing a line. A Bot now answers in words in a conversation and is offered no such tool; the name stays so a transcript still draws the reactions and the calls from before." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:16-21] *(observed)* The plan's 010 has no tool vocabulary, so nothing to retire today. But 006's `action-kind.ts` and 007's `apps:` both introduce names a later phase may retire, and the rule is one line: keep the name, stop offering it, keep drawing it. 013 should own that line.

8. **010 — the reference's prompt section is conditional on holding the tool, and the plan's prompt builder is unconditional.** "Conditional on holding the tool, because the task thread's own turn reads the same prompt and holds no such tool, and a routine or a check-in is offered none." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:42-44] *(observed)* The plan's 010 adds a conversation section to the one prompt builder, and 002's routine runs read the same builder. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168] *(observed)* So a routine's prompt would carry the conversation section and tell a bot to answer a person who is not there. This is a real prompt leak the plan does not guard, and the fix is the reference's: make the section conditional on the run's origin.

9. **010 — the reference's "never only a reaction" failure is already covered by the plan in its analogous form.** "This once had a Bot react with an emoji, as its whole answer, to a message that needed only an acknowledgement, and a Bot answered a \"Hello\" that opened a conversation with only a 👀 under it." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:33-38] *(observed)* The plan handles the empty reply: "An empty reply appends the run's exit reason instead, so the line is never blank." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:200] *(observed)* The plan's rule is the same rule for a text-only client, reached without the emoji detour. Confirmation, not a gap.

## Ruled Out

- **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4.
- **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6.
- **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9.

## Dead Ends

- `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema.
- `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape.

## Edge Cases

- Ambiguous input: none. Both phases had one reading.
- Contradictory evidence: none. The plan and the reference differ on the conversation's shape and each difference is a design choice.
- Missing dependencies: `OpenBot-main/server/` is absent, so the task-thread store cannot be read. Fallback: the tool declarations, which state each tool's purpose. Confidence impact: the thread's record shape is inferred, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:1-45
- specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:1-45
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:41-46,160-173
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:56,138,172-174
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:156-157,200,230
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168

## Assessment

- New information ratio: 0.90
- Questions addressed: the topic's first question for phases 009 and 010.
- Questions answered: 009's missing body scan, the per-skill tool declaration, the digest confirmation, the scope-precedence simplification and the symlink hole; 010's task-thread difference, the retirement rule, the unconditional prompt section and the empty-reply confirmation.

## Reflection

- What worked and why: reading the reference's capability list as a checklist against the plan's REQ table. tinyskills states twenty capabilities in one README, and walking them against nine requirements found five differences in one pass — the highest yield per call in the run so far.
- What did not work and why: the first pass at 010 looked for a conversation file format in the reference and found none, because the reference stores a thread on the server and the plan stores a file. The mismatch cost a call and produced finding 6.
- What I would do differently: for a phase whose reference is a library, read the library's capability list first and the plan's REQ table second, and diff the two lists rather than reading either in full.

## Recommended Next Focus

Phases 011-messaging-channels and 013-skilled-and-doc-alignment, plus `buzz-main`, which the F-1-006 node's scope names and no iteration has read. The specific next reads are `buzz-main/ARCHITECTURE.md` and `buzz-main/CONTEXT.md` for the failure-handling and upgrade patterns, `tinychannels-main/docs/` for 011's channel layer, and the plan's 013 for the doc-alignment surface. The open question this iteration leaves is whether 009's body scan belongs to 009 or to 012, since it is a check on a file the phase does not write.
