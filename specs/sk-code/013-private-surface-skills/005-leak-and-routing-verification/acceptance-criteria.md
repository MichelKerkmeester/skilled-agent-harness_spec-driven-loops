---
title: "Acceptance Criteria: Phase 5: leak-and-routing-verification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "leak and routing verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/005-leak-and-routing-verification"
    last_updated_at: "2026-10-23T13:45:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Rewrote the criteria as Level 3 with a proof command per row"
    next_safe_action: "Run each proof command and record its output in the named evidence file"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-005-leak-and-routing-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: leak-and-routing-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/005-leak-and-routing-verification
**Level:** 3
**Status:** In progress
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Evidence | Status | Waiver |
|-------|-----|---------------------|----------|--------|--------|
| AC-001 | REQ-001 | Given a fresh clone of `origin/main` at the phase commit, When `git ls-files -- ':!specs/**'` is counted for `local-webflow`, `local-obsidian`, `sk-code-webflow` and `sk-code-obsidian`, Then it prints `0 live`, the retained `specs/` population counts `108` paths, while the same pattern still counts `336` paths at `42b41dd286` | `scratch/evidence/02-fresh-clone.md` and `scratch/evidence/03-fresh-clone-leak.md`, section A; observed 2026-10-24, replayed by the round 2 review: control `336`, live `0`, retained `108` at `9129007915` and at `1c0c3534cf` (`scratch/evidence/03-fresh-clone-leak.md:27`, `scratch/evidence/02-fresh-clone.md:54`) | Met | - |
| AC-002 | REQ-002 | Given the same clone, When the tracked-content sweep runs with the four path exclusions, the bare-token sweep runs over both sk-code trees and the private blob identities are classified against the removal commit and the clone's object database, Then 17 paths remain, exactly 8 under the two D6 kept-record prefixes, 6 test fixtures and 3 retrieval artifacts, no path outside those three classes appears, the token count is `0` after the `WEBFLOW:` filter, the private ids the base tree already carried are recorded as already public in history and their count is reported as the input to the history-rewrite decision, the hub reference copied from `shared/references/` is recorded the same way, and no new or changed private id is reachable from the clone | `scratch/evidence/03-fresh-clone-leak.md`, sections B through F (the blob command is the `find -L` run in section E); observed 2026-10-24, replayed by the round 2 review: control `1528`, 17 paths as 8 kept records, 6 test fixtures and 3 retrieval artifacts (amended), tokens `566`, `4`, `0`, blob check `228` files, `223` base ids, `138` already public, `1` copied reference, `86` new or changed, assertion `0` (`scratch/evidence/03-fresh-clone-leak.md:45`, `:86`, `:135`, `:202`) | Met | - |
| AC-003 | REQ-003 | Given CI has rebuilt the four retrieval artifacts on `main`, When each is counted, Then `trigger-index.json` carries `0` `.skilled/` paths, `69` allowlisted `specs/sk-code/007-sk-code-obsidian-surface/` paths and `38` retained phrase keys, `corpus-manifest.json` carries `69` included and `0` skipped matches, and `generation-diagnostics.json` carries `0` while `phrase-variants.json` carries `38` | `scratch/evidence/06-trigger-index.md`, sections C through H; observed 2026-10-24 at `9129007915` and replayed at `1c0c3534cf` by the round 2 review: index `0`, `69`, `0`, `38`, manifest `69 0`, diagnostics `0`, variants `38`; the final-tip rerun is AC-015 (`scratch/evidence/06-trigger-index.md:73`, `:93`, `:118`, `:136`, `:158`, `:178`) | Met | - |
| AC-004 | REQ-004 | Given a throwaway advisor database built from the clone with `SYSTEM_SKILL_ADVISOR_DB_DIR`, When the sk-code-family query runs, Then `count(*)` prints `0` and the rebuild reported `skillCount` of at least `14` with no `EMPTY-SKILL-SCAN` warning | `scratch/evidence/05-advisor-db.md`, sections A and B; observed 2026-10-24: `skillCount` `14`, `0` `EMPTY-SKILL-SCAN`, family control `1`, surface query `0` (`scratch/evidence/05-advisor-db.md:34`, `:52`); the second control at `583316d083` is recorded as inferred, not observed | Met | - |
| AC-005 | REQ-005 | Given the operator checkout and the Obsidian Plugin checkout, each with both private skills visible and the advisor graph rebuilt, When the three probes run in each, Then the Webflow probe lists `local-webflow` and the Obsidian probe lists `local-obsidian` among the top two recommendations with confidence of at least 0.8, the generic frontend probe still lists `sk-code` first, every rank and score is recorded, and the plugin checkout's eight runtime symlinks resolve into this hub (amended 2026-10-24 by operator ruling, see the amendment note under AC-005 below) | `scratch/evidence/07-routing-probes.md`, sections A through K; observed 2026-10-24 in both checkouts: `sk-code,local-webflow`, `mcp-tooling,local-obsidian`, `sk-code` first on the generic prompt, eight symlinks resolve into the hub; the confidence bound is noted as unable to fail, so rank is the test (`scratch/evidence/07-routing-probes.md:63`, `:85`, `:107`, `:165`, `:189`, `:211`, `:233`) | Met | - |
| AC-006 | REQ-006 | Given the fresh clone, When `git diff --stat 42b41dd286 HEAD` runs over the ten D6 out-of-scope path prefixes, Then the output names only `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` from commit `e00fef3e76` as the single accepted exception and nothing for the other nine prefixes, and the dated records outside that audit (surface `changelog/`, `benchmark/reports/`, `specs/**/z_archive/`) are not claimed unchanged | `scratch/evidence/04-d6-kept-records.md`; observed 2026-10-24: `skill_advisor.py` is the one changed path, from `e00fef3e76`, control `2`, and the dated records are stated as not audited (`scratch/evidence/04-d6-kept-records.md:28`) | Met | - |
| AC-007 | REQ-007 | Given the pushes recorded in the committed `09-ci.md`, When `gh run list --branch main --limit 10` is grouped by status and conclusion, Then every row is `completed/success` or `completed/skipped`, no `failure`, `cancelled` or `timed_out` appears, and each evidence push's own runs are reported in the phase handoff message with run ids and head sha rather than appended to `09-ci.md` | `scratch/evidence/09-ci.md` plus the handoff message; observed 2026-10-24 at `a60192ef4e`: `10 completed/success`, `40 completed/success`, `0` failed, cancelled, timed out or unfinished, and each phase push read by commit (`scratch/evidence/09-ci.md:40`); the run ids of each evidence push go in the handoff message | Met | - |
| AC-008 | REQ-008 | Given the fifteen evidence files, When the evidence directory is counted and `validate.sh --strict` runs on this folder, Then the directory holds 15 files and the validator prints `RESULT: PASSED` | `scratch/evidence/00-preflight.md` and the validator output quoted in `scratch/evidence/10-review.md` | Unmet | - |
| AC-009 | REQ-009 | Given the operator checkout, When `git status --porcelain` is filtered for the private skills and `git check-ignore -v` is asked about both, Then the first prints `0` lines and the second prints two lines naming the root `.gitignore` rules | `scratch/evidence/08-local-invisibility.md`, sections A and B; observed 2026-10-24: both entries carry the `!!` ignored marker, `0` modified or staged, and `check-ignore` names `.gitignore:236` and `:237` (`scratch/evidence/08-local-invisibility.md:30`, `:52`) | Met | - |
| AC-010 | REQ-010 | Given the evidence set, When a reader looks for the recorded limits, Then `implementation-summary.md` Known Limitations and `09-ci.md` both state that removed content stays in git history (D7), that `git commit --no-verify` bypasses the pre-commit guard, that an evidence push's own CI runs are reported in the handoff rather than committed, and that no pre-push surface-token guard exists, and neither document claims a scrubbed history, an unbypassable guard or a committed CI result for that push | `implementation-summary.md` Known Limitations plus `scratch/evidence/09-ci.md`; observed 2026-10-24: the four limits are stated without softening in `implementation-summary.md` Known Limitations and in `scratch/evidence/09-ci.md` Limits (`implementation-summary.md:144`, `scratch/evidence/09-ci.md:46`), with the pre-push grep `0` against a pre-commit control `15` | Met | - |
| AC-011 | REQ-011 | Given every `Met` row, When the reviewer re-runs its command, Then the quoted output in the evidence file matches, no row is `Met` whose evidence file is missing or records a failure, and the review file holds one verdict row per criterion | `scratch/evidence/10-review.md`, at most 2 rounds; observed 2026-10-24: `scratch/evidence/10-review.md` holds one verdict row per criterion and two review rounds, with 25 findings each answered | Met | - |
| AC-012 | REQ-012 | Given a temporary repository whose ignored `local-probe` skill holds the marker `psurf-corpus-probe-marker-7f3c1a` and whose tracked control skill holds `psurf-control-marker-7f3c1a`, When the generator writes all four artifacts, Then the control count is at least `1` in `phrase-variants.json` and the marker count is `0` in all four | `scratch/evidence/14-corpus-boundary.md`, sections A through C; observed 2026-10-24: marker `0` in all four artifacts, control `2` and `1`, and with only the ignore rule removed the marker reads `2` and `1` and the private path is in the manifest (`scratch/evidence/14-corpus-boundary.md:87`, `:133`) | Met | - |
| AC-013 | REQ-013 | Given the public clone, When the reachable objects, the tag trees and the hosted releases are inventoried read-only, Then the evidence records 1681 reachable objects whose path names the removed surfaces, 157 tags in the clone with 18 carrying a non-zero old-path count, every release listed with its assets (30 of 146 hosted releases, all with zero assets) and no rewrite is executed | `scratch/evidence/12-history-inventory.md`, sections A through C; observed 2026-10-24: `1681` reachable objects, `157` tags with `18` carrying old paths, `30` releases listed with `0` assets (`scratch/evidence/12-history-inventory.md:25`, `:83`, `:174`) | Met | - |
| AC-014 | REQ-014 | Given the operator checkout with both private skills present, When the three drift scripts at `.github/workflows/routing-registry-drift.yml` lines 198-200 (the `ci-skill-root-metadata`, `ci-leaf-manifest-freshness` and `ci-skill-derived-freshness` commands) run and the compiler exports to a temporary path, Then each exit code is recorded, the exported graph's `local-` id count is recorded, and any failure is routed rather than repaired | `scratch/evidence/13-drift.md`, sections A through D; observed 2026-10-24: the three scripts exit `0` with `checked=14` in both forms, the export holds `0` `local-` ids (`scratch/evidence/13-drift.md:39`, `:72`, `:91`, `:136`, `:181`) | Met | - |
| AC-015 | REQ-015 | Given the evidence commit is pushed and its trigger-index rebuild has landed, When the clone is refreshed to that tip and every path, content, bare-token, blob and artifact check is rerun, Then each prints the same value as the earlier run - the blob check reprints at least one already-public id as its control and `0` for new or changed content - and the results are committed in `11-final-tip.md` together with the closed checklist in `tasks.md` | `scratch/evidence/11-final-tip.md`, sections A through E, and the C3 commit | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:proof -->
## 3. PROOF COMMANDS

Every block runs from the repository root of the writer worktree. `CLONE` is the fresh clone and `OP` is the operator checkout. Each zero check is preceded by a positive control that proves the same pattern still matches a known population, so an empty result cannot come from a broken pattern. A command whose expected output is `0` is wrapped so that zero matches prints `0` and exits `0`; the exit status alone is never read as the result.

### AC-001 - tracked paths in the fresh clone

```bash
CLONE=/tmp/psurf-clone-main
git -C "$CLONE" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
git -C "$CLONE" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
```

Expected: `336` from the positive control, then `0 live` outside `specs/`, then `108 retained` `specs/` paths.

### AC-002 - content, tokens, blobs and the retained population

```bash
CLONE=/tmp/psurf-clone-main
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
EX=':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*'
ALLOW='^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/'

# positive control: the pattern still matches 1528 lines at 42b41dd286
git -C "$CLONE" grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- "${EX[@]}" | awk -F: '{s+=$NF} END {print s}'

# retained population, then the active one
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- "${EX[@]}" | grep -c -E "$ALLOW" || echo 0
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- "${EX[@]}" | grep -v -E "$ALLOW" | wc -l

# bare-token sweep: 566 at 583316d083 as the control, then 4 raw lines in the post-removal tree
git -C "$CLONE" grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -c 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l

# blob identity: the private set, the base set, the exposure, the copies, then the assertion
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -print | wc -l
find -L "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -size +0c -print0 \
  | xargs -0 git hash-object --no-filters | sort -u > /tmp/psurf-private-blob-ids.txt

git -C "$CLONE" ls-tree -r 42b41dd286 -- \
  .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian \
  | awk '{print $3}' | sort -u > /tmp/psurf-base-blob-ids.txt
wc -l < /tmp/psurf-base-blob-ids.txt

comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt > /tmp/psurf-history-exposure-blob-ids.txt
wc -l < /tmp/psurf-history-exposure-blob-ids.txt

git -C "$CLONE" ls-tree 42b41dd286 -- \
  .skilled/skills/sk-code/shared/references/workflow-implement.md \
  .skilled/skills/sk-code/shared/references/workflow-debug.md \
  .skilled/skills/sk-code/shared/references/workflow-verify.md \
  | awk '{print $3}' | sort -u > /tmp/psurf-copied-reference-blob-ids.txt
comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-copied-reference-blob-ids.txt | wc -l

comm -23 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt \
  | comm -23 - /tmp/psurf-copied-reference-blob-ids.txt > /tmp/psurf-new-blob-ids.txt
wc -l < /tmp/psurf-new-blob-ids.txt

git -C "$CLONE" cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' \
  | awk '$2=="blob"{print $1}' | sort -u > /tmp/psurf-public-blob-ids.txt
comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l
comm -12 /tmp/psurf-new-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l
```

Expected: `1528`, then `8` retained, then `9` unmatched paths that all classify as 6 test fixtures or 3 retrieval artifacts with `0` unclassified (17 paths in all), `566` as the token control, `4` raw tokens, `0` after the filter, `228` private files, `223` base ids, `138` already public in history, `1` copied reference, `86` new or changed, `139` from the control (the object database still matches the private ids the base tree carries) and `0` new or changed blobs reachable from it.

Amendment 2026-10-24 (operator ruling): the content sweep passes when every one of the 17 paths falls in the three classes and nothing else appears. The 8 retained D6 paths match the `ALLOW` prefixes. The 6 test paths (`pre-commit.test.sh`, `skill-root-metadata-contract.test.cjs`, `skill-graph-freshness-panel.vitest.ts`, `advisor-status.vitest.ts`, `private-skill-target.vitest.ts`, `sync-skills-hermes.test.mjs`) sit under `tests/` with a `.test.` or `.vitest.` basename and every hit line is a fixture directory name or a negative assertion on it. The 3 artifacts (`trigger-index.json`, `corpus-manifest.json`, `phrase-variants.json`) hold only `specs/sk-code/007-sk-code-obsidian-surface/` path strings and phrase keys, so no `.skilled/` routing path appears in them. Any hit outside these classes, or any hit line that holds skill body text, is a leak. No private skill content was found in the 17, only names, paths and phrase keys, and the retained D6 count stays 8. The `find` in the blob identity step did not follow the two symlinks under `.skilled/skills/` and hashed nothing, so its zero assertion was vacuous. It now uses `find -L`, and the measured values above come from that run in `03-fresh-clone-leak.md` section E. Only `workflow-debug.md` is a copied reference, because the private `workflow-implement.md` and `workflow-verify.md` differ from the public copies. The assertion of 0 means none of the 86 new or changed ids is reachable from the public clone. The row stays `Unmet` until the final-tip rerun.

### AC-003 - the four regenerated retrieval artifacts

```bash
CLONE=/tmp/psurf-clone-main
IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
FIX="$CLONE/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures"

# positive control: 200 matching lines in the index at 42b41dd286
git -C "$CLONE" show 42b41dd286:.skilled/skills/system-spec-kit/runtime/data/trigger-index.json | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'

# live routing sources, then the allowlisted audit paths, then anything else
grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l
grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' \
  | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l

# phrase keys: 38 retained keys measured from the retained docs, then no bare skill id
grep -c -E '"(sk code obsidian|local webflow)[ "]' "$IDX" || echo 0
grep -c -E '^ *"(local webflow|local obsidian|sk code webflow|sk code obsidian)": \[' "$IDX" || echo 0

node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' "$FIX/corpus-manifest.json"
grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0
grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0
```

Expected: `200`, then `0`, `69`, `0`, `38` retained keys, `0` bare keys, `69 0` from the manifest, `0` diagnostics and `38` variants.

### AC-004 - throwaway advisor database

```bash
DBDIR=/tmp/psurf-db
rm -rf "$DBDIR" && mkdir -p "$DBDIR"
SYSTEM_SKILL_ADVISOR_DB_DIR="$DBDIR" node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted \
  --json '{"force":true,"workspaceRoot":"/tmp/psurf-clone-main"}' --format json > /tmp/psurf-rebuild.json
jq -r '.data.skillCount' /tmp/psurf-rebuild.json
jq -r '(.data.summary.warnings // []) | map(select(test("EMPTY-SKILL-SCAN"))) | length' /tmp/psurf-rebuild.json
sqlite3 -readonly "$DBDIR/skill-graph.sqlite" "SELECT count(*) FROM skill_nodes WHERE family = 'sk-code'"
sqlite3 -readonly "$DBDIR/skill-graph.sqlite" "SELECT count(*) FROM skill_nodes WHERE (id LIKE 'sk-code%' OR family = 'sk-code') AND (lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%webflow%' OR lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%obsidian%')"
```

Expected: `skillCount` of `14` or greater, then `0` `EMPTY-SKILL-SCAN` warnings, then `1` as the positive control (`family = 'sk-code'` still matches a row), then `0` from the surface query. The same surface query returns `1` on the pre-phase tree, which is the second control recorded in `05-advisor-db.md`.

### AC-005 - six routing probes across two checkouts

```bash
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PLUGIN="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
cd "$OP"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json | jq -r '.data.skillCount'
sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
cd "$PLUGIN"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
for l in .claude .codex .cursor .devin .hermes .opencode .pi .skilled; do printf '%s -> %s\n' "$l" "$(readlink "$l")"; done
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
```

Expected: `16` or greater from the operator rebuild (14 tracked nodes plus one per private skill), then `local-obsidian` and `local-webflow`, then a top-two list containing `local-webflow`, a top-two list containing `local-obsidian`, then `sk-code`, then eight `-> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/...` lines, then the same three results in the same order. Each private skill's recorded `confidence` is at least 0.8 and the evidence records the full top-three array with scores.

Amendment 2026-10-24 (operator ruling): the advisor daemon now carries the private roots and returns both private skills, but the measured ranks are `implement a responsive webflow animation module` with sk-code 0.695 then local-webflow 0.524 (confidence 0.82), `add an obsidian plugin command palette integration` with mcp-tooling 0.660 then local-obsidian 0.581, and `add a responsive css layout to the settings page` with sk-code 0.762 first. The operator ruled that the private skill must appear in the top two recommendations with confidence of at least 0.8, with ranks recorded, and that the generic frontend prompt must still return sk-code first.

### AC-006 - D6 kept records

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
git -C "$CLONE" diff --stat 42b41dd286 HEAD -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md | wc -l
```

Expected: `2` from the audited range (one path line plus the summary line), the path being `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` from commit `e00fef3e76`, and at least `1` from the control path, which proves the range resolves rather than silently matching nothing. The other nine prefixes stay empty.

Amendment 2026-10-24 (operator ruling): the original expectation was an empty audit. The one changed path is the intended bounded-scan change landed by the third phase of this same program. It adds symlink-aware private-skill scanning (4 insertions, 2 deletions) and touches no Webflow or Obsidian record. It is the single accepted exception. Evidence is `scratch/evidence/04-d6-kept-records.md` section A.

### AC-007 - CI on main

```bash
gh run list --branch main --limit 10 --json status,conclusion,headSha | jq -r '.[] | "\(.status)/\(.conclusion)"' | sort | uniq -c
gh run list --branch main --limit 10 --json status,conclusion | jq -r '.[] | select(.conclusion=="success")' | wc -l
gh run list --branch main --limit 10 --json status,conclusion | jq -r '.[] | select(.conclusion=="failure" or .conclusion=="cancelled" or .conclusion=="timed_out")' | wc -l
```

Expected: only `completed/success` and `completed/skipped` lines, then at least `1` successful run as the positive control, then `0` failing runs.

### AC-008 - evidence completeness and validation

```bash
ls specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/*.md | wc -l
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict | tail -3
```

Expected: `15` files, and `RESULT: PASSED` in the validator's tail.

### AC-009 - private skills invisible to git

```bash
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cd "$OP"
git status --porcelain --ignored | grep -c -E "local-(webflow|obsidian)"
git status --porcelain | grep -c -E "local-(webflow|obsidian)" || echo 0
git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian | wc -l
```

Expected: `2` ignored entries as the positive control (the pattern matches when the paths are visible), then `0` status lines, then `2` check-ignore lines naming the root `.gitignore` rules.

### AC-010 - recorded limits

```bash
for t in 'no-verify' 'D7' 'handoff' 'pre-push'; do printf '%s %s\n' "$t" "$(grep -c "$t" implementation-summary.md)"; done
grep -c 'no-verify' specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md
```

Expected: four counts of at least `1` from `implementation-summary.md`, and at least `1` from `09-ci.md` for the `--no-verify` limit.

### AC-011 - reviewer round

```bash
grep -c "^| AC-[0-9]" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md
grep -c "^| F-[0-9]" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md
```

Expected: `15` verdict rows, matching one row per criterion, and a finding count equal to the findings the reviewer raised, with every finding row carrying a resolution cell.

### AC-012 - corpus boundary probe

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
git status --porcelain --ignored .skilled/skills/local-probe
cd - >/dev/null
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root "$P" --out "$P/out/trigger-index.json" --quiet
grep -ric -e 'psurf-control-marker-7f3c1a' -e 'psurf control marker 7f3c1a' "$P/out" | sort
grep -ric -e 'psurf-corpus-probe-marker-7f3c1a' -e 'psurf corpus probe marker 7f3c1a' "$P/out" | sort
grep -c 'skills/local-probe' "$P/out/trigger-index.json" || echo 0
```

Expected: `!! .skilled/skills/local-probe/`, then a control count of at least `1` in `phrase-variants.json`, then `0` for the marker in all four artifacts, then `0` for the probe path.

### AC-013 - read-only history inventory

```bash
CLONE=/tmp/psurf-clone-main
git -C "$CLONE" rev-list --objects --all | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
git -C "$CLONE" tag --list | wc -l
gh release list --limit 30 | wc -l
```

Expected: `1681` reachable objects at the measured tip, `157` tags in the clone, and a release count equal to the lines `gh release list` prints (30), each of which is then inspected with `gh release view "$t" --json tagName,assets` in `12-history-inventory.md`.

Amendment 2026-10-24 (operator ruling): the original values were 1814 objects and 164 tags. The 164 is the operator checkout's local tag count, which includes 7 local-only tags that a fresh clone never sees. The remote carries 157 tags. 18 of them have a non-zero old-path count. `--limit 30` lists 30 of the 146 hosted releases and every release has zero assets, which a wider read-only `gh api` listing confirmed for all 146. Evidence is `scratch/evidence/12-history-inventory.md` sections A through C.

### AC-014 - drift scripts in the operator checkout

```bash
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cd "$OP"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills >/dev/null 2>&1; echo "root-metadata=$?"
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --skills-dir .skilled/skills >/dev/null 2>&1; echo "leaf-manifest=$?"
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --skills-dir .skilled/skills >/dev/null 2>&1; echo "derived-freshness=$?"
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json --output /tmp/psurf-skill-graph.json >/dev/null 2>&1; echo "compiler=$?"
grep -c '"local-' /tmp/psurf-skill-graph.json || echo 0
```

Expected: four exit codes recorded as they are (a `0` is a pass, a non-zero is a recorded finding routed to phase 003 or 004), and a `local-` id count recorded as it is.

### AC-015 - final tip re-verification

```bash
CLONE=/tmp/psurf-final-tip
rm -rf "$CLONE"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"
git -C "$CLONE" log --oneline -3
git -C "$CLONE" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
git -C "$CLONE" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E '^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/' | wc -l
rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
grep -E '^ *"\.skilled/' "$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
```

Expected: a `chore(system-spec-kit): rebuild the trigger index` commit above the evidence commit, then `336` as the positive control, then `0 live`, `108 retained`, `0` content paths, `0` tokens and `0` index paths.
<!-- /ANCHOR:proof -->

---

<!-- ANCHOR:closure -->
## 4. CLOSURE STATEMENT

**Closeable:** No

Thirteen of fifteen rows are `Met` on the evidence at `a60192ef4e`, confirmed by the round 2 review in `scratch/evidence/10-review.md`: AC-001 to AC-007 and AC-009 to AC-014. Two rows stay `Unmet` on purpose. AC-008 needs the fifteenth evidence file and a passing strict validation, and AC-015 needs the final-tip re-clone that only exists after the evidence push. Both close in the third commit. No row is waived.
<!-- /ANCHOR:closure -->
