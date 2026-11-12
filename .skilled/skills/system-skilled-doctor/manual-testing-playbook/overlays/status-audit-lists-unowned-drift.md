---
title: "SKD-010 -- Audit lists the vendored drift no overlay owns"
description: "This scenario validates that plain status passes on a tree that has drifted from its pin, and that status --audit prints one AUDIT line for an unowned vendored file whose bytes differ from upstream and one for a tracked file upstream never had, prints audit=2 and fails."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-010 -- Audit lists the vendored drift no overlay owns

This file is the canonical operator contract for the audit of a vendored tree.

---

## 1. OVERVIEW

This scenario verifies that plain `status` passes on a tree whose vendored files have drifted from the pin, that `status --audit` prints one `AUDIT` line for a vendored file no overlay owns whose bytes differ from upstream and one for a tracked file upstream never had, that it prints `audit=2` and fails, and that the owned path and the generated output are not listed.

### Why This Matters

The write checks judge a write as it is made. A file edited by hand, or by a tool that never asked the guard, leaves every overlay destination in sync, so plain status still reports a settled tree. The audit is the one report that compares the tree with the pin, so an operator needs to see that it stays quiet for the paths an overlay or a generator owns and that one finding is enough to fail the run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the audit names the unowned drift, counts it and fails while plain status stays quiet.
- Real user request: `list the vendored files that drifted from upstream without an agent touching them`
- Prompt: `list the vendored files that drifted from upstream without an agent touching them`
- Expected execution process: Build a temporary workspace holding an upstream checkout at a pin and a tree whose copy has drifted, apply the overlays, commit the tree with one stray file upstream never had, then run plain status and the audit.
- Expected signals: Step 17 prints `1 changed` and exits 0. Step 22 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=2 ok=2 miss=0` and `RESULT: PASSED`, and step 23 prints `0`. Step 24 prints that same count line, then `AUDIT    differs .skilled/skills/hub/b.md`, then `AUDIT    extra .skilled/skills/hub/stray.md`, then `audit=2`, then `checked=2 ok=2 miss=0` and `RESULT: FAILED`, and step 25 prints `1`.
- Desired user-visible outcome: The operator gets one list of the drift no overlay owns, with the owned path and the generated output left out.
- Pass/fail: PASS if step 22 exits 0 with `RESULT: PASSED` and no `AUDIT` or `audit=` line, and step 24 prints exactly those two `AUDIT` lines, `audit=2` and `RESULT: FAILED` with step 25 printing `1`. FAIL if the plain status prints an `AUDIT` or `audit=` line, either audit line is absent or names another path, the owned file or the generated output is listed, or the audit exits 0. SKIP when Node or git is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `W=$(mktemp -d)`.
2. Run `T="$W/tree"`.
3. Run `mkdir -p "$W/upstream/.skilled/skills/hub" "$W/upstream/.skilled/gen" "$T/.skilled/skills/hub" "$T/.skilled/gen" "$T/skilled-overlays/skilled/skills/hub"`.
4. Run `printf 'b upstream\n' > "$W/upstream/.skilled/skills/hub/b.md"`.
5. Run `printf 'owned upstream\n' > "$W/upstream/.skilled/skills/hub/owned.md"`.
6. Run `printf '{"out": "upstream"}\n' > "$W/upstream/.skilled/gen/out.json"`.
7. Run `git -C "$W/upstream" init -q`.
8. Run `git -C "$W/upstream" add -A`.
9. Run `git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one`.
10. Run `PIN=$(git -C "$W/upstream" rev-parse HEAD)`.
11. Run `printf 'b edited in the tree\n' > "$T/.skilled/skills/hub/b.md"`.
12. Run `printf 'owned upstream\n' > "$T/.skilled/skills/hub/owned.md"`.
13. Run `printf '{"out": "generated here"}\n' > "$T/.skilled/gen/out.json"`.
14. Run `printf 'owned from the overlay\n' > "$T/skilled-overlays/skilled/skills/hub/owned.md"`.
15. Run `printf 'skilled-overlays/sync-state.json\nskilled-overlays/.build-lock\n' > "$T/.gitignore"`.
16. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"generated\":[\".skilled/gen/**\"],\"layoutLinks\":[],\"overlays\":[{\"id\":\"owned-file\",\"scope\":\"file\",\"source\":\"skilled/skills/hub/owned.md\",\"destination\":\".skilled/skills/hub/owned.md\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
17. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
18. Run `printf 'no upstream copy\n' > "$T/.skilled/skills/hub/stray.md"`.
19. Run `git -C "$T" init -q`.
20. Run `git -C "$T" add -A`.
21. Run `git -C "$T" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m vendored`.
22. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
23. Run `echo $?`.
24. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --audit --root "$T"`.
25. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-010 | Auditing the vendored tree | Prove the audit names the unowned drift, counts it and fails while plain status stays quiet. | `list the vendored files that drifted from upstream without an agent touching them` | 1. `bash: W=$(mktemp -d)` -> 2. `bash: T="$W/tree"` -> 3. `bash: mkdir -p "$W/upstream/.skilled/skills/hub" "$W/upstream/.skilled/gen" "$T/.skilled/skills/hub" "$T/.skilled/gen" "$T/skilled-overlays/skilled/skills/hub"` -> 4. `bash: printf 'b upstream\n' > "$W/upstream/.skilled/skills/hub/b.md"` -> 5. `bash: printf 'owned upstream\n' > "$W/upstream/.skilled/skills/hub/owned.md"` -> 6. `bash: printf '{"out": "upstream"}\n' > "$W/upstream/.skilled/gen/out.json"` -> 7. `bash: git -C "$W/upstream" init -q` -> 8. `bash: git -C "$W/upstream" add -A` -> 9. `bash: git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one` -> 10. `bash: PIN=$(git -C "$W/upstream" rev-parse HEAD)` -> 11. `bash: printf 'b edited in the tree\n' > "$T/.skilled/skills/hub/b.md"` -> 12. `bash: printf 'owned upstream\n' > "$T/.skilled/skills/hub/owned.md"` -> 13. `bash: printf '{"out": "generated here"}\n' > "$T/.skilled/gen/out.json"` -> 14. `bash: printf 'owned from the overlay\n' > "$T/skilled-overlays/skilled/skills/hub/owned.md"` -> 15. `bash: printf 'skilled-overlays/sync-state.json\nskilled-overlays/.build-lock\n' > "$T/.gitignore"` -> 16. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"generated\":[\".skilled/gen/**\"],\"layoutLinks\":[],\"overlays\":[{\"id\":\"owned-file\",\"scope\":\"file\",\"source\":\"skilled/skills/hub/owned.md\",\"destination\":\".skilled/skills/hub/owned.md\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 17. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 18. `bash: printf 'no upstream copy\n' > "$T/.skilled/skills/hub/stray.md"` -> 19. `bash: git -C "$T" init -q` -> 20. `bash: git -C "$T" add -A` -> 21. `bash: git -C "$T" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m vendored` -> 22. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 23. `bash: echo $?` -> 24. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --audit --root "$T"` -> 25. `bash: echo $?` | Step 17 prints `1 changed` and exits 0. Step 22 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=2 ok=2 miss=0` and `RESULT: PASSED`. Step 23 prints `0`. Step 24 prints the same count line, then `AUDIT    differs .skilled/skills/hub/b.md`, then `AUDIT    extra .skilled/skills/hub/stray.md`, then `audit=2`, then `checked=2 ok=2 miss=0` and `RESULT: FAILED`. Step 25 prints `1`. | The two status reports with their exit statuses, the two `AUDIT` lines, the `audit=` count, and the absence of a line for the owned file and for the generated output. | PASS if step 22 exits 0 with `RESULT: PASSED` and no `AUDIT` or `audit=` line, and step 24 prints exactly those two `AUDIT` lines, `audit=2` and `RESULT: FAILED` with step 25 printing `1`. FAIL if the plain status prints an `AUDIT` or `audit=` line, either audit line is absent or names another path, the owned file or the generated output is listed, or the audit exits 0. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that step 16 wrote `pin.checkout` as the absolute path of the checkout that holds `pin.commit`, since the audit reads the pinned commit and not the working tree. 2. Check that the tree is a repository and that step 20 staged the stray file. 3. Read the engine's `auditVendoredTree` and `managedPathTest`. 4. Escalate with the two status reports, the `AUDIT` lines and the `audit=` count. |

### Evidence Review

The plain report carries the claim that no destination is out of sync, so the drift the audit finds is drift the overwrite check cannot see. The two `AUDIT` lines carry a kind and a path each: one vendored file whose bytes differ from upstream at the pin, and one tracked file upstream never had. `audit=2` carries the count, so a third finding would show as another line and another number. The failing result carries the claim that one finding is enough to fail the status. The absent line for `owned.md` and the absent line for `out.json` carry the claim that an overlay and a generator are not drift.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The three `AUDIT` kinds, the `audit=` count and the paths the audit leaves alone. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the three kinds and the quiet plain status. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/status-audit-lists-unowned-drift.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
