---
title: "OBS-013 -- BRAT headless beta-plugin install"
description: "This scenario validates the BRAT file-layer install boundary by staging exact release assets, registering a repository, and activating the manifest ID."
stage: routing
version: 0.1.0.0
---

# OBS-013 -- BRAT headless beta-plugin install

## 1. OVERVIEW

This scenario validates a BRAT-managed beta-plugin install without invoking Obsidian's plugin UI. It stages the exact GitHub release assets, registers the repository and release policy in BRAT's data.json, and activates the manifest ID in community-plugins.json.

### Why This Matters

BRAT installation has three distinct file-layer contracts: plugin files must exist under the folder named by manifest.id, BRAT must know the repository and release policy, and Obsidian must list the manifest ID as enabled. A reload makes the result visible but does not repair a missing stage.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-013
- Feature Name: BRAT headless beta-plugin install
- Scenario Objective: Stage a tagged beta-plugin release, register it in BRAT, activate its manifest ID, and verify all three file-layer stages.
- Exact Prompt: Install a tagged beta plugin headlessly through BRAT by staging its release assets, registering the repository, activating the manifest ID, and reporting every verified stage.
- Exact Command Sequence: 1. Fetch the exact GitHub release tag and stage validated main.js, manifest.json, and optional styles.css under .obsidian/plugins/<manifest.id>/ 2. Upsert REPO and TAG in .obsidian/plugins/obsidian42-brat/data.json 3. Add PLUGIN_ID to .obsidian/community-plugins.json 4. Re-parse both JSON files and verify staged assets, registration, and activation
- Expected Signals: The requested release tag and API tag match, main.js and manifest.json are present, the manifest has an ID/version, BRAT contains the repository and exact policy, community-plugins.json contains the manifest ID, and every JSON file parses without exposing credentials.
- Evidence: Vault and repository, release JSON/tag, manifest fields, staged asset paths, JSON backups/diffs, jq verification output, and an optional post-reload app-state record.
- Pass/Fail Criteria: PASS if stage, register, and activate all verify independently and the plugin appears after reload when an app check is available; FAIL if an asset/tag/manifest check, JSON parse, BRAT policy, activation entry, or compatibility boundary is wrong.
- Failure Triage: 1. Restore the two JSON backups and remove only the newly staged target folder. 2. Recheck the exact release tag, asset names, manifest ID, and compatibility fields. 3. Compare each stage with the BRAT data model/workflow and repeat in a throwaway vault without writing token values.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a throwaway or operator-owned vault, close Obsidian before writing its JSON files, and choose a real GitHub beta-plugin repository plus an exact release tag. Keep backups of BRAT data.json and community-plugins.json; network access or a captured release fixture is required for staging.

### Prompt

Install a tagged beta plugin headlessly through BRAT by staging its release assets, registering the repository, activating the manifest ID, and reporting every verified stage.

### Commands

1. Stage: set VAULT="$TEST_VAULT", REPO="owner/repository", and TAG="v0.0.0"; fetch https://api.github.com/repos/$REPO/releases/tags/$TAG, require exact main.js and manifest.json assets plus optional styles.css, validate manifest.id, manifest.version, and minAppVersion, then copy the selected files to "$VAULT/.obsidian/plugins/$PLUGIN_ID/". The release and asset selection must follow [obsidian42-brat/workflows.md](../../references/plugins/obsidian42-brat/workflows.md).

   ~~~sh
   VAULT="$TEST_VAULT"
   REPO="owner/repository"
   TAG="v0.0.0"
   BRAT_DATA="$VAULT/.obsidian/plugins/obsidian42-brat/data.json"
   COMMUNITY="$VAULT/.obsidian/community-plugins.json"
   STAGE_DIR="$(mktemp -d)"
   curl -fsSL "https://api.github.com/repos/$REPO/releases/tags/$TAG" -o "$STAGE_DIR/release.json"
   jq -e --arg tag "$TAG" '.tag_name == $tag' "$STAGE_DIR/release.json" >/dev/null
   for ASSET in main.js manifest.json; do
     URL="$(jq -r --arg name "$ASSET" '.assets[] | select(.name == $name) | .browser_download_url' "$STAGE_DIR/release.json")"
     test -n "$URL"
     curl -fsSL "$URL" -o "$STAGE_DIR/$ASSET"
   done
   STYLES_URL="$(jq -r '.assets[] | select(.name == "styles.css") | .browser_download_url' "$STAGE_DIR/release.json")"
   if [ -n "$STYLES_URL" ]; then curl -fsSL "$STYLES_URL" -o "$STAGE_DIR/styles.css"; fi
   jq empty "$STAGE_DIR/manifest.json"
   PLUGIN_ID="$(jq -r '.id // empty' "$STAGE_DIR/manifest.json")"
   jq -e '.id and .version' "$STAGE_DIR/manifest.json" >/dev/null
   mkdir -p "$VAULT/.obsidian/plugins/$PLUGIN_ID"
   cp "$STAGE_DIR/main.js" "$VAULT/.obsidian/plugins/$PLUGIN_ID/main.js"
   cp "$STAGE_DIR/manifest.json" "$VAULT/.obsidian/plugins/$PLUGIN_ID/manifest.json"
   if [ -f "$STAGE_DIR/styles.css" ]; then cp "$STAGE_DIR/styles.css" "$VAULT/.obsidian/plugins/$PLUGIN_ID/styles.css"; fi
   ~~~

2. Register: back up BRAT data.json, then upsert REPO in pluginList and {repo: REPO, version: TAG} in pluginSubListFrozenVersion; write through a temporary file, run jq empty, and preserve all unrelated settings and policy records.

   ~~~sh
   cp "$BRAT_DATA" "$BRAT_DATA.bak"
   TMP_DATA="$(mktemp)"
   jq --arg repo "$REPO" --arg tag "$TAG" '
     .pluginList = ((.pluginList // []) + [$repo] | unique)
     | .pluginSubListFrozenVersion = (
         (.pluginSubListFrozenVersion // [])
         | if any(.[]; .repo == $repo)
           then map(if .repo == $repo then .version = $tag else . end)
           else . + [{"repo": $repo, "version": $tag}]
           end
       )
   ' "$BRAT_DATA" > "$TMP_DATA"
   mv "$TMP_DATA" "$BRAT_DATA"
   jq empty "$BRAT_DATA"
   ~~~

3. Activate: back up community-plugins.json, add PLUGIN_ID to its JSON array if absent, write through a temporary file, and run jq empty.

   ~~~sh
   cp "$COMMUNITY" "$COMMUNITY.bak"
   TMP_COMMUNITY="$(mktemp)"
   jq --arg id "$PLUGIN_ID" 'if any(.[]; . == $id) then . else . + [$id] end' "$COMMUNITY" > "$TMP_COMMUNITY"
   mv "$TMP_COMMUNITY" "$COMMUNITY"
   jq empty "$COMMUNITY"
   ~~~

4. Verify: confirm the exact repo/tag and manifest ID with jq, confirm the staged files are non-empty, and reload Obsidian only after all three stages pass. Record a local obsidian --help/reload boundary as SKIP if no app is available; it does not invalidate the file-layer result.

### Expected

The staged folder contains the exact release assets, BRAT's two policy collections contain the requested repository and tag, community-plugins.json contains the manifest ID, JSON parses cleanly, and a reload shows the plugin when the app prerequisite is available.

### Evidence

Capture the release response and selected asset names, manifest identity/version, pre-write backups, final JSON diffs, jq checks, staged file paths, and post-reload app state or the exact app prerequisite blocker.

### Pass / Fail

- Pass: stage, register, and activate each verify independently, with no credential values written to vault files.
- Fail: release assets are missing or mismatched, the manifest folder is wrong, policy/activation JSON is malformed or incomplete, or the plugin cannot be reconciled after the recorded compatibility checks.

### Failure Triage

1. Restore data.json and community-plugins.json from the captured backups and remove only the new plugin folder.
2. Re-fetch or re-check the exact tag and asset URLs; do not silently substitute latest for a frozen tag.
3. Compare the files with the BRAT troubleshooting reference, then repeat the three stages with a fresh release fixture.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-013 | BRAT headless beta-plugin install | Stage, register, activate, and verify a tagged beta plugin | Install a tagged beta plugin headlessly through BRAT by staging its release assets, registering the repository, activating the manifest ID, and reporting every verified stage. | 1. Fetch and stage exact assets. 2. Upsert BRAT registration/policy. 3. Add manifest ID to community plugins. 4. Reparse and verify. | Assets, manifest, repo/tag policy, activation ID, and JSON all valid | Release transcript, backups/diffs, jq checks, staged paths, reload evidence | PASS if all three stages verify; FAIL on any missing/mismatched stage | Restore backups, recheck release/manifest/path, repeat without secrets |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/obsidian42-brat/obsidian42-brat.md](../../references/plugins/obsidian42-brat/obsidian42-brat.md) | Plugin identity and deep-reference index |
| [../../references/plugins/obsidian42-brat/data-model.md](../../references/plugins/obsidian42-brat/data-model.md) | BRAT settings, policy records, release pins, and SecretStorage boundary |
| [../../references/plugins/obsidian42-brat/workflows.md](../../references/plugins/obsidian42-brat/workflows.md) | Stage, register, activate, update, and rollback workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../assets/brat-data-entry.example.json](../../assets/brat-data-entry.example.json) | Populated BRAT policy fixture without credentials |
| [../../references/plugins/obsidian42-brat/troubleshooting.md](../../references/plugins/obsidian42-brat/troubleshooting.md) | Release, asset, compatibility, token, and path diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 5. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-013
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/brat-headless-install.md
