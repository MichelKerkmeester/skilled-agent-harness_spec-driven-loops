---
title: "OBS-015 -- Iconic rulebook merge round-trip"
description: "This scenario validates the Iconic file-layer contract by merging a rule into a throwaway data.json with backup discipline and verifying the round-trip."
stage: routing
version: 1.3.0.0
---

# OBS-015 -- Iconic rulebook merge round-trip

## 1. OVERVIEW

This scenario validates that the mode can operate Iconic at the file layer: a rule is merged into a throwaway copy of `data.json` with a backup taken first, unrelated settings survive, and the JSON round-trips. Rendering itself is in-app and only observable with a reload.

### Why This Matters

Iconic's entire configuration is one JSON file. If the mode can merge a rule without touching anything else — and backs up before writing — icon management is fully delegated to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-015
- Feature Name: Iconic rulebook merge round-trip
- Scenario Objective: Merge one file rule + flip one toggle in a throwaway data.json, preserving every other key, with a backup created first.
- Exact Prompt: Add a red icon rule for PDF files and enable tag-pill icons in the Iconic setup, without touching anything else.
- Exact Command Sequence: 1. Read `.obsidian/plugins/iconic/data.json` 2. Back up to `data.json.bak` 3. Merge: append a PDF rule to `fileRules` + set `showTagPillIcons: true` 4. Re-parse + diff against the backup 5. Restore the backup (cleanup)
- Expected Signals: Backup file exists; the diff shows exactly 2 changes (new rule + toggle); JSON parses; unrelated keys byte-identical.
- Evidence: Backup path, json diff output, re-parse result.
- Pass/Fail Criteria: PASS if the merge is minimal (diff = 2 changes), backup exists, JSON parses; FAIL if unrelated keys changed, no backup, or invalid JSON.
- Failure Triage: 1. Restore the backup. 2. Re-check the rule shape against the data model. 3. Re-run on a fresh copy.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Work on a COPY of `data.json` (throwaway) — never merge into a real vault's file during the test. Use the real vault's file only as the read source.

### Prompt

Add a red icon rule for PDF files and enable tag-pill icons in the Iconic setup, without touching anything else.

### Commands

1. Read + backup.

   ~~~sh
   SRC="$TEST_VAULT/.obsidian/plugins/iconic/data.json"
   WORK="$(mktemp -d)/data.json"
   cp "$SRC" "$WORK"
   cp "$WORK" "$WORK.bak"
   jq -e . "$WORK" >/dev/null
   ~~~

2. Merge (append PDF rule, flip toggle) using the documented rule shape.

   ~~~sh
   python3 - "$WORK" <<'EOF'
   import json, sys
   p = sys.argv[1]
   d = json.load(open(p))
   d["fileRules"].append({
       "id": "pbtst", "name": "PDF documents", "icon": "lucide-file-text",
       "color": "#ef4444", "match": "any",
       "conditions": [{"source": "extension", "operator": "is", "value": "pdf"}],
       "enabled": True,
   })
   d["showTagPillIcons"] = True
   json.dump(d, open(p, "w"), indent=2)
   EOF
   jq -e '.fileRules | map(select(.id == "pbtst")) | length == 1' "$WORK"
   jq -e '.showTagPillIcons == true' "$WORK"
   ~~~

3. Diff against the backup: exactly 2 logical changes, nothing else.

   ~~~sh
   python3 - "$WORK" <<'EOF'
   import json, sys
   p = sys.argv[1]
   a, b = json.load(open(p + ".bak")), json.load(open(p))
   changed = {k for k in set(a) | set(b) if a.get(k) != b.get(k)}
   added_rules = len(b["fileRules"]) - len(a["fileRules"])
   assert changed == {"fileRules", "showTagPillIcons"} and added_rules == 1, changed
   print("minimal merge verified:", changed)
   EOF
   ~~~

4. Cleanup: remove the throwaway copy (the real vault file was never touched).

   ~~~sh
   rm "$WORK" "$WORK.bak"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Backup exists, diff = exactly the 2 intended changes, JSON parses, real vault file untouched |
| FAIL | Unrelated keys changed, no backup, invalid JSON, or the real vault file was modified |
| SKIP | No vault with iconic installed available |
