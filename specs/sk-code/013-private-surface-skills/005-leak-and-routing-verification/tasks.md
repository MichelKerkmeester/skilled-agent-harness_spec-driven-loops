---
title: "Tasks: Phase 5: leak-and-routing-verification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "leak and routing verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: leak-and-routing-verification

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task carries seven fields in this order: **File**, **Anchor**, **Change**, **Proof**, **AC**, **Rollback**, **Stop if**. One task makes one change: it edits one file, runs one command, or generates one artifact.

Two conventions make the append tasks literal. Every evidence file ends with the line `<!-- evidence:end -->`; a task that appends a section anchors on that exact line and ends its inserted block with the same line. Every task that expects `0` from a count wraps the command with `|| echo 0`, so zero matches prints `0` and exits `0`; the exit status is never read as the result on its own.

Run the tasks in order. T006 asserts the planning documents are already on `main` and commits the first evidence file as C1; T007 through T009 push C1 and clone it; T019 through T026 read the four artifacts only after CI rebuilds them; T060 through T068 verify the tip that the evidence commit and its own rebuild produce, close the checklist as C3, push it and hand off.

Checkboxes are ticked inside the commit that closes their run segment, never between commits: C2 carries the boxes for T001 through T059 and C3 the boxes for T060 through T068. A box ticked after a commit would leave `tasks.md` modified for the clean-tree proof that follows it.

Every evidence path below is packet-relative and written out in full under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the evidence directory (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence)
  - **File**: none - the command creates the directory
  - **Anchor**: n/a - no file is edited
  - **Change**: `mkdir -p specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence`
  - **Proof**:
    ```bash
    test -d specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence && echo present
    ```
    Expected: `present`
  - **AC**: AC-008
  - **Rollback**: `rmdir specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence` while it is still empty
  - **Stop if**: the directory exists and already holds a file this phase did not write

- [ ] T002 Record the preflight and the baselines (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write the file with four blocks. Block 1, a heading `# 00 - Preflight` and one line naming the date and the writer branch `deepseekpihigh`. Block 2, a table with one row per command below, each row carrying the command, its output and its expected value: `git log --oneline -8`, `gh auth status`, `sqlite3 --version`, `jq --version`, `node --version`. Block 3, a table titled `Baselines` carrying exactly these rows: tracked paths naming a private skill or a removed surface `336` at `42b41dd286` and `336` at `583316d083`; tracked content lines outside the excluded paths `1528` and `1529`; trigger-index matching lines `200` and `200`; of which `.skilled/` paths `131` and `131`; of which `specs/sk-code/007-sk-code-obsidian-surface/` paths `69` and `69`; trigger-index space-normalized phrase keys `59` and `59`; `corpus-manifest.json` matching lines `not measured` and `260`; `generation-diagnostics.json` matching lines `not measured` and `60`; `phrase-variants.json` matching lines `58` and `59`; bare `WEBFLOW` and `OBSIDIAN` token lines before and after the `WEBFLOW:` filter `not measured` and `566 / 548`; retained content-sweep paths under the two D6 prefixes `not measured` and `8`; advisor `skill_nodes` rows from the step 5 query `1` and `1`; advisor `skillCount` `not measured` and `14`. Block 4, one line stating that the one-line difference between the two commits is `phrase-variants.json`, which the two intervening index rebuilds extended from 58 to 59 matching lines. End the file with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    grep -c '^|' specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md
    tail -1 specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md
    ```
    Expected: at least `19` table rows, then `<!-- evidence:end -->`
  - **AC**: AC-008
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md`
  - **Stop if**: `gh auth status` reports no logged-in account, or `git log --oneline -8` does not show the phase 001-004 commits, in which case record the output and report blocked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Sweep the planning commit for tracked paths (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 01 - Head leak sweep`, a section heading `## A - Tracked paths`, the fenced commands, their output and the line `Expected: 336 at 42b41dd286 as the control, 0 live, 108 retained specs/ paths`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    git ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
    git ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
    git ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
    ```
    Expected: `336` as the positive control, then `0` live, then `108` retained `specs/` paths
  - **AC**: AC-001
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md`
  - **Stop if**: the control is not `336` (the pattern is broken), the live count is not `0`, or the retained count is not `108`; name the owning phase (002 for hub files, 003 for advisor vocabulary) and stop before the commit

- [ ] T004 Sweep the planning commit for tracked content (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Tracked content` section holding the positive control, the fenced commands, their output and `Expected: 1528 at 42b41dd286 as the control, then 0`, followed by a blank line and the anchor line again.
  - **Proof**:
    ```bash
    git grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'
    git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l
    ```
    Expected: `1528` as the positive control, then `0`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed; the file returns to T003's content
  - **Stop if**: the control is not `1528` (the pattern is broken), or the count is not `0`; name the owning phase and stop before the commit

- [ ] T005 Sweep the planning commit for bare surface tokens (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Bare surface tokens` section holding the positive control, the two fenced commands, their outputs and `Expected: 566 at 583316d083 as the control, then 4 raw in the post-removal tree, then 0 after the filter`, followed by one quoted line per line the `grep -v 'WEBFLOW:'` stage removed, a note naming any removed line that is a surface instruction rather than a platform tag as a leak the filter hides, a blank line and the anchor line again.
  - **Proof**:
    ```bash
    git grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
    rg -c 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
    rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
    ```
    Expected: `566` as the positive control, then `4`, then `0`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed; the file returns to T004's content
  - **Stop if**: the control is not `566` (the pattern is broken), the raw count is not `4`, or the filtered count is not `0`, or a removed line is a surface instruction rather than a platform tag; name the owning phase and stop

- [ ] T006 Assert the planning documents on main, then commit the head sweep as C1 (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` (commit only)
  - **Anchor**: n/a - no line is edited
  - **Change**: the six planning documents already landed on `main` in the packet's planning commit before this phase ran. Assert them first, then stage only the first evidence file by name and commit it on branch `deepseekpihigh`:
    ```bash
    git fetch origin main
    for f in spec.md plan.md tasks.md acceptance-criteria.md decision-record.md goal.md; do
      git cat-file -e "origin/main:specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/$f" || { printf 'missing %s\n' "$f"; exit 1; }
    done
    git add specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md
    git commit -m "docs(sk-code): record the head leak sweep" -m "The planning commit already carries this phase's six planning documents on main, so C1 starts the evidence chain with the planning-commit sweep. No code changes." -m "Surface-Verification-Phase: 005"
    ```
  - **Proof**:
    ```bash
    git fetch origin main
    for f in spec.md plan.md tasks.md acceptance-criteria.md decision-record.md goal.md; do
      git cat-file -e "origin/main:specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/$f" && printf '%s present\n' "$f"
    done
    git log -1 --format=%s
    git log -1 --format=%b | grep -c 'Surface-Verification-Phase: 005'
    git show --name-only --format='' HEAD | wc -l
    ```
    Expected: six lines `spec.md present` through `goal.md present`, then `docs(sk-code): record the head leak sweep`, then `1`, then `1`
  - **AC**: AC-001
  - **Rollback**: `git reset --soft HEAD~1` while C1 is the tip and nothing else has been committed on it
  - **Stop if**: any of the six documents is missing from `origin/main`, which means the planning commit has not landed, or `git status --porcelain` lists a file outside this phase folder; unstage it and stop

- [ ] T007 Push C1 to main (none)
  - **File**: none - the command changes the remote
  - **Anchor**: n/a - no file is edited
  - **Change**: `git push origin HEAD:main`
  - **Proof**:
    ```bash
    git fetch origin main && git rev-parse HEAD origin/main
    ```
    Expected: the same sha printed twice
  - **AC**: AC-015
  - **Rollback**: `git revert --no-edit HEAD` then `git push origin HEAD:main`, which restores the remote tree without rewriting history
  - **Stop if**: the push is rejected because the branch moved; run `git fetch origin main`, re-read the new tip and report instead of forcing

- [ ] T008 Clone origin/main into the throwaway path (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 02 - Fresh clone`, the section `## A - Clone`, the fenced command below, its output and the line `Expected: the clone HEAD equals the C1 sha`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    rm -rf "$CLONE"
    git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"
    git -C "$CLONE" rev-parse HEAD
    ```
    Expected: a full 40-character sha and a clone that reports `Cloning into '/tmp/psurf-clone-main'...`
  - **AC**: AC-001
  - **Rollback**: `rm -rf /tmp/psurf-clone-main`
  - **Stop if**: the clone fails or the remote rejects it; record the error and stop

- [ ] T009 Record the clone identity and its clean tree (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Identity` section holding the fenced command below, its output, the C1 sha copied beside it and the line `Expected: equal shas and an empty status`, followed by a blank line and the anchor line again.
  - **Proof**:
    ```bash
    git -C /tmp/psurf-clone-main rev-parse HEAD
    git rev-parse HEAD
    git -C /tmp/psurf-clone-main status --porcelain | wc -l
    ```
    Expected: two identical shas, then `0`
  - **AC**: AC-001
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the shas differ or the status count is not `0`; record both and stop

- [ ] T010 Sweep the clone for leaked paths (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 03 - Fresh-clone leak sweep`, the section `## A - Tracked paths`, the fenced commands below, their output and `Expected: 0 live, 108 retained specs/ paths`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    git -C "$CLONE" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
    git -C "$CLONE" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
    git -C "$CLONE" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
    ```
    Expected: `336` as the positive control, then `0` live, then `108` retained `specs/` paths
  - **AC**: AC-001
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`
  - **Stop if**: the control is not `336` (the pattern is broken), the live count is not `0`, or the retained count is not `108`

- [ ] T011 Sweep the clone for leaked content (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Tracked content` section holding the positive control, the fenced path-list command below, its full output and `Expected: the control prints 1528, then exactly 8 paths`, followed by a blank line and the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    EX=':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*'
    git -C "$CLONE" grep -c -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" 42b41dd286 -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | awk -F: '{s+=$NF} END {print s}'
    git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l
    ```
    Expected: `1528`, then `8`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the control is not `1528`, or the path count is not `8`; record the extra paths and name the owning phase

- [ ] T012 Classify the content hits as retained or active (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Retained versus active` section holding the two fenced commands below, their outputs, the eight retained paths listed by name, and the line `Expected: 8 retained, 0 active`. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    ALLOW='^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/'
    git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -c -E "$ALLOW" || echo 0
    git -C "$CLONE" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E "$ALLOW" | wc -l
    ```
    Expected: `8`, then `0`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the active count is not `0`; record each path and name the owning phase

- [ ] T013 Sweep the clone for bare surface tokens (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## D - Bare surface tokens` section holding the positive control, the two fenced commands below, their outputs, every line the filter removed quoted, and the line `Expected: 566 at 583316d083 as the control, then 4 raw, then 0 after the filter`. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    git -C "$CLONE" grep -c -E 'WEBFLOW|OBSIDIAN' 583316d083 -- .skilled/skills/sk-code .hermes/skills/sk-code ':!**/changelog/**' ':!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
    rg -c 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | awk -F: '{s+=$NF} END {print s}'
    rg -n 'WEBFLOW|OBSIDIAN' "$CLONE/.skilled/skills/sk-code" "$CLONE/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
    ```
    Expected: `566` as the positive control, then `4`, then `0`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the control is not `566` (the pattern is broken), the raw count is not `4`, or the filtered count is not `0`; quote the surviving lines and name the owning phase

- [ ] T014 Classify the private blob identities against the removal commit and the public object database (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## E - Blob identity` section holding the fenced commands below, their seven outputs and the line `Expected: 228 files, 223 base ids, at least 1 already public in history, 3 copied references, at least 1 new or changed, at least 1 from the control, 0 reachable from the clone`. Record the already-public count and the new-or-changed count in the section, because the first is the input to the history-rewrite decision and the second is the population the zero check covers. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    OP=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

    # (a) the private population: file count, then unique non-empty blob ids
    find "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -print | wc -l
    find "$OP/.skilled/skills/local-webflow" "$OP/.skilled/skills/local-obsidian" -type f -size +0c -print0 \
      | xargs -0 git hash-object --no-filters | sort -u > /tmp/psurf-private-blob-ids.txt

    # (b) the base set: the two archived packets at the removal commit
    git -C "$CLONE" ls-tree -r 42b41dd286 -- \
      .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian \
      | awk '{print $3}' | sort -u > /tmp/psurf-base-blob-ids.txt
    wc -l < /tmp/psurf-base-blob-ids.txt

    # (c) already public in history: the private ids the base set already carries
    comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt > /tmp/psurf-history-exposure-blob-ids.txt
    wc -l < /tmp/psurf-history-exposure-blob-ids.txt

    # (d) the three hub references copied into both roots at the removal commit, recorded and set aside
    git -C "$CLONE" ls-tree 42b41dd286 -- \
      .skilled/skills/sk-code/shared/references/workflow-implement.md \
      .skilled/skills/sk-code/shared/references/workflow-debug.md \
      .skilled/skills/sk-code/shared/references/workflow-verify.md \
      | awk '{print $3}' | sort -u > /tmp/psurf-copied-reference-blob-ids.txt
    comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-copied-reference-blob-ids.txt | wc -l

    # (e) new or changed content: private ids in neither the base set nor the copied references
    comm -23 /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt \
      | comm -23 - /tmp/psurf-copied-reference-blob-ids.txt > /tmp/psurf-new-blob-ids.txt
    wc -l < /tmp/psurf-new-blob-ids.txt

    # (f) the public object database, the control that proves the dump is live, then the assertion
    git -C "$CLONE" cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' \
      | awk '$2=="blob"{print $1}' | sort -u > /tmp/psurf-public-blob-ids.txt
    comm -12 /tmp/psurf-private-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l
    comm -12 /tmp/psurf-new-blob-ids.txt /tmp/psurf-public-blob-ids.txt | wc -l
    ```
    Expected: `228` files, `223` base ids, at least `1` already public in history, `3` copied references, at least `1` new or changed, at least `1` from the control, then `0` from the assertion
  - **AC**: AC-002
  - **Rollback**: `rm -f /tmp/psurf-private-blob-ids.txt /tmp/psurf-base-blob-ids.txt /tmp/psurf-history-exposure-blob-ids.txt /tmp/psurf-copied-reference-blob-ids.txt /tmp/psurf-new-blob-ids.txt /tmp/psurf-public-blob-ids.txt`
  - **Stop if**: the file count is not `228` (the trees are incomplete or the folder mode changed), the base set is not `223`, the already-public count is `0` (the comparison is broken), the copied-reference count is not `3`, the new-or-changed count is `0` (nothing is left to test), the control is `0` (the object dump is empty), or the assertion is not `0`; record every value and name the file behind any unmatched id

- [ ] T015 State the partial-content policy (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## F - Partial-content policy` section of six sentences, one per line: the identity check covers complete files only; a zero-byte file is excluded because its blob is the reachable empty blob by definition; a fragment of a private file is covered by the marker and token sweeps, not by identity; the bytes the two restored trees inherit from `42b41dd286` were public before the removal, so they are recorded as already public in history and their count is the input to the history-rewrite decision rather than a failure; the three hub references copied from `shared/references/` at that commit are recorded the same way; the zero assertion covers new or changed content only, and neither check claims the other's ground. End with the anchor line again.
  - **Proof**:
    ```bash
    grep -c -E 'zero-byte|fragment|complete files only|already public in history|copied from `shared/references/`|new or changed content' specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md
    ```
    Expected: at least `6`
  - **AC**: AC-002
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the section cannot be written without weakening a claim another section makes

- [ ] T016 Audit the ten D6 kept-record prefixes (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 04 - D6 kept records`, the full ten-prefix command below, its output, the control command and its output, and the line `Expected: 0 from the audit and at least 1 from the control path`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    git -C "$CLONE" diff --stat 42b41dd286 HEAD -- .skilled/skills/mcp-tooling .skilled/skills/sk-design .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample .skilled/changelog | wc -l
    git -C "$CLONE" diff --stat 42b41dd286 HEAD -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md | wc -l
    ```
    Expected: `0`, then at least `1`
  - **AC**: AC-006
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md`
  - **Stop if**: the audit prints a path; record it, name the phase that changed it and stop. This phase never repairs a D6 record

- [ ] T017 Build a throwaway advisor database from the clone (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 05 - Advisor database`, the section `## A - Rebuild`, the fenced command below, its full JSON output and the line `Expected: skillCount of 14 or greater and no EMPTY-SKILL-SCAN warning`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    DBDIR=/tmp/psurf-db
    rm -rf "$DBDIR" && mkdir -p "$DBDIR"
    SYSTEM_SKILL_ADVISOR_DB_DIR="$DBDIR" node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true,"workspaceRoot":"/tmp/psurf-clone-main"}' --format json | jq -r '.data.skillCount'
    ```
    Expected: `14`
  - **AC**: AC-004
  - **Rollback**: `rm -rf /tmp/psurf-db`
  - **Stop if**: `skillCount` is `0`, or the warnings contain `EMPTY-SKILL-SCAN`; the rebuild preserved an old graph and proves nothing

- [ ] T018 Query the throwaway database for sk-code surface nodes (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Query` section holding the fenced command below, their outputs and the line `Expected: 1 as the positive control, then 0; the same surface query prints 1 at 583316d083`. End with the anchor line again.
  - **Proof**:
    ```bash
    sqlite3 -readonly /tmp/psurf-db/skill-graph.sqlite "SELECT count(*) FROM skill_nodes WHERE family = 'sk-code'"
    sqlite3 -readonly /tmp/psurf-db/skill-graph.sqlite "SELECT count(*) FROM skill_nodes WHERE (id LIKE 'sk-code%' OR family = 'sk-code') AND (lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%webflow%' OR lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%obsidian%')"
    ```
    Expected: `1` as the positive control, then `0`
  - **AC**: AC-004
  - **Rollback**: `rm -rf /tmp/psurf-db`
  - **Stop if**: the count is not `0`; quote the returned rows and name phase 003 as the owner

- [ ] T019 Poll for the trigger-index rebuild run (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 06 - Retrieval artifacts`, the section `## A - Rebuild run`, the fenced command below, its output and the line `Expected: a completed run whose displayTitle is chore(system-spec-kit): rebuild the trigger index and whose headSha is the C1 sha`. Poll for at most 30 minutes. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    gh run list --branch main --limit 5 --json status,conclusion,headSha,displayTitle
    ```
    Expected: at least one entry with `"status":"completed"`, `"conclusion":"success"` and `"displayTitle":"chore(system-spec-kit): rebuild the trigger index"`
  - **AC**: AC-003
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md`
  - **Stop if**: 30 minutes pass without a completed rebuild run; record the last output and leave AC-003 `Unmet`

- [ ] T020 Pull the rebuild commit into the clone (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Rebuild commit` section holding the fenced commands below, the three-line log and the line `Expected: the rebuild commit sits above the C1 commit`, plus one sentence stating that this pull advances the verification clone only and that T057 integrates the same commit into the writer branch. End with the anchor line again.
  - **Proof**:
    ```bash
    git -C /tmp/psurf-clone-main pull --ff-only
    git -C /tmp/psurf-clone-main log --oneline -3
    ```
    Expected: a fast-forward pull, then a first log line beginning `chore(system-spec-kit): rebuild the trigger index`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the pull is not a fast-forward, or the rebuild commit is absent from the log

- [ ] T021 Count live routing paths in the rebuilt trigger index (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Live routing paths` section holding the positive control, the scoped command below, its output and `Expected: 200 from the control, then 0`. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    git -C "$CLONE" show 42b41dd286:.skilled/skills/system-spec-kit/runtime/data/trigger-index.json | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
    grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
    ```
    Expected: `200`, then `0`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the control is not `200`, or the scoped count is not `0`; quote the surviving paths and name the owning phase

- [ ] T022 Count the allowlisted 007 paths in the rebuilt index (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## D - Allowlisted audit paths` section holding the two fenced commands below, their outputs, the one-sentence reason (`specs` is a corpus root at `corpus.mjs:31` and the 007 folder name carries the token) and `Expected: 69 allowlisted, then 0 unclassified`. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l
    grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l
    ```
    Expected: `69`, then `0`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the allowlist count is not `69`; record the new count, leave AC-003 `Unmet` and report instead of editing the expectation

- [ ] T023 Count the phrase keys in the rebuilt index (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## E - Phrase keys` section holding the two fenced commands below, their outputs, the one-sentence reason (38 keys come from the 007 packet and `004-private-local-skills/spec.md`; 11 came from the deleted surface folders, or 21 under the broad pattern that also counts `sk code webflow`) and `Expected: 38 retained keys, then 0 bare skill ids`. End with the anchor line again.
  - **Proof**:
    ```bash
    CLONE=/tmp/psurf-clone-main
    IDX="$CLONE/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    grep -c -E '"(sk code obsidian|local webflow)[ "]' "$IDX" || echo 0
    grep -c -E '^ *"(local webflow|local obsidian|sk code webflow|sk code obsidian)": \[' "$IDX" || echo 0
    ```
    Expected: `38`, then `0`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the retained count is not `38`, or the bare-key count is not `0`

- [ ] T024 Count the corpus manifest hits (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## F - corpus-manifest.json` section holding the fenced command below, its output and `Expected: 69 0` (69 included paths, all under the 007 prefix, and 0 skipped paths). End with the anchor line again.
  - **Proof**:
    ```bash
    node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' /tmp/psurf-clone-main/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
    ```
    Expected: `69 0`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the output is not `69 0`; record it and leave AC-003 `Unmet`

- [ ] T025 Count the generation diagnostics hits (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## G - generation-diagnostics.json` section holding the positive control, the fenced command below, its output and `Expected: 60 at 583316d083 as the control, then 0`. End with the anchor line again.
  - **Proof**:
    ```bash
    FIX=/tmp/psurf-clone-main/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures
    git -C /tmp/psurf-clone-main show 583316d083:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
    grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0
    ```
    Expected: `60`, then `0`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the control is not `60`, or the second count is not `0`

- [ ] T026 Count the phrase-variant hits (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## H - phrase-variants.json` section holding the positive control, the fenced command below, its output and `Expected: 59 at 583316d083 as the control, then 38`. End with the anchor line again.
  - **Proof**:
    ```bash
    FIX=/tmp/psurf-clone-main/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures
    git -C /tmp/psurf-clone-main show 583316d083:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' || echo 0
    grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0
    ```
    Expected: `59`, then `38`
  - **AC**: AC-003
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the control is not `59`, or the second count is not `38`

- [ ] T027 Rebuild the operator advisor graph (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 07 - Routing probes`, the section `## A - Operator rebuild`, the fenced command below, its output and `Expected: skillCount of 14 or greater`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json | jq -r '.data.skillCount'
    ```
    Expected: `16` or greater, because both private skills add one node each to the 14 tracked nodes
  - **AC**: AC-005
  - **Rollback**: `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json` in the same checkout
  - **Stop if**: `skillCount` is below `14`, which means the rebuild did not scan the checkout

- [ ] T028 Query the operator graph for local skill ids (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Local nodes` section holding the fenced command below, its output and `Expected: local-obsidian and local-webflow, one per line`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"
    ```
    Expected: `local-obsidian`, then `local-webflow`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: either id is missing; the private skills are not visible to the scan and AC-005 cannot pass

- [ ] T029 Probe the Webflow prompt in the operator checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Webflow prompt` section holding the fenced command below, its output and `Expected: local-webflow`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `local-webflow`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `local-webflow`; record the full `data.recommendations` array and name phase 004 as the owner

- [ ] T030 Probe the Obsidian prompt in the operator checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## D - Obsidian prompt` section holding the fenced command below, its output and `Expected: local-obsidian`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `local-obsidian`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `local-obsidian`; record the array and name phase 004 as the owner

- [ ] T031 Probe the generic frontend prompt in the operator checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## E - Generic frontend prompt` section holding the fenced command below, its output and `Expected: sk-code`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `sk-code`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `sk-code`; record the array and name phase 003 as the owner

- [ ] T032 Record the operator's folder mode (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## F - Folder mode` section holding the fenced command below, its two output lines and one sentence naming the mode as `real folder` or `symlink`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    ls -ld .skilled/skills/local-webflow .skilled/skills/local-obsidian
    ```
    Expected: two lines, each starting with `d` for a real folder or `l` for a symlink
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: either path is missing; the probes in sections C through E then have nothing to route to

- [ ] T033 Locate the Obsidian Plugin checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## G - Plugin checkout` section holding the fenced command below, its output and the line `Expected: /Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`. End with the anchor line again.
  - **Proof**:
    ```bash
    find /Users/michelkerkmeester/MEGA/Development -maxdepth 2 -type d -iname '*obsidian*' -not -path '*/.git/*' 2>/dev/null | grep -v '/Code_Environment/'
    ls "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/manifest.json"
    ```
    Expected: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`, then the manifest path echoed
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the path is absent or holds no `manifest.json`; record the search output, leave AC-005 partly `Unmet` and stop before T034

- [ ] T034 Record the plugin checkout's runtime symlink targets (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## H - Symlink targets` section holding the fenced command below, its eight output lines and `Expected: all eight targets resolve under /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
    for l in .claude .codex .cursor .devin .hermes .opencode .pi .skilled; do printf '%s -> %s\n' "$l" "$(readlink "$l")"; done
    ```
    Expected: eight lines, each ending in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/<name>`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: a target resolves outside the hub path; record it and stop, because the three plugin probes would then say nothing about this packet

- [ ] T035 Probe the Webflow prompt from the plugin checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## I - Plugin Webflow prompt` section holding the fenced command below, its output and `Expected: local-webflow`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `local-webflow`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `local-webflow`; record the array and name phase 004 as the owner

- [ ] T036 Probe the Obsidian prompt from the plugin checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## J - Plugin Obsidian prompt` section holding the fenced command below, its output and `Expected: local-obsidian`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `local-obsidian`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `local-obsidian`; record the array and name phase 004 as the owner

- [ ] T037 Probe the generic frontend prompt from the plugin checkout (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## K - Plugin generic frontend prompt` section holding the fenced command below, its output and `Expected: sk-code`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
    node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
    ```
    Expected: `sk-code`
  - **AC**: AC-005
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the top result is not `sk-code`; record the array and name phase 003 as the owner

- [ ] T038 Prove the private skills are invisible to git (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 08 - Local invisibility`, the section `## A - Status`, the fenced command below, their outputs and `Expected: 2 ignored entries as the positive control, then 0`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    git status --porcelain --ignored | grep -c -E "local-(webflow|obsidian)"
    git status --porcelain | grep -c -E "local-(webflow|obsidian)" || echo 0
    ```
    Expected: `2` ignored entries as the positive control, then `0`
  - **AC**: AC-009
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md`
  - **Stop if**: a `local-*` path is listed; the ignore rules are missing or the tree is staged

- [ ] T039 Prove both ignore rules match (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Ignore rules` section holding the fenced command below, its two output lines and `Expected: 2, naming /.skilled/skills/local-* and /.hermes/skills/local-* from the root .gitignore`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian | wc -l
    ```
    Expected: `2`
  - **AC**: AC-009
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the count is not `2`; the phase 001 rules are missing and AC-009 cannot pass

- [ ] T040 Record CI on main (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 09 - CI on main`, the fenced command below, its output, the head sha of each run, and a `Limits` paragraph stating that the file covers every run on `main` up to the push that carries it, that the runs of that push are reported in the phase handoff message with run ids and head sha, and that `git commit --no-verify` bypasses the pre-commit guard so this record is not a guard. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    gh run list --branch main --limit 10 --json status,conclusion,headSha | jq -r '.[] | "\(.status)/\(.conclusion)"' | sort | uniq -c
    gh run list --branch main --limit 10 --json status,conclusion | jq -r '.[] | select(.conclusion=="success")' | wc -l
    gh run list --branch main --limit 10 --json status,conclusion | jq -r '.[] | select(.conclusion=="failure" or .conclusion=="cancelled" or .conclusion=="timed_out")' | wc -l
    ```
    Expected: lines for `completed/success` and `completed/skipped` only, then at least `1`, then `0`
  - **AC**: AC-007
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md`
  - **Stop if**: a failing, cancelled or timed-out run appears; record it and leave AC-007 `Unmet`

- [ ] T041 Inventory the reachable objects with old paths (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 12 - History inventory`, the section `## A - Reachable objects`, the fenced command below, its output and the line `Expected: 1814 at the measured tip; a different count is recorded, not corrected`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    git -C /tmp/psurf-clone-main rev-list --objects --all | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
    ```
    Expected: `1814` or a recorded different count
  - **AC**: AC-013
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md`
  - **Stop if**: the command fails; the inventory cannot be taken and AC-013 stays `Unmet`

- [ ] T042 Map every tag to the old paths it retains (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Tags` section holding the fenced commands below, the tag count, the number of tags with a non-zero count and every such tag listed with its count. End with the anchor line again.
  - **Proof**:
    ```bash
    git -C /tmp/psurf-clone-main tag --list | wc -l
    for t in $(git -C /tmp/psurf-clone-main tag --list); do printf '%s %s\n' "$t" "$(git -C /tmp/psurf-clone-main ls-tree -r --name-only "$t" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)')"; done > /tmp/psurf-tag-old-paths.txt
    awk '$2>0' /tmp/psurf-tag-old-paths.txt | wc -l
    ```
    Expected: `164` at the measured tip or a recorded different count, then a count of at least `1`
  - **AC**: AC-013
  - **Rollback**: `rm -f /tmp/psurf-tag-old-paths.txt`
  - **Stop if**: the tag count is `0`, which means the clone carries no tags and the inventory would be vacuous

- [ ] T043 Inventory the hosted releases and their assets (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Releases` section holding the two fenced commands below, the release list, one asset line per release, and the sentence that no asset archive was opened, so its contents stay `UNKNOWN`. End with the anchor line again.
  - **Proof**:
    ```bash
    gh release list --limit 30
    for t in $(gh release list --limit 30 --json tagName --jq '.[].tagName'); do gh release view "$t" --json tagName,assets; done
    ```
    Expected: the release list, then one JSON object per release naming its assets
  - **AC**: AC-013
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: `gh` reports the repository has no releases; record that answer rather than treating it as a failure

- [ ] T044 Run the skill-root metadata drift check (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 13 - Drift scripts`, the section `## A - Root metadata`, the fenced command below, its output and `Expected: exit 0; a non-zero exit is recorded as a finding`. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills; echo "exit=$?"
    ```
    Expected: the script's own output, then `exit=0` or a non-zero code recorded as-is
  - **AC**: AC-014
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md`
  - **Stop if**: the script is missing; record the path and leave AC-014 `Unmet`

- [ ] T045 Run the leaf-manifest drift check (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Leaf manifest` section holding the fenced command below, its output and `Expected: exit 0; a non-zero exit is recorded as a finding`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
    ```
    Expected: the script's own output, then `exit=0` or a non-zero code recorded as-is
  - **AC**: AC-014
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the script is missing; record the path and leave AC-014 `Unmet`

- [ ] T046 Run the derived-freshness drift check (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Derived freshness` section holding the fenced command below, its output and `Expected: exit 0; a non-zero exit is recorded as a finding`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --skills-dir .skilled/skills; echo "exit=$?"
    ```
    Expected: the script's own output, then `exit=0` or a non-zero code recorded as-is
  - **AC**: AC-014
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: the script is missing; record the path and leave AC-014 `Unmet`

- [ ] T047 Export the skill graph and count local ids (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## D - Exported graph` section holding the two fenced commands below, the compiler's exit code, the `local-` id count and the line `Expected: the export writes /tmp/psurf-skill-graph.json and the count is recorded as-is`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json --output /tmp/psurf-skill-graph.json; echo "exit=$?"
    grep -c '"local-' /tmp/psurf-skill-graph.json || echo 0
    ```
    Expected: the compiler's own output, then `exit=0` or a recorded non-zero code, then a `local-` id count
  - **AC**: AC-014
  - **Rollback**: `rm -f /tmp/psurf-skill-graph.json`
  - **Stop if**: the export writes to a path other than `/tmp/psurf-skill-graph.json`; stop before it can touch the tracked `runtime/scripts/skill-graph.json`

- [ ] T048 Build the temporary probe repository (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 14 - Corpus boundary`, the section `## A - Probe repository`, the fenced commands below, their output and `Expected: !! .skilled/skills/local-probe/`. End with `<!-- evidence:end -->`.
  - **Proof**:
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
    ```
    Expected: `!! .skilled/skills/local-probe/`
  - **AC**: AC-012
  - **Rollback**: `rm -rf /tmp/psurf-corpus-probe`
  - **Stop if**: the status line is not `!!`; the ignore rule does not cover the probe skill and the probe proves nothing

- [ ] T049 Generate the four artifacts from the probe repository (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Generation` section holding the fenced command below, its exit code, the four filenames it wrote and `Expected: exit 0 and four files under /tmp/psurf-corpus-probe/out/`. End with the anchor line again.
  - **Proof**:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/215-private-surface-level3-plans
    node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root /tmp/psurf-corpus-probe --out /tmp/psurf-corpus-probe/out/trigger-index.json --quiet; echo "exit=$?"
    ls /tmp/psurf-corpus-probe/out/
    ```
    Expected: `exit=0`, then `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` and `trigger-index.json`
  - **AC**: AC-012
  - **Rollback**: `rm -rf /tmp/psurf-corpus-probe/out`
  - **Stop if**: the generator exits non-zero; record the error and leave AC-012 `Unmet`

- [ ] T050 Assert the marker is absent and the control is present (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Assertion` section holding the three fenced commands below, their eight output lines and `Expected: the control at least 1 in phrase-variants.json and trigger-index.json, the marker 0 in all four, the probe path 0`. End with the anchor line again.
  - **Proof**:
    ```bash
    P=/tmp/psurf-corpus-probe
    grep -ric -e 'psurf-control-marker-7f3c1a' -e 'psurf control marker 7f3c1a' "$P/out" | sort
    grep -ric -e 'psurf-corpus-probe-marker-7f3c1a' -e 'psurf corpus probe marker 7f3c1a' "$P/out" | sort
    grep -c 'skills/local-probe' "$P/out/trigger-index.json" || echo 0
    ```
    Expected: a control count of at least `1` in two artifacts, `0` for the marker in all four, then `0`
  - **AC**: AC-012
  - **Rollback**: `rm -rf /tmp/psurf-corpus-probe`
  - **Stop if**: the control count is `0` in every artifact, because then the walker indexed nothing and the marker's zero means nothing

- [ ] T051 Record the reviewer's verdict per criterion (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 10 - Review`, a `## A - Verdicts` section, the exact table header `| AC-ID | Verdict | Observed |` followed by its divider row `|-------|---------|----------|`, then one row per criterion from AC-001 through AC-015, each carrying `Met` or `Unmet` and the output the reviewer saw. Dispatch a separate read-only DeepSeek reviewer session on branch `deepseekpi` with the packet path and the instruction to re-run each criterion's command. At most 2 rounds. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    grep -c "^| AC-[0-9]" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md
    ```
    Expected: `15`
  - **AC**: AC-011
  - **Rollback**: `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md`
  - **Stop if**: the reviewer returns a third round, or a verdict cannot name the output it saw

- [ ] T052 Answer the reviewer's findings (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## B - Findings` section holding the exact table header `| Finding | Severity | AC-ID | Finding text | Resolution | Round |` followed by its divider row `|---------|----------|-------|--------------|------------|-------|`, then one row per finding. For each finding, either re-run the command and correct the quoted output and the criterion status, or record why the finding does not hold. Append the round number to each row. End with the anchor line again.
  - **Proof**:
    ```bash
    grep -c "^| F-[0-9]" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md
    awk -F'|' '$2 ~ /F-[0-9]/ {gsub(/ /,"",$6); if ($6=="") e++} END {print e+0}' specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md
    ```
    Expected: the finding count the reviewer raised, then `0` rows with an empty Resolution cell
  - **AC**: AC-011
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: a finding concerns a file outside this folder; record it, name the owning phase and do not repair it here

- [ ] T053 Transcribe the evidence into the implementation summary (implementation-summary.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md` (modify)
  - **Anchor**: the seven placeholder lines the file carries now: `[Opening hook: 2-3 sentences on what changed and why it matters. Lead with impact.]`, `[What this feature does and why it exists. 1-2 paragraphs. Use direct address.`, `| [path] | [Created/Modified/Deleted] | [What this change accomplishes] |`, `[How was this tested, verified and shipped? What was the rollout approach?]`, `| [What was decided] | [Active-voice rationale with specific reasoning] |`, `| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |` and `1. **[Limitation]** [Specific detail with workaround if one exists.]`
  - **Change**: replace each placeholder. The hook names the verdict and the commit. The phase paragraph states what the evidence proves. Files Changed gets one row per evidence file with `Created` and its purpose. How It Was Delivered names the three commits and the two CI waits. Key Decisions gets one row per ADR. Verification gets one row per check citing its `scratch/evidence/NN-*.md` path and the observed value. Known Limitations states four limits: removed content stays in git history (D7), `git commit --no-verify` bypasses the pre-commit guard so the fresh-clone sweep carries the proof, an evidence push's own CI runs are reported in the phase handoff message rather than committed, and no pre-push surface-token guard exists so this sweep is a one-time gate. Keep every heading and anchor.
  - **Proof**:
    ```bash
    grep -c "scratch/evidence/" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md
    for t in 'no-verify' 'D7' 'handoff' 'pre-push'; do printf '%s %s\n' "$t" "$(grep -c "$t" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md)"; done
    ```
    Expected: at least `15`, then four counts of at least `1`
  - **AC**: AC-010
  - **Rollback**: `git checkout -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md`
  - **Stop if**: a placeholder remains, or a limit is stated as a claim the evidence contradicts

- [ ] T054 Mark the criteria from the evidence (acceptance-criteria.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md` (modify)
  - **Anchor**: the row beginning `| AC-001 | REQ-001 |` through the row beginning `| AC-015 | REQ-015 |`, the line `**Status:** Draft`, and the line `**Closeable:** No`
  - **Change**: set each AC row's Status cell to `Met` with the observed value quoted in its Evidence cell, or leave it `Unmet` and name the blocking command. Replace the closure statement paragraph with which criteria carried the packet and which checks are left blocked and why. Change `**Closeable:** No` to `**Closeable:** Yes` and `**Status:** Draft` to `**Status:** Complete` only when every row is `Met`.
  - **Proof**:
    ```bash
    grep -c "| Unmet |" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md || echo 0
    grep -c "^| AC-[0-9].*| Met |" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md
    ```
    Expected: `0` unmet rows, then `15` met rows
  - **AC**: AC-008
  - **Rollback**: `git checkout -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md`
  - **Stop if**: any row is `Unmet`; leave `Closeable: No` and report blocked

- [ ] T055 Reconcile the completion status across three documents (spec.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md` (modify)
  - **Anchor**: the metadata row `| **Status** | Draft |`
  - **Change**: change the cell to `| **Status** | Complete |`, and add the row `| **Status** | Complete |` to the metadata table in `implementation-summary.md`. If any AC row is `Unmet`, change nothing here and report blocked instead.
  - **Proof**:
    ```bash
    grep -c "| \*\*Status\*\* | Complete |" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md
    grep -c "^\*\*Status:\*\* Complete" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md
    ```
    Expected: `1` for each of the two files, then `1`
  - **AC**: AC-008
  - **Rollback**: `git checkout -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md`
  - **Stop if**: the three documents would disagree about the status

- [ ] T056 Run the packet validator (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md`, `acceptance-criteria.md`, `implementation-summary.md` and `tasks.md` (modify only what the validator names)
  - **Anchor**: read the validator output line by line; each failing rule names its file
  - **Change**: run the command below and fix only what it names, keeping every template heading, anchor comment and frontmatter key. Re-run until it passes.
  - **Proof**:
    ```bash
    bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict
    ```
    Expected: `RESULT: PASSED`. An exit status of `0` and the absence of `FAILED` are not a substitute
  - **AC**: AC-008
  - **Rollback**: `git checkout -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification`
  - **Stop if**: the validator names a file outside this folder; record the rule and stop

- [ ] T057 Commit the evidence and the closed packet as C2 (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: the fifteen evidence files, `implementation-summary.md`, `acceptance-criteria.md`, `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` and `goal.md` under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/` (commit only)
  - **Anchor**: n/a - no line is edited
  - **Change**: bring `deepseekpihigh` level with `origin/main` first, because C1's push started the trigger-index rebuild that commits to `main` and the branch has not integrated it, then tick the boxes for T001 through T059, then stage by name and commit on `deepseekpihigh`:
    ```bash
    git fetch origin main
    git merge --ff-only origin/main
    git add specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/plan.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/decision-record.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/goal.md
    git commit -m "docs(sk-code): verify the private surface removal" -m "Fifteen evidence files record the fresh-clone sweeps, the blob comparison, the four regenerated retrieval artifacts, six routing probes, the history inventory, the drift scripts and the corpus-boundary probe. No code changes." -m "Surface-Verification-Phase: 005"
    ```

    If the merge refuses because `main` carries more than the rebuild commit, run `git rebase origin/main` in its place and then stage and commit unchanged.
  - **Proof**:
    ```bash
    git log --oneline -3
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    git show --stat --oneline HEAD | tail -20
    git log -1 --format=%b | grep -c 'Surface-Verification-Phase: 005'
    ```
    Expected: a three-line log whose first line is C2 and whose second is the `chore(system-spec-kit): rebuild the trigger index` commit, then `ff-ready` (C2 sits on `origin/main`, so C2's push is a fast-forward), then a stat listing only paths under this phase folder, then `1`
  - **AC**: AC-015
  - **Rollback**: `git reset --soft HEAD~1` while C2 is the tip; the fast-forward merge changed no local commit and is not rolled back
  - **Stop if**: both the fast-forward merge and its `git rebase origin/main` fallback refuse (a conflict), `origin/main` is not an ancestor of HEAD after the commit, or the stat lists a path outside this phase folder; record the output, unstage nothing and stop

- [ ] T058 Push C2 to main (none)
  - **File**: none - the command changes the remote
  - **Anchor**: n/a - no file is edited
  - **Change**: confirm the branch is still ahead of `origin/main` only by C2, then push:
    ```bash
    git fetch origin main
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    git push origin HEAD:main
    ```
  - **Proof**:
    ```bash
    git fetch origin main && git rev-parse HEAD origin/main
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    ```
    Expected: the same sha printed twice, then `ff-ready`
  - **AC**: AC-015
  - **Rollback**: `git revert --no-edit HEAD` then `git push origin HEAD:main`
  - **Stop if**: the `ff-ready` line is missing before the push, or the push is rejected because `origin/main` moved after T057's fast-forward; run `git fetch origin main`, `git rebase origin/main`, re-run T057's proof and push again, and never use `--force`

- [ ] T059 Confirm the tree is clean and HEAD equals origin/main (none)
  - **File**: none - the command reads git state, and C2 carries the boxes for T057 through T059 while the next evidence file does not exist yet, so the working tree is clean here
  - **Anchor**: n/a - no file is edited
  - **Change**: run the two commands below and report their output
  - **Proof**:
    ```bash
    git status --porcelain | wc -l
    git fetch origin main && git rev-parse HEAD origin/main
    ```
    Expected: `0`, then the same sha printed twice
  - **AC**: AC-015
  - **Rollback**: n/a: the command changes nothing
  - **Stop if**: the status is not empty or the shas differ; commit or push what is outstanding before continuing

- [ ] T060 Re-clone the final tip after the C2 rebuild (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` (new file)
  - **Anchor**: `new file`
  - **Change**: write a heading `# 11 - Final tip`, the section `## A - Final-tip clone`, the fenced commands below, the clone sha, the three-line log and `Expected: the rebuild commit above C2`. Poll for at most 30 minutes. End with `<!-- evidence:end -->`.
  - **Proof**:
    ```bash
    FINAL=/tmp/psurf-final-tip
    rm -rf "$FINAL"
    git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$FINAL"
    git -C "$FINAL" log --oneline -3
    ```
    Expected: a first log line beginning `chore(system-spec-kit): rebuild the trigger index`, with the C2 commit below it
  - **AC**: AC-015
  - **Rollback**: `rm -rf /tmp/psurf-final-tip` and `rm specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md`
  - **Stop if**: 30 minutes pass without a rebuild commit above C2; record the log and leave AC-015 `Unmet`

- [ ] T061 Rerun the path and content sweeps on the final tip (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## C - Paths and content` section holding the positive control, the fenced commands below, their output and `Expected: 336 at 42b41dd286 as the control, 0 live, 108 retained specs/ paths, 8 D6-kept content paths, 0 active`. End with the anchor line again.
  - **Proof**:
    ```bash
    FINAL=/tmp/psurf-final-tip
    ALLOW='^\.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/|^\.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/'
    git -C "$FINAL" ls-tree -r --name-only 42b41dd286 | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"
    git -C "$FINAL" ls-files -- ':!specs/**' | grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" || echo 0
    git -C "$FINAL" ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" | grep -c -E '^specs/' || echo 0
    git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -c -E "$ALLOW" || echo 0
    git -C "$FINAL" grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | grep -v -E "$ALLOW" | wc -l
    ```
    Expected: `336` as the positive control, then `0` live, then `108` retained, then `8` D6-kept, then `0` active
  - **AC**: AC-015
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: any of the five values differs from Expected

- [ ] T062 Rerun the token and blob checks on the final tip (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## D - Tokens and blobs` section holding the fenced commands below, their output and `Expected: 0 tokens, at least 1 from the control, then 0 new or changed blobs`. End with the anchor line again.
  - **Proof**:
    ```bash
    FINAL=/tmp/psurf-final-tip
    rg -n 'WEBFLOW|OBSIDIAN' "$FINAL/.skilled/skills/sk-code" "$FINAL/.hermes/skills/sk-code" --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l
    git -C "$FINAL" cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' | awk '$2=="blob"{print $1}' | sort -u > /tmp/psurf-final-blob-ids.txt
    comm -12 /tmp/psurf-history-exposure-blob-ids.txt /tmp/psurf-final-blob-ids.txt | wc -l
    comm -12 /tmp/psurf-new-blob-ids.txt /tmp/psurf-final-blob-ids.txt | wc -l
    ```
    Expected: `0` tokens, at least `1` from the control (the ids T014 recorded as already public are still reachable at the final tip), then `0` new or changed
  - **AC**: AC-015
  - **Rollback**: `rm -f /tmp/psurf-final-blob-ids.txt`
  - **Stop if**: the token count is not `0`, the control is `0` (the final tip's object dump is empty), or the new-or-changed count is not `0`

- [ ] T063 Rerun the artifact counts on the final tip (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` (modify)
  - **Anchor**: `<!-- evidence:end -->`
  - **Change**: replace the anchor line with a `## E - Artifacts` section holding the fenced commands below, their output and `Expected: 0 live index paths, 69 allowlisted, 0 unclassified, 69 and 0 from the manifest, 0 diagnostics, 38 variants`. End with the anchor line again.
  - **Proof**:
    ```bash
    FINAL=/tmp/psurf-final-tip
    IDX="$FINAL/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    FIX="$FINAL/.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures"
    grep -E '^ *"\.skilled/' "$IDX" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' || echo 0
    grep -E '^ *"specs/sk-code/007-sk-code-obsidian-surface/' "$IDX" | wc -l
    grep -E '^ *"' "$IDX" | grep -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' | grep -v -E '^ *"\.skilled/|^ *"specs/sk-code/007-sk-code-obsidian-surface/' | wc -l
    node -e 'const m=require(process.argv[1]);const p=/sk-code-(webflow|obsidian)|local-(webflow|obsidian)/i;console.log(m.includedPaths.filter(x=>p.test(x)).length, m.skippedPaths.filter(x=>p.test(x.path||"")).length)' "$FIX/corpus-manifest.json"
    grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)' "$FIX/generation-diagnostics.json" || echo 0
    grep -c -E '"(sk-code-(obsidian|webflow)|local-(webflow|obsidian))' "$FIX/phrase-variants.json" || echo 0
    ```
    Expected: `0`, `69`, `0`, `69 0`, `0`, `38`
  - **AC**: AC-015
  - **Rollback**: re-run the edit with the section removed
  - **Stop if**: any value differs from Expected; record it and leave AC-015 `Unmet`

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Phase 3 records the checklist verdict, commits it with the final-tip evidence as C3, pushes that commit, confirms the tree C3 leaves behind, and hands off. The tasks in Phase 2 produced the evidence each item asks about; this phase records the verdict against the same files and then closes them.

- [ ] T064 Run the verification checklist against the evidence (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md` (modify)
  - **Anchor**: the line `| P0 Items | 12 | [ ]/12 |` in the Verification Summary
  - **Change**: tick every checkbox this file holds: each task whose proof ran, each CHK item that holds against its evidence file, the three Completion Criteria boxes, and the four boxes for T065 through T068. C3 is the phase's last commit, so it carries the file this task leaves behind, and a box ticked after it would leave `tasks.md` modified and break the clean-tree proof in T067; T065 therefore stages `tasks.md`, and T066 through T068 report their own outcome in the handoff message rather than writing it back here. Replace the three summary rows with the observed counts, keeping the row labels.
  - **Proof**:
    ```bash
    grep -c '^- \[ \]' specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md || echo 0
    ```
    Expected: `0` unticked checkboxes
  - **AC**: AC-008
  - **Rollback**: `git checkout -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md`
  - **Stop if**: a CHK item cannot be ticked from an evidence file, or a task's proof did not run; leave that box unticked and report which one

- [ ] T065 Commit the final-tip verification and the closed checklist as C3 (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` and `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md` (commit only)
  - **Anchor**: n/a - no line is edited
  - **Change**: bring `deepseekpihigh` level with `origin/main` first, because C2's push started the rebuild commit this final tip carries and the branch has not integrated it, then stage both files by name and commit on `deepseekpihigh`:
    ```bash
    git fetch origin main
    git merge --ff-only origin/main
    git add specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md \
      specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md
    git commit -m "docs(sk-code): verify the final tip after the evidence push" -m "Re-clones the public tip that carries the evidence and its trigger-index rebuild, reruns the path, content, token, blob and artifact checks, and closes the checklist. No code changes." -m "Surface-Verification-Phase: 005"
    ```

    If the merge refuses because `main` carries more than the rebuild commit, run `git rebase origin/main` in its place and then stage and commit unchanged.
  - **Proof**:
    ```bash
    git log --oneline -3
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    git log -1 --format=%s
    git show --stat --oneline HEAD | tail -3
    ```
    Expected: a three-line log whose first line is C3 and whose second is the `chore(system-spec-kit): rebuild the trigger index` commit, then `ff-ready`, then `docs(sk-code): verify the final tip after the evidence push`, then a stat naming only `11-final-tip.md` and `tasks.md`
  - **AC**: AC-015
  - **Rollback**: `git reset --soft HEAD~1` while C3 is the tip; the fast-forward merge changed no local commit and is not rolled back
  - **Stop if**: both the fast-forward merge and its `git rebase origin/main` fallback refuse (a conflict), `origin/main` is not an ancestor of HEAD after the commit, or the stat names a file outside this phase folder

- [ ] T066 Push C3 to main (none)
  - **File**: none - the command changes the remote
  - **Anchor**: n/a - no file is edited
  - **Change**: confirm the branch is still ahead of `origin/main` only by C3, then push:
    ```bash
    git fetch origin main
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    git push origin HEAD:main
    ```
  - **Proof**:
    ```bash
    git fetch origin main && git rev-parse HEAD origin/main
    git merge-base --is-ancestor origin/main HEAD && echo ff-ready
    ```
    Expected: the same sha printed twice, then `ff-ready`
  - **AC**: AC-015
  - **Rollback**: `git revert --no-edit HEAD` then `git push origin HEAD:main`
  - **Stop if**: the `ff-ready` line is missing before the push, or the push is rejected because `origin/main` moved after T065's fast-forward; run `git fetch origin main`, `git rebase origin/main`, re-run T065's proof and push again, and never use `--force`

- [ ] T067 Confirm the tree is clean and HEAD equals origin/main after C3 (none)
  - **File**: none - the command reads git state, and C3 carries every checkbox this file holds, so no tick can dirty the tree after it
  - **Anchor**: n/a - no file is edited
  - **Change**: run the two commands below and report their output
  - **Proof**:
    ```bash
    git status --porcelain | wc -l
    git fetch origin main && git rev-parse HEAD origin/main
    ```
    Expected: `0`, then the same sha printed twice
  - **AC**: AC-015
  - **Rollback**: n/a: the command changes nothing
  - **Stop if**: the status is not empty or the shas differ; record the paths and name the task that left them

- [ ] T068 Report the handoff, including each push's CI runs (none)
  - **File**: none - the report is the phase handoff message
  - **Anchor**: n/a - no file is edited
  - **Change**: post the handoff message with four blocks: the three commit shas C1, C2 and C3; the `gh run list --branch main --limit 10 --json databaseId,headSha,status,conclusion` output covering each push; the four artifact counts observed on the tip after C3; and one line per recorded limit (D7 history retention, `--no-verify`, the evidence push's own runs, and the absent pre-push surface-token guard). Do not append any of it to `09-ci.md`.
  - **Proof**:
    ```bash
    gh run list --branch main --limit 10 --json databaseId,headSha,status,conclusion | jq -r '.[] | "\(.databaseId) \(.headSha[0:8]) \(.status)/\(.conclusion)"'
    ```
    Expected: one line per run, naming the run id, the short head sha and the status/conclusion pair
  - **AC**: AC-007
  - **Rollback**: n/a: a chat message changes no repository state
  - **Stop if**: a run on a phase sha is not `completed/success` or `completed/skipped`; report it and leave AC-007 `Unmet`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No production file changed; `git diff --stat 42b41dd286 HEAD` lists paths under this phase folder and the generated retrieval artifacts only
- [ ] CHK-011 [P0] Every proof command's output is quoted in its evidence file, not summarized
- [ ] CHK-012 [P1] Every zero check runs after a positive control that still matches a known population
- [ ] CHK-013 [P1] Each evidence file follows the one-check-per-file convention and ends with `<!-- evidence:end -->`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] `scratch/` holds only the evidence record - no temporary working file remains
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

