---
title: "468 -- Upgrade-legacy refusal without git"
description: "This scenario validates that upgrade-legacy refuses an apply when the tree is not a git repository, while the dry run still reports the failing packet. It focuses on the stderr message, the exit code and the guarantee that a refused apply writes nothing."
version: 1.0.0.0
id: tooling-and-scripts-upgrade-legacy-refusal-without-git
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 468 -- Upgrade-legacy refusal without git

## 1. OVERVIEW

This scenario validates the refusal that `upgrade-legacy.mjs` gives when an apply runs in a tree that is not a git repository. The apply needs git to write its reversibility manifest, so it stops before it changes a file. The dry run has no such need and still reports the failing packet, so an operator can see what an apply would do once the tree is under git.

### Why This Matters

An apply without a manifest would repair packets with no record of their prior bytes. The refusal is the guard that keeps that from happening. This scenario proves the guard fires, names the cause and leaves the packet untouched.

---

## 2. SCENARIO CONTRACT

Operators run an apply on a copy of the toolchain that has no `.git` directory, then confirm the refusal and the untouched packet.

- Objective: Prove that an apply without a git repository exits 2 with the git message on stderr, writes no baseline and leaves the packet byte-identical, while the dry run still exits 1 and reports the failing packet.
- Playbook ID: 468.
- Real user request: `Upgrade this spec tree that I copied out of git without a history.`
- Prompt: `Upgrade this spec tree that I copied out of git without a history.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, rsync and bash available. The fixture is built outside any git repository.
- Expected execution process: Build a non-git fixture, confirm the directory is not a repository, run the dry run, run the apply, then check that no file changed.
- Expected signals: The dry run exits 1 and names `specs/legacy-track/001-old-packet` as failing. The apply exits 2. Its stderr reads `upgrade-legacy: --apply requires REPO to be a git repository`. Its stdout is empty. No `upgrade-baseline.json` appears, and `spec.md` is unchanged.
- Desired user-visible outcome: The operator sees the findings and the reason the apply will not run, and no file changes.
- Pass/fail: PASS if the dry run exits 1, the apply exits 2 with the exact git message, no baseline exists and `spec.md` matches its starting bytes. FAIL if the apply exits 0, writes any file, or prints a different message.

---

## 3. TEST EXECUTION

### Prompt

```
Upgrade this spec tree that I copied out of git without a history.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build a fixture that is not a git repository.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
mkdir -p .skilled/skills .skilled/scripts .opencode specs
rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" "$CHECKOUT/.skilled/skills/sk-doc" "$CHECKOUT/.skilled/skills/cli-classifier" "$CHECKOUT/.skilled/skills/sk-code" .skilled/skills/
ln -s "$CHECKOUT/.skilled/skills/system-spec-kit/node_modules" .skilled/skills/system-spec-kit/node_modules
rsync -a "$CHECKOUT/.skilled/hooks" .skilled/
rsync -a "$CHECKOUT/.skilled/scripts/git-hooks" .skilled/scripts/
touch .opencode/.gitkeep
mkdir -p specs/legacy-track/001-old-packet
printf -- '---\ntitle: "Old packet"\ndescription: "Legacy packet"\n---\n\n# Old packet\n' > specs/legacy-track/001-old-packet/spec.md
printf '# Plan\n' > specs/legacy-track/001-old-packet/plan.md
git rev-parse --is-inside-work-tree 2>&1
```

2. Run the dry run and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs > "$OUT/dry.out" 2> "$OUT/dry.err"
echo "dry_exit=$?"
head -1 "$OUT/dry.out"
```

3. Run the apply and record its exit code and both output streams.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --apply > "$OUT/apply.out" 2> "$OUT/apply.err"
echo "apply_exit=$?"
echo "stdout bytes: $(wc -c < "$OUT/apply.out" | tr -d ' ')"
cat "$OUT/apply.err"
```

4. Confirm that nothing was written.

```bash
test ! -e specs/legacy-track/001-old-packet/upgrade-baseline.json && echo "no baseline written"
printf -- '---\ntitle: "Old packet"\ndescription: "Legacy packet"\n---\n\n# Old packet\n' | cmp - specs/legacy-track/001-old-packet/spec.md && echo "spec.md unchanged"
```

### Expected

Step 1 prints `fatal: not a git repository` with the path check failing. Step 2 prints `dry_exit=1` and a first line that starts with `failing specs/legacy-track/001-old-packet:`. Step 3 prints `apply_exit=2`, `stdout bytes: 0`, and the stderr line `upgrade-legacy: --apply requires REPO to be a git repository`. Step 4 prints `no baseline written` and `spec.md unchanged`.

### Evidence

- The exit codes from steps 2 and 3, with the first dry-run line.
- The stderr text from step 3 and the stdout byte count.
- The output of the two checks in step 4.

### Pass / Fail

- **Pass**: The dry run exits 1, the apply exits 2 with the exact git message and no stdout, and step 4 prints both confirmations.
- **Fail**: The apply exits 0, the apply writes a file, a baseline appears, `spec.md` changes, or the stderr text differs.

### Failure Triage

If the apply runs without an error, the fixture sits inside a git repository, so check step 1 for a parent `.git` directory and rebuild the fixture under a directory that has none. If the dry run exits 2 instead of 1, check that the fixture still has the packet's `spec.md` and `plan.md`. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [upgrade-legacy-reversibility-manifest.md](../../feature-catalog/tooling-and-scripts/upgrade-legacy-reversibility-manifest.md)
- Implementation: [upgrade-legacy.mjs](../../runtime/cli/spec/upgrade-legacy.mjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --apply

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 468
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/upgrade-legacy-refusal-without-git.md`
