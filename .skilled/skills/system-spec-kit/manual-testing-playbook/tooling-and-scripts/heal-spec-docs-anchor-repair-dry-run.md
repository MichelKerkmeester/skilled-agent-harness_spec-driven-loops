---
title: "469 -- Heal spec-docs anchor repair dry run"
description: "This scenario validates the heal-spec-docs anchor repair dry run for `469`. It focuses on the duplicate-anchor rename, the questions opener move, the refusal for a questions pair inside another anchor and the guarantee that a dry run writes nothing."
version: 1.0.0.0
id: tooling-and-scripts-heal-spec-docs-anchor-repair-dry-run
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 469 -- Heal spec-docs anchor repair dry run

## 1. OVERVIEW

This scenario validates the dry run of `heal-spec-docs.cjs --anchor-repair` on a disposable spec document. The document carries two defects the repair can prove: a duplicate `problem-2` anchor pair and a `questions` opener placed above a line that is not the OPEN QUESTIONS heading. The dry run must name each repair it would make and write nothing.

### Why This Matters

An anchor repair edits spec documents in place. A dry run that wrote a file, or that hid a repair it would make, would leave the operator approving a change they never saw. This scenario proves that the preview matches the code path and leaves the document byte-identical.

---

## 2. SCENARIO CONTRACT

Operators run the anchor repair in dry-run mode against a fixture spec document and confirm the preview and the untouched document.

- Objective: Prove that the anchor repair dry run reports the duplicate rename and the questions move, exits 0, and leaves `spec.md` byte-identical.
- Playbook ID: 469.
- Real user request: `Show me which anchors in this spec document the repair would change before I let it write anything.`
- Prompt: `Show me which anchors in this spec document the repair would change before I let it write anything.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. The fixture needs no network.
- Expected execution process: Build the fixture with the defective document, run the dry run, confirm the document is unchanged and confirm that the working tree is clean.
- Expected signals: The dry run prints `would repair` for the `problem-2` rename at line 23 and for the questions move from line 10. The summary reads `documents=1 repairable=1 findings=2`. `git status` is empty and `spec.md` is byte-identical to its copy.
- Desired user-visible outcome: The operator reads both repairs before approving, and the document has not changed.
- Pass/fail: PASS if the dry run exits 0, prints both `would repair` lines and the summary, and the document is byte-identical. FAIL if the dry run changes a byte, or it misses either repair.

---

## 3. TEST EXECUTION

### Prompt

```
Show me which anchors in this spec document the repair would change before I let it write anything.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository and write the defective spec document.

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
mkdir -p specs/legacy-track/001-anchor-packet
cat > specs/legacy-track/001-anchor-packet/spec.md <<'SPEC'
---
title: "Anchor fixture"
description: "Anchor repair fixture"
---

## Summary

Some text.

<!-- ANCHOR:questions -->
Intro line for the list.
## OPEN QUESTIONS

- Nothing yet.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:problem-2 -->
## Problem A

Text.
<!-- /ANCHOR:problem-2 -->

<!-- ANCHOR:problem-2 -->
## Problem B

Text.
<!-- /ANCHOR:problem-2 -->
SPEC
git add -A && git commit -q -m "anchor packet"
cp specs/legacy-track/001-anchor-packet/spec.md "$OUT/spec.before.md"
```

2. Run the dry run and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair --roots specs > "$OUT/dry.out" 2>&1
echo "exit=$?"
cat "$OUT/dry.out"
```

3. Confirm that the dry run wrote nothing.

```bash
git status --porcelain
cmp specs/legacy-track/001-anchor-packet/spec.md "$OUT/spec.before.md" && echo "dry run left spec.md byte-identical"
```

### Expected

Step 2 prints `exit=0`, then these lines in order:

```
would repair specs/legacy-track/001-anchor-packet/spec.md: renamed isolated duplicate pair problem-2 to problem-2-2 at line 23
would repair specs/legacy-track/001-anchor-packet/spec.md: moved questions opener from line 10 to directly above OPEN QUESTIONS
anchor repair: documents=1 repairable=1 findings=2
```

Step 3 prints nothing from `git status` and then `dry run left spec.md byte-identical`.

If the questions pair sits inside another anchor, such as a `summary` anchor that wraps it, the dry run reports a `left unchanged` line that ends with `moving the questions opener would overlap summary`, instead of the move. That refusal is the expected result for that layout and is not a failure.

### Evidence

- The exit code from step 2 and the full text of `$OUT/dry.out`.
- The `git status` output and the `cmp` result from step 3.

### Pass / Fail

- **Pass**: The dry run exits 0, prints both `would repair` lines and the summary with `findings=2`, and step 3 confirms the document is byte-identical.
- **Fail**: The dry run exits non-zero, changes a byte in `spec.md`, misses either repair or reports a different line count.

### Failure Triage

If the dry run prints `documents=0`, the fixture has no `specs/<track>/<packet>/spec.md`, so check the fixture path. If the dry run reports the questions refusal instead of the move, the fixture has a wrapper anchor around the questions pair, so rebuild the fixture from step 1. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [heal-spec-docs-anchor-repair.md](../../feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md)
- Implementation: [heal-spec-docs.cjs](../../runtime/cli/spec/heal-spec-docs.cjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair --roots specs

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 469
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/heal-spec-docs-anchor-repair-dry-run.md`
