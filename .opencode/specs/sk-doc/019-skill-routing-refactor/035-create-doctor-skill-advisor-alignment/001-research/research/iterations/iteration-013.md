# Iteration 013 — Shared handoff implementation boundary

## Focus

Determine whether the create/doctor skill-advisor handoff should use one reusable formatter or duplicated presentation fields guarded by a contract test.

## Actions Taken

- Re-ran node .opencode/bin/install-codex-hooks.mjs --check. It exited 1 before comparison because this linked worktree is not the primary checkout; the command identified /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public as the primary checkout and did not write anything.
- Read the /create:skill-parent router and presentation contract, the auto workflow completion contract, the /doctor router and generic presentation contract, the doctor:skill-advisor workflow, and the parent-skill doctor route.
- Read the existing static presentation contract test pattern in .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs.
- Verified the live advisor CLI manifest and parser. list-tools --names-only --format json returned all nine tools, including skill_graph_validate; a warm-only validation call returned exit 75 because no advisor daemon socket was available.

## Findings

1. **F13-01 — There is no common formatter boundary to reuse (P1).** Create and doctor are prompt-asset workflows, not two callers of a shared rendering module. /create:skill-parent owns a dedicated create-skill-parent-presentation.txt, while /doctor loads the generic doctor-speckit-presentation.txt; advisor-specific approval and verification text remains embedded in doctor-skill-advisor.yaml. A reusable formatter would therefore require a new executable layer plus a change to the current presentation ownership contract. [SOURCE: .opencode/commands/create/skill-parent.md:1-6,31-47; .opencode/commands/doctor/speckit.md:1-4,20-40; .opencode/commands/doctor/assets/doctor-speckit-presentation.txt:1-3,149-177; .opencode/commands/doctor/assets/doctor-skill-advisor.yaml:124-207,318-328]

2. **F13-02 — The two consumers need different result shapes.** Create completes a scaffold and reports hub identity, generated metadata, and structural validation. Doctor is a mutating, phase-gated workflow that reports approved files, rollback state, graph scan counts, tests, and an explicit unverified branch. Sharing a whole rendered formatter would either flatten those lifecycle differences or force the formatter to grow workflow-specific conditionals. The stable part is the handoff vocabulary and command snippets, not the full output layout. [SOURCE: .opencode/commands/create/assets/create-skill-parent-presentation.txt:114-154; .opencode/commands/create/assets/create-skill-parent-auto.yaml:426-506; .opencode/commands/doctor/assets/doctor-skill-advisor.yaml:145-207,318-348]

3. **F13-03 — A static contract test is an existing, proportionate mechanism for this asset boundary (P1).** The repository already tests parallel presentation/workflow assets by enumerating files and asserting required text, allowed tools, and stale-reference absence. The same pattern can assert that create and doctor both expose selected_repo, current_checkout, primary_checkout, hub_identity, generated-metadata status, graph_refresh, advisor_rebuild, and validation, without requiring byte-identical prose. [SOURCE: .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:20-45,70-104]

4. **F13-04 — The contract test must pin command semantics, not only labels.** The CLI manifest declares advisor_rebuild with force and workspaceRoot, and skill_graph_validate with an empty input schema; the parser accepts the shared output flags and trusted mutation marker. The exact operator handoff forms remain:

~~~bash
cd "<selected_repo>"
node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --skills-root .opencode/skills --format json
node .opencode/bin/skill-advisor.cjs skill_graph_validate --format json
node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --workspace-root "$PWD" --force true --format json
~~~

The handoff should present skill_graph_scan or advisor_rebuild as the operator-selected refresh, followed by validation; it should not print an unconditional mutation chain. The test should pin --trusted on the two mutation commands and no input flags on skill_graph_validate. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts:47-55,138-140; .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:382-535; list-tools command result]

5. **F13-05 — Create currently has the larger lifecycle gap.** Its parent completion report includes structural checks and an advisor-map sync note for lexical/alias-fold modes, but no graph refresh, advisor rebuild, or validation status. Doctor does run advisor_rebuild({ force: true }) after approved mutations, yet its route manifest omits skill_graph_validate and its generic result template has no shared parent-handoff fields. This is presentation drift, not evidence that a runtime formatter is missing. [SOURCE: .opencode/commands/create/assets/create-skill-parent-auto.yaml:426-506; .opencode/commands/create/assets/create-skill-parent-presentation.txt:114-154; .opencode/commands/doctor/_routes.yaml:99-122; .opencode/commands/doctor/assets/doctor-skill-advisor.yaml:318-328]

6. **F13-06 — Source selection must remain data in the handoff.** The hook check reproduced the linked-worktree refusal. The shared vocabulary should carry current_checkout, primary_checkout, and selected_repo, but neither create nor a read-only diagnostic should infer that --allow-worktree authorizes a different source or mutation. The contract test should require the selected-checkout block before refresh commands. [SOURCE: node .opencode/bin/install-codex-hooks.mjs --check result; .codex/SYNC.md:108-117]

## Questions Answered

- **Implementation choice:** duplicate the handoff fields in the create presentation and doctor presentation/workflow assets, then guard them with one static contract test. Do not introduce a reusable runtime formatter on the current evidence.
- **What should be shared:** field names, status vocabulary (NOT RUN, PASS, FAIL, UNAVAILABLE), checkout/source block, and exact CLI command semantics. Keep lifecycle-specific prose, rollback prompts, and completion layouts local to each consumer.
- **Mutation ownership:** keep skill_graph_scan and advisor_rebuild operator-owned. The handoff reports them as NOT RUN and prints the selected command; it does not execute either during create completion or read-only diagnosis.
- **Validation placement:** include skill_graph_validate in the same handoff vocabulary and command contract, then separately decide whether /doctor:skill-advisor should add it to route metadata or expose it through a CLI-only follow-up.

## Questions Remaining

- Should /doctor:skill-advisor add mcp__mk_skill_advisor__skill_graph_validate to _routes.yaml, or remain CLI-only while the route’s MCP declaration stays focused on its existing workflow?
- Should the parent-skill doctor emit a non-blocking warning for description.json vocabulary divergence, or keep its current structural-only projection guard?
- Should the contract test cover /create:skill as well as /create:skill-parent, given the standalone create path has a separate memory/indexing presentation?

## Next Focus

Resolve the doctor-route ownership of skill_graph_validate and define the smallest contract-test fixture that covers both parent creation and advisor diagnosis without asserting identical prose.

