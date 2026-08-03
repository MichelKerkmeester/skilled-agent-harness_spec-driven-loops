---
title: "OBS-014 -- Health.md data-file round-trip"
description: "This scenario validates the Health.md file-layer contract by creating a data file in the vault data folder, inserting a render block, and verifying the file round-trip."
stage: routing
version: 1.2.0.0
---

# OBS-014 -- Health.md data-file round-trip

## 1. OVERVIEW

This scenario validates that the mode can operate the Health.md Visualizations plugin at the file layer: a data file appears in the configured data folder (default `Health/`), a render block points at it, and the file round-trips unchanged through Read. Rendering itself happens in-app and is only observable with a reload.

### Why This Matters

Health.md renders only what the data folder contains. If the mode can place a well-formed data file and a matching render block, chart creation is fully delegated to the plugin. Fabricating data is the failure mode this scenario guards against.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-014
- Feature Name: Health.md data-file round-trip
- Scenario Objective: Create a throwaway health data file in the vault data folder, add a render block to a throwaway note, and verify both files parse and round-trip.
- Exact Prompt: Set up a Health.md visualization for a throwaway vault by creating the data folder, writing a small real-format data file, and inserting the render block.
- Exact Command Sequence: 1. Read `.obsidian/plugins/health-md/data.json` for the configured data folder/pattern 2. Create `<data folder>/` and write a throwaway JSON export shaped like `healthmd.health_data` with schema_version 7 (mark as throwaway) 3. Insert a `health-md` fenced render block referencing an existing metric into a throwaway note 4. Read both files back and validate JSON/YAML parse
- Expected Signals: Data folder exists; data file parses and carries schema_version ≤ 7; render block references a metric present in the file; both files read back byte-identical.
- Evidence: Settings read, created file paths, JSON parse output, render-block diff, read-back verification.
- Pass/Fail Criteria: PASS if the data file parses and round-trips and the block references a real metric; FAIL if the file is invalid, the block references an unknown metric, or any fabricated health data is written to a non-throwaway location.
- Failure Triage: 1. Delete only the throwaway files. 2. Recheck the settings folder/pattern against the file location. 3. Compare metric ids against `_healthmd_data_dictionary.json` when available.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a throwaway vault or a `_pbtest-` subfolder under the data folder, and delete every created file afterward. Never write health-looking data into a real export folder.

### Prompt

Set up a Health.md visualization for a throwaway vault by creating the data folder, writing a small real-format data file, and inserting the render block.

### Commands

1. Settings: read `.obsidian/plugins/health-md/data.json`; resolve the data folder (default `Health/`) and file pattern.

   ~~~sh
   PLUGIN_DIR="$TEST_VAULT/.obsidian/plugins/health-md"
   DATA_FOLDER="${DATA_FOLDER:-$TEST_VAULT/Health}"
   test -f "$PLUGIN_DIR/manifest.json"
   jq -r '.dataFolder // "Health"' "$PLUGIN_DIR/data.json" 2>/dev/null || echo "Health"
   ~~~

2. Create a throwaway data file shaped like a v7 export (fields illustrative; the fixture in `assets/plugins/health-md/` is the canonical example).

   ~~~sh
   mkdir -p "$DATA_FOLDER"
   cat > "$DATA_FOLDER/_pbtest-export.json" <<'EOF'
   {
     "healthmd.health_data": {
       "schema_version": 7,
       "source": "throwaway-pb",
       "days": [
         { "date": "2026-08-01", "statistics": { "step_count": { "count": 1000, "unit": "count" } } }
       ]
     }
   }
   EOF
   jq -e '."healthmd.health_data".schema_version <= 7' "$DATA_FOLDER/_pbtest-export.json"
   ~~~

3. Insert the render block into a throwaway note and verify the metric name matches the file.

   ~~~sh
   NOTE="$TEST_VAULT/_pbtest-health-md.md"
   printf '```health-md\ntype: chart\nmetric: step_count\ndateRange: last7d\n```\n' > "$NOTE"
   grep -q 'step_count' "$DATA_FOLDER/_pbtest-export.json" && grep -q 'step_count' "$NOTE"
   ~~~

4. Read both files back and confirm JSON parse and byte-identical round-trip.

   ~~~sh
   jq -e . "$DATA_FOLDER/_pbtest-export.json" >/dev/null
   cmp -s "$DATA_FOLDER/_pbtest-export.json" <(cat "$DATA_FOLDER/_pbtest-export.json")
   ~~~

5. Cleanup: delete only the throwaway files.

   ~~~sh
   rm "$DATA_FOLDER/_pbtest-export.json" "$NOTE"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Data file parses (schema ≤ 7), block references an existing metric, both round-trip, throwaway files removed |
| FAIL | Invalid file, unknown metric, or any fabricated data outside the throwaway path |
| SKIP | No vault available or health-md not installed (Phase 11 prerequisite) |
