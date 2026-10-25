# 11 - Final tip

Recorded on 2026-10-24 in the operator checkout. The commit that carries the evidence, `01742752c1` (`docs(sk-code): verify the private surface removal`), was pushed to `origin/main`, and the trigger-index rebuild it started landed as `634c32b3c7`. Every command below ran against a fresh public clone of that tip. `FINAL` is the clone folder `psurf-final-tip` under this session's scratchpad (`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/95ada57e-a713-4e75-bbf5-1d7db3703a57/scratchpad`), and the blob id files carry the prefix `final-` in the same folder, in place of the `/tmp` paths the proof commands name. The expectations are the ones the operator amended on 2026-10-24.

## A - Final-tip clone

```bash
FINAL=<SP>/psurf-final-tip
rm -rf "$FINAL"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$FINAL"
git -C "$FINAL" log --oneline -3
git -C "$FINAL" rev-parse HEAD
```

Output (the clone took about two minutes):

```text
634c32b3c7 chore(system-spec-kit): rebuild the trigger index
01742752c1 docs(sk-code): verify the private surface removal
a60192ef4e ci(workflows): remove the hermes trigger probe file
634c32b3c73e59cbddeb569f25425ab5efc13140
```

Expected: the rebuild commit above C2

Result: held. The first line is the rebuild commit `634c32b3c7` and the evidence commit sits below it.

## C - Paths and content

```bash
ALLOW='^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/'
git -C "$FINAL" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
git -C "$FINAL" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
git -C "$FINAL" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
git -C "$FINAL" grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'
git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l
git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -c -E "$ALLOW" || echo 0
git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E "$ALLOW" | wc -l
```

Output, in the order of the commands (the live-path command prints `0` from `grep -c` and a second `0` from the fallback, which is one count of `0`):

```text
336
0
0
108
1528
      17
8
       9
```

The nine paths outside the two D6 prefixes are the same nine the clone sweep recorded in `03-fresh-clone-leak.md`: six test files (`.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts` and `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`) and three retrieval artifacts (`corpus-manifest.json`, `phrase-variants.json` and `trigger-index.json`).

Expected: 336 at 42b41dd286 as the control, 0 live, 108 retained specs/ paths, then 8 D6-kept content paths and 9 accepted paths (6 test fixtures and 3 retrieval artifacts, as amended), with the control 1528 and 17 paths in all

Result: held. The control is `336`, the live count is `0`, the retained `specs/` count is `108`, the content control is `1528`, and the 17 paths split as 8 kept records and 9 accepted paths. The values equal the earlier clone sweep.

## D - Tokens and blobs

```bash
rg -n 'WEBFLOW|OBSIDIAN' "$FINAL/.skilled/skills/sk-code" "$FINAL/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
rg -n 'WEBFLOW|OBSIDIAN' "$FINAL/.skilled/skills/sk-code" "$FINAL/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
git -C "$FINAL" grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
```

Output:

```text
       4
       0
566
```

The blob check ran the same classification as `03-fresh-clone-leak.md` section E2, against the final clone and the private roots as they are now (`find -L` follows the two symlinks under `.skilled/skills/`):

```bash
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -print | wc -l
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -size +0c -print0 | xargs -0 git hash-object --no-filters | sort -u > final-private-blob-ids.txt
git -C "$FINAL" ls-tree -r 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | awk '{print $3}' | sort -u > final-base-blob-ids.txt
comm -12 final-private-blob-ids.txt final-base-blob-ids.txt > final-history-exposure-blob-ids.txt
git -C "$FINAL" ls-tree 42b41dd286 -- .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md .skilled/skills/sk-code/shared/references/workflow-verify.md | awk '{print $3}' | sort -u > final-copied-reference-blob-ids.txt
comm -23 final-private-blob-ids.txt final-base-blob-ids.txt | comm -23 - final-copied-reference-blob-ids.txt > final-new-blob-ids.txt
git -C "$FINAL" cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' | awk '$2=="blob"{print $1}' | sort -u > final-public-blob-ids.txt
comm -12 final-private-blob-ids.txt final-public-blob-ids.txt | wc -l
comm -12 final-new-blob-ids.txt final-public-blob-ids.txt | wc -l
```

Output, in the order (a) files, (a) unique ids, (b) base ids, (c) already public in history, (d) copied references, (e) new or changed, the size of the public blob dump, (f) control, (f) assertion:

```text
     228
     225
     223
     138
       1
      86
  557036
     139
       0
```

Expected: 0 tokens, at least 1 from the control, then 0 new or changed blobs

Result: held. The token count after the `WEBFLOW:` filter is `0` (`4` raw lines, the same count as the clone sweep) against the control `566`. The blob figures equal the earlier clone run in every position, with the public dump at 557036 blobs instead of 556742 because the repository gained commits since. The control finds `139` private ids already public (138 through the base commit and 1 through the copied reference), and the assertion finds `0` of the 86 new or changed ids in the public dump.

## E - Artifacts

```bash
IDX="$FINAL/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
FIX="$FINAL/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures"
grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l
grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l
node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' "$FIX/corpus-manifest.json"
grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0
grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0
```

Output (the live-index and diagnostics commands each print `0` from `grep -c` and a second `0` from the fallback, which is one count of `0` for each):

```text
0
0
      69
       0
69 0
0
0
38
```

Controls at the earlier commits, so each zero is a real removal: the index at `42b41dd286` holds `200` matching lines, the diagnostics file at `583316d083` holds `60` and the phrase variants at `583316d083` hold `59`.

Expected: 0 live index paths, 69 allowlisted, 0 unclassified, 69 and 0 from the manifest, 0 diagnostics, 38 variants

Result: held. Every value equals the earlier measurement at `9129007915`, and the artifacts are the rebuilt ones from `634c32b3c7`.

## F - Result against the criterion

AC-015 asks that the checks rerun on the refreshed tip print the same value as the earlier run. The path, content, token, blob and artifact checks printed the same values in every position. The blob check reprinted `139` already-public ids as its control and `0` for new or changed content. The one value that moved is the size of the public blob dump, and it moved because the repository grew.

<!-- evidence:end -->
