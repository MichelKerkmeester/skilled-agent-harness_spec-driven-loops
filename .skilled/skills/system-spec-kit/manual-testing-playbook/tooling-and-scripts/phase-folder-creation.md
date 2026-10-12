---
title: "PHASE-002 -- Phase folder creation"
description: "This scenario validates Phase folder creation for `PHASE-002`. It focuses on Run `create.sh \"Test\" --phase --level 3 --phases 3` and verify parent+children structure."
version: 1.6.0.18
id: tooling-and-scripts-phase-folder-creation
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/structure/phase-definitions.md
---

# PHASE-002 -- Phase folder creation

## 1. OVERVIEW

This scenario validates Phase folder creation for `PHASE-002`. It runs `create.sh` with `--phase` in a disposable repository, so no packet is written into the real `specs/` tree, and then verifies the parent and its three children.

---

## 2. SCENARIO CONTRACT

- Objective: Run `create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"` in a fixture and verify the parent, the three children, their links, their graph metadata and strict validation.
- Real user request: `Please validate Phase folder creation against bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and tell me whether the expected signals are present: parent folder with Phase Documentation Map in spec.md, 3 child folders with correct naming, back-references and predecessor/successor links in child spec.md files, and Level 3 template files in all folders.`
- Prompt: `Validate Phase folder creation against bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and report cited pass/fail evidence.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. The fixture needs no network.
- Expected execution process: Build the fixture, run `create.sh` inside it, read the parent and child files, check the graph metadata and run strict validation on the parent and on each child.
- Expected signals: The parent folder `001-phase-test/` holds a `## PHASE DOCUMENTATION MAP` section that lists `001-design/`, `002-implement/` and `003-verify/`. Each child `spec.md` carries `Parent Spec | ../spec.md`. `002-implement` names `001-design` as predecessor and `003-verify` as successor. Each child declares `SPECKIT_LEVEL: 3`. `graph-metadata.json` exists in the parent and in each child. `validate.sh --strict` on the parent prints four `RESULT: PASSED` lines, one for the parent and one for each child, because the run validates every child folder. `validate.sh --strict` on each child prints one `RESULT: PASSED` line. The parent holds only the lean trio, `spec.md`, `description.json` and `graph-metadata.json`, with no `plan.md` or `tasks.md`.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the parent map lists all three children, each child has its parent back-reference, the middle child has both predecessor and successor links, each child is Level 3, graph metadata exists in all four folders and every strict validation prints `RESULT: PASSED`. FAIL if any of those conditions is not met, or any command in the sequence errors unexpectedly.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Phase folder creation against bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and report cited pass/fail evidence.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository and run `create.sh` inside it.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig" && : > "$GIT_CONFIG_GLOBAL"
git init -q && git config user.name Fixture && git config user.email fixture@test.invalid
mkdir -p .skilled/skills .skilled/scripts .opencode specs
rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" "$CHECKOUT/.skilled/skills/sk-doc" "$CHECKOUT/.skilled/skills/cli-classifier" "$CHECKOUT/.skilled/skills/sk-code" .skilled/skills/
ln -s "$CHECKOUT/.skilled/skills/system-spec-kit/node_modules" .skilled/skills/system-spec-kit/node_modules
rsync -a "$CHECKOUT/.skilled/hooks" .skilled/
rsync -a "$CHECKOUT/.skilled/scripts/git-hooks" .skilled/scripts/
touch .opencode/.gitkeep
printf 'dist/\nnode_modules\n' > .gitignore
git add -A && git commit -q -m baseline
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" > "$OUT/phase.out" 2> "$OUT/phase.err"
echo "create_exit=$?"
P="$(ls -d specs/*-phase-test | head -1)"
echo "parent=$P"
```

2. Check the parent map and the child links and levels.

```bash
grep -n "^## PHASE DOCUMENTATION MAP" -A8 "$P/spec.md"
ls "$P"
for c in "$P"/00*; do echo "-- $(basename "$c")"; grep -n "Parent Spec\|Predecessor\|Successor\|SPECKIT_LEVEL" "$c/spec.md"; done
```

3. Check the graph metadata in every folder.

```bash
ls "$P/graph-metadata.json" "$P"/00*/graph-metadata.json
```

4. Run strict validation on the parent and on each child.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val-parent.txt" 2>&1
echo "parent_exit=$?"
grep "RESULT:" "$OUT/val-parent.txt"
for c in "$P"/00*; do
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$c" --strict > "$OUT/val-$(basename "$c").txt" 2>&1
  echo "$(basename "$c") exit=$?"
  grep "RESULT:" "$OUT/val-$(basename "$c").txt"
done
```

### Expected

Step 1 prints `create_exit=0` and `parent=specs/001-phase-test`. The step writes its stderr to `$OUT/phase.err`, which holds the line `[speckit] Skipping branch creation (--skip-branch)` and one `description.json created in ...` line for each of the four folders. Step 2 prints the map heading `## PHASE DOCUMENTATION MAP` with rows for `001-design/`, `002-implement/` and `003-verify/`, then the parent listing, which holds `description.json`, `graph-metadata.json`, `spec.md` and the three child folders and no `plan.md` or `tasks.md`, then for each child a `Parent Spec | ../spec.md` line and a `SPECKIT_LEVEL: 3` line. The predecessor and successor lines read `None` and `002-implement` for `001-design`, `001-design` and `003-verify` for `002-implement`, and `002-implement` and `None` for `003-verify`. Step 3 lists four `graph-metadata.json` paths, one for the parent and one for each child. Step 4 prints `parent_exit=0` and then four `RESULT: PASSED` lines, one each for the parent, `001-design`, `002-implement` and `003-verify`, because the parent run validates its children too. Then for each child it prints `exit=0` and one `RESULT: PASSED` line.

### Evidence

- The exit code and the parent name from step 1, and the stderr file.
- The map, listing and link lines from step 2.
- The four paths from step 3.
- The exit codes and `RESULT:` lines from step 4.

### Pass / Fail

- **Pass**: The parent map lists all three children, each child carries its parent back-reference, `002-implement` has both predecessor and successor links, each child declares `SPECKIT_LEVEL: 3`, all four folders hold `graph-metadata.json`, and every strict validation prints `RESULT: PASSED`.
- **Fail**: Any condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If `create_exit` is not 0, read `$OUT/phase.err` for the cause. If a child is not `SPECKIT_LEVEL: 3`, the phase child contract has changed, so check `system-spec-kit/references/structure/phase-definitions.md` §3 before editing this scenario. If a `graph-metadata.json` is missing, the stderr names the folder, because the graph step warns and continues on failure. If a strict validation prints no `RESULT:` line, treat it as a failure even when its exit code is 0. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [spec-lifecycle-automation.md](../../feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md)
- Implementation: [create.sh](../../runtime/cli/spec/create.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/phase-folder-creation.md`
