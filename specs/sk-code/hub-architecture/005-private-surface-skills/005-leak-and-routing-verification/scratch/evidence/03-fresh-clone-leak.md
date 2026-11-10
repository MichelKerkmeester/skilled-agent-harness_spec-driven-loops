# 03 - Fresh-clone leak sweep

Run on 2026-10-24 against the clone recorded in `02-fresh-clone.md`, at `9129007915a2b6ada693440ad106fd8eefa5e589`. Path substitution: `CLONE` is `<SP>/psurf-clone-main` with `SP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`, and the `/tmp/psurf-*.txt` working files live in `SP` as `psurf-*.txt`. Nothing else differs from the task commands unless a section says so.

## A - Tracked paths

```bash
CLONE=<SP>/psurf-clone-main
git -C "$CLONE" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
git -C "$CLONE" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
```

Output:

```text
336
0
0
108
```

The second command prints `0` from `grep -c` and a second `0` from the `|| echo 0` fallback, so lines 2 and 3 are one live count of `0`.

Expected: 0 live, 108 retained specs/ paths

Result: held. Control 336, live 0, retained 108.

## B - Tracked content

```bash
git -C "$CLONE" grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l
```

Output:

```text
1528
      17
```

Expected: the control prints 1528, then exactly 8 paths

Result: control held (1528). Against the original expectation the path count was NOT held: 17 paths, not 8. The operator ruling of 2026-10-24 reclassified them as 8 kept records, 6 test fixtures and 3 retrieval artifacts, so against the amended expectation the sweep holds. The 17 paths with their per-path line counts (`git grep -c` at the clone `HEAD`):

```text
.skilled/scripts/git-hooks/tests/pre-commit.test.sh:6
.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:1
.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts:2
.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:3
.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts:3
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:4
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-align.md:9
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-apply.md:7
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:8
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-record-base.md:8
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-rollback.md:5
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:9
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:69
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:38
.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/specs_sk-doc_z_archive_025-skill-doc-currency_004-hub-surface-drift-sweep_spec.md:10
.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs:5
.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:69
```

The line counts sum to 256, the same figure `01-head-leak-sweep.md` section B records for the operator checkout.

## C - Retained versus active

```bash
ALLOW='^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/'
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -c -E "$ALLOW" || echo 0
git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E "$ALLOW" | wc -l
```

Output:

```text
8
       9
```

Expected: 8 retained, 0 active

Result: retained count held (8). Against the original expectation the unmatched count was NOT held: 9, not 0. Under the operator ruling of 2026-10-24 those 9 are the 6 test fixtures and 3 retrieval artifacts, which are accepted, so the count holds as amended.

The eight retained paths (D6 kept records):

```text
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-align.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-apply.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-record-base.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-rollback.md
.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md
.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/specs_sk-doc_z_archive_025-skill-doc-currency_004-hub-surface-drift-sweep_spec.md
```

Classification of the nine unmatched paths, each read from its hit lines:

| Path | Lines | Class | Reason read from the hits |
|---|---|---|---|
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | 6 | test fixture naming a private skill as a directory | `stage_new ".skilled/skills/local-webflow/SKILL.md" "private"` and `git rm --cached` on the same path, which test the pre-commit refusal of a staged private skill |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | 1 | test fixture naming a private skill as a directory | `makeRoot(skillsDir, 'local-webflow', { 'graph-metadata.json': { skill_id: 'local-webflow' } })` |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | 2 | test fixture naming a private skill as a directory | `writeSkill(root, 'local-webflow', 'hub', ...)` and `expect(output).not.toContain('local-webflow')` |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | 3 | test fixture naming a private skill as a directory | creates `external/sk-code-webflow` and symlinks it to `skills/local-webflow` in a temp directory |
| `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts` | 3 | test fixture naming a private skill as a directory | same temp symlink pattern, asserts `isTrustedPrivateSkillLink(...)` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | 5 | test fixture naming a private skill as a directory | writes a throwaway `local-webflow/SKILL.md` containing `description: "Private"` and asserts it is not synced to the Hermes output |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | 69 | retrieval artifact, allowlisted path | all 69 hit lines are `specs/sk-code/007-sk-code-obsidian-surface/...` path strings (the 007 folder name carries the token) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | 69 | retrieval artifact, allowlisted path | all 69 hit lines are the same `specs/sk-code/007-sk-code-obsidian-surface/...` path strings |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | 38 | retrieval artifact, phrase keys | 37 keys of the form `sk-code-obsidian <words>` (from the 007 packet) and one key `local-webflow local-obsidian` (from the phase 004 packet title) |

Anything else: none. Private skill content: none. Every hit in the nine paths is a name, a path string or a phrase key. The only text near a private skill body is the fixture string `description: "Private"` in `sync-skills-hermes.test.mjs`, which is a literal the test itself writes into a temp directory.

## D - Bare surface tokens

```bash
git -C "$CLONE" grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -c 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
```

Output:

```text
566
4
       0
```

Expected: 566 at 583316d083 as the control, then 4 raw, then 0 after the filter

Result: held (566, 4, 0). The four lines the filter removed, quoted from `rg -n` with the clone prefix stripped:

```text
.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:149:        re.compile(r'\bWEBFLOW\s*:'),                   # WEBFLOW: platform tag
.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:32:- `check-comment-hygiene.sh` reads the file, ... an allowed-class token (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`) ...
.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:119:2. **Banner missing, no stderr, checker returned rc=2 (skip) or rc=0 (clean)**: ... `ALLOWED_PATTERN` (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`) ...
.skilled/skills/sk-code/shared/references/universal/code-style-guide.md:149:| A platform / library name (`WEBFLOW:`, `MOTION:`, `LENIS:`) | Yes | Names a durable platform, not a tracking artifact |
```

All four are platform-tag mentions, none is a surface instruction, so the filter hides no leak.

## E - Blob identity

Two runs of the T014 command block follow. The literal block is first, because the task asks for its exact output. The corrected block is second, because the literal block's step (a) does not read the private files at all (see the finding below).

### E1 - The command exactly as written (symlink arguments given to `find` without `-L`)

```bash
CLONE=<SP>/psurf-clone-main
OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -print | wc -l
find "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -size +0c -print0 | xargs -0 git hash-object --no-filters | sort -u > psurf-private-blob-ids.txt
git -C "$CLONE" ls-tree -r 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | awk '{print $3}' | sort -u > psurf-base-blob-ids.txt
...   (steps (b) to (f) exactly as in tasks.md T014)
```

Output, one line per `wc -l` in order (a) files, (a) unique ids, (b) base ids, (c) already public, (d) copied references, (e) new or changed, (f) control, (f) assertion:

```text
       0
       0
     223
       0
       0
       0
       0
       0
```

Finding: both entries in `$OP/.skilled/skills/` are symlinks (`local-webflow -> /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow` and `local-obsidian -> /Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian`), and `find` without `-L` prints the two link names and descends into neither. `find ... -print` printed exactly those two link paths. So the literal block hashes nothing: the private population is empty, the zero assertion is vacuous and the control step prints `0`. Expected `228` files is NOT held in the literal form, and the literal assertion cannot count as a leak test.

### E2 - The same block with `find -L` (follows the two symlinks, every other step unchanged)

Output, same order as E1:

```text
     228
     225
     223
     138
       1
      86
     139
       0
```

Plus these supporting counts from the same run:

```text
zero-byte files among the 228:        0
duplicate blob ids among the 228:     3   (228 files, 225 unique ids)
public blob object dump size:         556742 blobs in the clone
already public (138) + copied (1) + new or changed (86) = 225 unique ids
private ids found in the public dump (control): 139 = 138 already public + 1 copied reference
new or changed ids found in the public dump (assertion): 0
```

Expected: 228 files, 223 base ids, at least 1 already public in history, 1 copied reference (amended from 3 by the operator ruling of 2026-10-24), at least 1 new or changed, at least 1 from the control, 0 reachable from the clone

Result of E2 against each expected value:

| Step | Expected | Real | Held |
|---|---|---|---|
| (a) files | 228 | 228 | yes |
| (b) base ids | 223 | 223 | yes |
| (c) already public in history | at least 1 | 138 | yes |
| (d) copied references | 1 (amended from 3) | 1 | yes |
| (e) new or changed | at least 1 | 86 | yes |
| (f) control | at least 1 | 139 | yes |
| (f) assertion, new or changed reachable from the clone | 0 | 0 | yes |

Detail on (d): the three hub references at `42b41dd286` have blob ids `2b9434e468beecd8dcc03dc2f84d773cda740088` (`workflow-debug.md`), `c43507a8f52e68ff0615ee1231ebbb284be795ff` (`workflow-implement.md`) and `17f81422ab05817b8e787e51e433afa743694355` (`workflow-verify.md`). Only `workflow-debug.md` is byte-identical in the private roots, and it is identical in both (`local-obsidian/references/workflow-debug.md` and `local-webflow/references/workflow-debug.md`, one unique id). The private `workflow-implement.md` and `workflow-verify.md` differ from the copied versions, so they sit in the new-or-changed set (86). They are not reachable from the clone (assertion 0).

Already-public count (input to the history-rewrite decision): 138 unique private blob ids already exist in the public object database via the base set, plus 1 via the copied reference, 139 in total.

New-or-changed count (the population the zero check covers): 86 unique ids, spread over `local-obsidian` (graph-metadata.json 1, manual-testing-playbook 28, README.md 1, references 3, scripts 1, SKILL.md 1) and `local-webflow` (assets 20, graph-metadata.json 1, manual-testing-playbook 13, README.md 1, references 17, SKILL.md 1).

## F - Partial-content policy

The identity check covers complete files only.
A zero-byte file is excluded because its blob is the reachable empty blob by definition.
A fragment of a private file is covered by the marker and token sweeps, not by identity.
The bytes the two restored trees inherit from `42b41dd286` were public before the removal, so they are recorded as already public in history and their count is the input to the history-rewrite decision rather than a failure.
The one hub reference copied from `shared/references/` at that commit that is byte-identical in the private roots (`workflow-debug.md`) is recorded the same way. The other two copied references differ from the private versions and sit in the new-or-changed set.
The zero assertion covers new or changed content only, and neither check claims the other's ground.

<!-- evidence:end -->
