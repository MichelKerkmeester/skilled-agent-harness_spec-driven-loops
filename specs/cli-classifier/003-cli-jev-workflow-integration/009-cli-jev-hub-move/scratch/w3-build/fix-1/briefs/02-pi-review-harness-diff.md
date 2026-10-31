ROLE: You are a read-only code reviewer. You write nothing and edit nothing.

CONTEXT: Work from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration.
Diff under review: run `git diff -- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs`.
The new code is the `assertGoldExpectations` function and its one call inside `typedGold`. The other hunks rename `cli-jev` to `cli-classifier` and were reviewed earlier; ignore them.
Reference pattern: `assertGoldExpectations` and its call in `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/harness/build-artifacts.cjs`, about lines 90-130.
Fixture: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json`.

ACTION: Check that the new function throws on the first mismatch of action, selection kind, modes, intents or resources; that it runs once per case before the row is built; that every fixture case has the fields it reads; that it matches the reference pattern; and that no code comment holds a spec path, packet or phase number, or a REQ, task or finding id.

FORMAT: One line per finding, `P0|P1|P2: <file>:<line> <problem>`, or `none`. Last line exactly `VERDICT: PASS` or `VERDICT: FAIL` (FAIL only for a P0 or P1).

Rules: Read-only. Do not write, edit, create or delete any file. No git command that writes. Do not run the harness. Never open a .env file.
