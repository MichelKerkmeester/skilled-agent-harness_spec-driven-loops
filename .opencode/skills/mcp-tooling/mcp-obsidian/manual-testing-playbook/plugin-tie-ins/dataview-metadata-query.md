---
title: "OBS-017 -- dataview-metadata-query"
description: "This scenario validates the Dataview metadata contract by building a throwaway vault note with frontmatter and inline fields, authoring a DQL table query against those exact fields, and verifying the field names and block shape headlessly."
stage: routing
version: "0.10.0.0"
---

# OBS-017 -- dataview-metadata-query

## 1. OVERVIEW

This scenario validates that the mode can operate Dataview at the file layer: a throwaway vault note is built with frontmatter and inline fields, a DQL table query is authored against those exact fields, and the field-name agreement plus the block shape are verified headlessly with python3, rg and git. Rendering itself is in-app and only observable after a reload.

### Why This Matters

A Dataview query lives or dies by field-name agreement between the note metadata and the DQL text. A typo renders blank cells, not an error. If the mode can author metadata and a query that references exactly those fields, and prove the agreement from the files, then metadata-driven views are fully delegable to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-017
- Feature Name: Dataview metadata query round-trip
- Scenario Objective: Build one throwaway note with frontmatter plus inline fields, author a DQL TABLE query that lists it, and verify every field name the query references exists in the note.
- Exact Prompt: Add a Dataview table to my project notes that lists each note's status, amount and due date from the fields already in the notes.
- Exact Command Sequence: 1. Create the throwaway vault and a Projects folder 2. Write the note with frontmatter and inline fields 3. Append the DQL block 4. Parse-check the block shape 5. Resolve every query field against the note 6. Prove exactly one note changed with git
- Expected Signals: Frontmatter parses, inline fields use the `::` separator, exactly one `dataview` fence pair exists, the first query token is TABLE, every query field resolves to a metadata key or a `file.*` field, and git status shows exactly one note.
- Evidence: Note text, python parse output, rg field hits, git status output.
- Pass/Fail Criteria: PASS if the block shape is valid and every query field resolves to metadata present in the note; FAIL if a field is misspelled, the block is malformed, or the folder source is empty; SKIP if python3 or rg are unavailable.
- Failure Triage: 1. Re-read the note and list the metadata keys. 2. Compare each query column against those keys. 3. Fix the query or the metadata and re-run the checks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run entirely inside `/tmp/_pbtest-dataview-metadata-query`. Real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never read or written. The checks prove the file layer only, a PASS never claims a rendered table.

### Prompt

Add a Dataview table to my project notes that lists each note's status, amount and due date from the fields already in the notes.

### Commands

1. Create the throwaway vault.

   ~~~sh
   VAULT="/tmp/_pbtest-dataview-metadata-query"
   rm -rf "$VAULT"
   mkdir -p "$VAULT/Projects"
   ~~~

2. Write the note with frontmatter and inline fields.

   ~~~sh
   cat > "$VAULT/Projects/Quarterly report.md" <<'EOF'
   ---
   title: "Quarterly report"
   status: active
   owner: ada
   tags:
     - finance
     - report
   amount: 1250
   ---
   
   # Quarterly report
   
   Revenue summary goes here.
   
   Due:: 2026-06-30
   Progress:: 70
   Attendees:: ada, grace
   EOF
   ~~~

3. Append the DQL table block.

   ~~~sh
   cat >> "$VAULT/Projects/Quarterly report.md" <<'EOF'
   
   ## Project status
   
   ```dataview
   TABLE status, amount, Due, Progress
   FROM "Projects"
   WHERE contains(status, "active")
   SORT Due ASC
   LIMIT 20
   ```
   EOF
   ~~~

4. Parse-check the block shape (fence language, view type, clauses, FROM source).

   ~~~sh
   python3 - "$VAULT/Projects/Quarterly report.md" <<'EOF'
   import re, sys
   note = open(sys.argv[1]).read()
   blocks = re.findall(r"```dataview\n(.*?)```", note, re.S)
   assert len(blocks) == 1, f"expected 1 dataview block, found {len(blocks)}"
   lines = [l.strip() for l in blocks[0].splitlines() if l.strip()]
   assert lines[0].split()[0].upper() == "TABLE", "first token is not TABLE"
   allowed = {"FROM", "WHERE", "SORT", "GROUP BY", "FLATTEN", "LIMIT", "AS"}
   for line in lines[1:]:
       kw = line.split()[0]
       if kw == "GROUP":
           kw = "GROUP BY"
       assert kw in allowed, f"unexpected clause keyword: {kw}"
   assert any(l == 'FROM "Projects"' for l in lines), "FROM source missing"
   print("block shape OK: TABLE, FROM, WHERE, SORT, LIMIT")
   EOF
   ~~~

5. Resolve every query field against the note metadata.

   ~~~sh
   python3 - "$VAULT/Projects/Quarterly report.md" <<'EOF'
   import re, sys
   note = open(sys.argv[1]).read()
   parts = note.split("---", 2)
   fm = parts[1] if len(parts) >= 3 else ""
   body = parts[2] if len(parts) >= 3 else note
   fm_keys = {m.group(1) for m in re.finditer(r"^([A-Za-z0-9_]+)\s*:", fm, re.M)}
   inline_keys = set(re.findall(r"^([A-Za-z0-9_]+)::\s", body, re.M))
   q = re.search(r"```dataview\n(.*?)```", body, re.S).group(1)
   cols = re.search(r"^TABLE\s+(.+)$", q, re.M).group(1)
   names = [re.split(r"\s+AS\s+", c.strip(), flags=re.I)[0] for c in cols.split(",")]
   known = fm_keys | inline_keys
   unknown = [n for n in names if n not in known and not n.startswith("file.")]
   assert not unknown, f"query fields missing from note: {unknown}"
   print("frontmatter keys:", sorted(fm_keys))
   print("inline keys:", sorted(inline_keys))
   print("query columns resolve:", names)
   EOF
   ~~~

6. Cross-check the field names with rg and confirm one block.

   ~~~sh
   rg -n "status|amount|Due|Progress" "$VAULT/Projects/Quarterly report.md"
   rg -c "^```dataview" "$VAULT/Projects/Quarterly report.md"
   ~~~

7. Prove exactly one note changed and no stray files.

   ~~~sh
   cd "$VAULT"
   git init -q
   git add .
   git status --porcelain
   git diff --cached --stat
   ~~~

8. Grade honestly. A PASS proves the metadata and the query agree at the file layer. Rendering needs an in-app reload, so the PASS states that limitation rather than claiming a rendered table.

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Block shape valid, every query field resolves to metadata in the note, FROM folder non-empty, git shows exactly one note, real vaults untouched |
| FAIL | Misspelled field, malformed block, empty FROM source, or a real vault file was touched |
| SKIP | python3 or rg unavailable (git is optional for the single-note proof) |

---

## 4. CLEANUP

Remove the throwaway vault. Nothing outside `/tmp/_pbtest-dataview-metadata-query` was created, so this one command restores the machine to its prior state.

~~~sh
rm -rf /tmp/_pbtest-dataview-metadata-query
~~~
