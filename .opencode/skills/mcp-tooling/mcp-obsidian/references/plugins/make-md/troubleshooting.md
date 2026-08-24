---
title: "Make.md Plugin File-Layer Troubleshooting"
description: "Cause, detection and recovery for Make.md plugin failures: mobile performance, stale .makemd cache, iCloud sync churn and conflict copies, columns not showing (Add existing), vault-wide UI takeover, and clean disable/uninstall."
trigger_phrases:
  - "make.md mobile slow"
  - "make.md stale cache"
  - "make.md icloud sync conflict"
  - "make.md columns not showing"
  - "make.md add existing"
  - "make.md ui takeover"
  - "make.md uninstall"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Make.md Plugin File-Layer Troubleshooting

Diagnose the three layers separately: the note **frontmatter** (the AI-editable data), the per-folder **`.space/`** store (plugin-owned config), and the **runtime caches** (`.makemd/`, `Spaces.mdb`). A frontmatter value that is correct on disk can still look wrong on screen because a cache is stale or the column was never added. Most Make.md failures at this vault's scale are performance and cache issues, not data loss — the notes stay intact through all of them.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Space operations take 30s+ / interface jitters | Large vault plus a heavy `main.js` (~5.7 MB); a known scaling limit on big folders |
| Values correct in frontmatter but wrong/absent on screen | Stale `.makemd` cache, or the pane was not reloaded after the edit |
| A frontmatter key never appears as a column | The column was never added via **Add existing** — columns are hidden until added |
| Column shows for some notes, empty for others | Inconsistent frontmatter keys across the row notes |
| Duplicate `.space` / `.mdb` files with device names or " 2" suffixes | iCloud sync conflict copies from two devices touching the store |
| Space config lost or reverted after a sync | iCloud replaced `.space/` mid-write, or a conflict copy won |
| Link/relation property maps to the wrong type | Known link/relation coercion rough edges — validate against sample notes |
| The whole vault UI feels "taken over" by Make.md chrome | The plugin's Navigator/Spaces UI is global, not folder-scoped |
| Mobile behaves differently than desktop | Mobile viability is UNCONFIRMED until the §3 on-device checklist passes |
| A table view will not reproduce from a script | Configured views are not reproducible from scratch — clone a golden sample (`workflows.md` §5) |

---

## 2. DIAGNOSIS SEQUENCE

1. Read the row notes' frontmatter first — confirm the value is actually correct on disk before blaming the plugin.
2. Confirm the column exists: was it added via **Add existing**? (§6)
3. Reload the pane. Many "wrong value" reports are just an un-refreshed view.
4. If still wrong, suspect the cache: inspect `.makemd/` for staleness (§4).
5. If files are duplicated or reverting, suspect sync: inspect for iCloud conflict copies (§5).
6. On mobile, run the on-device checklist (§3) before trusting anything.
7. Never hand-edit `.space/` SQLite or the `.makemd/` caches to "fix" a render — reload, re-index, or reclone from a golden sample instead.

---

## 3. MOBILE PERFORMANCE (verify on-device)

The manifest is `isDesktopOnly: false`, so Make.md **runs** on iOS/iPadOS — but running is not the same as viable.

| Cause | Check | Fix / mitigation |
| --- | --- | --- |
| Heavy `main.js` (~5.7 MB) parsed on every launch | Note startup time on the device | Accept slower cold start, or keep Make.md off mobile if launch is intolerable |
| 30s+ Space operations on large folders | Open a large Space and time it on-device | Scope Spaces to smaller subfolders; do not put the whole vault under one Space |
| Cache warm-up on first open | Open each Space once and let it index before judging speed | Let the first open complete before benchmarking |
| iCloud-synced `.space/` still uploading | Confirm sync has settled before opening | Wait for sync to finish; do not edit the same Space on two devices at once (§5) |

**On-device acceptance checklist — mobile is UNCONFIRMED until all pass:**

- all rows appear in the Space;
- the Space opens without intolerable delay;
- sorting and filtering work;
- editing a number in-app updates the note's YAML;
- closing Obsidian and changing a file externally does not leave a stale result after reopen;
- iCloud sync preserves `.space/`, `.makemd/` and `Spaces.mdb` intact across devices.

Until this checklist passes on the actual iPhone/iPad, treat mobile as an A/B candidate only — never promise mobile parity from the desktop behavior or the manifest flag alone.

---

## 4. STALE `.makemd` CACHE

The `.makemd/` files (`superstate.mdc`, `fileCache.mdc`) are runtime indexes. When they lag behind the notes, the UI shows old values even though the frontmatter is already correct.

| Cause | Check | Fix |
| --- | --- | --- |
| Cache not refreshed after an external file edit | Compare the note's on-disk frontmatter against what the Context shows | Reload the pane; if it persists, restart Obsidian to force a re-index |
| Cache written by an older plugin version | Note the version that last wrote the cache | Let the current version rebuild it — do not hand-edit `.mdc` files |
| Cache missing entirely | Confirm `.makemd/` exists | A missing cache is safe: enumeration is independent of it and it rebuilds on startup (`data-model.md` §6) |

Recovery of last resort: with Obsidian closed, back up and remove `.makemd/` and let the plugin regenerate it on next launch. This is safe because the caches are derived, never a source of truth — the notes and `.space/` config are unaffected. Never hand-author a `.mdc` record; its serialization/version contract is UNKNOWN.

---

## 5. ICLOUD SYNC CHURN AND CONFLICT COPIES

iCloud (and similar file syncs) can race the plugin while it writes SQLite `.mdb` files, producing conflict copies or partially-synced stores.

| Cause | Check | Fix |
| --- | --- | --- |
| Two devices editing the same Space | Look for duplicate `.space` files or `.mdb` files with a device suffix or " 2" | Edit one device at a time; delete the losing conflict copy after confirming the surviving one is correct |
| iCloud replaced `.space/` mid-write | Compare `def.json` / `.mdb` timestamps against the last known-good backup | Restore the intended `.space/` from backup while sync is idle, then let it settle |
| Space config "reverted" after sync | Confirm whether a conflict copy overwrote the store | Keep a `.bak` of `.space/` before edits; re-apply the intended config from the backup |
| Cache and `.space/` out of sync across devices | Check `.makemd/` and `Spaces.mdb` freshness per device | Let sync settle fully before opening; clear the stale cache per §4 if needed |

Prevention beats recovery: back up `.space/` before edits, never edit the same Space on two devices simultaneously, and let sync go quiet before opening a Space after a cross-device change.

---

## 6. COLUMNS NOT SHOWING (Add existing)

The single most common "missing data" report is not missing data at all — the column was never added.

| Cause | Check | Fix |
| --- | --- | --- |
| Frontmatter key present but no column | Confirm the key exists in the note's YAML, then check the Context's column list | Use **Add existing** in the Context UI to surface that key as a column (`data-model.md` §5) |
| Column empty for some rows only | Compare the key spelling across the row notes | Rename the inconsistent keys at the file layer so every row uses the same key |
| Wrong type inferred (e.g. link shows as text) | Check the assigned column type against the value shape | Reassign the type in the UI; validate link/relation coercion against sample notes, which has known rough edges |
| Column order wrong | Note the saved order in the view | Drag columns into order in the UI (persisted as the `cols` order in `views.mdb`) or reclone a golden sample |

Make.md does **not** auto-show every frontmatter key. If a value is on disk but absent from the table, add the column before assuming the plugin dropped data.

---

## 7. VAULT-WIDE UI TAKEOVER

Make.md's Navigator/Spaces interface is a **global** UI layer, not a per-folder widget — enabling it changes how the whole vault's file tree looks and behaves.

| Cause | Check | Fix |
| --- | --- | --- |
| Spaces Navigator replaced the familiar file explorer | Confirm the change is the plugin's global UI, not a lost sidebar | Adjust Make.md's appearance/Spaces settings, or disable the parts you do not want; it is a preference, not a fault |
| Unexpected chrome (stickers, colors, flow blocks) in notes | Check whether Make.md Basics/Flow features are enabled | Turn off the specific Basics features in settings; the notes' markdown is unchanged underneath |
| Team/shared vault members surprised by the new UI | Confirm everyone expects the Spaces interface | Decide as a team before enabling — the takeover is vault-wide, so it is not an isolated A/B change on the UI level |

If the goal was an **isolated** A/B test of one folder's database, be explicit that the plugin's UI changes are global even though the data change is scoped — the two are not the same blast radius.

---

## 8. DISABLING AND UNINSTALLING

Because notes stay as Markdown, disabling Make.md is low-risk for data — but the config layer needs a decision.

| Goal | Steps | Result |
| --- | --- | --- |
| Temporarily disable | Toggle the plugin off under Community plugins | The Spaces UI disappears; notes and their frontmatter are untouched; `.space/` and `.makemd/` remain on disk |
| Fully uninstall | Disable, then remove the plugin under Community plugins | The `.obsidian/plugins/make-md/` folder is removed; the notes survive intact |
| Remove residual config | With Obsidian closed, back up and delete the per-folder `.space/` stores, the vault `.makemd/` cache, and `.obsidian/plugins/make-md/Spaces.mdb` | Only the view/config layer is removed; every note and its frontmatter remains |

Sequence matters: back up first, disable before deleting, and confirm the notes render normally without the plugin before removing any `.space/` store. The removal is reversible for data (the markdown is the source of truth) but **not** for the configured views — losing a `.space/` store means rebuilding or recloning it (`workflows.md` §5).

---

## 9. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `frontmatter_correct_on_disk` | The note's YAML holds the intended value before any UI blame |
| `column_added_via_add_existing` | The frontmatter key was surfaced as a column, not silently dropped |
| `pane_reloaded` | The view was refreshed after the file change |
| `cache_not_stale` | `.makemd/` reflects the current notes, or was rebuilt |
| `no_sync_conflict_copies` | No duplicate `.space`/`.mdb` conflict copies remain from cross-device sync |
| `space_backed_up` | A `.bak` of `.space/` exists before any config-shape edit |
| `mobile_verified_on_device` | The §3 on-device checklist passed before mobile reliance |
| `notes_survive_disable` | Notes and frontmatter render correctly with the plugin disabled |

---

## 10. LIMITS

- The AI verifies frontmatter and clones golden-sample `.space/` files. The plugin renders in-app, so visual confirmation of a table/board/calendar/chart needs the user — on mobile, only after the §3 checklist.
- The `.space/` layout, the 13 field-type strings and the `m_schema`/`m_fields` tables are source-cited (`data-model.md`); the table-view predicate JSON, the footer-summary encoding, the default context schema id and the cache serialization are UNKNOWN — never present them as confirmed.
- A configured table view is not reproducible from scratch; a golden sample is required (`data-model.md` §7, `workflows.md` §5).
- Mobile is permitted by the manifest but UNCONFIRMED for this vault until the on-device checklist passes — never claim mobile parity from the desktop result alone.
- Never hand-author the `.makemd/` caches or the `.space/` SQLite to fix a render; reload, re-index, or reclone instead.
- Never fabricate a value a Context shows. If the frontmatter on disk does not support it, report the gap.
