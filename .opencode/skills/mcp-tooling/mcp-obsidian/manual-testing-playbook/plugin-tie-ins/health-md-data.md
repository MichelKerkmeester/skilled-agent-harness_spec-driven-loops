---
title: "OBS-014 -- Health.md data-file round-trip"
description: "This scenario validates the Health.md file-layer contract by identifying the configured data folder, guarding against the bundled mock-data fallback, creating a throwaway data file, inserting a health-viz render block, and verifying the round-trip."
stage: routing
version: 1.2.1.0
---

# OBS-014 -- Health.md data-file round-trip

## 1. OVERVIEW

This scenario validates that the mode can operate the Health.md Visualizations plugin at the file layer: the configured data folder is identified from plugin settings (never assumed), a throwaway data file appears in it, a researched-validated `health-viz` render block points at the data, and the file round-trips unchanged through Read. Rendering itself happens in-app and is only observable with a reload — and only counts as evidence when the data folder holds an authentic source file.

### Why This Matters

Health.md renders only what the data folder contains, and when the folder is missing or empty it falls back to deterministic bundled example data. A rendered chart therefore proves nothing on its own. If the mode can identify the real folder, place a well-formed data file, and insert a matching render block, chart creation is fully delegated to the plugin. Fabricating data — or counting mock data as evidence — is the failure mode this scenario guards against.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-014
- Feature Name: Health.md data-file round-trip
- Scenario Objective: Identify the configured data folder, guard against the mock-data fallback, create a throwaway health data file in the vault data folder, add a researched-validated `health-viz` render block to a throwaway note, and verify both files parse and round-trip.
- Exact Prompt: Set up a Health.md visualization for a throwaway vault by identifying the configured data folder, verifying it holds an authentic source file, writing a small real-format data file, and inserting the render block.
- Exact Command Sequence: 1. Read `.obsidian/plugins/health-md/data.json` for the configured data folder/pattern 2. List the configured data folder; if it is missing or empty, state the bundled-mock-data fallback and that no chart can count as evidence 3. Create `<data folder>/` and write a throwaway JSON export shaped like the canonical fixture (`healthmd.health_data`, schema_version 7, wrapper keys only `schema_version`/`timezone`/`days`; `_pbtest-` prefix marks it throwaway) 4. Insert a `health-viz` fenced render block (`type: step-spiral`, `last: 7`) into a throwaway note 5. Read both files back and validate JSON parse + byte-identical round-trip 6. Delete only the throwaway files
- Expected Signals: Actual selected data folder identified from settings (not the default); guard result recorded (missing/empty folder ⇒ mock-data fallback, no chart evidence); at least one authentic source file verified; data file parses, carries schema_version ≤ 7, and uses only the canonical wrapper keys; render block is the researched-validated minimal `health-viz` form; both files read back byte-identical; throwaway files removed.
- Evidence: Settings read, data-folder listing, authentic source file path, created file paths, JSON parse output, render-block content, read-back verification, cleanup check.
- Pass/Fail Criteria: PASS if the data folder is identified, an authentic source file is verified, the block is a valid `health-viz` block with a metric present in the file, both files parse and round-trip, and the throwaway files are removed; FAIL if evidence rests only on mock-data rendering, a wrong fence or unknown block keys are used, a file is invalid, the metric is unknown, or fabricated data lands outside the `_pbtest-` throwaway path.
- Failure Triage: 1. Delete only the throwaway files. 2. Recheck the settings folder/pattern against the file location. 3. Compare metric ids against `_healthmd_data_dictionary.json` when available. 4. If the data folder is empty, treat any rendered chart as bundled mock data and obtain an authentic export before claiming evidence.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a throwaway vault, or a `_pbtest-` subfolder under the data folder of a vault that already holds authentic exports, and delete every created file afterward. Never write health-looking data into a real export folder. Before writing anything, resolve the configured data folder from settings and list it: a missing or empty folder makes the plugin render deterministic bundled example data, and no chart can count as evidence.

### Prompt

Set up a Health.md visualization for a throwaway vault by identifying the configured data folder, verifying it holds an authentic source file, writing a small real-format data file, and inserting the render block.

### Commands

1. Settings: read `.obsidian/plugins/health-md/data.json`; resolve the actual selected data folder and file pattern (default `Health/`).

   ~~~sh
   PLUGIN_DIR="$TEST_VAULT/.obsidian/plugins/health-md"
   test -f "$PLUGIN_DIR/manifest.json"
   DATA_FOLDER="$TEST_VAULT/$(jq -r '.dataFolder // "Health"' "$PLUGIN_DIR/data.json" 2>/dev/null || echo Health)"
   echo "configured data folder: $DATA_FOLDER"
   ~~~

2. Mock-fallback guard (BEFORE any write): list the configured data folder; a missing or empty folder means the plugin renders deterministic bundled example data, and no chart can count as evidence. Verification must also identify at least one authentic source file (a real export, not a throwaway).

   ~~~sh
   if [ ! -d "$DATA_FOLDER" ] || [ -z "$(ls -A "$DATA_FOLDER" 2>/dev/null)" ]; then
     echo "GUARD: configured data folder is missing or empty — the plugin would render"
     echo "deterministic bundled example data; NO chart can count as evidence"
   else
     echo "data folder present and non-empty:"
     ls -A "$DATA_FOLDER"
   fi
   AUTH="$(find "$DATA_FOLDER" -maxdepth 1 -type f ! -name '_pbtest-*' 2>/dev/null | head -1)"
   test -n "$AUTH" && echo "authentic source file: $AUTH" || echo "GUARD: no authentic source file found"
   ~~~

3. Create a throwaway data file shaped like the canonical fixture (shape reference: `assets/plugins/health-md/healthmd-export.example.json` — wrapper keys only `schema_version`, `timezone`, `days`; no extra keys).

   ~~~sh
   mkdir -p "$DATA_FOLDER"
   cat > "$DATA_FOLDER/_pbtest-export.json" <<'EOF'
   {
     "healthmd.health_data": {
       "schema_version": 7,
       "timezone": "Europe/Amsterdam",
       "days": [
         { "date": "2026-08-01", "statistics": { "step_count": { "count": 1000, "unit": "count" } } }
       ]
     }
   }
   EOF
   jq -e '."healthmd.health_data" | (.schema_version <= 7) and has("timezone") and has("days") and (has("source") | not)' "$DATA_FOLDER/_pbtest-export.json"
   ~~~

4. Insert the researched-validated render block into a throwaway note (block forms: `assets/plugins/health-md/health-viz-blocks.example.md`) and confirm the throwaway file carries the canonical fixture's metric (`step_count`).

   ~~~sh
   NOTE="$TEST_VAULT/_pbtest-health-md.md"
   printf '```health-viz\ntype: step-spiral\nlast: 7\n```\n' > "$NOTE"
   grep -q 'step_count' "$DATA_FOLDER/_pbtest-export.json"
   grep -q 'type: step-spiral' "$NOTE"
   ~~~

5. Read both files back; confirm JSON parse and byte-identical round-trip against a written reference copy.

   ~~~sh
   cp "$DATA_FOLDER/_pbtest-export.json" "$DATA_FOLDER/_pbtest-export.ref.json"
   jq -e . "$DATA_FOLDER/_pbtest-export.json" >/dev/null
   diff -q "$DATA_FOLDER/_pbtest-export.json" "$DATA_FOLDER/_pbtest-export.ref.json"
   diff -q "$NOTE" <(printf '```health-viz\ntype: step-spiral\nlast: 7\n```\n')
   ~~~

6. Cleanup: delete only the throwaway files and confirm none remain.

   ~~~sh
   rm -f "$DATA_FOLDER/_pbtest-export.json" "$DATA_FOLDER/_pbtest-export.ref.json" "$NOTE"
   if ls -A "$DATA_FOLDER" 2>/dev/null | grep -q '_pbtest-'; then
     echo "cleanup FAILED: throwaway files remain"; exit 1
   else
     echo "throwaway files removed"
   fi
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Data folder identified from settings, authentic source file verified, block is a valid `health-viz` block with a metric present in the file, both files parse and round-trip, throwaway files removed |
| FAIL | Evidence rests only on mock-data rendering, wrong fence or unknown block keys used, invalid file, unknown metric, or fabricated data outside the `_pbtest-` throwaway path |
| SKIP | No vault available or health-md not installed (Phase 11 prerequisite) |

---

## 4. LIVE RUN RECORD (2026-08-03)

Executed as the Phase 017 live validation closeout against a throwaway vault at `/tmp/_pbtest-obs014` (manifest copied from the real vault; the real vault was never touched).

**Pre-flight — real vault `/Users/michelkerkmeester/MEGA/Documents/Obsidian`:** health-md v2.1.0 enabled; no `data.json` present (defaults in effect: `Health/`, `Flat`, `*`, auto); no `Health/` folder — the mock-fallback trap is live on this machine.

**Defect found and fixed in step 1:** with no `data.json` present, `jq` on the missing file returned empty, the folder resolved to the vault root, and the guard could not fire. Fixed command:

~~~sh
DATA_FOLDER="$TEST_VAULT/$(jq -r '.dataFolder // "Health"' "$PLUGIN_DIR/data.json" 2>/dev/null || echo Health)"
~~~

**Guard output (verbatim):**

```
GUARD: configured data folder is missing or empty — the plugin would render deterministic bundled example data; NO chart can count as evidence
GUARD: no authentic source file found
```

**Results:**

| Check | Result |
|-------|--------|
| Fixture shape | OK — canonical wrapper keys only, no invented keys |
| Render block | `type: step-spiral` / `last: 7` references a metric present in the file |
| Round-trip | Byte-identical |
| Cleanup | Verified — throwaway files removed; throwaway vault removed; real vault has no `Health/` folder (confirmed untouched) |

**Verdict:** PASS on file-layer mechanics + mock-fallback guard behavior; the authentic-source axis is correctly graded as not-passable until the user exports real health data (documented expected state, not a defect).
