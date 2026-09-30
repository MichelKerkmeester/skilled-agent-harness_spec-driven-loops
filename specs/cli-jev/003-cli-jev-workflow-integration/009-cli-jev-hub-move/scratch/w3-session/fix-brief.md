# Fix round 1 for phase 009: one review P1 and one doc gate

You are a fresh Opus 5.5 xhigh fix orchestrator leaf. Never use the Agent tool. You reach executors only through `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/dispatch.sh <devin|pi> <brief.md> <log-prefix>` by Bash: Devin `deepseek-v4-1-flash-max`, Pi `llmgateway/mimo-v2.6-pro` at thinking high. Exit code is not a verdict: read `<log-prefix>.last.txt` and diff the tree.
Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`
Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move`. Your scratch dir: `<phase>/scratch/w3-build/fix-1/` (briefs, logs, `fix-evidence.md`).

## Pre-resolved gates (nobody is at your prompt, so do not ask)

- Gate 3 is answered: the phase folder above. The session verified the build and ran a cross-family review. Only the two items below are yours.
- You write only under `fix-1/`. Executors write only the files named in each item. No git writes of any kind (add, commit, stash, checkout, restore, reset, mv, rm): the index holds a staged move the session commits. No install. Never open a `.env`. Do not call `jev` or the Deem server. Do not touch `trigger-index.json`, the retrieval fixtures, `baseline-readme-verdicts.json`, any changelog or dated benchmark report, the phase docs, or `specs/**` outside the two twin paths named in item 1.
- Comment hygiene is a hard block: no spec path, packet or phase number, REQ, task or finding id in a code comment. Put that line in every code brief. Briefs are short, one change, literal text.

## Item 1 (review P1, code): the cli-classifier canary harness asserts its fixture expectations

Finding (confirmed by the session): `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs`, `typedGold()` at about lines 132-160, records each case's observed `decisionAction` and targets but never compares them with the fixture's `expectedAction`, `expectedSelectionKind` and `expectedModes`. So the new `deem-choice-single` case (expects route single `cli-deem`) could regress to defer or to `cli-jev` and the build would still pass. The sibling `009-parent-hub-rollout/009-sk-design/harness/build-artifacts.cjs` already has the pattern: `assertGoldExpectations()` at about lines 90-120 and its call site. Read both files in full first.

Change: add the same check to the cli-classifier harness, called once per case inside `typedGold()`, throwing on the first mismatch. Keep the intents and resources comparison only if every case in `008-cli-classifier/fixtures/canary-cases.v1.json` carries `gold.expectedIntents` and `gold.expectedResources`; otherwise assert action, selection kind and modes only, and say which in the evidence. Then copy the edited file byte-identical to the authored twin `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs`. One Devin brief for the edit, then `cmp` the two files yourself.

Proof, from the final state:
1. `node <runtime harness path>` (read how the build ran it: `scratch/w3-build/build-evidence.md` section 6 and the harness header) exits 0, and `git status --porcelain` and `git diff --stat` over the twin's `008-cli-classifier/compiled/` and `activation/` show no change from before your run (record both before and after).
2. A negative proof that writes no tracked file: copy the harness and fixture into `fix-1/neg/` with the same relative layout the harness needs, or load the harness module from a scratch script with a fixture copy in which `deem-choice-single` expects `cli-jev`, and show it throws `gold mismatch for deem-choice-single`. If the harness cannot run outside its tree without writing tracked files, say so and give the reason instead.
3. `node .skilled/bin/compiled-route-sync.cjs --check` and `--verify`, `node .skilled/bin/compiled-route-guard.cjs`, `node .skilled/bin/compiled-route-admission.cjs --hub cli-classifier`, `node .skilled/bin/compiled-route-manifest.cjs freshness --hub cli-classifier --skill-root .skilled/skills/cli-classifier`, and `cd .skilled && npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` (37 passed). Each exit 0.
4. Cross-family check: one read-only Pi brief that reviews only this diff (`git diff -- <runtime harness path>`) against the sk-design pattern, reports P0/P1/P2 lines and `VERDICT: PASS|FAIL`, and writes nothing. Fix a P0 or P1 it raises with one more Devin brief.

## Item 2 (doc gate): the moved cli-usage playbook root validates

`.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/manual-testing-playbook.md` fails `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` (exit 1, missing `overview`) and with `--type playbook` (4 blocking: `overview`, `global_preconditions`, `global_evidence_requirements`, `deterministic_command_notation`). The build changed one row in it, so parent criterion 3 needs it to pass. Read the file, the sk-doc playbook template the validator enforces (find it under `.skilled/skills/sk-doc/` by the section names), and a sibling playbook root that passes (for example `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/manual-testing-playbook.md`, check it passes first).

Change, one Pi brief: add or rename sections so both validator runs exit 0, reusing the file's own text (its "HOW TO RUN" and "EVIDENCE RULES" content moves under the required names rather than being duplicated). Keep every scenario row, every command and every Jev privacy or gate word exactly as written. Keep the git rename similarity at 50 percent or more: after the edit, `git diff HEAD -M --stat --find-renames -- .skilled/skills/cli-jev/cli-usage/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/manual-testing-playbook.md` must still show one rename, and report its similarity (use `git diff HEAD -M --summary` over both paths).

Proof: both validator runs exit 0 (print their result lines), the similarity line, and `grep -c` of the scenario index rows before and after (equal).

## Report back (under 250 words)

Write `fix-1/fix-evidence.md` with every command, its printed result and exit status. Report: each item PASS or FAIL, the Pi verdict on item 1, the negative-proof output line, the similarity line, `git status --porcelain` lines that changed since you started, and anything you could not do and why.
