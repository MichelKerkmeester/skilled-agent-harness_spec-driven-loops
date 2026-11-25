---
title: "SKD-014 -- Apply removes the upstream array items a removeItems names"
description: "This scenario validates that a json-entry removeItems operation deletes the named items from an upstream array while every other byte of the file stays as JSON.stringify wrote it, that a second apply changes nothing, and that status reads the file as in sync and notes a name the pinned copy never held without failing."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-014 -- Apply removes the upstream array items a removeItems names

This file is the canonical operator contract for the array items a `json-entry` overlay removes from an upstream file.

---

## 1. OVERVIEW

This scenario verifies that `apply` deletes the items a `removeItems` operation names from the live array, that the file keeps the layout it had, that a second `apply` reports `0 changed`, and that `status` reads the destination as in sync and prints one `NOTE` for a name the pinned copy does not hold.

### Why This Matters

A project that only wants to drop a few entries from an upstream file should not have to carry the whole file as an overlay, because every upstream change to that file would then need carrying by hand. The removal has to leave every other line as upstream wrote it, or the diff against the pin grows with each apply. A name that matches nothing is most often an item upstream already dropped, so it has to be visible without stopping the run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a removeItems drops the named items with the rest of the file unchanged, that a second apply is a no-op, and that a name the pin never held is a note.
- Real user request: `my vendored utcp config still lists manuals we do not use and i do not want to carry the whole file`
- Prompt: `my vendored utcp config still lists manuals we do not use and i do not want to carry the whole file`
- Expected execution process: Build a temporary tree and a pinned upstream checkout that both hold a three-manual `.utcp_config.json`, add a `json-entry` overlay whose entry set removes `notion` and a name the file never held, apply twice, read the manual names, run `status` and compare the file with the bytes `JSON.stringify` writes for it.
- Expected signals: Step 12 prints `1 changed` and step 13 prints `0`. Step 14 prints `code-mode,figma`. Step 15 prints `0 changed` and step 16 prints `0`. Step 17 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then `NOTE     utcp-config: removeItems of "absent" at manual_call_templates finds no such item in the pinned copy, so it removes nothing; drop it from the operation's items`, then `RESULT: PASSED`, and step 18 prints `0`. Step 19 prints `true`.
- Desired user-visible outcome: The live array holds the upstream items the project keeps, in upstream's layout, and the stray name is reported in one line.
- Pass/fail: PASS if step 14 prints `code-mode,figma`, step 15 prints `0 changed`, step 17 prints the one `NOTE` line naming `absent` and `RESULT: PASSED`, and step 19 prints `true`. FAIL if `notion` stays in the array, the second apply changes the file, status reads the file as anything but in sync, the missing name fails the run or goes unnoted, or step 19 prints `false`. SKIP when Node or git is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `U=$(mktemp -d)`.
3. Run `mkdir -p "$T/skilled-overlays/root"`.
4. Run `SEED=$(node -e 'process.stdout.write(JSON.stringify({manual_call_templates:["code-mode","notion","figma"].map((name)=>({name,call_template_type:"mcp"}))}, null, 2))')`.
5. Run `printf '%s\n' "$SEED" > "$T/.utcp_config.json"`.
6. Run `cp "$T/.utcp_config.json" "$U/.utcp_config.json"`.
7. Run `git -C "$U" init -q && git -C "$U" add -f .utcp_config.json && git -C "$U" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin`.
8. Run `PIN=$(git -C "$U" rev-parse HEAD)`.
9. Run `PINNED=$(node -e 'const c=require("node:crypto"),fs=require("node:fs");process.stdout.write(c.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex"))' "$T/.utcp_config.json")`.
10. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$U\",\"commit\":\"$PIN\"},\"layoutLinks\":[],\"overlays\":[{\"id\":\"utcp-config\",\"scope\":\"json-entry\",\"source\":\"root/utcp_config.json\",\"destination\":\".utcp_config.json\",\"pinnedSha256\":\"$PINNED\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
11. Run `printf '%s\n' '{"target":".utcp_config.json","style":{"indent":2,"primitiveArrays":"inline"},"operations":[{"op":"removeItems","path":["manual_call_templates"],"identityKey":"name","items":["notion","absent"]}]}' > "$T/skilled-overlays/root/utcp_config.json"`.
12. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
13. Run `echo $?`.
14. Run `node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).manual_call_templates.map((m)=>m.name).join(","))' "$T/.utcp_config.json"`.
15. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
16. Run `echo $?`.
17. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
18. Run `echo $?`.
19. Run `node -e 'const fs=require("node:fs");const t=fs.readFileSync(process.argv[1],"utf8");console.log(t===JSON.stringify(JSON.parse(t),null,2)+"\n")' "$T/.utcp_config.json"`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-014 | Removing upstream array items | Prove a removeItems drops the named items with the rest of the file unchanged, that a second apply is a no-op, and that a name the pin never held is a note. | `my vendored utcp config still lists manuals we do not use and i do not want to carry the whole file` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: U=$(mktemp -d)` -> 3. `bash: mkdir -p "$T/skilled-overlays/root"` -> 4. `bash: SEED=$(node -e 'process.stdout.write(JSON.stringify({manual_call_templates:["code-mode","notion","figma"].map((name)=>({name,call_template_type:"mcp"}))}, null, 2))')` -> 5. `bash: printf '%s\n' "$SEED" > "$T/.utcp_config.json"` -> 6. `bash: cp "$T/.utcp_config.json" "$U/.utcp_config.json"` -> 7. `bash: git -C "$U" init -q && git -C "$U" add -f .utcp_config.json && git -C "$U" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin` -> 8. `bash: PIN=$(git -C "$U" rev-parse HEAD)` -> 9. `bash: PINNED=$(node -e 'const c=require("node:crypto"),fs=require("node:fs");process.stdout.write(c.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex"))' "$T/.utcp_config.json")` -> 10. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$U\",\"commit\":\"$PIN\"},\"layoutLinks\":[],\"overlays\":[{\"id\":\"utcp-config\",\"scope\":\"json-entry\",\"source\":\"root/utcp_config.json\",\"destination\":\".utcp_config.json\",\"pinnedSha256\":\"$PINNED\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 11. `bash: printf '%s\n' '{"target":".utcp_config.json","style":{"indent":2,"primitiveArrays":"inline"},"operations":[{"op":"removeItems","path":["manual_call_templates"],"identityKey":"name","items":["notion","absent"]}]}' > "$T/skilled-overlays/root/utcp_config.json"` -> 12. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 13. `bash: echo $?` -> 14. `bash: node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).manual_call_templates.map((m)=>m.name).join(","))' "$T/.utcp_config.json"` -> 15. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 16. `bash: echo $?` -> 17. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 18. `bash: echo $?` -> 19. `bash: node -e 'const fs=require("node:fs");const t=fs.readFileSync(process.argv[1],"utf8");console.log(t===JSON.stringify(JSON.parse(t),null,2)+"\n")' "$T/.utcp_config.json"` | Step 12 prints `1 changed` and step 13 prints `0`. Step 14 prints `code-mode,figma`. Step 15 prints `0 changed` and step 16 prints `0`. Step 17 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then `NOTE     utcp-config: removeItems of "absent" at manual_call_templates finds no such item in the pinned copy, so it removes nothing; drop it from the operation's items`, then `RESULT: PASSED`, and step 18 prints `0`. Step 19 prints `true`. | The two apply reports with their exit statuses, the manual names after the first apply, the status report with its exit status and the layout check. | PASS if step 14 prints `code-mode,figma`, step 15 prints `0 changed`, step 17 prints the one `NOTE` line naming `absent` and `RESULT: PASSED`, and step 19 prints `true`. FAIL if `notion` stays in the array, the second apply changes the file, status reads the file as anything but in sync, the missing name fails the run or goes unnoted, or step 19 prints `false`. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that step 7 committed `.utcp_config.json` in the checkout, since without the pinned commit status skips the check that judges the missing name. 2. Check that step 9 hashed the same seed bytes step 5 wrote, since a mismatch makes the first apply refuse. 3. Read the engine's `planRemoveItems` and `removalEdit`. 4. Escalate with both apply reports, the status report, the names and the exit statuses. |

### Evidence Review

Step 14 carries the removal itself, since the array holds the two manuals the entry set keeps and nothing else. Step 19 carries the layout claim, because the file equals the bytes `JSON.stringify` writes for its parsed value only when the removal took the comma with the item and left every other line alone. Step 15 carries idempotence, and step 17 carries both the in-sync reading and the note: `notion` is not noted because the pin holds it and the overlay removed it, while `absent` is noted because the pin never held it.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `removeItems` operation, its layout rule and its note. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs` | The regression test that pins the removal, the layout and the note. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/removed-items-leave-the-file.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
