---
title: "SKD-012 -- Apply removes an appended item its entry set drops"
description: "This scenario validates that a json-entry overlay appends the two items its entry set lists and writes both down as the items it added, that apply removes one of them from the live array once the entry set drops it, and that a dropped item edited by hand after it was applied makes apply refuse with a line that names it."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-012 -- Apply removes an appended item its entry set drops

This file is the canonical operator contract for the array items a `json-entry` overlay appends and later drops.

---

## 1. OVERVIEW

This scenario verifies that `apply` appends the two items a `json-entry` entry set lists to the live array and records them in `sync-state.json`, that a later `apply` with one of those items dropped from the entry set removes it from the live file and drops its record, and that an item edited by hand after it was applied makes `apply` refuse with a line that names the item and leaves the live file as it was.

### Why This Matters

The entry set is the only list of what the overlay owns, so an item it drops is an item the project no longer wants. Left in place, that item sits in the live file with nothing describing it, and the next reader cannot tell it from a line upstream ships. A hand edit to the same item before the drop is the other case, because the file then holds words a person wrote and deleting them quietly would lose work. The engine answers both cases with a removal it can account for or a refusal that names the item, and an operator needs to see both from the same fixture.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a dropped appended item leaves the live file and that a hand-edited one is refused by name.
- Real user request: `an overlay item i appended is still in my registry file after i dropped it from the overlay`
- Prompt: `an overlay item i appended is still in my registry file after i dropped it from the overlay`
- Expected execution process: Build a temporary tree holding one `json-entry` overlay, apply an entry set that appends two keyed items, read the live array and the record, apply an entry set that keeps one item, then put both back, edit one item by hand and drop it from the entry set, and apply once more.
- Expected signals: Step 8 prints `1 changed` and step 9 prints `0`. Step 10 prints `alpha,beta` and step 11 prints `session-start:SessionStart,alpha:Alpha,beta:Beta`. Step 13 prints `1 changed` and step 14 prints `0`. Step 15 prints `session-start:SessionStart,alpha:Alpha` and step 16 prints `alpha`. Step 18 prints `1 changed` and step 19 prints `0`. Step 21 prints `session-start:SessionStart,alpha:Alpha,beta:Edited`. Step 23 prints `both-changed registry.json  (overlay: skilled-overlays/json/registry.json)  fix: resolve skilled-overlays/json/registry.json and registry.json, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs status`, then one refusal line that opens with the engine's blocked marker, `hook-registry: cannot apply the entry set to registry.json: dropped entry "beta" was edited after it was applied; remove it by hand or restore it in the entry set`, and step 24 prints `1`. Step 25 prints the same list as step 21.
- Desired user-visible outcome: The live array holds exactly the items the entry set lists, and a hand edit is never deleted without being named.
- Pass/fail: PASS if step 15 prints the kept list with no `beta`, step 16 records only `alpha`, and step 23 prints the refusal line naming `beta` with step 24 printing `1` and step 25 leaving the edited item in place. FAIL if a dropped item stays in the live array, its record survives the drop, the edited item is deleted or renamed, or the third apply exits 0. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `mkdir -p "$T/skilled-overlays/json"`.
3. Run `SEED=$(node -e 'process.stdout.write(JSON.stringify({hooks:[{id:"session-start",event:"SessionStart"}]}, null, 2))')`.
4. Run `printf '%s\n' "$SEED" > "$T/registry.json"`.
5. Run `PINNED=$(node -e 'const c=require("node:crypto"),fs=require("node:fs");process.stdout.write(c.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex"))' "$T/registry.json")`.
6. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"commit\":\"pin-one\"},\"layoutLinks\":[],\"overlays\":[{\"id\":\"hook-registry\",\"scope\":\"json-entry\",\"source\":\"json/registry.json\",\"destination\":\"registry.json\",\"pinnedSha256\":\"$PINNED\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
7. Run `printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"},{"id":"beta","event":"Beta"}]}]}' > "$T/skilled-overlays/json/registry.json"`.
8. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
9. Run `echo $?`.
10. Run `node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(s.items["registry.json"].map((r)=>r.item.id).join(","))' "$T/skilled-overlays/sync-state.json"`.
11. Run `node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"`.
12. Run `printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"}]}]}' > "$T/skilled-overlays/json/registry.json"`.
13. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
14. Run `echo $?`.
15. Run `node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"`.
16. Run `node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(s.items["registry.json"].map((r)=>r.item.id).join(","))' "$T/skilled-overlays/sync-state.json"`.
17. Run `printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"},{"id":"beta","event":"Beta"}]}]}' > "$T/skilled-overlays/json/registry.json"`.
18. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
19. Run `echo $?`.
20. Run `node -e 'const fs=require("node:fs");const p=process.argv[1];fs.writeFileSync(p,fs.readFileSync(p,"utf8").replace("\"Beta\"","\"Edited\""))' "$T/registry.json"`.
21. Run `node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"`.
22. Run `printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"}]}]}' > "$T/skilled-overlays/json/registry.json"`.
23. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
24. Run `echo $?`.
25. Run `node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-012 | Removing a dropped appended item | Prove a dropped appended item leaves the live file and that a hand-edited one is refused by name. | `an overlay item i appended is still in my registry file after i dropped it from the overlay` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/skilled-overlays/json"` -> 3. `bash: SEED=$(node -e 'process.stdout.write(JSON.stringify({hooks:[{id:"session-start",event:"SessionStart"}]}, null, 2))')` -> 4. `bash: printf '%s\n' "$SEED" > "$T/registry.json"` -> 5. `bash: PINNED=$(node -e 'const c=require("node:crypto"),fs=require("node:fs");process.stdout.write(c.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex"))' "$T/registry.json")` -> 6. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"commit\":\"pin-one\"},\"layoutLinks\":[],\"overlays\":[{\"id\":\"hook-registry\",\"scope\":\"json-entry\",\"source\":\"json/registry.json\",\"destination\":\"registry.json\",\"pinnedSha256\":\"$PINNED\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 7. `bash: printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"},{"id":"beta","event":"Beta"}]}]}' > "$T/skilled-overlays/json/registry.json"` -> 8. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 9. `bash: echo $?` -> 10. `bash: node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(s.items["registry.json"].map((r)=>r.item.id).join(","))' "$T/skilled-overlays/sync-state.json"` -> 11. `bash: node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"` -> 12. `bash: printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"}]}]}' > "$T/skilled-overlays/json/registry.json"` -> 13. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 14. `bash: echo $?` -> 15. `bash: node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"` -> 16. `bash: node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(s.items["registry.json"].map((r)=>r.item.id).join(","))' "$T/skilled-overlays/sync-state.json"` -> 17. `bash: printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"},{"id":"beta","event":"Beta"}]}]}' > "$T/skilled-overlays/json/registry.json"` -> 18. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 19. `bash: echo $?` -> 20. `bash: node -e 'const fs=require("node:fs");const p=process.argv[1];fs.writeFileSync(p,fs.readFileSync(p,"utf8").replace("\"Beta\"","\"Edited\""))' "$T/registry.json"` -> 21. `bash: node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"` -> 22. `bash: printf '%s\n' '{"target":"registry.json","style":{"indent":2,"primitiveArrays":"multiline"},"operations":[{"op":"appendItems","path":["hooks"],"identityKey":"id","items":[{"id":"alpha","event":"Alpha"}]}]}' > "$T/skilled-overlays/json/registry.json"` -> 23. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 24. `bash: echo $?` -> 25. `bash: node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).hooks.map((h)=>h.id+":"+h.event).join(","))' "$T/registry.json"` | Step 8 prints `1 changed` and step 9 prints `0`. Step 10 prints `alpha,beta`, so both appended items are recorded, and step 11 prints `session-start:SessionStart,alpha:Alpha,beta:Beta`. Step 13 prints `1 changed` and step 14 prints `0`. Step 15 prints `session-start:SessionStart,alpha:Alpha`, so the dropped item is gone from the live array, and step 16 prints `alpha`. Step 18 prints `1 changed` and step 19 prints `0`. Step 21 prints `session-start:SessionStart,alpha:Alpha,beta:Edited`. Step 23 prints `both-changed registry.json  (overlay: skilled-overlays/json/registry.json)  fix: resolve skilled-overlays/json/registry.json and registry.json, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs status`, then one refusal line that opens with the engine's blocked marker, `hook-registry: cannot apply the entry set to registry.json: dropped entry "beta" was edited after it was applied; remove it by hand or restore it in the entry set`, and step 24 prints `1`. Step 25 prints the same list as step 21, so the edited item is still in the file. | The two apply reports with their exit statuses, the record list after each apply, the live item list after each apply, the refusal line and the unchanged list after the refusal. | PASS if step 15 prints the kept list with no `beta`, step 16 records only `alpha`, and step 23 prints the refusal line naming `beta` with step 24 printing `1` and step 25 leaving the edited item in place. FAIL if a dropped item stays in the live array, its record survives the drop, the edited item is deleted or renamed, or the third apply exits 0. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that step 5 hashed the same seed bytes step 4 wrote, since the manifest's `pinnedSha256` is the live file's starting bytes and a mismatch makes every apply refuse. 2. Check that steps 7 and 12 wrote an entry set whose single `appendItems` operation names `identityKey` `id`, since an item with no identity key is never recorded. 3. Read the engine's `removeDroppedItems` and `recordedArrayAt`. 4. Escalate with the three apply reports, the record lists, the live item lists and the exit statuses. |

### Evidence Review

The record list in step 10 carries the claim that both appended items were written down as this overlay's, because an item with no record cannot be retracted later. Step 15 carries the removal itself, since the live array holds upstream's own item and the kept item and nothing else, and step 16 carries the claim that the record went with it, which is why the next apply has nothing left to retract. Step 23 carries the refusal with the identity the entry set dropped, and step 25 carries the claim that the file was left alone rather than partly written. One refusal line and not a list matters here, because the operator has to be able to find the item the engine would not delete.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `items` record, the removal of a dropped item and the refusal of an edited one. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the removal and the refusal. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/dropped-item-is-removed.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
