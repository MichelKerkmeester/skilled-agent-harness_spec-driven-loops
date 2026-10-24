---
title: "482 -- Authoring card sync guard"
description: "This scenario validates that the card sync guard passes the changed tree and fails a disposable copy whose card is missing."
version: 1.0.0.0
id: template-authoring-authoring-card-sync-guard
---

# 482 -- Authoring card sync guard

## 1. OVERVIEW

This scenario validates the read-only card sync guard. The guard reads the card, the router, the leaf inventory files and the authoring checklist, and it fails on the first disagreement. The scenario runs it on the tree, copies the skill into a scratch folder, deletes the card from the copy and runs the guard again.

### Why This Matters

Four surfaces describe one authoring path. A reader who edits one surface alone sends the next reader down a path the other three do not describe. The guard turns that quiet drift into a failed command.

---

## 2. SCENARIO CONTRACT

Operators run the guard twice, once on the tree and once on a copy without the card.

- Objective: Prove that the guard prints nine `PASS` lines and `CARD SYNC OK` on the tree, and `FAIL card-exists` with `CARD SYNC FAILED` on the copy.
- Playbook ID: 482.
- Real user request: `Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.`
- Prompt: `Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.`
- Preconditions: A checkout with bash, rsync and `jq` on PATH, and phase 5 closed so `runtime/cli/spec/check-card-sync.sh` and the card exist. The scenario needs no network.
- Expected execution process: Run the guard on the tree, copy the skill without `node_modules` into a scratch folder, run the guard on the copy, delete the card from the copy, run the guard again, then remove the scratch folder.
- Expected signals: The tree run prints nine `PASS` lines, then `CARD SYNC OK`, and exits 0. The copy run prints `CARD SYNC OK` before the card is deleted. The broken run exits 1, prints one `FAIL card-exists` line, then `CARD SYNC FAILED`.
- Desired user-visible outcome: The operator sees the four surfaces agree and the guard refuse a copy that lost one of them.
- Pass/fail: PASS if the tree run prints nine `PASS` lines and `CARD SYNC OK`, and the broken run exits 1 with `FAIL card-exists` and `CARD SYNC FAILED`. FAIL if either run returns the other verdict.

---

## 3. TEST EXECUTION

### Prompt

```
Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Run the guard on the tree and count its pass lines.

```bash
OUT="$(mktemp -d)"
S=.skilled/skills/system-spec-kit
bash "$S/runtime/cli/spec/check-card-sync.sh" > "$OUT/clean.txt" 2>&1
echo "clean_exit=$?"
grep -c '^PASS ' "$OUT/clean.txt"
tail -1 "$OUT/clean.txt"
```

2. Copy the skill into a scratch folder and run the guard on the copy.

```bash
N="$OUT/skill"
rsync -a --exclude node_modules "$S/" "$N/"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/copy.txt" 2>&1
echo "copy_exit=$?"
tail -1 "$OUT/copy.txt"
```

3. Delete the card from the copy and run the guard again.

```bash
rm "$N/references/workflows/spec-authoring-card.md"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/broken.txt" 2>&1
echo "broken_exit=$?"
grep -c '^FAIL card-exists' "$OUT/broken.txt"
tail -1 "$OUT/broken.txt"
```

4. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `clean_exit=0`, then `9`, then `CARD SYNC OK`. Step 2 prints `copy_exit=0`, then `CARD SYNC OK`. Step 3 prints `broken_exit=1`, then `1`, then `CARD SYNC FAILED`. Step 4 prints `cleanup=ok`.

### Evidence

- The exit code, the `PASS` count and the last line from step 1.
- The exit code and the last line from step 2.
- The exit code, the failure count and the last line from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The tree run exits 0 with nine `PASS` lines and `CARD SYNC OK`, and the broken run exits 1 with one `FAIL card-exists` line and `CARD SYNC FAILED`.
- **Fail**: A pass count differs, the broken run passes, or the failure line names a different check.

### Failure Triage

A tree failure means one of the four surfaces is already out of step, so read `$OUT/clean.txt` and fix the named check before this scenario. A copy failure before the deletion means `rsync` skipped a file, so read `$OUT/copy.txt`. A broken run that passes means the card deletion did not land, so list the copy's `references/workflows/` folder.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [spec-authoring-card.md](../../feature-catalog/tooling-and-scripts/spec-authoring-card.md)
- Implementation: [check-card-sync.sh](../../runtime/cli/spec/check-card-sync.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 482
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/authoring-card-sync-guard.md`
