ROLE: read-only reviewer. Do not edit any file.

Review commits `HEAD~1` and `HEAD` together against `origin/main` in this worktree: `git show HEAD~1 HEAD`. The spec folder `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/025-cli-opencode-docs-and-listings/` is the packet; its `scratch/` files are the evidence (live probe captures of OpenCode 1.19.3 and 2.0.32, and mutation runs).

The change must do this:
1. Row 9: the doctor battery `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` gains a `command-listed` leg on both families. Required = `.md` files under `<root>/.opencode/{command,commands}/**`. Allowed extras = names from the global config folders on both families; on v2 also every ancestor `.opencode` folder (v2 walks past the repository root) and the built-ins `init` and `review`. v1 reads the `command` keys of `debug config`; v2 reads `GET /api/command` until two reads agree on a non-zero count.
2. Row 10: every current cli-opencode doc uses `opencode-go/deepseek-v4.1-flash` (changelog and benchmark folders and one dated coverage note are exempt), and `scripts/tests/default-model-id.test.cjs` holds them to the roster; it runs in `.github/workflows/opencode-dual-version.yml`'s unit-test step.
3. Row 11: docs say OpenCode loads `.opencode/agents/<slug>.md`, which links to `.skilled/agents/`.
4. Row 12: `--share` is documented as a hidden, deprecated no-op on 1.19.3 (evidence `scratch/row12-v1-share-source.txt`, `scratch/row12-v1-share-probe.txt`) and absent on 2.0.32, and no dispatch example or playbook command passes it.
5. Row 31: the `run` flag table in `references/cli-reference.md` and the core flag summary in `SKILL.md` match `scratch/row31-v1-run-help.txt` and `scratch/row31-v2-run-help.txt`.

Check: correctness of the leg and its tests (could any test pass vacuously; does the leg mis-judge a plain CI checkout, a repo with no command folder, or a global config folder), whether a doc now claims something the evidence does not show, whether a doc edit broke a sentence or a table, the workflow path filters, and code comments naming spec folders, phases, tasks or row numbers (forbidden). You may run `node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` (they write only to the OS temp folder). Do not start any opencode binary.

RETURN: first line `VERDICT: PASS` or `VERDICT: FAIL`, then each finding as `P0|P1|P2 file:line - problem - fix`. PASS means no P0 or P1.

This is round 2. Round 1 raised: (P1) an unsettled v2 command listing was judged as final; (P1) `cli-reference.md` still named the bare retired slug and the test missed it; (P2) the generated Hermes copy was not scanned; (P2) a share heading still said operator confirmation. Check each is resolved (mutations `scratch/mutation/row9-m3-no-settle-gate.txt` and `scratch/mutation/row10-m1-bare-slug.txt`), then review the whole change again. Note: the battery tests create fixtures in the OS temp folder, which a read-only sandbox refuses; an `EPERM` there is the sandbox, not the code.
