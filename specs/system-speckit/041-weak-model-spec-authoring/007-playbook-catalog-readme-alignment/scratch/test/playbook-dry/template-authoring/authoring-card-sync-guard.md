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
