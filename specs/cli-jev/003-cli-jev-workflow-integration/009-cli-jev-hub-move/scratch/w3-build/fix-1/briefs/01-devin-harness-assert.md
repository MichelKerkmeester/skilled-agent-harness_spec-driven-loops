ROLE: You make one exact code edit in a Node.js CommonJS file, then copy that file to one other path.

CONTEXT: Work from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration.
File A: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs
File B: specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs
`typedGold()` in File A never checks each case against the fixture's expectations. Add that check.

ACTION:
1. Read File A in full.
2. In File A, directly above the line `function typedGold(snapshot, fixture) {`, insert this block exactly, followed by one blank line:

```js
// Build-time expectation check: the fixture's declared action, selection kind,
// modes, intents and resources are asserted against the evaluated decision and
// its scorer projection, so a behavior change that rewrites the typed route
// gold fails here instead of silently re-baselining.
function assertGoldExpectations(entry, result, observed) {
  const fail = (detail) => {
    const error = new Error(`gold mismatch for ${entry.id}: ${detail}`);
    error.code = 'GOLD_MISMATCH';
    throw error;
  };
  if (result.decision.action !== entry.expectedAction) {
    fail(`action ${result.decision.action} but expected ${entry.expectedAction}`);
  }
  if (entry.expectedSelectionKind
    && result.decision.action === 'route'
    && result.decision.route.selectionKind !== entry.expectedSelectionKind) {
    fail(`selection kind ${result.decision.route.selectionKind} but expected ${entry.expectedSelectionKind}`);
  }
  const modes = result.decision.action === 'route'
    ? result.decision.route.targets.map((target) => target.destinationId.workflowMode)
    : [];
  if (JSON.stringify(modes) !== JSON.stringify(entry.expectedModes || [])) {
    fail(`modes [${modes.join(', ')}] but expected [${(entry.expectedModes || []).join(', ')}]`);
  }
  if (JSON.stringify(observed.observedIntents) !== JSON.stringify(entry.gold.expectedIntents)) {
    fail(`intents [${observed.observedIntents.join(', ')}] but expected [${entry.gold.expectedIntents.join(', ')}]`);
  }
  if (JSON.stringify(observed.observedResources) !== JSON.stringify(entry.gold.expectedResources)) {
    fail(`resources [${observed.observedResources.join(', ')}] but expected [${entry.gold.expectedResources.join(', ')}]`);
  }
}
```

3. In File A, inside `typedGold`, directly after the line
`    const observed = projectToRouteGold(result.decision, { policy: snapshot.policy });`
insert this one line:
`    assertGoldExpectations(entry, result, observed);`
4. Run `cp` to copy File A over File B, so the two are byte-identical.
5. Run `node --check` on File A and `cmp` File A File B.

FORMAT: Reply with the output and exit status of step 5, then `DONE` or `BLOCKED: <reason>`.

Rules: Change no other line and no other file. Do not run the harness. No git commands that write (add, commit, stash, checkout, restore, reset, mv, rm). No installs. Never open a .env file. Comment hygiene is a hard block: no spec path, packet or phase number, REQ, task or finding id in a code comment.
