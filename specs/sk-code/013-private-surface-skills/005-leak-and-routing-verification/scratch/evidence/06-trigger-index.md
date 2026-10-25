# 06 - Retrieval artifacts

PROVISIONAL. Every section below was measured on 2026-10-24 against the verification clone as it stands now, at `9129007915a2b6ada693440ad106fd8eefa5e589` (the clone of `origin/main`, whose tip is the commit `chore(system-spec-kit): rebuild the trigger index`). The authoritative rerun happens at the final tip in T060 to T063. Sections A and B record the poll for the rebuild run and the pull of the rebuild commit. Sections C to H were measured before that pull, at `9129007915`, and are rerun at the final tip.

Path substitution: `CLONE` is `<SP>/psurf-clone-main` with `SP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`, in place of `/tmp/psurf-clone-main`.

## A - Rebuild run

```bash
gh run list --branch main --workflow "Trigger Index Rebuild" --limit 8 --json databaseId,status,conclusion,headSha,displayTitle,event,createdAt
gh run view 40113785851 --json jobs --jq '.jobs[]|{name,conclusion}'
git log -1 --format='%H %an %ad' aecc4258c0
```

Output, the rows that matter:

```text
run 40113785851  headSha 4aeb061b491e845529b151edac084d49711f4e19  "docs(sk-code): record the head leak sweep"  push  completed success  2026-10-24T16:55:37Z
{"conclusion":"success","name":"Rebuild the trigger index"}
{"conclusion":"skipped","name":"Push the trigger index rebuild"}
run 40114077362  headSha 25aa533f0b1e412d31d7e23be06060b465765026  "docs(sk-code): record the CI surface closure"  push  completed success  2026-10-24T16:59:40Z
aecc4258c09760848c152de7084191601ce2a73c github-actions[bot] Sat Oct 24 17:00:48 2026 +0000
```

The run on the C1 commit `4aeb061b49` completed successfully, and its push step was skipped because C1 changed only a scratch evidence file, which the corpus excludes, so there was nothing to rebuild. The next docs commit `25aa533f0b` changed spec documents inside the corpus. Its run pushed the rebuild commit `aecc4258c0` about a minute later, with the message `chore(system-spec-kit): rebuild the trigger index`.

Expected: a completed run whose displayTitle is chore(system-spec-kit): rebuild the trigger index and whose headSha is the C1 sha

Result: partly held, and the difference is recorded here. The run for the C1 sha completed with `success`, but its displayTitle is the C1 commit's own title and it pushed no rebuild commit. The rebuild commit that sits above C1 is `aecc4258c0`, produced by the run for the next commit. The criterion this feeds, that the committed index carries no private path, is checked in sections C to H against the rebuilt index and again at the final tip.

## B - Rebuild commit

```bash
git -C "$CLONE" pull --ff-only
git -C "$CLONE" log --oneline -6
```

Output (exit status 0, a fast-forward):

```text
1c0c3534cf ci(workflows): route repeated installs through the setup action
2759de1119 ci(workflows): merge the hook and plugin test jobs
aecc4258c0 chore(system-spec-kit): rebuild the trigger index
25aa533f0b docs(sk-code): record the CI surface closure
4aeb061b49 docs(sk-code): record the head leak sweep
c903c0d103 fix(system-skill-advisor): regenerate the compiled skill graph after the CI surface
```

Expected: the rebuild commit sits above the C1 commit

Result: held. `aecc4258c0` sits above `4aeb061b49`. Two later commits from the CI efficiency work (`2759de1119`, `1c0c3534cf`) sit above it, so the first log line is not the rebuild commit. This pull advances the verification clone only, and the closing commit of this phase integrates the same rebuild commit into the writer branch. Sections C to H were measured at `9129007915` before this pull and are rerun at the final tip.

## C - Live routing paths

```bash
IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
git -C "$CLONE" show 42b41dd286:.skilled/skills/system-spec-kit/runtime/data/trigger-index.json | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
```

Output:

```text
200
0
0
```

The second command prints `0` from `grep -c` and a second `0` from the `|| echo 0` fallback, so the scoped count is `0`.

Expected: 200 from the control, then 0

Result: held (provisional).

## D - Allowlisted audit paths

```bash
grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l
grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l
```

Output:

```text
      69
       0
```

`specs` is a corpus root at `corpus.mjs:31` and the 007 folder name carries the token.

Expected: 69 allowlisted, then 0 unclassified

Result: held (provisional).

## E - Phrase keys

```bash
grep -c -E '"(sk code obsidian|local webflow)[ "]' "$IDX" || echo 0
grep -c -E '^ *"(local webflow|local obsidian|sk code webflow|sk code obsidian)": \[' "$IDX" || echo 0
```

Output:

```text
38
0
0
```

The second command prints `0` from `grep -c` and a second `0` from the fallback, so the bare-key count is `0`. 38 keys come from the 007 packet and `004-private-local-skills/spec.md`.

Positive control for the bare-key pattern: the same regex over the committed index at two earlier commits, `git -C "$CLONE" show <commit>:.skilled/skills/system-spec-kit/runtime/data/trigger-index.json | grep -c -E '^ *"(local webflow|local obsidian|sk code webflow|sk code obsidian)": \['`, prints `1` at `42b41dd286` and `1` at `583316d083`. So the pattern still matches a bare skill-id key where one exists, and the `0` at the tip is a removal, not a broken pattern.

Where the 11 and the 21 come from: the narrow retained-key pattern of the first command prints `48` at `42b41dd286`, `49` at `583316d083` and `38` at the tip, so `49 - 38 = 11` keys went with the deleted surface folders. The broad pattern that also counts `sk code webflow` prints `58`, `59` and `38` at the same three commits, so `59 - 38 = 21`.

Expected: 38 retained keys, then 0 bare skill ids

Result: held (provisional).

## F - corpus-manifest.json

```bash
node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' "$CLONE/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json"
```

Output:

```text
69 0
```

Cross-check: the 69 matching lines in the file are all `specs/sk-code/007-sk-code-obsidian-surface/...` path strings.

Expected: 69 0

Result: held (provisional).

## G - generation-diagnostics.json

```bash
FIX="$CLONE/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures"
git -C "$CLONE" show 583316d083:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0
```

Output:

```text
60
0
0
```

The second command prints `0` from `grep -c` and a second `0` from the fallback, so the count is `0`.

Expected: 60 at 583316d083 as the control, then 0

Result: held (provisional).

## H - phrase-variants.json

```bash
git -C "$CLONE" show 583316d083:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' || echo 0
grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0
```

Output:

```text
59
38
```

Cross-check: the 38 keys are 37 of the form `sk-code-obsidian <words>` plus `local-webflow local-obsidian`.

Expected: 59 at 583316d083 as the control, then 38

Result: held (provisional).

<!-- evidence:end -->
