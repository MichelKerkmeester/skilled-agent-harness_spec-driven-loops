---
title: "OBS-018 -- meta-bind-file-layer"
description: "This scenario validates the Meta Bind file-layer contract by building a throwaway vault note with frontmatter, an INPUT field and a VIEW field bound to those keys, and a meta-bind-button block whose updateMetadata action targets a frontmatter key present in the note, then verifying the button block parses as valid YAML with an actions list and every bindTarget resolves headlessly."
stage: routing
version: "0.10.0.0"
---

# OBS-018 -- meta-bind-file-layer

## 1. OVERVIEW

This scenario validates that the mode can operate Meta Bind at the file layer: a throwaway vault note is built with frontmatter, an `INPUT[…]` editable field and a `VIEW[…]` read-only field bound to those keys, and a ` ```meta-bind-button ` block whose `updateMetadata` action targets a frontmatter key present in the note. The button block shape (valid YAML with an `actions` list) and the bind-target agreement are verified headlessly with python3, rg and git. Rendering and button clicks are in-app, observable only after a reload.

### Why This Matters

A Meta Bind widget lives or dies by bind-target agreement between the widget text and the note's frontmatter. A `bindTarget` that names a property the note does not carry renders nothing, not an error, and a malformed `meta-bind-button` block silently does nothing on click. If the mode can author the frontmatter, an `INPUT`/`VIEW` field and a button whose `updateMetadata` action references exactly those keys, and prove the agreement and the YAML shape from the files, then frontmatter-bound forms and the task-timer buttons are fully delegable to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-018
- Feature Name: Meta Bind field and button round-trip
- Scenario Objective: Build one throwaway note with frontmatter, an `INPUT` field and a `VIEW` field bound to those keys, and a `meta-bind-button` block whose `updateMetadata` action targets a frontmatter key present in the note, then verify the button block parses as valid YAML with an `actions` list and every bindTarget resolves to a frontmatter key.
- Exact Prompt: Add a Meta Bind status input and a Start Timer button to my task note that stamp the startTime frontmatter field already in the note.
- Exact Command Sequence: 1. Create the throwaway vault 2. Write the note with frontmatter and the INPUT/VIEW fields 3. Append the meta-bind-button block 4. Parse-check the button block as valid YAML with an actions list 5. Resolve every bindTarget against the note frontmatter 6. Cross-check the bind targets with rg 7. Prove exactly one note changed with git
- Expected Signals: Frontmatter parses and carries `status`, `startTime` and `endTime`; exactly one `meta-bind-button` fence pair exists; the block parses as a YAML mapping with an `actions` list whose first item has `type: updateMetadata`; every `INPUT`/`VIEW` bindTarget and every button-action `bindTarget` resolves to a frontmatter key present in the note; git status shows exactly one note.
- Evidence: Note text, python YAML parse output, rg bind-target hits, git status output.
- Pass/Fail Criteria: PASS if the button block is valid YAML with an `actions` list and every bindTarget resolves to frontmatter present in the note; FAIL if a bindTarget is misspelled, the block is malformed YAML, or a real vault file was touched; SKIP if python3 or rg are unavailable.
- Failure Triage: 1. Re-read the note and list the frontmatter keys. 2. Compare each INPUT/VIEW/button bindTarget against those keys. 3. Re-parse the `meta-bind-button` block and confirm `actions:` is a list with valid `type` values. 4. Fix the widget text or the frontmatter and re-run the checks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run entirely inside `/tmp/_pbtest-meta-bind-file-layer`. Real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never read or written. The checks prove the file layer only; a PASS never claims a rendered widget or a clicked button.

### Prompt

Add a Meta Bind status input and a Start Timer button to my task note that stamp the startTime frontmatter field already in the note.

### Commands

1. Create the throwaway vault.

   ~~~sh
   VAULT="/tmp/_pbtest-meta-bind-file-layer"
   rm -rf "$VAULT"
   mkdir -p "$VAULT/Tasks"
   ~~~

2. Write the note with frontmatter and the INPUT/VIEW fields.

   ~~~sh
   cat > "$VAULT/Tasks/Timer task.md" <<'EOF'
   ---
   title: "Timer task"
   status: pending
   startTime:
   endTime:
   ---

   # Timer task

   A throwaway task note for the Meta Bind file-layer round-trip.

   Status: `INPUT[text:status]`
   Started: `VIEW[startTime]`
   EOF
   ~~~

3. Append the `meta-bind-button` block (an `updateMetadata` action targeting `startTime`).

   ~~~sh
   cat >> "$VAULT/Tasks/Timer task.md" <<'EOF'

   ## Start button

   ```meta-bind-button
   label: Start Timer
   style: primary
   id: start-timer
   actions:
     - type: updateMetadata
       bindTarget: startTime
       evaluate: true
       value: "new Date().toISOString()"
   ```
   EOF
   ~~~

4. Parse-check the button block shape (one fence pair, valid YAML mapping, `actions` list, valid action `type`).

   ~~~sh
   python3 - "$VAULT/Tasks/Timer task.md" <<'EOF'
   import re, sys
   try:
       import yaml
   except ImportError:
       print("SKIP: pyyaml unavailable")
       sys.exit(0)
   note = open(sys.argv[1]).read()
   blocks = re.findall(r"```meta-bind-button\n(.*?)```", note, re.S)
   assert len(blocks) == 1, f"expected 1 meta-bind-button block, found {len(blocks)}"
   parsed = yaml.safe_load(blocks[0])
   assert isinstance(parsed, dict), "button block does not parse as a YAML mapping"
   assert "actions" in parsed and isinstance(parsed["actions"], list), "no actions list"
   assert len(parsed["actions"]) >= 1, "actions list is empty"
   first = parsed["actions"][0]
   assert isinstance(first, dict) and "type" in first, "first action has no type"
   assert first["type"] == "updateMetadata", f"first action type is {first['type']!r}, expected updateMetadata"
   print("button block OK: valid YAML, actions list, updateMetadata action")
   EOF
   ~~~

5. Resolve every bindTarget (INPUT, VIEW and button action) against the note frontmatter.

   ~~~sh
   python3 - "$VAULT/Tasks/Timer task.md" <<'EOF'
   import re, sys
   try:
       import yaml
   except ImportError:
       print("SKIP: pyyaml unavailable")
       sys.exit(0)
   note = open(sys.argv[1]).read()
   parts = note.split("---", 2)
   assert len(parts) >= 3, "no frontmatter block"
   fm = parts[1]
   body = parts[2]
   fm_keys = {m.group(1) for m in re.finditer(r"^([A-Za-z0-9_]+)\s*:", fm, re.M)}
   targets = set()
   for m in re.finditer(r"INPUT\[[^]]*:([^]\s]+)\]", body):
       targets.add(m.group(1))
   for m in re.finditer(r"VIEW\[([^]]+)\]", body):
       t = m.group(1).strip()
       if "{" in t or "}" in t:
           continue  # computed expression, not a direct bind target
       targets.add(t)
   for m in re.findall(r"```meta-bind-button\n(.*?)```", body, re.S):
       parsed = yaml.safe_load(m)
       for a in (parsed.get("actions") or ([parsed["action"]] if "action" in parsed else [])):
           if isinstance(a, dict) and "bindTarget" in a:
               targets.add(a["bindTarget"])
   def is_local(name):
       return "#" not in name and "^" not in name and "[" not in name
   missing = [t for t in sorted(targets) if is_local(t) and t not in fm_keys]
   assert not missing, f"bind targets missing from frontmatter: {missing}"
   print("frontmatter keys:", sorted(fm_keys))
   print("bind targets resolve:", sorted(targets))
   EOF
   ~~~

6. Cross-check the bind targets with rg and confirm one button block.

   ~~~sh
   rg -n "INPUT\[|VIEW\[|meta-bind-button|bindTarget|startTime|status" "$VAULT/Tasks/Timer task.md"
   rg -c "^```meta-bind-button" "$VAULT/Tasks/Timer task.md"
   ~~~

7. Prove exactly one note changed and no stray files.

   ~~~sh
   cd "$VAULT"
   git init -q
   git add .
   git status --porcelain
   git diff --cached --stat
   ~~~

8. Grade honestly. A PASS proves the button block is valid YAML with an `actions` list and every bindTarget agrees with the note's frontmatter at the file layer. Rendering the widget and clicking the button need an in-app reload, so the PASS states that limitation rather than claiming a rendered widget or a stamped timestamp.

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Button block is valid YAML with an `actions` list, first action is `updateMetadata`, every INPUT/VIEW/button bindTarget resolves to frontmatter present in the note, git shows exactly one note, real vaults untouched |
| FAIL | Misspelled bindTarget, malformed `meta-bind-button` YAML, no `actions` list, or a real vault file was touched |
| SKIP | python3 or rg unavailable (git is optional for the single-note proof) |

---

## 4. CLEANUP

Remove the throwaway vault. Nothing outside `/tmp/_pbtest-meta-bind-file-layer` was created, so this one command restores the machine to its prior state.

~~~sh
rm -rf /tmp/_pbtest-meta-bind-file-layer
~~~

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/meta-bind/meta-bind.md](../../references/plugins/meta-bind/meta-bind.md) | Meta Bind plugin identity and deep-reference index |
| [../../references/plugins/meta-bind/data-model.md](../../references/plugins/meta-bind/data-model.md) | INPUT/VIEW/BUTTON syntax, bind-target forms, the button-action catalog (`updateMetadata`/`inlineJS`/`js`), and the JS Engine companion surface |
| [../../references/plugins/meta-bind/workflows.md](../../references/plugins/meta-bind/workflows.md) | Notion-style task-timer, bound input form, and computed VIEW recipes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../references/plugins/meta-bind/troubleshooting.md](../../references/plugins/meta-bind/troubleshooting.md) | Button no-op, expression not evaluated, frontmatter not updating, and JS Engine diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI operation boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-018
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/meta-bind-file-layer.md
