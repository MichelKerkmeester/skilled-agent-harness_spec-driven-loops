---
title: "OBS-020 -- outliner-settings-defaults"
description: "This scenario validates the Outliner file-layer contract: the installed plugin manifest, data.json absence meaning defaults apply, and the documented settings key list against the data model."
stage: routing
version: "0.10.0.0"
---

# OBS-020 -- outliner-settings-defaults

## 1. OVERVIEW

This scenario validates that the mode can verify the Outliner plugin at the file layer: the installed manifest records the documented identity and version, the absence of `data.json` is reported as defaults-apply (never an error), and every documented settings key can be validated against the data model. Behavior itself is editor-only and only observable in-app.

### Why This Matters

Outliner is editor behavior with no note format. Its whole file-layer contract is one optional settings file. If the mode can verify the manifest, state defaults honestly when the file is absent, and validate the settings key list, the plugin is fully delegated to the vault files without ever touching note content.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-020
- Feature Name: Outliner settings defaults verification
- Scenario Objective: Verify the installed plugin manifest, confirm that a missing data.json means defaults apply, and validate the documented settings key list against the data model, in a throwaway vault.
- Exact Prompt: Check the Outliner plugin setup in my vault and report which settings are active. I have not changed anything, so I expect defaults.
- Exact Command Sequence: 1. Build the throwaway vault plugin folder 2. Write a manifest recording the verified install facts (id, version, minAppVersion) and assert each field 3. Confirm `data.json` is absent so defaults apply 4. Validate the settings key list and defaults against the data model using the example assets 5. Confirm the throwaway sits outside the git workspace 6. Remove the throwaway vault (cleanup)
- Expected Signals: manifest asserts id `obsidian-outliner`, version 4.10.2 and minAppVersion 1.11.7; `data.json` absent; all 11 documented keys validated with defaults matching the data model; isolation check confirms the throwaway is not inside the workspace; cleanup leaves no directory behind.
- Evidence: jq assert output, absence check output, python3 key-list validation output, git isolation exit code, cleanup listing.
- Pass/Fail Criteria: PASS if the manifest asserts the documented facts, `data.json` is absent (defaults apply), all 11 keys match the data model, and cleanup removes the throwaway; FAIL if any assert fails, any key is invented or missing, or the throwaway leaks into the workspace. Limitation stated: the version and defaults come from the reference provenance and the example assets, the live vaults are never read during this run.
- Failure Triage: 1. Re-check the manifest fields against the reference index. 2. Re-run the key validation against the data model. 3. Re-run the whole sequence on a fresh throwaway vault.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Work entirely inside the throwaway vault at `/tmp/_pbtest-outliner-settings-defaults`. Never read or write the real vaults (MEGA/Documents/Obsidian, iCloud, Barter) during the test. Use the reference set and the example assets as the authoritative facts.

### Prompt

Check the Outliner plugin setup in my vault and report which settings are active. I have not changed anything, so I expect defaults.

### Commands

1. Build the throwaway vault and record the verified install facts in a stand-in manifest. The values come from the reference provenance (verified on disk during reference authoring), not from a fresh live-vault read, which this test boundary forbids.

   ~~~sh
   TEST_ROOT="/tmp/_pbtest-outliner-settings-defaults"
   REF_DIR=".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/outliner"
   ASSET_DIR=".opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/outliner"
   rm -rf "$TEST_ROOT"
   mkdir -p "$TEST_ROOT/.obsidian/plugins/obsidian-outliner"
   cat > "$TEST_ROOT/.obsidian/plugins/obsidian-outliner/manifest.json" <<'EOF'
   {
     "id": "obsidian-outliner",
     "name": "Outliner",
     "version": "4.10.2",
     "minAppVersion": "1.11.7",
     "author": "Viacheslav Slinko"
   }
   EOF
   ~~~

2. Assert the manifest records the documented identity and version, and cross-check the reference index documents the same version.

   ~~~sh
   jq -e '.id == "obsidian-outliner" and .version == "4.10.2" and .minAppVersion == "1.11.7"' "$TEST_ROOT/.obsidian/plugins/obsidian-outliner/manifest.json"
   rg -q "4\.10\.2" "$REF_DIR/outliner.md"
   ~~~

3. Confirm `data.json` is absent, which means every setting uses its default. Absence is expected and is not an error.

   ~~~sh
   test ! -e "$TEST_ROOT/.obsidian/plugins/obsidian-outliner/data.json"
   echo "data.json absent: defaults apply"
   ~~~

4. Validate the documented settings key list against the data model. The example assets hold the defaults snapshot and a minimal partial file; every key must be documented and every default must match the data model table.

   ~~~sh
   python3 - "$ASSET_DIR" <<'EOF'
   import json, pathlib, sys
   asset_dir = pathlib.Path(sys.argv[1])
   documented = {
       "stickCursor": "bullet-and-checkbox", "betterTab": True, "betterEnter": True,
       "betterVimO": True, "selectAll": True, "styleLists": True, "listLines": False,
       "listLineAction": "toggle-folding", "dnd": True, "debug": False,
       "previousRelease": None,
   }
   full = json.load(open(asset_dir / "outliner-settings.example.json"))
   partial = json.load(open(asset_dir / "outliner-settings.partial.example.json"))
   assert set(full) == set(documented), f"unexpected keys: {set(full) ^ set(documented)}"
   assert all(full[k] == documented[k] for k in documented), "default mismatch"
   assert set(partial) <= set(documented), f"unknown partial keys: {set(partial) - set(documented)}"
   assert partial == {"listLines": True, "dnd": False}, "partial mismatch"
   print(f"validated {len(documented)} documented keys, defaults match, partial file valid")
   EOF
   ~~~

5. Confirm the throwaway vault is outside the git workspace, so no test file can leak into the repo.

   ~~~sh
   if git -C "$TEST_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
     echo "FAIL: throwaway is inside a git work tree"
     exit 1
   fi
   echo "throwaway vault is outside the git workspace"
   ~~~

6. Cleanup: remove the throwaway vault and confirm nothing remains.

   ~~~sh
   rm -rf "$TEST_ROOT"
   test ! -e "$TEST_ROOT"
   echo "throwaway vault removed"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Manifest asserts the documented facts, reference index documents version 4.10.2, data.json absent (defaults apply), all 11 keys match the data model, throwaway stays outside the git workspace, cleanup removes it |
| FAIL | Any assert fails, an invented or missing key, a default mismatch, or the throwaway leaks into the workspace |
| SKIP | python3, jq or rg unavailable in the execution environment |

---

## 4. CLEANUP

Remove the throwaway vault with `rm -rf /tmp/_pbtest-outliner-settings-defaults` after the run. Confirm the path no longer exists. The real vaults are never written and never read during this scenario, so no vault state changes. Limitation restated: this scenario proves the reference provenance and the example assets agree with the recorded facts; a fresh live-vault re-verification is out of reach headlessly and outside this test boundary.

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/outliner/outliner.md](../../references/plugins/outliner/outliner.md) | Plugin identity and deep-reference index |
| [../../references/plugins/outliner/data-model.md](../../references/plugins/outliner/data-model.md) | Outliner settings keys, defaults, and data model |
| [../../references/plugins/outliner/workflows.md](../../references/plugins/outliner/workflows.md) | Outliner setup, settings inspection, and validation workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../assets/plugins/outliner/outliner-settings.example.json](../../assets/plugins/outliner/outliner-settings.example.json) | Complete Outliner default settings fixture |
| [../../assets/plugins/outliner/outliner-settings.partial.example.json](../../assets/plugins/outliner/outliner-settings.partial.example.json) | Partial settings override fixture |
| [../../references/plugins/outliner/troubleshooting.md](../../references/plugins/outliner/troubleshooting.md) | Settings, installation, and path diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-020
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/outliner-settings-defaults.md
