# Iteration 2: Prompt and records — phases 004-computer-exposure, 005-memory, 009-skills, 010-conversations

## Focus

Frontier node F-1-005 (depth 1). Which reference files implement a working place named in the prompt, shared and per-bot memory with a size bound, a skill list under a cap and an append-only conversation with bot routing; and which pitfalls those repos hit. `openhuman-full` was read first, as the topic requires, because no earlier run studied it.

Scope read: `003-openbot-parity-build/004-computer-exposure/spec.md`, `005-memory/spec.md`, `009-skills/spec.md`, `010-conversations/spec.md`, `context/OpenGhost-main/memory.js`, `context/OpenGhost-main/skills.js`, `context/openhuman-full/vendor/tinymemory/`, `context/turnstone-main/turnstone/core/compaction.py`.

## Findings

1. **Phase 005 — the reference degrades a prompt that is over budget in three steps and the plan refuses instead, so a bot at both caps can never run.** `render` drops whole lines from the last section that has lines, re-composing and re-measuring after each drop; when no lines remain it shortens the last prose section by exactly the overflow in characters, with an ellipsis; and a shortened section that would fall below `MIN_PROSE_CHARS = 40` is removed rather than kept as a stub, so an empty document always fits [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/recall/render.rs:80-116] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/recall/render.rs:22]. Phase 005's REQ-015 gives the conversation block way first and then refuses the run `prompt-over-budget`, and phase 009 states the consequence plainly: two full memory files and a full skills list are 27,680 bytes before any wrapper, so a bot at both caps is always refused [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162]. The evidence supports the plan's refusal for authored blocks — a truncated `SKILL.md` is a half instruction — and supports the reference's ladder for the conversation block, which is the one block the plan already lets give way. The missing piece is the reference's floor rule: a block that would survive only as a stub is dropped, not kept. (observed)

2. **Phase 005 — the reference uses one unit for every budget and stores the measured figure on the compiled document; the plan mixes bytes and characters.** `estimate_tokens` is `text.chars().count().div_ceil(CHARS_PER_TOKEN)` with four characters per token, "the estimate every context budget uses" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/recall/render.rs:29-31], and `ContextDoc` carries `tokens` beside `markdown` so a caller checks the budget without re-measuring [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/context/compile/mod.rs:34-46]. The 003 synthesis already carries the plan's unit mixing as 005 gap 5 (bytes for memory and skills, characters for the transcript and the total); what is new is the reference's fix — one unit, one estimator, and the measured figure stored on the document rather than recomputed by each reader. (observed for the reference; the plan's mixing is carried by 003-plan-depth-research §4.005 gap 5)

3. **Phase 005 — the reference bounds on read, the plan bounds only on write, and the plan admits a state it gives no exit from.** `load()` filters and then `.slice(0, LIMITS.records)`, so a file that is already over the bound still renders [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:37] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]. Phase 005 refuses an append that would pass the bound [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] and REQ-016 states that two concurrent appends can both pass the count check and leave the file one line over [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:168]. After that race every later append is refused and no line names the repair; `--forget` is the exit but nothing says so. The reference's read-side bound is the missing half: render what is there, refuse only the growth. (observed)

4. **Phase 009 — the reference never loads every skill body; it lists names and descriptions and loads one body on mention, which removes the cap problem the plan refuses at.** `lines()` renders one `- <name>: <description>` line per skill for the agent [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:76-78], `mentions()` finds `/name` in a message and returns only names that resolve [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:58-62], and `content()` loads one skill's body only when it is used [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:81-96]. Phase 009 measured the sixteen `SKILL.md` files at 219,862 bytes and answered with two byte caps that refuse [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:93] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162]. The reference's two-tier design is the alternative the plan did not weigh: a list always fits where the bodies do not, and a body is paid for only when a run uses it. The evidence supports adding the list tier; it does not support dropping the caps, which still bound the one body a run loads. (observed)

5. **Phase 009 — the reference's skill block carries the skill's directory, its compatibility line and its resource files; the plan's block is the body alone.** `content()` emits `<skill_content name="…">`, the body, `Skill directory: <dir>`, the line "Relative paths in this skill are relative to the skill directory", an optional `It says it needs: <compatibility>` line, and a `<skill_resources>` list of the skill's files [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:81-96]. Phase 009's REQ-002 inserts the body inside one `<skill_content name="<name>">` block per skill and names no directory line and no resource list [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161], so a skill whose body says "run scripts/foo.sh" has no anchor and no statement of what it ships. (observed)

6. **Phase 010 — the deferred conversation rotation has a named reference, and its soft-threshold-with-one-advisory rule is the part to lift first.** `CompactionPolicy` compacts above a hard ceiling of `min(0.95, auto_compact_pct + 0.10)` of the context window, or above the soft threshold once the model has already received its one wind-down advisory, and end-of-turn callers use `over_soft` directly because there is no further cooperative turn to wait for [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/compaction.py:47-68]. `calibrated_chars_per_token` anchors the chars-per-token ratio to the provider's own reported count, subtracting fixed charges first and refusing to calibrate from a request that replays a native lane [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/compaction.py:96-120]. Phase 010 defers rotation by decision, which the 003 synthesis already records as 010 gap 7; what is new is that the deferral now has a reference to lift, and that the reference's cheapest half is the policy object, not the summarizer. (observed for the reference; the deferral is carried by 003-plan-depth-research §4.010 gap 7)

## Ruled Out

- **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding.
- **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it.
- **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new.

## Dead Ends

- A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it.
- A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6).

## Edge Cases

- Ambiguous input: none. The node named four phases and three reference areas.
- Contradictory evidence: none.
- Missing dependency: `openhuman-full` is 757 MB and its `vendor/` holds 21 crates, not the five the topic names. Read `tinymemory` in full and sampled the rest; the count is recorded as a net-new finding for a later iteration rather than as a failure here.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/recall/render.rs:20-31, 80-116
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/context/compile/mod.rs:34-46
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:1-40
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:11, 17, 37
- specs/system-skilled-bots/context/OpenGhost-main/skills.js:10-13, 58-62, 76-78, 81-96
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/compaction.py:47-68, 96-120
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-89
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:93, 100, 150, 168
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:93, 161, 162
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:85-90, 160, 173
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:113-124, 181-196
- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent at read time)

## Assessment

- New information ratio: 0.83
- Questions addressed: F-1-005 (prompt and records, phases 004, 005, 009, 010)
- Questions answered: F-1-005

## Reflection

- What worked and why: reading `openhuman-full`'s vendored `tinymemory` before the plan. Its `render.rs` overflow ladder and its single token unit are exactly the two decisions phase 005 leaves open, and neither is reachable from `openhuman-main`, which lacks the crate. The topic's instruction to read `openhuman-full` first paid for itself in one iteration.
- What did not work and why: looking for a phase-004 counterpart in turnstone. No repo names a working directory in its prompt, so the search returned nothing and cost two calls.
- What I would do differently: check the phase's own out-of-scope list before treating a reference feature as a gap. Two of the three items in Ruled Out were decided deferrals the plan already names.

## Recommended Next Focus

Phase 003-terminal-screen, which no frontier node covers yet: `openhuman-full/crates/openhuman-tui` is built and `openhuman-main`'s copy is not, so the screen's reference has never been read from the full checkout.
