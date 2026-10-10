---
title: "471 -- Heal spec-docs lane modes"
description: "This scenario validates the heal-spec-docs lane modes for `471`. It focuses on the anchor-wrap and continuity-placeholder actions that a dry run previews and an apply writes, the refusal for a packet with no SPECKIT_LEVEL marker and the guarantee that a dry run writes nothing."
version: 1.0.0.0
id: tooling-and-scripts-heal-spec-docs-lane-modes
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 471 -- Heal spec-docs lane modes

## 1. OVERVIEW

This scenario validates `heal-spec-docs.cjs --lane-modes` on a disposable repository. The fixture holds a Level 1 packet that `create.sh` scaffolded, with one anchor pair removed, and a packet with no level marker. The lane modes restore the removed anchor pair and fill two continuity placeholders. They refuse the packet that has no level, because no template can be proven for it.

### Why This Matters

Lane modes write into several documents at once. A dry run that hid a write, or an apply that touched a packet it had refused in the dry run, would change documents the operator never reviewed. This scenario proves that the preview and the apply agree and that the refusal holds.

---

## 2. SCENARIO CONTRACT

Operators run the lane modes in dry-run mode, then with apply, against a disposable repository that holds one scaffolded packet and one unleveled packet.

- Objective: Prove that the lane modes preview and apply the anchor-wrap and continuity-placeholder actions on the scaffolded packet, refuse the unleveled packet, and leave the tree clean after the dry run.
- Playbook ID: 471.
- Real user request: `Repair the anchors and placeholders in these packets, but tell me first which packets you would refuse and why.`
- Prompt: `Repair the anchors and placeholders in these packets, but tell me first which packets you would refuse and why.`
- Preconditions: The same checkout and tools as scenario 469, with `create.sh` available in the fixture. The fixture needs no network.
- Expected execution process: Build the fixture, scaffold the Level 1 packet, remove one anchor pair, add the unleveled packet, run the dry run, confirm the tree is clean, run the apply and read the changed lines.
- Expected signals: The dry run prints three `would apply` lines for the scaffolded packet and one `refused header-add` line for the unleveled packet. The apply prints the matching `applied` lines. The `problem` anchor pair returns to `spec.md`, and `implementation-summary.md` gets two placeholders.
- Desired user-visible outcome: The operator sees each change and each refusal before the apply writes, and the refusal names the missing level.
- Pass/fail: PASS if the dry run prints the four expected lines and leaves the tree clean, and the apply restores the `problem` pair. FAIL if the dry run writes a file, the apply changes the unleveled packet, or the `problem` pair does not return.

---

## 3. TEST EXECUTION

### Prompt

```
Repair the anchors and placeholders in these packets, but tell me first which packets you would refuse and why.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository, scaffold a Level 1 packet, remove one anchor pair and add the unleveled packet.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --track legacy-track --level 1 --short-name lane-demo --number 1 "Lane demo" > "$OUT/create.out" 2>&1
git add -A && git commit -q -m scaffold
P=specs/legacy-track/001-lane-demo
sed -i.bak -e '/^<!-- ANCHOR:problem -->$/d' -e '/^<!-- \/ANCHOR:problem -->$/d' "$P/spec.md" && rm -f "$P/spec.md.bak"
git add -A && git commit -q -m "drop problem anchor pair"
mkdir -p specs/legacy-track/002-unleveled-packet
printf -- '---\ntitle: "Unleveled"\ndescription: "No level"\n---\n\n# Unleveled\n' > specs/legacy-track/002-unleveled-packet/spec.md
git add -A && git commit -q -m "unleveled packet"
cp "$P/spec.md" "$OUT/spec.before.md"
```

2. Run the dry run and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --lane-modes --roots specs > "$OUT/dry.out" 2>&1
echo "exit=$?"
cat "$OUT/dry.out"
```

3. Confirm that the dry run wrote nothing.

```bash
git status --porcelain
echo "(end of status)"
```

4. Run the apply and read the diff of the scaffolded spec.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --lane-modes --roots specs --apply > "$OUT/apply.out" 2>&1
echo "exit=$?"
cat "$OUT/apply.out"
diff "$OUT/spec.before.md" "$P/spec.md"
git status --porcelain
```

### Expected

Step 2 prints `exit=0`, then these lines, in this order:

```
would apply anchor-wrap specs/legacy-track/001-lane-demo/spec.md: wrapped "2. PROBLEM & PURPOSE" with anchor problem
would apply continuity-placeholders specs/legacy-track/001-lane-demo/implementation-summary.md: set recent_action to "No continuity update was recorded"
would apply continuity-placeholders specs/legacy-track/001-lane-demo/implementation-summary.md: set next_safe_action to "None recorded"
refused header-add specs/legacy-track/002-unleveled-packet/spec.md: spec.md: no level is recorded in spec.md, so no rendered template can be proven
```

Step 3 prints nothing before `(end of status)`. Step 4 prints `exit=0`, the same four lines with `applied` in place of `would apply` and `refused` unchanged, and a diff that adds the `<!-- ANCHOR:problem -->` opener above the `2. PROBLEM & PURPOSE` heading and the `<!-- /ANCHOR:problem -->` closer below its section. The final `git status` lists `implementation-summary.md` and `spec.md` as modified. The unleveled packet is not listed.

### Evidence

- The exit codes and the full text of `$OUT/dry.out` and `$OUT/apply.out`.
- The git status output from step 3 and the final status from step 4.
- The diff from step 4.

### Pass / Fail

- **Pass**: The dry run prints the three `would apply` lines and the `refused` line, the tree is clean after the dry run, and the apply restores the `problem` pair and changes no file in the unleveled packet.
- **Fail**: The dry run leaves a modified file, the apply writes into the unleveled packet, or the `problem` pair does not return.

### Failure Triage

If the dry run prints no `would apply` lines, the scaffolded packet has no removed anchor pair, so check that step 1 deleted the `problem` lines. If the unleveled packet is not refused, check that its `spec.md` has no `SPECKIT_LEVEL` marker. If `create.sh` fails in step 1, read `$OUT/create.out` for the cause and rebuild the fixture. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [heal-spec-docs-lane-modes.md](../../feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md)
- Implementation: [heal-spec-docs.cjs](../../runtime/cli/spec/heal-spec-docs.cjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --lane-modes --roots specs --apply

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 471
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/heal-spec-docs-lane-modes.md`
