---
title: "479 -- Example drift guard catches a leaked description"
description: "This scenario validates that the example drift guard passes a clean tree and fails a copy whose description holds a leaked comment tail."
version: 1.0.0.0
id: template-authoring-example-drift-guard-catches-leak
---

# 479 -- Example drift guard catches a leaked description

## 1. OVERVIEW

This scenario validates the read-only example drift guard. The guard compares every hand-written example with its template and checks the description line. The scenario runs the guard on the clean tree, injects a leaked comment tail into one copy of an example, and runs the guard on that copy.

### Why This Matters

A weak model copies an example. A description that keeps the end of an HTML comment teaches the model to write a broken frontmatter line. The guard turns that defect into a failed command instead of a copy that spreads.

---

## 2. SCENARIO CONTRACT

Operators run the guard twice, once on the clean tree and once on a copy with one injected leak.

- Objective: Prove that the guard prints `EXAMPLE_DRIFT_OK` and exits 0 on the clean tree, and prints a description failure and exits 1 on the copy.
- Playbook ID: 479.
- Real user request: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Prompt: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Preconditions: A checkout with Node, bash and perl on PATH, and phase 4 closed so `runtime/cli/spec/check-example-drift.sh` exists. The scenario needs no network.
- Expected execution process: Run the guard on the tree, copy one example into a scratch folder, inject a leaked comment tail into its description, run the guard on the scratch folder, then remove the scratch folder.
- Expected signals: The clean run prints `EXAMPLE_DRIFT_OK` and exits 0. The broken run prints one line with `description holds an HTML comment tail` and exits 1. The broken run does not print `EXAMPLE_DRIFT_OK`.
- Desired user-visible outcome: The operator sees the guard accept the tree and reject the injected defect.
- Pass/fail: PASS if the clean run exits 0 with `EXAMPLE_DRIFT_OK` and the broken run exits 1 with the description failure. FAIL if either run returns the other verdict.

---

## 3. TEST EXECUTION

### Prompt

```
Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Run the guard on the clean tree.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh > "$OUT/clean.txt" 2>&1
echo "clean_exit=$?"
tail -1 "$OUT/clean.txt"
```

2. Copy one example into a scratch folder and inject a leaked comment tail.

```bash
T="$OUT/examples"
mkdir -p "$T/level-2"
cp .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md "$T/level-2/"
perl -0pi -e 's/^(description: ")([^"]*)(")$/$1$2 leaked -->$3/m' "$T/level-2/acceptance-criteria.md"
grep -m1 '^description:' "$T/level-2/acceptance-criteria.md"
```

3. Run the guard on the scratch copy.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh "$T" > "$OUT/broken.txt" 2>&1
echo "broken_exit=$?"
grep -c 'description holds an HTML comment tail' "$OUT/broken.txt"
grep -c 'EXAMPLE_DRIFT_OK' "$OUT/broken.txt"
```

4. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `clean_exit=0`, then `EXAMPLE_DRIFT_OK`. Step 2 prints a description line that ends with `leaked -->"`. Step 3 prints `broken_exit=1`, then `1`, then `0`. Step 4 prints `cleanup=ok`.

### Evidence

- The exit code and the last line from step 1.
- The injected description line from step 2.
- The exit code, the failure count and the `EXAMPLE_DRIFT_OK` count from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The clean run exits 0 with `EXAMPLE_DRIFT_OK`, and the broken run exits 1 with exactly one description failure and no `EXAMPLE_DRIFT_OK`.
- **Fail**: The clean run fails, the broken run passes, or the failure count is not 1.

### Failure Triage

A clean failure means the tree already holds drift, so read `$OUT/clean.txt` and fix that before this scenario. A broken run that passes means the injection did not match, so read the description line from step 2. A count of 0 for the failure line means the guard changed its message, so read `$OUT/broken.txt` and report the new wording.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [example-drift-guard.md](../../feature-catalog/tooling-and-scripts/example-drift-guard.md)
- Implementation: [check-example-drift.sh](../../runtime/cli/spec/check-example-drift.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 479
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/example-drift-guard-catches-leak.md`
