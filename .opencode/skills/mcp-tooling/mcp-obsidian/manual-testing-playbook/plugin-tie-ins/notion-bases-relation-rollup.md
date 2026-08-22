---
title: "OBS-022 -- notion-bases-relation-rollup"
description: "This scenario validates a two-way relation, a rollup and a view declaration for the Notion Bases community plugin at the file layer by building a throwaway fixture, hand-resolving the rollup from real rows, and verifying every stage headlessly."
stage: routing
version: "0.1.0.0"
---

# OBS-022 -- notion-bases-relation-rollup

## 1. OVERVIEW

This scenario validates the mode's Notion Bases plugin file-layer knowledge without installing the plugin or touching a real vault: a throwaway fixture with two related databases is built, a two-way relation, a rollup and a board view are declared in `_database.md` schema files, and the relation reciprocity, the rollup's hand-resolved value and the view's structural validity are all proven from the files with python3, rg and git.

### Why This Matters

The Notion Bases plugin is the P0-required plugin for relational Notion→Obsidian parity, but `mcp-obsidian` cannot drive its table/board/gallery/chart UI. If the mode can author a `_database.md` schema whose relation, rollup and view declarations are internally consistent, and prove a rollup's value by reading the same rows the plugin would aggregate, then relational recovery is fully delegable to the vault files before the plugin is ever installed — the exact division of labor Phase 004 relies on.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-022
- Feature Name: Notion Bases plugin relation/rollup/view round-trip
- Scenario Objective: Build two related throwaway databases, declare a two-way relation, a `sum` rollup and a board view in their `_database.md` schemas, and verify reciprocity, the rollup's hand-resolved value and the view's structural validity.
- Exact Prompt: Set up a Project and Task database with a two-way relation, a rollup that totals each project's task hours, and a board view grouped by status — using the Notion Bases plugin's file format.
- Exact Command Sequence: 1. Create the throwaway fixture folders 2. Write two Project/Task row notes with a forward relation and hour estimates 3. Write both databases' `_database.md` schemas (relation, rollup, view) 4. Parse and validate the schemas with python3 5. Resolve the forward relation and hand-resolve the rollup from the row notes 6. Cross-check with rg 7. Prove exactly the intended files changed with git 8. Remove the fixture
- Expected Signals: Both `_database.md` files parse as valid YAML, the relation's `back_reference` values match on both sides, the rollup's function is one of the plugin's 7 documented functions, the view's type is one of the 7 supported values and its `group_by` column exists, every task row's forward relation resolves to a real project note, and the hand-resolved rollup total matches the sum of the real row values.
- Evidence: Fixture file tree, python parse/assert output, rg schema-keyword hits, git status/diff-stat output.
- Pass/Fail Criteria: PASS if both schemas parse, the relation is reciprocal, the rollup function is valid and its hand-resolved value is correct, the view is structurally valid, and git shows exactly the five intended files; FAIL if a schema key is missing/mismatched, a relation is one-sided, the hand-resolved rollup is wrong, the view type or its referenced column is invalid, or a file outside the fixture changed; SKIP if python3, PyYAML or rg is unavailable.
- Failure Triage: 1. Re-read both `_database.md` files and list their declared columns. 2. Compare the relation's `back_reference` names and the rollup's `relation`/`property`/`function` fields against `data-model.md`. 3. Re-read every task row and recompute the rollup by hand before re-running the checks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run entirely inside `/tmp/_pbtest-notion-bases-relation-rollup`. Real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never read or written, and the Notion Bases plugin is not installed anywhere. The checks prove the file layer only; a PASS never claims a rendered table, board or chart — that verification belongs to Phase 004 (real-vault plugin install).

### Prompt

Set up a Project and Task database with a two-way relation, a rollup that totals each project's task hours, and a board view grouped by status — using the Notion Bases plugin's file format.

### Commands

1. Create the throwaway fixture.

   ~~~sh
   VAULT="/tmp/_pbtest-notion-bases-relation-rollup"
   rm -rf "$VAULT"
   mkdir -p "$VAULT/Projects" "$VAULT/Tasks"
   ~~~

2. Write the project row and two task rows with a forward relation and hour estimates.

   ~~~sh
   cat > "$VAULT/Projects/Website Relaunch.md" <<'EOF'
   ---
   title: "Website Relaunch"
   status: "In Progress"
   ---

   # Website Relaunch

   Q3 marketing site rebuild.
   EOF

   cat > "$VAULT/Tasks/Design homepage.md" <<'EOF'
   ---
   title: "Design homepage"
   project: "[[Website Relaunch]]"
   estimate_hours: 8
   ---

   # Design homepage
   EOF

   cat > "$VAULT/Tasks/Write copy.md" <<'EOF'
   ---
   title: "Write copy"
   project: "[[Website Relaunch]]"
   estimate_hours: 5
   ---

   # Write copy
   EOF
   ~~~

3. Write both databases' `_database.md` schemas: a two-way relation, a `sum` rollup and a board view.

   ~~~sh
   cat > "$VAULT/Projects/_database.md" <<'EOF'
   ---
   columns:
     status:
       type: select
     tasks:
       type: relation
       target: "Tasks"
       two_way: true
       back_reference: project
     estimate_hours_total:
       type: rollup
       relation: tasks
       property: estimate_hours
       function: sum
   views:
     - name: "By status"
       type: board
       group_by: status
   ---
   EOF

   cat > "$VAULT/Tasks/_database.md" <<'EOF'
   ---
   columns:
     title:
       type: title
     project:
       type: relation
       target: "Projects"
       two_way: true
       back_reference: tasks
     estimate_hours:
       type: number
   ---
   EOF
   ~~~

4. Parse both schemas, validate the relation, rollup and view declarations, resolve the forward relation on every task row, and hand-resolve the rollup.

   ~~~sh
   python3 - "$VAULT" <<'EOF'
   import re, sys, pathlib
   import yaml

   vault = pathlib.Path(sys.argv[1])

   def read_frontmatter(path):
       text = path.read_text()
       parts = text.split("---", 2)
       assert len(parts) >= 3, f"{path} missing frontmatter fences"
       return yaml.safe_load(parts[1])

   proj_schema = read_frontmatter(vault / "Projects/_database.md")
   task_schema = read_frontmatter(vault / "Tasks/_database.md")

   # 1. Relation reciprocity
   rel_p = proj_schema["columns"]["tasks"]
   rel_t = task_schema["columns"]["project"]
   assert rel_p["type"] == "relation" and rel_t["type"] == "relation"
   assert rel_p["back_reference"] == "project", rel_p
   assert rel_t["back_reference"] == "tasks", rel_t
   assert rel_p["two_way"] is True and rel_t["two_way"] is True
   print("relation_schema_reciprocal: OK")

   # 2. Rollup declaration + valid function (the plugin's 7 documented functions)
   VALID_ROLLUP_FUNCTIONS = {"sum", "count", "average", "min", "max", "count_values", "list"}
   rollup = proj_schema["columns"]["estimate_hours_total"]
   assert rollup["type"] == "rollup"
   assert rollup["relation"] == "tasks"
   assert rollup["property"] == "estimate_hours"
   assert rollup["function"] in VALID_ROLLUP_FUNCTIONS, rollup["function"]
   print("rollup_declared_valid: OK ->", rollup["function"])

   # 3. View block valid (one of the plugin's 7 supported view types)
   VALID_VIEW_TYPES = {"table", "board", "list", "calendar", "gallery", "timeline", "chart"}
   view = proj_schema["views"][0]
   assert view["type"] in VALID_VIEW_TYPES, view["type"]
   assert view["group_by"] in proj_schema["columns"], view["group_by"]
   print("view_block_valid: OK ->", view["type"])

   # 4. Row-level forward relation resolves + hand-resolve the rollup
   task_dir = vault / "Tasks"
   task_files = [p for p in task_dir.glob("*.md") if p.name != "_database.md"]
   assert task_files, "no task rows found"

   total = 0
   linked_count = 0
   for tf in task_files:
       fm = read_frontmatter(tf)
       link = fm.get("project", "")
       m = re.match(r"\[\[(.+)\]\]", link)
       assert m, f"{tf} project field is not a wikilink: {link!r}"
       target = vault / "Projects" / f"{m.group(1)}.md"
       assert target.exists(), f"{tf} points to missing note {target}"
       linked_count += 1
       total += fm["estimate_hours"]

   print(f"relation_forward_resolved: OK -> {linked_count} task rows resolve to Projects/Website Relaunch.md")

   EXPECTED_ROLLUP_TOTAL = 13
   assert total == EXPECTED_ROLLUP_TOTAL, f"hand-resolved sum {total} != expected {EXPECTED_ROLLUP_TOTAL}"
   print(f"rollup_hand_resolved: OK -> sum(estimate_hours)={total}")

   print("ALL CHECKS PASSED")
   EOF
   ~~~

5. Cross-check the schema keywords with rg.

   ~~~sh
   rg -n "type: relation|type: rollup|back_reference|function: sum" "$VAULT"
   ~~~

6. Prove exactly the five intended files exist and no real vault was touched.

   ~~~sh
   cd "$VAULT"
   git init -q
   git add .
   git status --porcelain
   git diff --cached --stat
   ~~~

7. Grade honestly. A PASS proves the schema, the relation reciprocity and the hand-resolved rollup agree at the file layer. Rendering the board view or seeing the relation populate in the plugin's own UI needs a running Obsidian with the plugin installed — that is Phase 004, not this scenario.

### Expected

Both `_database.md` files parse as valid YAML with matching `back_reference` values, the rollup's `function` is one of the 7 documented values and its hand-resolved total is `13`, the view's `type` is one of the 7 supported values with a `group_by` column that exists in the schema, every task row's forward relation resolves to the real project note, and `git status --porcelain` lists exactly the five fixture files.

### Evidence

Capture the fixture file tree, the python assertion output for all four checks, the rg keyword hits, and the `git status`/`git diff --cached --stat` output.

### Pass / Fail

- Pass: both schemas parse, the relation is reciprocal, the rollup function and hand-resolved value are correct, the view is structurally valid, and only the five fixture files appear in git status.
- Fail: a schema key is missing or mismatched, the relation is one-sided, the hand-resolved rollup is wrong, the view references an unsupported type or a missing column, or any file outside the fixture changed.

### Failure Triage

1. Re-read both `_database.md` files and list their declared columns against `data-model.md` §2–§3.
2. Compare the relation's `back_reference` names and the rollup's `relation`/`property`/`function` fields for a typo or mismatch.
3. Re-read every task row and recompute the rollup by hand, then re-run the python checks with a fresh fixture.

---

## 4. CLEANUP

Remove the throwaway fixture. Nothing outside `/tmp/_pbtest-notion-bases-relation-rollup` was created, so this one command restores the machine to its prior state.

~~~sh
rm -rf /tmp/_pbtest-notion-bases-relation-rollup
~~~

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/notion-bases/notion-bases.md](../../references/plugins/notion-bases/notion-bases.md) | Notion Bases plugin identity and deep-reference index |
| [../../references/plugins/notion-bases/data-model.md](../../references/plugins/notion-bases/data-model.md) | Relation, rollup (7 functions), lookup, subtask and view schema shapes |
| [../../references/plugins/notion-bases/workflows.md](../../references/plugins/notion-bases/workflows.md) | Relation/rollup/lookup/view recipes and the Dataview supplement |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../references/plugins/notion-bases/troubleshooting.md](../../references/plugins/notion-bases/troubleshooting.md) | Schema mismatch, missing back-reference and unsupported view diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI operation boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-022
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/notion-bases-relation-rollup.md
