# Iteration 4: The cross-runtime and child-dispatch axis for all five mechanisms

## Focus

Q2 from the strategy `## 11. NEXT FOCUS`, and the only unchecked key question left:

> For each of the five candidate mechanisms, what does it cost, what does it break, and how does it behave across the seven runtimes and in a dispatched child with no user present?

Iteration 3 supplied the **cost** axis and the child-dispatch *rule* that an `AGENTS.md` addition must state. It left two named gaps: whether the `.dsh` and `.devin` runtimes deliver `AGENTS.md` as a prefix at all, and what each hook adapter does with an injected step that contradicts card text already in context. This iteration closed both, and the first gap turned out not to be a gap but a hole large enough to change the ranking.

Narrowing decision: the seven runtime directories are `.claude .codex .cursor .devin .dsh .opencode .pi` — all seven exist. I did not re-audit `.claude`, `.codex`, `.opencode` or `.pi` for `AGENTS.md` delivery because iteration 3's finding 5 already counted six prompt-time adapters and the open instance was the one *outside* the advisor contract. Reading `.devin` and `.dsh` was the narrowest path to closing Q2, and it was sufficient.

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-strategy.md` (key questions, exhausted approaches, next focus), the state JSONL and `iteration-003.md`'s findings to inherit findings 1–13 and every BLOCKED entry before choosing an angle.
2. Listed the seven runtime directories and `.skilled/hooks/`, confirming `hook-install/` holds only four runtime recipes (`claude`, `cursor`, `devin`, plus the index) — `.dsh` installs through `patches/` and `plugins/` instead, which is why it is not in the install folder.
3. Read `injection-contract.md` §1–§2 to get the visibility legend and the per-runtime advisor channel table, including DSH's `agent/pre-step` "interactive only" note.
4. Read `.devin/README.md` §2 (the "How Devin gets it" table) and `.devin/SYNC.md` §2, then measured `AGENTS.md` against Devin's 16,384-byte per-file cut with `awk` byte accounting.
5. Read `.dsh/SYNC.md` §2 (surface inventory and the adapter-group table) and `.dsh/plugins/repo-guards/README.md` §1–§2.
6. Grepped all of `.dsh/` for `AGENTS` to test whether any repo artifact delivers the root file to a DSH run.
7. Read `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` for the leaf gate and prompt-selection predicate.
8. Grepped `AGENTS.md` and `skill-advisor-hook.md` for precedence language to answer the contradiction half with the carrier's own contract rather than with an inference about adapter behaviour.

Budget: 10 research/tool calls before writing, well inside the 12 target.

## Findings

1. **Devin cuts every rule file at 16,384 bytes, and `AGENTS.md` is 27,372 bytes — so 10,988 bytes, and every line from 184 down, never reach a Devin session.** Measured this iteration: `AGENTS.md` is 300 lines / 27,372 bytes; byte 16,384 falls inside line 184, so line 183 is the last fully delivered line and line 184 is severed mid-sentence. The repo's own runtime doc states the limit and a second, worse failure it has already seen: with Devin's Claude import on, the repo's `AGENTS.md` "arrived only as a path ('could not be injected due to token limits')", and the file is "still cut at 16,384 bytes, which is Devin's fixed per-file limit, so hard rules must stay in the first 16 KB". [SOURCE: .devin/SYNC.md:93] [SOURCE: AGENTS.md:1]

2. **Mechanism 1's cheapest carrier is already invisible on one runtime.** Iteration 3 priced a minimal edit to the `AGENTS.md:186` "Plan before acting" bullet at 119 characters / ~30 tokens, which is what made an `AGENTS.md` gate the cheap option. Line 186 begins past byte 16,384, so that line does not exist in a Devin session's prompt at all. The cheapest edit and the cheapest *delivered* edit are therefore different edits, and the gap is exactly the runtime that has no command surface to fall back on. [SOURCE: AGENTS.md:186] [SOURCE: .devin/SYNC.md:93] [INFERENCE: from finding 1's byte boundary and iteration 3's 119-character measurement of the same line]

3. **DSH receives no `AGENTS.md` at all.** The only `system-prompt` row any repo artifact generates for a DSH run is the agent persona patch, whose `personaPrefix` is the agent body and nothing else. [SOURCE: .dsh/SYNC.md:33] No other `.dsh/` file delivers the root file: the sole `README.md` mention is a "related" link calling it "the shared instruction file" [SOURCE: .dsh/README.md:131], and every other reference is a persona *citing* a section number rather than carrying its text — `code.patch.yml` cites "`AGENTS.md` §1 Law 2, SCOPE LOCK" and "§2 Confidence Thresholds" while restating neither. [SOURCE: .dsh/agents/code.patch.yml:51] Personas compensate by quoting: `orchestrate.patch.yml` reproduces `AGENTS.md` GATE 4 "verbatim" before relying on it, which is what a runtime does when the source is not resident. [SOURCE: .dsh/agents/orchestrate.patch.yml:484] Boundary: whether the DSH harness itself has a default instruction loader is not evidenced anywhere in this repo; the claim is repo-side delivery only.

4. **The hook's own contract pre-answers the contradiction question against mechanism 3, so the six adapters never arbitrate.** No adapter compares an injected step against card text already in context, because the contract assigns the injected text a *lower* precedence by construction: the brief "is advisory: it never replaces explicit skill loading, never persists raw prompt text, and never blocks the prompt on an advisor failure" [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21], restated as a table row: "Advisory only | Hooks surface prompt-safe routing context. They do not replace explicit skill loading, persist raw prompt text, or block the user prompt on advisor failures." [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:133] A mechanism that wants an injected step *obeyed* must overturn its carrier's contract, not add text to the carrier — the contradiction is resolved against the injection before any adapter runs.

5. **On DSH the prompt-time injection is provably absent in a dispatched child, twice over.** `prompt-advisor` sits in the "Interactive only" adapter group and is "off by the lineage marker" that a fan-out leaf carries [SOURCE: .dsh/SYNC.md:47], and even in an interactive session the adapter treats only a message with `message.source?.kind === 'user'` as the prompt [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:49]. A dispatcher composes a prompt stub into the task text [SOURCE: .dsh/SYNC.md:49], which by that predicate is not an operator prompt. So mechanism 3's child-dispatch behaviour is not "delivered but ignored" on DSH; it is "not delivered".

6. **DSH has no command loader, so mechanisms 2 and 5 are unavailable there; Devin is the same shape for commands.** "dsh has no agent-file loader and no command loader. A persona reaches a run as `--patch .dsh/agents/<name>.patch.yml`, and a dispatcher composes a prompt stub into the task text." [SOURCE: .dsh/SYNC.md:49] Mechanism 5 (session invokes the command itself) has no command to invoke on DSH, and mechanism 2 (a shared step reference both paths read) has no command path to be reachable from — a reference linked only from a command is unreachable on a harness with no command loader. Devin matches: "No command folder. Devin carries no mirrored command surface." [SOURCE: .devin/README.md:43]

7. **The adapter roster is six by contract and seven by directory, and DSH is the one outside the contract.** `skill-advisor-hook.md` opens by naming its scope: "Operator contract for the maintained Skill Advisor adapters across Claude, Codex, Cursor, Devin, Pi, and the OpenCode plugin." [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:3] DSH's adapter exists and is documented only in `injection-contract.md` §2, which is also the only place the "interactive only" qualifier appears. Any prompt-time mechanism written into the advisor contract therefore reaches six runtimes with a seventh live but uncontracted — a documentation/config gap, not a behaviour gap, but the one that would silently exclude DSH from a new hook concern.

8. **Q2's four-axis matrix, assembled from iteration 3's cost measurements and findings 1–7.** Cross-runtime counts are stated as "reaches N of 7" on the specific carrier, and the child column states what the carrier does with no operator present.

| # | Mechanism | Cost (iteration 3) | What it breaks across the seven runtimes | Dispatched child, no user |
|---|---|---|---|---|
| 1 | `AGENTS.md` gate / edited line | one Gate block 245 tok, or a 30-tok line edit | Devin cuts at byte 16,384, so lines 184+ never arrive; DSH delivers no `AGENTS.md` at all. A one-line edit at `:186` reaches **5 of 7**; a gate placed in the first 16 KB reaches **6 of 7** | `child_dispatch` exemption enumerates its clauses, so a new gate must state its own rule (iteration 3, finding 7) |
| 2 | Shared step reference both paths read | new file — last resort under the frozen preference order | a reference read on demand has no delivery mechanism; DSH has no command loader, so a reference linked only from commands is unreachable (**5 of 7** at most) | works with no user; it is a file read |
| 3 | Hook injects the one relevant step | observed brief 91 chars; hard ceiling 2,048 chars | the carrier's contract declares injected text non-authoritative ("never replaces explicit skill loading", "never blocks"); DSH leaf disables `prompt-advisor`; DSH requires an operator-typed prompt → **5 of 7** at most, and *weaker* than resident text where it does arrive | **absent** on DSH (finding 5); elsewhere fires per submitted prompt, including a dispatch stub |
| 4 | Templates + `validate.sh` | templates ~49.6 KB at Level 1; validator 42 rules, decides nothing a reader must judge | runtime-independent — shell and node, no rule-file budget, no truncation, no loader | runs anywhere a shell runs, no user needed |
| 5 | Session invokes the command when the advisor is confident | command surface, plus the advisor's confidence gate | DSH has no command loader [SOURCE: .dsh/SYNC.md:49]; Devin has no command surface [SOURCE: .devin/README.md:43] → **5 of 7** | a child has no user to answer the command's checkpoints |

The discriminator the matrix exposes is not cost. It is **delivery**: three of the five mechanisms (1, 3, 5) are absent on `AGENTS.md`-truncating or command-less runtimes, mechanism 2 exists on paper everywhere but is reachable only through a path two runtimes lack, and only mechanism 4 (templates + validator) has a carrier that every runtime executes. Whether mechanism 4 can carry a *judgment* is iteration 2's finding and remains the constraint it was.

## Questions Answered

- **Q2 — answered.** "For each of the five candidate mechanisms, what does it cost, what does it break, and how does it behave across the seven runtimes and in a dispatched child with no user present?" Cost from iteration 3, breakage and cross-runtime from findings 1–7, child-dispatch from iteration 3's finding 7 plus findings 5–6 here. All four axes now exist for all five mechanisms (finding 8).

## Questions Remaining

- None unchecked in the strategy's key-question list. Q5's *ranking* is now fully constrained from both the lightness side (iteration 3) and the delivery side (finding 8), but it is not re-scored this iteration: the matrix changes which mechanism can *win*, and re-ranking without re-reading the recommendation's exact edit set would be a claim without evidence.
- Open verification thread carried forward: whether the recommended edit's target line is inside the first 16,384 bytes on the Devin carrier it is written into. That is a property of the edit, not a research question, and it is cheap to check at implementation time.

## Ruled Out

- **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken.
- **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch.
- **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way.

## Dead Ends

- **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability.
- **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter.

## Edge Cases

- **Ambiguous input:** none. The next-focus text named both remaining gaps explicitly, so the interpretation was given rather than chosen.
- **Contradictory evidence:** one, and it matters for the ranking. `.devin/README.md:39` says Devin's "Instructions" are "The root `AGENTS.md`, plus the routing rule Devin inherits from Cursor", while `.devin/SYNC.md:93` says the same file is cut at 16,384 bytes and has previously arrived only as a path. Both are the repo's own docs. Resolution: the README row states *which file* is loaded and the SYNC note states *how much of it*; they are compatible once "Instructions" is read as naming the file rather than promising its whole contents. No LOGIC-SYNC halt is emitted — this is a documentation-scope difference, and the conservative reading (truncation happens) is the one a mechanism must be designed against. [SOURCE: .devin/README.md:39] [SOURCE: .devin/SYNC.md:93]
- **Missing dependencies:** none. All cited paths resolve.
- **Partial success:** the DSH `AGENTS.md` claim (finding 3) is repo-side only — it establishes that no *repo* artifact delivers the file, not that the harness cannot. Stated in the finding; status remains `complete` because the repo-side fact is the one a mechanism written in this repo can act on.

## Sources Consulted

- `.devin/SYNC.md:93` (16,384-byte per-file cut; the "only as a path" observed failure)
- `.devin/README.md:39` (Instructions row), `.devin/README.md:43` (Commands row)
- `.devin/hooks.v1.json:1` (hook wiring is the rendered registry, not `.devin/hooks/`)
- `AGENTS.md:1` (300 lines / 27,372 bytes), `AGENTS.md:184-186` (the cut boundary and the "Plan before acting" line)
- `.dsh/SYNC.md:33` (persona patch is the only generated `system-prompt` row), `:47` (Interactive only group), `:49` (no agent-file loader, no command loader, prompt stub composition)
- `.dsh/README.md:131` (only `AGENTS.md` mention), `.dsh/agents/code.patch.yml:51`, `.dsh/agents/orchestrate.patch.yml:484`
- `.dsh/plugins/repo-guards/README.md` §1–§2 (bundle composition, adapter link layout)
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:3`, `:21`, `:133`
- `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:49`
- `.skilled/hooks/injection-contract.md:46-90` (visibility legend, per-runtime advisor channel table)
- `iteration-003.md` findings 1–13 (cost axis inherited, not re-measured)

## Assessment

- New information ratio: 0.93 — 6 fully new findings (1, 3, 4, 5, 6, 7) and 1 partially new (2, derived from finding 1 plus iteration 3's measurement), plus finding 8 as a synthesis of both iterations. No simplicity bonus claimed: the matrix reduces open questions but is built on new external evidence, not a cleaner model of the same evidence.
- Questions addressed: Q2.
- Questions answered: Q2.
- All five strategy key questions are now ticked.

## Reflection

- **What worked and why:** asking "does this runtime deliver the file at all?" instead of "does this runtime deliver the mechanism?" found the discontinuity. Delivery is a property of the carrier, so it applies to every mechanism that rides the carrier at once — one measurement invalidated the cheap option on two runtimes rather than one mechanism. Iteration 3 had been pricing text that reaches the model; this iteration asked whether the text reaches the model, and the two answers differ on exactly the runtimes a chat session cannot route around.
- **What did not work and why:** the first pass looked for `.skilled/hooks/hook-install/` recipes covering all seven runtimes and found four. The apparent gap was a wrong search shape: `.dsh` installs through `patches/` plus a plugin bundle and has no install recipe by design, so "six of seven installed" was a measurement of one folder, not of hook coverage. Grepping the runtime directories directly corrected it in one call.
- **What I would do differently:** measure each carrier's *size budget* on every runtime before pricing any mechanism against it. Iteration 3 priced five carriers accurately and would have priced them differently had the 16,384-byte rule been in the table. A budget row belongs next to the cost row in any cross-runtime comparison, and a mechanism whose carrier has a budget must be checked against the budget before its token price is quoted.

## Recommended Next Focus

Q2 is closed and every key question is answered. The remaining work is not research but the decision the topic asked for: **re-rank the five mechanisms against finding 8's delivery column and state the recommendation's exact edit set**, then verify that the chosen edit target sits inside the first 16,384 bytes of the file it lives in so it does not inherit the truncation defect. If the reducer judges that re-ranking to be research rather than synthesis, the highest-value next iteration would test mechanism 4's ceiling directly: whether a template line or a validator rule can carry a *judgment* about plan shape, which is the one question that could still move the recommendation.
