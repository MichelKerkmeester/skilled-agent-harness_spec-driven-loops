# Iteration 4: Command run-or-ask boundary

## Focus

Investigate Angle 4: identify when a model can load the matched command workflow, when it must ask for command-specific input, and when an effect requires explicit approval. The reducer's Next Focus still points to Q1, but the dispatch explicitly orders run-or-ask after the output contract; I followed Angle 4 and retained the inventory question for synthesis.

## Findings
1. Gate 2 says confidence at or above 0.8 requires skill invocation, but command workflows define their own execution modes. SpecKit planning asks for a mode when none is supplied; its mode table distinguishes :auto, :confirm and :autopilot. Confidence should select the workflow candidate, not silently choose the execution mode. The high-confidence invocation rule supports loading the command workflow; the required startup mode contradicts automatic execution without command inputs. [SOURCE: AGENTS.md:63-70] [SOURCE: .skilled/commands/speckit/plan.md:29-35] [SOURCE: .skilled/commands/speckit/plan.md:65-69]

2. Startup defaults differ by command: create-agent binds an omitted mode to its confirm workflow, while SpecKit plan asks for a mode. Its :auto path runs autonomously and :confirm preserves checkpoint prompts. A registry needs command-specific defaultMode and askConditions; one global auto/confirm flag would misstate shipped workflows. [SOURCE: .skilled/commands/create/agent.md:35-49] [SOURCE: .skilled/commands/create/agent.md:65-70] [SOURCE: .skilled/commands/speckit/plan.md:29-35]

3. The doctor git router blocks until a target is bound, does not infer a target from conversation history or workspace state, and shows a startup menu then waits when the target is missing. A strong route match can safely load the router, but cannot invent a positional target. The route's explicit argument forms are evidence against a blanket “ask before every command” rule: when the user supplied the target, this specific gate is satisfied. [SOURCE: .skilled/commands/doctor/git.md:12-20]

4. The reversibility ladder allows trivially reversible tracked-file edits and new files to proceed, but tier-3 sends, publishing, destructive migrations and external side effects require a written rollback and an explicit yes; approval does not transfer to later actions. This supports asking at the effect boundary, not before selecting every command. It contradicts both “always auto-run a high score” and “ask for every local write.” [SOURCE: .skilled/repo-rules/blast-radius.md:59-100]

5. Gate 3 asks a spec-folder question for writing routes, lets read-only routes proceed without a folder, and keeps the selected answer for the session. The ask should be attached to the chosen command's workflow and only when that workflow needs the missing choice. This supports route-specific questions; interactive Gate 3 is evidence against skipping all asks after a high-confidence match. [SOURCE: AGENTS.md:72-84]

## Ruled Out

- Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately.
- Inferring required route targets from prior conversation or workspace state where the route contract forbids inference.

## Dead Ends

- None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it.

## Edge Cases

- Ambiguous input: Reducer Next Focus still says Q1 inventory source-of-truth, while the dispatch orders Angle 4 after Angle 3. Followed the explicit angle sequence.
- Contradictory evidence: Gate 2 requires invocation at high confidence, while command startup contracts may still ask for mode or missing arguments; resolved by separating route selection from execution readiness.
- Missing dependencies: None for the representative command contracts.
- Partial success: Run-or-ask criteria are grounded in repository gates, but the command-by-command effect and mode inventory remains for synthesis and runtime-mechanics review.

## Sources Consulted

- AGENTS.md:63-84
- .skilled/repo-rules/blast-radius.md:59-100
- .skilled/commands/speckit/plan.md:29-35, 65-79
- .skilled/commands/speckit/implement.md:29-60
- .skilled/commands/speckit/complete.md:29-63
- .skilled/commands/create/agent.md:35-70
- .skilled/commands/doctor/git.md:12-20
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:214-215

## Assessment

- New information ratio: 0.90 (four findings add command-specific execution and effect boundaries; one extends scoring/output distinctions).
- Questions addressed: When to load a command workflow, ask for route/mode inputs, and request effect approval.
- Questions answered: None fully. The decision boundary is specified, but runtime invocation and all-command metadata coverage remain open.

## Reflection

- What worked and why: Comparing two command families with an explicit target gate and the shared reversibility rules showed that command selection, startup input, and effect approval are distinct decisions.
- What did not work and why: A generic command count or advisor confidence cannot reveal per-workflow mode defaults or side effects; those live in the individual command routers and their rule owners.
- What I would do differently: Trace the workflow loader and runtime adapter after this policy distinction, then map which invocation surfaces can enforce it.

## Recommended Next Focus

Angle 5: invocation mechanics across Claude, Codex, Cursor, Devin, OpenCode, Pi and DSH; trace prompt hooks, system-context injection, runtime command registries, and limitations for calling slash commands programmatically.
