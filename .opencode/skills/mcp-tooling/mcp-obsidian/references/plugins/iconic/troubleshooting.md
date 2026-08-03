---
title: "Iconic File-Layer Troubleshooting"
description: "Cause, detection, and recovery for Iconic data.json failures: invalid JSON, lost rules, missing icons, stale reads, and version drift."
trigger_phrases:
  - "iconic icons not showing"
  - "iconic data.json corrupt"
  - "iconic lost rules"
  - "iconic wrong color"
  - "iconic version drift"
importance_tier: "normal"
contextType: "general"
version: 1.3.0.0
---

# Iconic File-Layer Troubleshooting

Diagnose the JSON, the rule, and the app separately. A valid `data.json` can still fail to render when the rule's icon name is wrong, the rule is disabled, or the app hasn't reloaded.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
|---|---|
| No icons at all | `showAllFileIcons`/`showAllFolderIcons` off, plugin disabled, or app not reloaded |
| One file/folder has no icon | No rule matches (extension/name not covered) or its rule is `enabled: false` |
| Icon renders but wrong color | Rule color edited elsewhere, or a per-item override (`fileIcons`) shadows the rule |
| Plugin won't load | `data.json` invalid JSON (bad merge) |
| Rules missing after an edit | A replace-style write overwrote the user's rulebook |
| Unknown keys after update | Plugin version newer than 1.1.10 added settings |

## 2. DIAGNOSIS SEQUENCE

1. Parse `data.json` — is it valid JSON?
2. Check enablement: `iconic` present in `.obsidian/community-plugins.json`.
3. Check the toggle set: `showAllFileIcons` / `showAllFolderIcons`.
4. Check the specific rule: exists, `enabled`, `conditions.value` matches the target, `icon` is a known `lucide-*` name.
5. Check for per-item overrides (`fileIcons`/`folderIcons`-adjacent maps) shadowing the rule.

## 3. RECOVERY

| Problem | Fix |
|---|---|
| Invalid JSON | Restore the newest `.bak` copy; re-apply the intended merge |
| Lost rules | Restore the backup taken before the write (documented in workflows) |
| Icon name wrong | Replace with a `lucide-*` name already used elsewhere in the rulebook |
| Rule shadowed by override | Remove/update the per-item override entry |
| Stale read | Re-read `data.json` before concluding — the user may have changed icons in-app |
| App not reloaded | Ask the user to fully quit (Cmd+Q) and reopen Obsidian |

## 4. LIMITS

- The AI cannot verify rendered pixels; file-layer checks end at valid JSON + correct rules.
- `dialogState` and other UI-state keys must never be fabricated — preserve them as read.
