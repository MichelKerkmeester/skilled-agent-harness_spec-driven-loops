# 14 - Corpus boundary

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent dispatched by the OpenCode 2 orchestrator. The generator ran from the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`.

Path note: the tasks name `/tmp/psurf-corpus-probe`. The probe repository for this run lives at `$P` with `S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad` and `P=$S/psurf-corpus-probe`, because the dispatch limited temporary files to that folder. Every command below uses that `P`. The operator checkout `git status --porcelain` hash was identical before and after the generator ran, so it wrote only under `$P/out`.

## A - Probe repository

```bash
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad
P=$S/psurf-corpus-probe
rm -rf "$P" && mkdir -p "$P/.skilled/skills/system-spec-kit" "$P/.skilled/skills/local-probe" "$P/.skilled/skills/control" "$P/specs/probe"
cd "$P" && git init -q
printf '/.skilled/skills/local-*\n' > .gitignore
printf -- '---\ntitle: "system-spec-kit sentinel"\ndescription: "probe sentinel"\ntrigger_phrases:\n  - "probe sentinel"\n---\n# sentinel\n' > .skilled/skills/system-spec-kit/SKILL.md
printf -- '---\ntitle: "local probe"\ndescription: "ignored private probe"\ntrigger_phrases:\n  - "psurf-corpus-probe-marker-7f3c1a"\n---\n# local probe\npsurf-corpus-probe-marker-7f3c1a\n' > .skilled/skills/local-probe/SKILL.md
printf -- '---\ntitle: "control skill"\ndescription: "tracked control"\ntrigger_phrases:\n  - "psurf-control-marker-7f3c1a"\n---\n# control\npsurf-control-marker-7f3c1a\n' > .skilled/skills/control/SKILL.md
printf -- '---\ntitle: "probe spec"\ndescription: "tracked spec"\ntrigger_phrases:\n  - "probe spec"\n---\n# probe spec\n' > specs/probe/spec.md
git add -A && git -c user.email=probe@local -c user.name=probe commit -qm probe
git status --porcelain --ignored .skilled/skills/local-probe
```

Output (the `NOTICE` line is the pre-commit hook of the probe repository reporting an untrusted clone, which is expected for a throwaway repository):

```text
NOTICE [gate:hook-trust]: this clone is not trusted, so the pre-commit checks were skipped.
Enable them: git config --local skilled.trustRepoHooks true
!! .skilled/skills/local-probe/
```

Expected: `!! .skilled/skills/local-probe/`

Result: held. The status line is `!! .skilled/skills/local-probe/`, so the ignore rule covers the private probe skill.

## B - Generation

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root $P --out $P/out/trigger-index.json --quiet; echo "exit=$?"
ls $P/out/
```

Output:

```text
exit=0
corpus-manifest.json
generation-diagnostics.json
phrase-variants.json
trigger-index.json
```

The generator's own manifest lists what it walked: `includedPaths` held `.skilled/skills/control/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md` and `specs/probe/spec.md`, and `skippedPaths` held only two roots that do not exist in the probe (`.skilled/changelog/skilled` and `.skilled/hooks`). The ignored `local-probe` skill is in neither list.

Expected: exit 0 and four files under /tmp/psurf-corpus-probe/out/

Result: held, with the four files under `$P/out/` as stated in the path note.

## C - Assertion

```bash
P=$S/psurf-corpus-probe
grep -ric -e 'psurf-control-marker-7f3c1a' -e 'psurf control marker 7f3c1a' "$P/out" | sort
grep -ric -e 'psurf-corpus-probe-marker-7f3c1a' -e 'psurf corpus probe marker 7f3c1a' "$P/out" | sort
grep -c 'skills/local-probe' "$P/out/trigger-index.json" || echo 0
```

Output (lines 1 to 4 are the control per artifact, lines 5 to 8 are the marker per artifact, and the last two lines are one live probe-path count of `0` printed twice, once by `grep -c` and once by the `|| echo 0` fallback):

```text
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/corpus-manifest.json:0
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/generation-diagnostics.json:0
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/phrase-variants.json:2
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/trigger-index.json:1
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/corpus-manifest.json:0
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/generation-diagnostics.json:0
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/phrase-variants.json:0
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe/out/trigger-index.json:0
0
0
```

Positive control: the control marker reads 2 in `phrase-variants.json` and 1 in `trigger-index.json`, so the walker indexed the tracked control skill and the zero for the private marker is meaningful.

Expected: the control at least 1 in phrase-variants.json and trigger-index.json, the marker 0 in all four, the probe path 0

Result: held. The control is 2 and 1 in those two artifacts, the marker is 0 in all four and the probe path count is 0.

## D - Negative control and artifact coverage

Recorded after the first review round, which raised two limits of section C.

First limit: the control marker is non-zero in only two of the four artifacts (`phrase-variants.json` and `trigger-index.json`). `corpus-manifest.json` and `generation-diagnostics.json` hold paths and diagnostics, not trigger phrases, so a zero marker count there says nothing in either direction. For those two artifacts the boundary evidence is the path list in section B, where `local-probe` appears in neither `includedPaths` nor `skippedPaths`.

Second limit: nothing above showed that the ignore rule is what keeps the private skill out. The check below changes one thing only. It copies the probe repository from section A with its history, deletes the `.gitignore` file, and runs the generator again. The tracked files do not change: `git ls-files` lists the same three paths before and after (`.gitignore`, `.skilled/skills/control/SKILL.md` and `.skilled/skills/system-spec-kit/SKILL.md`).

```bash
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/95ada57e-a713-4e75-bbf5-1d7db3703a57/scratchpad
P=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad/psurf-corpus-probe
rm -rf $S/probe3 && cp -R $P $S/probe3 && rm -rf $S/probe3/out
git -C $S/probe3 ls-files
git -C $S/probe3 status --porcelain --ignored .skilled/skills/local-probe
rm $S/probe3/.gitignore
git -C $S/probe3 status --porcelain
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root $S/probe3 --out $S/probe3/out/trigger-index.json --quiet; echo "exit=$?"
grep -ric -e 'psurf-corpus-probe-marker-7f3c1a' -e 'psurf corpus probe marker 7f3c1a' $S/probe3/out | sort
grep -c 'skills/local-probe' $S/probe3/out/trigger-index.json
python3 -c "import json;print(json.load(open('$S/probe3/out/corpus-manifest.json'))['includedPaths'])"
```

Output:

```text
.gitignore
.skilled/skills/control/SKILL.md
.skilled/skills/system-spec-kit/SKILL.md
!! .skilled/skills/local-probe/
 D .gitignore
?? .skilled/skills/local-probe/
exit=0
probe3/out/corpus-manifest.json:0
probe3/out/generation-diagnostics.json:0
probe3/out/phrase-variants.json:2
probe3/out/trigger-index.json:1
1
['.skilled/skills/control/SKILL.md', '.skilled/skills/local-probe/SKILL.md', '.skilled/skills/system-spec-kit/SKILL.md', 'specs/probe/spec.md']
```

(The four count lines are the private marker per artifact, in the order `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, `trigger-index.json`. The `1` after them is the `skills/local-probe` path count.)

Expected: with only the ignore rule removed, the private marker appears in `phrase-variants.json` and `trigger-index.json` and the private path is in the manifest.

Result: held, and it makes section C a real test. Section C printed `0` for the marker with the rule present, and this run prints `2` and `1` with the rule alone removed, so the zero in section C comes from the ignore rule and not from the generator never seeing the folder.

An earlier run of the same idea used a copy with no `.gitignore` and no tracked files at all, scratch folder `probe2`, and printed the same counts (marker `2` and `1`, `local-probe` in `includedPaths`). It changed two things at once, so this section's run is the one that isolates the rule.

One side observation: `specs/probe/spec.md` is in `includedPaths` in every run although the global gitignore on this machine (`/specs`, line 11 of the operator's `~/.gitignore_global`) matches it and `git ls-files` does not list it. The generator therefore honours the repository's own `.gitignore` and not the machine-wide one. That does not weaken the result, because the private skills are ignored by the repository's own rule.

<!-- evidence:end -->
