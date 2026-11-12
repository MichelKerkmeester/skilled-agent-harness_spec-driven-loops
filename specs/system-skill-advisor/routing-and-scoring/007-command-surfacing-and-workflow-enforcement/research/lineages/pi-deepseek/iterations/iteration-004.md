# Iteration 4: Run or ask — which commands may start unasked and where the policy lives

## Focus

Angle 4 (run or ask): decide which commands are safe to start without a question and which need one, using what the repository already declares rather than invention. Chosen because iteration 3 showed the contract has no policy field, so the question is whether policy *data* exists anywhere to carry.

## Actions Taken

1. Extracted `allowed-tools` and `argument-hint` from the frontmatter of all 45 command files and classified write capability.
2. Parsed `.skilled/commands/doctor/_routes.yaml` for `mutating`, `gate3_location`, `default_target`, and the `mcp_subroutes` block.
3. Cross-checked the parsed risk values against the 15 `readOnly` projections from iteration 2.
4. Read the repository's existing reversibility ladder rule.

## Findings

1. Frontmatter tool grants cannot discriminate risk: all 45 commands declare `Bash`, 33 also declare `Write`/`Edit`, and the 12 that declare neither still mutate through shell calls (`/doctor:install`, `/doctor:update`, `/doctor:symlink`, `/doctor:git`, `/doctor:overlay` …) [SOURCE: .skilled/commands/doctor/install.md:1]. A risk classifier built on `allowed-tools` would call every command mutating and learn nothing.

2. 25 of the 45 commands already accept an execution-mode suffix in their own `argument-hint` — `[:auto|:confirm]` — and the 20 that do not are exactly the 17 `/doctor:*` commands plus `/speckit:handoff`, `/speckit:save`, `/speckit:search` [SOURCE: .skilled/commands/speckit/plan.md:1]. So the run-or-ask vocabulary already exists per command, as free text, and the two families that lack it lack it for opposite reasons: doctor has a machine-readable manifest instead, and the three speckit commands have no mode at all.

3. `_routes.yaml` is the only machine-readable risk declaration in the tree: 33 route blocks plus 2 `mcp_subroutes` carry `mutating: read-only | add-only | mutates`, and most also carry `gate3_location`, a string naming the concrete file or database the route writes [SOURCE: .skilled/commands/doctor/_routes.yaml:41]. Tally across all 35 doctor bridges: 15 `read-only`, 2 `add-only`, 18 `mutates`.

4. The 15 `read-only` routes are the same 15 entries that carry `readOnly: true` in the TS projection, so the deriver's mapping `mutating === 'read-only' → readOnly: true` is verified end to end [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:305]. The risk signal already reaches the scorer; it stops before the JSON inventory and before the output contract.

5. No non-doctor source declares risk at all: `mutating` appears in none of the three `command-metadata.json` files, and `allow-list.json` carries only a free-text `reason` [SOURCE: .skilled/skills/sk-doc/command-metadata.json:1]. The deriver's `readOnly` path is therefore starved for the other 28 commands because the data was never authored, not because the mechanism is missing.

6. Name-based risk judgement fails in both directions: `/doctor:install`'s only route is `guide:read-only` (it prints an install guide, it does not install), while `/doctor:env`'s only route is `mutates` [SOURCE: .skilled/commands/doctor/_routes.yaml:707]. "Install sounds dangerous" and "env sounds harmless" are both wrong, which is the argument for a declared field over a heuristic.

7. A three-tier reversibility ladder already governs this repository: trivially reversible (working-tree edit, new untracked file, local commit) proceeds, reversible-with-effort states the undo cost, and irreversible (sent/published/deleted-remote/force-push/non-allowlisted push) needs a written rollback plus an explicit yes; an install still waits for a yes [SOURCE: .skilled/repo-rules/blast-radius.md:47]. That is the vocabulary a command policy should reuse instead of inventing `safe`/`unsafe`.

8. Applying the ladder to the declared data: 17 doctor bridges are safe to start unasked (15 read-only + 2 add-only to `scratch/`), 18 doctor bridges need a question first (`mutates`), and for the other 28 commands there is no declared answer — their writes are repo-tracked edits or in-repo artifacts (tier 1-2) except `/design:extract`, which fetches a live URL and writes outside the repo, and `/deep:*`, which spends model budget over up to 120 minutes [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/pi-deepseek/deep-research-config.json:1].

## Answer to the run-or-ask question

Policy should live in command metadata, not in `AGENTS.md` and not in the brief: add `mutating: read-only | add-only | mutates` plus a `gate3_location`-style write target to every command's metadata (the two fields `_routes.yaml` already proves work for 35 bridges), let the deriver carry them into the inventory and the output contract, and map them onto the existing ladder tiers: `read-only`/`add-only` → run, `mutates` → ask. The advisor then needs only one new field (`policy: run | ask`) rather than a policy engine, and the prompt-side rule stays one sentence that points at the ladder. Five hand-maintained lists is the failure mode to avoid; this adds risk to an existing source rather than a sixth list.

## Ruled Out

- Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant.
- Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples.
- Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way.

## Dead Ends

- Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`.

## Edge Cases

- Ambiguous input: "safe to start" could mean "no side effects" or "no irreversible side effects". Selected interpretation: the ladder's tiers, so repo-tracked edits count as safe-to-run and only irreversible or out-of-repo effects force a question.
- Contradictory evidence: `/doctor:install`'s name versus its `guide:read-only` route. Resolved in favour of the manifest, with the name-vs-declaration gap recorded as a failure mode for the surfacing design (a user typing "install" would be told to run a read-only guide, which is correct but surprising).
- Missing dependency: `_routes.yaml` has no `mutating` coverage for the 28 non-doctor commands; that is the gap this iteration names, not a tooling failure.
- Partial success: my first YAML parse found 0 routes because the block indentation is 2 spaces, not 4; re-parsed with the correct pattern and got 33 + 2. Recorded because the wrong count would have inverted the tally.

## Questions Answered

- Which commands are safe to start without asking, which need a question first, and where should that run-or-ask policy live?

## Questions Remaining

- 6 of 9 remain open.

## Sources Consulted

- .skilled/commands/ (frontmatter of 45 files)
- .skilled/commands/doctor/_routes.yaml
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/skills/sk-doc/command-metadata.json, .skilled/skills/sk-design/command-metadata.json, .skilled/skills/system-deep-loop/command-metadata.json
- .skilled/repo-rules/blast-radius.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q4 (run or ask), Q1 remainder (drift-proof inventory needs)
- Questions answered: Q4
- Findings: 8, all new

## Reflection

- What worked and why: parsing `_routes.yaml` for `mutating` and cross-checking the tally against iteration 2's 15 `readOnly` projections produced an end-to-end verification of the risk path — the signal exists, is correct, and is dropped at the JSON boundary. Finding the ladder in `blast-radius.md` meant the policy vocabulary did not have to be invented.
- What did not work and why: the first YAML parse used 4-space indentation and returned zero routes, which would have produced the false claim that no risk data exists. Re-parsing at the real indentation (2 spaces for list items, 4 for fields) fixed it. Second miss: I assumed `allowed-tools` would separate read-only from mutating commands; Bash is universal, so that classifier is empty.
- What I would do differently: check the repository rule files for an existing policy *before* classifying commands — the ladder already answered "what counts as needing a yes", which would have framed the whole iteration.

## Recommended Next Focus

Angle 5 (invocation mechanics) with angle 6 started: whether a model can start a slash command by itself on each runtime. Evidence to read: `AGENTS.md` Gate 4 and the `cli-*` skill contracts, the hook/brief delivery surface for each runtime, and any existing "the model dispatched a command" precedent such as `output: "SKILL ROUTING: User directed → [name]"`.
