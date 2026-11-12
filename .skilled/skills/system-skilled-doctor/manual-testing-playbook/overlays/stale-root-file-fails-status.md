---
title: "SKD-011 -- Status names a root file upstream changed since the pin"
description: "This scenario validates that status passes while an overlay's pinned root file still matches upstream's copy at the pin, and that status prints one STALE root-file line and fails once a re-pin moves the pin onto a commit that changed that file."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-011 -- Status names a root file upstream changed since the pin

This file is the canonical operator contract for a root file an overlay owns whose upstream copy has moved on.

---

## 1. OVERVIEW

This scenario verifies that `status` passes on a tree whose one file overlay owns `AGENTS.md`, a path named in `repin.rootFiles`, while the overlay's `pinnedSha256` still matches upstream's copy at the pin, and that after a re-pin moves the pin onto a commit that changed `AGENTS.md` the same `status` prints one `STALE    root-file` line and fails.

### Why This Matters

A re-pin never copies a root file, so the project's own `AGENTS.md` keeps its bytes while upstream moves on. The overlay that owns it records the upstream bytes it was written against, and status is the one place that compares that record with the pin between re-pins. Without the line the tree looks settled until someone rebases the overlay by hand, and without the failure the check would pass a tree whose overlay is out of date.

---

## 2. SCENARIO CONTRACT

- Objective: Prove status passes while the pinned root file matches upstream and reports it stale once the pin moves on.
- Real user request: `why does status call my agents overlay stale after a re-pin`
- Prompt: `why does status call my agents overlay stale after a re-pin`
- Expected execution process: Build a temporary workspace holding an upstream checkout and a tree whose file overlay owns `AGENTS.md`, apply, run status, move upstream onto a commit that changed the file, re-pin, then run status again.
- Expected signals: Step 12 prints `1 changed` and exits 0. Step 13 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=2 ok=2 miss=0` and `RESULT: PASSED`, and step 14 prints `0`. Step 19 prints the re-pin report, which holds a `not-copied AGENTS.md` line, the `root-file AGENTS.md changed upstream; rebase the overlay that owns it` line and a `backup of 3 paths in skilled-overlays/repin-runs/<stamp>` line, then `RESULT: PASSED`, and step 20 prints `0`. Step 21 prints the count line, then `STALE    root-file AGENTS.md: upstream changed it since overlay agents-file was pinned; rebase the overlay, then update its pinnedSha256`, then `checked=2 ok=2 miss=0` and `RESULT: FAILED`, and step 22 prints `1`.
- Desired user-visible outcome: The operator learns that the pin moved under the overlay, which overlay to rebase, and that the tree needs work before release.
- Pass/fail: PASS if step 13 exits 0 with `RESULT: PASSED` and no `STALE` line, step 19 holds that `root-file` line and exits 0, and step 21 prints that `STALE` line with `RESULT: FAILED` and step 22 printing `1`. FAIL if the first status holds a `STALE` line, the re-pin report lacks the `root-file` line, the second status lacks the `STALE` line or names another overlay, or either status exits on the wrong code. SKIP when Node or git is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `W=$(mktemp -d)`.
2. Run `T="$W/tree"`.
3. Run `mkdir -p "$T/skilled-overlays" "$W/upstream"`.
4. Run `printf 'upstream agents\n' > "$W/upstream/AGENTS.md"`.
5. Run `git -C "$W/upstream" init -q`.
6. Run `git -C "$W/upstream" add -A`.
7. Run `git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one`.
8. Run `PIN=$(git -C "$W/upstream" rev-parse HEAD)`.
9. Run `printf 'project agents\n' > "$T/skilled-overlays/AGENTS.md"`.
10. Run `printf 'upstream agents\n' > "$T/AGENTS.md"`.
11. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"repin\":{\"rootFiles\":[\"AGENTS.md\"]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"agents-file\",\"scope\":\"file\",\"source\":\"AGENTS.md\",\"destination\":\"AGENTS.md\",\"pinnedSha256\":\"27d2f5308b5bf9210c97aaf21d2a88d27ddadf744a5ef3f1cc65d5bde54d7e16\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
12. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
13. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
14. Run `echo $?`.
15. Run `printf 'upstream agents v2\n' > "$W/upstream/AGENTS.md"`.
16. Run `git -C "$W/upstream" add -A`.
17. Run `git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-two`.
18. Run `TO=$(git -C "$W/upstream" rev-parse HEAD)`.
19. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --upstream "$W/upstream" --to "$TO" --root "$T"`.
20. Run `echo $?`.
21. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
22. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-011 | A root file upstream moved on from | Prove status passes while the pinned root file matches upstream and reports it stale once the pin moves on. | `why does status call my agents overlay stale after a re-pin` | 1. `bash: W=$(mktemp -d)` -> 2. `bash: T="$W/tree"` -> 3. `bash: mkdir -p "$T/skilled-overlays" "$W/upstream"` -> 4. `bash: printf 'upstream agents\n' > "$W/upstream/AGENTS.md"` -> 5. `bash: git -C "$W/upstream" init -q` -> 6. `bash: git -C "$W/upstream" add -A` -> 7. `bash: git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one` -> 8. `bash: PIN=$(git -C "$W/upstream" rev-parse HEAD)` -> 9. `bash: printf 'project agents\n' > "$T/skilled-overlays/AGENTS.md"` -> 10. `bash: printf 'upstream agents\n' > "$T/AGENTS.md"` -> 11. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"repin\":{\"rootFiles\":[\"AGENTS.md\"]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"agents-file\",\"scope\":\"file\",\"source\":\"AGENTS.md\",\"destination\":\"AGENTS.md\",\"pinnedSha256\":\"27d2f5308b5bf9210c97aaf21d2a88d27ddadf744a5ef3f1cc65d5bde54d7e16\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 12. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 13. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 14. `bash: echo $?` -> 15. `bash: printf 'upstream agents v2\n' > "$W/upstream/AGENTS.md"` -> 16. `bash: git -C "$W/upstream" add -A` -> 17. `bash: git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-two` -> 18. `bash: TO=$(git -C "$W/upstream" rev-parse HEAD)` -> 19. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --upstream "$W/upstream" --to "$TO" --root "$T"` -> 20. `bash: echo $?` -> 21. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 22. `bash: echo $?` | Step 12 prints `1 changed` and exits 0. Step 13 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=2 ok=2 miss=0` and `RESULT: PASSED`. Step 14 prints `0`. Step 19 prints the re-pin report, which holds a `not-copied AGENTS.md` line, `root-file AGENTS.md changed upstream; rebase the overlay that owns it` and a `backup of 3 paths in skilled-overlays/repin-runs/<stamp>` line, then `RESULT: PASSED`. Step 20 prints `0`. Step 21 prints the count line, then `STALE    root-file AGENTS.md: upstream changed it since overlay agents-file was pinned; rebase the overlay, then update its pinnedSha256`, then `checked=2 ok=2 miss=0` and `RESULT: FAILED`. Step 22 prints `1`. | The two status reports with their exit statuses, the re-pin report, and the `STALE` line that names the path and the overlay. | PASS if step 13 exits 0 with `RESULT: PASSED` and no `STALE` line, step 19 holds that `root-file` line and exits 0, and step 21 prints that `STALE` line with `RESULT: FAILED` and step 22 printing `1`. FAIL if the first status holds a `STALE` line, the re-pin report lacks the `root-file` line, the second status lacks the `STALE` line or names another overlay, or either status exits on the wrong code. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that `AGENTS.md` is named in `repin.rootFiles` and that `pin.checkout` holds both commits. 2. Compare the `pinnedSha256` in the manifest with the hash of the file at the old pin, since a stale report needs them to differ. 3. Read the engine's `staleRootFiles` and `pinnedUpstreamBytes`. 4. Escalate with the re-pin report, both status reports and the manifest. |

### Evidence Review

The passing status carries the claim that the live file, the overlay copy and the pin all agree, so the later failure is about the pin and not about the tree's bytes. The re-pin report carries the claim that upstream changed the file and that a re-pin cannot copy it. The `STALE` line carries the claim that the overlay's record of upstream's bytes no longer matches the pin, and it names the overlay that needs the rebase. The failing result carries the claim that this is outstanding work and not a note.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `STALE` line, `repin.rootFiles` and why a re-pin never copies a root file. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the passing and the stale reports. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/stale-root-file-fails-status.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
