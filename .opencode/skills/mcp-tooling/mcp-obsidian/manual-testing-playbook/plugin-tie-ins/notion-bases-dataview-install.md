---
title: "OBS-023 -- Notion Bases + Dataview real-vault headless install"
description: "This scenario validates a real-vault, file-layer install of Notion Bases via BRAT and a verify-already-present check for Dataview, with an explicit rollback and blast-radius flag for the personal, iCloud-synced target vault."
stage: routing
version: 0.1.0.0
---

# OBS-023 -- Notion Bases + Dataview real-vault headless install

## 1. OVERVIEW

This scenario validates a headless, file-layer install of the two plugins a Notion migration needs at minimum: **Notion Bases** (staged fresh via BRAT) and **Dataview** (verified already present, not reinstalled). It generalizes the `OBS-013` BRAT stage/register/activate/verify sequence from a throwaway vault and a single beta plugin to the operator's real, persistent vault and two plugins with different starting states.

### Why This Matters

The real target vault is not a disposable fixture: it is a personal, iCloud-synced Obsidian vault that stays open across multiple devices. A migration-parity capability that assumes both plugins need a fresh install would blindly overwrite a Dataview version the operator already relies on. This scenario keeps the two plugins on separate paths — Notion Bases stages new files through BRAT; Dataview is checked first and only staged if actually absent — and it names the rollback and the sync blast-radius before any write.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-023
- Feature Name: Notion Bases + Dataview real-vault headless install
- Scenario Objective: Stage a tagged Notion Bases release via BRAT, verify Dataview's presence without reinstalling it if already there, activate both plugin IDs, and report every verified stage against the operator's real vault.
- Exact Prompt: Install Notion Bases and Dataview into my real Obsidian vault headlessly — stage Notion Bases through BRAT from its tagged GitHub release, verify Dataview is already installed and skip staging it if so, activate both plugin IDs, and report every verified stage plus the rollback if anything needs to be undone.
- Exact Command Sequence: 1. Fetch the requested Notion Bases release tag, derive its manifest ID (never assume it), and stage `main.js`/`manifest.json`/optional `styles.css` under `.obsidian/plugins/<manifest.id>/`. 2. Register the repository and release policy in BRAT's `data.json`, initializing that file first if BRAT has never been configured in this vault. 3. Verify whether Dataview's plugin folder already exists; stage it only if absent. 4. Add both resolved plugin IDs to `.obsidian/community-plugins.json`. 5. Re-parse every touched JSON file and verify all four stages.
- Expected Signals: The requested Notion Bases release tag and the fetched API tag match; `main.js` and `manifest.json` are present and non-empty; the manifest has an `id` and `version`; BRAT's `data.json` contains the Notion Bases repository and exact release policy; `community-plugins.json` contains both resolved plugin IDs; Dataview's existing installation was detected and left untouched, or staged only if genuinely absent; every JSON file parses without exposing credentials.
- Evidence: Vault and repository identifiers, the release response and selected asset names, manifest fields, the Dataview presence check result, staged asset paths, JSON backups/diffs (or "created fresh, no prior backup" when BRAT's `data.json` did not exist), `jq` verification output, and an optional post-reload app-state record.
- Pass/Fail Criteria: PASS if the Notion Bases stage/register/activate sequence and the Dataview verify-or-stage step each verify independently, and the plugin appears after reload when an app check is available; FAIL if an asset/tag/manifest check, JSON parse, BRAT policy, activation entry, or compatibility boundary is wrong, or if Dataview is reinstalled without first checking whether it was already present.
- Failure Triage: 1. Restore the JSON backups (or delete a freshly created `data.json`/`community-plugins.json` that had no prior backup) and remove only the newly staged Notion Bases folder. 2. Recheck the exact release tag, asset names, manifest ID, and compatibility fields. 3. Compare each stage with the BRAT data model/workflow and the Dataview reference, and repeat in a throwaway vault before touching the real one again.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

The target vault is the operator's real, persistent vault — on macOS with iCloud sync this is typically the vault folder under `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/<vault-name>`, but the exact location is operator- and machine-specific.

Set `TARGET_VAULT` to that operator-owned vault path before running the commands below — the commands themselves stay parameterized on `$TARGET_VAULT` rather than hardcoding the path inline, so the same scenario also runs unmodified against a throwaway vault during a dry run. Close Obsidian before writing any of its JSON files, and confirm the exact Notion Bases release tag before fetching. Keep backups of BRAT's `data.json` and of `community-plugins.json` when they already exist; network access or a captured release fixture is required for staging. **Blast-radius flag**: this vault is iCloud-synced (`iCloud~md~obsidian`) and personal — a file-layer write can propagate to other synced devices before the operator reviews it, so every write below is backed up (or, when the file did not previously exist, recorded as newly created) and named in the rollback before it happens.

### Prompt

Install Notion Bases and Dataview into my real Obsidian vault headlessly — stage Notion Bases through BRAT from its tagged GitHub release, verify Dataview is already installed and skip staging it if so, activate both plugin IDs, and report every verified stage plus the rollback if anything needs to be undone.

### Commands

1. Stage Notion Bases: set `VAULT` to the target vault path, `REPO="bgarciamoura/obsidian-notion-bases-plugin"`, and `TAG` to the requested release tag; fetch the tagged release, require exact `main.js` and `manifest.json` assets plus optional `styles.css`, validate `manifest.id`, `manifest.version`, and `minAppVersion`, then copy the selected files to `"$VAULT/.obsidian/plugins/$NOTION_BASES_ID/"`. The release and asset selection follow [notion-bases/notion-bases.md](../../references/plugins/notion-bases/notion-bases.md) and the shared BRAT staging shape in [obsidian42-brat/workflows.md](../../references/plugins/obsidian42-brat/workflows.md).

   ~~~sh
   VAULT="$TARGET_VAULT"
   REPO="bgarciamoura/obsidian-notion-bases-plugin"
   TAG="$NOTION_BASES_TAG"
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
   NOTION_BASES_ID="$(jq -r '.id // empty' "$STAGE_DIR/manifest.json")"
   jq -e '.id and .version' "$STAGE_DIR/manifest.json" >/dev/null
   # Reject any id that is not a plain folder name -- a manifest-supplied `../` or `/`
   # would let a hostile release escape .obsidian/plugins/ and write anywhere in the vault.
   printf '%s' "$NOTION_BASES_ID" | grep -qE '^[A-Za-z0-9._-]+$' || { echo "unsafe plugin id: $NOTION_BASES_ID" >&2; exit 1; }
   mkdir -p "$VAULT/.obsidian/plugins/$NOTION_BASES_ID"
   cp "$STAGE_DIR/main.js" "$VAULT/.obsidian/plugins/$NOTION_BASES_ID/main.js"
   cp "$STAGE_DIR/manifest.json" "$VAULT/.obsidian/plugins/$NOTION_BASES_ID/manifest.json"
   if [ -f "$STAGE_DIR/styles.css" ]; then cp "$STAGE_DIR/styles.css" "$VAULT/.obsidian/plugins/$NOTION_BASES_ID/styles.css"; fi
   ~~~

2. Register with BRAT: BRAT may never have been configured in a given vault, so `data.json` can be absent even when the BRAT plugin itself is installed. Handle both states explicitly — back up an existing file, or initialize a fresh one and record that there is no backup to restore. Then upsert `REPO` in `pluginList` and `{repo: REPO, version: TAG}` in `pluginSubListFrozenVersion`; write through a temporary file, run `jq empty`, and preserve all unrelated settings and policy records.

   ~~~sh
   BRAT_DATA_HAD_BACKUP=0
   if [ -f "$BRAT_DATA" ]; then
     cp "$BRAT_DATA" "$BRAT_DATA.bak"
     BRAT_DATA_HAD_BACKUP=1
   else
     mkdir -p "$(dirname "$BRAT_DATA")"
     printf '{}' > "$BRAT_DATA"
   fi
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

3. Verify Dataview instead of assuming it needs installing: check whether `.obsidian/plugins/dataview/` already exists in this vault before staging anything. Only fetch and stage a fresh copy if it is genuinely absent, following the same stage discipline as step 1.

   ~~~sh
   DATAVIEW_ID="dataview"
   if [ -d "$VAULT/.obsidian/plugins/$DATAVIEW_ID" ]; then
     echo "Dataview already present at .obsidian/plugins/$DATAVIEW_ID -- skipping staging"
     DATAVIEW_ALREADY_PRESENT=1
   else
     echo "Dataview not found -- staging a fresh copy from blacksmithgu/obsidian-dataview"
     DATAVIEW_ALREADY_PRESENT=0
     # Repeat step 1's fetch/validate/copy sequence with REPO="blacksmithgu/obsidian-dataview"
     # and a confirmed release tag, deriving DATAVIEW_ID from the fetched manifest.json
     # exactly as NOTION_BASES_ID was derived above -- never assume it equals "dataview".
   fi
   ~~~

4. Activate: back up `community-plugins.json` if it exists (or record that it was created fresh), add both `NOTION_BASES_ID` and `DATAVIEW_ID` to its JSON array if absent, write through a temporary file, and run `jq empty`.

   ~~~sh
   COMMUNITY_HAD_BACKUP=0
   if [ -f "$COMMUNITY" ]; then
     cp "$COMMUNITY" "$COMMUNITY.bak"
     COMMUNITY_HAD_BACKUP=1
   else
     printf '[]' > "$COMMUNITY"
   fi
   TMP_COMMUNITY="$(mktemp)"
   jq --arg nb "$NOTION_BASES_ID" --arg dv "$DATAVIEW_ID" '
     (if any(.[]; . == $nb) then . else . + [$nb] end)
     | (if any(.[]; . == $dv) then . else . + [$dv] end)
   ' "$COMMUNITY" > "$TMP_COMMUNITY"
   mv "$TMP_COMMUNITY" "$COMMUNITY"
   jq empty "$COMMUNITY"
   ~~~

5. Verify: confirm the exact repo/tag and manifest ID for Notion Bases with `jq`, confirm the staged files are non-empty, confirm Dataview's presence check result matches the staging decision made in step 3, and reload Obsidian only after every stage passes. Record a local `obsidian help`/reload boundary as `SKIP` when the Obsidian desktop app is unavailable in this environment; it does not invalidate the file-layer result.

### Expected

The staged Notion Bases folder contains the exact release assets, BRAT's two policy collections contain the Notion Bases repository and tag, `community-plugins.json` contains both resolved plugin IDs, Dataview was either confirmed present and left untouched or staged only because it was genuinely absent, every JSON file parses cleanly, and a reload shows both plugins when the app prerequisite is available.

### Evidence

Capture the release response and selected asset names, manifest identity/version, the Dataview presence-check output, pre-write backups (or the "created fresh" note when no backup existed), final JSON diffs, `jq` checks, staged file paths, and post-reload app state or the exact app prerequisite blocker.

### Pass / Fail

- Pass: the Notion Bases stage/register/activate sequence and the Dataview verify-or-stage step each verify independently, with no credential values written to vault files.
- Fail: release assets are missing or mismatched, the manifest folder is wrong, policy/activation JSON is malformed or incomplete, Dataview is reinstalled without first checking for an existing install, or the plugin cannot be reconciled after the recorded compatibility checks.

### Failure Triage

1. Restore the two backup files where one existed, or delete a freshly created `data.json`/`community-plugins.json` that had no prior backup; remove only the newly staged Notion Bases folder (`rm -rf "$VAULT/.obsidian/plugins/$NOTION_BASES_ID"`); never remove Dataview's folder unless this scenario is the one that staged it.
2. Re-fetch or re-check the exact tag and asset URLs; do not silently substitute latest for a frozen tag.
3. Compare the files with the BRAT troubleshooting reference and the Dataview reference, then repeat the sequence in a throwaway vault without writing token values.

### Rollback

- **Notion Bases (always safe to remove after this scenario)**: `rm -rf "$VAULT/.obsidian/plugins/$NOTION_BASES_ID"`.
- **BRAT `data.json`**: if `BRAT_DATA_HAD_BACKUP=1`, restore it with `cp "$BRAT_DATA.bak" "$BRAT_DATA"`; if `BRAT_DATA_HAD_BACKUP=0`, the file did not exist before this scenario ran, so remove it with `rm -f "$BRAT_DATA"` instead of restoring a backup that was never taken.
- **`community-plugins.json`**: if `COMMUNITY_HAD_BACKUP=1`, restore it with `cp "$COMMUNITY.bak" "$COMMUNITY"`; if `COMMUNITY_HAD_BACKUP=0`, remove it with `rm -f "$COMMUNITY"` instead.
- **Dataview**: only remove `.obsidian/plugins/dataview/` if `DATAVIEW_ALREADY_PRESENT=0` (this scenario staged it). If Dataview was already present before this scenario ran, never delete it as part of this rollback.
- Reopen Obsidian only after the rollback's own `jq empty` check passes on every restored or removed JSON file.

### Blast-Radius Flag

The target vault syncs through iCloud (`iCloud~md~obsidian`) across multiple devices and holds the operator's personal notes. Close Obsidian before any file-layer write in this scenario. A written or reverted change can propagate to other synced devices before the operator reviews it on this machine, so every write above is preceded by a backup step (or an explicit "created fresh" record) and every write has a matching, named rollback step before this scenario begins.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-023 | Notion Bases + Dataview real-vault headless install | Stage Notion Bases via BRAT, verify-or-stage Dataview, activate both, and verify | Install Notion Bases and Dataview into my real Obsidian vault headlessly, verifying Dataview first, and report every verified stage plus the rollback. | 1. Fetch and stage Notion Bases assets. 2. Upsert BRAT registration/policy (init `data.json` if absent). 3. Verify-or-stage Dataview. 4. Add both IDs to community plugins. 5. Reparse and verify. | Assets, manifest, repo/tag policy, Dataview presence decision, activation IDs, and JSON all valid | Release transcript, presence-check output, backups/diffs or fresh-create notes, `jq` checks, staged paths, reload evidence | PASS if both stages verify independently; FAIL on any missing/mismatched stage or an unchecked Dataview reinstall | Restore or remove backups per file, recheck release/manifest/path, repeat without secrets |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [brat-headless-install.md](brat-headless-install.md) | `OBS-013` -- the single-plugin, throwaway-vault stage/register/activate/verify shape this scenario generalizes |
| [../../references/plugins/notion-bases/notion-bases.md](../../references/plugins/notion-bases/notion-bases.md) | Notion Bases plugin identity and the on-disk manifest-ID verification note |
| [../../references/plugins/obsidian42-brat/data-model.md](../../references/plugins/obsidian42-brat/data-model.md) | BRAT settings, policy records, release pins, and the "read/merge, don't replace" `data.json` contract |
| [../../references/plugins/obsidian42-brat/workflows.md](../../references/plugins/obsidian42-brat/workflows.md) | Stage, register, activate, update, and rollback workflow |
| [../../references/plugins/dataview/dataview.md](../../references/plugins/dataview/dataview.md) | Dataview plugin identity, for confirming the presence check targets the right plugin |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../assets/brat-data-entry.example.json](../../assets/brat-data-entry.example.json) | Populated BRAT policy fixture without credentials |
| [../../references/plugins/obsidian42-brat/troubleshooting.md](../../references/plugins/obsidian42-brat/troubleshooting.md) | Release, asset, compatibility, token, and path diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |
| [../../scripts/verify-notion-migration-parity.sh](../../scripts/verify-notion-migration-parity.sh) | The 11-check parity script this install makes usable -- run only after a real migration has produced content to verify |

---

## 5. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-023
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/notion-bases-dataview-install.md
