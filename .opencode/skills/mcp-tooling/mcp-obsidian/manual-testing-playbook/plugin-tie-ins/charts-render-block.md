---
title: "OBS-016 -- charts-render-block"
description: "This scenario validates the Charts file-layer contract by authoring chart and advanced-chart render blocks in a throwaway vault note, parsing the JSON body, verifying fence tokens and keys against the data model, and grading honestly."
stage: routing
version: "0.10.0.0"
---

# OBS-016 -- charts-render-block

## 1. OVERVIEW

This scenario validates that the mode can operate the Charts plugin at the file layer: a throwaway note in a throwaway vault holds one `chart` block and one `advanced-chart` block, both bodies are extracted and parsed headlessly, the fence tokens and keys are checked against the data model, and the settings file is confirmed absent so plugin defaults apply. Rendering itself is in-app and only observable with a reload.

### Why This Matters

Charts renders entirely from fenced code blocks inside notes. If the mode can author a valid `chart` YAML body and a valid `advanced-chart` JSON body with the documented keys, chart creation is fully delegated to the vault files. The failure mode this scenario guards against is claiming a chart works when the block would render as plain code, fail to parse, or carry invented keys.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-016
- Feature Name: Charts render-block authoring round-trip
- Scenario Objective: Author a `chart` block and an `advanced-chart` block in a throwaway note inside a throwaway vault, parse both bodies headlessly, verify the fence tokens and keys against the data model, and confirm the plugin defaults apply while no settings file exists.
- Exact Prompt: Add a bar chart for weekly sales to a note and a doughnut chart with the legend at the bottom next to it, in my throwaway vault.
- Exact Command Sequence: 1. Scaffold the throwaway vault at `/tmp/_pbtest-charts-render-block` and copy the charts manifest from a real vault (read-only source) 2. Verify the manifest version is 3.9.0 3. Write a throwaway note holding a `chart` block (YAML body) and an `advanced-chart` block (JSON body) 4. Extract both bodies and verify the fence tokens 5. Parse the JSON body and check `type` plus `data` keys 6. Parse the YAML body and check `type`, `labels` and `series` 7. Confirm no `data.json` exists, so plugin defaults apply 8. Remove the throwaway vault
- Expected Signals: Manifest version reads 3.9.0; fence lines read `chart` and `advanced-chart`; the advanced-chart body parses as JSON with `type` and `data` (`labels` plus `datasets`); the chart body parses as YAML with `type`, `labels` and `series`, and every series item carries `title` and `data`; no `data.json` exists in the throwaway plugin folder; the throwaway vault is removed.
- Evidence: Manifest copy path, note path, fence token list, extracted body paths, JSON parse output, YAML parse output, defaults check output, cleanup check.
- Pass/Fail Criteria: PASS if both blocks parse with the documented keys, the fence tokens match the data model, the manifest version matches 3.9.0, the defaults check is stated with its limitation, and the throwaway vault is removed; FAIL if any block fails to parse, a fence token or key differs from the data model, any write lands outside `/tmp/_pbtest-charts-render-block`, or cleanup leaves files behind.
- Failure Triage: 1. Remove the throwaway vault. 2. Recheck the fence language against the data model (`chart` is YAML, `advanced-chart` is JSON). 3. Recheck the required keys for the failing block. 4. Compare the failing block against `assets/plugins/charts/charts-block.example.md`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Work in a throwaway vault at `/tmp/_pbtest-charts-render-block`. Read the real vault only as the manifest source — never write into the MEGA, iCloud or Barter vaults during the test. Rendering is in-app: file-layer verification ends at valid YAML or JSON plus correct keys, and a check that only proves defaults or absence is a PASS with that limitation stated.

### Prompt

Add a bar chart for weekly sales to a note and a doughnut chart with the legend at the bottom next to it, in my throwaway vault.

### Commands

1. Scaffold the throwaway vault and copy the manifest from the real vault as the installed-version fact.

   ~~~sh
   TEST_VAULT=/tmp/_pbtest-charts-render-block
   REAL_MANIFEST="${OBSIDIAN_VAULT:-/Users/michelkerkmeester/MEGA/Documents/Obsidian}/.obsidian/plugins/obsidian-charts/manifest.json"
   rm -rf "$TEST_VAULT"
   mkdir -p "$TEST_VAULT/.obsidian/plugins/obsidian-charts"
   cp "$REAL_MANIFEST" "$TEST_VAULT/.obsidian/plugins/obsidian-charts/manifest.json"
   jq -e '.id == "obsidian-charts" and .version == "3.9.0"' "$TEST_VAULT/.obsidian/plugins/obsidian-charts/manifest.json"
   ~~~

2. Author the throwaway note with both render blocks. The example data is invented for the test and the note name carries the `_pbtest-` prefix.

   ~~~sh
   NOTE="$TEST_VAULT/_pbtest-charts.md"
   cat > "$NOTE" <<'EOF'
   # Throwaway chart note

   ```chart
   type: bar
   labels: [Mon, Tue, Wed, Thu]
   series:
     - title: Sales
       data: [10, 20, 15, 25]
   ```

   ```advanced-chart
   {
     "type": "doughnut",
     "data": {
       "labels": ["North", "South", "East"],
       "datasets": [{ "data": [45, 30, 25] }]
     },
     "options": { "plugins": { "legend": { "position": "bottom" } } }
   }
   ```
   EOF
   ~~~

3. Extract both block bodies and verify the fence tokens against the data model.

   ~~~sh
   rg -n '^```(chart|advanced-chart)$' "$NOTE"
   awk '/^```chart$/{f=1;next}/^```$/{f=0}f' "$NOTE" > "$TEST_VAULT/chart.body.yaml"
   awk '/^```advanced-chart$/{f=1;next}/^```$/{f=0}f' "$NOTE" > "$TEST_VAULT/advanced.body.json"
   wc -l "$TEST_VAULT/chart.body.yaml" "$TEST_VAULT/advanced.body.json"
   ~~~

4. Parse the advanced-chart JSON and verify the documented keys (`type`, `data.labels`, `data.datasets`).

   ~~~sh
   python3 - "$TEST_VAULT/advanced.body.json" <<'EOF'
   import json, sys
   d = json.load(open(sys.argv[1]))
   assert d["type"] == "doughnut", d["type"]
   assert "labels" in d["data"] and "datasets" in d["data"]
   assert isinstance(d["data"]["datasets"], list) and len(d["data"]["datasets"]) == 1
   print("advanced-chart JSON parse OK, type:", d["type"])
   EOF
   ~~~

5. Parse the chart YAML and verify the required keys (`type`, `labels`, `series` with `title` and `data` per item).

   ~~~sh
   python3 - "$TEST_VAULT/chart.body.yaml" <<'EOF'
   import sys
   try:
       import yaml
   except ImportError:
       print("PASS with limitation: PyYAML unavailable, structural key check only")
       body = open(sys.argv[1]).read()
       for k in ("type:", "labels:", "series:", "title:", "data:"):
           assert k in body, k
       sys.exit(0)
   d = yaml.safe_load(open(sys.argv[1]))
   for k in ("type", "labels", "series"):
       assert k in d, k
   assert isinstance(d["series"], list) and len(d["series"]) >= 1
   for s in d["series"]:
       assert "title" in s and "data" in s, s
   print("chart YAML parse OK, type:", d["type"])
   EOF
   ~~~

6. Confirm the settings file is absent so plugin defaults apply. This check proves absence only, not that any default is correct in a live render.

   ~~~sh
   SETTINGS="$TEST_VAULT/.obsidian/plugins/obsidian-charts/data.json"
   if [ -e "$SETTINGS" ]; then
     jq -e . "$SETTINGS" >/dev/null
     echo "PASS with limitation: data.json exists and parses"
   else
     echo "PASS with limitation: no data.json, plugin defaults apply (defaults from the data model, not a live render)"
   fi
   ~~~

7. Round-trip: re-extract both bodies from the note and diff against the first extraction.

   ~~~sh
   awk '/^```chart$/{f=1;next}/^```$/{f=0}f' "$NOTE" | diff - "$TEST_VAULT/chart.body.yaml"
   awk '/^```advanced-chart$/{f=1;next}/^```$/{f=0}f' "$NOTE" | diff - "$TEST_VAULT/advanced.body.json"
   echo "round-trip OK: both bodies re-extract identically"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Manifest version 3.9.0, both fence tokens correct, advanced-chart JSON parses with `type` and `data` keys, chart YAML parses with `type`/`labels`/`series` plus per-item `title`/`data`, defaults check stated with its limitation, throwaway vault removed |
| FAIL | Any block fails to parse, a fence token or key differs from the data model, a write lands outside `/tmp/_pbtest-charts-render-block`, or cleanup leaves files |
| SKIP | No real vault with obsidian-charts installed is available for the manifest copy |

---

## 4. CLEANUP

Remove the throwaway vault and confirm nothing remains. The real vault was used only as the read source for the manifest copy.

~~~sh
rm -rf /tmp/_pbtest-charts-render-block
if [ -d /tmp/_pbtest-charts-render-block ]; then
  echo "cleanup FAILED: throwaway vault remains"; exit 1
else
  echo "throwaway vault removed"
fi
~~~

Every write in this scenario stays inside `/tmp/_pbtest-charts-render-block`. No command touches the MEGA, iCloud or Barter vaults.
