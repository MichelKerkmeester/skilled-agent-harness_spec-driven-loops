# Iteration 8: Delivery across seven runtimes and in a dispatched child

## Focus

Question 3: how each mechanism behaves across the seven runtimes and in a dispatched child with no user present. The previous five iterations each answered cost and breakage for one mechanism; this one asks the orthogonal question, which is whether the mechanism can arrive at all where the work happens.

## Actions Taken

1. Inventoried each runtime's command or prompt surface and counted the `speckit` entries per runtime.
2. Re-read the injection contract's per-runtime channel table and the hooks index's coverage matrix row for `spec-gate`.
3. Read `AGENTS.md`'s autonomous child-dispatch exemption and `spec-gate`'s child no-op contract.
4. Read the plan workflow's `child_dispatch` clause and step 7's child default.
5. Cross-read the runtime mirror READMEs for where each runtime takes instructions.

## Findings

1. **A command surface exists in six of seven runtimes, in two different forms, and Devin has neither.** OpenCode and Claude carry `commands/speckit/` directories, Cursor carries `commands/speckit-plan.md` and its siblings, and Codex, Pi and DSH each carry eight `speckit-*.md` prompt templates; `.devin` has no `commands` directory and exposes skills as slash commands instead [INFERENCE: from the directory listings of `.opencode/commands`, `.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts` and `.devin/`]. On Devin the only surfaces are skills and hooks [SOURCE: .devin/README.md:41].

2. **`AGENTS.md` arrives in six runtimes and only by pointer in the seventh.** Six mirror READMEs name the root file as the instruction source [SOURCE: .claude/README.md:39] [SOURCE: .codex/README.md:39] [SOURCE: .pi/README.md:31], and Cursor receives a generated Gate 1 pointer inside its own rule file [SOURCE: .cursor/rules/skill-routing.md:20].

3. **Hook delivery is the only mechanism with a per-runtime adapter set, and it is complete for the tool-time channel.** The hooks index's coverage matrix marks `spec-gate` "✓ covered" in all seven runtime columns [SOURCE: .skilled/hooks/README.md:343], while `session-relaunch` shows how partial a concern can be when its signal is missing [SOURCE: .skilled/hooks/README.md:341]. Prompt-time delivery is weaker than the matrix suggests because Cursor's prompt channel is dormant.

4. **In a dispatched child, the interactive mechanisms degrade or vanish by design.** Gate 3 is "PRE-RESOLVED" and every stop-and-ask rule becomes "record-and-continue" [SOURCE: AGENTS.md:84], so an `AGENTS.md` routing gate would produce a recorded decision rather than a workflow run. `spec-gate`'s core short-circuits to a complete no-op before any state read [SOURCE: .skilled/hooks/spec-gate/README.md:24], so mechanism C delivers nothing to a child at all.

5. **The workflow itself already handles a child, which makes mechanism E the one mechanism that is *better* in a child than in chat.** Its `child_dispatch` line resolves Gate 3 to the lineage directory and stops the worker asking [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:52], and step 7's checkpoint defaults to Skip under the same condition [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:829]. A child running the workflow does not stall; a chat session running it in `confirm` mode stalls four times.

6. **The mechanisms that need no adapter are the two that survive everywhere: the card and the validator.** Both are file reads or a shell invocation [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:163], so they are indifferent to runtime, to session type and to whether anyone is watching.

7. **The failure modes are not equivalent across runtimes, so a uniform answer has to name the worst case.** Devin cannot invoke a command; Cursor cannot receive a prompt-time injection and does not read `AGENTS.md`; Pi renders injection text onto the visible prompt; DSH's goal and step injections are interactive-only [SOURCE: .skilled/hooks/injection-contract.md:117]. A mechanism chosen for the median runtime will fail silently on at least one of these four. [INFERENCE: consolidates the per-mechanism costs from iterations 3-7 with the reach findings in this iteration]

8. **No mechanism is universal and cheap at once.** The validator is universal, and its rules cannot read judgment; the card is cheap and universal, and its load is keyword-gated; the hook is universal for tool time, and it is advisory and adapter-heavy; `AGENTS.md` is nearly universal, and Cursor and the shipped-surface cost each sink it; the command is unavailable on Devin and needs a user. [INFERENCE: consolidates the per-mechanism costs from iterations 3-7 with the reach findings in this iteration]

## Ruled Out

- Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72].
- Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it.

## Dead Ends

- "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports.
- "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery.

## Edge Cases

- Ambiguous input: "behaves" was read as delivery capability, not behavioral effect; effect was established per mechanism in iterations 3-7.
- Contradictory evidence: the advisor hook reference lists a Cursor `beforeSubmitPrompt` adapter as wired while both the Cursor rule and the injection contract call it dormant. Recorded in iteration 5; the delivery matrix here uses the dormancy reading.
- Missing dependencies: no runtime session was executed; every claim is from checked-in mirrors, adapters and contracts.
- Partial success: command and prompt inventories were counted from directory listings, which establishes presence but not that each mirror is current. `/doctor:runtime-mirrors` is the check that would confirm currency and was not run.

## Sources Consulted

- `.opencode/commands/speckit/`, `.claude/commands/speckit/`, `.cursor/commands/speckit-*.md`, `.codex/prompts/speckit-*.md`, `.pi/prompts/speckit-*.md`, `.dsh/prompts/speckit-*.md`, `.devin/`
- `.devin/README.md:41`
- `.claude/README.md:39`, `.codex/README.md:39`, `.pi/README.md:31`, `.cursor/rules/skill-routing.md:20`, `.cursor/README.md:72`
- `.skilled/hooks/README.md:341`, `:343`
- `.skilled/hooks/injection-contract.md:117`
- `.skilled/hooks/spec-gate/README.md:24`
- `AGENTS.md:84`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:52`, `:829`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:163`

## Assessment

- New information ratio: 0.8
- Questions addressed: How does each candidate mechanism behave across the seven runtimes and in a dispatched child with no user present?
- Questions answered: How does each candidate mechanism behave across the seven runtimes and in a dispatched child with no user present?
- Novelty justification: the per-runtime command inventory and the child degradation table are new; the Cursor and hook facts were established earlier and are consolidated here.

## Reflection

- What worked and why: counting the mirrors made the command mechanism's reach concrete. The question's framing treats "a command" as universally available; the directory listings show four runtimes reach it only as a prompt template and one not at all.
- What did not work and why: reading the hooks coverage matrix as a delivery guarantee. It marks adapter coverage, and a child still receives nothing because the core returns early. Coverage and delivery are different claims.
- What I would do differently: build the runtime inventory before evaluating any mechanism. Reach is a hard gate, and three of the five mechanisms have a runtime where they cannot arrive.

## Recommended Next Focus

Question 5: token cost per turn of each mechanism, measured from file sizes — and question 4, the Level 1 exemption and the one-sentence opt-out, which is the same lightness argument from the other side.
