# 01 - Head leak sweep

Run on 2026-10-24 in the operator checkout on `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`.

## A - Tracked paths

```bash
git ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
git ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
git ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
```

Output:

```text
336
0
0
108
```

Reading the output: line 1 is the control (336). The second command prints `0` from `grep -c` (exit status 1 on zero matches) and the `|| echo 0` fallback prints a second `0`, so lines 2 and 3 are one live count of `0` printed twice. Line 4 is the retained `specs/` count (108).

Expected: 336 at 42b41dd286 as the control, 0 live, 108 retained specs/ paths

Result: held. The control, the live count and the retained count match the Expected line.

## B - Tracked content

```bash
git grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'
git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l
```

Output:

```text
1528
     256
```

Expected: 1528 at 42b41dd286 as the control, then 0

Result: BLOCKED. The control held (1528) but the live count is 256, not 0. The working tree and `HEAD` agree (`git grep -c ... HEAD` also sums to 256), so the live count is not a dirty-tree artifact. `git grep -l` over the same pathspec prints 17 paths and the per-path counts at `HEAD` are:

```text
HEAD:.skilled/scripts/git-hooks/tests/pre-commit.test.sh:6
HEAD:.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:1
HEAD:.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts:2
HEAD:.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:3
HEAD:.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts:3
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:4
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-align.md:9
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-apply.md:7
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:8
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-record-base.md:8
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-rollback.md:5
HEAD:.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:9
HEAD:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:69
HEAD:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:38
HEAD:.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/specs_sk-doc_z_archive_025-skill-doc-currency_004-hub-surface-drift-sweep_spec.md:10
HEAD:.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs:5
HEAD:.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:69
```

Classification read from the hits themselves: eight paths are the two retained D6 prefixes (seven under `manual-testing-playbook/doctor-commands/`, one under `anchor-repair-sample/`). The other nine paths are new since the spec was written: six test files whose fixtures create a throwaway `local-webflow` or `sk-code-webflow` directory (`pre-commit.test.sh`, `skill-root-metadata-contract.test.cjs`, `skill-graph-freshness-panel.vitest.ts`, `advisor-status.vitest.ts`, `private-skill-target.vitest.ts` and `sync-skills-hermes.test.mjs`) and three regenerated retrieval artifacts (`corpus-manifest.json`, `phrase-variants.json`, `trigger-index.json`) whose hits are retained `specs/sk-code/007-sk-code-obsidian-surface/` paths and the phrase keys `local-webflow local-obsidian` and `sk-code-obsidian ...`. Candidate owners: phase 003 and 004 for the six test files (they added private-skill tests), the retrieval rebuild for the three artifacts. This phase does not repair any of them.

## C - Bare surface tokens

```bash
git grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -c 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
```

Output:

```text
566
4
       0
```

Expected: 566 at 583316d083 as the control, then 4 raw in the post-removal tree, then 0 after the filter

Result: held (566, 4, 0). The four lines the `grep -v 'WEBFLOW:'` stage removed, quoted from `rg -n`:

```text
.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:149:        re.compile(r'\bWEBFLOW\s*:'),                   # WEBFLOW: platform tag
.skilled/skills/sk-code/shared/references/universal/code-style-guide.md:149:| A platform / library name (`WEBFLOW:`, `MOTION:`, `LENIS:`) | Yes | Names a durable platform, not a tracking artifact |
.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:32:- `check-comment-hygiene.sh` reads the file, ... an allowed-class token (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`), and flags any remaining comment matching a `VIOLATION_PATTERN`. ...
.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:119:2. **Banner missing, no stderr, checker returned rc=2 (skip) or rc=0 (clean)**: ... is not pre-empted by an `ALLOWED_PATTERN` (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`); ...
```

All four are platform-tag mentions (the comment-hygiene checker's allowed-class list and its documentation). None is a surface instruction, so the filter hides no leak.

<!-- evidence:end -->
