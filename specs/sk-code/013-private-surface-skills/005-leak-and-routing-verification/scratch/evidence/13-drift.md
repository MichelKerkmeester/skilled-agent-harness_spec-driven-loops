# 13 - Drift scripts

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent dispatched by the OpenCode 2 orchestrator, in the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`. Each command ran from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. The operator checkout `git status --porcelain` hash was identical before and after the runs, so the scripts wrote nothing there.

Scope note: the three drift scripts walk `--skills-dir .skilled/skills` and report `checked=14`, the 14 tracked skills. The two private skills sit in that directory as ignored `local-*` links and are not among the 14. In this agent shell `SPECKIT_PRIVATE_SKILL_ROOTS` was unset (the export lives in `~/.zshrc` and a login shell did not load it). As a supplementary run outside the task's Proof, each script was run again with the variable set to both external `local-skills/` roots and the output was byte-identical to the unset run (`diff -q` printed nothing), so these scripts do not read the private roots at all.

## A - Root metadata

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills; echo "exit=$?"
```

Output:

```text
OK   [H] cli-classifier
OK   [H] cli-external-orchestration
OK   [S] cli-orca
OK   [S] mcp-code-mode
OK   [H] mcp-tooling
OK   [H] sk-code
NOTE [INTENT_SIGNALS_TRIGGER_RECONCILIATION] sk-code: intent_signals/derived.trigger_phrases Jaccard=0.034
OK   [H] sk-design
OK   [H] sk-doc
OK   [S] sk-git
OK   [S] sk-prompt
OK   [S] sk-vision
OK   [H] system-deep-loop
OK   [S] system-skill-advisor
OK   [S] system-spec-kit

checked=14 passed=14 failed=0 fixed=0
exit=0
```

Expected: exit 0; a non-zero exit is recorded as a finding

Result: held. Exit 0 with `checked=14 passed=14 failed=0 fixed=0`. One `NOTE` line for `sk-code` (`INTENT_SIGNALS_TRIGGER_RECONCILIATION`, Jaccard 0.034) is advisory and did not change the exit code.

## B - Leaf manifest

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
```

Output:

```text
OK    cli-classifier  a24927396214ab841312a00a75e03ae22c74b0002f3b1edbd2925288a5002197
OK    cli-external-orchestration  6cd87adea8cbe4a8e64c8b18880ce8373305abb3453f1cf7b5efcda115576035
OK    cli-orca  9193b5032798148726de1eaabf59627d5834ecbadb9592eec7f24247818d7600
OK    mcp-code-mode  e8614e5a111ea5e51370589f56929693242c8a71496af4f9d6914526dfc79b11
OK    mcp-tooling  a79578496e244358f7fc87a9ed74cbebc468231dec3d4e80b888abbc7dab2fd7
OK    sk-code  3e4bf173a3cfc1d813f9e943a0b0409214ad6d2cc64ddc841404e87de9a317b3
OK    sk-design  1cdca644379a5ebd716621fd8abb38a6ecdd0af0ae15df1a9bce6da62f78c723
OK    sk-doc  b7295919a286bb1377ea78af03093b3e17625f0e8168e2768b564f49ba481b42
OK    sk-git  6c4ddd342902b58a1c31ad5bfb662554ab4590c1880f83510113c627f9f99636
OK    sk-prompt  922a3899ce9d8ff96ed63d41689318e6b802471452a0647c8ab261c0d84bdb71
OK    sk-vision  c2a9f38562b29504ec620677341da9d12a9a10e9014de337f2d8e9c71bcecaee
OK    system-deep-loop  839a2b3e0d8968484af6a562e5b605b6ade7527579e1fca636496098d1ad60c0
OK    system-skill-advisor  4c01a1e77ec3d362f23759f7ea990278002c0e702baa9c113dc6a86af370d390
OK    system-spec-kit  067a33b375ca0654cd781020a7fe8ed050441f6edff092af5a79910d270ea754

checked=14 fresh=14 failed=0
exit=0
```

Expected: exit 0; a non-zero exit is recorded as a finding

Result: held. Exit 0 with `checked=14 fresh=14 failed=0`.

## C - Derived freshness

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
```

Output:

```text

checked=14 fresh=14 stale=0 errored=0
exit=0
```

Expected: exit 0; a non-zero exit is recorded as a finding

Result: held. Exit 0 with `checked=14 fresh=14 stale=0 errored=0`.

## D - Exported graph

Path note: the task writes to `/tmp/psurf-skill-graph.json`. This run wrote to `$S/psurf-skill-graph.json` with `S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`, because the dispatch limited temporary files to that folder. The tracked `runtime/scripts/skill-graph.json` stayed untouched (`git status --porcelain` on it printed 0 lines before and after).

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json --output $S/psurf-skill-graph.json; echo "exit=$?"
grep -c '"local-' $S/psurf-skill-graph.json || echo 0
```

Output:

```text
WARNING: Output exceeds 4KB target (18465 bytes)
Discovered 14 skill graph-metadata.json files
VALIDATION PASSED: all metadata files are valid
Compiled skill-graph.json: 18465 bytes (14 skills)
  Families: 6
  Adjacency entries: 14
  Conflicts: 0
  Hub skills: ['cli-external-orchestration', 'sk-code', 'sk-git', 'system-spec-kit']
  Output: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-skill-graph.json
exit=0
0
0
```

The compiler exit code is 0. The `local-` id count is 0. It prints twice because `grep -c` prints its `0` and exits 1, which fires the `|| echo 0` fallback, so the two lines are one live count of `0`. The exported file is compact JSON on a single line (`wc -l` printed `1`), so `grep -c` could only ever read 0 or 1 here. Two supplementary reads of the same file:

```bash
grep -c '"sk-code' $S/psurf-skill-graph.json
grep -o 'local-[a-z]*' $S/psurf-skill-graph.json | sort | uniq -c
```

```text
1
```

The first line is the positive control (the same grep form finds `sk-code`). The second command printed nothing, so no `local-` token of any kind appears in the export. The compiler also skips any `local-*` entry and any linked folder by design (`skill_graph_compiler.py` lines 201 to 208).

Expected: the export writes /tmp/psurf-skill-graph.json and the count is recorded as-is

Result: partly held. The export ran and the count is recorded (0), but the file is at the scratchpad path above and not at `/tmp/psurf-skill-graph.json`.

## E - Env-set rerun comparison and the workflow's own form

The scope note above says each script was rerun with `SPECKIT_PRIVATE_SKILL_ROOTS` set and printed byte-identical output. This section records the comparison itself. The two saved runs per script are in the earlier session's scratch folder, one with the variable unset and one with it set. In the file names `d-` and `dr-` are those two runs, and which is which does not matter to the comparison.

```bash
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad
for n in ci-skill-root-metadata ci-leaf-manifest-freshness ci-skill-derived-freshness; do diff -q $S/d-$n.txt $S/dr-$n.txt; echo "$n diff-exit=$?"; done
for n in ci-skill-root-metadata ci-leaf-manifest-freshness ci-skill-derived-freshness; do wc -c $S/d-$n.txt $S/dr-$n.txt; done
```

Output (`diff -q` itself printed nothing, and the three `wc -c` blocks are as printed, with the scratch path shortened to `$S`):

```text
ci-skill-root-metadata diff-exit=0
ci-leaf-manifest-freshness diff-exit=0
ci-skill-derived-freshness diff-exit=0
     462 $S/d-ci-skill-root-metadata.txt
     462 $S/dr-ci-skill-root-metadata.txt
     924 total
    1228 $S/d-ci-leaf-manifest-freshness.txt
    1228 $S/dr-ci-leaf-manifest-freshness.txt
    2456 total
      46 $S/d-ci-skill-derived-freshness.txt
      46 $S/dr-ci-skill-derived-freshness.txt
      92 total
```

Expected: no difference for any of the three. Held: yes, all three pairs are byte-identical, so the three drift scripts do not read the private roots.

The workflow runs a different form from the one above. Lines 198 to 200 of `.github/workflows/routing-registry-drift.yml`, read at the repository tip on 2026-10-24, call `node .opencode/skills/sk-doc/sk-create-skill/scripts/<script>.cjs` with no `--skills-dir`, and the compiler call at line 211 is `--validate-only`, not `--export-json`. The commands above passed `--skills-dir .skilled/skills`. To close that gap the three scripts were run once in the workflow's own form from the repository root, with the variable unset and then set:

```bash
for n in ci-skill-root-metadata ci-leaf-manifest-freshness ci-skill-derived-freshness; do node .opencode/skills/sk-doc/sk-create-skill/scripts/$n.cjs; echo "exit=$?"; done
```

Output (the last line of each script, each exit `0`, the same with the variable set, and `git status --porcelain` identical before and after):

```text
checked=14 passed=14 failed=0 fixed=0
checked=14 fresh=14 failed=0
checked=14 fresh=14 stale=0 errored=0
```

Expected: the same `checked=14` counts as the `--skills-dir` form. Held: yes. `.opencode/skills` is a symlink to `../.skilled/skills`, and the default directory resolves to the same 14 tracked skills. The export in section D is a stricter probe than the workflow runs.

<!-- evidence:end -->
