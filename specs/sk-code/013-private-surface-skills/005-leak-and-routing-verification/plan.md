---
title: "Implementation Plan: Phase 5: leak-and-routing-verification"
description: "Read-only verification plan: one evidence file per check, ordered so the phase commit, the CI trigger-index rebuild and the local routing probes are observed in the only order that makes their output trustworthy."
trigger_phrases:
  - "leak and routing verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: leak-and-routing-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash commands only - `git`, `node` (the existing skill-advisor CLI), `sqlite3`, `jq`, `gh` |
| **Framework** | None. The phase writes no application code and imports nothing |
| **Storage** | Read-only reads of the tracked tree, a throwaway advisor SQLite database under `/tmp`, and a fresh clone under `/tmp` |
| **Testing** | Eleven evidence documents under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, each one command transcript with its expected output |

### Overview
Eleven ordered steps. Each step runs one read-only check, quotes its output into its own evidence file, and states the expected output next to it. Two steps carry ordering constraints: the fresh clone must come from `origin/main` after the phase commit is pushed, and the trigger-index count must come after CI rebuilds the index on `main`. The phase never edits a tracked file outside this folder, never touches `.skilled/skills/local-*`, and never repairs a D6 kept record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-004 are on `main` (`git log --oneline -3` shows the hub removal, the vocabulary cleanup and the private-skill commit)
- [ ] The operator checkout holds `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`
- [ ] `gh auth status` reports a logged-in account
- [ ] `sqlite3 --version` and `jq --version` both print a version

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met` with a quoted output
- [ ] `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` through `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` exist, and the final task in `tasks.md` has committed and pushed them together with the closed packet documents
- [ ] The reviewer round is recorded in `10-review.md`, with at most 2 rounds
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-only phase. Read the artifacts three producers leave behind - the tracked tree, the committed trigger index, the local advisor graph - and compare each against a fixed expected value.

### Key Components
- **Tracked tree**: `git ls-files` for paths and `git grep` for content, in a fresh clone of `origin/main`. The clone is the authority because the pre-commit guard is bypassable with `--no-verify` (D3 recorded limit) and because gitignored content on the operator disk is invisible to both.
- **Committed trigger index**: `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, rebuilt by CI after each push. Its producer honours only committed `.gitignore` files (`corpus.mjs` `gitIgnoredPaths`, lines 200-210), so the D2 rules are what keep private skills out and no code change is needed.
- **Advisor graph**: a SQLite file under `.skilled/skills/system-skill-advisor/runtime/database/` (gitignored by `runtime/database/.gitignore` `*.sqlite`), built by the metadata scan. `SYSTEM_SKILL_ADVISOR_DB_DIR` (`skill-graph-db.ts:271`) redirects it, which is how this phase builds one from the clone without touching the operator's graph.
- **Routing probes**: `advisor_recommend` through `.skilled/bin/skill-advisor.cjs`, which returns `data.recommendations[0].skillId`.

### Data Flow
`origin/main` -> fresh clone at `/tmp/psurf-clone-main` -> `git ls-files` / `git grep` / advisor metadata scan -> evidence file. The operator checkout feeds only the routing probes and the invisibility check, because those need the private skills on disk.

### Anchors this plan reads (all verified at `42b41dd286`)

| File | Anchor | What it decides |
|------|--------|-----------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | `gitIgnoredPaths` at line 200, body lines 200-210 | Why the index needs no code change: it shells out to `git ls-files --others --ignored --exclude-per-directory=.gitignore` |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | `resolveSkillGraphDbDir` at line 271, `SYSTEM_SKILL_ADVISOR_DB_DIR` at 272 | The throwaway database override |
| `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` | `*.sqlite` | The graph database is local only, so a leak there is invisible to the tracked sweep and needs its own check |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | whole file - 200 lines match the private-skill pattern at `42b41dd286` | The number the CI rebuild must drive to zero |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | `listSkillFiles`, lines 51-68 (walk at 55-60) | D5 producer: if it ever mirrors a private skill, `.hermes/skills/local-*` becomes a tracked path and step 4 catches it |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | `os.listdir` loop at line 200, `DEFAULT_OUTPUT` at line 33 | D5 producer: writes the tracked fallback `runtime/scripts/skill-graph.json` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | `findSkillRoots` filter at line 143 | D5 producer: a private skill must not enter a tracked metadata file |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | lines 146-148 | D5 producer: a private skill must not make the tracked fallback report stale |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | lines 37-39, the `'sk-code'` token array ending in `'obsidian plugin'` | Phase 003 removes that token; step 8's Obsidian probe is the behavioural proof |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | lines 600-602 | D6 kept record: mcp-code-mode's Webflow CMS vocabulary stays |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | line 131, `'webflow cms'` | D6 kept record: stays |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | line 2181, `"webflow cms"` | D6 kept record: stays |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is verification-only, so the table records what each surface's *producer* is and which step observes it. No surface is updated here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `corpus.mjs` `gitIgnoredPaths` (200-210) | producer of the trigger-index ignore set | unchanged | step 6: index count is 0 |
| `trigger-index.json` | tracked retrieval data, CI-rebuilt | unchanged | step 6: `grep -c` prints `0` |
| `skill_graph_compiler.py:200` | producer of the tracked fallback graph | unchanged (phase 003 added the `local-` skip) | step 4: clone `git grep` finds no private name in `runtime/scripts/skill-graph.json` |
| `sync-skills-hermes.cjs` `listSkillFiles` (51-68) | producer of `.hermes/skills/` | unchanged (phase 003) | step 3/4: `git ls-files` finds no `.hermes/skills/local-*` |
| `ci-skill-root-metadata.cjs:143` | producer of skill-root metadata | unchanged (phase 003) | step 3: no tracked metadata file names a private skill |
| `skill-graph-freshness.cjs:146-148` | consumer of the on-disk skill list | unchanged (phase 003) | step 6: the tracked fallback is not reported stale after the rebuild |
| advisor graph database | local, gitignored | not a tracked consumer | step 5: zero-row query, non-vacuous build |
| `advisor_recommend` | consumer of the graph | unchanged | step 7: three probes |

Required inventories:
- Same-class producers: `git grep -n "isDirectory()" .skilled/skills/system-skill-advisor/runtime/lib .skilled/commands/doctor/scripts` - the D4 scans are phase 003's, and this phase only reads their output through the routing probes.
- Consumers of the changed symbols: `git grep -n -E "sk-code-(webflow|obsidian)" -- ':!specs'` - every remaining hit is classified in step 3.
- Matrix axes: the two folder modes (real folder, symlink to a private repo) are an axis for step 7. Both are ignored by D2, so steps 3, 4 and 6 pass either way; step 7 passes only after phase 003 makes the scan follow a `local-*` symlink. The plan records which mode the operator chose in `07-routing-probes.md`.
- Algorithm invariant: none. This phase contains no path, parser or redaction logic.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step order, with the proof command for each step

Run these from the writer worktree root unless the step says otherwise. Quote the command and its output into the named evidence file. Where a step says "expect", that string is the pass value.

Every evidence path in this plan and in `tasks.md` is packet-relative and written out in full: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/<NN-name>.md`. Create that directory from the worktree root before step 0, and never write to `<worktree-root>/scratch/evidence/`, which is a different path that no criterion reads.

**Step 0 - Preflight** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md`)

```bash
git log --oneline -3
git ls-files .skilled/skills/sk-code | grep -c -E "sk-code-(webflow|obsidian)"    # expect 0
git ls-files | grep -c -E "local-(webflow|obsidian)"                              # expect 0
gh auth status
sqlite3 --version
jq --version
```

Record the baselines measured at `42b41dd286`, which prove the later checks can fail:

| Check (command quoted in the fenced block above) | Baseline at `42b41dd286` |
|---------------------------------------------------|---------------------------|
| Tracked paths naming a private skill or a removed surface | 336 |
| Tracked content lines naming either, outside the excluded paths | 1528 |
| Trigger-index lines naming either | 200 |
| Advisor `skill_nodes` rows returned by the step 5 query | 1 |

**Step 1 - Sweep the phase commit before pushing** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md`)

```bash
git ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"       # expect no output
git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" \
  -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l   # expect 0
rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code \
  --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l   # expect 0
```

The third command is the bare-token proof: the packet removes the surfaces, not only the packet names, so an uppercase `WEBFLOW` or `OBSIDIAN` left in either sk-code tree is a leak. `grep -v 'WEBFLOW:'` is the kept list phase 2 keeps - the comment-hygiene platform tag lines in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, the allowed-token list in `sk-code-quality/scripts/check-comment-hygiene.sh` and the tag row in `shared/references/universal/code-style-guide.md` - and the two globs keep the dated `changelog/` and `benchmark/reports/` records. `specs/` is out of the third command's scope for the same reason it is excluded above: this packet's own documents name the surfaces. The filter is line-level, so a line carrying the tag form is excused whole; the evidence quotes every removed line and names any surface instruction among them as a leak the filter hides.

A non-empty result here is fixed before the push: name the owning phase (002 for hub files, 003 for advisor vocabulary) and stop. This phase never edits a file outside its own folder.

**Step 2 - Fresh clone** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md`)

```bash
CLONE=/tmp/psurf-clone-main
rm -rf "$CLONE"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"
git -C "$CLONE" rev-parse HEAD
git -C "$CLONE" status --porcelain                                                  # expect empty
```

The clone HEAD must equal the phase commit that was pushed. Record both shas.

**Step 3 - Leak sweep in the clone** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`)

```bash
git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"   # expect no output
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" \
  -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*'
rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" \
  --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l   # expect 0
```

The third command repeats step 1's bare-token sweep inside the clone, with the same kept list: the `WEBFLOW:` comment-hygiene platform tag lines and the dated `changelog/` and `benchmark/reports/` records, and the same line-level caveat, so the evidence quotes every removed line. A non-zero count leaves REQ-002 `Unmet` and names phase 002 as the owner.

Classify every printed path. Two prefixes are the complete D6 allowlist for this grep:

- `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` - the playbooks that name units of the past v4.0.0.2 release
- `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/` - the anchor-repair test fixture

Any other path is a leak: record it, leave REQ-002 `Unmet`, and name the owning phase.

**Step 4 - D6 kept records** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md`)

```bash
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
  .skilled/changelog
```

Expect empty output. A non-empty diff is a D6 violation by an earlier phase, not a repair task here.

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

Expect `skillCount` greater than 0 (14 at `42b41dd286`) and no `EMPTY-SKILL-SCAN` warning. A zero-skill rebuild preserves the previous graph and proves nothing, so it fails the step.

```bash
sqlite3 -readonly "$DBDIR/skill-graph.sqlite" "SELECT count(*) FROM skill_nodes WHERE (id LIKE 'sk-code%' OR family = 'sk-code') AND (lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%webflow%' OR lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%obsidian%')"
```

Expect `0`. The same query prints `1` at `42b41dd286` because the `sk-code` node's derived block still lists `webflow frontend workflow` and `obsidian plugin`.

**Step 6 - Trigger index after the CI rebuild** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md`)

Push the phase commit first, then wait for the rebuild commit:

```bash
gh run list --branch main --limit 5 --json status,conclusion,headSha,displayTitle
git -C "$CLONE" pull --ff-only
git -C "$CLONE" log --oneline -3          # expect a "chore(system-spec-kit): rebuild the trigger index" commit above the phase commit
grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" \
  "$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"   # expect 0
```

Poll for at most 30 minutes. Past that, record the last `gh run list` output and leave REQ-003 `Unmet`.

**Step 7 - Local routing probes** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md`)

Run in the operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, which holds the private skills. Phase 004 runs there too, not in a worktree of its own, because `.skilled/skills/local-*` is gitignored and never travels between checkouts. Do not run these probes in the writer worktree: it has no private skill on disk, so every probe would return a hub skill and prove nothing.

```bash
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json | jq -r '.data.skillCount'
sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite \
  "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"    # expect local-obsidian and local-webflow

node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-webflow
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect local-obsidian
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'   # expect sk-code
```

Also record which folder mode the operator chose (real folder or symlink) and `ls -ld` output for both paths. A wrong top result is phase 004's to fix; record it and leave REQ-005 `Unmet`.

**Step 8 - D5 invisibility** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md`)

Run in the same operator checkout as step 7, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, because that is the disk where the private skills exist.

```bash
git status --porcelain | grep -E "local-(webflow|obsidian)"          # expect no output
git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian
```

Expect the first command silent, and the second to name `/.skilled/skills/local-*` and `/.hermes/skills/local-*` from the root `.gitignore`. `git check-ignore` evaluates patterns whether or not the path exists, so this step does not depend on which folder mode was chosen.

**Step 9 - CI on main** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md`)

```bash
gh run list --branch main --limit 10 --json status,conclusion,headSha \
  | jq -r '.[] | "\(.status)/\(.conclusion)"' | sort | uniq -c
```

Expect only `completed/success` and `completed/skipped` lines. Any `failure`, `cancelled` or `timed_out` leaves REQ-007 `Unmet`.

The grouping recorded here covers every run on `main` up to the push that carries the evidence. The runs of that push cannot appear in the file that push carries, so they are reported in the phase handoff message with their run ids and head sha, and `09-ci.md` states that limit. Nothing is appended to `09-ci.md` after the push: an appended block would leave the working tree dirty and the evidence uncommitted.

**Step 10 - Review and close** (`specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md`)

1. Hand the packet to a separate read-only DeepSeek reviewer session on branch `deepseekpi`, at most 2 rounds. The reviewer writes nothing; it returns findings in chat.
2. Record each finding and its resolution in `10-review.md`. A finding that contradicts a criterion's evidence reopens that criterion.
3. Transcribe the eleven evidence files into `implementation-summary.md`: one row per check under Verification, plus the D7, `--no-verify` and CI-after-the-push limits under Known Limitations.
4. Mark the `acceptance-criteria.md` rows `Met` with the observed value, and fill the closure statement.
5. Only when every row is `Met`, set `spec.md` `Status` to `Complete`, `acceptance-criteria.md` `Status` to `Complete` and `Closeable` to `Yes`, and add a `Status: Complete` row to the `implementation-summary.md` metadata table so all three documents agree. If any row is `Unmet`, leave all three as they are and report blocked.
6. Run the validator:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict
```

Expect `RESULT: PASSED`.
7. Commit and push the closed packet with the evidence it cites: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/*`, `implementation-summary.md`, `acceptance-criteria.md` and `spec.md`. The phase commit in step 2 was pushed before the evidence existed, so without this final commit the evidence stays untracked and the next reader cannot re-run a single check. Report the CI runs of this push in the phase handoff message with their run ids and head sha; do not append them to `09-ci.md`, because the append would land after the commit and leave the evidence uncommitted.

### Commit and push

- Branch: `deepseekpihigh` (docs only). Stage files by name; never `git add -A`.
- Push `HEAD:main` only, never a branch.
- Commit message needs a prose body explaining that this phase adds verification evidence and changes no code.
- Two commits: the pre-push commit before step 2's clone, and the final commit after step 10's validator run. The second one is the one that carries the evidence. Its own push's CI result is the one the handoff message reports with run ids, because no commit can carry the result of the push that creates it; REQ-007 reads the runs committed in `09-ci.md` plus that report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static sweep | Tracked paths and tracked content in a fresh clone | `git ls-files`, `git grep` |
| Data artifact | Committed trigger index, throwaway advisor SQLite graph | `grep -c`, `sqlite3 -readonly` |
| Behavioural | Three local routing probes, one per intended route | `skill-advisor.cjs advisor_recommend` |
| Boundary | The ten audited D6 kept-record prefixes unchanged since `42b41dd286` | `git diff --stat` |
| Regression | CI on `main` after the phase commit and after the index rebuild | `gh run list` |
| Documentation | Evidence completeness and template conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-004 on `main` | Internal | Green | No verification target; the phase cannot start |
| Private skills in the operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` (phase 004 runs there, because the trees are gitignored) | Internal | Green after phase 004 | Steps 7 and 8 cannot run; REQ-005 and REQ-009 stay `Unmet` |
| CI trigger-index rebuild | Internal | Green | Step 6 reads a stale index (200 lines) and cannot pass |
| `gh` authenticated | External | Green | Step 9 cannot observe CI; REQ-007 stays `Unmet` |
| Installed `.skilled/node_modules` and compiled advisor runtime in the writer worktree | Internal | Green | Step 5 cannot build the throwaway database |
| `sqlite3`, `jq`, `node` | External | Green | The step that needs the missing tool fails and its criterion stays `Unmet` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the evidence contradicts a criterion and the cause is in this phase's own documents, or the reviewer finds a claim the evidence does not support.
- **Procedure**: revert the phase commit, which is docs-only, so a revert restores the scaffolded packet and changes nothing else.

```bash
git revert <phase-commit-sha>
rm -rf /tmp/psurf-clone-main /tmp/psurf-db
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json
```

The last command rebuilds the operator's gitignored advisor database, which step 7 forces. No tracked file outside this folder is touched by the phase, so nothing else needs restoring. No deployment, no migration, no data change.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Steps 0-1 (preflight, HEAD sweep) ──► push ──► Steps 2-5 (clone, sweeps, D6, DB)
                                                        │
                                                        ├──► Step 6 (index, after CI rebuild)
                                                        └──► Steps 7-8 (operator checkout probes)
                                                                      │
                                                                      └──► Steps 9-10 (CI, review, close)
```

| Step | Depends On | Blocks |
|------|------------|--------|
| 0 Preflight | Phases 001-004 on `main` | 1 |
| 1 HEAD sweep | 0 | the push, and therefore 2 |
| 2 Fresh clone | the push | 3, 4, 5, 6 |
| 3 Leak sweep | 2 | 10 |
| 4 D6 kept records | 2 | 10 |
| 5 Advisor database | 2 | 10 |
| 6 Trigger index | 2 and the CI rebuild | 10 |
| 7 Routing probes | Phase 004 in the operator checkout | 10 |
| 8 Invisibility | Phase 004 in the operator checkout | 10 |
| 9 CI | the last push | 10 |
| 10 Review and close | 3-9 | none |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (steps 0-2) | Low | 15 minutes, plus one clone |
| Implementation (steps 3-8) | Low | 45 minutes, dominated by the CI wait |
| Verification (steps 9-10) | Low | 30 minutes including the reviewer round |
| **Total** | | **About 2 hours of operator time, one working day end to end because of the CI rebuild** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment: this phase ships documents only
- [ ] `/tmp/psurf-clone-main` and `/tmp/psurf-db` are outside the repository and disposable
- [ ] The operator's advisor database is gitignored and rebuildable from tracked metadata

### Rollback Procedure
1. `git revert <phase-commit-sha>` - restores the packet to its scaffolded state.
2. `rm -rf /tmp/psurf-clone-main /tmp/psurf-db` - removes the throwaway clone and database.
3. `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json` - rebuilds the local graph the probes forced.
4. Re-run `validate.sh --strict` and confirm `RESULT: PASSED` on the reverted packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the only mutable artifact is a gitignored SQLite file that the rebuild command regenerates from tracked metadata.
<!-- /ANCHOR:enhanced-rollback -->

---

