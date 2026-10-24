---
title: "Implementation Plan: Phase 5: leak-and-routing-verification"
description: "Read-only verification plan: one evidence file per check, ordered so the phase commit, the CI trigger-index rebuild, the local routing probes and the final tip are observed in the only order that makes their output trustworthy."
trigger_phrases:
  - "leak and routing verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: leak-and-routing-verification

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash commands only - `git`, `node` (the existing skill-advisor CLI and the retrieval generator), `sqlite3`, `jq`, `gh` |
| **Framework** | None. The phase writes no application code and imports nothing |
| **Storage** | Read-only reads of the tracked tree, a throwaway advisor SQLite database under `/tmp`, a fresh clone and a final-tip clone under `/tmp`, and a temporary probe repository under `/tmp` |
| **Testing** | Fifteen evidence documents under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, each one command transcript with its expected output |

### Overview
Fifteen ordered steps. Each step runs one read-only check, quotes its output into its own evidence file, and states the expected output next to it. Three ordering constraints decide whether the output means anything: the fresh clone must come from `origin/main` after the planning commit is pushed, the four retrieval-artifact counts must come after CI rebuilds them on `main`, and the final-tip step must come after the evidence commit and its own rebuild. The phase never edits a tracked file outside this folder, never touches `.skilled/skills/local-*`, and never repairs a D6 kept record or a drift failure.

The phase publishes three commits. **C1** carries the step 1 head sweep and exists only so the clone has a tip to verify. **C2** carries the remaining fourteen evidence files and the closed packet. **C3** carries `11-final-tip.md`, the re-verification of the tip that C2 and its bot rebuild produced. Each commit's own push is reported in the handoff, because no commit can contain the CI result of the push that creates it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-004 are on `main` (`git log --oneline -8` shows the hub removal, the vocabulary cleanup and the private-skill commit)
- [ ] The operator checkout holds `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` as symlinks to the two external `local-skills/` folders, and both roots are listed in `SPECKIT_PRIVATE_SKILL_ROOTS`
- [ ] `gh auth status` reports a logged-in account
- [ ] `sqlite3 --version`, `jq --version` and `node --version` all print a version
- [ ] The Obsidian Plugin checkout is present at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met` with a quoted output
- [ ] The fifteen evidence files named in `spec.md` Deliverables exist, and both the evidence commit C2 and the final-tip commit C3 have been pushed together with the closed packet documents
- [ ] The reviewer round is recorded in `10-review.md`, with at most 2 rounds
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-only phase. Read the artifacts four producers leave behind - the tracked tree, the four committed retrieval artifacts, the local advisor graph and the two consumer checkouts - and compare each against a fixed expected value. Every zero check carries a positive control, so a pattern that stopped matching cannot read as a pass.

### Key Components
- **Tracked tree**: `git ls-files` for paths and `git grep` for content, in a fresh clone of `origin/main`. The clone is the authority because the pre-commit guard is bypassable with `--no-verify` (D3 recorded limit) and because gitignored symlinks on the operator disk are invisible to both.
- **Blob identity**: `git hash-object --no-filters` over every complete file under both private skill trees (read through their symlinks), classified against `git ls-tree -r 42b41dd286` and then compared with `git cat-file --batch-all-objects --batch-check` over the clone. A shared blob id proves an identical byte sequence, which a marker search cannot. The ids the removal commit already carries are already public by definition, so they are recorded as the history exposure and only new or changed content is asserted absent.
- **Committed retrieval artifacts**: `trigger-index.json` under `runtime/data/` and its three sidecars `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` under `runtime/cli/retrieval/fixtures/`, all four staged together by `.github/workflows/trigger-index-rebuild.yml` lines 80-83. The producer honours only committed `.gitignore` files (`corpus.mjs` `gitIgnoredPaths`, lines 200-210), so the D2 rules are what keep private skills out and no code change is needed.
- **Advisor graph**: a SQLite file under `.skilled/skills/system-skill-advisor/runtime/database/` (gitignored by `runtime/database/.gitignore` `*.sqlite`), built by the metadata scan. `SYSTEM_SKILL_ADVISOR_DB_DIR` (`skill-graph-db.ts:271`) redirects it, which is how this phase builds one from the clone without touching the operator's graph.
- **Routing probes**: `advisor_recommend` through `.skilled/bin/skill-advisor.cjs`, which returns `data.recommendations[0].skillId`. Two checkouts run them: the operator checkout and the Obsidian Plugin checkout, whose eight runtime symlinks resolve into the same hub. Both advisor processes export `SPECKIT_PRIVATE_SKILL_ROOTS` with the two external `local-skills/` roots, joined with `:`.
- **Corpus boundary probe**: a four-document temporary repository whose ignored `local-probe` skill carries a unique marker and whose tracked control skill carries a second marker, indexed by `generate-trigger-index.mjs --repo-root` into a scratch output directory.

### Data Flow
`origin/main` -> fresh clone at `/tmp/psurf-clone-main` -> `git ls-files` / `git grep` / blob comparison / advisor metadata scan / artifact counts -> evidence file. The operator checkout feeds the routing probes, the drift scripts and the invisibility check, because those need the symlinks and both external roots on disk. The final tip repeats the clone checks after C2, into `/tmp/psurf-final-tip`.

### Anchors this plan reads (all verified on disk at `583316d083`; every file below is unchanged since `42b41dd286`)

| File | Anchor | What it decides |
|------|--------|-----------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | `CORPUS_ROOTS` at line 31; `gitIgnoredPaths` at line 200, body 200-210 | Why the index needs no code change (it shells out to `git ls-files --others --ignored --exclude-per-directory=.gitignore`) and why `specs` is a corpus root, which is what retains the 69 audit paths |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | `resolveSkillGraphDbDir` at line 270, `SYSTEM_SKILL_ADVISOR_DB_DIR` at 271; the discovery walk's `readdirSync` at 733 | The throwaway database override, and the walk that follows a `local-*` symlink |
| `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` | `*.sqlite` | The graph database is local only, so a leak there is invisible to the tracked sweep and needs its own check |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | whole file - 200 matching lines at `42b41dd286`, of which 131 are `.skilled/` paths and 69 are `specs/sk-code/007-sk-code-obsidian-surface/` paths | The numbers the CI rebuild must drive to zero for the live population and to 69 for the allowlist |
| `.github/workflows/trigger-index-rebuild.yml` | `FILES` array at lines 80-83 | The four artifacts that are regenerated together; counting one leaves three unproven |
| `.github/workflows/routing-registry-drift.yml` | the three commands at lines 198-200 | The drift scripts that scan every direct child of `.skilled/skills`, `local-*` included |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | `listSkillFiles` at line 51, walk at 54-66 | D5 producer: if it ever mirrors a private skill, `.hermes/skills/local-*` becomes a tracked path and step 3 catches it |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | `DEFAULT_OUTPUT` at line 33, `os.listdir` loop at line 200 | D5 producer: writes the tracked fallback `runtime/scripts/skill-graph.json`; the drift task redirects its output to `/tmp` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | `findSkillRoots` filter at line 143 | D5 producer: a private skill must not enter a tracked metadata file; read-only without `--fix` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | the root filter at line 52 | The drift scanner that takes every direct child with a `graph-metadata.json`, `local-*` included |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | lines 146-148 | D5 producer: a private skill must not make the tracked fallback report stale |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | line 39, the `'sk-code'` token array ending in `'obsidian plugin'`, with the rationale comment at 37-38 | Phase 003 removes that token; step 7's Obsidian probe is the behavioural proof |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | line 602, the `webflow cms` alternation, with the comment at 599-601 | D6 kept record: mcp-code-mode's Webflow CMS vocabulary stays |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | line 131, `'webflow cms'` | D6 kept record: stays |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | line 2181, `"webflow cms"` | D6 kept record: stays |
| `.skilled/skills/sk-code/sk-code-obsidian/README.md` | line 75, the symlink paragraph | The documented reason the plugin checkout resolves runtime directories into this hub |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | line 67, the symlink guard | The hub's own statement that the plugin repository symlinks `.opencode`, `.claude`, `.codex`, `.cursor` and `.devin` at its root |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is verification-only, so the table records what each surface's *producer* is and which step observes it. No surface is updated here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `corpus.mjs` `gitIgnoredPaths` (200-210) | producer of the trigger-index ignore set | unchanged | step 6: `.skilled/` path count is 0 in all four artifacts |
| `corpus.mjs` `CORPUS_ROOTS` (31) | decides which trees are indexed | unchanged | step 6: the 69 `specs/sk-code/007-sk-code-obsidian-surface/` paths are counted against the allowlist |
| `trigger-index.json` plus its three sidecars | tracked retrieval data, CI-rebuilt | unchanged | step 6: eight counts across four artifacts |
| `skill_graph_compiler.py:200` | producer of the tracked fallback graph | unchanged (phase 003 added the `local-` skip) | step 4: clone `git grep` finds no private name in `runtime/scripts/skill-graph.json`; step 11: the export to `/tmp` is checked for `local-` ids |
| `sync-skills-hermes.cjs` `listSkillFiles` (51-66) | producer of `.hermes/skills/` | unchanged (phase 003) | steps 3 and 4: `git ls-files` finds no `.hermes/skills/local-*` |
| `ci-skill-root-metadata.cjs:143` | producer of skill-root metadata | unchanged (phase 003) | step 11: exit code recorded with both symlinked private skills present |
| `skill-graph-freshness.cjs:146-148` | consumer of the on-disk skill list | unchanged (phase 003) | step 6: the tracked fallback is not reported stale after the rebuild |
| advisor graph database | local, gitignored | not a tracked consumer | step 5: zero-row query, non-vacuous build |
| `advisor_recommend` | consumer of the graph | unchanged | step 7: six probes across two checkouts |
| Obsidian Plugin checkout | external consumer of this hub through eight symlinks | unchanged | step 7: symlink targets plus three probes |

Required inventories:
- Same-class producers: `git grep -n "isDirectory()" .skilled/skills/system-skill-advisor/runtime/lib .skilled/commands/doctor/scripts` - the D4 scans are phase 003's, and this phase only reads their output through the routing probes.
- Consumers of the changed symbols: `git grep -n -E "sk-code-(webflow|obsidian)" -- ':!specs'` - every remaining hit is classified in step 3 as a retained D6 hit or an active leak.
- Matrix axes: two consumer checkouts (operator and plugin), one fixed symlink layout. The layout is no longer an axis: both `.skilled/skills/local-*` entries link to external `local-skills/` folders, so steps 3, 4 and 6 pass regardless and step 7 passes only after phase 003 makes the scan follow a `local-*` symlink into either external root. The plan records both targets in `07-routing-probes.md`.
- Algorithm invariant: none. This phase contains no path, parser or redaction logic.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step order, with the proof command for each step

Run these from the writer worktree root unless the step says otherwise. Quote the command and its output into the named evidence file. Where a step says "expect", that string is the pass value.

Every evidence path in this plan and in `tasks.md` is packet-relative and written out in full, for example `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`. Create that directory from the worktree root before step 0, and never write to the worktree root's own `scratch/evidence/`, which is a different path that no criterion reads. Every evidence file ends with the literal line `<!-- evidence:end -->`; a task that appends a section anchors on that line and ends its block with the same line.

**Step 0 - Preflight** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md`)

```bash
git log --oneline -8
gh auth status
sqlite3 --version
jq --version
node --version
```

Record the baselines measured on disk at `583316d083`, which prove the later checks can fail:

| Check | Baseline at `42b41dd286` | Baseline at `583316d083` |
|-------|--------------------------|--------------------------|
| Tracked paths naming a private skill or a removed surface | 336 | 336 |
| Tracked content lines naming either, outside the excluded paths | 1528 | 1529 |
| Trigger-index lines naming either | 200 | 200 |
| of which `.skilled/` paths | 131 | 131 |
| of which `specs/sk-code/007-sk-code-obsidian-surface/` paths | 69 | 69 |
| Trigger-index phrase keys naming either, in space-normalized form | 59 | 59 |
| `corpus-manifest.json` matching lines (254 included, 6 skipped) | not measured | 260 |
| `generation-diagnostics.json` matching lines | not measured | 60 |
| `phrase-variants.json` matching lines | 58 | 59 |
| Bare `WEBFLOW` / `OBSIDIAN` token lines in both sk-code trees, before and after the `WEBFLOW:` filter | not measured | 566 / 548 |
| Retained content-sweep paths under the two D6 prefixes | not measured | 8 |
| Advisor `skill_nodes` rows returned by the step 5 query | 1 | 1 |
| Advisor `skillCount` | not measured | 14 |

The one-line difference between `42b41dd286` and the planning tip is `phrase-variants.json`, which the two intervening index rebuilds extended from 58 to 59 matching lines.

**Step 1 - Sweep the planning tip before pushing C1** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md`)

```bash
git ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"   # expect 336 control
git ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0   # expect 0 live
git ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0   # expect 108 retained
git grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 \
  -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'   # expect 1528 control
git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" \
  -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l       # expect 0
git grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code \
  ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'   # expect 566 control
rg -c 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code \
  --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'   # expect 4 raw
rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code \
  --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l      # expect 0
```

The bare-token commands are the proof: the packet removes the surfaces, not only the packet names, so an uppercase `WEBFLOW` or `OBSIDIAN` left in either sk-code tree is a leak. `grep -v 'WEBFLOW:'` is the kept list - the comment-hygiene platform tag lines in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, the allowed-token list in `sk-code-quality/scripts/check-comment-hygiene.sh` and the tag row in `shared/references/universal/code-style-guide.md` - and the two globs keep the dated `changelog/` and `benchmark/reports/` records. `specs/` is out of the bare-token command's scope for the same reason it is excluded above: this packet's own documents name the surfaces. The filter is line-level, so a line carrying the tag form is excused whole; the evidence quotes every removed line and names any surface instruction among them as a leak the filter hides.

A non-empty result here is fixed before the push: name the owning phase (002 for hub files, 003 for advisor vocabulary) and stop. This phase never edits a file outside its own folder.

**Step 2 - Confirm the planning commit on `origin/main`, commit the head sweep as C1 and clone** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md`)

The six planning documents land on `main` in the packet's planning commit before any phase runs, so this step asserts them rather than committing them. Confirm each with `git cat-file`, commit the step 1 evidence file with a prose body, push `HEAD:main`, then clone:

```bash
CLONE=/tmp/psurf-clone-main
git fetch origin main
for f in spec.md plan.md tasks.md acceptance-criteria.md decision-record.md goal.md; do
  git cat-file -e "origin/main:specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/$f" && printf '%s present\n' "$f"
done
rm -rf "$CLONE"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"
git -C "$CLONE" rev-parse HEAD
git -C "$CLONE" status --porcelain                                                 # expect empty
```

The six `present` lines prove the planning commit landed. The clone HEAD must equal the C1 commit that was pushed. Record both shas. The remaining evidence files do not exist yet at this point, so C2 commits them and C3 re-verifies the tip C2 produces.

**Step 3 - Leak sweeps in the clone** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`)

Section A, tracked paths:

```bash
CLONE=/tmp/psurf-clone-main
git -C "$CLONE" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0   # expect 0 live
git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0   # expect 108 retained
```

The `specs/` exclusion is deliberate: 108 tracked paths under `specs/` carry one of the four names - 98 under `specs/sk-code/007-sk-code-obsidian-surface/`, 6 under `specs/sk-doc/z_archive/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow/` and 4 under `specs/system-speckit/033-system-speckit-v4/` - and D6 keeps those dated audit records. They are counted separately so they never stand in for a live leak.

Section B, tracked content:

```bash
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" \
  -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*'
```

Section C classifies every printed path. Two prefixes are the complete D6 allowlist for this grep:

- `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` - the playbooks that name units of the past v4.0.0.2 release
- `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/` - the anchor-repair test fixture

The retained population is 8 paths at the planning tip and must stay 8. Amended 2026-10-24 (operator ruling): the sweep prints 17 paths in all, the 8 retained plus 6 test files that use the skill names as fixture directory names (`pre-commit.test.sh`, `skill-root-metadata-contract.test.cjs`, `skill-graph-freshness-panel.vitest.ts`, `advisor-status.vitest.ts`, `private-skill-target.vitest.ts`, `sync-skills-hermes.test.mjs`) and 3 retrieval artifacts (`trigger-index.json`, `corpus-manifest.json`, `phrase-variants.json`) that carry allowlisted retained-record paths and phrase keys. A path in those two extra classes passes only when its hit lines are fixture directory names, `specs/sk-code/007-sk-code-obsidian-surface/` path strings or phrase keys. Any other path is an active leak: record it, leave REQ-002 `Unmet`, and name the owning phase. The evidence prints the two counts separately, so a retained hit never stands in for an active one.

Section D, the bare-token sweep inside the clone, with the same kept list and the same line-level caveat as step 1:

```bash
rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" \
  --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l   # expect 0
```

Section E, blob identity. The private trees are restored from `42b41dd286`, so their unmodified bytes are already in public history by definition and cannot be asserted absent. The check therefore classifies the private ids instead: the ones the base tree already carries are recorded as already public in history and their count is the input to the history-rewrite decision, the three hub references copied from `shared/references/` are recorded the same way, and only new or changed content is asserted absent from the clone:

```bash
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -print | wc -l                   # expect 228 (find -L follows the two symlinks)
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -size +0c -print0 \
  | xargs -0 git hash-object --no-filters | sort -u > /tmp/psurf-private-blob-ids.txt
git -C "$CLONE" ls-tree -r 42b41dd286 -- \
  .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian \
  | awk '{print $3}' | sort -u > /tmp/psurf-base-blob-ids.txt
wc -l < /tmp/psurf-base-blob-ids.txt                                                                                      # expect 223
comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt > /tmp/psurf-history-exposure-blob-ids.txt
wc -l < /tmp/psurf-history-exposure-blob-ids.txt                                                                          # expect 138: already public in history
git -C "$CLONE" ls-tree 42b41dd286 -- \
  .skilled/skills/sk-code/shared/references/workflow-implement.md \
  .skilled/skills/sk-code/shared/references/workflow-debug.md \
  .skilled/skills/sk-code/shared/references/workflow-verify.md \
  | awk '{print $3}' | sort -u > /tmp/psurf-copied-reference-blob-ids.txt
comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-copied-reference-blob-ids.txt | wc -l                                  # expect 1 (only workflow-debug.md is byte-identical)
comm -23 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt \
  | comm -23 - /tmp/psurf-copied-reference-blob-ids.txt > /tmp/psurf-new-blob-ids.txt
wc -l < /tmp/psurf-new-blob-ids.txt                                                                                       # expect 86: new or changed
git -C "$CLONE" cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' \
  | awk '$2=="blob"{print $1}' | sort -u > /tmp/psurf-public-blob-ids.txt
comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l                                          # expect 139: the control
comm -12 /tmp/psurf-new-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l                                              # expect 0
```

Section F states the partial-content policy in prose: the blob comparison covers complete files only, a zero-byte file is excluded because its blob is the reachable empty blob by definition, the bytes the two restored trees inherit from `42b41dd286` and the copies made from `shared/references/` are recorded as already public in history rather than reported as a leak, and a fragment of a private file is covered by the marker and token sweeps rather than by identity. Neither check claims the other's ground.

**Step 4 - D6 kept records** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md`)

```bash
CLONE=/tmp/psurf-clone-main
git -C "$CLONE" diff --stat 42b41dd286 HEAD -- \
  .skilled/skills/mcp-tooling \
  .skilled/skills/sk-design \
  .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py \
  .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl \
  .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl \
  .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts \
  .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts \
  .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands \
  .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample \
  .skilled/changelog | wc -l
```

Expect the one path `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` from commit `e00fef3e76` (`wc -l` prints 2, the path line plus the summary line). Amended 2026-10-24 (operator ruling): that bounded-scan change landed in the third phase of this same program and is the single accepted exception. Any other path is a D6 violation by an earlier phase, not a repair task here.

This step audits ten prefixes, not every record D6 keeps. The surface `changelog/` and `benchmark/reports/` folders are deleted by phase 002 and the `specs/**/z_archive/**` twins are overwritten by phase 002's fixture copies, so those dated records are kept by D6 but sit outside this byte-identity audit. Step 3's four exclusions already keep them out of the leak classification, so nothing claims they are unchanged.

**Step 5 - Throwaway advisor database** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md`)

Run from the writer worktree, because the installed `node_modules` and compiled runtime live there; the scan itself reads the clone.

```bash
DBDIR=/tmp/psurf-db
rm -rf "$DBDIR" && mkdir -p "$DBDIR"
SYSTEM_SKILL_ADVISOR_DB_DIR="$DBDIR" node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted \
  --json '{"force":true,"workspaceRoot":"/tmp/psurf-clone-main"}' --format json \
  | jq -r '.data.skillCount, (.data.summary.warnings // [] | .[])'
```

Expect `skillCount` of 14 or greater (14 measured at `583316d083`) and no `EMPTY-SKILL-SCAN` warning. A zero-skill rebuild preserves the previous graph and proves nothing, so it fails the step.

```bash
sqlite3 -readonly "$DBDIR/skill-graph.sqlite" "SELECT count(*) FROM skill_nodes WHERE (id LIKE 'sk-code%' OR family = 'sk-code') AND (lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%webflow%' OR lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%obsidian%')"
```

Expect `0`. The same query prints `1` at `583316d083` because the `sk-code` node's derived block still lists `webflow frontend workflow` and `obsidian plugin`; that is the positive control recorded in the evidence.

**Step 6 - The four retrieval artifacts after the CI rebuild** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md`)

Push C1 first, then wait for the rebuild commit:

```bash
gh run list --branch main --limit 5 --json status,conclusion,headSha,displayTitle
git -C "$CLONE" pull --ff-only
git -C "$CLONE" log --oneline -3          # expect a "chore(system-spec-kit): rebuild the trigger index" commit above C1
```

Poll for at most 30 minutes. Past that, record the last `gh run list` output and leave REQ-003 `Unmet`.

Then count, with the index scoped to live routing sources:

```bash
IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
FIX="$CLONE/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures"
grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0   # expect 0
grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l                                       # expect 69
grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' \
  | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l                        # expect 0
grep -c -E '^ *"(local webflow|local obsidian|sk code webflow|sk code obsidian)": \[' "$IDX" || echo 0          # expect 0
grep -c -E '"(sk code obsidian|local webflow)[ "]' "$IDX" || echo 0                                            # expect 38
```

The allowlist is written out rather than implied: the 69 paths are `specs/sk-code/007-sk-code-obsidian-surface/` documents, retained by D6, indexed because `specs` is a corpus root (`corpus.mjs:31`) and named by the folder, not by a live routing source. The 38 retained phrase keys come from the same 007 packet plus `specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md`; the 11 keys that came from the deleted surface folders disappear with them (21 under the broad pattern that also counts `sk code webflow`).

The three sidecars, counted in the same step because the workflow stages all four together:

```bash
node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' "$FIX/corpus-manifest.json"   # expect 69 0
grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0        # expect 0
grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0                  # expect 38
```

**Step 7 - Routing probes in both checkouts** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md`)

Run in the operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, which holds the two symlinks. Their targets are `local-skills/` folders in two external repositories: `local-obsidian` in a public repository by operator choice and `local-webflow` in a private one. Phase 004's content and link steps run there; its packet-document edits run in the `WORKTREE` checkout defined in `004-private-local-skills/tasks.md`'s Checkout rule (by default this same checkout), because `.skilled/skills/local-*` is gitignored and never travels between checkouts. Do not run these probes in the writer worktree: it has no symlink on disk, so every probe would return a hub skill and prove nothing.

```bash
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json | jq -r '.data.skillCount'
sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite \
  "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"    # expect local-obsidian and local-webflow

node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-webflow
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-obsidian
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect sk-code
```

Record the two symlink targets with `readlink` and `ls -ld` output for both paths, and state that both targets sit in the two external `local-skills/` folders. A wrong top result is phase 004's to fix; record it and leave REQ-005 `Unmet`.

Then the second consumer. Locate it first and stop if the path is absent:

```bash
find /Users/michelkerkmeester/MEGA/Development -maxdepth 2 -type d -iname '*obsidian*' -not -path '*/.git/*' 2>/dev/null
```

The measured answer is `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`. If the search prints no directory holding a `manifest.json`, record the output and stop before the next three probes, leaving AC-005 partly `Unmet`.

```bash
PLUGIN="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
cd "$PLUGIN"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
for l in .claude .codex .cursor .devin .hermes .opencode .pi .skilled; do printf '%s -> %s\n' "$l" "$(readlink "$l")"; done
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-webflow
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-obsidian
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect sk-code
```

Each `readlink` must resolve under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`; a target outside it means the checkout no longer consumes this hub and the three probes below it prove nothing about this packet.

**Step 8 - D5 invisibility** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md`)

Run in the same operator checkout as step 7, because that is the checkout that holds both symlinks and can see their two external roots.

```bash
git status --porcelain | grep -c -E "local-(webflow|obsidian)" || echo 0          # expect 0
git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian | wc -l   # expect 2
```

Expect the first command to print `0`, and the second to name `/.skilled/skills/local-*` and `/.hermes/skills/local-*` from the root `.gitignore`. `git check-ignore` evaluates patterns whether or not a target exists, so this step does not depend on the symlink targets being present.

**Step 9 - CI on main** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md`)

```bash
gh run list --branch main --limit 10 --json status,conclusion,headSha \
  | jq -r '.[] | "\(.status)/\(.conclusion)"' | sort | uniq -c
```

Expect only `completed/success` and `completed/skipped` lines. Any `failure`, `cancelled` or `timed_out` leaves REQ-007 `Unmet`.

The grouping recorded here covers every run on `main` up to the push that carries C2. The runs of that push cannot appear in the file that push carries, so they are reported in the phase handoff message with their run ids and head sha, and `09-ci.md` states that limit. Nothing is appended to `09-ci.md` after the push: an appended block would leave the working tree dirty and the evidence uncommitted.

**Step 10 - Read-only history inventory** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md`)

```bash
git -C "$CLONE" rev-list --objects --all | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'   # expect 1681 at the measured tip
git -C "$CLONE" tag --list | wc -l                                                                           # expect 157 (the operator checkout's 164 local tags include 7 local-only tags)
for t in $(git -C "$CLONE" tag --list); do printf '%s %s\n' "$t" "$(git -C "$CLONE" ls-tree -r --name-only "$t" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)')"; done > /tmp/psurf-tag-old-paths.txt
awk '$2>0' /tmp/psurf-tag-old-paths.txt | wc -l                                                              # expect at least 1
gh release list --limit 30
for t in $(gh release list --limit 30 --json tagName --jq '.[].tagName'); do gh release view "$t" --json tagName,assets; done
```

Every tag is mapped to the number of old paths it retains, and every hosted release is listed with its assets. The inventory changes nothing: a rewrite is an operator decision recorded in `12-history-inventory.md` and `decision-record.md` ADR-005, never executed here.

**Step 11 - Drift scripts in the operator checkout** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md`)

Run in the operator checkout with both private skills present, which is the condition CI never exercises:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills; echo "exit=$?"
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json --output /tmp/psurf-skill-graph.json; echo "exit=$?"
grep -c '"local-' /tmp/psurf-skill-graph.json || echo 0
```

Record each exit code as it is. A non-zero exit is a finding routed to phase 003 or 004, never repaired here. The compiler writes to `/tmp` on purpose: its default output is the tracked `runtime/scripts/skill-graph.json`, and a drift probe must not modify a tracked file.

**Step 12 - Corpus boundary probe** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md`)

Build a four-document temporary repository whose ignored `local-probe` skill carries a unique marker and whose tracked control skill carries a second marker:

```bash
P=/tmp/psurf-corpus-probe
rm -rf "$P" && mkdir -p "$P/.skilled/skills/system-spec-kit" "$P/.skilled/skills/local-probe" "$P/.skilled/skills/control" "$P/specs/probe"
cd "$P" && git init -q
printf '/.skilled/skills/local-*\n' > .gitignore
printf -- '---\ntitle: "system-spec-kit sentinel"\ndescription: "probe sentinel"\ntrigger_phrases:\n  - "probe sentinel"\n---\n# sentinel\n' > .skilled/skills/system-spec-kit/SKILL.md
printf -- '---\ntitle: "local probe"\ndescription: "ignored private probe"\ntrigger_phrases:\n  - "psurf-corpus-probe-marker-7f3c1a"\n---\n# local probe\npsurf-corpus-probe-marker-7f3c1a\n' > .skilled/skills/local-probe/SKILL.md
printf -- '---\ntitle: "control skill"\ndescription: "tracked control"\ntrigger_phrases:\n  - "psurf-control-marker-7f3c1a"\n---\n# control\npsurf-control-marker-7f3c1a\n' > .skilled/skills/control/SKILL.md
printf -- '---\ntitle: "probe spec"\ndescription: "tracked spec"\ntrigger_phrases:\n  - "probe spec"\n---\n# probe spec\n' > specs/probe/spec.md
git add -A && git -c user.email=probe@local -c user.name=probe commit -qm probe
git status --porcelain --ignored .skilled/skills/local-probe      # expect !! .skilled/skills/local-probe/
```

Then generate and assert:

```bash
cd "$(git rev-parse --show-toplevel)"
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root "$P" --out "$P/out/trigger-index.json" --quiet
grep -ric -e 'psurf-control-marker-7f3c1a' -e 'psurf control marker 7f3c1a' "$P/out" | sort
grep -ric -e 'psurf-corpus-probe-marker-7f3c1a' -e 'psurf corpus probe marker 7f3c1a' "$P/out" | sort
grep -c 'skills/local-probe' "$P/out/trigger-index.json" || echo 0
```

Expect the control to appear in `phrase-variants.json` and `trigger-index.json`, and the marker to print `0` in all four artifacts. The control is what makes the zero meaningful: it proves the walker indexed the tracked document that carries it.

**Step 13 - Review, close and publish C2** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md`)

1. Run the review through the `subagent` tool with agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction: the prompt says it edits no file. Capture `git status --porcelain` before and after and require the two to be identical. The reviewer takes the packet path and returns findings in chat, at most 2 rounds.
2. Record each finding and its resolution in `10-review.md`. A finding that contradicts a criterion's evidence reopens that criterion.
3. Transcribe the fifteen evidence files into `implementation-summary.md`: one row per check under Verification, plus the four limits under Known Limitations.
4. Mark the `acceptance-criteria.md` rows `Met` with the observed value, and fill the closure statement.
5. Only when every row is `Met`, set `spec.md` `Status` to `Complete`, `acceptance-criteria.md` `Status` to `Complete` and `Closeable` to `Yes`, and add a `Status: Complete` row to the `implementation-summary.md` metadata table so all three documents agree. If any row is `Unmet`, leave all three as they are and report blocked.
6. Run the validator:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict
```

Expect `RESULT: PASSED`.
7. Commit and push C2 with the evidence it cites: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/*`, `implementation-summary.md`, `acceptance-criteria.md` and `spec.md`. C1 carries only the step 1 sweep, so without C2 the remaining evidence stays untracked and the next reader cannot re-run a single check. Report the CI runs of C2's push in the phase handoff message with their run ids and head sha; do not append them to `09-ci.md`, because the append would land after the commit and leave the evidence uncommitted.

**Step 14 - Final tip, C3 and handoff** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md`)

C2's push triggers a rebuild of the four artifacts, so the tip that carries the evidence is not the tip the earlier sweeps read. Refresh a second clone and rerun every check against it:

```bash
FINAL=/tmp/psurf-final-tip
rm -rf "$FINAL"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$FINAL"
git -C "$FINAL" log --oneline -3       # expect the rebuild commit above C2
git -C "$FINAL" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0      # expect 0 live
git -C "$FINAL" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0      # expect 108 retained
git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E '^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/' | wc -l   # expect 0
rg -n 'WEBFLOW|OBSIDIAN' "$FINAL/.skilled/skills/sk-code" "$FINAL/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l   # expect 0
grep -E '^ *"\.skilled/' "$FINAL/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0   # expect 0
```

Write the results into `11-final-tip.md`, tick the phase 3 checklist in `tasks.md`, bring the branch level with `origin/main` (`git fetch origin main`, `git merge --ff-only origin/main`) because C2's push created the rebuild commit this tip carries, then commit and push C3, which stages both files. Then confirm the tree is clean and HEAD equals `origin/main`. C3's own push starts another rebuild; its runs and the resulting artifact counts are reported in the handoff message, because a commit cannot carry the result of the push that creates it.

### Commit and push

- Executor: the OpenCode 2 orchestrator in one session (docs only). Stage files by name; never `git add -A`.
- Push `HEAD:main` only, never a branch.
- Every commit message needs a prose body explaining that this phase adds verification evidence and changes no code.
- Three commits: **C1** the step 1 head sweep, after step 2 confirms the planning documents on `main` and before the clone; **C2** the remaining evidence and the closed packet, after step 13's validator run; **C3** `11-final-tip.md` and the closed checklist, after step 14's re-verification. C2 is the commit a reader can re-run. C3 is the one that proves the tip C2 produced is clean.
- **Integrate the rebuild before each commit.** C1's push starts the trigger-index rebuild workflow, which commits to `main`, so C2 and C3 each begin with `git fetch origin main` and `git merge --ff-only origin/main` in the worktree. A branch that never integrated that commit has `origin/main` ahead of it and its push is rejected.
- **Commit and push last**: commit and push `HEAD:main` only after the tests, the reviewer round and `validate.sh --strict` have passed. Then confirm `git status --porcelain` is empty and `git rev-parse HEAD` equals `git rev-parse origin/main` after `git fetch origin main`. Report each push's CI runs, with run ids and head sha, in the phase handoff message.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static sweep | Tracked paths and tracked content in a fresh clone and again at the final tip | `git ls-files`, `git grep` |
| Identity | Blob ids of the private trees classified against the removal commit and against every blob reachable from the clone | `git hash-object`, `git ls-tree`, `git cat-file` |
| Data artifact | Four regenerated retrieval artifacts, throwaway advisor SQLite graph | `grep -c`, `node -e`, `sqlite3 -readonly` |
| Behavioural | Six routing probes across two checkouts | `skill-advisor.cjs advisor_recommend` |
| Boundary | The ten audited D6 kept-record prefixes unchanged since `42b41dd286` | `git diff --stat` |
| Corpus boundary | A temporary repository with an ignored marker and a tracked control | `generate-trigger-index.mjs --repo-root` |
| Local drift | The three routing-registry drift scripts with both symlinked private skills present | `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `skill_graph_compiler.py` |
| Regression | CI on `main` after each push and after each index rebuild | `gh run list` |
| Documentation | Evidence completeness and template conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-004 on `main` | Internal | Green | No verification target; the phase cannot start |
| Both private skills as gitignored symlinks in the operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` (phase 004 runs there, because the entries are ignored), with both external `local-skills/` roots in `SPECKIT_PRIVATE_SKILL_ROOTS` | Internal | Green after phase 004 | Steps 3, 7, 8 and 11 cannot run; REQ-002, REQ-005, REQ-009 and REQ-014 stay `Unmet` |
| Obsidian Plugin checkout at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin` | External | Green | Step 7's last three probes cannot run; REQ-005 stays partly `Unmet` |
| CI trigger-index rebuild | Internal | Green | Step 6 reads a stale index (200 matching lines) and cannot pass |
| `gh` authenticated | External | Green | Steps 6, 9 and 10 cannot observe CI or releases; REQ-007 and REQ-013 stay `Unmet` |
| Installed `.skilled/node_modules` and compiled advisor runtime in the writer worktree | Internal | Green | Steps 5 and 12 cannot build the database or the probe artifacts |
| `sqlite3`, `jq`, `node` | External | Green | The step that needs the missing tool fails and its criterion stays `Unmet` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the evidence contradicts a criterion and the cause is in this phase's own documents, or the reviewer finds a claim the evidence does not support.
- **Procedure**: revert the phase commits, which are docs-only, so a revert restores the packet and changes nothing else.

```bash
git revert --no-edit $(git log --format=%H --grep='Surface-Verification-Phase: 005' origin/main)
rm -rf /tmp/psurf-clone-main /tmp/psurf-final-tip /tmp/psurf-db /tmp/psurf-corpus-probe
rm -f /tmp/psurf-private-blob-ids.txt /tmp/psurf-public-blob-ids.txt /tmp/psurf-tag-old-paths.txt /tmp/psurf-skill-graph.json
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json
```

The last command rebuilds the operator's gitignored advisor database, which step 7 forces. No tracked file outside this folder is touched by the phase, so nothing else needs restoring. No deployment, no migration, no data change.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Steps 0-1 (preflight, HEAD sweep) ──► C1 commit ──► C1 push ──► Steps 2-5 (clone, sweeps, D6, DB)
                                                                      │
                                                                      ├──► Step 6 (four artifacts, after CI rebuild)
                                                                      ├──► Steps 7-8 (operator checkout probes)
                                                                      ├──► Steps 9-11 (CI, history, drift)
                                                                      └──► Step 12 (corpus probe)
                                                                                   │
                                                                                   └──► Step 13 (review, close, C2)
                                                                                              │
                                                                                              └──► Step 14 (final tip, C3, handoff)
```

| Step | Depends On | Blocks |
|------|------------|--------|
| 0 Preflight | Phases 001-004 on `main` | 1 |
| 1 HEAD sweep | 0 | C1, and therefore 2 |
| 2 Fresh clone | C1 pushed | 3, 4, 5, 6, 9, 10 |
| 3 Leak sweeps | 2 | 13 |
| 4 D6 kept records | 2 | 13 |
| 5 Advisor database | 2 | 13 |
| 6 Four artifacts | 2 and the CI rebuild | 13, 14 |
| 7 Routing probes | Phase 004 in the operator checkout and the plugin checkout | 13 |
| 8 Invisibility | Phase 004 in the operator checkout | 13 |
| 9 CI | the C1 push | 13 |
| 10 History inventory | 2 | 13 |
| 11 Drift | Phase 004 in the operator checkout | 13 |
| 12 Corpus probe | none beyond the writer worktree | 13 |
| 13 Review and C2 | 3-12 | 14 |
| 14 Final tip and C3 | C2 pushed and its rebuild landed | none |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (steps 0-2) | Low | 15 minutes, plus one clone |
| Implementation (steps 3-12) | Low | 60 minutes, dominated by two CI waits |
| Verification (steps 13-14) | Low | 45 minutes including the reviewer round and the second clone |
| **Total** | | **About 2 hours of operator time, one working day end to end because of the two CI rebuilds** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment: this phase ships documents only
- [ ] `/tmp/psurf-clone-main`, `/tmp/psurf-final-tip`, `/tmp/psurf-db` and `/tmp/psurf-corpus-probe` are outside the repository and disposable
- [ ] The operator's advisor database is gitignored and rebuildable from tracked metadata
- [ ] The compiler export writes to `/tmp/psurf-skill-graph.json`, never to the tracked `runtime/scripts/skill-graph.json`

### Rollback Procedure
1. `git revert --no-edit $(git log --format=%H --grep='Surface-Verification-Phase: 005' origin/main)` - restores the packet to its committed state. Every phase commit body ends with the trailer `Surface-Verification-Phase: 005`, which is what the revert selects.
2. `rm -rf /tmp/psurf-clone-main /tmp/psurf-final-tip /tmp/psurf-db /tmp/psurf-corpus-probe` - removes both clones, the database and the probe repository.
3. `export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"` then `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json` - rebuilds the local graph the probes forced, with both external roots visible.
4. Re-run `validate.sh --strict` and confirm `RESULT: PASSED` on the reverted packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the only mutable artifact is a gitignored SQLite file that the rebuild command regenerates from tracked metadata, and the probe repository is a throwaway under `/tmp`.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  A. Preflight    │────►│  B. C1 publish   │────►│  C. Clone sweeps │
│  steps 0-1       │     │  step 2 push     │     │  steps 2-5       │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                        ┌──────────────────────────────────┼──────────────────────────────────┐
                        │                                  │                                  │
                ┌───────▼────────┐               ┌─────────▼─────────┐              ┌─────────▼─────────┐
                │ D. Artifacts   │               │ E. Probes         │              │ F. Aux checks     │
                │ step 6         │               │ steps 7-8         │              │ steps 9-12        │
                └───────┬────────┘               └─────────┬─────────┘              └─────────┬─────────┘
                        │                                  │                                  │
                        └──────────────────────────────────┼──────────────────────────────────┘
                                                           │
                                                 ┌─────────▼─────────┐
                                                 │ G. Review and C2  │
                                                 │ step 13           │
                                                 └─────────┬─────────┘
                                                           │
                                                 ┌─────────▼─────────┐
                                                 │ H. Final tip, C3  │
                                                 │ step 14           │
                                                 └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A. Preflight | Phases 001-004 on `main` | `00-preflight.md` baselines | B |
| B. C1 publish | A | the clone target | C |
| C. Clone sweeps | B | `02-fresh-clone.md`, `03-fresh-clone-leak.md`, `04-d6-kept-records.md`, `05-advisor-db.md` | D, E, F, G |
| D. Artifacts | C and the CI rebuild | `06-trigger-index.md` | G, H |
| E. Probes | Phase 004 plus both checkouts | `07-routing-probes.md`, `08-local-invisibility.md` | G |
| F. Aux checks | C, `gh`, both symlinked private skills | `09-ci.md`, `12-history-inventory.md`, `13-drift.md`, `14-corpus-boundary.md` | G |
| G. Review and C2 | C, D, E, F | closed packet plus C2 | H |
| H. Final tip and C3 | G pushed and rebuilt | `11-final-tip.md` plus C3 | None |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **C1 push then fresh clone (steps 1-2)** - 15 minutes - CRITICAL. Nothing downstream can start without a remote tip.
2. **CI trigger-index rebuild (step 6)** - up to 30 minutes of waiting - CRITICAL. The four-artifact counts read a stale index until it lands.
3. **Review round and C2 (step 13)** - 30 minutes - CRITICAL. C2 is the commit a reader can re-run.
4. **C2 push, rebuild, final-tip clone (step 14)** - up to 30 minutes of waiting - CRITICAL. C3 exists only because this tip is not the tip the earlier sweeps read.

**Total Critical Path**: about 2 hours of work across one working day, with two CI waits on it.

**Parallel Opportunities**:
- Steps 3, 4, 5, 9, 10, 11 and 12 read independent artifacts and can run in any order once the clone exists.
- Steps 7 and 8 both run in the operator checkout and share one advisor rebuild.
- The reviewer round in step 13 can start once steps 3-12 have written their files; it does not wait for the validator.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Dependencies ready | `00-preflight.md` records phases 001-004 in the log, both private skills on disk, an authenticated `gh`, and the four baseline numbers | Step 0 |
| M2 | Remote proof done | C1 is pushed, the clone HEAD equals C1, and `03-fresh-clone-leak.md` shows 0 paths, 8 retained content paths, 0 active leaks, the already-public id count recorded and 0 new or changed blobs reachable from the clone | Step 3 |
| M3 | Artifacts and routing proven | `06-trigger-index.md` shows 0 live paths and 69 allowlisted, and both checkouts return the three expected skill ids | Steps 6-7 |
| M4 | Packet closeable | Every AC row is `Met`, `validate.sh --strict` prints `RESULT: PASSED`, C2 is pushed and its tree is clean | Step 13 |
| M5 | Final tip proven | `11-final-tip.md` records the rerun against the post-C2 tip, C3 is pushed, and the handoff names each push's runs | Step 14 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Verify from a fresh clone of the public remote, not from the working tree | Accepted |
| ADR-002 | Scope the rebuilt-artifact zero check to live routing sources and allowlist the 69 retained 007 paths | Accepted |
| ADR-003 | Prove new or changed private content absent by git blob identity, record the already-public ids, and cover partial content with marker sweeps | Accepted |
| ADR-004 | Run the routing probes in both consumer checkouts and never in the writer worktree | Accepted |
| ADR-005 | Inventory history, tags and release assets read-only and leave every rewrite to the operator | Accepted |
| ADR-006 | Publish three commits and report each push's CI result in the handoff | Accepted |

Full records, alternatives and consequences: `decision-record.md`.

---

<!-- ANCHOR:l3plus-ai-exec -->
## L3+: AI EXECUTION PROTOCOL

This phase is executed by one non-interactive implementer that cannot ask questions. The protocol below is the contract that replaces a conversation.

### Pre-Task Checklist

1. Read `spec.md` section 3 and confirm the write scope is this folder only.
2. Read `tasks.md` and take the first task whose checkbox is empty.
3. Confirm the task's **File** path exists, or is marked `new file`.
4. Open the file and confirm the **Anchor** text is present, with the line number the task quotes.
5. Read the task's **Change**, **Proof** and **Stop if** fields before touching anything.
6. Confirm the previous task's proof command ran and its output is quoted in the evidence file.
7. Confirm the tools the proof needs are on `PATH` (`git`, `node`, `sqlite3`, `jq`, `gh`).
8. Confirm the task's **AC** id exists in `acceptance-criteria.md`.
9. Begin only when all eight checks pass; otherwise stop and report which one failed.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run tasks in numeric order; a later task may depend on an earlier commit or a CI rebuild |
| TASK-SCOPE | Write only inside `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/`; never edit a private skill, a D6 record or a file outside this folder |
| TASK-VERIFY | Run the task's proof command and quote its output in the named evidence file before marking the checkbox |
| TASK-CONTROL | Run the positive control before every zero check; a control of `0` means the pattern is broken, not that the population is clean |
| TASK-DOC | Update the evidence file in the same task that produced the output, never in a later batch |
| TASK-BLOCK | On a missing anchor, a count that differs from Expected, or a missing tool, stop and report; do not improvise a substitute |
| TASK-COMMIT | Commit only at the three points the plan names (C1, C2, C3), stage files by name, and never `git add -A` |

**TASK-ZERO.** A zero check carries the wrapper below, so zero matches print `0` and exit `0`. Treat the printed count as the result, and never read an exit status alone as a pass:

```bash
IDX=/tmp/psurf-clone-main/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
```

**TASK-TICK.** Checkboxes are ticked inside the commit that closes their run segment, never between commits: C2 carries the boxes for T001 through T059 and C3 the boxes for T060 through T068, which is why C3 stages `tasks.md` alongside `11-final-tip.md`. A box ticked after a commit would leave the tree dirty for the clean-tree proof that follows it.

### Status Reporting Format

Report one block per task, filled from the task that just ran:

```
TASK T002 preflight
FILE specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md
PROOF git log --oneline -8
OUTPUT 583316d083 chore(system-spec-kit): rebuild the trigger index
EXPECTED the four phase commits visible in the log
STATUS DONE
```

### Blocked Task Protocol

1. Mark the task `[B]` in `tasks.md` and write the failing command and its full output into the task's evidence file.
2. Leave the task's AC row `Unmet` and do not mark any later task that depends on it.
3. Name the owning phase when the cause is outside this folder: 001 for the ignore rules, 002 for hub files, 003 for advisor code, 004 for the private skills.
4. Stop the run and report the blocked task id, the command, the output and the owning phase. Never repair an out-of-scope file to unblock a task.
<!-- /ANCHOR:l3plus-ai-exec -->
