---
title: "480 -- Golden render of every level"
description: "This scenario validates that every level renders to the stored golden snapshots and that each document keeps its frozen anchor count."
version: 1.0.0.0
id: template-authoring-golden-render-all-levels
---

# 480 -- Golden render of every level

## 1. OVERVIEW

This scenario validates the two template guards phase 4 adds. The golden test renders every level and compares the result with a stored snapshot. The fill guidance test renders every level and document and checks the anchor count and the one fill line per section. The scenario runs both and reads their test counts.

### Why This Matters

A fill instruction sits inside a template that a renderer prunes. A change that reads well in the source can alter the rendered shape, move an anchor or drop a section. The stored snapshots catch the shape change, and the anchor counts catch the structural change.

---

## 2. SCENARIO CONTRACT

Operators run both template guards and read the pass counts.

- Objective: Prove that the golden render prints `12 passed` and the fill guidance test prints `16 passed` without a snapshot update.
- Playbook ID: 480.
- Real user request: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Prompt: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Preconditions: A checkout with Node and the installed `node_modules` under `.skilled/skills/system-spec-kit`, and phase 4 closed so both test files exist. The scenario needs no network.
- Expected execution process: Run the golden test without a snapshot update, then run the fill guidance test, then read the `Tests` line from each run.
- Expected signals: The golden run prints `Tests  12 passed (12)`. The fill run prints `Tests  16 passed (16)`. Neither run prints `failed`.
- Desired user-visible outcome: The operator sees both guards green on the unchanged tree.
- Pass/fail: PASS if both runs print their expected pass count and neither prints a failure. FAIL if a run fails or updates a snapshot.

---

## 3. TEST EXECUTION

### Prompt

```
Render every level and confirm the stored snapshots still match and every document still holds its anchors.
```

### Commands

Run the commands from the checkout root in one shell session. The `cd` runs in a subshell so the checkout root stays current.

1. Run the golden render test without a snapshot update.

```bash
OUT="$(mktemp -d)"
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts ) > "$OUT/golden.txt" 2>&1
echo "golden_exit=$?"
grep -E '^ *Tests +12 passed' "$OUT/golden.txt"
grep -c 'failed' "$OUT/golden.txt"
```

2. Run the fill guidance test.

```bash
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts ) > "$OUT/fill.txt" 2>&1
echo "fill_exit=$?"
grep -E '^ *Tests +16 passed' "$OUT/fill.txt"
grep -c 'failed' "$OUT/fill.txt"
```

3. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `golden_exit=0`, then the `Tests  12 passed (12)` line, then `0`. Step 2 prints `fill_exit=0`, then the `Tests  16 passed (16)` line, then `0`. Step 3 prints `cleanup=ok`.

### Evidence

- The exit code, the `Tests` line and the `failed` count from step 1.
- The exit code, the `Tests` line and the `failed` count from step 2.
- The `cleanup=ok` line from step 3.

### Pass / Fail

- **Pass**: Both runs exit 0, the golden run prints `12 passed`, the fill run prints `16 passed`, and neither output holds the word `failed`.
- **Fail**: A run exits non-zero, a pass count differs, or a failure line appears.

### Failure Triage

A snapshot mismatch means a template change altered the render, so read the diff in `$OUT/golden.txt` and fix the template rather than updating the snapshot. A fill failure names the section that lacks one fill line, so read `$OUT/fill.txt`. A missing test file means phase 4 is not closed, so stop and report it.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [template-section-fill-guidance.md](../../feature-catalog/tooling-and-scripts/template-section-fill-guidance.md)
- Implementation: [scaffold-golden-snapshots.vitest.ts](../../runtime/cli/tests/scaffold-golden-snapshots.vitest.ts)

Provenance: manual only - cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 480
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/golden-render-all-levels.md`
