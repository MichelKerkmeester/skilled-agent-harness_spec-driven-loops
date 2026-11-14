---
title: "Implementation Plan: Phase 8: router-readme-presentation-alignment"
description: "Align the speckit routers, README.txt and presentation files with the workflows by deriving each stated fact from its owning file. Twelve named bash checks read the workflows and routers and print only drift."
trigger_phrases:
  - "router readme presentation alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: router-readme-presentation-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, plain-text presentation files, workflow YAML, JSON metadata |
| **Framework** | The speckit command router pattern: a router loads one workflow YAML and one presentation file |
| **Storage** | None |
| **Testing** | The bash CHECK blocks in section 5, `node --test` for the Gate 3 parity test and `command-catalog-mirror-check.cjs` |

### Overview
This phase changes text in the speckit routers, `README.txt`, the presentation files and the lifecycle workflow keys. The two unprefixed presentation asset names stay. Each stated count, flag, file and next step is copied from the workflow or router that owns it, as that file stands when this phase starts. The twelve CHECK blocks in section 5 derive the truth from the owning file and print only the places that disagree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 7 is closed: `rg -c 'Unmet' specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms/acceptance-criteria.md` prints no count and exits 1
- [ ] Each CHECK block in section 5 has been run once and its output saved to `scratch/baseline.txt`
- [ ] `node --test gate-3-menu-parity.test.mjs` prints `ℹ fail 0` and `command-catalog-mirror-check.cjs` prints `STATUS=OK` before any edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Each CHECK block in section 5 prints the expected output named in `acceptance-criteria.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Copies follow owner. The workflow YAML owns steps and outputs. The router owns its `argument-hint` and flag table. `README.txt` and the presentation files are copies.

### Key Components
- **Workflow YAML** (`assets/speckit-*.yaml`): owns the step keys, `termination`, `outputs:` lists and the new `spec_folder_skip` key. Only those keys change here.
- **Routers** (`*.md`): own the `argument-hint` and the Workflow Flag Surface table. Only the `description` step count changes.
- **Copies** (`README.txt`, `assets/*-presentation.txt`): change to match the owners. No new component is added. A shared presentation file was considered and rejected, because no presentation file under `.skilled/commands/` includes another and each router loads exactly one.

### Data Flow
Each CHECK block reads an owner file, derives the fact, reads the copy and prints a line only where the two differ. The implementer edits the copy until the CHECK prints nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `save-presentation.txt`, `search-presentation.txt` | Presentation files that `save.md` and `search.md` load | unchanged. Both names stay | CHECK-A6 |
| `command-metadata.json` | Lists both files as `resource` paths the mirror check opens | unchanged | `command-catalog-mirror-check.cjs` prints `STATUS=OK` |
| sk-create-command `command-contract.json`, `command-router-template.md`, `SKILL.md` | Cite `save-presentation.txt` as the example of an unprefixed family | unchanged. The example stays true | CHECK-A6 prints no `UNRESOLVED` line |
| Plan, implement, complete and resume presentation files | Carry setup question Q3, the `dispatch_mode` field and the `memory_choice` field | update | CHECK-X2 and CHECK-X3 |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Matches the Session Goal offer line in the four lifecycle presentation files by its text | not a consumer of the renumbering | The test finds the line by text, not by its Q number |
| Runtime mirrors under `.claude/`, `.cursor/`, `.opencode/` and the other runtime folders | Symlinks to the router `.md` files, or to the whole `speckit/` folder in `.opencode/commands/` | not a consumer. Nothing to edit | On 2026-11-14 `find` for symlinks named `*presentation.txt` outside `specs/`, `.worktrees/`, `barter/` and `.git/` printed nothing |
| `specs/`, `.worktrees/`, `barter/` | History, other worktrees and a gitignored host copy | unchanged | Excluded from CHECK-A6 by scope |
| `gate-3-menu-parity.test.mjs` | Enforces the option C text in the plan and complete presentation files | unchanged | CHECK-A8 prints `ℹ fail 0` |

Required inventories:
- Same-class producers: CHECK-A6 greps `.skilled` for every presentation-asset path that names `save` or `search`. T054 greps the command folder for `dispatch_mode` and `memory_choice`.
- Consumers of changed symbols: the same greps, plus `command-catalog-mirror-check.cjs` for the metadata resources.
- Matrix axes: command (plan, implement, complete, resume, save, search, handoff) by copy (router `description`, README row, README tree, presentation file, `termination`).
- Algorithm invariant: a copy states the owner's value or states nothing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup confirms phase 7 is closed and saves the output of every CHECK block, the parity test and the mirror check as the baseline.
Implementation edits the routers, `README.txt`, the presentation files and the lifecycle workflow keys until each CHECK prints its expected output.
Verification runs every CHECK block, the parity test, the mirror check and `validate.sh --strict` from the final state.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each derived fact against its copies | The CHECK blocks below, run with `bash` from the repository root |
| Integration | Gate 3 option C text and command metadata resources | `node --test gate-3-menu-parity.test.mjs`, `command-catalog-mirror-check.cjs` |
| Manual | Read the README command table and tree once against `ls .skilled/commands/speckit/assets` | Terminal |

Every block below was run on 2026-11-14 against the review-time files. Each one printed the defect its finding names. After this phase each prints the expected output in `acceptance-criteria.md`.

#### CHECK-A1: step counts

```bash
S=.skilled/commands/speckit
for c in plan implement complete resume
do
  y=$(for x in $(rg -o 'assets/speckit-[a-z-]+\.yaml' "$S/$c.md" | sort -u)
  do
    rg -q '^  step_1_' "$S/$x" && echo "$x"
  done)
  if [ "$(printf '%s\n' "$y" | grep -c .)" != 1 ]
  then
    echo "NOT ONE WORKFLOW $c"
    continue
  fi
  nums=$(rg -o -r '$1.$2' '^  step_([0-9]+)(?:[._]([0-9]+))?_[a-z][a-z_]*:' "$S/$y" | sed 's/\.$//' | rg -v -e '^0' | sort -t. -k1,1n -k2,2n -u)
  auto=$(rg -o -r '$1.$2' '^  step_([0-9]+)(?:[._]([0-9]+))?_[a-z_]*autopilot[a-z_]*:' "$S/$y" | sed 's/\.$//')
  for a in $auto
  do
    nums=$(printf '%s\n' "$nums" | grep -vx -F "$a")
  done
  n=$(printf '%s\n' "$nums" | grep -c .)
  last=$(printf '%s\n' "$nums" | tail -1)
  ints=$(printf '%s\n' "$nums" | cut -d. -f1 | sort -un)
  if [ "$n" = 0 ] || [ "$(printf '%s\n' "$ints" | grep -c .)" != "$(printf '%s\n' "$ints" | tail -1)" ]
  then
    echo "GAP $c in $y"
    continue
  fi
  for v in \
    "router:$(rg -m1 '^description:' "$S/$c.md" | rg -o '[0-9]+\+? steps' | rg -o '^[0-9]+\+?')" \
    "readme:$(rg -m1 "^\| \*\*$c\*\* " "$S/README.txt" | sed 's/\\|/ /g' | awk -F'|' '{gsub(/ /,"",$4)} {print $4}')" \
    "success:$(rg -o 'All [0-9]+ steps' "$S/assets/speckit-$c-presentation.txt" | rg -o '[0-9]+')" \
    "dashboard:$(rg -o 'Step: \[current\] / [0-9]+' "$S/assets/speckit-$c-presentation.txt" | rg -o '[0-9]+$')"
  do
    val=${v#*:}
    [ -z "$val" ] || [ "$val" = "$n" ] || echo "MISMATCH $c ${v%%:*}=$val count=$n"
  done
  for v in \
    "after_step:$(rg -o '^  after_step: [0-9.]+' "$S/$y" | rg -o '[0-9.]+$')" \
    "after_message:$(rg -o 'terminated after step [0-9.]+' "$S/$y" | rg -o '[0-9.]+$' | sed 's/\.$//')"
  do
    val=${v#*:}
    [ -z "$val" ] || [ "$val" = "$last" ] || echo "MISMATCH $c ${v%%:*}=$val last=$last"
  done
done
n=$(sed -n '/^## 3\. WORKFLOW OVERVIEW/,/^---/p' "$S/handoff.md" | rg -c '^\| [0-9]+ \|')
r=$(rg -m1 '^\| \*\*handoff\*\* ' "$S/README.txt" | awk -F'|' '{gsub(/ /,"",$4)} {print $4}')
[ -n "$n" ] && [ "$r" = "$n" ] || echo "MISMATCH handoff readme=$r steps=$n"
```

N counts every top-level step key numbered 1 or more, half-steps included, and skips a key whose name holds `autopilot`. The `after_step` value and the termination message are compared with the last counted key number. On 2026-11-14 it printed `MISMATCH plan router=8 count=7`, four `MISMATCH implement` lines with value 9 against `count=12` (router, readme, success and dashboard), four `MISMATCH complete` lines against `count=18` (router and readme at `14+`, success and dashboard at 14) and `NOT ONE WORKFLOW resume`. The implement and complete counts include the checkpoint, preflight and postflight half-steps that phases 6 and 7 remove.

#### CHECK-A2: README invocation tokens

```bash
S=.skilled/commands/speckit
for c in plan implement complete resume save search handoff
do
  hint=$(rg -m1 '^argument-hint:' "$S/$c.md" | sed 's#/speckit:[a-z]*##g' | rg -o -- '(:[a-z][a-z-]*|--[a-z][a-z-]*)' | sort -u | tr '\n' ' ')
  row=$(rg -m1 "^\| \*\*$c\*\* " "$S/README.txt" | sed 's/\\|/ /g' | awk -F'|' '{print $3}' | sed 's#/speckit:[a-z]*##g' | rg -o -- '(:[a-z][a-z-]*|--[a-z][a-z-]*)' | sort -u | tr '\n' ' ')
  [ "$hint" = "$row" ] || echo "DRIFT $c hint=[$hint] readme=[$row]"
done
```

On 2026-11-14 it printed a `DRIFT` line for plan, implement, complete and resume.

#### CHECK-A3: README tree

```bash
S=.skilled/commands/speckit
T=$(sed -n '/^speckit\//,/^deep\//p' "$S/README.txt")
for f in $(cd "$S" && ls *.md README.txt) $(ls "$S/assets")
do
  grep -qF -- "── $f" <<<"$T" || echo "NOT IN TREE $f"
done
for f in $(grep -- '── ' <<<"$T" | sed 's/.*── //' | sed 's/[ /].*//')
do
  [ -e "$S/$f" ] || [ -e "$S/assets/$f" ] || echo "NOT ON DISK $f"
done
k=$(grep -o '[0-9][0-9]*-command' <<<"$T" | rg -o '^[0-9]+')
m=$(ls "$S"/*.md | wc -l | tr -d ' ')
[ -z "$k" ] || [ "$k" = "$m" ] || echo "COUNT tree=$k routers=$m"
```

On 2026-11-14 it printed `NOT IN TREE` for the four lifecycle presentation files and `COUNT tree=9 routers=7`.

#### CHECK-A4: README section 7 flags

```bash
S=.skilled/commands/speckit
for f in $(sed -n '/^### Workflow Flag Surface/,/^---/p' "$S/complete.md" | rg -o '^\| `[^`]+`' | tr -d '|` ' | sort -u)
do
  sed -n '/^## 7\. EXECUTION MODES/,/ANCHOR:execution-modes -->/p' "$S/README.txt" | rg -q -F -- "\`$f\`" || echo "README SECTION 7 MISSING $f"
done
sed -n '/^## 7\. EXECUTION MODES/,/ANCHOR:execution-modes -->/p' "$S/README.txt" | rg -n '(two|three|four|[0-9]+) additional flags'
```

On 2026-11-14 it printed five `README SECTION 7 MISSING` lines, then section line 8, which says the `complete` command supports two additional flags.

#### CHECK-A5: attached mode suffix

```bash
rg -n '/speckit:[a-z]+:[a-z]' .skilled/commands/speckit
echo "rg exit=$?"
```

On 2026-11-14 it printed `speckit-plan.yaml:840` and `README.txt:272`, then `rg exit=0`.

#### CHECK-A6: asset names and callers

```bash
S=.skilled/commands/speckit
ls "$S/assets/save-presentation.txt" "$S/assets/search-presentation.txt"
for p in $(rg -o -N -I --no-config -P '(?<![A-Za-z0-9_.-])(?:[A-Za-z0-9_.-]+/)*(?:[a-z]+-)?(?:save|search)-presentation\.txt' .skilled | sort -u)
do
  t="$p"
  [ "${p#.skilled/}" != "$p" ] || t="$S/assets/$(basename "$p")"
  [ -e "$t" ] || echo "UNRESOLVED $p"
done
sed -n '/ANCHOR:structure/,/\/ANCHOR:structure/p' "$S/README.txt" | rg -c '^`save` and `search` .*`save-presentation\.txt` and `search-presentation\.txt` .*prefix'
node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs 2>&1 | rg '^STATUS='
```

On 2026-11-14 `ls` listed both files, no `UNRESOLVED` line printed, the README sentence count was 1 and the mirror check printed `STATUS=OK`. This check passes today by design. It guards the kept names while the other edits land.

#### CHECK-A7: repeated presentation blocks

```bash
A=.skilled/commands/speckit/assets
for c in plan implement complete
do
  sed -n '/^### Failure/,/^STATUS=FAIL/p' "$A/speckit-$c-presentation.txt" | sed -E 's/SpecKit [A-Za-z]+ Failed/SpecKit X Failed/' | tr '\n' '|'
  echo
done | sort -u | wc -l
for c in plan implement complete
do
  sed -n '/^### Auto Fail-Fast/,/^STATUS=FAIL/p' "$A/speckit-$c-presentation.txt" | sed -E 's/SpecKit [A-Za-z]+ auto/SpecKit X auto/' | tr '\n' '|'
  echo
done | sort -u | wc -l
for c in plan implement complete resume
do
  sed -n 3p "$A/speckit-$c-presentation.txt" | sed -E 's#/speckit:[a-z]+#/speckit:X#'
done | sort -u | wc -l
rg -I '^End interactive presentations with' "$A"/speckit-{plan,implement,complete,resume}-presentation.txt | sort -u | wc -l
for p in "$A"/*-presentation.txt
do
  rg -l -F "$(basename "$p")" .skilled/commands/speckit/*.md | wc -l | tr -d ' '
done | sort -u
```

On 2026-11-14 it printed 2, 1, 1, 1 and 1. The last line reports how many routers load each presentation file, so a shared file loaded by several routers would print a number above 1. The 2 is the complete failure block, which says `[error description] | Step: [step number]` where plan and implement say `[description] | Step: [number]`.

#### CHECK-A8: Q1 options C and D

```bash
A=.skilled/commands/speckit/assets
(cd .skilled/skills/system-spec-kit/runtime/tests/hooks && node --test gate-3-menu-parity.test.mjs 2>&1 | rg '^ℹ (pass|fail) ')
rg -c '^Q1\. Spec Folder: .*D\) Skip documentation \(' "$A/speckit-plan-presentation.txt" "$A/speckit-complete-presentation.txt"
rg -c '^\s+spec_folder_skip:' "$A/speckit-plan.yaml" "$A/speckit-complete.yaml"
```

On 2026-11-14 it printed `ℹ pass 17` and `ℹ fail 0`, then no count for either `rg`.

#### CHECK-A9: one README row per router

```bash
S=.skilled/commands/speckit
for f in "$S"/*.md
do
  c=$(basename "$f" .md)
  [ "$(rg -c "^\| \*\*$c\*\* " "$S/README.txt")" = 1 ] || echo "README ROWS $c"
done
node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs 2>&1 | rg '^STATUS='
```

On 2026-11-14 it printed no `README ROWS` line and `STATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree`.

#### CHECK-A10: plan success artifacts

```bash
A=.skilled/commands/speckit/assets
for n in $(rg '^Artifacts:' "$A/speckit-plan-presentation.txt" | rg -o '[a-z-]+\.md' | sort -u)
do
  rg -q "^\s+outputs:.*\b$n" "$A/speckit-plan.yaml" || echo "NOT WRITTEN $n"
done
```

On 2026-11-14 it printed `NOT WRITTEN acceptance-criteria.md` and `NOT WRITTEN tasks.md`.

#### CHECK-X2: setup question Q3 and dispatch_mode

```bash
A=.skilled/commands/speckit/assets
rg -n -w -e dispatch_mode -e 'Dispatch Mode' "$A"/speckit-{plan,implement,complete}-presentation.txt
echo "rg exit=$?"
for c in plan implement complete
do
  f="$A/speckit-$c-presentation.txt"
  q=$(rg -o '^Q[0-9]+\.' "$f" | tr -d 'Q.' | sort -n | tr '\n' ' ')
  n=$(rg -o 'covers Q0-Q[0-9]+' "$f" | rg -o '[0-9]+$')
  [ "$q" = "$(seq 0 "$n" | tr '\n' ' ')" ] || echo "QRANGE $c questions=[$q] covers=$n"
  rg -m1 '^Reply format covers' "$f" | rg -o '"[^"]*"' | tr -d '"' | while read -r x
  do
    v=$(printf '%s\n' "$x" | awk -F', ' '{print NF}')
    [ "$v" = "$((n + 1))" ] || echo "REPLY $c values=$v questions=$((n + 1))"
  done
done
```

On 2026-11-14 it printed three lines per file for `dispatch_mode` and `Q3. Dispatch Mode`, then `rg exit=0`. The range and reply checks printed nothing, because Q0 to Q9 in plan and complete and Q0 to Q6 in implement match their reply formats today.

#### CHECK-X3: memory_choice renamed

```bash
A=.skilled/commands/speckit/assets
rg -n -w memory_choice "$A"/speckit-{plan,implement,complete,resume}-presentation.txt
echo "rg exit=$?"
rg -c -w prior_continuity_choice "$A"/speckit-{plan,implement,complete,resume}-presentation.txt
```

On 2026-11-14 it printed two `memory_choice` lines per file, then `rg exit=0`, and the count command printed nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 to 7 of the parent packet | Internal | Yellow | Every count and flag copied here goes stale again. Do not start |
| `bash`, `rg`, `sed`, `awk`, `node` | External | Green | The CHECK blocks cannot run |
| `gate-3-menu-parity.test.mjs`, `command-catalog-mirror-check.cjs` | Internal | Green | REQ-008, REQ-010 and REQ-011 lose their proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The mirror check stops printing `STATUS=OK`. Or the parity test prints a failure. Or `/speckit:save` or `/speckit:search` cannot load its presentation file.
- **Procedure**: Revert this phase's one commit with `git revert <sha>`. That restores every edited file together.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 7 of the parent closed | Implementation |
| Implementation | Setup baseline saved | Verification |
| Verification | Implementation | Closing this phase and the parent |
<!-- /ANCHOR:phase-deps -->

---

