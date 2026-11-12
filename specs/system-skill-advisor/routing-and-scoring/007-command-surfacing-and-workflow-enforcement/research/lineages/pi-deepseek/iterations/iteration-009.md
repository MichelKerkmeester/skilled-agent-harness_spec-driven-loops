# Iteration 9: Prior art — how the harnesses in this repository route free text

## Focus

Angle 9 (prior art): how other agent harnesses route a free-text request to a packaged workflow. Scope decision: no web fetch is available in this session, so prior art is drawn from the repository's own runtime documentation — the shipped mirrors for Claude, Codex, Cursor, Devin, Pi and DSH — with any outside knowledge marked as inference. That evidence is stronger than vendor docs anyway, because it is what these runtimes are actually configured with here.

## Actions Taken

1. Read each runtime folder's README overview to see which surfaces it exposes.
2. Read the one always-applied routing rule in the tree, `.cursor/rules/skill-routing.md`, in full.
3. Traced that rule's ownership across runtimes (Cursor owns it, Devin inherits it).
4. Checked how each runtime receives `AGENTS.md`.

## Findings

1. Every harness converges on the same three surfaces: a root instruction file (`AGENTS.md`), a user-invoked prompt or command surface, and an optional hook. Codex calls `AGENTS.md` "the shared instruction file for every runtime" [SOURCE: .codex/README.md:39]; Pi "reads the root `AGENTS.md` from its working directory and the folders above it" [SOURCE: .pi/README.md:31]; Cursor tells the user to "type `/` to see the commands" [SOURCE: .cursor/README.md:19].

2. The only always-applied routing rule in the tree is `.cursor/rules/skill-routing.md`, and it is static prose: eight skill pointers, one per skill family, loaded on every Cursor session via `alwaysApply: true` [SOURCE: .cursor/rules/skill-routing.md:1]. It names zero commands.

3. That rule states the dynamic path is not running: "Cursor's `beforeSubmitPrompt` adapter is registered to call the shared advisor, but its dynamic per-turn delivery is dormant under the tested CLI build; this rule is a static complement, not a substitute for that brief" [SOURCE: .cursor/rules/skill-routing.md:18]. So on at least one runtime the brief does not reach the model today, and the static rule is doing the routing.

4. Devin inherits the same rule rather than carrying its own: its README lists "the routing rule Devin inherits from Cursor" under Instructions and "No rules folder here" under Rules [SOURCE: .devin/README.md:39]. Two of seven runtimes therefore share one hand-maintained static routing document, and neither has command pointers in it.

5. The rule also shows the repository's own pattern for keeping a duplicated routing block honest: its Gate 1 lookup paragraph sits inside a generated fence (`spec-kit:gate1-pointer:start`…`end`) produced by `sync-gate1-pointers.cjs` from the root `AGENTS.md` line, with the note "edit the root `AGENTS.md` line, not this block" [SOURCE: .cursor/rules/skill-routing.md:22]. That is the anti-drift mechanism a command pointer block should reuse.

6. Prior art from outside this repository, marked as inference because no external page was fetched in this session: agent harnesses expose slash commands as user-invoked entries, not model-callable tools, and the `AGENTS.md` convention exists precisely so one instruction file can serve several harnesses [INFERENCE: from the per-runtime mirrors above plus the absence of any model-invoked command surface in seven adapters].

7. Design implication, and the reason this iteration matters: the binding layer cannot assume a brief arrives. On Cursor and Devin the reliable surfaces are the static rule and `AGENTS.md`; the advisor CLI is callable from the model's own shell on every runtime. So the one-line rule from iteration 6 should be phrased to work when the brief is absent — "if no brief arrived, ask the advisor before hand-rolling" — and the command pointer should be generated into the static rule rather than hand-copied into it [INFERENCE: from the dormant Cursor rule and the root-doc precedence established in iteration 6].

## Answer to the prior-art question

The harnesses here do not solve free-text routing with a hook; they solve it with a root instruction file plus a user-invoked command surface, with hooks as an enhancement that may be dormant (Cursor) or absent (DSH's doc row). The closest thing to a command router outside this repository is Cursor's static rule, and it routes to skills only. The transferable design is therefore: `AGENTS.md` carries the binding sentence, the advisor carries the per-prompt specificity when it runs, and the static rule carries a generated command pointer where it exists — with the generated-fence pattern already in use for Gate 1 as the anti-drift mechanism.

## Ruled Out

- Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build.
- Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync.

## Dead Ends

- Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder.

## Edge Cases

- Ambiguous input: "prior art" could mean vendor documentation or this repository's own multi-runtime configuration. Selected interpretation: the repository's configuration, because it is verifiable here and it is what the recommendation must fit.
- Contradictory evidence: iteration 6 said the brief reaches all seven runtimes; the Cursor rule says the dynamic path is dormant there. Resolved in favour of the rule's own statement for Cursor, which turns iteration 6's finding from "seven runtimes reached" into "seven adapters exist, at least one is dormant in the tested build". The mechanism still holds; the reliance on the brief alone does not.
- Missing dependency: no web access, so no vendor docs were read. Recorded rather than papered over.
- Partial success: three runtime READMEs were read in overview only, not in full.

## Questions Answered

- What prior art exists for routing free text to a packaged workflow, and which failure modes must a design guard against?

## Questions Remaining

- 1 of 9 remains open (failure modes, which this iteration touched but did not close).

## Sources Consulted

- .cursor/rules/skill-routing.md
- .cursor/README.md
- .codex/README.md
- .pi/README.md
- .devin/README.md
- .dsh/README.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q9 (prior art), Q6 refinement (mechanism must survive a dormant hook)
- Questions answered: Q9
- Findings: 7, all new; one finding (Cursor dormancy) directly contradicts a reliance assumption from iteration 6

## Reflection

- What worked and why: reading the one always-applied rule rather than skimming six READMEs produced the strongest evidence in the packet — a shipped file that says the dynamic delivery is dormant and that a static rule is what actually routes. That single line changes the reliance model of the design.
- What did not work and why: with no fetch tool I could not read vendor documentation; two attempted conceptual shortcuts ("harnesses let models call commands") had to be demoted to inference. Marking them is the honest outcome.
- What I would do differently: read `.cursor/rules/skill-routing.md` at the start of the packet — it is the closest thing to an existing answer and would have framed iterations 5-6.

## Recommended Next Focus

Angle 10 (failure modes): consolidate the guards the design needs — over-triggering, command/skill ambiguity, child sessions starting commands, loops, brief budget, dormant hooks, dangling linkage — each with the evidence gathered and the cheapest test that would catch it.
