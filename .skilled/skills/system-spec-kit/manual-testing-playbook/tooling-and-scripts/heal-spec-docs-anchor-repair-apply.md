---
title: "470 -- Heal spec-docs anchor repair apply"
description: "This scenario validates the heal-spec-docs anchor repair apply for `470`. It focuses on the two anchor edits the apply writes, the byte-level diff those edits produce and the clean second run that follows."
version: 1.0.0.0
id: tooling-and-scripts-heal-spec-docs-anchor-repair-apply
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 470 -- Heal spec-docs anchor repair apply

## 1. OVERVIEW

This scenario validates `heal-spec-docs.cjs --anchor-repair --apply` on the same defective spec document used by scenario 469. The apply renames the second `problem-2` pair to `problem-2-2` and moves the `questions` opener to sit directly above the OPEN QUESTIONS heading. Those are the only lines it may change. A second run must then find nothing left to repair.

### Why This Matters

The repair rewrites spec documents that other tools read by anchor name. A rename that touched more than the two anchor lines, or a repair that was not idempotent, would break the anchor contract for every reader of the document. This scenario proves that the edit is minimal and that a repeat run is a no-op.

---

## 2. SCENARIO CONTRACT

Operators apply the anchor repair to a fixture spec document, read the diff and confirm that a second run finds nothing to repair.

- Objective: Prove that the apply changes exactly the two anchor lines and the moved opener, reports `repaired=1`, and that a second run reports `repairable=0 findings=0`.
- Playbook ID: 470.
- Real user request: `Apply the anchor repair to this spec document and show me exactly which lines changed.`
- Prompt: `Apply the anchor repair to this spec document and show me exactly which lines changed.`
- Preconditions: The same checkout and tools as scenario 469. The apply runs only on the fixture.
- Expected execution process: Build the fixture, run the apply, read the diff against the saved copy, then run the repair again on the repaired document.
- Expected signals: The apply exits 0 and prints `repaired` for the two defects with the summary `documents=1 repaired=1 findings=2`. The diff touches the questions opener and the two `problem-2` lines only. The second run prints `documents=1 repairable=0 findings=0`.
- Desired user-visible outcome: The operator sees a minimal diff and confirms the document is stable on a second run.
- Pass/fail: PASS if the apply exits 0, the diff shows only the expected lines, and the second run prints `repairable=0 findings=0`. FAIL if the diff touches any other line, or the second run still finds a repair.

---

## 3. TEST EXECUTION

### Prompt

```
Apply the anchor repair to this spec document and show me exactly which lines changed.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the same disposable repository and defective spec document as scenario 469.

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

2. Run the apply and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair --roots specs --apply > "$OUT/apply.out" 2>&1
echo "exit=$?"
cat "$OUT/apply.out"
```

3. Read the diff against the saved copy.

```bash
diff "$OUT/spec.before.md" specs/legacy-track/001-anchor-packet/spec.md
```

4. Run the repair again on the repaired document.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair --folder specs/legacy-track/001-anchor-packet
```

### Expected

Step 2 prints `exit=0`, then `repaired` lines for the rename at line 23 and the questions move from line 10, then `anchor repair: documents=1 repaired=1 findings=2`. Step 3 shows four diff hunks, `10d9`, `11a11`, `23c23` and `27c27`. Together they move the `questions` opener from line 10 to line 11, directly above the OPEN QUESTIONS heading, and rename the second `problem-2` opener and closer on lines 23 and 27 to `problem-2-2`. No other line changes. Step 4 prints `anchor repair: documents=1 repairable=0 findings=0`.

### Evidence

- The exit code and the full text of `$OUT/apply.out` from step 2.
- The diff output from step 3.
- The summary line from step 4.

### Pass / Fail

- **Pass**: The apply exits 0, the diff touches only the anchor lines named above, and step 4 prints `repairable=0 findings=0`.
- **Fail**: The apply exits non-zero, the diff changes any other line, or step 4 still reports a repair.

### Failure Triage

If the diff shows changes in the heading or body text, the repair edited content rather than anchors, so record FAIL and keep `$OUT/apply.out`. If step 4 still reports a repair, the first apply did not write the file, so check the step 2 output for the `repaired` lines. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [heal-spec-docs-anchor-repair.md](../../feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md)
- Implementation: [heal-spec-docs.cjs](../../runtime/cli/spec/heal-spec-docs.cjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair --roots specs --apply

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 470
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/heal-spec-docs-anchor-repair-apply.md`
